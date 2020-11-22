package com.xq.myxuanqi.ui.activity;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.ProgressDialog;
import android.arch.lifecycle.ViewModelProviders;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.constraint.ConstraintLayout;
import android.support.design.internal.BottomNavigationItemView;
import android.support.design.internal.BottomNavigationMenuView;
import android.support.design.widget.BottomNavigationView;
import android.support.v4.app.Fragment;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v4.util.ArrayMap;
import android.support.v4.view.ViewPager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationListener;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.Staff;
import com.google.gson.Gson;
import com.tbruyelle.rxpermissions2.RxPermissions;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.adapter.HomeViewPagerAdapter;
import com.xq.myxuanqi.model.punch.Punch;
import com.xq.myxuanqi.receiver.AppUpdateReceiver;
import com.xq.myxuanqi.service.MyService;
import com.xq.myxuanqi.ui.fragment.CommunicationFragment;
import com.xq.myxuanqi.ui.fragment.MeFragment;
import com.xq.myxuanqi.ui.fragment.NewsFragment;
import com.xq.myxuanqi.ui.fragment.StaticHomeFragment;
import com.xq.myxuanqi.ui.fragment.VideoFragment;
import com.xq.myxuanqi.util.BottomNavigationViewHelper;
import com.xq.myxuanqi.util.DownloadUtils;
import com.xq.myxuanqi.util.HttpUtils;
import com.xq.myxuanqi.util.SerializableUtil;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.ToastUtils;
import com.xq.myxuanqi.util.UrlUtils;
import com.xq.myxuanqi.util.punch.CollectInformation;
import com.xq.myxuanqi.util.punch.MacAddressUtils;
import com.xq.myxuanqi.util.punch.NetSpeed;
import com.xq.myxuanqi.util.punch.NetSpeedTimer;
import com.xq.myxuanqi.util.webSocket.MessageNotification;
import com.xq.myxuanqi.util.webSocket.WebSocketClient;
import com.xq.myxuanqi.viewModel.HomeViewModel;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import butterknife.BindView;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;
import okhttp3.WebSocket;

public class HomeActivity extends BaseActivity{

    private static final String TAG = "HomeActivity";

    @BindView(R.id.vp)
    ViewPager mVp;
    @BindView(R.id.navigation)
    BottomNavigationView mNavigation;
    @BindView(R.id.container)
    ConstraintLayout mContainer;
    @BindView(R.id.pb_in)
    ProgressBar mPbIn;
    @BindView(R.id.tv_internet)
    TextView mTvInternet;
    @BindView(R.id.btn_in)
    Button mBtnIn;
    private List<Fragment> mList = new ArrayList<>();
    private AppUpdateReceiver mAppUpdateReceiver;
    private HomeViewModel mHomeViewModel;
    private ProgressDialog mProgressDialog;
    private int flag = 1;
    private static Context context;
    private List<MenuItem> mList1;
    private Login login;

    //重连webSocket
    private LocalBroadcastManager localBroadcastManager;
    private LocalReceiver localReceiver;
    private IntentFilter intentFilter;

    private static boolean needToReconnection = false;

    //消息小红点
    private int messageCount = 0;
    private static TextView mTvRedPoint;
    private static TextView mTvRedPoint1;
    public static HashMap<String, Integer> unReadMessageCount = new HashMap<>();  //谁的几条未读消息
    public static int num = 0;  //待办事项未读消息

    //权限申请
    final RxPermissions rxPermissions = new RxPermissions(this); // where this is an Activity or Fragment instance
    private CollectInformation collectInformation = new CollectInformation(rxPermissions);

