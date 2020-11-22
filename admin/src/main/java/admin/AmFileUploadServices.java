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
@WebServlet("/AmFileUploadServices")
@MultipartConfig

public class AmFileUploadServices extends HttpServlet {
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

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		CloseableHttpClient httpClient = HttpClientBuilder.create().build();
		CloseableHttpResponse response1 = null;
		String api = request.getParameter("api");
		String responseJson = null;
		if (api.equals("2")) {
			// this method is used to upload one attachment
			String oid = request.getParameter("oid");
			String fid = request.getParameter("fid");
			String fname = request.getParameter("filename");
			String fname2 = URLDecoder.decode(fname, "utf-8");
			String num = request.getParameter("num");
			String lastupdate = request.getParameter("lastupdate");
			MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create();
			multipartEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
			multipartEntityBuilder.addTextBody("oid", oid, ContentType.DEFAULT_BINARY);
			multipartEntityBuilder.addTextBody("lastupdate", lastupdate, ContentType.DEFAULT_BINARY);
			multipartEntityBuilder.addTextBody("num", num, ContentType.DEFAULT_BINARY);
			multipartEntityBuilder.addTextBody("tid", fid == null ? "" : fid, ContentType.DEFAULT_BINARY);
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

			HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api14");
			httpPost.setEntity(httpEntity);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, Charset.forName("UTF-8")).trim();
			httpClient.close();
			httpPost.abort();
		} else if (api.equals("3")) {
			// remove one file attachment
			HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api15");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String oid = request.getParameter("oid");
			String tid = request.getParameter("tid");
			String fid = request.getParameter("fid");
			String filename = request.getParameter("filename");
			String num = request.getParameter("num");
			String lastupdate = request.getParameter("lastupdate");

			urlParameters.add(new BasicNameValuePair("oid", oid));
			urlParameters.add(new BasicNameValuePair("tid", tid));
			urlParameters.add(new BasicNameValuePair("fid", fid));
			urlParameters.add(new BasicNameValuePair("filename", filename));
			urlParameters.add(new BasicNameValuePair("num", num));
			urlParameters.add(new BasicNameValuePair("lastupdate", lastupdate));

			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		} else if (api.equals("4")) {
			// remove one file attachments of a news
			HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api16");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String oid = request.getParameter("oid");
			String tid = request.getParameter("tid");

			urlParameters.add(new BasicNameValuePair("oid", oid));
			urlParameters.add(new BasicNameValuePair("tid", tid));

			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		}else if (api.equals("5")) {
			// upload one or more file  video、pdf、mp3、live
			String userId = loggedinstaff.getUser().getId();
			String ownerId = request.getParameter("oid");
			String data = request.getParameter("data");
			String type = request.getParameter("type");
			String flen = request.getParameter("flen");
			String string = request.getParameter("fname");
			System.out.println(request.getCharacterEncoding());
			String fname = new String(string.getBytes("iso8859-1"), "utf-8");
			MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create();
            multipartEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
            multipartEntityBuilder.addTextBody("fname", string);
            multipartEntityBuilder.addTextBody("flen", flen);
			multipartEntityBuilder.addTextBody("owner", ownerId);
			multipartEntityBuilder.addTextBody("data", data);
			multipartEntityBuilder.addTextBody("type", type);
			multipartEntityBuilder.addTextBody("userId", userId);
			for (Part filePart : request.getParts()) {
				System.out.println(filePart.getName());
                    if (filePart.getName().startsWith("file")) {
                        multipartEntityBuilder.addBinaryBody("uploadFile", filePart.getInputStream(),
                                ContentType.DEFAULT_BINARY, filePart.getName());
                }
            }
			multipartEntityBuilder.setCharset(CharsetUtils.get("UTF-8"));
			HttpEntity httpEntity = multipartEntityBuilder.build();
			HttpPost httpPost = new HttpPost(API_DomainName + "/service19/api28");
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
