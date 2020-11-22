package com.xq.myxuanqi.ui.activity;

import android.arch.lifecycle.ViewModelProviders;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import android.security.keystore.KeyProperties;
import android.support.annotation.RequiresApi;
import android.support.constraint.ConstraintLayout;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.PopupWindow;
import android.widget.TextView;
import android.widget.Toast;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.me.fingerprint.FingerprintHelper;
import com.xq.myxuanqi.ui.activity.me.setting.FingerprintActivity;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.ToastUtils;
import com.xq.myxuanqi.util.UrlUtils;
import com.xq.myxuanqi.viewModel.LoginViewModel;
import com.xq.myxuanqi.zxing.activity.CaptureActivity;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class FingerprintLoginActivity extends BaseActivity implements FingerprintHelper.SimpleAuthenticationCallback {


    @BindView(R.id.tv_user_name)
    TextView         mTvUserName;
    @BindView(R.id.cl_finger_login)
    ConstraintLayout mClFingerLogin;
    @BindView(R.id.btn_chenge_login)
    Button           mBtnChengeLogin;
    @BindView(R.id.cl)
    ConstraintLayout mCl;
    private FingerprintHelper mFingerprintHelper;
    private PopupWindow       mPopupWindow;
    private TextView          mTvFinger1;
    private LoginViewModel mLoginViewModel;
    private String mUserName;

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_fingerprint_login;
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    public void init() {
        super.init();
        View decor = getWindow().getDecorView();
        if (true) {
            decor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        } else {
            decor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        }
        mUserName = SpUtil.getInstance().getStr("userName");
        //显示用户名
        mTvUserName.setText(mUserName);
        mLoginViewModel = ViewModelProviders.of(this).get(LoginViewModel.class);
        mFingerprintHelper = new FingerprintHelper(this);

        mLoginViewModel.setOnCallBack(new LoginViewModel.onCallBack() {
            @Override
            public void onCallBackListener(int i) {
                switch (i) {
                    case 0:
                        mPopupWindow.dismiss();
                        backgroundAlpha(1.0f);
                        JumpTo(HomeActivity.class);
                        break;
                    case -1:
                        mTvFinger1.setText("登录失败！");
                        JumpTo(LoginActivity.class);
                        break;
                    case -2:
                        if (UrlUtils.getInstance().type == 0) {
                            Toast.makeText(FingerprintLoginActivity.this, "重新获取ip地址", Toast.LENGTH_SHORT).show();
                            JumpToResult(CaptureActivity.class, REQUEST_CODE);
                        }
                        break;
                    case -3:
                        Toast.makeText(FingerprintLoginActivity.this, "网络连接失败", Toast.LENGTH_SHORT).show();
                        break;
                }
            }
        });
    }

    @Override
    public void onAuthenticationSucceeded(final String value) {
        mTvFinger1.setText("正在校验指纹");
        //访问后台进行登录验证
        mLoginViewModel.isLoginSuccess(mUserName,value);
    }

    @Override
    public void onAuthenticationFail() {
        mTvFinger1.setText("验证失败，请再试一次！");
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @OnClick({R.id.cl_finger_login, R.id.btn_chenge_login})
    public void onViewClicked(View v) {
        switch (v.getId()) {
            case R.id.cl_finger_login:
                mFingerprintHelper.setCallback(FingerprintLoginActivity.this);
                //检查当前设备是否支持指纹 0：支持 -1：未检测到指纹硬件 -2: 未录入指纹 -3: 未开启设备锁
                int fingerprintAvailable = mFingerprintHelper.checkFingerprintAvailable();
                if (fingerprintAvailable == 0) {//支持指纹
                    //验证指纹
                    mFingerprintHelper.setPurpose(KeyProperties.PURPOSE_DECRYPT);
                    mFingerprintHelper.authenticate();
                    View view = LayoutInflater.from(getBaseContext()).inflate(R.layout.popupwindow_finger, null, false);
                    Button btnCancel = view.findViewById(R.id.btn_cancel);
                    btnCancel.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            //取消指纹识别
                            mFingerprintHelper.stopAuthenticate();
                            mPopupWindow.dismiss();
                            backgroundAlpha(1.0f);
                        }
                    });
                    mTvFinger1 = view.findViewById(R.id.tv_finger);
                    mPopupWindow = new PopupWindow(view, ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                    mPopupWindow.setBackgroundDrawable(new ColorDrawable(Color.WHITE));
                    backgroundAlpha(0.5f);
                    mPopupWindow.showAtLocation(mCl, Gravity.CENTER_VERTICAL, 0, 0);
                } else {
                    if (fingerprintAvailable == -1) {
                        Toast.makeText(getBaseContext(), "该设备尚未检测到指纹硬件", Toast.LENGTH_SHORT).show();
                    } else if (fingerprintAvailable == -2) {
                        Toast.makeText(getBaseContext(), "该设备未录入指纹，请去系统->设置中添加指纹", Toast.LENGTH_SHORT).show();
                    } else if (fingerprintAvailable == -3) {
                        Toast.makeText(this, "该设备未开启锁屏密码", Toast.LENGTH_SHORT).show();
                    }
                    JumpTo(LoginActivity.class);
                }
                break;
            case R.id.btn_chenge_login:
                JumpTo(LoginActivity.class);
                break;
        }
    }

    /**
     * 设置添加屏幕的背景透明度
     *
     * @param bgAlpha
     */
    public void backgroundAlpha(float bgAlpha) {
        WindowManager.LayoutParams lp = getWindow().getAttributes();
        lp.alpha = bgAlpha; //0.0-1.0
        getWindow().setAttributes(lp);
    }

    @Override
    protected void onResume() {
        super.onResume();
        mClFingerLogin.post(new Runnable() {
            @Override
            public void run() {
                mClFingerLogin.performClick();
            }
        });

    }
}
