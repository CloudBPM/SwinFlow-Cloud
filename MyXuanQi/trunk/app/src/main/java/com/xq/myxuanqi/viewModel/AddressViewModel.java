package com.xq.myxuanqi.viewModel;

import android.app.Application;
import android.arch.lifecycle.MutableLiveData;
import android.content.Context;
import android.support.annotation.NonNull;

//这里是viewModel层
//20190115 看不懂的mvvm
public class AddressViewModel extends BaseViewModel {
    private static final String TAG = "AddressViewModel";

//    private MutableLiveData<MobileUI> mUIMutableLiveData = new MutableLiveData<>();  //用来通知数据的变化
    private Context mContext;

    public AddressViewModel(@NonNull Application application) {
        super(application);
        mContext = application;
    }
}
