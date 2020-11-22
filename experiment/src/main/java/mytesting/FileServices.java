package mytesting;

import com.alibaba.fastjson.JSON;
import com.cloud.core.session.redis.JedisUtil;
import com.cloudibpm.core.session.utils.SessionUtils;
import com.cloudibpm.core.user.Login;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.CharsetUtils;
import org.apache.http.util.EntityUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

/**
 * Servlet implementation class AmFileUploadServices
 */
@WebServlet("/FileServices")
@MultipartConfig

public class FileServices extends HttpServlet {
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
        API_DomainName=request.getScheme() + "://" + request.getServerName() + ":8088/api";
        String sessionId= SessionUtils.getInstance().getSessionId(request);
        if(sessionId!=null){
            loggedinstaff= JSON.parseObject(JedisUtil.getInstance().get(sessionId),Login.class);
        }
        if(loggedinstaff==null){
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
        if (api.equals("0")) { // upload a file
            String oid = request.getParameter("oid");
            String pid = request.getParameter("pid");
            String vid = request.getParameter("vid");
            String fid = request.getParameter("fid");
            String fname = request.getParameter("fname");
            String flen = request.getParameter("flen");
            String fname2 = URLDecoder.decode(fname, "utf-8");
            MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create();
            multipartEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
            multipartEntityBuilder.addTextBody("oid", oid, ContentType.DEFAULT_TEXT);
            multipartEntityBuilder.addTextBody("pid", pid, ContentType.DEFAULT_TEXT);
            multipartEntityBuilder.addTextBody("vid", vid, ContentType.DEFAULT_TEXT);
            multipartEntityBuilder.addTextBody("fid", fid == null ? "" : fid, ContentType.DEFAULT_TEXT);
            multipartEntityBuilder.addTextBody("fname", URLEncoder.encode(fname2, "utf-8"), ContentType.DEFAULT_TEXT);
            multipartEntityBuilder.addTextBody("flen", flen, ContentType.DEFAULT_TEXT);

            for (Part filePart : request.getParts()) {
                multipartEntityBuilder.addBinaryBody("uploadFile", filePart.getInputStream(),
                        ContentType.DEFAULT_BINARY, fname);
            }

            multipartEntityBuilder.setCharset(CharsetUtils.get("UTF-8"));
            HttpEntity httpEntity = multipartEntityBuilder.build();

            HttpPost httpPost = new HttpPost(API_DomainName + "/service1/api18");
            httpPost.setEntity(httpEntity);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, Charset.forName("UTF-8")).trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("1")) {
            // remove one or more file objects on one variable
            HttpPost httpPost = new HttpPost(API_DomainName + "/service1/api19");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String oid = request.getParameter("oid");
            String pid = request.getParameter("pid");
            String vid = request.getParameter("vid");
            String fid = request.getParameter("fid");

            urlParameters.add(new BasicNameValuePair("oid", oid));
            urlParameters.add(new BasicNameValuePair("pid", pid));
            urlParameters.add(new BasicNameValuePair("vid", vid));
            urlParameters.add(new BasicNameValuePair("fid", fid));

            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("2")) { // remove one file object on one variable
            HttpPost httpPost = new HttpPost(API_DomainName + "/service1/api20");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String oid = request.getParameter("oid");
            String pid = request.getParameter("pid");
            String vid = request.getParameter("vid");

            urlParameters.add(new BasicNameValuePair("oid", oid));
            urlParameters.add(new BasicNameValuePair("pid", pid));
            urlParameters.add(new BasicNameValuePair("vid", vid));

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
