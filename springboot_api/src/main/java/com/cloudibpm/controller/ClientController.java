package com.cloudibpm.controller;

import com.cloudibpm.blo.bigdata.ProcessBigDataBlo;
import com.cloudibpm.blo.buildtime.wfprocess.ReleasedWfProcessBlo;
import com.cloudibpm.core.buildtime.release.wfprocess.ReleasedWfProcess;
import com.cloudibpm.core.buildtime.util.json.WfProcessJSONParser;
import com.cloudibpm.core.buildtime.wfprocess.task.StartPoint;
import com.cloudibpm.core.runtime.util.WfProcessInstanceUncloner;
import com.cloudibpm.core.runtime.util.json.FormDataLoader;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.core.runtime.workitem.WorkitemInfoDescriptor;
import com.cloudibpm.core.runtime.workitem.WorkitemInfoDescriptorPage;
import com.cloudibpm.core.util.SystemConfig;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/service14")
public class ClientController {
    private final ReleasedWfProcessBlo releasedWfProcessBlo;
    private final ProcessBigDataBlo processBigDataBlo;

    @Autowired
    public ClientController(ReleasedWfProcessBlo releasedWfProcessBlo,
                            ProcessBigDataBlo processBigDataBlo) {
        this.releasedWfProcessBlo = releasedWfProcessBlo;
        this.processBigDataBlo = processBigDataBlo;
    }


    @RequestMapping(value = "/api1", method = RequestMethod.GET,
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public WorkitemInfoDescriptorPage getManualTaskInstances(String uid,
                                                             String fullname,
                                                             String staffids,
                                                             int pn,
                                                             int psz,
                                                             String cond) throws Exception {
        // 在这里服务应该调用另一个服务获取所有当前运行的服务器，
        // 通过一个一个服务器访问，来搜索符合条件的流程实例。
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String responseJson = null;
        String url = SystemConfig.getProp("paas.server.domainname") + "/service11/api8";
        List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
        urlParameters.add(new BasicNameValuePair("uid", uid));
        urlParameters.add(new BasicNameValuePair("fullname", fullname));
        urlParameters.add(new BasicNameValuePair("staffids", staffids));
        urlParameters.add(new BasicNameValuePair("cond", cond));
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
        responseJson = EntityUtils.toString(entity, "UTF-8").trim();
        httpClient.close();
        httpGet.abort();
        List<WorkitemInfoDescriptor> list = new ArrayList<WorkitemInfoDescriptor>();
        if (!responseJson.equals("")) {
            JSONArray jsonarr = new JSONArray(responseJson);
            if (jsonarr.length() > 0) {
                for (int i = 0; i < jsonarr.length(); i++) {
                    list.add(parseWorkitemInfoDescriptor(jsonarr.getJSONObject(i)));
                }
            }
        }

        WorkitemInfoDescriptorPage page = new WorkitemInfoDescriptorPage(pn, psz);
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
            page.setPageEntities(list.toArray(new WorkitemInfoDescriptor[list.size()]));
        }
        return page;
    }

