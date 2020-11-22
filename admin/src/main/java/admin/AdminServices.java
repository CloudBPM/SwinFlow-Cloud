package admin;

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
 * Servlet implementation class AdminServices
 */
@WebServlet("/AdminServices")
public class AdminServices extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Login loggedinstaff = null;
	//private static final String API_DomainName = "http://localhost:8080/api";
	private static  String API_DomainName = null;
	private static  String SVR_DomainName = null;

	/**
	 * @see HttpServlet#service(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
//		API_DomainName=request.getScheme() + "://" + request.getServerName() + ":8088/api";
//		SVR_DomainName=request.getScheme() + "://" + request.getServerName() + ":8080/bpmsvr";

		API_DomainName="http://localhost:8088/api";
		SVR_DomainName="http://localhost:8080/bpmsvr";

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
	@Override
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
			String url = API_DomainName + "/service13/api0";
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
			// get new ID for an process component object.
			String url = API_DomainName + "/service1/api2";
			HttpGet httpGet = new HttpGet(url);
			response1 = httpClient.execute(httpGet);
			if (response1.getStatusLine().getStatusCode() != 200) {
				throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
			}
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpGet.abort();
		} else if (api.equals("3")) {
			// get a process instance from runtime repository
			String url = API_DomainName + "/service13/api2";
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
		} else if (api.equals("4")) {
			// get all organizations to approval
			String url = API_DomainName + "/service13/api3";
			String condition = request.getParameter("cond");
			String pn = request.getParameter("pn");
			String psz = request.getParameter("psz");
			String status = request.getParameter("status");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("condition", condition));
			urlParameters.add(new BasicNameValuePair("pageno", pn));
			urlParameters.add(new BasicNameValuePair("pagesize", psz));
			urlParameters.add(new BasicNameValuePair("status", status));

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
		} else if (api.equals("5")) {
			// update organization status
			String url = API_DomainName + "/service13/api4";
			String status = request.getParameter("status");
			String oid = request.getParameter("oid");
			String lastupdate = request.getParameter("lastupdate");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("status", status));
			urlParameters.add(new BasicNameValuePair("oid", oid));
			urlParameters.add(new BasicNameValuePair("lastupdate", lastupdate));

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
		} else if (api.equals("6")) {
			// delete organization
			String url = API_DomainName + "/service13/api5";
			String oid = request.getParameter("oid");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("oid", oid));
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
		} else if (api.equals("7")) {
			// get all wfprocess to approval
			String url = API_DomainName + "/service13/api6";
			String condition = request.getParameter("cond");
			String pn = request.getParameter("pn");
			String psz = request.getParameter("psz");
			String deprecated = request.getParameter("deprecated");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("deprecated", deprecated));
			urlParameters.add(new BasicNameValuePair("condition", condition));
			urlParameters.add(new BasicNameValuePair("pageno", pn));
			urlParameters.add(new BasicNameValuePair("pagesize", psz));

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

		} else if (api.equals("10")) {
			// 删除新闻
			String url = API_DomainName + "/service13/api9";
			String newsId = request.getParameter("newsId");
			String oid = request.getParameter("oid");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("newsId", newsId));
			urlParameters.add(new BasicNameValuePair("oid", oid));
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
		} else if (api.equals("11")) {
			String url = API_DomainName + "/service2/api14";
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String ownerid = request.getParameter("oid");
			urlParameters.add(new BasicNameValuePair("id", ownerid));
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
			// get a department list from current BPM repository
			String url = API_DomainName + "/service2/api15";
			String id = request.getParameter("oid");
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
		} else if (api.equals("13")) {
			// get a position list from current BPM repository
			String url = API_DomainName + "/service2/api16";
			String id = request.getParameter("dptid");
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

		} else if (api.equals("15")) {
			// get all webappservice to approval
			String url = API_DomainName + "/service7/api18";
			String condition = request.getParameter("cond");
			String pn = request.getParameter("pn");
			String psz = request.getParameter("psz");
			String status = request.getParameter("status");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("condition", condition));
			urlParameters.add(new BasicNameValuePair("pageno", pn));
			urlParameters.add(new BasicNameValuePair("pagesize", psz));
			urlParameters.add(new BasicNameValuePair("status", status));

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
		} else if (api.equals("16")) {
			// search available external application service interface.
			String url = API_DomainName + "/service7/api17";
			String appid = request.getParameter("appid");
			String condition = request.getParameter("cond");
			String ownerid = request.getParameter("ownerid");
			String apptype = request.getParameter("apptype");
			String pageno = request.getParameter("pageno");
			String pagesize = request.getParameter("pagesize");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("appid", appid));
			urlParameters.add(new BasicNameValuePair("apptype", apptype));
			urlParameters.add(new BasicNameValuePair("cond", condition));
			urlParameters.add(new BasicNameValuePair("ownerid", ownerid));
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
		} else if (api.equals("17")) {
			// 获取所有组织审核中的新闻
			String url = API_DomainName + "/service13/api14";
			String condition = request.getParameter("cond");
			String pn = request.getParameter("pn");// 当前页数
			String psz = request.getParameter("psz");// 每页数据数
			String newsState = request.getParameter("newsState");// 新闻的状态
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("condition", condition));
			urlParameters.add(new BasicNameValuePair("pageno", pn));
			urlParameters.add(new BasicNameValuePair("pagesize", psz));
			urlParameters.add(new BasicNameValuePair("newsState", newsState));

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
		} else if (api.equals("18")) {
			// 获取所有的系统通知
			String url = API_DomainName + "/service28/api1";
			String condition = request.getParameter("cond");
			String pn = request.getParameter("pn");// 当前页数
			String psz = request.getParameter("psz");// 每页数据数
			String owner = request.getParameter("owner");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("condition", condition));
			urlParameters.add(new BasicNameValuePair("pageno", pn));
			urlParameters.add(new BasicNameValuePair("pagesize", psz));
			urlParameters.add(new BasicNameValuePair("owner", owner));

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
		} else if (api.equals("19")) {
			// search available subprocess service in process store.
			String url = API_DomainName + "/service1/api12";
			String appid = request.getParameter("pid");
			String condition = request.getParameter("cond");
			String ownerid = request.getParameter("ownerid");
			String pageno = request.getParameter("pageno");
			String pagesize = request.getParameter("pagesize");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("procid", appid));
			urlParameters.add(new BasicNameValuePair("cond", condition));
			urlParameters.add(new BasicNameValuePair("ownerid", ownerid));
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
		} else if (api.equals("22")) {
			// get all rlform to approval
			String url = API_DomainName + "/service9/api12";
			String condition = request.getParameter("cond");
			String pn = request.getParameter("pn");
			String psz = request.getParameter("psz");
			String deprecated = request.getParameter("deprecated");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("condition", condition));
			urlParameters.add(new BasicNameValuePair("pageno", pn));
			urlParameters.add(new BasicNameValuePair("pagesize", psz));
			urlParameters.add(new BasicNameValuePair("deprecated", deprecated));

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

		}else if (api.equals("24")) {
			// search available form service in form store.
			String url = API_DomainName + "/service1/api17";
			String appid = request.getParameter("fid");
			String condition = request.getParameter("cond");
			String ownerid = request.getParameter("ownerid");
			String pageno = request.getParameter("pageno");
			String pagesize = request.getParameter("pagesize");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("frmid", appid));
			urlParameters.add(new BasicNameValuePair("cond", condition));
			urlParameters.add(new BasicNameValuePair("ownerid", ownerid));
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
		}else if (api.equals("27")) {
            // search available application service in application supermarket.
            String url = API_DomainName + "/service28/api7";
            String uid = request.getParameter("uid");
            String id = request.getParameter("id");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("uid", uid));
            urlParameters.add(new BasicNameValuePair("id", id));
            String str = EntityUtils.toString(new UrlEncodedFormEntity(urlParameters, "utf-8"));
            HttpGet httpGet = new HttpGet(url);
            try {
                httpGet.setURI(new URI(httpGet.getURI().toString() + "?" + str));
            } catch (URISyntaxException e) {
                e.printStackTrace();
            }
            response1 = httpClient.execute(httpGet);
            //请求服务器是否返回数据
            if (response1.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
            }
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
//            responseJson =information.toString().trim();
            httpClient.close();
            httpGet.abort();
        }else if (api.equals("28")) {
            // search available application service in application supermarket.
            String url = API_DomainName + "/service28/api8";
            String name = request.getParameter("name");
            String code = request.getParameter("code");
            String type = request.getParameter("type");
            String uid = request.getParameter("uid");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("name", name));
            urlParameters.add(new BasicNameValuePair("code", code));
            urlParameters.add(new BasicNameValuePair("type", type));
            urlParameters.add(new BasicNameValuePair("uid", uid));

            String str = EntityUtils.toString(new UrlEncodedFormEntity(urlParameters, "utf-8"));
            HttpGet httpGet = new HttpGet(url);
            try {
                httpGet.setURI(new URI(httpGet.getURI().toString() + "?" + str));
            } catch (URISyntaxException e) {
                e.printStackTrace();
            }
            response1 = httpClient.execute(httpGet);
            //请求服务器是否返回数据
            if (response1.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
            }
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpGet.abort();
		} else if (api.equals("26")) {
			// get new ID for an process component object.
			String url = API_DomainName + "/service13/api16";
			HttpGet httpGet = new HttpGet(url);
			response1 = httpClient.execute(httpGet);
			if (response1.getStatusLine().getStatusCode() != 200) {
				throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
			}
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpGet.abort();

		} else if (api.equals("29")) {
			// 获取所有组织审核中的手机APP微服务插件。
			String url = API_DomainName + "/service7/api30";
			String condition = request.getParameter("cond");
			String pn = request.getParameter("pn");// 当前页数
			String psz = request.getParameter("psz");// 每页数据数
			String appState = request.getParameter("newsState");// 新闻的状态
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("condition", condition));
			urlParameters.add(new BasicNameValuePair("pageno", pn));
			urlParameters.add(new BasicNameValuePair("pagesize", psz));
			urlParameters.add(new BasicNameValuePair("appState", appState));

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

		} else if (api.equals("35")) {

			// 根据新闻的id获取新闻的详情
			String url = API_DomainName + "/service13/api11";
			String newsId = request.getParameter("newsId");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("newsId", newsId));
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
		} else if (api.equals("36")) {
			// 获取所有的新闻
			String url = API_DomainName + "/service13/api12";
			String condition = request.getParameter("cond");
			String pn = request.getParameter("pn");// 当前页数
			String psz = request.getParameter("psz");// 每页数据数
			String organizationId = request.getParameter("organizationId");// 不同的组织id
			String newsState = request.getParameter("newsState");// 不同的新闻状态
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("condition", condition));
			urlParameters.add(new BasicNameValuePair("pageno", pn));
			urlParameters.add(new BasicNameValuePair("pagesize", psz));
			urlParameters.add(new BasicNameValuePair("organizationId", organizationId));
			urlParameters.add(new BasicNameValuePair("newsState", newsState));
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

		}else if (api.equals("37")) {
			// 获取所有的系统帮助
			String url = API_DomainName + "/service28/api6";
			String condition = request.getParameter("cond");
			if(condition==""){
				condition="*";
			}
			String pn = request.getParameter("pn");// 当前页数
			String psz = request.getParameter("psz");// 每页数据数
			String owner = request.getParameter("owner");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("condition", condition));
			urlParameters.add(new BasicNameValuePair("pageno", pn));
			urlParameters.add(new BasicNameValuePair("pagesize", psz));
			urlParameters.add(new BasicNameValuePair("owner", owner));

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


		} else if (api.equals("39")) {
			String url = API_DomainName + "/service13/api30";
			String oid = request.getParameter("oid");
			String pn = request.getParameter("pn");
			String psz = request.getParameter("psz");
			String cond1 = request.getParameter("cond1");
			String cond2 = request.getParameter("cond2");
			String cond3 = request.getParameter("cond3");
			String cond4 = request.getParameter("cond4");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("oid", oid));
			urlParameters.add(new BasicNameValuePair("pn", pn));
			urlParameters.add(new BasicNameValuePair("psz", psz));
			urlParameters.add(new BasicNameValuePair("cond1", cond1));
			urlParameters.add(new BasicNameValuePair("cond2", cond2));
			urlParameters.add(new BasicNameValuePair("cond3", cond3));
			urlParameters.add(new BasicNameValuePair("cond4", cond4));
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

		} else if (api.equals("40")) {
			String url = API_DomainName + "/service13/api31";
			String pid = request.getParameter("pid");
			String pn = request.getParameter("pn");
			String psz = request.getParameter("psz");
			String cond1 = request.getParameter("cond1");
			String cond2 = request.getParameter("cond2");
			String cond3 = request.getParameter("cond3");
			String cond4 = request.getParameter("cond4");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("pid", pid));
			urlParameters.add(new BasicNameValuePair("pn", pn));
			urlParameters.add(new BasicNameValuePair("psz", psz));
			urlParameters.add(new BasicNameValuePair("cond1", cond1));
			urlParameters.add(new BasicNameValuePair("cond2", cond2));
			urlParameters.add(new BasicNameValuePair("cond3", cond3));
			urlParameters.add(new BasicNameValuePair("cond4", cond4));
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

		} else if (api.equals("41")) {
			String url = API_DomainName + "/invoice/api3";
			String pn = request.getParameter("pn");
			String psz = request.getParameter("psz");
			String cond1 = request.getParameter("condition");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("pn", pn));
			urlParameters.add(new BasicNameValuePair("psz", psz));
			urlParameters.add(new BasicNameValuePair("cond", cond1));
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

		}else if (api.equals("SN0")) {
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
		String responseJson = null;// 这是一个临时接口。在运营管理端，不设置启动业务应用实例的功能。
		// 不过未来要是启动应急预案应用，应该在此设置启动功能，到时候再设计。2018-03-14

		if (api.equals("2")) {
			HttpPost httpPost = new HttpPost(SVR_DomainName + "/service11/api5");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String pid = request.getParameter("pid");
			String uid = request.getParameter("uid");
			urlParameters.add(new BasicNameValuePair("pid", pid));
			urlParameters.add(new BasicNameValuePair("userid", uid));
			urlParameters.add(new BasicNameValuePair("ipv4", ""));
			urlParameters.add(new BasicNameValuePair("ipv6", ""));
			urlParameters.add(new BasicNameValuePair("longitude", ""));
			urlParameters.add(new BasicNameValuePair("latitude", ""));
			urlParameters.add(new BasicNameValuePair("device", ""));
			urlParameters.add(new BasicNameValuePair("paramvalues", ""));

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

		} else if (api.equals("8")) {
			// update wfprocess deprecated
			String deprecated = request.getParameter("deprecated");
			String rid = request.getParameter("rid");
			String lastupdate = request.getParameter("lastupdate");
			String owner = request.getParameter("owner");
			String userId = request.getParameter("userId");
			String userfullname = request.getParameter("userfullname");
			String ownername = request.getParameter("ownername");
			String comment = request.getParameter("comment");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("deprecated", deprecated));
			urlParameters.add(new BasicNameValuePair("rid", rid));
			urlParameters.add(new BasicNameValuePair("comment", comment));
			urlParameters.add(new BasicNameValuePair("lastupdate", lastupdate));
			urlParameters.add(new BasicNameValuePair("owner", owner));
			urlParameters.add(new BasicNameValuePair("userId", userId));
			urlParameters.add(new BasicNameValuePair("userfullname", userfullname));
			urlParameters.add(new BasicNameValuePair("ownername", ownername));

			HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api7");
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
		} else if (api.equals("9")) {// 修改新闻状态
			HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api8");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String newsId = request.getParameter("newsId");
			String status = request.getParameter("status");
			String comment = request.getParameter("comment");
			String lastUpdate = request.getParameter("lastUpdate");
			String owner = request.getParameter("owner");
			String userId = request.getParameter("userId");
			String userfullname = request.getParameter("userfullname");
			String ownername = request.getParameter("ownername");
			urlParameters.add(new BasicNameValuePair("newsId", newsId));
			urlParameters.add(new BasicNameValuePair("status", status));
			urlParameters.add(new BasicNameValuePair("comment", comment));
			urlParameters.add(new BasicNameValuePair("lastUpdate", lastUpdate));
			urlParameters.add(new BasicNameValuePair("owner", owner));
			urlParameters.add(new BasicNameValuePair("userId", userId));
			urlParameters.add(new BasicNameValuePair("userfullname", userfullname));
			urlParameters.add(new BasicNameValuePair("ownername", ownername));

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
		} else if (api.equals("11")) {// 修改新闻标题和内容
			HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api10");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String news = request.getParameter("currObject");
			urlParameters.add(new BasicNameValuePair("news", news));
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

		} else if (api.equals("14")) {// 添加新闻
			HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api13");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String news = request.getParameter("currObject");
			urlParameters.add(new BasicNameValuePair("news", news));
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

		} else if (api.equals("16")) {
			// update webappservice status
			String status = request.getParameter("status");
			String wid = request.getParameter("wid");
			String lastupdate = request.getParameter("lastupdate");
			String owner = request.getParameter("owner");
			String userId = request.getParameter("userId");
			String userfullname = request.getParameter("userfullname");
			String ownername = request.getParameter("ownername");
			String comment = request.getParameter("comment");

			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("status", status));
			urlParameters.add(new BasicNameValuePair("wid", wid));
			urlParameters.add(new BasicNameValuePair("lastupdate", lastupdate));
			urlParameters.add(new BasicNameValuePair("comment", comment));
			urlParameters.add(new BasicNameValuePair("owner", owner));
			urlParameters.add(new BasicNameValuePair("userId", userId));
			urlParameters.add(new BasicNameValuePair("userfullname", userfullname));
			urlParameters.add(new BasicNameValuePair("ownername", ownername));

			HttpPost httpPost = new HttpPost(API_DomainName + "/service7/api25");
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

		} else if (api.equals("19")) {
			HttpPost httpPost = new HttpPost(API_DomainName + "/service28/api2");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String note = request.getParameter("note");
			urlParameters.add(new BasicNameValuePair("notice", note));
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
		} else if (api.equals("20")) {
			// announce/cancel a system notice
			HttpPost httpPost = new HttpPost(API_DomainName + "/service28/api3");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String id = request.getParameter("id");
			String status = request.getParameter("live");
			urlParameters.add(new BasicNameValuePair("nid", id));
			urlParameters.add(new BasicNameValuePair("status", status));
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
		} else if (api.equals("21")) {
			HttpPost httpPost = new HttpPost(API_DomainName + "/service28/api4");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String id = request.getParameter("id");
			urlParameters.add(new BasicNameValuePair("nid", id));
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
		} else if (api.equals("23")) {
			// update rlform status
			String deprecated = request.getParameter("deprecated");
			String fid = request.getParameter("fid");
			String lastupdate = request.getParameter("lastupdate");
			String comment = request.getParameter("comment");
			String owner = request.getParameter("owner");
			String userId = request.getParameter("userId");
			String userfullname = request.getParameter("userfullname");
			String ownername = request.getParameter("ownername");

			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("deprecated", deprecated));
			urlParameters.add(new BasicNameValuePair("fid", fid));
			urlParameters.add(new BasicNameValuePair("lastupdate", lastupdate));
			urlParameters.add(new BasicNameValuePair("comment", comment));
			urlParameters.add(new BasicNameValuePair("owner", owner));
			urlParameters.add(new BasicNameValuePair("userId", userId));
			urlParameters.add(new BasicNameValuePair("userfullname", userfullname));
			urlParameters.add(new BasicNameValuePair("ownername", ownername));

			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			HttpPost httpPost = new HttpPost(API_DomainName + "/service9/api13");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			if (response1.getStatusLine().getStatusCode() != 200) {
				throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
			}
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		} else if (api.equals("25")) {// 修改新闻状态
			HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api15");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String newsId = request.getParameter("newsId");
			String status = request.getParameter("status");
			String comment = request.getParameter("comment");
			String lastUpdate = request.getParameter("lastUpdate");
			String owner = request.getParameter("owner");
			String userId = request.getParameter("userId");
			String userfullname = request.getParameter("userfullname");
			String ownername = request.getParameter("ownername");
			urlParameters.add(new BasicNameValuePair("newsId", newsId));
			urlParameters.add(new BasicNameValuePair("status", status));
			urlParameters.add(new BasicNameValuePair("comment", comment));
			urlParameters.add(new BasicNameValuePair("lastUpdate", lastUpdate));
			urlParameters.add(new BasicNameValuePair("owner", owner));
			urlParameters.add(new BasicNameValuePair("userId", userId));
			urlParameters.add(new BasicNameValuePair("userfullname", userfullname));
			urlParameters.add(new BasicNameValuePair("ownername", ownername));

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
		} else if (api.equals("30")) {
			// publish a mobile app micro-service plugin to online or withdraw for offlince
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String id = request.getParameter("id");
			String status = request.getParameter("d");
			String lastupdate = request.getParameter("lastupdate");
			String owner = request.getParameter("owner");
			String userId = request.getParameter("userId");
			String userfullname = request.getParameter("userfullname");
			String ownername = request.getParameter("ownername");
			String comment = request.getParameter("comment");

			urlParameters.add(new BasicNameValuePair("wid", id));
			urlParameters.add(new BasicNameValuePair("status", status));
			urlParameters.add(new BasicNameValuePair("lastupdate", lastupdate));
			urlParameters.add(new BasicNameValuePair("comment", comment));
			urlParameters.add(new BasicNameValuePair("owner", owner));
			urlParameters.add(new BasicNameValuePair("userId", userId));
			urlParameters.add(new BasicNameValuePair("userfullname", userfullname));
			urlParameters.add(new BasicNameValuePair("ownername", ownername));

			HttpPost httpPost = new HttpPost(API_DomainName + "/service7/api31");
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		}else if (api.equals("31")) {
			// query book list from mongodb
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String pageno = request.getParameter("pn");
			String pageSize = request.getParameter("psz");
			String cond = request.getParameter("cond");
			String userId = request.getParameter("userId");
			String type = request.getParameter("type");

			urlParameters.add(new BasicNameValuePair("pageNo", pageno));
			urlParameters.add(new BasicNameValuePair("pageSize", pageSize));
			urlParameters.add(new BasicNameValuePair("cond", cond));
			urlParameters.add(new BasicNameValuePair("userId", userId));
			urlParameters.add(new BasicNameValuePair("type", type));

			HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api20");
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		}else if (api.equals("32")) {
			// query audio list from mongodb
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String pageno = request.getParameter("pn");
			String pageSize = request.getParameter("psz");
			String cond = request.getParameter("cond");
			String userId = request.getParameter("userId");
			String type = request.getParameter("type");

			urlParameters.add(new BasicNameValuePair("pageNo", pageno));
			urlParameters.add(new BasicNameValuePair("pageSize", pageSize));
			urlParameters.add(new BasicNameValuePair("cond", cond));
			urlParameters.add(new BasicNameValuePair("userId", userId));
			urlParameters.add(new BasicNameValuePair("type", type));

			HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api21");
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		}else if (api.equals("33")) {
			// query video list from mongodb
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String pageno = request.getParameter("pn");
			String pageSize = request.getParameter("psz");
			String cond = request.getParameter("cond");
			String userId = request.getParameter("userId");
			String type = request.getParameter("type");

			urlParameters.add(new BasicNameValuePair("pageNo", pageno));
			urlParameters.add(new BasicNameValuePair("pageSize", pageSize));
			urlParameters.add(new BasicNameValuePair("cond", cond));
			urlParameters.add(new BasicNameValuePair("userId", userId));
			urlParameters.add(new BasicNameValuePair("type", type));

			HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api25");
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		}else if (api.equals("34")) {
			// query video list from mongodb
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String pageno = request.getParameter("pn");
			String pageSize = request.getParameter("psz");
			String cond = request.getParameter("cond");
			String userId = request.getParameter("userId");
			String type = request.getParameter("type");

			urlParameters.add(new BasicNameValuePair("pageNo", pageno));
			urlParameters.add(new BasicNameValuePair("pageSize", pageSize));
			urlParameters.add(new BasicNameValuePair("cond", cond));
			urlParameters.add(new BasicNameValuePair("userId", userId));
			urlParameters.add(new BasicNameValuePair("type", type));

			HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api22");
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		}else if (api.equals("35")) {
			// delete book from mongodb
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String id = request.getParameter("id");
			String path = request.getParameter("path");
			String userId = request.getParameter("userId");
			String userName = request.getParameter("userName");
			String type = request.getParameter("type");

			urlParameters.add(new BasicNameValuePair("id", id));
			urlParameters.add(new BasicNameValuePair("path", path));
			urlParameters.add(new BasicNameValuePair("userId", userId));
			urlParameters.add(new BasicNameValuePair("userName", userName));
			urlParameters.add(new BasicNameValuePair("type", type));

			HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api26");
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		}else if (api.equals("36")) {
			// update  video、pdf、mp3、live
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String data = request.getParameter("data");
			String type = request.getParameter("type");
			urlParameters.add(new BasicNameValuePair("data", data));
			urlParameters.add(new BasicNameValuePair("type", type));
			HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api27");
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		}else if (api.equals("37")) {
			//upper shelf
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String id = request.getParameter("id");
			String type = request.getParameter("type");
			urlParameters.add(new BasicNameValuePair("id", id));
			urlParameters.add(new BasicNameValuePair("type", type));
			HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api28");
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		}else if (api.equals("38")) {
			//lower shelf
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String id = request.getParameter("id");
			String type = request.getParameter("type");
			urlParameters.add(new BasicNameValuePair("id", id));
			urlParameters.add(new BasicNameValuePair("type", type));
			HttpPost httpPost = new HttpPost(API_DomainName + "/service13/api29");
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		} else if (api.equals("39")) {
			//修改发票状态
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String id = request.getParameter("invoiceId");
			urlParameters.add(new BasicNameValuePair("invoiceId", id));
			HttpPost httpPost = new HttpPost(API_DomainName + "/invoice/api4");
			HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
			httpPost.setEntity(postParams);
			response1 = httpClient.execute(httpPost);
			HttpEntity entity = response1.getEntity();
			responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpPost.abort();
		}
		else if (api.equals("40")) {
			//根据发票Id查询发票记录
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			String id = request.getParameter("invoiceId");
			urlParameters.add(new BasicNameValuePair("invoiceId", id));
			HttpPost httpPost = new HttpPost(API_DomainName + "/invoice/api5");
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
