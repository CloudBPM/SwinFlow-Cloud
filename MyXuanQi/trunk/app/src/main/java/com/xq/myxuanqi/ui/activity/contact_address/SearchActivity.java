package com.xq.myxuanqi.ui.activity.contact_address;

import android.view.View;
import android.widget.ImageView;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.BaseActivity;

import butterknife.BindView;
import butterknife.OnClick;

//联系人界面点击搜索按钮
public class SearchActivity extends BaseActivity {
    private static final String TAG = "SearchActivity";

    @BindView(R.id.iv_back)
    ImageView mIvBack;

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_search;
    }

    @Override
    public void init() {
        super.init();

    }

    @OnClick({
            R.id.iv_back
    })
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.iv_back:
                finish();
                break;
        }
    }
}
