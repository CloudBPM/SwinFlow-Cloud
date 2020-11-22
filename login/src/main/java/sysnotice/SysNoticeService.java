package sysnotice;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
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

/**
 * Servlet implementation class SysNoticeService
 */
@WebServlet("/SysNoticeService")
public class SysNoticeService extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final String CONTEXT_URL = "http://localhost:8088";
	private static final String API_DomainName = CONTEXT_URL + "/api";

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		try {
			request.setCharacterEncoding("UTF-8");
			response.setCharacterEncoding("UTF-8");
			CloseableHttpClient httpClient = HttpClientBuilder.create().build();
			CloseableHttpResponse response1 = null;
			String url = API_DomainName + "/service28/api0";
			HttpGet httpGet = new HttpGet(url);
			httpGet.setURI(new URI(httpGet.getURI().toString()));

			response1 = httpClient.execute(httpGet);
			if (response1.getStatusLine().getStatusCode() != 200) {
				throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
			}

			HttpEntity entity = response1.getEntity();
			String responseJson = EntityUtils.toString(entity, "UTF-8").trim();
			httpClient.close();
			httpGet.abort();
			response.setContentType("application/json");
			PrintWriter out = response.getWriter();
			out.print(responseJson);
			out.close();
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}

}
