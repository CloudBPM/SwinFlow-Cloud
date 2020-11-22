package com.xq.myxuanqi.ui.view.imgeSelector;

import android.app.Activity;
import android.arch.lifecycle.ViewModelProviders;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.support.v4.app.Fragment;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;
import android.widget.Toast;

import com.cloudibpm.core.organization.AbstractPosition;
import com.cloudibpm.core.user.Login;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.ui.view.LoadingDialog;
import com.xq.myxuanqi.util.EmptyUtils;
import com.xq.myxuanqi.util.SerializableUtil;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.viewModel.ClipImageViewModel;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;

public class ClipImageActivity extends BaseActivity {

    private FrameLayout           btnConfirm;
    private FrameLayout           btnBack;
    private CropView              imageView;
    private int                   mRequestCode;
    private boolean               isCameraImage;
    private ArrayList<String>     mImages;
    private ClipImageViewModel    mClipImageViewModel;
    private String                mUserId;
    private String                mOid;
    private Bitmap                mBitmap;
    private LoadingDialog.Builder loadBuilder;  //正在登录...
    private LoadingDialog         loadDialog;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        setContentView(getLayoutResId());
        Intent intent = getIntent();
        mRequestCode = intent.getIntExtra("requestCode", 0);
//        setStatusBarColor();
        ImageSelectorActivity.openActivity(this, mRequestCode, true,
                intent.getBooleanExtra(ImageSelector.IS_VIEW_IMAGE, true),
                intent.getBooleanExtra(ImageSelector.USE_CAMERA, true), 0,
                intent.getStringArrayListExtra(ImageSelector.SELECTED));
        initView();
    }

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_clip_image;
    }

    /**
     * 修改状态栏颜色
     */
    private void setStatusBarColor() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window window = getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.parseColor("#373c3d"));
        }
    }

    private void initView() {
        imageView = (CropView) findViewById(R.id.process_img);
        btnConfirm = (FrameLayout) findViewById(R.id.btn_confirm);
        btnBack = (FrameLayout) findViewById(R.id.btn_back);
        RelativeLayout rlTopBar = findViewById(R.id.rl_top_bar);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        }else {
            rlTopBar.setPadding(0,5,0,5);
        }
        loadBuilder = new LoadingDialog.Builder(this)
                .setMessage("正在上传....")
                .setCancelable(false);
        loadDialog = loadBuilder.create();
        Login login = SpUtil.getInstance().getLogin();
        mUserId = login.getUser().getId();
