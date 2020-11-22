package com.xq.myxuanqi.model;

/**
 * Created by xq0002 on 2018/12/7.
 * viewModel：对数据状态的维护
 */

public class LoginModel extends BaseModel {
    private String account; //用户名输入框中的内容
    private String password;    //密码输入框中的内容

    public LoginModel(String account) {
        this.account = account;
    }

    public LoginModel(String account, String password) {
        this.account = account;
        this.password = password;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
