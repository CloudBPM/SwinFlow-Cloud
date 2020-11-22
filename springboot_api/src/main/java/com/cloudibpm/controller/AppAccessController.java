package com.cloudibpm.controller;

import com.cloudibpm.blo.am.appservice.AppServiceAccessControlBlo;
import com.cloudibpm.core.appservice.AppServiceAccessControl;
import com.cloudibpm.core.appservice.AppServiceAccessControlPage;
import com.cloudibpm.core.util.DateUtility;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * This service is used for external application access control.
 *
 * @author Dahai Cao
 * @date 20170109
 */
@RestController
@RequestMapping("/service8")
public class AppAccessController {
    private final AppServiceAccessControlBlo appServiceAccessControlBlo;

    @Autowired
    public AppAccessController(AppServiceAccessControlBlo appServiceAccessControlBlo) {
        this.appServiceAccessControlBlo = appServiceAccessControlBlo;
    }

    /**
     * Find all authority group with or without any condition from repository.
     *
     * @return User array
     */
    @RequestMapping(value = "/api0", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public AppServiceAccessControlPage getAppServiceAccessControls(String condition, String appid, int pageno,
                                                                   int pagesize) {
        try {
            return appServiceAccessControlBlo.getAllAccessControls(condition, appid, pageno, pagesize);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Find all authority group with or without any condition from repository.
     *
     * @return User array
     */
    @RequestMapping(value = "/api1", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public AppServiceAccessControl[] getAppServiceAccessControls(String appid) {
        try {
            return appServiceAccessControlBlo.getAllAccessControls(appid);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Find all authority group with or without any condition from repository.
     *
     * @return User array
     */
    @RequestMapping(value = "/api2", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String deleteAppServiceAccessControl(String appid, String orgid) {
        try {
            appServiceAccessControlBlo.deleteAccessControl(appid, orgid);
            return "{\"status\": \"1\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
    }

    /**
     * Find all authority group with or without any condition from repository.
     *
     * @return User array
     */
    @RequestMapping(value = "/api3", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public AppServiceAccessControl[] findAppServiceAccessControls(String appid, String condition, String ownerid) {
        try {
            return appServiceAccessControlBlo.findAccessControls(appid, condition, ownerid);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api4", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String saveAccessControls(String acs) {
        try {
            JSONArray jsonarr1 = new JSONArray(acs);
            if (jsonarr1.length() > 0) {
                AppServiceAccessControl[] controls = new AppServiceAccessControl[jsonarr1.length()];
                for (int i = 0; i < jsonarr1.length(); i++) {
                    JSONObject obj = jsonarr1.getJSONObject(i);
                    controls[i] = new AppServiceAccessControl();
                    controls[i].setAppServiceId(obj.getString("appServiceId"));
                    controls[i].setOrganizationId(obj.getString("organizationId"));
                    controls[i].setCreateDateTime(DateUtility.parseDatetime(obj.getString("createDateTime")));
                    controls[i].setOwner(obj.getString("owner"));
                }
                appServiceAccessControlBlo.addAccessControls(controls);
                return "{\"status\": \"1\"}"; // success
            } else
                return "{\"status\": \"0\"}"; // failed
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
    }


    @RequestMapping(value = "/api_1", method = RequestMethod.POST)
    @ResponseBody
    public String testAPI(String param2) {
        return "aaa" + "|" + param2;
    }

}
