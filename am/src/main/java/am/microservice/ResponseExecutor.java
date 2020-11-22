/**
 * 
 */
package am.microservice;

import com.cloudibpm.core.appservice.WebAppService;
import org.apache.commons.fileupload.ParameterParser;
import org.apache.commons.io.IOUtils;
import org.apache.http.Consts;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.entity.ContentType;
import org.apache.http.protocol.HTTP;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.Map;

/**
 * @author Dahai Cao created at 15:09 on 2018-07-26
 *
 */
public class ResponseExecutor implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -2697735045129044214L;

	/**
	 * for authentication: https://www.tuicool.com/articles/meiAju
	 * https://www.cnblogs.com/softidea/p/6197109.html
	 * 为XMLHttpRequest添加事件。https://www.jianshu.com/p/1e189c14aa98
	 * 你真的会使用XMLHttpRequest吗？ https://segmentfault.com/a/1190000004322487
	 * JavaScript的设计模式
	 * https://scotch.io/bar-talk/4-javascript-design-patterns-you-should-know
	 * Http请求中Content-Type讲解以及在Spring MVC中的应用
	 * https://blog.csdn.net/blueheart20/article/details/45174399
	 * 
	 * @param cltresponse
	 *            CloseableHttpResponse
	 * @param ras
	 *            WebAppService
	 * @param request
	 *            HttpServletRequest
	 * @param response
	 *            HttpServletResponse
	 * @throws Exception
	 */
	public static void sendReponse(CloseableHttpResponse cltresponse, WebAppService ras, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		HttpEntity entity = cltresponse.getEntity();
		Header[] resheaders = cltresponse.getAllHeaders();
		String attachmentName = null;
		for (Header header : resheaders) {
			if (header.getName().toLowerCase().equals("content-disposition")) {
				ParameterParser parser = new ParameterParser();
				parser.setLowerCaseNames(true);
				// Parameter parser can handle null input
				Map<String, String> params = parser.parse(header.getValue(), ';');
				if (params.containsKey("filename")) {
					String fileName = (String) params.get("filename");
					if (fileName != null) {
						attachmentName = new String(fileName.getBytes(Consts.ISO_8859_1), Consts.UTF_8);
						attachmentName = attachmentName.trim();
					} else {
						// Even if there is no value, the parameter is present,
						// so we return an empty file name rather than no file
						// name.
						attachmentName = "";
					}
				}
			}
		}
		if (attachmentName != null) {
			// BufferedInputStream bis = new BufferedInputStream(in);
			response.setContentType("application/octet-stream");
			String contenttype = request.getServletContext().getMimeType(attachmentName);
			if (contenttype != null && !contenttype.equals("")) {
				response.setContentType(contenttype);
			}
			response.setContentLengthLong(entity.getContentLength());
			// Make sure to show the download dialog
			response.setCharacterEncoding("UTF-8");
			String filename = "";
			String userAgent = request.getHeader("user-agent").toLowerCase();
			if (userAgent.contains("msie") || userAgent.contains("like gecko")) {
				// win10 ie edge 浏览器 和其他系统的ie
				filename = URLEncoder.encode(attachmentName, "UTF-8");
			} else {
				// fe
				filename = new String(attachmentName.getBytes("UTF-8"), "iso-8859-1");
			}
			response.setHeader("Content-Disposition", "attachment; filename=" + filename);
			response.setHeader("Pragma", "No-cache");
			response.setHeader("Cache-Control", "No-cache");
			response.setDateHeader("Expires", 0);
			InputStream in = entity.getContent();
			OutputStream out = response.getOutputStream();
			int b;
			while ((b = in.read()) != -1) {
				out.write(b);
			}
			out.flush();
			in.close();
			out.close();
		} else {
			String url = "http://" + ras.getHost() + ras.getUrl();
			// url = new String(url.getBytes("iso-8859-1"), "UTF-8");

			attachmentName = url.substring(url.lastIndexOf("/") + 1, url.length());
			if (attachmentName.indexOf("?") >= 0) {
				attachmentName = attachmentName.substring(0, attachmentName.indexOf("?"));
			}
			String filename = "";
			String userAgent = request.getHeader("user-agent").toLowerCase();
			if (userAgent.contains("msie") || userAgent.contains("like gecko")) {
				// win10 ie edge 浏览器 和其他系统的ie
				filename = URLEncoder.encode(attachmentName, "UTF-8");
			} else {
				// fe
				filename = new String(attachmentName.getBytes("UTF-8"), "iso-8859-1");
			}
			final InputStream instream = entity.getContent();
			if (entity.getContentType() != null) {
				String contenttype = entity.getContentType().getValue();
				// 通知浏览器服务器发送的数据格式
				response.setContentType(contenttype);
				response.setContentLengthLong(entity.getContentLength());
				if (contenttype.indexOf("text") >= 0) {
					final ContentType contentType = ContentType.getOrDefault(entity);
					Charset charset = contentType.getCharset();
					if (charset == null) {
						charset = HTTP.DEF_CONTENT_CHARSET;
					}
					final StringBuilder b = new StringBuilder();
					final char[] tmp = new char[1024];
					final Reader reader = new InputStreamReader(instream, charset);
					StringWriter writer = new StringWriter();
					IOUtils.copy(instream, writer, charset);
					String theString = writer.toString();

//					int l;
//					while ((l = reader.read(tmp)) != -1) {
//						b.append(tmp, 0, l);
//					}
//					// 设置服务器端的编码,默认是ISO-8859-1；该方法必须在response.getWriter()之前进行设置
					response.setCharacterEncoding("UTF-8");
                    response.setContentLengthLong(theString.length());
					PrintWriter out = response.getWriter();
//					String s = b.substring(0, b.length());
					String s = new String(theString.getBytes("iso-8859-1"), "utf-8");
					out.print(s);
					out.close();
					instream.close();
				} else {
					response.setHeader("Content-Disposition", "attachment; filename=" + filename);
					OutputStream out = response.getOutputStream();
					int b;
					while ((b = instream.read()) != -1) {
						out.write(b);
					}
					out.flush();
					out.close();
					instream.close();
				}
			} else {
				response.setContentType("text/html;charset=utf-8");
				PrintWriter writer = response.getWriter();
				writer.println("No content type in response.");
				writer.close();
			}
		}
	}

}
