package com.xq.myxuanqi.adapter.video;

import android.content.Context;
import android.support.annotation.NonNull;
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
import com.xq.myxuanqi.model.video.VideoInformation;
import com.xq.myxuanqi.util.UrlAndUtf8;
import com.xq.myxuanqi.util.UrlUtils;

import java.util.List;

public class VideoAdapter extends RecyclerView.Adapter<VideoAdapter.ViewHolder>{

    private static final String TAG = "VideoAdapter";

    private List<VideoInformation> mList;
    private Context context;
    private OnItemClickListener mOnItemClickListener;

    public VideoAdapter(Context context, List<VideoInformation> list) {
        this.context = context;
        this.mList = list;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.video_item, viewGroup, false);
        final ViewHolder viewHolder = new ViewHolder(view);
        viewHolder.item.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(TAG, "onClick: 222222");
                int position = viewHolder.getAdapterPosition();
                VideoInformation videoInformation = mList.get(position);
                mOnItemClickListener.onItemClick(videoInformation);
            }
        });


        return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder viewHolder, int i) {
        VideoInformation videoInformation = mList.get(i);
        //视频封面图片
        String imagePath = videoInformation.getImagePath();
        if (imagePath != null && !imagePath.equals("")) {
            Log.d(TAG, "onBindViewHolder: " + imagePath);
            imagePath = UrlUtils.getUrl()+"file" + imagePath.substring(0, imagePath.lastIndexOf("/") + 1) + UrlAndUtf8.getURLEncoderString(imagePath.substring(imagePath.lastIndexOf("/") + 1));
            RequestOptions options = new RequestOptions()
                    .placeholder(R.mipmap.icon)
                    .fallback(R.drawable.picture_split)
                    .error(R.drawable.picture_split);
            Glide.with(context)
                    .load(imagePath)
                    .apply(options)
//                    .load(R.mipmap.avatar)
                    .into(viewHolder.mIvVideoCover);

        } else {
            Glide.with(context)
                    .load(R.mipmap.avatar)
                    .into(viewHolder.mIvVideoCover);
        }
        //视频名称
        String videoName = videoInformation.getVideoName();
        viewHolder.mTvVideoName.setText(videoName);

    }

    @Override
    public int getItemCount() {
        return mList.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        View item;
        ImageView mIvVideoCover;
        TextView mTvVideoName;

        public ViewHolder(View itemView) {
            super(itemView);
            item = itemView;
            mIvVideoCover = (ImageView) itemView.findViewById(R.id.iv_video_cover);
            mTvVideoName = (TextView) itemView.findViewById(R.id.tv_video_name);
        }
    }

    public interface OnItemClickListener {
        void onItemClick(VideoInformation videoInformation);
    }
    public void setOnItemClickListener(OnItemClickListener onItemClickListener ){
        this. mOnItemClickListener = onItemClickListener;
    }
}
