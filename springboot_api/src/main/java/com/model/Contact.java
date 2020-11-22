package com.model;

import java.io.Serializable;

/**
 * @Titel: 标题
 * @Description: 描述
 * @Author: 作者
 * @CreateDate: 2019/1/28 16:34
 * @Version: 1.0
 */
public class Contact implements Serializable {

    private String fname;  // 用户姓名
    private String userId;  //用户ID
    private String companyName; //用户公司名
    private String position;    //职位
    private String department;  //部门

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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

    @Override
    public String toString() {
        return "Contact{" +
                "fname='" + fname + '\'' +
                ", userId='" + userId + '\'' +
                ", companyName='" + companyName + '\'' +
                ", position='" + position + '\'' +
                ", department='" + department + '\'' +
                '}';
    }
}
