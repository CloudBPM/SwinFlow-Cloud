package com.xq.myxuanqi.util.communication;

import android.app.Activity;
import android.content.Context;
import android.os.IBinder;
import android.support.constraint.ConstraintLayout;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.Toast;

import com.xq.myxuanqi.R;

public class FunctionArea {

    private static final String TAG = "FunctionArea";

    private Context context;

    public FunctionArea(Context context) {
        this.context = context;
    }



    /**
     * 根据传入控件的坐标和用户的焦点坐标，判断是否隐藏键盘，如果点击的位置在控件内，则不隐藏键盘
     *
     * @param view
     *            控件view
     * @param event
     *            焦点位置
     * @return 是否隐藏
     */
    public void hideKeyboardAndFunction(MotionEvent event, View view, InputMethodManager inputMethodManager, ConstraintLayout constraintLayout) {
        Log.d(TAG, "dispatchTouchEvent: 2222");

        if (view != null) {
            if (view instanceof EditText) {
                int[] location = { 0, 0 };
                view.getLocationInWindow(location);
//                        int left = location[0],
                int top = location[1];
//                                right = left + view.getWidth(),
//                                bottom = top + view.getHeight();
                // 判断焦点位置坐标是否在空间内，如果位置在控件外，则隐藏键盘
                if (event.getY() < top) {
                    // 隐藏键盘
                    inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(),0);
                    constraintLayout.setVisibility(View.GONE);
                }
            }
        }
    }

    public void hideAndShowFunctionArea(InputMethodManager inputMethodManager, ConstraintLayout constraintLayout, EditText editText, RecyclerView recyclerView, int location) {
        //为了第一次打开功能区就获得焦点
        editText.requestFocus();
        if(inputMethodManager.hideSoftInputFromWindow(editText.getWindowToken(), 0)) {
            Log.d(TAG, "onClick: 1111");
            //软键盘已弹出
            if (constraintLayout.getVisibility() == View.GONE) {
                //隐藏状态则显示
                inputMethodManager.hideSoftInputFromWindow(editText.getWindowToken(),0);
                try {
                    Thread.sleep(20);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                constraintLayout.setVisibility(View.VISIBLE);

            } else {
                //去隐藏
                constraintLayout.setVisibility(View.GONE);
            }
        } else {
            //软键盘未弹出
            Log.d(TAG, "onClick: 2222");
            if (constraintLayout.getVisibility() == View.GONE) {
                //隐藏状态则显示
                constraintLayout.setVisibility(View.VISIBLE);
                inputMethodManager.hideSoftInputFromWindow(editText.getWindowToken(),0);
            } else {
                //去隐藏
                constraintLayout.setVisibility(View.GONE);
                inputMethodManager.showSoftInput(editText, 0);
            }
        }
        recyclerView.scrollToPosition(location);
    }
}
