package com.cloudibpm.core.user;


import java.io.Serializable;
import java.util.Date;

public class Device implements Serializable {

  private String pkDevice;
  private String deviceName;
  private String macAddress;
  private Date createTime;
  private String fkUser;
  private String state;
  private String deviceType;


  public String getPkDevice() {
    return pkDevice;
  }

  public void setPkDevice(String pkDevice) {
    this.pkDevice = pkDevice;
  }


  public String getDeviceName() {
    return deviceName;
  }

  public void setDeviceName(String deviceName) {
    this.deviceName = deviceName;
  }


  public String getMacAddress() {
    return macAddress;
  }

  public void setMacAddress(String macAddress) {
    this.macAddress = macAddress;
  }

  public String getFkUser() {
    return fkUser;
  }

  public void setFkUser(String fkUser) {
    this.fkUser = fkUser;
  }


  public String getState() {
    return state;
  }

  public void setState(String state) {
    this.state = state;
  }

  public String getDeviceType() {
    return deviceType;
  }

  public void setDeviceType(String deviceType) {
    this.deviceType = deviceType;
  }

  public Date getCreateTime() {
    return createTime;
  }

  public void setCreateTime(Date createTime) {
    this.createTime = createTime;
  }
}
