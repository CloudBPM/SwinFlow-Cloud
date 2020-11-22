package com.xq.myxuanqi.ui.fragment;

import android.annotation.SuppressLint;
import android.arch.lifecycle.Observer;
import android.arch.lifecycle.ViewModelProviders;
import android.graphics.Color;
import android.os.Build;
import android.support.annotation.Nullable;
import android.support.annotation.RequiresApi;
import android.support.constraint.ConstraintLayout;
import android.support.constraint.ConstraintSet;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.util.Log;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.model.layoutBean.MbContentPanel;
import com.xq.myxuanqi.model.layoutBean.MbSearchBar;
import com.xq.myxuanqi.model.layoutBean.MbTopBar;
import com.xq.myxuanqi.model.layoutBean.MobileUIComponent;
import com.xq.myxuanqi.model.mobileLayout.ContentBar;
import com.xq.myxuanqi.model.mobileLayout.MenuBar;
import com.xq.myxuanqi.model.mobileLayout.SearchBar;
import com.xq.myxuanqi.viewModel.HomeViewModel;

import butterknife.BindView;

import com.xq.myxuanqi.model.layoutBean.MbBoard;
import com.xq.myxuanqi.model.layoutBean.MobileUI;

/**
 * Created by xq0002 on 2018/11/5.
 * 首页，动态生成
 */

@SuppressLint("ValidFragment")
public class HomeFragment extends BaseFragment {

    @BindView(R.id.cl)
    ConstraintLayout mCl;
    private HomeViewModel mHomeViewModel;
    private int mNum;

    @SuppressLint("ValidFragment")
    public HomeFragment(int i) {
        this.mNum = i;
    }

    @Override
    protected int getLayoutResId() {
        return R.layout.fragment_home;
    }

