package com.xq.myxuanqi.ui.activity.me.setting;

import android.arch.lifecycle.ViewModelProviders;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.widget.Toolbar;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.GridView;
import android.widget.PopupWindow;
import android.widget.Toast;

import com.google.gson.Gson;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.adapter.PermissionAdapter;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.ui.view.imgeSelector.ImageSelector;
import com.xq.myxuanqi.util.EmptyUtils;
import com.xq.myxuanqi.viewModel.PermissionViewModel;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class PermissionActivity extends BaseActivity {

    @BindView(R.id.tb)
    Toolbar  mTb;
    @BindView(R.id.et_problem)
    EditText mEtProblem;
    @BindView(R.id.gv)
    GridView mGv;
    @BindView(R.id.et_name)
    EditText mEtName;
    @BindView(R.id.et_tel)
    EditText mEtTel;
    @BindView(R.id.btn_commit)
    Button   mBtnCommit;
    private List<String> mList = new ArrayList<>();
    private List<String> mPathList = new ArrayList<>();
    private boolean           mIsCameraImage;
    private PermissionAdapter mPermissionAdapter;
    private PermissionViewModel mPermissionViewModel;
    private boolean isTrueSubmit = false;
    @Override
    protected int getLayoutResId() {
        return R.layout.activity_permission;
    }

    @Override
    public void init() {
        super.init();
        View decor = getWindow().getDecorView();
        decor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        } else {
            mTb.setPadding(0, 10, 0, 10);
        }
        mEtProblem.addTextChangedListener(new TextWatcher() {
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
        mPermissionViewModel = ViewModelProviders.of(this).get(PermissionViewModel.class);
        mPermissionAdapter = new PermissionAdapter(this, mList,mPathList,this);
        mGv.setAdapter(mPermissionAdapter);
        mGv.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                if (position == parent.getChildCount() - 1) {
                    if (mList.size() == 4) {
                        //达到上限不可再添加图片
                        Toast.makeText(PermissionActivity.this, "达到图片数量上限", Toast.LENGTH_SHORT).show();
                    } else {
                        //添加图片，上传
                        //调用相册
                        ImageSelector.builder()
                                .useCamera(true) // 设置是否使用拍照
                                .setSingle(true)  //设置是否单选
                                .setCrop(false)  // 设置是否使用图片剪切功能。
                                .setViewImage(true) //是否点击放大图片查看,，默认为true
                                .start(PermissionActivity.this, 3); // 打开相册
                    }
                } else {
                    //查看大图
                }
            }
        });
        mPermissionViewModel.setSubmitFeedBackListener(new PermissionViewModel.SubmitFeedBackListener() {
            @Override
            public void submitFeedBackListenerOnCallBack(int i) {
                if (i==0){
                    isTrueSubmit = true;
                    Toast.makeText(PermissionActivity.this, "提交成功！", Toast.LENGTH_SHORT).show();
                    finish();
                }
            }
        });
    }

    @OnClick({R.id.tb_back, R.id.cl_text_permission, R.id.cl_name, R.id.cl_tel, R.id.btn_commit})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tb_back:
                finish();
                break;
            case R.id.cl_text_permission:
                mEtProblem.setFocusableInTouchMode(true);
                mEtProblem.setFocusable(true);
                mEtProblem.requestFocus();
                InputMethodManager imm = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
                imm.showSoftInput(mEtProblem, InputMethodManager.SHOW_IMPLICIT);
                break;
            case R.id.cl_name:
                mEtName.setFocusableInTouchMode(true);
                mEtName.setFocusable(true);
                mEtName.requestFocus();
                InputMethodManager imm1 = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
                imm1.showSoftInput(mEtName, InputMethodManager.SHOW_IMPLICIT);
                break;
            case R.id.cl_tel:
                mEtTel.setFocusableInTouchMode(true);
                mEtTel.setFocusable(true);
                mEtTel.requestFocus();
                InputMethodManager imm2 = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
                imm2.showSoftInput(mEtName, InputMethodManager.SHOW_IMPLICIT);
                break;
            case R.id.btn_commit:
                //发送邮件
                String content = mEtProblem.getText().toString().trim();
                String nickname = mEtName.getText().toString().trim();
                String contactInformation = mEtTel.getText().toString().trim();
                String attach = "";
                if (EmptyUtils.isNotEmpty(mPathList)) {
                    String[] paths = new String[mPathList.size()];
                    for (int i = 0; i < mPathList.size(); i++) {
                        paths[i] = mPathList.get(i);
                    }
                    Gson gson = new Gson();
                    attach = gson.toJson(paths);
                }
                if (EmptyUtils.isEmpty(nickname)){
                    nickname = "匿名用户";
                }
                if (EmptyUtils.isEmpty(contactInformation)){
                    contactInformation = "";
                }
                mPermissionViewModel.submitFeedBack(nickname,contactInformation,content,attach);
                break;
        }
    }

    private void btnClickisTrue() {
        String problem = mEtProblem.getText().toString().trim();
        //如果输入框内容为空，登录按钮不可点击
        if (EmptyUtils.isEmpty(problem)) {
            mBtnCommit.setBackgroundResource(R.drawable.btn_login_normal_bg);
            mBtnCommit.setTextColor(Color.parseColor("#C3E9F2"));
            mBtnCommit.setEnabled(false);
        } else {
            mBtnCommit.setBackgroundResource(R.drawable.btn_login_click_bg);
            mBtnCommit.setTextColor(Color.parseColor("#ffffff"));
            mBtnCommit.setEnabled(true);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        if (requestCode == 3) {
            if (EmptyUtils.isNotEmpty(data)){
                mIsCameraImage = data.getBooleanExtra(ImageSelector.IS_CAMERA_IMAGE, false);
                ArrayList<String> list = data.getStringArrayListExtra(ImageSelector.SELECT_RESULT);
                String path = data.getStringExtra("path");
                String image = list.get(0);
                mPathList.add(path);
                mList.add(image);
                mPermissionAdapter.notifyDataSetChanged();
            }

        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (isTrueSubmit==false){
            if (EmptyUtils.isNotEmpty(mPathList)){
                String[] paths = new String[mPathList.size()];
                for (int i=0;i<mPathList.size();i++){
                    paths[i] = mPathList.get(i);
                }
                Gson gson = new Gson();
                String json = gson.toJson(paths);
                mPermissionViewModel.deleteAllImage(json);
            }
        }
    }
}
