package com.xq.myxuanqi.viewModel;

import android.app.Application;
import android.arch.lifecycle.LiveData;
import android.arch.paging.PagedList;
import android.support.annotation.NonNull;

import com.cloudibpm.core.admin.news.News;

/**
 * Created by wm on 2019/2/26.
 */

public class CategoryNewsViewModel extends BaseViewModel {
    private LiveData<PagedList<News>>      mNewsModelList;
    public CategoryNewsViewModel(@NonNull Application application) {
        super(application);
    }
    public LiveData<PagedList<News>> getNewsModelList(){
        return mNewsModelList;
    }

    public void setNewsModelList(LiveData<PagedList<News>> newsModelList) {
        mNewsModelList = newsModelList;
    }

}
