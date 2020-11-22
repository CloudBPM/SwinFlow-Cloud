/**
 *
 */
package com.cloudibpm.core.buildtime.util.json;

import com.cloudibpm.core.Location;
import com.cloudibpm.core.buildtime.release.wfprocess.ReleasedWfProcess;
import com.cloudibpm.core.buildtime.wfprocess.Transition;
import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
import com.cloudibpm.core.buildtime.wfprocess.task.*;
import com.cloudibpm.core.data.*;
import com.cloudibpm.core.data.variable.AccessibleVariable;
import com.cloudibpm.core.data.variable.ArrayDataVariable;
import com.cloudibpm.core.data.variable.DataVariable;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

/**
 * This class is used to parse business process from JSON to Java object.
 * 基本思想是，通过新建对象，并对JSON对象的每一个属性逐一访问和获取，并赋值给新对象。
 * 可以使的处理思路清晰和简单，效率可能有点低，但是由于JSON对象中，有很多字符串需要解析，
 * 如表达式字符串，在访问JSON对象属性过程中就可以对其进行解析。
 *
 * @author Dahai created on 20170808 last updated on 2017-11-28; 2018-06-17,
 *         last updated at 16:21 on 2018-09-02 (My 46th birthday)
 *
 */
public class WfProcessJSONParser {

    /**
     *
     * @param jsonWfProcess
     *            String
     * @return WfProcess
     * @throws JSONException
     * @throws Exception
     */
    public static WfProcess parseWfProcess(String jsonWfProcess) throws JSONException, Exception {
        JSONObject obj = new JSONObject(jsonWfProcess);
        WfProcess newprocess = new WfProcess();
        return parseProps(newprocess, obj);
    }

    /**
     *
     * @param jsonWfProcess
     *            String
     * @return ReleasedWfProcess
     * @throws JSONException
     * @throws Exception
     */
    public static ReleasedWfProcess parseReleasedWfProcess(String jsonWfProcess) throws JSONException, Exception {
        JSONObject obj = new JSONObject(jsonWfProcess);
        ReleasedWfProcess newprocess = new ReleasedWfProcess();
        return parseProps(newprocess, obj);
    }

    protected static WfProcess parseProps(WfProcess newprocess, JSONObject obj) throws JSONException, Exception {
        parseCommonProps(newprocess, obj);
        JSONArray jsonarr = obj.getJSONArray("children");
        if (jsonarr.length() > 0) { // parsing data variables and tasks
            for (int i = 0; i < jsonarr.length(); i++) {
                parseChildren(jsonarr.getJSONObject(i), newprocess);
            }
        }
        parseTransitions(jsonarr, newprocess);
        return newprocess;
    }

    protected static void parseCommonProps(WfProcess newprocess, JSONObject obj) throws JSONException, ParseException {
        newprocess.setId(obj.getString("id"));
        newprocess.setCode(obj.getString("code"));
        newprocess.setName(obj.getString("name"));
        newprocess.setWorkflowType(obj.getInt("workflowType"));
        newprocess.setProcessType(obj.getInt("processType"));
        newprocess.setAccessLevel(obj.getInt("accessLevel"));
        if (!obj.isNull("keywords")) {
            newprocess.setKeywords(obj.getString("keywords"));
        }
        if (!obj.isNull("description")) {
            newprocess.setDescription(obj.getString("description"));
        }
        if (!obj.isNull("authorId")) {
            newprocess.setAuthorId(obj.getString("authorId"));
        }
        if (!obj.isNull("author")) {
            newprocess.setAuthor(obj.getString("author"));
        }
        newprocess.setParent(obj.getString("parent"));
        newprocess.setOwner(obj.getString("owner"));
        if (obj.get("lastupdate") instanceof String) {
            newprocess.setLastupdate(Long.parseLong(obj.getString("lastupdate")));
        } else if (obj.get("lastupdate") instanceof Long) {
            newprocess.setLastupdate(obj.getLong("lastupdate"));
        }
        newprocess.setStatus(obj.getInt("status"));
    }

