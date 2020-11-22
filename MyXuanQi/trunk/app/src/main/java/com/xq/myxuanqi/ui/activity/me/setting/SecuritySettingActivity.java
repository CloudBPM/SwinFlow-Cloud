package com.xq.myxuanqi.ui.activity.me.setting;

import android.content.DialogInterface;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AlertDialog;
import android.support.v7.widget.Toolbar;
import android.view.View;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.BaseActivity;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

/*
* 安全设置
* */
public class SecuritySettingActivity extends BaseActivity {

    @BindView(R.id.tb)
    Toolbar mTb;

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_security_setting;
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

    @OnClick({R.id.tb_back, R.id.cl_change_pwd, R.id.cl_change_tel, R.id.cl_finger})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tb_back:
                finish();
                break;
            case R.id.cl_change_pwd:
                AlertDialog alertDialog = new AlertDialog.Builder(SecuritySettingActivity.this)
                        .setMessage("是否记得之前使用的密码？")
                        .setNegativeButton("不记得", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.dismiss();
                                //验证手机号是否正确
                                JumpToBack(VerifyTelephoneActivity.class);
                            }
                        })
                        .setPositiveButton("记得", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.dismiss();
                                //验证之前的密码是否正确
                                JumpToBack(VerifyPasswordActivity.class);
                            }
                        })
                        .create();
                alertDialog.show();

                break;
            case R.id.cl_change_tel:
                JumpToBack(NewTelephoneActivity.class);
                break;
            case R.id.cl_finger:
                JumpToBack(FingerprintActivity.class);
                break;
        }
    }

}
