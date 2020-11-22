package com.xq.myxuanqi.dataSource;

import android.arch.paging.PageKeyedDataSource;
import android.support.annotation.NonNull;
import com.cloudibpm.core.admin.news.News;
import com.cloudibpm.core.admin.news.NewsListPage;
import com.cloudibpm.core.user.Login;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.xq.myxuanqi.http.HttpHelper;
import com.xq.myxuanqi.http.ICallBack;
import com.xq.myxuanqi.util.EmptyUtils;
import com.xq.myxuanqi.util.LongTimeToDate;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import retrofit2.Response;

/**
 * Created by wm on 2019/2/27.
 */

public class NewsDataSource extends PageKeyedDataSource<Integer, News> {
    private int mCategory;
    public NewsDataSource(int category) {
        this.mCategory = category;
    }

    /*
    * 请求上一页数据
    * */
    @Override
    public void loadBefore(@NonNull LoadParams params, @NonNull LoadCallback callback) {

    }

    /*
    * 请求下一页数据
    * */
    @Override
    public void loadAfter(@NonNull LoadParams params, @NonNull LoadCallback callback) {
        String baseUrl = UrlUtils.getInstance().getApiUrl();
        String url = baseUrl + "api/service13/api17";
        Login login = SpUtil.getInstance().getLogin();
        String id = login.getUser().getId();
        Map<String, Object> map = new HashMap<>();
        map.put("condition", "");
        map.put("cates", mCategory + "");
        map.put("userid", id);
        map.put("pageno", params.key);
        map.put("pagesize", params.requestedLoadSize);
        HttpHelper.getInstance().get(url, map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                if (EmptyUtils.isNotEmpty(string)) {
                    Gson gson = new GsonBuilder()
                            .registerTypeAdapter(Date.class, new LongTimeToDate())  //解析Date型时间
                            .create();
                    NewsListPage newsListPage = gson.fromJson(string, NewsListPage.class);
                    int pageNo = newsListPage.getPageNo();
                    News[] pageEntities = newsListPage.getPageEntities();
                    List<News> newsList = Arrays.asList(pageEntities);
                    callback.onResult(newsList, pageNo + 1);
                } else {

                }
            }

            @Override
            public void onFailed(String string) {
                loadAfter(params, callback);
            }
        });

    }

    /*
    * 第一次请求数据
    * */
    @Override
    public void loadInitial(@NonNull LoadInitialParams params, @NonNull LoadInitialCallback callback) {
        String baseUrl = UrlUtils.getInstance().getApiUrl();
        String url = baseUrl + "api/service13/api17";
        Login login = SpUtil.getInstance().getLogin();
        String id = login.getUser().getId();
        Map<String, Object> map = new HashMap<>();
        map.put("condition", "");
        map.put("cates", mCategory + "");
        map.put("userid", id);
        map.put("pageno", 1);
        map.put("pagesize", 10);
        List<News> newsList = new ArrayList<>();
        int pageNo = 1;
        try {
            Response<String> response = HttpHelper.getInstance().getSync(url, map);
            String s = response.body().toString();
            Gson gson = new GsonBuilder()
                    .registerTypeAdapter(Date.class, new LongTimeToDate())  //解析Date型时间
                    .create();
//            Gson gson = new Gson();
            NewsListPage newsListPage = gson.fromJson(s, NewsListPage.class);
            pageNo = newsListPage.getPageNo();
            News[] pageEntities = newsListPage.getPageEntities();
            newsList = Arrays.asList(pageEntities);
            callback.onResult(newsList, pageNo, pageNo + 1);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
