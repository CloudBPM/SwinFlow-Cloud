package com.xq.myxuanqi.ui.fragment;

import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.constraint.ConstraintLayout;
import android.support.constraint.ConstraintSet;
import android.support.v4.app.FragmentActivity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.GridView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.Staff;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.adapter.ShowAppAdapter;
import com.xq.myxuanqi.bean.ProcessServiceSearchResult;
import com.xq.myxuanqi.bean.ProcessServiceSearchResultPage;
import com.xq.myxuanqi.http.HttpHelper;
import com.xq.myxuanqi.http.ICallBack;
import com.xq.myxuanqi.ui.activity.CommonActivity;
import com.xq.myxuanqi.util.EmptyUtils;
import com.xq.myxuanqi.util.LongTimeToDate;
import com.xq.myxuanqi.util.SerializableUtil;
import com.xq.myxuanqi.util.SingleClick;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;

/**
 * Created by wm on 2019/3/9.
 */

public class StaticHomeFragment extends BaseFragment {
    //切换刷新
    protected boolean isCreated = false;
    @BindView(R.id.cl)
    ConstraintLayout mCl;
    @BindView(R.id.cl_p)
    ConstraintLayout mClP;
    @BindView(R.id.tv_org_name)
    TextView         mTvOrgName;
    @BindView(R.id.tv_org_address)
    TextView         mTvOrgAddress;
    @BindView(R.id.gv)
    GridView         mGv;
    /* @BindView(R.id.sv)
     ScrollView       mSv;*/
    private View           mDecor;
    private ShowAppAdapter mShowAppAdapter;
    private List<ProcessServiceSearchResult> mList = new ArrayList<>();
    private boolean isTrue = true;
    @Override
    protected int getLayoutResId() {
        return R.layout.fragment_static_home;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        isCreated = true;
    }

