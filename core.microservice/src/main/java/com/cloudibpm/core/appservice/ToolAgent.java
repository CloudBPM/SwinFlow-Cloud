/**
 * @user Dahai CAO
 * @date 04/07/2011 10:21:05 AM
 */
package com.cloudibpm.core.appservice;

import com.cloudibpm.core.TreeNode;

public class ToolAgent extends TreeNode {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 2843573700875444513L;
	/**
	 * This property describes the application APIs exist in current workflow
	 * server API library.
	 */
	public static final int WORKFLOW_SERVER_BASED = 0;
	/**
	 * This property describes the application APIs exist in remote web servers
	 * or application servers. such as remote Tomcat web server or other
	 * servers.
	 */
	public static final int REMOTE_WEBSERVER_BASED = 1;
	/**
	 * This property describes the application APIs exist in ssh server. The
	 * server provides Secure File Transfer Protocol (SFTP) for file accessing.
	 */
	public static final int FTP_BASED = 2;
	/**
	 * This property describes the application APIs exist the Amazon S3 storage.
	 */
	public static final int AMAZON_S3_BASED = 3;
	/**
	 * This property describes the application APIs exist the Eucalyptus Walrus
	 * storage.
	 */
	public static final int EUCALYPTUS_WALRUS_BASED = 4;
	/**
	 * This property describes the application APIs exist the OpenStack storage.
	 */
	public static final int OPENSTACK_BASED = 5;
	/**
	 * This property describes the application APIs exist the OpenNebuler
	 * storage.
	 */
	public static final int OPENBEBULER_BASED = 6;
	/**
	 * This property describes a folder code for storing workflow applications.
	 * This code is an unique string and specified by system and never changes
	 * once setting.
	 */
	private String code;
	/**
	 * This property describes the storage base type where the external
	 * applications that are invoked by workflow system exist. At present, the
	 * applications may be stored in four types of storage base: current
	 * workflow server, remote web server basis, ssh server basis, Amazon S3,
	 * Eucalyptus Walrus, Open Stack base, OpenNebuler base. By default, the
	 * traditional base.
	 */
	private int baseType = WORKFLOW_SERVER_BASED;
	/**
	 * This property describes a secure access key for other company invoker. In
	 * our system, there may be many application APIs which belong to various
	 * organizations or companies. Every owner of the application APIs can set a
	 * secure acess key to prevent arbitrarily invoking from other organizations
	 * or companies.
	 */
	private String securityAccessKey;
	/**
	 * This property describes an user name for accessing the applications.
	 */
	private String usernameForApplication;
	/**
	 * This property describes a password for accessing the applications.
	 */
	private String passwordForApplication;
	/**
	 * This property describes the host of the server which the workflow
	 * external applications exist.
	 */
	private String host;
	/**
	 * This property describes the port of the server which the workflow
	 * external applications can be accessed.
	 */
	private int port = 0;

	private String url = "";

	/**
	 * Constructor
	 */
	public ToolAgent() {
	}

	/**
	 * @author Dahai CAO
	 * @date 04/07/2011 10:31:31 AM
	 * @param o
	 * @return
	 * @see java.lang.Comparable#compareTo(java.lang.Object)
	 */
	public int compareTo(TreeNode o) {
		return 0;
	}

	/**
	 * @author Dahai CAO
	 * @date 04/07/2011 10:31:31 AM
	 * @return
	 * @see workflow.core.AbstractTreeNodeEntity#clone()
	 */
	public Object clone() {
		return null;
	}

	/**
	 * Returns the unique folder code of tool agent.This code is an unique
	 * string and specified by system and never changes once setting.
	 * 
	 * @return
	 */
	public String getCode() {
		return code;
	}

	/**
	 * Sets the unique folder code of tool agent.This code is an unique string
	 * and specified by system and never changes once setting.
	 * 
	 * @param code
	 */
	public void setCode(String code) {
		this.code = code;
	}

