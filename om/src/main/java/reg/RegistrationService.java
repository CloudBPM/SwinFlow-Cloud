package reg;

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
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
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
 * This Servlet offers organization registration services. Servlet
 * implementation class RegistrationSevice
 *
 * @author Dahai Cao
 * @since 20160722
 */
@WebServlet("/RegistrationService")
public class RegistrationService extends HttpServlet {
    private static final long serialVersionUID = 1L;
    //	private static final String API_DomainName = "http://localhost:8080/api";
    private static String API_DomainName = null;

    @Override
    public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
        API_DomainName=req.getScheme() + "://" + req.getServerName() + ":8088/api";
        super.service(req, res);
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
     * response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            CloseableHttpClient httpClient = HttpClientBuilder.create().build();
            CloseableHttpResponse response1 = null;
            String api = request.getParameter("api");
            String responseJson = null;
            if (api.equals("1")) {
                String url = API_DomainName + "/service3/api1";
                String orgname = request.getParameter("orgname");
                List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
                urlParameters.add(new BasicNameValuePair("orgname", orgname));
                String str = EntityUtils.toString(new UrlEncodedFormEntity(urlParameters, "utf-8"));
                HttpGet httpGet = new HttpGet(url);
                httpGet.setURI(new URI(httpGet.getURI().toString() + "?" + str));
                response1 = httpClient.execute(httpGet);
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
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }

    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
     * response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String org = request.getParameter("strOrg");
        HttpPost httpPost = new HttpPost(API_DomainName + "/service3/api0");

        List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
        urlParameters.add(new BasicNameValuePair("strOrg", org));
        HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
        httpPost.setEntity(postParams);

        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = httpClient.execute(httpPost);
        if (response1.getStatusLine().getStatusCode() != 200) {
            throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
        }
        HttpEntity entity = response1.getEntity();
        String responseJson = EntityUtils.toString(entity, "UTF-8").trim();
        httpPost.abort();
        httpClient.close();

        response.setCharacterEncoding("utf8");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(responseJson);
        out.close();

    }

}
