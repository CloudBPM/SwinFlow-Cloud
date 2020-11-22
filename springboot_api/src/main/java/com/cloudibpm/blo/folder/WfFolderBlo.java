package com.cloudibpm.blo.folder;

import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.blo.om.organization.CalenderBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.folder.Folder;
import com.cloudibpm.core.officecalendar.OfficeCalendar;
import com.cloudibpm.core.officecalendar.OfficeDay;
import com.cloudibpm.core.officecalendar.OfficeHours;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.folder.WfFolderEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author CAO DAHAI
 * 
 */
@Service
//@Transactional
public class WfFolderBlo extends BusinessLogicObject {
	private final WfFolderEso folderESO;
	private final BuildtimeIDGenerator buildtimeIDGenerator;
	private final CalenderBlo calenderBlo;

	@Autowired
	public WfFolderBlo(WfFolderEso folderESO, BuildtimeIDGenerator buildtimeIDGenerator, CalenderBlo calenderBlo) {
		this.folderESO = folderESO;
		this.buildtimeIDGenerator = buildtimeIDGenerator;
		this.calenderBlo = calenderBlo;
	}

	// new
	public void getChildrenFoldersForOrgViewer(TreeNode parent, int[] folderTpyes) throws Exception {
		
		List<Folder> folderRos = new ArrayList<Folder>();
		folderRos.addAll(folderESO.queryChildrenFoldersByType(parent.getId(), folderTpyes));
		for (Folder ro : folderRos) {
			if (parent.getOwner() != null) {
				ro.setOwner(parent.getOwner());
			} else {
				ro.setOwner(parent.getId());
			}
			parent.addChild(ro);
			getChildrenFolders(ro);
		}
	}

	/**
	 * Create new folder resource in current repository.
	 * 
	 * @param folder
	 * @throws SQLException
	 */
	
	public void addNewFolder(Folder folder) throws SQLException {
		
		folderESO.insert(folder);
	}

	/**
	 * 迭代实现获取所有的孩子文件夹。
	 * 
	 * @throws Exception
	 */
	public void getChildrenFolders(TreeNode parent) throws Exception {
		
		List<Folder> folderRos = folderESO.queryChildrenFolders(parent.getId());
		for (Folder ro : folderRos) {
			if (parent.getOwner() != null) {
				ro.setOwner(parent.getOwner());
			} else {
				ro.setOwner(parent.getId());
			}
			parent.addChild(ro);
			getChildrenFolders(ro);
		}
	}

	/**
	 * Returns multiple types folder objects.
	 * 
	 * @date 08/07/2011 11:55:54 AM
	 * @param parent
	 * @param folderTpyes
	 * @throws Exception
	 */
	public void getFoldersForViewer(Organization parent, int[] folderTpyes) throws Exception {
		
		List<Folder> folderRos = new ArrayList<Folder>();
		for (int i = 0; i < folderTpyes.length; i++) {
			folderRos.addAll(folderESO.queryChildrenFoldersByType(parent.getId(), folderTpyes[i]));
		}
		for (Folder ro : folderRos) {
			ro.setOwner(parent.getId());
			parent.addChild(ro);
			getChildrenFolders(ro);
		}

	}

	
	public Folder create(String name, int rank, int type, TreeNode parent, String owner) throws Exception {
		Folder folder = new Folder();
		folder.setId(buildtimeIDGenerator.getNewBuildTimeID());
		folder.setName(name);
		folder.setRank(rank);
		folder.setType(type);
		folder.setParent(parent.getId());
		folder.setOwner(owner);
		addNewFolder(folder);
		parent.addChild(folder);
		if(name == "办公日历"){
			OfficeCalendar calendar = new OfficeCalendar();
			calendar.setDefault(1);
			calendar.setName(name);
			calendar.setId(buildtimeIDGenerator.getNewBuildTimeID());
			calendar.setParent(folder.getId());
			calendar.setOwner(owner);
			calenderBlo.addCalender(calendar);
			//默认添加 7天工作日, 1-5为工作日,6-7为休息日
			for (int i = 1;i < 8; i++){
				OfficeDay officeDay = new OfficeDay();
				officeDay.setId(buildtimeIDGenerator.getNewBuildTimeID());

				officeDay.setWeekkDay(i);
				if(i >= 6){
					officeDay.setIsWorkDay(0);
				}else {
					officeDay.setIsWorkDay(1);
				}
				officeDay.setParent(calendar.getId());
				officeDay.setOwner(calendar.getOwner());
				calenderBlo.setYIsWorkDay(officeDay);
				if(i < 6){
					//为每天添加两个工作时间段
					OfficeHours officeHours = new OfficeHours();
					officeHours.setId(buildtimeIDGenerator.getNewBuildTimeID());
					officeHours.setFromTime("09:00");
					officeHours.setToTime("12:00");
					officeHours.setParent(officeDay.getId());
					officeHours.setOwner(officeDay.getOwner());
					calenderBlo.setYPeriod(officeHours);
					officeHours.setId(buildtimeIDGenerator.getNewBuildTimeID());
					officeHours.setFromTime("14:00");
					officeHours.setToTime("17:30");
					calenderBlo.setYPeriod(officeHours);
				}
			}
		}
		return folder;
	}

	
	public void updateFolderName(Folder folder) throws Exception {
		
		folderESO.updateName(folder);
	}

	
	public void moveFolder(String folderID, String newParentID) throws Exception {
		
		folderESO.updateParent(folderID, newParentID);
	}

