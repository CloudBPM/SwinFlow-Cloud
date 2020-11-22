package com.xq.myxuanqi.ui.activity.me.setting;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.support.constraint.ConstraintLayout;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.model.contact.ContactMessage;
import com.xq.myxuanqi.model.contact.ContactPerson;
import com.xq.myxuanqi.model.systemNotice.SystemNotice;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.ui.activity.FingerprintLoginActivity;
import com.xq.myxuanqi.ui.activity.LoginActivity;
import com.xq.myxuanqi.util.CommonAction;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;
import com.xq.myxuanqi.zxing.activity.CaptureActivity;

import org.litepal.LitePal;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

/*
* 设置页面
* */
public class SettingActivity extends BaseActivity {

    @BindView(R.id.ftv_icon_selected2)
    ImageView        mFtvIconSelected2;
    @BindView(R.id.ftv_icon_selected5)
    ImageView        mFtvIconSelected5;
    @BindView(R.id.ftv_icon_selected9)
    ImageView        mFtvIconSelected9;
    @BindView(R.id.ftv_icon_selected6)
    ImageView        mFtvIconSelected6;
    @BindView(R.id.tv_version)
    TextView         mTvVersion;
    @BindView(R.id.ftv_icon_selected7)
    ImageView        mFtvIconSelected7;
    @BindView(R.id.tb)
    Toolbar          mTb;
    @BindView(R.id.cl_get_ip)
    ConstraintLayout mClGetIp;

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_setting;
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
        PackageManager packageManager = getPackageManager();
        PackageInfo packageInfo = null;
        try {
            packageInfo = packageManager.getPackageInfo(getPackageName(), 0);
            String versionName = packageInfo.versionName;
            mTvVersion.setText("版本号 " + versionName);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        if (UrlUtils.type == 0) {
            mClGetIp.setVisibility(View.VISIBLE);
        }else {
            mClGetIp.setVisibility(View.GONE);
        }
    }

    @OnClick({R.id.tb_back, R.id.cl_basic_information, R.id.cl_setting_security,
            R.id.cl_payment_information, R.id.cl_integral_management, R.id.cl_setting_about,
            R.id.cl_setting_mobile, R.id.cl_out_login, R.id.cl_get_ip, R.id.cl_setting_permission})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tb_back:
                finish();
                break;
            case R.id.cl_basic_information: //基本信息
                JumpToBack(ChangeBasicInformationActivity.class);
                break;
            case R.id.cl_setting_security:  //安全设置
                JumpToBack(SecuritySettingActivity.class);
                break;
            case R.id.cl_payment_information:   //支付信息
                break;
            case R.id.cl_integral_management:   //积分管理
                break;
            case R.id.cl_setting_about: //关于
                JumpToBack(AboutActivity.class);
                break;
            case R.id.cl_setting_mobile: //手机信息
                //                JumpToBack(MobileActivity.class);
                break;
            case R.id.cl_out_login:
                SpUtil.getInstance().saveBoolean("autoLogin", false);
                CommonAction.getInstance().outSign();
                //判断该账号是否开启了指纹登录
                if (SpUtil.getInstance().getBoolean("fingerLogin")) {
                    JumpTo(FingerprintLoginActivity.class);
                } else {
                    //这里要清除保存的账号信息
                    //主要是清除session，数据库保存的聊天信息和联系人信息
                    //删除所有的数据库信息
                    LitePal.deleteAll(ContactPerson.class);
                    LitePal.deleteAll(ContactMessage.class);
                    LitePal.deleteAll(SystemNotice.class);
                    JumpTo(LoginActivity.class);
                }
                break;
            case R.id.cl_get_ip:
                JumpToResult(CaptureActivity.class, REQUEST_CODE);
                break;
            case R.id.cl_setting_permission:
                JumpToBack(PermissionActivity.class);
                break;
        }
    }
}