    @Override
    public void init() {
        super.init();
        context = this;
        generateStaticPage();
        //动态注册广播
        registerBroadcastReceiver();
        Intent intent1 = new Intent(getBaseContext(), MyService.class);
        startService(intent1);
        mProgressDialog = new ProgressDialog(HomeActivity.this);
        mAppUpdateReceiver.setUpdateChange(new AppUpdateReceiver.updateChange() {
            @Override
            public void onUpdateChange(int update, int versionCode) {
                DownloadUtils.downloadOrInstallApk(update, versionCode, HomeActivity.this, HomeActivity.this, mProgressDialog, flag);
                flag = 0;
            }
        });
        //获取整个BottomNavigationView
        BottomNavigationMenuView menuView = (BottomNavigationMenuView) mNavigation.getChildAt(0);
        //这里就是获取所添加的每一个Tab(或者叫menu)，
        View tab = menuView.getChildAt(3);
        View childAt = menuView.getChildAt(4);
        BottomNavigationItemView itemView = (BottomNavigationItemView) tab;
        BottomNavigationItemView itemView1 = (BottomNavigationItemView) childAt;
        //加载我们的角标View，新创建的一个布局
        View badge = LayoutInflater.from(this).inflate(R.layout.item_circle_text, menuView, false);
        View badge1 = LayoutInflater.from(this).inflate(R.layout.item_circle_text, menuView, false);
        //添加到Tab上
        itemView.addView(badge);
        itemView1.addView(badge1);
        mTvRedPoint = badge.findViewById(R.id.update_circle);
        mTvRedPoint1 = badge1.findViewById(R.id.update_circle);
        //String.valueOf(1)
//        redPoint.setText(String.valueOf(1));
        //无消息时可以将它隐藏即可
        //默认隐藏
        mTvRedPoint.setVisibility(View.GONE);
        login = SpUtil.getInstance().getLogin();
        if (num!=0){
            mTvRedPoint1.setVisibility(View.VISIBLE);
        }else {
            mTvRedPoint1.setVisibility(View.GONE);
        }
        login = SpUtil.getInstance().getLogin();
        //        mPbIn.setVisibility(View.VISIBLE);
        mHomeViewModel = ViewModelProviders.of(this).get(HomeViewModel.class);
        //刷新session
        mHomeViewModel.refreshSession(login.getUser().getName(), SpUtil.getInstance().getStr("sessionId"));

        /*mHomeViewModel.getViewLayout();
        mHomeViewModel.setOnHomeCallBack(new HomeViewModel.onHomeCallBack() {
            @Override
            public void onHomeCallBackListener(int i) {

                if (i == 0) {
                    mHomeViewModel.getUIMutableLiveData().observe(HomeActivity.this, new Observer<MobileUI>() {
                        @Override
                        public void onChanged(@Nullable MobileUI mobileUI) {
                            //底部导航栏动态生成
                            int mbBoardNumber = mobileUI.getMbBoardNumber();
                            mobileUI.toAndroidUI(mbBoardNumber, mNavigation, mList, getSupportFragmentManager(), mVp, mList1);
                            mobileUI.setOnSelectCallBack(new MobileUI.onSelectCallBack() {
                                @Override
                                public void onSelectListener(int i) {
                                    //设置viewpager显示的页面
                                    mVp.setCurrentItem(i);
                                }
                            });
                        }
                    });
                    mPbIn.setVisibility(View.GONE);
                } else if (i == 1) {
                    mPbIn.setVisibility(View.GONE);
                } else if (i == -1) {
                    mPbIn.setVisibility(View.GONE);
                    mTvInternet.setText("网络连接失败！");
                    mTvInternet.setVisibility(View.VISIBLE);
                    mBtnIn.setVisibility(View.VISIBLE);
                    mBtnIn.setOnClickListener(new View.OnClickListener() {
                        @Override
                        @SingleClick(2000)
                        public void onClick(View v) {
                            mTvInternet.setVisibility(View.GONE);
                            mBtnIn.setVisibility(View.GONE);
                            mPbIn.setVisibility(View.VISIBLE);
                            mHomeViewModel.getViewLayout();
                            //重连操作
                            connectionWebSocket();
                        }
                    });
                } else if (i == -2){
                    mPbIn.setVisibility(View.GONE);
                    //网络连接超时
                    Toast.makeText(HomeActivity.this, "网络连接超时", Toast.LENGTH_SHORT).show();
                    if (UrlUtils.getInstance().type == 0) {
                        JumpToResult(CaptureActivity.class,REQUEST_CODE);
                    }
                }
            }
        });*/
        //连接webSocket
        connectionWebSocket();
        //适配8.0通知栏
        sendNotification();
        //注册广播
        initBroadcast();

//        initInformation();

        Log.d(TAG, "onReceive: 第一次" + SpUtil.getInstance().getBoolean(login.getUser().getId()));
        if (!SpUtil.getInstance().getBoolean(login.getUser().getId())) {
            Log.d(TAG, "init: " + SpUtil.getInstance().getBoolean(login.getUser().getId()));
            collectInformation.initInformation(this);
        }

    }

