package com.xq.myxuanqi.util.photo;

import android.content.Context;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bumptech.glide.request.RequestOptions;
import com.xq.myxuanqi.R;

/**
 * 图片加载类
 * 2019年3月28日16:08:17
 */
public class LoadPhoto {

    public static void loadPhotoByUrl(Context context, String url, ImageView imageView) {
        RequestOptions options = new RequestOptions()
                .placeholder(R.mipmap.icon)
                .fallback(R.drawable.picture_split)
                .error(R.drawable.picture_split);
        Glide.with(context)
                .load(url)
                .apply(options)
                .diskCacheStrategy(DiskCacheStrategy.ALL)  //利用缓存
                .into(imageView);
    }
}
