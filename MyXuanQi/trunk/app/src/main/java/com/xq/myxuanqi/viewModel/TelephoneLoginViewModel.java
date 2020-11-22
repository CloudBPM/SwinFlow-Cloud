package com.xq.myxuanqi.viewModel;

import android.app.Application;
import android.arch.lifecycle.MutableLiveData;
import android.content.Context;
import android.support.annotation.NonNull;

import com.cloudibpm.core.organization.AbstractPosition;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.Staff;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.xq.myxuanqi.bean.LoginMessage;
import com.xq.myxuanqi.http.DownloadListener;
import com.xq.myxuanqi.http.HttpHelper;
import com.xq.myxuanqi.http.ICallBack;
import com.xq.myxuanqi.model.TelephoneLoginModel;
import com.xq.myxuanqi.util.EmptyUtils;
import com.xq.myxuanqi.util.LongTimeToDate;
import com.xq.myxuanqi.util.SerializableUtil;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import retrofit2.http.Url;

/**
 * Created by wm on 2019/1/15.
 * 手机号登录
 */

public class TelephoneLoginViewModel extends BaseViewModel {
    private MutableLiveData<TelephoneLoginModel> mTelephoneLoginModel = new MutableLiveData<>();
    private Context mContext;
    public GetCodeOnCallBack mGetCodeOnCallBack;


    public interface GetCodeOnCallBack {
        void getCodeOnCallBackListener(int i);
    }
    public void setGetCodeOnCallBack(GetCodeOnCallBack getCodeOnCallBack){
        this.mGetCodeOnCallBack = getCodeOnCallBack;
    }
    public TelephoneLoginViewModel(@NonNull Application application) {
        super(application);
        mContext = application;
    }

    public MutableLiveData<TelephoneLoginModel> getTelephoneLoginModel() {
        return mTelephoneLoginModel;
    }

    public void setTelephoneLoginModel(TelephoneLoginModel telephoneLoginModel) {
        mTelephoneLoginModel.setValue(telephoneLoginModel);
    }
    /*
    * 设置昵称
    * */
    public void setUsedName(final String name) {
        String url = UrlUtils.getApiUrl() + "api/service0/api7";
        Map<String, Object> map = new HashMap<>();
        String id = SpUtil.getInstance().getLogin().getUser().getId();
        map.put("name", name);
        map.put("userId", id);
        HttpHelper.getInstance().post(url, UrlUtils.getUserAgent(mContext), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                //根据返回值判断账号是否存在
                if (string.equals("true")){
                }else {
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
                    mGetCodeOnCallBack.getCodeOnCallBackListener(1);
                }else {
                    //验证码获取失败
                    mGetCodeOnCallBack.getCodeOnCallBackListener(-4);
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
    //验证手机号验证码登录是否成功
    public void isSuccessTelLogin(String telNum, String securityCode) {
        String url = UrlUtils.getApiUrl() + "api/service0/api6";
        Map<String, Object> map = new HashMap<>();
        map.put("phoneNumber", telNum);
        map.put("code", securityCode);
        HttpHelper.getInstance().post(url, UrlUtils.getUserAgent(mContext), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                Gson gson = new GsonBuilder()
                        .registerTypeAdapter(Date.class, new LongTimeToDate())  //解析Date型时间
                        .create();

                LoginMessage loginMessage = gson.fromJson(string, LoginMessage.class);
                if (loginMessage.getStatus().equals("4")){
                    //登录成功
                    Login login = loginMessage.getLogin();
                    SpUtil.getInstance().putLogin(login);
                    SpUtil.getInstance().saveStr("sessionId",loginMessage.getSessionId());
                    String path = mContext.getCacheDir()+"/Pictures/"+ login.getUser().getId()+".png";
                    downloadPortrait(login.getUser().getId(),path);
                    if (EmptyUtils.isNotEmpty(login.getStaffships())){
                        try {
                            //默认存下第一个staff信息
                            Staff staff = login.getStaffships()[0];
                            SpUtil.getInstance().saveStr("staff", SerializableUtil.obj2Str(staff));
                            if (EmptyUtils.isNotEmpty(login.getPositions())){
                                //默认存下第一个position信息
                                AbstractPosition abstractPosition = login.getPositions()[0];
                                SpUtil.getInstance().saveStr("position", SerializableUtil.obj2Str(abstractPosition));
                            }
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }else {
                        SpUtil.getInstance().saveStr("staff", "");
                        SpUtil.getInstance().saveStr("position", "");
                    }
                    mGetCodeOnCallBack.getCodeOnCallBackListener(2);

                }else{
                    if (loginMessage.getStatus().equals("3")){
                        mGetCodeOnCallBack.getCodeOnCallBackListener(-1);
                    }else if (loginMessage.getStatus().equals("0")){
                        mGetCodeOnCallBack.getCodeOnCallBackListener(-5);
                    }else if (loginMessage.getStatus().equals("2")){
                        mGetCodeOnCallBack.getCodeOnCallBackListener(-6);
                    }
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
    //下载个人头像
    public void downloadPortrait(String userId,String path){
        String url = UrlUtils.getUrl()+"file/usr/" + userId+"/portrait/"+ userId +".png";
        HttpHelper.getInstance().downloadFile(url, path, new DownloadListener() {
            @Override
            public void onStart() {

            }

            @Override
            public void onProgress(int progress) {

            }

            @Override
            public void onFinish(String path) {

            }

            @Override
            public void onFail(String errorInfo) {

            }
        });
    }
}
