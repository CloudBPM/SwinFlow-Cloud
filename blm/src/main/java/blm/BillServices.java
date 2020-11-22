package blm;

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
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

/**
 * Servlet implementation class BillServices
 */
@WebServlet("/BillServices")
public class BillServices extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Login loggedinstaff = null;
//	private static final String API_DomainName = "http://localhost:8080/api";
	private static String API_DomainName = null;

	/**
	 * @see HttpServlet#service(HttpServletRequest request, HttpServletResponse
	 *      response)
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

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		CloseableHttpClient httpClient = HttpClientBuilder.create().build();
		CloseableHttpResponse response1 = null;
		String api = request.getParameter("api");
		String responseJson = null;
		if (api.equals("0")) {// get organization list for process tree viewer
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
			String url = API_DomainName + "/service16/api0";
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
		} else if(api.equals("SN0")) {
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
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		CloseableHttpClient httpClient = HttpClientBuilder.create().build();
		CloseableHttpResponse response1 = null;
		String api = request.getParameter("api");
		String responseJson = null;
		if (api.equals("3")) {

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
