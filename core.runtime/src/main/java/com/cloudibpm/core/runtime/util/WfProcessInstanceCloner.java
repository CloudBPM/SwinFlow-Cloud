package com.cloudibpm.core.runtime.util;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.buildtime.util.WfProcessCloner;
import com.cloudibpm.core.buildtime.wfprocess.Transition;
import com.cloudibpm.core.buildtime.wfprocess.task.*;
import com.cloudibpm.core.data.variable.ArrayDataVariable;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.core.runtime.wfprocess.task.*;

/**
 * @author Dahai Cao created at 15:02 on 2019-01-15
 */
public class WfProcessInstanceCloner extends WfProcessCloner {
    /**
     * 由于WfProcess instance对象比较内部引用关系比较复杂，特别是具有循环引用的特点，因此无法直接序列化，
     * 尽管我们现在在网上可以发现很多能支持将具有循环引用的对象转换为可序列化JSONObject的工具，
     * 但是仍然不好用。因此我们开发了这个克隆工具，这个工具具有将一个标准的WfProcess instance对象转换为
     * 一个可用JSONObject工具序列化、并存储到MongoDB数据库的、去除了原来对象间循环引用的新对象。
     *
     * @param pi WfProcessInstance
     * @return WfProcessInstance
     * @date Dahai Cao created at 14:44 on 2019-01-15
     */
    public static WfProcessInstance clone(WfProcessInstance pi) {
        WfProcessInstance p = new WfProcessInstance();
        // wf process
        cloneCommonProps(p, pi);
        // released wf process
        cloneCommonRPProps(p, pi);
        // wf process instance
        cloneCommonPIProps(p, pi);
        if (pi.hasChildren()) {
            for (int i = 0; i < pi.getChildren().length; i++) {
                if (pi.getChildren()[i] instanceof AbstractTask) {
                    AbstractTask t = cloneTaskInstance(pi.getChildren()[i]);
                    p.addChild(t);
                    if (((AbstractTask) pi.getChildren()[i]).hasOutputs()) {
                        for (int j = 0; j < ((AbstractTask) pi.getChildren()[i]).getOutputs().length; j++) {
                            t.addOutput(cloneTransitionInstance(((AbstractTask) pi.getChildren()[i]).getOutputs()[j]));
                        }
                    }
                } else if (pi.getChildren()[i] instanceof DataVariable) {
                    p.addChild(cloneDataVariable(pi.getChildren()[i]));
                }
            }
        }
        return p;
    }


    public static void cloneCommonPIProps(WfProcessInstance p, WfProcessInstance pi) {
        p.setLaunchUserId(pi.getLaunchUserId());
        p.setLaunchUser(pi.getLaunchUser());
        p.setMobileNumber(pi.getMobileNumber());
        p.setIdType(pi.getIdType());
        p.setIdNumber(pi.getIdNumber());
        p.setWfProcessId(pi.getWfProcessId());
        p.setVer(pi.getVer());
        p.setLaunchTime(pi.getLaunchTime());
        p.setStartTime(pi.getStartTime());
        p.setSuspensionTime(pi.getSuspensionTime());
        p.setUpdateTime(pi.getUpdateTime());
        p.setTerminationTime(pi.getTerminationTime());
        p.setEndTime(pi.getEndTime());
        p.setDevice(pi.getDevice());
        p.setLatitude(pi.getLatitude());
        p.setLongitude(pi.getLongitude());
        p.setStaffLaunched(pi.getStaffLaunched());
        p.setIpv4(pi.getIpv4());
        p.setIpv6(pi.getIpv6());
        p.setServerIp(pi.getServerIp());
    }

