package com.cloudibpm.controller;

import com.cloudibpm.blo.buildtime.wfprocess.BuildtimeWfProcessBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.buildtime.release.wfprocess.ReleasedWfProcess;
import com.cloudibpm.core.folder.Folder;
import com.cloudibpm.core.folder.JSTreeNode;
import com.cloudibpm.core.organization.Organization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/service16")
public class BillController {
	private final BuildtimeWfProcessBlo buildtimeWfProcessBlo;

	@Autowired
	public BillController(BuildtimeWfProcessBlo buildtimeWfProcessBlo) {
		this.buildtimeWfProcessBlo = buildtimeWfProcessBlo;
	}

	@RequestMapping(value = "/api0", method = RequestMethod.POST, headers = "Accept=application/json", produces = "application/json; charset=utf-8")
	@ResponseBody
	public JSTreeNode[] getProcessFolders(String ids) {
		List<Organization> orgs = null;
		try {
			if (ids.equals("00000000000001R")) {
				orgs = buildtimeWfProcessBlo.getOrganizationsForAdminViewer();
			} else {
				String[] strArry = ids.split(";");
				orgs = buildtimeWfProcessBlo.getOrganizationsForAdminViewer(strArry);
			}
			if (orgs != null) {
				Organization[] orgArray = new Organization[orgs.size()];
				for (int i = 0; i < orgArray.length; i++) {
					orgArray[i] = orgs.get(i);
				}
				return generateJSTreeNodes(orgArray);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	private JSTreeNode[] generateJSTreeNodes(TreeNode[] roots) {
		if (roots.length > 0) {
			JSTreeNode[] jstnodes = new JSTreeNode[roots.length];
			for (int i = 0; i < roots.length; i++) {
				TreeNode node = roots[i];
				JSTreeNode jstnode = new JSTreeNode();
				jstnode.id = node.getId();
				jstnode.text = JSTreeNode.parseUTF8(node.getName());
				jstnode.icon = "";
				if (node instanceof Organization) {
					jstnode.icon = "glyphicon glyphicon-home";
					jstnode.data = "1|null";
				} else if (node instanceof Folder && ((Folder) node).getType() == 109) {
					jstnode.icon = "glyphicon glyphicon-th-large";
					jstnode.data = "2|" + node.getOwner() + "|" + ((Folder) node).getType() + "|"
							+ ((Folder) node).getRank();
				} else if (node instanceof ReleasedWfProcess) {
					jstnode.icon = "glyphicon glyphicon-fire";
					jstnode.data = "3|" + node.getOwner() + "|" + ((ReleasedWfProcess) node).getCode() + "|R|"
							+ ((ReleasedWfProcess) node).getVersion();
					jstnode.text = JSTreeNode
							.parseUTF8(node.getName() + "(" + ((ReleasedWfProcess) node).getVersion() + ")");
				}
				if (node.getParent() != null) {
					jstnode.parentId = node.getParent();
				}
				if (node.hasChildren()) {
					jstnode.children = generateJSTreeNodes(node.getChildren());
				}
				jstnodes[i] = jstnode;
			}
			return jstnodes;
		}
		return null;
	}

}
