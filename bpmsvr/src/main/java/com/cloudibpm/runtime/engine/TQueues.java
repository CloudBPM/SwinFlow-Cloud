/**
 * @user Dahai CAO
 * @date 2011-9-2 下午05:25:57
 */
package com.cloudibpm.runtime.engine;

import com.cloudibpm.core.buildtime.wfprocess.task.AbstractTask;
import com.cloudibpm.core.runtime.wfprocess.task.ManualTaskInstance;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * <pre>
 * The following content is same as documents of java.util.concurrent.BlockingQueue<E>. You can read it.
 *
 * Chinese note:<br>
 * <b>BlockingQueue</b>是一种特殊的Queue，若BlockingQueue是空的，从BlockingQueue取东西的操作将会被阻断进入等待状态直到BlocingkQueue进了新货才会被唤醒。同样，如果BlockingQueue是满的任何试图往里存东西的操作也会被阻断进入等待状态， 直到BlockingQueue里有新的空间才会被唤醒继续操作。
 * BlockingQueue提供的方法主要有：
 * <li>add(anObject)：把anObject加到BlockingQueue里，如果BlockingQueue可以容纳返回true，否则抛出IllegalStateException异常。
 * <li>offer(anObject)：把anObject加到BlockingQueue里，如果BlockingQueue可以容纳返回true，否则返回false。
 * <li>put(anObject)：把anObject加到BlockingQueue里，如果BlockingQueue没有空间，调用此方法的线程被阻断直到BlockingQueue里有新的空间再继续。
 * <li>poll(time)：取出BlockingQueue里排在首位的对象，若不能立即取出可等time参数规定的时间。取不到时返回null。
 * <li>take()：取出BlockingQueue里排在首位的对象，若BlockingQueue为空，阻断进入等待状态直到BlockingQueue有新的对象被加入为止。
 *
 * 根据不同的需要BlockingQueue有4种具体实现：
 * （1）ArrayBlockingQueue：规定大小的BlockingQueue，其构造函数必须带一个int参数来指明其大小。其所含的对象是以FIFO（先入先出）顺序排序的。
 * （2）LinkedBlockingQueue：大小不定的BlockingQueue，若其构造函数带一个规定大小的参数，生成的BlockingQueue有大小限制，若不带大小参数，所生成的BlockingQueue的大小由Integer.MAX_VALUE来决定。所含的对象是以FIFO（先入先出）顺序排序的。LinkedBlockingQueue和ArrayBlockingQueue比较起来，它们背后所用的数据结构不一样，导致LinkedBlockingQueue的数据吞吐量要大于ArrayBlockingQueue，<br>但在线程数量很大时其性能的可预见性低于ArrayBlockingQueue。
 * （3）PriorityBlockingQueue：类似于LinkedBlockingQueue，但其所含对象的排序不是FIFO，而是依据对象的自然排序顺序或者是构造函数所带的Comparator决定的顺序。
 * （4）SynchronousQueue：特殊的BlockingQueue，对其的操作必须是放和取交替完成的。
 *
 * 在我们的系统中，工作流引擎是一个单消费者和多生产者的模式，流程线程消费任务，而任务线程生产新任务。
 *
 * </pre>
 *
 * @author cao dahai
 */
