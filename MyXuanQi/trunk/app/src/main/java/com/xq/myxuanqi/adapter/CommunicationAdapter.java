package com.xq.myxuanqi.adapter;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.model.contact.ContactMessage;
import com.xq.myxuanqi.ui.activity.HomeActivity;
import com.xq.myxuanqi.util.TimeChange;

import java.util.List;

public class CommunicationAdapter extends RecyclerView.Adapter<CommunicationAdapter.ViewHolder> {

    private static final String TAG = "CommunicationAdapter";

    private List<ContactMessage> mList;
    private Context context;
    private String myUserId;

    private OnItemClickListener mOnItemClickListener;

    public CommunicationAdapter(Context context, List<ContactMessage> list, String myUserId) {
        this.context = context;
        this.mList = list;
        this.myUserId = myUserId;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.communication_item, viewGroup, false);
        final ViewHolder viewHolder = new ViewHolder(view);



        Log.d(TAG, "onCreateViewHolder: 111111");
        //查看详情
        viewHolder.item.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(TAG, "onClick: 222222");
                int position = viewHolder.getAdapterPosition();
                ContactMessage contactMessage = mList.get(position);
                mOnItemClickListener.onItemClick(contactMessage);
                String userId = contactMessage.getReceiverId();
                if (userId.equals(myUserId)) {
                    updateRedPoint(viewHolder.mTvRedPoint, contactMessage.getSenderId());
                } else {
                    updateRedPoint(viewHolder.mTvRedPoint, userId);
                }
            }
        });

        return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder viewHolder, int i) {
        Log.d(TAG, "onBindViewHolder: 11111");
        ContactMessage contactMessage = mList.get(i);
//        String avatarUrl = contactMessage.getSenderAvatarUrl();
        //设置头像
        //这里这个头像加载还需修改,可以设置缓存
//        if (avatarUrl != null && !avatarUrl.equals("")) {
//            Glide.with(context)
//                    .load(avatarUrl)
//                    .into(viewHolder.mIvCommunicationAvatar);
//        }

        String id = contactMessage.getSenderId();
        String name;
        if (id.equals(myUserId)) {
            name = contactMessage.getReceiverName();
            updateRedPoint(viewHolder.mTvRedPoint, contactMessage.getReceiverId());
        } else {
            name = contactMessage.getSenderName();
            updateRedPoint(viewHolder.mTvRedPoint, id);
        }
        viewHolder.mTvSenderName.setText(name);

        long sendTime = contactMessage.getSendTime();
        String formatTime = TimeChange.longToStringDate(sendTime, TimeChange.DATE);
        viewHolder.mTvSendTime.setText(formatTime);
        String sendText = "";

        String messageType = contactMessage.getMessageType();
        if (messageType == null) {
            messageType = "1";
        }
        switch (messageType) {
            case "0":
                //图片
//                Toast.makeText(context, "暂不支持发图片！", Toast.LENGTH_SHORT).show();
                sendText = "[图片]";
                break;
            case "1":
                sendText = contactMessage.getMessage();
                break;
            case "2":
                sendText = "[语音]";
                break;
            case "3":
                sendText = "[视频]";
                break;
            case "4":
                sendText = "[文件]";
                break;
        }

        viewHolder.mTvSendText.setText(sendText);
        //取消响铃的图标是否显示
        viewHolder.mIvBellOff.setVisibility(View.GONE);

        //隐藏最后一行的分割线
//        if (i == mList.size() - 1) {
//            viewHolder.mViewDividingLine.setVisibility(View.GONE);
//        }
//        badge.setBadgeCount(contactMessage.getMessage().length());
    }

    @Override
    public int getItemCount() {
        return mList.size();
    }

    private void updateRedPoint(TextView textView, String userId) {
        Log.d(TAG, "updateRedPoint: userId:" + userId);
        int count = HomeActivity.unReadMessageCount.get(userId);
        Log.d(TAG, "updateRedPoint: count:" + count);
        if (count > 0) {
            textView.setVisibility(View.VISIBLE);
        } else {
            textView.setVisibility(View.GONE);
        }
        textView.setText("" + count);

    }

    class ViewHolder extends RecyclerView.ViewHolder {
        View item;
        ImageView mIvCommunicationAvatar;
        TextView mTvRedPoint;
        TextView mTvSenderName;
        TextView mTvSendTime;
        TextView mTvSendText;
        ImageView mIvBellOff;
        View mViewDividingLine;

        public ViewHolder(View itemView) {
            super(itemView);
            item = itemView;
            mIvCommunicationAvatar = (ImageView) itemView.findViewById(R.id.iv_communication_avatar);
            mTvRedPoint = (TextView) itemView.findViewById(R.id.tv_red_point);
            mTvSenderName = (TextView) itemView.findViewById(R.id.tv_sender_name);
            mTvSendTime = (TextView) itemView.findViewById(R.id.tv_send_time);
            mTvSendText = (TextView) itemView.findViewById(R.id.tv_send_text);
            mIvBellOff = (ImageView) itemView.findViewById(R.id.iv_bell_off);
            mViewDividingLine = (View) itemView.findViewById(R.id.view_dividing_line);
        }
    }

    public interface OnItemClickListener {
        void onItemClick(ContactMessage contactMessage);
    }
    public void setOnItemClickListener(OnItemClickListener onItemClickListener ){
        this. mOnItemClickListener=onItemClickListener;
    }
}
