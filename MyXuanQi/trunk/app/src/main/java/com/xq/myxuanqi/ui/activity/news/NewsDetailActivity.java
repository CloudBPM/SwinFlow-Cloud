package com.xq.myxuanqi.ui.activity.news;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.ProgressBar;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class NewsDetailActivity extends BaseActivity {

    @BindView(R.id.tb)
    Toolbar     mTb;
    @BindView(R.id.web)
    WebView     mWeb;
    @BindView(R.id.pb)
    ProgressBar mPb;

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_news_detail;
    }

    @Override
    public void init() {
        super.init();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        } else {
            mTb.setPadding(0, 5, 0, 5);
        }
        Intent intent = getIntent();
        String id = intent.getStringExtra("id");
        String baseUrl = UrlUtils.getInstance().getUrl();
        String url = baseUrl + "client/newsdetail.jsp?nid=" + id + "&sessionId=" + SpUtil.getInstance().getStr("sessionId");
        mWeb.loadUrl(url);
        WebSettings settings = mWeb.getSettings();
        settings.setJavaScriptEnabled(true);
        mWeb.setWebChromeClient(new WebChromClient());
        mPb.setMax(100);
    }

    @OnClick(R.id.tb_back)
    public void onViewClicked() {
        finish();
    }
    public class WebChromClient extends WebChromeClient {
        @Override
        public void onProgressChanged(WebView view, int newProgress) {
            mPb.setProgress(newProgress);
            if (newProgress==100){
                mPb.setVisibility(View.GONE);
            }
            super.onProgressChanged(view, newProgress);
        }
    }
}
