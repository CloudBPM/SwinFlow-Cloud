package com.xq.myxuanqi.ui.activity;

import android.Manifest;
import android.arch.lifecycle.Observer;
import android.arch.lifecycle.ViewModelProviders;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.constraint.ConstraintLayout;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.TextView;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.model.WelcomeModel;
import com.xq.myxuanqi.util.PermissionUtil;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.viewModel.WelcomeViewModel;

import butterknife.BindView;
import butterknife.ButterKnife;

public class WelcomeActivity extends AppCompatActivity {

    @BindView(R.id.tv)
    TextView         mTv;
    @BindView(R.id.cl)
    ConstraintLayout mCl;
    private WelcomeViewModel mWelcomeViewModel;
    private String[] permissions = new String[]{
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.CAMERA,
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.READ_PHONE_STATE
    };
    private int mI;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.AppTheme);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_welcome);
        ButterKnife.bind(this);
        init();
    }

    public void init() {
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window window = getWindow();
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.TRANSPARENT);
        }
//                    window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        Boolean isFirstLogin = SpUtil.getInstance().getBoolean("isFirstLogin");
        if (isFirstLogin) {  //判断是第一次登陆
            //默认关闭指纹登录
            SpUtil.getInstance().saveBoolean("fingerLogin",false);
        }
        mWelcomeViewModel = ViewModelProviders.of(this).get(WelcomeViewModel.class);
        mWelcomeViewModel.setWelcomeModel("Welcome to XuanQi");
        mWelcomeViewModel.getWelcomeModel().observe(this, new Observer<WelcomeModel>() {
            @Override
            public void onChanged(@Nullable WelcomeModel welcomeModel) {
                mTv.setText(welcomeModel.getWelcomeText());
            }
        });
        mI = mWelcomeViewModel.JumpTo();
        startToHome(mI);
    }


    private void startToHome(final int i) {
        if (Build.VERSION.SDK_INT < 23) {//不需要动态申请权限
            jumpToHome(i);
        } else {
            //动态申请权限
            //创建监听权限的接口对象
            PermissionUtil.getInstance().chekPermissions(this, permissions, permissionsResult);
        }
    }

    //根据状态跳转页面 0：非自动登录  1：自动登录
    private void jumpToHome(int i) {
        if (i == 0) {
            //是否开启指纹登录
            if (SpUtil.getInstance().getBoolean("fingerLogin")) {
                Intent intent = new Intent(WelcomeActivity.this, FingerprintLoginActivity.class);
                startActivity(intent);
                finish();
            } else {
                Intent intent = new Intent(WelcomeActivity.this, TelephoneLoginActivity.class);
                startActivity(intent);
                finish();
            }
        } else if (i == 1) {
            //验证sessionId是否过期
            Intent intent = new Intent(WelcomeActivity.this, HomeActivity.class);
            startActivity(intent);
            finish();
        }
    }

    PermissionUtil.IPermissionsResult permissionsResult = new PermissionUtil.IPermissionsResult() {
        @Override
        public void passPermissions() {
            jumpToHome(mI);
        }

        @Override
        public void forbidPermissions() {
        }
    };

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        //就多一个参数this
        PermissionUtil.getInstance().onRequestPermissionsResult(this, requestCode, permissions, grantResults);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }
}