    public static ReleasedWfProcess parseProps(ReleasedWfProcess newprocess, JSONObject obj)
            throws JSONException, Exception {
        parseCommonProps(newprocess, obj);
        if (!obj.isNull("version")) {
            newprocess.setVersion(obj.getString("version"));
        }
        if (!obj.isNull("releaserId")) {
            newprocess.setReleaserId(obj.getString("releaserId"));
        }
        if (!obj.isNull("releaser")) {
            newprocess.setReleaser(obj.getString("releaser"));
        }
        if (!obj.isNull("releaseDate")) {
            newprocess.setReleaseDate(obj.getLong("releaseDate"));
        }
        if (!obj.isNull("releaseStatement")) {
            newprocess.setReleaseStatement(obj.getString("releaseStatement"));
        }
        if (!obj.isNull("trialPeriod")) {
            newprocess.setTrialPeriod(obj.getInt("trialPeriod"));
        }
        if (!obj.isNull("likeCounting")) {
            newprocess.setLikeCounting(obj.getInt("likeCounting"));
        }
        if (!obj.isNull("totalDownloading")) {
            newprocess.setTotalDownloading(obj.getInt("totalDownloading"));
        }
        if (!obj.isNull("totalUseCounting")) {
            newprocess.setTotalUseCounting(obj.getInt("totalUseCounting"));
        }
        if (!obj.isNull("successCounting")) {
            newprocess.setSuccessCounting(obj.getInt("successCounting"));
        }
        if (!obj.isNull("terminationCounting")) {
            newprocess.setTerminationCounting(obj.getInt("terminationCounting"));
        }
        if (!obj.isNull("suspensionCounting")) {
            newprocess.setSuspensionCounting(obj.getInt("suspensionCounting"));
        }
        if (!obj.isNull("purchasePrice")) {
            newprocess.setPurchasePrice(obj.getDouble("purchasePrice"));
        }
        if (!obj.isNull("usagePrice")) {
            newprocess.setUsagePrice(obj.getDouble("usagePrice"));
        }
        JSONArray jsonarr = obj.getJSONArray("children");
        if (jsonarr.length() > 0) { // parsing data variables and tasks
            for (int i = 0; i < jsonarr.length(); i++) {
                parseChildren(jsonarr.getJSONObject(i), newprocess);
            }
        }
        parseTransitions(jsonarr, newprocess);
        return newprocess;
    }

    private static void parseTransitions(JSONArray jsonarr, WfProcess newprocess) {
        // parsing input/output transitions
        for (int i = 0; i < jsonarr.length(); i++) {
            JSONObject child = jsonarr.getJSONObject(i);
            String ctype = child.getString("classtypename");
            if (!ctype.endsWith("Variable")) {
                JSONArray jsonarrOutputs = child.getJSONArray("outputs");
                if (jsonarrOutputs.length() > 0) {
                    for (int j = 0; j < jsonarrOutputs.length(); j++) {
                        JSONObject jst = jsonarrOutputs.getJSONObject(j);
                        Transition t = new Transition();
                        t.setId(jst.getString("id"));
                        t.setName(jst.getString("name"));
                        t.setOrderNumber(jst.getInt("orderNumber"));
                        t.setOwner(jst.getString("owner"));
                        t.setCurrOwner(jst.getString("currOwner"));
                        t.setAlwaysTrue(jst.getBoolean("alwaysTrue"));
                        if (!jst.isNull("navigationRule")) {
                            t.setNavigationRule(jst.getString("navigationRule"));
                        }
                        if (!jst.isNull("definitionId")) {
                            t.setNavigationRule(jst.getString("definitionId"));
                        }
                        AbstractTask source = (AbstractTask) newprocess.seekChildByID(jst.getString("source"));
                        t.setSource(source);
                        source.addOutput(t);
                        AbstractTask target = (AbstractTask) newprocess.seekChildByID(jst.getString("target"));
                        t.setTarget(target);
                        target.addInput(t);
                        if (!jst.isNull("bendpoints")) {
                            JSONObject json = jst.getJSONObject("bendpoints");
                            double x = json.getDouble("x");
                            double y = json.getDouble("y");
                            t.setBendPoint(new Location(x, y));
                        }
                    }
                }
            }
        }
    }

