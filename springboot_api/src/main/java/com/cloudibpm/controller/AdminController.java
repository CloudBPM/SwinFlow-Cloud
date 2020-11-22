package com.cloudibpm.controller;

import com.cloudibpm.blo.admin.AdminBlo;
import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.blo.buildtime.wfprocess.BuildtimeWfProcessBlo;
import com.cloudibpm.blo.buildtime.wfprocess.ReleasedWfProcessBlo;
import com.cloudibpm.blo.news.OrgNewsBlo;
import com.cloudibpm.blo.om.organization.OrganizationBlo;
import com.cloudibpm.blo.om.organization.RegistrateOrganizationBlo;
import com.cloudibpm.blo.release.log.ApproveForReleaseBlo;
import com.cloudibpm.core.PageObject;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.admin.news.Comment;
import com.cloudibpm.core.admin.news.News;
import com.cloudibpm.core.admin.news.NewsListPage;
import com.cloudibpm.core.admin.news.SecondaryComment;
import com.cloudibpm.core.buildtime.release.wfprocess.ReleasedWfProcess;
import com.cloudibpm.core.buildtime.wfprocess.WfProcessListPage;
import com.cloudibpm.core.folder.Folder;
import com.cloudibpm.core.folder.JSTreeNode;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.organization.OrgnizationListPage;
import com.cloudibpm.core.runtime.admin.AdminSearchResult;
import com.cloudibpm.core.runtime.admin.AdminSearchResultPage;
import com.cloudibpm.core.util.SystemConfig;
import com.cloudibpm.core.util.file.FileUtil;
import com.model.course.Audio;
import com.model.course.Book;
import com.model.course.Live;
import com.model.course.Video;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/service13")
public class AdminController {
    private final BuildtimeWfProcessBlo buildtimeWfProcessBlo;
    private final OrganizationBlo organizationBlo;
    private final ReleasedWfProcessBlo releasedWfProcessBlo;
    private final ApproveForReleaseBlo approveForReleaseBlo;
    private final OrgNewsBlo orgNewsBlo;
    private final BuildtimeIDGenerator buildtimeIDGenerator;
    private final RegistrateOrganizationBlo registrateOrganizationBlo;
    private final AdminBlo adminBlo;

    private static final String storagetype = SystemConfig.getProp("filestorage.type");
    @Autowired
    public AdminController(BuildtimeWfProcessBlo buildtimeWfProcessBlo,
                           OrganizationBlo organizationBlo,
                           ReleasedWfProcessBlo releasedWfProcessBlo,
                           ApproveForReleaseBlo approveForReleaseBlo,
                           OrgNewsBlo orgNewsBlo,
                           BuildtimeIDGenerator buildtimeIDGenerator,
                           RegistrateOrganizationBlo registrateOrganizationBlo, AdminBlo adminBlo) {
        this.buildtimeWfProcessBlo = buildtimeWfProcessBlo;
        this.organizationBlo = organizationBlo;
        this.releasedWfProcessBlo = releasedWfProcessBlo;
        this.approveForReleaseBlo = approveForReleaseBlo;
        this.orgNewsBlo = orgNewsBlo;
        this.buildtimeIDGenerator = buildtimeIDGenerator;
        this.registrateOrganizationBlo = registrateOrganizationBlo;
        this.adminBlo = adminBlo;
    }

