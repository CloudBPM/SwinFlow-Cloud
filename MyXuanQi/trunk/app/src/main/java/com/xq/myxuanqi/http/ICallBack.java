package com.xq.myxuanqi.http;

import java.util.Map;

/**
 * Created by xq0002 on 2018/11/28.
 */

public interface ICallBack {
    void onSuccess(String string);

    void onFailed(String string);

//    Map<String,String> onParams();
//
//    Map<String,String> onHeaderParams();

//    Response<String> onCookie(Response<String> cookie);
}
