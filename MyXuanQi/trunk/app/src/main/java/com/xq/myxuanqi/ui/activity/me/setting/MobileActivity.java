package com.xq.myxuanqi.ui.activity.me.setting;

import android.databinding.ViewDataBinding;
import android.graphics.Typeface;
import android.os.Build;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.widget.TextView;

import com.shamanland.fonticon.FontIconTextView;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.fonts.FontManager;
import com.xq.myxuanqi.ui.activity.BaseActivity;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class MobileActivity extends BaseActivity {

    @BindView(R.id.tb_back)
    FontIconTextView mTbBack;
    @BindView(R.id.tv_xinghao)
    TextView mTvXinghao;
    @BindView(R.id.tv_sdk)
    TextView mTvSdk;
    @BindView(R.id.tv_xitong)
    TextView mTvXitong;
    @BindView(R.id.tv_pinpai)
    TextView mTvPinpai;
    @BindView(R.id.tv_shebei)
    TextView mTvShebei;
    @BindView(R.id.tv_fenbian)
    TextView mTvFenbian;

    @Override
    public void init() {
        super.init();
        Typeface typeface = FontManager.getTypeface(this, FontManager.FONTAWESOME_1);
        FontManager.markAsIconContainer(mTbBack,typeface);
        DisplayMetrics metrics = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(metrics);
        int widthPixels = metrics.widthPixels;
        int heightPixels = metrics.heightPixels;
        mTvXinghao.setText(Build.MODEL);
        mTvSdk.setText(Build.VERSION.SDK);
        mTvXitong.setText(Build.VERSION.RELEASE);
        mTvPinpai.setText(Build.BRAND);
        mTvShebei.setText(Build.VERSION.INCREMENTAL);
        mTvFenbian.setText(widthPixels+"x"+heightPixels);
    }

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_mobile;
    }

    @OnClick(R.id.tb_back)
    public void onViewClicked() {
        finish();
    }
}
