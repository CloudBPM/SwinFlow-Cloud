package com.xq.myxuanqi.ui.activity.video;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.shuyu.gsyvideoplayer.GSYVideoManager;
import com.shuyu.gsyvideoplayer.builder.GSYVideoOptionBuilder;
import com.shuyu.gsyvideoplayer.listener.GSYSampleCallBack;
import com.shuyu.gsyvideoplayer.listener.LockClickListener;
import com.shuyu.gsyvideoplayer.utils.OrientationUtils;
import com.shuyu.gsyvideoplayer.video.StandardGSYVideoPlayer;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.model.video.VideoInformation;
import com.xq.myxuanqi.util.UrlAndUtf8;
import com.xq.myxuanqi.util.UrlUtils;


/**
 * 简单详情实现模式2
 */
public class SimpleDetailActivityMode2 extends AppCompatActivity {

    private static final String TAG = "SimpleDetailActivityMod";

    private TextView mTvVideoIntroduction;

    StandardGSYVideoPlayer detailPlayer;

    private boolean isPlay;
    private boolean isPause;

    private OrientationUtils orientationUtils;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_simple_detail_player);
        mTvVideoIntroduction = findViewById(R.id.tv_video_introduction);

        detailPlayer = (StandardGSYVideoPlayer) findViewById(R.id.detail_player);

        Intent intent = getIntent();
        VideoInformation videoInformation = (VideoInformation) intent.getSerializableExtra("videoInformation");
        String videoName = videoInformation.getVideoName();
        String imagePath = videoInformation.getImagePath();
        Log.d(TAG, "onCreate: imagePath1:" + imagePath);
        imagePath = UrlUtils.getUrl()+"file" + imagePath.substring(0, imagePath.lastIndexOf("/") + 1) + UrlAndUtf8.getURLEncoderString(imagePath.substring(imagePath.lastIndexOf("/") + 1));
        Log.d(TAG, "onCreate: imagePath2:" + imagePath);
        String videoDesc = videoInformation.getVideoDesc();
        String videoPath = videoInformation.getVideoPath();

        //将视频后面的中文转掉
        videoPath = UrlUtils.getUrl()+"file" + videoPath.substring(0, videoPath.lastIndexOf("/") + 1) + UrlAndUtf8.getURLEncoderString(videoPath.substring(videoPath.lastIndexOf("/") + 1));
        Log.d(TAG, "onCreate: videoPath2:" + videoPath);

//        String url = "http://101.200.154.42:30004/file/usr/00000000000001b/video/bf476855e2474544ae680d5ff079f5c5/%E6%98%9F%E9%99%85.mp4";
//        String url = "https://res.exexm.com/cw_145225549855002";

        //增加封面
        ImageView imageView = new ImageView(this);
        imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
//        imageView.setImageResource(R.mipmap.xxx1);
        Glide.with(this).load(imagePath).into(imageView);

        mTvVideoIntroduction.setText(videoDesc);

        //增加title
        TextView mTvTitle = detailPlayer.getTitleTextView();
        ImageView mIvBack = detailPlayer.getBackButton();

        Log.d(TAG, "onCreate: " + videoName);
        mTvTitle.setText(videoName);
        mTvTitle.setVisibility(View.GONE);
        mIvBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });


        //外部辅助的旋转，帮助全屏
        orientationUtils = new OrientationUtils(this, detailPlayer);
        //初始化不打开外部的旋转
        orientationUtils.setEnable(false);

        GSYVideoOptionBuilder gsyVideoOption = new GSYVideoOptionBuilder();
        gsyVideoOption.setThumbImageView(imageView)
                .setIsTouchWiget(true)
                .setRotateViewAuto(false)
                .setLockLand(false)
                .setAutoFullWithSize(true)
                .setShowFullAnimation(false)
                .setNeedLockFull(true)
                .setUrl(videoPath)
                .setCacheWithPlay(false)
                .setVideoTitle(videoName)
                .setVideoAllCallBack(new GSYSampleCallBack() {
                    @Override
                    public void onPrepared(String url, Object... objects) {
                        super.onPrepared(url, objects);
                        //开始播放了才能旋转和全屏
                        orientationUtils.setEnable(true);
                        isPlay = true;
                    }

                    @Override
                    public void onQuitFullscreen(String url, Object... objects) {
                        super.onQuitFullscreen(url, objects);
                        if (orientationUtils != null) {
                            orientationUtils.backToProtVideo();
                        }
                    }
                }).setLockClickListener(new LockClickListener() {
                    @Override
                    public void onClick(View view, boolean lock) {
                        if (orientationUtils != null) {
                            //配合下方的onConfigurationChanged
                            orientationUtils.setEnable(!lock);
                        }
                    }
                }).build(detailPlayer);

        detailPlayer.getFullscreenButton().setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //直接横屏
                orientationUtils.resolveByClick();
                //第一个true是否需要隐藏actionbar，第二个true是否需要隐藏statusbar
                detailPlayer.startWindowFullscreen(SimpleDetailActivityMode2.this, true, true);
            }
        });
    }

    @Override
    public void onBackPressed() {
        if (orientationUtils != null) {
            orientationUtils.backToProtVideo();
        }
        if (GSYVideoManager.backFromWindowFull(this)) {
            return;
        }
        super.onBackPressed();
    }


    @Override
    protected void onPause() {
        detailPlayer.getCurrentPlayer().onVideoPause();
        super.onPause();
        isPause = true;
    }

    @Override
    protected void onResume() {
        detailPlayer.getCurrentPlayer().onVideoResume(false);
        super.onResume();
        isPause = false;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (isPlay) {
            detailPlayer.getCurrentPlayer().release();
        }
        if (orientationUtils != null)
            orientationUtils.releaseListener();
    }



    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        //如果旋转了就全屏
        if (isPlay && !isPause) {
            detailPlayer.onConfigurationChanged(this, newConfig, orientationUtils, true, true);
        }
    }

}
