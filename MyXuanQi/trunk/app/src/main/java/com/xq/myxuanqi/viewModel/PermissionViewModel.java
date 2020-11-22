package com.xq.myxuanqi.viewModel;

import android.app.Application;
import android.content.Context;
import android.support.annotation.NonNull;
import android.widget.Toast;

import com.xq.myxuanqi.http.HttpHelper;
import com.xq.myxuanqi.http.ICallBack;
import com.xq.myxuanqi.util.UrlUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by wm on 2019/3/18.
 */

public class PermissionViewModel extends BaseViewModel {
    private Context mContext;
    private DelImageListener mDelImageListener;
    private SubmitFeedBackListener mSubmitFeedBackListener;
    public interface SubmitFeedBackListener{
        void submitFeedBackListenerOnCallBack(int i);
    }
    public void setSubmitFeedBackListener(SubmitFeedBackListener submitFeedBackListener){
        this.mSubmitFeedBackListener = submitFeedBackListener;
    }
    public interface DelImageListener{
        void delImgeListenerOnCallBack(int i);
    }
    public void setDelImageListener(DelImageListener delImageListener){
        this.mDelImageListener = delImageListener;
    }
    public PermissionViewModel(@NonNull Application application) {
        super(application);
        this.mContext = application;
    }
    //删除单张图片
    public void deleteImage(String path){
        String url = UrlUtils.getApiUrl() + "api/service19/api35";
        Map<String, Object> map = new HashMap<>();
        map.put("path", path);
        HttpHelper.getInstance().post(url, UrlUtils.getUserAgent(mContext), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                mDelImageListener.delImgeListenerOnCallBack(0);
            }

            @Override
            public void onFailed(String string) {
                mDelImageListener.delImgeListenerOnCallBack(-1);
                Toast.makeText(mContext, "删除失败，请重试！", Toast.LENGTH_SHORT).show();
            }
        });
    }
    //删除全部图片
    public void deleteAllImage(String path){
        String url = UrlUtils.getApiUrl() + "api/service19/api34";
        Map<String, Object> map = new HashMap<>();
        map.put("paths", path);
        HttpHelper.getInstance().post(url, UrlUtils.getUserAgent(mContext), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                mDelImageListener.delImgeListenerOnCallBack(0);
            }

            @Override
            public void onFailed(String string) {
                mDelImageListener.delImgeListenerOnCallBack(-1);
                Toast.makeText(mContext, "删除失败，请重试！", Toast.LENGTH_SHORT).show();
            }
        });
    }
    //提交反馈
    public void submitFeedBack(String nickname,String contactInformation,String content,String attachments){
        String url = UrlUtils.getApiUrl() + "api/service7/api33";
        Map<String, Object> map = new HashMap<>();
        map.put("nickname", nickname);
        map.put("contactInformation", contactInformation);
        map.put("content", content);
        map.put("attachments", attachments);
//        Toast.makeText(mContext, map.toString(), Toast.LENGTH_SHORT).show();
        HttpHelper.getInstance().post(url, UrlUtils.getUserAgent(mContext), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                if (string.contains("1")){
                    mSubmitFeedBackListener.submitFeedBackListenerOnCallBack(0);
                }else {
                    mSubmitFeedBackListener.submitFeedBackListenerOnCallBack(-1);
                    Toast.makeText(mContext, "提交失败，请重试！", Toast.LENGTH_SHORT).show();
                }

            }

            @Override
            public void onFailed(String string) {
                mSubmitFeedBackListener.submitFeedBackListenerOnCallBack(-1);
                Toast.makeText(mContext, "提交失败，请重试！", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
