package om;

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

import javax.servlet.ServletContext;
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
 * Servlet implementation class Omregister
 */
@WebServlet("/Omregister")
public class Omregister extends HttpServlet {
    private static final long serialVersionUID = 1L;
    //	private static final String API_DomainName = "http://localhost:8080/api";
    private static  String API_DomainName = null;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO Auto-generated method stub
        response.getWriter().append("Served at: ").append(request.getContextPath());
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
     * response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
//        API_DomainName=request.getScheme() + "://" + request.getServerName() + ":8088/api";
        API_DomainName="http://localhost:8088/api";
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String api = request.getParameter("api");
        String responseJson = null;
        if (api.equals("1")) {
            // send UserInfo and create new user
            HttpPost httpPost = new HttpPost(API_DomainName + "/service2/api17");
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
                // 关闭连接,释放资源
                try {
                    httpClient.close();
                    httpPost.abort();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (responseJson.equals("{\"status\": \"1\"}")) {
                //注册成功，跳转到我的轩琦界面
                ServletContext context = getServletContext().getContext("/login");
                context.getRequestDispatcher("/Authenticate").forward(request, response);
                responseJson = response.getContentType();
            }
            response.setCharacterEncoding("utf8");
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            out.print(responseJson);
            out.close();
            response1.close();
        } else if (api.equals("2")) {
            // check exist UserName, email, mobile
//            String url = API_DomainName + "/service5/api3";
//            String urle = API_DomainName + "/service5/api6";
            String urlm = API_DomainName + "/service5/api7";
            //String name = request.getParameter("name");
            //String email = request.getParameter("email");
            String mobile = request.getParameter("mobile");

//            if (verify(url, "username", name).equals("0")) {
//
//                if (verify(urle, "email", email).equals("0")) {

                    if (verify(urlm, "mobile", mobile).equals("0")) {
                        responseJson = "{\"status\": \"0\"}";
                    } else {
                        responseJson = "{\"status\": \"3\"}";
                    }
//                } else {
//                    responseJson = "{\"status\": \"2\"}";
//                }
//            } else {
//                responseJson = "{\"status\": \"1\"}";
//            }

            response.setCharacterEncoding("utf8");
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            out.print(responseJson);
        }
    }

    protected String verify(String url, String field, String value)
            throws ParseException, UnsupportedEncodingException, IOException {
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response = null;
        String exitfield = null;
        List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
        urlParameters.add(new BasicNameValuePair(field, value));
        String str = EntityUtils.toString(new UrlEncodedFormEntity(urlParameters, "utf-8"));
        //check field
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
