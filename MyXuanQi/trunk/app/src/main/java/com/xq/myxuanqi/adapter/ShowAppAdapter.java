package com.xq.myxuanqi.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.bean.ProcessServiceSearchResult;

import java.util.List;

/**
 * Created by wm on 2019/3/26.
 */

public class ShowAppAdapter extends BaseAdapter {
    private Context mContext;
    private List<ProcessServiceSearchResult> mList;
    public ShowAppAdapter(Context context, List<ProcessServiceSearchResult> list) {
        this.mContext = context;
        this.mList = list;
    }

    @Override
    public int getCount() {
        return mList.size();
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
        convertView = LayoutInflater.from(mContext).inflate(R.layout.show_app_gv_item, parent, false);
        ImageView image = convertView.findViewById(R.id.iv);
        TextView textView = convertView.findViewById(R.id.tv_name);
        image.setImageResource(R.mipmap.text);
        String procName = mList.get(position).getProcName()+"";
        textView.setText(procName);
        return convertView;
    }
}
