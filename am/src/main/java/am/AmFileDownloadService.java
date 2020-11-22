package am;

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
import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/AmFileDownloadServices")
@MultipartConfig
public class AmFileDownloadService extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private Login loggedinstaff = null;
	//private static final String API_DomainName = "http://localhost:8080/api";
	private static final String API_DomainName = "http://localhost:8088/api";

	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
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

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		CloseableHttpClient httpClient = HttpClientBuilder.create().build();
		CloseableHttpResponse response1 = null;
		String api = request.getParameter("api");
		String responseJson = null;

		if (api.equals("0")) { // get one Java application service by ID
			String url = API_DomainName + "/service19/api18";
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("oid", request.getParameter("oid")));
			urlParameters.add(new BasicNameValuePair("dir", request.getParameter("dir")));
			urlParameters.add(new BasicNameValuePair("fid", request.getParameter("fid")));
			urlParameters.add(new BasicNameValuePair("project", request.getParameter("project")));
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
		if (api.equals("1")) { // 点击下载文件管理器中的文件
			HttpPost httpPost = new HttpPost(API_DomainName + "/service18/api11");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			// 获得请求文件名
			String cid = request.getParameter("cid");
			String oid = request.getParameter("oid");
			String str = new String(request.getParameter("path").getBytes("iso8859-1"), "utf-8");
			String fname = new String(request.getParameter("filename").getBytes("iso8859-1"), "utf-8");
			String path = str +"/"+fname;
			
			urlParameters.add(new BasicNameValuePair("cid", cid));
			urlParameters.add(new BasicNameValuePair("oid", oid));
			urlParameters.add(new BasicNameValuePair("path", path));
			urlParameters.add(new BasicNameValuePair("fname", fname));
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			InputStream in = entity.getContent();
			// responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			OutputStream out = response.getOutputStream();
			BufferedInputStream bis = new BufferedInputStream(in);
			BufferedOutputStream bos = new BufferedOutputStream(out);
			response.setContentType(getServletContext().getMimeType(fname));
			response.setHeader("Content-Disposition", "attachment;filename=" + fname);
			// 写文件
			byte [] buff = new byte[4096]; 
			int b;
			while ((b = bis.read(buff,0,buff.length)) != -1) {
				bos.write(buff,0,b);
			}
			bos.close();
			bis.close();
			httpClient.close();
			httpPost.abort();
		} else if (api.equals("2")) { // 点击下载邮件模板中的附件文件
			String oid = request.getParameter("oid"); // organization id
			String fid = request.getParameter("fid"); // attachment id (file constant id)
			String templid = request.getParameter("tid"); // template id;
			String fname = new String(request.getParameter("filename").getBytes("iso8859-1"), "utf-8");
			String source = "/" + oid + "/am/emltp/" + templid+"/"+fid+"_"+fname;
			HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api10");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("oid", oid));
			urlParameters.add(new BasicNameValuePair("path", source));
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			response.setContentType("application/octet-stream");
			String contenttype = request.getServletContext().getMimeType(fname);
			if (contenttype != null && !contenttype.equals("")) {
				response.setContentType(contenttype);
			}
			response.setContentLengthLong(entity.getContentLength());
			// Make sure to show the download dialog
			response.setCharacterEncoding("UTF-8");
			String filename = "";
			String userAgent = request.getHeader("user-agent").toLowerCase();
			if (userAgent.contains("msie") || userAgent.contains("like gecko")) {
				// win10 ie edge 浏览器 和其他系统的ie
				filename = URLEncoder.encode(fname, "UTF-8");
			} else {
				// fe
				filename = new String(fname.getBytes("UTF-8"), "iso-8859-1");
			}
			response.setHeader("Content-Disposition", "attachment; filename=" + filename);
			response.setHeader("Pragma", "No-cache");
			response.setHeader("Cache-Control", "No-cache");
			response.setDateHeader("Expires", 0);
			OutputStream out = response.getOutputStream();
			int b;
			InputStream in = entity.getContent();
			while ((b = in.read()) != -1) {
				out.write(b);
			}
			out.flush();
			in.close();
			out.close();
		} else if (api.equals("3")) { // remove one file
			MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create();
			multipartEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
			String owner = request.getParameter("ownerId");
			String dir = request.getParameter("dir");
			String fid = request.getParameter("fid");
			String appid = request.getParameter("appid");
			multipartEntityBuilder.addTextBody("oid", owner, ContentType.DEFAULT_BINARY);
			multipartEntityBuilder.addTextBody("dir", dir, ContentType.DEFAULT_BINARY);
			multipartEntityBuilder.addTextBody("appid", appid, ContentType.DEFAULT_BINARY);
			multipartEntityBuilder.addTextBody("fid", fid, ContentType.DEFAULT_BINARY);
			multipartEntityBuilder.addTextBody("project", "am", ContentType.DEFAULT_BINARY);
			multipartEntityBuilder.setCharset(CharsetUtils.get("UTF-8"));
			HttpEntity httpEntity = multipartEntityBuilder.build();

			HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api19");
			httpPost.setEntity(httpEntity);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, Charset.forName("UTF-8")).trim();
			httpClient.close();
			httpPost.abort();
		}
	}
}
