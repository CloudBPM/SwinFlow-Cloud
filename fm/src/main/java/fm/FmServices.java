package fm;

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
 * Servlet implementation class AmServices
 */
@WebServlet("/FmServices")
public class FmServices extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Login loggedinstaff = null;
//	private static final String API_DomainName = "http://localhost:8080/api";
	private static  String API_DomainName = null;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public FmServices() {
		super();
	}

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
		// get organization list for application service management tree viewer
		if (api.equals("0")) {
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
			String url = API_DomainName + "/service9/api0";
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
			// get new ID for an organization component object.
			String url = API_DomainName + "/service9/api2";
			HttpGet httpGet = new HttpGet(url);
			response1 = httpClient.execute(httpGet);
			if (response1.getStatusLine().getStatusCode() != 200) {
				throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
			}
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpGet.abort();
		} else if (api.equals("5")) {
			// get a form object build time repository
			String url = API_DomainName + "/service9/api5";
			String id = request.getParameter("id");
			String r = request.getParameter("r");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("id", id));
			urlParameters.add(new BasicNameValuePair("r", r));
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
		} else if (api.equals("8")) {
			// get all reference tree
			String url = API_DomainName + "/service10/api0";
			HttpPost httpPost = new HttpPost(url);
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String id = request.getParameter("refid");
			urlParameters.add(new BasicNameValuePair("id", id));
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
		} else if (api.equals("9")) {
			// get new serial number
			String url = API_DomainName + "/service10/api2";
			HttpGet httpGet = new HttpGet(url);
			response1 = httpClient.execute(httpGet);
			if (response1.getStatusLine().getStatusCode() != 200) {
				throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
			}
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpGet.abort();
		} else if (api.equals("10")) {
			// get a reference object
			String url = API_DomainName + "/service10/api5";
			HttpPost httpPost = new HttpPost(url);
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String id = request.getParameter("id");
			urlParameters.add(new BasicNameValuePair("id", id));
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
		} else if (api.equals("11")) {
			// get a reference detail object
			String url = API_DomainName + "/service10/api6";
			HttpPost httpPost = new HttpPost(url);
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String id = request.getParameter("id");
			urlParameters.add(new BasicNameValuePair("id", id));
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
		} else if (api.equals("13")) {
			// get all reference objects to support the form designing
			String url = API_DomainName + "/service10/api8";
			HttpPost httpPost = new HttpPost(url);
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String id = request.getParameter("id");
			urlParameters.add(new BasicNameValuePair("id", id));
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
		} else if (api.equals("14")) {
			// get the reference details at special code.
			String url = API_DomainName + "/service10/api9";
			HttpPost httpPost = new HttpPost(url);
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String id = request.getParameter("id");
			String code = request.getParameter("code");
			urlParameters.add(new BasicNameValuePair("id", id));
			urlParameters.add(new BasicNameValuePair("code", code));
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
		} else if (api.equals("15")) {// get organization list for form tree
			String url = API_DomainName + "/service9/api7";
			HttpPost httpPost = new HttpPost(url);
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String ownerid = request.getParameter("oid");
			urlParameters.add(new BasicNameValuePair("orgid", ownerid));
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
		} else if (api.equals("17")) {// get a released form from repository
			String url = API_DomainName + "/service9/api9";
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
		} else if (api.equals("24")) {// get a report service list for table view component
			String url = API_DomainName + "/service15/api11";
			String owner = request.getParameter("owner");
			String types = request.getParameter("types");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("owner", owner));
			urlParameters.add(new BasicNameValuePair("types", types));
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
		} else if (api.equals("25")) {// get a report page list for pageable table view component

			// run and get a report;
			String url = API_DomainName + "/service15/api12";
			String id = request.getParameter("id");
			String search = request.getParameter("search");
			String pageno = request.getParameter("pageno");
			String pagesize = request.getParameter("pagesize");

			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("id", id));
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


		} else if (api.equals("26")) {// get a report page list for table view component
			// run and get a report;
			String url = API_DomainName + "/service15/api13";
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

		} else if (api.equals("27")) {
			// get new ID for an organization component object.
			String url = API_DomainName + "/service9/api18";
			String idnum = request.getParameter("num");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("idnum", idnum));
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
		} else if (api.equals("SN1")) {
			// get all approval logs
			String url = API_DomainName + "/service29/api0";
			String condition = request.getParameter("cond");
			String pn = request.getParameter("pn");
			String psz = request.getParameter("psz");
			String objectid = request.getParameter("objectid");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("condition", condition));
			urlParameters.add(new BasicNameValuePair("pageno", pn));
			urlParameters.add(new BasicNameValuePair("pagesize", psz));
			urlParameters.add(new BasicNameValuePair("objectid", objectid));

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

		if (api.equals("3")) {// create a new form folder
			HttpPost httpPost = new HttpPost(API_DomainName + "/service9/api3");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String entityname = request.getParameter("ename");
			String type = request.getParameter("tpe");
			String parentid = request.getParameter("pid");
			String ownerid = request.getParameter("oid");
			urlParameters.add(new BasicNameValuePair("entityname", entityname));
			urlParameters.add(new BasicNameValuePair("type", type));
			urlParameters.add(new BasicNameValuePair("parentid", parentid));
			urlParameters.add(new BasicNameValuePair("ownerid", ownerid));
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		} else if (api.equals("4")) {// create a new form
			HttpPost httpPost = new HttpPost(API_DomainName + "/service9/api4");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String entityname = request.getParameter("ename");
			String parentid = request.getParameter("pid");
			String ownerid = request.getParameter("oid");
			String authorid = request.getParameter("authorid");
			String authorname = request.getParameter("author");
			String stype = request.getParameter("stype");
			urlParameters.add(new BasicNameValuePair("entityname", entityname));
			urlParameters.add(new BasicNameValuePair("parentid", parentid));
			urlParameters.add(new BasicNameValuePair("ownerid", ownerid));
			urlParameters.add(new BasicNameValuePair("authorid", authorid));
			urlParameters.add(new BasicNameValuePair("authorname", authorname));
			urlParameters.add(new BasicNameValuePair("servicetype", stype));
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		} else if (api.equals("6")) {
			// save a form object into repository
			HttpPost httpPost = new HttpPost(API_DomainName + "/service9/api6");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String form = request.getParameter("f");
			urlParameters.add(new BasicNameValuePair("f", form));
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		} else if (api.equals("7")) {// create a new reference
			HttpPost httpPost = new HttpPost(API_DomainName + "/service10/api3");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String entityname = request.getParameter("ename");
			String parentid = request.getParameter("pid");
			String ownerid = request.getParameter("oid");
			urlParameters.add(new BasicNameValuePair("entityname", entityname));
			urlParameters.add(new BasicNameValuePair("parentid", parentid));
			urlParameters.add(new BasicNameValuePair("ownerid", ownerid));
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		} else if (api.equals("12")) { // save one or more reference details
			HttpPost httpPost = new HttpPost(API_DomainName + "/service10/api7");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String ref = request.getParameter("ref");
			String newlist = request.getParameter("newl");
			String updatedlist = request.getParameter("updatedl");
			String removedlist = request.getParameter("removedl");
			urlParameters.add(new BasicNameValuePair("reference", ref));
			urlParameters.add(new BasicNameValuePair("newlist", newlist));
			urlParameters.add(new BasicNameValuePair("updatedlist", updatedlist));
			urlParameters.add(new BasicNameValuePair("removedlist", removedlist));
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		} else if (api.equals("16")) {
			// release a form
			HttpPost httpPost = new HttpPost(API_DomainName + "/service9/api8");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String fid = request.getParameter("fid");
			String version = request.getParameter("v");
			String versionnote = request.getParameter("vn");
			String releaser = request.getParameter("rl");
			String releaserid = request.getParameter("rid");
			String pp = request.getParameter("pp");
			String up = request.getParameter("up");
			String orgid = request.getParameter("orgid");
			String parent = request.getParameter("pfd");// parent folder ID
			urlParameters.add(new BasicNameValuePair("fid", fid));
			urlParameters.add(new BasicNameValuePair("version", version));
			urlParameters.add(new BasicNameValuePair("releaserid", releaserid));
			urlParameters.add(new BasicNameValuePair("releaser", releaser));
			urlParameters.add(new BasicNameValuePair("versionnote", versionnote));
			urlParameters.add(new BasicNameValuePair("purchaseprice", pp));
			urlParameters.add(new BasicNameValuePair("usageprice", up));
			urlParameters.add(new BasicNameValuePair("parent", parent));
			urlParameters.add(new BasicNameValuePair("orgid", orgid));
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		} else if (api.equals("18")) {
			// update a released form
			HttpPost httpPost = new HttpPost(API_DomainName + "/service9/api10");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String f = request.getParameter("f");
			urlParameters.add(new BasicNameValuePair("f", f));
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		} else if (api.equals("19")) {
			// 0=release/1:withdraw a form
			HttpPost httpPost = new HttpPost(API_DomainName + "/service9/api11");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String id = request.getParameter("id");
			String d = request.getParameter("d");
			String lastupdate = request.getParameter("lastupdate");
			String owner = request.getParameter("owner");
			String userId = request.getParameter("userId");
			String userfullname = request.getParameter("userfullname");
			String ownername = request.getParameter("ownername");
			String comment = request.getParameter("comment");
			urlParameters.add(new BasicNameValuePair("id", id));
			urlParameters.add(new BasicNameValuePair("deprecated", d));
			urlParameters.add(new BasicNameValuePair("comment", comment));
			urlParameters.add(new BasicNameValuePair("lastupdate", lastupdate));
			urlParameters.add(new BasicNameValuePair("owner", owner));
			urlParameters.add(new BasicNameValuePair("userId", userId));
			urlParameters.add(new BasicNameValuePair("userfullname", userfullname));
			urlParameters.add(new BasicNameValuePair("ownername", ownername));
			
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		} else if (api.equals("20")) {
			// delete a form/reference/released form
			HttpPost httpPost = new HttpPost(API_DomainName + "/service9/api14");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String id = request.getParameter("id");
			String oid = request.getParameter("oid");
			// reference id or form id
			urlParameters.add(new BasicNameValuePair("id", id)); 
			urlParameters.add(new BasicNameValuePair("ownerid", oid));
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		} else if (api.equals("21")) {
			// update a form name/a reference name/a released form
			HttpPost httpPost = new HttpPost(API_DomainName + "/service9/api16");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String id = request.getParameter("id");
			String pname = request.getParameter("entityname");
			String date = request.getParameter("lastupdate");
			String type = request.getParameter("type");
			urlParameters.add(new BasicNameValuePair("id", id));
			urlParameters.add(new BasicNameValuePair("entityname", pname));
			urlParameters.add(new BasicNameValuePair("lastupdate", date));
			urlParameters.add(new BasicNameValuePair("type", type));
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		} else if (api.equals("22")) {
			// update name of a folder into repository
			HttpPost httpPost = new HttpPost(API_DomainName + "/service9/api17");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String id = request.getParameter("id");
			String fname = request.getParameter("entityname");
			urlParameters.add(new BasicNameValuePair("id", id));
			urlParameters.add(new BasicNameValuePair("entityname", fname));
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		} else if (api.equals("23")) {
			// delete one folder from tree viewer
			HttpPost httpPost = new HttpPost(API_DomainName + "/service9/api15");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String ids = request.getParameter("ids");
			String oid = request.getParameter("oid");
			urlParameters.add(new BasicNameValuePair("ids", ids));
			urlParameters.add(new BasicNameValuePair("ownerid", oid));
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
