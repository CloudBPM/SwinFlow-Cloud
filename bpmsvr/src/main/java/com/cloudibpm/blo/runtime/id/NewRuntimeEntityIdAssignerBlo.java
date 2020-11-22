package com.cloudibpm.blo.runtime.id;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.buildtime.wfprocess.Transition;
import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
import com.cloudibpm.core.buildtime.wfprocess.task.AbstractTask;
import com.cloudibpm.core.data.variable.AccessibleVariable;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.runtime.wfprocess.task.AssignTaskInstance;
import com.cloudibpm.core.runtime.wfprocess.task.EmailReceivingTaskInstance;
import com.cloudibpm.core.runtime.wfprocess.task.EmailSendingTaskInstance;
import com.cloudibpm.core.runtime.wfprocess.task.EndPointInstance;
import com.cloudibpm.core.runtime.wfprocess.task.ManualTaskInstance;
import com.cloudibpm.core.runtime.wfprocess.task.SMSReceivingTaskInstance;
import com.cloudibpm.core.runtime.wfprocess.task.SMSSendingTaskInstance;
import com.cloudibpm.core.runtime.wfprocess.task.StartPointInstance;
import com.cloudibpm.core.runtime.wfprocess.task.SubprocessPointInstance;
import com.cloudibpm.core.runtime.wfprocess.task.SystemTaskInstance;
import com.cloudibpm.core.runtime.wfprocess.task.TransitionInstance;
import com.cloudibpm.core.runtime.wfprocess.task.WaitTaskInstance;
import org.json.JSONObject;

public class NewRuntimeEntityIdAssignerBlo {

	/**
	 * Assign a new build time entity id to <code>parent</code> node and its
	 * children.
	 * 
	 * @param process
	 * @throws Exception
	 */
	public static void assignNewEntityId(WfProcess process) throws Exception {
		assignChildrenNewEntityId(process, process);
		for (WorkflowEntity task : process.getChildren()) {
			if (task instanceof AbstractTask) {
				if (((AbstractTask) task).hasOutputs()) {
					for (Transition t : ((AbstractTask) task).getOutputs()) {
						// 把变迁（连接）的定义Build time Id保存起来，换上Runtime Id
						((TransitionInstance) t).setDefinitionId(t.getId());
						t.setId(RuntimeIDGenerator.getInstance().getNewRID());
						//t.setId(RuntimeIDGenerator.getInstance().getNewRunTimeID());
					}
				}
			}
		}
	}

