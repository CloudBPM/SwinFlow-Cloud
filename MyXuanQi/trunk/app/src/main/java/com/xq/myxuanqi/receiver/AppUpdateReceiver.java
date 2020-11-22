package com.xq.myxuanqi.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

/**
 * 监听app更新的广播
 */
public class AppUpdateReceiver extends BroadcastReceiver {
    private updateChange mUpdateChange;
    @Override
    public void onReceive(Context context, Intent intent) {


        if ("android.app.update".equals(intent.getAction())&&context.getPackageName().equals(intent.getPackage()))
            if (mUpdateChange!=null){
                int update = intent.getIntExtra("update", -1);
                int versionCode = intent.getIntExtra("versionCode", 0);
                mUpdateChange.onUpdateChange(update,versionCode);
            }
    }
    /*
     * 设置更新监听
     */
    public interface updateChange{
        void onUpdateChange(int update,int versionCode);
    }

    public void setUpdateChange(updateChange updateChange){
        this.mUpdateChange = updateChange;
    }
}
