/**
 * 
 */
package com.cloudibpm.blo.am.appservice;

import com.cloudibpm.core.appservice.WebAppService;
import com.cloudibpm.core.appservice.WebAppServiceListPage;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.solr.AppServiceSolrUtils;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.eso.am.appservice.WebAppServiceEso;
import com.cloudibpm.eso.om.organization.WfOrganizationEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;

/**
 * @author Dahai Cao created on 2016-12-02
 *
 */
@Service
//@Transactional
public class WebAppServiceBlo extends BusinessLogicObject {
	private final WebAppServiceEso jasEso;
	public WfOrganizationEso wfOrganizationEso = null;

	@Autowired
	public WebAppServiceBlo(WebAppServiceEso jasEso,
							WfOrganizationEso wfOrganizationEso) {
		this.jasEso = jasEso;
		this.wfOrganizationEso = wfOrganizationEso;
	}


	/**
	 * Returns all RESTful web service objects from Cloud BPM repository
	 * 
	 * @date 2016-12-01
	 * @param owner
	 *            organization object Id.
	 * @return
	 * @throws Exception
	 */
	public List<WebAppService> getAllWebAppServices(String owner) throws Exception {

		List<WebAppService> jases = jasEso.queryByParent(owner);
		return jases;
	}

	public List<WebAppService> getWebAppServices(String parent) throws Exception {

		List<WebAppService> jases = jasEso.queryByParent(parent);
		return jases;
	}

	/**
	 * @author Dahai Cao
	 * @date 2016-12-01 created.
	 * 
	 * @param name
	 * @param ownerId
	 * @return
	 * @throws Exception
	 */
	public boolean existsServiceName(String name, String ownerId) throws Exception {

		return jasEso.existsWebAppServiceName(name, ownerId);
	}

	/**
	 * @author Dahai Cao created on 2018-06-21 21:12
	 * @param id
	 * @param name
	 * @param date
	 * @throws Exception
	 */
	public void rename(String id, String name, String date) throws Exception {

		jasEso.updateNameByPk(id, name, DateUtility.parseDatetime(date).getTime());
	}

	/**
	 * @author Dahai Cao created on 2018-06-21 21:20
	 * @param id
	 * @throws Exception
	 */
	public void remove(String id) throws Exception {

		jasEso.delete(id);
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

		WebAppService jas = jasEso.query(id);
		return jas;
	}

	public WebAppService getAppServiceForPM(String id) throws Exception {

		WebAppService was = jasEso.query(id);
		if (was != null) {
			// for security reason, we need clear some props
			was.setSecurityAccessKey(null);
			was.setAuthentication(null);
			was.setAuthenticationType(0);
			was.setComments(null);
			was.setHeaders(null);
			was.setHost(null);
			was.setKeywords(null);
			was.setMethodName(null);
			was.setUrl(null);
		}
		return was;
	}

	/**
	 * Save an Java service object with its all child Java API objects.
	 * 
	 * @date 2016-12-01 created.
	 * @param ras
	 * @throws Exception
	 */
	@Transactional
	public void save(WebAppService ras) throws Exception {
		jasEso.update(ras);
	}

	public void modifyStatus(String id, int status, long date) throws Exception {
		jasEso.updateStatus(id, status, date);
		if (status == 1 || status == 0) {
			AppServiceSolrUtils.deleteSearchIndex(id);
		} else if (status == 2) {
			WebAppService was = this.jasEso.query(id);
			Organization org = this.wfOrganizationEso.queryNameByPK(was.getOwner());
			AppServiceSolrUtils.setSearchIndex(was, org.getName());
		}
	}

	/**
	 * Create a new RESTful web service object into Cloud BPM repository.
	 * 
	 * @date 2016-12-01 created.
	 * @param ras
	 *            RESTful web service object
	 * @throws Exception
	 */
	@Transactional
	public void create(WebAppService ras) throws Exception {
		jasEso.insert(ras);
	}

	/**
	 * Delete a RSTful web service object.
	 * 
	 * @date 2016-12-01 created.
	 * @param id
	 * @throws Exception
	 */
	@Transactional
	public void delete(String id) throws Exception {

		jasEso.delete(id);
	}

	/**
	 * 
	 * @param condition
	 * @param pageno
	 * @param pagesize
	 * @return
	 * @throws SQLException
	 */

	public WebAppServiceListPage searchWebAppService(int status, String condition, int pageno, int pagesize)
			throws SQLException {

		WebAppServiceListPage page = new WebAppServiceListPage(pageno, pagesize);
		int total = jasEso.queryWebAppServiceCounting(status);
		if (total == 0) {
			page.setPageSize(pagesize);
			page.setPageNo(1);
			page.setAllEntitiesCount(0);
			page.setAllPagesCount(0);
			page.setPageIndex(0);
		} else {
			page.setPageSize(pagesize);
			if (condition == null || condition.equals("")) {
				page.setPageNo(pageno);
				page.setAllEntitiesCount(pagesize);
				int n = total / pagesize;
				int m = total % pagesize;
				if (m > 0) {
					n = n + 1;
				}
				page.setAllEntitiesCount(n);
				int pageindex = (pageno - 1) * pagesize;
				page.setPageIndex(pageindex);
				List<WebAppService> was = jasEso.queryWebAppServiceWas(status, pageindex, pagesize);
				page.setPageEntities(was.toArray(new WebAppService[was.size()]));
			} else {
				total = jasEso.queryWebAppServiceCounting(condition, status);
				page.setAllPagesCount(total);
				page.setPageNo(pageno);
				int n = total / pagesize;
				int m = total % pagesize;
				if (m > 0) {
					n = n + 1;
				}
				page.setAllPagesCount(n);
				int pageindex = (pageno - 1) * pagesize;
				List<WebAppService> was = jasEso.queryWebAppServiceWas(condition, status, pageindex, pagesize);
				page.setPageEntities(was.toArray(new WebAppService[was.size()]));
			}
		}
		return page;
	}

}
