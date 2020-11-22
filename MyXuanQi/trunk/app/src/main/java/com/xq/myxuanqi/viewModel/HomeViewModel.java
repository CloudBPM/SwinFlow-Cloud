package com.xq.myxuanqi.viewModel;

import android.app.Application;
import android.arch.lifecycle.MutableLiveData;
import android.content.Context;
import android.support.annotation.NonNull;

import com.alibaba.fastjson.JSON;
import com.cloudibpm.core.organization.Position;
import com.cloudibpm.core.util.serviceresult.CodeMessage;
import com.cloudibpm.core.util.serviceresult.ServiceResult;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.xq.myxuanqi.http.HttpHelper;
import com.xq.myxuanqi.http.ICallBack;
import com.xq.myxuanqi.util.EmptyUtils;
import com.xq.myxuanqi.util.LongTimeToDate;
import com.xq.myxuanqi.util.SerializableUtil;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import com.xq.myxuanqi.model.layoutBean.MbUiJSONParser;
import com.xq.myxuanqi.model.layoutBean.MobileUI;

import org.json.JSONObject;

/**
 * Created by xq0002 on 2018/12/8.
 * 首页
 */

public class HomeViewModel extends BaseViewModel {
    private MutableLiveData<MobileUI> mUIMutableLiveData = new MutableLiveData<>();
    private onHomeCallBack mOnCallBack;
    private Context        mContext;

    public interface onHomeCallBack {
        void onHomeCallBackListener(int i);
    }

    public void setOnHomeCallBack(onHomeCallBack onCallBack) {
        this.mOnCallBack = onCallBack;
    }

    public HomeViewModel(@NonNull Application application) {
        super(application);
        mContext = application;
    }

    public MutableLiveData<MobileUI> getUIMutableLiveData() {
        return mUIMutableLiveData;
    }

    public void setUIMutableLiveData(MobileUI mobileUI) {
        mUIMutableLiveData.setValue(mobileUI);
    }
    /*
    * 动态生成页面，获取页面数据
    * */
    public void getViewLayout() {
        String categoryId = "";
        try {
            Position position = (Position) SerializableUtil.str2Obj(SpUtil.getInstance().getStr("position"));
            categoryId = position.getCategoryId();
            if (categoryId == null) {
                categoryId = "";
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        UrlUtils urlUtils = UrlUtils.getInstance();
        String baseUrl = urlUtils.getApiUrl();
        String url = baseUrl + "api/service30/api10";
        Map<String, Object> map = new HashMap<>();
        map.put("id", categoryId);
        HttpHelper.getInstance().get(url, UrlUtils.getUserAgent(mContext), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                MobileUI mobileUI = null;
                if (string.equals("")) {
                    mOnCallBack.onHomeCallBackListener(1);
                } else {
                    try {
                        mobileUI = MbUiJSONParser.parseMbUI(string);
                        setUIMutableLiveData(mobileUI);
                        mOnCallBack.onHomeCallBackListener(0);
                    } catch (Exception e) {
                        mOnCallBack.onHomeCallBackListener(-1);
                    }
                }
            }

            @Override
            public void onFailed(String string) {
                //网络连接超时，重新扫描
                if (string.contains("java.net.SocketTimeoutException")){
                    mOnCallBack.onHomeCallBackListener(-2);
                }else {
                    mOnCallBack.onHomeCallBackListener(-1);
                }
            }
        });
    }

    public void refreshSession(String userName,String sessionId){
        String url = UrlUtils.getApiUrl() + "api/service0/api9";
        Map<String, Object> map = new HashMap<>();
        map.put("userName", userName);
        map.put("sessionId", sessionId);
        HttpHelper.getInstance().post(url, UrlUtils.getUserAgent(mContext), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                ServiceResult serviceResult = JSON.parseObject(string, ServiceResult.class);
                CodeMessage codeMessage = serviceResult.getCodeMessage();
                Map<String,Object> data = (Map<String, Object>) serviceResult.getData();
                long expire = (long) data.get("expire");
                autoClear(expire,userName,sessionId);
            }

            @Override
            public void onFailed(String string) {

            }
        });
    }

    //指定时间后自动更新
    private void autoClear(long expire,String userName,String sessionId) {
        long currentTimeMillis = System.currentTimeMillis();
        long l = (expire - currentTimeMillis) / (1000 * 60);
        if (l<100){
            refreshSession(userName,sessionId);
        }
    }
}
