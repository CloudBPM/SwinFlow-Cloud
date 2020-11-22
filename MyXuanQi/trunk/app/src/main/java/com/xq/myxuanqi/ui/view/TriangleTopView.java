package com.xq.myxuanqi.ui.view;

import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.view.View;
import android.view.WindowManager;

import com.xq.myxuanqi.R;

/**
 * Created by wm on 2019/3/1.
 */

public class TriangleTopView extends View {

    private Paint  mPaint;
    private Paint  mTpaint;
    private String mText;
    private int    mTextColor;
    private int    mTextSize;
    private int    mBackground;
    private float  mWidth;
    private float  mHeight;
    private int    mCenterWidth;
    private int    mCenterHeight;

    public TriangleTopView(Context context) {
        this(context, null);
    }

    public TriangleTopView(Context context, @Nullable AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public TriangleTopView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        //获得自定义控件的主题样式数组
        Resources.Theme theme = context.getTheme();
        if (null != attrs) {
            TypedArray typedArray = theme.obtainStyledAttributes(attrs, R.styleable.TriangleTopView, defStyleAttr, 0);
            if (null != typedArray) {
                int indexCount = typedArray.getIndexCount();
                for (int i = 0; i < indexCount; i++) {
                    int index = typedArray.getIndex(i);
                    switch (index){
                        case R.styleable.TriangleTopView_tv_text:
                            mText = typedArray.getString(index);
                            break;
                        case R.styleable.TriangleTopView_text_color:
                            mTextColor = typedArray.getColor(index, Color.WHITE);
                            break;
                        case R.styleable.TriangleTopView_text_size:
                            mTextSize = typedArray.getDimensionPixelSize(index, 12);
                            break;
                        case R.styleable.TriangleTopView_view_background:
                            mBackground = typedArray.getColor(index, Color.RED);
                            break;
                        case R.styleable.TriangleTopView_view_width:
                            mWidth = typedArray.getFloat(index, 60);
                            break;
                        case R.styleable.TriangleTopView_view_height:
                            mHeight = typedArray.getFloat(index, 80);
                            break;
                    }
                }
                typedArray.recycle();

                WindowManager windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
                mCenterWidth = windowManager.getDefaultDisplay().getWidth()/2;
                mCenterHeight = windowManager.getDefaultDisplay().getHeight()/2;

                init();
            }
        }
    }

    private void init() {
        mPaint = new Paint();
        mPaint.setStyle(Paint.Style.FILL);
        mPaint.setColor(mBackground);
        mTpaint = new Paint();
        mTpaint.setColor(mTextColor);
        mTpaint.setStyle(Paint.Style.FILL);
        mTpaint.setTextSize(mTextSize);
        mTpaint.setTextAlign(Paint.Align.LEFT);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        canvas.translate(mWidth/2,mWidth/2);
        Path path = new Path();
        path.moveTo(-mWidth/2, -mWidth/2);
        path.lineTo(mWidth/2, -mWidth/2);
        path.lineTo(mWidth/2, mWidth/2);
        path.close();
        canvas.drawPath(path, mPaint);
        canvas.rotate(45);

        float hOffset = (float) (Math.sqrt((Math.pow(mCenterWidth/2+mWidth, 2) + Math.pow(mCenterWidth/2+mWidth, 2))) / 2.0f) ;
        float vOffset = (float) (mCenterWidth/2 * mCenterWidth/2 * Math.sqrt((Math.pow(mCenterWidth/2, 2) + Math.pow(mCenterWidth/2, 2))) / ((Math.pow(mCenterWidth/2, 2) + Math.pow(mCenterWidth/2, 2))) / 6.0f);
        canvas.drawText(mText,-mTpaint.measureText(mText) / 2,(int)(-Math.sqrt(2) / 2.0 * mWidth -(mTpaint.ascent() + mTpaint.descent())) / 4, mTpaint);
    }
}
