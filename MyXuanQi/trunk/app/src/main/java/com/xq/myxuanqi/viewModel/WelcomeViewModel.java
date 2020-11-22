package com.xq.myxuanqi.viewModel;

import android.app.Application;
import android.arch.lifecycle.MutableLiveData;
import android.content.Context;
import android.content.SharedPreferences;
import android.support.annotation.NonNull;
import android.text.TextUtils;

import com.xq.myxuanqi.model.WelcomeModel;
import com.xq.myxuanqi.util.SpUtil;

/**
 * Created by xq0002 on 2018/12/7.
 * 欢迎页面
 */

public class WelcomeViewModel extends BaseViewModel{
    private MutableLiveData<WelcomeModel> mWelcomeModel = new MutableLiveData<>();

    public WelcomeViewModel(@NonNull Application application) {
        super(application);
    }

    public void setWelcomeModel(String text) {
        mWelcomeModel.setValue(new WelcomeModel(text));
    }

    public MutableLiveData<WelcomeModel> getWelcomeModel() {
        return mWelcomeModel;
    }

    public int JumpTo(){
        String userName = SpUtil.getInstance().getStr("userName");
        String userPwd = SpUtil.getInstance().getStr("userPwd");
        boolean autoLogin = SpUtil.getInstance().getBoolean("autoLogin");
        if (TextUtils.isEmpty(userName) || TextUtils.isEmpty(userPwd)) {//不满足自动登录的条件
            return 0;
        }else if (autoLogin==true){
            //写入一个状态用于区分是从哪个页面进入的主页面
            SpUtil.getInstance().saveStr("login", "welcome");
            return 1;
        }else {
            return 0;
        }
    }
}
