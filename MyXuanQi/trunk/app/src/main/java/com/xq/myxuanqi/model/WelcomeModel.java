package com.xq.myxuanqi.model;

/**
 * Created by xq0002 on 2018/12/7.
 */

public class WelcomeModel extends BaseModel {
    private String welcomeText;

    public WelcomeModel(String welcomeText) {
        this.welcomeText = welcomeText;
    }

    public String getWelcomeText() {
        return welcomeText;
    }

    public void setWelcomeText(String welcomeText) {
        this.welcomeText = welcomeText;
    }
}
