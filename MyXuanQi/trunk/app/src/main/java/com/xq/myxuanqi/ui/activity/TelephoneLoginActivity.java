package com.xq.myxuanqi.ui.activity;

import android.arch.lifecycle.ViewModelProviders;
import android.graphics.Color;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.support.annotation.NonNull;
import android.text.Editable;
import android.text.Html;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.view.UsedNameDialog;
import com.xq.myxuanqi.util.EmptyUtils;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.TelPhoneUtil;
import com.xq.myxuanqi.util.ToastUtils;
import com.xq.myxuanqi.util.UrlUtils;
import com.xq.myxuanqi.viewModel.TelephoneLoginViewModel;
import com.xq.myxuanqi.zxing.activity.CaptureActivity;

import java.io.UnsupportedEncodingException;
import java.util.Random;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class TelephoneLoginActivity extends BaseActivity {

    @BindView(R.id.et_telephone)
    EditText mEtTelephone;
    @BindView(R.id.btn_get_security_code)
    TextView mBtnGetSecurityCode;
    @BindView(R.id.et_security_code)
    EditText mEtSecurityCode;
    @BindView(R.id.tv_hint)
    TextView mTvHint;
    @BindView(R.id.btn_login)
    Button   mBtnLogin;
    @BindView(R.id.tv_ip)
    TextView mTvIp;
    @BindView(R.id.tv_registed)
    TextView mTvRegisted;
    private TelephoneLoginViewModel mViewModel;
    private MyCountDownTimer        mMyCountDownTimer;

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_telephone_login;
    }

    @Override
    public void init() {
        super.init();
        View decor = getWindow().getDecorView();
        decor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        if (UrlUtils.getInstance().type == 0) {
            mTvIp.setVisibility(View.VISIBLE);
        } else {
            mTvIp.setVisibility(View.GONE);
        }
        mTvRegisted.setText(Html.fromHtml("<u>"+"还没有账号？快速注册"+"</u>"));
        mMyCountDownTimer = new MyCountDownTimer(60000, 1000);
        mViewModel = ViewModelProviders.of(this).get(TelephoneLoginViewModel.class);
        mViewModel.setGetCodeOnCallBack(new TelephoneLoginViewModel.GetCodeOnCallBack() {
            @Override
            public void getCodeOnCallBackListener(int i) {
                if (i == 1) {    //验证码获取成功
                } else if (i == 2) {    //登录成功
                    Toast.makeText(TelephoneLoginActivity.this, "登录成功", Toast.LENGTH_SHORT).show();
                    JumpTo(HomeActivity.class);
                } else if (i == -1) {
                    Toast.makeText(TelephoneLoginActivity.this, "该手机号未注册！", Toast.LENGTH_SHORT).show();
                } else if (i == -2) {//网络连接超时
                    Toast.makeText(TelephoneLoginActivity.this, "网络连接超时", Toast.LENGTH_SHORT).show();
                } else if (i == -3) {
                    Toast.makeText(TelephoneLoginActivity.this, "网络访问失败", Toast.LENGTH_SHORT).show();
                } else if (i == -4) {   //验证码获取失败
                    Toast.makeText(TelephoneLoginActivity.this, "验证码获取失败", Toast.LENGTH_SHORT).show();
                }else if (i == -5) {   //验证码获取失败
                    Toast.makeText(TelephoneLoginActivity.this, "验证码已过期，请重新获取", Toast.LENGTH_SHORT).show();
                }else if (i == -6) {   //验证码获取失败
                    Toast.makeText(TelephoneLoginActivity.this, "验证码错误！", Toast.LENGTH_SHORT).show();
                }
            }
        });
        mEtTelephone.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                btnClickisTrue();
            }
        });
        mEtTelephone.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                btnClickisTrue();
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
        mEtSecurityCode.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                btnClickisTrue();
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
    }

    //生成随机名字
    @NonNull
    private String getRandomName() {
        Random random = new Random();
        String name = "匿名用户_";
        for (int i = 0; i < 4; i++) {
            int i1 = random.nextInt(9);//生成随机数字
            name += i1;
        }
        return name;
    }

    @OnClick({R.id.btn_get_security_code, R.id.btn_login, R.id.tv_numlogin, R.id.tv_ip, R.id.tv_registed})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.btn_get_security_code:    //获取验证码
                String telephoneNum = mEtTelephone.getText().toString().trim();
                //判断手机号是否为空
                if (TextUtils.isEmpty(telephoneNum)) {
                    String text = "手机号不能为空";
                    ToastUtils.shortToast(text, mTvHint, this);
                } else {
                    if (TelPhoneUtil.isChinaPhoneLegal(telephoneNum)) {
                        //判断验证码是否获取成功
                        mViewModel.getSecurityCode(telephoneNum);
                        mMyCountDownTimer.start();
                    } else {
                        Toast.makeText(this, "请检查手机号是否正确", Toast.LENGTH_SHORT).show();
                    }
                }
                break;
            case R.id.btn_login:    //登录
                String telNum = mEtTelephone.getText().toString().trim();
                String securityCode = mEtSecurityCode.getText().toString().trim();
                if (TextUtils.isEmpty(telNum) || TextUtils.isEmpty(securityCode)) {
                    String text = "手机号或验证码不能为空";
                    ToastUtils.shortToast(text, mTvHint, this);
                } else {
                    if (securityCode.length() == 6) {
                        //登录
                        mViewModel.isSuccessTelLogin(telNum, securityCode);
                    } else {
                        Toast.makeText(this, "验证码位数不对", Toast.LENGTH_SHORT).show();
                    }

                }
                break;
            case R.id.tv_numlogin:  //切换到账号密码登录页面
                JumpTo(LoginActivity.class);
                break;
            case R.id.tv_ip:
                JumpToResult(CaptureActivity.class, REQUEST_CODE);
                break;
            case R.id.tv_registed:
                JumpToBack(RegistedActivity.class);
                break;
        }
    }

    private class MyCountDownTimer extends CountDownTimer {
        public MyCountDownTimer(long millisInFuture, long countDownInterval) {
            super(millisInFuture, countDownInterval);
        }

        @Override
        public void onTick(long millisInFuture) {
            mBtnGetSecurityCode.setTextColor(Color.parseColor("#FFDCDCDC"));
            mBtnGetSecurityCode.setEnabled(false);
            mBtnGetSecurityCode.setText(millisInFuture / 1000 + "秒后可重新发送");
        }

        @Override
        public void onFinish() {
            mBtnGetSecurityCode.setText("重新获取验证码");
            mBtnGetSecurityCode.setEnabled(true);
            mBtnGetSecurityCode.setTextColor(Color.parseColor("#1d99da"));
        }
    }

    private void btnClickisTrue() {
        String telNum = mEtTelephone.getText().toString().trim();
        String code = mEtSecurityCode.getText().toString().trim();
        //如果输入框内容为空，登录按钮不可点击
        if (EmptyUtils.isEmpty(telNum) || EmptyUtils.isEmpty(code)) {
            if (EmptyUtils.isEmpty(telNum)) {
                mBtnGetSecurityCode.setEnabled(false);
                mBtnGetSecurityCode.setTextColor(Color.parseColor("#87c2e1"));
            } else {
                mBtnGetSecurityCode.setEnabled(true);
                mBtnGetSecurityCode.setTextColor(Color.parseColor("#1d99da"));
            }
            mBtnLogin.setBackgroundResource(R.drawable.btn_login_normal_bg);
            mBtnLogin.setTextColor(Color.parseColor("#C3E9F2"));
            mBtnLogin.setEnabled(false);
        } else {
            mBtnLogin.setBackgroundResource(R.drawable.btn_login_click_bg);
            mBtnLogin.setTextColor(Color.parseColor("#ffffff"));
            mBtnLogin.setEnabled(true);
        }
    }

    /**
     *      * 获取随机汉字
     *      * @return
     *     
     */
    private String getRandomWord() {
        String str = "";
        int heightPos;
        int lowPos;
        Random rd = new Random();
        heightPos = 176 + Math.abs(rd.nextInt(39));
        lowPos = 161 + Math.abs(rd.nextInt(93));
        byte[] bt = new byte[2];
        bt[0] = Integer.valueOf(heightPos).byteValue();
        bt[1] = Integer.valueOf(lowPos).byteValue();
        try {
            str = new String(bt, "GBK");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return str;
    }

}