    private static void parseChildren(JSONObject obj, WfProcess newprocess) throws Exception {
        String currOwner = newprocess.getId();
        String owner = newprocess.getOwner();
        if (obj.getString("classtypename").equals(DataVariable.class.getSimpleName())) {
            newprocess.addChild(parseDataVariable(obj, currOwner, owner));
        } else if (obj.getString("classtypename").equals(ArrayDataVariable.class.getSimpleName())) {
            newprocess.addChild(parseArrayDataVariable(obj, currOwner, owner));
        } else if (obj.getString("classtypename").equals(StartPoint.class.getSimpleName())) {
            StartPoint task = new StartPoint();
            setCommonTaskProps(task, obj, currOwner, owner);
            if (!obj.isNull("launchUIType")) {
                task.setLaunchUIType(obj.getInt("launchUIType"));
            }
            if (!obj.isNull("launchUIUrl")) {
                task.setLaunchUIUrl(obj.getString("launchUIUrl"));
            }
            if (!obj.isNull("launchFormContent")) {
                JSONObject o = obj.getJSONObject(("launchFormContent"));
                task.setLaunchFormContent(o);// 直接存储JSON对象
                //task.setLaunchFormContent(o.toString());
            }
            newprocess.addChild(task);
            JSONArray jsonarr = obj.getJSONArray("accessibleVars");
            if (jsonarr.length() > 0) {
                List<AccessibleVariable> list = new ArrayList<AccessibleVariable>();
                for (int i = 0; i < jsonarr.length(); i++) {
                    list.add(parseAccessibleVariables(jsonarr.getJSONObject(i)));
                }
                task.setAccessibleVars(list.toArray(new AccessibleVariable[list.size()]));
            }
        } else if (obj.getString("classtypename").equals(EndPoint.class.getSimpleName())) {
            EndPoint task = new EndPoint();
            setCommonTaskProps(task, obj, currOwner, owner);
            if (!obj.isNull("endUIType")) {
                task.setEndUIType(obj.getInt("endUIType"));
            }
            if (!obj.isNull("endUIUrl")) {
                task.setEndUIUrl(obj.getString("endUIUrl"));
            }
            if (!obj.isNull("endFormContent")) {
                JSONObject o = obj.getJSONObject(("endFormContent"));
                task.setEndFormContent(o.toString());
            }
            newprocess.addChild(task);
            JSONArray jsonarr = obj.getJSONArray("accessibleVars");
            if (jsonarr.length() > 0) {
                List<AccessibleVariable> list = new ArrayList<AccessibleVariable>();
                for (int i = 0; i < jsonarr.length(); i++) {
                    list.add(parseAccessibleVariables(jsonarr.getJSONObject(i)));
                }
                task.setAccessibleVars(list.toArray(new AccessibleVariable[list.size()]));
            }
        } else if (obj.getString("classtypename").equals(AssignTask.class.getSimpleName())) {
            AssignTask task = new AssignTask();
            setCommonTaskProps(task, obj, currOwner, owner);
            JSONArray jsonarr = obj.getJSONArray("assignments");
            if (jsonarr.length() > 0) {
                List<Assignment> list = new ArrayList<Assignment>();
                for (int i = 0; i < jsonarr.length(); i++) {
                    Assignment a = new Assignment();
                    a.setType(0);
                    parseAssignments(a, jsonarr.getJSONObject(i), currOwner, owner);
                    list.add(a);
                }
                task.setAssignments(list.toArray(new Assignment[list.size()]));
            }
            newprocess.addChild(task);
        } else if (obj.getString("classtypename").equals(ManualTask.class.getSimpleName())) {
            ManualTask task = new ManualTask();
            setCommonTaskProps(task, obj, currOwner, owner);
            if (!obj.isNull("uiType")) {
                task.setUiType(obj.getInt("uiType"));
            }
            if (!obj.isNull("uiUrl")) {
                task.setUiUrl(obj.getString("uiUrl"));
            }
            if (!obj.isNull("formContent")) {
                JSONObject o = obj.getJSONObject(("formContent"));
                task.setFormContent(o);
            }
            if (!obj.isNull("expiryHandlerWfProcessId")) {
                task.setExpiryHandlerWfProcessId(obj.getString("expiryHandlerWfProcessId"));
            }
            task.setDeadlineDays(obj.getInt("deadlineDays"));
            task.setAlarmDays(obj.getInt("alarmDays"));
            task.setAlarmFrequency(obj.getInt("alarmFrequency"));
            task.setAlarmMethod(obj.getInt("alarmMethod"));
            JSONArray jsonarr = obj.getJSONArray("accessibleVars");
            if (jsonarr.length() > 0) {
                List<AccessibleVariable> list = new ArrayList<AccessibleVariable>();
                for (int i = 0; i < jsonarr.length(); i++) {
                    list.add(parseAccessibleVariables(jsonarr.getJSONObject(i)));
                }
                task.setAccessibleVars(list.toArray(new AccessibleVariable[list.size()]));
            }
            JSONArray jsonarrs = obj.getJSONArray("participants");
            if (jsonarrs.length() > 0) {
                List<Participant> list = new ArrayList<Participant>();
                for (int i = 0; i < jsonarrs.length(); i++) {
                    list.add(parseParticipants(jsonarrs.getJSONObject(i)));
                }
                task.setParticipants(list.toArray(new Participant[list.size()]));
            }
            newprocess.addChild(task);
        } else if (obj.getString("classtypename").equals(EmailReceivingTask.class.getSimpleName())) {
            EmailReceivingTask task = new EmailReceivingTask();
            setCommonTaskProps(task, obj, currOwner, owner);
            newprocess.addChild(task);
        } else if (obj.getString("classtypename").equals(EmailSendingTask.class.getSimpleName())) {
            EmailSendingTask task = new EmailSendingTask();
            setCommonTaskProps(task, obj, currOwner, owner);
            if (!obj.isNull("subject")) {
                task.setSubject(obj.getString("subject"));
            }
            if (!obj.isNull("templateId")) {
                task.setTemplateId(obj.getString("templateId"));
            }
            if (!obj.isNull("template")) {
                task.setTemplate(obj.getString("template"));
            }
            JSONArray jsonarrs = obj.getJSONArray("receivers");
            if (jsonarrs.length() > 0) {
                List<MessageReceiver> list = new ArrayList<MessageReceiver>();
                for (int i = 0; i < jsonarrs.length(); i++) {
                    list.add(parseMessageReceivers(jsonarrs.getJSONObject(i)));
                }
                task.setReceivers(list.toArray(new MessageReceiver[list.size()]));
            }
            JSONArray jsonarrs1 = obj.getJSONArray("attachments");
            if (jsonarrs1.length() > 0) {
                List<FileConstant> list = new ArrayList<FileConstant>();
                for (int i = 0; i < jsonarrs1.length(); i++) {
                    list.add(parseAttachement(jsonarrs1.getString(i)));
                }
                task.setAttachments(list.toArray(new FileConstant[list.size()]));
            }
            JSONArray jsonarrs2 = obj.getJSONArray("variables");
            if (jsonarrs2.length() > 0) {
                List<String> list = new ArrayList<String>();
                for (int i = 0; i < jsonarrs2.length(); i++) {
                    list.add(jsonarrs2.getString(i));
                }
                task.setVariables(list.toArray(new String[list.size()]));
            }
            newprocess.addChild(task);
        } else if (obj.getString("classtypename").equals(SMSReceivingTask.class.getSimpleName())) {
            SMSReceivingTask task = new SMSReceivingTask();
            setCommonTaskProps(task, obj, currOwner, owner);
            newprocess.addChild(task);
        } else if (obj.getString("classtypename").equals(SMSSendingTask.class.getSimpleName())) {
            SMSSendingTask task = new SMSSendingTask();
            setCommonTaskProps(task, obj, currOwner, owner);
            if (!obj.isNull("templateId")) {
                task.setTemplateId(obj.getString("templateId"));
            }
            if (!obj.isNull("template")) {
                task.setTemplate(obj.getString("template"));
            }
            JSONArray jsonarrs = obj.getJSONArray("receivers");
            if (jsonarrs.length() > 0) {
                List<MessageReceiver> list = new ArrayList<MessageReceiver>();
                for (int i = 0; i < jsonarrs.length(); i++) {
                    list.add(parseMessageReceivers(jsonarrs.getJSONObject(i)));
                }
                task.setReceivers(list.toArray(new MessageReceiver[list.size()]));
            }
            newprocess.addChild(task);
        } else if (obj.getString("classtypename").equals(SubprocessPoint.class.getSimpleName())) {
            SubprocessPoint task = new SubprocessPoint();
            setCommonTaskProps(task, obj, currOwner, owner);
            if (!obj.isNull("subprocessId")) {
                task.setSubprocessId(obj.getString("subprocessId"));
            }
            task.setSynchronised(obj.getBoolean("synchronised"));
            JSONArray jsonarr1 = obj.getJSONArray("subprocessInputs");
            if (jsonarr1.length() > 0) {
                List<Assignment> list = new ArrayList<Assignment>();
                for (int i = 0; i < jsonarr1.length(); i++) {
                    Assignment a = new Assignment();
                    a.setType(1);
                    parseAssignments(a, jsonarr1.getJSONObject(i), currOwner, owner);
                    list.add(a);
                }
                task.setSubprocessInputs(list.toArray(new Assignment[list.size()]));
            }
            JSONArray jsonarr2 = obj.getJSONArray("subprocessOutputs");
            if (jsonarr2.length() > 0) {
                List<Assignment> list = new ArrayList<Assignment>();
                for (int i = 0; i < jsonarr2.length(); i++) {
                    Assignment a = new Assignment();
                    parseAssignments(a, jsonarr2.getJSONObject(i), currOwner, owner);
                    a.setType(2);
                    list.add(a);
                }
                task.setSubprocessOutputs(list.toArray(new Assignment[list.size()]));
            }
            newprocess.addChild(task);
        } else if (obj.getString("classtypename").equals(SystemTask.class.getSimpleName())) {
            SystemTask task = new SystemTask();
            setCommonTaskProps(task, obj, currOwner, owner);
            if (!obj.isNull("appServiceType")) {
                task.setAppServiceType(obj.getInt("appServiceType"));
            }
            if (!obj.isNull("appServiceId")) {
                task.setAppServiceId(obj.getString("appServiceId"));
            }
            if (!obj.isNull("appServiceName")) {
                task.setAppServiceName(obj.getString("appServiceName"));
            }
            if (!obj.isNull("hasSecurityAccessKey")) {
                task.setHasSecurityAccessKey(obj.getInt("hasSecurityAccessKey"));
            }
            if (!obj.isNull("securityAccessKey")) {
                task.setSecurityAccessKey(obj.getString("securityAccessKey"));
            }
            if (!obj.isNull("apiName")) {
                task.setAPIName(obj.getString("apiName"));
            }
            if (!obj.isNull("apiMethod")) {
                task.setAPIMethod(obj.getString("apiMethod"));
            }
            if (!obj.isNull("pathParameterString")) {
                task.setPathParameterString(obj.getString("pathParameterString"));
            }
            if (!obj.isNull("formParameterString")) {
                task.setFormParameterString(obj.getString("formParameterString"));
            }
            if (!obj.isNull("returnString")) {
                task.setReturnString(obj.getString("returnString"));
            }
            newprocess.addChild(task);
        } else if (obj.getString("classtypename").equals(WaitTask.class.getSimpleName())) {
            WaitTask task = new WaitTask();
            setCommonTaskProps(task, obj, currOwner, owner);
            // true: specific(fixed) time period; false: variable time period
            task.setSpecificDuration(obj.getBoolean("specificDuration"));
            if (!obj.isNull("timeRule")) {
                task.setTimeRule(obj.getString("timeRule"));
            }
            if (!obj.isNull("timeUnit")) {
                task.setTimeUnit(obj.getInt("timeUnit"));
            }
            if (!obj.isNull("largeDuration")) {
                task.setLargeDuration(obj.getInt("largeDuration"));
            }
            if (!obj.isNull("largeDurationUnit")) {
                // 0:day; 1:week; 2:fortnight: 3:month; 4:quarter
                task.setLargeDurationUnit(obj.getInt("largeDurationUnit"));
            }
            if (!obj.isNull("hours")) {
                task.setHours(obj.getInt("hours"));
            }
            if (!obj.isNull("minutes")) {
                task.setMinutes(obj.getInt("minutes"));
            }
            if (!obj.isNull("seconds")) {
                task.setSeconds(obj.getInt("seconds"));
            }
            if (!obj.isNull("milliseconds")) {
                task.setMilliseconds(obj.getInt("milliseconds"));
            }
            newprocess.addChild(task);
        }
    }

