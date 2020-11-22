package com.xq.myxuanqi.ui.activity.me;

import android.arch.lifecycle.ViewModelProviders;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.support.annotation.Nullable;
import android.support.v7.widget.Toolbar;
import android.view.View;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bumptech.glide.request.RequestOptions;
import com.cloudibpm.core.user.User;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.ui.view.imgeSelector.ImageSelector;
import com.xq.myxuanqi.ui.view.imgeSelector.PortraitBean;
import com.xq.myxuanqi.util.EmptyUtils;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;
import com.xq.myxuanqi.viewModel.SettingPortraitViewModel;

import java.io.File;

import butterknife.BindView;
import butterknife.OnClick;
import de.hdodenhof.circleimageview.CircleImageView;

/*
* 设置个人头像
* */
public class SettingPortraitActivity extends BaseActivity {

    @BindView(R.id.cv)
    CircleImageView mCv;
    @BindView(R.id.tb)
    Toolbar         mTb;
    private User mUser;
    private SettingPortraitViewModel mSettingPortraitViewModel;

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_setting_portrait;
    }

    @Override
    public void init() {
        super.init();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        }else {
            mTb.setPadding(0,5,0,5);
        }
        mUser = SpUtil.getInstance().getLogin().getUser();
        mSettingPortraitViewModel = ViewModelProviders.of(this).get(SettingPortraitViewModel.class);
        mCv.setDrawingCacheEnabled(false);
        String url = this.getCacheDir() + "/Pictures/" + mUser.getId() + ".png";
        File file = new File(url);
        if (file.exists() && file.isFile()) {
            Bitmap bitmap = BitmapFactory.decodeFile(url);
            mCv.setImageBitmap(bitmap);
        }else {
            mCv.setImageResource(R.mipmap.default_avatar);
        }
        /*String url = this.getCacheDir()+"/Pictures/"+ mUser.getId()+".jpg";
        RequestOptions options = new RequestOptions()
                .placeholder(R.mipmap.default_avatar)
                .error(R.mipmap.default_avatar)
                .diskCacheStrategy(DiskCacheStrategy.NONE);
        Glide.with(this).load(url).apply(options).into(mCv);*/
    }

    @OnClick({R.id.tb_back, R.id.btn_photo_album, R.id.btn_photo})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tb_back:
                finish();
                break;
            case R.id.btn_photo_album:
                //调用相册
                ImageSelector.builder()
                        .useCamera(false) // 设置是否使用拍照
                        .setSingle(true)  //设置是否单选
                        .setCrop(true)  // 设置是否使用图片剪切功能。
                        .setViewImage(true) //是否点击放大图片查看,，默认为true
                        .start(this, 1); // 打开相册
                break;
            case R.id.btn_photo:
                //拍照
                ImageSelector.builder()
                        .useCamera(true) // 设置是否使用拍照
                        .setSingle(true)  //设置是否单选
                        .setCrop(true)  // 设置是否使用图片剪切功能。
                        .setViewImage(false) //是否点击放大图片查看,，默认为true
                        .start(this, 2); // 打开相册
                break;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
                if (resultCode==1){
                    //上传成功
//                    String url = UrlUtils.getUrl() + "file/usr/" + mUser.getId() + "/portrait/" + mUser.getId() + ".jpg";
                    mCv.setDrawingCacheEnabled(false);
                        /*String url = this.getCacheDir() + "/Pictures/" + mUser.getId() + ".png";
                        File file = new File(url);
                        if (file.exists() && file.isFile()) {
                            Bitmap bitmap = BitmapFactory.decodeFile(url);
                            mCv.setImageBitmap(bitmap);
                            //                            Uri uri = Uri.fromFile(file);
//                            mCv.setImageURI(uri);
                        } else {
                            mCv.setImageResource(R.mipmap.default_avatar);
                        }*/
                        //UrlUtils.getUrl()+"file/usr/" + userId+"/portrait/"+ userId +".png"
                    String url = UrlUtils.getUrl()+"file/usr/" + mUser.getId() + "/portrait/" + mUser.getId() + ".png";
                    RequestOptions options = new RequestOptions()
                            .placeholder(R.mipmap.default_avatar)
                            .error(R.mipmap.default_avatar)
                            .diskCacheStrategy(DiskCacheStrategy.NONE);
                    Glide.with(this).load(url).apply(options).into(mCv);

                }else {
                    //上传失败
                    mCv.setDrawingCacheEnabled(false);
                    String url = this.getCacheDir()+"/Pictures/"+ mUser.getId()+".png";
                    File file = new File(url);
                    if (file.exists()&&file.isFile()){
                        Bitmap bitmap = BitmapFactory.decodeFile(url);
                        mCv.setImageBitmap(bitmap);
                    }else {
                        mCv.setImageResource(R.mipmap.default_avatar);
                    }
                   /* String url = this.getCacheDir()+"/Pictures/"+ mUser.getId()+".jpg";
//                    String url = UrlUtils.getUrl() + "file/usr/" + mUser.getId() + "/portrait/" + mUser.getId() + ".jpg";
                    RequestOptions options = new RequestOptions()
                            .placeholder(R.mipmap.default_avatar)
                            .error(R.mipmap.default_avatar)
                            .diskCacheStrategy(DiskCacheStrategy.NONE);
                    Glide.with(this).load(url).apply(options).into(mCv);*/
                }
    }
}