	/**
	 * 为新的流程实例赋新的Runtime ID值。
	 * 
	 * @param node,
	 *            it maybe process instance, task instance, data variable;
	 * @param owner,
	 *            process instance;
	 * @throws Exception
	 */
	private static void assignChildrenNewEntityId(TreeNode node, TreeNode owner) throws Exception {
		String id = RuntimeIDGenerator.getInstance().getNewRID();
		//String id = RuntimeIDGenerator.getInstance().getNewRunTimeID();
		if (node instanceof DataVariable) {
			String oldId = node.getId();// 数据变量Build time ID
			((DataVariable) node).setDefinitionId(oldId);
			for (TreeNode child : owner.getChildren()) {
				if (child instanceof StartPointInstance) {
					Object frm = ((StartPointInstance) child).getLaunchFormContent();
					if (frm != null) {// 替换表单中绑定的数据变量ID
						// 这段代码是为了替换表单中的变量ID，而写的一个变通办法，其实很不好，
						// 需要优化，通过表单来实现替换ID。
						if (frm instanceof JSONObject) {
							String f = frm.toString();
							String newf = f.replaceAll(oldId, id);
							JSONObject fj = new JSONObject(newf);
							((StartPointInstance) child).setLaunchFormContent(fj);
						}
					}
					if (((StartPointInstance) child).getAccessibleVars() != null
							&& ((StartPointInstance) child).getAccessibleVars().length > 0) {
						for (AccessibleVariable ac : ((StartPointInstance) child).getAccessibleVars()) {
							if (ac.getVarId().equals(oldId)) {
								ac.setVarId(id);
							}
							ac.setCurrOwner(owner.getId());
						}
					}
				} else if (child instanceof EndPointInstance) {
					String frm = ((EndPointInstance) child).getEndFormContent();
					if (frm != null) {
						String newcontent = frm.replaceAll(oldId, id);
						((EndPointInstance) child).setEndFormContent(newcontent);
					}
					if (((EndPointInstance) child).getAccessibleVars() != null
							&& ((EndPointInstance) child).getAccessibleVars().length > 0) {
						for (AccessibleVariable ac : ((EndPointInstance) child).getAccessibleVars()) {
							if (ac.getVarId().equals(oldId)) {
								ac.setVarId(id);
							}
							ac.setCurrOwner(owner.getId());
						}
					}
				} else if (child instanceof ManualTaskInstance) {
//					String frm = ((ManualTaskInstance) child).getFormContent();
					Object frm = ((ManualTaskInstance) child).getFormContent();
					if (frm != null) {
//						String newcontent = frm.replaceAll(oldId, id);
//						((ManualTaskInstance) child).setFormContent(newcontent);
						if(frm instanceof JSONObject){
							String s = frm.toString();
							String str = s.replaceAll(oldId, id);
							JSONObject newContent = new JSONObject(str);
							((ManualTaskInstance) child).setFormContent(newContent);
						}
					}
					if (((ManualTaskInstance) child).getAccessibleVars() != null
							&& ((ManualTaskInstance) child).getAccessibleVars().length > 0) {
						for (AccessibleVariable ac : ((ManualTaskInstance) child).getAccessibleVars()) {
							if (ac.getVarId().equals(oldId)) {
								ac.setVarId(id);
							}
							ac.setCurrOwner(owner.getId());
						}
					}
				}
			}
		} else if (node instanceof AbstractTask) {
			String oldId = node.getId();// 任务的Build time ID
			if (node instanceof StartPointInstance) {
				if (((StartPointInstance) node).getAccessibleVars() != null
						&& ((StartPointInstance) node).getAccessibleVars().length > 0) {
					for (AccessibleVariable ac : ((StartPointInstance) node).getAccessibleVars()) {
						ac.setTaskId(id);
						ac.setParent(null);
					}
				}
				((StartPointInstance) node).setDefinitionId(oldId);
			} else if (node instanceof EndPointInstance) {
				if (((EndPointInstance) node).getAccessibleVars() != null
						&& ((EndPointInstance) node).getAccessibleVars().length > 0) {
					for (AccessibleVariable ac : ((EndPointInstance) node).getAccessibleVars()) {
						ac.setTaskId(id);
						ac.setParent(null);
					}
				}
				((EndPointInstance) node).setDefinitionId(oldId);
			} else if (node instanceof ManualTaskInstance) {
				if (((ManualTaskInstance) node).getAccessibleVars() != null
						&& ((ManualTaskInstance) node).getAccessibleVars().length > 0) {
					for (AccessibleVariable ac : ((ManualTaskInstance) node).getAccessibleVars()) {
						ac.setTaskId(id);
						ac.setParent(null);
					}
				}
				((ManualTaskInstance) node).setDefinitionId(oldId);
			} else if (node instanceof AssignTaskInstance) {
				((AssignTaskInstance) node).setDefinitionId(oldId);
			} else if (node instanceof EmailReceivingTaskInstance) {
				((EmailReceivingTaskInstance) node).setDefinitionId(oldId);
			} else if (node instanceof EmailSendingTaskInstance) {
				((EmailSendingTaskInstance) node).setDefinitionId(oldId);
			} else if (node instanceof SMSReceivingTaskInstance) {
				((SMSReceivingTaskInstance) node).setDefinitionId(oldId);
			} else if (node instanceof SMSSendingTaskInstance) {
				((SMSSendingTaskInstance) node).setDefinitionId(oldId);
			} else if (node instanceof SubprocessPointInstance) {
				((SubprocessPointInstance) node).setDefinitionId(oldId);
			} else if (node instanceof SystemTaskInstance) {
				((SystemTaskInstance) node).setDefinitionId(oldId);
			} else if (node instanceof WaitTaskInstance) {
				((WaitTaskInstance) node).setDefinitionId(oldId);
			}
		}
		node.setId(id);
		for (TreeNode child : node.getChildren()) {
			child.setParent(id);
			assignChildrenNewEntityId(child, owner);
		}
	}

	// /**
	// * Assign a new entity id to <code>parent</code> node and its children.
	// *
	// * @param parent
	// * @throws Exception
	// */
	// public static void assignId(TreeNode parent) throws Exception {
	// assignChildrenNewEntityId(parent);
	// for (WorkflowEntity task : parent.getChildren()) {
	// if (task instanceof AbstractTask
	// && ((AbstractTask) task).hasOutputs()) {
	// for (Transition t : ((AbstractTask) task).getOutputs()) {
	// t.setId(RuntimeIDGenerator.getInstance().getNewRID());
	// }
	// }
	// }
	// }
	//
	// private static void assignChildrenNewEntityId(TreeNode parent)
	// throws Exception {
	// String id = RuntimeIDGenerator.getInstance().getNewRID();
	// parent.setId(id);
	// for (TreeNode node : parent.getChildren()) {
	// node.setParent(id);
	// assignChildrenNewEntityId(node);
	// }
	// }
}
