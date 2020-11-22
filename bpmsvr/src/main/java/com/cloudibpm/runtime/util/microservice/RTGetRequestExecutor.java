/**
 * 
 */
package com.cloudibpm.runtime.util.microservice;

import java.io.Serializable;
import java.net.URI;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.antlr.evaluation.EvalExprCalculatorUtil;
import com.cloudibpm.core.appservice.WebAppService;
import com.cloudibpm.core.data.Constant;
import com.cloudibpm.core.data.expression.Expression;
import com.cloudibpm.core.data.variable.ArrayDataVariable;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.data.variable.Parameter;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.core.runtime.wfprocess.task.SystemTaskInstance;

/**
 * @author Dahai Cao created at 10:00 on 2018-08-01
 *
 */
public class RTGetRequestExecutor implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -252196659626052320L;

	/**
	 * 
	 */
	public RTGetRequestExecutor() {
	}

	/**
	 * 
	 * @param ras
	 * @param systaskInstance
	 * @param processInstance
	 * @return
	 * @throws Exception
	 */
	public HttpRequestBase exe(WebAppService ras, SystemTaskInstance systaskInstance, WfProcessInstance processInstance)
			throws Exception {
		String url = "http://" + ras.getHost() + ras.getUrl();
		HttpGet httpGet = new HttpGet(url);
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
