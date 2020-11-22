/**
 *
 */
package com.cloudibpm.controller;

import com.alibaba.fastjson.JSON;
import com.cloudibpm.blo.om.user.WfUserBlo;
import com.cloudibpm.blo.sysnotice.SystemNoticeBlo;
import com.cloudibpm.core.sysnotice.SystemNotice;
import com.cloudibpm.core.sysnotice.SystemNoticePage;
import com.cloudibpm.core.user.User;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.core.websocketmodel.WebSocketMessage;
import com.model.*;
import org.apache.solr.client.solrj.SolrServerException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

@Controller
@RequestMapping("/service28")
public class SystemNoticeController {

    private static Logger logger = LoggerFactory.getLogger(SystemNoticeController.class);

    private final SystemNoticeBlo systemNoticeBlo;
    private final WfUserBlo wfUserBlo;
    private final WebSocketEntityContainer webSocketEntityContainer;

    @Autowired
    public SystemNoticeController(SystemNoticeBlo systemNoticeBlo,
                                  WfUserBlo wfUserBlo,
                                  WebSocketEntityContainer webSocketEntityContainer) {
        this.systemNoticeBlo = systemNoticeBlo;
        this.wfUserBlo = wfUserBlo;
        this.webSocketEntityContainer = webSocketEntityContainer;
    }

    /**
     * Find last live notice
     *
     * @return SystemNotice
     */
    @RequestMapping(value = "/api0", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public SystemNotice queryLastLiveNotice() {
        try {
            return systemNoticeBlo.getLastNotice();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Get all system notices page by page
     *
     * @param condition
     * @param pageno
     * @param pagesize
     * @param owner
     * @return
     */
    @RequestMapping(value = "/api1", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public SystemNoticePage queryAllSystemNotices(String condition, int pageno, int pagesize, String owner) {
        try {
            return systemNoticeBlo.searchNotice(condition, owner, pageno, pagesize);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Create a new system notice
     *
     * @param notice
     * @return
     */
    @RequestMapping(value = "/api2", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String createSystemNotices(String notice) {
        try {
            JSONObject obj = new JSONObject(notice);
            SystemNotice note = new SystemNotice();
            if (!obj.isNull("id")) {
                note.setId(obj.getString("id"));
            }
            if (!obj.isNull("name")) {
                note.setName(obj.getString("name"));
            }
            if (!obj.isNull("pcContent")) {
                note.setPcContent(obj.getString("pcContent"));
            }
            if (!obj.isNull("mobileContent")) {
                note.setMobileContent(obj.getString("mobileContent"));
            }
            if (!obj.isNull("keywords")) {
                note.setKeywords(obj.getString("keywords"));
            }
            if (!obj.isNull("publisherId")) {
                note.setPublisherId(obj.getString("publisherId"));
            }
            if (!obj.isNull("publisher")) {
                note.setPublisher(obj.getString("publisher"));
            }
            note.setLiveStatus(obj.getInt("liveStatus"));
            if (!obj.isNull("createDatetime")) {
                note.setCreateDatetime(DateUtility.parseDatetime(obj.getString("createDatetime")).getTime());
            }
            if (!obj.isNull("lastupdate")) {
                note.setLastupdate(DateUtility.parseDatetime(obj.getString("lastupdate")).getTime());
            }
            if (!obj.isNull("organizationName")) {
                note.setOrganizationName(obj.getString("organizationName"));
            }
            if (!obj.isNull("owner")) {
                note.setOwner(obj.getString("owner"));
            }
            note.setBanned(obj.getInt("banned"));
            if (!obj.isNull("banStartTime")) {
                note.setBanStartTime(DateUtility.parseDatetime(obj.getString("banStartTime")).getTime());
            }
            if (!obj.isNull("banEndTime")) {
                note.setBanEndTime(DateUtility.parseDatetime(obj.getString("banEndTime")).getTime());
            }
            note.setLevel(obj.getInt("level"));
            systemNoticeBlo.createNotice(note);
            return "{\"status\": \"1\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
    }

    @RequestMapping(value = "/api3", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String updateSystemNoticeLiveStatus(String nid, int status) {
        try {
            systemNoticeBlo.modifyNoticeLiveStatus(nid, status, System.currentTimeMillis());
            return "{\"status\": \"1\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
    }

    @RequestMapping(value = "/api4", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String removeSystemNotice(String nid) {
        try {
            systemNoticeBlo.removeNotice(nid);
            return "{\"status\": \"1\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
    }

    @RequestMapping(value = "/api5", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String removeAllSystemNotices(String orgid) {
        try {
            systemNoticeBlo.removeAllNotices(orgid);
            return "{\"status\": \"1\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
    }

    @RequestMapping(value = "/api6", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    @ResponseBody
    public DangerousServiceSearchResultPage searchIndustryService(String condition, int pageno, int pagesize, String owner) {
        String[] conditions = condition.split(" ");
        try {
            return DangerousServiceSolrUtils.searchIndustry(conditions, pageno, pagesize);
        } catch (SolrServerException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api7", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    @ResponseBody
    public String deleteKnowledgeService(String uid, String id) {
        try {
            DangerousServiceSolrUtils.deleteSearchIndex(id);
            return "success";
        } catch (SolrServerException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api8", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    @ResponseBody
    public DangerousServiceSearchResultPage addKnowledgeService(String name, String code, String type, String uid) throws Exception {
        try {
            Calendar cal = Calendar.getInstance();
            Date date = cal.getTime();
            KlProcess knowledge = new KlProcess();
            //查询发布人
            User user = wfUserBlo.getUserByID(uid);
            knowledge.setId(new SimpleDateFormat("yyyyMMddHHmmssSSS").format(date));
            knowledge.setIndustryName(name);
            knowledge.setIndustryType(code);
            knowledge.setIndustryContent(type);
            knowledge.setLastupdate(new Date().getTime());
            if (user != null) {
                knowledge.setIndustryUser(user.getSurname() + user.getGivenname());
            }
            DangerousServiceSolrUtils.setIndustry(knowledge);
        } catch (SolrServerException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Scheduled(cron = "0/30 * * * * *")
    public void noticeBroadcast() throws Exception {
        SystemNotice systemNotice = this.systemNoticeBlo.getLastNotice();
        if (systemNotice != null) {
            logger.info("有新的系统通知。"+systemNotice.getName());
            long t = System.currentTimeMillis();
            if (t >= systemNotice.getBanStartTime() && t <= systemNotice.getBanEndTime()) {
                WebSocketMessage webSocketmessage = new WebSocketMessage();
                webSocketmessage.setMessageType("4");
                webSocketmessage.setMessageData(JSON.toJSONString(systemNotice));
                webSocketEntityContainer.broadcast(webSocketmessage);
            }
        }

    }

}
