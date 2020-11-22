package com.xq.myxuanqi.util;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Environment;
import android.support.v4.util.LruCache;
import android.text.TextUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * Created by xq0002 on 2018/12/15.
 */

/*
public class BitmapCache implements ImageLoader.ImageCache {
    private LruCache<String, Bitmap> mCache;

    public BitmapCache() {
        int maxSize = 10 * 1024 * 1024;
        mCache = new LruCache<String, Bitmap>(maxSize) {
            @Override
            protected int sizeOf(String key, Bitmap bitmap) {
                return bitmap.getRowBytes() * bitmap.getHeight();
            }
        };
    }

    */
/**
     * 先从缓存中找，有则返回图片，没有则从网络获取
     *//*

    @Override
    public Bitmap getBitmap(String url) {
        */
/**
         * 先从缓存中找，有则返回，没有则返回null
         *//*

        Bitmap bitmap = mCache.get(url);

        if (bitmap == null) {
            String fileName = url.substring(url.lastIndexOf("/") + 1);
           */
/* *
             * 如果为null，则缓存中没有，从本地SD卡缓存中找
             *//*

            File cacheDir = new File(Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "Android"
                    +File.separator+"data"+File.separator+"com.xq.myxuanqi");
            File[] cacheFiles = cacheDir.listFiles();
            if (cacheFiles != null) {
                int i = 0;
                for (; i < cacheFiles.length; i++) {
                    if (TextUtils.equals(fileName, cacheFiles[i].getName()))
                        break;
                }
                */
/**
                 * 若找到则返回bitmap否则返回null
                 *//*

                if (i < cacheFiles.length) {
                    bitmap = getSDBitmap(Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "Android"
                            +File.separator+"data"+File.separator+"com.xq.myxuanqi" + "/"
                            + fileName);
                  */
/*  *
                     * 将从SD卡中获取的bitmap放入缓存中
                     *//*

                    mCache.put(url, bitmap);
                }
            }
        }
        return bitmap;
    }

    @Override
    public void putBitmap(String url, Bitmap bitmap) {
        mCache.put(url, bitmap);
        */
/**
         * 存到本地SD中
         *//*

        putSDBitmap(url.substring(url.lastIndexOf("/") + 1), bitmap);
    }
    */
/**
     * 从本地SD卡中获取图片
     *
     * @param imgPath
     *            图片路径
     * @return 图片的Bitmap
     *//*

    private Bitmap getSDBitmap(String imgPath) {
        Bitmap bm = null;
        BitmapFactory.Options options = new BitmapFactory.Options();
        */
/**
         * 设置临时缓存大小
         *//*

        options.inTempStorage = new byte[1024 * 1024];
        */
/**
         * 通过设置Options.inPreferredConfig值来降低内存消耗： 默认为ARGB_8888: 每个像素4字节. 共32位。
         * Alpha_8: 只保存透明度，共8位，1字节。 ARGB_4444: 共16位，2字节。 RGB_565:共16位，2字节
         *//*

        options.inPreferredConfig = Bitmap.Config.ARGB_8888;
        */
/**
         * inPurgeable:设置为True,则使用BitmapFactory创建的Bitmap用于存储Pixel的内存空间，
         * 在系统内存不足时可以被回收，当应用需要再次访问该Bitmap的Pixel时，系统会再次调用BitmapFactory
         * 的decode方法重新生成Bitmap的Pixel数组。 设置为False时，表示不能被回收。
         *//*

        options.inPurgeable = true;
        options.inInputShareable = true;
        */
/**
         * 设置decode时的缩放比例。
         *//*

        options.inSampleSize = 1;
        bm = BitmapFactory.decodeFile(imgPath, options);
        return bm;
    }
    */
/**
     * 将图片保存到本地的SD卡中
     *
     * @param fileName
     * @param bitmap
     *//*

    private void putSDBitmap(final String fileName, final Bitmap bitmap) {
        new Thread(new Runnable() {

            @Override
            public void run() {
                File cacheDir = new File(Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "Android"
                        +File.separator+"data"+File.separator+"com.xq.myxuanqi");
                if (!cacheDir.exists())
                    cacheDir.mkdirs();
                File cacheFile = new File(Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "Android"
                        +File.separator+"data"+File.separator+"com.xq.myxuanqi" + "/"
                        + fileName);
                if (!cacheFile.exists()) {
                    try {
                        cacheFile.createNewFile();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                FileOutputStream fos;
                try {
                    fos = new FileOutputStream(cacheFile);
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, fos);
                    fos.close();
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

}
*/
