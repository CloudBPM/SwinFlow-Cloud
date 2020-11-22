package com.xq.myxuanqi.viewModel;

import android.app.Application;
import android.content.Context;
import android.graphics.BitmapFactory;
import android.support.annotation.NonNull;

import com.xq.myxuanqi.http.DownloadListener;
import com.xq.myxuanqi.http.HttpHelper;
import com.xq.myxuanqi.http.HttpProcessor;
import com.xq.myxuanqi.http.ICallBack;
import com.xq.myxuanqi.ui.view.imgeSelector.PortraitBean;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by wm on 2019/2/22.
 */

public class ClipImageViewModel extends BaseViewModel {
    private Context                  mContext;
    private UploadPortraitOnCallBack mUploadPortraitOnCallBack;

    public ClipImageViewModel(@NonNull Application application) {
        super(application);
        this.mContext = application;
    }

    public interface UploadPortraitOnCallBack {
        void upload(int success);
    }

    public void setUploadPortraitOnCallBack(UploadPortraitOnCallBack uploadPortraitOnCallBack) {
        mUploadPortraitOnCallBack = uploadPortraitOnCallBack;
    }

    //头像上传
    public void uploadPortrait(File file, String userId) {
        String api = "14";
        String baseUrl = UrlUtils.getInstance().getApiUrl();
        String url = baseUrl + "api/service5/api" + api;
        Map<String, Object> map = new HashMap<>();
        map.put("userId", userId);
        map.put("fileName", file.getName());
        HttpHelper.getInstance().uploadFile(url, UrlUtils.getUserAgent(mContext), file, map,"file", new ICallBack() {
            @Override
            public void onSuccess(String string) {
                if ("success".equals(string)) {
                    String path = mContext.getCacheDir()+"/Pictures/"+ userId+".png";
                    downloadPortrait(userId,path);
                    mUploadPortraitOnCallBack.upload(0);
                } else {
                    mUploadPortraitOnCallBack.upload(-1);
                }
            }

            @Override
            public void onFailed(String string) {
                //网络连接超时
                if (string.contains("java.net.SocketTimeoutException")) {
                    mUploadPortraitOnCallBack.upload(-2);
                } else {
                    mUploadPortraitOnCallBack.upload(-3);
                }
            }
        });
    }

    //下载个人头像
    public void downloadPortrait(String userId,String path){
        String url = UrlUtils.getUrl()+"file/usr/" + userId+"/portrait/"+ userId +".png";
        HttpHelper.getInstance().downloadFile(url, path, new DownloadListener() {
            @Override
            public void onStart() {

            }

            @Override
            public void onProgress(int progress) {

            }

            @Override
            public void onFinish(String path) {
                PortraitBean.bitmap = BitmapFactory.decodeFile(path);
            }

            @Override
            public void onFail(String errorInfo) {
            }
        });
    }
}
