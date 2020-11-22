package com.xq.myxuanqi.ui.activity.video;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.util.BitmapOperating;
import com.xq.myxuanqi.util.UrlUtils;

import java.io.File;

import butterknife.BindView;

public class ImagePreviewActivity extends BaseActivity implements View.OnClickListener {

    private static final String TAG = "ImagePreviewActivity";

    @BindView(R.id.image_preview)
    ImageView mImagePreview;

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_image_preview;
    }

    @Override
    public void init() {
        super.init();
        Intent intent = getIntent();
        String imagePath = intent.getStringExtra("imagePath");

        Glide.with(this)
                .load(imagePath)
                .into(mImagePreview);

        mImagePreview.setOnClickListener(this);

    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.image_preview:
                finish();
                break;
        }
    }
}