    //生成静态页面
    private void generateStaticPage() {
        mList.clear();
        mNavigation.getMenu().clear();
        mVp.removeAllViewsInLayout();
        mPbIn.setVisibility(View.GONE);
        //产生对应的fragment
        mList1 = new ArrayList<>();
        MenuItem item4 = mNavigation.getMenu().add(1, 0, 0, "首页");
        MenuItem item = mNavigation.getMenu().add(1, 1, 1, "动态");
        MenuItem item1 = mNavigation.getMenu().add(1, 2, 2, "视频");
        MenuItem item2 = mNavigation.getMenu().add(1, 3, 3, "沟通");
        MenuItem item3 = mNavigation.getMenu().add(1, 4, 4, "我的");
        item4.setIcon(R.drawable.ic_home);
        item.setIcon(R.drawable.ic_news);
        item1.setIcon(R.drawable.ic_video);
        item2.setIcon(R.drawable.ic_chat);
        item3.setIcon(R.drawable.ic_me);
        mList1.add(item4);
        mList1.add(item);
        mList1.add(item1);
        mList1.add(item2);
        mList1.add(item3);
        mNavigation.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener);
        BottomNavigationViewHelper.disableShiftMode(mNavigation);
        mList.add(new StaticHomeFragment());
        mList.add(new NewsFragment());
        mList.add(new VideoFragment());
        mList.add(new CommunicationFragment());
        mList.add(new MeFragment());
        HomeViewPagerAdapter viewPagerAdapter = new HomeViewPagerAdapter(getSupportFragmentManager(), mList);
        mVp.setAdapter(viewPagerAdapter);
        mVp.setOffscreenPageLimit(mList.size());
    }

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_home;
    }

    //底部菜单栏的选择监听
    private BottomNavigationView.OnNavigationItemSelectedListener mOnNavigationItemSelectedListener
            = new BottomNavigationView.OnNavigationItemSelectedListener() {

        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem item) {
            if (mList.size() == 4) {
                //设置监听回调
                mVp.setCurrentItem(item.getItemId() - 1, false);
            } else if (mList.size() == 5) {
                mVp.setCurrentItem(item.getItemId(), false);
            }
            if (num!=0){
                mTvRedPoint1.setVisibility(View.VISIBLE);
            }else {
                mTvRedPoint1.setVisibility(View.GONE);
            }
            return true;
        }
    };

    private void registerBroadcastReceiver() {
        if (mAppUpdateReceiver == null) {
            mAppUpdateReceiver = new AppUpdateReceiver();
            IntentFilter filter = new IntentFilter();
            filter.addAction("android.app.update");
            registerReceiver(mAppUpdateReceiver, filter);
        }
    }

    @Override
    protected void onDestroy() {
        unregisterReceiver(mAppUpdateReceiver);
        flag = 1;
        super.onDestroy();
        collectInformation.stopSendMessage();
    }

    /*@Override
    public void onRefresh() {
        mHomeViewModel.getViewLayout();
        mSrl.setRefreshing(false);
    }*/

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
//        mHomeViewModel.getViewLayout();
    }

    private void connectionWebSocket() {
        WebSocketClient webSocketClient = new WebSocketClient(HomeActivity.this);
        webSocketClient.startWebSocket();
    }

    public void sendNotification() {
        MessageNotification messageNotification = new MessageNotification(this);
        messageNotification.registerNotification();
    }

    //-------------websocket重连部分
    private void initBroadcast() {
        //注册本地广播
        localBroadcastManager = LocalBroadcastManager.getInstance(this);
        intentFilter = new IntentFilter();
        //注册广播——需要重连
        intentFilter.addAction("com.xq.myxuanqi.webSocketAbort");
        //注册广播———webSocket连接成功
        intentFilter.addAction("com.xq.myxuanqi.connectSuccess");
        //是否自动考勤
        intentFilter.addAction("com.xq.myxuanqi.attendance");

        localReceiver = new LocalReceiver();
        localBroadcastManager.registerReceiver(localReceiver, intentFilter);
    }

    //自定义本地广播
    class LocalReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            Log.d(TAG, "onReceive: 1111");
            if (intent.getAction() != null) {
                switch (intent.getAction()) {
                    //我收到消息
                    case "com.xq.myxuanqi.webSocketAbort":
                        Log.d(TAG, "onReceive: 需要重连！");
//                        Toast.makeText(context, "需要重连！", Toast.LENGTH_SHORT).show();
                        WebSocket webSocket = WebSocketClient.getWebSocket();
                        webSocket.cancel();//关闭
                        needToReconnection = true;
                        Timer timer = new Timer();
                        timer.schedule(new TimerTask() {
                            @Override
                            public void run() {
                                if (needToReconnection) {
                                    Log.d(TAG, "run23333333: " + System.currentTimeMillis());
                                    connectionWebSocket();
                                } else {
                                    Log.d(TAG, "run23333333: 233");
                                    timer.cancel();
                                }
                            }
                        }, 500, 10000);//0.5秒之后，每隔10秒做一次run()操作
                        break;
                    case "com.xq.myxuanqi.connectSuccess":
                        Log.d(TAG, "onReceive: 重连成功！");
                        needToReconnection = false;
                        break;
                    case "com.xq.myxuanqi.attendance":
                        Log.d(TAG, "onReceive: 状态改变" + SpUtil.getInstance().getBoolean(login.getUser().getId()));
                        if (SpUtil.getInstance().getBoolean(login.getUser().getId())) {
                            collectInformation.stopSendMessage();
                        } else {
                            collectInformation.initInformation(HomeActivity.this);
                        }
                        break;
                }
            } else {
                Log.e(TAG, "onReceive: ChatActivity的广播接受器为空");
            }
        }
    }
    //-------------------------------------end

    //导航栏消息小红点-----start
    public static void updateRedPoint() {
        int sum = 0;
        for (String userId : unReadMessageCount.keySet()) {
            Log.d(TAG, "updateRedPoint: userId：" + userId);
            sum = sum + unReadMessageCount.get(userId);
        }
        Log.d(TAG, "updateRedPoint: " + sum);
        if (sum > 0) {
            mTvRedPoint.setVisibility(View.VISIBLE);
            mTvRedPoint.setText("" + sum);
        } else {
            mTvRedPoint.setVisibility(View.GONE);
        }
    }
    public static void updateRedPoint1() {
        if (num!=0){
            mTvRedPoint1.setVisibility(View.VISIBLE);
        }else {
            mTvRedPoint1.setVisibility(View.GONE);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

    }

    //--------end
}
