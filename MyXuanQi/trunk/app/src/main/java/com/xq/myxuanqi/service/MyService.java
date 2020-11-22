package com.xq.myxuanqi.service;

import android.app.Service;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;

import com.alibaba.fastjson.JSON;
import com.cloudibpm.core.organization.AbstractPosition;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.Staff;
import com.cloudibpm.core.util.serviceresult.CodeMessage;
import com.cloudibpm.core.util.serviceresult.ServiceResult;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.bean.AppUpdate;
import com.xq.myxuanqi.http.DownloadListener;
import com.xq.myxuanqi.http.HttpHelper;
import com.xq.myxuanqi.http.ICallBack;
import com.xq.myxuanqi.ui.activity.LoginActivity;
import com.xq.myxuanqi.util.DownloadUtils;
import com.xq.myxuanqi.util.EmptyUtils;
import com.xq.myxuanqi.util.LongTimeToDate;
import com.xq.myxuanqi.util.SerializableUtil;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.ToastUtils;
import com.xq.myxuanqi.util.UrlUtils;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

/**
 * app更新service
 */
public class MyService extends Service {
    private int flag = 0;

    public MyService() {
    }

    @Override
    public IBinder onBind(Intent intent) {

        throw new UnsupportedOperationException("Not yet implemented");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        flags = START_FLAG_REDELIVERY;
        if (flag % 2 == 0){
            flag++;
            // 开启线程
            Timer timer = new Timer();
            TimerTask task = new TimerTask() {
                @Override
                public void run() {
                    //获取服务器App版本号并与本地版本号比较
                    getNetVersionCode();
                }
            };
            timer.schedule(task, 1, 60000);
        }
        Timer timer1 = new Timer();
        TimerTask timerTask1 = new TimerTask() {
            @Override
            public void run() {
                Login login = SpUtil.getInstance().getLogin();
                refreshSession(login.getUser().getName(),SpUtil.getInstance().getStr("sessionId"));
            }
        };
        timer1.schedule(timerTask1,1,6*10000*5);
        return super.onStartCommand(intent, flags, startId);
    }

    private void getNetVersionCode() {
        //获取本地App版本号
        final int versionCode = DownloadUtils.getVersionCode(getBaseContext());
        String baseUrl = UrlUtils.getInstance().getUrl();
        String url = baseUrl + "login/AppUpdateService";
        Map<String, Object> map = new HashMap<>();
        map.put("api", "0");
        map.put("appName", "myxuanqi.apk");
        HttpHelper.getInstance().get(url, UrlUtils.getUserAgent(getApplicationContext()), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                Gson gson = new GsonBuilder()
                        .registerTypeAdapter(Date.class, new LongTimeToDate())  //解析Date型时间
                        .create();
                int update = -1;
                if (EmptyUtils.isNotEmpty(string)){
                    AppUpdate appUpdate = gson.fromJson(string, AppUpdate.class);
                    int netVersionCode = appUpdate.getVersionCode();
                    //                                int netVersionCode = 0;
                    if (netVersionCode > versionCode) {
                        //0:不重要 1：重要，强制更新
                        update = appUpdate.getImportant();
                        //                                        update = 0;
                    }
                    Intent intent = new Intent();
                    intent.putExtra("update", update);
                    intent.putExtra("versionCode", netVersionCode);
                    intent.setAction("android.app.update");
                    intent.setPackage(getPackageName());
                    sendBroadcast(intent);
                }

            }

            @Override
            public void onFailed(String string) {

            }

        });
    }

    public void refreshSession(String userName,String sessionId){
        String url = UrlUtils.getApiUrl() + "api/service0/api9";
        Map<String, Object> map = new HashMap<>();
        map.put("userName", userName);
        map.put("sessionId", sessionId);
        HttpHelper.getInstance().post(url, UrlUtils.getUserAgent(getBaseContext()), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                ServiceResult serviceResult = JSON.parseObject(string, ServiceResult.class);
                CodeMessage codeMessage = serviceResult.getCodeMessage();
                Map<String,Object> data = (Map<String, Object>) serviceResult.getData();
                if (EmptyUtils.isNotEmpty(data.get("login"))){
                    Login login=JSON.parseObject(JSON.toJSONString(data.get("login")),Login.class);
//                    Login login = (Login) data.get("login");
                    SpUtil.getInstance().putLogin(login);
                    SpUtil.getInstance().saveStr("sessionId",(String)data.get("sessionId"));
                    String path = getBaseContext().getCacheDir()+"/Pictures/"+ login.getUser().getId()+".jpg";
                    downloadPortrait(login.getUser().getId(),path);
                    if (EmptyUtils.isNotEmpty(login.getStaffships())){
                        try {
                            Staff staff = (Staff) SerializableUtil.str2Obj(SpUtil.getInstance().getStr("staff"));
                            int company_position = -1;
                            for (int i=0;i<login.getStaffships().length;i++){
                                if (login.getStaffships()[i].getOwner()==staff.getOwner()){
                                    company_position = i;
                                }
                            }
                            if (company_position!=-1){
                                SpUtil.getInstance().saveStr("staff", SerializableUtil.obj2Str(login.getStaffships()[company_position]));
                            }else {
                                //默认存下第一个staff信息
                                SpUtil.getInstance().saveStr("staff", SerializableUtil.obj2Str(login.getStaffships()[0]));
                            }
                            AbstractPosition abstractPosition = (AbstractPosition) SerializableUtil.str2Obj(SpUtil.getInstance().getStr("position"));
                            int position = -1;
                            if (EmptyUtils.isNotEmpty(login.getPositions())){
                                for (int i=0;i<login.getPositions().length;i++){
                                    if (login.getPositions()[i].getOwner()==abstractPosition.getOwner()){
                                        position = i;
                                    }
                                }
                                if (position!=-1){
                                    SpUtil.getInstance().saveStr("position", SerializableUtil.obj2Str(login.getPositions()[position]));
                                }else {
                                    //默认存下第一个position信息
                                    SpUtil.getInstance().saveStr("position", SerializableUtil.obj2Str(login.getPositions()[0]));
                                }
                            }
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }else {
                        SpUtil.getInstance().saveStr("staff", "");
                        SpUtil.getInstance().saveStr("position", "");
                    }
                }
            }

            @Override
            public void onFailed(String string) {

            }
        });
    }
    //下载个人头像
    public void downloadPortrait(String userId,String path){
        String url = UrlUtils.getUrl()+"file/usr/" + userId+"/portrait/"+ userId +".jpg";
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
    @Override
    public void onTaskRemoved(Intent rootIntent) {
        super.onTaskRemoved(rootIntent);
        onCreate();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        onCreate();
    }
}
