package com.xq.myxuanqi.ui.activity.me.setting;

import android.app.ProgressDialog;
import android.arch.lifecycle.ViewModelProviders;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.TextView;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.util.DownloadUtils;
import com.xq.myxuanqi.viewModel.AboutViewMode;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class AboutActivity extends BaseActivity {

    @BindView(R.id.tv_version)
    TextView mTvVersion;
    @BindView(R.id.tv_update)
    TextView mTvUpdate;
    @BindView(R.id.tb)
    Toolbar  mTb;
    private int mVersionCode = 1;
    private AboutViewMode  mAboutViewMode;
    private ProgressDialog mProgressDialog;

    @Override
    public void init() {
        super.init();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        } else {
            mTb.setPadding(0, 5, 0, 5);
        }
        View decor = getWindow().getDecorView();
        decor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        mProgressDialog = new ProgressDialog(AboutActivity.this);
        mAboutViewMode = ViewModelProviders.of(this).get(AboutViewMode.class);
        mAboutViewMode.setCheckUpdateCallBack(new AboutViewMode.CheckUpdateCallBack() {
            @Override
            public void setUpdate(final int update,int versionCode) {
                if (update == -1 || update == -2) {
                    //不需要更新
                    mTvUpdate.setText("已是最新版本");
                } else {
                    mTvUpdate.setText("有新版本！");
                    mTvUpdate.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            DownloadUtils.downloadOrInstallApk(update,versionCode, AboutActivity.this, AboutActivity.this, mProgressDialog, 1);
                        }
                    });
                }
            }
        });
        PackageManager packageManager = getPackageManager();
        PackageInfo packageInfo = null;
        try {
            packageInfo = packageManager.getPackageInfo(getPackageName(), 0);
            String versionName = packageInfo.versionName;
            mVersionCode = packageInfo.versionCode;
            mTvVersion.setText("版本号 " + versionName);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        //判断是否有新版本
        mAboutViewMode.checkUpdateApk(mVersionCode);

    }

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_about;
    }

    @OnClick(R.id.tb_back)
    public void onViewClicked() {
        finish();
    }

}
