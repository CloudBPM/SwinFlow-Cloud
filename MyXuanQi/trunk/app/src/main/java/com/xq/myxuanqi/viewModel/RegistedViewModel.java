package com.xq.myxuanqi.viewModel;

import android.app.Application;
import android.content.Context;
import android.support.annotation.NonNull;
import android.widget.Toast;

import com.alibaba.fastjson.JSONObject;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.util.serviceresult.CodeMessage;
import com.cloudibpm.core.util.serviceresult.ServiceResult;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.xq.myxuanqi.http.HttpHelper;
import com.xq.myxuanqi.http.ICallBack;
import com.xq.myxuanqi.util.LongTimeToDate;
import com.xq.myxuanqi.util.UrlUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by wm on 2019/4/11.
 */

public class RegistedViewModel extends BaseViewModel {
    private Context mContext;
    //监听回调
    private onCallBack mOnCallBack;

    public void setRegistedUser(String code, String phoneNumber, String name, String orgId, String password) {
        String url = UrlUtils.getApiUrl() + "api/service0/api10";
        HashMap<String, Object> map = new HashMap<>();
        map.put("code", code);
        map.put("phoneNumber", phoneNumber);
        map.put("name", name);
        map.put("orgId", orgId);
        map.put("password", password);
        HttpHelper.getInstance().post(url, UrlUtils.getUserAgent(mContext), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                ServiceResult serviceResult = JSONObject.parseObject(string, ServiceResult.class);
                //                ServiceResult serviceResult1 = gson.fromJson(string, ServiceResult.class);
                if (serviceResult.isSuccess()){ //注册成功
                    mGetCodeOnCallBack.getCodeOnCallBackListener(1);
                }else {
                    CodeMessage codeMessage = serviceResult.getCodeMessage();
                    String message = codeMessage.getMessage();
                    Toast.makeText(mContext, message, Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailed(String string) {
                //网络连接超时，重新扫描
                if (string.equals("java.net.SocketTimeoutException: timeout")){
                    mGetCodeOnCallBack.getCodeOnCallBackListener(-2);
                }else {
                    mGetCodeOnCallBack.getCodeOnCallBackListener(-3);
                }
            }
        });
    }

    public interface onCallBack{
        void onCallBackListener(List<Organization> list,int status);
    }
    public void setOnCallBack(onCallBack onCallBack){
        mOnCallBack = onCallBack;
    }
    private GetCodeOnCallBack mGetCodeOnCallBack;


    public interface GetCodeOnCallBack {
        void getCodeOnCallBackListener(int i);
    }
    public void setGetCodeOnCallBack(GetCodeOnCallBack getCodeOnCallBack){
        this.mGetCodeOnCallBack = getCodeOnCallBack;
    }
    public RegistedViewModel(@NonNull Application application) {
        super(application);
        mContext = application;
    }

    public void getCompanyName() {
        String url = UrlUtils.getApiUrl() + "api/service2/api27";
        HashMap<String, Object> map = new HashMap<>();
        HttpHelper.getInstance().post(url, UrlUtils.getUserAgent(mContext), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                ServiceResult<List<Organization>> serviceResult = JSONObject.parseObject(string, ServiceResult.class);
//                ServiceResult serviceResult1 = gson.fromJson(string, ServiceResult.class);
                if (serviceResult.isSuccess()){ //有单位列表
                    List<Organization> data = serviceResult.getData();
                    mOnCallBack.onCallBackListener(data,0);
                }else { //无单位列表
                    List<Organization> data = new ArrayList<>();
                    Organization organization = new Organization();
                    organization.setName("无");
                    data.add(organization);
                    mOnCallBack.onCallBackListener(data,-1);
                }
            }

            @Override
            public void onFailed(String string) {
                List<Organization> data = new ArrayList<>();
                //网络连接超时，重新扫描
                if (string.equals("java.net.SocketTimeoutException: timeout")){
                    mOnCallBack.onCallBackListener(data,-2);
                }else {
                    mOnCallBack.onCallBackListener(data,-3);
                }
            }
        });
    }
    /*
   * 判断验证码是否获取成功
   * */
    public void getSecurityCode(String telephoneNum) {
        String url = UrlUtils.getApiUrl() + "api/service0/api5";
        Map<String, Object> map = new HashMap<>();
        map.put("phoneNumber", telephoneNum);
        HttpHelper.getInstance().post(url, UrlUtils.getUserAgent(mContext), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                //根据返回值判断验证码是否获取成功
                if (string.equals("true")){
                    mGetCodeOnCallBack.getCodeOnCallBackListener(0);
                }else {
                    //验证码获取失败
                    mGetCodeOnCallBack.getCodeOnCallBackListener(-1);
                }
            }

            @Override
            public void onFailed(String string) {
                //网络连接超时，重新扫描
                if (string.equals("java.net.SocketTimeoutException: timeout")){
                    mGetCodeOnCallBack.getCodeOnCallBackListener(-2);
                }else {
                    mGetCodeOnCallBack.getCodeOnCallBackListener(-3);
                }
            }
        });
    }
}
