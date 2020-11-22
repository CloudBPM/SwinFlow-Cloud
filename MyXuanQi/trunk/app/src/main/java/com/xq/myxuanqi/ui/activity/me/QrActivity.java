package com.xq.myxuanqi.ui.activity.me;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bumptech.glide.request.RequestOptions;
import com.cloudibpm.core.user.Login;
import com.google.zxing.WriterException;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.ui.view.imgeSelector.PortraitBean;
import com.xq.myxuanqi.util.EmptyUtils;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;
import com.xq.myxuanqi.zxing.encoding.EncodingHandler;

import java.io.File;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import de.hdodenhof.circleimageview.CircleImageView;

public class QrActivity extends BaseActivity {

    @BindView(R.id.tb)
    Toolbar         mTb;
    @BindView(R.id.tv_user)
    TextView        mTvUser;
    @BindView(R.id.iv_code)
    ImageView       mIvCode;
    @BindView(R.id.iv_head)
    CircleImageView mIvHead;

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_qr;
    }

    @Override
    public void init() {
        super.init();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        } else {
            mTb.setPadding(0, 5, 0, 5);
        }
        Login login = SpUtil.getInstance().getLogin();
        String fullName = login.getUser().getFullName();
        String id = login.getUser().getId();
        mTvUser.setText(fullName);
        mIvHead.setDrawingCacheEnabled(false);
            String url = this.getCacheDir()+"/Pictures/"+ id+".png";
        File file = new File(url);
        if (file.exists() && file.isFile()) {
            Bitmap bitmap = BitmapFactory.decodeFile(url);
            mIvHead.setImageBitmap(bitmap);
            Bitmap qrCode = EncodingHandler.createQRCode(id, 800, 800, bitmap);
            mIvCode.setImageBitmap(qrCode);
        }else {
            mIvHead.setImageResource(R.mipmap.default_avatar);
            try {
                Bitmap qrCode = EncodingHandler.createQRCode(id, 800);
                mIvCode.setImageBitmap(qrCode);
            } catch (WriterException e) {
                e.printStackTrace();
            }
        }
    }

    @OnClick(R.id.tb_back)
    public void onViewClicked() {
        finish();
    }

}
