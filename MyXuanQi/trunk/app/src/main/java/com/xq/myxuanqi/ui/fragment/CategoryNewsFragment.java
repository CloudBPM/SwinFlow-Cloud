package com.xq.myxuanqi.ui.fragment;

import android.annotation.SuppressLint;
import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.Observer;
import android.arch.lifecycle.ViewModelProviders;
import android.arch.paging.DataSource;
import android.arch.paging.LivePagedListBuilder;
import android.arch.paging.PagedList;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.constraint.ConstraintLayout;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;

import com.cloudibpm.core.admin.news.News;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.adapter.CategoryNewsAdapter;
import com.xq.myxuanqi.factory.NewsFactory;
import com.xq.myxuanqi.ui.activity.news.NewsDetailActivity;
import com.xq.myxuanqi.viewModel.CategoryNewsViewModel;

import butterknife.BindView;

/**
 * Created by wm on 2019/2/25.
 */

@SuppressLint("ValidFragment")
public class CategoryNewsFragment extends BaseFragment implements SwipeRefreshLayout.OnRefreshListener {
    @BindView(R.id.rv)
    RecyclerView mRv;
    @BindView(R.id.srl)
    SwipeRefreshLayout mSrl;
    @BindView(R.id.cl)
    ConstraintLayout mCl;
    private CategoryNewsViewModel mCategoryNewsViewModel;
    private CategoryNewsAdapter mCategoryNewsAdapter;
    private int                 category;
    private NewsFactory mNewsFactory;
    private DataSource<Integer, News> mNewsDataSource;
    private LiveData<PagedList<News>> mLiveData;
    //切换刷新
    protected boolean isCreated = false;
    public CategoryNewsFragment() {
    }

    @Override
    protected int getLayoutResId() {
        return R.layout.fragment_category_news;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        isCreated = true;
        Bundle arguments = getArguments();
        int category = arguments.getInt("category", 0);
        this.category = category;
    }

    @Override
    public void init() {
        super.init();
        mCategoryNewsAdapter = new CategoryNewsAdapter(getContext());
        mCategoryNewsViewModel = ViewModelProviders.of(this).get(CategoryNewsViewModel.class);
        mSrl.setColorSchemeResources(R.color.colorPrimary);
        mSrl.setOnRefreshListener(this);
        mNewsFactory = new NewsFactory(category);
        mNewsDataSource = mNewsFactory.create();
        mLiveData = new LivePagedListBuilder<>(mNewsFactory, 10).build();
        mCategoryNewsViewModel.setNewsModelList(mLiveData);
        RecyclerView.LayoutManager manager = new LinearLayoutManager(getActivity(), LinearLayoutManager.VERTICAL, false);
        mRv.setLayoutManager(manager);
        mRv.setAdapter(mCategoryNewsAdapter);
//        mRv.addItemDecoration(new DividerItemDecoration(getContext(), DividerItemDecoration.VERTICAL));
        mCategoryNewsViewModel.getNewsModelList().observe(this, new Observer<PagedList<News>>() {
            @Override
            public void onChanged(@Nullable PagedList<News> news) {
                mCategoryNewsAdapter.submitList(news);
            }
        });
        mCategoryNewsAdapter.setOnItemClickCallBack(new CategoryNewsAdapter.OnItemClickCallBack() {
            @Override
            public void setPositionNews(News news) {
                Intent intent = new Intent(getActivity(), NewsDetailActivity.class);
                String id = news.getId();
                intent.putExtra("id", id);
                startActivity(intent);
            }
        });

    }

    /*
    * 下拉刷新
    * */
    @Override
    public void onRefresh() {
        mNewsDataSource = mNewsFactory.create();
        mLiveData = new LivePagedListBuilder<>(mNewsFactory, 30).build();
        mCategoryNewsViewModel.setNewsModelList(mLiveData);
        mCategoryNewsViewModel.getNewsModelList().observe(this, new Observer<PagedList<News>>() {
            @Override
            public void onChanged(@Nullable PagedList<News> news) {
                mSrl.setRefreshing(false);
                mCategoryNewsAdapter.submitList(news);
            }
        });
    }

    @Override
    public void setUserVisibleHint(boolean isVisibleToUser) {
        super.setUserVisibleHint(isVisibleToUser);
        if (!isCreated) {
            return;
        }
        //刷新画面
        if (isVisibleToUser) {
            mNewsDataSource = mNewsFactory.create();
            mLiveData = new LivePagedListBuilder<>(mNewsFactory, 30).build();
            mCategoryNewsViewModel.setNewsModelList(mLiveData);
            mCategoryNewsViewModel.getNewsModelList().observe(this, new Observer<PagedList<News>>() {
                @Override
                public void onChanged(@Nullable PagedList<News> news) {
                    mCategoryNewsAdapter.submitList(news);
                }
            });
        }
    }

    public static Fragment getNewInstance(Integer integer) {
        Bundle bundle = new Bundle();
        bundle.putInt("category",integer);
        CategoryNewsFragment categoryNewsFragment = new CategoryNewsFragment();
        categoryNewsFragment.setArguments(bundle);
        return categoryNewsFragment;
    }
}
