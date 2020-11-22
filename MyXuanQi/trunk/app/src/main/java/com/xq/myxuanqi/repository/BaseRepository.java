package com.xq.myxuanqi.repository;

import android.arch.lifecycle.MutableLiveData;
import android.content.Context;
import android.database.Observable;

/**
 * Created by xq0002 on 2018/12/7.
 */

public abstract class BaseRepository<T> {

    protected Context context;
    //
    protected final MutableLiveData<T> liveData;

    public BaseRepository(Context context) {
        this.context = context;
        liveData = new MutableLiveData<>();
    }

    /**
     * 请求数据
     */
    public void loadData() {

    }

    /**
     * 获取数据
     */
    public MutableLiveData<T> getData() {
        return liveData;
    }

    public abstract Observable<T> getApiService();

}