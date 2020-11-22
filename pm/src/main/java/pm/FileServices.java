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
import java.io.InputStream;
import java.io.OutputStream;
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
    private static  String API_DomainName =null;

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
            multipartEntityBuilder.addTextBody("oid", oid, ContentType.DEFAULT_BINARY);
            multipartEntityBuilder.addTextBody("pid", pid, ContentType.DEFAULT_BINARY);
            multipartEntityBuilder.addTextBody("vid", vid, ContentType.DEFAULT_BINARY);
            multipartEntityBuilder.addTextBody("fid", fid == null ? "" : fid, ContentType.DEFAULT_BINARY);
            multipartEntityBuilder.addTextBody("fname", URLEncoder.encode(fname2, "utf-8"), ContentType.DEFAULT_BINARY);
            multipartEntityBuilder.addTextBody("flen", flen, ContentType.DEFAULT_BINARY);

            for (Part filePart : request.getParts()) {
                if (filePart.getName().equals("file")) {
                    multipartEntityBuilder.addBinaryBody("uploadFile", filePart.getInputStream(),
                            ContentType.DEFAULT_BINARY, fname);
                }
            }

            multipartEntityBuilder.setCharset(CharsetUtils.get("UTF-8"));
            HttpEntity httpEntity = multipartEntityBuilder.build();

            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api5");
            httpPost.setEntity(httpEntity);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, Charset.forName("UTF-8")).trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("1")) {
            // remove one or more file objects on one variable
            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api6");
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
            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api7");
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
        } else if (api.equals("3")) {

            // get a process object build time repository
            String host = "http://localhost:8080/fserver/";// SystemConfig.getProp("fserver");
            String path = new String(request.getParameter("path").getBytes("iso8859-1"), "utf-8");
            //String attachmentName = path.substring(path.lastIndexOf("/")+1, path.length());
            String attachmentName = new String(request.getParameter("fname").getBytes("iso8859-1"), "utf-8");
            //String path2 = URLEncoder.encode(path, "UTF-8");
            HttpGet httpGet = new HttpGet(host + path);
            CloseableHttpClient httpClient1 = HttpClientBuilder.create().build();
            CloseableHttpResponse cltresponse = httpClient1.execute(httpGet);
            HttpEntity entity = cltresponse.getEntity();
            InputStream in = entity.getContent();
            if (attachmentName != null) {
                String contenttype = request.getServletContext().getMimeType(attachmentName);
                response.setContentType("application/octet-stream");
                if (contenttype != null && !contenttype.equals("")) {
                    response.setContentType(contenttype);
                }
                response.setContentLengthLong(entity.getContentLength());
                // Make sure to show the download dialog
                response.setCharacterEncoding("UTF-8");
                String userAgent = request.getHeader("user-agent").toLowerCase();
                if (userAgent.contains("msie") || userAgent.contains("like gecko")) {
                    // win10 ie edge 浏览器 和其他系统的ie
                    attachmentName = URLEncoder.encode(attachmentName, "UTF-8");
                } else {
                    // fe
                    attachmentName = new String(attachmentName.getBytes("UTF-8"), "iso-8859-1");
                }
                response.setHeader("Content-disposition", "attachment; filename=" + attachmentName);
                response.setHeader("Pragma", "No-cache");
                response.setHeader("Cache-Control", "No-cache");
                response.setDateHeader("Expires", 0);
                OutputStream out = response.getOutputStream();
                int b;
                while ((b = in.read()) != -1) {
                    out.write(b);
                }
                out.flush();
                in.close();
                out.close();
            }
            httpClient1.close();
            httpGet.abort();
            return;

        } else if (api.equals("4")) {
            // upload one or more files to system.
            String ownerId = request.getParameter("ownerId");
            String targetpath = request.getParameter("targetpath");
            String path = new String(targetpath.getBytes("iso8859-1"), "utf-8");
            String path2 = URLEncoder.encode(path, "UTF-8");
            String fname = request.getParameter("fname");
            String flen = request.getParameter("flen");
            MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create();
            multipartEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
            multipartEntityBuilder.addTextBody("owner", ownerId, ContentType.DEFAULT_BINARY);
            multipartEntityBuilder.addTextBody("targetpath", path2, ContentType.DEFAULT_BINARY);
            multipartEntityBuilder.addTextBody("fname", fname, ContentType.DEFAULT_BINARY);
            multipartEntityBuilder.addTextBody("flen", flen, ContentType.DEFAULT_BINARY);

            for (Part filePart : request.getParts()) {
                if (filePart.getName().equals("file")) {
                    multipartEntityBuilder.addBinaryBody("uploadFile", filePart.getInputStream(),
                            ContentType.DEFAULT_BINARY, fname);
                }
            }

            multipartEntityBuilder.setCharset(CharsetUtils.get("UTF-8"));
            HttpEntity httpEntity = multipartEntityBuilder.build();

            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api23");
            httpPost.setEntity(httpEntity);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, Charset.forName("UTF-8")).trim();
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
