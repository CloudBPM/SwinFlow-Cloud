package client;

import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.ParseException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
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
 * Servlet implementation class Omregister
 */
@WebServlet("/LoginFindMobile")
public class FindMobile extends HttpServlet {
    private static final long serialVersionUID = 1L;
    //	private static final String API_DomainName = "http://localhost:8080/api";
    private static final String API_DomainName = "http://localhost:8088/api";

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
        String responseJson = null;
        // check exist mobile
        String urlm = API_DomainName + "/service5/api7";
        String mobile = request.getParameter("mobile");

        if (verify(urlm, "mobile", mobile).equals("1")) {   // 0 : 不存在
            responseJson = "{\"status\": \"1\"}";          // 1 : 存在
        } else {
            responseJson = "{\"status\": \"3\"}";
        }

        response.setCharacterEncoding("utf8");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(responseJson);
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
