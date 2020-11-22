package com.xq.myxuanqi.ui.activity.communication;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.os.PowerManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Window;
import android.view.WindowManager;
import android.widget.TextView;
import android.widget.Toast;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.model.contact.ContactMessage;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.util.TimeChange;
import com.xq.myxuanqi.util.communication.ScreenListener;

import org.litepal.LitePal;

import butterknife.BindView;

public class LockScreenMessageReminderActivity extends BaseActivity {

    private static final String TAG = "LockScreenMessageRemind";

    @BindView(R.id.tv_sender_name)
    TextView mTvSenderName;
    @BindView(R.id.tv_send_time)
    TextView mTvSendTime;
    @BindView(R.id.tv_message)
    TextView mTvMessage;

    private ScreenListener screenListener ;

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_lock_screen_message_reminder;
    }

    @Override
    public void init() {
        super.init();
        final Window win = getWindow();
        win.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
//                | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
                | WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);

        showMessage();
        monitorScreen();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);//must store the new intent unless getIntent() will return the old one
        Log.i(TAG, "onNewIntent: 调用");
        PowerManager pm = (PowerManager) this.getSystemService(Context.POWER_SERVICE);
//        if (!pm.isScreenOn()) {
//            String msg = intent.getStringExtra("msg");
        showMessage();
            //点亮屏幕
        @SuppressLint("InvalidWakeLockTag")
        PowerManager.WakeLock wl = pm.newWakeLock(PowerManager.ACQUIRE_CAUSES_WAKEUP | PowerManager.SCREEN_BRIGHT_WAKE_LOCK, "bright");
        wl.acquire();
        wl.release();
//        }
    }

    private void showMessage() {
        ContactMessage contactMessage = LitePal.findLast(ContactMessage.class);
        mTvSenderName.setText(contactMessage.getSenderName());
        String stringTime = TimeChange.longToStringDate(contactMessage.getSendTime(), TimeChange.TIME);
        mTvSendTime.setText(stringTime);
        mTvMessage.setText(contactMessage.getMessage());

    }

    private void monitorScreen() {
        screenListener = new ScreenListener( LockScreenMessageReminderActivity.this ) ;
        screenListener.begin(new ScreenListener.ScreenStateListener() {
            @Override
            public void onScreenOn() {
//                Toast.makeText(LockScreenMessageReminderActivity.this , "屏幕打开了" , Toast.LENGTH_SHORT ).show();
            }

            @Override
            public void onScreenOff() {
//                Toast.makeText(LockScreenMessageReminderActivity.this , "屏幕关闭了" , Toast.LENGTH_SHORT ).show();
            }

            @Override
            public void onUserPresent() {
//                Toast.makeText(LockScreenMessageReminderActivity.this , "解锁了" , Toast.LENGTH_SHORT ).show();
                finish();
            }
        });
    }

}
