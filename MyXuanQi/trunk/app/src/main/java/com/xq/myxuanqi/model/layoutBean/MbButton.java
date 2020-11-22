package com.xq.myxuanqi.model.layoutBean;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.support.constraint.ConstraintLayout;
import android.support.constraint.ConstraintSet;
import android.util.Log;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.CommonActivity;
import com.xq.myxuanqi.ui.fragment.BaseFragment;
import com.xq.myxuanqi.util.InstallUtil;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;

public class MbButton extends MobileUIComponent {
    private double x0 = 0.5; // top left corner X
    private double y0 = 0.5; // top left corner Y
    private double x1 = 0.5; // bottom right corner X
    private double y1 = 0.5; // bottom right corner X
    private int width = 50;
    private int height = 50;
    private int fontsize = 26;
    private String fontfamilty = "Arial Black";
    private int clickMe = 0;
    private int clickMeOption = 0;
    private String clickMeUrl = null;
    private int longPressMe = 0;
    private int longPressMeOption = 0;
    private String longPressMeUrl = null;
    // 0: italic; 1: normal; 2: bold
    private String fontWeight = "normal";
    private String frontgroundColor = null;  // #000000
    private String backgroundColor = null; // #ffffff
    private String frontgroundIcon = null; // URL
    private String backgroundImage = null; // URL
    private String alias = null;

    public MbButton() {
        setClasstypename("MbButton");
    }

    public double getX0() {
        return x0;
    }

    public void setX0(double x0) {
        this.x0 = x0;
    }

    public double getY0() {
        return y0;
    }

    public void setY0(double y0) {
        this.y0 = y0;
    }

    public double getX1() {
        return x1;
    }

    public void setX1(double x1) {
        this.x1 = x1;
    }

    public double getY1() {
        return y1;
    }

