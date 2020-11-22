package com.xq.myxuanqi.ui.activity.video;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.ImageFormat;
import android.hardware.Camera;
import android.support.v4.util.ArrayMap;
import android.os.Bundle;
import android.util.Log;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.Staff;
import com.dinuscxj.progressbar.CircleProgressBar;
import com.tbruyelle.rxpermissions2.RxPermissions;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.util.BitmapOperating;
import com.xq.myxuanqi.util.FileAndBase64;
import com.xq.myxuanqi.util.FileLocation;
import com.xq.myxuanqi.util.HttpUtils;
import com.xq.myxuanqi.util.SerializableUtil;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;
import com.xq.myxuanqi.util.video.RecordVideo;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import butterknife.BindView;
import butterknife.OnClick;
import butterknife.OnTouch;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

public class ShootingActivity extends BaseActivity implements SurfaceHolder.Callback {
    private static final String TAG = "ShootingActivity";

    private final int CAMERA_BACK = 0;
    private final int CAMERA_FRONT = 1;

    @BindView(R.id.sv_preview)
    SurfaceView surfaceview;
    @BindView(R.id.btn_switch_camera)
    Button mBtnSwitchCamera;

    @BindView(R.id.iv_start)
    ImageView mIvStart;
    @BindView(R.id.cpb_progress)
    CircleProgressBar mProgressBar;

    private String companyId;
    private String userId;

    SurfaceHolder surfaceHolder;

    private Camera camera;
    private Camera.Parameters parameters;
    //这个分辨率会有横向的拉伸
    private int width = 640;
    private int height = 480;
    private int currentCamera = 0;  //记录当前的打开的摄像头，默认0，即打开后置摄像头

    private Bundle bundle = new Bundle(); // 声明一个Bundle对象，用来存储数据

    private long startTime = 0L;
    private long endTime = 0L;
    private boolean isRecording = false;
    private RecordVideo recordVideo;
    private String videoPath;
    private File videoFile;


    final RxPermissions rxPermissions = new RxPermissions(this); // where this is an Activity or Fragment instance


    @Override
    protected int getLayoutResId() {
        return R.layout.activity_shooting;
    }

    @Override
    public void init() {
        super.init();
        surfaceHolder = surfaceview.getHolder();
        surfaceHolder.addCallback(this);

        Login login = SpUtil.getInstance().getLogin();
        try {
            Staff staff = (Staff) SerializableUtil.str2Obj(SpUtil.getInstance().getStr("staff"));
            companyId = staff.getOwner();
        } catch (IOException e) {
            e.printStackTrace();
        }
        userId = login.getUser().getId();
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        //初始化默认打开后置摄像头
        Log.d(TAG, "surfaceCreated: 1111111111");
        currentCamera = CAMERA_BACK;
        openCamera(CAMERA_BACK);
        startPreview(camera);

        recordVideo = new RecordVideo(this, mProgressBar, width, height, 1024 * 1024);

    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
        Log.d(TAG, "surfaceCreated: 222222222");
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        if (null != camera) {
            camera.stopPreview();
            camera.release();
            camera = null;
        }

    }

    private void startPreview(Camera mCamera) {
        if (mCamera != null) {
            try {
                mCamera.setDisplayOrientation(90);
                if (parameters == null) {
                    parameters = mCamera.getParameters();
                }
                parameters = mCamera.getParameters();
                List<Camera.Size> supportedPreviewSizes = parameters.getSupportedPreviewSizes();
                for (int i = 0; i < supportedPreviewSizes.size(); i++) {
                    Log.d(TAG, "startPreview: height:" + supportedPreviewSizes.get(i).height);
                    Log.d(TAG, "startPreview: width:" + supportedPreviewSizes.get(i).width);
                }
                parameters.setPreviewFormat(ImageFormat.NV21);
//                parameters.setPreviewSize(width, height);//预览的分辨率
                parameters.setPictureSize(width, height);  //照片的分辨率

                // 设置自动对焦模式
                List<String> focusModes = parameters.getSupportedFocusModes();
                if (focusModes.contains(Camera.Parameters.FOCUS_MODE_CONTINUOUS_VIDEO)) {
                    Log.d(TAG, "onSurfaceTextureAvailable: 111");
                    parameters.setFocusMode(Camera.Parameters.FOCUS_MODE_CONTINUOUS_VIDEO);
                }

                mCamera.setParameters(parameters);
                mCamera.setPreviewDisplay(surfaceHolder);
                mCamera.startPreview();

            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }


    @SuppressLint("CheckResult")
    private void openCamera(int cameraId) {
        rxPermissions.request(Manifest.permission.CAMERA,
                Manifest.permission.WRITE_EXTERNAL_STORAGE)
                .subscribe(granted -> {
                    if (granted) {
                        try {
                            camera = Camera.open(cameraId); // attempt to get a Camera instance
                        } catch (Exception e) {
                            e.printStackTrace();
                        }

                    }
                });
    }

    @OnClick({
            R.id.btn_switch_camera
    })
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_switch_camera:
                changeCamera();
                break;
        }
    }

