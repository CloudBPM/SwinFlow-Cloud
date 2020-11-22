package com.xq.myxuanqi.handler;

import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Environment;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;
import com.xq.myxuanqi.MyApplication;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.http.HttpHelper;
import com.xq.myxuanqi.http.ICallBack;
import com.xq.myxuanqi.ui.activity.WelcomeActivity;
import com.xq.myxuanqi.util.CommonAction;
import com.xq.myxuanqi.util.EmptyUtils;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;
import java.lang.reflect.Field;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by xq0002 on 2018/11/3.
 * 全局异常捕捉
 */

public class CrashHandler implements Thread.UncaughtExceptionHandler {
    /**
     * 系统默认UncaughtExceptionHandler
     */
    private Thread.UncaughtExceptionHandler mDefaultHandler;

    /**
     * context
     */
    private Context mContext;

    /**
     * 存储异常和参数信息
     */
    private Map<String, String> paramsMap = new HashMap<>();

    /**
     * 格式化时间
     */
    private SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss");

    private String TAG = this.getClass().getSimpleName();

    private static CrashHandler mInstance;

    private CrashHandler() {

    }

    /**
     * 获取CrashHandler实例
     */
    public static synchronized CrashHandler getInstance() {
        if (null == mInstance) {
            synchronized (CrashHandler.class) {
                if (null == mInstance) {
                    mInstance = new CrashHandler();
                }
            }
        }
        return mInstance;
    }

    public void init(Context context) {
        mContext = context;
        mDefaultHandler = Thread.getDefaultUncaughtExceptionHandler();
        //设置该CrashHandler为系统默认的
        Thread.setDefaultUncaughtExceptionHandler(this);
        //5天后自动删除文件
        autoClear(5);
    }

    //保存指定天数后自动删除
    private void autoClear(int day) {
        File fileDir = new File(getGlobalPath());
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
        long currentTimeMillis = System.currentTimeMillis();
        String date = dateFormat.format(currentTimeMillis);
        if (fileDir.isDirectory()) {
            File[] files = fileDir.listFiles();
            if (EmptyUtils.isNotEmpty(files)) {
                for (int i = 0; i < files.length; i++) {
                    long lastModified = files[i].lastModified();
                    String format = dateFormat.format(lastModified);
                    if (Integer.valueOf(date) - Integer.valueOf(format) > day) {
                        boolean delete = files[i].delete();
                        if (delete) {
                            i--;
                        }
                    }
                }
            }
        }
    }

    //获取文件路径
    private String getGlobalPath() {
        return Environment.getExternalStorageDirectory().getAbsolutePath() +
                File.separator + "crash" + File.separator;
    }

    /**
     * 有异常捕捉时回调该函数
     *
     * @param t
     * @param e
     */
    @Override
    public void uncaughtException(Thread t, Throwable e) {
        if (!handleException(e) && mDefaultHandler != null) {//如果自己没处理交给系统处理
            mDefaultHandler.uncaughtException(t, e);
        } else {//自己处理
            try {//延迟3秒杀进程
                Thread.sleep(3000);

            } catch (InterruptedException e1) {
                e1.printStackTrace();
            }
            //退出程序
            CommonAction.getInstance().outSign();
            Intent intent = new Intent(mContext, WelcomeActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            mContext.startActivity(intent);
            //            CommonAction.getInstance().OutSign();
            android.os.Process.killProcess(android.os.Process.myPid());
        }
    }

    /**
     * 收集错误信息.发送到服务器
     *
     * @return 处理了该异常返回true, 否则false
     */
    private boolean handleException(Throwable ex) {
        if (ex == null) {
            return false;
        }
        //收集设备参数信息
        collectDeviceInfo(mContext);
        //收集设备参数信息
        collectDeviceInfo(mContext);
        //添加自定义信息
        addCustomInfo();
        //使用Toast来显示异常信息
        new Thread() {
            @Override
            public void run() {
                Looper.prepare();
                Looper.loop();
            }
        }.start();
        //保存日志文件
        String fileName = saveCrashInfo2File(ex);
        //将错误信息的日志文件上传至服务器
        String api = "20";
        String path = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "crash" + File.separator;
        File file = new File(path, fileName);
        uploadFile(file, api, fileName);
        return true;
    }

    private void uploadFile(File file, final String api, final String fileName) {
        String baseUrl = UrlUtils.getInstance().getApiUrl();
        String url = baseUrl + "api/service19/api" + api;
        Map<String, Object> map = new HashMap<>();
        map.put("fileName", "" + fileName);
        HttpHelper.getInstance().uploadFile(url, UrlUtils.getUserAgent(mContext), file, map,"file", new ICallBack() {
            @Override
            public void onSuccess(String string) {

            }

            @Override
            public void onFailed(String string) {

            }
        });
    }

    /**
     * 收集设备参数信息
     *
     * @param ctx
     */
    public void collectDeviceInfo(Context ctx) {
        //获取versionName,versionCode
        try {
            PackageManager pm = ctx.getPackageManager();
            PackageInfo pi = pm.getPackageInfo(ctx.getPackageName(), PackageManager.GET_ACTIVITIES);
            if (pi != null) {
                String versionName = pi.versionName == null ? "null" : pi.versionName;
                String versionCode = pi.versionCode + "";
                paramsMap.put("versionName", versionName);
                paramsMap.put("versionCode", versionCode);
            }
        } catch (PackageManager.NameNotFoundException e) {
            Log.e(TAG, "an error occured when collect package info", e);
        }
        //获取所有系统信息
        Field[] fields = Build.class.getDeclaredFields();
        for (Field field : fields) {
            try {
                field.setAccessible(true);
                paramsMap.put(field.getName(), field.get(null).toString());
            } catch (Exception e) {
                Log.e(TAG, "an error occured when collect crash info", e);
            }
        }
    }

    /**
     * 添加自定义参数
     */
    private void addCustomInfo() {

    }

    /**
     * 保存错误信息到文件中
     *
     * @param ex
     * @return 返回文件名称, 便于将文件传送到服务器
     */
    private String saveCrashInfo2File(Throwable ex) {
        Log.e("错误信息", ex.toString());
        StringBuffer sb = new StringBuffer();
        for (Map.Entry<String, String> entry : paramsMap.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            sb.append(key + "=" + value + "\n");
        }

        Writer writer = new StringWriter();
        PrintWriter printWriter = new PrintWriter(writer);
        ex.printStackTrace(printWriter);
        Throwable cause = ex.getCause();
        while (cause != null) {
            cause.printStackTrace(printWriter);
            cause = cause.getCause();
        }
        printWriter.close();
        String result = writer.toString();
        sb.append(result);
        try {
            long timestamp = System.currentTimeMillis();
            String time = format.format(new Date());
            String fileName = "crash-" + time + "-" + timestamp + ".log";
            if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
                String path = Environment.getExternalStorageDirectory().getAbsolutePath() + "/crash/";
                File dir = new File(path);
                if (!dir.exists()) {
                    dir.mkdirs();
                }
                FileOutputStream fos = new FileOutputStream(path + fileName);
                fos.write(sb.toString().getBytes());
                fos.close();
            }
            return fileName;
        } catch (Exception e) {
            Log.e(TAG, "an error occured while writing file...", e);
        }
        return null;
    }

}
