/**
 * 
 */
package com.cloudibpm.blo.sysnotice;

import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.sysnotice.SystemNotice;
import com.cloudibpm.core.sysnotice.SystemNoticePage;
import com.cloudibpm.core.user.User;
import com.cloudibpm.eso.om.organization.WfOrganizationEso;
import com.cloudibpm.eso.om.user.WfUserEso;
import com.cloudibpm.eso.sysnotice.SystemNoticeEno;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Dahai Cao created at 21:47 on 2018-10-11
 *
 */
@Service
//@Transactional
public class SystemNoticeBlo extends BusinessLogicObject {
	private final SystemNoticeEno systemNoticeEso;
	private final BuildtimeIDGenerator buildtimeIDGenerator;
	private final WfUserEso wfUserEso;
	private final WfOrganizationEso wfOrganizationEso;

	@Autowired
	public SystemNoticeBlo(SystemNoticeEno systemNoticeEso, BuildtimeIDGenerator buildtimeIDGenerator, WfUserEso wfUserEso, WfOrganizationEso wfOrganizationEso) {
		this.systemNoticeEso = systemNoticeEso;
		this.buildtimeIDGenerator = buildtimeIDGenerator;
		this.wfUserEso = wfUserEso;
		this.wfOrganizationEso = wfOrganizationEso;
	}

	public SystemNotice getLastNotice() throws Exception {
		return systemNoticeEso.queryLastLiveNotice();
	}

	public void createNotice(SystemNotice note) throws Exception {
		if (note == null) {
			return;
		}
		if (note.getPublisherId() != null) {
			User user = wfUserEso.queryByPK(note.getPublisherId());
			note.setPublisher(user.getFullName());
		}
		if (note.getOwner() != null) {
			Organization org = wfOrganizationEso.queryByPK(note.getOwner());
			note.setOrganizationName(org.getName());
		}
		note.setId(buildtimeIDGenerator.getNewRunTimeID());
		systemNoticeEso.insert(note);
	}

	public void modifyNoticeLiveStatus(String noteId, int status, long lastupdate) throws Exception {
		systemNoticeEso.updateStatus(noteId, status, lastupdate);
	}

	public void removeNotice(String noteId) throws Exception {
		systemNoticeEso.delete(noteId);
	}

	public void removeAllNotices(String ownerId) throws Exception {
		systemNoticeEso.deleteAll(ownerId);
	}

	public SystemNoticePage searchNotice(String condition, String ownerid, int pageno, int pagesize) throws Exception {
		SystemNoticePage page = new SystemNoticePage(pageno, pagesize);
		int total = systemNoticeEso.getAllNoteCounting(ownerid);
		if (total == 0) {
			page.setPageSize(pagesize);
			page.setPageNo(0);
			page.setAllEntitiesCount(0);
			page.setAllPagesCount(0);
			page.setPageIndex(0);
		} else {
			page.setPageSize(pagesize);
			if (condition == null || condition.equals("")) {
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
				List<SystemNotice> staffs = systemNoticeEso.queryAll(ownerid, pageindex, pagesize);
				page.setPageEntities(staffs.toArray(new SystemNotice[staffs.size()]));
			} else {
				total = systemNoticeEso.getAllNoteCounting(condition, ownerid);
				page.setAllEntitiesCount(total);
				int n = total / pagesize;
				int m = total % pagesize;
				if (m > 0) {
					n = n + 1;
				}
				page.setAllPagesCount(n);
				int pageindex = (pageno - 1) * pagesize;
				List<SystemNotice> staffs = systemNoticeEso.queryAll(condition, ownerid, pageindex, pagesize);
				page.setPageEntities(staffs.toArray(new SystemNotice[staffs.size()]));
			}
		}
		return page;
	}

}
