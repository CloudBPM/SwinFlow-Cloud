package com.xq.myxuanqi.util;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import com.xq.myxuanqi.ui.activity.CommonActivity;

/**
 * Created by wm on 2019/1/12.
 */

public class AndroidToJS extends Object {
    private Activity mContext;
    public AndroidToJS(Activity commonActivity) {
        this.mContext = commonActivity;
    }

    // 定义JS需要调用的方法
    // 被JS调用的方法必须加入@JavascriptInterface注解
    /*
    * 提交成功或失败
    * */
    @JavascriptInterface
    public void message(String msg) {
        Toast.makeText(mContext, msg, Toast.LENGTH_SHORT).show();
       mContext.finish();
    }
    /*
    * 关闭
    * */
    @JavascriptInterface
    public void close() {
        mContext.finish();
    }
    /*
    * 打开文件管理器，选择文件
    * */
    @JavascriptInterface
    public void openFileManage(){
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("*/*");//无类型限制
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        mContext.startActivityForResult(intent, 1);
    }
}
