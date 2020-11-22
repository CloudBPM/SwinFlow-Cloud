package com.xq.myxuanqi.util;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.support.annotation.Nullable;
import android.support.v7.app.AlertDialog;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.target.Target;
import com.xq.myxuanqi.R;

/**
 * Created by xq00005 on 2018/8/23.
 * 利用弹框的方式显示
 */

public class AlertDialogUtils {

    public static void showImage(final Context context, final Bitmap bitmap) {

        final Dialog dia;//弹框显示图片
        dia = new Dialog(context, R.style.edit_AlertDialog_style);
        dia.setContentView(R.layout.activity_start_dialog);


        ImageView imageView = (ImageView) dia.findViewById(R.id.start_img);
        imageView.setImageBitmap(bitmap);
        dia.show();

        dia.setCanceledOnTouchOutside(true); // Sets whether this dialog is
        Window w = dia.getWindow();
        WindowManager.LayoutParams lp = w.getAttributes();
        lp.x = 0;
        lp.y = 40;
        dia.onWindowAttributesChanged(lp);

        imageView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                bitmap.recycle();
                dia.dismiss();
            }
        });
    }

    public static void showImage(Context context, String imagePath) {

        final Dialog dia;//弹框显示图片
        dia = new Dialog(context, R.style.edit_AlertDialog_style);
        dia.setContentView(R.layout.activity_start_dialog);


        ImageView imageView = (ImageView) dia.findViewById(R.id.start_img);
//        RequestOptions requestOptions = new RequestOptions()
//                .placeholder(R.mipmap.loading)
//                .error(R.mipmap.load_failed)
//                .fallback(R.mipmap.load_failed);
        Glide.with(context)
                .load(imagePath)
//                .apply(requestOptions)
                .addListener(new RequestListener<Drawable>() {
                    @Override
                    public boolean onLoadFailed(@Nullable GlideException e, Object model, Target<Drawable> target, boolean isFirstResource) {
                        dia.dismiss();
                        Toast.makeText(context, "没有图片！", Toast.LENGTH_SHORT).show();
                        return false;
                    }

                    @Override
                    public boolean onResourceReady(Drawable resource, Object model, Target<Drawable> target, DataSource dataSource, boolean isFirstResource) {
                        return false;
                    }
                })
                .into(imageView);
        dia.show();

        dia.setCanceledOnTouchOutside(true); // Sets whether this dialog is
        Window w = dia.getWindow();
        WindowManager.LayoutParams lp = w.getAttributes();
        lp.x = 0;
        lp.y = 40;
        dia.onWindowAttributesChanged(lp);

        imageView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                bitmap.recycle();
                dia.dismiss();
            }
        });
    }

    public static void createFailedDialog(final Activity activity, String title, String message) {
        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setMessage(message);
        builder.setTitle(title);
        builder.setCancelable(false);// 设置点击空白处也不能关闭该对话框
        builder.setPositiveButton("确认", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
                activity.finish();
            }
        });
//        builder.setNegativeButton("取消", new DialogInterface.OnClickListener() {
//            @Override
//            public void onClick(DialogInterface dialog, int which) {
//                dialog.dismiss();
//            }
//        });
        builder.create().show();
    }
}
