package com.xq.myxuanqi;

import android.app.Application;
import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.support.multidex.MultiDex;

import com.qihoo360.replugin.RePlugin;
import com.xq.myxuanqi.handler.CrashHandler;
import com.xq.myxuanqi.http.HttpHelper;
import com.xq.myxuanqi.http.RetrofitProcessor;

import com.xq.myxuanqi.util.SpUtil;

import org.litepal.LitePal;


/**
 * Created by xq0002 on 2018/11/3.
 */

public class MyApplication extends Application {
    private static Context mContext;

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(base);
        RePlugin.App.attachBaseContext(this);
    }

    @Override
    public void onCreate() {
        super.onCreate();
        mContext = getApplicationContext();
        SpUtil.initSharedPreference(mContext);
        RePlugin.App.onCreate();
        CrashHandler.getInstance().init(mContext);
        //初始化网络请求代理
        HttpHelper.init(new RetrofitProcessor());
        //初始化数据库
        LitePal.initialize(this);
        SQLiteDatabase db = LitePal.getDatabase();
    }
    public static Context getContext(){
        return mContext;
    }

}
