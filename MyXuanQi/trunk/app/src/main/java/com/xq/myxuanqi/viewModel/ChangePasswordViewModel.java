package com.xq.myxuanqi.viewModel;

import android.app.Application;
import android.content.Context;
import android.support.annotation.NonNull;
import android.widget.Toast;

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
 * 修改密码
 */

public class ChangePasswordViewModel extends BaseViewModel {
    private Context mContext;
    public ChangePasswordOnCallBack mPasswordOnCallBack;
    public interface ChangePasswordOnCallBack {
        void isSuccessChangePassword(int i);
    }
    public void setChangePasswordOnCallBack(ChangePasswordOnCallBack changePasswordOnCallBack){
        this.mPasswordOnCallBack = changePasswordOnCallBack;
    }
    public ChangePasswordViewModel(@NonNull Application application) {
        super(application);
        mContext = application;
    }
    /*
    * 修改密码
    * */
    public void changePwd(String userName,String pwd){
        String baseUrl = UrlUtils.getInstance().getApiUrl();
        String url = baseUrl + "api/service5/api13";
        Map<String, Object> map = new HashMap<>();
        map.put("userName",userName);
        map.put("password", pwd);
        HttpHelper.getInstance().post(url, UrlUtils.getUserAgent(mContext), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                if (string.contains("1")){
                    mPasswordOnCallBack.isSuccessChangePassword(0);
                }else {
                    mPasswordOnCallBack.isSuccessChangePassword(-1);
                }

            }

            @Override
            public void onFailed(String string) {
                mPasswordOnCallBack.isSuccessChangePassword(-2);
            }
        });
    }
}
