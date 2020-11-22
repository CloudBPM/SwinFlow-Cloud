package com.cloudibpm.controller;

import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.blo.om.category.CategoryBlo;
import com.cloudibpm.blo.om.organization.CalenderBlo;
import com.cloudibpm.blo.om.organization.DepartmentBlo;
import com.cloudibpm.blo.om.organization.OrganizationBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.category.Category;
import com.cloudibpm.core.folder.Folder;
import com.cloudibpm.core.folder.FolderType;
import com.cloudibpm.core.folder.JSTreeNode;
import com.cloudibpm.core.officecalendar.OfficeCalendar;
import com.cloudibpm.core.officecalendar.OfficeDay;
import com.cloudibpm.core.officecalendar.OfficeHours;
import com.cloudibpm.core.organization.Department;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.ui.mobile.MobileUI;
import com.cloudibpm.core.ui.mobile.util.json.MbUiJSONParser;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/service30")
public class CategoryController {
    private final CategoryBlo categoryBlo;
    private final BuildtimeIDGenerator buildtimeIDGenerator;
    private DepartmentBlo departmentBlo;
    private OrganizationBlo organizationBlo;
    private final CalenderBlo calenderBlo;

    @Autowired
    public CategoryController(CategoryBlo categoryBlo,
                              BuildtimeIDGenerator buildtimeIDGenerator,
                              DepartmentBlo departmentBlo,
                              OrganizationBlo organizationBlo, CalenderBlo calenderBlo) {
        this.categoryBlo = categoryBlo;
        this.buildtimeIDGenerator = buildtimeIDGenerator;
        this.departmentBlo = departmentBlo;
        this.organizationBlo = organizationBlo;
        this.calenderBlo = calenderBlo;
    }

