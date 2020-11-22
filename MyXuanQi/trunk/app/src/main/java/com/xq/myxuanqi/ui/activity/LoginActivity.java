package com.xq.myxuanqi.ui.activity;

import android.arch.lifecycle.Observer;
import android.arch.lifecycle.ViewModelProviders;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.constraint.ConstraintLayout;
import android.text.Editable;
import android.text.Html;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.cloudibpm.core.util.encode.MD5Util;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.model.LoginModel;
import com.xq.myxuanqi.ui.view.LoadingDialog;
import com.xq.myxuanqi.util.EmptyUtils;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.ToastUtils;
import com.xq.myxuanqi.util.UrlUtils;
import com.xq.myxuanqi.viewModel.LoginViewModel;
import com.xq.myxuanqi.zxing.activity.CaptureActivity;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class LoginActivity extends BaseActivity {

    /* @BindView(R.id.fiv_userName)
     FontIconTextView mFivUserName;
     @BindView(R.id.rl_userName)
     RelativeLayout   mRlUserName;
     @BindView(R.id.fiv_userPwd)
     FontIconTextView mFivUserPwd;
     @BindView(R.id.rl_userPwd)
     RelativeLayout   mRlUserPwd;*/
    @BindView(R.id.et_userName)
    EditText         mEtUserName;
    @BindView(R.id.et_userPwd)
    EditText         mEtUserPwd;
    @BindView(R.id.tv_hint)
    TextView         mTvHint;
    @BindView(R.id.iv)
    ImageView        mIv;
    @BindView(R.id.cl)
    ConstraintLayout mCl;
    @BindView(R.id.btn_login)
    Button           mBtnLogin;
    @BindView(R.id.tv_ip)
    TextView         mTvIp;
    @BindView(R.id.fiv_userPwd)
    ImageView        mFivUserPwd;
    @BindView(R.id.tv_tel)
    TextView         mTvTel;
    @BindView(R.id.tv_registed)
    TextView         mTvRegisted;
    private LoginViewModel        mLoginViewModel;
    private LoadingDialog.Builder loadBuilder;  //正在登录...
    private LoadingDialog         loadDialog;
    private int     pwdNum       = 0;
    private boolean isVisibility = true;

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_login;
    }

    @Override
    public void init() {
        super.init();
        View decor = getWindow().getDecorView();
        decor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        if (UrlUtils.getInstance().type == 0) {
            Boolean isFirstLogin = SpUtil.getInstance().getBoolean("isFirstLogin");
            if (isFirstLogin) {  //判断是第一次登陆
                SpUtil.getInstance().saveBoolean("isFirstLogin", false);
                //打开相机
                JumpToResult(CaptureActivity.class, REQUEST_CODE);
            }
            mTvIp.setVisibility(View.VISIBLE);
        } else {
            mTvIp.setVisibility(View.GONE);
        }
        mTvRegisted.setText(Html.fromHtml("<u>"+"还没有账号？快速注册"+"</u>"));
        loadBuilder = new LoadingDialog.Builder(this)
                .setMessage("正在登录中...")
                .setCancelable(false);
        loadDialog = loadBuilder.create();
      /*  Typeface typeface = FontManager.getTypeface(this, FontManager.FONTAWESOME);
        FontManager.markAsIconContainer(mFivUserName, typeface);
        FontManager.markAsIconContainer(mFivUserPwd, typeface);*/
        mLoginViewModel = ViewModelProviders.of(this).get(LoginViewModel.class);
        //sp中是否存在账号和密码
        mLoginViewModel.isHasAccountPwd();
        mLoginViewModel.getLoginModel().observe(this, new Observer<LoginModel>() {
            @Override
            public void onChanged(@Nullable LoginModel loginModel) {
                //输入框内填写账号密码
                mEtUserName.setText(loginModel.getAccount());
                mEtUserPwd.setText(loginModel.getPassword());
                mEtUserName.setOnFocusChangeListener(new View.OnFocusChangeListener() {
                    @Override
                    public void onFocusChange(View v, boolean hasFocus) {
                        if (hasFocus) {
                            mEtUserName.addTextChangedListener(userNameTextWatcher);
                        }
                        btnClickisTrue();
                    }
                });
                mEtUserPwd.setOnFocusChangeListener(new View.OnFocusChangeListener() {
                    @Override
                    public void onFocusChange(View v, boolean hasFocus) {
                        if (hasFocus) {
                            mEtUserPwd.addTextChangedListener(userPwdTextWatcher);
                        }
                        btnClickisTrue();
                    }
                });
            }
        });
        mLoginViewModel.setOnCallBack(new LoginViewModel.onCallBack() {
            @Override
            public void onCallBackListener(int i) {
                switch (i) {
                    case 0:
                        String text = "登录成功";
                        ToastUtils.shortToast(text, mTvHint, LoginActivity.this);
                        loadDialog.dismiss();
                        JumpTo(HomeActivity.class);
                        break;
                    case -1:
                        String text1 = "用户名或密码错误";
                        ToastUtils.shortToast(text1, mTvHint, LoginActivity.this);
                        mEtUserPwd.setText("");
                        loadDialog.dismiss();
                        break;
                    case -2:
                        String text3 = "网络连接超时";
                        ToastUtils.shortToast(text3, mTvHint, LoginActivity.this);
                        loadDialog.dismiss();
                        if (UrlUtils.getInstance().type == 0) {
                            Toast.makeText(LoginActivity.this, "重新获取ip地址", Toast.LENGTH_SHORT).show();
                            JumpToResult(CaptureActivity.class, REQUEST_CODE);
                        }
                        break;
                    case -3:
                        String text2 = "网络连接失败";
                        ToastUtils.shortToast(text2, mTvHint, LoginActivity.this);
                        loadDialog.dismiss();
                        break;
                }
            }
        });

    }

    private void btnClickisTrue() {
        String userName = mEtUserName.getText().toString().trim();
        String userPwd = mEtUserPwd.getText().toString().trim();
        //如果输入框内容为空，登录按钮不可点击
        if (EmptyUtils.isEmpty(userName) || EmptyUtils.isEmpty(userPwd)) {
            mBtnLogin.setBackgroundResource(R.drawable.btn_login_normal_bg);
            mBtnLogin.setTextColor(Color.parseColor("#C3E9F2"));
            mBtnLogin.setEnabled(false);
        } else {
            mBtnLogin.setBackgroundResource(R.drawable.btn_login_click_bg);
            mBtnLogin.setTextColor(Color.parseColor("#ffffff"));
            mBtnLogin.setEnabled(true);
        }
    }

    private TextWatcher userNameTextWatcher = new TextWatcher() {

        private String mS1;

        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            mS1 = s.toString();
        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
            btnClickisTrue();
        }

        @Override
        public void afterTextChanged(Editable s) {
            //账号发生改变，清空密码信息
            boolean equals = mS1.equals(s.toString());
            if (equals == false) {
                mEtUserPwd.setText("");
                SpUtil.getInstance().saveStr("userPwd", "");
                SpUtil.getInstance().saveBoolean("fingerLogin", false);
            }
        }
    };
    private TextWatcher userPwdTextWatcher  = new TextWatcher() {

        private int mLength;

        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            //密码长度
            mLength = s.length();
        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
            btnClickisTrue();
        }

        @Override
        public void afterTextChanged(final Editable s) {
            //密码发生改变，清空密码信息
            //            String s1 = mS1;
            //            if (mLength > s.toString().length()) {
            //                mEtUserPwd.setText("");
            SpUtil.getInstance().saveStr("userPwd", "");
            SpUtil.getInstance().saveBoolean("fingerLogin", false);
            //            }
        }
    };

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        //        if (requestCode == REQUEST_CODE) {
        //            if (null != data) {
        //                Bundle bundle = data.getExtras();
        //                if (bundle == null) {
        //                    return;
        //                }
        //                String result = bundle.getString("qr_scan_result");
        //                SpUtil.getInstance().saveStr("ip", result);
        //            }
        //        }
    }

    @OnClick({R.id.btn_login, R.id.tv_tel, R.id.tv_ip, R.id.fiv_userPwd, R.id.tv_registed})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.btn_login:
                loadDialog.show();
                String account = mEtUserName.getText().toString().trim();
                String trim = mEtUserPwd.getText().toString().trim();
                if (TextUtils.isEmpty(account) || TextUtils.isEmpty(trim)) {
                    loadDialog.dismiss();
                    //代替Toast的提示信息
                    String text = "用户名或密码不能为空！";
                    ToastUtils.shortToast(text, mTvHint, this);
                } else {
                    String password = "";
                    String userPwd = SpUtil.getInstance().getStr("userPwd");
                    //            boolean hasAccountPwd = mLoginViewModel.isHasAccountPwd();
                    if (!TextUtils.isEmpty(userPwd)) {
                        password = trim;
                    } else {
                        password = MD5Util.getMD5(trim);
                    }
                    //访问网络，判断用户名密码是否正确
                    mLoginViewModel.isLoginSuccess(account, password);
                }
                break;
            case R.id.tv_tel:
                JumpTo(TelephoneLoginActivity.class);
                break;
            case R.id.tv_ip:
                JumpToResult(CaptureActivity.class, REQUEST_CODE);
                break;
            case R.id.fiv_userPwd:
                if (isVisibility) {
                    if (pwdNum == 0) {
                        mEtUserPwd.setText("");
                        SpUtil.getInstance().saveStr("userPwd", "");
                        SpUtil.getInstance().saveBoolean("fingerLogin", false);
                        pwdNum++;
                    }
                    mFivUserPwd.setImageResource(R.mipmap.eye_on);
                    mEtUserPwd.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                    isVisibility = false;
                } else {
                    mFivUserPwd.setImageResource(R.mipmap.eye_off);
                    mEtUserPwd.setTransformationMethod(PasswordTransformationMethod.getInstance());
                    isVisibility = true;
                }
                break;
            case R.id.tv_registed:
                JumpToBack(RegistedActivity.class);
                break;
        }
    }

}
