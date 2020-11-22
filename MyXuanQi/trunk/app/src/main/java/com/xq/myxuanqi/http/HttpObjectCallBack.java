package com.xq.myxuanqi.http;

import com.google.gson.Gson;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

/**
 * Created by xq0002 on 2018/11/29.
 * 接收对象
 */

public abstract class HttpObjectCallBack<Result> implements ICallBack {
    @Override
    public void onSuccess(String result) {
        Gson gson = new Gson();
        Class<?> cls = analysisClazzInfo(this);
        Result objResult = (Result)gson.fromJson(result,cls);
        onSuccess(objResult);
    }

    public abstract void onSuccess(Result result);

    public static Class<?> analysisClazzInfo(Object object){
        Type genType = object.getClass().getGenericSuperclass();
        Type[] params = ((ParameterizedType)genType).getActualTypeArguments();
        return (Class<?>) params[0];
    }
}
