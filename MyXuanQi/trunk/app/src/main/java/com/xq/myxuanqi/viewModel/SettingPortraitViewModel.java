package com.xq.myxuanqi.viewModel;

import android.app.Application;
import android.content.Context;
import android.support.annotation.NonNull;

import com.xq.myxuanqi.http.DownloadListener;
import com.xq.myxuanqi.http.HttpHelper;
import com.xq.myxuanqi.util.UrlUtils;

/**
 * Created by wm on 2019/3/25.
 */

public class SettingPortraitViewModel extends BaseViewModel {
    private Context mContext;
    private DownloadOnCallBack mDownloadOnCallBack;
    public interface DownloadOnCallBack{
        void downloadListener(int i);
    }
    public SettingPortraitViewModel(@NonNull Application application) {
        super(application);
        mContext = application;
    }

}
