package com.xq.myxuanqi.ui.activity.me.setting;

import android.arch.lifecycle.ViewModelProviders;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.support.constraint.ConstraintLayout;
import android.support.v7.widget.Toolbar;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.ui.view.VerifyCodeView;
import com.xq.myxuanqi.util.EmptyUtils;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.TelPhoneUtil;
import com.xq.myxuanqi.viewModel.VerifyTelephoneViewModel;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

/*
* 验证手机号
* */
public class VerifyTelephoneActivity extends BaseActivity {

    @BindView(R.id.tv_telphone)
    TextView         mTvTelphone;
    @BindView(R.id.et_verify_code)
    VerifyCodeView   mEtVerifyCode;
    @BindView(R.id.cl3)
    ConstraintLayout mCl3;
    @BindView(R.id.btn_get_code)
    Button           mBtnGetCode;
    @BindView(R.id.tb)
    Toolbar          mTb;
    private MyCountDownTimer         mMyCountDownTimer;
    private VerifyTelephoneViewModel mVerifyTelephoneViewModel;
    private String                   mMobile;

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_verify_telephone;
    }

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
        mVerifyTelephoneViewModel = ViewModelProviders.of(this).get(VerifyTelephoneViewModel.class);
        mMobile = SpUtil.getInstance().getLogin().getUser().getMobile();
        if (!TextUtils.isEmpty(mMobile) && TelPhoneUtil.isChinaPhoneLegal(mMobile)) {
            mVerifyTelephoneViewModel.getSecurityCode(mMobile);
            //发送验证码
            mMyCountDownTimer.start();
            StringBuilder sb = TelPhoneUtil.getMobile(mMobile);
            mTvTelphone.setText(sb);
        } else {
            Toast.makeText(this, "您的手机号有误，请修改手机号", Toast.LENGTH_SHORT).show();
            finish();
        }
        mEtVerifyCode.setInputCompleteListener(new VerifyCodeView.InputCompleteListener() {
            @Override
            public void inputComplete() {
                //检验验证码是否正确
                String verifyVode = mEtVerifyCode.getEditContent();
                mVerifyTelephoneViewModel.isTrueVerifyTelephone(mMobile, verifyVode);
            }

            @Override
            public void invalidContent() {
            }
        });
        mVerifyTelephoneViewModel.setGetCodeOnCallBack(new VerifyTelephoneViewModel.GetCodeOnCallBack() {
            @Override
            public void getCodeOnCallBackListener(int i) {
                switch (i) {
                    case 0:
                        break;
                    case 1:
                        //正确，跳转至修改密码页面
                        JumpTo(ChangePasswordActivity.class);
                        break;
                    case -4:
                        //不正确，弹窗告知用户不正确，清空验证码输入框
                        Toast.makeText(VerifyTelephoneActivity.this, "验证码不正确", Toast.LENGTH_SHORT).show();
                        mEtVerifyCode.clear();
                        break;
                    case -2://网络连接超时
                        Toast.makeText(VerifyTelephoneActivity.this, "网络连接超时", Toast.LENGTH_SHORT).show();
                }
            }
        });

    }

    @OnClick({R.id.tb_back, R.id.btn_get_code})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tb_back:
                finish();
                break;
            case R.id.btn_get_code:
                //获取验证码
                if (!TextUtils.isEmpty(mMobile) && TelPhoneUtil.isChinaPhoneLegal(mMobile)) {
                    mVerifyTelephoneViewModel.getSecurityCode(mMobile);
                    //发送验证码
                    mMyCountDownTimer.start();
                } else {
                    Toast.makeText(this, "您的手机号有误，请修改手机号", Toast.LENGTH_SHORT).show();
                }
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
