package com.xq.myxuanqi.ui.activity.me.setting;

import android.arch.lifecycle.ViewModelProviders;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.text.TextUtils;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.cloudibpm.core.util.encode.MD5Util;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.ui.activity.LoginActivity;
import com.xq.myxuanqi.util.CommonAction;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.viewModel.ChangePasswordViewModel;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class ChangePasswordActivity extends BaseActivity {
    @BindView(R.id.et_password)
    EditText mEtPassword;
    @BindView(R.id.et_check_password)
    EditText mEtCheckPassword;
    @BindView(R.id.textView)
    TextView mTextView;
    @BindView(R.id.tb)
    Toolbar  mTb;
    private ChangePasswordViewModel mChangePasswordViewModel;

    @Override
    public void init() {
        super.init();
        View decor = getWindow().getDecorView();
        decor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        } else {
            mTb.setPadding(0, 5, 0, 5);
        }
        mChangePasswordViewModel = ViewModelProviders.of(this).get(ChangePasswordViewModel.class);
        mChangePasswordViewModel.setChangePasswordOnCallBack(new ChangePasswordViewModel.ChangePasswordOnCallBack() {
            @Override
            public void isSuccessChangePassword(int i) {
                switch (i) {
                    case 0:
                        Toast.makeText(ChangePasswordActivity.this, "修改成功,请重新登录", Toast.LENGTH_SHORT).show();
                        SpUtil.getInstance().saveBoolean("autoLogin", false);
                        SpUtil.getInstance().saveStr("userPwd", "");
                        CommonAction.getInstance().outSign();
                        JumpTo(LoginActivity.class);
                        break;
                    case -1:
                        Toast.makeText(ChangePasswordActivity.this, "修改失败", Toast.LENGTH_SHORT).show();
                        break;
                    case -2:
                        Toast.makeText(ChangePasswordActivity.this, "网络连接失败", Toast.LENGTH_SHORT).show();
                        break;
                }
            }
        });
    }

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_change_password;
    }

    @OnClick({R.id.tb_back, R.id.btn_change_password})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tb_back:
                finish();
                break;
            case R.id.btn_change_password:
                String pwd = mEtPassword.getText().toString().trim();
                String checkPwd = mEtCheckPassword.getText().toString().trim();
                if (!TextUtils.isEmpty(pwd) && !TextUtils.isEmpty(checkPwd)) {
                    if (pwd.equals(checkPwd)) {
                        mTextView.setVisibility(View.GONE);
                        String md5Pwd = MD5Util.getMD5(pwd);
                        String userName = SpUtil.getInstance().getStr("userName");
                        mChangePasswordViewModel.changePwd(userName, md5Pwd);
                    } else {
                        mTextView.setVisibility(View.VISIBLE);
                        mTextView.setText("两次输入的密码不一致");
                    }
                } else {
                    mTextView.setText("请输入密码");
                    mTextView.setVisibility(View.VISIBLE);
                }
                break;
        }
    }

}
