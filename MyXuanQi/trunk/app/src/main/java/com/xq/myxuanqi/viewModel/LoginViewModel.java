package com.xq.myxuanqi.viewModel;

import android.app.Application;
import android.arch.lifecycle.MutableLiveData;
import android.content.Context;
import android.graphics.BitmapFactory;
import android.support.annotation.NonNull;
import android.util.Log;
import android.webkit.WebView;

import com.cloudibpm.core.organization.AbstractPosition;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.Staff;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.xq.myxuanqi.bean.LoginMessage;
import com.xq.myxuanqi.http.DownloadListener;
import com.xq.myxuanqi.http.HttpHelper;
import com.xq.myxuanqi.http.ICallBack;
import com.xq.myxuanqi.ui.view.imgeSelector.PortraitBean;
import com.xq.myxuanqi.util.EmptyUtils;
import com.xq.myxuanqi.util.LongTimeToDate;
import com.xq.myxuanqi.util.SerializableUtil;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;

import com.xq.myxuanqi.model.LoginModel;

/**
 * Created by xq0002 on 2018/12/7.
 * 账号密码登录
 */

public class LoginViewModel extends BaseViewModel{
    private static final String TAG = "LoginViewModel";
    //com.xq.myxuanqi.model
    private MutableLiveData<LoginModel> mLoginModel = new MutableLiveData<>();
    private Context mContext;
    //监听回调
    private onCallBack mOnCallBack;
    public interface onCallBack{
        void onCallBackListener(int i);
    }
    public void setOnCallBack(onCallBack onCallBack){
        mOnCallBack = onCallBack;
    }

    public LoginViewModel(@NonNull Application application) {
        super(application);
        mContext = application;
    }

    public MutableLiveData<LoginModel> getLoginModel() {
        return mLoginModel;
    }

    public void setLoginModel(String account,String password) {
        mLoginModel.setValue(new LoginModel(account,password));
    }

    //sp中是否存在账号和密码
    public boolean isHasAccountPwd(){
        String userName = SpUtil.getInstance().getStr("userName");//账号
        String userPwd = SpUtil.getInstance().getStr("userPwd");//密码
        setLoginModel(SpUtil.getInstance().getStr("userName"),SpUtil.getInstance().getStr("userPwd"));
        if (SpUtil.getInstance().getStr("userPwd").equals("")){
            return false;
        }else {
            return true;
        }

    }
    //验证登录是否成功
    public void isLoginSuccess(final String account, final String password){
        HashMap<String, Object> map = new HashMap<>();
        map.put("username", account);
        map.put("password", password);
        map.put("loginType", "Android");
        UrlUtils urlUtils = UrlUtils.getInstance();
        String baseUrl = urlUtils.getUrl();
        String url = baseUrl+"login/Authenticate";
        String userAgentString = new WebView(mContext).getSettings().getUserAgentString();
        String userAgent = UrlUtils.getUserAgent(mContext);
        Log.e("登录错误用户名和密码", "user: " + account+"--password:"+password);
        //两种获取userAgent的对比
//        HttpHelper.getInstance().get(url, UrlUtils.getUserAgent(mContext), map, new ICallBack() {
        HttpHelper.getInstance().post(url, userAgentString, map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                Log.d(TAG, "onSuccess: " + string);
                Gson gson = new GsonBuilder()
                        .registerTypeAdapter(Date.class, new LongTimeToDate())  //解析Date型时间
                        .create();
                LoginMessage loginMessage = gson.fromJson(string, LoginMessage.class);
              if (loginMessage.getStatus().equals("1")){
                    //登录成功
                  SpUtil.getInstance().saveStr("userName", account);
                  SpUtil.getInstance().saveStr("userPwd", password);
                  SpUtil.getInstance().saveBoolean("autoLogin", true);
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
                      boolean staff = SpUtil.getInstance().saveStr("staff", "");
                      SpUtil.getInstance().saveStr("position", "");
                  }
                  //回调 0：成功  1：失败
                  mOnCallBack.onCallBackListener(0);
                }else {
                    //登录失败
                    SpUtil.getInstance().saveStr("userPwd", "");
                    mOnCallBack.onCallBackListener(-1);
                }
            }
            @Override
            public void onFailed(String string) {
                //网络连接超时
                if (string.contains("java.net.SocketTimeoutException")){
                    mOnCallBack.onCallBackListener(-2);
                }else {
                    mOnCallBack.onCallBackListener(-3);
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
                PortraitBean.bitmap = BitmapFactory.decodeFile(path);
            }

            @Override
            public void onFail(String errorInfo) {
            }
        });
    }
}
