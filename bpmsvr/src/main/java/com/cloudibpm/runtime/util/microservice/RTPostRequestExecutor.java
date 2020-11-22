/**
 * 
 */
package com.cloudibpm.runtime.util.microservice;

import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.antlr.evaluation.EvalExprCalculatorUtil;
import com.cloudibpm.core.appservice.WebAppService;
import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
import com.cloudibpm.core.data.Constant;
import com.cloudibpm.core.data.FileConstant;
import com.cloudibpm.core.data.expression.Expression;
import com.cloudibpm.core.data.variable.ArrayDataVariable;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.data.variable.Parameter;
import com.cloudibpm.core.runtime.wfprocess.task.SystemTaskInstance;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.CharsetUtils;
import org.apache.http.util.EntityUtils;

import java.io.InputStream;
import java.io.Serializable;
import java.net.URI;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Dahai Cao created at 10:00 on 2018-08-01
 *
 */

public class RTPostRequestExecutor implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 8779012909376854175L;

	/**
	 * 
	 */
	public RTPostRequestExecutor() {
	}

	public HttpRequestBase exe(WebAppService ras, SystemTaskInstance systaskInstance, WfProcess processInstance,
			CloseableHttpClient httpClient) throws Exception {
		String url = "http://" + ras.getHost() + ras.getUrl();
		HttpPost httpPost = new HttpPost(url);
		// setting the parameters on the request path
		List<NameValuePair> pathparameters = new ArrayList<NameValuePair>();
		String p = "";
		Parameter[] ps = systaskInstance.getPathParameters();
		if (ps != null && ps.length > 0) {
			for (int i = 0; i < ps.length; i++) {
				if (ras.getRestful() == 0) {
					if (ps[i].getValue() != null) {
						WorkflowEntity e = EvalExprCalculatorUtil.computeValue((Expression) ps[i].getValue(),
								processInstance);
						if (e instanceof ArrayDataVariable) {
							if (((ArrayDataVariable) e).getValues() != null) {
								Constant[] cs = (Constant[]) ((ArrayDataVariable) e).getValues();
								if (cs.length > 0) {
									for (int j = 0; j < cs.length; j++) {
										pathparameters.add(new BasicNameValuePair(ps[i].getName(), cs[j].toString()));
									}
								}
							}
						} else if (e instanceof DataVariable) {
							if (((DataVariable) e).getValue() != null) {
								Constant c = (Constant) ((DataVariable) e).getValue();
								pathparameters.add(new BasicNameValuePair(ps[i].getName(), c.toString()));
							}
						} else if (e instanceof Constant) {
							pathparameters.add(new BasicNameValuePair(ps[i].getName(), ((Constant) e).toString()));
						} else {
							pathparameters.add(new BasicNameValuePair(ps[i].getName(), ""));
						}
					} else {
						pathparameters.add(new BasicNameValuePair(ps[i].getName(), ""));
					}
				} else {
					if (ps[i].getValue() != null) {
						WorkflowEntity e = EvalExprCalculatorUtil.computeValue((Expression) ps[i].getValue(),
								processInstance);
						if (e instanceof ArrayDataVariable) {
							if (((ArrayDataVariable) e).getValues() != null) {
								Constant[] fcs = (Constant[]) ((ArrayDataVariable) e).getValues();
								if (fcs.length > 0) {
									for (int j = 0; j < fcs.length; j++) {
										p += "/" + URLEncoder.encode(fcs[j].toString(), "UTF-8");
									}
								}
							}
						} else if (e instanceof DataVariable) {
							if (((DataVariable) e).getValue() != null) {
								Constant fc = (Constant) ((DataVariable) e).getValue();
								p += "/" + URLEncoder.encode(fc.toString(), "UTF-8");
							}
						} else if (e instanceof Constant) {
							p += "/" + URLEncoder.encode(e.toString(), "UTF-8");
						} else {
							p += "/";
						}
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
		Parameter[] fps = systaskInstance.getFormParameters();
		if (fps != null && fps.length > 0) {
			for (int i = 0; i < fps.length; i++) {
				if (!fps[i].getDatatype().toLowerCase().equals("file")) {
					if (fps[i].getValue() != null) {
						WorkflowEntity e = EvalExprCalculatorUtil.computeValue((Expression) fps[i].getValue(),
								processInstance);
						if (e instanceof ArrayDataVariable) {
							if (((ArrayDataVariable) e).getValues() != null) {
								// 这里可能是任何一个除文件类型外的任何数据类型
								Constant[] fcs = (Constant[]) ((ArrayDataVariable) e).getValues();
								for (int j = 0; j < fcs.length; j++) {
									multipartEntityBuilder.addTextBody(fps[i].getName(), fcs[j].toString(),
											ContentType.DEFAULT_TEXT);
								}
							}
						} else if (e instanceof DataVariable) {
							if (((DataVariable) e).getValue() != null) {
								Constant fc = (Constant) ((DataVariable) e).getValue();
								multipartEntityBuilder.addTextBody(fps[i].getName(), fc.toString(),
										ContentType.DEFAULT_TEXT);
							}
						} else if (e instanceof Constant) {
							multipartEntityBuilder.addTextBody(fps[i].getName(), e.toString(),
									ContentType.DEFAULT_TEXT);
						} else {
							multipartEntityBuilder.addTextBody(fps[i].getName(), "", ContentType.DEFAULT_TEXT);
						}
					} else {
						multipartEntityBuilder.addTextBody(fps[i].getName(), "", ContentType.DEFAULT_TEXT);
					}
				} else {
					WorkflowEntity e = EvalExprCalculatorUtil.computeValue((Expression) fps[i].getValue(),
							processInstance);
					if (e instanceof ArrayDataVariable) {
						// download the files to local
						if (((ArrayDataVariable) e).getValues() != null) {
							FileConstant[] fcs = (FileConstant[]) ((ArrayDataVariable) e).getValues();
							for (int j = 0; j < fcs.length; j++) {
								InputStream in = RTFileObjectAccessor.fetchFileObject(httpClient, fcs[j]);
								multipartEntityBuilder.addBinaryBody("uploadFile", in, ContentType.DEFAULT_BINARY,
										URLDecoder.decode(fcs[j].getName(), "utf-8"));
							}
						}
					} else if (e instanceof DataVariable) {
						// download the file to local
						if (((DataVariable) e).getValue() != null) {
							InputStream in = RTFileObjectAccessor.fetchFileObject(httpClient,
									(FileConstant) ((DataVariable) e).getValue());
							multipartEntityBuilder.addBinaryBody("uploadFile", in, ContentType.DEFAULT_BINARY,
									URLDecoder.decode(((FileConstant) ((DataVariable) e).getValue()).getName(), "utf-8"));
						}
					} else if (e instanceof FileConstant) {
						InputStream in = RTFileObjectAccessor.fetchFileObject(httpClient, (FileConstant) e);
						multipartEntityBuilder.addBinaryBody("uploadFile", in, ContentType.DEFAULT_BINARY,
								URLDecoder.decode(((FileConstant) e).getName(), "utf-8"));
					}
				}
			}
		}
		multipartEntityBuilder.setCharset(CharsetUtils.get("UTF-8"));
		httpPost.setEntity(multipartEntityBuilder.build());
		return httpPost;
	}

}
