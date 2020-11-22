package com.xq.myxuanqi.adapter;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.support.annotation.NonNull;
import android.support.constraint.ConstraintLayout;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.model.contact.ContactMessage;
import com.xq.myxuanqi.util.BitmapOperating;
import com.xq.myxuanqi.util.TimeChange;
import com.xq.myxuanqi.util.UrlUtils;
import com.xq.myxuanqi.util.photo.LoadPhoto;

import java.util.List;

public class CommunicationDetailAdapter extends RecyclerView.Adapter<CommunicationDetailAdapter.ViewHolder>{
    private static final String TAG = "CommunicationDetailAdap";
    private List<ContactMessage> mList;
    private Context context;
    private String myUserId;

    private boolean isScrolling = false;

    private OnItemClickListener mOnItemClickListener;

    public CommunicationDetailAdapter(Context context, List<ContactMessage> list, String myUserId) {
        this.context = context;
        mList = list;
        this.myUserId = myUserId;
    }
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.communication_detail_item, viewGroup, false);
        final ViewHolder viewHolder = new ViewHolder(view);
        //查看详情
//        viewHolder.item.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                int position = viewHolder.getAdapterPosition();
//                ContactMessage contactMessage = mList.get(position);
//                mOnItemClickListener.onItemClick(contactMessage);
//            }
//        });
        viewHolder.mLlLeftVoice.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int position = viewHolder.getAdapterPosition();
                ContactMessage contactMessage = mList.get(position);
                mOnItemClickListener.onPlayAudio(contactMessage, viewHolder.mIvLeftRecordIcon);
            }
        });
        viewHolder.mLlRightVoice.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int position = viewHolder.getAdapterPosition();
                ContactMessage contactMessage = mList.get(position);
                Log.d(TAG, "onClick: 123:1111");
                mOnItemClickListener.onPlayAudio(contactMessage, viewHolder.mIvRightRecordIcon);
            }
        });
        viewHolder.mIvLeftVideoPlay.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int position = viewHolder.getAdapterPosition();
                ContactMessage contactMessage = mList.get(position);
                Log.d(TAG, "onClick: 123:222");
                mOnItemClickListener.onVideoClick(contactMessage);
            }
        });
        viewHolder.mIvRightVideoPlay.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int position = viewHolder.getAdapterPosition();
                ContactMessage contactMessage = mList.get(position);
                Log.d(TAG, "onClick: 123:333");
                mOnItemClickListener.onVideoClick(contactMessage);
            }
        });

        //点击图片放大查看
        viewHolder.mIvLeftImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int position = viewHolder.getAdapterPosition();
                ContactMessage contactMessage = mList.get(position);
                Log.d(TAG, "onClick: 123:444");
                mOnItemClickListener.onImageClick(contactMessage);
            }
        });
        viewHolder.mIvRightImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int position = viewHolder.getAdapterPosition();
                ContactMessage contactMessage = mList.get(position);
                Log.d(TAG, "onClick: 123:1111");
                mOnItemClickListener.onImageClick(contactMessage);
            }
        });

        return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder viewHolder, int i) {
        ContactMessage contactMessage = mList.get(i);
        long sendTime = contactMessage.getSendTime();
        String stringTime = TimeChange.longToStringDate(sendTime, TimeChange.TIME);
        viewHolder.mTvSendTime.setText(stringTime);
        String leftAvatar;
        String rightAvatar;
        String messageType = contactMessage.getMessageType();
        if (messageType == null) {
            messageType = "1";
        }
        if (!contactMessage.getSenderId().equals(myUserId)) {
            //为了获取对方的头像
            //左边
            viewHolder.mClRight.setVisibility(View.GONE);
            viewHolder.mClLeft.setVisibility(View.VISIBLE);
            leftAvatar = contactMessage.getSenderAvatarUrl();
            rightAvatar = contactMessage.getReceiverAvatarUrl();
            buildMessage(messageType, contactMessage.getMessage(), viewHolder.mTvLeftContext, viewHolder.mLlLeftVoice, viewHolder.mTvLeftVoiceTime, viewHolder.mClLeftImage, viewHolder.mIvLeftImage, viewHolder.mIvLeftVideoPlay);

        } else {
            //右边
            viewHolder.mClLeft.setVisibility(View.GONE);
            viewHolder.mClRight.setVisibility(View.VISIBLE);
            leftAvatar = contactMessage.getReceiverAvatarUrl();
            rightAvatar = contactMessage.getSenderAvatarUrl();
            buildMessage(messageType, contactMessage.getMessage(), viewHolder.mTvRightContext, viewHolder.mLlRightVoice, viewHolder.mTvRightVoiceTime, viewHolder.mClRightImage, viewHolder.mIvRightImage, viewHolder.mIvRightVideoPlay);

        }
        //填充头像
        if (leftAvatar != null && !leftAvatar.equals("")) {
            //先不画头像
//            Glide.with(context)
//                    .load(leftAvatar)
//                    .into(viewHolder.mIvLeftAvatar);
        }
        if (rightAvatar != null && !rightAvatar.equals("")) {
//            Glide.with(context)
//                    .load(rightAvatar)
//                    .into(viewHolder.mIvRightAvatar);
        }
        //先不显示发送失败情况
        viewHolder.mIvLeftWarning.setVisibility(View.GONE);
        viewHolder.mIvRightWarning.setVisibility(View.GONE);
    }

    private void buildMessage(String messageType, String messageContext, TextView messageText, LinearLayout llAudio, TextView audioTime, ConstraintLayout constraintLayout, ImageView imageView, ImageView playImage) {
        switch (messageType) {
            case "0":
                //图片
                if (!isScrolling) {
                    Glide.with(context).resumeRequests();
                } else {
                    Glide.with(context).pauseRequests();
                }
                String imageUrl = UrlUtils.getFileUrl() + messageContext.substring(13);  //图片地址
                Log.d(TAG, "buildMessage: " + imageUrl);
                LoadPhoto.loadPhotoByUrl(context, imageUrl, imageView);

//                Glide.with(context)
//                        .load(imageUrl)
//                        .diskCacheStrategy(DiskCacheStrategy.ALL)
//                        .into(imageView);
                messageText.setVisibility(View.GONE);
                llAudio.setVisibility(View.GONE);
                playImage.setVisibility(View.GONE);

                break;
            case "1":
                //文本
                messageText.setText(messageContext);
                llAudio.setVisibility(View.GONE);
                constraintLayout.setVisibility(View.GONE);
                Log.d(TAG, "buildMessage: 123123");
                break;
            case "2":
                //语音
                messageText.setVisibility(View.GONE);
                constraintLayout.setVisibility(View.GONE);
                String[] msg = messageContext.split("#");
                audioTime.setText(msg[0]);
                break;
            case "3":
                //视频
                messageText.setVisibility(View.GONE);
                llAudio.setVisibility(View.GONE);
                //获取视频封面
                LoadPhoto.loadPhotoByUrl(context, UrlUtils.getFileUrl() + messageContext.substring(13), imageView);
//                Glide.with(context)
//                        .load(UrlUtils.getFileUrl() + messageContext.substring(13))
//                        .into(imageView);
                Log.d(TAG, "onItemClick: time6：" + System.currentTimeMillis());

                break;
            case "4":
                //文件
                int suffixPosition = messageContext.lastIndexOf(".");
                //解决万一没有后缀的问题
                if (suffixPosition > 0) {
                    String fileSuffix = messageContext.substring(suffixPosition + 1);
                    Log.d(TAG, "buildMessage: suffix:" + fileSuffix);
                    if (fileSuffix.equals("gif") || fileSuffix.equals("jpg") || fileSuffix.equals("png") || fileSuffix.equals("jpeg")) {
                        //如果是图片的话
                        imageUrl = UrlUtils.getFileUrl() + messageContext.substring(13);  //图片地址
                        Log.d(TAG, "buildMessage: " + imageUrl);
                        LoadPhoto.loadPhotoByUrl(context, imageUrl, imageView);
//                        Glide.with(context)
//                                .load(imageUrl)
//                                .diskCacheStrategy(DiskCacheStrategy.ALL)
//                                .into(imageView);

                    } else {
                        Glide.with(context)
                                .load(R.drawable.file_icon)
                                .diskCacheStrategy(DiskCacheStrategy.ALL)
                                .into(imageView);

                    }
                    messageText.setVisibility(View.GONE);
                    llAudio.setVisibility(View.GONE);
                    playImage.setVisibility(View.GONE);

                }
                break;
        }
    }

    public void setScrolling(boolean scrolling) {
        isScrolling = scrolling;
    }

    @Override
    public int getItemCount() {
        return mList.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        View item;
        //发送时间
        ConstraintLayout mClTime;
        TextView mTvSendTime;
        //对方发送
        ConstraintLayout mClLeft;
        ImageView mIvLeftAvatar;
        TextView mTvLeftContext;
        ImageView mIvLeftWarning;
        //左边语音
        LinearLayout mLlLeftVoice;
        ImageView mIvLeftRecordIcon;
        TextView mTvLeftVoiceTime;
        //左边图片
        ConstraintLayout mClLeftImage;
        ImageView mIvLeftImage;
        ImageView mIvLeftVideoPlay;
        //我方发送
        ConstraintLayout mClRight;
        ImageView mIvRightAvatar;
        TextView mTvRightContext;
        ImageView mIvRightWarning;
        //右边语音
        LinearLayout mLlRightVoice;
        ImageView mIvRightRecordIcon;
        TextView mTvRightVoiceTime;
        //右边图片
        ConstraintLayout mClRightImage;
        ImageView mIvRightImage;
        ImageView mIvRightVideoPlay;

        public ViewHolder(View itemView) {
            super(itemView);
            item = itemView;

            //上面时间
            mClTime = (ConstraintLayout) itemView.findViewById(R.id.cl_time);
            mTvSendTime = (TextView) itemView.findViewById(R.id.tv_send_time);

            //左边
            mClLeft = (ConstraintLayout) itemView.findViewById(R.id.cl_left);
            mIvLeftAvatar = (ImageView) itemView.findViewById(R.id.iv_left_avatar);
            mTvLeftContext = (TextView) itemView.findViewById(R.id.tv_left_context);
            mIvLeftWarning = (ImageView) itemView.findViewById(R.id.iv_left_warning);
            //左边语音
            mLlLeftVoice = (LinearLayout) itemView.findViewById(R.id.ll_left_voice);
            mIvLeftRecordIcon = (ImageView) itemView.findViewById(R.id.iv_left_record_icon);
            mTvLeftVoiceTime = (TextView) itemView.findViewById(R.id.tv_left_voice_time);
            //左边图片
            mClLeftImage = (ConstraintLayout) itemView.findViewById(R.id.cl_left_image);
            mIvLeftImage = (ImageView) itemView.findViewById(R.id.iv_left_image);
            mIvLeftVideoPlay = (ImageView) itemView.findViewById(R.id.iv_left_video_play);

            //右边
            mClRight = (ConstraintLayout) itemView.findViewById(R.id.cl_right);
            mIvRightAvatar = (ImageView) itemView.findViewById(R.id.iv_right_avatar);
            mTvRightContext = (TextView) itemView.findViewById(R.id.tv_right_context);
            mIvRightWarning = (ImageView) itemView.findViewById(R.id.iv_right_warning);
            //右边语音
            mLlRightVoice = (LinearLayout) itemView.findViewById(R.id.ll_right_voice);
            mIvRightRecordIcon = (ImageView) itemView.findViewById(R.id.iv_right_record_icon);
            mTvRightVoiceTime = (TextView) itemView.findViewById(R.id.tv_right_voice_time);
            //右边图片
            mClRightImage = (ConstraintLayout) itemView.findViewById(R.id.cl_right_image);
            mIvRightImage = (ImageView) itemView.findViewById(R.id.iv_right_image);
            mIvRightVideoPlay = (ImageView) itemView.findViewById(R.id.iv_right_video_play);
        }
    }

    public interface OnItemClickListener {
        void onItemClick(ContactMessage contactMessage);
        void onPlayAudio(ContactMessage contactMessage, ImageView imageView);
        void onImageClick(ContactMessage contactMessage);
        void onVideoClick(ContactMessage contactMessage);
    }
    public void setOnItemClickListener(OnItemClickListener onItemClickListener ){
        this. mOnItemClickListener = onItemClickListener;
    }
}
