package com.xq.myxuanqi.ui.activity.me.setting;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import android.security.keystore.KeyProperties;
import android.support.annotation.RequiresApi;
import android.support.constraint.ConstraintLayout;
import android.support.v7.widget.Toolbar;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.PopupWindow;
import android.widget.TextView;
import android.widget.Toast;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.ui.activity.me.fingerprint.FingerprintHelper;
import com.xq.myxuanqi.util.SpUtil;

import java.util.Timer;
import java.util.TimerTask;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class FingerprintActivity extends BaseActivity implements FingerprintHelper.SimpleAuthenticationCallback {

    @BindView(R.id.tv_finger)
    TextView         mTvFinger;
    @BindView(R.id.tv_remind)
    TextView         mTvRemind;
    @BindView(R.id.ib_on_off)
    ImageButton      mIbOnOff;
    @BindView(R.id.cl_main)
    ConstraintLayout mClMain;
    @BindView(R.id.tb)
    Toolbar          mTb;
    private boolean switchOff = false;
    private PopupWindow       mPopupWindow;
    private TextView          mTvFinger1;
    private FingerprintHelper mFingerprintHelper;

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_fingerprint;
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    public void init() {
        super.init();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        } else {
            mTb.setPadding(0, 5, 0, 5);
        }
        mTvRemind.setText("温馨提示：1、使用此功能需要您设备的Android版本为6.0（含）以上的系统，并且手机支持指纹功能。" +
                "2、指纹登录调用的是该手机系统的指纹功能，app并不存储客户的指纹信息。");
        switchOff = SpUtil.getInstance().getBoolean("fingerLogin");
        mFingerprintHelper = new FingerprintHelper(this);
        mFingerprintHelper.setCallback(this);
        //生成加密密钥
        mFingerprintHelper.generateKey();
        //指纹登录的设置只保存在本机，设置指纹登录是否开启，应检验用户名和（是否开启指纹登录）两者是否对应
        if (SpUtil.getInstance().getBoolean("fingerLogin")) {
            mIbOnOff.setImageDrawable(getResources().getDrawable(R.mipmap.on));
        } else {
            mIbOnOff.setImageDrawable(getResources().getDrawable(R.mipmap.off));
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @OnClick({R.id.tb_back, R.id.ib_on_off})
    public void onViewClicked(View v) {
        switch (v.getId()) {
            case R.id.tb_back:
                finish();
                break;
            case R.id.ib_on_off:
                if (switchOff) {
                    switchOff = false;
                    mIbOnOff.setImageDrawable(getResources().getDrawable(R.mipmap.off));
                    SpUtil.getInstance().saveBoolean("fingerLogin", false);
                } else {
                    mIbOnOff.setImageDrawable(getResources().getDrawable(R.mipmap.on));
                    SpUtil.getInstance().saveBoolean("fingerLogin", true);
                    //检查当前设备是否支持指纹 0：支持 -1：未检测到指纹硬件 -2: 未录入指纹 -3: 未开启设备锁
                    int fingerprintAvailable = mFingerprintHelper.checkFingerprintAvailable();
                    if (fingerprintAvailable == 0) {//支持指纹
                        switchOff = true;
                        //验证指纹
                        mFingerprintHelper.setPurpose(KeyProperties.PURPOSE_ENCRYPT);
                        mFingerprintHelper.authenticate();
                        View view = LayoutInflater.from(getBaseContext()).inflate(R.layout.popupwindow_finger, null, false);
                        Button btnCancel = view.findViewById(R.id.btn_cancel);
                        btnCancel.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                //取消指纹识别
                                mFingerprintHelper.stopAuthenticate();
                                mPopupWindow.dismiss();
                                backgroundAlpha(1.0f);
                                switchOff = false;
                                SpUtil.getInstance().saveBoolean("fingerLogin", false);
                                mIbOnOff.setImageDrawable(getResources().getDrawable(R.mipmap.off));
                            }
                        });
                        mTvFinger1 = view.findViewById(R.id.tv_finger);
                        mPopupWindow = new PopupWindow(view, ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                        mPopupWindow.setBackgroundDrawable(new ColorDrawable(Color.WHITE));
                        backgroundAlpha(0.5f);
                        mPopupWindow.showAtLocation(mClMain, Gravity.CENTER_VERTICAL, 0, 0);

                    } else {
                        if (fingerprintAvailable == -1) {
                            Toast.makeText(getBaseContext(), "该设备尚未检测到指纹硬件", Toast.LENGTH_SHORT).show();
                        } else if (fingerprintAvailable == -2) {
                            Toast.makeText(getBaseContext(), "该设备未录入指纹，请去系统->设置中添加指纹", Toast.LENGTH_SHORT).show();
                        } else if (fingerprintAvailable == -3) {
                            Toast.makeText(this, "该设备未开启锁屏密码", Toast.LENGTH_SHORT).show();
                        }
                        SpUtil.getInstance().saveBoolean("fingerLogin", false);
                        mIbOnOff.setImageDrawable(getResources().getDrawable(R.mipmap.off));
                    }
                }
                break;
        }
    }

    @Override
    public void onAuthenticationSucceeded(String value) {
        mTvFinger1.setText("正在校验指纹");
        Timer timer = new Timer();
        TimerTask timerTask = new TimerTask() {
            @Override
            public void run() {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        mPopupWindow.dismiss();
                        backgroundAlpha(1.0f);
                        Toast.makeText(FingerprintActivity.this, "验证成功！", Toast.LENGTH_SHORT).show();
                    }
                });
            }
        };
        timer.schedule(timerTask, 2000);

    }

    @Override
    public void onAuthenticationFail() {
        mTvFinger1.setText("验证失败，请再试一次！");
    }

    /**
     * 设置添加屏幕的背景透明度
     *
     * @param bgAlpha
     */
    public void backgroundAlpha(float bgAlpha) {
        WindowManager.LayoutParams lp = getWindow().getAttributes();
        lp.alpha = bgAlpha; //0.0-1.0
        getWindow().setAttributes(lp);
    }

}