    public void setY1(double y1) {
        this.y1 = y1;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getFontsize() {
        return fontsize;
    }

    public void setFontsize(int fontsize) {
        this.fontsize = fontsize;
    }

    public String getFontfamilty() {
        return fontfamilty;
    }

    public void setFontfamilty(String fontfamilty) {
        this.fontfamilty = fontfamilty;
    }

    public int getClickMe() {
        return clickMe;
    }

    public void setClickMe(int clickMe) {
        this.clickMe = clickMe;
    }

    public int getClickMeOption() {
        return clickMeOption;
    }

    public void setClickMeOption(int clickMeOption) {
        this.clickMeOption = clickMeOption;
    }

    public String getClickMeUrl() {
        return clickMeUrl;
    }

    public void setClickMeUrl(String clickMeUrl) {
        this.clickMeUrl = clickMeUrl;
    }

    public int getLongPressMe() {
        return longPressMe;
    }

    public void setLongPressMe(int longPressMe) {
        this.longPressMe = longPressMe;
    }

    public int getLongPressMeOption() {
        return longPressMeOption;
    }

    public void setLongPressMeOption(int longPressMeOption) {
        this.longPressMeOption = longPressMeOption;
    }

    public String getLongPressMeUrl() {
        return longPressMeUrl;
    }

    public void setLongPressMeUrl(String longPressMeUrl) {
        this.longPressMeUrl = longPressMeUrl;
    }

    public String getFontWeight() {
        return fontWeight;
    }

    public void setFontWeight(String fontWeight) {
        this.fontWeight = fontWeight;
    }

    public String getFrontgroundColor() {
        return frontgroundColor;
    }

    public void setFrontgroundColor(String frontgroundColor) {
        this.frontgroundColor = frontgroundColor;
    }

    public String getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    public String getFrontgroundIcon() {
        return frontgroundIcon;
    }

    public void setFrontgroundIcon(String frontgroundIcon) {
        this.frontgroundIcon = frontgroundIcon;
    }

    public String getBackgroundImage() {
        return backgroundImage;
    }

    public void setBackgroundImage(String backgroundImage) {
        this.backgroundImage = backgroundImage;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public void toAndroidUI(final LinearLayout linearLayout, final Context context, final Activity activity, ConstraintLayout constraintLayout) {

        //生成图片
        final ImageView imageView = new ImageView(context);
        imageView.setId(R.id.imagView);
        imageView.setBackgroundResource(R.mipmap.default_button_icon);
        int idImage = imageView.getId();
        //生成文字
        TextView textView = new TextView(context);
        textView.setText(this.getName());
        //使用html实现下划线的样式
//                    textView.setText(Html.fromHtml("<u>"+mbButton.getName()+"</u>"));
        textView.setTextSize(14);
        textView.setId(R.id.tv_text);
        if (getFrontgroundColor() != null) {
            textView.setTextColor(Color.parseColor(getFrontgroundColor()));
        }
        int idText = textView.getId();
        constraintLayout.addView(imageView);
        constraintLayout.addView(textView);
        linearLayout.addView(constraintLayout);
        // color 颜色需为7或9位，如 #cccccc 或   #ffffffff
                    /*if (mbButton.getBackgroundColor()!=null){
                        imageView.setBackgroundColor(Color.parseColor(mbButton.getBackgroundColor()));
                    }
                    if (mbButton.getFrontgroundColor()!=null){
                        Drawable colorDrawable = new ColorDrawable(Color.parseColor(mbButton.getFrontgroundColor()));
                        imageView.setImageDrawable(colorDrawable);
                        textView.setTextColor(Color.parseColor(mbButton.getFrontgroundColor()));
                    }*/
        String alias = getAlias();
        ConstraintLayout.LayoutParams imageLayoutParams = new ConstraintLayout.LayoutParams(100, 100);
        imageView.setLayoutParams(imageLayoutParams);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
        constraintLayout.setLayoutParams(layoutParams);
        ConstraintSet constraintSet = new ConstraintSet();
        constraintSet.clone(constraintLayout);
        constraintSet.connect(idImage, ConstraintSet.TOP, ConstraintSet.PARENT_ID, ConstraintSet.TOP, 5);
        constraintSet.connect(idImage, ConstraintSet.LEFT, ConstraintSet.PARENT_ID, ConstraintSet.LEFT);
        constraintSet.connect(idImage, ConstraintSet.RIGHT, ConstraintSet.PARENT_ID, ConstraintSet.RIGHT);
        constraintSet.connect(idText, ConstraintSet.TOP, idImage, ConstraintSet.BOTTOM, 5);
        constraintSet.connect(idText, ConstraintSet.LEFT, idImage, ConstraintSet.LEFT);
        constraintSet.connect(idText, ConstraintSet.RIGHT, idImage, ConstraintSet.RIGHT);
        constraintSet.applyTo(constraintLayout);
        String urlimage = UrlUtils.downloadRepluginImageUrl("00000000000001R", this.getClickMeUrl());
//        RequestQueue requestQueue = Volley.newRequestQueue(context);
//        ImageLoader imageLoader = new ImageLoader(requestQueue, new BitmapCache());
//        imageView.setImageUrl(urlimage, imageLoader);
    }


    public void doClickMe(String alias, Activity activity, BaseFragment parent, final Context context,String urlId) {
        if (this.getClickMe() == 1) {
            if (this.getClickMeOption() == 0) {
                //打开web页面
                Log.e("doClickMe: ", SpUtil.getInstance().getStr("sessionId") );
                String url = UrlUtils.getUrl()+"client/launch.jsp?pid="+this.getClickMeUrl()+"&sessionId="+ SpUtil.getInstance().getStr("sessionId");
                String type = "任务";
                parent.ResultJumpTo(CommonActivity.class, url,type);
            }
            if (this.getClickMeOption() == 1) {
                //启动插件
                InstallUtil.startPlugin(alias, activity,context,urlId);
            }

        }
    }

    public boolean doLongPress(String alias, Activity activity, BaseFragment parent, final Context context,String urlId) {
        if (getLongPressMe() == 1) {
            if (getLongPressMeOption() == 0) {
                //打开web页面
                String url = UrlUtils.getUrl()+"client/launch.jsp?pid="+this.getClickMeUrl()+"&sessionId="+ SpUtil.getInstance().getStr("sessionId");
                String type = "任务";
                parent.ResultJumpTo(CommonActivity.class, url,type);
            }
            if (getLongPressMeOption() == 1) {
                //启动插件
                InstallUtil.startPlugin(alias, activity,context,urlId);
            }
        }
        return false;
    }

}
