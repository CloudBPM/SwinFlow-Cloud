package com.xq.myxuanqi.util;

import android.content.Context;
import android.os.Build;
import android.webkit.WebSettings;

import java.io.File;

/**
 * Created by xq0002 on 2018/12/1.
 */

public class UrlUtils {
    //    public static final String urlPrefix = "http://192.168.1.132:8080";
    //  public static final String urlPrefix = "http://192.168.1.56:8080";
    //  public static final String urlPrefix = "http://47.94.216.44:8080";
    //  public static final String urlPrefix = "http://192.168.1.67:8080";
    //  public static final String urlPrefix1 = "http://192.168.1.67:8088";

    public static final String urlPrefix = "http://192.168.1.54:8080";
    public static final String urlPrefix1 = "http://192.168.1.54:8088";
    public static final String urlPrefix2 = "ws://192.168.1.54:8088";
    //type:  0：单机版  1：云计算版
    public static int type = 1;

    private static class UrlUtilsSingle {
        private static final UrlUtils INSTANCE = new UrlUtils();
    }

    public static UrlUtils getInstance() {
        return UrlUtilsSingle.INSTANCE;
    }

    //获取Url路径 8080
    public static String getUrl() {
        String url = "";
        if (type == 0) {
            url = "http://" + SpUtil.getInstance().getStr("ip") + "/";
        } else if (type == 1) {
            url = "http://paas.xuanqiyun.com:30005/";
//            url = "http://192.168.1.132:8080/";
        }
        return url;
    }

    //获取api路径 8088
    public static String getApiUrl() {
        String apiUrl = "";
        if (type == 0) {
            String[] split = SpUtil.getInstance().getStr("ip").split(":");
            apiUrl = "http://" + split[0] + ":8088/";
        } else if (type == 1) {
//            apiUrl = "http://192.168.1.132:8088/";
            apiUrl = "http://paas.xuanqiyun.com:8088/";
        }
        return apiUrl;
    }

    public static String getFileUrl() {
        //测试版，获取本地文件
//        return "http://192.168.1.54:8080/file/o";
        return "http://paas.xuanqiyun.com:30005/file/";
//        return "http://192.168.1.67:8080/file";

    }

    //下载插件的路径
    public static String downloadRepluginUrl(String oid, String apk, String id) {
        String url = SpUtil.getInstance().getStr("ip") + File.separator + "file" + File.separator + oid +
                File.separator + "am" + File.separator + "android_app_plugin" + File.separator + id +
                File.separator + apk + ".apk";
        return url;
    }

    //下载插件图片的路径
    public static String downloadRepluginImageUrl(String oid, String apk) {
        String url = SpUtil.getInstance().getStr("ip") + File.separator + "file" + File.separator + oid +
                File.separator + "am" + File.separator + "android_app_plugin" + File.separator + apk +
                File.separator + "ICON_" + apk + ".png";
        return url;
    }

    //获取请求头
    public static String getUserAgent(Context context) {
        String userAgent = "";
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            try {
                userAgent = WebSettings.getDefaultUserAgent(context);
            } catch (Exception e) {
                userAgent = System.getProperty("http.agent");
            }
        } else {
            userAgent = System.getProperty("http.agent");
        }
        StringBuffer sb = new StringBuffer();
        for (int i = 0, length = userAgent.length(); i < length; i++) {
            char c = userAgent.charAt(i);
            if (c <= '\u001f' || c >= '\u007f') {
                sb.append(String.format("\\u%04x", (int) c));
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }

}
