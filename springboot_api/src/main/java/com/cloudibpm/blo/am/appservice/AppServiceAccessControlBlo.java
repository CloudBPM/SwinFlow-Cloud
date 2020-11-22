package com.cloudibpm.blo.am.appservice;

import com.cloudibpm.core.appservice.AppServiceAccessControl;
import com.cloudibpm.core.appservice.AppServiceAccessControlPage;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.am.appservice.AppServiceAccessControlEso;
import com.cloudibpm.eso.om.organization.WfOrganizationEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
//@Transactional
public class AppServiceAccessControlBlo extends BusinessLogicObject {
	private final AppServiceAccessControlEso appAccessControlEso;
	private final WfOrganizationEso wfOrganizationEso;


	@Autowired
	public AppServiceAccessControlBlo(AppServiceAccessControlEso appAccessControlEso, WfOrganizationEso wfOrganizationEso) {
		this.appAccessControlEso = appAccessControlEso;
		this.wfOrganizationEso = wfOrganizationEso;
	}


	public void addAccessControls(AppServiceAccessControl[] accessControls) throws Exception {
		if (accessControls != null && accessControls.length > 0) {
			for (int i = 0; i < accessControls.length; i++) {
				appAccessControlEso.insert(accessControls[i]);
			}
		}
	}

	public AppServiceAccessControlPage getAllAccessControls(String condition, String appid, int pageno, int pagesize)
			throws Exception {
		AppServiceAccessControlPage page = new AppServiceAccessControlPage(pageno, pagesize);
		int total = appAccessControlEso.getAccessControlCounting(appid);
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
				List<AppServiceAccessControl> members = appAccessControlEso.queryAllAccessControls(appid, pageindex,
						pagesize);
				page.setPageEntities(members.toArray(new AppServiceAccessControl[members.size()]));
			} else {
				total = appAccessControlEso.getAccessControlCounting(condition, appid);
				page.setAllEntitiesCount(total);
				int n = total / pagesize;
				int m = total % pagesize;
				if (m > 0) {
					n = n + 1;
				}
				page.setAllPagesCount(n);
				int pageindex = (pageno - 1) * pagesize;
				List<AppServiceAccessControl> groups = appAccessControlEso.queryAllAccessControls(condition, appid,
						pageindex, pagesize);
				page.setPageEntities(groups.toArray(new AppServiceAccessControl[groups.size()]));
			}
		}
		return page;
	}

	public AppServiceAccessControl[] getAllAccessControls(String appid) throws Exception {
		List<AppServiceAccessControl> members = appAccessControlEso.queryAllAccessControls(appid);
		return members.toArray(new AppServiceAccessControl[members.size()]);
	}

	public AppServiceAccessControl[] findAccessControls(String appid, String condition, String ownerid)
			throws Exception {

		List<Organization> orgs = wfOrganizationEso.queryOrganizationName(condition, ownerid);
		List<AppServiceAccessControl> controls = new ArrayList<AppServiceAccessControl>();
		if (orgs.size() > 0) {
			for (Organization org : orgs) {
				AppServiceAccessControl ac = appAccessControlEso.queryAccessControls(appid, org.getId());
				if (ac == null) {
					ac = new AppServiceAccessControl();
					ac.setAppServiceId(appid);
					ac.setOrganizationId(org.getId());
				}
				ac.setOrganizationName(org.getName());
				controls.add(ac);
			}
		}
		return controls.toArray(new AppServiceAccessControl[controls.size()]);
	}

	public void deleteAccessControl(String appId, String orgId) throws Exception {
		appAccessControlEso.delete(appId, orgId);
	}

}
