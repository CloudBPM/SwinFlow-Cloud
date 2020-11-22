package com.xq.myxuanqi.util.voice_message;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.drawable.AnimationDrawable;
import android.media.MediaPlayer;
import android.os.Environment;
import android.support.v4.util.ArrayMap;
import android.text.TextUtils;
import android.util.Log;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.view.LoadingDialog;
import com.xq.myxuanqi.util.FileAndBase64;
import com.xq.myxuanqi.util.HttpUtils;
import com.xq.myxuanqi.util.TimeChange;
import com.xq.myxuanqi.util.UrlUtils;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

public class VoiceRecordAndPlay {

    private static final String TAG = "VoiceRecordAndPlay";

    //初始化需要传入的参数
    private Context context;
    private AudioPlayerUtil player;  //播放器
//    private ImageView mIvRecordIcon;  //播放音频是的箭头的动画
    private String companyId;
    private String userId;

    //存储路径
    private String ROOT_PATH;
    private View view;
    private String audioFilePath = "";// 录音文件保存路径
    private String audioString = "";// 录音文件转化为base64后的文件
    private AudioRecorderUtil audioRecorderUtil;
    //录音时的弹框
    private PopupWindowFactory mPop;
    //录音时长
    private long voiceTime = 0L;
    //返回的音频地址
    private String voiceLocationOnServer = "";
    //弹框中的控件
    private ImageView mIvRecordingIcon;
    private TextView mTvRecordingTime;

    //用来播放帧动画
    private AnimationDrawable animationDrawable;

    private LoadingDialog.Builder loadBuilder;  //正在登录...
    private LoadingDialog loadDialog;

    private boolean waitForUrl = false;
    private int waiting = 0;  //记录循环次数，是否要一直等下去

    public VoiceRecordAndPlay(Context context, AudioPlayerUtil player, String companyId, String userId) {
        this.context = context;
        this.player = player;

        this.companyId = companyId;
        this.userId = userId;
    }
    //初始化音频的存储路径
    //一定要调用的方法——1
    public void init() {
        try {
            ROOT_PATH = context.getExternalFilesDir(null).getAbsolutePath();
        } catch (Exception e) {
            Log.e(TAG, e.getMessage() + "");
            if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
                ROOT_PATH = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + context.getPackageName();
            } else {
                ROOT_PATH = context.getFilesDir().getAbsolutePath();
            }
        } catch (Throwable e) {
            ROOT_PATH = context.getFilesDir().getAbsolutePath();
        }

