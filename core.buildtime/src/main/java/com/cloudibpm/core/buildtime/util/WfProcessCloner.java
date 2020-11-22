package com.cloudibpm.core.buildtime.util;

import com.cloudibpm.core.Location;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.buildtime.release.wfprocess.ReleasedWfProcess;
import com.cloudibpm.core.buildtime.wfprocess.Transition;
import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
import com.cloudibpm.core.buildtime.wfprocess.task.*;
import com.cloudibpm.core.data.Constant;
import com.cloudibpm.core.data.FileConstant;
import com.cloudibpm.core.data.expression.Expression;
import com.cloudibpm.core.data.variable.AccessibleVariable;
import com.cloudibpm.core.data.variable.ArrayDataVariable;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.data.variable.ParameterUtil;

/**
 * 由于WfProcess对象比较内部引用关系比较复杂，特别是具有循环引用的特点，因此无法直接序列化，
 * 尽管我们现在在网上可以发现很多能支持将具有循环引用的对象转换为可序列化JSONObject的工具，
 * 但是仍然不好用。因此我们开发了这个克隆工具，这个工具具有将一个标准的WfProcess对象转换为
 * 一个可用JSONObject工具序列化、并存储到MongoDB数据库的、去除了原来对象间循环引用的新对象。
 *
 * @author Dahai Cao created at 14:55 on 2019-01-15
 */
public class WfProcessCloner {
    /**
     *
     * @date Dahai Cao last updated at 16:29 on Sunday 2018-09-02
     * @param process
     *            WfProcess
     * @return WfProcess
     */
    public static WfProcess clone(WfProcess process) {
        WfProcess proc = new WfProcess();
        cloneCommonProps(proc, process);
        cloneChildren(proc, process);
        return proc;
    }

    /**
     * 将ReleasedWfProcess对象克隆成新的ReleasedWfProcess对象。注意，这个不是真正意义上的克隆，而只是为了序列化，
     * 而做的准备，即去除对象之间的循环引用。不能用于克隆对象。如果你要克隆操作，可以基于这些方法， 新做一个方法去克隆。
     *
     * @date Dahai Cao last updated at 16:29 on Sunday 2018-09-02
     * @param process
     *            ReleasedWfProcess
     * @return ReleasedWfProcess
     */
    public static ReleasedWfProcess clone(ReleasedWfProcess process) {
        ReleasedWfProcess proc = new ReleasedWfProcess();
        cloneCommonProps(proc, process);
        cloneCommonRPProps(proc, process);
        cloneChildren(proc, process);
        return proc;
    }

    protected static void cloneCommonProps(WfProcess proc, WfProcess process) {
        proc.setId(process.getId());
        proc.setCode(process.getCode());
        proc.setName(process.getName());
        proc.setProcessType(process.getProcessType());
        proc.setWorkflowType(process.getWorkflowType());
        proc.setAccessLevel(process.getAccessLevel());
        proc.setAuthorId(process.getAuthorId());
        proc.setAuthor(process.getAuthor());
        proc.setDescription(process.getDescription());
        proc.setKeywords(process.getKeywords());
        proc.setParent(process.getParent());
        proc.setOwner(process.getOwner());
        proc.setLastupdate(process.getLastupdate());
        proc.setStatus(process.getStatus());
        proc.setPurchasePrice(process.getPurchasePrice());
        proc.setUsagePrice(process.getUsagePrice());
    }

    protected static void cloneCommonRPProps(ReleasedWfProcess proc, ReleasedWfProcess process) {
        proc.setVersion(process.getVersion());
        proc.setReleaserId(process.getReleaserId());
        proc.setReleaser(process.getReleaser());
        proc.setReleaseDate(process.getReleaseDate());
        proc.setReleaseStatement(process.getReleaseStatement());
        proc.setTrialPeriod(process.getTrialPeriod());
        proc.setLikeCounting(process.getLikeCounting());
        proc.setTotalDownloading(process.getTotalDownloading());
        proc.setTotalUseCounting(process.getTotalUseCounting());
        proc.setSuccessCounting(process.getSuccessCounting());
        proc.setTerminationCounting(process.getTerminationCounting());
        proc.setSuspensionCounting(process.getSuspensionCounting());
    }

