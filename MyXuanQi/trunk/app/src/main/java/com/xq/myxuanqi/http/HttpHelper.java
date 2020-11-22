package com.xq.myxuanqi.http;

import java.io.File;
import java.io.IOException;
import java.util.Map;

/**
 * Created by xq0002 on 2018/11/28.
 */

public class HttpHelper implements HttpProcessor {
    private static HttpProcessor mHttpProcessor;
    public static void init(HttpProcessor processor) {
        mHttpProcessor = processor;
    }
    public static HttpHelper getInstance(){
        return SingHolder.instance;
    }
   /* @Override
    public void get(String url, Map<String, String> params, ICallBack callback) {
        mHttpProcessor.get(url,params,callback);
    }

    @Override
    public void post(String url, Map<String, String> params, ICallBack callback) {
        mHttpProcessor.post(url,params,callback);
    }
*/
    @Override
    public void post(String url, String userAgent, Map<String, Object> params, ICallBack callback) {
        mHttpProcessor.post(url,userAgent,params,callback);
    }

    @Override
    public void get(String url, String userAgent, Map<String, Object> params, ICallBack callback) {
        mHttpProcessor.get(url,userAgent,params,callback);
    }

    @Override
    public void downloadFile(String url, String path, DownloadListener downloadListener) {
        mHttpProcessor.downloadFile(url,path,downloadListener);
    }

    @Override
    public void uploadFile(String url, String userAgent, File file, Map<String, Object> map, String fileType, ICallBack iCallBack) {
        mHttpProcessor.uploadFile(url,userAgent,file,map,fileType,iCallBack);
    }

    @Override
    public void get(String url, Map<String, Object> params, ICallBack callback) {
        mHttpProcessor.get(url,params,callback);
    }

    @Override
    public retrofit2.Response<String> getSync(String url, Map<String, Object> params) throws IOException {
        return mHttpProcessor.getSync(url,params);
    }

    private static class SingHolder {
        public static HttpHelper instance = new HttpHelper();
    }
}