//        login.get
        mClipImageViewModel = ViewModelProviders.of(this).get(ClipImageViewModel.class);
        mClipImageViewModel.setUploadPortraitOnCallBack(new ClipImageViewModel.UploadPortraitOnCallBack() {
            @Override
            public void upload(int success) {
                loadDialog.dismiss();
                if (success==0){
                    //上传成功
                    Toast.makeText(ClipImageActivity.this, "上传成功！", Toast.LENGTH_SHORT).show();
                    PortraitBean.bitmap = mBitmap;
                    setResult(1);
                    if (isCameraImage){
                        //删除图片
                        File file = new File(mImages.get(0));
                        file.delete();
                    }
                    finish();

                }else if (success==-1){
                    //上传失败
                    Toast.makeText(ClipImageActivity.this, "上传失败，请重试！", Toast.LENGTH_SHORT).show();
                    setResult(-1);
                    if (isCameraImage){
                        //删除图片
                        File file = new File(mImages.get(0));
                        file.delete();
                    }
                    finish();
                }else if (success==-3){
                    //网络故障
                    Toast.makeText(ClipImageActivity.this, "网络故障，上传失败！", Toast.LENGTH_SHORT).show();
                    setResult(-3);
                    if (isCameraImage){
                        //删除图片
                        File file = new File(mImages.get(0));
                        file.delete();
                    }
                    finish();
                }else if (success==-2){
                    //网络超时
                    Toast.makeText(ClipImageActivity.this, "网络连接超时！", Toast.LENGTH_SHORT).show();
                    setResult(-2);
                    if (isCameraImage){
                        //删除图片
                        File file = new File(mImages.get(0));
                        file.delete();
                    }
                    finish();
                    //                        JumpToResult(CaptureActivity.class,REQUEST_CODE);
                }
            }
        });
        btnConfirm.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                if (imageView.getDrawable() != null) {
//                    btnConfirm.setEnabled(false);
//                    confirm(imageView.clipImage());
//                }
                loadDialog.show();
                //获取裁剪后的图片
                mBitmap = imageView.clip();
                //保存裁剪后的图片
                String path = ClipImageActivity.this.getCacheDir()+File.separator+"Pictures" ;
                File file2 = new File(path);
                File file = new File(path,mUserId + ".png");
                if (file.exists()&&file.isFile()){
                    file.delete();
                }
                if (file2.exists()&&file2.isDirectory()){

                }else {
                    file2.mkdirs();
                }
                //                String path = ClipImageActivity.this.getCacheDir().toString()+File.separator+"Pictures" +File.separator+ mUserId + ".jpg";
                FileOutputStream fos = null;
                try {
                    fos = new FileOutputStream(path+File.separator+mUserId + ".png");
                    if (fos != null) {
                        mBitmap.compress(Bitmap.CompressFormat.PNG, 100, fos);
                        fos.close();
                    }
                    //上传图片
                    File file1 = new File(path,mUserId + ".png");
                    if (file1.exists()&&file1.isFile()){
                        mClipImageViewModel.uploadPortrait(file1,mUserId);
                    }else {
                        setResult(-1);
                        finish();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isCameraImage){
                    File file = new File(mImages.get(0));
                    if (file.isFile()&&file.exists()){
                        file.delete();
                    }
                }
                finish();
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (data != null && requestCode == mRequestCode) {
            mImages = data.getStringArrayListExtra(ImageSelector.SELECT_RESULT);
            isCameraImage = data.getBooleanExtra(ImageSelector.IS_CAMERA_IMAGE, false);
//            Bitmap bitmap = ImageUtil.decodeSampledBitmapFromFile(mImages.get(0), 720, 1080);
            Bitmap bitmap = BitmapFactory.decodeFile(mImages.get(0));
            //原照片的旋转角度
            int rote = imageView.readPictureDegree(mImages.get(0));
            if (bitmap != null) {
                if (Build.VERSION.SDK_INT ==Build.VERSION_CODES.P){
                    Bitmap bitmap1 = imageView.rotateBitmap(rote, bitmap);
                    imageView.setBitmap(bitmap1);
                    imageView.init();
                }else {

                    Bitmap bitmap1 = imageView.rotateBitmap(rote, bitmap);
                    imageView.setBitmap(bitmap1);
                }

                //                imageView.setBitmapForWidth(mImages.get(0),720);
            } else {
                finish();
            }
        } else {
            finish();
        }
    }

    private void confirm(Bitmap bitmap) {
        String imagePath = null;
        if (bitmap != null) {
            //保存图片的路径
            imagePath = ImageUtil.saveImage(bitmap, getCacheDir().getPath() + File.separator + "image_select");
            bitmap.recycle();
            bitmap = null;
        }

        if (EmptyUtils.isNotEmpty(imagePath)) {
            ArrayList<String> selectImages = new ArrayList<>();
            selectImages.add(imagePath);
            Intent intent = new Intent();
            intent.putStringArrayListExtra(ImageSelector.SELECT_RESULT, selectImages);
            intent.putExtra(ImageSelector.IS_CAMERA_IMAGE,isCameraImage);
            setResult(RESULT_OK, intent);
        }
        finish();
    }

    public static void openActivity(Activity context, int requestCode, boolean isViewImage,
                                    boolean useCamera, ArrayList<String> selected) {
        Intent intent = new Intent(context, ClipImageActivity.class);
        intent.putExtras(dataPackages(requestCode, isViewImage, useCamera, selected));
        context.startActivityForResult(intent, requestCode);
    }

    public static void openActivity(Fragment fragment, int requestCode, boolean isViewImage,
                                    boolean useCamera, ArrayList<String> selected) {
        Intent intent = new Intent(fragment.getContext(), ClipImageActivity.class);
        intent.putExtras(dataPackages(requestCode, isViewImage, useCamera, selected));
        fragment.startActivityForResult(intent, requestCode);
    }

    public static void openActivity(android.app.Fragment fragment, int requestCode, boolean isViewImage,
                                    boolean useCamera, ArrayList<String> selected) {
        Intent intent = new Intent(fragment.getActivity(), ClipImageActivity.class);
        intent.putExtras(dataPackages(requestCode, isViewImage, useCamera, selected));
        fragment.startActivityForResult(intent, requestCode);
    }

    public static Bundle dataPackages(int requestCode, boolean isViewImage, boolean useCamera,
                                      ArrayList<String> selected) {
        Bundle bundle = new Bundle();
        bundle.putInt("requestCode", requestCode);
        bundle.putBoolean(ImageSelector.IS_VIEW_IMAGE, isViewImage);
        bundle.putBoolean(ImageSelector.USE_CAMERA, useCamera);
        bundle.putStringArrayList(ImageSelector.SELECTED, selected);
        return bundle;
    }
}
