/**
 * 
 */
package am.microservice;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

/**
 * @author Dahai Cao created at 15:43 on 2018-07-26
 *
 */
public class HTTPExecutor {

	/**
	 * 
	 */
	public HTTPExecutor() {
	}

	public static void doTestGetAction(WebAppService ras, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		GETRequestExecutor req = new GETRequestExecutor();
		HttpGet httpGet = (HttpGet) req.exe(ras, request, response);
		CloseableHttpClient httpClient = null;
		HttpClientBuilder builder = HttpClientBuilder.create();
		if (ras.getAuthenticationType() == AuthenticationType.NO_AUTH) {
			httpClient = builder.build();
			CloseableHttpResponse response1 = httpClient.execute(httpGet);
			ResponseExecutor.sendReponse(response1, ras, request, response);
			httpClient.close();
			httpGet.abort();
		} else if (ras.getAuthenticationType() == AuthenticationType.BASIC_AUTH) {
			// 基本模式(basic access authentication)
			builder.setDefaultCredentialsProvider(HTTPAuthentication.createBasicAuthentication(ras));
			httpClient = builder.build();
			CloseableHttpResponse response1 = httpClient.execute(httpGet);
			ResponseExecutor.sendReponse(response1, ras, request, response);
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
			ResponseExecutor.sendReponse(response1, ras, request, response);
			httpClient.close();
			httpGet.abort();
		} else if (ras.getAuthenticationType() == AuthenticationType.NTLM_AUTH) {

		}
	}

	public static void doTestPostAction(WebAppService ras, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		POSTRequestExecutor req = new POSTRequestExecutor();
		HttpPost httpPost = (HttpPost) req.exe(ras, request, response);
		CloseableHttpClient httpClient = null;
		HttpClientBuilder builder = HttpClientBuilder.create();
		if (ras.getAuthenticationType() == AuthenticationType.NO_AUTH) {
			httpClient = builder.build();
			CloseableHttpResponse response1 = httpClient.execute(httpPost);
			ResponseExecutor.sendReponse(response1, ras, request, response);
			httpClient.close();
			httpPost.abort();
		} else if (ras.getAuthenticationType() == AuthenticationType.BASIC_AUTH) {
			// 基本模式(basic access authentication)
			builder.setDefaultCredentialsProvider(HTTPAuthentication.createBasicAuthentication(ras));
			httpClient = builder.build();
			CloseableHttpResponse response1 = httpClient.execute(httpPost);
			ResponseExecutor.sendReponse(response1, ras, request, response);
			httpClient.close();
			httpPost.abort();
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

			CloseableHttpResponse response1 = httpClient.execute(targetHost, httpPost, context);
			// digestAuth.processChallenge(null);
			ResponseExecutor.sendReponse(response1, ras, request, response);
			httpClient.close();
			httpPost.abort();
		}
	}

}
