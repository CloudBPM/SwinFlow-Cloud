package com.xq.myxuanqi.util;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.widget.Toast;

import com.google.gson.Gson;
import com.qihoo360.replugin.RePlugin;
import com.qihoo360.replugin.model.PluginInfo;
import com.xq.myxuanqi.MyApplication;

import java.io.File;

/**
 * Created by xq0002 on 2018/12/26.
 */

public class InstallUtil {

    public static void installPlugin(final String pluginName, final String id, final Activity activity, final Context context) {
        //判断插件是否安装
        if (!RePlugin.isPluginInstalled(pluginName)) {
            String pluginApk = pluginName + "_" + id + ".apk";
            String fileName = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + pluginApk;
            File pluginFile = new File(fileName);
            //文件不存在就返回
            if (!pluginFile.exists()) {
                Toast.makeText(MyApplication.getContext(), "安装包不存在！", Toast.LENGTH_SHORT).show();
                //下载插件
                String url = UrlUtils.downloadRepluginUrl("00000000000001R", pluginName+"_"+id,id);
                DownloadUtils downloadUtils = new DownloadUtils(activity);
                downloadUtils.downloadApk(url);
                downloadUtils.setDownloadApkListener(new DownloadUtils.DownloadApkListener() {
                    @Override
                    public void onDownLoadApkListener(int i) {
                        if (i == 0) {
                            Toast.makeText(context, "插件下载成功！", Toast.LENGTH_SHORT).show();
                            InstallUtil.installPlugin(pluginName,id,activity,context);
                        } else if (i == -1) {
                            Toast.makeText(context, "插件下载失败！", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
                return;
            }
            PluginInfo info = null;
            if (pluginFile.exists()) {
                Toast.makeText(MyApplication.getContext(), "安装 patrol_plugin 成功 " + pluginName, Toast.LENGTH_SHORT).show();
                info = RePlugin.install(fileName);
            }
            if (info != null) {
                //预先加载
                RePlugin.preload(info);
                Toast.makeText(MyApplication.getContext(), "预加载 patrol_plugin 成功 " + pluginName + info.getName(), Toast.LENGTH_SHORT).show();
            }
        }
    }

    //启动插件
    public static void startPlugin(String pluginName, Activity activity, Context context,String id) {
        if (RePlugin.isPluginInstalled(pluginName)) {
            //Log.e(TAG, "onViewClicked: 开始插件");
            Intent intent = new Intent();
            Bundle bundle = new Bundle();
            bundle.putString("login",new Gson().toJson(SpUtil.getInstance().getLogin()));
            bundle.putString("sessionData",SpUtil.getInstance().getStr("sessionId"));
            intent.putExtra("message", bundle);
            String packageName = RePlugin.getPluginInfo(pluginName).getPackageName();
            String activityName = packageName + ".MainActivity";
            intent.setComponent(new ComponentName(packageName, activityName));
            RePlugin.startActivity(activity, intent);
        } else {
            Toast.makeText(context, "插件未安装！", Toast.LENGTH_SHORT).show();
            installPlugin(pluginName,id,activity,context);
        }
    }
}