    @RequestMapping(value = "/api0", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode[] getProcessFolders(String ids) {
        List<Organization> orgs = null;
        try {
            if (ids.equals("00000000000001R")) {
                orgs = buildtimeWfProcessBlo.getOrganizationsForAdminViewer();
            } else {
                String[] strArry = ids.split(";");
                orgs = buildtimeWfProcessBlo.getOrganizationsForAdminViewer(strArry);
            }
            if (orgs != null) {
                Organization[] orgArray = new Organization[orgs.size()];
                for (int i = 0; i < orgArray.length; i++) {
                    orgArray[i] = orgs.get(i);
                }
                return generateJSTreeNodes(orgArray);
            }
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
                jstnode.text = JSTreeNode.parseUTF8(node.getName());
                jstnode.icon = "";
                if (node instanceof Organization) {
                    jstnode.icon = "glyphicon glyphicon-home";
                    // add some spare information
                    jstnode.data = "1|" + node.getId();
                } else if (node instanceof Folder) {
                    if (((Folder) node).getType() == 109) {
                        jstnode.icon = "glyphicon glyphicon-th-large";
                    } else if (((Folder) node).getType() == 114) { // 新闻发布审核
                        jstnode.icon = "glyphicon glyphicon-certificate";
                    } else if (((Folder) node).getType() == 115) { // 组织注册审核
                        jstnode.icon = "glyphicon glyphicon-certificate";
                    } else if (((Folder) node).getType() == 123) { // 应用发布审核
                        jstnode.icon = "glyphicon glyphicon-certificate";
                    } else if (((Folder) node).getType() == 124) { // 表单发布审核
                        jstnode.icon = "glyphicon glyphicon-certificate";
                    } else if (((Folder) node).getType() == 125) { // 微服务发布审核
                        jstnode.icon = "glyphicon glyphicon-certificate";
                    } else if (((Folder) node).getType() == 146) { // 发票审核
                        jstnode.icon = "glyphicon glyphicon-certificate";
                    } else if (((Folder) node).getType() == 126) { // 新闻发布
                        jstnode.icon = "glyphicon glyphicon-flag";
                    } else if (((Folder) node).getType() == 127) { // 系统通知
                        jstnode.icon = "glyphicon glyphicon-bell";
                    } else if (((Folder) node).getType() == 128) { // 手机APP微服务审核
                        jstnode.icon = "glyphicon glyphicon-certificate";
                    } else if (((Folder) node).getType() == 130) { // 提醒推送
                        jstnode.icon = "glyphicon glyphicon-certificate";
                    } else if (((Folder) node).getType() == 132) { // 系统帮助
                        jstnode.icon = "glyphicon glyphicon-certificate";
                    }
                    // add some spare information
                    jstnode.data = "2|" + node.getOwner() + "|" + ((Folder) node).getType() + "|"
                            + ((Folder) node).getRank();
                } else if (node instanceof ReleasedWfProcess) {
                    jstnode.icon = "glyphicon glyphicon-fire";
                    // add some spare information
                    jstnode.data = "3|" + node.getOwner() + "|" + ((ReleasedWfProcess) node).getCode() + "|R|"
                            + ((ReleasedWfProcess) node).getVersion();
                    jstnode.text = JSTreeNode
                            .parseUTF8(node.getName() + "(" + ((ReleasedWfProcess) node).getVersion() + ")");
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



    // void : @ResponseStatus(value = HttpStatus.OK)
    @RequestMapping(value = "/api2", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    @ResponseBody
    public String getWfProcessInstance(@RequestParam("id") String id) {
        try {
            CloseableHttpClient httpClient = HttpClientBuilder.create().build();
            CloseableHttpResponse response1 = null;
            String apiserver = SystemConfig.getProp("paas.server.domainname");
            String url = apiserver + "/service11/api7";
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("instanceId", id));
            String str = EntityUtils.toString(new UrlEncodedFormEntity(urlParameters, "utf-8"));
            HttpGet httpGet = new HttpGet(url);
            try {
                httpGet.setURI(new URI(httpGet.getURI().toString() + "?" + str));
            } catch (URISyntaxException e) {
                e.printStackTrace();
            }
            response1 = httpClient.execute(httpGet);
            if (response1.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
            }
            HttpEntity entity = response1.getEntity();
            String responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpGet.abort();
            return responseJson;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/api3", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public OrgnizationListPage queryApprovedOrgs(int status, String condition, int pageno, int pagesize) {
        try {
            return organizationBlo.searchOrganizations(status, condition, pageno, pagesize);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api4", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public String modifyOrganizationStatus(String status, String oid, String lastupdate) {
        try {
            registrateOrganizationBlo.modifyOrganizationStatus(oid, Integer.parseInt(status),
                    Long.parseLong(lastupdate));
            return "{\"status\": \"1\"}";
        } catch (Exception e) {
            return "{\"status\": \"0\"}";
        }
    }

    @RequestMapping(value = "/api5", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public String deleteOrganization(String oid) {
        try {
            organizationBlo.deleteOrganization(oid);
            return "{\"status\": \"1\"}";
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}";
        }
    }

    @RequestMapping(value = "/api6", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public WfProcessListPage queryWfProcess(int deprecated, String condition, int pageno, int pagesize) {
        try {
            return releasedWfProcessBlo.searchWfProcess(deprecated, condition, pageno, pagesize);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api7", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public String modifyWfProcessStatus(int deprecated, String rid, String lastupdate, String comment, String owner,
                                        String userId, String userfullname, String ownername) {
        try {
            releasedWfProcessBlo.modifyWfProcessStatus(rid, deprecated, Long.parseLong(lastupdate));
            Organization org = this.organizationBlo.getOrganizationDetailsById(owner);
            // 创建日志 Dahai Cao at 15:30 on 2018-10-18
            approveForReleaseBlo.createApprovingLog(rid, "业务应用", org.getId(), org.getName(),
                    ReleasedWfProcess.class.getSimpleName(), deprecated, comment, Long.parseLong(lastupdate), owner,
                    userId, userfullname, ownername);
            return "{\"status\": \"1\"}";
        } catch (Exception e) {
            return "{\"status\": \"0\"}";
        }
    }

    // 查询新闻
    @RequestMapping(value = "/api12", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public NewsListPage queryApprovedNews(String condition, int pageno, int pagesize, String organizationId,
                                          int newsState) {
        try {
            return orgNewsBlo.searchNews(condition, pageno, pagesize, organizationId, newsState);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    // 修改新闻状态
    @RequestMapping(value = "/api8", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public String updateNewsStatus(String newsId, int status, String comment, long lastUpdate, String owner,
                                   String userId, String userfullname, String ownername) {
        try {
            orgNewsBlo.submittingNewsForApproving(newsId, status, comment, lastUpdate, owner, userId,
                    userfullname, ownername);
            return "{\"status\": \"" + status + "\"}";// 将状态设为审核中
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}";// 返回data，
        }
    }

    // 删除新闻
    @RequestMapping(value = "/api9", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public String deleteNewsById(String newsId, String oid) {
        try {
            String storagetype = SystemConfig.getProp("filestorage.type");
            orgNewsBlo.removeById(newsId);
            String syspath = "";
            if (storagetype.trim().equals("win")) {
                syspath = SystemConfig.getProp("windows.filestorage.lib");
            } else if (storagetype.trim().equals("linux")) {
                syspath = SystemConfig.getProp("linux.filestorage.lib");
            }
            if (!syspath.equals("")) {
                String destination = syspath + "/" + oid + "/adm/news/" + newsId;
                if (newsId != null && !newsId.equals("")) {
                    FileUtil.delDir(destination);
                }
            }
            return "{\"status\": \"1\"}";// 返回data，
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}";// 返回data，
        }
    }

    // 修改新闻标题内容等
    @RequestMapping(value = "/api10", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public String updateNewsTitleAndContent(String news) {
        try {
            News n = new News();
            JSONObject obj = new JSONObject(news);
            if (!obj.isNull("id")) {
                n.setId(obj.getString("id"));
            }
            if (!obj.isNull("name")) {
                n.setName(obj.getString("name"));
            }
            if (!obj.isNull("title")) {
                n.setTitle(obj.getString("title"));
            }
            if (!obj.isNull("titleImage")) {
                n.setTitleImage(obj.getString("titleImage"));
            }
            if (!obj.isNull("brief")) {
                n.setBrief(obj.getString("brief"));
            }
            if (!obj.isNull("author")) {
                n.setAuthor(obj.getString("author"));
            }
            if (!obj.isNull("publishDateTime")) {
                n.setPublishDateTime(obj.getLong("publishDateTime"));
            }
            if (!obj.isNull("content")) {
                n.setContent(obj.getString("content"));
            }
            if (!obj.isNull("writerId")) {
                n.setWriterId(obj.getString("writerId"));
            }
            if (!obj.isNull("writerName")) {
                n.setWriterName(obj.getString("writerName"));
            }
            if (!obj.isNull("organizationId")) {
                n.setOrganizationId(obj.getString("organizationId"));
            }
            if (!obj.isNull("organizationName")) {
                n.setOrganizationName(obj.getString("organizationName"));
            }
            if (!obj.isNull("lastUpdate")) {
                n.setLastUpdate(obj.getLong("lastUpdate"));
            }
            n.setNewsState(obj.getInt("newsState"));
            n.setNewsCategory(obj.getInt("newsCategory"));
            n.setNewsCategory(obj.getInt("newsClass"));
            n.setAccessLevel(obj.getInt("accessLevel"));
            if (obj.getJSONArray("attachments") != null) {
                String attachs = "";
                JSONArray arry = obj.getJSONArray("attachments");
                for (int i = 0; i < arry.length(); i++) {
                    if (attachs.equals("")) {
                        attachs = arry.getJSONObject(i).toString();
                    } else {
                        attachs = attachs + ";" + arry.getJSONObject(i).toString();
                    }
                }
                n.setAttachments(arry.toString());
            }
            if (!obj.isNull("owner")) {
                n.setOwner(obj.getString("owner"));
            }
            orgNewsBlo.modify(n);
            return "{\"status\": \"1\"}";// 返回data，
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}";// 返回data，
        }
    }

    // 根据新闻的id查找新闻
    @RequestMapping(value = "/api11", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public News queryNewsById(String newsId) {
        try {
            return orgNewsBlo.queryById(newsId);
        } catch (Exception e) {
            e.printStackTrace();
            // return "{\"status\": \"0\"}";//返回data，
        }
        return null;
    }

    // 添加新闻
    @RequestMapping(value = "/api13", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public String insertNews(String news) {
        try {
            News n = new News();
            JSONObject obj = new JSONObject(news);
//            n.setId(buildtimeIDGenerator.getNewRunTimeID());
            n.setId(obj.getString("id"));
            if (!obj.isNull("name")) {
                n.setName(obj.getString("name"));
            }
            if (!obj.isNull("title")) {
                n.setTitle(obj.getString("title"));
            }
            if (!obj.isNull("titleImage")) {
                n.setTitleImage(obj.getString("titleImage"));
            }
            if (!obj.isNull("brief")) {
                n.setBrief(obj.getString("brief"));
            }
            if (!obj.isNull("author")) {
                n.setAuthor(obj.getString("author"));
            }
            if (!obj.isNull("publishDateTime")) {
                n.setPublishDateTime(obj.getLong("publishDateTime"));
            }
            if (!obj.isNull("content")) {
                n.setContent(obj.getString("content"));
            }
            if (!obj.isNull("writerId")) {
                n.setWriterId(obj.getString("writerId"));
            }
            if (!obj.isNull("writerName")) {
                n.setWriterName(obj.getString("writerName"));
            }
            if (!obj.isNull("organizationId")) {
                n.setOrganizationId(obj.getString("organizationId"));
            }
            if (!obj.isNull("organizationName")) {
                n.setOrganizationName(obj.getString("organizationName"));
            }
            if (!obj.isNull("lastUpdate")) {
                n.setLastUpdate(obj.getLong("lastUpdate"));
            }
            //如果新闻分类的hi对外的，默认为未发布，需要审核
            if(obj.getInt("newsCategory") == 0){
                n.setNewsState(0);// 将新闻状态修改为0，未发布状态
            }else {
                //不需要审核
                n.setNewsState(2);
            }

            n.setNewsCategory(obj.getInt("newsCategory"));
            n.setNewsClass(obj.getInt("newsClass"));
            n.setAccessLevel(obj.getInt("accessLevel"));
            if (obj.getJSONArray("attachments") != null) {
                String attachs = "";
                JSONArray arry = obj.getJSONArray("attachments");
                for (int i = 0; i < arry.length(); i++) {
                    if (attachs.equals("")) {
                        attachs = arry.getJSONObject(i).toString();
                    } else {
                        attachs = attachs + ";" + arry.getJSONObject(i).toString();
                    }
                }
                n.setAttachments(arry.toString());
            }
            if (!obj.isNull("owner")) {
                n.setOwner(obj.getString("owner"));
            }
            orgNewsBlo.createNews(n);
            return "{\"status\" : \"1\",\"id\" : \"" + n.getId() + "\"}";
            // return "{\"status\": \"1\"}";//返回data，
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}";// 返回data，
        }
    }

    // 查询所有组织的已经发布的新闻
    @RequestMapping(value = "/api14", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public NewsListPage queryAllPublishedNews(String condition, int pageno, int pagesize, int newsState) {
        try {
            return orgNewsBlo.searchAllPublishedNews(condition, pageno, pagesize, newsState);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    // 修改新闻状态
    @RequestMapping(value = "/api15", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public String approveNews(String newsId, int status, String comment, long lastUpdate, String owner, String userId,
                              String userfullname, String ownername) {
        try {
            orgNewsBlo.approveNews(newsId, status, comment, lastUpdate, owner, userId, userfullname,
                    ownername);
            return "{\"status\": \"" + status + "\"}";// 将状态设为审核中

        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}";// 返回data，
        }
    }

    @RequestMapping(value = "/api16", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public String getNewRuntimeID() {
        try {
            String id = buildtimeIDGenerator.getNewRunTimeID();
            return id;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 为手机端和PC端提供查已经发布的新闻接口
     *
     * @param condition
     *        查询条件
     * @param cates
     *        一个字符串，是新闻分类，值为 0: 公开新闻；1：内部新闻；2：通知公告；
     *        3：文献资料；5：广告推广；，可以是多个分类，中间用逗号隔开，
     *        逗号是半角，如"0,5"，也可以是一个数字，如"4"。
     * @param userid
     *        用户ID
     * @param pageno
     *        页码，从1开始
     * @param pagesize
     *        页面大小，默认30条
     * @return
     */
    @RequestMapping(value = "/api17", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public NewsListPage getAllPublishedCategorizedNews(String condition, String cates, String userid,
                                                       String pageno, String pagesize) {
        try {
            //Login loggedinstaff = JSON.parseObject(JedisUtil.getInstance().get(userid), Login.class);
            String[] s = cates.split(",");
            if (s.length > 0) {
                int[] iCates = new int[s.length];
                for (int i = 0; i < s.length; i++) {
                    iCates[i] = Integer.parseInt(s[i]);
                }
                return orgNewsBlo.searchAllPublishedNews(condition, iCates, new String[0],
                        Integer.parseInt(pageno), Integer.parseInt(pagesize));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 添加一条一级评论
     *
     * @param newsId  	新闻ID
     * @param comment	评论对象
     * @return
     */
    @RequestMapping(value = "/api18", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public Comment[] insertComment(String newsId, String comment){
        if(StringUtils.isBlank(newsId)){
            return null;
        }
        try {
            String commentId = buildtimeIDGenerator.getNewRunTimeID();
            Comment cm = com.alibaba.fastjson.JSONObject.parseObject(comment, Comment.class);
            cm.setCommentId(commentId);
            orgNewsBlo.insertComment(newsId, cm);
            News news = orgNewsBlo.queryById(newsId);
            return news.getComments();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 添加一条二级评论
     *
     * @param newsId  	新闻ID
     * @param commentId	被评论的评论ID
     * @param secondaryComment 二级评论内容
     * @return
     */
    @RequestMapping(value = "/api23", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public Comment[] insertSecondaryComment(String newsId, String commentId,String secondaryComment){
        if(StringUtils.isBlank(newsId) || StringUtils.isBlank(commentId)){
            return null;
        }
        SecondaryComment object = com.alibaba.fastjson.JSONObject.parseObject(secondaryComment, SecondaryComment.class);
        String secondaryCommentId = null;
        try {
            secondaryCommentId = buildtimeIDGenerator.getNewRunTimeID();
            object.setCommentId(secondaryCommentId);
            orgNewsBlo.insertSecondaryComment(newsId,commentId,object);
            News news = orgNewsBlo.queryById(newsId);
            return news.getComments();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    /**
     * 删除一条一级评论附带删除二级评论
     *
     * @param newsId  	文章ID
     * @param commentId	评论ID
     * @return
     */
    @RequestMapping(value = "/api19", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public void delComment(String newsId, String commentId){
        orgNewsBlo.delComment(newsId, commentId);
    }

    /**
     * 删除一条二级评论
     *
     * @param newsId  	文章ID
     * @param commentId	评论ID
     * @return
     */
    @RequestMapping(value = "/api24", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public void delSecondaryComment(String newsId, String commentId, String secondaryCommentId){
        orgNewsBlo.delSecondaryComment(newsId, commentId,secondaryCommentId);
    }

    /**
     * 查询电子书
     * @param pageNo
     * @param pageSize
     * @param cond
     * @param userId
     * @param type 0、查询已经上架
     * @return
     */
    @RequestMapping(value = "/api20",method = RequestMethod.POST,produces = "application/json")
    @ResponseBody
    public PageObject queryBook(String pageNo,String pageSize,String cond,String userId,String type){
        PageObject pageObject = new PageObject();
        pageObject = adminBlo.queryBook(Integer.parseInt(pageNo),
                Integer.parseInt(pageSize),cond,userId,type);
        return pageObject;
    }

    /**
     * 查询音频
     * @param pageNo
     * @param pageSize
     * @param cond
     * @param userId
     * @param type 0、查询已经上架
     * @return
     */
    @RequestMapping(value = "/api21",method = RequestMethod.POST,produces = "application/json")
    @ResponseBody
    public PageObject queryAudio(String pageNo,String pageSize,String cond,String userId,String type){
        PageObject pageObject = new PageObject();
        pageObject = adminBlo.queryAudio(Integer.parseInt(pageNo),
                Integer.parseInt(pageSize),cond,userId,type);
        return pageObject;
    }

    /**
     * 查询直播
     * @param pageNo
     * @param pageSize
     * @param cond
     * @param userId
     * @param type
     * @return
     */
    @RequestMapping(value = "api22",method = RequestMethod.POST,produces = "application/json")
    @ResponseBody
    public PageObject queryLive(String pageNo,String pageSize,String cond,String userId,String type){
        PageObject pageObject = new PageObject();
        pageObject = adminBlo.queryLive(Integer.parseInt(pageNo),Integer.parseInt(pageSize),
                cond,userId,type);
        return pageObject;
    }

    /**
     * 查询视频
     * @param pageNo
     * @param pageSize
     * @param cond
     * @param userId
     * @return
     */
    @RequestMapping(value = "api25",method = RequestMethod.POST,produces = "application/json")
    @ResponseBody
    public PageObject queryVideo(String pageNo,String pageSize,String cond,String userId ,String type){
        PageObject pageObject = new PageObject();
        pageObject = adminBlo.queryVideo(Integer.parseInt(pageNo),Integer.parseInt(pageSize),
                cond,userId,type);
        return pageObject;
    }

    /**
     * 删除
     * @param id
     * @param path
     * @param userId
     * @param userName
     * @return
     */
    @RequestMapping(value = "api26",method = RequestMethod.POST,produces = "application/json")
    @ResponseBody
    public String deleteBook(String id,String path,String userId,String userName,String type)throws IOException {
        String substring = path.substring(0, path.lastIndexOf("/"));
        String result = adminBlo.delete(id,type);
        if (result.equals("1")){
           if (storagetype.equals("win")){
                String syspath = SystemConfig.getProp("windows.filestorage.lib");
                path = syspath+substring;
                FileUtil.delDir(path);
           }else if (storagetype.equals("linux")){
               String syspath = SystemConfig.getProp("linux.filestorage.lib");
               path = syspath+substring;
               FileUtil.delDir(path);
           }
            return "{\"status\":\"success\"}";
        }else {
            return "{\"status\": \"fail\"}";
        }
    }

    /**
     * 修改
     * @param type 1、电子书 2、音频 3、视频 4、直播
     * @param data
     * @return
     */
    @RequestMapping(value = "/api27", method = RequestMethod.POST,
            produces = "application/json")
    @ResponseBody
    public String updateCourse(
                               @RequestParam("type") String type,
                               @RequestParam("data") String data) throws Exception{
        String ver = SystemConfig.getProp("xq.product.pversion");
        if (ver.equals("1")) { // 单机版，保存到硬盘上
                if (type.equals("1")){
                    Book book = jsonForBook(data);
                    adminBlo.updateBook(book);
                } else if (type.equals("2")) {//音频
                    Audio audio = jsonForAudio(data);
                    adminBlo.updateAudio(audio);
                } else if(type.equals("3")){//视频
                    Video video = jsonForVideo(data);
                    adminBlo.updateVideo(video);
                } else if(type.equals("4")){//直播
                    Live live = jsonForLive(data);
                    adminBlo.updateLive(live);
                }
            return "{\"status\": \"1\"}"; // success
        } else if (ver.equals("2")) { // 私有云版
        } else if (ver.equals("3")) { // 公共云版
        }
        return "{\"status\": \"0\"}"; // failed
    }

    /**
     * 上架处理
     * @param type
     * @param id
     * @return
     */
    @RequestMapping(value = "/api28", method = RequestMethod.POST,
            produces = "application/json")
    @ResponseBody
    public String upperShelf(@RequestParam("type") String type,
                             @RequestParam("id") String id){
        String ver = SystemConfig.getProp("xq.product.pversion");
        if (ver.equals("1")){
           adminBlo.online(id,type);
           return "{\"status\": \"success\"}"; // success
        } else if (ver.equals("2")) { // 私有云版
        } else if (ver.equals("3")) { // 公共云版
        }
        return "{\"status\": \"failed\"}"; // failed
    }

    /**
     * 下架处理
     * @param data
     * @return
     */
    @RequestMapping(value = "/api29", method = RequestMethod.POST,
            produces = "application/json")
    @ResponseBody
    public String lowerShelf(@RequestParam("type")String type,
                             @RequestParam("id") String id){
        String ver = SystemConfig.getProp("xq.product.pversion");
        if (ver.equals("1")){
            adminBlo.offline(id,type);
            return "{\"status\": \"success\"}"; // success
        } else if (ver.equals("2")) { // 私有云版
        } else if (ver.equals("3")) { // 公共云版
        }
        return "{\"status\": \"failed\"}"; // failed
    }


    private Book jsonForBook(String data) {
        JSONObject jsonObject = new JSONObject(data);
        Book book = new Book();
        if (!jsonObject.getString("id").isEmpty()){
            book.setId(jsonObject.getString("id"));
        }
        if (!jsonObject.getString("bookName").isEmpty()) {
            book.setBookName(jsonObject.getString("bookName"));
        }
        if (!jsonObject.getString("ownerId").isEmpty()) {
            book.setOwnerId(jsonObject.getString("ownerId"));
        }
        if (!jsonObject.getString("userId").isEmpty()) {
            book.setUserId(jsonObject.getString("userId"));
        }
        if (!jsonObject.getString("bookAuthor").isEmpty()) {
            book.setBookAuthor(jsonObject.getString("bookAuthor"));
        }
        if (!jsonObject.getString("descript").isEmpty()) {
            book.setDescript(jsonObject.getString("descript"));
        }
        if (!jsonObject.getString("sellType").isEmpty()) {
            int sellType = Integer.parseInt(jsonObject.getString("sellType"));
            if (sellType == 0) {
                if (!jsonObject.getString("goodPrise").isEmpty()) {
                    double goodPrise = Double.parseDouble(jsonObject.getString("goodPrise"));
                    book.setGoodPrise(goodPrise);
                }
                if (!jsonObject.getString("discountPrise").isEmpty()) {
                    double discountPrise = Double.parseDouble(jsonObject.getString("discountPrise"));
                    book.setDiscountPrise(discountPrise);
                }
            } else if (sellType == 1) {
                book.setGoodPrise(0.00);
                book.setDiscountPrise(0.00);
            }
            book.setSellType(sellType);
        }
        book.setCreateTime(System.currentTimeMillis());
        return book;
    }
    private Audio jsonForAudio(String data) {
        JSONObject jsonObject = new JSONObject(data);
        Audio audio = new Audio();
        if (!jsonObject.getString("id").isEmpty()){
            audio.setId(jsonObject.getString("id"));
        }
        if (!jsonObject.getString("audioName").isEmpty()) {
            audio.setAudioName(jsonObject.getString("audioName"));
        }
        if (!jsonObject.getString("ownerId").isEmpty()) {
            audio.setOwnerId(jsonObject.getString("ownerId"));
        }
        if (!jsonObject.getString("userId").isEmpty()) {
            audio.setUserId(jsonObject.getString("userId"));
        }
        if (!jsonObject.getString("audioDesc").isEmpty()) {
            audio.setAudioDesc(jsonObject.getString("audioDesc"));
        }
        if (!jsonObject.getString("sellType").isEmpty()) {
            int sellType = Integer.parseInt(jsonObject.getString("sellType"));
            if (sellType == 0) {
                if (!jsonObject.getString("goodPrise").isEmpty()) {
                    double goodPrise = Double.parseDouble(jsonObject.getString("goodPrise"));
                    audio.setGoodPrise(goodPrise);
                }
                if (!jsonObject.getString("discountPrise").isEmpty()) {
                    double discountPrise = Double.parseDouble(jsonObject.getString("discountPrise"));
                    audio.setDiscountPrise(discountPrise);
                }
            } else if (sellType == 1) {
                audio.setGoodPrise(0.00);
                audio.setDiscountPrise(0.00);
            }
            audio.setSellType(sellType);
        }
        audio.setCreateTime(System.currentTimeMillis());
        return audio;
    }

    private Live jsonForLive(String data) throws Exception {
        JSONObject jsonObject = new JSONObject(data);
        Live live = new Live();
        if (!jsonObject.getString("id").isEmpty()){
            live.setId(jsonObject.getString("id"));
        }
        if (!jsonObject.getString("userId").isEmpty()) {
            live.setUserId(jsonObject.getString("userId"));
        }
        if (!jsonObject.getString("ownerId").isEmpty()) {
            live.setOwnerId(jsonObject.getString("ownerId"));
        }
        if (!jsonObject.getString("liveName").isEmpty()) {
            live.setLiveName(jsonObject.getString("liveName"));
        }
        if (!jsonObject.getString("liveDesc").isEmpty()) {
            live.setLiveDesc(jsonObject.getString("liveDesc"));
        }
        if (!jsonObject.getString("liveType").isEmpty()) {
            live.setLiveType(jsonObject.getString("liveType"));
        }
        if (!jsonObject.getString("liveDate").isEmpty()) {
            String liveDate = jsonObject.getString("liveDate");
            String time_Format = "yyyy-MM-dd HH:mm:ss";
            if (!StringUtils.isEmpty(liveDate)) {
                if (!StringUtils.isEmpty(time_Format)) {
                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat(time_Format);
                    long time = simpleDateFormat.parse(liveDate).getTime();
                    live.setLiveDate(time);
                }
            }
        }
        if (!jsonObject.getString("liveTime").isEmpty()) {
            live.setLiveTime(jsonObject.getString("liveTime"));
        }
        if (!jsonObject.getString("liveInfo").isEmpty()) {
            live.setLiveInfo(jsonObject.getString("liveInfo"));
        }
        if (!jsonObject.getString("sellType").isEmpty()) {
            int sellType = Integer.parseInt(jsonObject.getString("sellType"));
            if (sellType == 0) {
                if (!jsonObject.getString("goodPrise").isEmpty()) {
                    double goodPrise = Double.parseDouble(jsonObject.getString("goodPrise"));
                    live.setGoodPrise(goodPrise);
                }
                if (!jsonObject.getString("discountPrise").isEmpty()) {
                    double discountPrise = Double.parseDouble(jsonObject.getString("discountPrise"));
                    live.setDiscountPrise(discountPrise);
                }
            } else if (sellType == 1) {
                live.setGoodPrise(0.00);
                live.setDiscountPrise(0.00);
            }
            live.setSellType(sellType);
        }
        live.setCreateTime(System.currentTimeMillis());
        return live;
    }

    private Video jsonForVideo(String data){
        JSONObject jsonObject = new JSONObject(data);
        Video video = new Video();
        if (!jsonObject.getString("id").isEmpty()){
            video.setId(jsonObject.getString("id"));
        }
        if (!jsonObject.getString("userId").isEmpty()){
            video.setUserId(jsonObject.getString("userId"));
        }
        if (!jsonObject.getString("ownerId").isEmpty()){
            video.setOwnerId(jsonObject.getString("ownerId"));
        }
        if (!jsonObject.getString("videoName").isEmpty()){
            video.setVideoName(jsonObject.getString("videoName"));
        }
        if (!jsonObject.getString("videoDesc").isEmpty()){
            video.setVideoDesc(jsonObject.getString("videoDesc"));
        }
        if (!jsonObject.getString("sellType").isEmpty()){
            int sellType = Integer.parseInt(jsonObject.getString("sellType"));
            if (sellType==0){
                if (!jsonObject.getString("goodPrise").isEmpty()){
                    double goodPrise = Double.parseDouble(jsonObject.getString("goodPrise"));
                    video.setGoodPrise(goodPrise);
                }
                if (!jsonObject.getString("discountPrise").isEmpty()){
                    double discountPrise = Double.parseDouble(jsonObject.getString("discountPrise"));
                    video.setDiscountPrise(discountPrise);
                }
            }else if(sellType==1){
                video.setGoodPrise(0.00);
                video.setDiscountPrise(0.00);
            }
            video.setSellType(sellType);
        }
        video.setCreateTime(System.currentTimeMillis());
        return video;
    }


    /**
     *
     * @param oid organization ID
     * @param pn
     * @param psz
     * @param cond1 search value
     * @param cond2 status
     * @param cond3 from date
     * @param cond4 to date
     * @return
     */
    @RequestMapping(value = "/api30", method = RequestMethod.GET,
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public AdminSearchResultPage searchAllApplicationServices(String oid, int pn, int psz,
                                                              String cond1, String cond2,
                                                              String cond3, String cond4) {
        try {
            // 在这里服务应该调用另一个服务获取所有当前运行的服务器，通过一个一个服务器访问，来搜索符合条件的流程实例。
            CloseableHttpClient httpClient = HttpClientBuilder.create().build();
            String apiserver = SystemConfig.getProp("paas.server.domainname");
            String url = apiserver + "/service11/api6";
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("oid", oid));
            urlParameters.add(new BasicNameValuePair("cond1", cond1));
            urlParameters.add(new BasicNameValuePair("cond2", cond2));
            urlParameters.add(new BasicNameValuePair("cond3", cond3));
            urlParameters.add(new BasicNameValuePair("cond4", cond4));
            String str = EntityUtils.toString(new UrlEncodedFormEntity(urlParameters, "utf-8"));
            HttpGet httpGet = new HttpGet(url);
            httpGet.setURI(new URI(httpGet.getURI().toString() + "?" + str));
            CloseableHttpResponse response1 = httpClient.execute(httpGet);
            if (response1.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
            }
            HttpEntity entity = response1.getEntity();
            String responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpGet.abort();
            List<AdminSearchResult> list = new ArrayList<AdminSearchResult>();
            if (!responseJson.equals("")) {
                JSONArray jsonarr = new JSONArray(responseJson);
                if (jsonarr.length() > 0) {
                    for (int i = 0; i < jsonarr.length(); i++) {
                        list.add(parseAdminSearchResult(jsonarr.getJSONObject(i)));
                    }
                }
            }
            return createPage(list, pn, psz);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    /**
     *
     * @param pid process definition Id
     * @param pn
     * @param psz
     * @param cond
     * @return
     */
    @RequestMapping(value = "/api31", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    @ResponseBody
    public AdminSearchResultPage searchApplicationProcService(String pid, int pn, int psz,
                                                              String cond1, String cond2,
                                                              String cond3, String cond4) {
        try {
            // 在这里服务应该调用另一个服务获取所有当前运行的服务器，通过一个一个服务器访问，来搜索符合条件的流程实例。
            CloseableHttpClient httpClient = HttpClientBuilder.create().build();
            String apiserver = SystemConfig.getProp("paas.server.domainname");
            String url = apiserver + "/service11/api12";
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("pid", pid));
            urlParameters.add(new BasicNameValuePair("cond1", cond1));
            urlParameters.add(new BasicNameValuePair("cond2", cond2));
            urlParameters.add(new BasicNameValuePair("cond3", cond3));
            urlParameters.add(new BasicNameValuePair("cond4", cond4));
            String str = EntityUtils.toString(new UrlEncodedFormEntity(urlParameters, "utf-8"));
            HttpGet httpGet = new HttpGet(url);
            httpGet.setURI(new URI(httpGet.getURI().toString() + "?" + str));
            CloseableHttpResponse response1 = httpClient.execute(httpGet);
            if (response1.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
            }
            HttpEntity entity = response1.getEntity();
            String responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpGet.abort();
            List<AdminSearchResult> list = new ArrayList<AdminSearchResult>();
            if (!responseJson.equals("")) {
                JSONArray jsonarr = new JSONArray(responseJson);
                if (jsonarr.length() > 0) {
                    for (int i = 0; i < jsonarr.length(); i++) {
                        list.add(parseAdminSearchResult(jsonarr.getJSONObject(i)));
                    }
                }
            }
            return createPage(list, pn, psz);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    private AdminSearchResult parseAdminSearchResult(JSONObject json) {
        AdminSearchResult r = new AdminSearchResult();
        r.setInstanceId(json.getString("instanceId"));
        r.setDefinitionId(json.getString("definitionId"));
        if (!json.isNull("processName")) {
            r.setProcessName(json.getString("processName"));
        }
        if (!json.isNull("processVersion")) {
            r.setProcessVersion(json.getString("processVersion"));
        }
        if (!json.isNull("status")) {
            r.setStatus(json.getInt("status"));
        }
        if (!json.isNull("launcher")) {
            r.setLauncher(json.getString("launcher"));
        }
        if (!json.isNull("idType")) {
            r.setIdType(json.getString("idType"));
        }
        if (!json.isNull("idNumber")) {
            r.setIdNumber(json.getString("idNumber"));
        }
        if (!json.isNull("startTime")) {
            r.setStartTime(json.getLong("startTime"));
        }
        if (!json.isNull("suspensionTime")) {
            r.setSuspensionTime(json.getLong("suspensionTime"));
        }
        if (!json.isNull("updateTime")) {
            r.setUpdateTime(json.getLong("updateTime"));
        }
        if (!json.isNull("server")) {
            r.setServer(json.getString("server"));
        }
        return r;
    }

    private AdminSearchResultPage createPage(List<AdminSearchResult> list, int pn, int psz) {
        AdminSearchResultPage page = new AdminSearchResultPage(pn, psz);
        int total = 1;
        int pagesize = psz;
        int pageno = pn;
        if (total == 0) {
            page.setPageSize(pagesize);
            page.setPageNo(0);
            page.setAllEntitiesCount(0);
            page.setAllPagesCount(0);
            page.setPageIndex(0);
        } else {
            page.setPageSize(pagesize);
            page.setPageNo(pageno);
            page.setAllEntitiesCount(total);
            int n = total / pagesize;
            int m = total % pagesize;
            if (m > 0) {
                n = n + 1;
            }
            page.setAllPagesCount(n);
            int pageindex = (pageno - 1) * pagesize;
            page.setPageIndex(pageindex);
            page.setPageEntities(list.toArray(new AdminSearchResult[list.size()]));
        }
        return page;
    }
}
