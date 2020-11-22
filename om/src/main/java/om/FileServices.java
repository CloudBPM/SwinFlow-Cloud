package om;

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
import org.json.JSONObject;
import poi.Dataimport;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.*;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/FileServices")
@MultipartConfig

public class FileServices extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Login loggedinstaff = null;
    //	private static final String API_DomainName = "http://localhost:8080/api";
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

//	public void checkPermission(HttpServletRequest request, HttpServletResponse response,HttpSession session2,String userid) throws JsonParseException, JsonMappingException, IOException, ServletException{
//		
//		CloseableHttpClient httpClient = HttpClientBuilder.create().build();
//		CloseableHttpResponse response1 = null;
//		String responseJson = null;
//		String result = "";
//		HttpPost httpPost = new HttpPost(API_DomainName+"/service2/api23");
//		String prsn = request.getParameter("prsn");
//		String oid = request.getParameter("oid");
//		if(!oid.equals("mainContent")){
//			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
//			urlParameters.add(new BasicNameValuePair("uid", userid));
//			urlParameters.add(new BasicNameValuePair("prsn", prsn));
//			urlParameters.add(new BasicNameValuePair("oid", oid));
//			String str = EntityUtils.toString(new UrlEncodedFormEntity(urlParameters, "utf-8"));
//			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
//			httpPost.setEntity(postParams);
//			response1 = httpClient.execute(httpPost);
//			if (response1.getStatusLine().getStatusCode() != 200) {
//				throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
//			}
//			HttpEntity entity = response1.getEntity();
//			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
//			JSONObject resultJson = new JSONObject(responseJson);
//			result = (String) resultJson.get("status");
//			System.out.println(result);
//			httpClient.close();
//			httpPost.abort();
//		}
//		if(result.equals("0")||result.equals("-10")){
//			response.setCharacterEncoding("utf8");
//			response.setContentType("application/json");
//			PrintWriter out = response.getWriter();
//			out.print(responseJson);
//			out.close();
//		}else{
//			super.service(request, response);
//		}
//	}

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
            String oid = request.getParameter("ownerId");
            String type = request.getParameter("type");
            String fid = request.getParameter("fid");
            String fname = request.getParameter("filename");
            String fname2 = URLDecoder.decode(fname, "utf-8");
            MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create();
            multipartEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
            multipartEntityBuilder.addTextBody("oid", oid, ContentType.DEFAULT_BINARY);
            multipartEntityBuilder.addTextBody("type", type, ContentType.DEFAULT_BINARY);
            multipartEntityBuilder.addTextBody("fid", fid == null ? "" : fid, ContentType.DEFAULT_BINARY);
            String s = URLEncoder.encode(fname2, "utf-8");
            multipartEntityBuilder.addTextBody("fname", s, ContentType.DEFAULT_BINARY);

            for (Part filePart : request.getParts()) {
                multipartEntityBuilder.addBinaryBody("uploadFile", filePart.getInputStream(),
                        ContentType.DEFAULT_BINARY, fname);
            }

            multipartEntityBuilder.setCharset(CharsetUtils.get("UTF-8"));
            HttpEntity httpEntity = multipartEntityBuilder.build();

            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api0");
            httpPost.setEntity(httpEntity);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, Charset.forName("UTF-8")).trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("1")) {
            // remove one org images
            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api2");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String oid = request.getParameter("ownerId");
            String fid = request.getParameter("fid");
            String type = request.getParameter("type");

            urlParameters.add(new BasicNameValuePair("oid", oid));
            urlParameters.add(new BasicNameValuePair("fid", fid));
            urlParameters.add(new BasicNameValuePair("type", type));

            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("2")) { //
            String oid = request.getParameter("oid");
            String path = request.getParameter("path");
            String fid = request.getParameter("fid");
            String fname = request.getParameter("fname");
            String fname2 = URLDecoder.decode(fname, "utf-8");
            MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create();
            multipartEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
            multipartEntityBuilder.addTextBody("oid", oid, ContentType.DEFAULT_BINARY);
            multipartEntityBuilder.addTextBody("path", path, ContentType.DEFAULT_BINARY);
            multipartEntityBuilder.addTextBody("fid", fid == null ? "" : fid, ContentType.DEFAULT_BINARY);
            String s = URLEncoder.encode(fname2, "utf-8");
            multipartEntityBuilder.addTextBody("fname", s, ContentType.DEFAULT_BINARY);

            for (Part filePart : request.getParts()) {
                multipartEntityBuilder.addBinaryBody("uploadFile", filePart.getInputStream(),
                        ContentType.DEFAULT_BINARY, fname);
            }

            multipartEntityBuilder.setCharset(CharsetUtils.get("UTF-8"));
            HttpEntity httpEntity = multipartEntityBuilder.build();

            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api8");
            httpPost.setEntity(httpEntity);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, Charset.forName("UTF-8")).trim();
            httpClient.close();
            httpPost.abort();

        } else if (api.equals("3")) {                //加载企事业资料
            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api1");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String oid = request.getParameter("ownerId");
            String fid = request.getParameter("fid");

            urlParameters.add(new BasicNameValuePair("oid", oid));
            urlParameters.add(new BasicNameValuePair("fid", fid));
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();

            httpClient.close();
            httpPost.abort();
        } else if (api.equals("4")) {
            // remove one org images
            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api9");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String oid = request.getParameter("oid");
            String path = request.getParameter("path");

            urlParameters.add(new BasicNameValuePair("oid", oid));
            urlParameters.add(new BasicNameValuePair("path", path));

            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if(api.equals("5")) {                //批量新增一般员工信息
            String ownerId = request.getParameter("orgId");
            String name = request.getParameter("name");
            String orgname = request.getParameter("orgname");
            String position = request.getParameter("position");
            String fname = request.getParameter("fname");
            String fname2 = URLDecoder.decode(fname, "utf-8");
            long s = System.currentTimeMillis();
            //判断有没有import文件夹
            String importPath = request.getServletContext().getRealPath(".") + File.separator + "import";
            File importDir = new File(importPath);
            if (!importDir.exists()) {
                importDir.mkdir();
            }
            // 上传文件存储目录
            String uploadPath = request.getServletContext().getRealPath(".") + File.separator + "import/time_" + s + "/";
            uploadPath = uploadPath.replaceAll("\\\\", "/");
            String filepath = uploadPath + fname2;
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdir();
            }
            for (Part filePart : request.getParts()) {
                //解析文件
                InputStream in = filePart.getInputStream();
                FileOutputStream out = new FileOutputStream(filepath);
                //OutputStream out = response.getOutputStream();
                int b;
                while ((b = in.read()) != -1) {
                    out.write(b);
                }
                out.flush();
                in.close();
                out.close();
                ArrayList<String> list = new ArrayList<String>();
                ArrayList<String> erroneousRow = new ArrayList<String>();
                Dataimport sw = new Dataimport();
                list = sw.getExcel2(filepath, fname2);
                //错误行信息
                erroneousRow = sw.getCount2(filepath, fname2);
                sw.delDir(uploadPath);
                String erroneousRowNumber = erroneousRow.toString();
                //导入成功计数
                String successCount = list.size() / 14 - erroneousRow.size() + "";
                JSONObject information = new JSONObject();
                information.put("erroneousRowNumber", "");
                //判断有没有重复信息
                String temp = "";
                for (int i = 0; i < list.size() - 14; i = i + 14) {
                    temp = list.get(i + 4);
                    for (int j = i + 14; j < list.size(); j = j + 14) {
                        if (temp.equals(list.get(j + 4))) {
                            information.put("successCount", "0");
                            information.put("erroneousRowNumber", "第" + (i / 14 + 3) + "行身份证跟第" + (j / 14 + 3) + "行身份证重复");
                            information.put("status", 1);
                        }
                    }
                }
                //如果有信息重复则返回
                if (!information.get("erroneousRowNumber").equals("")) {
                    responseJson = information.toString().trim();
                    break;
                }
                information.put("successCount", successCount);
                information.put("erroneousRowNumber", erroneousRowNumber);
                information.put("status", 1);
                HttpPost httpPost = new HttpPost(API_DomainName + "/service5/api12");
                List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
                //ArrayList转String
                String strNormalStaff = String.join(",", (String[]) list.toArray(new String[list.size()]));
                urlParameters.add(new BasicNameValuePair("strNormalStaff", strNormalStaff));
                urlParameters.add(new BasicNameValuePair("ownerId", ownerId));
                urlParameters.add(new BasicNameValuePair("userName", name));
                urlParameters.add(new BasicNameValuePair("orgName", orgname));
                urlParameters.add(new BasicNameValuePair("positionName", position));
                HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
                httpPost.setEntity(postParams);
                response1 = httpClient.execute(httpPost);
//				HttpEntity entity = response1.getEntity();
//				responseJson = EntityUtils.toString(entity, "UTF-8").trim();
                httpPost.abort();

                httpClient.close();
                responseJson = information.toString().trim();
                break;

            }
        } else if (api.equals("6")) {
            // upload one or more files to system.
            String ownerId = request.getParameter("ownerId");
            String targetpath = request.getParameter("targetpath");
            String path = new String(targetpath.getBytes("iso8859-1"), "utf-8");
            String path2 = URLEncoder.encode(path, "UTF-8");
            String fname = request.getParameter("filename");
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

        } else if (api.equals("7")) {
            // remove one file for file management
            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api24");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String oid = request.getParameter("ownerId");
            String path = request.getParameter("path");
            String fname = request.getParameter("fname");

            urlParameters.add(new BasicNameValuePair("oid", oid));
            urlParameters.add(new BasicNameValuePair("path", path));
            urlParameters.add(new BasicNameValuePair("fname", fname));

            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("8")) {
            // create folder for file management
            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api25");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String oid = request.getParameter("ownerId");
            String path = request.getParameter("path");
            String fname = request.getParameter("foldername");

            urlParameters.add(new BasicNameValuePair("oid", oid));
            urlParameters.add(new BasicNameValuePair("path", path));
            urlParameters.add(new BasicNameValuePair("foldername", fname));

            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("9")) {
            // rename folder name for file management
            HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api26");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            String oid = request.getParameter("ownerId");
            String path = request.getParameter("path");
            String oldname = request.getParameter("oldname");
            String newname = request.getParameter("newname");

            urlParameters.add(new BasicNameValuePair("oid", oid));
            urlParameters.add(new BasicNameValuePair("path", path));
            urlParameters.add(new BasicNameValuePair("oldname", oldname));
            urlParameters.add(new BasicNameValuePair("newname", newname));

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

