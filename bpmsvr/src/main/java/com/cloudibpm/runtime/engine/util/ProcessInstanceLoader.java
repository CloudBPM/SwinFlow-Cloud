package com.cloudibpm.runtime.engine.util;

import com.cloud.core.session.redis.JedisUtil;
import com.cloudibpm.blo.runtime.wfprocess.ReleasedWfProcessBlo;
import com.cloudibpm.blo.runtime.wfprocessinstance.ProcessInstanceBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.buildtime.wfprocess.Transition;
import com.cloudibpm.core.buildtime.wfprocess.WfProcessStatus;
import com.cloudibpm.core.buildtime.wfprocess.task.AbstractTask;
import com.cloudibpm.core.runtime.event.Event;
import com.cloudibpm.core.runtime.event.EventLog;
import com.cloudibpm.core.runtime.event.ProcessStatusChangedEvent;
import com.cloudibpm.core.runtime.event.WorkflowEvent;
import com.cloudibpm.core.runtime.util.json.WfProcessInstanceJSONParser;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.core.runtime.wfprocess.task.SubprocessPointInstance;

/**
 * @author Dahai Cao last updated on 20180228
 */
public class ProcessInstanceLoader implements EventLog {

    private final static ProcessInstanceLoader instance = new ProcessInstanceLoader();

    private ProcessInstanceLoader() {
    }

    public static ProcessInstanceLoader getInstance() {
        return instance;
    }

    /**
     * 通过<code>releasedProcessId</code>创建一个新的空的流程实例，
     * 这个流程实例更换了每个对象的ID以及除了状态和启动时间外，不包含任何与流程定义不同的信息。
     *
     * @param releasedProcessId
     * @return
     * @throws Exception
     * @date 2011-8-22 下午12:18:16, last update on 20180228
     */
    public WfProcessInstance createNewInstance(String releasedProcessId) throws Exception {
        WfProcessInstance inst = ReleasedWfProcessBlo.getInstance().getReleasedProcessForRuntime(releasedProcessId);
        inst.setWfProcessId(releasedProcessId);
        inst.setVer(System.currentTimeMillis());
        inst.setStatus(WfProcessStatus.LAUNCHED);
        inst.setLaunchTime(System.currentTimeMillis());
        log(new ProcessStatusChangedEvent(WorkflowEvent.PROCESS_LAUNCHED, inst));
        return inst;
    }

    /**
     * Creates a new subprocess instance according to the <tt>subprocessId</tt>
     * property of the specified <code>subprocessPoint</code> task.
     *
     * @param subprocessPoint
     * @param parent
     * @return WfProcessInstance
     * @throws Exception
     * @date 2011-8-22 下午12:10:07; last updated at 19:47 on 2018-09-08
     */
    public WfProcessInstance createNewSubprocessInstance(SubprocessPointInstance subprocessPoint,
                                                         WfProcessInstance parent) throws Exception {
        String pid = subprocessPoint.getSubprocessId();
        WfProcessInstance inst = ReleasedWfProcessBlo.getInstance().getReleasedSubProcessForRuntime(pid, subprocessPoint);
        inst.setWfProcessId(pid);
        inst.setVer(System.currentTimeMillis());
        inst.setStatus(WfProcessStatus.LAUNCHED);
        inst.setLaunchTime(System.currentTimeMillis());
        log(new ProcessStatusChangedEvent(WorkflowEvent.PROCESS_LAUNCHED, inst));
        if (parent.getCurrOwner() != null) {
            // it means that this is a subprocess
            inst.setCurrOwner(parent.getCurrOwner());
        } else {
            // it means that this is a main process
            inst.setCurrOwner(parent.getId());
        }
        subprocessPoint.addSubprocess(inst);
        subprocessPoint.setSubprocessInstanceId(inst.getId());
        return inst;
    }

    /**
     * 该方法是装在一个现存的过程实例
     *
     * @param processInstanceId
     * @return
     * @throws Exception
     */
    public WfProcessInstance loadExistingInstance(String processInstanceId) throws Exception {
        String value = JedisUtil.getInstance().get(processInstanceId);
        WfProcessInstance inst = WfProcessInstanceJSONParser.parseWfProcessInstance(value);
        return inst;
    }

    public WfProcessInstance loadCompletedInstance(String processInstanceId) throws Exception {
        WfProcessInstance inst = ProcessInstanceBlo.getInstance().getProcessInstance(processInstanceId);
        // 重新初始化过程中所有的任务的状态。以便重新执行，
        // 这里的重新执行，只是在内存中重新执行，但是过程中所有的数据都是可能在变的，
		// 因此，这个过程实际上是一个全新的过程，在数据库中理论上也要存为一个新的过程实例。
		// 未来要把这个问题解决掉！Dahai Cao marked! at 11:42 on 2019-02-23
        for (TreeNode child : inst.getChildren()) {
            if (child instanceof AbstractTask) {
                ((AbstractTask) child).setStatus(AbstractTask.UNUSED);
                for (Transition t : ((AbstractTask) child).getOutputs()) {
                    t.setStatus(Transition.UNUSED);
                }
            }
        }
        return inst;
    }


    @Override
    public void log(Event event) {
        System.out.println(event.toString());
    }

}