    @Override
    public void init() {
        super.init();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        } else {
            ConstraintSet constraintSet = new ConstraintSet();
            constraintSet.clone(mClP);
            constraintSet.connect(mCl.getId(), ConstraintSet.TOP, mClP.getId(), ConstraintSet.TOP, 100);
            constraintSet.applyTo(mClP);
        }
        mDecor = getActivity().getWindow().getDecorView();
        mDecor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        Staff staff = null;
        try {
            staff = (Staff) SerializableUtil.str2Obj(SpUtil.getInstance().getStr("staff"));
        } catch (IOException e) {
            e.printStackTrace();
        }
        String organizationName = "";
        String officeLocation = "";
        if (EmptyUtils.isNotEmpty(staff)) {
            if (EmptyUtils.isNotEmpty(staff.getOrganizationName())) {
                organizationName = staff.getOrganizationName();
            }
            if (EmptyUtils.isNotEmpty(staff.getOfficeLocation())) {
                officeLocation = staff.getOfficeLocation();
            }
        } else {
            organizationName = "欢迎您，" + SpUtil.getInstance().getLogin().getUser().getUsedName();
        }
        mTvOrgName.setText(organizationName);
        mTvOrgAddress.setText("联系地址：" + officeLocation.replaceAll("null", ""));
        mShowAppAdapter = new ShowAppAdapter(getContext(),mList);
        mGv.setAdapter(mShowAppAdapter);
        mGv.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                ProcessServiceSearchResult searchResult = mList.get(position);
                String url = UrlUtils.getUrl() + "client/launch.jsp?pid=" + searchResult.getId() + "&sessionId=" + SpUtil.getInstance().getStr("sessionId");
                String type = "任务";
                ResultJumpTo(CommonActivity.class, url,type);
                isTrue = false;
            }
        });
        //获取应用坊的应用列表
        Login login = SpUtil.getInstance().getLogin();
        String orgs = "";
        Staff[] staffships = login.getStaffships();
        if (staffships != null) {
            for (int i = 0; i < staffships.length; i++) {
                if (staffships[i].getOwner() != null && !staffships[i].getOwner().equals("")) {
                    if (orgs.equals("")) {
                        orgs = staffships[i].getOwner();
                    } else {
                        orgs = orgs + "#" + staffships[i].getOwner();
                    }
                }
            }
        }
        String uid = login.getUser().getId();
        getApp(orgs,uid);
    }

    private void getApp(String orgs,String uid) {
        String apiUrl = UrlUtils.getApiUrl();
        String url = apiUrl + "api/service1/api28";
        Map<String, Object> map = new HashMap<>();
        map.put("orgs", orgs);
        map.put("cond", "");
        map.put("uid", uid);
        map.put("pageno", 0);
        map.put("pagesize", 30);
        HttpHelper.getInstance().get(url, UrlUtils.getUserAgent(getContext()), map, new ICallBack() {
            @Override
            public void onSuccess(String string) {
                mList.clear();
                Gson gson = new GsonBuilder()
                        .registerTypeAdapter(Date.class, new LongTimeToDate())  //解析Date型时间
                        .create();
                ProcessServiceSearchResultPage processServiceSearchResultPage = gson.fromJson(string, ProcessServiceSearchResultPage.class);
                ProcessServiceSearchResult[] pageEntities = processServiceSearchResultPage.getPageEntities();
                if (EmptyUtils.isNotEmpty(pageEntities)) {
                    int allEntitiesCount = new Long(processServiceSearchResultPage.getAllEntitiesCount()).intValue();
                    for (int i=0;i<allEntitiesCount;i++){
                        ProcessServiceSearchResult searchResult = pageEntities[i];
                        mList.add(searchResult);
                    }
                    mShowAppAdapter.notifyDataSetChanged();
               /*     ConstraintSet constraintSet = new ConstraintSet();
                    ConstraintLayout constraintLayout = new ConstraintLayout(getContext());
                    mSv.removeAllViews();
                    mSv.addView(constraintLayout);
                    constraintLayout.setId(View.generateViewId());
                    ScrollView.LayoutParams layoutParams = new ScrollView.LayoutParams(ScrollView.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                    constraintLayout.setLayoutParams(layoutParams);
                    int id = constraintLayout.getId();
                    List<Integer> idList = new ArrayList<>();
                    int num = 0;
                    if (allEntitiesCount % 5 == 0) {
                        num = allEntitiesCount / 5;
                    } else {
                        num = allEntitiesCount / 5 + 1;
                    }
                    for (int i = 0; i < num; i++) {    //  行数
                        LinearLayout linearLayout = new LinearLayout(getContext());
                        linearLayout.setId(View.generateViewId());
                        int linearLayoutId = linearLayout.getId();
                        idList.add(linearLayoutId);
                        linearLayout.setGravity(LinearLayout.HORIZONTAL);
                        constraintLayout.addView(linearLayout);
                        ConstraintLayout.LayoutParams constraLayoutParams = new ConstraintLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                        linearLayout.setLayoutParams(constraLayoutParams);
                        if ((i + 1) == num) {    //最后一行
                            for (int j = i * 5; j < allEntitiesCount; j++) {
                                getRow(pageEntities, linearLayout, j);
                            }
                        } else { //前几行
                            for (int j = i * 5; j < i + 5; j++) {
                                //动态生成布局
                                getRow(pageEntities, linearLayout, j);
                            }
                        }

                        constraintSet.clone(constraintLayout);
                        if (linearLayoutId == idList.get(0)) {
                            constraintSet.connect(linearLayoutId, ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 20 + mStateBar);
                        } else {
                            constraintSet.connect(linearLayoutId, ConstraintSet.TOP, idList.get(idList.size() - 2), ConstraintSet.BOTTOM, 5);
                        }
                        constraintSet.applyTo(constraintLayout);
                    }*/
                }
            }

            @Override
            public void onFailed(String string) {

            }
        });
    }

    /*
    * 每一行的按钮排列
    * */
    private void getRow(ProcessServiceSearchResult[] pageEntities, LinearLayout linearLayout, int j) {
        //动态生成布局
        ConstraintLayout constraintLayout1 = new ConstraintLayout(getContext());
        ProcessServiceSearchResult entity = pageEntities[j];
        getImagButton(linearLayout, getContext(), getActivity(), constraintLayout1, j, entity);
        constraintLayout1.setOnClickListener(new View.OnClickListener() {
            @SingleClick(2000)
            @Override
            public void onClick(View v) {
                String url = UrlUtils.getUrl() + "client/launch.jsp?pid=" + entity.getProcUrl() + "&sessionId=" + SpUtil.getInstance().getStr("sessionId");
                String type = "任务";
                ResultJumpTo(CommonActivity.class, url,type);
            }
        });
    }

    private void getImagButton(LinearLayout linearLayout, Context context, FragmentActivity activity, ConstraintLayout constraintLayout1, int j, ProcessServiceSearchResult pageEntities) {

        //生成图片
        final ImageView imageView = new ImageView(context);
        imageView.setId(R.id.imagView);
        imageView.setBackgroundResource(R.mipmap.text);
        int idImage = imageView.getId();
        //生成文字
        TextView textView = new TextView(context);
        textView.setText(pageEntities.getProcName() + "");
        textView.setTextColor(Color.parseColor("#ff000000"));
        //使用html实现下划线的样式
        //                    textView.setText(Html.fromHtml("<u>"+mbButton.getName()+"</u>"));
        textView.setTextSize(14);
        textView.setId(R.id.tv_text);
        int idText = textView.getId();
        constraintLayout1.addView(imageView);
        constraintLayout1.addView(textView);
        linearLayout.addView(constraintLayout1);
        ConstraintLayout.LayoutParams imageLayoutParams = new ConstraintLayout.LayoutParams(100, 100);
        imageView.setLayoutParams(imageLayoutParams);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
        constraintLayout1.setLayoutParams(layoutParams);
        ConstraintSet constraintSet = new ConstraintSet();
        constraintSet.clone(constraintLayout1);
        constraintSet.connect(idImage, ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 5);
        constraintSet.connect(idImage, ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        constraintSet.connect(idImage, ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        constraintSet.connect(idText, ConstraintSet.TOP, idImage, ConstraintSet.BOTTOM, 10);
        constraintSet.connect(idText, ConstraintSet.LEFT, idImage, ConstraintSet.LEFT);
        constraintSet.connect(idText, ConstraintSet.RIGHT, idImage, ConstraintSet.RIGHT);
        constraintSet.applyTo(constraintLayout1);
    }

    @Override
    public void setUserVisibleHint(boolean isVisibleToUser) {
        super.setUserVisibleHint(isVisibleToUser);
        if (!isCreated) {
            //            View decor = getActivity().getWindow().getDecorView();
            return;
        }
        //刷新画面
        if (isVisibleToUser) {
            init();
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        if (isTrue==false){
            isTrue = true;
            init();
            mDecor = getActivity().getWindow().getDecorView();
            mDecor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        }

    }

}
