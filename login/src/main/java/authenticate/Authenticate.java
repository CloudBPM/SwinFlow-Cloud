package authenticate;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.cloud.core.session.redis.JedisUtil;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.Staff;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.core.util.encode.MD5Util;
import com.cloudibpm.core.util.encode.SecretKeyUtil;
import eu.bitwalker.useragentutils.UserAgent;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.codehaus.jackson.map.ObjectMapper;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.*;

/**
 * Servlet implementation class Authenticate
 */
@WebServlet("/Authenticate")
public class Authenticate extends HttpServlet {

//    String port="8088";
//    String staticUrl = request.getScheme() + "://" + request.getServerName() + ":" + port;

    //private static final String CONTEXT_URL = "http://localhost:8080";
    // private static final String CONTEXT_URL = "http://101.200.154.42:8080";
    private static final long serialVersionUID = 1L;
//    private static final String OM_DomainName = CONTEXT_URL + "/om";
//    private static final String PM_DomainName = CONTEXT_URL + "/pm";
    //	private static final String API_DomainName = CONTEXT_URL + "/api";
    //private static final String API_DomainName = "http://localhost:8088/api";
//    private static final String AM_DomainName = CONTEXT_URL + "/am";
//    private static final String CLT_DomainName = CONTEXT_URL + "/client";
//    private static final String FM_DomainName = CONTEXT_URL + "/fm";
//    private static final String ADM_DomainName = CONTEXT_URL + "/admin";
//    private static final String SVM_DomainName = CONTEXT_URL + "/svm";

