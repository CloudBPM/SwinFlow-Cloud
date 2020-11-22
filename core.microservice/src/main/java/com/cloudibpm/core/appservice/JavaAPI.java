/**
 * @user Dahai CAO
 * @date 2011-7-19 下午09:21:45
 */
package com.cloudibpm.core.appservice;

import com.cloudibpm.core.TreeNode;

public class JavaAPI extends TreeNode {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -3321759944580340705L;
	// package name + class name for the API
	// e.g., api.test.my.TestClassForPM
	// it will be used in reflection
	private String declaringClassName = null;
	// the method name in the class
	// it will be used in reflection
	private String declaringMethodName = null;
	// this property is used to store parameters of Java
	private String javaParameterString = null;
	// this is java method annotations, it will be implemented in future
	private String comments = null;

	/**
	 * Constructor
	 */
	public JavaAPI() {
	}

	/**
	 * Constructor
	 * 
	 * @param id
	 */
	public JavaAPI(String id) {
		super(id);
	}

	/**
	 * @author Dahai CAO
	 * @date 2011-7-19 下午09:21:45
	 * @param o
	 * @return
	 * @see java.lang.Comparable#compareTo(java.lang.Object)
	 */
	public int compareTo(TreeNode o) {
		return 0;
	}

	/**
	 * @author Dahai CAO
	 * @date 2011-7-19 下午09:21:45
	 * @return
	 * @see workflow.core.AbstractTreeNodeEntity#clone()
	 */
	public Object clone() {
		return null;
	}

	/**
	 * @date 2011-7-19 下午10:36:31
	 * @return methodName
	 */
	public String getDeclaringMethodName() {
		return declaringMethodName;
	}

	/**
	 * @date 2011-7-19 下午10:36:31
	 * @param The
	 *            declaringMethodName to set
	 */
	public void setDeclaringMethodName(String declaringMethodName) {
		this.declaringMethodName = declaringMethodName;
	}

	/**
	 * @author Dahai CAO
	 * @date 2011-7-21 下午07:33:34
	 * @return
	 */
	public String getDeclaringClassName() {
		return declaringClassName;
	}

	/**
	 * @author Dahai CAO
	 * @date 2011-7-21 下午07:33:34
	 * @param className
	 */
	public void setDeclaringClassName(String className) {
		this.declaringClassName = className;
	}

	/**
	 * @return the javaParameterString
	 */
	public String getJavaParameterString() {
		return javaParameterString;
	}

	/**
	 * @param javaParameterString
	 *            the javaParameterString to set
	 */
	public void setJavaParameterString(String javaParameterString) {
		this.javaParameterString = javaParameterString;
	}

	/**
	 * Return the API description
	 * 
	 * @return the comments
	 */
	public String getComments() {
		return comments;
	}

	/**
	 * Set the API's description
	 * 
	 * @param comments
	 *            the comments to set
	 */
	public void setComments(String comments) {
		this.comments = comments;
	}
}
