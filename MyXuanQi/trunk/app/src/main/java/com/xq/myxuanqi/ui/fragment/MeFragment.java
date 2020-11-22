package com.xq.myxuanqi.ui.fragment;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.constraint.ConstraintLayout;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v7.app.AlertDialog;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.cloudibpm.core.organization.AbstractPosition;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.Staff;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.CommonActivity;
import com.xq.myxuanqi.ui.activity.HomeActivity;
import com.xq.myxuanqi.ui.activity.me.QrActivity;
import com.xq.myxuanqi.ui.activity.me.SettingPortraitActivity;
import com.xq.myxuanqi.ui.activity.me.setting.SettingActivity;
import com.xq.myxuanqi.util.EmptyUtils;
import com.xq.myxuanqi.util.SerializableUtil;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;
import com.xq.myxuanqi.viewModel.HomeViewModel;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import de.hdodenhof.circleimageview.CircleImageView;

import static com.xq.myxuanqi.ui.activity.HomeActivity.updateRedPoint1;

/**
 * Created by xq0002 on 2018/11/5.
 * 我的页面
 */

public class MeFragment extends BaseFragment {
    private static final String TAG = "MeFragment";
    @BindView(R.id.iv_setting)
    ImageView mIvSetting;
    @BindView(R.id.tv_setting)
    TextView mTvSetting;
    @BindView(R.id.tv_name)
    TextView mTvName;
    @BindView(R.id.iv_code)
    ImageView mIvCode;
    @BindView(R.id.cv)
    CircleImageView mCv;
    @BindView(R.id.cl1)
    ConstraintLayout mCl1;
    @BindView(R.id.cl2)
    ConstraintLayout mCl2;
    @BindView(R.id.iv)
    ImageView mIv;
    @BindView(R.id.cl_schedule)
    ConstraintLayout mClSchedule;
    @BindView(R.id.iv1)
    ImageView mIv1;
    @BindView(R.id.cl_refresh)
    ConstraintLayout mClRefresh;
    @BindView(R.id.cl)
    ConstraintLayout mCl;
    //切换刷新
    protected boolean isCreated = false;
    @BindView(R.id.cl_change_company)
    ConstraintLayout mClChangeCompany;
    @BindView(R.id.cl_change_position)
    ConstraintLayout mClChangePosition;
    @BindView(R.id.update_circle)
    TextView mUpdateCircle;
    Unbinder unbinder;
    @BindView(R.id.ib_attendance)
    ImageButton mIbAttendance;
    Unbinder unbinder1;
    private HomeViewModel mHomeViewModel;
    private Login mLogin;
    private int company_position = 0;//切换公司对应item
    private int position = 0;//切换职位对应item
    //本地广播
    private LocalBroadcastManager localBroadcastManager;
    private LocalReceiver localReceiver;
    private IntentFilter intentFilter;
    private boolean isTrue = true;
    private boolean isOff = true;

    @Override
    protected int getLayoutResId() {
        return R.layout.fragment_me;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        isCreated = true;
    }

    @Override
    public void init() {
        super.init();
        initData();
        initBroadcast();
        //            String url = UrlUtils.getUrl()+"file/usr/" + mLogin.getUser().getId()+"/portrait/"+ mLogin.getUser().getId()+".jpg";
            /*File file = new File(url);
            if (file.exists() && file.isFile()) {
                Uri uri = Uri.fromFile(file);
                mCv.setImageURI(uri);
            } else {
                mCv.setImageResource(R.mipmap.default_avatar);
            }*/

           /* RequestOptions options = new RequestOptions()
                    .placeholder(R.mipmap.default_avatar)
                    .error(R.mipmap.default_avatar)
                    .diskCacheStrategy(DiskCacheStrategy.NONE);
            Glide.with(this).load(url).apply(options).into(mCv);*/

        //        mHomeViewModel = ViewModelProviders.of(getActivity()).get(HomeViewModel.class);

    }

