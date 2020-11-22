/**
 *
 */
package com.cloudibpm.blo.om.category;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.category.Category;
import com.cloudibpm.core.folder.Folder;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.om.category.CategoryEno;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Dahai Cao created at 20:51 on 2018-11-02
 *
 */
@Service
//@Transactional
public class CategoryBlo extends BusinessLogicObject {
    private final CategoryEno categoryEso;

    @Autowired
    public CategoryBlo(CategoryEno categoryEso) {
        this.categoryEso = categoryEso;
    }


    /**
     * @author Dahai Cao created at 22:16 on 2018-11-02
     * @param id
     * @return
     * @throws Exception
     */
    public Category getCategory(String id) throws Exception {
        return categoryEso.queryByPk(id);
    }

    /**
     * @author Dahai Cao created at 16:17 on 2018-12-03
     * @param id
     * @return
     * @throws Exception
     */
    public Category fetchCategory(String id) throws Exception {
        if (id == null || id.trim().equals(""))
            return null;
        Category c = categoryEso.queryByPk(id);
//        if (c.getCategoryType() == 135) {
//            if (c.getMbUIContent() == null) {
//                // 本级没有界面，那就查找父组织是否有界面，如果没有，就查找顶级组织的界面。
//                Category pc = categoryEso.queryByPk(c.getParent());
//                if (pc != null) {
//                    if (pc.getMbUIContent() != null) {
//                        c.setMbUIContent(pc.getMbUIContent());
//                    }
//                } else {
//                    String s = c.getRootCategoryId();
//                    if (s != null) {
//                        Category cc = categoryEso.queryByPk(s);
//                        c.setMbUIContent(cc.getMbUIContent());
//                    }
//                }
//            }
//        } else if (c.getCategoryType() == 136) {
//            if (c.getMbUIContent() == null) {
//                Category parc = categoryEso.queryByPk(c.getRootCategoryId());
//                if (parc.getMbUIContent() == null) {
//                    Category pc = categoryEso.queryByPk(parc.getAssignCategoryId());
//                    if (pc != null) {
//                        if (pc.getMbUIContent() != null) {
//                            c.setMbUIContent(pc.getMbUIContent());
//                        }
//                    }
//                } else {
//                    c.setMbUIContent(parc.getMbUIContent());
//                }
//            }
//        } else if (c.getCategoryType() == 137) {
//            if (c.getMbUIContent() == null) {
//                Category parc = categoryEso.queryByPk(c.getRootCategoryId());
//                if (parc.getMbUIContent() == null) {
//                    Category pcc = categoryEso.queryByPk(parc.getAssignCategoryId());
//                    if (pcc != null) {
//                        if (pcc.getMbUIContent() == null) {
//                            Category pc1 = categoryEso.queryByPk(pcc.getParent());
//                            if (pc1 != null) {
//                                if (pc1.getMbUIContent() != null) {
//                                    c.setMbUIContent(pc1.getMbUIContent());
//                                } else {
//                                    String s = c.getRootCategoryId();
//                                    if (s != null) {
//                                        Category cc = categoryEso.queryByPk(s);
//                                        c.setMbUIContent(cc.getMbUIContent());
//                                    }
//                                }
//                            }
//                        } else {
//                            c.setMbUIContent(pcc.getMbUIContent());
//                        }
//                    }
//                } else {
//                    c.setMbUIContent(parc.getMbUIContent());
//                }
//            }
//        }
        return c;
    }

    /**
     * @author Dahai Cao created at 22:16 on 2018-11-02
     * @param orgId
     * @return
     * @throws Exception
     */
    public List<Category> getCategories(String orgId) throws Exception {

        return categoryEso.queryAllCategories(orgId);
    }

    /**
     *
     * @param catetype
     * @param orgId
     * @return
     * @throws Exception
     */
    public List<Category> getCategories(String catetype, String orgId) throws Exception {
        return categoryEso.queryAllCategoriesByType(catetype, orgId);
    }

    /**
     * @author Dahai Cao created at 22:16 on 2018-11-02
     * @param topparent
     * @param categories
     */
    public void assembleStructure(Folder topparent, List<Category> categories) {
        Map<String, WorkflowEntity> map = new HashMap<String, WorkflowEntity>();
        // 首先将所有的组织对象都装在一个哈希表中。
        for (Category category : categories) {
            if (category.getCategoryType() == topparent.getType()) {
                map.put(category.getId(), category);
            }
        }
        for (Category category : categories) {
            if (category.getCategoryType() == topparent.getType()) {
                if (!topparent.getId().equals(category.getParent())) {
                    TreeNode parent = (TreeNode) map.get(category.getParent());
                    parent.addChild(category);
                } else {
                    topparent.addChild(category);
                }
            }
        }
    }

    /**
     * @author Dahai Cao created at 22:16 on 2018-11-02
     * @param cate
     * @throws Exception
     */
    public void createCategory(Category cate) throws Exception {

        categoryEso.insert(cate);
    }

    /**
     * @author Dahai Cao created at 22:16 on 2018-11-02
     * @param cateId
     * @param newname
     * @param lastupdate
     * @throws Exception
     */
    public void modifyCategoryName(String cateId, String newname, long lastupdate) throws Exception {

        categoryEso.updateName(cateId, newname, lastupdate);
    }

    /**
     * @author Dahai Cao created at 15:38 on 2018-11-03
     * @param name
     * @param ownerid
     * @return
     * @throws Exception
     */
    public boolean existCategoryName(String name, String ownerid) throws Exception {

        return categoryEso.existCategoryName(name, ownerid);
    }

    /**
     * @author Dahai Cao created at 22:16 on 2018-11-02
     * @param categoryType
     * @param ownerId
     * @return
     * @throws Exception
     */
    public List<Category> getCategoriesByType(String categoryType, String ownerId) throws Exception {

        return categoryEso.queryAllCategoriesByType(categoryType, ownerId);
    }

    /**
     * @author Dahai Cao created at 22:16 on 2018-11-02
     * @param ids
     * @return
     * @throws Exception
     */
    public List<Category> getCategories(String[] ids) throws Exception {

        return categoryEso.queryAllCategoriesByIDs(ids);

    }

    /**
     * @author Dahai Cao created at 22:16 on 2018-11-02, lastupdate at 16:36 on 2018-01-01
     * @param categoryId
     * @param newparentId
     * @param root_categoryId
     * @param assign_categoryId
     * @throws Exception
     */
    public void modifyCategoryParent(String categoryId, String newparentId,
                                     String root_categoryId, String assign_categoryId) throws Exception {
        categoryEso.update(categoryId, newparentId, root_categoryId, assign_categoryId);

    }

    /**
     * @author Dahai Cao created at 22:16 on 2018-11-02
     * @param ids
     *            String []
     * @throws Exception
     */
    public void removeCategories(String[] ids) throws Exception {
        if (ids != null && ids.length > 0) {
            for (int i = 0; i < ids.length; i++) {
                categoryEso.delete(ids[i]);
            }
        }
    }

    /**
     *
     * @param cate
     * @throws Exception
     */
    public void modifyCategory(Category cate) throws Exception {
        categoryEso.update(cate);
    }

}