    protected static DataVariable parseDataVariable(JSONObject obj, String currOwner, String owner) throws Exception {
        DataVariable dv = new DataVariable();
        dv.setId(obj.getString("id"));
        dv.setName(obj.getString("name"));
        dv.setOrderNumber(obj.getInt("orderNumber"));
        dv.setDatatype(obj.getString("datatype"));
        if (!obj.isNull("description")) {
            dv.setDescription(obj.getString("description"));
        }
        if (!obj.isNull("definitionId")) {
            dv.setDefinitionId(obj.getString("definitionId"));
        }
        if (!obj.isNull("value")) {
            if (dv.getDatatype().equals("Integer") || dv.getDatatype().equals("int")) {
                IntegerConstant ic = new IntegerConstant();
                ic.parseString(obj.getString("value"));
                dv.setValue(ic);
            } else if (dv.getDatatype().equals("Double") || dv.getDatatype().equals("double")
                    || dv.getDatatype().equals("Float") || dv.getDatatype().equals("float")) {
                DoubleConstant dc = new DoubleConstant();
                dc.parseString(obj.getString("value"));
                dv.setValue(dc);
            } else if (dv.getDatatype().equals("Boolean")) {
                BooleanConstant bc = new BooleanConstant();
                bc.parseString(obj.getString("value"));
                dv.setValue(bc);
            } else if (dv.getDatatype().equals("String")) {
                StringConstant sc = new StringConstant();
                sc.parseString(obj.getString("value"));
                dv.setValue(sc);
            } else if (dv.getDatatype().equals("DateTime") || dv.getDatatype().equals("Date")
                    || dv.getDatatype().equals("Time")) {
                DateTimeConstant dtc = new DateTimeConstant();
                dtc.setDatatype(dv.getDatatype());
                dtc.parseString(obj.getString("value"));
                dv.setValue(dtc);
            } else if (dv.getDatatype().equals("TimeDuration")) {
                TimDurationConstant tdc = new TimDurationConstant();
                tdc.setDatatype(dv.getDatatype());
                tdc.parseString(obj.getString("value"));
                dv.setValue(tdc);
            } else if (dv.getDatatype().equals("Currency")) {
                DoubleConstant dc = new DoubleConstant();
                dc.setDatatype(dv.getDatatype());
                dc.parseString(obj.getString("value"));
                dv.setValue(dc);
            } else if (dv.getDatatype().equals("JSONData")) {
                JSONConstant jsc = new JSONConstant();
                jsc.parseString(obj.getString("value"));
                dv.setValue(jsc);
            } else if (dv.getDatatype().equals("File")) {
                FileConstant fc = new FileConstant();
                fc.parseString(obj.getString("value"));
                dv.setValue(fc);
            } else if (dv.getDatatype().equals("Handwriting")) {
                HandwritingConstant hc = new HandwritingConstant();
                hc.parseString(obj.getString("value"));
                dv.setValue(hc);
            }
        }
        dv.setCurrOwner(currOwner);
        dv.setOwner(owner);
        return dv;
    }

