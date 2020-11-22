/**
 *
 */
package com.cloudibpm.runtime.engine.transaction;

import com.cloudibpm.core.buildtime.wfprocess.WfProcessStatus;
import com.cloudibpm.core.buildtime.wfprocess.task.AbstractTask;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.core.runtime.wfprocess.task.SubprocessPointInstance;
import com.cloudibpm.runtime.engine.ATEngine;
import com.cloudibpm.runtime.engine.PEngine;
import com.cloudibpm.runtime.engine.util.ProcessInstanceInitializer;
import com.cloudibpm.runtime.engine.util.ProcessInstanceLoader;
import com.cloudibpm.runtime.engine.util.ProcessInstanceSaver;
import com.cloudibpm.runtime.server.SaaSServer;

import java.util.concurrent.Callable;

/**
 * @author Dahai Cao created on 20/10/2011; last updted at 19:25 on 2018-09-08
 *
 */
public class SubprocessPointTransaction extends AbstractTaskTransaction<SubprocessPointInstance> {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8376974851668130584L;
    private PEngine pengine = null;
    private ATEngine tengine = null;

    public SubprocessPointTransaction(SubprocessPointInstance task, PEngine pengine) {
        super(task, pengine.getInstance());
        this.pengine = pengine;
    }

    @Override
    public void begin() throws Exception {
    }

    protected void begineTask() throws Exception {
        taskInstance.setStartTime(System.currentTimeMillis());
        tengine.handleInputTransitions();
    }

    @Override
    public void rollback() throws Exception {
        if (taskInstance.fetchSubprocess() == null) {
            tengine.getNavigator().navigateBackOutputsForSingleSteping(taskInstance, pengine);
            tengine.updateStatus(taskInstance, AbstractTask.ENABLED);
            // engine.getNavigator().navigateBackInputsForSingleStep(this.pengine);//
            // ???????????? 2018-02-28
        }
    }

    /**
     * @see java.lang.Runnable#run()
     */
    @Override
    public void commit() throws Exception {
        begineTask();
        if (taskInstance.getSubprocessId() != null &&
                !taskInstance.getSubprocessId().trim().toLowerCase().equals("")) {
            if (taskInstance.getSubprocessInstanceId() == null) {
                ProcessInstanceLoader.getInstance().createNewSubprocessInstance(taskInstance, this.getWfProcessInstance());
                ProcessInstanceInitializer.getInstance().initializeSubprocessInputs(taskInstance,
                        getWfProcessInstance());
            } else {
                // 这个子流程应该是没有执行完的，
                WfProcessInstance inst = ProcessInstanceLoader.getInstance().loadExistingInstance(taskInstance.getSubprocessInstanceId());
                if (inst != null) {
                    taskInstance.addSubprocess(inst);
                    ProcessInstanceInitializer.getInstance().initializeSubprocessInputs(taskInstance,
                            getWfProcessInstance());
                }
            }
            ProcessInstanceSaver.getInstance().saveCache(taskInstance.fetchSubprocess());
            if (taskInstance.isSynchronised()) { // 同步
                // Chinese notes: 如果同步，流程不再单独作为一个线程来运行
                // 而是使用子流程任务的所在线程来运行。
                launchSubprocess();
                while (true) {
                    if (taskInstance.fetchSubprocess().getStatus() == WfProcessStatus.COMPLETED) {
                        completeTask();
                        break;
                    } else
                        Thread.sleep(1000);
                }
            } else { // 异步
                lauchAsynSubprocess();
                completeTask();
            }
        }
        taskInstance.setEndTime(System.currentTimeMillis());
    }

    protected void launchSubprocess() throws Exception {
        Callable<WfProcessInstance> launchSubprocess = new PEngine(taskInstance);
        launchSubprocess.call();
    }

    protected void lauchAsynSubprocess() throws Exception {
        SaaSServer.getInstance().getProcessPool().submit(new PEngine(taskInstance));
    }

    protected void completeTask() throws Exception {
        // getProcessInstance().getTaskQueues().getRunningTaskQueue()
        // .remove(getTask());
        if (taskInstance.isSynchronised()) { // 同步
            ProcessInstanceInitializer.getInstance().fetchSubprocessOutputs(taskInstance, getWfProcessInstance());
        }
        this.pengine.getTaskQueues().completeAutoTask(getTaskInstance()); // consume...
        tengine.handleOutputTransitions(); // producing...
    }

    public void setTEngine(ATEngine tengine) {
        this.tengine = tengine;
    }

}
