package com.cloudibpm.runtime.controller;

import com.cloudibpm.core.buildtime.wfprocess.ParticipationType;
import com.cloudibpm.core.runtime.admin.AdminSearchResult;
import com.cloudibpm.core.runtime.server.ServerInfoDescriptor;
import com.cloudibpm.core.runtime.util.json.WfProcessInstance2JSON;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.core.runtime.workitem.WorkitemInfoDescriptor;
import com.cloudibpm.runtime.server.SaaSServer;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * http://www.cnblogs.com/xiaogangqq123/archive/2011/03/04/1971002.html
 *
 * @author Dahai Cao lastupdated on 20171207
 */
@RestController
@RequestMapping("/service11")
public class SaaSController {

    @RequestMapping(value = "/api0", method = RequestMethod.POST,
            headers = "Accept=application/json",
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public String startup() {
        try {
            SaaSServer.getInstance().powerOn();
            System.out.println("started");
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    @RequestMapping(value = "/api1", method = RequestMethod.POST,
            headers = "Accept=application/json",
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public String pause() {
        try {
            SaaSServer.getInstance().pause();
            System.out.println("paused");
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    @RequestMapping(value = "/api2", method = RequestMethod.POST,
            headers = "Accept=application/json",
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public String stop() {
        try {
            SaaSServer.getInstance().powerOff();
            System.out.println("stopped");
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    @RequestMapping(value = "/api3", method = RequestMethod.POST,
            headers = "Accept=application/json",
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public String restart() {
        try {
            SaaSServer.getInstance().restart();
            System.out.println("restarted");
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    // @RequestMapping(value = "/api4", method = RequestMethod.GET, produces =
    // "application/json")
    // @ResponseBody
    // public String getStatus() {
    // try {
    // return "{\"status\": \"1\", \"ServerStatus\": \"" +
    // SaaSServer.getInstance().getStatus() + "\"}"; // failed;
    // } catch (Exception e) {
    // e.printStackTrace();
    // return "{\"status\": \"0\"}"; // failed
    // }
    // }
    //
    // @RequestMapping(value = "/api5", method = RequestMethod.GET, produces =
    // "application/json")
    // @ResponseBody
    // public String canAcceptRequest() {
    // try {
    // return "{\"status\": \"1\", \"acceptable\": \"" +
    // SaaSServer.getInstance().getAcceptable() + "\"}"; // failed;
    // } catch (Exception e) {
    // e.printStackTrace();
    // return "{\"status\": \"0\"}"; // failed
    // }
    // }

    @RequestMapping(value = "/api4", method = RequestMethod.GET,
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public ServerInfoDescriptor fetchServerInfo() {
        try {
            return SaaSServer.getInstance().getServerInfo();
        } catch (Exception e) {
            e.printStackTrace();
            return null; // failed
        }
    }

    /**
     * Launch a new workflow process instance.
     *
     * @param pid         workflow process definition ID
     * @param userid      client's user id on this system
     * @param timestamp   client local time stamp
     * @param ipv4        client IP v4 address
     * @param ipv6        client IP v6 address
     * @param longitude   client's longitude, 经度
     * @param latitude    client's latitude, 纬度
     * @param device      the device which client launched this process instance
     * @param paramvalues the pairs of the process variables and their values
     * @return String
     */
    @RequestMapping(value = "/api5", method = RequestMethod.POST,
            headers = "Accept=application/json",
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public Object launchProcessInstance(String pid,
                                        String userid,
                                        String ipv4,
                                        String ipv6,
                                        String longitude,
                                        String latitude,
                                        String device,
                                        String paramvalues,
                                        String fullname) {
        try {
            // launch process instance.
            Map<String, Object> savelist = new HashMap<>();
            if (paramvalues != null && !paramvalues.trim().equals("")) {
                JSONObject obj = new JSONObject(paramvalues);
                for (String key : obj.keySet()) {
                    if (obj.get(key) != null)
                        if (obj.get(key) instanceof JSONArray) {
                            JSONArray vals = obj.getJSONArray(key);
                            if (vals.length() > 0) {
                                String [] arry = new String[vals.length()];
                                for (int i = 0; i < vals.length(); i++) {
                                    arry[i] = vals.get(i).toString();
                                }
                                savelist.put(key, arry);
                            } else {
                                savelist.put(key, new String[0]);
                            }
                        } else if (obj.get(key) instanceof JSONObject) {
                            savelist.put(key, obj.get(key).toString());
                        } else {
                            savelist.put(key, obj.getString(key));
                        }
                }
            }
            WfProcessInstance inst = SaaSServer.getInstance().launch(pid, userid, ipv4,
                    ipv6, longitude, latitude,  device, savelist);
            if (inst != null) {
                if (inst.getWorkflowType() != 0) {
                    WorkitemInfoDescriptor r = getCurrWorkItemforSWf(inst, null,
                            userid, ipv4, fullname);
                    if (r != null) {
                        return r;
                    } else {
                        return "{\"status\": \"1\"}"; //
                    }
                } else {
                    return "{\"status\": \"1\"}"; //
                }
            } else {
                return "{\"status\": \"-4\"}"; // sever does not working
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"" + e.getMessage() + "\"}"; // failed
        }
    }

    /**
     * Administrator search results.
     *
     * @param oid
     * @param cond
     * @return
     */
    @RequestMapping(value = "/api6", method = RequestMethod.GET,
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public AdminSearchResult[] adminSearch(String oid,
                                           String cond1,
                                           String cond2,
                                           String cond3,
                                           String cond4) {
        try {
            return SaaSServer.getInstance().search(oid, cond1, cond2, cond3, cond4);
        } catch (Exception e) {
            e.printStackTrace();
            return null; // failed
        }
    }

    @RequestMapping(value = "/api7", method = RequestMethod.GET,
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public String searchInstance(String instanceId) {
        try {
            WfProcessInstance instance = SaaSServer.getInstance().getInstanceByID(instanceId);
            return WfProcessInstance2JSON.toJSON(instance);
        } catch (Exception e) {
            e.printStackTrace();
            return null; // failed
        }
    }

    @RequestMapping(value = "/api8", method = RequestMethod.GET,
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public WorkitemInfoDescriptor[] fetchManualTaskInstancesforMWf(String uid,
                                                                   String fullname,
                                                                   String staffids,
                                                                   String cond,
                                                                   String qtype) {
        try {
            return SaaSServer.getInstance().fetchManualTaskInstances(uid, fullname, staffids, cond, qtype);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/api9", method = RequestMethod.GET,
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public WorkitemInfoDescriptor fetchManualTaskInstanceforMWf(String pid,
                                                                String tid,
                                                                String userid,
                                                                String userip,
                                                                int priority,
                                                                String fullname) {
        try {
            return SaaSServer.getInstance().fetchManualTaskInstanceforMWf(pid, tid, userid, userip, priority, fullname);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/api10", method = RequestMethod.POST,
            headers = "Accept=application/json",
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public Object sendCommandWithSaving(String cmd,
                                        String pid,
                                        String tid,
                                        String userid,
                                        String userip,
                                        String list,
                                        String newuserid,
                                        String fullname) {
        String success = "0";
        try {
            JSONObject obj = new JSONObject(list);
            Map<String, Object> savelist = new HashMap<>();
            for (String key : obj.keySet()) {
                savelist.put(key, obj.getString(key));
            }
            // 首先是保存，保存完毕再做其他动作。
            success = SaaSServer.getInstance().saveManualTaskInstance(pid, tid, userid, savelist);
            // cmd可以是 0:保存;1:关闭;2:提交;3:退回;4:委托
            if (cmd.equals("0")) {// 保存
            } else if (cmd.equals("1")) {// 关闭
            } else if (cmd.equals("2")) {// 提交
                success = SaaSServer.getInstance().submitManualTaskInstance(pid, tid, userid, userip, fullname);
                WfProcessInstance inst = SaaSServer.getInstance().getInstanceByID(pid);
                if (inst != null && inst.getWorkflowType() == ParticipationType.SINGLE_PARTICIPANT_APP) { //
                    return getCurrWorkItemforSWf(inst, tid, userid, userip, fullname);
                }
            } else if (cmd.equals("3")) {// 退回
                success = SaaSServer.getInstance().returnManualTaskInstance(pid, tid, userid);
            } else if (cmd.equals("4")) {// 委托给特定人newuserid

            }
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"" + success + "\"}"; // failed
        }
        return "{\"status\": \"" + success + "\"}"; // success
    }

    /**
     * 这个方法的设计思想对于单参与者的流程执行以及性能非常重要，现在的设计我任务不是最好的，
     * 因此，需要好好思考并优化这个设计。曹大海注于2018-03-20
     *
     * @param inst   WfProcessInstance
     * @param tid    String
     * @param userid String
     * @param ipv4   String
     * @return WorkitemInfoDescriptor
     * @throws Exception
     */
    private WorkitemInfoDescriptor getCurrWorkItemforSWf(WfProcessInstance inst,
                                                         String tid,
                                                         String userid,
                                                         String ipv4,
                                                         String fullname)
            throws Exception {
        WorkitemInfoDescriptor r = new WorkitemInfoDescriptor();
        if (inst.getWorkflowType() == ParticipationType.SINGLE_PARTICIPANT_APP) { //
            while (r != null) {
                r = SaaSServer.getInstance().fetchManualTaskInstanceforSWf(inst.getId(), tid, userid, ipv4, fullname);
                if (r != null && r.getId() != null) {
                    if (!r.getId().equals(tid)) {
                        break;
                    } else {
                        Thread.sleep(1000);
                    }
                }
            }
        }
        if (r != null) {
            r.setWfProcessInstanceId(inst.getId());
            r.setWorkflowType(inst.getWorkflowType());
            r.setWfProcessInstanceStatus(inst.getStatus());
            r.setServerIp("localhost");
        }
        return r;
    }

    @RequestMapping(value = "/api11", method = RequestMethod.POST,
            headers = "Accept=application/json",
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public String sendCommandWithoutSaving(String cmd,
                                           String pid,
                                           String tid,
                                           String userid,
                                           String fullname,
                                           String userip,
                                           String newuserid) {
        String success = "0";
        try {
            if (cmd.equals("0")) { // 保存
            } else if (cmd.equals("1")) { // 关闭保存
            } else if (cmd.equals("2")) { // 提交
            } else if (cmd.equals("3")) { // 退回
                success = SaaSServer.getInstance().returnManualTaskInstance(pid, tid, userid);
            } else if (cmd.equals("4")) { // 委托给特定人newuserid

            }
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"" + success + "\"}"; // failed
        }
        return "{\"status\": \"" + success + "\"}"; // success
    }

    /**
     * Administrator search results.
     *
     * @param oid
     * @param cond
     * @return
     */
    @RequestMapping(value = "/api12", method = RequestMethod.GET,
            produces = "application/json; charset=utf-8")
    @ResponseBody
    public AdminSearchResult[] adminApplcationSearch(String pid,
                                                     String cond1,
                                                     String cond2,
                                                     String cond3,
                                                     String cond4) {
        try {
            return SaaSServer.getInstance().searchApp(pid, cond1, cond2, cond3, cond4);
        } catch (Exception e) {
            e.printStackTrace();
            return null; // failed
        }
    }
}