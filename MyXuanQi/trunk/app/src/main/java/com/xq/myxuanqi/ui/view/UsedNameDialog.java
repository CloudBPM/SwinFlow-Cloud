package com.xq.myxuanqi.ui.view;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.exoplayer2.C;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.util.EmptyUtils;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

/**
 * Created by wm on 2019/3/19.
 */

public class UsedNameDialog extends Dialog {


    @BindView(R.id.tv_title)
    TextView mTvTitle;
    @BindView(R.id.et_used_name)
    EditText mEtUsedName;
    @BindView(R.id.btn_name)
    Button   mBtnName;
    @BindView(R.id.btn_cancle)
    Button   mBtnCancle;
    @BindView(R.id.btn_enter)
    Button   mBtnEnter;
    private String mTitle;  //标题
    private Context mContext;
    private String mUsedName;   //昵称
    private OnShakeListener mOnShakeListener;   //摇一摇获取昵称
    private OnSkipListener mOnSkipListener; //取消
    private OnNextStepListener mOnNextStepListener; //下一步
    public interface OnShakeListener{
        void setOnClick(View v);
    }
    public void setOnShakeListener (OnShakeListener onShakeListener){
        this.mOnShakeListener = onShakeListener;
    }
    public interface OnSkipListener{
        void setOnClick();
    }
    public void setOnSkipListener (OnSkipListener onShakeListener){
        this.mOnSkipListener = onShakeListener;
    }
    public interface OnNextStepListener{
        void setOnClick(String name);
    }
    public void setOnNextStepListener (OnNextStepListener onNextStepListener){
        this.mOnNextStepListener = onNextStepListener;
    }
    public UsedNameDialog(@NonNull Context context) {
        this(context, 0);
        this.mContext = context;
    }

    public UsedNameDialog(@NonNull Context context, int themeResId) {
        super(context, themeResId);
        this.mContext = context;
    }

    protected UsedNameDialog(@NonNull Context context, boolean cancelable, @Nullable OnCancelListener cancelListener) {
        super(context, cancelable, cancelListener);
        this.mContext = context;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.dialog_used_name);
        ButterKnife.bind(this);
        setCanceledOnTouchOutside(false);//点击空白处不可取消
        initData();//初始化数据
    }

    private void initData() {
        if (EmptyUtils.isNotEmpty(mTitle)){
            mTvTitle.setText(mTitle);
        }else {
            mTvTitle.setText("提示");
        }
        mEtUsedName.setText(mUsedName);
    }

    @OnClick({R.id.btn_name, R.id.btn_cancle, R.id.btn_enter})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.btn_name:
                mOnShakeListener.setOnClick(mEtUsedName);
                break;
            case R.id.btn_cancle:
                mOnSkipListener.setOnClick();
                break;
            case R.id.btn_enter:
                String name = mEtUsedName.getText().toString().trim();
                mOnNextStepListener.setOnClick(name);
                break;
        }
    }

    public void setTitle(String title) {
        mTitle = title;
    }
    public void setUsedName(String name){
        mUsedName = name;
    }
}
