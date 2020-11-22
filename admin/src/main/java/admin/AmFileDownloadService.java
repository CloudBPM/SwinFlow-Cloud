package admin;

import com.alibaba.fastjson.JSON;
import com.cloud.core.session.redis.JedisUtil;
import com.cloudibpm.core.session.utils.SessionUtils;
import com.cloudibpm.core.user.Login;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;

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
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/AmFileDownloadServices")
@MultipartConfig
public class AmFileDownloadService extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private Login loggedinstaff = null;
	//	private static final String API_DomainName = "http://localhost:8080/api";
	private static  String API_DomainName = null;

	/**
	 * @see HttpServlet#service(HttpServletRequest request, HttpServletResponse
	 * response)
	 */
	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
//		API_DomainName=request.getScheme() + "://" + request.getServerName() + ":8088/api";
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

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		CloseableHttpClient httpClient = HttpClientBuilder.create().build();
		CloseableHttpResponse response1 = null;
		String api = request.getParameter("api");
		String responseJson = null;

		if (api.equals("2")) { // 点击下载新闻中的图片或文件附件（这个功能是用来测试上传的文件是否正确）
			String oid = request.getParameter("oid"); // organization id
			String fid = request.getParameter("fid"); // attachment id (file
														// constant id)
			String templid = request.getParameter("tid"); // template id;
			String fname = new String(request.getParameter("filename").getBytes("iso8859-1"), "utf-8");
			String source = "/" + oid + "/adm/news/" + templid + "/" + fid + "_" + fname;
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
		}
	}
}
