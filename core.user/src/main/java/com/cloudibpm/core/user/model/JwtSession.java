package com.cloudibpm.core.user.model;

import com.cloudibpm.core.user.Login;

import java.io.Serializable;

public class JwtSession implements Serializable {
    private Login login;
    private JwtModel pcToken;
    private JwtModel appToken;

    /**
     * 0:一次认证通过，只保存login信息，不签发token
     * 1:二次认证通过或无需二次认证，直接签发token
     */
    private String pcState="-1";
    private String appState="-1";

    public Login getLogin() {
        return login;
    }

    public void setLogin(Login login) {
        this.login = login;
    }

    public JwtModel getPcToken() {
        return pcToken;
    }

    public void setPcToken(JwtModel pcToken) {
        this.pcToken = pcToken;
    }

    public JwtModel getAppToken() {
        return appToken;
    }

    public void setAppToken(JwtModel appToken) {
        this.appToken = appToken;
    }

    public String getPcState() {
        return pcState;
    }

    public void setPcState(String pcState) {
        this.pcState = pcState;
    }

    public String getAppState() {
        return appState;
    }

    public void setAppState(String appState) {
        this.appState = appState;
    }

}
