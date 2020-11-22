package com.xq.myxuanqi.bean;

import com.cloudibpm.core.user.Login;

/**
 * Created by xq0002 on 2019/1/2.
 * 登录时获取登陆信息
 */

public class LoginMessage {
   private String            sessionId;
   private Login login;
   private String            status;

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Login getLogin() {
        return login;
    }

    public void setLogin(Login login) {
        this.login = login;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
