package com.xq.myxuanqi.viewModel;

import android.app.Application;
import android.content.Context;
import android.support.annotation.NonNull;
import android.widget.Toast;

import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.User;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.xq.myxuanqi.http.HttpHelper;
import com.xq.myxuanqi.http.ICallBack;
import com.xq.myxuanqi.model.TelephoneLoginModel;
import com.xq.myxuanqi.util.LongTimeToDate;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by wm on 2019/1/21.
 */

public class ChangeTelephoneViewModel extends BaseViewModel {
    private Context mContext;
    public GetCodeOnCallBack mGetCodeOnCallBack;

    public interface GetCodeOnCallBack {
        void getCodeOnCallBackListener(int i);
    }
    public void setGetCodeOnCallBack(GetCodeOnCallBack getCodeOnCallBack){
        this.mGetCodeOnCallBack = getCodeOnCallBack;
    }
    public ChangeTelephoneViewModel(@NonNull Application application) {
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
                if (string.contains("1")){
                    mGetCodeOnCallBack.getCodeOnCallBackListener(0);
                }else {
                    //验证码获取失败
                    mGetCodeOnCallBack.getCodeOnCallBackListener(-1);
                }
            }

            @Override
            public void onFailed(String string) {
                //访问失败
                mGetCodeOnCallBack.getCodeOnCallBackListener(-2);
            }
        });
    }
    /*
    * 判断验证码是否正确
    * */
    public void isTrueVerifyTelephone(final String mobile, String verifyCode) {
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
                    Login login = SpUtil.getInstance().getLogin();
                    User user = login.getUser();
                    user.setMobile(mobile);
                    Gson gson1 = new GsonBuilder()
                            .registerTypeAdapter(Date.class, new LongTimeToDate())  //解析Date型时间
                            .create();
                    String json = gson1.toJson(user);
                    uploadMobile(json);
                }else {
                    //验证码不正确
                    mGetCodeOnCallBack.getCodeOnCallBackListener(-4);
                }
            }

            @Override
            public void onFailed(String string) {
                //访问失败
                mGetCodeOnCallBack.getCodeOnCallBackListener(-2);
            }
        });
    }
    /*
    * 修改手机号暂时使用修改基本信息的接口
    * */
    public void uploadMobile(String user) {
        String baseUrl = UrlUtils.getInstance().getApiUrl();
        String url = baseUrl + "api/service5/api10";
        Map<String, Object> map = new HashMap<>();
        map.put("userinfo",user);
        HttpHelper.getInstance().post(url, UrlUtils.getUserAgent(mContext), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                mGetCodeOnCallBack.getCodeOnCallBackListener(1);
            }

            @Override
            public void onFailed(String string) {
                Toast.makeText(mContext, "修改失败"+ string, Toast.LENGTH_SHORT).show();
            }
        });
    }
}
