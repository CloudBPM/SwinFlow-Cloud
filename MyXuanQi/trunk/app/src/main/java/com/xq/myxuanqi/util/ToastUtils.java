package com.xq.myxuanqi.util;

import android.app.Activity;
import android.content.Context;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import java.util.Timer;
import java.util.TimerTask;

/**
 * Created by xq0002 on 2018/12/8.
 */

public class ToastUtils {
    //2秒短提示
    public static void shortToast(String text, final TextView view, final Activity context){
        view.setVisibility(View.VISIBLE);
        view.setText(text);
        Timer timer = new Timer();
        TimerTask timerTask = new TimerTask() {
            @Override
            public void run() {
                context.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        view.setVisibility(View.GONE);
                    }
                });
            }
        };
        timer.schedule(timerTask, 2000);
    }

    public static void failToast(Activity activity) {
        activity.runOnUiThread(() -> {
            Toast.makeText(activity, "<<<网络连接无响应>>>", Toast.LENGTH_SHORT).show();
        });
    }

    public static void textToast(Activity activity, String text) {
        activity.runOnUiThread(() -> {
            Toast.makeText(activity, text, Toast.LENGTH_SHORT).show();
        });
    }
}
