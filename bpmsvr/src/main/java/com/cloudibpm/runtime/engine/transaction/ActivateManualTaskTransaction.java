/**
 *
 */
package com.cloudibpm.runtime.engine.transaction;

import com.cloudibpm.core.buildtime.wfprocess.WfProcessStatus;
import com.cloudibpm.core.buildtime.wfprocess.task.TaskStatus;
import com.cloudibpm.core.runtime.wfprocess.task.ManualTaskInstance;
import com.cloudibpm.core.runtime.wfprocess.task.ManualTaskInstancePhase;
import com.cloudibpm.runtime.engine.PEngine;
import com.cloudibpm.runtime.engine.util.NotificationPusher;
import com.cloudibpm.runtime.engine.util.TaskInstanceStarter;

/**
 * @author Caodahai created on 2016-11-05, last updated on 2018-03-07
 *
 */
public class ActivateManualTaskTransaction extends AbstractTaskTransaction<ManualTaskInstance> {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1925583170755963684L;
    // private String tempId = null;
    private PEngine pengine = null;

    public ActivateManualTaskTransaction(ManualTaskInstance task, PEngine pengine) {
        super(task, pengine.getInstance());
        this.pengine = pengine;
    }

    @Override
    public void begin() throws Exception {
        taskInstance.setPhase(ManualTaskInstancePhase.WAIT_FOR_FETCHING);
        // 计算办理期限时间（毫秒）。
        if (taskInstance.getExpiryDateTime() == -1) {
            taskInstance.setExpiryDateTime(-1);// 这里不应该是-1，应该是一个长整型数字
        }
        if (taskInstance.getAlarmDateTime() == -1) {
            taskInstance.setAlarmDateTime(-1);// 这里不应该是-1，应该是一个长整型数字
        }
        // 推送消息。
        String[] candits = taskInstance.getCandidates();
        String userids = "";
        if (candits != null && candits.length > 0) {
            for (int i = 0; i < candits.length; i++) {
                String [] itms = candits[i].split("@");
                // itms[1] user ID, itms[2] is priority
                if (userids.equals("")) {
                    userids = itms[1] + "@" + itms[2] + "@" + this.taskInstance.getId();
                } else {
                    userids = userids + "#" + itms[1] + "@" + itms[2] + "@" + this.taskInstance.getId();
                }
            }
            NotificationPusher.pushMessage(userids, "1");
        }
    }

    @Override
    public void commit() throws Exception {
        while (taskInstance.getPhase() == ManualTaskInstancePhase.WAIT_FOR_FETCHING) {
            //System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>5");
            if (taskInstance.getExpiryDateTime() != -1
                    && taskInstance.getExpiryDateTime() < System.currentTimeMillis()) {
                // 在这里启动异常处理流程，或者让任务进入异常状态
                taskInstance.setStatus(TaskStatus.EXCEPTION);
                // 导致流程也进入挂起状态。
                this.pengine.getInstance().setStatus(WfProcessStatus.SUSPENDED);
                taskInstance.setLastupdate(System.currentTimeMillis());
                throw new Exception("任务执行超时未打开");
            }
            Thread.sleep(1000);
        }
        if (taskInstance.getPhase() == ManualTaskInstancePhase.FETCHED_BUT_NOT_SUBMIT) {// 任务已经被打开了，则启动非自动任务实例执行线程。
            TaskInstanceStarter.getInstance().runManuTaskInstanceForward(taskInstance, pengine);
        }
    }

    @Override
    public void rollback() throws Exception {
    }

}
