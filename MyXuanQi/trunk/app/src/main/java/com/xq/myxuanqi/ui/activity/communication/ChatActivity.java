package com.xq.myxuanqi.ui.activity.communication;

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.ContentUris;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.annotation.RequiresApi;
import android.support.constraint.ConstraintLayout;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v4.util.ArrayMap;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import com.bumptech.glide.Glide;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.Staff;
import com.cloudibpm.core.util.serviceresult.ServiceResult;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.tbruyelle.rxpermissions2.RxPermissions;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.adapter.CommunicationDetailAdapter;
import com.xq.myxuanqi.model.contact.ContactMessage;
import com.xq.myxuanqi.model.contact.ContactPerson;
import com.xq.myxuanqi.ui.activity.video.ImagePreviewActivity;
import com.xq.myxuanqi.ui.activity.video.ShootingActivity;
import com.xq.myxuanqi.ui.activity.video.SimplePlayer;
import com.xq.myxuanqi.util.FileAndBase64;
import com.xq.myxuanqi.util.HttpUtils;
import com.xq.myxuanqi.util.SerializableUtil;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.ToastUtils;
import com.xq.myxuanqi.util.UrlUtils;
import com.xq.myxuanqi.util.communication.FunctionArea;
import com.xq.myxuanqi.util.photo.PhotoPath;
import com.xq.myxuanqi.util.voice_message.AudioPlayerUtil;
import com.xq.myxuanqi.util.voice_message.VoiceRecordAndPlay;
import com.xq.myxuanqi.util.webSocket.MessageNotification;
import com.xq.myxuanqi.util.webSocket.WebSocketClient;
import org.litepal.LitePal;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.OnTouch;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

import static android.widget.NumberPicker.OnScrollListener.SCROLL_STATE_IDLE;

//这里不继承BaseActivity，会导致软键盘上弹有问题
public class ChatActivity extends AppCompatActivity implements SwipeRefreshLayout.OnRefreshListener {
    private static final String TAG = "ChatActivity";

    @BindView(R.id.iv_back)
    ImageView mIvBack;
    //聊天对象的姓名
    @BindView(R.id.tv_chat_name)
    TextView mTvChatName;

    @BindView(R.id.sr_chat_list)
    SwipeRefreshLayout mSrChatList;
    @BindView(R.id.rv_chat_list)
    RecyclerView mRvChatList;

    //发送语音信息
    @BindView(R.id.iv_send_voice_message)
    ImageView mIvSendVoiceMessage;

    @BindView(R.id.et_message_input)
    EditText mEtMessageInput;
    @BindView(R.id.btn_more_function)
    Button mBtnMoreFunction;
    @BindView(R.id.tv_send)
    TextView mTvSend;
    //功能区
    @BindView(R.id.cl_more_function)
    ConstraintLayout mClMoreFunction;
    //视频
    @BindView(R.id.iv_photo_icon)
    ImageView mIvPhotoIcon;
    //拍摄
    @BindView(R.id.iv_shooting_icon)
    ImageView mIvShootingIcon;
    //文件
    @BindView(R.id.iv_file_icon)
    ImageView mIvFileIcon;

    private final int SHOOTING_ACTIVITY = 1;
    private final int CHOSE_PHOTO = 2;
    private final int CHOSE_File = 3;

    //语音相关的
    private boolean audioRecorder = false;
    private AudioPlayerUtil player;
    private VoiceRecordAndPlay voiceRecordAndPlay;

    //
    private CommunicationDetailAdapter communicationDetailAdapter;
    private List<ContactMessage> mList = new ArrayList<>();

    private int pageSize = 10;  //每一页的数据条数
    private int pageNum = 1;  //当前页数 从1开始
    private int count = 0;
    private int toReadCount = 0;  //未读消息数
    private long lastSearchTime = System.currentTimeMillis();  //查询到的最后一条消息的时间，第一次打开为当前时间
    private boolean hasMoreMessage = true;

    //Gson解析
    private Gson gson = new Gson();
    //websocket
    private WebSocketClient webSocketClient;
    //本地广播
    private LocalBroadcastManager localBroadcastManager;
    private LocalReceiver localReceiver;
    private IntentFilter intentFilter;

