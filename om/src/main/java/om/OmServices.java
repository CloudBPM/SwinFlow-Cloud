package om;

import com.alibaba.fastjson.JSON;
import com.cloud.core.session.redis.JedisUtil;
import com.cloudibpm.core.session.utils.SessionUtils;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.Staff;
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

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

/**
 * Servlet implementation class OmServices
 */
@WebServlet("/OmServices")
public class OmServices extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Login loggedinstaff = null;
    //	private static final String API_DomainName = "http://localhost:8080/api";
    private static String API_DomainName = null;

    /**
     * @see HttpServlet#service(HttpServletRequest request, HttpServletResponse
     * response)
     */
    protected void service(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
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

        if (api.equals("0")) {
            // get organization list for organization tree viewer
            StringBuffer ids = new StringBuffer();
            if (loggedinstaff.getStaffships() != null && loggedinstaff.getStaffships().length > 0) {
                for (int i = 0; i < loggedinstaff.getStaffships().length; i++) {
                    ids.append(loggedinstaff.getStaffships()[i].getOwner());
                    if (i < loggedinstaff.getStaffships().length - 1) {
                        ids.append(";");
                    }
                }
            }
            String id = ids.toString();
            if (id.indexOf("00000000000001R") >= 0) {
                id = "00000000000001R";
            }
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api0");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("ids", id));
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
        } else if (api.equals("1")) {
            // get new ID and serial number for an organization component
            // object.
            String url = API_DomainName + "/service2/api1";
            HttpGet httpGet = new HttpGet(url);
            response1 = httpClient.execute(httpGet);
            if (response1.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
            }
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpGet.abort();
        } else if (api.equals("2")) {
            // get new ID for an organization component object.
            String url = API_DomainName + "/service2/api2";
            HttpGet httpGet = new HttpGet(url);
            response1 = httpClient.execute(httpGet);
            if (response1.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
            }
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpGet.abort();
        } else if (api.equals("3")) {
            // get an organization object by ID
            String url = API_DomainName + "/service2/api3";
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
        } else if (api.equals("4")) { // get an department object by ID.
            String url = API_DomainName + "/service2/api4";
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
        } else if (api.equals("5")) { // get an division object by ID.
            String url = API_DomainName + "/service2/api5";
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
        } else if (api.equals("6")) { // get an project team object by ID.
            String url = API_DomainName + "/service2/api6";
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
        } else if (api.equals("11")) {
            // get all staff list by owner id with condition.
            String url = API_DomainName + "/service5/api0";
            String condition = request.getParameter("cond");
            String ownerid = request.getParameter("ownid");
            String pn = request.getParameter("pn");
            String psz = request.getParameter("psz");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("condition", condition));
            urlParameters.add(new BasicNameValuePair("ownerid", ownerid));
            urlParameters.add(new BasicNameValuePair("pageno", pn));
            urlParameters.add(new BasicNameValuePair("pagesize", psz));

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
            // check whether a user id number is in the repository.
            String url = API_DomainName + "/service5/api1";
            String idnumber = request.getParameter("idnumber");
            String numbertype = request.getParameter("numbertype");
            String ownerid = request.getParameter("ownerid");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("idnumber", idnumber));
            urlParameters.add(new BasicNameValuePair("ownerid", ownerid));
            urlParameters.add(new BasicNameValuePair("numbertype", numbertype));
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
        } else if (api.equals("14")) {
            // check whether a user name is in the repository.
            String url = API_DomainName + "/service5/api3";
            String acc = request.getParameter("acc");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("username", acc));
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
        } else if (api.equals("16")) { // get all user login history
            String url = API_DomainName + "/service5/api5";
            String uid = request.getParameter("uid");
            String pn = request.getParameter("pn");
            String psz = request.getParameter("psz");
            // String cond = request.getParameter("cond"); // query conditions
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("userid", uid));
            urlParameters.add(new BasicNameValuePair("pageno", pn));
            urlParameters.add(new BasicNameValuePair("pagesize", psz));
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
        } else if (api.equals("17")) { // get all authority groups
            String url = API_DomainName + "/service6/api0";
            String condition = request.getParameter("cond");
            String ownerid = request.getParameter("ownid");
            String pn = request.getParameter("pn");
            String psz = request.getParameter("psz");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("condition", condition));
            urlParameters.add(new BasicNameValuePair("ownerid", ownerid));
            urlParameters.add(new BasicNameValuePair("pageno", pn));
            urlParameters.add(new BasicNameValuePair("pagesize", psz));

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
        } else if (api.equals("18")) { // get all authority group members
            String url = API_DomainName + "/service6/api1";
            String condition = request.getParameter("cond");
            String groupid = request.getParameter("grpid");
            String pn = request.getParameter("pn");
            String psz = request.getParameter("psz");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("condition", condition));
            urlParameters.add(new BasicNameValuePair("groupid", groupid));
            urlParameters.add(new BasicNameValuePair("pageno", pn));
            urlParameters.add(new BasicNameValuePair("pagesize", psz));

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
        } else if (api.equals("20")) { // get all authority in Cloud BPM
            String url = API_DomainName + "/service6/api2";
            HttpGet httpGet = new HttpGet(url);
            try {
                httpGet.setURI(new URI(httpGet.getURI().toString()));
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
        } else if (api.equals("21")) {
            // get an authority group member edit list
            String url = API_DomainName + "/service6/api4";
            String groupid = request.getParameter("grpid");
            String owner = request.getParameter("owner");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("groupid", groupid));
            urlParameters.add(new BasicNameValuePair("owner", owner));
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
        } else if (api.equals("23")) {
            // get the job assignments for a position or role
            String url = API_DomainName + "/service2/api11";
            String positionid = request.getParameter("positionid");
            String oid = request.getParameter("owner");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("positionid", positionid));
            urlParameters.add(new BasicNameValuePair("owner", oid));
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
        } else if (api.equals("24")) {
            // get a position or project role member edit list
            String url = API_DomainName + "/service2/api12";
            String prid = request.getParameter("prid");
            String oid = request.getParameter("owner");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("positionid", prid));
            urlParameters.add(new BasicNameValuePair("owner", oid));
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
//        } else if (api.equals("26")) {
//            // get organizationPage
//            String url = API_DomainName + "/service2/api18";
//            String orgId = request.getParameter("orgId");
//            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
//            urlParameters.add(new BasicNameValuePair("orgId", orgId));
//            String str = EntityUtils.toString(new UrlEncodedFormEntity(urlParameters, "utf-8"));
//
//            HttpGet httpGet = new HttpGet(url);
//            try {
//                httpGet.setURI(new URI(httpGet.getURI().toString() + "?" + str));
//            } catch (URISyntaxException e) {
//                e.printStackTrace();
//            }
//            response1 = httpClient.execute(httpGet);
//            if (response1.getStatusLine().getStatusCode() != 200) {
//                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
//            }
//            HttpEntity entity = response1.getEntity();
//            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
//            httpClient.close();
//            httpGet.abort();
        } else if (api.equals("29")) {
            // get organization list for organization tree viewer
            String oid = request.getParameter("oid");
            System.err.println(oid);
            System.err.println("===");
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api22");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("oid", oid));
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
        } else if (api.equals("30")) {
            // check duplicated category name
            String url = API_DomainName + "/service30/api0";
            String name = request.getParameter("name");
            String oid = request.getParameter("owner");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("name", name));
            urlParameters.add(new BasicNameValuePair("owner", oid));
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
        } else if (api.equals("34")) {
            // check duplicated category name
            String url = API_DomainName + "/service30/api4";
            String ownerid = request.getParameter("oid");
            String categorytype = request.getParameter("ftype");
            String parentid = request.getParameter("prtid");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("parentid", parentid));
            urlParameters.add(new BasicNameValuePair("categorytype", categorytype));
            urlParameters.add(new BasicNameValuePair("ownerid", ownerid));
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
        } else if (api.equals("38")) {
            // get category by Id
            String url = API_DomainName + "/service30/api7";
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("id", request.getParameter("cateid")));
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
        } else if (api.equals("39")) {
            // get all categories by orgId and catetype;
            String url = API_DomainName + "/service30/api9";
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("catetype", request.getParameter("catetype")));
            urlParameters.add(new BasicNameValuePair("owner", request.getParameter("owner")));
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
        } else if (api.equals("40")) {
            // search available external application service interface.
            String url = API_DomainName + "/service7/api17";
            String appid = request.getParameter("appid");
            String condition = request.getParameter("cond");
            String ownerid = request.getParameter("ownerid");
            String apptype = request.getParameter("apptype");
            String pageno = request.getParameter("pageno");
            String pagesize = request.getParameter("pagesize");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("appid", appid));
            urlParameters.add(new BasicNameValuePair("apptype", apptype));
            urlParameters.add(new BasicNameValuePair("cond", condition));
            urlParameters.add(new BasicNameValuePair("ownerid", ownerid));
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
        } else if (api.equals("41")) {
            // get a position list from current BPM repository
            String url = API_DomainName + "/service7/api1";
            String id = request.getParameter("appid");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("appid", id));
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
        } else if (api.equals("42")) {
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
            // search available application service in application store.
            String url = API_DomainName + "/service1/api28";

            String appid = request.getParameter("pid");
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

        } else if (api.equals("43")) {
            String id = request.getParameter("id");
            String url = API_DomainName + "/service7/api29";
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

        } else if (api.equals("60")) {
            // get new ID for an organization component object.
            String url = API_DomainName + "/service9/api18";
            String idnum = request.getParameter("num");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("idnum", idnum));
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

        } else if (api.equals("SN0")) {
            String url = API_DomainName + "/service28/api0";
            HttpGet httpGet = new HttpGet(url);
            try {
                httpGet.setURI(new URI(httpGet.getURI().toString()));
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

        } else if (api.equals("LL0")) {
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
        request.setCharacterEncoding("UTF-8");
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String api = request.getParameter("api");
        String org = request.getParameter("org");
        String responseJson = null;

        if (api.equals("LL3")) { // submit a single-participant workflow

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

        } else if (api.equals("LL7")) { // submit a multiple-participant workflow

            HttpPost httpPost = new HttpPost(API_DomainName + "/service14/api7");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            // String token, String processid, String userid,
            // String userip, String useripv6, String longitude,
            // String latitude, String device, String paramvalues
            String pid = request.getParameter("pid");
            String list = request.getParameter("list");
            urlParameters.add(new BasicNameValuePair("token", ""));
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

        } else if (api.equals("7")) {// save organizations
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api7");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("org", org));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("8")) {// save department
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api8");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("depart", org));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("9")) {// save division
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api9");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("div", org));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("10")) {// save project team
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api10");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("team", org));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("13")) { // create and save new staff.
            HttpPost httpPost = new HttpPost(API_DomainName + "/service5/api2");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String staff = request.getParameter("staff");
            String newone = request.getParameter("newone");
            urlParameters.add(new BasicNameValuePair("strStaff", staff));
            urlParameters.add(new BasicNameValuePair("newone", newone));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("15")) { // save a staff array (multiple staffs)
            HttpPost httpPost = new HttpPost(API_DomainName + "/service5/api4");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String staffs = request.getParameter("org");
            urlParameters.add(new BasicNameValuePair("staffs", staffs));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("19")) { // save one group.
            HttpPost httpPost = new HttpPost(API_DomainName + "/service6/api3");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String group = request.getParameter("group");
            urlParameters.add(new BasicNameValuePair("group", group));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("22")) {
            // save for editing authority group members.
            HttpPost httpPost = new HttpPost(API_DomainName + "/service6/api5");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String editlist = request.getParameter("editlist");
            urlParameters.add(new BasicNameValuePair("editlist", editlist));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("25")) {
            // save for editing authority group members.
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api13");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String editlist = request.getParameter("editlist");
            urlParameters.add(new BasicNameValuePair("editlist", editlist));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
//        } else if (api.equals("28")) {
//            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api19");
//            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
//            String strPage = request.getParameter("org");
//            urlParameters.add(new BasicNameValuePair("str", strPage));
//            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
//            httpPost.setEntity(postParams);
//            response1 = httpClient.execute(httpPost);
//            HttpEntity entity = response1.getEntity();
//            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
//            httpClient.close();
//            httpPost.abort();
        } else if (api.equals("31")) { // 创建一个日历
            HttpPost httpPost = new HttpPost(API_DomainName + "/service30/api1");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String ename = request.getParameter("ename");
            String owner = request.getParameter("owner");
            String parentid = request.getParameter("pid");
            String type = request.getParameter("type");
            String currowner = request.getParameter("currowner");
            urlParameters.add(new BasicNameValuePair("name", ename));
            urlParameters.add(new BasicNameValuePair("ownerid", owner));
            urlParameters.add(new BasicNameValuePair("parentid", parentid));
            urlParameters.add(new BasicNameValuePair("type", type));
            urlParameters.add(new BasicNameValuePair("currowner", currowner));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("32")) {
            HttpPost httpPost = new HttpPost(API_DomainName + "/service30/api2");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String ids = request.getParameter("ids");
            urlParameters.add(new BasicNameValuePair("ids", ids));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("33")) {
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("id", request.getParameter("id")));
            urlParameters.add(new BasicNameValuePair("entityname", request.getParameter("entityname")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service30/api3");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("35")) { // copy category object
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("rootid", request.getParameter("rid")));
            urlParameters.add(new BasicNameValuePair("childrenids", request.getParameter("pid")));
            urlParameters.add(new BasicNameValuePair("targetid", request.getParameter("fid")));
            urlParameters.add(new BasicNameValuePair("categorytype", request.getParameter("type")));
            urlParameters.add(new BasicNameValuePair("currowner", request.getParameter("cowner")));
            urlParameters.add(new BasicNameValuePair("owner", request.getParameter("orgid")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service30/api5");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("36")) { // move category object
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("sourceid", request.getParameter("rid")));
            urlParameters.add(new BasicNameValuePair("targetid", request.getParameter("fid")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service30/api6");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("37")) { // save category object
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("category", request.getParameter("org")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service30/api8");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("38")) { // 得到联系人列表
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("orgId", request.getParameter("orgId")));
            urlParameters.add(new BasicNameValuePair("userId", request.getParameter("userId")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api23");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("39")) { // 查询聊天记录
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("senderId", request.getParameter("senderId")));
            urlParameters.add(new BasicNameValuePair("receiverId", loggedinstaff.getUser().getId()));
            urlParameters.add(new BasicNameValuePair("lastTime", request.getParameter("lastTime")));

            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api24");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("40")) { // 查询会话列表
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("userId", loggedinstaff.getUser().getId()));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api25");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("41")) { // 设置我和他之间的消息状态为已读
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("userId", loggedinstaff.getUser().getId()));
            urlParameters.add(new BasicNameValuePair("receiverId", request.getParameter("receiverId")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api26");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("44")) {
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("info", request.getParameter("info")));
            System.out.println(request.getParameter("info"));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api28");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        }else if (api.equals("46")) { //设置某一天是否是工作日
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("officeDay", request.getParameter("officeDay")));
            System.out.println(request.getParameter("officeDay"));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api30");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("47")) { //设置周几对应的工作时间段  8:00-12:00
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("formTime", request.getParameter("formTime")));
            urlParameters.add(new BasicNameValuePair("toTime", request.getParameter("toTime")));
            urlParameters.add(new BasicNameValuePair("parentId", request.getParameter("parentId")));
            urlParameters.add(new BasicNameValuePair("oid", request.getParameter("oid")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api31");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("48")) { //设置某一天是否是假期
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("htime", request.getParameter("htime")));
            urlParameters.add(new BasicNameValuePair("oid", request.getParameter("oid")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api32");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("49")) { //查看某一天是否是假期
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("date", request.getParameter("date")));
            urlParameters.add(new BasicNameValuePair("parentId", request.getParameter("parentId")));
            urlParameters.add(new BasicNameValuePair("ownerId", request.getParameter("ownerId")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api33");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("50")) { //列出某个日历下星期列表
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("calenderId", request.getParameter("calenderId")));
            urlParameters.add(new BasicNameValuePair("ownerId", request.getParameter("ownerId")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api34");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("51")) { //列出某个公司下假期表数据
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("ownerId", request.getParameter("oid")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api35");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        }else if (api.equals("52")) { //删除某个公司下假期表中某个数据
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("ownerId", request.getParameter("oid")));
            urlParameters.add(new BasicNameValuePair("holidayId", request.getParameter("hid")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api36");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        }else if (api.equals("53")) { //条件搜索假期表数据
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("startTime", request.getParameter("startTime")));
            urlParameters.add(new BasicNameValuePair("toTime", request.getParameter("toTime")));
            urlParameters.add(new BasicNameValuePair("oid", request.getParameter("oid")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api37");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("54")) { //查询日历对应的周期
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("cid", request.getParameter("cid")));
            urlParameters.add(new BasicNameValuePair("oid", request.getParameter("oid")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api38");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        }else if (api.equals("55")) { //根据日历周期id  周一id 查询周一对应时间段
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("officeDayId", request.getParameter("officeDayId")));
            urlParameters.add(new BasicNameValuePair("oid", request.getParameter("oid")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api39");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        }else if (api.equals("56")) { //查询日历下周一对应的时间段
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("cid", request.getParameter("cid")));
            urlParameters.add(new BasicNameValuePair("oid", request.getParameter("oid")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api40");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        }else if (api.equals("57")) { //根据时间段id删除对应时间段
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("pid", request.getParameter("pid")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api41");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("58")) { //重命名日历 根据日历id
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("cid", request.getParameter("cid")));
            urlParameters.add(new BasicNameValuePair("cname", request.getParameter("cname")));
            urlParameters.add(new BasicNameValuePair("oid", request.getParameter("oid")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api42");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        }else if (api.equals("59")) { //根据日历id 删除id  并删除对应周期和时间段
           List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("cid", request.getParameter("cid")));
            urlParameters.add(new BasicNameValuePair("oid", request.getParameter("oid")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api43");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        }
        else if (api.equals("60")) { //查询公司下所有日历
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("oid", request.getParameter("oid")));
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api44");
            httpPost.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        }

        if (response1.getStatusLine().getStatusCode() != 200) {
            throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
        }

        response.setCharacterEncoding("utf8");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(responseJson);
        out.close();
    }

}
