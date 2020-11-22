package authenticate;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.cloud.core.session.redis.JedisUtil;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.Staff;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.core.util.VerifyCode;
import com.cloudibpm.core.util.encode.MD5Util;
import com.cloudibpm.core.util.encode.SecretKeyUtil;
import eu.bitwalker.useragentutils.UserAgent;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
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
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

@WebServlet("/requestVerifyCodeService")
//这个类来源于om的RegistrationService，只是改了类名
public class RequestVerifyCodeService extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String CONTEXT_URL = "http://localhost:8080";
    //	private static final String API_DomainName = "http://localhost:8080/api";
    private static final String API_DomainName = "http://localhost:8088/api";


    private void returnErrorMsg(HttpServletResponse response) throws IOException {
        String responseJson = "{\"status\": \"-5\" }";
        response.setCharacterEncoding("utf8");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(responseJson);
        out.close();
    }


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String api = request.getParameter("api");
        String responseJson = null;
        String url = null;

        List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();

        if (api.equals("4")) {
            url = API_DomainName + "/service3/api1";
            String orgname = request.getParameter("orgname");
            urlParameters.add(new BasicNameValuePair("orgname", orgname));
            responseJson = getMethod(url, urlParameters, response1, httpClient, responseJson);
        } else if (api.equals("5")) {
            url = API_DomainName + "/service3/api2";
            String email = request.getParameter("email");
            urlParameters.add(new BasicNameValuePair("email", email));
            responseJson = getMethod(url, urlParameters, response1, httpClient, responseJson);
        }

        response.setCharacterEncoding("utf8");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(responseJson);
        out.close();
    }


    private String getMethod(String url, List<NameValuePair> urlParameters, CloseableHttpResponse response1,
                             CloseableHttpClient httpClient, String responseJson) throws ParseException, UnsupportedEncodingException, IOException {
        String str = null;
        if (null != urlParameters && !"".equals(urlParameters)) {
            str = EntityUtils.toString(new UrlEncodedFormEntity(urlParameters, "utf-8"));
        }

        HttpGet httpGet = new HttpGet(url);
        try {
            if (null != str && !"".equals(str)) {
                httpGet.setURI(new URI(httpGet.getURI().toString() + "?" + str));
            } else {
                httpGet.setURI(new URI(httpGet.getURI().toString()));
            }

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
        return responseJson;
    }


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        String api = request.getParameter("api");
        String responseJson = null;

        if (api.equals("1")) {
            //send Message
            String url = API_DomainName + "/service17/api0";
            String mobile = request.getParameter("mobile");
            String code = VerifyCode.getVerifyCode(6);//生成6位随机码
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("mobile", mobile));
            urlParameters.add(new BasicNameValuePair("code", code));
            HttpSession session = request.getSession(true);
            String key = mobile + "verifyCode";
            session.setAttribute(key, code);
            this.removeVerifyCode(session, key);
            String str = EntityUtils.toString(new UrlEncodedFormEntity(urlParameters, "utf-8"));
            HttpPost httpPost = new HttpPost(url);
            try {
                httpPost.setURI(new URI(httpPost.getURI().toString() + "?" + str));
            } catch (URISyntaxException e) {
                e.printStackTrace();
            }
            response1 = httpClient.execute(httpPost);
            if (response1.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
            }
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("2")) {
            String code = request.getParameter("code");
            String mobile = request.getParameter("mobile");
            String scode = (String) request.getSession().getAttribute(mobile + "verifyCode");
            HashMap<String, String> data = new HashMap<>();

            if (code.equals(scode)) {
                data.put("status", "200");
                data.put("msg", "手机验证通过");
            } else if (scode == null) {
                data.put("status", "0");
                data.put("msg", "验证码已经失效");
            } else {
                data.put("status", "0");
                data.put("msg", "验证失败");
            }
            ObjectMapper mapper = new ObjectMapper();
            String json = mapper.writeValueAsString(data);
            responseJson = json;
            response.setCharacterEncoding("utf8");
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            out.print(responseJson);
            out.close();
            return;
        } else if (api.equals("3")) {
            String url = API_DomainName + "/service3/api0";
            String strOrg = request.getParameter("strOrg");
            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("strOrg", strOrg));
            HttpPost httpPost = new HttpPost(url);
            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);
            response1 = httpClient.execute(httpPost);
            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            httpClient.close();
            httpPost.abort();
        } else if (api.equals("4")) {  //根据手机号和验证码登录

            try {
                HttpSession session = request.getSession(true); // 创建session

                String code = request.getParameter("code");
                String mobile = request.getParameter("mobile");
                String scode = (String) request.getSession().getAttribute(mobile + "verifyCode");
                String type = request.getParameter("type");  //判断是手机验证码登录还是忘记密码

                if (code.equals(scode)) {
                    String token = SecretKeyUtil.getInstance().createKey();
                    String sessiondata = MD5Util
                            .getMD5(token + mobile + "cloudbpm" + code + DateUtility.getCurrentDate());
                    HttpPost httpPost = new HttpPost(API_DomainName + "/service0/api2");

                    UserAgent userAgent = UserAgent.parseUserAgentString(request.getHeader("User-Agent"));
                    List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
                    urlParameters.add(new BasicNameValuePair("mobile", mobile));
                    urlParameters.add(new BasicNameValuePair("sessiondata", sessiondata));
                    urlParameters.add(new BasicNameValuePair("code", code));
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
                    sb.append(userAgent.getBrowserVersion().getVersion()); // Browser
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
                    response1 = httpClient.execute(httpPost);//---------------------------发送
                    if (response1.getStatusLine().getStatusCode() != 200) {
                        throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
                    }

                    HttpEntity entity = response1.getEntity();
                    String output = EntityUtils.toString(entity, "UTF-8").trim();
                    httpClient.close();
                    httpPost.abort();

                    // parse object
//                    ObjectMapper mapper = new ObjectMapper();
//                    mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
//                    Login loggedinstaff = mapper.readValue(output, Login.class);

                    // status code:
                    // 1: successful
                    // 0: user does't exist;
                    // -1: pass incorrect;
                    // -2: banned by all organizations;
                    // -3: has no authorizations for logging in;
                    // -4: invalid login (might be hacker login);
                    // -5: data error
                    JSONObject result = com.alibaba.fastjson.JSON.parseObject(output);
                    Map<String, Object> responseJson1 = new HashMap<>();
                    responseJson1.put("status", result.getJSONObject("codeMessage").getString("code"));

                    if (result.getBoolean("success")) { // 验证成功!
                        long expire=result.getJSONObject("data").getLong("expire");
                        if ("Mobile".equals(userAgent.getOperatingSystem().getDeviceType().getName())) {
                            String sessionId = result.getJSONObject("data").getString("sessionId");
                            Login login = JSON.parseObject(JSON.toJSONString(result.getJSONObject("data").get("login")), Login.class);
                            Staff[] staffs = login.getStaffships();
                            Cookie cookie = new Cookie("sessionId", sessionId);
                            cookie.setPath("/");
                            cookie.setMaxAge(7200);
                            cookie.setHttpOnly(true);
                            response.addCookie(cookie);
                            String loginjson = JedisUtil.getInstance().get(sessionId);
                            responseJson1.put("login", JSON.parseObject(loginjson, Login.class));
                            responseJson1.put("sessionId", sessionId);
                            responseJson1.putIfAbsent("expire",expire);
                            responseJson = JSON.toJSONString(responseJson1);
                        } else {
                            String sessionId = result.getJSONObject("data").getString("sessionId");
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
                                //排除端浏览器登录
                                responseJson1.put("url1", CONTEXT_URL);
                                responseJson1.put("url3", sessionId);
                                if (auths.contains("0000000002")) {
                                    responseJson1.put("url2", "/om/ommain.jsp?sessionId=");
                                } else if (auths.contains("0000000001")) {
                                    responseJson1.put("url2", "/pm/pmmain.jsp?sessionId=");
                                } else if (auths.contains("0000000006")) {
                                    responseJson1.put("url2", "/client/me.jsp?sessionId=");
                                } else if (auths.contains("0000000003")) {
                                    responseJson1.put("url2", "/am/ammain.jsp?sessionId=");
                                } else if (auths.contains("0000000004")) {
                                    responseJson1.put("url2", "/fm/fmmain.jsp?sessionId=");
                                } else if (auths.contains("0000000005")) {
                                    responseJson1.put("url2", "/admin/admin.jsp?sessionId=");
                                } else if (auths.contains("0000000007")) {
                                    responseJson1.put("url2", "/svm/index.jsp?sessionId=");
                                } else {
                                    responseJson1.put("url2", "/client/me.jsp?sessionId=");
                                }
                            } else {
                                responseJson1.put("url1", CONTEXT_URL);
                                responseJson1.put("url3", sessionId);
                                responseJson1.put("url2", "/client/me.jsp?sessionId=");
                            }
                        }
                        responseJson = JSON.toJSONString(responseJson1);
                    }
//                    else {
//                        // 验证出现错误.
//                        responseJson = "{\"status\": \"" + loggedinstaff.getStatusCode() + "\"}";
//                        session = null;
//                    }
                } else if (scode == null) {
//                    responseJson = "{\"status\" : \"-12\", \"msg\" : \"验证码已经失效\"}";
                } else {
                    responseJson = "{\"status\" : \"-13\", \"msg\" : \"验证失败\"}";
                }
            } catch (ClientProtocolException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
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


    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // TODO Auto-generated method stub
        super.service(req, resp);
    }

    /**
     * 5分钟后,删除session中验证码
     *
     * @param session
     * @param key
     */
    private void removeVerifyCode(HttpSession session, String key) {
        final Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                // 删除session中存的验证码
                session.removeAttribute(key);
                System.err.println("验证码已失效");
                timer.cancel();
            }
        }, 5 * 60 * 1000);
    }
}


