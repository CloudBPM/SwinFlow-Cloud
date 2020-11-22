package com.xq.myxuanqi.viewModel;

import android.app.Application;
import android.arch.lifecycle.AndroidViewModel;
import android.content.Context;
import android.support.annotation.NonNull;

import com.xq.myxuanqi.MyApplication;
import com.xq.myxuanqi.repository.BaseRepository;

/**
 * Created by xq0002 on 2018/12/7.
 */

public abstract class BaseViewModel extends AndroidViewModel {

    public BaseViewModel(@NonNull Application application) {
        super(application);
    }

}