    @Override
    public void init() {
        super.init();
        mHomeViewModel = ViewModelProviders.of(getActivity()).get(HomeViewModel.class);
        mHomeViewModel.getUIMutableLiveData().observe(this, new Observer<MobileUI>() {
            @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR1)
            @Override
            public void onChanged(@Nullable MobileUI mobileUI) {
                //mbBoard 指首页页面
                MbBoard mbBoard = mobileUI.getMbBoard(mNum);
                //判断子类数量,最大为3，指首页最多可分为3部分
                int objectNum = mbBoard.getChildObjectNum();
/*                if (objectNum==1){
                    MobileUIComponent mobileUIComponent = mbBoard.getChildObject(0);
                    //头布局
                    getTopBar(mobileUIComponent);
                }else if (objectNum==2){
                    MobileUIComponent mobileUIComponent1 = mbBoard.getChildObject(0);
                    //头布局
                    ConstraintLayout topBar = getTopBar(mobileUIComponent1);
                    //尾布局
                    MobileUIComponent mobileUIComponent2 = mbBoard.getChildObject(1);
                    getEndBar(mobileUIComponent2,topBar);
                }else if (objectNum==3){
                    MobileUIComponent mobileUIComponent3 = mbBoard.getChildObject(0);
                    //头布局
                    ConstraintLayout topBar1 = getTopBar(mobileUIComponent3);
                    //中间布局
                    MobileUIComponent mobileUIComponent4 = mbBoard.getChildObject(1);
                    ConstraintLayout centerBar = getCenterBar(mobileUIComponent4, topBar1);
                    //尾布局
                    MobileUIComponent mobileUIComponent5 = mbBoard.getChildObject(2);
                    getEndBar(mobileUIComponent5,centerBar);
                }else if (objectNum>3){*/
                    ConstraintLayout constraintLayout = null;
                    for (int i=0;i<objectNum;i++){
                        if (i==0){
                            MobileUIComponent mobileUIComponent = mbBoard.getChildObject(0);
                            //头布局
                            ConstraintLayout topBar = getTopBar(mobileUIComponent);
                            constraintLayout = topBar;
                        }else if (i==objectNum-1){
                            //尾布局
                            MobileUIComponent mobileUIComponent2 = mbBoard.getChildObject(objectNum-1);
                            getEndBar(mobileUIComponent2,constraintLayout);
                        }else {
                            //中间布局
                            MobileUIComponent mobileUIComponent4 = mbBoard.getChildObject(i);
                            constraintLayout = getCenterBar(mobileUIComponent4,constraintLayout);
//                            ConstraintLayout centerBar1 = getCenterBar(mobileUIComponent4, getTopBar(mbBoard.getChildObject(0)));
                        }
//                    }
                }

                /*switch (objectNum){
                    case 1:
                        MobileUIComponent mobileUIComponent = mbBoard.getChildObject(0);
                        //头布局
                        getTopBar(mobileUIComponent);
                        break;
                    case 2:
                        MobileUIComponent mobileUIComponent1 = mbBoard.getChildObject(0);
                        //头布局
                        ConstraintLayout topBar = getTopBar(mobileUIComponent1);
                        //尾布局
                        MobileUIComponent mobileUIComponent2 = mbBoard.getChildObject(1);
                        getEndBar(mobileUIComponent2,topBar);
                        break;
                    case 3:
                        MobileUIComponent mobileUIComponent3 = mbBoard.getChildObject(0);
                        //头布局
                        ConstraintLayout topBar1 = getTopBar(mobileUIComponent3);
                        //中间布局
                        MobileUIComponent mobileUIComponent4 = mbBoard.getChildObject(1);
                        ConstraintLayout centerBar = getCenterBar(mobileUIComponent4, topBar1);
                        //尾布局
                        MobileUIComponent mobileUIComponent5 = mbBoard.getChildObject(2);
                        getEndBar(mobileUIComponent5,centerBar);
                        break;
                }*/


            }
        });
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR1)
    private ConstraintLayout getCenterBar(MobileUIComponent mobileUIComponent4, ConstraintLayout topBar1) {
        String classtypename = mobileUIComponent4.getClasstypename();
        int id = topBar1.getId();
        ConstraintSet constraintSet = new ConstraintSet();
        //判断子类类型
        switch (classtypename){
            case "MbSearchBar"://搜索栏
                MbSearchBar mbSearchBar = (MbSearchBar) mobileUIComponent4;
                SearchBar searchBar = new SearchBar();
                ConstraintLayout searchBarCl = searchBar.getSearchBar(mCl, getContext(), mbSearchBar, 0);
                //                searchBarCl.setBackgroundColor(Color.parseColor("#FF41B8FC"));
                int searchBarClId = searchBarCl.getId();
                constraintSet.clone(mCl);
                constraintSet.connect(searchBarClId,ConstraintSet.TOP,id,ConstraintSet.BOTTOM);
                constraintSet.applyTo(mCl);
                return searchBarCl;
            case "MbTopBar"://菜单栏（viewPager+tablayout）
                MbTopBar mbTopBar = (MbTopBar) mobileUIComponent4;
                MenuBar menuBar = new MenuBar();
                ConstraintLayout menuBarTablayout = menuBar.getTablayout(mCl, getContext(), getChildFragmentManager(), 0, mbTopBar);
                int mbTlId = menuBarTablayout.getId();
                constraintSet.clone(mCl);
                constraintSet.connect(mbTlId,ConstraintSet.TOP,id,ConstraintSet.BOTTOM);
                constraintSet.applyTo(mCl);
                return menuBarTablayout;
            case "MbContentPanel"://内容面板
                MbContentPanel mbContentPanel = (MbContentPanel) mobileUIComponent4;
                ContentBar contentBar = new ContentBar();
                ConstraintLayout contentBarCl = contentBar.getContentBar(mCl, (BaseFragment) getParentFragment(), getContext(), getActivity(), mbContentPanel, 0);
                //设置默认背景
                //                contentBarCl.setBackgroundResource(R.drawable.contentbar_background_normal);
                int clId = contentBarCl.getId();
                constraintSet.clone(mCl);
                constraintSet.connect(clId,ConstraintSet.TOP,id,ConstraintSet.BOTTOM);
                constraintSet.applyTo(mCl);
                return contentBarCl;
        }
        return null;
    }
    /*
    * 底部布局
    * */
    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR1)
    private ConstraintLayout getEndBar(MobileUIComponent mobileUIComponent2, ConstraintLayout topBar) {
        String classtypename = mobileUIComponent2.getClasstypename();
        int id = topBar.getId();
        ConstraintSet constraintSet = new ConstraintSet();
        //判断子类类型
        switch (classtypename){
            case "MbSearchBar"://搜索栏
                MbSearchBar mbSearchBar = (MbSearchBar) mobileUIComponent2;
                SearchBar searchBar = new SearchBar();
                ConstraintLayout searchBarCl = searchBar.getSearchBar(mCl, getContext(), mbSearchBar, 0);
//                searchBarCl.setBackgroundColor(Color.parseColor("#FF41B8FC"));
                int searchBarClId = searchBarCl.getId();
                constraintSet.clone(mCl);
                constraintSet.connect(searchBarClId,ConstraintSet.TOP,id,ConstraintSet.BOTTOM);
                constraintSet.applyTo(mCl);
                return searchBarCl;
            case "MbTopBar"://菜单栏（viewPager+tablayout）
                MbTopBar mbTopBar = (MbTopBar) mobileUIComponent2;
                MenuBar menuBar = new MenuBar();
                ConstraintLayout menuBarTablayout = menuBar.getTablayout(mCl, getContext(), getChildFragmentManager(), 0, mbTopBar);
                int mbTlId = menuBarTablayout.getId();
                constraintSet.clone(mCl);
                constraintSet.connect(mbTlId,ConstraintSet.TOP,id,ConstraintSet.BOTTOM);
                constraintSet.applyTo(mCl);
                return menuBarTablayout;
            case "MbContentPanel"://内容面板
                MbContentPanel mbContentPanel = (MbContentPanel) mobileUIComponent2;
                ContentBar contentBar = new ContentBar();
                ConstraintLayout contentBarCl = contentBar.getContentBar(mCl, (BaseFragment) getParentFragment(), getContext(), getActivity(), mbContentPanel, 0);
                //设置默认背景
//                contentBarCl.setBackgroundResource(R.drawable.contentbar_background_normal);
                int clId = contentBarCl.getId();
                constraintSet.clone(mCl);
                constraintSet.connect(clId,ConstraintSet.TOP,id,ConstraintSet.BOTTOM);
                constraintSet.applyTo(mCl);
                return contentBarCl;
        }
        return null;
    }
    /*
    * 头部布局
    * */
    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR1)
    private ConstraintLayout getTopBar(MobileUIComponent mobileUIComponent) {
        String classtypename = mobileUIComponent.getClasstypename();
        int id = mCl.getId();
        ConstraintSet constraintSet = new ConstraintSet();
        //判断子类类型
        switch (classtypename){
            case "MbSearchBar"://搜索栏
                MbSearchBar mbSearchBar = (MbSearchBar) mobileUIComponent;
                SearchBar searchBar = new SearchBar();
                ConstraintLayout searchBarCl = searchBar.getSearchBar(mCl, getContext(), mbSearchBar, mStateBar);
                searchBarCl.setBackgroundColor(Color.parseColor("#FF41B8FC"));
                int searchBarClId = searchBarCl.getId();
                constraintSet.clone(mCl);
                constraintSet.connect(searchBarClId,ConstraintSet.TOP,id,ConstraintSet.TOP);
                constraintSet.applyTo(mCl);
                return searchBarCl;
            case "MbTopBar"://菜单栏（viewPager+tablayout）
                MbTopBar mbTopBar = (MbTopBar) mobileUIComponent;
                MenuBar menuBar = new MenuBar();
                ConstraintLayout menuBarTablayout = menuBar.getTablayout(mCl, getContext(), getChildFragmentManager(), mStateBar, mbTopBar);
                int mbTlId = menuBarTablayout.getId();
                constraintSet.clone(mCl);
                constraintSet.connect(mbTlId,ConstraintSet.TOP,id,ConstraintSet.TOP);
                constraintSet.applyTo(mCl);
                return menuBarTablayout;
            case "MbContentPanel"://内容面板
                MbContentPanel mbContentPanel = (MbContentPanel) mobileUIComponent;
                ContentBar contentBar = new ContentBar();
                ConstraintLayout contentBarCl = contentBar.getContentBar(mCl, (BaseFragment) getParentFragment(), getContext(), getActivity(), mbContentPanel, mStateBar);
                //设置默认背景
                contentBarCl.setBackgroundResource(R.drawable.contentbar_background_normal);
                int clId = contentBarCl.getId();
                constraintSet.clone(mCl);
                constraintSet.connect(clId,ConstraintSet.TOP,id,ConstraintSet.TOP);
                constraintSet.applyTo(mCl);
                return contentBarCl;
        }
        return null;
    }
}