    private WorkitemInfoDescriptor parseWorkitemInfoDescriptor(JSONObject json) {
        WorkitemInfoDescriptor r = new WorkitemInfoDescriptor();
        r.setId(json.getString("id"));
        r.setName(json.getString("name"));
        if (!json.isNull("status")) {
            r.setStatus(json.getInt("status"));
        }
        if (!json.isNull("priority")) {
            r.setPriority(json.getString("priority"));
        }
        if (!json.isNull("taskInstanceStatus")) {
            r.setTaskInstanceStatus(json.getInt("taskInstanceStatus"));
        }
        if (!json.isNull("submitterId")) {
            r.setSubmitterId(json.getString("submitterId"));
        }
        if (!json.isNull("submitterName")) {
            r.setSubmitterName(json.getString("submitterName"));
        }
        if (!json.isNull("wfProcessId")) {
            r.setWfProcessId(json.getString("wfProcessId"));
        }
        if (!json.isNull("wfProcessInstanceId")) {
            r.setWfProcessInstanceId(json.getString("wfProcessInstanceId"));
        }
        if (!json.isNull("wfProcessInstanceName")) {
            r.setWfProcessInstanceName(json.getString("wfProcessInstanceName"));
        }
        if (!json.isNull("launchDateTime")) {
            r.setLaunchDateTime(json.getLong("launchDateTime"));
        }
        if (!json.isNull("taskInstanceEnabledDateTime")) {
            r.setTaskInstanceEnabledDateTime(json.getLong("taskInstanceEnabledDateTime"));
        }
        if (!json.isNull("taskInstanceAlarmDateTime")) {
            r.setTaskInstanceAlarmDateTime(json.getLong("taskInstanceAlarmDateTime"));
        }
        if (!json.isNull("taskInstanceStartDateTime")) {
            r.setTaskInstanceStartDateTime(json.getLong("taskInstanceStartDateTime"));
        }
        if (!json.isNull("taskInstanceDateTimeLimit")) {
            r.setTaskInstanceDateTimeLimit(json.getLong("taskInstanceDateTimeLimit"));
        }
        if (!json.isNull("launchUserId")) {
            r.setLaunchUserId(json.getString("launchUserId"));
        }
        if (!json.isNull("launchUserId")) {
            r.setLaunchUserId(json.getString("launchUserId"));
        }
        if (!json.isNull("launchUserName")) {
            r.setLaunchUserName(json.getString("launchUserName"));
        }
        if (!json.isNull("launchUserIdType")) {
            r.setLaunchUserIdType(json.getInt("launchUserIdType"));
        }
        if (!json.isNull("launchUserIdNumber")) {
            r.setLaunchUserIdNumber(json.getString("launchUserIdNumber"));
        }
        if (!json.isNull("serverIp")) {
            r.setServerIp(json.getString("serverIp"));
        }
        if (!json.isNull("formContent")) {
            r.setFormContent(json.getString("formContent"));
        }
        if (!json.isNull("wfProcessAccessLevel")) {
            r.setWfProcessAccessLevel(json.getInt("wfProcessAccessLevel"));
        }
        if (!json.isNull("wfProcessType")) {
            r.setWfProcessType(json.getInt("wfProcessType"));
        }
        if (!json.isNull("workflowType")) {
            r.setWorkflowType(json.getInt("workflowType"));
        }
        return r;
    }

