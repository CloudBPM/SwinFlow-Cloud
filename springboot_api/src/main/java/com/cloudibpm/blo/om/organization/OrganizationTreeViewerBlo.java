/**
 * @user Dahai CAO
 * @date 2011-11-1 下午09:25:55
 */
package com.cloudibpm.blo.om.organization;

import com.cloudibpm.blo.folder.WfFolderBlo;
import com.cloudibpm.blo.om.category.CategoryBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.category.Category;
import com.cloudibpm.core.folder.Folder;
import com.cloudibpm.core.folder.FolderType;
import com.cloudibpm.core.officecalendar.OfficeCalendar;
import com.cloudibpm.core.organization.Department;
import com.cloudibpm.core.organization.Division;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.organization.ProjectTeam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
//@Transactional
public class OrganizationTreeViewerBlo {
	private final OrganizationBlo organizationBlo;
	private final WfFolderBlo wfFolderBlo;
	private final CategoryBlo categoryBlo;
	private final DivisionBlo divisionBlo;
	private final DepartmentBlo departmentBlo;
	private final ProjectTeamBlo projectTeamBlo;
	private final CalenderBlo calenderBlo;


	@Autowired
	public OrganizationTreeViewerBlo(OrganizationBlo organizationBlo, WfFolderBlo wfFolderBlo, CategoryBlo categoryBlo, DivisionBlo divisionBlo, DepartmentBlo departmentBlo, ProjectTeamBlo projectTeamBlo, CalenderBlo calenderBlo) {
		this.organizationBlo = organizationBlo;
		this.wfFolderBlo = wfFolderBlo;
		this.categoryBlo = categoryBlo;
		this.divisionBlo = divisionBlo;
		this.departmentBlo = departmentBlo;
		this.projectTeamBlo = projectTeamBlo;
		this.calenderBlo = calenderBlo;
	}

	// new
	public List<Organization> getAllOrganizationList() throws Exception {
		List<Organization> orgs = organizationBlo.getOrganizations();
		for (Organization org : orgs) {
			int[] types = { Folder.CALENDAR_FOLDER, Folder.HOLIDAY_FOLDER,Folder.GROUP_FOLDER, Folder.STRUCTURE_FOLDER, Folder.USER_FOLDER,
					Folder.HOMEPABGE_FOLDER, Folder.PAYMENT_FOLDER, Folder.FILE_FOLDER, FolderType.LICENSE_FOLDER,
					FolderType.CATEGORY_FOLDER, FolderType.ORG_CATEGORY_FOLDER, FolderType.DEPARTMENT_CATEGORY_FOLDER,
					FolderType.POSITION_CATEGORY_FOLDER, FolderType.RANK_CATEGORY_FOLDER };
			wfFolderBlo.getChildrenFoldersForOrgViewer(org, types);

			for (TreeNode child : org.getChildren()) {
				if (((Folder) child).getType() == Folder.CALENDAR_FOLDER) {
					getLeafCalendars(child);
				} else if (((Folder) child).getType() == Folder.GROUP_FOLDER) {
					getLeafGroups(child);
				} else if (((Folder) child).getType() == Folder.HOLIDAY_FOLDER) {
					getLeafHoliday(child);
				} else if (((Folder) child).getType() == Folder.STRUCTURE_FOLDER) {
					getOrganizationStructureforFolder(child);
				} else if (((Folder) child).getType() == Folder.USER_FOLDER) {
				} else if (((Folder) child).getType() == Folder.HOMEPABGE_FOLDER) {
				} else if (((Folder) child).getType() == Folder.PAYMENT_FOLDER) {
				} else if (((Folder) child).getType() == Folder.FILE_FOLDER) {
				} else if (((Folder) child).getType() == Folder.LICENSE_FOLDER) {
				} else if (((Folder) child).getType() == FolderType.CATEGORY_FOLDER) {
					assembleCategoryFolder((Folder) child, org.getId());
				} else if (((Folder) child).getType() == FolderType.RANK_CATEGORY_FOLDER) {
				}
			}
		}
		return orgs;
	}

	private void assembleCategoryFolder(Folder f, String orgid) throws Exception {
		List<Category> categories = categoryBlo.getCategories(orgid);
		for (TreeNode child : f.getChildren()) {
			if (((Folder) child).getType() == FolderType.ORG_CATEGORY_FOLDER) {
				categoryBlo.assembleStructure((Folder) child, categories);
			} else if (((Folder) child).getType() == FolderType.DEPARTMENT_CATEGORY_FOLDER) {
				categoryBlo.assembleStructure((Folder) child, categories);
			} else if (((Folder) child).getType() == FolderType.POSITION_CATEGORY_FOLDER) {
				categoryBlo.assembleStructure((Folder) child, categories);
			}
		}
	}

