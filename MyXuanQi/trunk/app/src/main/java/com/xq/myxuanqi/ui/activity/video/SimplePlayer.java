package com.xq.myxuanqi.ui.activity.video;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;

import com.shuyu.gsyvideoplayer.GSYVideoManager;
import com.shuyu.gsyvideoplayer.utils.OrientationUtils;
import com.shuyu.gsyvideoplayer.video.StandardGSYVideoPlayer;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.util.BitmapOperating;
import com.xq.myxuanqi.util.UrlUtils;

import android.support.v7.app.AppCompatActivity;

//来源于GSYVideoPlayer中的简单播放
//简单视频播放器，传入url就可直接播放
public class SimplePlayer extends BaseActivity {

    StandardGSYVideoPlayer videoPlayer;

    OrientationUtils orientationUtils;


    @Override
    protected int getLayoutResId() {
        return R.layout.activity_simple_play;
    }

    @Override
    public void init() {
        super.init();
        Intent intent = getIntent();
        String videoPath = intent.getStringExtra("videoPath");
        init(videoPath);
    }

    private void init(String videoPath) {
        videoPlayer =  (StandardGSYVideoPlayer)findViewById(R.id.video_player);

//        String source1 = "http://9890.vod.myqcloud.com/9890_4e292f9a3dd011e6b4078980237cc3d3.f20.mp4";
        videoPlayer.setUp(videoPath, true, "观看视频");

        //增加封面
        ImageView imageView = new ImageView(this);
        imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
        Bitmap bitmap = BitmapOperating.getNetVideoBitmap(videoPath);
        imageView.setImageBitmap(bitmap);
        videoPlayer.setThumbImageView(imageView);
        //增加title
        videoPlayer.getTitleTextView().setVisibility(View.VISIBLE);
        //设置返回键
        videoPlayer.getBackButton().setVisibility(View.VISIBLE);
        //设置旋转
        orientationUtils = new OrientationUtils(this, videoPlayer);
        //设置全屏按键功能,这是使用的是选择屏幕，而不是全屏
        videoPlayer.getFullscreenButton().setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                orientationUtils.resolveByClick();
            }
        });
        //是否可以滑动调整
        videoPlayer.setIsTouchWiget(true);
        //设置返回按键功能
        videoPlayer.getBackButton().setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
        videoPlayer.startPlayLogic();
    }


    @Override
    protected void onPause() {
        super.onPause();
        videoPlayer.onVideoPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        videoPlayer.onVideoResume();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        GSYVideoManager.releaseAllVideos();
        if (orientationUtils != null)
            orientationUtils.releaseListener();
    }

    @Override
    public void onBackPressed() {
        //先返回正常状态
        if (orientationUtils.getScreenType() == ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE) {
            videoPlayer.getFullscreenButton().performClick();
            return;
        }
        //释放所有
        videoPlayer.setVideoAllCallBack(null);
        super.onBackPressed();
    }
}
