package com.model;

import java.io.Serializable;

/**
 * @author: yaofeng
 * @create:2019-05-15-10:42
 **/
public class ServiceOrder implements Serializable {
    private String orderId;
    private String productName;
    private  String prodoctPrice;
    private String buyersId;
    private int status;
    private String productId;
    private String createTime;
    private String backTime;

    public String getBackTime() {
        return backTime;
    }

    public void setBackTime(String backTime) {
        this.backTime = backTime;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProdoctPrice() {
        return prodoctPrice;
    }

    public void setProdoctPrice(String prodoctPrice) {
        this.prodoctPrice = prodoctPrice;
    }

    public String getBuyersId() {
        return buyersId;
    }

    public void setBuyersId(String buyersId) {
        this.buyersId = buyersId;
    }
}
