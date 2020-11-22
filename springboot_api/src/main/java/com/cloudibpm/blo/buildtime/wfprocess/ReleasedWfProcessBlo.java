package com.cloudibpm.blo.buildtime.wfprocess;

import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.blo.buildtime.id.NewBuildtimeEntityIdAssignerBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.buildtime.release.wfprocess.ReleasedWfProcess;
import com.cloudibpm.core.buildtime.util.json.WfProcess2JSON;
import com.cloudibpm.core.buildtime.util.json.WfProcessJSONParser;
import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
import com.cloudibpm.core.buildtime.wfprocess.WfProcessListPage;
import com.cloudibpm.core.data.expression.ExpressionParser;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.solr.ProcessServiceSolrUtils;
import com.cloudibpm.core.util.SystemConfig;
import com.cloudibpm.core.util.file.FileUtil;
import com.cloudibpm.eso.buildtime.wfprocess.BuildtimeWfProcessEso;
import com.cloudibpm.eso.buildtime.wfprocess.ReleasedWfProcessEso;
import com.cloudibpm.eso.om.organization.WfOrganizationEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.Date;
import java.util.List;

/**
 * 
 * @author Cao Dahai updated 2017-02-02
 * @version 1.0
 */
@Service
@Transactional
public class ReleasedWfProcessBlo extends BusinessLogicObject {
	private final ReleasedWfProcessEso processEso;
	private final BuildtimeIDGenerator buildtimeIDGenerator;
	private final NewBuildtimeEntityIdAssignerBlo newBuildtimeEntityIdAssignerBlo;
	private final BuildtimeWfProcessEso procEso;
	private final WfOrganizationEso wfOrganizationEso;

	@Autowired
	public ReleasedWfProcessBlo(ReleasedWfProcessEso processEso,
								BuildtimeIDGenerator buildtimeIDGenerator,
								NewBuildtimeEntityIdAssignerBlo newBuildtimeEntityIdAssignerBlo,
								BuildtimeWfProcessEso procEso,
								WfOrganizationEso wfOrganizationEso) {
		this.wfOrganizationEso = wfOrganizationEso;
		this.processEso = processEso;
		this.buildtimeIDGenerator = buildtimeIDGenerator;
		this.newBuildtimeEntityIdAssignerBlo = newBuildtimeEntityIdAssignerBlo;
		this.procEso = procEso;
	}

	/**
	 * Returns all workflow processes in current repository.
	 * 
	 * @param parent
	 * @param owner
	 * @return
	 * @throws Exception
	 */
	public ReleasedWfProcess[] getProcesses(TreeNode parent, WorkflowEntity owner) throws Exception {
		
		List<ReleasedWfProcess> procRos = processEso.queryAll(parent.getId(), owner.getId());
		return procRos.toArray(new ReleasedWfProcess[procRos.size()]);
	}

	/**
	 * Return a process in JSON format through specified <code>id</code>.
	 * 
	 * @param pid
	 * @return
	 * @throws Exception
	 */
	public ReleasedWfProcess getReleasedProcess(String pid) throws Exception {
		
		return processEso.queryReleasedProcess(pid);
	}

	/**
	 * Return a process through specified <code>id</code>.
	 * 
	 * @param id
	 * @return
	 * @throws Exception
	 */
	
	public ReleasedWfProcess prepReleasedWfProcess(String id) throws Exception {
		
		ReleasedWfProcess rlProcess = processEso.queryByPKForRelease(id);
		return rlProcess;

	}

	/**
	 * Arithmetic: delete all the old tasks and old transitions of business
	 * process. Save business tasks and transitions of business process. Update
	 * time stamp of business process.
	 * 
	 * @param proc
	 *            released business process
	 * @throws Exception
	 */
	
	public void saveWfProcess(ReleasedWfProcess proc) throws Exception {
		
		processEso.delete(proc.getId());
		processEso.insert(proc);
	}

	/**
	 * Delete a released wfprocess.
	 * 
	 * @param processId
	 * @throws Exception
	 */
	
	public void deleteWfProcess(String processId) throws Exception {
		
		processEso.delete(processId);
	}

	/**
	 * Arithmetic: delete all the old tasks and old transitions of business
	 * process. Save business tasks and transitions of business process. Update
	 * time stamp of business process.
	 *
	 *            released business process
	 * @throws Exception
	 */
	
