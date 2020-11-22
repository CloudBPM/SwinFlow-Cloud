package om;

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
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/FileDownloadServices")
@MultipartConfig
public class FileDownloadServices extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private Login loggedinstaff = null;
    //	private static final String API_DomainName = "http://localhost:8080/api";
    private static String API_DomainName = null;

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
//        API_DomainName=request.getScheme() + "://" + request.getServerName() + ":8088/api";
        API_DomainName="http://localhost:8088/api";
        String sessionId= SessionUtils.getInstance().getSessionId(request);
        if(sessionId!=null){
            loggedinstaff= JSON.parseObject(JedisUtil.getInstance().get(sessionId),Login.class);
        }
        if(loggedinstaff==null){
            returnErrorMsg(response);
        }
        super.service(request, response);
    }
//    protected void service(HttpServletRequest request, HttpServletResponse response)
//            throws ServletException, IOException {
//        API_DomainName = request.getScheme() + "://" + request.getServerName() + ":8088/api";
//        loggedinstaff = SessionUtils.getInstance().getLogin(request);
//        String prsn = request.getParameter("prsn");
//        String oid = request.getParameter("oid");
//        Map map = PermissionAuthUtil.checkPermission(prsn, oid, loggedinstaff.getUser().getId());
//        String result = (String) map.get("result");
//        String responseJson = (String) map.get("responseJson");
//        if (!StringUtils.isEmpty(result)) {
//            if (result.equals("0") || result.equals("-10")) {
//                response.setCharacterEncoding("utf8");
//                response.setContentType("application/json");
//                PrintWriter out = response.getWriter();
//                out.print(responseJson);
//                out.close();
//                return;
//            }
//        }
//        super.service(request, response);
//    }

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
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String api = request.getParameter("api");
        String responseJson = null;
        if (api.equals("0")) { // get current folder content
            String url = API_DomainName + "/service19/api21";
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("oid", request.getParameter("oid")));
            urlParameters.add(new BasicNameValuePair("dir", request.getParameter("dir")));
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
        } else if (api.equals("1")) { // get parent folder contents
            String url = API_DomainName + "/service19/api22";
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("oid", request.getParameter("oid")));
            urlParameters.add(new BasicNameValuePair("dir", request.getParameter("dir")));
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

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String api = request.getParameter("api");
        String responseJson = null;
        if (api.equals("1")) {

            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api10");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String oid = request.getParameter("oid");
            String path = new String(request.getParameter("path").getBytes("iso8859-1"), "utf-8");
            String path2 = URLEncoder.encode(path, "UTF-8");
            String filename = new String(request.getParameter("filename").getBytes("iso8859-1"), "utf-8");
//			filename = URLEncoder.encode(filename, "UTF-8");

            urlParameters.add(new BasicNameValuePair("oid", oid));
            urlParameters.add(new BasicNameValuePair("path", path2));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            InputStream in = entity.getContent();
            // responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            OutputStream out = response.getOutputStream();
            response.setContentType(getServletContext().getMimeType(filename));
            response.setHeader("Content-Disposition", "attachment;filename=" + filename);
            // 写文件
            int b;
            while ((b = in.read()) != -1) {
                out.write(b);
            }

            in.close();
            out.close();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("2")) {
            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api27");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String oid = request.getParameter("oid");

            String path = new String(request.getParameter("path").getBytes("iso8859-1"), "utf-8");
            String path2 = URLEncoder.encode(path, "UTF-8");

            String fn = request.getParameter("filename");
            String filename = new String(fn.getBytes("iso8859-1"), "utf-8");
            String filename2 = URLEncoder.encode(filename, "UTF-8");

            //filename = URLEncoder.encode(filename, "UTF-8");
            urlParameters.add(new BasicNameValuePair("oid", oid));
            urlParameters.add(new BasicNameValuePair("path", path2));
            urlParameters.add(new BasicNameValuePair("filename", filename));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            InputStream in = entity.getContent();
            // responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            OutputStream out = response.getOutputStream();
            response.setContentType(getServletContext().getMimeType(filename));
            response.setHeader("Content-disposition", "attachment;filename=" + filename2);
            // 写文件
            int b;
            while ((b = in.read()) != -1) {
                out.write(b);
            }

            in.close();
            out.close();
            httpClient.close();
            httpPost.abort();
        }
    }
}
