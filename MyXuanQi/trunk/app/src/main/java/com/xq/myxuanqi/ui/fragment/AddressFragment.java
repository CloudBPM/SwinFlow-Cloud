package com.xq.myxuanqi.ui.fragment;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.support.v4.util.ArrayMap;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.Staff;
import com.cloudibpm.core.util.serviceresult.ServiceResult;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.adapter.ContactAddressAdapter;
import com.xq.myxuanqi.model.contact.ContactPerson;
import com.xq.myxuanqi.ui.activity.contact_address.ContactDetailsActivity;
import com.xq.myxuanqi.util.HttpUtils;
import com.xq.myxuanqi.util.SerializableUtil;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.ToastUtils;

import org.litepal.LitePal;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import butterknife.BindView;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

/**
 * Created by wm on 2019/1/11.
 * 通讯录，联系人界面
 */

/**
 *孙键 20190115
 * 并没有理解 MVVM 在搞什么东西，就一个下拉列表，放飞自我，以后看懂了再改
 */
@SuppressLint("ValidFragment")
public class AddressFragment extends BaseFragment implements View.OnClickListener {

    private static final String TAG = "AddressFragment";

    @BindView(R.id.tv_fragment_title_name)
    TextView mTvFragmentTitle;
    @BindView(R.id.btn_search)
    Button mBtnSearch;
    @BindView(R.id.btn_add)
    Button mBtnAdd;
    @BindView(R.id.rv_contact_list)
    RecyclerView mRvContactList;

    private Activity activity;
    private ContactAddressAdapter contactAddressAdapter;
    private List<ContactPerson> mList = new ArrayList<>();

    private Login login;
    private String companyId;
    private String sessionId;
    private String myUserId;

    @Override
    protected int getLayoutResId() {
        return R.layout.fragment_address;
    }

    @Override
    public void init() {
        super.init();

        activity = getActivity();
        login = SpUtil.getInstance().getLogin();
        try {
            Staff staff = (Staff) SerializableUtil.str2Obj(SpUtil.getInstance().getStr("staff"));
            companyId = staff.getOwner();
        } catch (IOException e) {
            e.printStackTrace();
        }

        sessionId = SpUtil.getInstance().getStr("sessionId");
        myUserId = login.getUser().getId();

        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(getActivity());
        mRvContactList.setLayoutManager(linearLayoutManager);
        contactAddressAdapter = new ContactAddressAdapter(getContext(), mList);
        mRvContactList.setAdapter(contactAddressAdapter);



        //获取联系人列表
        getInitData();

        mBtnSearch.setOnClickListener(this);
        mBtnAdd.setOnClickListener(this);

        contactAddressAdapter.setOnItemClickListener(new ContactAddressAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(ContactPerson contactPerson) {
                //查看联系人详情
                Toast.makeText(getActivity(), "查看联系人详细信息。", Toast.LENGTH_SHORT).show();
                //测试WebSocket开始
                Intent intent = new Intent(getActivity(), ContactDetailsActivity.class);
                intent.putExtra("contactPerson", contactPerson);
                startActivity(intent);
            }
        });

    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_search:
                //查询联系人和其他
                Toast.makeText(getActivity(), "搜索!", Toast.LENGTH_SHORT).show();
                break;
            case R.id.btn_add:
                //跳转到添加界面
                Toast.makeText(getActivity(), "添加联系人", Toast.LENGTH_SHORT).show();
                break;
        }
    }

    private void getInitData() {
        //获取联系人信息
        String url = "http://" + SpUtil.getInstance().getStr("ip") + "/om/OmServices";
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
                Log.d(TAG, "onFailure: ");
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
                    ServiceResult<List<Map<String, String>>> serviceResult = gson.fromJson(s, ServiceResult.class);
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
                        //绑定当前用户id
                        mList.add(contactPerson);
                    }
                    activity.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            contactAddressAdapter.notifyDataSetChanged();
                            //将联系人信息保存到数据库
                            LitePal.deleteAll(ContactPerson.class);
                            LitePal.saveAll(mList);

                        }
                    });
                } else {
                    ToastUtils.failToast(activity);
                }
            }
        });

    }
}
