/**
 * This is assignment task, you can use to assign a value to a process variable.
 * 
 * @user Dahai CAO
 * @date 19/10/2011 11:01:28 AM, last updated at 20:07 on 2018-08-31, 
 * last updated at 20:20 on Sunday 2018-09-02, it is my 46th birthday
 */
package com.cloudibpm.runtime.engine.transaction;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.antlr.evaluation.EvalExprCalculatorUtil;
import com.cloudibpm.core.buildtime.wfprocess.task.Assignment;
import com.cloudibpm.core.data.Constant;
import com.cloudibpm.core.data.expression.Expression;
import com.cloudibpm.core.data.variable.ArrayDataVariable;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.core.runtime.wfprocess.task.AssignTaskInstance;

import java.util.*;

public class AssignTaskTransaction extends AbstractTaskTransaction<AssignTaskInstance> {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 8969154080947653892L;
	private Map<String, Object> map = new HashMap<String, Object>();

	/**
	 * Constructor
	 * 
	 * @param task
	 * @param isSingleStep
	 * @param process
	 * @param part
	 */
	public AssignTaskTransaction(AssignTaskInstance task, WfProcessInstance wfprocessInstance) {
		super(task, wfprocessInstance);
	}

	@Override
	public void begin() {
		taskInstance.setStartTime(System.currentTimeMillis());
		Assignment[] assignments = taskInstance.getAssignments();
		// executing task:
		for (Assignment assignment : assignments) {
			if (assignment.getVariable() != null) {
				TreeNode childNode = getWfProcessInstance().seekChildByID(assignment.getVariable().getId());
				DataVariable var = (DataVariable) childNode;
				map.put(var.getId(), var.getValue());
			}
		}
	}

