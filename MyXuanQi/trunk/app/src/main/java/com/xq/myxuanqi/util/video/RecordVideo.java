package com.xq.myxuanqi.util.video;


import android.app.Activity;
import android.content.Context;
import android.hardware.Camera;
import android.media.CamcorderProfile;
import android.media.MediaRecorder;
import android.util.Log;
import android.widget.Toast;

import com.dinuscxj.progressbar.CircleProgressBar;

import java.io.File;
import java.util.Timer;
import java.util.TimerTask;

//录制视频到本地
public class RecordVideo implements MediaRecorder.OnErrorListener {

    private static final String TAG = "RecordVideo";

    private Activity activity;
    private MediaRecorder mMediaRecorder;// 录制视频的类
    TimerTask timerTask;
    private Timer mTimer;// 计时器
    private int mTimeCount;// 时间计数,每100ms记一次
    private int mRecordMaxTime = 100;// 一次拍摄最长时间 100*100ms
    private CircleProgressBar mProgressBar;
    private File file;
    private Camera camera;
    private int width;
    private int height;
    private int bitRate;

    /**
     *
     * @param activity
     * @param mProgressBar
     * @param width   录制视频的宽（横屏下） 640
     * @param height   长  480
     * @param bitRate 比特率，在1000kbps的时候视频还算清晰，文件也不大
     */
    public RecordVideo(Activity activity, CircleProgressBar mProgressBar, int width, int height, int bitRate) {
        this.activity = activity;
        this.mProgressBar = mProgressBar;
        this.width = width;
        this.height = height;
        this.bitRate = bitRate;
    }

    private OnRecordFinishListener recordFinishListener = new OnRecordFinishListener() {// 录制完成回调接口
        @Override
        public void onRecordFinish(int successful) {
            if (successful == 0) {
                Toast.makeText(activity, "拍摄完毕", Toast.LENGTH_SHORT).show();
            } else if (successful == 1) {
                Toast.makeText(activity, "请重新拍摄！", Toast.LENGTH_SHORT).show();
            }

        }
    };

    /**
     * 录制前，初始化

     */
    private void initRecord() {
//        String videoPath = FileLocation.chatImagePath + System.currentTimeMillis() + ".mp4";
//        FileUtils.createFile(videoPath);
        try {
            if (mMediaRecorder == null) {
                mMediaRecorder = new MediaRecorder();
            }
            if (camera != null) {
                camera.unlock();
                mMediaRecorder.setCamera(camera);
            }

            mMediaRecorder.setOnErrorListener(this);
            mMediaRecorder.setAudioSource(MediaRecorder.AudioSource.DEFAULT);
//            mMediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
            mMediaRecorder.setVideoSource(MediaRecorder.VideoSource.CAMERA);// 视频源

            // Use the same size for recording profile.
            CamcorderProfile mProfile = CamcorderProfile.get(CamcorderProfile.QUALITY_480P);
            mProfile.videoFrameWidth = width;
            mProfile.videoFrameHeight = height;

            mMediaRecorder.setProfile(mProfile);
            //修改这里的码率， 降低视频的占用空间
            //当前7秒的视频为0.99m，可以接受--900*1024
            mMediaRecorder.setVideoEncodingBitRate(bitRate);  //比较清晰
//            mMediaRecorder.setVideoEncoder(MediaRecorder.VideoEncoder.H264);  //编码到h264
            mMediaRecorder.setOrientationHint(90);//录制旋转90度
            //该设置是为了抽取视频的某些帧，真正录视频的时候，不要设置该参数
//            mMediaRecorder.setCaptureRate(mFpsRange.get(0)[0]);//获取最小的每一秒录制的帧数

//            mMediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
            mMediaRecorder.setOutputFile(file.getAbsolutePath());

            mMediaRecorder.prepare();
            mMediaRecorder.start();
        } catch (Exception e) {
            e.printStackTrace();
            //释放摄像头资源
            releaseRecord();
        }
    }

    /**
     * 开始录制视频
     */
    public boolean startRecord(File file, Camera camera) {
        this.camera = camera;
        this.file = file;
        initRecord();
        try {
            mTimeCount = 0;// 时间计数器重新赋值
            mTimer = new Timer();
            timerTask = new TimerTask() {
                @Override
                public void run() {
                    mTimeCount++;
                    mProgressBar.setProgress(mTimeCount);
                    if (mTimeCount == mRecordMaxTime) {// 达到指定时间，停止拍摄
                        activity.runOnUiThread(() -> stop(0));
//                        if (recordFinishListener != null) {
//                            recordFinishListener.onRecordFinish(true);
//                        }
                    }
                }
            };
            mTimer.schedule(timerTask, 0, 100);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return true;
    }

    /**
     * 停止录制
     *0：成功拍摄， 1：拍摄时长过短， 2：拍照
     */
    public boolean stopRecord(int successful) {
        Log.d(TAG, "stopRecord: 111");
        if (successful != 0) {  //录制失败就删除本地文件
            file.delete();
            Log.d(TAG, "stopRecord: 222");
        }
        if (recordFinishListener != null) {
            Log.d(TAG, "stopRecord: 333");
            recordFinishListener.onRecordFinish(successful);
        }
        Log.d(TAG, "stopRecord: 444");
        mProgressBar.setProgress(0);
        if (timerTask != null) {
            Log.d(TAG, "stopRecord: 555");
            timerTask.cancel();
        }
        if (mTimer != null)
            mTimer.cancel();
        if (mMediaRecorder != null) {
            try {
                Log.d(TAG, "stopRecord: 666");
                Log.e(TAG, "stopRecord: 这里会有拍摄时间过短抛出的异常，还没有找到是什么原因111111111111111111");
                mMediaRecorder.setOnErrorListener(null);
                mMediaRecorder.setOnInfoListener(null);
                mMediaRecorder.setPreviewDisplay(null);
                mMediaRecorder.stop();
                mMediaRecorder.reset();
            } catch (IllegalStateException e) {
                Log.d(TAG, "stopRecord: 777");
                e.printStackTrace();
            } catch (RuntimeException e) {
                //这里还会报错
                Log.d(TAG, "stopRecord: 888");
                e.printStackTrace();
            } catch (Exception e) {
                Log.d(TAG, "stopRecord: 999");
                e.printStackTrace();
            }
        }
        Log.d(TAG, "stopRecord: 111000");
        return false;
    }

    /**
     * 停止拍摄
     */
    private void stop(int successful) {
        stopRecord(successful);
        releaseRecord();
        freeCameraResource();
    }

    /**
     * 释放摄像头资源
     */
    private void freeCameraResource() {
        if (camera != null) {
            camera.setPreviewCallback(null);
            camera.stopPreview();
            camera.lock();
            camera.release();
            camera = null;
        }
    }

    @Override
    public void onError(MediaRecorder mr, int what, int extra) {
        try {
            if (mr != null)
                mr.reset();
        } catch (IllegalStateException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 释放资源
     */
    private void releaseRecord() {
        if (mMediaRecorder != null) {
            mMediaRecorder.setPreviewDisplay(null);
            mMediaRecorder.setOnErrorListener(null);
            try {
                mMediaRecorder.release();
            } catch (IllegalStateException e) {
                e.printStackTrace();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        mMediaRecorder = null;
    }

    /**
     * 录制完成回调接口
     */
    public interface OnRecordFinishListener {
        void onRecordFinish(int successful);
    }


}
