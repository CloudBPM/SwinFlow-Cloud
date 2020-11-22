package om;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Enumeration;

/**
 * Servlet implementation class TestServlet1
 */
@WebServlet("/TestServlet1")
public class TestServlet1 extends HttpServlet {
    private static final long serialVersionUID = 1L;
    //	private static final String API_DomainName = "http://localhost:8080/api";
    private static final String API_DomainName = "http://localhost:8088/api";

    /**
     * @see HttpServlet#HttpServlet()
     */
    public TestServlet1() {
        super();
        // TODO Auto-generated constructor stub
    }

    /**
     * @see HttpServlet#service(HttpServletRequest request, HttpServletResponse
     * response)
     */
    protected void service(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        super.service(request, response);
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
     * response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // // TODO Auto-generated method stub
        // response.getWriter().append("Served at:
        // ").append(request.getContextPath());
        //
        // response.setContentType("text/html");
        // PrintWriter printWriter = response.getWriter();
        // printWriter.println("<h1>Hello World! Share Session2</h1>");
        //
        // HttpSession session1 = request.getSession();
        // ServletContext Context = session1.getServletContext();
        // ServletContext Context1 = Context.getContext("/ShareSession1"); //
        // ��ĿA������·��
        // HttpSession session2 = (HttpSession)
        // Context1.getAttribute("session");
        // System.out.println("base��������userΪ:" +
        // session2.getAttribute("name"));


//		CloseableHttpClient httpClient = HttpClientBuilder.create().build();
//		String url = API_DomainName + "/service2/api1";
//		System.out.println(url);
//		HttpGet httpGet = new HttpGet(url);
//		CloseableHttpResponse response1 = httpClient.execute(httpGet);
//		if (response1.getStatusLine().getStatusCode() != 200) {
//			throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
//		}
//		BufferedReader br = new BufferedReader(new InputStreamReader((response1.getEntity().getContent())));
//		String responseJson = br.readLine();
//		System.out.println(responseJson);
//		httpGet.completed();

        // ----------------
//		System.out.println("浏览器基本信息："+request.getHeader("user-agent"));
//		String agent = request.getHeader("user-agent"); 
//		StringTokenizer st = new StringTokenizer(agent,";"); 
//		String s1 = st.nextToken(); st.nextToken(); 
//		System.out.println("客户端1："+s1);
//		//得到用户的浏览器名 
//		String userbrowser = st.nextToken(); 
//		System.out.println("客户端2："+userbrowser);
//		//得到用户的操作系统名 
//		String useros = st.nextToken(); 
//		System.out.println("客户端3："+useros);
//		
//		System.out.println("HTTP协议版本："+request.getProtocol());
//		System.out.println("请求编码格式："+request.getCharacterEncoding());
//		System.out.println("Accept："+request.getHeader("Accept"));
//		System.out.println("Accept-语言："+request.getHeader("Accept-Language"));
//		System.out.println("Accept-编码："+request.getHeader("Accept-Encoding"));
//		System.out.println("Connection："+request.getHeader("Connection"));
//		System.out.println("Cookie："+request.getHeader("Cookie"));
//		System.out.println("客户端发出请求时的完整URL"+request.getRequestURL());
//		System.out.println("请求行中的资源名部分"+request.getRequestURI());
//		System.out.println("请求行中的参数部分"+request.getRemoteAddr());
//		System.out.println("客户机所使用的网络端口号"+request.getRemotePort());
//		System.out.println("WEB服务器的IP地址"+request.getLocalAddr());
//		System.out.println("WEB服务器的主机名"+request.getLocalName());
//		System.out.println("客户机请求方式"+request.getMethod());
//		System.out.println("请求的文件的路径"+request.getServerName());
//		System.out.println("请求体的数据流"+request.getReader());
//		BufferedReader br=request.getReader();
//		String res = ""; 
//		while ((res = br.readLine()) != null) {  
//		   System.out.println("request body:" + res);   
//		}
//		System.out.println("请求所使用的协议名称"+request.getProtocol());
//		System.out.println("请求中所有参数的名字"+request.getParameterNames());
//		Enumeration enumNames= request.getParameterNames();
//		while (enumNames.hasMoreElements()) {
//		      String key = (String) enumNames.nextElement();
//		      System.out.println("参数名称："+key);
//		}
        // -----------

//        System.out.println("Protocol: " + request.getProtocol() + "<br>");
//        System.out.println("Scheme: " + request.getScheme() + "<br>");
//        System.out.println("Server Name: " + request.getServerName() + "<br>");
//        System.out.println("Server Port: " + request.getServerPort() + "<br>");
//        System.out.println("Protocol: " + request.getProtocol() + "<br>");
//        System.out.println("Server Info: " + getServletConfig().getServletContext().getServerInfo() + "<br>");
//        System.out.println("Remote Addr: " + request.getRemoteAddr() + "<br>");
//        System.out.println("Remote Host: " + request.getRemoteHost() + "<br>");
//        System.out.println("Character Encoding: " + request.getCharacterEncoding() + "<br>");
//        System.out.println("Content Length: " + request.getContentLength() + "<br>");
//        System.out.println("Content Type: " + request.getContentType() + "<br>");
//        System.out.println("Auth Type: " + request.getAuthType() + "<br>");
//        System.out.println("HTTP Method: " + request.getMethod() + "<br>");
//        System.out.println("Path Info: " + request.getPathInfo() + "<br>");
//        System.out.println("Path Trans: " + request.getPathTranslated() + "<br>");
//        System.out.println("Query String: " + request.getQueryString() + "<br>");
//        System.out.println("Remote User: " + request.getRemoteUser() + "<br>");
//        System.out.println("Session Id: " + request.getRequestedSessionId() + "<br>");
//        System.out.println("Request URL: " + request.getRequestURL() + "<br>");
//        System.out.println("Request URI: " + request.getRequestURI() + "<br>");
//        System.out.println("Servlet Path: " + request.getServletPath() + "<br>");
        //System.out.println("Created : " + session.getCreationTime() + "<br>");
        //System.out.println("LastAccessed : " + session.getLastAccessedTime() + "<br>");

//        System.out.println("Accept: " + request.getHeader("Accept") + "<br>");
//        System.out.println("Host: " + request.getHeader("Host") + "<br>");
//        System.out.println("Referer : " + request.getHeader("Referer") + "<br>");
//        System.out.println("Accept-Language : " + request.getHeader("Accept-Language") + "<br>");
//        System.out.println("Accept-Encoding : " + request.getHeader("Accept-Encoding") + "<br>");
//        System.out.println("User-Agent : " + request.getHeader("User-Agent") + "<br>");
//        System.out.println("Connection : " + request.getHeader("Connection") + "<br>");
//        System.out.println("Cookie : " + request.getHeader("Cookie") + "<br>");

//        System.out.println("------------");

        Enumeration headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = (String) headerNames.nextElement();
            String value = request.getHeader(key);
//            System.out.println(key + ":" + value);
        }

//        System.out.println("------------");

        // UserAgent userAgent = UserAgent.parseUserAgentString(request.getHeader("User-Agent"));
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
     * response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO Auto-generated method stub
        // doGet(request, response);
//        System.out.println("c");
    }

}