	public String sendWfProcessForApproval(String pid, String version, String releaser, String releaserid, String versionnote,
			double purchaseprice, double usageprice, String parent, String orgid) throws Exception {
		ReleasedWfProcess newprocess = this.prepReleasedWfProcess(pid);
		newprocess.setVersion(version);
		newprocess.setReleaserId(releaserid);
		newprocess.setReleaser(releaser);
		newprocess.setReleaseStatement(versionnote);
		newprocess.setReleaseDate(System.currentTimeMillis());
		newprocess.setPurchasePrice(purchaseprice);
		newprocess.setDeprecated(1);// 1 是指还没有申请上线（上架）
		newprocess.setUsagePrice(usageprice);
		String oldparent = newprocess.getParent();
		newprocess.setParent(parent);
		newprocess.setOwner(orgid);

		// change ID and change Organization ID.
		String id = buildtimeIDGenerator.getNewBuildTimeID();
		newprocess.setId(id);
		String content = newprocess.getProcessContent();
		String newcontent = content.replaceAll(pid, id);
		newcontent = newcontent.replaceAll(oldparent, parent);
		newprocess.setProcessContent(newcontent);
		newprocess.setOwner(orgid);

		// AissgnNewEntityIDUtil.assignNewBuildtimeEntityId(newprocess);
		// AssignOwnerIDUtil.changeCurrOwner(newprocess,
		// newprocess.getId());
		// change ID and change Organization ID.

		
		processEso.delete(newprocess.getId());
		processEso.insert(newprocess);

		// copy wf process dir to released wf process
		String storagetype = SystemConfig.getProp("filestorage.type");
		String syspath = "";
		if (storagetype.trim().equals("win")) {
			syspath = SystemConfig.getProp("windows.filestorage.lib");
		} else if (storagetype.trim().equals("linux")) {
			syspath = SystemConfig.getProp("linux.filestorage.lib");
		}
		if (!syspath.equals("")) {
			String src = syspath + "/" + orgid + "/pm/" + pid + "/";
			String dist = syspath + "/" + orgid + "/rlp/" + newprocess.getId() + "/";
			FileUtil.copyFolder(new File(src), new File(dist));
		}
		return newprocess.getId();
	}

	
	public void updateReleasedWfProcess(ReleasedWfProcess proc) throws Exception {
		
		processEso.update(proc);
	}

	/**
	 * @author Dahai Cao last updated at 16:32 on 2018-10-15
	 * @param id
	 * @param status
	 *            0: 已经申请上线（上架），1：还没有申请上线（上架）。
	 * @throws Exception
	 */
	
	public void releasedWfProcess(String id, int status) throws Exception {
		
		ReleasedWfProcess proc = processEso.queryReleasedProcess(id);
		proc.setProcessContent(null);
		processEso.update(id, status);
		if (status == 1) { // off line
			ProcessServiceSolrUtils.deleteSearchIndex(proc.getId());
		}
	}

	/**
	 * @author Dahai Cao last updated at 16:32 on 2018-10-15
	 * @param id
	 * @param status
	 *            2: 已经上线（上架）; 0: 申请上线（上架）;
	 * @param date
	 * @throws Exception
	 */
	public void modifyWfProcessStatus(String id, int status, long date) throws Exception {
		
		ReleasedWfProcess proc = processEso.queryReleasedProcess(id);
		processEso.updateDeprecated(id, status, date);
		// 2:go to live online; 0:offline;
		if (status == 2) { // go to live (online)
			Organization org = wfOrganizationEso.queryNameByPK(proc.getOwner());
			ProcessServiceSolrUtils.setSearchIndex(proc, org.getName());
		} else { // offline
			ProcessServiceSolrUtils.deleteSearchIndex(proc.getId());
		}
	}

	
	public void deleteReleasedWfProcesses(String[] processIds) throws Exception {
		
		if (processIds != null && processIds.length > 0) {
			for (String id : processIds) {
				processEso.delete(id);
			}
		}
	}

	
	public void moveReleasedWfProcess(String pid, String parentID, String content) throws Exception {
		
		processEso.updateParent(pid, parentID, content, new Date());
	}

