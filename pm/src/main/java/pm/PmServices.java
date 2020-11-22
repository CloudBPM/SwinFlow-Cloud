package pm;

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
 * Servlet implementation class PmServices
 */
@WebServlet("/PmServices")
public class PmServices extends HttpServlet {
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
//        API_DomainName=request.getScheme() + "://" + request.getServerName() + ":8088/api";
        API_DomainName="http://localhost:8088/api";
        String sessionId= SessionUtils.getInstance().getSessionId(request);
        if(sessionId!=null){
            loggedinstaff= JSON.parseObject(JedisUtil.getInstance().get(sessionId),Login.class);
        }
        if(loggedinstaff==null){
            returnErrorMsg(request, response);
        }
        super.service(request, response);
    }

    private void returnErrorMsg(HttpServletRequest request, HttpServletResponse response) throws IOException {
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
        if (api.equals("0")) {// get organization list for process tree viewer
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
            String url = API_DomainName + "/service1/api0";
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
        } else if (api.equals("1")) {
            // get new ID and serial number for an process component object.
            String url = API_DomainName + "/service1/api1";
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
            // get new ID for an process component object.
            String url = API_DomainName + "/service1/api2";
            HttpGet httpGet = new HttpGet(url);
            response1 = httpClient.execute(httpGet);
            if (response1.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
            }
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpGet.abort();
        } else if (api.equals("6")) {
            // get a process object build time repository
            String url = API_DomainName + "/service1/api6";
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
        } else if (api.equals("9")) {// unused
            // get a process list from build time repository
            // (it will be used on system task setting)
            String url = API_DomainName + "/service1/api9";
            String ownerid = request.getParameter("oid");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
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
        } else if (api.equals("10")) {
            // get a process list from build time repository
            // (it will be used in )
            String url = API_DomainName + "/service7/api0";
            String ownerid = request.getParameter("oid");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
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
        } else if (api.equals("11")) {
            String url = API_DomainName + "/service2/api14";
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String ownerid = request.getParameter("oid");
            urlParameters.add(new BasicNameValuePair("id", ownerid));
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
            // get a department list from current BPM repository
            String url = API_DomainName + "/service2/api15";
            String id = request.getParameter("oid");
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
        } else if (api.equals("13")) {
            // get a position list from current BPM repository
            String url = API_DomainName + "/service2/api16";
            String id = request.getParameter("dptid");
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



        } else if (api.equals("16")) {
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
        } else if (api.equals("17")) {
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
        } else if (api.equals("18")) {
            // get a Java app service or web app service(micro service) object
            String url = API_DomainName + "/service7/api2";
            String apptype = request.getParameter("apptype");
            String id = request.getParameter("id");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("apptype", apptype));
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
        } else if (api.equals("19")) {
            // search available subprocess service in process store.
            String url = API_DomainName + "/service1/api12";
            String appid = request.getParameter("pid");
            String condition = request.getParameter("cond");
            String ownerid = request.getParameter("ownerid");
            String pageno = request.getParameter("pageno");
            String pagesize = request.getParameter("pagesize");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("procid", appid));
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
        } else if (api.equals("20")) {
            // get a process object build time repository
            String url = API_DomainName + "/service1/api13";
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
        } else if (api.equals("21")) {// get organization list for process tree
            String url = API_DomainName + "/service1/api14";
            HttpPost httpPost = new HttpPost(url);
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String ownerid = request.getParameter("oid");
            urlParameters.add(new BasicNameValuePair("orgid", ownerid));
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
        } else if (api.equals("24")) {
            // search available form service in form store.
            String url = API_DomainName + "/service1/api17";
            String appid = request.getParameter("fid");
            String condition = request.getParameter("cond");
            String ownerid = request.getParameter("ownerid");
            String pageno = request.getParameter("pageno");
            String pagesize = request.getParameter("pagesize");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("frmid", appid));
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
        } else if (api.equals("25")) {
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
        } else if (api.equals("26")) {// get organization list for process tree
            String url = API_DomainName + "/service1/api21";
            HttpPost httpPost = new HttpPost(url);
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String ownerid = request.getParameter("oid");
            urlParameters.add(new BasicNameValuePair("orgid", ownerid));
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
        } else if (api.equals("32")) {// get all email templetes list by org Id
            String url = API_DomainName + "/service7/api26";
            HttpPost httpPost = new HttpPost(url);
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String ownerid = request.getParameter("oid");
            urlParameters.add(new BasicNameValuePair("oid", ownerid));
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
            httpPost.abort();
        } else if (api.equals("33")) { // get all SMS templetes list by org Id
            String url = API_DomainName + "/service7/api27";
            HttpPost httpPost = new HttpPost(url);
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String ownerid = request.getParameter("oid");
            urlParameters.add(new BasicNameValuePair("oid", ownerid));
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
            httpPost.abort();
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
        if (api.equals("3")) {// create a new wfprocess folder
            HttpPost httpPost = new HttpPost(API_DomainName + "/service1/api3");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String entityname = request.getParameter("ename");
            String parentid = request.getParameter("pid");
            String ownerid = request.getParameter("oid");
            String type = request.getParameter("type");
            urlParameters.add(new BasicNameValuePair("entityname", entityname));
            urlParameters.add(new BasicNameValuePair("parentid", parentid));
            urlParameters.add(new BasicNameValuePair("ownerid", ownerid));
            urlParameters.add(new BasicNameValuePair("type", type));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("4")) {// create a SaaS Application wfprocess
            HttpPost httpPost = new HttpPost(API_DomainName + "/service1/api4");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String entityname = request.getParameter("ename");
            String parentid = request.getParameter("pid");
            String ownerid = request.getParameter("oid");
            String authorid = request.getParameter("authorid");
            String authorname = request.getParameter("author");
            String pt = request.getParameter("pt"); // process type/workflow type
            urlParameters.add(new BasicNameValuePair("entityname", entityname));
            urlParameters.add(new BasicNameValuePair("parentid", parentid));
            urlParameters.add(new BasicNameValuePair("ownerid", ownerid));
            urlParameters.add(new BasicNameValuePair("authorid", authorid));
            urlParameters.add(new BasicNameValuePair("authorname", authorname));
            // 0: auto app process; 1: single app process; 2: multiple app process;
            urlParameters.add(new BasicNameValuePair("workflowtype", pt));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("5")) {
            // save a wfprocess into build time repository
            HttpPost httpPost = new HttpPost(API_DomainName + "/service1/api5");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String process = request.getParameter("process");
            urlParameters.add(new BasicNameValuePair("process", process));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("7")) {
            // update name of a process into repository
            HttpPost httpPost = new HttpPost(API_DomainName + "/service1/api7");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String id = request.getParameter("id");
            String pname = request.getParameter("entityname");
            String date = request.getParameter("lastupdate");
            urlParameters.add(new BasicNameValuePair("id", id));
            urlParameters.add(new BasicNameValuePair("entityname", pname));
            urlParameters.add(new BasicNameValuePair("lastupdate", date));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("8")) {
            // update name of a folder into repository
            HttpPost httpPost = new HttpPost(API_DomainName + "/service1/api8");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String id = request.getParameter("id");
            String fname = request.getParameter("entityname");
            urlParameters.add(new BasicNameValuePair("id", id));
            urlParameters.add(new BasicNameValuePair("entityname", fname));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("14")) {
            // release a wfprocess
            HttpPost httpPost = new HttpPost(API_DomainName + "/service1/api10");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String pid = request.getParameter("pid");
            String version = request.getParameter("v");
            String versionnote = request.getParameter("vn");
            String releaser = request.getParameter("rl");
            String releaserid = request.getParameter("rid");
            String pp = request.getParameter("pp");
            String up = request.getParameter("up");
            String orgid = request.getParameter("orgid");
            String parent = request.getParameter("pfd");// parent folder ID
            urlParameters.add(new BasicNameValuePair("pid", pid));
            urlParameters.add(new BasicNameValuePair("version", version));
            urlParameters.add(new BasicNameValuePair("releaser", releaser));
            urlParameters.add(new BasicNameValuePair("releaserid", releaserid));
            urlParameters.add(new BasicNameValuePair("versionnote", versionnote));
            urlParameters.add(new BasicNameValuePair("purchaseprice", pp));
            urlParameters.add(new BasicNameValuePair("usageprice", up));
            urlParameters.add(new BasicNameValuePair("parent", parent));
            urlParameters.add(new BasicNameValuePair("orgid", orgid));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("15")) {
            // delete one wfprocess object
            HttpPost httpPost = new HttpPost(API_DomainName + "/service1/api11");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String id = request.getParameter("id");
            String oid = request.getParameter("oid");
            urlParameters.add(new BasicNameValuePair("processid", id));
            urlParameters.add(new BasicNameValuePair("ownerid", oid));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("22")) {
            // update a released wfprocess
            HttpPost httpPost = new HttpPost(API_DomainName + "/service1/api15");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String process = request.getParameter("process");
            urlParameters.add(new BasicNameValuePair("process", process));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("23")) {
            // release/withdraw process from process service store
            // 0=release/1=withdraw process
            HttpPost httpPost = new HttpPost(API_DomainName + "/service1/api16");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String id = request.getParameter("id");
            String d = request.getParameter("d");
            String owner = request.getParameter("owner");
            String userId = request.getParameter("userId");
            String userfullname = request.getParameter("userfullname");
            String ownername = request.getParameter("ownername");
            String comment = request.getParameter("comment");
            urlParameters.add(new BasicNameValuePair("id", id));
            urlParameters.add(new BasicNameValuePair("deprecated", d));
            urlParameters.add(new BasicNameValuePair("comment", comment));
            urlParameters.add(new BasicNameValuePair("owner", owner));
            urlParameters.add(new BasicNameValuePair("userId", userId));
            urlParameters.add(new BasicNameValuePair("userfullname", userfullname));
            urlParameters.add(new BasicNameValuePair("ownername", ownername));

            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("27")) {
            // moving a wfprocess from one folder to the other one.
            HttpPost httpPost = new HttpPost(API_DomainName + "/service1/api22");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String pid = request.getParameter("pid");
            // type is 100, wfprocess folder; 109 is released wfprocess folder;
            String type = request.getParameter("type");
            String parent = request.getParameter("pfd");// parent folder ID
            urlParameters.add(new BasicNameValuePair("pid", pid));
            urlParameters.add(new BasicNameValuePair("parent", parent));
            urlParameters.add(new BasicNameValuePair("type", type));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("28")) {
            // buy or hire a process from process service store
            HttpPost httpPost = new HttpPost(API_DomainName + "/service1/api25");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String id = request.getParameter("id");// buy or hire a process id
            String parent = request.getParameter("parent");// target folder id
            String owner = request.getParameter("owner"); // my org id
            String modify = request.getParameter("modify"); // my org id
            urlParameters.add(new BasicNameValuePair("id", id));
            urlParameters.add(new BasicNameValuePair("parent", parent));
            urlParameters.add(new BasicNameValuePair("owner", owner));
            urlParameters.add(new BasicNameValuePair("modify", modify));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("29")) {
            // copying a wfprocess or released wfprocess from one folder to the
            // other one.
            HttpPost httpPost = new HttpPost(API_DomainName + "/service1/api24");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String pid = request.getParameter("pid");
            String orgid = request.getParameter("orgid");
            String fid = request.getParameter("fid");// target folder ID
            // type : "R": released process copy; "P": process copy;
            String type = request.getParameter("type");
            urlParameters.add(new BasicNameValuePair("pid", pid));
            urlParameters.add(new BasicNameValuePair("parent", fid));
            urlParameters.add(new BasicNameValuePair("orgid", orgid));
            urlParameters.add(new BasicNameValuePair("type", type));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("30")) {
            // delete one folder from tree viewer
            HttpPost httpPost = new HttpPost(API_DomainName + "/service1/api26");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String ids = request.getParameter("ids");
            String oid = request.getParameter("oid");
            urlParameters.add(new BasicNameValuePair("ids", ids));
            urlParameters.add(new BasicNameValuePair("ownerid", oid));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("31")) {
            // moving a folder from one folder to another folder
            HttpPost httpPost = new HttpPost(API_DomainName + "/service1/api27");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String id = request.getParameter("fid");
            String parent = request.getParameter("parent");
            urlParameters.add(new BasicNameValuePair("fid", id));
            urlParameters.add(new BasicNameValuePair("parent", parent));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
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
