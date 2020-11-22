package com.xq.myxuanqi.util.webSocket;

import android.app.Activity;
import android.app.KeyguardManager;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.qihoo360.replugin.helper.LogDebug;
import com.xq.myxuanqi.model.contact.ContactMessage;
import com.xq.myxuanqi.model.contact.WebSocketHeart;
import com.xq.myxuanqi.model.systemNotice.SystemNotice;
import com.xq.myxuanqi.ui.activity.HomeActivity;
import com.xq.myxuanqi.ui.activity.communication.ChatActivity;
import com.xq.myxuanqi.ui.activity.communication.LockScreenMessageReminderActivity;
import com.xq.myxuanqi.util.HttpUtils;
import com.xq.myxuanqi.util.SpUtil;

import org.litepal.LitePal;

import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okio.ByteString;

import static com.xq.myxuanqi.ui.activity.HomeActivity.unReadMessageCount;
import static com.xq.myxuanqi.ui.activity.HomeActivity.updateRedPoint;
import static com.xq.myxuanqi.ui.activity.HomeActivity.updateRedPoint1;

public class EchoWebSocketListener extends WebSocketListener {

    private static final String TAG = "EchoWebSocketListener";
    private Gson gson = new Gson();
    private ContactMessage contactMessage;

    private Activity activity;

    private static long lastTimeDisconnection = System.currentTimeMillis();

    private static LocalBroadcastManager localBroadcastManager;

    public EchoWebSocketListener(Activity activity) {
        super();
        this.activity = activity;
        localBroadcastManager = LocalBroadcastManager.getInstance(activity);
    }

    @Override
    public void onOpen(WebSocket webSocket, Response response) {
        super.onOpen(webSocket, response);
        Log.d(TAG, "onOpen: ");
        //这里表示连接成功
        Intent intent4 = new Intent("com.xq.myxuanqi.connectSuccess");
        localBroadcastManager.sendBroadcast(intent4);
    }

    @Override
    public void onMessage(WebSocket webSocket, String text) {
        super.onMessage(webSocket, text);
        Log.d(TAG, "onMessage1: " + text);
        WebSocketHeart webSocketHeart = gson.fromJson(text, WebSocketHeart.class);
        switch (webSocketHeart.getMessageType()) {
            case WebSocketClient.MESSAGE_TYPE_HEART:
                //心跳
                Log.d(TAG, "onMessage1: pong");
                webSocket.send("{\"messageType\":\"0\",\"messageData\":\"pong\"}");
                break;
            case WebSocketClient.MESSAGE_TYPE_SEND_SUCCESS:
                //我发送消息成功了
                Log.d(TAG, "onMessage1122: " + webSocketHeart.getMessageData());
                //应该在这里就把数据存数据库，然后只是发一个通知，再从数据库取数据
                contactMessage = gson.fromJson(webSocketHeart.getMessageData(), ContactMessage.class);
                //更新id
                ContentValues values = new ContentValues();
                values.put("messageId", contactMessage.getMessageId());
                contactMessage.saveOrUpdate("sendTime = ? and senderId = ?", "" + contactMessage.getSendTime(), contactMessage.getSenderId());
                //发送广播
                Intent intent1 = new Intent("com.xq.myxuanqi.sendMessageSuccess");
                localBroadcastManager.sendBroadcast(intent1);
                break;
            case WebSocketClient.MESSAGE_TYPE_RECEIVE_MESSAGE:
                //我收到对方发来的消息
                //应该在这里就把数据存数据库，然后只是发一个通知，再从数据库取数据
                contactMessage = gson.fromJson(webSocketHeart.getMessageData(), ContactMessage.class);
                contactMessage.setRead(false);
                contactMessage.save();
                //提示音和通知栏
//                MessageNotification.showNotification();
                Log.d(TAG, "EchoWebSocketListener: " + activity);
                MessageNotification.showNotification(activity, contactMessage);

                //发送广播
                Intent intent2 = new Intent("com.xq.myxuanqi.getNewMessage");
                localBroadcastManager.sendBroadcast(intent2);
                Log.d(TAG, "onMessage: 222:");
                //---锁屏消息
                KeyguardManager km = (KeyguardManager) activity.getSystemService(Context.KEYGUARD_SERVICE);
                Log.d(TAG, "onMessage: 333:" + km.isKeyguardLocked());
                if (km.isKeyguardLocked()) {
                    //为true就是锁屏状态下
                    // 启动Activity
                    Intent alarmIntent = new Intent(activity, LockScreenMessageReminderActivity.class);
                    //携带数据
//                    alarmIntent.putExtra("msg", "1231231231231231");
                    Log.d(TAG, "onMessage: 444:");
                    //activity需要新的任务栈
                    alarmIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    activity.startActivity(alarmIntent);
                }
                Log.d(TAG, "onMessage: 555:");
                //--------------------
                //底部小红点计数
                if (unReadMessageCount.containsKey(contactMessage.getSenderId())) {
                    //用户id存在
                    int count = unReadMessageCount.get(contactMessage.getSenderId());
                    unReadMessageCount.put(contactMessage.getSenderId(), count + 1);
                } else {
                    unReadMessageCount.put(contactMessage.getSenderId(), 1);
                }
                if (!ChatActivity.yourUserId.equals("")) {
                    unReadMessageCount.put(ChatActivity.yourUserId, 0);
                }
                activity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        updateRedPoint();
                    }
                });
                //------------------end

                break;
            case WebSocketClient.MESSAGE_TYPE_RECEIVE_SYSTEM_NOTICE:
                //{"messageData":"{\"banEndTime\":1552120500000,\"banStartTime\":1548232440000,\"banned\":1,\"createDatetime\":1548232420000,\"id\":\"0000000000000000000000000000033k\",\"lastupdate\":1548232420000,\"level\":0,\"liveStatus\":1,\"mobileContent\":\"更新通知\",\"name\":\"更新通知\",\"organizationName\":\"杭州轩琦信息科技有限公司\",\"owner\":\"00000000000001R\",\"pcContent\":\"更新通知\",\"publisher\":\"小琦\",\"publisherId\":\"00000000000001b\"}","messageType":"4"}
                //我收到系统消息
                //应该在这里就把数据存数据库，然后只是发一个通知，再从数据库取数据
                Log.d(TAG, "onMessage444: 收到系统消息");
                SystemNotice systemNotice = gson.fromJson(webSocketHeart.getMessageData(), SystemNotice.class);
