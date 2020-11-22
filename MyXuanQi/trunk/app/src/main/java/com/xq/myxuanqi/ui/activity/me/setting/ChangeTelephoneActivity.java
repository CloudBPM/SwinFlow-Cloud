package com.xq.myxuanqi.ui.activity.me.setting;

import android.arch.lifecycle.ViewModelProviders;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.support.v7.widget.Toolbar;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.ui.view.VerifyCodeView;
import com.xq.myxuanqi.util.CommonAction;
import com.xq.myxuanqi.util.TelPhoneUtil;
import com.xq.myxuanqi.viewModel.ChangeTelephoneViewModel;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class ChangeTelephoneActivity extends BaseActivity {

    @BindView(R.id.et_verify_code)
    VerifyCodeView mEtVerifyCode;
    @BindView(R.id.btn_get_code)
    Button         mBtnGetCode;
    @BindView(R.id.tv_telphone)
    TextView       mTvTelphone;
    @BindView(R.id.tb)
    Toolbar        mTb;
    private MyCountDownTimer         mMyCountDownTimer;
    private ChangeTelephoneViewModel mChangeTelephoneViewModel;
    private String                   mMobile;

    @Override
    public void init() {
        super.init();
        View decor = getWindow().getDecorView();
        decor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        } else {
            mTb.setPadding(0, 5, 0, 5);
        }
        mMyCountDownTimer = new MyCountDownTimer(60000, 1000);
        mChangeTelephoneViewModel = ViewModelProviders.of(this).get(ChangeTelephoneViewModel.class);
        Intent intent = getIntent();
        mMobile = intent.getStringExtra("tel");
        if (!TextUtils.isEmpty(mMobile) && mMobile.length() > 6) {
            StringBuilder sb = TelPhoneUtil.getMobile(mMobile);
            mTvTelphone.setText(sb);
            //发送验证码
            mChangeTelephoneViewModel.getSecurityCode(mMobile);
            mMyCountDownTimer.start();
        } else {

        }
        mEtVerifyCode.setInputCompleteListener(new VerifyCodeView.InputCompleteListener() {
            @Override
            public void inputComplete() {
                //检验验证码是否正确
                String verifyVode = mEtVerifyCode.getEditContent();
                mChangeTelephoneViewModel.isTrueVerifyTelephone(mMobile, verifyVode);
            }

            @Override
            public void invalidContent() {
            }
        });
        mChangeTelephoneViewModel.setGetCodeOnCallBack(new ChangeTelephoneViewModel.GetCodeOnCallBack() {
            @Override
            public void getCodeOnCallBackListener(int i) {
                switch (i) {
                    case 0:
                        Toast.makeText(ChangeTelephoneActivity.this, "验证码发送成功", Toast.LENGTH_SHORT).show();
                        break;
                    case 1:
                        //若正确则提示修改成功
                        Toast.makeText(ChangeTelephoneActivity.this, "验证成功，手机号已修改", Toast.LENGTH_SHORT).show();
                        //关闭页面
                        CommonAction.getInstance().finishActivity(NewTelephoneActivity.class);
                        finish();
                        break;
                    case -1:
                        Toast.makeText(ChangeTelephoneActivity.this, "验证码发送失败", Toast.LENGTH_SHORT).show();
                        break;
                    case -2:
                        Toast.makeText(ChangeTelephoneActivity.this, "网络连接失败", Toast.LENGTH_SHORT).show();
                        break;
                }
            }
        });
    }

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_change_telephone;
    }

    @OnClick({R.id.tb_back, R.id.btn_get_code})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tb_back:
                finish();
                break;
            case R.id.btn_get_code:
                //获取验证码
                mChangeTelephoneViewModel.getSecurityCode(mMobile);
                mMyCountDownTimer.start();
                break;
        }
    }

    private class MyCountDownTimer extends CountDownTimer {
        public MyCountDownTimer(long millisInFuture, long countDownInterval) {
            super(millisInFuture, countDownInterval);
        }

        @Override
        public void onTick(long millisInFuture) {
            mBtnGetCode.setTextColor(Color.parseColor("#FFDCDCDC"));
            mBtnGetCode.setClickable(false);
            mBtnGetCode.setText(millisInFuture / 1000 + "秒后可重新发送");
        }

        @Override
        public void onFinish() {
            mBtnGetCode.setText("重新获取验证码");
            mBtnGetCode.setClickable(true);
            mBtnGetCode.setTextColor(Color.parseColor("#000000"));
        }
    }
}