    protected static void cloneChildren(WfProcess proc, WfProcess process) {
        if (process.hasChildren()) {
            for (int i = 0; i < process.getChildren().length; i++) {
                if (process.getChildren()[i] instanceof AbstractTask) {
                    AbstractTask t = cloneTask(process.getChildren()[i]);
                    proc.addChild(t);
                    if (((AbstractTask) process.getChildren()[i]).hasOutputs()) {
                        for (int j = 0; j < ((AbstractTask) process.getChildren()[i]).getOutputs().length; j++) {
                            t.addOutput(cloneTransition(((AbstractTask) process.getChildren()[i]).getOutputs()[j]));
                        }
                    }
                } else if (process.getChildren()[i] instanceof DataVariable) {
                    proc.addChild(cloneDataVariable(process.getChildren()[i]));
                }
            }
        }
    };

    public static AbstractTask cloneTask(TreeNode task) {
        AbstractTask t = (AbstractTask) task;
        if (task instanceof StartPoint) {
            StartPoint a = new StartPoint();
            setCommonProp(a, t);
            setStartPointProp(a, (StartPoint) t);
            return a;
        } else if (task instanceof EndPoint) {
            EndPoint a = new EndPoint();
            setCommonProp(a, t);
            setEndPointProp(a, (EndPoint) t);
            return a;
        } else if (task instanceof ManualTask) {
            ManualTask a = new ManualTask();
            setCommonProp(a, t);
            setManualTaskProp(a, (ManualTask) t);
            return a;
        } else if (task instanceof AssignTask) {
            AssignTask a = new AssignTask();
            setCommonProp(a, t);
            a.setAssignments(cloneAssignment(((AssignTask) t).getAssignments()));
            return a;
        } else if (task instanceof SubprocessPoint) {
            SubprocessPoint a = new SubprocessPoint();
            setCommonProp(a, t);
            setSubprocessPointProp(a, (SubprocessPoint) t);
            return a;
        } else if (task instanceof SystemTask) {
            SystemTask a = new SystemTask();
            setCommonProp(a, t);
            setSystemTaskProp(a, (SystemTask) t);
            return a;
        } else if (task instanceof WaitTask) {
            WaitTask a = new WaitTask();
            setCommonProp(a, t);
            setWaitTaskProp(a, (WaitTask) t);
            return a;
        } else if (task instanceof EmailReceivingTask) {
            EmailReceivingTask a = new EmailReceivingTask();
            setCommonProp(a, t);
            return a;
        } else if (task instanceof EmailSendingTask) {
            EmailSendingTask a = new EmailSendingTask();
            setCommonProp(a, t);
            setEmailSendingTaskProp(a, (EmailSendingTask) t);
            return a;
        } else if (task instanceof SMSSendingTask) {
            SMSSendingTask a = new SMSSendingTask();
            setCommonProp(a, t);
            setSMSSendingTaskProp(a, (SMSSendingTask) t);
            return a;
        } else if (task instanceof SMSReceivingTask) {
            SMSReceivingTask a = new SMSReceivingTask();
            setCommonProp(a, t);
            return a;
        }
        return null;
    }

    protected static void setCommonProp(AbstractTask a, AbstractTask t) {
        a.setId(t.getId());
        a.setName(t.getName());
        a.setX0(t.getX0()); // top left corner X
        a.setY0(t.getY0()); // top left corner Y
        a.setX1(t.getX1()); // bottom right corner X
        a.setY1(t.getY1()); // bottom right corner X
        a.setStatus(t.getStatus());
        a.setDescription(t.getDescription());
        a.setIsParallelInput(t.getIsParallelInput());
        a.setIsParallelOutput(t.getIsParallelOutput());
        a.setCurrOwner(t.getCurrOwner()); // process ID
        a.setOwner(t.getOwner()); // organization ID
        a.setLastupdate(t.getLastupdate());
    }

    protected static void setStartPointProp(StartPoint a, StartPoint t) {
        a.setLaunchUIType(t.getLaunchUIType());
        a.setLaunchUIUrl(t.getLaunchUIUrl());
        a.setLaunchFormContent(t.getLaunchFormContent());
        a.setAccessibleVars(cloneAccessibleVariable(t.getAccessibleVars()));
    }

