package com.xq.myxuanqi.util;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;

import java.io.IOException;
import java.io.StreamCorruptedException;

import com.cloudibpm.core.user.Login;

/**
 * Created by xq0002 on 2019/1/3.
 * Sp存储工具类
 */

public class SpUtil {
    // 用户名key
    public final static String KEY_NAME = "KEY_NAME";
    //用于指纹
    public final static String IVKeyName = "IV";

    public final static String KEY_LEVEL = "KEY_LEVEL";

    private static SpUtil s_SharedPreUtil;

    private static Login s_User = null;

    private SharedPreferences msp;

    // 初始化，一般在应用启动之后就要初始化
    public static synchronized void initSharedPreference(Context context)
    {
        if (s_SharedPreUtil == null)
        {
            s_SharedPreUtil = new SpUtil(context);
        }
    }

    /**
     * 获取唯一的instance
     *
     * @return
     */
    public static synchronized SpUtil getInstance()
    {
        return s_SharedPreUtil;
    }

    @SuppressLint("WrongConstant")
    public SpUtil(Context context)
    {
        msp = context.getSharedPreferences("SharedPreUtil",
                Context.MODE_PRIVATE | Context.MODE_APPEND);
    }

    public SharedPreferences getSharedPref()
    {
        return msp;
    }

    //保存登录信息
    public synchronized void putLogin(Login user)
    {

        SharedPreferences.Editor editor = msp.edit();

        String str="";
        try {
            str = SerializableUtil.obj2Str(user);
        } catch (IOException e) {
            e.printStackTrace();
        }
        editor.putString(KEY_NAME,str);
        editor.commit();

        s_User = user;
    }
    //获取用户信息
    public synchronized Login getLogin()
    {

        if (s_User == null)
        {
            s_User = new Login();


            //获取序列化的数据
            String str = msp.getString(SpUtil.KEY_NAME, "");

            try {
                Object obj = SerializableUtil.str2Obj(str);
                if(obj != null){
                    s_User = (Login)obj;
                }

            } catch (StreamCorruptedException e) {

                e.printStackTrace();
            } catch (IOException e) {

                e.printStackTrace();
            }
        }

        return s_User;
    }
    //删除用户信息
    public synchronized void DeleteUser()
    {
        SharedPreferences.Editor editor = msp.edit();
        editor.putString(KEY_NAME,"");

        editor.commit();
        s_User = null;
    }

    //保存字符串信息
    public boolean saveStr(String iv, String s) {
        SharedPreferences.Editor editor = msp.edit();
        editor.putString(iv,s);
        return editor.commit();
    }
    //获取字符串信息
    public String getStr(String iv){
        return msp.getString(iv, "");
    }
    //保存boolean信息
    public void saveBoolean(String iv, Boolean b) {
        SharedPreferences.Editor editor = msp.edit();
        editor.putBoolean(iv,b);
        editor.commit();
    }
    //获取boolean信息
    public Boolean getBoolean(String iv){
        return msp.getBoolean(iv, true);
    }
}
