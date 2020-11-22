package com.cloudibpm.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.cloudibpm.blo.invoice.InvoiceBlo;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.util.serviceresult.ServiceResult;
import com.model.Invoice;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/**
 * @author: yaofeng
 * @create:2019-06-17-11:17
 **/
@RestController
@RequestMapping("/invoice")
public class InvoiceController {
    private final InvoiceBlo invoiceBlo;

    @Autowired
    public InvoiceController(InvoiceBlo invoiceBlo) {
        this.invoiceBlo = invoiceBlo;
    }

    /**
     * 申请发票
     * @param data
     * @param userId
     * @param orderId
     * @return
     */
    @RequestMapping("/api1")
    public ServiceResult applyInvoice(String data,String userId,String orderId){
        Invoice invoice = parseForJson(data);
        ServiceResult result = invoiceBlo.applyInvoice(invoice,userId,orderId);
        return result;
    }

    /**
     * 根据userId查询发票
     * @param loginString
     * @return
     */
    @RequestMapping("api2")
    public ServiceResult queryInvoice(String loginString){
     Login login = JSON.parseObject(loginString, Login.class);
     ServiceResult result = invoiceBlo.queryInvoice(login.getUser().getId());
     return result;
    }

    /**
     * 查询所有申请发票
     * @param pn
     * @param psz
     * @param cond
     * @return
     */
    @RequestMapping("api3")
    public ServiceResult queryAllInvoice(String pn,String psz,String cond){
        ServiceResult result = invoiceBlo.queryAllInvoice(pn,psz,cond);
        return result;
    }

    /**
     * 审批发票
     * @param id
     * @return
     */
    @RequestMapping("api4")
    public ServiceResult auditInvoice(String invoiceId){
        ServiceResult result = invoiceBlo.auditInvoice(invoiceId);
        return result;
    }

    @RequestMapping("api5")
    public ServiceResult queryByInvoiceId(String invoiceId){
        ServiceResult result = invoiceBlo.queryByInvoiceId(invoiceId);
        return result;
    }


    private Invoice parseForJson(String data){
        JSONObject jsonObject = JSON.parseObject(data);
        Invoice invoice = new Invoice();
        invoice.setInvoiceId(UUID.randomUUID().toString().replaceAll("-",""));
        if (!StringUtils.isBlank(jsonObject.getString("invoiceHead"))){
            invoice.setInvoiceHead(jsonObject.getString("invoiceHead"));
        }else {
            invoice.setInvoiceHead("");
        }
        if (!StringUtils.isBlank(jsonObject.getString("invoiceType"))){
            invoice.setInvoiceType(jsonObject.getString("invoiceType"));
        }else {
            invoice.setInvoiceType("");
        }
        if (!StringUtils.isBlank(jsonObject.getString("receivePersonType"))){
            invoice.setReceivePersonType(jsonObject.getString("receivePersonType"));
        }else {
            invoice.setReceivePersonType("");
        }
        if (!StringUtils.isBlank(jsonObject.getString("invoiceContent"))){
            invoice.setInvoiceContent(jsonObject.getString("invoiceContent"));
        }else {
            invoice.setInvoiceContent("");
        }
        if (!StringUtils.isBlank(jsonObject.getString("receiveType"))){
            invoice.setReceiveType(jsonObject.getString("receiveType"));
        }else {
            invoice.setReceiveType("");
        }
        if (!StringUtils.isBlank(jsonObject.getString("email"))){
            invoice.setEmail(jsonObject.getString("email"));
        }else {
            invoice.setEmail("");
        }
        if (!StringUtils.isBlank(jsonObject.getString("taxpayersNumber"))){
            invoice.setTaxpayersNumber(jsonObject.getString("taxpayersNumber"));
        }else {
            invoice.setTaxpayersNumber("");
        }
        if (!StringUtils.isBlank(jsonObject.getString("companyAddress"))){
            invoice.setCompanyAddress(jsonObject.getString("companyAddress"));
        }else {
            invoice.setCompanyAddress("");
        }
        if (!StringUtils.isBlank(jsonObject.getString("financialTel"))){
            invoice.setFinancialTel(jsonObject.getString("financialTel"));
        }else {
            invoice.setFinancialTel("");
        }
        if (!StringUtils.isBlank(jsonObject.getString("depositaryBank"))){
            invoice.setDepositaryBank(jsonObject.getString("depositaryBank"));
        }else {
            invoice.setDepositaryBank("");
        }
        if (!StringUtils.isBlank(jsonObject.getString("bankNumber"))){
            invoice.setBankNumber(jsonObject.getString("bankNumber"));
        }else {
            invoice.setBankNumber("");
        }
        if (!StringUtils.isBlank(jsonObject.getString("receiveName"))){
            invoice.setReceiveName(jsonObject.getString("receiveName"));
        }else {
            invoice.setReceiveName("");
        }
        if (!StringUtils.isBlank(jsonObject.getString("receiveTel"))){
            invoice.setReceiveTel(jsonObject.getString("receiveTel"));
        }else {
            invoice.setReceiveTel("");
        }
        if (!StringUtils.isBlank(jsonObject.getString("receiveAddress"))){
            invoice.setReciveAddress(jsonObject.getString("receiveAddress"));
        }else {
            invoice.setReciveAddress("");
        }
        if (!StringUtils.isBlank(jsonObject.getString("note"))){
            invoice.setNote(jsonObject.getString("note"));
        }else {
            invoice.setNote("");
        }
        return invoice;
    }
}
