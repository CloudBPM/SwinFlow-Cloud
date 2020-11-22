package com.xq.myxuanqi.factory;

import android.arch.lifecycle.MutableLiveData;
import android.arch.paging.DataSource;

import com.cloudibpm.core.admin.news.News;
import com.xq.myxuanqi.dataSource.NewsDataSource;

/**
 * Created by wm on 2019/2/27.
 */

public class NewsFactory extends DataSource.Factory<Integer,News> {
    private MutableLiveData<NewsDataSource> mMutableLiveData = new MutableLiveData<>();
    private int mCategory;
    public NewsFactory(int category) {
        this.mCategory = category;
    }

    @Override
    public DataSource<Integer, News> create() {
        NewsDataSource newsDataSource = new NewsDataSource(mCategory);
        mMutableLiveData.postValue(newsDataSource);
        return newsDataSource;
    }

}