	/**
	 * Returns the storage base type where the external applications that are
	 * invoked by workflow system exist. At present, the applications may be
	 * stored in four types of storage base: traditional base, Amazon S3,
	 * Eucalyptus Walrus, Open Stack base, OpenNebuler base. By default, the
	 * traditional base. The property references at
	 * {@link WORKFLOW_SERVER_BASED}, {@link REMOTE_WEBSERVER_BASED},
	 * {@link SFTP_BASED}, {@link AMAZON_S3_BASED},
	 * {@link EUCALYPTUS_WALRUS_BASED}, {@link OPENSTACK_BASED},
	 * {@link OPENBEBULER_BASED}.
	 * 
	 * @return
	 */
	public int getBaseType() {
		return baseType;
	}

	/**
	 * Sets the storage base type where the external applications that are
	 * invoked by workflow system exist. At present, the applications may be
	 * stored in four types of storage base: traditional base, Amazon S3,
	 * Eucalyptus Walrus, Open Stack base, OpenNebuler base. By default, the
	 * traditional base. The property references at
	 * {@link WORKFLOW_SERVER_BASED}, {@link REMOTE_WEBSERVER_BASED},
	 * {@link SFTP_BASED}, {@link AMAZON_S3_BASED},
	 * {@link EUCALYPTUS_WALRUS_BASED}, {@link OPENSTACK_BASED},
	 * {@link OPENBEBULER_BASED}.
	 * 
	 * @param baseType
	 */
	public void setBaseType(int baseType) {
		this.baseType = baseType;
	}

	/**
	 * Returns the security access key for other company invoker. In our system,
	 * there may be many application APIs which belong to various organizations
	 * or companies. Every owner of the application APIs can set a secure acess
	 * key to prevent arbitrarily invoking from other organizations or
	 * companies.
	 * 
	 * @return
	 */
	public String getSecurityAccessKey() {
		return securityAccessKey;
	}

	/**
	 * Sets the security access key for other company invoker. In our system,
	 * there may be many application APIs which belong to various organizations
	 * or companies. Every owner of the application APIs can set a secure acess
	 * key to prevent arbitrarily invoking from other organizations or
	 * companies.
	 * 
	 * @param securityAccessKey
	 */
	public void setSecurityAccessKey(String securityAccessKey) {
		this.securityAccessKey = securityAccessKey;
	}

	/**
	 * Sets the user name or user account or access key for accessing to the
	 * applications APIs which exists external storage servers.
	 * 
	 * @return
	 */
	public String getUsernameForApplication() {
		return usernameForApplication;
	}

	/**
	 * Returns the user name or user account or access key for accessing to the
	 * applications APIs which exists external storage servers.
	 * 
	 * @param usernameForApplication
	 */
	public void setUsernameForApplication(String usernameForApplication) {
		this.usernameForApplication = usernameForApplication;
	}

	/**
	 * Sets the user password or secret key or other secret key for accessing to
	 * the applications APIs which exists external storage servers.
	 * 
	 * @return
	 */
	public String getPasswordForApplication() {
		return passwordForApplication;
	}

	/**
	 * Returns the user password or secret key or other secret key for accessing
	 * to the applications APIs which exists external storage servers.
	 * 
	 * @param passwordForApplication
	 */
	public void setPasswordForApplication(String passwordForApplication) {
		this.passwordForApplication = passwordForApplication;
	}

	/**
	 * Returns the URL where the external applications are.
	 * 
	 * @date 04/07/2011 10:27:45 AM
	 * @param The
	 *            libraryURL to set
	 */
	public void setHost(String host) {
		this.host = host;
	}

	/**
	 * Sets the URL where the external applications are.
	 * 
	 * @date 04/07/2011 10:27:45 AM
	 * @return libraryURL
	 */
	public String getHost() {
		return host;
	}

	/**
	 * Returns the port where the external applications can be accessed.
	 * 
	 * @return
	 */
	public int getPort() {
		return port;
	}

	/**
	 * Sets the port where the external applications can be accessed.
	 * 
	 * @param port
	 */
	public void setPort(int port) {
		this.port = port;
	}

	public String getUrl() {
		return this.url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String toString() {
		return getName();
	}
}
