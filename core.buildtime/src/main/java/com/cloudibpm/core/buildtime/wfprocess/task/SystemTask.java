/**
 * 
 */
package com.cloudibpm.core.buildtime.wfprocess.task;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.data.variable.Parameter;

/**
 * @author Administrator
 * 
 */
public class SystemTask extends AbstractTask {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 8093462349129639880L;
	// 1: micro service; 2: Java app service
	private int appServiceType = 0;
	private String appServiceId = null;
	private String appServiceName = null;
	private int hasSecurityAccessKey = 0;
	private String securityAccessKey = null;
	private String apiName = null;
	private String apiMethod = null;
	private Parameter[] pathParameters = null;
	private Parameter[] formParameters = null;
	private DataVariable returnObject = null;
	private String pathParameterString = null;
	private String formParameterString = null;
	private String returnString = null;

	/**
	 * 
	 */
	public SystemTask() {
		setName("System Task");
		setClasstypename(this.getClass().getSimpleName());
	}

	@Override
	public Object clone() throws CloneNotSupportedException {
		SystemTask invokeTask = (SystemTask) super.clone();
		TreeNode[] paras = invokeTask.getChildren();
		for (TreeNode para : paras) {
			invokeTask.addChild((TreeNode) para.clone());
		}
		return invokeTask;
	}

	/**
	 * @return the appServiceType
	 */
	public int getAppServiceType() {
		return appServiceType;
	}

	/**
	 * @param appServiceType
	 *            the appServiceType to set
	 */
	public void setAppServiceType(int appServiceType) {
		this.appServiceType = appServiceType;
	}

	/**
	 * @return the appServiceId
	 */
	public String getAppServiceId() {
		return appServiceId;
	}

	/**
	 * @param appServiceId
	 *            the appServiceId to set
	 */
	public void setAppServiceId(String appServiceId) {
		this.appServiceId = appServiceId;
	}

	/**
	 * Sets a tool agent object to system invocation task. At present, the
	 * object is a name of tool agent.
	 * 
	 * @date 2011-8-4 下午08:33:02
	 * @param The
	 *            toolAgentID to set
	 */
	public void setAppServiceName(String serviceName) {
		this.appServiceName = serviceName;
	}

	/**
	 * Returns a tool agent object from system invocation task. At present, the
	 * object is a name of tool agent.
	 * 
	 * @date 2011-8-4 下午08:33:02
	 * @return appServiceName
	 */
	public String getAppServiceName() {
		return this.appServiceName;
	}

	/**
	 * Sets a class in current invocation task. At present, this class is string
	 * of a class name. So that, system can use this class name to instantiate
	 * an instance.
	 * 
	 * @date 2011-8-4 下午08:33:07
	 * @param The
	 *            agentCallID to set
	 */
	public void setAPIName(String className) {
		this.apiName = className;
	}

	/**
	 * Returns a class in current invocation task. At present, this class is
	 * string of a class name. So that, system can use this class name to
	 * instantiate an instance.
	 * 
	 * @date 2011-8-4 下午08:33:07
	 * @return agentCallID
	 */
	public String getAPIName() {
		return this.apiName;
	}

	/**
	 * Sets a method of in the class that the specified above into current
	 * invocation task. At present, this method is a name of method in the
	 * class. The name can be got through java.lang.reflect.Method.toString().
	 * 
	 * @date 2011-8-4 下午09:08:53
	 * @param method
	 */
	public void setAPIMethod(String method) {
		this.apiMethod = method;
	}

	/**
	 * Returns a method in the class that the specified above. At present, this
	 * method is a name of method in the class. The name can be got through
	 * java.lang.reflect.Method.toString().
	 * 
	 * @date 2011-8-4 下午09:09:01
	 * @return
	 */
	public String getAPIMethod() {
		return this.apiMethod;
	}

	/**
	 * Gets return object parameter from current invoke task parameter list.
	 * 
	 * @date 2011-8-17 下午06:18:47
	 * @return JavaParameter
	 */
	public Parameter fetchReturn() {
		for (TreeNode parameter : getChildren()) {
			if (parameter.getName().equals("Return"))
				return (Parameter) parameter;
		}
		return null;
	}

	/**
	 * @return the hasSecurityAccessKey
	 */
	public int getHasSecurityAccessKey() {
		return hasSecurityAccessKey;
	}

	/**
	 * @param hasSecurityAccessKey
	 *            the hasSecurityAccessKey to set
	 */
	public void setHasSecurityAccessKey(int hasSecurityAccessKey) {
		this.hasSecurityAccessKey = hasSecurityAccessKey;
	}

	/**
	 * Returns a security access key in invoke task for invoking the tool agent.
	 * 
	 * @return
	 */
	public String getSecurityAccessKey() {
		return securityAccessKey;
	}

	/**
	 * Sets a security access key in invoke task for invoking the tool agent.
	 * 
	 * @param securityAccessKey
	 */
	public void setSecurityAccessKey(String securityAccessKey) {
		this.securityAccessKey = securityAccessKey;
	}

	/**
	 * @return the apiName
	 */
	public String getApiName() {
		return apiName;
	}

	/**
	 * @param apiName
	 *            the apiName to set
	 */
	public void setApiName(String apiName) {
		this.apiName = apiName;
	}

	/**
	 * @return the apiMethod
	 */
	public String getApiMethod() {
		return apiMethod;
	}

	/**
	 * @param apiMethod
	 *            the apiMethod to set
	 */
	public void setApiMethod(String apiMethod) {
		this.apiMethod = apiMethod;
	}

	/**
	 * @return the pathParameters
	 */
	public Parameter[] getPathParameters() {
		return pathParameters;
	}

	/**
	 * @param pathParameters
	 *            the pathParameters to set
	 */
	public void setPathParameters(Parameter[] pathParameters) {
		this.pathParameters = pathParameters;
	}

	/**
	 * @return the formParameters
	 */
	public Parameter[] getFormParameters() {
		return formParameters;
	}

	/**
	 * @param formParameters
	 *            the formParameters to set
	 */
	public void setFormParameters(Parameter[] formParameters) {
		this.formParameters = formParameters;
	}

	/**
	 * @return the returnObject
	 */
	public DataVariable getReturnObject() {
		return returnObject;
	}

	/**
	 * @param returnObject
	 *            the returnObject to set
	 */
	public void setReturnObject(DataVariable returnObject) {
		this.returnObject = returnObject;
	}

	/**
	 * @return the pathParameterString
	 */
	public String getPathParameterString() {
		return pathParameterString;
	}

	/**
	 * @param pathParameterString
	 *            the pathParameterString to set
	 */
	public void setPathParameterString(String pathParameterString) {
		this.pathParameterString = pathParameterString;
	}

	/**
	 * @return the formParameterString
	 */
	public String getFormParameterString() {
		return formParameterString;
	}

	/**
	 * @param formParameterString
	 *            the formParameterString to set
	 */
	public void setFormParameterString(String formParameterString) {
		this.formParameterString = formParameterString;
	}

	/**
	 * @return the returnString
	 */
	public String getReturnString() {
		return returnString;
	}

	/**
	 * @param returnString
	 *            the returnString to set
	 */
	public void setReturnString(String returnString) {
		this.returnString = returnString;
	}

}
