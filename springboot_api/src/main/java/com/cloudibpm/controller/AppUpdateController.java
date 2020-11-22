package com.cloudibpm.controller;

import com.cloudibpm.blo.update.AppUpdateBlo;
import com.model.AppUpdate;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
@RequestMapping("/service37")
public class AppUpdateController {

	private final AppUpdateBlo appUpdateBlo;

	@Autowired
	public AppUpdateController(AppUpdateBlo appUpdateBlo) {
		this.appUpdateBlo = appUpdateBlo;
	}
	
	/**
	 * 查询更新
	 * @param appName
	 * @return
	 */
	@RequestMapping(value = "/api0", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public AppUpdate queryLastLiveNotice(String appName) {
		try {
			return appUpdateBlo.getLastUpdate(appName);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	@RequestMapping(value = "/api2", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	//这个创建系统消息的借口这么会用AppUpdate这个类啊？？？2019年3月22日11:30:42
	public String createSystemNotices(String appUpdateObject) {
		try {
			JSONObject obj = new JSONObject(appUpdateObject);
			AppUpdate appUpdate = new AppUpdate();
			if (!obj.isNull("pkVersionId")) {
				appUpdate.setPkVersionId(obj.getString("pkVersionId"));
			}
			if (!obj.isNull("appName")) {
				appUpdate.setAppName(obj.getString("appName"));
			}
			if (!obj.isNull("versionCode")) {
				appUpdate.setVersionCode(obj.getInt("versionCode"));
			}
			if (!obj.isNull("versionName")) {
				appUpdate.setVersionName(obj.getString("versionName"));
			}
			if (!obj.isNull("updateContent")) {
				appUpdate.setUpdateContent(obj.getString("updateContent"));
			}
			if (!obj.isNull("online")) {
				appUpdate.setOnline(obj.getInt("online"));
			}
			if (!obj.isNull("important")) {
				appUpdate.setImportant(obj.getInt("important"));
			}
			if (!obj.isNull("updateTime")) {
				appUpdate.setUpdateTime(obj.getLong("createDatetime"));
			}
			appUpdateBlo.createNotice(appUpdate);
			return "{\"status\": \"1\"}"; // success
		} catch (Exception e) {
			e.printStackTrace();
			return "{\"status\": \"0\"}"; // failed
		}
	}

}