    protected static ArrayDataVariable parseArrayDataVariable(JSONObject obj, String currOwner, String owner)
            throws Exception {
        ArrayDataVariable dv = new ArrayDataVariable();
        dv.setId(obj.getString("id"));
        dv.setName(obj.getString("name"));
        dv.setOrderNumber(obj.getInt("orderNumber"));
        dv.setDatatype(obj.getString("datatype"));
        if (!obj.isNull("description")) {
            dv.setDescription(obj.getString("description"));
        }
        if (!obj.isNull("definitionId")) {
            dv.setDefinitionId(obj.getString("definitionId"));
        }
        if (!obj.isNull("values")) {
            JSONArray vals = obj.getJSONArray("values");
            if (vals.length() > 0) {
                if (dv.getDatatype().equals("Integer") || dv.getDatatype().equals("int")) {
                    IntegerConstant[] ivals = new IntegerConstant[vals.length()];
                    for (int i = 0; i < vals.length(); i++) {
                        IntegerConstant ic = new IntegerConstant();
                        ic.parseString(vals.get(i).toString());
                        ivals[i] = ic;
                    }
                    dv.setValues(ivals);
                } else if (dv.getDatatype().equals("Double") || dv.getDatatype().equals("double")
                        || dv.getDatatype().equals("Float") || dv.getDatatype().equals("float")) {
                    DoubleConstant[] dcvals = new DoubleConstant[vals.length()];
                    for (int i = 0; i < vals.length(); i++) {
                        DoubleConstant dc = new DoubleConstant();
                        dc.parseString(vals.get(i).toString());
                        dcvals[i] = dc;
                    }
                    dv.setValues(dcvals);
                } else if (dv.getDatatype().equals("Boolean")) {
                    BooleanConstant[] bcvals = new BooleanConstant[vals.length()];
                    for (int i = 0; i < vals.length(); i++) {
                        BooleanConstant bc = new BooleanConstant();
                        bc.parseString(vals.get(i).toString());
                        bcvals[i] = bc;
                    }
                    dv.setValues(bcvals);
                } else if (dv.getDatatype().equals("String")) {
                    StringConstant[] scvals = new StringConstant[vals.length()];
                    for (int i = 0; i < vals.length(); i++) {
                        StringConstant sc = new StringConstant();
                        sc.parseString(vals.get(i).toString());
                        scvals[i] = sc;
                    }
                    dv.setValues(scvals);
                } else if (dv.getDatatype().equals("DateTime") || dv.getDatatype().equals("Date")
                        || dv.getDatatype().equals("Time")) {
                    DateTimeConstant[] dtcvals = new DateTimeConstant[vals.length()];
                    for (int i = 0; i < vals.length(); i++) {
                        DateTimeConstant dtc = new DateTimeConstant();
                        dtc.setDatatype(dv.getDatatype());
                        dtc.parseString(vals.get(i).toString());
                        dtcvals[i] = dtc;
                    }
                    dv.setValues(dtcvals);
                } else if (dv.getDatatype().equals("TimeDuration")) {
                    TimDurationConstant[] tdcvals = new TimDurationConstant[vals.length()];
                    for (int i = 0; i < vals.length(); i++) {
                        TimDurationConstant tdc = new TimDurationConstant();
                        tdc.setDatatype(dv.getDatatype());
                        tdc.parseString(vals.get(i).toString());
                        tdcvals[i] = tdc;
                    }
                    dv.setValues(tdcvals);

                } else if (dv.getDatatype().equals("Currency")) {
                    DoubleConstant[] dcvals = new DoubleConstant[vals.length()];
                    for (int i = 0; i < vals.length(); i++) {
                        DoubleConstant dc = new DoubleConstant();
                        dc.setDatatype(dv.getDatatype());
                        dc.parseString(vals.get(i).toString());
                        dcvals[i] = dc;
                    }
                    dv.setValues(dcvals);
                } else if (dv.getDatatype().equals("JSONData")) {
                    JSONConstant[] jscvals = new JSONConstant[vals.length()];
                    for (int i = 0; i < vals.length(); i++) {
                        JSONConstant jsc = new JSONConstant();
                        jsc.parseString(vals.get(i).toString());
                        jscvals[i] = jsc;
                    }
                    dv.setValues(jscvals);
                } else if (dv.getDatatype().equals("File")) {
                    FileConstant[] fcvals = new FileConstant[vals.length()];
                    for (int i = 0; i < vals.length(); i++) {
                        FileConstant fc = new FileConstant();
                        fc.parseString(vals.get(i).toString());
                        fcvals[i] = fc;
                    }
                    dv.setValues(fcvals);
                } else if (dv.getDatatype().equals("Handwriting")) {
                    HandwritingConstant[] hcvals = new HandwritingConstant[vals.length()];
                    for (int i = 0; i < vals.length(); i++) {
                        HandwritingConstant hc = new HandwritingConstant();
                        hc.parseString(vals.get(i).toString());
                        hcvals[i] = hc;
                    }
                    dv.setValues(hcvals);
                }
            }
        }
        dv.setCurrOwner(currOwner);
        dv.setOwner(owner);
        return dv;
    }

