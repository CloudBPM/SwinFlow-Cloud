package com.xq.myxuanqi.adapter;

import android.arch.paging.PagedListAdapter;
import android.content.Context;
import android.support.annotation.NonNull;
import android.support.constraint.ConstraintLayout;
import android.support.v7.util.DiffUtil;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bumptech.glide.request.RequestOptions;
import com.cloudibpm.core.admin.news.News;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.bean.AttachmentsNews;
import com.xq.myxuanqi.util.EmptyUtils;
import com.xq.myxuanqi.util.LongTimeToDate;
import com.xq.myxuanqi.util.TimeChange;
import com.xq.myxuanqi.util.UrlUtils;

import java.util.Date;
import java.util.List;

import butterknife.BindView;

/**
 * Created by wm on 2019/2/26.
 */

public class CategoryNewsAdapter extends PagedListAdapter<News,CategoryNewsAdapter.ViewHolder> {
    private OnItemClickCallBack mOnItemClickCallBack;
    private Context mContext;
    public interface OnItemClickCallBack{
        void setPositionNews(News news);
    }
    public void setOnItemClickCallBack(OnItemClickCallBack onItemClickCallBack){
        this.mOnItemClickCallBack = onItemClickCallBack;
    }
    private static final DiffUtil.ItemCallback<News> DIFF_CALLBACK = new DiffUtil.ItemCallback<News>() {
        @Override
        public boolean areItemsTheSame(@NonNull News newsModel, @NonNull News t1) {
            return newsModel.getTitle().equals(t1.getTitle());
        }

        @Override
        public boolean areContentsTheSame(@NonNull News newsModel, @NonNull News t1) {
            return newsModel.equals(t1);
        }
    };
    public CategoryNewsAdapter(Context context){
        super(DIFF_CALLBACK);
        this.mContext = context;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.item_category_news, viewGroup, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder viewHolder, int i) {
        News news = getItem(i);
        if (EmptyUtils.isNotEmpty(news)){
            viewHolder.mCl.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    mOnItemClickCallBack.setPositionNews(news);
                }
            });
            String owner = news.getOwner();
            String attachments = news.getAttachments();
            Gson gson = new GsonBuilder()
                    .registerTypeAdapter(Date.class, new LongTimeToDate())  //解析Date型时间
                    .create();
            List<AttachmentsNews> list=gson.fromJson(attachments,new TypeToken<List<AttachmentsNews>>(){}.getType());
            String url = UrlUtils.getUrl()+"file/org/"+owner+"/adm/news/"+news.getId()+"/"+list.get(0).getId()+"_"+list.get(0).getName();
            RequestOptions options = new RequestOptions()
                    .placeholder(R.mipmap.default_button_icon)
                    .error(R.mipmap.default_button_icon)
                    .diskCacheStrategy(DiskCacheStrategy.NONE);
            Glide.with(mContext).load(url).apply(options).into(viewHolder.mIvTitle);
//            viewHolder.mIvTitle.setImageResource(R.mipmap.default_button_icon);
            viewHolder.mTvTitle.setText(news.getTitle());
            viewHolder.mTvBrief.setText(news.getBrief());
            viewHolder.mTvAuthor.setText(news.getAuthor());
            viewHolder.mTvTime.setText(TimeChange.getTimeFormatText(new Date(news.getPublishDateTime())));
        }
    }

    static class ViewHolder extends RecyclerView.ViewHolder{
        @BindView(R.id.iv_title)
        ImageView mIvTitle;
        @BindView(R.id.tv_title)
        TextView  mTvTitle;
        @BindView(R.id.tv_brief)
        TextView  mTvBrief;
        @BindView(R.id.tv_author)
        TextView  mTvAuthor;
        @BindView(R.id.tv_time)
        TextView  mTvTime;
        @BindView(R.id.cl)
        ConstraintLayout mCl;
        public ViewHolder(View view) {
            super(view);
            mCl = view.findViewById(R.id.cl);
            mIvTitle = view.findViewById(R.id.iv_title);
            mTvAuthor = view.findViewById(R.id.tv_author);
            mTvBrief = view.findViewById(R.id.tv_brief);
            mTvTitle = view.findViewById(R.id.tv_title);
            mTvTime = view.findViewById(R.id.tv_time);
        }
    }

}
