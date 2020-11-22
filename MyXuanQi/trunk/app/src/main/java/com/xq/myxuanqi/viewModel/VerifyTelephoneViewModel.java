package com.xq.myxuanqi.viewModel;

import android.app.Application;
import android.content.Context;
import android.support.annotation.NonNull;

import com.google.gson.Gson;
import com.xq.myxuanqi.http.HttpHelper;
import com.xq.myxuanqi.http.ICallBack;
import com.xq.myxuanqi.model.TelephoneLoginModel;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by wm on 2019/1/21.
 * 验证手机号
 */

public class VerifyTelephoneViewModel extends BaseViewModel {
    private Context mContext;
    public GetCodeOnCallBack mGetCodeOnCallBack;

    public interface GetCodeOnCallBack {
        void getCodeOnCallBackListener(int i);
    }
    public void setGetCodeOnCallBack(GetCodeOnCallBack getCodeOnCallBack){
        this.mGetCodeOnCallBack = getCodeOnCallBack;
    }
    public VerifyTelephoneViewModel(@NonNull Application application) {
        super(application);
        mContext = application;
    }
    /*
    * 判断验证码是否获取成功
    * */
    public void getSecurityCode(String telephoneNum) {
        String baseUrl = UrlUtils.getInstance().getUrl();
        String url = baseUrl + "login/requestVerifyCodeService";
        Map<String, Object> map = new HashMap<>();
        map.put("api","1");
        map.put("mobile", telephoneNum);
        HttpHelper.getInstance().post(url, UrlUtils.getUserAgent(mContext), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                //根据返回值判断验证码是否获取成功
                Gson gson = new Gson();
                TelephoneLoginModel status = gson.fromJson(string, TelephoneLoginModel.class);
                if (status.getStatus().equals("1")){
                    mGetCodeOnCallBack.getCodeOnCallBackListener(0);
                }else {
                    //验证码获取失败
                    mGetCodeOnCallBack.getCodeOnCallBackListener(-1);
                }
            }

            @Override
            public void onFailed(String string) {
                //访问失败
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
    * 判断验证码是否正确
    * */
    public void isTrueVerifyTelephone(String mobile, String verifyCode) {
        String baseUrl = UrlUtils.getInstance().getUrl();
        String url = baseUrl + "login/requestVerifyCodeService";
        Map<String, Object> map = new HashMap<>();
        map.put("api","2");
        map.put("mobile", mobile);
        map.put("code", verifyCode);
        HttpHelper.getInstance().post(url, UrlUtils.getUserAgent(mContext), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                //根据返回值判断验证码是否正确
                if (string.contains("200")){
                    mGetCodeOnCallBack.getCodeOnCallBackListener(1);
                }else {
                    //验证码不正确
                    mGetCodeOnCallBack.getCodeOnCallBackListener(-4);
                }
            }

            @Override
            public void onFailed(String string) {
                //访问失败
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