    protected static void setEndPointProp(EndPoint a, EndPoint t) {
        a.setEndUIType(t.getEndUIType());
        a.setEndUIUrl(t.getEndUIUrl());
        a.setEndFormContent(t.getEndFormContent());
        a.setAccessibleVars(cloneAccessibleVariable(t.getAccessibleVars()));
    }

    protected static void setManualTaskProp(ManualTask a, ManualTask t) {
        a.setDeadlineDays(t.getDeadlineDays());
        a.setAlarmDays(t.getAlarmDays());
        a.setAlarmFrequency(t.getAlarmFrequency());
        a.setAlarmMethod(t.getAlarmMethod());
        a.setUiType(t.getUiType());
        a.setUiUrl(t.getUiUrl());
        a.setFormContent(t.getFormContent());
        a.setAccessibleVars(cloneAccessibleVariable(t.getAccessibleVars()));
        a.setParticipants(cloneParticipant(t.getParticipants()));
        a.setExpiryHandlerWfProcessId(t.getExpiryHandlerWfProcessId());
    }

    protected static void setSystemTaskProp(SystemTask a, SystemTask t) {
        a.setAppServiceType(t.getAppServiceType());
        a.setAppServiceId(t.getAppServiceId());
        a.setAppServiceName(t.getAppServiceName());
        a.setHasSecurityAccessKey(t.getHasSecurityAccessKey());
        a.setSecurityAccessKey(t.getSecurityAccessKey());
        a.setAPIName(t.getAPIName());
        a.setAPIMethod(t.getAPIMethod());
        a.setPathParameterString(ParameterUtil.toParameterString(t.getPathParameters()));
        a.setFormParameterString(ParameterUtil.toParameterString(t.getFormParameters()));
        a.setReturnString(ParameterUtil.toReturnParameterString(t.getReturnObject()));
    }

    protected static void setSubprocessPointProp(SubprocessPoint a, SubprocessPoint t) {
        a.setSubprocessId(t.getSubprocessId());
        a.setSubprocessName(t.getSubprocessName());
        a.setSynchronised(t.isSynchronised());
        a.setSubprocessInputs(cloneAssignment(t.getSubprocessInputs()));
        a.setSubprocessOutputs(cloneAssignment(t.getSubprocessOutputs()));
    }

    protected static void setEmailSendingTaskProp(EmailSendingTask a, EmailSendingTask t) {
        a.setSubject(t.getSubject());
        a.setTemplateId(t.getTemplateId());
        a.setTemplate(t.getTemplate());
        a.setReceivers(cloneMessageReceiver(t.getReceivers()));
        a.setVariables(cloneVariable(t.getVariables()));
        a.setAttachments(cloneAttachment(t.getAttachments()));
    }

    protected static void setSMSSendingTaskProp(SMSSendingTask a, SMSSendingTask t) {
        a.setTemplate(t.getTemplate());
        a.setTemplateId(t.getTemplateId());
        a.setReceivers(cloneMessageReceiver(t.getReceivers()));
    }

    protected static void setWaitTaskProp(WaitTask a, WaitTask t) {
        a.setSpecificDuration(t.isSpecificDuration());
        // variable time duration
        if (t.getTimeRule() != null) {
            a.setTimeRule(((Expression) t.getTimeRule()).toExpressionString());
        }
        a.setTimeUnit(t.getTimeUnit());
        // fixed time duration
        a.setLargeDuration(t.getLargeDuration());
        // 0:day; 1:week; 2:fortnight: 3:month; 4:quarter
        a.setLargeDurationUnit(t.getLargeDurationUnit());
        a.setHours(t.getHours());
        a.setMinutes(t.getMinutes());
        a.setSeconds(t.getSeconds());
        a.setMilliseconds(t.getMilliseconds());
    }

