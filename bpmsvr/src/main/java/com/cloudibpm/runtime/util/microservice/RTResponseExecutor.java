/**
 * 
 */
package com.cloudibpm.runtime.util.microservice;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.Serializable;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.fileupload.ParameterParser;
import org.apache.http.Consts;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.entity.ContentType;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;

import com.cloudibpm.core.appservice.WebAppService;
import com.cloudibpm.core.data.FileConstant;
import com.cloudibpm.core.data.StringConstant;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.core.runtime.wfprocess.task.SystemTaskInstance;
import com.cloudibpm.core.util.DateUtility;

/**
 * @author Dahai Cao created at 15:09 on 2018-07-26
 *
 */
public class RTResponseExecutor implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -2697735045129044214L;

	/**
	 * 
	 * @param cltresponse
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	public static void sendReponse(CloseableHttpResponse cltresponse, WebAppService ras,
			SystemTaskInstance systaskInstance, WfProcessInstance processInstance) throws Exception {
		HttpEntity entity = cltresponse.getEntity();
		Header[] resheaders = cltresponse.getAllHeaders();
		DataVariable dv = systaskInstance.getReturnObject();
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
						attachmentName = "";
					}
				}
			}
		}
		if (attachmentName != null) {
			String filename = URLEncoder.encode(attachmentName, "UTF-8");
			// String filename1 = new String(attachmentName.getBytes("UTF-8"),
			// "iso-8859-1");
			String sufix = attachmentName.substring(attachmentName.lastIndexOf(".") + 1, attachmentName.length());
			InputStream in = entity.getContent();
			long len = entity.getContentLength();
			// put input stream into system then generate file constant.
			FileConstant fc = new FileConstant();
			UUID newfid = UUID.randomUUID();
			String fid = newfid.toString();
			fc.setId(fid);
			fc.setName(filename);
			fc.setSize(len);
			fc.setSuffix(sufix);
			fc.setLastupdate(DateUtility.getCurDateTime());
			Header contentType = cltresponse.getEntity().getContentType();
			String mimeType = contentType.getValue().split(";")[0].trim();
			fc.setFiletype(mimeType);
			fc.setOwner(processInstance.getOwner());
			fc.setCurrOwner(processInstance.getId());
			RTFileObjectAccessor.putFileObject(fc, in, len);
//			File file = new File("D:/Data/temp/" + attachmentName);
//			if (!file.exists())
//				file.createNewFile();
//			FileOutputStream out = new FileOutputStream(file);
//			int c;
//			byte buffer[] = new byte[1024];
//			while ((c = in.read(buffer)) != -1) {
//				for (int i = 0; i < c; i++)
//					out.write(buffer[i]);
//			}
//			out.close();
			in.close();
			dv.setValue(fc);
		} else {
			String url = "http://" + ras.getHost() + ras.getUrl();
			attachmentName = url.substring(url.lastIndexOf("/") + 1, url.length());
			if (attachmentName.indexOf("?") >= 0) {
				attachmentName = attachmentName.substring(0, attachmentName.indexOf("?") - 1);
			}
			String filename = URLEncoder.encode(attachmentName, "UTF-8");
			// String filename1 = new String(attachmentName.getBytes("UTF-8"),
			// "iso-8859-1");
			String sufix = attachmentName.substring(attachmentName.lastIndexOf(".") + 1, attachmentName.length());
			final InputStream instream = entity.getContent();
			if (entity.getContentType() != null) {
				String contenttype = entity.getContentType().getValue();
				if (contenttype.indexOf("text") >= 0) {
					final ContentType contentType = ContentType.getOrDefault(entity);
					Charset charset = contentType.getCharset();
					if (charset == null) {
						charset = HTTP.DEF_CONTENT_CHARSET;
					}
					final StringBuilder b = new StringBuilder();
					final char[] tmp = new char[1024];
					final Reader reader = new InputStreamReader(instream, charset);
					int l;
					while ((l = reader.read(tmp)) != -1) {
						b.append(tmp, 0, l);
					}
					StringConstant sc = new StringConstant();
					String s = b.toString();
					s = new String(s.trim().getBytes("iso-8859-1"), "utf-8");
					sc.setValue(s);
					dv.setValue(sc);
					instream.close();
				} else {
					long len = entity.getContentLength();
					// put input stream into system then generate file constant.
					FileConstant fc = new FileConstant();
					UUID newfid = UUID.randomUUID();
					String fid = newfid.toString();
					fc.setId(fid);
					fc.setName(filename);
					fc.setSize(len);
					fc.setSuffix(sufix);
					fc.setLastupdate(DateUtility.getCurDateTime());
					Header contentType = cltresponse.getEntity().getContentType();
					String mimeType = contentType.getValue().split(";")[0].trim();
					fc.setFiletype(mimeType);
					fc.setOwner(processInstance.getOwner());
					fc.setCurrOwner(processInstance.getId());
					RTFileObjectAccessor.putFileObject(fc, instream, len);
					instream.close();
					dv.setValue(fc);
				}
			} else {
				StringConstant sc = new StringConstant();
				String responseJson = EntityUtils.toString(entity, "UTF-8").trim();
				sc.setValue(responseJson);
				dv.setValue(sc);
			}
		}
	}

}
