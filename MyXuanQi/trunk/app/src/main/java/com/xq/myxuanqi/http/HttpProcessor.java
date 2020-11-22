package com.xq.myxuanqi.http;

import java.io.File;
import java.io.IOException;
import java.util.Map;

/**
 * Created by xq0002 on 2018/11/28.
 */

public interface HttpProcessor {
   /* void get(String url, Map<String,String> params, ICallBack callback);
    void post(String url, Map<String,String> params, ICallBack callback);*/
    //异步
    void post(String url, String userAgent, Map<String,Object> params, final ICallBack callback);
    void get(String url, String userAgent, Map<String,Object> params, final ICallBack callback);
    void downloadFile(String url, final String path, final DownloadListener downloadListener);
    void uploadFile(String url, String userAgent, File file, Map<String,Object> map, String fileType, ICallBack iCallBack);
    //无请求头
    void get(String url, Map<String, Object> params, final ICallBack callback);
    //同步
    retrofit2.Response<String> getSync(String url, Map<String,Object> params) throws IOException;
}
