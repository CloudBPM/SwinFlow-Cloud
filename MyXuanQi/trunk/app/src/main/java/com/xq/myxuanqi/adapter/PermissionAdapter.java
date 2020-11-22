package com.xq.myxuanqi.adapter;

import android.app.Activity;
import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.support.v4.app.FragmentActivity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bumptech.glide.request.RequestOptions;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.me.setting.PermissionActivity;
import com.xq.myxuanqi.ui.view.imgeSelector.Image;
import com.xq.myxuanqi.viewModel.PermissionViewModel;

import java.io.File;
import java.util.List;

/**
 * Created by wm on 2019/3/15.
 */

public class PermissionAdapter extends BaseAdapter {
    private Context      mContext;
    private List<String> mList;
    private List<String> mPathList;
    private Activity mActivity;
    private final PermissionViewModel mPermissionViewModel;

    public PermissionAdapter(Context context, List<String> list, List<String> pathList, Activity activity) {
        this.mContext = context;
        this.mList = list;
        this.mPathList = pathList;
        this.mActivity = activity;
        mPermissionViewModel = ViewModelProviders.of((FragmentActivity) mActivity).get(PermissionViewModel.class);
    }

    @Override
    public int getCount() {
        int count = mList == null ? 1 : mList.size() + 1;
        if (count > 5) {
            return mList.size();
        } else {
            return count;
        }
    }

    @Override
    public Object getItem(int position) {
        return mList.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        convertView = LayoutInflater.from(mContext).inflate(R.layout.permission_image_item, parent, false);
        ImageView image = convertView.findViewById(R.id.iv);
        Button btnDel = convertView.findViewById(R.id.btn_del);
        if (position < mList.size()) {
            //显示上传的图片
            image.setVisibility(View.VISIBLE);
            File file = new File(mList.get(position));
            RequestOptions options = new RequestOptions()
                    .placeholder(R.mipmap.default_button_icon)
                    .error(R.mipmap.default_button_icon)
                    .diskCacheStrategy(DiskCacheStrategy.NONE);
            Glide.with(mContext).load(file).apply(options).into(image);
            btnDel.setVisibility(View.VISIBLE);
            btnDel.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    mPermissionViewModel.deleteImage(mPathList.get(position));
                }
            });
            mPermissionViewModel.setDelImageListener(new PermissionViewModel.DelImageListener() {
                @Override
                public void delImgeListenerOnCallBack(int i) {
                    if (i==0){
                        mList.remove(position);
                        mPathList.remove(position);
                        notifyDataSetChanged();
                    }else {
                    }
                }
            });
        } else {
            btnDel.setVisibility(View.GONE);
            if (mList.size()==4&&position==4){
                image.setVisibility(View.GONE);
            }else {
                image.setVisibility(View.VISIBLE);
                image.setImageResource(R.mipmap.add_image);
            }
        }
        return convertView;
    }
}
