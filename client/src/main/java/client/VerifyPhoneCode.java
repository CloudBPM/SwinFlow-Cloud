package client;

import com.cloudibpm.core.util.VerifyCode;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
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
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

@WebServlet("/VerifyPhoneCode")
public class VerifyPhoneCode extends HttpServlet {
    private static final long serialVersionUID = 1L;
    //	private static final String API_DomainName = "http://localhost:8080/api";
    private static final String API_DomainName = "http://localhost:8088/api";

    private void returnErrorMsg(HttpServletResponse response) throws IOException {
        String responseJson = "{\"status\": \"-5\" }";
        response.setCharacterEncoding("utf8");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(responseJson);
        out.close();
    }


    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        response.getWriter().append("Served at: ").append(request.getContextPath());
    }


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
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("mobile", mobile));
            urlParameters.add(new BasicNameValuePair("code", code));
            HttpSession session = request.getSession(true);
            String key = "verifyCode";
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
            String scode = (String) request.getSession().getAttribute("verifyCode");
            HashMap<String, String> data = new HashMap<>();
            if (code.equals(scode)) {
                data.put("status", "200");
                data.put("msg", "手机验证通过");
            } else {
                data.put("status", "0");
                data.put("msg", "验证码失效");
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
        }
        response.setCharacterEncoding("utf8");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(responseJson);
        out.close();
        response1.close();
    }

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.service(req, resp);
    }

    /**
     * 5分钟后,删除session中验证码
     *
     * @param session
     * @param key
     */
    private void removeVerifyCode(HttpSession session, String key) {
        final Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                // 删除session中存的验证码  
                session.removeAttribute(key);
                System.out.println("验证码已失效");
                timer.cancel();
            }
        }, 5 * 60 * 1000);
    }

}
