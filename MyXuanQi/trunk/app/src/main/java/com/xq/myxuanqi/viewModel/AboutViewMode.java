package com.xq.myxuanqi.viewModel;

import android.app.Application;
import android.arch.lifecycle.MutableLiveData;
import android.content.Context;
import android.content.Intent;
import android.support.annotation.NonNull;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.xq.myxuanqi.bean.AppUpdate;
import com.xq.myxuanqi.http.HttpHelper;
import com.xq.myxuanqi.http.ICallBack;
import com.xq.myxuanqi.util.DownloadUtils;
import com.xq.myxuanqi.util.EmptyUtils;
import com.xq.myxuanqi.util.LongTimeToDate;
import com.xq.myxuanqi.util.UrlUtils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by wm on 2019/1/18.
 * 关于页面
 */

public class AboutViewMode extends BaseViewModel {
    private MutableLiveData<AppUpdate> mAppUpdateLiveData = new MutableLiveData<>();
    private Context mContext;
    public CheckUpdateCallBack mCheckUpdateCallBack;
    public interface CheckUpdateCallBack{
        void setUpdate(int update,int versionCode);
    }
    public void setCheckUpdateCallBack(CheckUpdateCallBack checkUpdateCallBack){
        this.mCheckUpdateCallBack = checkUpdateCallBack;
    }
    public AboutViewMode(@NonNull Application application) {
        super(application);
        mContext = application;
    }

    public MutableLiveData<AppUpdate> getAppUpdateLiveData() {
        return mAppUpdateLiveData;
    }

    public void setAppUpdateLiveData(AppUpdate appUpdateLiveData) {
        mAppUpdateLiveData.setValue(appUpdateLiveData);
    }

    //检查更新
    public void checkUpdateApk(final int versionCode) {
        String baseUrl = UrlUtils.getInstance().getUrl();
        String url = baseUrl + "login/AppUpdateService";
        Map<String, Object> map = new HashMap<>();
        map.put("api", "0");
        map.put("appName", "myxuanqi.apk");
        HttpHelper.getInstance().get(url, UrlUtils.getUserAgent(mContext), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                if (EmptyUtils.isNotEmpty(string)){
                    Gson gson = new GsonBuilder()
                            .registerTypeAdapter(Date.class, new LongTimeToDate())  //解析Date型时间
                            .create();
                    AppUpdate appUpdate = gson.fromJson(string, AppUpdate.class);
                    int netVersionCode = appUpdate.getVersionCode();
                    if (netVersionCode > versionCode) {
                        //0:不重要 1：重要，强制更新
                        int update = appUpdate.getImportant();
                        mCheckUpdateCallBack.setUpdate(update,netVersionCode);
                    }else {
                        //不需要更新
                        mCheckUpdateCallBack.setUpdate(-1,0);
                    }
                }else {
                    //不需要更新
                    mCheckUpdateCallBack.setUpdate(-1,0);
                }


            }

            @Override
            public void onFailed(String string) {
                mCheckUpdateCallBack.setUpdate(-2,0);
            }

        });
    }

}
