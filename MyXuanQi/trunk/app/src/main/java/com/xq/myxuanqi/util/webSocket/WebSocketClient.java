package com.xq.myxuanqi.util.webSocket;

import android.app.Activity;
import android.content.Context;
import android.util.Log;

import com.cloudibpm.core.user.Login;
import com.google.gson.Gson;
import com.xq.myxuanqi.model.contact.WebSocketHeart;
import com.xq.myxuanqi.util.HttpUtils;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;

import okhttp3.Request;
import okhttp3.WebSocket;

public class WebSocketClient {

    private static final String TAG = "WebSocketClient";

    private static final int NORMAL_CLOSURE_STATUS = 1000;

    //消息类型：0：心跳， 1：聊天消息， 2：发送消息成功, 3:我收到对方发来的消息， 4：我收到系统消息，5：有新的待办事项的提醒
    static final String MESSAGE_TYPE_HEART = "0";
    public static final String MESSAGE_TYPE_CHAT = "1";
    static final String MESSAGE_TYPE_SEND_SUCCESS = "2";
    static final String MESSAGE_TYPE_RECEIVE_MESSAGE = "3";
    static final String MESSAGE_TYPE_RECEIVE_SYSTEM_NOTICE = "4";
    static final String MESSAGE_TYPE_BPM_SERVER = "5";
    private Activity activity;
    private static WebSocket webSocket;
    private EchoWebSocketListener listener;
    private Login login;
    Gson gson = new Gson();

    public WebSocketClient(Activity activity) {
        this.activity = activity;
    }
    public WebSocketClient() {

    }

    public void startWebSocket() {
        //连接webSocket
        Log.d(TAG, "startWebSocket: " + SpUtil.getInstance().getStr("sessionId"));
        listener = new EchoWebSocketListener(activity);
        login = SpUtil.getInstance().getLogin();
       /* String ip = SpUtil.getInstance().getStr("ip");
        ip = ip.substring(0, ip.lastIndexOf(":"));*/
        String ip = UrlUtils.getApiUrl();
        ip = ip.substring(7);
        Log.d(TAG, "startWebSocket: " + ip);
        Request request = new Request.Builder()
                .url("ws://" + ip + "api/webSocket/" + SpUtil.getInstance().getStr("sessionId") + "/" + login.getUser().getId() + "/app")
//                .url("ws://" + ip + "api/webSocket/" + SpUtil.getInstance().getStr("sessionId") + "/" + login.getUser().getId())
//                .url("ws://" + "192.168.1.56" + ":8088/" + "api/webSocket/" + SpUtil.getInstance().getStr("sessionId") + "/" + loginMessageModel.getUser().getId())
                .build();
        webSocket = HttpUtils.getInstance().newWebSocket(request, listener);
    }

    /**
     *利用webSocket发送消息
     * @param messageType  消息类型：0：心跳， 1：聊天消息， 2：发送消息成功, 3:我收到对方发来的消息， 4：我收到系统消息
     * @param messageData  消息内容
     */
    public void sendMessage(String messageType, String messageData) {
        WebSocketHeart webSocketHeart = new WebSocketHeart();
        webSocketHeart.setMessageType(messageType);
        webSocketHeart.setMessageData(messageData);
        webSocket.send(gson.toJson(webSocketHeart));
    }

    //断开webSocket
    public void closeWebSocket() {
        webSocket.close(NORMAL_CLOSURE_STATUS, "我挂了！");
    }
    public static WebSocket getWebSocket() {
        return webSocket;
    }

}
