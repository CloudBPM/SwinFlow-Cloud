package com.xq.myxuanqi.util;

import android.os.Environment;

/**
 * 2019年3月18日10:26:54
 * 本地文件的存放地址，放在这里统一管理
 */
public class FileLocation {
    private  static String sdCard = "" + Environment.getExternalStorageDirectory();

    public static String chatImagePath = sdCard + "/Pictures/myxuanqi/";
}
