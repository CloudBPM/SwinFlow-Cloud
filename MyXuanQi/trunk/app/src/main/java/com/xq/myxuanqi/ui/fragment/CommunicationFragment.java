package com.xq.myxuanqi.ui.fragment;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v4.util.ArrayMap;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;

import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.Staff;
import com.cloudibpm.core.util.serviceresult.ServiceResult;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.adapter.CommunicationAdapter;
import com.xq.myxuanqi.model.contact.ContactMessage;
import com.xq.myxuanqi.model.contact.ContactMessagePage;
import com.xq.myxuanqi.model.contact.ContactPerson;
import com.xq.myxuanqi.ui.activity.HomeActivity;
import com.xq.myxuanqi.ui.activity.communication.AddressActivity;
import com.xq.myxuanqi.ui.activity.communication.ChatActivity;
import com.xq.myxuanqi.util.HttpUtils;
import com.xq.myxuanqi.util.SerializableUtil;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.ToastUtils;
import com.xq.myxuanqi.util.UrlUtils;
import com.xq.myxuanqi.util.webSocket.MessageNotification;

import org.litepal.LitePal;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import butterknife.BindView;
import butterknife.OnClick;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

/**
 * Created by wm on 2019/1/11.
 * 沟通
 * 会话列表
 */

public class CommunicationFragment extends BaseFragment {

    private static final String TAG = "CommunicationFragment";

    //查看联系人
    @BindView(R.id.image_cheat_people)
    ImageView mImageCheatPeople;
    //最近的聊天记录
    @BindView(R.id.rv_recent_contacts_list)
    RecyclerView mRvRecentContactsList;

    private CommunicationAdapter communicationAdapter;
    private List<ContactMessage> mList = new ArrayList<>();

    //本地广播
    private LocalBroadcastManager localBroadcastManager;
    private LocalReceiver localReceiver;
    private IntentFilter intentFilter;

    private Activity activity;
    private Login login;
    private String companyId;
    private String myUserId;
    private String myUserName;
    private String sessionId;
    //切换刷新
    protected boolean isCreated = false;

    @Override
    protected int getLayoutResId() {
        return R.layout.fragment_communication;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        isCreated = true;
    }

