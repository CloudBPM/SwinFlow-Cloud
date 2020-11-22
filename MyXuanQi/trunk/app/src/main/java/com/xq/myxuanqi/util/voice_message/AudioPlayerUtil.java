package com.xq.myxuanqi.util.voice_message;

import android.media.MediaPlayer;

public class AudioPlayerUtil {
    //语音播放
    private static final String TAG = "AudioRecordTest";
    private MediaPlayer mPlayer;

    public AudioPlayerUtil() {
    }

    public void start(String mFileName, MediaPlayer.OnCompletionListener listener) {
        if (this.mPlayer == null) {
            this.mPlayer = new MediaPlayer();
        } else {
            this.mPlayer.reset();
        }
        try {
            this.mPlayer.setDataSource(mFileName);
            this.mPlayer.prepare();
            this.mPlayer.start();
            if (listener != null) {
                this.mPlayer.setOnCompletionListener(listener);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void stop() {
        if (this.mPlayer != null) {
            this.mPlayer.stop();
            this.mPlayer.release();
            this.mPlayer = null;
        }
    }
}