    private void initData() {
        View decor = getActivity().getWindow().getDecorView();
        decor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        mLogin = SpUtil.getInstance().getLogin();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        } else {
            mCl1.setPadding(0, 60, 0, 5);
        }
        if (mLogin != null) {
            if (EmptyUtils.isNotEmpty(mLogin.getUser().getFullName().trim())) {
                mTvName.setText(mLogin.getUser().getFullName());
            } else {
                mTvName.setText(mLogin.getUser().getUsedName());
            }

        }
        mCv.setDrawingCacheEnabled(false);
        String url = getActivity().getCacheDir() + "/Pictures/" + mLogin.getUser().getId() + ".png";
        File file = new File(url);
        if (file.exists() && file.isFile()) {
            Bitmap bitmap = BitmapFactory.decodeFile(url);
            mCv.setImageBitmap(bitmap);
        } else {
            mCv.setImageResource(R.mipmap.default_avatar);
        }
        mClRefresh.setVisibility(View.GONE);
        if (HomeActivity.num != 0) {
            mUpdateCircle.setVisibility(View.VISIBLE);
        } else {
            mUpdateCircle.setVisibility(View.GONE);
        }
        isOff = SpUtil.getInstance().getBoolean(mLogin.getUser().getId());
        if (isOff) {    //关闭自动考勤的状态
            mIbAttendance.setImageDrawable(getResources().getDrawable(R.mipmap.off));
        } else {
            mIbAttendance.setImageDrawable(getResources().getDrawable(R.mipmap.on));
        }
    }

    @OnClick({R.id.iv_setting, R.id.cl_schedule, R.id.cv, R.id.cl_refresh, R.id.iv_code, R.id.cl_change_company,
            R.id.cl_change_position, R.id.cl_end_schedule, R.id.ib_attendance})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.iv_setting:
                JumpTo(SettingActivity.class);
                isTrue = false;
                break;
            case R.id.cl_schedule://待办事项
                String url1 = UrlUtils.getUrl();
                String url = url1 + "client/worklist4mb.jsp?sessionId=" + SpUtil.getInstance().getStr("sessionId");
                String type = "待办";
                ResultJumpTo(CommonActivity.class, url, type);
                mUpdateCircle.setVisibility(View.GONE);
                HomeActivity.num = 0;
                updateRedPoint1();
                isTrue = false;
                break;
            case R.id.cl_end_schedule:

                break;
            case R.id.cv:
                JumpTo(SettingPortraitActivity.class);
                isTrue = false;
                break;
            case R.id.cl_refresh://更新布局
                //                mHomeViewModel.getViewLayout();
                break;
            case R.id.iv_code:
                JumpTo(QrActivity.class);
                isTrue = false;
                break;
            case R.id.cl_change_company:    //切换公司
                Staff[] staffships = mLogin.getStaffships();
                List<Staff> staffList = new ArrayList<>();
                String[] items = new String[staffships.length];
                for (int i = 0; i < staffships.length; i++) {
                    staffList.add(staffships[i]);
                    items[i] = staffList.get(i).getOrganizationName();
                }
                AlertDialog.Builder alertDialog = new AlertDialog.Builder(getActivity());
                alertDialog.setTitle("请选择当前所在公司");
                alertDialog.setSingleChoiceItems(items, company_position, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        company_position = which;
                    }
                });
                alertDialog.setPositiveButton("确定", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Toast.makeText(getActivity(), "选择了" + items[company_position], Toast.LENGTH_SHORT).show();
                        try {
                            SpUtil.getInstance().saveStr("staff", SerializableUtil.obj2Str(staffships[company_position]));
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                });
                alertDialog.show();
                isTrue = false;
                break;
            case R.id.cl_change_position:   //切换职位
                Staff staff = null;
                try {
                    staff = (Staff) SerializableUtil.str2Obj(SpUtil.getInstance().getStr("staff"));
                } catch (IOException e) {
                    e.printStackTrace();
                }
                String owner = staff.getOwner();    //单位Id
                List<AbstractPosition> abstractPositionList = new ArrayList<>();
                AbstractPosition[] abstractPositions = mLogin.getPositions();
                if (EmptyUtils.isNotEmpty(abstractPositions)) {
                    for (int i = 0; i < abstractPositions.length; i++) {
                        if (abstractPositions[i].getOwner().equals(owner)) {
                            abstractPositionList.add(abstractPositions[i]);
                        }
                    }
                    if (EmptyUtils.isNotEmpty(abstractPositionList)) {
                        String[] items1 = new String[abstractPositionList.size()];
                        for (int i = 0; i < abstractPositionList.size(); i++) {
                            items1[i] = abstractPositionList.get(i).getName();
                        }
                        AlertDialog.Builder alertDialog1 = new AlertDialog.Builder(getActivity());
                        alertDialog1.setTitle("请选择当前职位");
                        alertDialog1.setSingleChoiceItems(items1, position, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                position = which;
                            }
                        });
                        alertDialog1.setPositiveButton("确定", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                Toast.makeText(getActivity(), "选择了" + items1[position], Toast.LENGTH_SHORT).show();
                                try {
                                    SpUtil.getInstance().saveStr("position", SerializableUtil.obj2Str(abstractPositionList.get(position)));
                                } catch (IOException e) {
                                    e.printStackTrace();
                                }
                            }
                        });
                        alertDialog1.show();
                    } else {
                        Toast.makeText(getActivity(), "您在该公司没有职位！", Toast.LENGTH_SHORT).show();
                    }

                } else {
                    Toast.makeText(getActivity(), "您在该公司没有职位！", Toast.LENGTH_SHORT).show();
                }
                isTrue = false;
                break;
            case R.id.ib_attendance:
                if (isOff) {
                    mIbAttendance.setImageDrawable(getResources().getDrawable(R.mipmap.on));
                } else {
                    mIbAttendance.setImageDrawable(getResources().getDrawable(R.mipmap.off));
                }
                isOff = !isOff;
                Log.d(TAG, "onViewClicked: " + isOff);
                SpUtil.getInstance().saveBoolean(mLogin.getUser().getId(), isOff);
                Intent intent1 = new Intent("com.xq.myxuanqi.attendance");
                localBroadcastManager.sendBroadcast(intent1);
                break;
        }
    }

    private void initBroadcast() {
        //注册本地广播
        localBroadcastManager = LocalBroadcastManager.getInstance(getActivity());
        intentFilter = new IntentFilter();
        //注册广播——需要重连
        //        intentFilter.addAction("com.xq.myxuanqi.webSocketAbort");
        //注册广播———webSocket连接成功
        //        intentFilter.addAction("com.xq.myxuanqi.connectSuccess");
        //注册广播——获取到新消息
        intentFilter.addAction("com.xq.myxuanqi.bpmsvr");
        localReceiver = new LocalReceiver();
        localBroadcastManager.registerReceiver(localReceiver, intentFilter);
    }

    //自定义本地广播
    class LocalReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
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
                    case "com.xq.myxuanqi.bpmsvr":
                        //收到消息，更新列表
                        Log.d(TAG, "onReceive: 收到消息！");
                        //                        Toast.makeText(context, "收到消息！", Toast.LENGTH_SHORT).show();
                        //                        getInitData();
                        mUpdateCircle.setVisibility(View.VISIBLE);
                        break;
                }
            } else {
                Log.e(TAG, "onReceive: ChatActivity的广播接受器为空");
            }
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        if (isTrue == false) {
            isTrue = true;
            initData();
        }

        /*String url = getContext().getCacheDir() + "/Pictures/" + mLogin.getUser().getId() + ".jpg";
        //        String url = UrlUtils.getUrl()+"file/usr/" + mLogin.getUser().getId()+"/portrait/"+ mLogin.getUser().getId()+".jpg";
        RequestOptions options = new RequestOptions()
                .placeholder(R.mipmap.default_avatar)
                .error(R.mipmap.default_avatar)
                .diskCacheStrategy(DiskCacheStrategy.NONE);
        Glide.with(this).load(url).apply(options).into(mCv);*/
    }

    @Override
    public void setUserVisibleHint(boolean isVisibleToUser) {
        super.setUserVisibleHint(isVisibleToUser);
        if (!isCreated) {
            return;
        }
        //刷新画面
        if (isVisibleToUser) {
            initData();
        }
    }

}