    public static MessageReceiver[] cloneMessageReceiver(MessageReceiver[] mr) {
        if (mr != null) {
            if (mr.length > 0) {
                MessageReceiver[] mr1 = new MessageReceiver[mr.length];
                for (int i = 0; i < mr.length; i++) {
                    mr1[i] = new MessageReceiver();
                    mr1[i].setId(mr[i].getId());
                    mr1[i].setName(mr[i].getName());
                    mr1[i].setTaskId(mr[i].getTaskId());
                    mr1[i].setMessageType(mr[i].getMessageType());
                    mr1[i].setReceiverType(mr[i].getReceiverType());
                    mr1[i].setOrganizationId(mr[i].getOrganizationId());
                    mr1[i].setOrganizationName(mr[i].getOrganizationName());
                    mr1[i].setDepartmentId(mr[i].getDepartmentName());
                    mr1[i].setPositionId(mr[i].getPositionId());
                    mr1[i].setUserId(mr[i].getUserId());
                    mr1[i].setUserFullName(mr[i].getUserFullName());
                    mr1[i].setCurrOwner(mr[i].getCurrOwner());
                    mr1[i].setOwner(mr[i].getOwner());
                }
                return mr1;
            }
        }
        return new MessageReceiver[0];
    }

    public static Assignment[] cloneAssignment(Object as) {
        if (as != null) {
            Assignment[] as0 = (Assignment[]) as;
            if (as0.length > 0) {
                Assignment[] as1 = new Assignment[as0.length];
                for (int i = 0; i < as0.length; i++) {
                    as1[i] = new Assignment();
                    as1[i].setId(as0[i].getId());
                    as1[i].setVariableString(as0[i].getVariableString());
                    as1[i].setArrayIndex(as0[i].getArrayIndex());
                    as1[i].setType(as0[i].getType());
                    if (as0[i].getValue() != null)
                        as1[i].setValue(((Expression) as0[i].getValue()).toExpressionString());
                    as1[i].setCurrOwner(as0[i].getCurrOwner());
                    as1[i].setOwner(as0[i].getOwner());
                }
                return as1;
            }
        }
        return new Assignment[0];
    }

    public static Assignment[] uncloneAssignment(Object as) {
        if (as != null) {
            Assignment[] as0 = (Assignment[]) as;
            if (as0.length > 0) {
                Assignment[] as1 = new Assignment[as0.length];
                for (int i = 0; i < as0.length; i++) {
                    as1[i] = new Assignment();
                    as1[i].setId(as0[i].getId());
                    as1[i].setVariableString(as0[i].getVariableString());
                    as1[i].setArrayIndex(as0[i].getArrayIndex());
                    as1[i].setType(as0[i].getType());
                    as1[i].setValue(as0[i].getValue());
                    as1[i].setCurrOwner(as0[i].getCurrOwner());
                    as1[i].setOwner(as0[i].getOwner());
                }
                return as1;
            }
        }
        return new Assignment[0];
    }


    public static Participant[] cloneParticipant(Participant[] pa) {
        if (pa.length > 0) {
            Participant[] pa1 = new Participant[pa.length];
            for (int i = 0; i < pa.length; i++) {
                pa1[i] = new Participant();
                pa1[i].setId(pa[i].getId());
                pa1[i].setName(pa[i].getName());
                pa1[i].setTaskId(pa[i].getTaskId());
                pa1[i].setParticipationType(pa[i].getParticipationType());
                pa1[i].setOrganizationId(pa[i].getOrganizationId());
                pa1[i].setOrganizationName(pa[i].getOrganizationName());
                pa1[i].setDepartmentId(pa[i].getDepartmentId());
                pa1[i].setDepartmentName(pa[i].getDepartmentName());
                pa1[i].setPositionId(pa[i].getPositionId());
                pa1[i].setPositionName(pa[i].getPositionName());
                pa1[i].setUserId(pa[i].getUserId());
                pa1[i].setUserFullName(pa[i].getUserFullName());
                pa1[i].setPriority(pa[i].getPriority());
                pa1[i].setCurrOwner(pa[i].getCurrOwner());
                pa1[i].setOwner(pa[i].getOwner());
            }
            return pa1;
        }
        return new Participant[0];
    }

