package com.xq.myxuanqi.util;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Environment;
import android.support.v4.content.FileProvider;
import android.support.v7.app.AlertDialog;
import android.widget.Toast;

import com.xq.myxuanqi.http.DownloadListener;
import com.xq.myxuanqi.http.HttpHelper;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by xq0002 on 2018/12/13.
 */

public class DownloadUtils {
    private Activity mContext;
    private File mFile;
    private DownloadApkListener mDownloadApkListener;

    public interface DownloadApkListener{
        void onDownLoadApkListener(int i);
    }

    public void setDownloadApkListener(DownloadApkListener downloadApkListener) {
        mDownloadApkListener = downloadApkListener;
    }

    public DownloadUtils(Activity context) {
        mContext = context;
    }

    public void downloadApk(final String urlPath){
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    URL url = new URL(urlPath);
                    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                    connection.setRequestMethod("GET");
                    connection.setConnectTimeout(5000);
                    FileOutputStream fileOutputStream = null;
                    InputStream inputStream;
                    if (connection.getResponseCode() == 200) {
                        inputStream = connection.getInputStream();
                        if (inputStream != null) {
                            mFile = getFile(urlPath);
                            fileOutputStream = new FileOutputStream(mFile);
                            byte[] buffer = new byte[1024];
                            int length = 0;
                            while ((length = inputStream.read(buffer)) != -1) {
                                fileOutputStream.write(buffer, 0, length);
                            }
                            fileOutputStream.close();
                            fileOutputStream.flush();
                        }
                        inputStream.close();
                        mContext.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                mDownloadApkListener.onDownLoadApkListener(0);
                            }
                        });

                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    mContext.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            mDownloadApkListener.onDownLoadApkListener(-1);
                        }
                    });

                }
            }
        }).start();
    }
    /**
     * 根据传过来url创建文件
     */
    private File getFile(String url) {
        File files = new File(Environment.getExternalStorageDirectory().getAbsoluteFile(), getFilePath(url));
        return files;
    }
    /**
     * 截取出url后面的apk的文件名
     * @param url
     * @return
     */
    private String getFilePath(String url) {
        return url.substring(url.lastIndexOf("/"), url.length());
    }
    /*
    * 安装apk
    * */
    public static void installApk(String path, File apkFile,Context context) {
        Intent intent = new Intent();
        intent.setAction(android.content.Intent.ACTION_VIEW);
        File file = new File(
                Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                , "myxuanqi.apk");
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
            /* Android N 写法*/
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            Uri contentUri = FileProvider.getUriForFile(context, "com.xq.myxuanqi.fileprovider", file);
            intent.setDataAndType(contentUri, "application/vnd.android.package-archive");
        } else {
            intent.setDataAndType(Uri.parse("file:///storage/emulated/0/Download/myxuanqi.apk"), "application/vnd.android.package-archive");
        }
        context.startActivity(intent);
    }
    /*
    * 获取apk本地版本号
    * */
    public static int getVersionCode(Context context) {
        // 获取packagemanager的实例
        PackageManager packageManager = context.getPackageManager();
        // getPackageName()是你当前类的包名，0代表是获取版本信息
        PackageInfo packageInfo = null;
        try {
            packageInfo = packageManager.getPackageInfo(context.getPackageName(), 0);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        //获取版本号
        int versionCode = packageInfo.versionCode;
        return versionCode;
    }
    /*
    * 判断是下载还是直接更新apk
    * */
    public static void downloadOrInstallApk(int update, int versionCode,final Context context, final Activity homeActivity, final ProgressDialog mProgressDialog, final int flag) {
        //-1：没有新版本 0：非重要更新 1：重要更新
        if (update != -1 && flag==1) {
            //检查是否有已下载好的apk并将该apk版本号与本地版本号进行对比，大则安装，小则去服务器下载
            final String path = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getPath() + File.separator+"myxuanqi.apk";
            File file = new File(path);
            if (file.exists()){
                //apk包是完整的
                if (SpUtil.getInstance().getBoolean("download")){
                    PackageManager packageManager = context.getPackageManager();
                    PackageInfo packageInfo = packageManager.getPackageArchiveInfo(path, PackageManager.GET_ACTIVITIES);
                    if (EmptyUtils.isNotEmpty(packageInfo)){
                        int code = packageInfo.versionCode;
                        if (versionCode==code) {
                            //弹出是否安装提示框
                            AlertDialog alertDialog = new AlertDialog.Builder(context)
                                    .setTitle("提示")
                                    .setMessage("检测到本地存在高版本安装包，是否现在安装？")
                                    .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialog, int which) {
                                            dialog.dismiss();
                                        }
                                    })
                                    .setPositiveButton("安装", new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialog, int which) {
                                            File file = new File(path);
                                            //安装App
                                            DownloadUtils.installApk(path,file,context);
                                        }
                                    })
                                    .create();
                            alertDialog.setCancelable(false);
                            alertDialog.show();
                        }else {
                            if (update==1){ //重要更新
                                //去服务器下载
                                downloadApkToInternet(context,homeActivity,mProgressDialog);
                            }else if (update==0){
                                //弹出检测到有新版本是否下载安装的提示框
                                AlertDialog alertDialog = new AlertDialog.Builder(context)
                                        .setTitle("提示")
                                        .setMessage("检测到有新版本，是否现在升级？")
                                        .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                                            @Override
                                            public void onClick(DialogInterface dialog, int which) {
                                                dialog.dismiss();
                                            }
                                        })
                                        .setPositiveButton("升级", new DialogInterface.OnClickListener() {
                                            @Override
                                            public void onClick(DialogInterface dialog, int which) {
                                                //去服务器下载
                                                downloadApkToInternet(context,homeActivity,mProgressDialog);
                                            }
                                        })
                                        .create();
                                alertDialog.setCancelable(false);
                                alertDialog.show();
                            }
                        }

                    } else {
                        if (update==1){ //重要更新
                            //去服务器下载
                            downloadApkToInternet(context,homeActivity,mProgressDialog);
                        }else if (update==0){
                            //弹出检测到有新版本是否下载安装的提示框
                            AlertDialog alertDialog = new AlertDialog.Builder(context)
                                    .setTitle("提示")
                                    .setMessage("检测到有新版本，是否现在升级？")
                                    .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialog, int which) {
                                            dialog.dismiss();
                                        }
                                    })
                                    .setPositiveButton("升级", new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialog, int which) {
                                            //去服务器下载
                                            downloadApkToInternet(context,homeActivity,mProgressDialog);
                                        }
                                    })
                                    .create();
                            alertDialog.setCancelable(false);
                            alertDialog.show();
                        }

                    }
                }else {
                    file.delete();  //删除不完整的安装包
                    if (update==1){ //重要更新
                        //去服务器下载
                        downloadApkToInternet(context,homeActivity,mProgressDialog);
                    }else if (update==0){
                        //弹出检测到有新版本是否下载安装的提示框
                        AlertDialog alertDialog = new AlertDialog.Builder(context)
                                .setTitle("提示")
                                .setMessage("检测到有新版本，是否现在升级？")
                                .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {
                                        dialog.dismiss();
                                    }
                                })
                                .setPositiveButton("升级", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {
                                        //去服务器下载
                                        downloadApkToInternet(context,homeActivity,mProgressDialog);
                                    }
                                })
                                .create();
                        alertDialog.setCancelable(false);
                        alertDialog.show();
                    }
                }
                }else {
                    if (update==1){ //重要更新
                        //去服务器下载
                        downloadApkToInternet(context,homeActivity,mProgressDialog);
                    }else if (update==0){
                        //弹出检测到有新版本是否下载安装的提示框
                        AlertDialog alertDialog = new AlertDialog.Builder(context)
                                .setTitle("提示")
                                .setMessage("检测到有新版本，是否现在升级？")
                                .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {
                                        dialog.dismiss();
                                    }
                                })
                                .setPositiveButton("升级", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {
                                        //去服务器下载
                                        downloadApkToInternet(context,homeActivity,mProgressDialog);
                                    }
                                })
                                .create();
                        alertDialog.setCancelable(false);
                        alertDialog.show();
                    }
                }

            }
    }
    /*
    * 从服务器下载apk
    * */
    public static void downloadApkToInternet(final Context context, final Activity homeActivity, final ProgressDialog mProgressDialog) {
        //去服务器下载
        String url = UrlUtils.getUrl()+"login/myxuanqi.apk";
        String path = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getPath() + File.separator+"myxuanqi.apk";
        HttpHelper.getInstance().downloadFile(url, path, new DownloadListener() {
            @Override
            public void onStart() {
                homeActivity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(context, "开始下载！", Toast.LENGTH_SHORT).show();
                        SpUtil.getInstance().saveBoolean("download",false);
                    }
                });
            }

            @Override
            public void onProgress(final int progress) {
                homeActivity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        mProgressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
                        mProgressDialog.setCancelable(false);
                        mProgressDialog.setProgress(progress);
                        mProgressDialog.setMessage("正在下载中");
                        mProgressDialog.setMax(100);
                        mProgressDialog.show();
                    }
                });
            }

            @Override
            public void onFinish(final String path) {
                homeActivity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(context, "下载完成！", Toast.LENGTH_SHORT).show();
                        mProgressDialog.dismiss();
                        SpUtil.getInstance().saveBoolean("download",true);
                        File file = new File(path);
                        //安装App
                        DownloadUtils.installApk(path,file,context);
                    }
                });
            }

            @Override
            public void onFail(String errorInfo) {
                homeActivity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        mProgressDialog.dismiss();
                        final AlertDialog alertDialog1 = new AlertDialog.Builder(context)
                                .setTitle("提示")
                                .setMessage(errorInfo+"安装包下载失败，请重试！")
                                .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {
                                        dialog.dismiss();
                                    }
                                })
                                .setPositiveButton("重试", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {
                                        downloadApkToInternet(context, homeActivity,mProgressDialog);
                                    }
                                })
                                .create();
                        alertDialog1.show();
                    }
                });
            }
        });
                                    /*File file = new File("");
                                    //安装App
                                    DownloadUtils.installApk("",file,getBaseContext());*/
    }
}