    @OnTouch({
            R.id.iv_start,
    })
    public boolean onTouch(View v, MotionEvent event) {
        Log.d(TAG, "onTouch: 00000");
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                startTime = System.currentTimeMillis();
                Log.d(TAG, "onTouch: down1111：" + startTime);
                if (isRecording) {
                    isRecording = recordVideo.stopRecord(1);
                } else {
                    videoPath = FileLocation.chatImagePath + System.currentTimeMillis() + ".mp4";
                    videoFile = FileAndBase64.createFile(videoPath);
                    isRecording = recordVideo.startRecord(videoFile, camera);
                }
                break;
            case MotionEvent.ACTION_UP:
                endTime = System.currentTimeMillis();
                if (endTime - startTime < 800) { //800ms以内算是点击
                    Log.d(TAG, "onTouch: time333: " + (endTime - startTime));
                    isRecording = recordVideo.stopRecord(2);
                    takePhoto();
//                    camera.startPreview();

                } else {
                    if (endTime - startTime < 3000) {
//                            Utils.toast("不能少于3秒！");
                        Toast.makeText(ShootingActivity.this, "不能少于3秒！", Toast.LENGTH_SHORT).show();
                        isRecording = recordVideo.stopRecord(1);
                        Log.d(TAG, "onTouch: 444444");
                    } else {
                        Log.d(TAG, "onTouch: 5555555");
                        isRecording = recordVideo.stopRecord(0);
//                        bundle.putString("videoPath", videoPath);
//                        Intent intent = new Intent(this, VideoPreviewActivity.class);
//                        intent.putExtras(bundle);
//                        startActivity(intent);
                        //预览写起来太麻烦，直接上传了
                        Log.d(TAG, "onTouch233: startTime:" + System.currentTimeMillis());
                        uploadFile("3", videoPath);


                    }
                }
                break;
        }
        return true;
    }

    private void changeCamera() {
        //先释放摄像头再打开新的摄像头
        surfaceDestroyed(surfaceHolder);
        if (currentCamera == CAMERA_BACK) {
            openCamera(CAMERA_FRONT);
            startPreview(camera);
            currentCamera = CAMERA_FRONT;
        } else {
            openCamera(CAMERA_BACK);
            startPreview(camera);
            currentCamera = CAMERA_BACK;
        }
    }

    public void takePhoto() {
        if (camera != null) {
            Log.d(TAG, "takePhoto: 11111");
            // 获取到拍照的图片数据后回调PictureCallback,PictureCallback可以对相片进行保存或传入网络
            camera.takePicture(null, null, new MyPictureCallback());
        }
    }


    private final class MyPictureCallback implements Camera.PictureCallback {

        @Override
        public void onPictureTaken(byte[] data, Camera camera) {
            try {
                Bitmap bitmap = BitmapOperating.BytesToBitmap(data);
                camera.stopPreview();
                if (bitmap != null) {
                    float degree = 90f;
                    if (currentCamera == CAMERA_FRONT) {
                        degree = 270f;
                        //镜像并旋转
                        bitmap = BitmapOperating.convertAndRotateBitmap(bitmap, degree);
                    } else {
                        //旋转
                        bitmap = BitmapOperating.rotateBitmap(bitmap, degree);
                    }

                    //3.保存到本地
                    String pathName = FileLocation.chatImagePath + System.currentTimeMillis() + ".jpg";
                    BitmapOperating.saveBitmap(bitmap, pathName);
                    Log.d(TAG, "onTouch: down1111222：" + startTime);
//                    Glide.with(ShootingActivity.this)
//                            .load(bitmap)
//                            .into(mImageShow);

//                    bundle.putString("pathName", pathName);
//                    Intent intent = new Intent(ShootingActivity.this, ImagePreviewActivity.class);
//                    intent.putExtras(bundle);
//                    startActivity(intent);
                    uploadFile("1", pathName);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * @param type     1：图片， 2：音频， 3：视频
     * @param filePath
     */
    private void uploadFile(String type, String filePath) {
        String url = UrlUtils.getApiUrl() + "api/service19/api31";
        Map<String, String> mapParams = new ArrayMap<>();
        mapParams.put("oid", companyId);
        mapParams.put("uid", userId);
        mapParams.put("type", type);
        HttpUtils.doPostFile(url, mapParams, filePath, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "onFailure: 222");
//                loadDialog.dismiss();
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                String s = response.body().string().trim();
                Log.d(TAG, "onResponse: " + s);
                Log.d(TAG, "onTouch233: endTime:" + System.currentTimeMillis());
                //获取到音频文件地址
//                voiceLocationOnServer = s;
//                waitForUrl = false;  //结束等待

                //文件传输完毕就删掉
                FileAndBase64.delete(filePath);
                Intent intent = new Intent();
                intent.putExtra("type", type);
                intent.putExtra("filePath", s);
                setResult(1, intent);
                ShootingActivity.this.finish();
            }
        });

    }
}
