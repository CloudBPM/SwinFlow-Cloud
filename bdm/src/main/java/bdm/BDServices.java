package bdm;

import com.alibaba.fastjson.JSON;
import com.cloud.core.session.redis.JedisUtil;
import com.cloudibpm.core.session.utils.SessionUtils;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.util.DateUtility;
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

/**
 * Servlet implementation class BDServices
 */
@WebServlet("/BDServices")
@MultipartConfig
public class BDServices extends HttpServlet {
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
//        API_DomainName = request.getScheme() + "://" + request.getServerName() + ":8088/api";
        API_DomainName="http://localhost:8088/api";
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

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
     * response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String api = request.getParameter("api");
        String responseJson = null;

        if (api.equals("LL0")) {
            String url = API_DomainName + "/service14/api6";
            String pid = request.getParameter("pid");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("pid", pid));
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
        } else if (api.equals("1")) {// get organization list for process tree viewer
            StringBuffer ids = new StringBuffer();
            if (loggedinstaff.getStaffships() != null && loggedinstaff.getStaffships().length > 0) {
                for (int i = 0; i < loggedinstaff.getStaffships().length; i++) {
                    ids.append(loggedinstaff.getStaffships()[i].getOwner());
                    if (i < loggedinstaff.getStaffships().length - 1) {
                        ids.append(";");
                    }
                }
            }
            String id = ids.toString();
            if (id.indexOf("00000000000001R") >= 0) {
                id = "00000000000001R";
            }
            String url = API_DomainName + "/service15/api0";
            HttpPost httpPost = new HttpPost(url);
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("ids", id));
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
        } else if (api.equals("2")) {
            // get a report service object;
            String url = API_DomainName + "/service15/api2";
            String id = request.getParameter("id");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("id", id));
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
        } else if (api.equals("9")) {
            // run and get a report;
            String url = API_DomainName + "/service15/api3";
            String id = request.getParameter("id");
            String condition = request.getParameter("condition");
            String search = request.getParameter("search");
            String pageno = request.getParameter("pageno");
            String pagesize = request.getParameter("pagesize");

            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("id", id));
            urlParameters.add(new BasicNameValuePair("condition", condition));
            urlParameters.add(new BasicNameValuePair("search", search));
            urlParameters.add(new BasicNameValuePair("pageno", pageno));
            urlParameters.add(new BasicNameValuePair("pagesize", pagesize));
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
        } else if (api.equals("12")) {
            // run and get a report;
            String url = API_DomainName + "/service15/api9";
            String id = request.getParameter("id");
            String condition = request.getParameter("condition");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("id", id));
            urlParameters.add(new BasicNameValuePair("condition", condition));// query condition
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
        } else if (api.equals("13")) {
            // get all versions in these process instances;
            String url = API_DomainName + "/service15/api10";
            String proccode = request.getParameter("proccode");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("proccode", proccode));
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
        } else if (api.equals("20")) {
            // get a process object build time repository
            String url = API_DomainName + "/service1/api13";
            String id = request.getParameter("id");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("id", id));
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

        } else if (api.equals("SN0")) {
            String url = API_DomainName + "/service28/api0";
            HttpGet httpGet = new HttpGet(url);
            try {
                httpGet.setURI(new URI(httpGet.getURI().toString()));
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

        if (api.equals("LL3")) { // submit a single-participant workflow

            // 在这里cmd含义代表着命令，也就是点了那个按钮
            // 0:保存;1:关闭;2:提交;3:退回;4:委托
            HttpPost httpPost = new HttpPost(API_DomainName + "/service14/api3");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String cmd = request.getParameter("cmd");
            String ip = request.getParameter("ip");
            String pid = request.getParameter("pid");
            String tid = request.getParameter("tid");
            String list = request.getParameter("list");
            urlParameters.add(new BasicNameValuePair("serverip", ip));
            urlParameters.add(new BasicNameValuePair("cmd", cmd));
            urlParameters.add(new BasicNameValuePair("pid", pid));
            urlParameters.add(new BasicNameValuePair("tid", tid));
            urlParameters.add(new BasicNameValuePair("userid", loggedinstaff.getUser().getId()));
            urlParameters.add(new BasicNameValuePair("fullname", loggedinstaff.getUser().getFullName()));
            urlParameters.add(new BasicNameValuePair("list", list));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();

        } else if (api.equals("4")) {  //生成Excel
            // run and get a report;
            HttpPost httpPost = new HttpPost(API_DomainName + "/service15/api4");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String id = request.getParameter("id");
            String condition = request.getParameter("condition");
            String search = request.getParameter("search");
            urlParameters.add(new BasicNameValuePair("id", id));
            urlParameters.add(new BasicNameValuePair("condition", condition));
            urlParameters.add(new BasicNameValuePair("search", search));
            String fn = request.getParameter("filename");
            String filename = new String(fn.getBytes("iso8859-1"), "utf-8");
            String filename2 = URLEncoder.encode(filename, "UTF-8");

            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            InputStream in = entity.getContent();
            // responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            OutputStream out = response.getOutputStream();
            response.setContentType(getServletContext().getMimeType(filename));
            String fn1 = "attachment; filename=" + filename2 + "_" + DateUtility.getCurDateTime() + ".xls";
            response.setHeader("Content-disposition", fn1);
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

//            HttpPost httpPost = new HttpPost(API_DomainName + "/service15/api4");
//            String id = request.getParameter("id");
//            String condition = request.getParameter("condition");
//            long s = System.currentTimeMillis();
//            //判断有没有generate文件夹
//            String importPath = request.getServletContext().getRealPath(".") + File.separator + "generate";
//            File importDir = new File(importPath);
//            if (!importDir.exists()) {
//                importDir.mkdir();
//            }
//            // 上传文件存储目录（这是一个临时文件存储目录，临时文件用完后删除）
//            String uploadPath = request.getServletContext().getRealPath(".") + File.separator + "generate/time_" + s + "/";
//            uploadPath = uploadPath.replaceAll("\\\\", "/");
//            File uploadDir = new File(uploadPath);
//            if (!uploadDir.exists()) {
//                uploadDir.mkdir();
//            }
//            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
//            urlParameters.add(new BasicNameValuePair("id", id));
//            urlParameters.add(new BasicNameValuePair("condition", condition));
//            urlParameters.add(new BasicNameValuePair("uploadPath", uploadPath));
//            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
//            String fname = "输出文件.xls";
//            httpPost.setEntity(postParams);
//            response1 = httpClient.execute(httpPost);
//            HttpEntity entity = response1.getEntity();
//            response.setContentType("application/octet-stream");
//            String contenttype = request.getServletContext().getMimeType(fname);
//            if (contenttype != null && !contenttype.equals("")) {
//                response.setContentType(contenttype);
//            }
//            response.setContentLengthLong(entity.getContentLength());
//            // Make sure to show the download dialog
//            response.setCharacterEncoding("UTF-8");
//            String filename = "";
//            String userAgent = request.getHeader("user-agent").toLowerCase();
//            if (userAgent.contains("msie") || userAgent.contains("like gecko")) {
//                // win10 ie edge 浏览器 和其他系统的ie
//                filename = URLEncoder.encode(fname, "UTF-8");
//            } else {
//                // fe
//                filename = new String(fname.getBytes("UTF-8"), "iso-8859-1");
//            }
//            response.setHeader("Content-Disposition", "attachment; filename=" + filename);
//            response.setHeader("Pragma", "No-cache");
//            response.setHeader("Cache-Control", "No-cache");
//            response.setDateHeader("Expires", 0);
//            OutputStream out = response.getOutputStream();
//            int b;
//            InputStream in = entity.getContent();
//            while ((b = in.read()) != -1) {
//                out.write(b);
//            }
//            out.flush();
//            in.close();
//            out.close();
//            //删除文件
//            DeleteFile df = new DeleteFile();
//            df.delDir(uploadPath);
//            httpClient.close();
//            httpPost.abort();
        } else if (api.equals("5")) {  // 保存Report service object
            HttpPost httpPost = new HttpPost(API_DomainName + "/service15/api5");
            String obj = request.getParameter("obj");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("reportservice", obj));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("6")) {  // Delete data
            HttpPost httpPost = new HttpPost(API_DomainName + "/service15/api6");
            String id = request.getParameter("id"); // process instance id;
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("piid", id));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("LL7")) { // submit a multiple-participant workflow

            HttpPost httpPost = new HttpPost(API_DomainName + "/service14/api7");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            // String token, String processid, String userid,
            // String userip, String useripv6, String longitude,
            // String latitude, String device, String paramvalues
            String pid = request.getParameter("pid");
            String list = request.getParameter("list");
            urlParameters.add(new BasicNameValuePair("token", ""));
            urlParameters.add(new BasicNameValuePair("processid", pid));
            urlParameters.add(new BasicNameValuePair("userid", loggedinstaff.getUser().getId()));
            urlParameters.add(new BasicNameValuePair("userip", request.getRemoteAddr()));
            urlParameters.add(new BasicNameValuePair("useripv6", request.getRemoteAddr()));
            urlParameters.add(new BasicNameValuePair("longitude", "2"));
            urlParameters.add(new BasicNameValuePair("latitude", "3"));
            urlParameters.add(new BasicNameValuePair("device", "iphone10"));
            urlParameters.add(new BasicNameValuePair("paramvalues", list));
            urlParameters.add(new BasicNameValuePair("userfullname", loggedinstaff.getUser().getFullName()));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();

        } else if (api.equals("8")) {
            // 创建一个大数据报表服务。
            HttpPost httpPost = new HttpPost(API_DomainName + "/service15/api1");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String entityname = request.getParameter("entityname");
            String parentid = request.getParameter("parentid");
            String ownerid = request.getParameter("ownerid");
            String type = request.getParameter("type");
            String version = request.getParameter("version");
            String reporttype = request.getParameter("reporttype");
            String crossversion = request.getParameter("crossversion");
            urlParameters.add(new BasicNameValuePair("entityname", entityname));
            urlParameters.add(new BasicNameValuePair("parentid", parentid));
            urlParameters.add(new BasicNameValuePair("ownerid", ownerid));
            urlParameters.add(new BasicNameValuePair("type", type));
            urlParameters.add(new BasicNameValuePair("version", version));
            urlParameters.add(new BasicNameValuePair("reporttype", reporttype));
            urlParameters.add(new BasicNameValuePair("crossversion", crossversion));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();

        } else if (api.equals("10")) {
            // rename big data report service name
            HttpPost httpPost = new HttpPost(API_DomainName + "/service15/api7");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String id = request.getParameter("id");
            String pname = request.getParameter("entityname");
            String date = request.getParameter("lastupdate");
            urlParameters.add(new BasicNameValuePair("id", id));
            urlParameters.add(new BasicNameValuePair("entityname", pname));
            urlParameters.add(new BasicNameValuePair("lastupdate", date));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();

        } else if (api.equals("11")) {
            // remove big data report service
            HttpPost httpPost = new HttpPost(API_DomainName + "/service15/api8");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String id = request.getParameter("id");
            urlParameters.add(new BasicNameValuePair("id", id));
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

}