    @RequestMapping(value = "/api0", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public String existsCategoryName(String name, String owner) {
        try {
            if (categoryBlo.existCategoryName(name, owner))
                return "-15"; // the specified name is duplicated
            else
                return "6"; // the specified name is not duplicated
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "-15";
    }

    /**
     * Create organization object including
     * category object and office calendar object.
     *
     * @param categoryname
     * @param ownerid
     * @param parentid
     * @param type
     * @param currowner
     * @return
     */
    @RequestMapping(value = "/api1", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode createObject(String name,
                                   String ownerid,
                                   String parentid,
                                   String type,
                                   String currowner) {
        try {
            if (Integer.parseInt(type) == 101) {
                // create a office calendar object into repository
                OfficeCalendar calendar = new OfficeCalendar();
                calendar.setDefault(0);
                calendar.setName(name);
                calendar.setId(buildtimeIDGenerator.getNewBuildTimeID());
                calendar.setParent(parentid);
                calendar.setOwner(ownerid);
                calenderBlo.addCalender(calendar);
                //默认添加 7天工作日, 1-5为工作日,6-7为休息日
                for (int i = 1;i < 8; i++){
                    OfficeDay officeDay = new OfficeDay();
                    officeDay.setId(buildtimeIDGenerator.getNewBuildTimeID());
                    officeDay.setWeekkDay(i);
                    if(i >= 6){
                        officeDay.setIsWorkDay(0);
                    }else {
                        officeDay.setIsWorkDay(1);
                    }
                    officeDay.setParent(calendar.getId());
                    officeDay.setOwner(calendar.getOwner());
                    calenderBlo.setYIsWorkDay(officeDay);
                    if(i < 6){
                        //为每天添加两个工作时间段
                        OfficeHours officeHours = new OfficeHours();
                        officeHours.setId(buildtimeIDGenerator.getNewBuildTimeID());
                        officeHours.setFromTime("09:00");
                        officeHours.setToTime("12:00");
                        officeHours.setParent(officeDay.getId());
                        officeHours.setOwner(officeDay.getOwner());
                        calenderBlo.setYPeriod(officeHours);
                        officeHours.setId(buildtimeIDGenerator.getNewBuildTimeID());
                        officeHours.setFromTime("14:00");
                        officeHours.setToTime("17:30");
                        calenderBlo.setYPeriod(officeHours);
                    }
                }
                JSTreeNode node = new JSTreeNode();
                node.id = calendar.getId();
                node.text = name;
                node.parentId = parentid;
                node.data = "3|" + ownerid + "|" + type + "|" + currowner;
                return node; // failed
            } else {
                // create a category object into repository
                Category category = new Category();
                category.setId(buildtimeIDGenerator.getNewBuildTimeID());
                category.setName(name);
                category.setUsageStatus(1);
                category.setCategoryType(Integer.parseInt(type));
                category.setCreatedDateTime(System.currentTimeMillis());
                category.setLastupdate(System.currentTimeMillis());
                category.setParent(parentid);
                category.setCurrOwner(currowner);
                category.setOwner(ownerid);
                Category p = categoryBlo.getCategory(parentid);
                if (p == null) { // 这说明该分类就是顶级分类，因为parentid是folder id
                    category.setRootCategoryId(category.getId());
                } else { // 这说明该分类就是非顶级分类，parentid是顶级类的id
                    category.setRootCategoryId(p.getRootCategoryId());
                }
                categoryBlo.createCategory(category);
                JSTreeNode node = new JSTreeNode();
                node.id = category.getId();
                node.text = name;
                node.parentId = parentid;
                node.data = "3|" + ownerid + "|" + type + "|" + currowner;
                return node; // failed
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/api2", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String removeCategory(String ids) {
        try {
            if (ids != null) {
                JSONArray obj = new JSONArray(ids);
                if (obj.length() > 0) {
                    String[] fpids = new String[obj.length()];
                    for (int i = 0; i < fpids.length; i++) {
                        fpids[i] = obj.getString(i);
                    }
                    categoryBlo.removeCategories(fpids);
                }
            }
            return "{\"status\": \"1\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
    }

    @RequestMapping(value = "/api3", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public int updateCategoryName(String id, String entityname) {
        try {
            categoryBlo.modifyCategoryName(id, entityname, System.currentTimeMillis());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 1;
    }

    @RequestMapping(value = "/api4", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public JSTreeNode[] getCategoryStructure(String parentid, String categorytype, String ownerid) {
        try {
            List<Category> categories = categoryBlo.getCategoriesByType(categorytype, ownerid);
            Folder parent = new Folder();
            parent.setId(parentid);
            if (Integer.parseInt(categorytype) == FolderType.ORG_CATEGORY_FOLDER) {
                parent.setName("组织分类");
            } else if (Integer.parseInt(categorytype) == FolderType.DEPARTMENT_CATEGORY_FOLDER) {
                parent.setName("部门项目组分类");
            } else if (Integer.parseInt(categorytype) == FolderType.POSITION_CATEGORY_FOLDER) {
                parent.setName("职位组角色分类");
            } else if (Integer.parseInt(categorytype) == FolderType.RANK_CATEGORY_FOLDER) {
                parent.setName("级别设置");
            }
            parent.setType(Integer.parseInt(categorytype));
            parent.setOwner(ownerid);
            categoryBlo.assembleStructure(parent, categories);
            TreeNode[] categoryArry = new TreeNode[]{parent};
            JSTreeNode[] js = generateJSTreeNodes(categoryArry);
            return js;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private JSTreeNode[] generateJSTreeNodes(TreeNode[] roots) {
        if (roots.length > 0) {
            JSTreeNode[] jstnodes = new JSTreeNode[roots.length];
            for (int i = 0; i < roots.length; i++) {
                TreeNode node = roots[i];
                JSTreeNode jstnode = new JSTreeNode();
                jstnode.id = node.getId();
                jstnode.text = node.getName();
                jstnode.icon = "";
                // 1: Tree root; 2: Folder (Subtree); 3: Leaf node
                if (node instanceof Folder) {
                    jstnode.icon = "fa fa-cog";
                    jstnode.data = "2|" + node.getOwner() + "|" + ((Folder) node).getType();
                } else if (node instanceof Category) {
                    jstnode.icon = "fa fa-cog";
                    jstnode.data = "3|" + node.getOwner() + "|" + ((Category) node).getCategoryType() + "|"
                            + node.getCurrOwner();
                }
                if (node.getParent() != null) {
                    jstnode.parentId = node.getParent();
                }
                if (node.hasChildren()) {
                    jstnode.children = generateJSTreeNodes(node.getChildren());
                }
                jstnodes[i] = jstnode;
            }
            return jstnodes;
        }
        return null;
    }

    @RequestMapping(value = "/api5", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode[] copyCategoryTo(String rootid, String childrenids, String targetid, String categorytype,
                                       String currowner, String owner) {
        try {
            if (childrenids != null) {
                JSONArray obj = new JSONArray(childrenids);
                if (obj.length() > 0) {
                    String[] fpids = new String[obj.length() + 1];
                    for (int i = 0; i < fpids.length - 1; i++) {
                        fpids[i] = obj.getString(i);
                    }
                    fpids[fpids.length - 1] = rootid;
                    List<Category> categories = categoryBlo.getCategories(fpids);
                    Category p = categoryBlo.getCategory(targetid);
                    for (Category category : categories) {
                        String newId = buildtimeIDGenerator.getNewBuildTimeID();
                        String id = category.getId();
                        if (id.equals(rootid)) {
                            category.setParent(targetid);
                            category.setCreatedDateTime(System.currentTimeMillis());
                            category.setLastupdate(System.currentTimeMillis());
                        }
                        for (Category cate : categories) {
                            if (cate.getParent().equals(id)) {
                                cate.setParent(newId);
                                cate.setCreatedDateTime(System.currentTimeMillis());
                                cate.setLastupdate(System.currentTimeMillis());
                            }
                        }
                        if (p != null) {
                            category.setRootCategoryId(p.getRootCategoryId());
                            category.setAssignCategoryId(p.getAssignCategoryId());
                            category.setId(newId);
                        }
                    }
                    for (Category category : categories) {
                        categoryBlo.createCategory(category);
                    }
                    JSTreeNode[] jstnodes = new JSTreeNode[categories.size()];
                    for (int i = 0; i < categories.size(); i++) {
                        Category node = categories.get(i);
                        JSTreeNode jstnode = new JSTreeNode();
                        jstnode.id = node.getId();
                        jstnode.text = node.getName();
                        jstnode.icon = "fa fa-cog";
                        jstnode.data = "3|" + node.getOwner() + "|" + node.getCategoryType() + "|"
                                + node.getCurrOwner();
                        if (node.getParent() != null) {
                            jstnode.parentId = node.getParent();
                        }
                        jstnodes[i] = jstnode;
                    }
                    return jstnodes;
                }
            }
            return null; // success
        } catch (Exception e) {
            e.printStackTrace();
            return null; // failed
        }
    }

    @RequestMapping(value = "/api6", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode moveCategoryTo(String sourceid, String targetid) {
        try {
            Category p = categoryBlo.getCategory(targetid);
            if (p != null) {
                categoryBlo.modifyCategoryParent(sourceid, targetid, p.getRootCategoryId(), p.getAssignCategoryId());
                Category category = categoryBlo.getCategory(sourceid);
                if (category != null) {
                    JSTreeNode jstnode = new JSTreeNode();
                    jstnode.id = category.getId();
                    jstnode.text = category.getName();
                    jstnode.icon = "fa fa-cog";
                    jstnode.data = "3|" + category.getOwner() + "|" + category.getCategoryType() + "|"
                            + category.getCurrOwner();
                    if (category.getParent() != null) {
                        jstnode.parentId = category.getParent();
                    }
                    return jstnode;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api7", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public Category getCategorybyId(String id) {
        try {
            Category category = categoryBlo.fetchCategory(id);
//			if (category.getMbUIContent() != null) {
//				MobileUI mobileUI = MbUiJSONParser.parseMbUI(category.getMbUIContent());
//			}
            return category;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api8", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public int saveCategory(String category) {
        try {
            Category cate = new Category();
            JSONObject obj = new JSONObject(category);
            if (!obj.isNull("id")) {
                cate.setId(obj.getString("id"));
            }
            if (!obj.isNull("name")) {
                cate.setName(obj.getString("name"));
            }
            if (!obj.isNull("description")) {
                cate.setDescription(obj.getString("description"));
            }
            if (!obj.isNull("usageStatus")) {
                cate.setUsageStatus(obj.getInt("usageStatus"));
            }
            if (!obj.isNull("categoryType")) {
                cate.setCategoryType(obj.getInt("categoryType"));
            }
            if (!obj.isNull("createdDateTime")) {
                cate.setCreatedDateTime(obj.getLong("createdDateTime"));
            }
            if (!obj.isNull("lastupdate")) {
                cate.setLastupdate(obj.getLong("lastupdate"));
            }
            if (!obj.isNull("parent")) {
                cate.setParent(obj.getString("parent"));
            }
            if (!obj.isNull("currOwner")) {
                cate.setCurrOwner(obj.getString("currOwner"));
            }
            if (!obj.isNull("owner")) {
                cate.setOwner(obj.getString("owner"));
            }
            if (!obj.isNull("mbUIContent")) {
                JSONObject ob = obj.getJSONObject("mbUIContent");
                cate.setMbUIContent(MbUiJSONParser.parseMbUI(ob));
            }
            if (!obj.isNull("tbUIContent")) {
                JSONObject ob = obj.getJSONObject("tbUIContent");
                cate.setTbUIContent(ob.toString());
            }
            if (!obj.isNull("pcUIContent")) {
                //JSONObject ob = obj.getJSONObject("pcUIContent");
                cate.setPcUIContent(obj.getString("pcUIContent"));
            }
            if (!obj.isNull("rootCategoryId")) {
                cate.setRootCategoryId(obj.getString("rootCategoryId"));
            }
            if (!obj.isNull("assignCategoryId")) {
                cate.setAssignCategoryId(obj.getString("assignCategoryId"));
            }
            categoryBlo.modifyCategory(cate);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 1;
    }


    @RequestMapping(value = "/api9", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public Category[] getOrganizationCategories(String catetype, String owner) {
        try {
            List<Category> categories = categoryBlo.getCategoriesByType(catetype, owner);
            return categories.toArray(new Category[categories.size()]);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api10", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public MobileUI getCategoryMbUIbyId(String id) {
        try {
            Category category = categoryBlo.fetchCategory(id);
            if (category != null)
                return category.getMbUIContent();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api11", method = RequestMethod.GET,
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public String[] getDesktopUIs(String posids, String poscateids,
                                  String dptids, String orgids) throws Exception {
        List<String> uis = new ArrayList<>();
        if (poscateids != null && !poscateids.equals("")) {
            if (poscateids.indexOf("#") > 0) {
                String[] catesId = poscateids.split("#");
                for (int i = 0; i < catesId.length; i++) {
                    if (catesId[i] != null && !catesId[i].equals("") && !catesId[i].equals("null")) {
                        Category category = categoryBlo.getCategory(catesId[i]);
                        if (category != null && category.getPcUIContent() != null)
                            uis.add(category.getPcUIContent().toString());
                    }
                }
            } else {
                if (poscateids != null && !poscateids.equals("") && !poscateids.equals("null")) {
                    Category category = categoryBlo.getCategory(poscateids);
                    if (category != null && category.getPcUIContent() != null)
                        uis.add(category.getPcUIContent().toString());
                }
            }
        }
        if (dptids != null) {
            if (dptids.indexOf("#") > 0) {
                String[] departsId = dptids.split("#");
                for (int i = 0; i < departsId.length; i++) {
                    if (departsId[i] != null && !departsId[i].equals("") && !departsId[i].equals("null")) {
                        Department department = departmentBlo.getDepartmentByID(departsId[i]);
                        if (department.getCategoryId() != null && !department.getCategoryId().equals("")) {
                            Category category = categoryBlo.getCategory(department.getCategoryId());
                            if (category != null && category.getPcUIContent() != null)
                                uis.add(category.getPcUIContent().toString());
                        }
                    }
                }
            } else {
                if (dptids != null && !dptids.equals("") && !dptids.equals("null")) {
                    Department department = departmentBlo.getDepartmentByID(dptids);
                    if (department.getCategoryId() != null && !department.getCategoryId().equals("")) {
                        Category category = categoryBlo.getCategory(department.getCategoryId());
                        if (category != null && category.getPcUIContent() != null)
                            uis.add(category.getPcUIContent().toString());
                    }
                }
            }
        }
        if (orgids != null) {
            if (orgids.indexOf("#") > 0) {
                String[] orgsId = orgids.split("#");
                for (int i = 0; i < orgsId.length; i++) {
                    if (orgsId[i] != null && !orgsId[i].equals("") && !orgsId[i].equals("null")) {
                        Organization org = organizationBlo.getOrganizationById(orgsId[i]);
                        if (org.getCategoryId() != null && !org.getCategoryId().equals("")) {
                            Category category = categoryBlo.getCategory(org.getCategoryId());
                            if (category != null && category.getPcUIContent() != null)
                                uis.add(category.getPcUIContent().toString());
                        }
                    }
                }
            } else {
                if (orgids != null && !orgids.equals("") && !orgids.equals("null")) {
                    Organization org = organizationBlo.getOrganizationById(orgids);
                    if (org.getCategoryId() != null && !org.getCategoryId().equals("")) {
                        Category category = categoryBlo.getCategory(org.getCategoryId());
                        if (category != null && category.getPcUIContent() != null)
                            uis.add(category.getPcUIContent().toString());
                    }
                }
            }
        }
        return uis.toArray(new String[uis.size()]);
    }

}
