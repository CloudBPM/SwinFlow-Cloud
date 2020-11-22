/**
 *
 */
package com.cloudibpm.runtime.server;

import com.cloud.core.session.redis.JedisUtil;
import com.cloudibpm.blo.runtime.server.BPMSeverInfoBlo;
import com.cloudibpm.blo.user.UserProfileBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.buildtime.wfprocess.task.AbstractTask;
import com.cloudibpm.core.buildtime.wfprocess.task.TaskStatus;
import com.cloudibpm.core.data.expression.ExpressionParser;
import com.cloudibpm.core.data.variable.ArrayDataVariable;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.runtime.admin.AdminSearchResult;
import com.cloudibpm.core.runtime.server.ServerInfoDescriptor;
import com.cloudibpm.core.runtime.util.json.FormDataLoader;
import com.cloudibpm.core.runtime.util.json.WfProcessInstance2JSON;
import com.cloudibpm.core.runtime.util.json.WfProcessInstanceJSONParser;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.core.runtime.wfprocess.task.ManualTaskInstance;
import com.cloudibpm.core.runtime.workitem.WorkitemInfoDescriptor;
import com.cloudibpm.core.user.User;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.runtime.cache.LogCache;
import com.cloudibpm.runtime.engine.IDEngine;
import com.cloudibpm.runtime.engine.LogEngine;
import com.cloudibpm.runtime.engine.PEngine;
import com.cloudibpm.runtime.engine.util.ProcessInstanceInitializer;
import com.cloudibpm.runtime.engine.util.ProcessInstanceLoader;
import com.cloudibpm.runtime.server.concurrent.ProcessEngineThreadPool;
import com.cloudibpm.runtime.server.concurrent.TransactionEnginThreadPool;
import org.json.JSONObject;

import java.net.InetAddress;
import java.util.*;
import java.util.concurrent.Callable;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * @author Dahai Cao created on 2018-01-31
 *
 */