    protected static void setCommonTaskProps(AbstractTask task, JSONObject obj, String currOwner, String owner)
            throws JSONException, ParseException {
        task.setId(obj.getString("id"));
        task.setName(obj.getString("name"));
        if (!obj.isNull("description")) {
            task.setDescription(obj.getString("description"));
        }
        task.setX0(obj.getDouble("x0"));
        task.setY0(obj.getDouble("y0"));
        task.setX1(obj.getDouble("x1"));
        task.setY1(obj.getDouble("y1"));
        if (!obj.isNull("isParallelInput")) {
            task.setIsParallelInput(obj.getInt("isParallelInput"));
        }
        if (!obj.isNull("isParallelOutput")) {
            task.setIsParallelOutput(obj.getInt("isParallelOutput"));
        }
        if (obj.get("lastupdate") instanceof Long)
            task.setLastupdate(obj.getLong("lastupdate"));
        task.setCurrOwner(currOwner);
        task.setStatus(obj.getInt("status"));
        task.setOwner(owner);
    }

    protected static AccessibleVariable parseAccessibleVariables(JSONObject obj) throws Exception {
        AccessibleVariable av = new AccessibleVariable();
        if (!obj.isNull("taskId")) {
            av.setParent(obj.getString("taskId"));
        }
        av.setAccessControl(obj.getInt("accessControl"));
        av.setVarId(obj.getString("varId"));
        av.setCurrOwner(obj.getString("currOwner"));
        av.setOwner(obj.getString("owner"));
        if (!obj.isNull("componentId"))
            av.setComponentId(obj.getString("componentId"));
        return av;
    }

