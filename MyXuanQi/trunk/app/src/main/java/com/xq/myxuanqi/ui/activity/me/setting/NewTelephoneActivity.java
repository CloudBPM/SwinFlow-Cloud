package com.xq.myxuanqi.ui.activity.me.setting;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.util.TelPhoneUtil;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.michaelrocks.libphonenumber.android.PhoneNumberUtil;

/*
* 获取新的手机号
* */
public class NewTelephoneActivity extends BaseActivity {


    @BindView(R.id.et_tel)
    EditText mEtTel;
    @BindView(R.id.tb)
    Toolbar  mTb;
    private PhoneNumberUtil mPhoneNumberUtil;

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_new_telephone;
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
        mPhoneNumberUtil = PhoneNumberUtil.createInstance(this);
    }

    @OnClick({R.id.tb_back, R.id.btn_submit})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tb_back:
                finish();
                break;
            case R.id.btn_submit:
                String tel = mEtTel.getText().toString().trim();
                //检验手机号是否正确
                boolean valid = TelPhoneUtil.isChinaPhoneLegal(tel);
                if (valid) {
                    Intent intent = new Intent(NewTelephoneActivity.this, ChangeTelephoneActivity.class);
                    intent.putExtra("tel", tel);
                    startActivity(intent);
                } else {
                    Toast.makeText(this, "手机号不正确", Toast.LENGTH_SHORT).show();
                }
                break;
        }
    }

}
