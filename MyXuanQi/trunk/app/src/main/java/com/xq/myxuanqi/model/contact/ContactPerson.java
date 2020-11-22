package com.xq.myxuanqi.model.contact;

import org.litepal.crud.LitePalSupport;

import java.io.Serializable;

public class ContactPerson extends LitePalSupport implements Serializable {
    //联系人model
    //用户id兼头像的url
    private String userId;
    //昵称
    private String fname;
    //公司名称
    private String companyName;
    //职位
    private String position;
    //部门
    private String department;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

}
