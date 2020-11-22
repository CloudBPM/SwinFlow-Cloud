/**
 * 
 */
package com.cloudibpm.runtime.util.microservice;

import java.io.Serializable;

import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.AuthCache;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.impl.client.BasicAuthCache;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;

import com.cloudibpm.core.appservice.WebAppService;
import com.cloudibpm.core.microservice.AuthenticationType;
import com.cloudibpm.core.microservice.HTTPAuthentication;
import com.cloudibpm.core.microservice.HTTPHeader;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.core.runtime.wfprocess.task.SystemTaskInstance;

/**
 * @author Dahai Cao created at 10:00 on 2018-08-01
 *
 */
public class RTHttpExecutor implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -7210651838472921054L;

	/**
	 * 
	 */
	public RTHttpExecutor() {
	}

	public static void doGetAction(WebAppService ras, SystemTaskInstance systaskInstance,
			WfProcessInstance processInstance) throws Exception {
		RTGetRequestExecutor req = new RTGetRequestExecutor();
		HttpGet httpGet = (HttpGet) req.exe(ras, systaskInstance, processInstance);
		CloseableHttpClient httpClient = null;
		HttpClientBuilder builder = HttpClientBuilder.create();
		if (ras.getAuthenticationType() == AuthenticationType.NO_AUTH) {
			httpClient = builder.build();
			CloseableHttpResponse response1 = httpClient.execute(httpGet);
			RTResponseExecutor.sendReponse(response1, ras, systaskInstance, processInstance);
			httpClient.close();
			httpGet.abort();
		} else if (ras.getAuthenticationType() == AuthenticationType.BASIC_AUTH) {
			// 基本模式(basic access authentication)
			builder.setDefaultCredentialsProvider(HTTPAuthentication.createBasicAuthentication(ras));
			httpClient = builder.build();
			CloseableHttpResponse response1 = httpClient.execute(httpGet);
			RTResponseExecutor.sendReponse(response1, ras, systaskInstance, processInstance);
			httpClient.close();
			httpGet.abort();
		} else if (ras.getAuthenticationType() == AuthenticationType.DIGEST_AUTH) {
			// 摘要模式(Digest access authentication)
			httpClient = builder.build();

			HTTPHeader[] headers = ras.getAuthentication();
			String username = "";
			String password = "";
			String realm = "";
			if (headers != null && headers.length > 0) {
				for (HTTPHeader header : headers) {
					if (header.getKey().equals("Username")) {
						username = header.getValue();
					} else if (header.getKey().equals("Password")) {
						password = header.getValue();
					} else if (header.getKey().equals("Realm")) {
						realm = header.getValue();
					}
				}
			}
			// Header auth = digestAuth.authenticate(credentials,
			// request);
			CredentialsProvider credsProvider = new BasicCredentialsProvider();
			credsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(username, password));
			String url = "http://" + ras.getHost() + ras.getUrl();
			HttpHost targetHost = new HttpHost(url);
			AuthCache authCache = new BasicAuthCache();
			authCache.put(targetHost, HTTPAuthentication.createDigestAuthentication(realm));
			HttpClientContext context = HttpClientContext.create();
			context.setCredentialsProvider(credsProvider);
			context.setAuthCache(authCache);

			CloseableHttpResponse response1 = httpClient.execute(targetHost, httpGet, context);
			// digestAuth.processChallenge(null);
			RTResponseExecutor.sendReponse(response1, ras, systaskInstance, processInstance);
			httpClient.close();
			httpGet.abort();
		} else if (ras.getAuthenticationType() == AuthenticationType.NTLM_AUTH) {

		}
	}

	public static void doPostAction(WebAppService ras, SystemTaskInstance systaskInstance,
			WfProcessInstance processInstance) throws Exception {
		RTPostRequestExecutor req = new RTPostRequestExecutor();
		HttpClientBuilder builder = HttpClientBuilder.create();
		if (ras.getAuthenticationType() == AuthenticationType.NO_AUTH) {
			CloseableHttpClient httpClient = builder.build();
			HttpPost httpPost = (HttpPost) req.exe(ras, systaskInstance, processInstance, httpClient);
			CloseableHttpResponse response1 = httpClient.execute(httpPost);
			RTResponseExecutor.sendReponse(response1, ras, systaskInstance, processInstance);
			httpClient.close();
			httpPost.abort();
		} else if (ras.getAuthenticationType() == AuthenticationType.BASIC_AUTH) {
			// 基本模式(basic access authentication)
			builder.setDefaultCredentialsProvider(HTTPAuthentication.createBasicAuthentication(ras));
			CloseableHttpClient httpClient = builder.build();
			HttpPost httpPost = (HttpPost) req.exe(ras, systaskInstance, processInstance, httpClient);
			CloseableHttpResponse response1 = httpClient.execute(httpPost);
			RTResponseExecutor.sendReponse(response1, ras, systaskInstance, processInstance);
			httpClient.close();
			httpPost.abort();
		} else if (ras.getAuthenticationType() == AuthenticationType.DIGEST_AUTH) {
			// 摘要模式(Digest access authentication)
			CloseableHttpClient httpClient = builder.build();
			HttpPost httpPost = (HttpPost) req.exe(ras, systaskInstance, processInstance, httpClient);
			HTTPHeader[] headers = ras.getAuthentication();
			String username = "";
			String password = "";
			String realm = "";
			if (headers != null && headers.length > 0) {
				for (HTTPHeader header : headers) {
					if (header.getKey().equals("Username")) {
						username = header.getValue();
					} else if (header.getKey().equals("Password")) {
						password = header.getValue();
					} else if (header.getKey().equals("Realm")) {
						realm = header.getValue();
					}
				}
			}
			// Header auth = digestAuth.authenticate(credentials,
			// request);
			CredentialsProvider credsProvider = new BasicCredentialsProvider();
			credsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(username, password));
			String url = "http://" + ras.getHost() + ras.getUrl();
			HttpHost targetHost = new HttpHost(url);
			AuthCache authCache = new BasicAuthCache();
			authCache.put(targetHost, HTTPAuthentication.createDigestAuthentication(realm));
			HttpClientContext context = HttpClientContext.create();
			context.setCredentialsProvider(credsProvider);
			context.setAuthCache(authCache);
			CloseableHttpResponse response1 = httpClient.execute(targetHost, httpPost, context);
			// digestAuth.processChallenge(null);
			RTResponseExecutor.sendReponse(response1, ras, systaskInstance, processInstance);
			httpClient.close();
			httpPost.abort();
		}
	}

}
