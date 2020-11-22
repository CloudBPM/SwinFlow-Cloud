package com.xq.myxuanqi.viewModel;

import android.app.Application;
import android.arch.lifecycle.MutableLiveData;
import android.content.Context;
import android.support.annotation.NonNull;
import android.widget.Toast;

import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.User;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.xq.myxuanqi.http.HttpHelper;
import com.xq.myxuanqi.http.ICallBack;
import com.xq.myxuanqi.util.LongTimeToDate;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by wm on 2019/1/15.
 * 修改基本信息
 */

public class BasicInformationViewModel extends BaseViewModel {
    private MutableLiveData<User> mUser = new MutableLiveData<>();
    private Context mContext;
    public BasicInformationViewModel(@NonNull Application application) {
        super(application);
        mContext = application;
    }

    public MutableLiveData<User> getUser() {
        return mUser;
    }

    public void setUser(User user) {
        mUser.setValue(user);
    }

    public void uploadBasicInformation(final User user) {
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(Date.class, new LongTimeToDate())  //解析Date型时间
                .create();
        String userString = gson.toJson(user);
        String baseUrl = UrlUtils.getInstance().getApiUrl();
        String url = baseUrl+"api/service5/api10";
        Map<String, Object> map = new HashMap<>();
        map.put("userinfo",userString);
        HttpHelper.getInstance().post(url, UrlUtils.getUserAgent(mContext), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                User user1 = mUser.getValue();
                user1.setEmail(user.getEmail());
                user1.setPostcode(user.getPostcode());
                user1.setAddress(user.getAddress());
                user1.setCounty(user.getCounty());
                user1.setCity(user.getCity());
                user1.setProvince(user.getProvince());
                user1.setNation(user.getNation());
                user1.setAge(user.getAge());
                user1.setBloodType(user.getBloodType());
                user1.setWeight(user.getWeight());
                user1.setHeight(user.getHeight());
                user1.setBirthday(user.getBirthday());
                user1.setGender(user.getGender());
                user1.setGivenname(user.getGivenname());
                user1.setSurname(user.getSurname());
                user1.setUsedName(user.getUsedName());
                Login login = SpUtil.getInstance().getLogin();
                login.setUser(user1);
                SpUtil.getInstance().putLogin(login);
                Toast.makeText(mContext, "修改成功"+ string, Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailed(String string) {
                Toast.makeText(mContext, "修改失败"+ string, Toast.LENGTH_SHORT).show();
            }
        });
    }
}
