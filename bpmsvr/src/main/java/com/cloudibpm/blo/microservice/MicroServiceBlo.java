package com.cloudibpm.blo.microservice;

import com.cloudibpm.core.appservice.WebAppService;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.runtime.microservice.MicroServiceEso;

/**
 * @author Dahai Cao created at 19:07 on 2018-07-06
 */
public class MicroServiceBlo extends BusinessLogicObject {

	private static MicroServiceBlo instance = null;

	private MicroServiceBlo() {
	}

	public static MicroServiceBlo getInstance() {
		if (instance == null) {
			instance = new MicroServiceBlo();
		}
		return instance;
	}

	/**
	 * Returns a Java application service object through specified primary key
	 * <tt>id</tt> and its <tt>owner</tt>.
	 * 
	 * @date 2016-12-01 created
	 * @param id
	 *            RESTful web service primary key in repository.
	 * @return
	 * @throws Exception
	 */
	public WebAppService getAppService(String id) throws Exception {
		MicroServiceEso rasEso = new MicroServiceEso();
		WebAppService jas = rasEso.query(id);
		return jas;
	}

}
