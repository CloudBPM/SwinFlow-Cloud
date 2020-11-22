package om;

import com.cloudibpm.core.util.VerifyCode;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.ParseException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.codehaus.jackson.map.ObjectMapper;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

@WebServlet("/registrationService")
public class RegistrationService extends HttpServlet {
    private static final long serialVersionUID = 1L;

    //	private static final String API_DomainName = "http://localhost:8080/api";
    private static String API_DomainName = null;


    private void returnErrorMsg(HttpServletResponse response) throws IOException {
        String responseJson = "{\"status\": \"-5\" }";
        response.setCharacterEncoding("utf8");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(responseJson);
        out.close();
    }


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String api = request.getParameter("api");
        String responseJson = null;
        String url = null;

        List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();

        if (api.equals("4")) {
            url = API_DomainName + "/service3/api1";
            String orgname = request.getParameter("orgname");
            urlParameters.add(new BasicNameValuePair("orgname", orgname));
            responseJson = getMethod(url, urlParameters, response1, httpClient, responseJson);
        } else if (api.equals("5")) {
            url = API_DomainName + "/service3/api2";
            String email = request.getParameter("email");
            urlParameters.add(new BasicNameValuePair("email", email));
            responseJson = getMethod(url, urlParameters, response1, httpClient, responseJson);
        }

        response.setCharacterEncoding("utf8");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(responseJson);
        out.close();
    }


    private String getMethod(String url, List<NameValuePair> urlParameters, CloseableHttpResponse response1,
                             CloseableHttpClient httpClient, String responseJson) throws ParseException, UnsupportedEncodingException, IOException {
        String str = null;
        if (null != urlParameters && !"".equals(urlParameters)) {
            str = EntityUtils.toString(new UrlEncodedFormEntity(urlParameters, "utf-8"));
        }

        HttpGet httpGet = new HttpGet(url);
        try {
            if (null != str && !"".equals(str)) {
                httpGet.setURI(new URI(httpGet.getURI().toString() + "?" + str));
            } else {
                httpGet.setURI(new URI(httpGet.getURI().toString()));
            }

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
        return responseJson;
    }


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String api = request.getParameter("api");
        String responseJson = null;

        if (api.equals("1")) {
            //send Message
            String url = API_DomainName + "/service17/api0";
            String mobile = request.getParameter("mobile");
            String code = VerifyCode.getVerifyCode(6);
            System.out.println(code);
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("mobile", mobile));
            urlParameters.add(new BasicNameValuePair("code", code));
            HttpSession session = request.getSession(true);
            String key = mobile + "verifyCode";
            session.setAttribute(key, code);
            this.removeVerifyCode(session, key);
            String str = EntityUtils.toString(new UrlEncodedFormEntity(urlParameters, "utf-8"));
            HttpPost httpPost = new HttpPost(url);
            try {
                httpPost.setURI(new URI(httpPost.getURI().toString() + "?" + str));
            } catch (URISyntaxException e) {
                e.printStackTrace();
            }
            response1 = httpClient.execute(httpPost);
            if (response1.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
            }
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("2")) {
            String code = request.getParameter("code");
            String mobile = request.getParameter("mobile");
            String scode = (String) request.getSession().getAttribute(mobile + "verifyCode");
            HashMap<String, String> data = new HashMap<>();

            if (code.equals(scode)) {
                data.put("status", "200");
                data.put("msg", "手机验证通过");
            } else if (scode == null) {
                data.put("status", "0");
                data.put("msg", "验证码已经失效");
            } else {
                data.put("status", "0");
                data.put("msg", "验证失败");
            }
            ObjectMapper mapper = new ObjectMapper();
            String json = mapper.writeValueAsString(data);
            responseJson = json;
            response.setCharacterEncoding("utf8");
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            out.print(responseJson);
            out.close();
            return;
        } else if (api.equals("3")) {
            String url = API_DomainName + "/service3/api0";
            String strOrg = request.getParameter("strOrg");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("strOrg", strOrg));
            HttpPost httpPost = new HttpPost(url);
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        }else if(api.equals("4")){
            String url = API_DomainName + "/service0/api5";
            String phoneNumber = request.getParameter("phoneNumber");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("phoneNumber", phoneNumber));
            HttpPost httpPost = new HttpPost(url);
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        }else if(api.equals("5")){
            String url = API_DomainName + "/service0/api8";
            String phoneNumber = request.getParameter("phoneNumber");
            String code=request.getParameter("code");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("phoneNumber", phoneNumber));
            urlParameters.add(new BasicNameValuePair("code", code));
            HttpPost httpPost = new HttpPost(url);
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


    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // TODO Auto-generated method stub
//        API_DomainName=req.getScheme() + "://" + req.getServerName() + ":8088/api";
        API_DomainName="http://localhost:8088/api";
        super.service(req, resp);
    }

    /**
     * 5分钟后,删除session中验证码
     *
     * @param session
     * @param key
     */
    private void removeVerifyCode(HttpSession session, final String key) {
        final Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                // 删除session中存的验证码  
                session.removeAttribute(key);
                System.err.println("验证码已失效");
                timer.cancel();
            }
        }, 5 * 60 * 1000);
    }
}