    public static AccessibleVariable[] cloneAccessibleVariable(AccessibleVariable[] av) {
        if (av.length > 0) {
            AccessibleVariable[] av1 = new AccessibleVariable[av.length];
            for (int i = 0; i < av.length; i++) {
                av1[i] = new AccessibleVariable();
                av1[i].setId(av[i].getId());
                av1[i].setName(av[i].getName());
                av1[i].setTaskId(av[i].getTaskId());
                av1[i].setVarId(av[i].getVarId());
                av1[i].setAccessControl(av[i].getAccessControl());
                av1[i].setComponentId(av[i].getComponentId());
                av1[i].setCurrOwner(av[i].getCurrOwner());
                av1[i].setOwner(av[i].getOwner());
            }
            return av1;
        }
        return new AccessibleVariable[0];
    }

    public static DataVariable cloneDataVariable(TreeNode dv) {
        if (dv instanceof ArrayDataVariable) {
            ArrayDataVariable a = new ArrayDataVariable();
            setArrayDataVariableProp(a, (ArrayDataVariable) dv);
            return a;
        } else {
            DataVariable a = new DataVariable();
            setDataVariableProp(a, (DataVariable) dv);
            return a;
        }
    }

    protected static void setArrayDataVariableProp(ArrayDataVariable a, ArrayDataVariable dv) {
        a.setId(dv.getId());
        a.setName(dv.getName());
        a.setOrderNumber(dv.getOrderNumber());
        a.setDatatype(dv.getDatatype());
        a.setDescription(dv.getDescription());
        a.setCurrOwner(dv.getCurrOwner()); // process
        a.setOwner(dv.getOwner()); // organization ID
        if (dv.getValues() != null) {
            Constant[] values = (Constant[]) dv.getValues();
            if (values.length > 0) {
                String exp = "";
                for (int i = 0; i < values.length; i++) {
                    if (exp == "") {
                        exp = values[i].toExpressionString();
                    } else {
                        exp = exp + "," + values[i].toExpressionString();
                    }
                }
                a.setValues(exp);
            }
        }
    }


    protected static void setDataVariableProp(DataVariable a, DataVariable dv) {
        a.setId(dv.getId());
        a.setName(dv.getName());
        a.setOrderNumber(dv.getOrderNumber());
        a.setDatatype(dv.getDatatype());
        a.setDescription(dv.getDescription());
        a.setCurrOwner(dv.getCurrOwner()); // process ID
        a.setOwner(dv.getOwner()); // organization ID
        if (dv.getValue() != null) {
            a.setValue(((Constant) dv.getValue()).toExpressionString());
        }
    }

    public static Transition cloneTransition(Transition t) {
        Transition a = new Transition();
        setTransitionProp(a, t);
        return a;
    }

    protected static void setTransitionProp(Transition a, Transition t) {
        a.setId(t.getId());
        a.setName(t.getName());
        a.setOrderNumber(t.getOrderNumber());
        a.setStatus(t.getStatus());
        if (t.getSource() != null)
            a.setSource(((AbstractTask) t.getSource()).getId());
        if (t.getTarget() != null)
            a.setTarget(((AbstractTask) t.getTarget()).getId());
        if (t.getNavigationRule() != null) {
            a.setNavigationRule(((Expression) t.getNavigationRule()).toExpressionString());
        }
        if (t.getBendPoint() != null) {
            a.setBendPoint(new Location(t.getBendPoint().getX(), t.getBendPoint().getY()));
        }
        a.setDescription(t.getDescription());
        a.setAlwaysTrue(t.isAlwaysTrue());
        a.setCurrOwner(t.getCurrOwner());
        a.setOwner(t.getOwner());
    }

    public static Object[] cloneVariable(Object[] dvs) {
        if (dvs != null && dvs.length > 0) {
            if (dvs != null && dvs.length > 0) {
                String[] dvariables = new String[dvs.length];
                for (int i = 0; i < dvs.length; i++) {
                    if (dvs[i] instanceof DataVariable)
                        dvariables[i] = ((DataVariable) dvs[i]).getId();
                }
                return dvariables;
            }
        }
        return null;
    }

    public static Object[] cloneAttachment(Object[] attachments) {
        if (attachments != null && attachments.length > 0) {
            String[] attaching = new String[attachments.length];
            for (int i = 0; i < attachments.length; i++) {
                if (attachments[i] instanceof FileConstant) {
                    attaching[i] = (((FileConstant) attachments[i]).toExpressionString());
                }
            }
            return attaching;
        }
        return null;
    }

}