        //初始化加载框
        loadBuilder = new LoadingDialog.Builder(context)
                .setMessage("正在上传...")
                .setCancelable(false);
        loadDialog = loadBuilder.create();
    }

    //当长按按钮时显示的输入提示框
    //一定要调用的方法——2
    @SuppressLint("ClickableViewAccessibility")
    public void initAudioRecorderBtn() {
        view = View.inflate(context, R.layout.layout_microphone, null);
        mPop = new PopupWindowFactory(context, view);
        //PopupWindow布局文件里面的控件
        mIvRecordingIcon = (ImageView) view.findViewById(R.id.iv_recording_icon);
        mTvRecordingTime = (TextView) view.findViewById(R.id.tv_recording_time);
        audioRecorderUtil = new AudioRecorderUtil(ROOT_PATH + File.separator + "audio");
        //监听声音变化控制麦克风图标的变化
        //录音初始化
        audioRecorderUtil.setOnAudioStatusUpdateListener(new AudioRecorderUtil.OnAudioStatusUpdateListener() {
            @Override
            public void onStart() {
            }

            @Override
            public void onProgress(double db, long time) {
                //根据分贝值来设置录音时话筒图标的上下波动,同时设置录音时间
                //设置录音时的帧动画
                Log.d(TAG, "onProgress: db:" + db);
                Log.d(TAG, "onProgress: " + (3000 + 6000 * db / 100));
                mIvRecordingIcon.getDrawable().setLevel((int) (3000 + 6000 * db / 100));
//                mImageView.getDrawable().setLevel(8000);
                mTvRecordingTime.setText(TimeChange.long2String(time));
            }

            @Override
            public void onError(Exception e) {
            }

            @Override
            public void onCancel() {
            }

            @Override
            public void onStop(String filePath) {
                mPop.dismiss();
//                record_contentLayout.setVisibility(View.VISIBLE);
                audioFilePath = filePath;
                Log.e("===path", audioFilePath);
                loadDialog.show(); //显示加载框
                waitForUrl = true;
                uploadVoice(audioFilePath);

            }
        });

    }

    public String recordVoice(MotionEvent event) {
        //长按开始录音
        if (player != null) {
            player.stop();
        }
        //正在录音
        // 处理动作
        Log.d(TAG, "recordVoice: 111111");
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                Log.d(TAG, "recordVoice: 22222");
                audioRecorderUtil.start();
                mPop.showAtLocation(view.getRootView(), Gravity.CENTER, 0, 0);
                break;
            case MotionEvent.ACTION_UP:
            case MotionEvent.ACTION_CANCEL:
                Log.d(TAG, "recordVoice: 3333333");
                voiceTime = audioRecorderUtil.getSumTime();
                //这个time是录音的时长
                if (voiceTime < 1000) {
                    audioRecorderUtil.cancel();
                    Toast.makeText(context, "录音时间太短！", Toast.LENGTH_SHORT).show();
                    audioFilePath = "";
                } else {
//                            tv_time.setText(time / 1000 + "s");
//                    Toast.makeText(context, "录音成功！", Toast.LENGTH_SHORT).show();
                }
                mIvRecordingIcon.getDrawable().setLevel(0);
                mTvRecordingTime.setText(TimeChange.long2String(0));
                audioRecorderUtil.stop();
                mPop.dismiss();
                break;
        }
        Log.d(TAG, "recordVoice: 444444");
        String audioFilePathAndVoiceTime = "";
        while(waitForUrl && waiting < 5) {  //最多等250ms
            try {
                Thread.sleep(50);
                waiting++;
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        waiting = 0;
        if (!audioFilePath.equals("")) {
            //第一个为音频的时长，第二个为服务器地址，第三个为本地地址
            audioFilePathAndVoiceTime = (voiceTime / 1000) + "s" + "#" + voiceLocationOnServer + "#" + audioFilePath;
            audioFilePath = "";
            voiceTime = 0;
        }
        return audioFilePathAndVoiceTime;
    }

    public void playVoice(String localFilePath, ImageView mIvRecordIcon) {
        //点击开始播放录音
        Log.d(TAG, "onClick: 123:33333");
        if (TextUtils.isEmpty(localFilePath)) {
            Log.d(TAG, "onClick: 123:44444:" + localFilePath);
            Log.d(TAG, "onClick: 123:44444");
            return;
        }
        Log.d(TAG, "onClick: 123:55555");
        if (player == null) {
            player = new AudioPlayerUtil();
        } else {
            player.stop();
        }
        //播放语音时的帧动画
        mIvRecordIcon.setImageResource(R.drawable.record_play);
        animationDrawable = (AnimationDrawable) mIvRecordIcon.getDrawable();
        animationDrawable.start();
        player.start(localFilePath, new MediaPlayer.OnCompletionListener() {
            @Override
            public void onCompletion(MediaPlayer mp) {
                animationDrawable.stop();
                mIvRecordIcon.setImageResource(R.mipmap.play);
                //播放完毕就删除本地文件
                FileAndBase64.delete(localFilePath);
            }
        });
    }

    public long getVoiceTime() {
        return voiceTime;
    }

    public void setVoiceTime(long voiceTime) {
        this.voiceTime = voiceTime;
    }

    public String getVoiceLocationOnServer() {
        return voiceLocationOnServer;
    }

    public void setVoiceLocationOnServer(String voiceLocationOnServer) {
        this.voiceLocationOnServer = voiceLocationOnServer;
    }

    //上传音频文件
    private void uploadVoice(String filePath) {
        String url = UrlUtils.getApiUrl() + "api/service19/api31";
        Map<String, String> mapParams = new ArrayMap<>();
        mapParams.put("oid", companyId);
        mapParams.put("uid", userId);
        mapParams.put("type", "2");
        HttpUtils.doPostFile(url, mapParams, filePath, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "onFailure: 222");
                loadDialog.dismiss();
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                String s = response.body().string().trim();
                Log.d(TAG, "onResponse: " + s);
                //获取到音频文件地址
                voiceLocationOnServer = s;
                waitForUrl = false;  //结束等待

                //文件传输完毕就删掉
                FileAndBase64.delete(filePath);
                loadDialog.dismiss();
            }
        });

    }
}
