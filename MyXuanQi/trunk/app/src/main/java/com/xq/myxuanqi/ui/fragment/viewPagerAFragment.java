package com.xq.myxuanqi.ui.fragment;

import android.annotation.SuppressLint;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.support.constraint.ConstraintLayout;
import android.support.constraint.ConstraintSet;

import com.xq.myxuanqi.R;

import butterknife.BindView;

import com.xq.myxuanqi.model.layoutBean.MbContentPanel;
import com.xq.myxuanqi.model.layoutBean.MbTopBar;
import com.xq.myxuanqi.model.mobileLayout.ContentBar;

/**
 * Created by xq0002 on 2018/12/10.
 */

@SuppressLint("ValidFragment")
public class viewPagerAFragment extends BaseFragment {

    private static final String TAG = "viewPagerAFragment";
    @BindView(R.id.cl)
    ConstraintLayout mCl;
    private MbContentPanel mMbContentPanel;
    private int mNum;
    private MbTopBar mMbTopBar;

    @SuppressLint("ValidFragment")
    public viewPagerAFragment(MbContentPanel mbContentPanel) {
        this.mMbContentPanel = mbContentPanel;
    }


    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR1)
    @Override
    public void init() {
        super.init();
        ContentBar contentBar = new ContentBar();
        ConstraintLayout contentBarCl = contentBar.getContentBar(mCl, this, getContext(), getActivity(), mMbContentPanel, 0);
        int clId = contentBarCl.getId();
        ConstraintSet constraintSet = new ConstraintSet();
        int id = mCl.getId();
        constraintSet.clone(mCl);
        constraintSet.connect(clId, ConstraintSet.TOP,id,ConstraintSet.TOP);
        constraintSet.applyTo(mCl);
    }

    @Override
    protected int getLayoutResId() {
        return R.layout.fragment_viewpagera;
    }
}