    /**
     * @see HttpServlet#HttpServlet()
     */
    public Authenticate() {
        super();
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
     * response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // response.getWriter().append("Served at:
        // ").append(request.getContextPath());
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String api = request.getParameter("api");
        String responseJson = null;
//        String url = null;

        //获取服务器的ip地址
        if (api.equals("0")) {
            HashMap<String, String> data = new HashMap<>();
            StringBuffer stringBuffer = new StringBuffer();
            Enumeration<NetworkInterface> netInterfaces;
            try {
                // 拿到所有网卡
                netInterfaces = NetworkInterface.getNetworkInterfaces();
                InetAddress ip;
                // 遍历每个网卡，拿到ip
                while (netInterfaces.hasMoreElements()) {
                    NetworkInterface ni = netInterfaces.nextElement();
                    Enumeration<InetAddress> addresses = ni.getInetAddresses();
                    while (addresses.hasMoreElements()) {
                        ip = addresses.nextElement();
                        if (!ip.isLoopbackAddress() && ip.getHostAddress().indexOf(':') == -1) {
                            System.out.println(ni.getName() + " " + ip.getHostAddress());
                            stringBuffer.append(ip.getHostAddress()).append("|");
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            stringBuffer.deleteCharAt(stringBuffer.length() - 1);
            data.put("ip", stringBuffer.toString());
            ObjectMapper mapper = new ObjectMapper();
            responseJson = mapper.writeValueAsString(data);
        }
        response.setCharacterEncoding("utf8");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(responseJson);
        out.close();
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
     * response) http://stackoverflow.com/questions/2793150/using-java-net-
     * urlconnection-to-fire-and-handle-http-requests
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        String CONTEXT_URL = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
//        String API_DomainName = request.getScheme() + "://" + request.getServerName() + ":8088/api";
        String API_DomainName="http://localhost:8088/api";

        String loginType = request.getParameter("loginType");

        try {
            HttpSession session = request.getSession(true); // 创建session

            String username = request.getParameter("username");
            String password = request.getParameter("password");

            String token = SecretKeyUtil.getInstance().createKey();
            String sessiondata = MD5Util
                    .getMD5(token + username + "cloudbpm" + password + DateUtility.getCurrentDate());
            // http://www.mkyong.com/webservices/jax-rs/restful-java-client-with-apache-httpclient/
            // http://www.journaldev.com/7146/apache-httpclient-example-to-send-get-post-http-requests
            CloseableHttpClient httpClient = HttpClientBuilder.create().build();
            HttpPost httpPost = new HttpPost(API_DomainName + "/service0/api0");

            UserAgent userAgent = UserAgent.parseUserAgentString(request.getHeader("User-Agent"));
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("username", username));
            urlParameters.add(new BasicNameValuePair("sessiondata", sessiondata));
            urlParameters.add(new BasicNameValuePair("password", password));
            urlParameters.add(new BasicNameValuePair("token", token));

            StringBuffer sb = new StringBuffer();
            sb.append(userAgent.getOperatingSystem().getDeviceType().getName()); // Device
            sb.append(",");
            sb.append(""); // Device Type: Device Number.
            sb.append(",");
            sb.append(userAgent.getOperatingSystem().getManufacturer().getName()); // DeviceManufacturer
            sb.append(",");
            sb.append(userAgent.getOperatingSystem().getName()); // OS
            sb.append(",");
            sb.append(""); // OS Type : Windows, Linux, etc
            sb.append(",");
            sb.append(userAgent.getOperatingSystem().getManufacturer().getName()); // OS
            // Manufacturer
            sb.append(",");
            sb.append(userAgent.getBrowser().getName()); // Browser
            sb.append(",");
            sb.append(userAgent.getBrowser().getBrowserType().getName()); // Browser
            // type
            sb.append(",");
            sb.append(userAgent.getBrowserVersion() == null ? "" : userAgent.getBrowserVersion().getVersion()); // Browser
            // version
            sb.append(",");
            sb.append(userAgent.getBrowser().getManufacturer().getName()); // Browser
            // manufacturer
            sb.append(",");
            sb.append(getIpAddr(request)); // IP v4;
            sb.append(",");
            sb.append(""); // IP v6
            sb.append(",");
            sb.append("China"); // Country
            sb.append(",");
            sb.append("Beijing"); // Province
            sb.append(",");
            sb.append("Chaoyang"); // City
            sb.append(",");
            sb.append("Beiyuanjiayuan"); // Town
            sb.append(",");
            sb.append(session.getId()); // Town

            urlParameters.add(new BasicNameValuePair("details", sb.toString()));

            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters);
            httpPost.setEntity(postParams);
            CloseableHttpResponse response1 = httpClient.execute(httpPost);
            if (response1.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
            }

            HttpEntity entity = response1.getEntity();
            String output = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();

            // status code:
            // 1: successful
            // 0: user does't exist;
            // -1: pass incorrect;
            // -2: banned by all organizations;
            // -3: has no authorizations for logging in;
            // -4: invalid login (might be hacker login);
            // -5: data error
            //{"data":"ab1aea1b8bfffa9676064fb21bfb3dd3","success":true,"codeMessage":{"code":"1","message":"success"}}
            JSONObject result = com.alibaba.fastjson.JSON.parseObject(output);
            Map<String, Object> responseJson = new HashMap<>();
            responseJson.put("status", result.getJSONObject("codeMessage").getString("code"));
            if (result.getBoolean("success")) { // 验证成功!
                String sessionId = result.getJSONObject("data").getString("sessionId");
                long expire = result.getJSONObject("data").getLong("expire");
                Login login = JSON.parseObject(JSON.toJSONString(result.getJSONObject("data").get("login")), Login.class);
                Staff[] staffs = login.getStaffships();
                Cookie cookie = new Cookie("sessionId", sessionId);
                cookie.setPath("/");
                cookie.setMaxAge(7200);
                cookie.setHttpOnly(true);
                response.addCookie(cookie);

                if (staffs != null && staffs.length > 0) {
                    // Basically if the response header is text/html you need to
                    // parse, and if the response header is application/json it
                    // is already parsed for you. Parsed data from jquery
                    // success handler for text/html response: var parsed =
                    // JSON.parse(data); Parsed data from jquery success handler
                    // for application/json response: var parsed = data;
                    List<String> auths = new ArrayList<String>();
                    for (int i = 0; i < staffs.length; i++) {
                        for (int j = 0; j < staffs[i].getAuthorizations().length; j++) {
                            if (!auths.contains(staffs[i].getAuthorizations()[j])) {
                                auths.add(staffs[i].getAuthorizations()[j]);
                            }
                        }
                    }
                    if (StringUtils.equals(loginType, "Android")) {//安卓手机登录
                        String loginjson = JedisUtil.getInstance().get(sessionId);
                        responseJson.put("login", JSON.parseObject(loginjson, Login.class));
                        responseJson.put("sessionId", sessionId);
                    } else {//排除端浏览器登录
                        responseJson.put("url1", CONTEXT_URL);
                        responseJson.put("url3", sessionId);
                        if (auths.contains("0000000006")) {
                            responseJson.put("url2", "/client/me.jsp?sessionId=");
                        } else if (auths.contains("0000000002")) {
                            responseJson.put("url2", "/om/ommain.jsp?sessionId=");
                        } else if (auths.contains("0000000001")) {
                            responseJson.put("url2", "/pm/pmmain.jsp?sessionId=");
                        } else if (auths.contains("0000000003")) {
                            responseJson.put("url2", "/am/ammain.jsp?sessionId=");
                        } else if (auths.contains("0000000004")) {
                            responseJson.put("url2", "/fm/fmmain.jsp?sessionId=");
                        } else if (auths.contains("0000000005")) {
                            responseJson.put("url2", "/admin/admin.jsp?sessionId=");
                        } else if (auths.contains("0000000007")) {
                            responseJson.put("url2", "/svm/index.jsp?sessionId=");
                        } else {
                            responseJson.put("url2", "/client/me.jsp?sessionId=");
                        }
                    }
                } else {
                    if (StringUtils.equals(loginType, "Android")) {//安卓手机登录
                        String loginjson = JedisUtil.getInstance().get(sessionId);
                        responseJson.put("login", JSON.parseObject(loginjson, Login.class));
                        responseJson.put("expire", expire);
                        responseJson.put("sessionId", sessionId);
                    } else {
                        responseJson.put("url1", CONTEXT_URL);
                        responseJson.put("url3", sessionId);
                    }
                    responseJson.put("url2", "/client/me.jsp?sessionId=");
                }
                //System.out.println(responseJson);
            }
//            else {
//                // 验证出现错误.
//                //{"data":"ab1aea1b8bfffa9676064fb21bfb3dd3","success":true,"codeMessage":{"code":"1","message":"success"}}
//                //responseJson = "{\"status\": \"" + result.getJSONObject("codeMessage").getString("code") + "\"}";
//                session = null;
//            }

            response.setCharacterEncoding("utf8");
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            out.println(JSON.toJSONString(responseJson));
            out.close();

        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String getIpAddr(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return filterIp(ip);
    }

    private static String filterIp(String ip) {
        if (ip != null) {
            String[] data = ip.split(",");
            for (int i = 0; i < data.length; i++) {
                if (!"unknown".equalsIgnoreCase(data[i].replaceAll("\\s*", ""))) {
                    ip = data[i].replaceAll("\\s*", ""); // 去除首尾空格
                    break;
                }
            }
        }
        return ip;
    }


}
