package com.xq.myxuanqi.ui.activity;

import android.arch.lifecycle.ViewModelProviders;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.support.annotation.NonNull;
import android.support.v7.widget.Toolbar;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.alibaba.fastjson.JSON;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.util.encode.MD5Util;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.me.setting.ChangeBasicInformationActivity;
import com.xq.myxuanqi.util.EmptyUtils;
import com.xq.myxuanqi.util.TelPhoneUtil;
import com.xq.myxuanqi.util.ToastUtils;
import com.xq.myxuanqi.viewModel.RegistedViewModel;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import cn.qqtheme.framework.picker.OptionPicker;

public class RegistedActivity extends BaseActivity {

    @BindView(R.id.tb)
    Toolbar  mTb;
    @BindView(R.id.et_tel)
    EditText mEtTel;
    @BindView(R.id.et_name)
    EditText mEtName;
    @BindView(R.id.tv_company_name)
    TextView mTvCompanyName;
    @BindView(R.id.et_password)
    EditText mEtPassword;
    @BindView(R.id.et_code)
    EditText mEtCode;
    @BindView(R.id.tv_get_code)
    TextView mTvGetCode;
    @BindView(R.id.btn_registed)
    Button   mBtnRegisted;
    private RegistedViewModel mRegistedViewModel;
    private List<String> mItems1 = new ArrayList<>();;
    private HashMap<String, String> mMap = new HashMap<>();
    private MyCountDownTimer        mMyCountDownTimer;
    @Override
    protected int getLayoutResId() {
        return R.layout.activity_registed;
    }

    @Override
    public void init() {
        super.init();
        View decor = getWindow().getDecorView();
        decor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        } else {
            mTb.setPadding(0, 80, 0, 10);
        }
        mMyCountDownTimer = new MyCountDownTimer(60000, 1000);
        mRegistedViewModel = ViewModelProviders.of(this).get(RegistedViewModel.class);
        mRegistedViewModel.getCompanyName();
        mRegistedViewModel.setOnCallBack(new RegistedViewModel.onCallBack() {
            @Override
            public void onCallBackListener(List<Organization> list,int status) {
                switch (status){
                    case 0:
                        mItems1.add("无");
                        for (int i=0;i<list.size();i++) {
                            Organization organization= JSON.parseObject(JSON.toJSONString(list.get(i)),Organization.class);
                            mItems1.add(organization.getName());
                            mMap.put(organization.getName(), organization.getId());
                        }
                        break;
                    case -1:
                        mTvCompanyName.setText("无");
                        break;
                    case -2:
                        Toast.makeText(RegistedActivity.this, "网络连接超时，请重试！", Toast.LENGTH_SHORT).show();
                        finish();
                        break;
                    case -3:
                        Toast.makeText(RegistedActivity.this, "服务器异常，请稍候重试！", Toast.LENGTH_SHORT).show();
                        finish();
                        break;
                }
            }
        });
        mRegistedViewModel.setGetCodeOnCallBack(new RegistedViewModel.GetCodeOnCallBack() {
            @Override
            public void getCodeOnCallBackListener(int i) {
                switch (i){
                    case 0:
                        Toast.makeText(RegistedActivity.this, "验证码获取成功！", Toast.LENGTH_SHORT).show();
                        break;
                    case 1:
                        Toast.makeText(RegistedActivity.this, "注册成功，请登录！", Toast.LENGTH_SHORT).show();
                        finish();
                        break;
                    case -1:
                        Toast.makeText(RegistedActivity.this, "验证码获取失败！", Toast.LENGTH_SHORT).show();
                        break;
                    case -2:
                        Toast.makeText(RegistedActivity.this, "网络连接超时，请重试！", Toast.LENGTH_SHORT).show();
                        finish();
                        break;
                    case -3:
                        Toast.makeText(RegistedActivity.this, "服务器异常，请稍候重试！", Toast.LENGTH_SHORT).show();
                        finish();
                        break;
                }
            }
        });
    }

    @OnClick({R.id.tb_back, R.id.tv_company_name, R.id.tv_get_code, R.id.btn_registed})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tb_back:
                finish();
                break;
            case R.id.tv_company_name:
                if ((mItems1.size()==1&&"无".equals(mItems1.get(0)))||mItems1.size()==0){
                    Toast.makeText(this, "无更多单位列表！", Toast.LENGTH_SHORT).show();
                }else {
                    OptionPicker optionPicker1 = new OptionPicker(RegistedActivity.this, mItems1);
                    optionPicker1.setOnOptionPickListener(new OptionPicker.OnOptionPickListener() {
                        @Override
                        public void onOptionPicked(int index, String item) {
                            mTvCompanyName.setText(item);
                        }
                    });
                    optionPicker1.setCancelText("取消");
                    optionPicker1.setSubmitText("确定");
                    optionPicker1.show();
                }
                break;
            case R.id.tv_get_code:
                String telephoneNum = mEtTel.getText().toString().trim();
                //判断手机号是否为空
                if (TextUtils.isEmpty(telephoneNum)) {
                    Toast.makeText(this, "手机号不能为空!", Toast.LENGTH_SHORT).show();
                } else {
                    if (TelPhoneUtil.isChinaPhoneLegal(telephoneNum)) {
                        //判断验证码是否获取成功
                        mRegistedViewModel.getSecurityCode(telephoneNum);
                        mMyCountDownTimer.start();
                    } else {
                        Toast.makeText(this, "请检查手机号是否正确", Toast.LENGTH_SHORT).show();
                    }
                }
                break;
            case R.id.btn_registed:
                String phoneNumber = mEtTel.getText().toString().trim();
                String code = mEtCode.getText().toString().trim();
                String password = mEtPassword.getText().toString().trim();
                String name = mEtName.getText().toString().trim();
                String companyName = mTvCompanyName.getText().toString().trim();
                String orgId = "";
                if (EmptyUtils.isEmpty(name)){
                    name = getRandomName();
                }
                if ("无".equals(companyName)){
                    orgId = "";
                }else {
                    orgId = mMap.get(companyName);
                }
                if (EmptyUtils.isNotEmpty(phoneNumber)&&EmptyUtils.isNotEmpty(code)&&EmptyUtils.isNotEmpty(password)){
                    String pwd = MD5Util.getMD5(password);
                    mRegistedViewModel.setRegistedUser(code,phoneNumber,name,orgId,pwd);
                }else {
                    Toast.makeText(this, "手机号、验证码和密码不能为空！", Toast.LENGTH_SHORT).show();
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
            mTvGetCode.setTextColor(Color.parseColor("#FFDCDCDC"));
            mTvGetCode.setEnabled(false);
            mTvGetCode.setText(millisInFuture / 1000 + "秒后可重新发送");
        }

        @Override
        public void onFinish() {
            mTvGetCode.setText("重新获取验证码");
            mTvGetCode.setEnabled(true);
            mTvGetCode.setTextColor(Color.parseColor("#1d99da"));
        }
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
}
