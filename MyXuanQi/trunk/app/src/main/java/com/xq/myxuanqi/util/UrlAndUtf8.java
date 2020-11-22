package com.xq.myxuanqi.util;

import java.io.UnsupportedEncodingException;

/**
 * Created by xq00005 on 2018/10/18.
 */

public class UrlAndUtf8 {
    public static String getURLEncoderString(String str) {//url编码
        String result = "";
        if (null == str) {
            return "";
        }
        try {
            result = java.net.URLEncoder.encode(str, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return result;
    }

    public static String URLDecoderString(String str) {//url解码
        String result = "";
        if (null == str) {
            return "";
        }
        try {
            result = java.net.URLDecoder.decode(str, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return result;
    }
}
