/**
 * 
 */
package com.cloudibpm.core.appservice;

import com.cloudibpm.core.MicroService;
import com.cloudibpm.core.folder.FileObject;

/**
 * This class is used to described Java application which can be accessed and
 * invoked in Cloud BPM.
 * 
 * @author Dahai Cao rebuilt this class on 2016-11-11
 */
public class JavaAppService extends MicroService {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -8809374470998354628L;
	private FileObject[] appfiles = null;
	// private AppServiceAccessControl[] accessControls = null;

	/**
	 * 
	 */
	public JavaAppService() {
	}

	/**
	 * @param id
	 */
	public JavaAppService(String id) {
		super(id);
	}

	// /**
	// * @return the accessControls
	// */
	// public AppServiceAccessControl[] getAccessControls() {
	// return accessControls;
	// }
	//
	// /**
	// * @param accessControls
	// * the accessControls to set
	// */
	// public void setAccessControls(AppServiceAccessControl[] accessControls) {
	// this.accessControls = accessControls;
	// }

	/**
	 * @return the appfiles
	 */
	public FileObject[] getAppfiles() {
		return appfiles;
	}

	/**
	 * @param appfiles
	 *            the appfiles to set
	 */
	public void setAppfiles(FileObject[] appfiles) {
		this.appfiles = appfiles;
	}

}
