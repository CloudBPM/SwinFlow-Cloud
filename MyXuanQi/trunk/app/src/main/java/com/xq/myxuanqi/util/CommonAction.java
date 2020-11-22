package com.xq.myxuanqi.util;

import android.app.Activity;
import android.content.Context;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by xq0002 on 2018/11/3.
 */

public class CommonAction {
    private List<Activity> AllActivitites = new ArrayList<Activity>();
    private static CommonAction instance;

    public CommonAction() {

    }

    public static CommonAction getInstance() {
        if (null == instance) {
            synchronized (CommonAction.class) {
                if (null == instance) {
                    instance = new CommonAction();
                }
            }
        }
        return instance;
    }


    public void addActivity(Activity activity) {
        AllActivitites.add(activity);
    }

    /**
     * 结束指定的Activity
     */
    public void finishActivity(Activity activity) {
        if (activity != null) {
            AllActivitites.remove(activity);
            activity.finish();
            activity = null;
        }
    }

    /**
     * 结束指定类名的Activity
     */
    public void finishActivity(Class<?> cls) {
        for (Activity activity : AllActivitites) {
            if (activity.getClass().equals(cls)) {
                finishActivity(activity);
                break;
            }
        }
    }

    /**
     * 结束所有Activity
     */
    public void finishAllActivity() {
        for (Activity activity : AllActivitites) {
            if (null != activity) {
                activity.finish();
            }
        }
        AllActivitites.clear();
    }

    /**
     * 退出应用程序
     */
    public void AppExit() {
        try {
            finishAllActivity();
            //退出程序
            android.os.Process.killProcess(android.os.Process.myPid());
            System.exit(1);
        } catch (Exception e) {
        }
    }

    /**
     * 退出登录
     */
    public void outSign(){
        finishAllActivity();
    }
}
