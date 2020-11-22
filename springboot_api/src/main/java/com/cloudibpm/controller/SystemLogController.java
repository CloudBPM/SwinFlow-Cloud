/**
 * 
 */
package com.cloudibpm.controller;

import com.cloudibpm.blo.release.log.ApproveForReleaseBlo;
import com.cloudibpm.core.admin.log.approval.SubmittingApprovalLogPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author Dahai Cao created 16:13 on 2018-10-18
 *
 */
@Controller
@RequestMapping("/service29")
public class SystemLogController {
	@Autowired
	private ApproveForReleaseBlo approveForReleaseBlo;

	/**
	 * Get all approval logs as pageable
	 * 
	 * @param condition
	 * @param pageno
	 * @param pagesize
	 * @return
	 */
	@RequestMapping(value = "/api0", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public SubmittingApprovalLogPage queryAllApprovalLogs(String condition, int pageno, int pagesize, String objectid) {
		try {
			return approveForReleaseBlo.searchLog(condition, pageno, pagesize, objectid);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

}