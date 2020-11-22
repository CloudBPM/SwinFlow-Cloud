package am;

import am.microservice.HTTPExecutor;
import com.alibaba.fastjson.JSON;
import com.cloud.core.session.redis.JedisUtil;
import com.cloudibpm.core.appservice.WebAppService;
import com.cloudibpm.core.session.utils.SessionUtils;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.util.json.MicroServiceJSONParser;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;

/**
 * Servlet implementation class MSTestingService
 */
@WebServlet("/MSTestingService")
@MultipartConfig

public class MSTestingService extends HttpServlet {
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
//		API_DomainName = request.getScheme() + "://" + request.getServerName() + ":8088/api";
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
	 * 获取FormData携带参数
	 * 
	 * @param request
	 * @return
	 */
	// private Map<String, String> getParameters(HttpServletRequest request) {
	// Map<String, String> params = new HashMap<>();
	// try {
	// DiskFileItemFactory factory = new DiskFileItemFactory();
	// ServletFileUpload upload = new ServletFileUpload(factory);
	// List<FileItem> items = upload.parseRequest(request);
	// for (FileItem item : items) {
	// if (item.isFormField()) {
	// // item.getFieldName();// 参数名
	// // item.getString();// 参数值
	// params.put(item.getFieldName(), item.getString());
	// }
	// }
	// } catch (Exception e) {
	// e.printStackTrace();
	// }
	// return params;
	// }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String api = request.getParameter("api");
		try {
			if (api.equals("0")) { // simulating the GET requeOt
				System.out.println("Parameters:");
				Enumeration<String> e = request.getParameterNames();
				while (e.hasMoreElements()) {
					String name = (String) e.nextElement();
					String value = request.getParameter(name);
					System.out.println(name + " = " + value);
				}
				System.out.println("Headers:");
				Enumeration<String> e1 = request.getHeaderNames();
				while (e1.hasMoreElements()) {
					String name = (String) e1.nextElement();
					String value = request.getHeader(name);
					System.out.println(name + " = " + value);
				}

				// Map<String, String> params = this.getParameters(request);
				String data = request.getParameter("fdata");
				data = new String(data.getBytes("iso-8859-1"), "UTF-8");
				WebAppService ras = MicroServiceJSONParser.parseWebAppServiceFromString(data);
				HTTPExecutor.doTestGetAction(ras, request, response);

			} else if (api.equals("1")) { // simulating the POST request
				System.out.println("Parameters:");
				Enumeration<String> e = request.getParameterNames();
				while (e.hasMoreElements()) {
					String name = (String) e.nextElement();
					String value = request.getParameter(name);
					System.out.println(name + " = " + value);
				}
				System.out.println("Headers:");
				Enumeration<String> e1 = request.getHeaderNames();
				while (e1.hasMoreElements()) {
					String name = (String) e1.nextElement();
					String value = request.getHeader(name);
					System.out.println(name + " = " + value);
				}

				// Map<String, String> params = this.getParameters(request);
				String data = request.getParameter("fdata");
				data = new String(data.getBytes("iso-8859-1"), "UTF-8");
				WebAppService ras =  MicroServiceJSONParser.parseWebAppServiceFromString(data);
				HTTPExecutor.doTestPostAction(ras, request, response);

			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
