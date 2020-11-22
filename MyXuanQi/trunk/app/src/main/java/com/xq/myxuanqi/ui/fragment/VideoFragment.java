package com.xq.myxuanqi.ui.fragment;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.util.ArrayMap;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.cloudibpm.core.user.Login;
import com.google.gson.Gson;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.adapter.video.VideoAdapter;
import com.xq.myxuanqi.model.video.VideoInformation;
import com.xq.myxuanqi.model.video.VideoInformationPage;
import com.xq.myxuanqi.ui.activity.video.SimpleDetailActivityMode2;
import com.xq.myxuanqi.util.HttpUtils;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.ToastUtils;
import com.xq.myxuanqi.util.UrlUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import butterknife.BindView;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

/**
 * Created by wm on 2019/3/7.
 */

public class VideoFragment extends BaseFragment implements SwipeRefreshLayout.OnRefreshListener {

    private static final String TAG = "VideoFragment";

    private Activity activity;
    @BindView(R.id.sr_video_list)
    SwipeRefreshLayout mSrVideoList;
    @BindView(R.id.rv_video_list)
    RecyclerView mRvVideoList;
    //切换刷新
    protected boolean isCreated = false;
    private VideoAdapter videoAdapter;
    private List<VideoInformation> mList = new ArrayList<>();
    private View mDecor;

    private String sessionId;
    private Login login;
    private String userId;


    private int pageNo = 1;
    private int pageSize = 10;


    @Override
    protected int getLayoutResId() {
        return R.layout.fragment_video;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        isCreated = true;
    }

    @Override
    public void init() {
        super.init();
        mDecor = getActivity().getWindow().getDecorView();
        mDecor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        activity = getActivity();

        initListView();  //加载初始界面

        initDta();//初始化数据

//        getVideoInfo();  //http请求，获取视频信息
        initVideoInfo();

        clickItem();

    }

    private void initListView() {
        //下拉刷新
        mSrVideoList.setColorSchemeResources(R.color.colorAccent);
        mSrVideoList.setOnRefreshListener(this);
        //列表
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(activity);
        mRvVideoList.setLayoutManager(linearLayoutManager);
        videoAdapter = new VideoAdapter(activity, mList);
        mRvVideoList.setAdapter(videoAdapter);

    }

    private void initDta() {

        sessionId = SpUtil.getInstance().getStr("sessionId");
        login = SpUtil.getInstance().getLogin();
        userId = login.getUser().getId();
    }

