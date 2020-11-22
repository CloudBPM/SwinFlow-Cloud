package com.cloudibpm.core.appservice;

import com.cloudibpm.core.MicroService;

/**
 *
 */
public class AndroidAppPlugin extends MicroService {
    private int versionCode = 1;
    private String versionName = "1.0";
    private String alias = "";
    private String apkFileName = null;
    private String deveoplerId = null;
    private String lastupdateInfo = null;

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public String getApkFileName() {
        return apkFileName;
    }

    public void setApkFileName(String apkFileName) {
        this.apkFileName = apkFileName;
    }

    public int getVersionCode() {
        return versionCode;
    }

    public void setVersionCode(int versionCode) {
        this.versionCode = versionCode;
    }

    public String getVersionName() {
        return versionName;
    }

    public void setVersionName(String versionName) {
        this.versionName = versionName;
    }

    public String getDeveoplerId() {
        return deveoplerId;
    }

    public void setDeveoplerId(String deveoplerId) {
        this.deveoplerId = deveoplerId;
    }

    public String getLastupdateInfo() {
        return lastupdateInfo;
    }

    public void setLastupdateInfo(String lastupdateInfo) {
        this.lastupdateInfo = lastupdateInfo;
    }
}
