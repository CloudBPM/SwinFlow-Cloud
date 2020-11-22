package com.model;

/**
 * @author: yaofeng
 * @create:2019-06-17-10:36
 **/
public class Invoice {
    private String invoiceId; //发票ID
    private String invoiceType;  //发票类型 1、增值税普通发票 2、增值税专用发票
    private String receivePersonType;  //接收人类型 1、单位 2、个人
    private String invoiceHead;  // 发票抬头
    private String invoiceContent;  //发票内容 1、软件服务费 2、培训服务费
    private String receiveType;  //接收方式 1、电子邮件 2、快递
    private String email;   //电子邮箱
    private String taxpayersNumber;  //纳税人识别号
    private String companyAddress;  // 公司地址
    private String financialTel;  //公司财务电话
    private String depositaryBank;  //开户行
    private String bankNumber;   //银行账号
    private String receiveName;  //收件人姓名
    private String receiveTel;  //收件人电话
    private String reciveAddress;  //收件人地址
    private String note; //备注
    private String orderId; //订单Id
    private int invoiceStatus;
    private String applyTime;
    private String orderPrice;//商品金额

    public String getOrderPrice() {
        return orderPrice;
    }

    public void setOrderPrice(String orderPrice) {
        this.orderPrice = orderPrice;
    }

    public String getApplyTime() {
        return applyTime;
    }

    public void setApplyTime(String applyTime) {
        this.applyTime = applyTime;
    }

    public int getInvoiceStatus() {
        return invoiceStatus;
    }

    public void setInvoiceStatus(int invoiceStatus) {
        this.invoiceStatus = invoiceStatus;
    }

    public String getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(String invoiceId) {
        this.invoiceId = invoiceId;
    }

    public String getInvoiceHead() {
        return invoiceHead;
    }

    public void setInvoiceHead(String invoiceHead) {
        this.invoiceHead = invoiceHead;
    }

    public String getReceiveType() {
        return receiveType;
    }

    public void setReceiveType(String receiveType) {
        this.receiveType = receiveType;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTaxpayersNumber() {
        return taxpayersNumber;
    }

    public void setTaxpayersNumber(String taxpayersNumber) {
        this.taxpayersNumber = taxpayersNumber;
    }

    public String getCompanyAddress() {
        return companyAddress;
    }

    public void setCompanyAddress(String companyAddress) {
        this.companyAddress = companyAddress;
    }

    public String getFinancialTel() {
        return financialTel;
    }

    public void setFinancialTel(String financialTel) {
        this.financialTel = financialTel;
    }

    public String getDepositaryBank() {
        return depositaryBank;
    }

    public void setDepositaryBank(String depositaryBank) {
        this.depositaryBank = depositaryBank;
    }

    public String getBankNumber() {
        return bankNumber;
    }

    public void setBankNumber(String bankNumber) {
        this.bankNumber = bankNumber;
    }

    public String getReceiveName() {
        return receiveName;
    }

    public void setReceiveName(String receiveName) {
        this.receiveName = receiveName;
    }

    public String getReceiveTel() {
        return receiveTel;
    }

    public void setReceiveTel(String receiveTel) {
        this.receiveTel = receiveTel;
    }

    public String getReciveAddress() {
        return reciveAddress;
    }

    public void setReciveAddress(String reciveAddress) {
        this.reciveAddress = reciveAddress;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getInvoiceType() {
        return invoiceType;
    }

    public void setInvoiceType(String invoiceType) {
        this.invoiceType = invoiceType;
    }

    public String getReceivePersonType() {
        return receivePersonType;
    }

    public void setReceivePersonType(String receivePersonType) {
        this.receivePersonType = receivePersonType;
    }

    public String getInvoiceContent() {
        return invoiceContent;
    }

    public void setInvoiceContent(String invoiceContent) {
        this.invoiceContent = invoiceContent;
    }
}
