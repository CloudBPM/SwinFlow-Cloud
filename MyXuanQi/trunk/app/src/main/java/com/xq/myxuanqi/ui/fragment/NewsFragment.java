package com.xq.myxuanqi.ui.fragment;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.constraint.ConstraintLayout;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.view.ViewPager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.adapter.ViewPagerAdapter;
import com.xq.myxuanqi.ui.activity.news.NewsSearchActivity;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;

/**
 * Created by xq0002 on 2019/2/22.
 * 新闻动态页面
 */
public class NewsFragment extends BaseFragment {

    @BindView(R.id.cl)
    ConstraintLayout mCl;
    @BindView(R.id.tl)
    TabLayout        mTl;
    @BindView(R.id.vp)
    ViewPager        mVp;
    //切换刷新
    protected boolean isCreated = false;
    private ViewPagerAdapter mAdapter;
    private View mDecor;

    @Override
    protected int getLayoutResId() {
        return R.layout.fragment_news;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        isCreated = true;
    }

    @Override
    public void init() {
        super.init();
        mDecor = getActivity().getWindow().getDecorView();
        mDecor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        } else {
            mCl.setPadding(0, 100, 0, 20);
        }
        mTl.setTabGravity(TabLayout.GRAVITY_CENTER);
        mTl.setSelectedTabIndicatorColor(Color.parseColor("#39A9FC"));
        mTl.setSelectedTabIndicatorHeight(8);//下划线宽度
        List<Fragment> list = new ArrayList<>();
        List<String> titleList = new ArrayList<>();
        //新闻分类
        List<Integer> categoryList = new ArrayList<>();
        List<String> categoryTitleList = new ArrayList<>();
        categoryList.add(0);
        categoryList.add(1);
        categoryList.add(2);
        categoryList.add(3);
//        categoryList.add(4);
        categoryTitleList.add("公开新闻");
        categoryTitleList.add("内部新闻");
        categoryTitleList.add("通知公告");
        categoryTitleList.add("文献资料");
//        categoryTitleList.add("广告推广");

        for (int i = 0; i < categoryList.size(); i++) {
            //根据新闻分类动态创建fragment
            list.add(CategoryNewsFragment.getNewInstance(categoryList.get(i)));
            titleList.add(categoryTitleList.get(i));
        }
        FragmentManager fm = getChildFragmentManager();
        mAdapter = new ViewPagerAdapter(fm, list, titleList);
        mVp.setAdapter(mAdapter);
        mVp.setCurrentItem(0);
        mVp.setOffscreenPageLimit(list.size());
        mTl.setupWithViewPager(mVp);
        mTl.setTabsFromPagerAdapter(mAdapter);
    }

    @OnClick(R.id.cl_search)
    public void onViewClicked() {
        //跳转至搜索页面
        JumpTo(NewsSearchActivity.class);
    }

    @Override
    public void setUserVisibleHint(boolean isVisibleToUser) {
        super.setUserVisibleHint(isVisibleToUser);
        if (!isCreated) {
            return;
        }
        //刷新画面
        if (isVisibleToUser) {
            mDecor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
            mAdapter.notifyDataSetChanged();
        }
    }
}
