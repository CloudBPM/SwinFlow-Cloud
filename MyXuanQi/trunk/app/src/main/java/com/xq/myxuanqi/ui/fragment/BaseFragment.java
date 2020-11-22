package com.xq.myxuanqi.ui.fragment;

import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;


import java.util.List;

import butterknife.ButterKnife;
import butterknife.Unbinder;

/**
 * Created by xq0002 on 2018/11/3.
 */

public abstract class BaseFragment extends Fragment {
    private static final String TAG = "BaseFragment";
    private View mViewContent;
    public static int mStateBar;
    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        if (mViewContent == null) {
            mViewContent = inflater.inflate(getLayoutResId(), container, false);
        }
        ViewGroup parent = (ViewGroup) mViewContent.getParent();
        if (parent != null) {
            parent.removeView(mViewContent);
        }
        ButterKnife.bind(this, mViewContent);
        init();
        Log.d(TAG, "onCreateView: 123");
        return mViewContent;
    }

    public void init() {
        mStateBar = getStateBar();
        //沉浸式状态栏
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window window = getActivity().getWindow();
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            //会让应用的主体内容占用系统状态栏的空间
            window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.TRANSPARENT);
        }
    }


    protected abstract int getLayoutResId();
    @Override
    public void onDestroyView() {
        super.onDestroyView();

    }

    public void JumpTo(Class class1){
        Intent intent = new Intent(getActivity(), class1);
        startActivity(intent);
    }
    //打开webview传值
    public void ResultJumpTo(Class class1, String value,String type){
        Intent intent = new Intent(getActivity(), class1);
        intent.putExtra("url", value);
        intent.putExtra("type", type);
        startActivity(intent);
    }
    public int getStateBar(){
        int result = 0;
        int resourceId = getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            result = getResources().getDimensionPixelSize(resourceId);
        }
        return result;
    }
}
