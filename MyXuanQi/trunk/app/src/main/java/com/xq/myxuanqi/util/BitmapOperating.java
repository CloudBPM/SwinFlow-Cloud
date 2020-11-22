package com.xq.myxuanqi.util;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.media.MediaMetadataRetriever;
import android.util.Log;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;

/**
 * 2019年3月16日11:38:51
 */

//与图片相关的一些操作
public class BitmapOperating {

    private static final String TAG = "BitmapOperating";

    //byte数组转bitmap
    public static Bitmap BytesToBitmap(byte[] data) {
        if (data.length != 0) {
            return BitmapFactory.decodeByteArray(data, 0, data.length);
        } else {
            return null;
        }
    }

    /** 保存方法 */
    public static void saveBitmap(Bitmap bitmap, String pathName) {
        try {
            Log.e(TAG, "保存图片");
            File file = new File(pathName);
            if (!file.exists()) {
                // 先得到文件的上级目录，并创建上级目录，在创建文件
                file.getParentFile().mkdir();
                file.createNewFile();
            }
            FileOutputStream out = new FileOutputStream(file);
            bitmap.compress(Bitmap.CompressFormat.JPEG, 90, out);
            out.flush();
            out.close();
            Log.i(TAG, "已经保存");
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //旋转

    /**
     * @param bitmap  原图
     * @param degree  旋转的角度
     * @return  返回新的图片
     */
    public static Bitmap rotateBitmap(Bitmap bitmap, float degree){
        Matrix matrix = new Matrix();
        matrix.postRotate(degree);

        return Bitmap.createBitmap(bitmap, 0,0, bitmap.getWidth(),  bitmap.getHeight(), matrix, true);

    }

    //水平镜像反转
    public static Bitmap convertBitmap(Bitmap bitmap) {
        int w = bitmap.getWidth();
        int h = bitmap.getHeight();
        Matrix matrix = new Matrix();
        matrix.postScale(-1, 1); // 镜像水平翻转

        return Bitmap.createBitmap(bitmap, 0, 0, w, h, matrix, true);
    }

    //水平镜像并且旋转
    public static Bitmap convertAndRotateBitmap(Bitmap bitmap, float degree) {
        int w = bitmap.getWidth();
        int h = bitmap.getHeight();
        Matrix matrix = new Matrix();
        matrix.postRotate(degree);
        matrix.postScale(-1, 1); // 镜像水平翻转

        return Bitmap.createBitmap(bitmap, 0, 0, w, h, matrix, true);
    }

    /**
     * 获取网络视频第一帧
     * @param videoUrl
     * @return
     *     原文：https://blog.csdn.net/qq_27400335/article/details/84849929
     */
    public static Bitmap getNetVideoBitmap(String videoUrl) {
        Bitmap bitmap = null;

        MediaMetadataRetriever retriever = new MediaMetadataRetriever();
        try {
            //根据url获取缩略图
            retriever.setDataSource(videoUrl, new HashMap());
            //获得第一帧图片
            bitmap = retriever.getFrameAtTime();
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        } finally {
            retriever.release();
        }
        return bitmap;
    }

    /**
     * https://blog.csdn.net/xiaoyu940601/article/details/53200072
     * @param background  背景图
     * @param foreground  前景图
     * @param x  //前景图在背景图向右偏移px数量
     * @param y  前景图向下偏移像素数量
     * @return
     */
    public static Bitmap toConformBitmap(Bitmap background, Bitmap foreground, float x, float y) {
        if( background == null ) {
            return null;
        }
        int bgWidth = background.getWidth();
        int bgHeight = background.getHeight();
        //create the new blank bitmap 创建一个新的和SRC长度宽度一样的位图
        Bitmap newbmp = Bitmap.createBitmap(bgWidth, bgHeight, Bitmap.Config.ARGB_8888);
        Canvas cv = new Canvas(newbmp);
        //draw bg into
        cv.drawBitmap(background, 0, 0, null);//在 0，0坐标开始画入bg
        //draw fg into
        cv.drawBitmap(foreground, x, y, null);//在 0，0坐标开始画入fg ，可以从任意位置画入
        //save all clip
        cv.save();//保存
        //store
        cv.restore();//存储
        return newbmp;
    }

}