	// new
	public List<Organization> getOrganizationListByIds(String[] ids) throws Exception {
		List<Organization> orgs = organizationBlo.getOrganizationsByIds(ids);
		for (Organization org : orgs) {
			int[] types = { Folder.CALENDAR_FOLDER, Folder.GROUP_FOLDER,Folder.HOLIDAY_FOLDER, Folder.STRUCTURE_FOLDER, Folder.USER_FOLDER,
					Folder.HOMEPABGE_FOLDER, Folder.PAYMENT_FOLDER, Folder.FILE_FOLDER, Folder.LICENSE_FOLDER,
					FolderType.CATEGORY_FOLDER, FolderType.DEPARTMENT_CATEGORY_FOLDER,
					FolderType.POSITION_CATEGORY_FOLDER, FolderType.RANK_CATEGORY_FOLDER};
			wfFolderBlo.getChildrenFoldersForOrgViewer(org, types);
			List<Category> categories = categoryBlo.getCategories(org.getId());
			for (TreeNode child : org.getChildren()) {
				if (((Folder) child).getType() == Folder.CALENDAR_FOLDER) {
					getLeafCalendars(child);
				} else if (((Folder) child).getType() == Folder.HOLIDAY_FOLDER) {
					getLeafHoliday(child);
				} else if (((Folder) child).getType() == Folder.GROUP_FOLDER) {
					getLeafGroups(child);
				} else if (((Folder) child).getType() == Folder.STRUCTURE_FOLDER) {
					getOrganizationStructureforFolder(child);
				} else if (((Folder) child).getType() == Folder.USER_FOLDER) {// staff
																				// folder
				} else if (((Folder) child).getType() == Folder.HOMEPABGE_FOLDER) {
				} else if (((Folder) child).getType() == Folder.PAYMENT_FOLDER) {
				} else if (((Folder) child).getType() == Folder.FILE_FOLDER) {
				} else if (((Folder) child).getType() == Folder.LICENSE_FOLDER) {
				} else if (((Folder) child).getType() == FolderType.CATEGORY_FOLDER) {
					assembleCategoryFolder((Folder) child, org.getId());
				}
			}
		}
		return orgs;
	}

	/**
	 * 
	 * @date 2011-11-1 下午09:56:41
	 * @param parent
	 * @throws Exception
	 */
	private void getLeafCalendars(TreeNode parent) throws Exception {
//		 for (TreeNode child : parent.getChildren()) {
//		 getLeafCalendars(child);
//		 }
//		 for (OfficeCalendar calendar :
//		 WfOfficeCalendarBLo.getInstance().getCalendars(parent,
//		 new WorkflowEntity(parent.getOwner()))) {
//		 parent.addChild(calendar);
//		 }
		List<OfficeCalendar> officeCalendars = calenderBlo.queryAllCalender(new WorkflowEntity(parent.getOwner()).getId());
		calenderStructure(parent, officeCalendars);
	}

	/**
	 *
	 * @date 2011-11-1 下午09:56:41
	 * @param parent
	 * @throws Exception
	 */
	private void getLeafHoliday(TreeNode parent) throws Exception {
		 for (TreeNode child : parent.getChildren()) {
			 getLeafHoliday(child);
		 }
		// for (OfficeCalendar calendar :
		// WfOfficeCalendarBLo.getInstance().getCalendars(parent,
		// new WorkflowEntity(parent.getOwner()))) {
		// parent.addChild(calendar);
		// }

	}

	/**
	 * 
	 * @date 2011-11-1 下午09:56:37
	 * @param parent
	 * @throws Exception
	 */
	private void getLeafGroups(TreeNode parent) throws Exception {
		for (TreeNode child : parent.getChildren()) {
			getLeafGroups(child);
		}
	}

	/**
	 * Load organization structure information.
	 * 
	 * @date 2011-11-1 下午09:57:20
	 * @param child
	 * @throws Exception
	 */
	private void getOrganizationStructureforFolder(TreeNode child) throws Exception {
		List<Division> divisions = divisionBlo.getDivisions(new WorkflowEntity(child.getOwner()));
		List<Department> departments = departmentBlo.getDepartments(new WorkflowEntity(child.getOwner()));
		List<ProjectTeam> teams = projectTeamBlo.getProjectTeams(new WorkflowEntity(child.getOwner()));
		assembleStructure(child, divisions, departments, teams);
	}

	private void assembleStructure(TreeNode topparent, List<Division> divisions, List<Department> departments,
			List<ProjectTeam> teams) {
		Map<String, WorkflowEntity> map = new HashMap<String, WorkflowEntity>();
		// 首先将所有的组织对象都装在一个哈希表中。
		for (Division division : divisions) {
			map.put(division.getId(), division);
		}
		for (Department department : departments) {
			map.put(department.getId(), department);
		}
		for (ProjectTeam team : teams) {
			map.put(team.getId(), team);
		}
		for (Division division : divisions) {
			if (division.getParent() != null) {
				TreeNode parent = (TreeNode) map.get(division.getParent());
				parent.addChild(division);
			} else {
				topparent.addChild(division);
			}
		}
		for (Department department : departments) {
			if (department.getParent() != null) {
				TreeNode parent = (TreeNode) map.get(department.getParent());
				parent.addChild(department);
			} else {
				topparent.addChild(department);
			}
		}
		for (ProjectTeam team : teams) {
			if (team.getParent() != null) {
				TreeNode parent = (TreeNode) map.get(team.getParent());
				parent.addChild(team);
			} else {
				topparent.addChild(team);
			}
		}
	}

	private void calenderStructure(TreeNode topparent, List<OfficeCalendar> officeCalendars) {
		Map<String, WorkflowEntity> map = new HashMap<String, WorkflowEntity>();
		// 首先将所有的组织对象都装在一个哈希表中。
		for (OfficeCalendar officeCalendar : officeCalendars) {
			map.put(officeCalendar.getId(), officeCalendar);
		}

		for (OfficeCalendar officeCalendar : officeCalendars) {
//			if (officeCalendar.getParent() != null) {
//				TreeNode parent = (TreeNode) map.get(officeCalendar.getParent());
//				parent.addChild(officeCalendar);
//			} else {
//				topparent.addChild(officeCalendar);
//			}
			topparent.addChild(officeCalendar);
		}
	}
}