	public WfProcess copyReleasedWfProcess(String pid) throws Exception {
		
		ReleasedWfProcess p = processEso.queryReleasedProcess(pid);
		WfProcess proc = WfProcessJSONParser.parseWfProcess(p.getProcessContent());
		proc.setName(p.getName() + "_副本");
		ExpressionParser.parseExpressions(proc);
		// assign new ID and change process ID.
		newBuildtimeEntityIdAssignerBlo.assignNewEntityId(proc);
		// AssignOwnerIDUtil.changeCurrOwner(proc, proc.getId());
		String processContent = WfProcess2JSON.toPJSON(proc);
		proc.setProcessContent(processContent);
		procEso.insert(proc);
		return proc;
	}

	/**
	 * Buying one wfprocess has two patterns: modify and not modify. The former
	 * means that buyer wants to modify the wfprocess then release it again.
	 * While the latter means that buyer does not want to modify it. We will
	 * update the access level of the wfprocess as organization internal level.
	 * 
	 * @author Dahai Cao created on 2018-06-18 22:56
	 * 
	 * @param id
	 * @param parent
	 * @param owner
	 * @param modify
	 * @return
	 * @throws Exception
	 */
	public WfProcess buyWfProcess(String id, String parent, String owner, String modify) throws Exception {
		
		ReleasedWfProcess p = processEso.queryReleasedProcess(id);
		String oldowner = p.getOwner();
		String oldparent = p.getParent();
		String content = p.getProcessContent();
		String newcontent = content.replaceAll(oldowner, owner);
		newcontent = newcontent.replaceAll(oldparent, parent);
		p.setParent(parent);
		p.setOwner(owner);
		if (modify.equals("1")) {
			WfProcess proc = WfProcessJSONParser.parseWfProcess(newcontent);
			proc.setName(p.getName() + "_副本");
			ExpressionParser.parseExpressions(proc);
			newBuildtimeEntityIdAssignerBlo.assignNewEntityId(proc);
			String processContent = WfProcess2JSON.toPJSON(proc);
			proc.setProcessContent(processContent);
			procEso.insert(proc);
			return proc;
		} else if (modify.equals("0")) {
			ReleasedWfProcess proc = WfProcessJSONParser.parseReleasedWfProcess(newcontent);
			proc.setName(p.getName());
			proc.setAccessLevel(4);
			proc.setVersion(p.getVersion());
			proc.setReleaser(p.getReleaser());
			proc.setReleaserId(p.getReleaserId());
			proc.setReleaseDate(p.getReleaseDate());
			proc.setReleaseStatement(p.getReleaseStatement());
			proc.setTrialPeriod(p.getTrialPeriod());
			proc.setLikeCounting(p.getLikeCounting());
			proc.setTotalDownloading(p.getTotalDownloading());
			proc.setTotalUseCounting(p.getTotalUseCounting());
			proc.setSuccessCounting(p.getSuccessCounting());
			proc.setTerminationCounting(p.getTerminationCounting());
			proc.setSuspensionCounting(p.getSuspensionCounting());
			ExpressionParser.parseExpressions(proc);
			newBuildtimeEntityIdAssignerBlo.assignNewEntityId(proc);
			String processContent = WfProcess2JSON.toRPJSON(proc);
			proc.setProcessContent(processContent);
			processEso.insert(proc);
			return proc;
		}
		return null;
	}

	/**
	 * 
	 * @param condition
	 * @param pageno
	 * @param pagesize
	 * @return
	 * @throws Exception
	 */
	public WfProcessListPage searchWfProcess(int deprecated, String condition, int pageno, int pagesize)
			throws Exception {
		
		WfProcessListPage page = new WfProcessListPage(pageno, pagesize);
		int total = processEso.queryWfProcessCounting(deprecated);
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
				List<ReleasedWfProcess> pro = processEso.queryWfProcessPro(deprecated, pageindex, pagesize);
				page.setPageEntities(pro.toArray(new ReleasedWfProcess[pro.size()]));
			} else {
				total = processEso.queryWfProcessProCounting(condition);
				page.setPageNo(pageno);
				page.setAllEntitiesCount(total);
				int n = total / pagesize;
				int m = total % pagesize;
				if (m > 0) {
					n = n + 1;
				}
				page.setAllPagesCount(n);
				int pageindex = (pageno - 1) * pagesize;
				List<ReleasedWfProcess> pro = processEso.queryWfProcessPro(condition, pageindex, pagesize);
				page.setPageEntities(pro.toArray(new ReleasedWfProcess[pro.size()]));
			}
		}
		return page;
	}

}
