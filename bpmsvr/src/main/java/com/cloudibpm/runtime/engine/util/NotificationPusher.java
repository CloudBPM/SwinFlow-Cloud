package com.cloudibpm.runtime.engine.util;

import com.cloudibpm.core.util.SystemConfig;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import java.util.ArrayList;
import java.util.List;

public class NotificationPusher {

    public static String pushMessage(String userid, String count) throws Exception {
        // 在这里服务应该调用另一个服务获取所有当前运行的服务器，
        // 通过一个一个服务器访问，来搜索符合条件的流程实例。
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        CloseableHttpResponse response1 = null;
        // IP address
        String svrurl = SystemConfig.getProp("api.server.domainname");
        HttpPost httpPost = new HttpPost(svrurl + "/service12/api1");
        List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
        urlParameters.add(new BasicNameValuePair("userId", userid));
        urlParameters.add(new BasicNameValuePair("count", count));
        HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
        httpPost.setEntity(postParams);
        response1 = httpClient.execute(httpPost);
        HttpEntity entity = response1.getEntity();
        String responseJson = EntityUtils.toString(entity, "UTF-8").trim();
        httpClient.close();
        httpPost.abort();
        return responseJson;
    }

}
