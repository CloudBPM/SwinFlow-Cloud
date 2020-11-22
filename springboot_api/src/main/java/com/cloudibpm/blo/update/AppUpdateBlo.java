package com.cloudibpm.blo.update;

import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.util.SystemConfig;
import com.cloudibpm.eso.update.AppUpdateEno;
import com.model.AppUpdate;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
//@Transactional
public class AppUpdateBlo extends BusinessLogicObject{

	    private final static String APPTARGET="/xq/xqpaas/apache-tomcat-9.0.14/webapps/login";
//	private final static String APPTARGET="D:\\abcd";

	private final AppUpdateEno appUpdateEso;
	private final BuildtimeIDGenerator buildtimeIDGenerator;

	@Autowired
	public AppUpdateBlo(AppUpdateEno appUpdateEso, BuildtimeIDGenerator buildtimeIDGenerator) {
		this.appUpdateEso = appUpdateEso;
		this.buildtimeIDGenerator = buildtimeIDGenerator;
	}

	public AppUpdate getLastUpdate(String appName) throws Exception {
		return appUpdateEso.queryLastUpdate(appName);
	}
	
	public void createNotice(AppUpdate appUpdate) throws Exception {
		if (appUpdate == null) {
			return;
		}
		appUpdate.setPkVersionId(buildtimeIDGenerator.getNewRunTimeID());
		appUpdateEso.insert(appUpdate);
	}

	/**
	 * 更新app
	 * @return
	 */
	public String uploadApp(String versionName, String updateContent, MultipartFile file, String passWord,String appName){
		if(!"1qaz!QAZ".equals(passWord)){
			return "密码输入错误！";
		}
		String type= SystemConfig.getProp("filestorage.type");
		if(!"linux".equals(type)){
			return "不支持Windows上传！";
		}
		AppUpdate oldApp=appUpdateEso.queryLastUpdate(appName);
		try {
			AppUpdate appUpdate=new AppUpdate();
			BeanUtils.copyProperties(oldApp,appUpdate);
			appUpdate.setVersionName(versionName);
			appUpdate.setUpdateContent(updateContent);
			appUpdate.setVersionCode(appUpdate.getVersionCode()+1);
			appUpdate.setUpdateTime(System.currentTimeMillis());
			Path dir= Paths.get(APPTARGET);
			Path apk=dir.resolve(appName);
			if(!Files.exists(dir)){
				Files.createDirectories(dir);
			}
			Files.deleteIfExists(apk);
			Files.write(apk,file.getBytes());
			appUpdateEso.insert(appUpdate);
			return "上传成功！";
		} catch (IOException e) {
			e.printStackTrace();
			return "系统异常，请联系管路员！";
		}
	}


}
