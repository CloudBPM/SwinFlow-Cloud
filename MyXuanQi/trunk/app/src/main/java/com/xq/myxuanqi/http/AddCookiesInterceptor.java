package com.xq.myxuanqi.http;

import android.util.Log;

import com.xq.myxuanqi.MyApplication;

import java.io.IOException;
import java.util.HashSet;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Created by wm on 2019/1/18.
 * 非首次请求添加cookie
 */

public class AddCookiesInterceptor implements Interceptor {
    @Override
    public Response intercept(Chain chain) throws IOException {
        Request.Builder builder = chain.request().newBuilder();
        HashSet<String> preferences = (HashSet) MyApplication.getContext().getSharedPreferences("config",
                MyApplication.getContext().MODE_PRIVATE).getStringSet("cookie", null);
        if (preferences != null) {
            for (String cookie : preferences) {
                builder.addHeader("Cookie", cookie);
                // This is done so I know which headers are being added; this interceptor is used after the normal logging of OkHttp
                Log.v("OkHttp", "Adding Header: " + cookie);
            }
        }
        return chain.proceed(builder.build());
    }
}
