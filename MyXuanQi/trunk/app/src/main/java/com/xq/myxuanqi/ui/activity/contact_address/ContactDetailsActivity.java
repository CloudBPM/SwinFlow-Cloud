package com.xq.myxuanqi.ui.activity.contact_address;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.model.contact.ContactPerson;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.ui.activity.communication.ChatActivity;
import com.xq.myxuanqi.ui.activity.me.QrActivity;
import com.xq.myxuanqi.util.UrlUtils;
import com.xq.myxuanqi.util.photo.LoadPhoto;

import butterknife.BindView;
import butterknife.OnClick;
import de.hdodenhof.circleimageview.CircleImageView;

//查看联系人详细信息
public class ContactDetailsActivity extends BaseActivity {
    private static final String TAG = "ContactDetailsActivity";

    @BindView(R.id.iv_back)
    ImageView mIvBack;

    @BindView(R.id.civ_person_avatar)
    CircleImageView mCivPersonAvatar;
    @BindView(R.id.tv_person_name)
    TextView mTvPersonName;   //姓名
    @BindView(R.id.iv_qr_code)
    ImageView mIvQrCode;
    @BindView(R.id.tv_person_position)
    TextView mTvPersonPosition;  //职位
    @BindView(R.id.tv_person_department)
    TextView mTvPersonDepartment;  //部门
    @BindView(R.id.btn_send_message)
    Button mBtnSendMessage;

    private ContactPerson contactPerson;

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_contact_details;
    }

    @Override
    public void init() {
        super.init();

        //初始化得到的数据
        initDta();

    }

    private void initDta() {
        Intent intent = getIntent();
        contactPerson = (ContactPerson) intent.getSerializableExtra("contactPerson");

        mTvPersonName.setText(contactPerson.getFname());
        mTvPersonPosition.setText(contactPerson.getPosition());
        mTvPersonDepartment.setText(contactPerson.getDepartment());

        String userId = contactPerson.getUserId();

        String avatarUrl = UrlUtils.getUrl()+"file/usr/" + userId+"/portrait/"+ userId+".jpg";

        LoadPhoto.loadPhotoByUrl(this, avatarUrl, mCivPersonAvatar);
    }

    @OnClick({
            R.id.iv_back,
            R.id.iv_qr_code,
            R.id.btn_send_message
    })
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.iv_back:
                finish();
                break;
            case R.id.btn_send_message:
                Intent intent = new Intent(this, ChatActivity.class);
                intent.putExtra("from", "address");
                intent.putExtra("contactPerson", contactPerson);
                startActivity(intent);
                break;
            case R.id.iv_qr_code:
                Intent intent1 = new Intent(this, QrActivity.class);
                startActivity(intent1);
                break;
        }
    }
}
