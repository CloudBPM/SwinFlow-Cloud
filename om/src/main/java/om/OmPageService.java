package om;

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

@WebServlet("/OmPageService")
public class OmPageService extends HttpServlet {

    private static final long serialVersionUID = 1L;
    //	private static final String API_DomainName = "http://localhost:8080/api";
    private static  String API_DomainName = null;

    private void returnErrorMsg(HttpServletResponse response) throws IOException {
        String responseJson = "{\"status\": \"-5\" }";
        response.setCharacterEncoding("utf8");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(responseJson);
        out.close();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
//        API_DomainName=request.getScheme() + "://" + request.getServerName() + ":8088/api";
        API_DomainName="http://localhost:8088/api";

        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String api = request.getParameter("api");
        String responseJson = null;
        String url = null;

        List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();

        if (api.equals("1")) {
            url = API_DomainName + "/service2/api20";
            String orgName = request.getParameter("org");
            urlParameters.add(new BasicNameValuePair("orgName", orgName));
            responseJson = getMethod(url, urlParameters, response1, httpClient, responseJson);

        } else if (api.equals("2")) {
            url = API_DomainName + "/service2/api18";
            String orgId = request.getParameter("org");
            urlParameters.add(new BasicNameValuePair("orgId", orgId));
            responseJson = getMethod(url, urlParameters, response1, httpClient, responseJson);
        }

        response.setCharacterEncoding("utf8");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(responseJson);
        out.close();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // TODO Auto-generated method stub
        super.doPost(req, resp);
    }

    @Override
    protected void service(HttpServletRequest arg0, HttpServletResponse arg1) throws ServletException, IOException {
        // TODO Auto-generated method stub
        super.service(arg0, arg1);
    }

    private String getMethod(String url, List<NameValuePair> urlParameters, CloseableHttpResponse response1,
                             CloseableHttpClient httpClient, String responseJson)
            throws ParseException, UnsupportedEncodingException, IOException {
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

}
