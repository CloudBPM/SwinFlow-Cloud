package com.xq.myxuanqi.http;

import android.content.SharedPreferences;

import com.xq.myxuanqi.MyApplication;

import java.io.IOException;
import java.util.HashSet;

import okhttp3.Interceptor;
import okhttp3.Response;

/**
 * Created by wm on 2019/1/18.
 * 首次请求添加cookie
 */

public class ReceivedCookiesInterceptor implements Interceptor {
    @Override
    public Response intercept(Chain chain) throws IOException {
        Response originalResponse = chain.proceed(chain.request());
        if (!originalResponse.headers("Set-Cookie").isEmpty()) {
            HashSet<String> cookies = new HashSet<>();

            for (String header : originalResponse.headers("Set-Cookie")) {
                cookies.add(header);
            }
            SharedPreferences.Editor config = MyApplication.getContext().getSharedPreferences("config", MyApplication.getContext().MODE_PRIVATE)
                    .edit();
            config.putStringSet("cookie", cookies);
            config.commit();
        }
        return originalResponse;
    }
}
