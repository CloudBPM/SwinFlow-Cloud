/**
 * 
 */
package com.cloudibpm.core.appservice;

import com.cloudibpm.core.MicroService;
import com.cloudibpm.core.data.variable.Parameter;
import com.cloudibpm.core.microservice.HTTPHeader;

/**
 * This class is used to store a RESTful web service object for Cloud BPM usage.
 * 
 * <pre>
 * Chinese Note:
 * application/x-www-form-urlencoded： 窗体数据被编码为名称/值对。
 * 这是标准的编码格式。multipart/form-data： 窗体数据被编码为一条消息，
 * 页上的每个控件对应消息中的一个部分。 text/plain： 窗体数据以纯文本形式进行编码，
 * 其中不含任何控件或格式字符。补充form 的enctype属性为编码方式，
 * 常用有两种：application/x-www-form-urlencoded和multipart/form- data，
 * 默认为application/x-www-form-urlencoded。 当action为get时候，
 * 浏览器用x-www-form-urlencoded的编码方式把form数据转换成一个字串（name1=value1&amp; amp;name2=value2...），
 * 然后把这个字串append到url后面，用?分割，加载这个新的url。 当action为post时候，
 * 浏览器把form数据封装到http body中，然后发送到server。 
 * 如果没有type=file的控件，用默认的application/x-www-form-urlencoded就可以了。 
 * 但是如果有type=file的话，就要用到multipart/form-data了。
 * 浏览器会把整个表单以控件为单位分割，并为每个部分加上 Content-Disposition(form-data或者file),
 * Content-Type(默认为text/plain),name(控件 name)等信息，并加上分割符(boundary)。
 * boundary  是客户端浏览器随机生成的你可以不用提取。提交数据的时候设置一个串给他并用该串来分隔数据就可以了
 * </pre>
 * 
 * @author Dahai Cao created on 2016-12-01
 *
 */
public class WebAppService extends MicroService {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -2113890061059732441L;
	// 0: general web service; 1: RESTful Web service
	private int restful = 0;

	private String methodName = "GET";
	private String host = null;
	private String url = null;
	// this property is used to store parameters of RESTful web service
	private Parameter[] pathParams = null;
	// @see com.cloudibpm.core.appservice#AuthorizationType
	private int authenticationType = 0;
	private HTTPHeader[] authentication = null;
	// 0: no solution, customize. greater than 0: solutions.
	private int headerSolution = 0;
	private HTTPHeader[] headers = null;
	private Parameter[] formParams = null;
	// 0: void return; 1: return text/html; 2: return binary object, e.g., file
	private int returnType = 0;
	private String returnTypeDescription = "";

	/**
	 * 
	 */
	public WebAppService() {
	}

	/**
	 * @param id
	 */
	public WebAppService(String id) {
		super(id);
	}

	/**
	 * @return the restful
	 */
	public int getRestful() {
		return restful;
	}

	/**
	 * @param restful
	 *            the restful to set
	 */
	public void setRestful(int restful) {
		this.restful = restful;
	}

	/**
	 * @return the methodName
	 */
	public String getMethodName() {
		return methodName;
	}

	/**
	 * @param methodName
	 *            the methodName to set
	 */
	public void setMethodName(String methodName) {
		this.methodName = methodName;
	}

	/**
	 * @return the host
	 */
	public String getHost() {
		return host;
	}

	/**
	 * @param host
	 *            the host to set
	 */
	public void setHost(String host) {
		this.host = host;
	}

	/**
	 * @return the url
	 */
	public String getUrl() {
		return url;
	}

	/**
	 * @param url
	 *            the url to set
	 */
	public void setUrl(String url) {
		this.url = url;
	}

	/**
	 * @return the authenticationType
	 */
	public int getAuthenticationType() {
		return authenticationType;
	}

	/**
	 * @param authenticationType
	 *            the authenticationType to set
	 */
	public void setAuthenticationType(int authenticationType) {
		this.authenticationType = authenticationType;
	}

	/**
	 * @return the authentication
	 */
	public HTTPHeader[] getAuthentication() {
		return authentication;
	}

	/**
	 * @param authentication
	 *            the authentication to set
	 */
	public void setAuthentication(HTTPHeader[] authentication) {
		this.authentication = authentication;
	}

	/**
	 * @return the headerSolution
	 */
	public int getHeaderSolution() {
		return headerSolution;
	}

	/**
	 * @param headerSolution
	 *            the headerSolution to set
	 */
	public void setHeaderSolution(int headerSolution) {
		this.headerSolution = headerSolution;
	}

	/**
	 * @return the headers
	 */
	public HTTPHeader[] getHeaders() {
		return headers;
	}

	/**
	 * @param headers
	 *            the headers to set
	 */
	public void setHeaders(HTTPHeader[] headers) {
		this.headers = headers;
	}

	/**
	 * @return the pathParams
	 */
	public Parameter[] getPathParams() {
		return pathParams;
	}

	/**
	 * @param pathParams
	 *            the pathParams to set
	 */
	public void setPathParams(Parameter[] pathParams) {
		this.pathParams = pathParams;
	}

	/**
	 * @return the formParams
	 */
	public Parameter[] getFormParams() {
		return formParams;
	}

	/**
	 * @param formParams
	 *            the formParams to set
	 */
	public void setFormParams(Parameter[] formParams) {
		this.formParams = formParams;
	}

	/**
	 * @return the returnType
	 */
	public int getReturnType() {
		return returnType;
	}

	/**
	 * @param returnType the returnType to set
	 */
	public void setReturnType(int returnType) {
		this.returnType = returnType;
	}

	/**
	 * @return the returnTypeDescription
	 */
	public String getReturnTypeDescription() {
		return returnTypeDescription;
	}

	/**
	 * @param returnTypeDescription the returnTypeDescription to set
	 */
	public void setReturnTypeDescription(String returnTypeDescription) {
		this.returnTypeDescription = returnTypeDescription;
	}
}