    @Override
    public void init() {
        super.init();
        View decor = getActivity().getWindow().getDecorView();
        decor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        //画界面的初始化
        initInterface();
        //收到断线重连的广播
        initBroadcast();
        //直接请求新数据
        requestHistoryMessage();
        //请求联系人
        getCheatPeopleInfo();
        //这里加一个加载框

        communicationAdapter.setOnItemClickListener(new CommunicationAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(ContactMessage contactMessage) {
                Intent intent = new Intent(activity, ChatActivity.class);
                intent.putExtra("from", "communication");
                intent.putExtra("contactMessage", contactMessage);
                startActivity(intent);
//                Toast.makeText(activity, "点击了列表项！", Toast.LENGTH_SHORT).show();
//                Log.d(TAG, "onItemClick: time1：" + System.currentTimeMillis());
                MessageNotification.cancelNotice();//点击查看以后隐藏通知
                //将点击的人的消息算作已读
                String userId = contactMessage.getSenderId();
                if (userId.equals(myUserId)) {
                    userId = contactMessage.getReceiverId();
                }
                HomeActivity.unReadMessageCount.put(userId, 0);
                HomeActivity.updateRedPoint();
            }
        });
    }

    private void initInterface() {
        activity = getActivity();
        login = SpUtil.getInstance().getLogin();
        myUserId = login.getUser().getId();
        try {
            Staff staff = (Staff) SerializableUtil.str2Obj(SpUtil.getInstance().getStr("staff"));
            companyId = staff.getOwner();
        } catch (IOException e) {
            e.printStackTrace();
        }
        sessionId = SpUtil.getInstance().getStr("sessionId");

        View decor = activity.getWindow().getDecorView();
        if (true) {
            decor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        } else {
            decor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        }

        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(activity);
        mRvRecentContactsList.setLayoutManager(linearLayoutManager);
        communicationAdapter = new CommunicationAdapter(activity, mList, myUserId);
        mRvRecentContactsList.setAdapter(communicationAdapter);
    }

    private void initBroadcast() {
        //注册本地广播
        localBroadcastManager = LocalBroadcastManager.getInstance(activity);
        intentFilter = new IntentFilter();
        //注册广播——需要重连
//        intentFilter.addAction("com.xq.myxuanqi.webSocketAbort");
        //注册广播———webSocket连接成功
//        intentFilter.addAction("com.xq.myxuanqi.connectSuccess");
        //注册广播——获取到新消息
        intentFilter.addAction("com.xq.myxuanqi.getNewMessage");
        //注册广播——发送消息成功
        intentFilter.addAction("com.xq.myxuanqi.sendMessageSuccess");
        //注册广播——消息设置为已读
        intentFilter.addAction("com.xq.myxuanqi.readMessages");
        localReceiver = new LocalReceiver();
        localBroadcastManager.registerReceiver(localReceiver, intentFilter);
    }

    private void requestHistoryMessage() {
        //一登录就要去请求历史消息
        //发送本人的id和最后一条消息的时间
        //根据时间降序取第一条消息
        ContactMessage contactMessage = LitePal.order("sendTime desc")
                .findFirst(ContactMessage.class);
        long lastSendMessageTime = System.currentTimeMillis();  //默认取当前时间
        if (contactMessage != null) {
            lastSendMessageTime = contactMessage.getSendTime();
        }
        UrlUtils urlUtils = UrlUtils.getInstance();
        String url = urlUtils.getUrl() + "om/OmServices";
        Map<String, String> mapParams = new ArrayMap<>();
        mapParams.put("sessionId", sessionId);
        mapParams.put("api", "40");

        mapParams.put("lastTime", "" + lastSendMessageTime);
//        mapParams.put("lastTime", "" + 1540806765931L);
        Log.d(TAG, "requestHistoryMessage: sendTime:" + lastSendMessageTime);
        HttpUtils.doPost(url, mapParams, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                e.printStackTrace();
                Log.d(TAG, "onFailure: ");
                ToastUtils.failToast(activity);
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                String s = response.body().string().trim();
                Log.d(TAG, "onResponse11: " + s);
                int code = response.code();
                if (s.equals("{\"status\": \"-5\" }")) {
                    ToastUtils.textToast(activity, "登录失效");
                    return;
                }
                if (code == 200) {
                    Gson gson = new GsonBuilder()
                            .create();
                    Type type = new TypeToken<ServiceResult<List<ContactMessagePage>>>() {
                    }.getType();
                    ServiceResult<List<ContactMessagePage>> serviceResult = gson.fromJson(s, type);
                    if (!serviceResult.isSuccess()) {
                        //失败
                        ToastUtils.textToast(activity, "暂无数据");
                        Log.e(TAG, "onResponse: " + serviceResult.getCodeMessage());
                        return;
                    }
                    //所有最近联系人发的消息
                    List<ContactMessagePage> contactMessagePageList = serviceResult.getData();
                    for (int i = 0; i < contactMessagePageList.size(); i++) {
                        ContactMessage[] contactMessages = contactMessagePageList.get(i).getPageEntities();
//                        在数据库中存储所有的消息，这里的数据就是只有一条数据
                        //将每个人的未读消息放到一个map里面
                        String friendsId = contactMessages[0].getSenderId();
                        if (friendsId.equals(myUserId)) {
                            friendsId = contactMessages[0].getReceiverId();
                        }
                        HomeActivity.unReadMessageCount.put(friendsId, (int) contactMessagePageList.get(i).getAllEntitiesCount());
                        //获取未读信息的数量
                        contactMessages[0].setToReadCount((int) contactMessagePageList.get(i).getAllEntitiesCount());
                        contactMessages[0].saveOrUpdate("messageId = ?", contactMessages[0].getMessageId());

                    }
                    //在同步服务器消息以后再绘制本地界面
                    getInitData();
                    activity.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            HomeActivity.updateRedPoint();

                        }
                    });
                } else {
                    ToastUtils.failToast(activity);
                }
            }
        });
    }

    private void getInitData() {
        activity.runOnUiThread(() -> {
            mList.clear();
            communicationAdapter.notifyDataSetChanged();
            //查所有的联系人
            List<ContactPerson> contactPersonList = LitePal.findAll(ContactPerson.class);
            for (int i = 0; i < contactPersonList.size(); i++) {
                String contactPersonUserId = contactPersonList.get(i).getUserId();
                //时间倒序查第一条消息，即最近的一条消息
                ContactMessage contactMessage = LitePal.where("(senderId = ? and receiverId = ?) or (receiverId = ? and senderId = ?)", contactPersonUserId, myUserId, contactPersonUserId, myUserId)
                        .order("sendTime DESC")
                        .findFirst(ContactMessage.class);
                if (contactMessage != null) {
                    mList.add(contactMessage);
                }
            }

            //list内根据sendTime排序
            Collections.sort(mList);
            Log.d(TAG, "getInitData: mListSize" + mList.size());
            communicationAdapter.notifyDataSetChanged();
        });
    }

    @OnClick({
            R.id.image_cheat_people
    })
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.image_cheat_people:
                Intent intent = new Intent(activity, AddressActivity.class);
                startActivity(intent);
                break;
        }
    }

    private void getCheatPeopleInfo() {
        //获取联系人信息
        String url = UrlUtils.getUrl() + "om/OmServices";
        Map<String, String> mapParams = new ArrayMap<>();
        mapParams.put("sessionId", sessionId);
        mapParams.put("api", "38");
        mapParams.put("orgId", companyId);
        mapParams.put("userId", myUserId);
        Log.d(TAG, "getInitData: sessionId:" + sessionId);
        Log.d(TAG, "getInitData: orgId:" + companyId);

        HttpUtils.doPost(url, mapParams, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                e.printStackTrace();
                Log.d(TAG, "onFailure: 111");
                e.printStackTrace();
                ToastUtils.failToast(activity);
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                String s = response.body().string().trim();
                Log.d(TAG, "onResponse: " + s);
                int code = response.code();
                if (s.equals("{\"status\": \"-5\" }")) {
                    ToastUtils.textToast(activity, "登录失效");
                    return;
                }
                if (code == 200) {
                    //{"data":[{"fname":"小琦","companyName":"杭州轩琦信息科技有限公司","position":"总经理","department":"经理办","userId":"00000000000001b"},{"fname":"曹海","companyName":"杭州轩琦信息科技有限公司","position":"部门经理","department":"保险部门","userId":"00000000000001q"},{"fname":"琦轩","companyName":"杭州轩琦信息科技有限公司","position":"受理","department":"保险部门","userId":"00000000000021w"},{"fname":"轩轩","companyName":"杭州轩琦信息科技有限公司","position":"一般职位6","department":"保险部门","userId":"00000000000001h"}],"codeMessage":{"code":1,"message":"success"},"success":true}
                    Gson gson = new GsonBuilder()
                            .create();
                    Type type = new TypeToken<ServiceResult<List<Map<String, String>>>>() {
                    }.getType();
                    ServiceResult<List<Map<String, String>>> serviceResult = gson.fromJson(s, type);
                    if (!serviceResult.isSuccess()) {
                        //失败
                        ToastUtils.textToast(activity, "暂无数据");
                        Log.e(TAG, "onResponse: " + serviceResult.getCodeMessage());
                        return;
                    }
                    List<Map<String, String>> contactPersonMapList = serviceResult.getData();
                    for (int i = 0; i < contactPersonMapList.size(); i++) {
                        ContactPerson contactPerson = new ContactPerson();
                        contactPerson.setUserId(contactPersonMapList.get(i).get("userId"));
                        contactPerson.setFname(contactPersonMapList.get(i).get("fname"));
                        contactPerson.setCompanyName(contactPersonMapList.get(i).get("companyName"));
                        contactPerson.setPosition(contactPersonMapList.get(i).get("position"));
                        contactPerson.setDepartment(contactPersonMapList.get(i).get("department"));
                        contactPerson.saveOrUpdate("userId = ?", contactPerson.getUserId());
                    }
                } else {
                    ToastUtils.failToast(activity);
                }
            }
        });

    }

    //自定义本地广播
    class LocalReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            Log.d(TAG, "onReceive: 1111");
            if (intent.getAction() != null) {
                switch (intent.getAction()) {
                    //我收到消息
//                    case "com.xq.myxuanqi.webSocketAbort":
//                        Log.d(TAG, "onReceive: 需要重连！");
//                        Toast.makeText(context, "需要重连！", Toast.LENGTH_SHORT).show();
//                        showReconnectionMessage(true);
//                        break;
//                    case "com.xq.myxuanqi.connectSuccess":
//                        if (isReconnection) {
//                            Log.d(TAG, "onReceive: 重连成功！");
//                            Toast.makeText(context, "重连成功！", Toast.LENGTH_SHORT).show();
//                            showReconnectionMessage(false);
//                            isReconnection = false;
//                        }
//                        break;
                    case "com.xq.myxuanqi.getNewMessage":
                        //收到消息，更新列表
                        Log.d(TAG, "onReceive: 收到消息！");
//                        Toast.makeText(context, "收到消息！", Toast.LENGTH_SHORT).show();
                        getInitData();
                        break;
                    case "com.xq.myxuanqi.sendMessageSuccess":
                        //收到消息，更新列表
                        Log.d(TAG, "onReceive: 发送消息成功！");
//                        Toast.makeText(context, "发送消息成功", Toast.LENGTH_SHORT).show();
                        getInitData();
                        break;
                    case "com.xq.myxuanqi.readMessages":
                        //已读消息，更新列表
                        Log.d(TAG, "onReceive: 消息已读！");
//                        Toast.makeText(context, "消息已读", Toast.LENGTH_SHORT).show();
                        getInitData();
                        break;
                }
            } else {
                Log.e(TAG, "onReceive: ChatActivity的广播接受器为空");
            }
        }
    }

    @Override
    public void setUserVisibleHint(boolean isVisibleToUser) {
        super.setUserVisibleHint(isVisibleToUser);
        if (!isCreated) {
            return;
        }
        //刷新画面
        if (isVisibleToUser) {
            View decor = getActivity().getWindow().getDecorView();
            decor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        }
    }
}
