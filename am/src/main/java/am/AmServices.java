package am;

import com.alibaba.fastjson.JSON;
import com.cloud.core.session.redis.JedisUtil;
import com.cloudibpm.core.session.utils.SessionUtils;
import com.cloudibpm.core.user.Login;
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
 * Servlet implementation class AmServices
 */
@WebServlet("/AmServices")
public class AmServices extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Login loggedinstaff = null;
    //	private static final String API_DomainName = "http://localhost:8080/api";
    private static String API_DomainName = null;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public AmServices() {
        super();
    }

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

        // get organization list for application service management tree viewer
        if (api.equals("0")) {
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
            String url = API_DomainName + "/service7/api0";
            HttpPost httpPost = new HttpPost(url);
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
        } else if (api.equals("3")) { // check if there is duplicated names.
            String url = API_DomainName + "/service7/api3";
            String name = request.getParameter("name");
            String type = request.getParameter("type");
            String owner = request.getParameter("owner");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("name", name));
            urlParameters.add(new BasicNameValuePair("type", type));
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
        } else if (api.equals("5")) { // get one sms template
            String url = API_DomainName + "/service7/api5";
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
        } else if (api.equals("6")) { // get one email template
            String url = API_DomainName + "/service7/api6";
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
        } else if (api.equals("9")) { // get one Java application service by ID
            String url = API_DomainName + "/service7/api9";
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
        } else if (api.equals("10")) { // get one Jar file content
            String url = API_DomainName + "/service7/api10";
            String jf = request.getParameter("jf");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("jarfile", jf));
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
        } else if (api.equals("13")) { // get one Java class
            String url = API_DomainName + "/service7/api13";
            String id = request.getParameter("id");
            String je = request.getParameter("je");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("id", id));
            urlParameters.add(new BasicNameValuePair("javaentry", je));
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
        } else if (api.equals("15")) { // get one web application service object
            String url = API_DomainName + "/service7/api15";
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
        } else if (api.equals("17")) { // get access controls by app service Id
            String url = API_DomainName + "/service8/api0";
            String condition = request.getParameter("cond");
            String appid = request.getParameter("appid");
            String pn = request.getParameter("pn");
            String psz = request.getParameter("psz");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("condition", condition));
            urlParameters.add(new BasicNameValuePair("appid", appid));
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
        } else if (api.equals("18")) {
            // get access controls by app service Id for enditing
            String url = API_DomainName + "/service8/api1";
            String appid = request.getParameter("appid");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("appid", appid));

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

        } else if (api.equals("20")) {
            // get access controls by app service Id for enditing
            String url = API_DomainName + "/service8/api3";
            String appid = request.getParameter("appid");
            String condition = request.getParameter("cond");
            String ownerid = request.getParameter("ownerid");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("appid", appid));
            urlParameters.add(new BasicNameValuePair("condition", condition));
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
        } else if (api.equals("21")) {
            String url = API_DomainName + "/service18/api1";
            String type = request.getParameter("type");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("type", type));
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
        } else if (api.equals("22")) {
            String url = API_DomainName + "/service18/api2";
            String cid = request.getParameter("id");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("cid", cid));
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
            String url = API_DomainName + "/service18/api3";
            String oid = request.getParameter("oid");
            String cid = request.getParameter("cid");
            String name = request.getParameter("name");
            String tag = request.getParameter("tag");
            String port = request.getParameter("port");
            String type = request.getParameter("type");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("oid", oid));
            urlParameters.add(new BasicNameValuePair("cid", cid));
            urlParameters.add(new BasicNameValuePair("name", name));
            urlParameters.add(new BasicNameValuePair("tag", tag));
            urlParameters.add(new BasicNameValuePair("port", port));
            urlParameters.add(new BasicNameValuePair("type", type));
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
            String url = API_DomainName + "/service18/api4";
            String containerID = request.getParameter("containerId");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("containerID", containerID));
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
        } else if (api.equals("25")) {
            String url = API_DomainName + "/service18/api5";
            String containerId = request.getParameter("containerId");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("containerId", containerId));
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
        } else if (api.equals("26")) {
            String url = API_DomainName + "/service18/api6";
            String containerId = request.getParameter("containerId");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("containerId", containerId));
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
        } else if (api.equals("27")) {
            String url = API_DomainName + "/service18/api7";
            HttpGet httpGet = new HttpGet(url);
            response1 = httpClient.execute(httpGet);
            if (response1.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
            }
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpGet.abort();
        } else if (api.equals("28")) {
            String oid = request.getParameter("oid");
            String cid = request.getParameter("cid");
            String childFile = request.getParameter("childFile");
            String url = API_DomainName + "/service18/api9";
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("oid", oid));
            urlParameters.add(new BasicNameValuePair("cid", cid));
            urlParameters.add(new BasicNameValuePair("childFile", childFile));
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
        } else if (api.equals("30")) {
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

        } else if (api.equals("SN1")) {
            // note: how to add service here
            // get all approval logs
            String url = API_DomainName + "/service29/api0";
            String condition = request.getParameter("cond");
            String pn = request.getParameter("pn");
            String psz = request.getParameter("psz");
            String objectid = request.getParameter("objectid");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("condition", condition));
            urlParameters.add(new BasicNameValuePair("pageno", pn));
            urlParameters.add(new BasicNameValuePair("pagesize", psz));
            urlParameters.add(new BasicNameValuePair("objectid", objectid));

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


        if (api.equals("4")) {
            // create a SMS/email template/service container/micro-service/android plugin service
            HttpPost httpPost = new HttpPost(API_DomainName + "/service7/api4");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String appobj = request.getParameter("appobj");
            urlParameters.add(new BasicNameValuePair("jsonobj", appobj));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("7")) { // save a SMS template
            HttpPost httpPost = new HttpPost(API_DomainName + "/service7/api7");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String template = request.getParameter("t");
            urlParameters.add(new BasicNameValuePair("template", template));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("8")) { // save an email template
            HttpPost httpPost = new HttpPost(API_DomainName + "/service7/api8");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String template = request.getParameter("t");
            urlParameters.add(new BasicNameValuePair("template", template));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("12")) { // delete a file from Java application
            // libs
            HttpPost httpPost = new HttpPost(API_DomainName + "/service7/api12");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String id = request.getParameter("id");
            String filename = request.getParameter("fn");
            urlParameters.add(new BasicNameValuePair("id", id));
            urlParameters.add(new BasicNameValuePair("filename", filename));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("14")) {
            // publish a micro-service to online or withdraw for offlince
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String id = request.getParameter("id");
            String status = request.getParameter("d");
            String lastupdate = request.getParameter("lastupdate");
            String owner = request.getParameter("owner");
            String userId = request.getParameter("userId");
            String userfullname = request.getParameter("userfullname");
            String ownername = request.getParameter("ownername");
            String comment = request.getParameter("comment");

            urlParameters.add(new BasicNameValuePair("wid", id));
            urlParameters.add(new BasicNameValuePair("status", status));
            urlParameters.add(new BasicNameValuePair("lastupdate", lastupdate));
            urlParameters.add(new BasicNameValuePair("comment", comment));
            urlParameters.add(new BasicNameValuePair("owner", owner));
            urlParameters.add(new BasicNameValuePair("userId", userId));
            urlParameters.add(new BasicNameValuePair("userfullname", userfullname));
            urlParameters.add(new BasicNameValuePair("ownername", ownername));

            HttpPost httpPost = new HttpPost(API_DomainName + "/service7/api24");
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("16")) {
            // save an Web app service with parameters
            HttpPost httpPost = new HttpPost(API_DomainName + "/service7/api16");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String t = request.getParameter("t");
            urlParameters.add(new BasicNameValuePair("webappservice", t));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("19")) { // delete one access control record.
            HttpPost httpPost = new HttpPost(API_DomainName + "/service8/api2");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String appid = request.getParameter("appid");
            String orgid = request.getParameter("orgid");
            urlParameters.add(new BasicNameValuePair("appid", appid));
            urlParameters.add(new BasicNameValuePair("orgid", orgid));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("21")) { // save a control
            HttpPost httpPost = new HttpPost(API_DomainName + "/service8/api4");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String controls = request.getParameter("acs");
            urlParameters.add(new BasicNameValuePair("acs", controls));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("22")) {
            HttpPost httpPost = new HttpPost(API_DomainName + "/service18/api8");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String container = request.getParameter("t");
            urlParameters.add(new BasicNameValuePair("container", container));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("23")) {
            // delete one wfprocess object
            HttpPost httpPost = new HttpPost(API_DomainName + "/service7/api19");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String id = request.getParameter("id");
            String etype = request.getParameter("etype");
            String oid = request.getParameter("oid");
            urlParameters.add(new BasicNameValuePair("id", id));
            urlParameters.add(new BasicNameValuePair("etype", etype));
            urlParameters.add(new BasicNameValuePair("owner", oid));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("24")) {
            // rename folder or object
            HttpPost httpPost = new HttpPost(API_DomainName + "/service7/api20");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String id = request.getParameter("id");
            String ename = request.getParameter("ename");
            String ctype = request.getParameter("ctype");
            String date = request.getParameter("lastupdate");
            urlParameters.add(new BasicNameValuePair("id", id));
            urlParameters.add(new BasicNameValuePair("entityname", ename));
            urlParameters.add(new BasicNameValuePair("etype", ctype));
            urlParameters.add(new BasicNameValuePair("lastupdate", date));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("25")) {
            // update email or sms template status for release or withdraw
            HttpPost httpPost = new HttpPost(API_DomainName + "/service7/api21");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String id = request.getParameter("id");
            String status = request.getParameter("status");
            String ctype = request.getParameter("ctype");
            String date = request.getParameter("lastupdate");
            urlParameters.add(new BasicNameValuePair("id", id));
            urlParameters.add(new BasicNameValuePair("status", status));
            urlParameters.add(new BasicNameValuePair("etype", ctype));
            urlParameters.add(new BasicNameValuePair("lastupdate", date));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("26")) {
            // send a sms to "to" mobile number for testing.
            HttpPost httpPost = new HttpPost(API_DomainName + "/service7/api22");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String id = request.getParameter("id");
            String to = request.getParameter("to");
            String content = request.getParameter("content");
            urlParameters.add(new BasicNameValuePair("id", id));
            urlParameters.add(new BasicNameValuePair("to", to));
            urlParameters.add(new BasicNameValuePair("content", content));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("27")) {
            // send a email to "to" email address for testing.
            HttpPost httpPost = new HttpPost(API_DomainName + "/service7/api23");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String oid = request.getParameter("oid");
            String id = request.getParameter("id");
            String to = request.getParameter("to");
            String subj = request.getParameter("subj");
            String content = request.getParameter("content");
            urlParameters.add(new BasicNameValuePair("oid", oid));
            urlParameters.add(new BasicNameValuePair("id", id));
            urlParameters.add(new BasicNameValuePair("to", to));
            urlParameters.add(new BasicNameValuePair("subject", subj));
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
        } else if (api.equals("28")) {
            // send a email to "to" email address for testing.
            HttpPost httpPost = new HttpPost(API_DomainName + "/service18/api10");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String path = request.getParameter("path");
            urlParameters.add(new BasicNameValuePair("path", path));
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
        } else if (api.equals("29")) {
            HttpPost httpPost = new HttpPost(API_DomainName + "/service18/api13");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String Cid = request.getParameter("cid");
            String Oid = request.getParameter("oid");
            String type = request.getParameter("type");
            urlParameters.add(new BasicNameValuePair("ownerId", Oid));
            urlParameters.add(new BasicNameValuePair("serverId", Cid));
            urlParameters.add(new BasicNameValuePair("type", type));
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
        } else if (api.equals("31")) {
            // publish a micro-service to online or withdraw for offlince
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String id = request.getParameter("id");
            String status = request.getParameter("d");
            String lastupdate = request.getParameter("lastupdate");
            String owner = request.getParameter("owner");
            String userId = request.getParameter("userId");
            String userfullname = request.getParameter("userfullname");
            String ownername = request.getParameter("ownername");
            String comment = request.getParameter("comment");

            urlParameters.add(new BasicNameValuePair("wid", id));
            urlParameters.add(new BasicNameValuePair("status", status));
            urlParameters.add(new BasicNameValuePair("lastupdate", lastupdate));
            urlParameters.add(new BasicNameValuePair("comment", comment));
            urlParameters.add(new BasicNameValuePair("owner", owner));
            urlParameters.add(new BasicNameValuePair("userId", userId));
            urlParameters.add(new BasicNameValuePair("userfullname", userfullname));
            urlParameters.add(new BasicNameValuePair("ownername", ownername));

            HttpPost httpPost = new HttpPost(API_DomainName + "/service7/api28");
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("32")) {
            // save an android plugin to storage
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String plugin = request.getParameter("t");
            urlParameters.add(new BasicNameValuePair("plugin", plugin));

            HttpPost httpPost = new HttpPost(API_DomainName + "/service7/api32");
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

}