    protected static Participant parseParticipants(JSONObject obj) throws Exception {
        Participant av = new Participant();
        if (!obj.isNull("id"))
            av.setId(obj.getString("id"));
        if (!obj.isNull("taskId"))
            av.setParent(obj.getString("taskId"));
        if (!obj.isNull("participationType"))
            av.setParticipationType(obj.getInt("participationType"));
        if (!obj.isNull("organizationId"))
            av.setOrganizationId(obj.getString("organizationId"));
        if (!obj.isNull("organizationName"))
            av.setOrganizationName(obj.getString("organizationName"));
        if (!obj.isNull("departmentId"))
            av.setDepartmentId(obj.getString("departmentId"));
        if (!obj.isNull("departmentName"))
            av.setDepartmentName(obj.getString("departmentName"));
        if (!obj.isNull("positionId"))
            av.setPositionId(obj.getString("positionId"));
        if (!obj.isNull("positionName"))
            av.setPositionName(obj.getString("positionName"));
        if (!obj.isNull("priority"))
            av.setPriority(obj.getInt("priority"));
        if (!obj.isNull("userId"))
            av.setUserId(obj.getString("userId"));
        if (!obj.isNull("userFullName"))
            av.setUserFullName(obj.getString("userFullName"));
        if (!obj.isNull("currOwner"))
            av.setCurrOwner(obj.getString("currOwner"));
        if (!obj.isNull("owner"))
            av.setOwner(obj.getString("owner"));
        return av;
    }

