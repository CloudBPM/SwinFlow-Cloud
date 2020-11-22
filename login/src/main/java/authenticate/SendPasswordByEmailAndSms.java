package authenticate;

import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.core.util.encode.MD5Util;
import com.cloudibpm.core.util.encode.SecretKeyUtil;
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

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class SendPasswordByEmailAndSms {
    //	private static final String API_DomainName = "http://localhost:8080/api";
    private static final String API_DomainName = "http://localhost:8088/api";

    protected String sendPassword(String username, String mobile, String email)
            throws ServletException, IOException {
        String responseJson = "";
        try {
            String token = SecretKeyUtil.getInstance().createKey();
            String sessiondata = MD5Util.getMD5(username + token + mobile + "cloudbpm" + email + DateUtility.getCurrentDate());
            CloseableHttpClient httpClient = HttpClientBuilder.create().build();
            HttpPost httpPost = new HttpPost(API_DomainName + "/service4/api0");

            List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
            urlParameters.add(new BasicNameValuePair("username", username));
            urlParameters.add(new BasicNameValuePair("mobile", mobile));
            urlParameters.add(new BasicNameValuePair("sessiondata", sessiondata));
            urlParameters.add(new BasicNameValuePair("email", email));
            urlParameters.add(new BasicNameValuePair("token", token));

            HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httpPost.setEntity(postParams);

            CloseableHttpResponse response1 = httpClient.execute(httpPost);

            if (response1.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
            }

            HttpEntity entity = response1.getEntity();
            responseJson = EntityUtils.toString(entity, "UTF-8").trim();
            //2:发送邮件成功， -8：用户名和邮箱不匹配，无需考虑这个问题 -5：发送失败
            System.out.println(responseJson);
            httpClient.close();
            httpPost.abort();

        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return responseJson;
    }

}
