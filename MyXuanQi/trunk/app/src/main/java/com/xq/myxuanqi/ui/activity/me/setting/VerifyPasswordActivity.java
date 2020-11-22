package com.xq.myxuanqi.ui.activity.me.setting;

import android.os.Build;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import com.cloudibpm.core.util.encode.MD5Util;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.util.SpUtil;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

/*
* 验证之前的密码是否输入正确
* */
public class VerifyPasswordActivity extends BaseActivity {


    @BindView(R.id.et_old_pwd)
    EditText mEtOldPwd;
    @BindView(R.id.tb)
    Toolbar  mTb;

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_verify_password;
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
    }

    @OnClick({R.id.tb_back, R.id.btn_submit})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tb_back:
                finish();
                break;
            case R.id.btn_submit:
                //进行验证，密码是否正确
                String oldPwd = mEtOldPwd.getText().toString().trim();
                String md5Pwd = MD5Util.getMD5(oldPwd);
                String userPwd = SpUtil.getInstance().getStr("userPwd");
                if (md5Pwd.equals(userPwd)) {
                    //密码正确
                    JumpTo(ChangePasswordActivity.class);
                } else {
                    //密码不正确
                    Toast.makeText(this, "密码不正确", Toast.LENGTH_SHORT).show();
                    mEtOldPwd.setText("");
                }
                break;
        }
    }

}
