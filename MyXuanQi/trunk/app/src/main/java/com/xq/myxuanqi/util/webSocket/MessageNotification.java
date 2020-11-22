package com.xq.myxuanqi.util.webSocket;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.support.v4.app.NotificationCompat;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.model.contact.ContactMessage;
import com.xq.myxuanqi.ui.activity.CommonActivity;
import com.xq.myxuanqi.ui.activity.communication.ChatActivity;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;

import static android.content.Context.NOTIFICATION_SERVICE;

public class MessageNotification {

    private Activity activity;
    private static int number = 0;  //notification的id，设为变量是为了多次出现通知
    private static NotificationManager manager;


    public MessageNotification(Activity activity) {
        this.activity = activity;
        manager = (NotificationManager) activity.getSystemService(NOTIFICATION_SERVICE);
    }

    public void registerNotification() {
        //8.0系统通知栏适配
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            String channelId = "systemNotice";
            String channelName = "系统公告";
            int importance = NotificationManager.IMPORTANCE_HIGH;
            createNotificationChannel(channelId, channelName, importance);

            channelId = "downloadMessage";
            channelName = "新版本下载";
            importance = NotificationManager.IMPORTANCE_HIGH;
            createNotificationChannel(channelId, channelName, importance);

            channelId = "communicationMessage";
            channelName = "沟通";
            importance = NotificationManager.IMPORTANCE_HIGH;
            createNotificationChannel(channelId, channelName, importance);
        }
    }

    @TargetApi(android.os.Build.VERSION_CODES.O)
    private void createNotificationChannel(String channelId, String channelName, int importance) {
        NotificationChannel channel = new NotificationChannel(channelId, channelName, importance);
        channel.enableLights(true);
        channel.setLightColor(Color.BLUE);
        NotificationManager notificationManager = (NotificationManager) activity.getSystemService( NOTIFICATION_SERVICE);
        notificationManager.createNotificationChannel(channel);
    }

    public static void showNotification(Context context, ContactMessage contactMessage) {
        Intent intent = new Intent(context, ChatActivity.class);//将要跳转的界面
        intent.putExtra("contactMessage", contactMessage);
        intent.putExtra("from", "notification");
        //这个PendingIntent.FLAG_UPDATE_CURRENT参数使得intent携带的参数生效
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
//            NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            Notification.Builder builder = new Notification.Builder(context, "communicationMessage");
            builder.setContentTitle("沟通");
            builder.setContentText(contactMessage.getMessage());
            builder.setWhen(System.currentTimeMillis());
            builder.setSmallIcon(R.mipmap.icon);  //小图标必须要有，不然websocket会触发onFailed()
//            builder.setLargeIcon(BitmapFactory.decodeResource(context.getResources(), R.mipmap.police_logo));
            builder.setAutoCancel(true);  //点击后消息提示框消失

            builder.setContentIntent(pendingIntent);
            builder.setOnlyAlertOnce(true);  //只提示一次声音
//            builder.setLights(Color.BLUE, 1000, 1000); //通知栏消息闪灯(亮一秒间隔一秒再亮)
//            NotificationManager manager = (NotificationManager) context.getSystemService(NOTIFICATION_SERVICE);
            manager.notify(number, builder.build());

        } else {
            NotificationCompat.Builder builder = new NotificationCompat.Builder(context);
            builder.setSmallIcon(R.mipmap.icon);
//            builder.setLargeIcon(BitmapFactory.decodeResource(context.getResources(), R.mipmap.police_logo));

            builder.setContentIntent(pendingIntent);
            builder.setContentTitle("点对点消息");
            builder.setAutoCancel(true);
            builder.setContentText("有新消息");
            builder.setLights(Color.BLUE, 1000, 1000); //通知栏消息闪灯(亮一秒间隔两秒再亮)
            manager.notify(number, builder.build());
        }
    }

    public static void cancelNotice() {
        manager.cancel(number);
    }
    public static void showNotification1(Context context) {
        Intent intent = new Intent(context, CommonActivity.class);//将要跳转的界面
        String url = UrlUtils.getUrl() + "client/worklist4mb.jsp?sessionId=" + SpUtil.getInstance().getStr("sessionId");
        intent.putExtra("url", url);
        intent.putExtra("type", "待办");
        //这个PendingIntent.FLAG_UPDATE_CURRENT参数使得intent携带的参数生效
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            //            NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            Notification.Builder builder = new Notification.Builder(context, "communicationMessage");
            builder.setContentTitle("待办事项");
            builder.setContentText("收到一条待办事项");
            builder.setWhen(System.currentTimeMillis());
            builder.setSmallIcon(R.mipmap.icon);  //小图标必须要有，不然websocket会触发onFailed()
            //            builder.setLargeIcon(BitmapFactory.decodeResource(context.getResources(), R.mipmap.police_logo));
            builder.setAutoCancel(true);  //点击后消息提示框消失
            builder.setContentIntent(pendingIntent);
            builder.setOnlyAlertOnce(true);  //只提示一次声音
            //            builder.setLights(Color.BLUE, 1000, 1000); //通知栏消息闪灯(亮一秒间隔一秒再亮)
            //            NotificationManager manager = (NotificationManager) context.getSystemService(NOTIFICATION_SERVICE);
            manager.notify(number, builder.build());
        } else {
            NotificationCompat.Builder builder = new NotificationCompat.Builder(context);
            builder.setSmallIcon(R.mipmap.icon);
            //            builder.setLargeIcon(BitmapFactory.decodeResource(context.getResources(), R.mipmap.police_logo));
            builder.setContentIntent(pendingIntent);
            builder.setContentTitle("待办事项");
            builder.setAutoCancel(true);
            builder.setContentText("有新消息");
            builder.setLights(Color.BLUE, 1000, 1000); //通知栏消息闪灯(亮一秒间隔两秒再亮)
            manager.notify(number, builder.build());
        }
    }
}
