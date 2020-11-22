package com.cloudibpm.blo.om.user;

import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.user.UserLoginHistory;
import com.cloudibpm.core.user.UserLoginHistoryPage;
import com.cloudibpm.eso.om.user.WfUserLoginHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
@Service
//@Transactional
public class WfLoginHistoryBlo extends BusinessLogicObject {
	private final WfUserLoginHistory wfUserLoginHistory;

	@Autowired
	public WfLoginHistoryBlo(WfUserLoginHistory wfUserLoginHistory) {
		this.wfUserLoginHistory = wfUserLoginHistory;
	}


	/**
	 * Add new workflow user.
	 * 
	 * @param history
	 * @return
	 */
	public void createLoginHistory(UserLoginHistory history) throws Exception {
		
		wfUserLoginHistory.insert(history);
	}

	public void updateLogoutTime(Date logouttime, String sessionid) throws Exception {
		
		wfUserLoginHistory.update(logouttime, sessionid);
	}

	public UserLoginHistoryPage getAllHostory(String userid, int pageno, int pagesize) throws Exception {
		
		UserLoginHistoryPage page = new UserLoginHistoryPage(pageno, pagesize);
		int total = wfUserLoginHistory.getAllLoginHistoryCounting(userid);
		if (total == 0) {
			page.setPageSize(pagesize);
			page.setPageNo(0);
			page.setAllEntitiesCount(0);
			page.setAllPagesCount(0);
			page.setPageIndex(0);
		} else {
			page.setPageSize(pagesize);
			page.setPageNo(pageno);
			page.setAllEntitiesCount(total);
			int n = total / pagesize;
			int m = total % pagesize;
			if (m > 0) {
				n = n + 1;
			}
			page.setAllPagesCount(n);
			int pageindex = (pageno - 1) * pagesize;
			page.setPageIndex(pageindex);
			List<UserLoginHistory> list = wfUserLoginHistory.queryAll(userid, pageindex, pagesize);
			page.setPageEntities(list.toArray(new UserLoginHistory[list.size()]));
		}
		return page;
	}

}