	/**
	 * @author Dahai CAO
	 * @date 19/10/2011 11:01:28 AM
	 * @param monitor
	 * @return
	 */
	@Override
	public void commit() throws Exception {
		Assignment[] assignments = taskInstance.getAssignments();
		// executing task:
		for (Assignment assignment : assignments) {
			if (assignment.getVariable() != null) {
				TreeNode childNode = getWfProcessInstance().seekChildByID(assignment.getVariable().getId());
				if (childNode instanceof ArrayDataVariable) {
					ArrayDataVariable var = (ArrayDataVariable) childNode;
					WorkflowEntity e = EvalExprCalculatorUtil.computeValue((Expression) assignment.getValue(),
							this.getWfProcessInstance());
					if (var.getValues() == null) {
						var.setValues(new Constant[0]);
					}
					Object[] values = (Object[]) var.getValues();
					int i = assignment.getArrayIndex();
					if (i >= 0 && values.length > i) {
						if (e instanceof ArrayDataVariable) {
							if (((ArrayDataVariable) e).getValues() != null) {
								Constant[] cs = (Constant[]) ((ArrayDataVariable) e).getValues();
								if (cs.length > 0) {
									List<Object> list = Arrays.asList(values);
									list = new ArrayList(list);
									for (int j = 0; j < cs.length; j++) {
										list.add(cs[j].clone(wfprocessInstance));
									}
									var.setValues(list.toArray(new Constant[list.size()]));
								}
							}
						} else if (e instanceof DataVariable) {
							if (((DataVariable) e).getValue() != null
									&& ((DataVariable) e).getValue() instanceof Constant) {
								Constant c = (Constant) ((DataVariable) e).getValue();
								values[i] = c.clone(wfprocessInstance);
							}
						} else if (e instanceof Constant) {
							values[i] = ((Constant) e).clone(wfprocessInstance);
						}
					} else { // arrayIndex = -1 这时候表明数组有可能是空数组，或者就是要给整个数组赋值
						if (e instanceof ArrayDataVariable) { // e 是赋值表达式的计算结果
							if (((ArrayDataVariable) e).getValues() != null) {
								// 如果赋值的是数组变量，那么将其数组中的所有元素添加到被赋值数组中。
								Constant[] cs = (Constant[]) ((ArrayDataVariable) e).getValues();
								if (cs.length > 0) {
									if (values.length > 0) {
										// 被赋值数组是非空数组
										List<Object> list = Arrays.asList(values);
										list = new ArrayList(list);
										for (int j = 0; j < cs.length; j++) {
											list.add(cs[j].clone(wfprocessInstance));
										}
										var.setValues(list.toArray(new Constant[list.size()]));
									} else {
										// 被赋值数组是空数组
										Object[] v = (Object[]) ((ArrayDataVariable) e).getValues();
										if (v != null && v.length > 0) {
											List<Object> list = new ArrayList<Object>();
											for (int j = 0; j < v.length; j++) {
												list.add(((Constant) v[j]).clone(wfprocessInstance));
											}
											var.setValues(list.toArray(new Constant[v.length]));
										}
									}
								}
							}
						} else if (e instanceof DataVariable) {
							if (((DataVariable) e).getValue() != null
									&& ((DataVariable) e).getValue() instanceof Constant) {
								Object o = ((DataVariable) e).getValue();
								Object val = var.getValues();
								if (val != null) {
									Object[] cs = (Object[]) var.getValues();
									if (cs.length > 0) {
										// 被赋值数组是非空数组
										List<Object> list = Arrays.asList(cs);
										list = new ArrayList<Object>(list);
										list.add(((Constant) o).clone(wfprocessInstance));
										var.setValues(list.toArray(new Object[list.size()]));
									} else {
										// 被赋值数组是空数组
										Object[] cs1 = new Object[1];
										cs1[0] = ((Constant) o).clone(wfprocessInstance);
										var.setValues(cs1);
									}
								}
							}
						} else if (e instanceof Constant) {
							Object val = var.getValues();
							if (val != null) {
								Object[] cs = (Object[]) var.getValues();
								if (cs.length > 0) {
									// 被赋值数组是非空数组
									List<Object> list = Arrays.asList(cs);
									list = new ArrayList<Object>(list);
									list.add(((Constant) e).clone(wfprocessInstance));
									var.setValues(list.toArray(new Object[list.size()]));
								} else {
									// 被赋值数组是空数组
									Object[] cs1 = new Object[1];
									cs1[0] = ((Constant) e).clone(wfprocessInstance);
									var.setValues(cs1);
								}
							}
						}
					}
				} else if (childNode instanceof DataVariable) {
					DataVariable var = (DataVariable) childNode;
					if (assignment.getValue() != null) {
						if (assignment.getValue() instanceof Expression) {
							WorkflowEntity e = EvalExprCalculatorUtil.computeValue((Expression) assignment.getValue(),
									this.getWfProcessInstance());
							if (e instanceof ArrayDataVariable) {
								if (((ArrayDataVariable) e).getValues() != null) {
									Constant[] cs = (Constant[]) ((ArrayDataVariable) e).getValues();
									if (cs.length > 0) {
										var.setValue(cs[0].clone(wfprocessInstance));
									}
								}
							} else if (e instanceof DataVariable) {
								if (((DataVariable) e).getValue() != null) {
									var.setValue(((Constant) ((DataVariable) e).getValue()).clone(wfprocessInstance));
								}
							} else if (e instanceof Constant) {
								var.setValue(((Constant) e).clone(wfprocessInstance));
							}
						}
					}
				}
			}
		}
		taskInstance.setEndTime(System.currentTimeMillis());
	}

	@Override
	public void rollback() {
		Assignment[] assignments = taskInstance.getAssignments();
		// executing task:
		for (Assignment assignment : assignments) {
			if (assignment.getVariable() != null) {
				TreeNode childNode = getWfProcessInstance().seekChildByID(assignment.getVariable().getId());
				DataVariable var = (DataVariable) childNode;
				if (map != null) {
					if (map.get(var.getId()) != null)
						var.setValue(map.get(var.getId()));
					else
						var.setValue(null);
				}
			}
		}
	}

}
