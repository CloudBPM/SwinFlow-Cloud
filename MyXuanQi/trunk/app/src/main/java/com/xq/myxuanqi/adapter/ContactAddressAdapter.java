package com.xq.myxuanqi.adapter;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.model.contact.ContactPerson;
import com.xq.myxuanqi.util.UrlUtils;

import java.util.List;

//联系人的adapter
public class ContactAddressAdapter extends RecyclerView.Adapter<ContactAddressAdapter.ViewHolder>{

    private static final String TAG = "ContactAddressAdapter";

    private List<ContactPerson> mList;
    private Context context;

    private OnItemClickListener mOnItemClickListener;

    public ContactAddressAdapter(Context context, List<ContactPerson> list) {
        this.context = context;
        mList = list;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.conteact_person_item, viewGroup, false);
        final ViewHolder viewHolder = new ViewHolder(view);
        //查看详情
        viewHolder.item.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int position = viewHolder.getAdapterPosition();
                ContactPerson contactPerson = mList.get(position);
                mOnItemClickListener.onItemClick(contactPerson);
            }
        });

        return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder viewHolder, int i) {
        ContactPerson contactPerson = mList.get(i);
        String userId = contactPerson.getUserId();
        //设置头像
        RequestOptions options = new RequestOptions()
                .placeholder(R.mipmap.default_avatar)
                .fallback(R.mipmap.default_avatar)
                .error(R.mipmap.default_avatar);
        if (userId != null && !userId.equals("")) {
            String avatarUrl = UrlUtils.getUrl()+"file/usr/" + userId + "/portrait/" + userId+".jpg";
            Log.d(TAG, "onBindViewHolder: " + avatarUrl);
            Glide.with(context)
                    .load(avatarUrl)
                    .apply(options)
                    .into(viewHolder.mIvContactAvatar);
        }
        String nickName = contactPerson.getFname();
        viewHolder.mTvContactName.setText(nickName);

        viewHolder.mTvContactPosition.setText(contactPerson.getPosition());

        viewHolder.mTvContactCompanyName.setText(contactPerson.getCompanyName());
//        if (i == mList.size() - 1) {
//            viewHolder.mViewAddressDividingLine.setVisibility(View.GONE);
//        }
    }

    @Override
    public int getItemCount() {
        return mList.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        View item;
        //tv_hcm_information_name
        ImageView mIvContactAvatar;
        TextView mTvContactName;
        TextView mTvContactPosition;
        TextView mTvContactCompanyName;
        View mViewAddressDividingLine;

        public ViewHolder(View itemView) {
            super(itemView);
            item = itemView;
            mIvContactAvatar = (ImageView) itemView.findViewById(R.id.iv_contact_avatar);
            mTvContactName = (TextView) itemView.findViewById(R.id.tv_contact_name);
            mTvContactPosition = (TextView) itemView.findViewById(R.id.tv_contact_position);
            mTvContactCompanyName = (TextView) itemView.findViewById(R.id.tv_contact_company_name);
            mViewAddressDividingLine = (View) itemView.findViewById(R.id.view_address_dividing_line);
        }
    }

    public interface OnItemClickListener {
        void onItemClick(ContactPerson contactPerson);
    }
    public void setOnItemClickListener(OnItemClickListener onItemClickListener ){
        this. mOnItemClickListener=onItemClickListener;
    }
}