public class SaaSServer implements java.io.Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7955271160150513927L;
    private final static SaaSServer instance = new SaaSServer();
    private IDEngine idEngine = null;
    private LogEngine logEngine = null;
    private ThreadPoolExecutor pEnginPool = null;
    private ThreadPoolExecutor tEnginPool = null;
    private final LogCache logCache = new LogCache();
    public final Map<String, Callable<WfProcessInstance>> activePThreads =
            Collections.synchronizedMap(new HashMap<>());
    // This status of this BPM server. 0: off; 1: on; 2: paused
    private int status = 0;
    // This status represents whether BPM server can accept new request.
    private int acceptable = 0;

    /**
     *
     */
    private SaaSServer() {
    }

    public static SaaSServer getInstance() {
        return instance;
    }

    public ServerInfoDescriptor getServerInfo() throws Exception {
        //ServerInfoDescriptor desc = SysInfoUtil.getProps();
//		if (pEnginPool != null) {
//			desc.setPePoolSize(pEnginPool.getPoolSize());
//			desc.setPeMaxPoolSize(pEnginPool.getMaximumPoolSize());
//			desc.setPeCompleted(pEnginPool.getCompletedTaskCount());
//			desc.setPeRunning(pEnginPool.getActiveCount());
//			desc.setPeQueuing(pEnginPool.getQueue().size());
//		}
//		if (tEnginPool != null) {
//			desc.setTePoolSize(tEnginPool.getPoolSize());
//			desc.setTeMaxPoolSize(tEnginPool.getMaximumPoolSize());
//			desc.setTeCompleted(tEnginPool.getCompletedTaskCount());
//			desc.setTeRunning(tEnginPool.getActiveCount());
//			desc.setTeQueuing(tEnginPool.getQueue().size());
//		}
        return new ServerInfoDescriptor();
    }

    /**
     * Power off this server. That means this server will stop accept all
     * services on this server and then
     */
    public void powerOff() throws Exception {
        setStatus(0);
        // core services
        // complete all process instances...

        // if all done, do the following...
        if (tEnginPool != null) {
            tEnginPool.shutdown();
        }
        for (Map.Entry<String, Callable<WfProcessInstance>> callableEntry : activePThreads.entrySet()) {
            PEngine engine = (PEngine) callableEntry.getValue();
            if (engine.getStop() == 0) {//将过程中的stop设置为停止，跳出线程
                engine.setStop(1);
                //对redis中的数据进行更新
                String id = engine.getId();
                JedisUtil.getInstance().del("TPROCESS_" + id);
                String processInstance = WfProcessInstance2JSON.toJSON(engine.getInstance());
                JedisUtil.getInstance().set("TPROCESS_" + id, processInstance);
            }
        }
        if (pEnginPool != null) {
            pEnginPool.shutdown();
        }
        pEnginPool = null;
        tEnginPool = null;
        // additive services
        idEngine.setCommand(0);// stop ID engine.
        logEngine.setCommand(0);// stop ID engine.
        idEngine = null;
        logEngine = null;
        System.out.println("BPM services stopped.");
    }

    public void restart() throws Exception {
        powerOff();
        powerOn();
    }

    public void pause() throws Exception {
        System.out.println("BPM services paused.");
    }

    public void powerOn() throws Exception {
        // additive services
        if (logEngine == null) {
            logEngine = new LogEngine();
            logEngine.setCommand(1);
            new Thread(logEngine).start();
        }
        if (idEngine == null) {
            idEngine = new IDEngine();
            idEngine.setCommand(1);
            new Thread(idEngine).start();
        }
        // core services
        BPMSeverInfoBlo.getInstance().regServer(getServerInfo());
        if (pEnginPool == null) {
            pEnginPool = new ProcessEngineThreadPool(0, Integer.MAX_VALUE, 60L, TimeUnit.SECONDS,
                    new SynchronousQueue<Runnable>());
        }
        if (tEnginPool == null) {
            tEnginPool = new TransactionEnginThreadPool(0, Integer.MAX_VALUE, 60L, TimeUnit.SECONDS,
                    new SynchronousQueue<Runnable>());
        }
        // load process instance from Redis
        Set<String> keySet = JedisUtil.getInstance().Keys("TPROCESS_*");
        if (keySet.size() > 0) {
            Iterator<String> iterator = keySet.iterator();
            while (iterator.hasNext()) {
                String key = iterator.next();
                String value = JedisUtil.getInstance().get(key);
                WfProcessInstance wfProcessInstance = WfProcessInstanceJSONParser.parseWfProcessInstance(value);
                ExpressionParser.parseExpressions(wfProcessInstance);
                PEngine engine = new PEngine(wfProcessInstance, true);
                activePThreads.put(engine.getId(), engine);
                pEnginPool.submit(engine);
                JedisUtil.getInstance().del("TPROCESS_" + wfProcessInstance.getId());
            }
        } else {

        }
        System.out.println("BPM services started.");
    }

    // APIs
    public AdminSearchResult[] search(String oid, String cond1,
                                      String cond2, String cond3,
                                      String cond4) throws Exception {
        if (pEnginPool != null) {
            return getAllInstances(oid, cond1, cond2, cond3, cond4);
        }
        return null;
    }


    // search app APIs
    public AdminSearchResult[] searchApp(String pid, String cond1,
                                         String cond2, String cond3, String cond4) throws Exception {
        if (pEnginPool != null) {
            List<AdminSearchResult> list = new ArrayList<AdminSearchResult>();
            synchronized (activePThreads) {
                for (String id : activePThreads.keySet()) {
                    PEngine engine = (PEngine) activePThreads.get(id);
                    if (engine != null) {
                        WfProcessInstance inst = engine.getInstance();
                        if (inst.getWfProcessId().equals(pid)) {
                            if (search(inst, cond1, cond2, cond3, cond4)) {
                                list.add(createAdminSearchResult(inst));
                            }
                        }
                    }
                }
            }
            return list.toArray(new AdminSearchResult[list.size()]);
        }
        return new AdminSearchResult[0];
    }

    // search all instances APIs
    public AdminSearchResult[] getAllInstances(String oid, String cond1,
                                               String cond2, String cond3, String cond4) throws Exception {
        if (pEnginPool != null) {
            List<AdminSearchResult> list = new ArrayList<AdminSearchResult>();
            synchronized (activePThreads) {
                for (String id : activePThreads.keySet()) {
                    PEngine engine = (PEngine) activePThreads.get(id);
                    if (engine != null) {
                        WfProcessInstance inst = engine.getInstance();
                        if (oid.equals(inst.getOwner())) {
                            if (search(inst, cond1, cond2, cond3, cond4)) {
                                list.add(createAdminSearchResult(inst));
                            }
                        }
                    }
                }
            }
            return list.toArray(new AdminSearchResult[list.size()]);
        } else
            return new AdminSearchResult[0];
    }

    private boolean search(WfProcessInstance inst, String cond1,
                           String cond2, String cond3, String cond4) throws Exception {
        if (cond1 == null)
            cond1 = "";
        if (cond2 == null)
            cond2 = "";
        if (cond3 == null)
            cond3 = "";
        if (cond4 == null)
            cond4 = "";
        // 条件1：输入文本框
        boolean f = false;
        if (!cond1.trim().equals("")) {
            if (cond1.indexOf(" ") > 0) {
                String[] conds = cond1.split(" ");
                for (int i = 0; i < conds.length; i++) {
                    if (inst.getName().contains(conds[i])
                            || inst.getLaunchUser().contains(conds[i])
                            || inst.getIdNumber().contains(conds[i])
                            || inst.getMobileNumber().contains(conds[i])
                            || searchProcessVars(inst, conds[i])) {
                        f = true;
                        break;
                    }
                }
            } else {
                if (inst.getName().contains(cond1)
                        || inst.getLaunchUser().contains(cond1)
                        || inst.getIdNumber().contains(cond1)
                        || inst.getMobileNumber().contains(cond1)
                        || searchProcessVars(inst, cond1)) {
                    f = true;
                }
            }
        } else {
            f = true;
        }
        // 条件2：过程状态
        boolean f1 = false;
        if (!cond2.equals("")) {
            if (cond2.equals("5")) {
                if (inst.getStatus() == 5) {
                    f1 = true;
                }
            } else if (cond2.equals("6")) {
                if (inst.getStatus() == 6) {
                    f1 = true;
                }
            } else {
                f1 = true;
            }
        } else
            f1 = true;
        // 条件3：起始时间
        boolean f2 = false;
        // 条件4：结束时间
        boolean f3 = false;
        if (cond3.equals("") && cond4.equals("")) {
            f2 = true;
            f3 = true;
        } else if (!cond3.equals("") && cond4.equals("")) {
            Date fromDate = DateUtility.parseDatetime(cond3);
            if (fromDate.getTime() <= inst.getLaunchTime()) {
                f2 = true;
                f3 = true;
            }
        } else if (cond3.equals("") && !cond4.equals("")) {
            Date toDate = DateUtility.parseDatetime(cond4);
            if (toDate.getTime() >= inst.getLaunchTime()) {
                f2 = true;
                f3 = true;
            }
        } else if (!cond3.equals("") && !cond4.equals("")) {
            Date fromDate = DateUtility.parseDatetime(cond3);
            Date toDate = DateUtility.parseDatetime(cond4);
            if (fromDate.getTime() <= inst.getLaunchTime()
                    && toDate.getTime() >= inst.getLaunchTime()) {
                f2 = true;
                f3 = true;
            }
        }
        if (f && f1 && f2 && f3)
            return true;
        return false;
    }

    private boolean searchProcessVars(WfProcessInstance inst, String cond) {
        TreeNode[] children = inst.getChildren();
        for (int i = 0; i < children.length; i++) {
            if (children[i] instanceof ArrayDataVariable) {

            } else if (children[i] instanceof DataVariable) {
                if (((DataVariable) children[i]).getDatatype().equals("String")) {
                    if (((DataVariable) children[i]).getValue() != null &&
                            ((DataVariable) children[i]).getValue().toString().contains(cond)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private AdminSearchResult createAdminSearchResult(WfProcessInstance inst) {
        AdminSearchResult r = new AdminSearchResult();
        r.setInstanceId(inst.getId());
        r.setDefinitionId(inst.getWfProcessId());
        r.setProcessName(inst.getName());
        r.setProcessVersion(inst.getVersion());
        r.setStatus(inst.getStatus());
        r.setLauncher(inst.getLaunchUser());
        r.setIdType(inst.getIdType());
        r.setIdNumber(inst.getIdNumber());
        r.setStartTime(inst.getStartTime());
        r.setSuspensionTime(inst.getSuspensionTime());
        r.setUpdateTime(inst.getUpdateTime());
        r.setServer(inst.getServerIp());
        return r;
    }

    public WfProcessInstance getInstanceByID(String id) {
        synchronized (activePThreads) {
            if (activePThreads.containsKey(id))
                return ((PEngine) activePThreads.get(id)).getInstance();
        }
        return null;
    }

    /**
     * @return the status
     */
    public int getStatus() {
        return status;
    }

    /**
     * @param status
     *            the status to set
     */
    public void setStatus(int status) {
        this.status = status;
    }

    /**
     * @return the acceptable
     */
    public int getAcceptable() {
        return acceptable;
    }

    /**
     * @param acceptable
     *            the acceptable to set
     */
    public void setAcceptable(int acceptable) {
        this.acceptable = acceptable;
    }

    public String sendRequest(Object obj) {
        return null;
    }

    public Object fetchResponse() {
        return null;

    }

    public ThreadPoolExecutor getTransactionPool() {
        return tEnginPool;
    }

    public ThreadPoolExecutor getProcessPool() {
        return pEnginPool;
    }

    /**
     *
     * @param pid
     *            process instance object
     * @param userid
     *            the user object which launches this process instance
     * @param timestamp
     *            client time stamp
     * @param ipv4
     *            IP v4 address
     * @param ipv6
     *            IP v6 address
     * @param longitude
     * @param latitude
     * @param device
     *            the device which launches the process instance
     * @param paramvalues
     *            the parameters
     * @return String
     * @throws Exception
     */
    public WfProcessInstance launch(String pid, String userid,
                                    String ipv4, String ipv6,
                                    String longitude, String latitude,
                                    String device, Map<String, Object> paramvalues) throws Exception {
        // put into thread pool for running ...
        WfProcessInstance instance = null;
        if (pEnginPool != null) {
            // verifying ...
            User usr = null;
            if (userid != null) {
                usr = UserProfileBlo.getInstance().getUserById(userid);
            }
            InetAddress addr = InetAddress.getLocalHost();
            if (ipv4 != null) {
                // if (ipv4 != null) {
                // check whether IP address is in a specified range
                // }
            }
            if (ipv6 != null) {
                // if (ipv6 != null) {
                // check whether IP address is in a specified range
                // }
            }

            //if (pid.length() == 16) { // process definition ID
            if(pid.startsWith("B")||pid.length()==16){
                //long s = System.currentTimeMillis();
                instance = ProcessInstanceLoader.getInstance().createNewInstance(pid);
                //System.out.println("Create instance>>>>>>>>>>>>>>>:" + (System.currentTimeMillis() - s) + "ms");
                // initializing （将初始化数据写入流程变量）
                instance.setServerIp(addr.getHostAddress());
                if (UserProfileBlo.getInstance().checkUserStaff(userid, instance.getOwner())) {
                    instance.setStaffLaunched(1);
                }
                ProcessInstanceInitializer.getInstance().initialize(instance, usr, ipv4,
                        ipv6, addr.getHostAddress(), longitude, latitude, device, paramvalues);
            } else if (pid.startsWith("A")||pid.length() == 32) { // process instance ID
                instance = ProcessInstanceLoader.getInstance().loadCompletedInstance(pid);
                // initializing （将初始化数据写入流程变量）
                ProcessInstanceInitializer.getInstance().reinitialize(instance, usr, ipv4, ipv6,
                        addr.getHostAddress(), longitude, latitude, device, paramvalues);
            }
            PEngine engine = new PEngine(instance, false);
            activePThreads.put(engine.getId(), engine);
            pEnginPool.submit(engine);
            return instance;
        }
        return null;
    }

    // public boolean processInstanceCompleted(String pid) throws Exception {
    // synchronized (activePThreads) {
    // return !activePThreads.containsKey(pid);
    // }
    // }

    // created on 2018-02-14
    // unused so far on 2018-02-14
    public String launchByUserMobile(String rpid, String usermobile, long timestamp, String ipv4, String ipv6,
                                     String longitude, String latitude, String device) throws Exception {
        return "0";
    }

    // created on 2018-02-14
    // unused so far on 2018-02-14
    public String launchByUserEmail(String rpid, String useremail, long timestamp, String ipv4, String ipv6,
                                    String longitude, String latitude, String device) throws Exception {
        return "0";
    }

    // get all work items from current server.
    public WorkitemInfoDescriptor[] fetchManualTaskInstances(
            String userId, String userfullname,
            String staffids, String cond, String qtype) throws Exception {
        // 在这里可以加上大数据支持，做推荐和预测。根据用户以往所做的工作，来推荐工作，
        // 并预测用户的工作偏好, 还可以以及根据任务的特征，对任务进行优先级排序。
        // 当然这需要高性能的推荐算法和大量数据支持。
        String[] staffIds = null;
        if (staffids.indexOf("|") > 0) {
            String s2 = staffids.substring(0, staffids.indexOf("|"));
            String s3 = staffids.substring(staffids.indexOf("|") + 1, staffids.length());
            staffIds = new String[]{s2, s3};
            //staffIds = staffids.split("|");
        } else
            staffIds = new String[]{staffids};
        List<WorkitemInfoDescriptor> list = new ArrayList<WorkitemInfoDescriptor>();
        synchronized (activePThreads) {
            for (String id : activePThreads.keySet()) {
                PEngine engine = (PEngine) activePThreads.get(id);
                synchronized (engine.getTaskQueues()) {
                    if (!engine.getTaskQueues().isEnabledManualTaskQueueEmpty()) {
                        //System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PPPPP");
                        for (AbstractTask child : engine.getTaskQueues().fetchEnabledManualTaskinstances()) {
                            ManualTaskInstance ti = (ManualTaskInstance) child;
                            if (ti.getCandidates() != null && ti.getCandidates().length > 0) {
                                boolean f = false;
                                // 0: low priority(normal);
                                // 1: medium priority(important);
                                // 2: high priority(urgent);
                                String priority = "0";
                                for (int i = 0; i < staffIds.length; i++) {
                                    for (int j = 0; j < ti.getCandidates().length; j++) {
                                        String[] stfs = ti.getCandidates()[j].split("@");
                                        if (stfs[0].equals(staffIds[i])) {
                                            f = true;
                                            priority = stfs[4];// priority
                                            break;
                                        }
                                    }
                                }
                                if (f) {
                                    // 这里是根据职位来获取工作列表，凡是设置了相关职位的人都能看到该任务实例，因此不指定执行人
                                    list.add(getWorkitemInfoDescriptor(ti, engine.getInstance(), "", "", priority));
                                }
                            } else {
                                if (ti.getSubmitterId() != null && ti.getSubmitterId().equals(userId)) {
                                    // 如果指定由某人来做，肯定是紧急的工作，最高优先级的工作，所以是2.
                                    list.add(getWorkitemInfoDescriptor(ti, engine.getInstance(), userId, userfullname,
                                            String.valueOf(ti.getPriority())));
                                }
                            }
                        }
                    }
                    if (!engine.getTaskQueues().isRunningManualTaskQueueEmpty()) {
                        //System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>QQQQQ");
                        for (AbstractTask child : engine.getTaskQueues().fetchRunningManualTaskinstances()) {
                            ManualTaskInstance ti = (ManualTaskInstance) child;
                            if (ti.getStatus() == TaskStatus.RUNNING) {
                                if (ti.getSubmitterId() != null && ti.getSubmitterId().equals(userId)) {
                                    list.add(getWorkitemInfoDescriptor(ti, engine.getInstance(), userId, userfullname,
                                            String.valueOf(ti.getPriority())));
                                }
                            }
                        }
                    }
                }
                if (list.isEmpty())
                    return new WorkitemInfoDescriptor[0];
            }
        }
        if (qtype.equals("0")) { // Today's general and important tasks
            List<WorkitemInfoDescriptor> list0 = new ArrayList<WorkitemInfoDescriptor>();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(new Date());
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            Date todaystart = calendar.getTime();
            Calendar calendar1 = Calendar.getInstance();
            calendar1.set(Calendar.HOUR_OF_DAY, 23);
            calendar1.set(Calendar.MINUTE, 59);
            calendar1.set(Calendar.SECOND, 59);
            calendar1.set(Calendar.MILLISECOND, 999);
            Date todayend = calendar1.getTime();
            for (int i = 0; i < list.size(); i++) {
                if (list.get(i).getTaskInstanceStatus() == 1 ||
                        list.get(i).getTaskInstanceStatus() == 2) {
                    if (list.get(i).getTaskInstanceEnabledDateTime() > todaystart.getTime() &&
                            list.get(i).getTaskInstanceEnabledDateTime() < todayend.getTime()) {
                        if (!list.get(i).getPriority().equals("2")) {
                            list0.add(list.get(i));// Today's general and important tasks
                        }
                    }
                }
            }
            return list0.toArray(new WorkitemInfoDescriptor[list0.size()]);
        } else if (qtype.equals("1")) {// Today's urgent tasks
            List<WorkitemInfoDescriptor> list1 = new ArrayList<WorkitemInfoDescriptor>();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(new Date());
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            Date todaystart = calendar.getTime();
            Calendar calendar1 = Calendar.getInstance();
            calendar1.set(Calendar.HOUR_OF_DAY, 23);
            calendar1.set(Calendar.MINUTE, 59);
            calendar1.set(Calendar.SECOND, 59);
            calendar1.set(Calendar.MILLISECOND, 999);
            Date todayend = calendar1.getTime();
            for (int i = 0; i < list.size(); i++) {
                if (list.get(i).getTaskInstanceStatus() == 1 ||
                        list.get(i).getTaskInstanceStatus() == 2) {
                    if (list.get(i).getTaskInstanceEnabledDateTime() > todaystart.getTime() &&
                            list.get(i).getTaskInstanceEnabledDateTime() < todayend.getTime()) {
                        if (list.get(i).getPriority().equals("2")) {
                            list1.add(list.get(i));// Today's urgent tasks
                        }
                    }
                }
            }
            return list1.toArray(new WorkitemInfoDescriptor[list1.size()]);
        } else if (qtype.equals("2")) {// This week all tasks
            Calendar calendar = Calendar.getInstance();
            calendar.set(Calendar.DATE, calendar.get(Calendar.DATE) - calendar.get(Calendar.DAY_OF_MONTH) + 1);
            long weekstart = calendar.getTime().getTime();
            Calendar calendar1 = Calendar.getInstance();
            calendar.set(Calendar.DATE, calendar.get(Calendar.DATE) + (6 - calendar.get(Calendar.DAY_OF_MONTH) + 1));
            long weekend = calendar1.getTime().getTime();
            List<WorkitemInfoDescriptor> list2 = new ArrayList<WorkitemInfoDescriptor>();
            for (int i = 0; i < list.size(); i++) {
                if (list.get(i).getTaskInstanceStatus() == 1 ||
                        list.get(i).getTaskInstanceStatus() == 2) {
                    if (list.get(i).getTaskInstanceEnabledDateTime() > weekstart &&
                            list.get(i).getTaskInstanceEnabledDateTime() < weekend) {
                        list2.add(list.get(i));
                    }
                }
            }
            return list2.toArray(new WorkitemInfoDescriptor[list2.size()]);
        }
        return list.toArray(new WorkitemInfoDescriptor[list.size()]);
    }

    /**
     * 生成工作项对象。其中getit参数指的是，工作项列表中，不获取表单数据。
     * 而在打开工作项时候，则获取表单数据。不获取表达数据是为了提高性能，因为表单可能很大。
     *
     * @param ti
     *            ManualTaskInstance
     * @param inst
     *            WfProcessInstance
     * @param userfullname
     * @param priority
     *            String, 0: low priority(normal); 1: medium
     *            priority(important); 2: high priority(urgent);
     * @return
     */

    private WorkitemInfoDescriptor getWorkitemInfoDescriptor(ManualTaskInstance ti,
                                                             WfProcessInstance inst,
                                                             String userId,
                                                             String userfullname,
                                                             String priority) {
        WorkitemInfoDescriptor w = new WorkitemInfoDescriptor();
        w.setId(ti.getId());
        w.setName(ti.getName());
        w.setPriority(priority);
        w.setTaskInstanceStatus(ti.getStatus());
        w.setSubmitterId(userId);
        w.setSubmitterName(userfullname);
        w.setWfProcessId(inst.getWfProcessId());
        w.setWfProcessInstanceId(inst.getId());
        w.setWfProcessInstanceName(inst.getName());
        w.setLaunchDateTime(inst.getLaunchTime());
        w.setTaskInstanceEnabledDateTime(ti.getEnabledTime());
        w.setTaskInstanceStartDateTime(ti.getStartTime());
        w.setTaskInstanceDateTimeLimit(ti.getExpiryDateTime());
        w.setTaskInstanceAlarmDateTime(ti.getAlarmDateTime());
        w.setLaunchUserId(inst.getLaunchUserId());
        w.setLaunchUserName(inst.getLaunchUser());
        w.setLaunchUserIdType(1);
        w.setLaunchUserIdNumber(inst.getIdNumber());
        w.setServerIp("localhost");
        w.setWfProcessAccessLevel(inst.getAccessLevel());
        w.setWorkflowType(inst.getWorkflowType());
        w.setWfProcessType(inst.getProcessType());
        return w;
    }

    public WorkitemInfoDescriptor fetchManualTaskInstanceforMWf(String pInstId,
                                                                String taskInstId,
                                                                String userId,
                                                                String userIp,
                                                                int priority, String ufullname) throws Exception {
        synchronized (activePThreads) {
            PEngine engine = (PEngine) activePThreads.get(pInstId);
            WorkitemInfoDescriptor w = new WorkitemInfoDescriptor();
            if (engine != null) {
                ManualTaskInstance ti = engine.fetchManualTaskInstanceforMWf(taskInstId, userId, userIp, priority, ufullname);
                // 解析表单（Form）并预装数据到表单。
                if (ti != null) {
                    //w.setFormContent(FormDataLoader.parseJSONtoLoadData(ti.getFormContent(), engine.getInstance()));
                    w.setFormContent(FormDataLoader.parseJSON2LoadData((JSONObject) ti.getFormContent(), engine.getInstance()));
                }
            }
            return w;
        }
    }

    public WorkitemInfoDescriptor fetchManualTaskInstanceforSWf(String pInstId,
                                                                String tid,
                                                                String userId,
                                                                String userIp,
                                                                String fullname) throws Exception {
        synchronized (activePThreads) {
            PEngine engine = (PEngine) activePThreads.get(pInstId);
            if (engine != null) {
                ManualTaskInstance ti = engine.fetchManualTaskInstanceforSWf(pInstId, tid, userId, userIp, fullname);
                WorkitemInfoDescriptor w = new WorkitemInfoDescriptor();
                // 解析表单（Form）并预装数据到表单。
                if (ti != null) {
                    w.setId(ti.getId());
                    //w.setFormContent(FormDataLoader.parseJSONtoLoadData(ti.getFormContent(), engine.getInstance()));
                    w.setFormContent(FormDataLoader.parseJSON2LoadData((JSONObject) ti.getFormContent(), engine.getInstance()));
                }
                return w;
            }
            return null;
        }
    }

    public String saveManualTaskInstance(String pInstId,
                                         String taskInstId,
                                         String userId,
                                         Map<String, Object> list)
            throws Exception {
        synchronized (activePThreads) {
            PEngine engine = (PEngine) activePThreads.get(pInstId);
            if (engine != null) {
                return engine.saveAccessibleDataVariable(taskInstId, userId, list);
            }
            return "0";
        }
    }

    public String returnManualTaskInstance(String pInstId,
                                           String taskInstId,
                                           String userId) throws Exception {
        synchronized (activePThreads) {
            PEngine engine = (PEngine) activePThreads.get(pInstId);
            if (engine != null) {
                return engine.returnManualTaskInstance(taskInstId, userId);
            }
            return "0";
        }
    }

    public String submitManualTaskInstance(String pInstId,
                                           String taskInstId,
                                           String userId,
                                           String userIp,
                                           String ufullname) throws Exception {
        synchronized (activePThreads) {
            PEngine engine = (PEngine) activePThreads.get(pInstId);
            if (engine != null) {
                return engine.submitManualTaskInstance(pInstId, taskInstId, userId, userIp, ufullname);
            }
        }
        return "0";
    }

    /**
     * @return the logcache
     */
    public LogCache getLogcache() {
        return logCache;
    }

}