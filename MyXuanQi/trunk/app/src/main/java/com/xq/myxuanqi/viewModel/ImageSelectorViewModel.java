package com.xq.myxuanqi.viewModel;

import android.app.Application;
import android.arch.lifecycle.MutableLiveData;
import android.content.Context;
import android.support.annotation.NonNull;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.xq.myxuanqi.http.HttpHelper;
import com.xq.myxuanqi.http.ICallBack;
import com.xq.myxuanqi.model.UploadImageModel;
import com.xq.myxuanqi.util.LongTimeToDate;
import com.xq.myxuanqi.util.UrlUtils;

import java.io.File;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by wm on 2019/3/15.
 */

public class ImageSelectorViewModel extends BaseViewModel {
    private Context mContext;
    private MutableLiveData<UploadImageModel> mMutableLiveData = new MutableLiveData<>();
    private UploadImageListener mUploadImageListener;
    public interface UploadImageListener{
        void onUploadImageListener(int i);
    }

    public void setUploadImageListener(UploadImageListener uploadImageListener) {
        this.mUploadImageListener = uploadImageListener;
    }

    public ImageSelectorViewModel(@NonNull Application application) {
        super(application);
        mContext = application;
    }

    public MutableLiveData<UploadImageModel> getMutableLiveData() {
        return mMutableLiveData;
    }

    public void setMutableLiveData(UploadImageModel uploadImageModel) {
        mMutableLiveData.setValue(uploadImageModel);
    }

    public void uploadImage(File file, String uid, String fname, String flen, String mimetype){
        Map<String, Object> map = new HashMap<>();
        map.put("uid", uid);
        map.put("fname", fname);
        map.put("mimetype", mimetype);
        String url = UrlUtils.getApiUrl() + "api/service19/api33";
        HttpHelper.getInstance().uploadFile(url, UrlUtils.getUserAgent(mContext), file, map,"uploadFile", new ICallBack() {
            @Override
            public void onSuccess(String string) {
                Gson gson = new GsonBuilder()
                        .registerTypeAdapter(Date.class, new LongTimeToDate())  //解析Date型时间
                        .create();
                UploadImageModel uploadImageModel = gson.fromJson(string, UploadImageModel.class);
                if (uploadImageModel.getStatus().equals("1")){
                    mMutableLiveData.setValue(uploadImageModel);
                    mUploadImageListener.onUploadImageListener(0);
                }else {
                    mUploadImageListener.onUploadImageListener(-1);
                }
            }

            @Override
            public void onFailed(String string) {
                //网络连接超时
                if (string.contains("java.net.SocketTimeoutException")){
                    mUploadImageListener.onUploadImageListener(-2);
                }else {
                    mUploadImageListener.onUploadImageListener(-3);
                }
            }
        });
    }
}