    protected static MessageReceiver parseMessageReceivers(JSONObject obj) throws Exception {
        MessageReceiver av = new MessageReceiver();
        if (!obj.isNull("id"))
            av.setId(obj.getString("id"));
        if (!obj.isNull("taskId"))
            av.setParent(obj.getString("taskId"));
        if (!obj.isNull("messageType"))
            av.setMessageType(obj.getInt("messageType"));
        if (!obj.isNull("receiverType"))
            av.setReceiverType(obj.getInt("receiverType"));
        if (!obj.isNull("organizationId"))
            av.setOrganizationId(obj.getString("organizationId"));
        if (!obj.isNull("organizationName"))
            av.setOrganizationName(obj.getString("organizationName"));
        if (!obj.isNull("departmentId"))
            av.setDepartmentId(obj.getString("departmentId"));
        if (!obj.isNull("departmentName"))
            av.setDepartmentName(obj.getString("departmentName"));
        if (!obj.isNull("positionId"))
            av.setPositionId(obj.getString("positionId"));
        if (!obj.isNull("positionName"))
            av.setPositionName(obj.getString("positionName"));
        if (!obj.isNull("userId"))
            av.setUserId(obj.getString("userId"));
        if (!obj.isNull("userFullName"))
            av.setUserFullName(obj.getString("userFullName"));
        if (!obj.isNull("currOwner"))
            av.setCurrOwner(obj.getString("currOwner"));
        if (!obj.isNull("owner"))
            av.setOwner(obj.getString("owner"));
        return av;
    }

    protected static void parseAssignments(Assignment a, JSONObject obj, String currOwner, String owner)
            throws Exception {
        a.setId(obj.getString("id"));
        if (!obj.isNull("variableString"))
            a.setVariableString(obj.getString("variableString"));
        if (!obj.isNull("value"))
            a.setValue(obj.getString("value"));
        if (!obj.isNull("arrayIndex")) {
            String s = obj.getString("arrayIndex");
            if (!s.equals("")) {
                a.setArrayIndex(obj.getInt("arrayIndex"));
            }
        }
        // 0: Assignment; 1: Subprocess input; 2: Subprocess output
        if (!obj.isNull("type")) {
            a.setType(obj.getInt("type"));
        }
        a.setCurrOwner(currOwner);
        a.setOwner(owner);
    }

    protected static FileConstant parseAttachement(String obj) throws Exception {
        FileConstant f = new FileConstant();
        f.parseString(obj);
        return f;
    }
}