    public static AbstractTask cloneTaskInstance(TreeNode task) {
        AbstractTask t = (AbstractTask) task;
        if (t instanceof StartPointInstance) {
            StartPointInstance a = new StartPointInstance();
            setCommonProp(a, t);
            setStartPointProp(a, (StartPoint) t);
            // runtime props
            a.setStartTime(((StartPointInstance) t).getStartTime());
            a.setEndTime(((StartPointInstance) t).getEndTime());
            a.setDefinitionId(((StartPointInstance) t).getDefinitionId());
            return a;
        } else if (t instanceof EndPointInstance) {
            EndPointInstance a = new EndPointInstance();
            setCommonProp(a, t);
            setEndPointProp(a, (EndPoint) t);
            // runtime props
            a.setStartTime(((EndPointInstance) t).getStartTime());
            a.setEndTime(((EndPointInstance) t).getEndTime());
            a.setDefinitionId(((EndPointInstance) t).getDefinitionId());
            return a;
        } else if (t instanceof ManualTaskInstance) {
            ManualTaskInstance a = new ManualTaskInstance();
            setCommonProp(a, t);
            setManualTaskProp(a, (ManualTask) t);
            // runtime props
            a.setStartTime(((ManualTaskInstance) t).getStartTime());
            a.setEndTime(((ManualTaskInstance) t).getEndTime());
            a.setEnabledTime(((ManualTaskInstance) t).getEnabledTime());
            a.setDefinitionId(((ManualTaskInstance) t).getDefinitionId());
            a.setExpiryDateTime(((ManualTaskInstance) t).getExpiryDateTime());
            a.setAlarmDateTime(((ManualTaskInstance) t).getAlarmDateTime());
            a.setExpiryHandlerInstanceId(((ManualTaskInstance) t).getExpiryHandlerInstanceId());
            a.setPhase(((ManualTaskInstance) t).getPhase());
            a.setSubmitterId(((ManualTaskInstance) t).getSubmitterId());
            a.setSubmitter(((ManualTaskInstance) t).getSubmitter());
            a.setSubmitterIp(((ManualTaskInstance) t).getSubmitterIp());
            a.setPriority(((ManualTaskInstance) t).getPriority());
            String[] cands = ((ManualTaskInstance) t).getCandidates();
            if (cands != null && cands.length > 0) {
                String[] cands1 = new String[cands.length];
                for (int i = 0; i < cands.length; i++) {
                    cands1[i] = cands[i];
                }
                a.setCandidates(cands1);
            }
            String[] invites = ((ManualTaskInstance) t).getInvitations();
            if (invites != null && invites.length > 0) {
                String[] invites1 = new String[invites.length];
                for (int i = 0; i < invites.length; i++) {
                    invites1[i] = invites[i];
                }
                a.setInvitations(invites1);
            }
            return a;
        } else if (t instanceof AssignTask) {
            AssignTaskInstance a = new AssignTaskInstance();
            setCommonProp(a, t);
            a.setAssignments(cloneAssignment(((AssignTaskInstance) t).getAssignments()));
            // runtime props
            a.setStartTime(((AssignTaskInstance) t).getStartTime());
            a.setEndTime(((AssignTaskInstance) t).getEndTime());
            a.setDefinitionId(((AssignTaskInstance) t).getDefinitionId());
            return a;
        } else if (t instanceof SubprocessPointInstance) {
            SubprocessPointInstance a = new SubprocessPointInstance();
            setCommonProp(a, t);
            setSubprocessPointProp(a, (SubprocessPoint) t);
            // runtime props
            a.setStartTime(((SubprocessPointInstance) t).getStartTime());
            a.setEndTime(((SubprocessPointInstance) t).getEndTime());
            a.setDefinitionId(((SubprocessPointInstance) t).getDefinitionId());
            a.setSubprocessInstanceId(((SubprocessPointInstance) t).getSubprocessInstanceId());
            return a;
        } else if (t instanceof SystemTaskInstance) {
            SystemTaskInstance a = new SystemTaskInstance();
            setCommonProp(a, t);
            setSystemTaskProp(a, (SystemTask) t);
            // runtime props
            a.setStartTime(((SystemTaskInstance) t).getStartTime());
            a.setEndTime(((SystemTaskInstance) t).getEndTime());
            a.setDefinitionId(((SystemTaskInstance) t).getDefinitionId());
            return a;
        } else if (t instanceof WaitTaskInstance) {
            WaitTaskInstance a = new WaitTaskInstance();
            setCommonProp(a, t);
            setWaitTaskProp(a, (WaitTask) t);
            // runtime props
            a.setStartTime(((WaitTaskInstance) t).getStartTime());
            a.setEndTime(((WaitTaskInstance) t).getEndTime());
            a.setDefinitionId(((WaitTaskInstance) t).getDefinitionId());
            a.setWaitTime(((WaitTaskInstance) t).getWaitTime());
            a.setProgress(((WaitTaskInstance) t).getProgress());
            return a;
        } else if (t instanceof EmailReceivingTaskInstance) {
            EmailReceivingTaskInstance a = new EmailReceivingTaskInstance();
            setCommonProp(a, t);
            // runtime props
            a.setStartTime(((EmailReceivingTaskInstance) t).getStartTime());
            a.setEndTime(((EmailReceivingTaskInstance) t).getEndTime());
            a.setDefinitionId(((EmailReceivingTaskInstance) t).getDefinitionId());
            return a;
        } else if (t instanceof EmailSendingTaskInstance) {
            EmailSendingTaskInstance a = new EmailSendingTaskInstance();
            setCommonProp(a, t);
            setEmailSendingTaskProp(a, (EmailSendingTask) t);
            // runtime props
            a.setStartTime(((EmailSendingTaskInstance) t).getStartTime());
            a.setEndTime(((EmailSendingTaskInstance) t).getEndTime());
            a.setDefinitionId(((EmailSendingTaskInstance) t).getDefinitionId());
            return a;
        } else if (t instanceof SMSSendingTaskInstance) {
            SMSSendingTaskInstance a = new SMSSendingTaskInstance();
            setCommonProp(a, t);
            setSMSSendingTaskProp(a, (SMSSendingTask) t);
            // runtime props
            a.setStartTime(((SMSSendingTaskInstance) t).getStartTime());
            a.setEndTime(((SMSSendingTaskInstance) t).getEndTime());
            a.setDefinitionId(((SMSSendingTaskInstance) t).getDefinitionId());
            return a;
        } else if (t instanceof SMSReceivingTaskInstance) {
            SMSReceivingTaskInstance a = new SMSReceivingTaskInstance();
            setCommonProp(a, t);
            // runtime props
            a.setStartTime(((SMSReceivingTaskInstance) t).getStartTime());
            a.setEndTime(((SMSReceivingTaskInstance) t).getEndTime());
            a.setDefinitionId(((SMSReceivingTaskInstance) t).getDefinitionId());
            return a;
        }
        return null;
    }

    public static DataVariable cloneDataVariable(TreeNode dv) {
        if (dv instanceof ArrayDataVariable) {
            ArrayDataVariable a = new ArrayDataVariable();
            setArrayDataVariableProp(a, (ArrayDataVariable) dv);
            a.setDefinitionId(((DataVariable) dv).getDefinitionId());
            return a;
        } else {
            DataVariable a = new DataVariable();
            setDataVariableProp(a, (DataVariable) dv);
            a.setDefinitionId(((DataVariable) dv).getDefinitionId());
            return a;
        }
    }

    public static Transition cloneTransitionInstance(Transition t) {
        TransitionInstance a = new TransitionInstance();
        setTransitionProp(a, t);
        // runtime props
        a.setDefinitionId(((TransitionInstance) t).getDefinitionId());
        return a;
    }

}