	/**
	 * 获取视图的所有的特定类型的文件夹。
	 * 
	 * @throws Exception
	 */
	public void getFoldersForViewer(Organization parent, int folderTpye) throws Exception {
		
		List<Folder> folderRos = folderESO.queryChildrenFoldersByType(parent.getId(), folderTpye);
		for (Folder ro : folderRos) {
			ro.setOwner(parent.getId());
			parent.addChild(ro);
			getChildrenFolders(ro);
		}
	}

	/**
	 * Delete multiple folders
	 * 
	 * @param folders
	 * @throws Exception
	 */
	
	public void deleteFolder(String[] folders) throws Exception {
		
		if (folders != null && folders.length > 0) {
			for (String id : folders) {
				folderESO.delete(id);
			}
		}
	}

	public List<Folder> queryFolderByOwnerId(String oid) throws Exception {
		
		List<Folder> folders = folderESO.queryFoldersByOwnerId(oid);
		return folders;
	}

	// public void renameContent(TreeNode obj) throws Exception {
	// if (obj instanceof Folder) {
	// updateFolder(obj);
	// } else if (obj instanceof Process) {
	// ((Process) obj).setLastupdate(Calendar.getInstance().getTime());
	// WfProcessBlo.getInstance().updateProcessName((Process) obj);
	// } else if (obj instanceof Form) {
	// } else if (obj instanceof ToolAgent) {
	// }
	// }
	//
	// public void movetoFolder(TreeNode obj) throws Exception {
	// if (obj instanceof Folder) {
	// updateFolder(obj);
	// } else if (obj instanceof Process) {
	// WfProcessBlo.getInstance().updateProcessFolder((Process) obj);
	// } else if (obj instanceof Form) {
	// } else if (obj instanceof ToolAgent) {
	// }
	// }
	//
	// public void removeContent(TreeNode obj) throws Exception {
	// if (obj instanceof Folder) {
	// 
	// folderESO.delete(obj.getId());
	// } else if (obj instanceof Process) {
	// WfProcessBlo.getInstance().deletedProcess((Process) obj);
	// } else if (obj instanceof Form) {
	// } else if (obj instanceof ToolAgent) {
	// }
	// }

	// public TreeNode saveCopyOfFolders(TreeNode parent, TreeNode copyOfChild)
	// throws Exception {
	// parent.addChild(copyOfChild);
	// copyOfChild.setOwner(parent.getOwner());
	// // OwnerIdChanger.changeOwner(obj, parent.getOwner());
	// saveOfFolderContent(copyOfChild, parent);
	// return copyOfChild;
	// }

	// private void saveOfFolderContent(TreeNode obj, TreeNode parentFolder)
	// throws Exception {
	// if (obj instanceof Folder) {
	// obj.setId(IDGenerator.getInstance().getNewRID());
	// addNewFolder((Folder) obj);
	// for (TreeNode child : obj.getChildren()) {
	// if (child instanceof Folder) {
	// saveOfFolderContent(child, parentFolder);
	// } else if (child instanceof Process) {
	// duplicateProcess(child, parentFolder);
	// } else if (child instanceof Form) {
	// } else if (child instanceof ToolAgent) {
	// duplicateToolAgent(obj, parentFolder);
	// }
	// }
	// } else if (obj instanceof Process) {
	// duplicateProcess(obj, parentFolder);
	// } else if (obj instanceof Form) {
	// } else if (obj instanceof ToolAgent) {
	// duplicateToolAgent(obj, parentFolder);
	// }
	// }