    @RequestMapping(value = "/api2", method = RequestMethod.GET,
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public WorkitemInfoDescriptor getManualTaskInstance(String ip,
                                                        String pid,
                                                        String tid,
                                                        String userid,
                                                        String userip,
                                                        String pri,
                                                        String fullname) throws Exception {
        // 在这里服务应该调用另一个服务获取所有当前运行的服务器，
        // 通过一个一个服务器访问，来搜索符合条件的流程实例。
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String responseJson = null;
        // IP address
        String svrurl = SystemConfig.getProp("paas.server.domainname");
        String url = svrurl + "/service11/api9";
        List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
        urlParameters.add(new BasicNameValuePair("pid", pid));
        urlParameters.add(new BasicNameValuePair("tid", tid));
        urlParameters.add(new BasicNameValuePair("userid", userid));
        urlParameters.add(new BasicNameValuePair("fullname", fullname));
        urlParameters.add(new BasicNameValuePair("userip", userip));
        urlParameters.add(new BasicNameValuePair("priority", pri));
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
        responseJson = EntityUtils.toString(entity, "UTF-8").trim();
        httpClient.close();
        httpGet.abort();

        return parseFormDescriptor(new JSONObject(responseJson));
    }

    private WorkitemInfoDescriptor parseFormDescriptor(JSONObject json) {
        WorkitemInfoDescriptor r = new WorkitemInfoDescriptor();
        if (!json.isNull("formContent")) {
            r.setFormContent(json.getString("formContent"));
        }
        return r;
    }

    /**
     * 在这里cmd含义代表着命令，也就是点了那个按钮<br>
     * 0:保存;1:关闭;2:提交;3:退回;4:委托
     *
     * @param cmd      String
     * @param serverip
     * @param pid
     * @param tid
     * @param userid
     * @param list
     * @return
     */
    @RequestMapping(value = "/api3", method = RequestMethod.POST,
            headers = "Accept=application/json",
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public String sendCommandWithSaving(String cmd,
                                        String serverip,
                                        String pid,
                                        String tid,
                                        String userid,
                                        String fullname,
                                        String list,
                                        String newuserid) throws Exception {
        // 在这里服务应该调用另一个服务获取所有当前运行的服务器，通过一个一个服务器访问，来搜索符合条件的流程实例。
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String responseJson = null;
        // serverip, IP address
        String svrurl = SystemConfig.getProp("paas.server.domainname");
        HttpPost httpPost = new HttpPost(svrurl + "/service11/api10");
        List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
        urlParameters.add(new BasicNameValuePair("cmd", cmd));
        urlParameters.add(new BasicNameValuePair("pid", pid));
        urlParameters.add(new BasicNameValuePair("tid", tid));
        urlParameters.add(new BasicNameValuePair("userid", userid));
        urlParameters.add(new BasicNameValuePair("fullname", fullname));
        urlParameters.add(new BasicNameValuePair("serverip", serverip));
        urlParameters.add(new BasicNameValuePair("list", list));
        urlParameters.add(new BasicNameValuePair("newuserid", newuserid));
        HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
        httpPost.setEntity(postParams);
        response1 = httpClient.execute(httpPost);
        HttpEntity entity = response1.getEntity();
        responseJson = EntityUtils.toString(entity, "UTF-8").trim();
        httpClient.close();
        httpPost.abort();
        return responseJson;
    }

    @RequestMapping(value = "/api4", method = RequestMethod.POST,
            headers = "Accept=application/json",
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public String sendCommandWithoutSaving(String cmd,
                                           String serverip,
                                           String pid,
                                           String tid,
                                           String userid,
                                           String fullname,
                                           String newuserid) throws Exception {
        // 在这里服务应该调用另一个服务获取所有当前运行的服务器，
        // 通过一个一个服务器访问，来搜索符合条件的流程实例。
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String responseJson = null;
        // serverip, IP address
        String svrurl = SystemConfig.getProp("paas.server.domainname");
        HttpPost httpPost = new HttpPost(svrurl + "/service11/api11");
        List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
        urlParameters.add(new BasicNameValuePair("cmd", cmd));
        urlParameters.add(new BasicNameValuePair("pid", pid));
        urlParameters.add(new BasicNameValuePair("tid", tid));
        urlParameters.add(new BasicNameValuePair("userid", userid));
        urlParameters.add(new BasicNameValuePair("fullname", fullname));
        urlParameters.add(new BasicNameValuePair("serverip", serverip));
        urlParameters.add(new BasicNameValuePair("newuserid", newuserid));
        HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
        httpPost.setEntity(postParams);
        response1 = httpClient.execute(httpPost);
        HttpEntity entity = response1.getEntity();
        responseJson = EntityUtils.toString(entity, "UTF-8").trim();
        httpClient.close();
        httpPost.abort();
        return responseJson;
    }

//    @RequestMapping(value = "/api5", method = RequestMethod.GET,
//            produces = "application/json; charset=utf-8")
//    @ResponseBody
//    public ProcessServiceSearchResultPage searchProcService(String uid,
//                                                            String cond,
//                                                            int pageno,
//                                                            int pagesize) throws Exception {
//        String[] conditions = cond.split(" ");
//        return ProcessServiceSolrUtils.searchApp(new String[0], conditions, pageno, pagesize);
//    }

    /**
     * 获取一个过程的启动页面
     *
     * @param pid
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/api6", method = RequestMethod.GET,
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public WorkitemInfoDescriptor getLaunchPage(String pid) throws Exception {
        if (pid.length() == 16) {
            ReleasedWfProcess rp = releasedWfProcessBlo.getReleasedProcess(pid);
            rp = WfProcessJSONParser.parseReleasedWfProcess(rp.getProcessContent());
            Object launchpage = null;
            for (int i = 0; i < rp.getChildren().length; i++) {
                if (rp.getChildren()[i] instanceof StartPoint) {
                    StartPoint stp = (StartPoint) rp.getChildren()[i];
                    launchpage = stp.getLaunchFormContent();
                    launchpage = FormDataLoader.parseJSON2LoadData((JSONObject) launchpage, rp);
                    break;
                }
            }
            WorkitemInfoDescriptor r = new WorkitemInfoDescriptor();
            r.setWfProcessType(rp.getProcessType());
            r.setWfProcessAccessLevel(rp.getAccessLevel());
            r.setWorkflowType(rp.getWorkflowType());
            if (launchpage != null && !launchpage.equals("")) {
                r.setFormContent(launchpage);
            }
            return r;
        } else if (pid.length() == 32) {
            WfProcessInstance pi = this.processBigDataBlo.getInstance(pid);
            pi = WfProcessInstanceUncloner.unclone(pi);
            Object launchpage = null;
            for (int i = 0; i < pi.getChildren().length; i++) {
                if (pi.getChildren()[i] instanceof StartPoint) {
                    StartPoint stp = (StartPoint) pi.getChildren()[i];
                    launchpage = stp.getLaunchFormContent();
                    launchpage = FormDataLoader.parseJSON2LoadData((JSONObject) launchpage, pi);
                    break;
                }
            }
            WorkitemInfoDescriptor r = new WorkitemInfoDescriptor();
            r.setWfProcessType(pi.getProcessType());
            r.setWfProcessAccessLevel(pi.getAccessLevel());
            r.setWorkflowType(pi.getWorkflowType());
            if (launchpage != null && !launchpage.equals("")) {
                r.setFormContent(launchpage);
            }
            return r;
        }
        return null;
    }

    /**
     * 这个接口非常重要，是启动一个流程实例的首要入口。
     * 这个接口也向外实现公开，外部应用可以通过这个接口来实现启动实例的工作。
     *
     * @param userid      user Id
     * @param userip      user IP v4 address
     * @param useripv6    user IP v6 address
     * @param longitude   user longitude
     * @param latitude    user latitude
     * @param device      device name, e.g., iPhone, Android phones, etc.
     * @param paramvalues the parameters user typed into
     * @return
     */
    @RequestMapping(value = "/api7", method = RequestMethod.POST,
            headers = "Accept=application/json",
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public String launchProcessInstance(String token,
                                        String processid,
                                        String userid,
                                        String userip,
                                        String useripv6,
                                        String longitude,
                                        String latitude,
                                        String device,
                                        String paramvalues,
                                        String userfullname) throws Exception {
//		if (!SecretKeyUtil.getInstance().recognizeKey(token)) {
//			return "{\"status\": \"-1\"}"; // incorrect token
//		}
        // 在这里，应该通过检查所有服务器，来找到一个合适的（注意，是合适的）服务器来启动该流程。
        // 合适的服务器是指，可以接受请求的，服务器软件硬件配置合适的，综合指数在不繁忙区间的。
        // 这里需要大数据、机器学习、人工智能支持，可以参考我的博士毕业论文。
        // 唉，算法程序丢了，不然可以省去很多设计和开发时间:-(
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String responseJson = null;
        // serverip, IP address
        String url = SystemConfig.getProp("paas.server.domainname");
        HttpPost httpPost = new HttpPost(url + "/service11/api5");
        // String token, String pid, String userid,
        // String ipv4, String ipv6, String longitude,
        // String latitude, String device, String paramvalues
        List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
        //urlParameters.add(new BasicNameValuePair("token", token));
        urlParameters.add(new BasicNameValuePair("pid", processid));
        urlParameters.add(new BasicNameValuePair("userid", userid));
        urlParameters.add(new BasicNameValuePair("ipv4", userip));
        urlParameters.add(new BasicNameValuePair("ipv6", useripv6));
        urlParameters.add(new BasicNameValuePair("longitude", longitude));
        urlParameters.add(new BasicNameValuePair("latitude", latitude));
        urlParameters.add(new BasicNameValuePair("device", device));
        urlParameters.add(new BasicNameValuePair("paramvalues", paramvalues));
        urlParameters.add(new BasicNameValuePair("fullname", userfullname));
        HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
        httpPost.setEntity(postParams);
        response1 = httpClient.execute(httpPost);
        HttpEntity entity = response1.getEntity();
        responseJson = EntityUtils.toString(entity, "UTF-8").trim();
        httpClient.close();
        httpPost.abort();
        return responseJson;
    }

    /**
     * 获取待办事宜列表
     *
     * @param uid
     * @param fullname
     * @param staffids
     * @param cond
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/api8", method = RequestMethod.GET,
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public WorkitemInfoDescriptor[] getAllManualTaskInstances(String uid,
                                                              String fullname,
                                                              String staffids,
                                                              String cond,
                                                              String qtype) throws Exception {
        // 在这里服务应该调用另一个服务获取所有当前运行的服务器，
        // 通过一个一个服务器访问，来搜索符合条件的流程实例。
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String responseJson = null;
        String svrurl = SystemConfig.getProp("paas.server.domainname");
        String url = svrurl + "/service11/api8";
        List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
        urlParameters.add(new BasicNameValuePair("uid", uid));
        urlParameters.add(new BasicNameValuePair("fullname", fullname));
        urlParameters.add(new BasicNameValuePair("staffids", staffids));
        urlParameters.add(new BasicNameValuePair("cond", cond));
        urlParameters.add(new BasicNameValuePair("qtype", qtype));
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
        responseJson = EntityUtils.toString(entity, "UTF-8").trim();
        httpClient.close();
        httpGet.abort();
        List<WorkitemInfoDescriptor> list = new ArrayList<WorkitemInfoDescriptor>();
        if (!responseJson.equals("")) {
            JSONArray jsonarr = new JSONArray(responseJson);
            if (jsonarr.length() > 0) {
                for (int i = 0; i < jsonarr.length(); i++) {
                    list.add(parseWorkitemInfoDescriptor(jsonarr.getJSONObject(i)));
                }
            }
        }
        return list.toArray(new WorkitemInfoDescriptor[list.size()]);
    }


    @RequestMapping(value = "/api9", method = RequestMethod.GET,
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public WorkitemInfoDescriptor getInstanceLaunchPage(String piid) throws Exception {
        WfProcessInstance rp = this.processBigDataBlo.getInstance(piid);
        rp = WfProcessInstanceUncloner.unclone(rp);
        //rp = WfProcessJSONParser.parseWfProcessInstance(rp);
        Object launchpage = null;
        for (int i = 0; i < rp.getChildren().length; i++) {
            if (rp.getChildren()[i] instanceof StartPoint) {
                StartPoint stp = (StartPoint) rp.getChildren()[i];
                launchpage = stp.getLaunchFormContent();
                launchpage = FormDataLoader.parseJSON2LoadData((JSONObject) launchpage, rp);
                break;
            }
        }
        WorkitemInfoDescriptor r = new WorkitemInfoDescriptor();
        r.setWfProcessType(rp.getProcessType());
        r.setWfProcessAccessLevel(rp.getAccessLevel());
        r.setWorkflowType(rp.getWorkflowType());
        if (launchpage != null && !launchpage.equals("")) {
            r.setFormContent(launchpage);
        }
        return r;
    }
}