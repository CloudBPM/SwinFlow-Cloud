/**
 * 
 */
package am.microservice;

import com.cloudibpm.core.appservice.WebAppService;
import com.cloudibpm.core.data.variable.Parameter;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.CharsetUtils;
import org.apache.http.util.EntityUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.Serializable;
import java.net.URI;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

/**
 * @author great
 *
 */
public class POSTRequestExecutor implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -5191228761160709102L;

	/**
	 * 
	 */
	public HttpRequestBase exe(WebAppService ras, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String url = "http://" + ras.getHost() + ras.getUrl();
		HttpPost httpPost = new HttpPost(url);
		// setting the parameters on the request path
		List<NameValuePair> pathparameters = new ArrayList<NameValuePair>();
		String p = "";
		Parameter[] ps = ras.getPathParams();
		if (ps != null && ps.length > 0) {
			for (int i = 0; i < ps.length; i++) {
				if (ras.getRestful() == 0) {
					if (ps[i].getValue() != null) {
						pathparameters.add(new BasicNameValuePair(ps[i].getName(), ps[i].getValue().toString()));
					} else {
						pathparameters.add(new BasicNameValuePair(ps[i].getName(), ""));
					}
				} else {
					if (ps[i].getValue() != null) {
						p += "/" + ps[i].getValue().toString();
					} else {
						p += "/";
					}
				}
			}
			// add all parameters on the request to the micro-service
			String str = EntityUtils.toString(new UrlEncodedFormEntity(pathparameters, "UTF-8"));
			if (ras.getRestful() == 0) {
				httpPost.setURI(new URI(httpPost.getURI().toString() + "?" + str));
			} else {
				httpPost.setURI(new URI(httpPost.getURI().toString() + "/" + p));
			}
		} else
			httpPost.setURI(new URI(httpPost.getURI().toString()));

		if (ras.getHeaders() != null && ras.getHeaders().length > 0) {
			for (int i = 0; i < ras.getHeaders().length; i++) {
				httpPost.setHeader(ras.getHeaders()[i].getKey(), ras.getHeaders()[i].getValue());
			}
		}
		// setting the submitted data in the form
		// set all the submitted attachment files on the request to the
		// micro-service
		MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create();
		multipartEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
		Parameter[] fps = ras.getFormParams();
		if (fps != null && fps.length > 0) {
			for (int i = 0; i < fps.length; i++) {
				if (!fps[i].getDatatype().toLowerCase().equals("file")) {
					if (fps[i].getValue() != null) {
						multipartEntityBuilder.addTextBody(fps[i].getName(), fps[i].getValue().toString(),
								ContentType.DEFAULT_TEXT);
					} else {
						multipartEntityBuilder.addTextBody(fps[i].getName(), "", ContentType.DEFAULT_TEXT);
					}
				}
			}
		}
		for (Part filePart : request.getParts()) {
			if (!filePart.getName().equals("fdata")) {
				multipartEntityBuilder.addBinaryBody("uploadFile", filePart.getInputStream(),
						ContentType.DEFAULT_BINARY, URLDecoder.decode(filePart.getName(), "utf-8"));
			}
		}
		multipartEntityBuilder.setCharset(CharsetUtils.get("UTF-8"));
		httpPost.setEntity(multipartEntityBuilder.build());
		return httpPost;
	}
}