    //个人信息
    private String companyId;
    private String myUserId = "";  //我的id
    private String myUserName = "";  //我的姓名
    public static String yourUserId = "";  //对方的id
    private String yourUserName = "";  //对方的姓名
    private String sessionId;

    private FunctionArea functionArea;
    private InputMethodManager imm;

    final RxPermissions rxPermissions = new RxPermissions(this); // where this is an Activity or Fragment instance


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);
        ButterKnife.bind(this);
        Log.e(TAG, "onCreate: 在聊天界面，视频上层的播放按钮会随着上下滑动而消失，可能的问题-------------------------------------------------");
        Log.d(TAG, "onItemClick: time2：" + System.currentTimeMillis());
        //界面设置
        initInterface();
        //初始化webSocket和广播
        initWebSocketAndBroadcast();
        //初始化数据
        initData();

        functionArea = new FunctionArea(this);

        player = new AudioPlayerUtil();
        voiceRecordAndPlay = new VoiceRecordAndPlay(this, player, companyId, myUserId);
        voiceRecordAndPlay.init();
        voiceRecordAndPlay.initAudioRecorderBtn();

        //测试文件下载
//        String url = "http://192.168.1.54:8080/file/222222222/usr/333333333/chatVoice/100ed652-dded-4989-85bd-f32300fab992.aac";
//        String fileDir = "/storage/emulated/0/Android/data/com.xq.myxuanqi/files/audio/";
//        String fileName = "audio.aac";
//        HttpUtils.downFile(url, fileDir, fileName);
        //-------------------------------
    }

    public void initInterface() {
        //0.获取初始化的数据
        //获取自己的详细信息
        Login login = SpUtil.getInstance().getLogin();
        try {
            Staff staff = (Staff) SerializableUtil.str2Obj(SpUtil.getInstance().getStr("staff"));
            companyId = staff.getOwner();
        } catch (IOException e) {
            e.printStackTrace();
        }
        myUserId = login.getUser().getId();
        myUserName = login.getUser().getFullName();
        sessionId = SpUtil.getInstance().getStr("sessionId");

        Intent intent = getIntent();
        String from = intent.getStringExtra("from");
        if (from.equals("address")) {
            //从联系人界面进来
            //获取对方的详细信息
            ContactPerson contactPerson = (ContactPerson) intent.getSerializableExtra("contactPerson");
            yourUserId = contactPerson.getUserId();
            yourUserName = contactPerson.getFname();

        } else {
            //从会话列表/通知栏进来
            ContactMessage contactMessage = (ContactMessage) intent.getSerializableExtra("contactMessage");
            if (!contactMessage.getReceiverId().equals(myUserId)) {
                //对方收到
                yourUserId = contactMessage.getReceiverId();
                yourUserName = contactMessage.getReceiverName();
            } else {
                yourUserId = contactMessage.getSenderId();
                yourUserName = contactMessage.getSenderName();
            }
            toReadCount = contactMessage.getToReadCount();
        }

        //绘制初始化的界面
        mTvChatName.setText(yourUserName);
        //下拉刷新
        mSrChatList.setColorSchemeResources(R.color.colorAccent);
        mSrChatList.setOnRefreshListener(this);
        //列表
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this);
        mRvChatList.setLayoutManager(linearLayoutManager);
        communicationDetailAdapter = new CommunicationDetailAdapter(this, mList, myUserId);
        mRvChatList.setAdapter(communicationDetailAdapter);
        //默认隐藏功能区
        mClMoreFunction.setVisibility(View.GONE);
        imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);

        mRvChatList.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(@NonNull RecyclerView recyclerView, int newState) {
                // 查看源码可知State有三种状态：
                // SCROLL_STATE_IDLE（静止）、
                // SCROLL_STATE_DRAGGING（上升）、
                // SCROLL_STATE_SETTLING（下落）
                 if (newState == SCROLL_STATE_IDLE) {
                     // 滚动静止时才加载图片资源，极大提升流畅度
                     communicationDetailAdapter.setScrolling(false);
//                     communicationDetailAdapter.notifyDataSetChanged();
                     if(Glide.with(ChatActivity.this).isPaused()) {
                         Glide.with(ChatActivity.this).resumeRequests();
                     }

                      // notify调用后onBindViewHolder会响应调用
                 } else{
                     communicationDetailAdapter.setScrolling(true);
                 }

                super.onScrollStateChanged(recyclerView, newState);
            }
        });

    }

    private void initWebSocketAndBroadcast() {
        //初始化webSocket
        webSocketClient = new WebSocketClient();
        //注册本地广播
        localBroadcastManager = LocalBroadcastManager.getInstance(this);
        intentFilter = new IntentFilter();
        //注册广播——获取到新消息
        intentFilter.addAction("com.xq.myxuanqi.getNewMessage");
        //注册广播——发送消息成功
        intentFilter.addAction("com.xq.myxuanqi.sendMessageSuccess");
        localReceiver = new LocalReceiver();
        localBroadcastManager.registerReceiver(localReceiver, intentFilter);

        //发送广播，所有相关的消息设置为已读.
        if (toReadCount > 0) {
            Intent intent = new Intent("com.xq.myxuanqi.readMessages");
            localBroadcastManager.sendBroadcast(intent);
        }

    }

    @OnClick({
            R.id.iv_back,
            R.id.tv_send,
            R.id.btn_more_function,
            R.id.et_message_input,
            R.id.iv_photo_icon,  //发送视频
            R.id.iv_shooting_icon,  //拍摄
            R.id.iv_file_icon

    })
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.iv_back:
                finish();
                break;
            case R.id.tv_send:
                String message = mEtMessageInput.getText().toString().trim();
                if (message.equals("")) {
                    Toast.makeText(this, "输入数据不能为空！", Toast.LENGTH_SHORT).show();
                } else {
                    //0.图片， 1.文本， 2.语音
                    sendMessage(message, ContactMessage.MESSAGE_TEXT);
                }
                break;
            case R.id.iv_photo_icon:
                Toast.makeText(this, "相册", Toast.LENGTH_SHORT).show();
                Log.d(TAG, "onClick: 相册");
                //打开相册
                rxPermissions.request(Manifest.permission.WRITE_EXTERNAL_STORAGE)
                        .subscribe(granted -> {
                            if (granted) {
                                try {
                                    choosePhoto();
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }

                            }
                        });
                break;

            case R.id.iv_shooting_icon:
                Log.d(TAG, "onClick: 1231231");
                //打开视频界面，录制视频和拍照，仿微信
                Intent intent = new Intent(this, ShootingActivity.class);
                startActivityForResult(intent, SHOOTING_ACTIVITY);
                break;
            case R.id.iv_file_icon:
                Toast.makeText(this, "文件", Toast.LENGTH_SHORT).show();
                //打开文件管理器，选择文件
                chooseFile();

                break;
            case R.id.btn_more_function:
                functionArea.hideAndShowFunctionArea(imm, mClMoreFunction, mEtMessageInput, mRvChatList, mList.size() - 1);
                break;
            case R.id.et_message_input:
                Log.d(TAG, "onClick: 33333");
                //在输入框已经获得焦点的时候再点击输入框会触发此监听事件
                if (mClMoreFunction.getVisibility() == View.VISIBLE) {
                    mClMoreFunction.setVisibility(View.GONE);
                }
                //滚到最下面
                mRvChatList.scrollToPosition(mList.size()-1);
                break;
        }
    }

    private void choosePhoto() {
        Intent intentToPickPic = new Intent(Intent.ACTION_PICK, null);
        // 如果限制上传到服务器的图片类型时可以直接写如："image/jpeg 、 image/png等的类型" 所有类型则写 "image/*"
        intentToPickPic.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "image/jpeg");
        startActivityForResult(intentToPickPic, CHOSE_PHOTO);
    }

    private void chooseFile() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("*/*");//设置类型，我这里是任意类型，任意后缀的可以这样写。
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        startActivityForResult(intent, CHOSE_File);
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case SHOOTING_ACTIVITY:
                //从拍摄界面返回
                String type = data.getStringExtra("type");
                String filePath = data.getStringExtra("filePath");
                Log.d(TAG, "onActivityResult: type：" + type);
                Log.d(TAG, "onActivityResult: filePath：" + filePath);  //这个地址是服务器返回的地址
                if (type.equals("1")) {
                    //图片
                    type = ContactMessage.MESSAGE_PHOTO;
                } else {
                    type = ContactMessage.MESSAGE_VIDEO;
                }
                if (filePath != null && !filePath.equals("")) {
                    sendMessage(filePath, type);
                }
                break;
            case CHOSE_PHOTO:
                // 获取图片
                String photoPath = PhotoPath.getRealPathFromUri(this, data.getData());
                Log.d(TAG, "onActivityResult: " + photoPath);
                uploadFile("1", photoPath);
                break;
            case CHOSE_File:
                if (resultCode == RESULT_OK) {
                    Uri uri = data.getData();
                    if (uri != null) {
                        String path = getPath(this, uri);
                        if (path != null) {
                            File file = new File(path);
                            if (file.exists()) {
                                String upLoadFilePath = file.toString();
                                String upLoadFileName = file.getName();
                                Log.d(TAG, "onActivityResult: upLoadFilePath:" + upLoadFilePath);
                                Log.d(TAG, "onActivityResult: upLoadFileName:" + upLoadFileName);
                                //------------------------------------------------------
                                int suffixPosition = upLoadFilePath.lastIndexOf(".");
                                //解决万一没有后缀的问题
                                if (suffixPosition > 0) {
                                    String fileSuffix = upLoadFilePath.substring(suffixPosition + 1);
                                    Log.d(TAG, "buildMessage: suffix:" + fileSuffix);
                                    if (fileSuffix.equals("gif") || fileSuffix.equals("jpg") || fileSuffix.equals("png") || fileSuffix.equals("jpeg")) {
                                        uploadFile("1", upLoadFilePath);
                                    } else {
                                        uploadFile("4", upLoadFilePath);
                                    }
                                } else{
                                    uploadFile("4", upLoadFilePath);
                                }
                                //------------------------------------------------------

                            }
                        }
                    }
                }
                break;
            default:
                break;
        }
    }

    /**
     * 直接传文件
     * @param type     1：图片， 2：音频， 3：视频， 4：文件
     * @param filePath
     */
    private void uploadFile(final String type, String filePath) {
        String url = UrlUtils.getApiUrl() + "api/service19/api31";
        Map<String, String> mapParams = new ArrayMap<>();
        mapParams.put("oid", companyId);
        mapParams.put("uid", myUserId);
        mapParams.put("type", type);
        HttpUtils.doPostFile(url, mapParams, filePath, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "onFailure: 222");
                e.printStackTrace();
//                loadDialog.dismiss();
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                String s = response.body().string().trim();
                Log.d(TAG, "onResponse: " + s);
                Log.d(TAG, "onTouch233: endTime:" + System.currentTimeMillis());
                //文件传输完毕就删掉
//                FileAndBase64.delete(filePath);
                if (type.equals("1")) {
                    //图片
                    runOnUiThread(() -> {
                        sendMessage(s, ContactMessage.MESSAGE_PHOTO);
                    });
                } else if (type.equals("4")) {
                    runOnUiThread(() -> {
                        sendMessage(s, ContactMessage.MESSAGE_File);
                    });

                }
//                else {
//                    sendMessage(s, ContactMessage.MESSAGE_VIDEO);
//                }

            }
        });
    }

    @Override
    public boolean dispatchTouchEvent(MotionEvent event) {
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                View view = getCurrentFocus();
                functionArea.hideKeyboardAndFunction(event, view, imm, mClMoreFunction);
                break;

            default:
                break;
        }
        return super.dispatchTouchEvent(event);
    }

    @Override
    protected void onPause() {
        super.onPause();
        //在只显示功能区切换app，回到此app的时候由于EditText拥有焦点而打开软键盘
        //关闭功能区使得回来的时候只显示软键盘
        mClMoreFunction.setVisibility(View.GONE);
    }

    @OnTouch({
            R.id.iv_send_voice_message,
    })
    public boolean onTouch(View v, MotionEvent event) {
        Log.d(TAG, "onTouch: 00000");
        switch (v.getId()) {
            case R.id.iv_send_voice_message:
                Log.d(TAG, "onTouch: 1111");
                Log.d(TAG, "onTouch: " + event.getAction());
                String audioMessage = voiceRecordAndPlay.recordVoice(event);
                Log.d(TAG, "onTouch: " + audioMessage);
                if (!audioMessage.equals("")) {
                    sendMessage(audioMessage, ContactMessage.MESSAGE_AUDIO);
                }
                break;
        }
        return true;
    }


    private void initData() {
        //将所有关于此人的聊天消息设置为已读
        ContentValues values = new ContentValues();
        values.put("read", "1");
        LitePal.updateAll(ContactMessage.class, values, "((senderId = ? and receiverId = ?) or (senderId = ? and receiverId = ?)) " +
                "and read = ?", yourUserId, myUserId, myUserId, yourUserId, "0");

        //查询聊天记录，最近的一条是最新的
        ContactMessage lastMessage = findLatestMessage();
        if (lastMessage != null) {
            //更新查询的时间,取最小时间
            Log.d(TAG, "initData: time1:" + lastMessage.getSendTime());
            lastSearchTime = lastMessage.getSendTime();
            mList.add(lastMessage);
            communicationDetailAdapter.notifyDataSetChanged();
            mRvChatList.scrollToPosition(mList.size() - 1);
        }
        //监听点击动作
        itemClick();
    }

    //查最新的一条消息
    private ContactMessage findLatestMessage() {

        return LitePal.where("((senderId = ? and receiverId = ?) or (senderId = ? and receiverId = ?)) ", yourUserId, myUserId, myUserId, yourUserId)
                .order("sendTime desc")
                .limit(pageSize)
                .findFirst(ContactMessage.class);
    }

    private void updateMessage() {
        Log.d(TAG, "updateMessage222: ");
        //收到新消息去数据库查消息
        ContactMessage contactMessage = LitePal.findLast(ContactMessage.class);
        Log.d(TAG, "updateMessage: " + contactMessage.getSenderName());
        if (contactMessage.getSenderId().equals(yourUserId) || contactMessage.getReceiverId().equals(yourUserId)) {
            //我收到的消息
            //1.更新列表
            Log.d(TAG, "updateMessage: 33333");
            communicationDetailAdapter.notifyItemInserted(mList.size());
            mList.add(contactMessage);
            //刷新列表
            communicationDetailAdapter.notifyItemRangeChanged(mList.size() + 1, communicationDetailAdapter.getItemCount());
            mRvChatList.scrollToPosition(mList.size() - 1);
        }
    }

    private void sendMessage(String message, String messageType) {
        ContactMessage contactMessage = new ContactMessage(myUserId, myUserName, yourUserId, yourUserName, message, messageType);
        //先假设发送消息成功，直接存到数据库。
//        contactMessage.save();
//        communicationDetailAdapter.notifyItemInserted(mList.size());
//        mList.add(contactMessage);

        String messageJson = gson.toJson(contactMessage);
        //利用websocket发送消息
        Log.d(TAG, "sendMessage123: " + messageJson);
        webSocketClient.sendMessage(WebSocketClient.MESSAGE_TYPE_CHAT, messageJson);

        //刷新列表
//        communicationDetailAdapter.notifyItemRangeChanged(mList.size() + 1, communicationDetailAdapter.getItemCount());
//        mRvChatList.scrollToPosition(mList.size() - 1);

        //清空输入框
        mEtMessageInput.setText("");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        //注销广播
        localBroadcastManager.unregisterReceiver(localReceiver);
    }

    @Override
    public void onRefresh() {
        //默认从服务器获取消息
        if (hasMoreMessage) {
            requestMessage();
            mSrChatList.setRefreshing(false);
        }
    }

    private void requestMessage() {
        String url = UrlUtils.getUrl() + "om/OmServices";
        Map<String, String> mapParams = new ArrayMap<>();
        mapParams.put("sessionId", sessionId);
        mapParams.put("api", "39");
        //1551323669400
        mapParams.put("lastTime", "" + lastSearchTime);
        mapParams.put("senderId", "" + yourUserId);
        Log.d(TAG, "requestMessage: lastSendTime:" + lastSearchTime);
        Log.d(TAG, "requestMessage: yourUserId:" + yourUserId);
        Log.d(TAG, "requestMessage: myUserId:" + myUserId);

        HttpUtils.doPost(url, mapParams, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "onFailure: ");
                e.printStackTrace();
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                String s = response.body().string().trim();
                Log.d(TAG, "onResponse: " + s);
                if (s.equals("{\"status\": \"-5\" }")) {
                    ToastUtils.textToast(ChatActivity.this, "登录失效");
                    return;
                }
                int code = response.code();
                if (code == 200) {
                    Gson gson = new GsonBuilder()
                            .create();
                    Type type = new TypeToken<ServiceResult<List<ContactMessage>>>() {
                    }.getType();
                    ServiceResult<List<ContactMessage>> serviceResult = gson.fromJson(s, type);
                    if (serviceResult.isSuccess()) {
                        List<ContactMessage> contactMessageList = serviceResult.getData();
                        if (contactMessageList.size() > 0) {
                            //获取最小时间的一条消息
                            lastSearchTime = contactMessageList.get(contactMessageList.size() - 1).getSendTime();
                            //直接删除以前相关的消息
                            for (ContactMessage contactMessage : contactMessageList) {
                                contactMessage.saveOrUpdate("messageId = ?", contactMessage.getMessageId());
                            }
                        } else {
                            hasMoreMessage = false;
                        }
                        Collections.reverse(mList);
                        mList.addAll(contactMessageList);
                        Collections.reverse(mList);
                        runOnUiThread(() -> {
                            communicationDetailAdapter.notifyDataSetChanged();
                            mRvChatList.scrollToPosition(10);
                        });
                    } else {
                        ToastUtils.textToast(ChatActivity.this, "暂无消息");
                    }


                } else {
                    ToastUtils.failToast(ChatActivity.this);
                }
            }
        });

    }

    private void itemClick() {
        communicationDetailAdapter.setOnItemClickListener(new CommunicationDetailAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(ContactMessage contactMessage) {
                Log.d(TAG, "onItemClick: ");
            }

            @Override
            public void onPlayAudio(ContactMessage contactMessage, ImageView imageView) {
                Log.d(TAG, "onClick: 123:2222");
                String msg = contactMessage.getMessage();
                Log.d(TAG, "onPlayAudio: " + msg);
                String[] paths = msg.split("#");
                //默认的音频存放地址
//                Log.e(TAG, "onPlayAudio: 这里还有下载路径没有改呢@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                String url = UrlUtils.getFileUrl() + paths[1].substring(13);  //语音
                String fileDir = "/storage/emulated/0/Android/data/com.xq.myxuanqi/files/audio/";
                String fileName = paths[1].substring(paths[1].lastIndexOf("/") + 1);
                Log.d(TAG, "onPlayAudio: url:" + url);
                Log.d(TAG, "onPlayAudio: fileDir:" + fileDir);
                Log.d(TAG, "onPlayAudio: fileName:" + fileName);
                HttpUtils.downFile(url, fileDir, fileName);

                try {
                    //暂停100ms
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                voiceRecordAndPlay.playVoice(fileDir + fileName, imageView);

            }

            @Override
            public void onImageClick(ContactMessage contactMessage) {
                //点击了图片
                if (contactMessage.getMessageType().equals("0")) {
                    //图片放大查看
                    String imagePath = UrlUtils.getFileUrl() + contactMessage.getMessage().substring(13);  //图片放大看
                    Intent intent1 = new Intent(ChatActivity.this, ImagePreviewActivity.class);
                    intent1.putExtra("imagePath", imagePath);
                    startActivity(intent1);
                }
            }

            @Override
            public void onVideoClick(ContactMessage contactMessage) {
                //点击了图片
                if (contactMessage.getMessageType().equals("3")) {
                    //视频播放
                    String videoPath = UrlUtils.getFileUrl() + contactMessage.getMessage().substring(13);
                    Log.d(TAG, "onImageClick: videoPath:" + videoPath);
                    Intent intent = new Intent(ChatActivity.this, SimplePlayer.class);
                    intent.putExtra("videoPath", videoPath);
                    startActivity(intent);
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
                    case "com.xq.myxuanqi.getNewMessage":
                        Log.d(TAG, "onReceive: 收到新消息！");
//                        Toast.makeText(context, "收到消息！", Toast.LENGTH_SHORT).show();
                        //更新消息列表
                        updateMessage();
                        MessageNotification.cancelNotice();
                        break;
                    case "com.xq.myxuanqi.sendMessageSuccess":
                        //发送消息成功，这里需要修改消息的状态，要是发送消息失败就显示红色感叹号
                        Log.d(TAG, "onReceive: 发送消息成功！");
//                        Toast.makeText(context, "发送消息成功！", Toast.LENGTH_SHORT).show();
                        updateMessage();
                        break;
                }
            } else {
                Log.e(TAG, "onReceive: ChatActivity的广播接受器为空");
            }
        }
    }

    //------------------------------------
    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    public String getPath(final Context context, final Uri uri) {
        final boolean isKitKat = Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT;

        // DocumentProvider
        if (isKitKat && DocumentsContract.isDocumentUri(context, uri)) { // ExternalStorageProvider
            if (isExternalStorageDocument(uri)) {
                final String docId = DocumentsContract.getDocumentId(uri);
//                Log.i(TAG,"isExternalStorageDocument***"+uri.toString());
//                Log.i(TAG,"docId***"+docId);
//                以下是打印示例：
//                isExternalStorageDocument***content://com.android.externalstorage.documents/document/primary%3ATset%2FROC2018421103253.wav
//                docId***primary:Test/ROC2018421103253.wav
                final String[] split = docId.split(":");
                final String type = split[0];

                if ("primary".equalsIgnoreCase(type)) {
                    return Environment.getExternalStorageDirectory() + "/" + split[1];
                }
            } // DownloadsProvider
            else if (isDownloadsDocument(uri)) { //                Log.i(TAG,"isDownloadsDocument***"+uri.toString());
                final String id = DocumentsContract.getDocumentId(uri);
                final Uri contentUri = ContentUris.withAppendedId(Uri.parse("content://downloads/public_downloads"), Long.valueOf(id));

                return getDataColumn(context, contentUri, null, null);
            } // MediaProvider
            else if (isMediaDocument(uri)) { //                Log.i(TAG,"isMediaDocument***"+uri.toString());
                final String docId = DocumentsContract.getDocumentId(uri);
                final String[] split = docId.split(":");
                final String type = split[0];

                Uri contentUri = null;
                if ("image".equals(type)) {
                    contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                } else if ("video".equals(type)) {
                    contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
                } else if ("audio".equals(type)) {
                    contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
                }
                final String selection = "_id=?";
                final String[] selectionArgs = new String[]{split[1]};

                return getDataColumn(context, contentUri, selection, selectionArgs);
            }
        } // MediaStore (and general)
        else if ("content".equalsIgnoreCase(uri.getScheme())) { //            Log.i(TAG,"content***"+uri.toString());
            return getDataColumn(context, uri, null, null);
        } // File
        else if ("file".equalsIgnoreCase(uri.getScheme())) { //            Log.i(TAG,"file***"+uri.toString());
            return uri.getPath();
        }
        return null;
    }

    /**
     * Get the value of the data column for this Uri. This is useful for
     * MediaStore Uris, and other file-based ContentProviders.
     *
     * @param context       The context.
     * @param uri           The Uri to query.
     * @param selection     (Optional) Filter used in the query.
     * @param selectionArgs (Optional) Selection arguments used in the query.
     * @return The value of the _data column, which is typically a file path.
     */
    public String getDataColumn(Context context, Uri uri, String selection,
                                String[] selectionArgs) {
        Cursor cursor = null;
        final String column = "_data";
        final String[] projection = {column};

        try {
            cursor = context.getContentResolver().query(uri, projection, selection, selectionArgs,
                    null);
            if (cursor != null && cursor.moveToFirst()) {
                final int column_index = cursor.getColumnIndexOrThrow(column);
                return cursor.getString(column_index);
            }
        } finally {
            if (cursor != null) cursor.close();
        }
        return null;
    }

    public boolean isExternalStorageDocument(Uri uri) {
        return "com.android.externalstorage.documents".equals(uri.getAuthority());
    }

    public boolean isDownloadsDocument(Uri uri) {
        return "com.android.providers.downloads.documents".equals(uri.getAuthority());
    }

    public boolean isMediaDocument(Uri uri) {
        return "com.android.providers.media.documents".equals(uri.getAuthority());
    }
    //------------------------------------
}
