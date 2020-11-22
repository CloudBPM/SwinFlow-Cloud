package client;

import com.alibaba.fastjson.JSON;
import com.cloud.core.session.redis.JedisUtil;
import com.cloudibpm.core.organization.AbstractPosition;
import com.cloudibpm.core.session.utils.SessionUtils;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.Staff;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.core.util.encode.MD5Util;
import com.cloudibpm.core.util.encode.SecretKeyUtil;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;


/**
 * Servlet implementation class clientservices
 */
@WebServlet("/clientservices")
public class ClientServices extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Login loggedinstaff = null;
    private String token = null;
    //	private static final String API_DomainName = "http://localhost:8080/api";
    private static String API_DomainName = null;

    /**
     * @see HttpServlet#service(HttpServletRequest request, HttpServletResponse
     * response)
     */
    protected void service(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
//        API_DomainName = request.getScheme() + "://" + request.getServerName() + ":8088/api";
        API_DomainName="http://localhost:8088/api";
        String sessionId = SessionUtils.getInstance().getSessionId(request);
        if (sessionId != null) {
            loggedinstaff = JSON.parseObject(JedisUtil.getInstance().get(sessionId), Login.class);
        }
        if (loggedinstaff == null) {
            returnErrorMsg(response);
        }
        super.service(request, response);
    }

    private void returnErrorMsg(HttpServletResponse response) throws IOException {
        String responseJson = "{\"status\": \"-5\" }";
        response.setCharacterEncoding("utf8");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(responseJson);
        out.close();
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
     * response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String api = request.getParameter("api");
        String responseJson = null;
        if (api.equals("LL0")) {
            String url = API_DomainName + "/service14/api6";
            String pid = request.getParameter("pid");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("pid", pid));
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
        } else if (api.equals("1")) {
            // fetch my work item list
            String url = API_DomainName + "/service14/api1";
            String uid = request.getParameter("uid");
            String pn = request.getParameter("pn");
            String psz = request.getParameter("psz");
            String cond = request.getParameter("cond");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("uid", uid));
            urlParameters.add(new BasicNameValuePair("fullname", loggedinstaff.getUser().getFullName()));
            String stf = "";
            Staff[] staffships = loggedinstaff.getStaffships();
            if (staffships != null) {
                for (int i = 0; i < staffships.length; i++) {
                    if (stf.equals("")) {
                        stf = staffships[i].getId();
                    } else {
                        stf = stf + "|" + staffships[i].getId();
                    }
                }
            }
            urlParameters.add(new BasicNameValuePair("staffids", stf));
            urlParameters.add(new BasicNameValuePair("pn", pn));
            urlParameters.add(new BasicNameValuePair("psz", psz));
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
        } else if (api.equals("2")) {
            // fetch one task instance by pid and tid and my user id.
            String url = API_DomainName + "/service14/api2";
            String ip = request.getParameter("ip");
            String pid = request.getParameter("pid");
            String tid = request.getParameter("tid");
            String uid = request.getParameter("uid");
            String pri = request.getParameter("pri");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("ip", ip));
            urlParameters.add(new BasicNameValuePair("pid", pid));
            urlParameters.add(new BasicNameValuePair("tid", tid));
            urlParameters.add(new BasicNameValuePair("userid", uid));
            urlParameters.add(new BasicNameValuePair("fullname", loggedinstaff.getUser().getFullName()));
            urlParameters.add(new BasicNameValuePair("userip", request.getRemoteAddr()));
            urlParameters.add(new BasicNameValuePair("pri", pri));
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
        } else if (api.equals("6")) {
            String orgs = "";
            Staff[] staffships = loggedinstaff.getStaffships();
            if (staffships != null) {
                for (int i = 0; i < staffships.length; i++) {
                    if (staffships[i].getOwner() != null && !staffships[i].getOwner().equals("")) {
                        if (orgs.equals("")) {
                            orgs = staffships[i].getOwner();
                        } else {
                            orgs = orgs + "#" + staffships[i].getOwner();
                        }
                    }
                }
            }
            // search available application service in application supermarket.
            String url = API_DomainName + "/service1/api28";
            String uid = request.getParameter("uid");
            String condition = request.getParameter("cond");
            String pageno = request.getParameter("pageno");
            String pagesize = request.getParameter("pagesize");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("orgs", orgs));
            urlParameters.add(new BasicNameValuePair("uid", uid));
            urlParameters.add(new BasicNameValuePair("cond", condition));
            urlParameters.add(new BasicNameValuePair("pageno", pageno));
            urlParameters.add(new BasicNameValuePair("pagesize", pagesize));

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


        } else if (api.equals("8")) {
            // query user.
            String url = API_DomainName + "/service5/api8";
            String uid = request.getParameter("uid");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("uid", uid));

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
        } else if (api.equals("12")) {
            // 获取所有组织的已经发布的新闻
            String url = API_DomainName + "/service13/api14";
            String condition = request.getParameter("cond");
            String pn = request.getParameter("pn");//当前页数
            String psz = request.getParameter("psz");//每页数据数
            String newsState = request.getParameter("newsState");//新闻的状态
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("condition", condition));
            urlParameters.add(new BasicNameValuePair("pageno", pn));
            urlParameters.add(new BasicNameValuePair("pagesize", psz));
            urlParameters.add(new BasicNameValuePair("newsState", newsState));

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
        } else if (api.equals("13")) {
            // fetch my work item list
            String url = API_DomainName + "/service14/api8";
            String uid = request.getParameter("uid");
            String cond = request.getParameter("cond");
            String qtype = request.getParameter("qtype");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String stf = "";
            Staff[] staffships = loggedinstaff.getStaffships();
            if (staffships != null) {
                for (int i = 0; i < staffships.length; i++) {
                    if (staffships[i].getId() != null && !staffships[i].getId().equals("")) {
                        if (stf.equals("")) {
                            stf = staffships[i].getId();
                        } else {
                            stf = stf + "|" + staffships[i].getId();
                        }
                    }
                }
            }
            urlParameters.add(new BasicNameValuePair("staffids", stf));
            urlParameters.add(new BasicNameValuePair("uid", uid));
            urlParameters.add(new BasicNameValuePair("fullname", loggedinstaff.getUser().getFullName()));
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
        } else if (api.equals("14")) { // 这个接口是为IRI来使用的
            String url = API_DomainName + "/service19/api21";
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("oid", request.getParameter("oid")));
            urlParameters.add(new BasicNameValuePair("dir", request.getParameter("dir")));
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
        } else if (api.equals("15")) {
            // fetch one task instance by pid and tid and my user id.
            String url = API_DomainName + "/service13/api17";
            String cates = request.getParameter("cates");
            String userid = request.getParameter("userid");
            String condition = request.getParameter("cond");
            String pageno = request.getParameter("pageno");
            String pagesize = request.getParameter("pagesize");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("cates", cates));
            urlParameters.add(new BasicNameValuePair("userid", userid));
            urlParameters.add(new BasicNameValuePair("pageno", pageno));
            urlParameters.add(new BasicNameValuePair("pagesize", pagesize));
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
        } else if (api.equals("16")) {
            String url = API_DomainName + "/service13/api11";
            String newsId = request.getParameter("newsId");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("newsId", newsId));
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
        } else if (api.equals("17")) {
            String url = API_DomainName + "/service13/api18";
            String category = request.getParameter("category");
            String lastTime = request.getParameter("lastTime");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("category", category));
            urlParameters.add(new BasicNameValuePair("lastTime", lastTime));
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
        } else if (api.equals("18")) {
            String url = API_DomainName + "/service30/api11";
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            AbstractPosition[] positions = loggedinstaff.getPositions();
            String posids = "";
            String poscateids = "";
            String dptids = "";
            String orgids = "";
            if (positions != null && positions.length > 0) {
                for (int i = 0; i < positions.length; i++) {
                    if (posids.equals("")) {
                        posids = positions[i].getId();
                    } else {
                        posids = posids + "#" + positions[i].getId();
                    }
                    if (poscateids.equals("")) {
                        poscateids = positions[i].getCategoryId();
                    } else {
                        poscateids = poscateids + "#" + positions[i].getCategoryId();
                    }
                    if (dptids.equals("")) {
                        dptids = positions[i].getCurrOwner();
                    } else {
                        dptids = dptids + "#" + positions[i].getCurrOwner();
                    }
                    if (orgids.equals("")) {
                        orgids = positions[i].getOwner();
                    } else {
                        orgids = orgids + "#" + positions[i].getOwner();
                    }
                }
//            } else {
//                Staff[] staff = loggedinstaff.getStaffships();
//                if (staff != null && staff.length > 0) {
//                    for (int i = 0; i < staff.length; i++) {
//                        if (orgids.equals("")) {
//                            orgids = positions[i].getOwner();
//                        } else {
//                            orgids = orgids + "#" + positions[i].getOwner();
//                        }
//                    }
//                }
            }
            urlParameters.add(new BasicNameValuePair("posids", posids));
            urlParameters.add(new BasicNameValuePair("poscateids", poscateids));
            urlParameters.add(new BasicNameValuePair("dptids", dptids));
            urlParameters.add(new BasicNameValuePair("orgids", orgids));
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

        } else if (api.equals("28")) {
            // search count of all application services by user Id.
            String url = API_DomainName + "/service2/api45";
            String posid = request.getParameter("posid");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("posid", posid));
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

        } else if (api.equals("29")) {
            // search all application services by user Id.
            String url = API_DomainName + "/service1/api29";
            String uid = request.getParameter("uid");
            String pageno = request.getParameter("pageno");
            String pagesize = request.getParameter("pagesize");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("uid", uid));
            urlParameters.add(new BasicNameValuePair("pageno", pageno));
            urlParameters.add(new BasicNameValuePair("pagesize", pagesize));

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

        } else if (api.equals("LL1")) {
            // get a released form from repository
            String url = API_DomainName + "/service9/api9";
            String id = request.getParameter("id");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("id", id));
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

        }else if (api.equals("30")) {
            // query invoice
            String url = API_DomainName + "/invoice/api2";
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("loginString", JSON.toJSONString(loggedinstaff)));
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

        }
        response.setCharacterEncoding("utf8");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(responseJson);
        out.close();
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
     * response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String api = request.getParameter("api");
        String responseJson = null;
        if (api.equals("LL3")) {
            // 在这里cmd含义代表着命令，也就是点了那个按钮
            // 0:保存;1:关闭;2:提交;3:退回;4:委托
            HttpPost httpPost = new HttpPost(API_DomainName + "/service14/api3");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String cmd = request.getParameter("cmd");
            String ip = request.getParameter("ip");
            String pid = request.getParameter("pid");
            String tid = request.getParameter("tid");
            String list = request.getParameter("list");
            urlParameters.add(new BasicNameValuePair("serverip", ip));
            urlParameters.add(new BasicNameValuePair("cmd", cmd));
            urlParameters.add(new BasicNameValuePair("pid", pid));
            urlParameters.add(new BasicNameValuePair("tid", tid));
            urlParameters.add(new BasicNameValuePair("userid", loggedinstaff.getUser().getId()));
            urlParameters.add(new BasicNameValuePair("fullname", loggedinstaff.getUser().getFullName()));
            urlParameters.add(new BasicNameValuePair("list", list));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("4")) {// return this task instance
            // 在这里cmd含义代表着命令，也就是点了那个按钮
            // 0:保存;1:关闭;2:提交;3:退回;4:委托
            HttpPost httpPost = new HttpPost(API_DomainName + "/service14/api4");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String cmd = "3";// 退回
            String ip = request.getParameter("ip");
            String pid = request.getParameter("pid");
            String tid = request.getParameter("tid");
            urlParameters.add(new BasicNameValuePair("serverip", ip));
            urlParameters.add(new BasicNameValuePair("cmd", cmd));
            urlParameters.add(new BasicNameValuePair("pid", pid));
            urlParameters.add(new BasicNameValuePair("tid", tid));
            urlParameters.add(new BasicNameValuePair("userid", loggedinstaff.getUser().getId()));
            urlParameters.add(new BasicNameValuePair("fullname", loggedinstaff.getUser().getFullName()));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("5")) {// reassign this task instance to others
            // save a process into build time repository
            HttpPost httpPost = new HttpPost(API_DomainName + "/service14/api4");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String cmd = "4";// 委托
            String ip = request.getParameter("ip");
            String pid = request.getParameter("pid");
            String tid = request.getParameter("tid");
            String newuserid = request.getParameter("newuserid");
            urlParameters.add(new BasicNameValuePair("serverip", ip));
            urlParameters.add(new BasicNameValuePair("cmd", cmd));
            urlParameters.add(new BasicNameValuePair("pid", pid));
            urlParameters.add(new BasicNameValuePair("tid", tid));
            urlParameters.add(new BasicNameValuePair("userid", loggedinstaff.getUser().getId()));
            urlParameters.add(new BasicNameValuePair("fullname", loggedinstaff.getUser().getFullName()));
            urlParameters.add(new BasicNameValuePair("newuserid", newuserid));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("LL7")) {// launch a new process instance
            HttpPost httpPost = new HttpPost(API_DomainName + "/service14/api7");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            // String token, String processid, String userid,
            // String userip, String useripv6, String longitude,
            // String latitude, String device, String paramvalues
            String pid = request.getParameter("pid");
            String list = request.getParameter("list");
            urlParameters.add(new BasicNameValuePair("token", token));
            urlParameters.add(new BasicNameValuePair("processid", pid));
            urlParameters.add(new BasicNameValuePair("userid", loggedinstaff.getUser().getId()));
            urlParameters.add(new BasicNameValuePair("userip", request.getRemoteAddr()));
            urlParameters.add(new BasicNameValuePair("useripv6", request.getRemoteAddr()));
            urlParameters.add(new BasicNameValuePair("longitude", "2"));
            urlParameters.add(new BasicNameValuePair("latitude", "3"));
            urlParameters.add(new BasicNameValuePair("device", "iphone10"));
            urlParameters.add(new BasicNameValuePair("paramvalues", list));
            urlParameters.add(new BasicNameValuePair("userfullname", loggedinstaff.getUser().getFullName()));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("9")) {
            // send User and update personal information
            HttpPost httpPost = new HttpPost(API_DomainName + "/service5/api10");
            String user = request.getParameter("user");
            List<BasicNameValuePair> urlParameters = new ArrayList<BasicNameValuePair>();
            urlParameters.add(new BasicNameValuePair("userinfo", user));

            try {
                HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
                httpPost.setEntity(postParams);
                response1 = httpClient.execute(httpPost);
                postParams = response1.getEntity();
                responseJson = EntityUtils.toString(postParams, "UTF-8").trim();
            } catch (ClientProtocolException e) {
                e.printStackTrace();
            } catch (UnsupportedEncodingException e1) {
                e1.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                httpClient.close();
                httpPost.abort();
            }
            // if (responseJson.equals("{\"status\": \"1\"}")) {
            // //注册成功，跳转到我的轩琦界面
            // ServletContext context =
            // getServletContext().getContext("/login");
            // context.getRequestDispatcher("/Authenticate").forward(request,
            // response);
            // responseJson = response.getContentType();
            // }

        } else if (api.equals("10")) {
            // check exist email, mobile, idNumber

            String urle = API_DomainName + "/service5/api6";
            String urlm = API_DomainName + "/service5/api7";
            String urln = API_DomainName + "/service5/api9";
            String email = request.getParameter("email");
            String mobile = request.getParameter("mobile");
            String idNumber = request.getParameter("idNumber");

            if (verify(urle, "email", email).equals("0")) {
                responseJson = "{\"email\": \"0\"";
            } else {
                responseJson = "{\"email\": \"1\"";
            }
            if (verify(urlm, "mobile", mobile).equals("0")) {
                responseJson += ",\"mobile\": \"0\"";
            } else {
                responseJson += ",\"mobile\": \"1\"";
            }
            if (verify(urln, "idNumber", idNumber).equals("0")) {
                responseJson += ",\"idNumber\": \"0\"}";
            } else {
                responseJson += ",\"idNumber\": \"1\"}";
            }
        } else if (api.equals("11")) {
            // 更新密码
            String mobile = request.getParameter("mobile");
            String password = request.getParameter("password");
            String token = SecretKeyUtil.getInstance().createKey();
            String sessiondata = MD5Util
                    .getMD5(token + mobile + "cloudbpm" + password + DateUtility.getCurrentDate());
            HttpPost httpPost = new HttpPost(API_DomainName + "/service5/api11");
            List<BasicNameValuePair> urlParameters = new ArrayList<BasicNameValuePair>();
            urlParameters.add(new BasicNameValuePair("mobile", mobile));
            urlParameters.add(new BasicNameValuePair("sessiondata", sessiondata));
            urlParameters.add(new BasicNameValuePair("password", password));
            urlParameters.add(new BasicNameValuePair("token", token));
            try {
                HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
                httpPost.setEntity(postParams);
                response1 = httpClient.execute(httpPost);
                postParams = response1.getEntity();
                responseJson = EntityUtils.toString(postParams, "UTF-8").trim();
            } catch (ClientProtocolException e) {
                e.printStackTrace();
            } catch (UnsupportedEncodingException e1) {
                e1.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                httpClient.close();
                httpPost.abort();
            }
        } else if (api.equals("12")) {
            // 添加评论
            HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api18");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String newsId = request.getParameter("newsId");
            String comment = request.getParameter("comment");
            urlParameters.add(new BasicNameValuePair("newsId", newsId));
            urlParameters.add(new BasicNameValuePair("comment", comment));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            if (response1.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
            }
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();

        } else if (api.equals("13")) {
            // 删除评论
            HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api19");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String newsId = request.getParameter("newsId");
            String commentId = request.getParameter("commentId");
            urlParameters.add(new BasicNameValuePair("newsId", newsId));
            urlParameters.add(new BasicNameValuePair("commentId", commentId));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            if (response1.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
            }
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("14")) {
            // 发送反馈邮件  feedback
            HttpPost httpPost = new HttpPost(API_DomainName + "/service7/api33");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String nickname = request.getParameter("nickname");
            String contactInformation = request.getParameter("contactInformation");
            String content = request.getParameter("content");
            String attachments = request.getParameter("attachments");
            urlParameters.add(new BasicNameValuePair("attachments", attachments));
            urlParameters.add(new BasicNameValuePair("nickname", nickname));
            urlParameters.add(new BasicNameValuePair("contactInformation", contactInformation));
            urlParameters.add(new BasicNameValuePair("content", content));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            if (response1.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
            }
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("15")) {
            // 添加二级评论
            HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api23");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String newsId = request.getParameter("newsId");
            String commentId = request.getParameter("commentId");
            String secondaryComment = request.getParameter("secondaryComment");
            urlParameters.add(new BasicNameValuePair("newsId", newsId));
            urlParameters.add(new BasicNameValuePair("commentId", commentId));
            urlParameters.add(new BasicNameValuePair("secondaryComment", secondaryComment));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            if (response1.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
            }
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();

        } else if (api.equals("16")) {
            // 删除二级评论
            HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api24");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String newsId = request.getParameter("newsId");
            String commentId = request.getParameter("commentId");
            String secondaryCommentId = request.getParameter("secondaryCommentId");
            urlParameters.add(new BasicNameValuePair("newsId", newsId));
            urlParameters.add(new BasicNameValuePair("commentId", commentId));
            urlParameters.add(new BasicNameValuePair("secondaryCommentId", secondaryCommentId));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            if (response1.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
            }
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("17")) {
            // 查询电子书
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String pageno = request.getParameter("pn");
            String pageSize = request.getParameter("psz");
            String cond = request.getParameter("cond");
            String userId = request.getParameter("userId");
            String type = request.getParameter("type");

            urlParameters.add(new BasicNameValuePair("pageNo", pageno));
            urlParameters.add(new BasicNameValuePair("pageSize", pageSize));
            urlParameters.add(new BasicNameValuePair("cond", cond));
            urlParameters.add(new BasicNameValuePair("userId", userId));
            urlParameters.add(new BasicNameValuePair("type", type));


            HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api20");
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("18")) {
            // 查询视频
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String pageno = request.getParameter("pn");
            String pageSize = request.getParameter("psz");
            String cond = request.getParameter("cond");
            String userId = request.getParameter("userId");
            String type = request.getParameter("type");

            urlParameters.add(new BasicNameValuePair("pageNo", pageno));
            urlParameters.add(new BasicNameValuePair("pageSize", pageSize));
            urlParameters.add(new BasicNameValuePair("cond", cond));
            urlParameters.add(new BasicNameValuePair("userId", userId));
            urlParameters.add(new BasicNameValuePair("type", type));


            HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api25");
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("19")) {
            // 查询音频
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String pageno = request.getParameter("pn");
            String pageSize = request.getParameter("psz");
            String cond = request.getParameter("cond");
            String userId = request.getParameter("userId");
            String type = request.getParameter("type");

            urlParameters.add(new BasicNameValuePair("pageNo", pageno));
            urlParameters.add(new BasicNameValuePair("pageSize", pageSize));
            urlParameters.add(new BasicNameValuePair("cond", cond));
            urlParameters.add(new BasicNameValuePair("userId", userId));
            urlParameters.add(new BasicNameValuePair("type", type));

            HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api21");
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("20")) {
            // 查询直播
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String pageno = request.getParameter("pn");
            String pageSize = request.getParameter("psz");
            String cond = request.getParameter("cond");
            String userId = request.getParameter("userId");
            String type = request.getParameter("type");

            urlParameters.add(new BasicNameValuePair("pageNo", pageno));
            urlParameters.add(new BasicNameValuePair("pageSize", pageSize));
            urlParameters.add(new BasicNameValuePair("cond", cond));
            urlParameters.add(new BasicNameValuePair("userId", userId));
            urlParameters.add(new BasicNameValuePair("type", type));

            HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api22");
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("22")) {
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
//            String id = request.getParameter("id");

            urlParameters.add(new BasicNameValuePair("productId", "0000000001"));
            urlParameters.add(new BasicNameValuePair("loginString", JSON.toJSONString(loggedinstaff)));

            HttpPost httpPost = new HttpPost(API_DomainName + "/wxPay/api0");
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("23")) {
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String orderId = request.getParameter("orderId");

            urlParameters.add(new BasicNameValuePair("orderId", orderId));
            // urlParameters.add(new BasicNameValuePair("loginString",JSON.toJSONString(loggedinstaff)));

            HttpPost httpPost = new HttpPost(API_DomainName + "/wxPay/api4");
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("24")) {
            //complet order
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("loginString", JSON.toJSONString(loggedinstaff)));

            HttpPost httpPost = new HttpPost(API_DomainName + "/wxPay/api5");
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("25")) {
            //shopping car
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("loginString", JSON.toJSONString(loggedinstaff)));

            HttpPost httpPost = new HttpPost(API_DomainName + "/wxPay/api6");
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("26")) {
            //add shopping car
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("loginString", JSON.toJSONString(loggedinstaff)));

            HttpPost httpPost = new HttpPost(API_DomainName + "/wxPay/api7");
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("27")) {
            //shopping car
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String id = request.getParameter("productId");
            urlParameters.add(new BasicNameValuePair("productId", id));
            urlParameters.add(new BasicNameValuePair("loginString", JSON.toJSONString(loggedinstaff)));

            HttpPost httpPost = new HttpPost(API_DomainName + "/wxPay/api8");
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        }else if (api.equals("28")) {
            //apply invoice
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String data = request.getParameter("data");
            String userId = request.getParameter("userId");
            String orderId = request.getParameter("orderId");
            urlParameters.add(new BasicNameValuePair("data", data));
            urlParameters.add(new BasicNameValuePair("userId", userId));
            urlParameters.add(new BasicNameValuePair("orderId", orderId));
//            urlParameters.add(new BasicNameValuePair("loginString", JSON.toJSONString(loggedinstaff)));
            HttpPost httpPost = new HttpPost(API_DomainName + "/invoice/api1");
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        }

        response.setCharacterEncoding("utf8");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(responseJson);
        out.close();
    }

    protected String verify(String url, String field, String value)
            throws ParseException, UnsupportedEncodingException, IOException {
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response = null;
        String exitfield = null;
        List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
        urlParameters.add(new BasicNameValuePair(field, value));
        String str = EntityUtils.toString(new UrlEncodedFormEntity(urlParameters, "utf-8"));
        // check field
        HttpGet httpGet = new HttpGet(url);
        try {
            httpGet.setURI(new URI(httpGet.getURI().toString() + "?" + str));
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        response = httpClient.execute(httpGet);
        if (response.getStatusLine().getStatusCode() != 200) {
            throw new RuntimeException("Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
        }
        HttpEntity entity = response.getEntity();
        exitfield = EntityUtils.toString(entity, "UTF-8").trim();
        httpClient.close();
        httpGet.abort();
        response.close();
        return exitfield;
    }

}