public class TQueues implements Cloneable, Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3922596183416348387L;
    // 除非自动任务（手工任务）外，所有其他任务都是自动任务，该队列放置被激活的自动任务
    private final BlockingQueue<AbstractTask> enabledAutoTaskQueue = new LinkedBlockingQueue<AbstractTask>();
    // 该队列放置被激活的非自动任务（手工任务）
    private final BlockingQueue<AbstractTask> enabledManuTaskQueue = new LinkedBlockingQueue<AbstractTask>();
    // 该队列放置正在执行的自动任务
    private final BlockingQueue<AbstractTask> runningAutoTaskQueue = new LinkedBlockingQueue<AbstractTask>();
    // 该队列放置正在执行的非自动任务（手工任务）
    private final BlockingQueue<AbstractTask> runningManuTaskQueue = new LinkedBlockingQueue<AbstractTask>();
    // 该队列放置异常的自动任务
    private final BlockingQueue<AbstractTask> exceptionAutoTaskQueue = new LinkedBlockingQueue<AbstractTask>();
    // 该队列放置异常的非自动任务（手工任务）
    private final BlockingQueue<AbstractTask> exceptionManuTaskQueue = new LinkedBlockingQueue<AbstractTask>();

    private final Queue<AbstractTask> finalTaskQueue = new LinkedList<AbstractTask>();

    // private byte[] lock = new byte[0];

    public TQueues() {
        super();
        try {
            initiateQueue();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    /**
     * Initialises process queues. This method
     *
     * @throws InterruptedException
     */
    private void initiateQueue() throws InterruptedException {
        enabledAutoTaskQueue.clear();
        enabledManuTaskQueue.clear();
        runningAutoTaskQueue.clear();
        runningManuTaskQueue.clear();
        exceptionAutoTaskQueue.clear();
        exceptionManuTaskQueue.clear();
        finalTaskQueue.clear();
    }

    public AbstractTask[] fetchEnabledManualTaskinstances() {
        return enabledManuTaskQueue.toArray(new AbstractTask[enabledManuTaskQueue.size()]);
    }

    public AbstractTask[] fetchRunningManualTaskinstances() {
        return runningManuTaskQueue.toArray(new AbstractTask[runningManuTaskQueue.size()]);
    }

    public boolean isEnabledManualTaskQueueEmpty() {
        return enabledManuTaskQueue.isEmpty();
    }

    public boolean isRunningManualTaskQueueEmpty() {
        return runningManuTaskQueue.isEmpty();
    }
    //
    // public AbstractTask[] getAllRunningTasks() {
    // return runningTaskQueue.toArray(new
    // AbstractTask[enabledTaskQueue.size()]);
    // }
    //
    // public AbstractTask[] getAllCompletedTasks() {
    // return finalTaskQueue.toArray(new AbstractTask[finalTaskQueue.size()]);
    // }
    //
    // public AbstractTask[] getAllTasksOnPath() {
    // List<AbstractTask> alltasks = new ArrayList<AbstractTask>();
    // alltasks.addAll(finalTaskQueue);
    // alltasks.addAll(exceptionTaskQueue);
    // alltasks.addAll(runningTaskQueue);
    // alltasks.addAll(enabledTaskQueue);
    // return alltasks.toArray(new AbstractTask[alltasks.size()]);
    // }

    public void putEnabledManuTask(AbstractTask task) throws InterruptedException {
        enabledManuTaskQueue.put(task);
    }

//    public void returntoEnabledManuTask(AbstractTask task, PEngine pengine) throws Exception {
//        runningManuTaskQueue.remove(task);
//        enabledManuTaskQueue.put(task);
//    }

    public AbstractTask fetchEnabledManuTaskById(String tid) throws Exception {
        for (AbstractTask t : enabledManuTaskQueue) {
            if (t.getId().equals(tid)) {
                enabledManuTaskQueue.remove(t);
                runningManuTaskQueue.put(t);
                return t;
            }
        }
        return null;
    }

    public AbstractTask fetchRunningManuTaskById(String tid, String userId) throws InterruptedException {
        for (AbstractTask t : runningManuTaskQueue) {
            if (t.getId().equals(tid) && ((ManualTaskInstance) t).getSubmitterId() != null
                    && ((ManualTaskInstance) t).getSubmitterId().equals(userId)) {
                return t;
            }
        }
        return null;
    }

    public AbstractTask fetchRunningManuTaskNqId(String tid, String userId) throws InterruptedException {
        for (AbstractTask t : runningManuTaskQueue) {
            if (!t.getId().equals(tid) && ((ManualTaskInstance) t).getSubmitterId() != null
                    && ((ManualTaskInstance) t).getSubmitterId().equals(userId)) {
                return t;
            }
        }
        return null;
    }

    public AbstractTask fetchTopRunningManuTask() throws InterruptedException {
        // only retrieve but not remove the head of this queue
        return runningManuTaskQueue.peek();
    }

    public void putRunningManuTask(AbstractTask task) throws InterruptedException {
        runningManuTaskQueue.put(task);
    }

    public void putRunningAutoTask(AbstractTask task) throws InterruptedException {
        runningAutoTaskQueue.put(task);
    }

    public void putExceptionAutoTask(AbstractTask task) throws InterruptedException {
        exceptionAutoTaskQueue.put(task);
    }

    public void putExceptionManaulTask(AbstractTask task) throws InterruptedException {
        exceptionManuTaskQueue.put(task);
    }

    public void putEnabledAutoTask(AbstractTask task) throws InterruptedException {
        enabledAutoTaskQueue.put(task);
    }

    public void removeEnabledAutoTask(AbstractTask task) {
        if (enabledAutoTaskQueue.contains(task))
            enabledAutoTaskQueue.remove(task);
    }

    public void removeEnabledManuTask(AbstractTask task) {
        if (enabledManuTaskQueue.contains(task))
            enabledManuTaskQueue.remove(task);
    }

    public void removeRunningManuTask(AbstractTask task) {
        if (runningManuTaskQueue.contains(task))
            runningManuTaskQueue.remove(task);
    }

    /**
     * This method is designed to execute the next one step command.
     *
     * @param task
     * @throws InterruptedException
     */
//    public void runAutoTask(AbstractTask task) throws InterruptedException {
//        if (enabledAutoTaskQueue.contains(task)) {
//            enabledAutoTaskQueue.remove(task);
//            runningAutoTaskQueue.put(task);
//        }
//    }

    /**
     * Return whether the three queues (enabled queue, exception queue, and
     * running queue) are empty.
     *
     * @return true or false.
     */
    public boolean isEmpty() {
        return enabledAutoTaskQueue.size() == 0 && exceptionAutoTaskQueue.isEmpty() && runningAutoTaskQueue.isEmpty()
                && enabledManuTaskQueue.size() == 0 && exceptionManuTaskQueue.isEmpty()
                && runningManuTaskQueue.isEmpty();
    }

    /**
     * Fetch a task to run and change its status from
     * {@link AbstractTask#ENABLED} to {@link AbstractTask#RUNNING}.
     *
     * @return
     * @throws InterruptedException
     */
    public AbstractTask runAutoTask() throws InterruptedException {
        AbstractTask task = enabledAutoTaskQueue.take();
        runningAutoTaskQueue.put(task);
        return task;
    }

    public AbstractTask elementAutoTask() throws InterruptedException {
        if (!enabledAutoTaskQueue.isEmpty()) {
            return enabledAutoTaskQueue.element();
        }
        return null;
    }

    /**
     * Fetch a task to run and change its status from
     * {@link AbstractTask#RUNNING} to {@link AbstractTask#EXCEPTION}.
     *
     * @return
     * @throws InterruptedException
     */
    public AbstractTask throwsAutoTask(AbstractTask task) throws InterruptedException {
        runningAutoTaskQueue.remove(task);
        exceptionAutoTaskQueue.put(task);
        return task;
    }

    public AbstractTask throwsManuTask(AbstractTask task) throws InterruptedException {
        runningManuTaskQueue.remove(task);
        exceptionManuTaskQueue.put(task);
        return task;
    }

    /**
     * Fetch a task to run and change its status from
     * {@link AbstractTask#EXCEPTION} to {@link AbstractTask#ENABLED}.
     *
     * @return
     * @throws InterruptedException
     */
    public AbstractTask recoverAutoTask() throws InterruptedException {
        AbstractTask task = exceptionAutoTaskQueue.take();
        enabledAutoTaskQueue.put(task);
        return task;
    }

    public void completeAutoTask(AbstractTask task) {
        if (runningAutoTaskQueue.contains(task)) {
            runningAutoTaskQueue.remove(task);
            finalTaskQueue.offer(task);
        }
    }

    public void completeManuTask(AbstractTask task) {
        if (runningManuTaskQueue.contains(task)) {
            runningManuTaskQueue.remove(task);
            finalTaskQueue.offer(task);
        }
    }

    public AbstractTask rollbackAutoTask(AbstractTask task) throws InterruptedException {
        if (exceptionAutoTaskQueue.contains(task)) {
            exceptionAutoTaskQueue.remove(task);
            enabledAutoTaskQueue.put(task);
        }
        return task;
    }

    public AbstractTask rollbackManuTask(AbstractTask task) throws InterruptedException {
        if (exceptionManuTaskQueue.contains(task)) {
            exceptionManuTaskQueue.remove(task);
            enabledManuTaskQueue.put(task);
        }
        return task;
    }

}
