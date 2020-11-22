package com.xq.myxuanqi.ui.activity.communication;

import android.content.Intent;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.Staff;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.adapter.ContactAddressAdapter;
import com.xq.myxuanqi.model.contact.ContactPerson;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.ui.activity.contact_address.ContactDetailsActivity;
import com.xq.myxuanqi.util.SerializableUtil;
import com.xq.myxuanqi.util.SpUtil;

import org.litepal.LitePal;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.OnClick;

public class AddressActivity extends BaseActivity {

    @BindView(R.id.iv_back)
    ImageView mIvBack;
    @BindView(R.id.tv_fragment_title_name)
    TextView mTvFragmentTitle;
    @BindView(R.id.btn_search)
    Button mBtnSearch;
    @BindView(R.id.btn_add)
    Button mBtnAdd;
    @BindView(R.id.rv_contact_list)
    RecyclerView mRvContactList;

    private ContactAddressAdapter contactAddressAdapter;
    private List<ContactPerson> mList = new ArrayList<>();

    private Login login;
    private String companyId;
    private String sessionId;
    private String myUserId;

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_address;
    }

    @Override
    public void init() {
        super.init();

        login = SpUtil.getInstance().getLogin();
        try {
            Staff staff = (Staff) SerializableUtil.str2Obj(SpUtil.getInstance().getStr("staff"));
            companyId = staff.getOwner();
        } catch (IOException e) {
            e.printStackTrace();
        }
        sessionId = SpUtil.getInstance().getStr("sessionId");
        myUserId = login.getUser().getId();

        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this);
        mRvContactList.setLayoutManager(linearLayoutManager);
        contactAddressAdapter = new ContactAddressAdapter(this, mList);
        mRvContactList.setAdapter(contactAddressAdapter);

        //点击列表项
        showPeopleInfo();

        //从数据库获取联系人列表
        loadPeopleFromDataBase();



    }

    @OnClick({
            R.id.iv_back,
            R.id.btn_search,
            R.id.btn_add
    })
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.iv_back:
                finish();
                break;
            case R.id.btn_search:
                //查询联系人和其他
                Toast.makeText(this, "搜索!", Toast.LENGTH_SHORT).show();
                break;
            case R.id.btn_add:
                //跳转到添加界面
                Toast.makeText(this, "添加联系人", Toast.LENGTH_SHORT).show();
                break;
        }
    }

    private void showPeopleInfo() {
        contactAddressAdapter.setOnItemClickListener(new ContactAddressAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(ContactPerson contactPerson) {
                //查看联系人详情
//                Toast.makeText(AddressActivity.this, "查看联系人详细信息。", Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(AddressActivity.this, ContactDetailsActivity.class);
                intent.putExtra("contactPerson", contactPerson);
                startActivity(intent);
            }
        });
    }

    private void loadPeopleFromDataBase() {
        List<ContactPerson> contactPersonList = LitePal.findAll(ContactPerson.class);
        mList.addAll(contactPersonList);
        contactAddressAdapter.notifyDataSetChanged();
    }
}
