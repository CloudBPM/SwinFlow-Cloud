package com.xq.myxuanqi.ui.activity.video;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.MediaController;
import android.widget.VideoView;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.BaseActivity;

import butterknife.BindView;

public class VideoPreviewActivity extends BaseActivity {

    private static final String TAG = "VideoPreviewActivity";

    @BindView(R.id.video_view_preview)
    VideoView mVideoViewPreview;

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_video_preview;
    }

    @Override
    public void init() {
        super.init();
        Intent intent = getIntent();
        Bundle bundle = intent.getExtras();
        String videoPath = bundle.getString("videoPath");
        Log.d(TAG, "init: " + videoPath);

        //加载指定的视频文件
//        String path = Environment.getExternalStorageDirectory().getPath()+"/20180730.mp4";
        mVideoViewPreview.setVideoPath(videoPath);

        //创建MediaController对象
        MediaController mediaController = new MediaController(this);

        //VideoView与MediaController建立关联
        mVideoViewPreview.setMediaController(mediaController);

        //让VideoView获取焦点
//        mVideoViewPreview.set
        mVideoViewPreview.requestFocus();

    }
}
