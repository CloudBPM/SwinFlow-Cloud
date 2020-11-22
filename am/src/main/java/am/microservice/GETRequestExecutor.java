package am.microservice;

import java.io.Serializable;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import com.cloudibpm.core.appservice.WebAppService;
import com.cloudibpm.core.data.variable.Parameter;

/**
 * 
 * @author Dahai Cao created at 11:16 on 2018-07-26
 */
public class GETRequestExecutor implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 5788446636914535012L;

	/**
	 * 
	 */
	public HttpRequestBase exe(WebAppService ras, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String url = "http://" + ras.getHost() + ras.getUrl();
		HttpGet httpGet = new HttpGet(url);
		// setting the parameters on the request path
		List<NameValuePair> parameters = new ArrayList<NameValuePair>();
		String p = "";
		Parameter[] ps = ras.getPathParams();
		if (ps != null && ps.length > 0) {
			for (int i = 0; i < ps.length; i++) {
				if (ras.getRestful() == 0) {
					if (ps[i].getValue() != null) {
						parameters.add(new BasicNameValuePair(ps[i].getName(), ps[i].getValue().toString()));
					} else {
						parameters.add(new BasicNameValuePair(ps[i].getName(), ""));
					}
				} else {
					if (ps[i].getValue() != null) {
						p += "/" + ps[i].getValue().toString();
					} else {
						p += "/";
					}
				}
			}
			// setting the parameters on the request path
			String str = EntityUtils.toString(new UrlEncodedFormEntity(parameters, "UTF-8"));
			if (ras.getRestful() == 0) {
				httpGet.setURI(new URI(httpGet.getURI().toString() + "?" + str));
			} else {
				httpGet.setURI(new URI(httpGet.getURI().toString() + "/" + p));
			}
		} else {
			httpGet.setURI(new URI(httpGet.getURI().toString()));
		}

		if (ras.getHeaders() != null && ras.getHeaders().length > 0) {
			for (int i = 0; i < ras.getHeaders().length; i++) {
				httpGet.setHeader(ras.getHeaders()[i].getKey(), ras.getHeaders()[i].getValue());
			}
		}
		return httpGet;
	}

}