	/**
	 * Duplicate a workflow process object for copy action implementation.
	 * 
	 * @param sourceProcess
	 * @param parentFolder
	 * @throws Exception
	 */
	// private void duplicateProcess(TreeNode sourceProcess, TreeNode
	// parentFolder) throws Exception {
	// Process proc =
	// WfProcessBlo.getInstance().getProcess(sourceProcess.getId());
	// proc.setParent(sourceProcess.getParent());
	// proc.setName(GeneratorUtil.generateUnqueEntityNameInFolder(proc,
	// parentFolder));
	// NewEntityIdAssignerBlo.assignId(proc);
	// WfProcessBlo.getInstance().saveCopyOfWfProcess((Process) proc);
	// sourceProcess.setId(proc.getId());
	// sourceProcess.setName(proc.getName());
	// }

	/**
	 * Duplicate a workflow tool agent object for copy action implementation.
	 * 
	 * @param sourceToolAgent
	 * @param parentFolder
	 * @throws Exception
	 */
	// private void duplicateToolAgent(TreeNode sourceToolAgent, TreeNode
	// parentFolder) throws Exception {
	// ToolAgent toolAgent =
	// WfJavaToolAgentBlo.getInstance().get(sourceToolAgent.getId());
	// toolAgent.setParent(toolAgent.getParent());
	// toolAgent.setName(GeneratorUtil.generateUnqueEntityNameInFolder(toolAgent,
	// parentFolder));
	// NewEntityIdAssignerBlo.assignId(toolAgent);
	// }

	// public void updateFolder(Folder folder) throws SQLException {
	// 
	// folderESO.update(folder);
	// }
	//

	// public void getChildrenFolders(TreeNode parent, int type) throws
	// Exception {
	// 
	// List<Folder> folderRos =
	// folderESO.queryChildrenFoldersByType(parent.getId(), type);
	// for (Folder ro : folderRos) {
	// if (parent.getOwner() != null) {
	// ro.setOwner(parent.getOwner());
	// } else {
	// ro.setOwner(parent);
	// }
	// parent.addChild(ro);
	// }
	// }

	/**
	 * 获取视图的所有的特定类型的文件夹。
	 * 
	 * @throws Exception
	 */
	// public void getFoldersForAdminViewer(Organization parent, int folderTpye)
	// throws Exception {
	// 
	// List<RecordObject> folderRos = folderESO.queryChildrenFoldersByType(
	// parent.getId(), folderTpye);
	// for (RecordObject ro : folderRos) {
	// Folder folder = (Folder) ro.getEntity(parent);
	// parent.addChild(folder);
	// getChildrenFolders(folder);
	// }
	// }

	/**
	 * This method is used to get an office calendar folder object when an
	 * office calendar object is being creating.
	 * 
	 * @param parent
	 * @param type
	 * @return
	 * @throws Exception
	 */
	// public Folder getFolder(String parentID, int type) throws Exception {
	// 
	// List<Folder> folderRos = folderESO.queryChildrenFoldersByType(
	// parentID, type);
	// for (Folder ro : folderRos) {
	// Folder folder = null;
	// folder = (Folder) ro.getEntity();
	// return (Folder) folder;
	// }
	// return null;
	// }

	// public TreeNode getFolders(TreeNode parent, int folderTpye)
	// throws Exception {
	// 
	// List<Folder> folderRos = folderESO.queryChildrenFoldersByType(
	// parent.getId(), folderTpye);
	// for (Folder ro : folderRos) {
	// ro.setOwner(parent);
	// parent.addChild(ro);
	// getChildrenFolders(ro);
	// }
	// return parent;
	// }

	// public TreeNode[] getFolders(int folderTpye) throws Exception {
	// List<Organization> orgs = WfOrganizationBlo.getInstance()
	// .getOrganizations();
	// 
	// for (Organization org : orgs) {
	// List<Folder> folderRos = folderESO
	// .queryChildrenFoldersByType(org.getId(), folderTpye);
	// for (Folder ro : folderRos) {
	// ro.setOwner(org);
	// org.addChild(ro);
	// getChildrenFolders(ro);
	// }
	// }
	// return orgs.toArray(new TreeNode[orgs.size()]);
	// }

}