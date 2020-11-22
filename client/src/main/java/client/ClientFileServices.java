package client;

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
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

/**
 * @Titel: 标题
 * @Description: 反馈附件操作
 * @Author: 作者
 * @CreateDate: 2019/3/15 14:03
 * @Version: 1.0
 */
@WebServlet("/ClientFileServices")
@MultipartConfig
public class ClientFileServices extends HttpServlet {
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
        String sessionId = SessionUtils.getInstance().getSessionId(request);
        if (sessionId != null) {
            loggedinstaff = JSON.parseObject(JedisUtil.getInstance().get(sessionId), Login.class);
        }
        if (loggedinstaff == null) {
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

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String api = request.getParameter("api");
        String responseJson = null;
        if (api.equals("0")) { // 得到个人目录下文件夹
            String url = API_DomainName + "/service19/api41";
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String oid = request.getParameter("oid");
//            urlParameters.add(new BasicNameValuePair("oid", request.getParameter("oid")));
            urlParameters.add(new BasicNameValuePair("uid", loggedinstaff.getUser().getId()));
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
        }else if (api.equals("1")) { // get parent folder contents
            String url = API_DomainName + "/service19/api42";
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String oid = request.getParameter("oid");
//            urlParameters.add(new BasicNameValuePair("oid", request.getParameter("oid")));
            urlParameters.add(new BasicNameValuePair("uid", loggedinstaff.getUser().getId()));
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

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String api = request.getParameter("api");
        String responseJson = null;
        if (api.equals("0")) {
            // 反馈附件上传
            String oid = request.getParameter("oid");
            String fname = request.getParameter("filename");
            String flen = request.getParameter("flen");
            String fname2 = URLDecoder.decode(fname, "utf-8");
            MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create();
            multipartEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
            multipartEntityBuilder.addTextBody("uid", loggedinstaff.getUser().getId(), ContentType.DEFAULT_BINARY);
            multipartEntityBuilder.addTextBody("flen", flen, ContentType.DEFAULT_BINARY);
            multipartEntityBuilder.addTextBody("mimetype", request.getServletContext().getMimeType(fname2),
                    ContentType.DEFAULT_BINARY);
            String s = URLEncoder.encode(fname2, "utf-8");
            multipartEntityBuilder.addTextBody("fname", s, ContentType.DEFAULT_BINARY);

            for (Part filePart : request.getParts()) {
                multipartEntityBuilder.addBinaryBody("uploadFile", filePart.getInputStream(),
                        ContentType.DEFAULT_BINARY, fname);
            }

            multipartEntityBuilder.setCharset(CharsetUtils.get("UTF-8"));
            HttpEntity httpEntity = multipartEntityBuilder.build();

            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api33");
            httpPost.setEntity(httpEntity);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, Charset.forName("UTF-8")).trim();
            httpClient.close();
            httpPost.abort();
        }else if (api.equals("1")) {
            // 删除该次反馈中全部附件
            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api34");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String paths = request.getParameter("paths");
            urlParameters.add(new BasicNameValuePair("paths", paths));
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
        }else if (api.equals("2")) {
            // 删除附件
            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api35");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String path = request.getParameter("path");
            urlParameters.add(new BasicNameValuePair("path", path));
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
        }else if (api.equals("3")) {
            // 上传个人文件
            String ownerId = request.getParameter("ownerId");
            String targetpath = request.getParameter("targetpath");
            String path = new String(targetpath.getBytes("iso8859-1"), "utf-8");
            targetpath = URLEncoder.encode(path, "UTF-8");
            String fname = request.getParameter("filename");
            String flen = request.getParameter("flen");
            MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create();
            multipartEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
//            multipartEntityBuilder.addTextBody("oid", ownerId, ContentType.DEFAULT_BINARY);
            multipartEntityBuilder.addTextBody("targetpath", targetpath, ContentType.DEFAULT_BINARY);
            multipartEntityBuilder.addTextBody("uid", loggedinstaff.getUser().getId(), ContentType.DEFAULT_BINARY);
            multipartEntityBuilder.addTextBody("fname", fname, ContentType.DEFAULT_BINARY);
//            multipartEntityBuilder.addTextBody("flen", flen, ContentType.DEFAULT_BINARY);

            for (Part filePart : request.getParts()) {
                if (filePart.getName().equals("file")) {
                    multipartEntityBuilder.addBinaryBody("uploadFile", filePart.getInputStream(),
                            ContentType.DEFAULT_BINARY, fname);
                }
            }

            multipartEntityBuilder.setCharset(CharsetUtils.get("UTF-8"));
            HttpEntity httpEntity = multipartEntityBuilder.build();

            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api36");
            httpPost.setEntity(httpEntity);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, Charset.forName("UTF-8")).trim();
            httpClient.close();
            httpPost.abort();
        }else if (api.equals("4")) {
            // 删除个人目录下文件
            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api37");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String oid = request.getParameter("ownerId");
            String path = request.getParameter("path");
            String fname = request.getParameter("fname");

//            urlParameters.add(new BasicNameValuePair("oid", oid));
            urlParameters.add(new BasicNameValuePair("fname", fname));
            urlParameters.add(new BasicNameValuePair("path", path));
            urlParameters.add(new BasicNameValuePair("uid", loggedinstaff.getUser().getId()));
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
        }else if (api.equals("5")) {
            // 创建个人目录下文件夹
            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api38");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String oid = request.getParameter("ownerId");
            String path = request.getParameter("path");
            String fname = request.getParameter("foldername");

//            urlParameters.add(new BasicNameValuePair("oid", oid));
            urlParameters.add(new BasicNameValuePair("foldername", fname));
            urlParameters.add(new BasicNameValuePair("uid", loggedinstaff.getUser().getId()));
            urlParameters.add(new BasicNameValuePair("path", path));
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
        }else if (api.equals("6")) {
            // 重命名个人目录下文件或文件夹
            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api39");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String oid = request.getParameter("ownerId");
            String path = request.getParameter("path");
            String oldname = request.getParameter("oldname");
            String newname = request.getParameter("newname");
//            urlParameters.add(new BasicNameValuePair("oid", oid));
            urlParameters.add(new BasicNameValuePair("path", path));
            urlParameters.add(new BasicNameValuePair("uid", loggedinstaff.getUser().getId()));
            urlParameters.add(new BasicNameValuePair("oldname", oldname));
            urlParameters.add(new BasicNameValuePair("newname", newname));
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
        }else if (api.equals("7")) {
            //下载文件
            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api40");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String oid = request.getParameter("oid");

            String path = new String(request.getParameter("path").getBytes("iso8859-1"), "utf-8");
            String path2 = URLEncoder.encode(path, "UTF-8");

            String fn = request.getParameter("filename");
            String filename = new String(fn.getBytes("iso8859-1"), "utf-8");
            String filename2 = URLEncoder.encode(filename, "UTF-8");

            //filename = URLEncoder.encode(filename, "UTF-8");
//            urlParameters.add(new BasicNameValuePair("oid", oid));
            urlParameters.add(new BasicNameValuePair("path", path2));
            urlParameters.add(new BasicNameValuePair("uid", loggedinstaff.getUser().getId()));
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
            return;
        }
        response.setCharacterEncoding("utf8");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(responseJson);
        out.close();
    }
}