    //从服务器获取视频信息
    private void getVideoInfo() {

        List<String> imageList = new ArrayList<>();
        imageList.add("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552037384955&di=9c700fc95e66181b537ee35e690812b1&imgtype=0&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ffc1f4134970a304e210531d0dfc8a786c9175cf0.jpg");
        imageList.add("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552037456816&di=4b1fe577f56f9fa0a961a13efe82767c&imgtype=0&src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farticle%2F2bb960657f69bb95cd4adc02cdb0cdd7bedf901d.jpg");
        imageList.add("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552037456808&di=973402ac735f9cf29e7d16f09f5d4fac&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201405%2F22%2F20140522162020_jJPVm.jpeg");
        imageList.add("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552037456805&di=c97fdce96c6c1119c39e2308c0e01680&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2Fb%2F587453ef6b341.jpg");
        imageList.add("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552037456804&di=376516603ac3fcc05df2ca7780db784c&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2Fd043ad4bd11373f0d3b5c7efa40f4bfbfbed0433.jpg");
        imageList.add("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552037456804&di=e6a0198c000b6fda5b8a76604cbbd1b3&imgtype=0&src=http%3A%2F%2F00.minipic.eastday.com%2F20170523%2F20170523000003_d41d8cd98f00b204e9800998ecf8427e_16.jpeg");
        imageList.add("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552037456801&di=cf7789bc6cfc4962e4aa79bbd1d1cd69&imgtype=0&src=http%3A%2F%2Fpic.qiantucdn.com%2F58pic%2F17%2F82%2F51%2F66s58PICXeQ_1024.jpg");
        imageList.add("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552037456798&di=26b241a521608fa240139e15e50624c3&imgtype=0&src=http%3A%2F%2Fpic34.nipic.com%2F20131025%2F2623009_140242263104_2.jpg");
        imageList.add("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552037456848&di=7237de0aa4330ef7e79836d1fd9327e4&imgtype=0&src=http%3A%2F%2Fi4.3conline.com%2Fimages%2Fpiclib%2F201208%2F14%2Fbatch%2F1%2F144215%2F1344917956963dyc84ztxky.jpg");
        imageList.add("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552037456848&di=3cb4a2db8eabff7f41f80b390a2bedfb&imgtype=0&src=http%3A%2F%2Fwww.wallcoo.com%2Fgame%2FMMOG_the9_Wowchina%2Fwallpapers%2F1440x900%2FWoW_Wallpaper_2007-05-21m.jpg");
        imageList.add("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552037456848&di=c2ede7f7fc259f964118881650778cd0&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F13%2F47%2F93%2F52Y58PICG6t_1024.jpg");
        imageList.add("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552037752189&di=c24658c7bfc0d90b862c395b218424a6&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D1109222948%2C467987249%26fm%3D214%26gp%3D0.jpg");
        imageList.add("https://i0.hdslb.com/bfs/article/982baa2ba6f1281129cedac1f701d62ea6387eae.jpg@1320w_910h.jpg");
        imageList.add("https://i0.hdslb.com/bfs/article/2891396a32a53a29b8231ef2c4908458c48b3c78.jpg@1320w_938h.jpg");
        imageList.add("https://i0.hdslb.com/bfs/article/346bd680ac09d4e6ebf477cf117acc5cc4f05eda.jpg@1320w_748h.jpg");
        imageList.add("https://i0.hdslb.com/bfs/article/aa6aa68255c61293fc53744bf37af77a913241ae.jpg@1320w_744h.jpg");
        imageList.add("https://i0.hdslb.com/bfs/article/aa6aa68255c61293fc53744bf37af77a913241ae.jpg@1320w_744h.jpg");
        imageList.add("https://images2015.cnblogs.com/blog/744147/201607/744147-20160728154911794-545084086.png");

        for (int i = 0; i < imageList.size(); i++) {
            VideoInformation videoInformation = new VideoInformation();
            videoInformation.setImagePath(imageList.get(i));
            videoInformation.setVideoName("名称" + i);
            videoInformation.setVideoDesc("描述" + i);
            videoInformation.setVideoPath("https://res.exexm.com/cw_145225549855002");
//            videoInformation.setVideoUrl("rtmp://192.168.1.54:1935/oflaDemo/BladeRunner2049.flv");
            mList.add(videoInformation);
        }

        videoAdapter.notifyDataSetChanged();
    }

    private void initVideoInfo() {
        String url = UrlUtils.getUrl() + "client/clientservices";
        Map<String, String> mapParams = new ArrayMap<>();
        mapParams.put("sessionId", sessionId);
        mapParams.put("api", "18");
        mapParams.put("pn", "" + pageNo);
        mapParams.put("psz", "" + pageSize);
        mapParams.put("cond", "");
        mapParams.put("userId", userId);

        HttpUtils.doPost(url, mapParams, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "onFailure: ");
                ToastUtils.failToast(activity);
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                String s = response.body().string().trim();
                Log.d(TAG, "onResponse: " + s);
                int code = response.code();
                if (s.equals("{\"status\": \"-5\" }")) {
                    ToastUtils.textToast(activity, "登录失效");
                    return;
                }
                if (code == 200) {
                    Gson gson = new Gson();
                    VideoInformationPage videoInformationPage = gson.fromJson(s, VideoInformationPage.class);
                    VideoInformation[] videoInformations = videoInformationPage.getPageEntities();
                    mList.addAll(Arrays.asList(videoInformations));

                    activity.runOnUiThread(() -> {
                        videoAdapter.notifyDataSetChanged();
                    });

                } else {
                    ToastUtils.failToast(activity);
                }

            }
        });

    }

    @Override
    public void onRefresh() {
        Toast.makeText(activity, "正在加载...", Toast.LENGTH_SHORT).show();

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Thread.sleep(3000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        mSrVideoList.setRefreshing(false);


    }

    private void clickItem() {
        videoAdapter.setOnItemClickListener(new VideoAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(VideoInformation videoInformation) {
                Intent intent = new Intent(activity, SimpleDetailActivityMode2.class);
                intent.putExtra("videoInformation", videoInformation);
                startActivity(intent);
//                Toast.makeText(activity, "点击了列表项！", Toast.LENGTH_SHORT).show();
            }
        });
    }
    @Override
    public void setUserVisibleHint(boolean isVisibleToUser) {
        super.setUserVisibleHint(isVisibleToUser);
        if (!isCreated) {
            return;
        }
        //刷新画面
        if (isVisibleToUser) {
            mDecor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        }
    }
}
