package mytesting;

import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.core.util.encode.MD5Util;
import com.cloudibpm.core.util.encode.SecretKeyUtil;
import org.apache.catalina.session.StandardSessionFacade;
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
import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

/**
 * Servlet implementation class MyService0
 */
@WebServlet("/MyService0")
public class MyService0 extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Login loggedinstaff = null;
    //	private static final String API_DomainName = "http://localhost:8080/api";
    private static final String API_DomainName = "http://localhost:8088/api";

    /**
     * @see HttpServlet#service(HttpServletRequest request, HttpServletResponse
     * response)
     */
    protected void service(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String userid = request.getParameter("usr");
        String token = request.getParameter("tkn");
        String sessiondata = request.getParameter("auth");
        request.setCharacterEncoding("UTF-8");
        ServletContext context = request.getServletContext();
        ServletContext context1 = context.getContext("/login");
        if (context1 != null) {
            HttpSession session2 = (StandardSessionFacade) context1.getAttribute(userid);
            try {
                if (session2 == null || session2.getAttribute("loggedinstaff") == null) {
                    returnErrorMsg(response);
                    return;
                }
            } catch (IllegalStateException e) { // Session过期了
                returnErrorMsg(response);
                return;
            }
            String username = session2.getAttribute("username").toString();
            String s = MD5Util.getMD5(token + username + userid + DateUtility.getCurrentDate());
            if (!SecretKeyUtil.getInstance().recognizeKey(token) || !s.equals(sessiondata)) {
                returnErrorMsg(response);
                return;
            } else {
                Object obj = session2.getAttribute("loggedinstaff");
                ObjectMapper mapper = new ObjectMapper();
                mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                loggedinstaff = mapper.readValue((String) obj, Login.class);
                super.service(request, response);
            }
        } else {
            returnErrorMsg(response);
            return;
        }
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
            String url = API_DomainName + "/serviceX/api0";
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
            String url = API_DomainName + "/service13/api1";
            String oid = request.getParameter("oid");
            String pn = request.getParameter("pn");
            String psz = request.getParameter("psz");
            String cond = request.getParameter("cond");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("oid", oid));
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
            // get all training person list by pageno and pagesize.
            String url = API_DomainName + "/serviceX/api2";
            String pn = request.getParameter("pn");
            String psz = request.getParameter("psz");
            String cond = request.getParameter("cond");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("pageno", pn));
            urlParameters.add(new BasicNameValuePair("pagesize", psz));
            urlParameters.add(new BasicNameValuePair("condition", cond));
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
        if (api.equals("3")) {// create a new training person
            HttpPost httpPost = new HttpPost(API_DomainName + "/serviceX/api3");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String psn = request.getParameter("psn");
            urlParameters.add(new BasicNameValuePair("p", psn));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("4")) {// update
            HttpPost httpPost = new HttpPost(API_DomainName + "/serviceX/api4");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String psn = request.getParameter("psn");
            urlParameters.add(new BasicNameValuePair("p", psn));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("5")) {// delete
            HttpPost httpPost = new HttpPost(API_DomainName + "/serviceX/api5");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String psn = request.getParameter("psn");
            urlParameters.add(new BasicNameValuePair("p", psn));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("6")) { // put infor to API
            HttpPost httpPost = new HttpPost(API_DomainName + "/serviceX/api6");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String psn = request.getParameter("useraccount");
            urlParameters.add(new BasicNameValuePair("usr", psn));
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