//                systemNotice.saveOrUpdate("systemNoticeId = ?", systemNotice.getSystemNoticeId());
                int count = LitePal.where("systemNoticeId = ?", systemNotice.getSystemNoticeId())
                        .count(SystemNotice.class);
                if (count == 0) {
                    //新的系统消息
                    Log.d(TAG, "onMessage555555: ");
                    systemNotice.save();
                    //发送广播
                    Intent intent3 = new Intent("com.xq.myxuanqi.getSystemNotice");
                    localBroadcastManager.sendBroadcast(intent3);
                }
                Log.d(TAG, "onMessage66666: ");
                break;
            case WebSocketClient.MESSAGE_TYPE_BPM_SERVER:
                String messageData = webSocketHeart.getMessageData();
                MessageNotification.showNotification1(activity);
                Log.d(TAG, "onMessage777777: ");
                //发送广播
                Intent intent5 = new Intent("com.xq.myxuanqi.bpmsvr");
                localBroadcastManager.sendBroadcast(intent5);
                KeyguardManager km1 = (KeyguardManager) activity.getSystemService(Context.KEYGUARD_SERVICE);
                Log.d(TAG, "onMessage: 333:" + km1.isKeyguardLocked());
                if (km1.isKeyguardLocked()) {
                    //为true就是锁屏状态下
                    // 启动Activity
                    Intent alarmIntent = new Intent(activity, LockScreenMessageReminderActivity.class);
                    //携带数据
                    //                    alarmIntent.putExtra("msg", "1231231231231231");
                    Log.d(TAG, "onMessage: 444:");
                    //activity需要新的任务栈
                    alarmIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    activity.startActivity(alarmIntent);
                }
                //底部小红点计数
                HomeActivity.num++;
                updateRedPoint1();
                break;
        }
    }

    //接受到返回的消息
    @Override
    public void onMessage(WebSocket webSocket, ByteString bytes) {
        super.onMessage(webSocket, bytes);
        Log.d(TAG, "onMessage2: " + bytes);
    }

    @Override
    public void onClosing(WebSocket webSocket, int code, String reason) {
        super.onClosing(webSocket, code, reason);
        Log.d(TAG, "onClosing: code:" + code);
        Log.d(TAG, "onClosing: reason:" + reason);
    }

    @Override
    public void onClosed(WebSocket webSocket, int code, String reason) {
        super.onClosed(webSocket, code, reason);
        Log.d(TAG, "onClosed: code: " + code);
        Log.d(TAG, "onClosed: reason: " + reason);
    }

    @Override
    public void onFailure(WebSocket webSocket, Throwable t, Response response) {
        super.onFailure(webSocket, t, response);
        t.printStackTrace();
        webSocket.cancel();
        Log.d(TAG, "onFailure: " + t.getMessage());
        Log.d(TAG, "onFailure23331: " + lastTimeDisconnection);
        Log.d(TAG, "onFailure23332: " + System.currentTimeMillis());
        //当断开网络,这里的response为null
        if (System.currentTimeMillis() - lastTimeDisconnection > 1000) {
            Intent intent3 = new Intent("com.xq.myxuanqi.webSocketAbort");
            Log.d(TAG, "onFailure2333: 44444");
            localBroadcastManager.sendBroadcast(intent3);
        }
        lastTimeDisconnection = System.currentTimeMillis();
    }
}
