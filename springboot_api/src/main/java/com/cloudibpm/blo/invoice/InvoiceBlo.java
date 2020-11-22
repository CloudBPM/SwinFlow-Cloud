package com.cloudibpm.blo.invoice;

import com.cloudibpm.core.util.serviceresult.ServiceResult;
import com.cloudibpm.eso.invoice.InvoiceEso;
import com.model.Invoice;
import com.model.InvoicePage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author: yaofeng
 * @create:2019-06-17-11:18
 **/
@Service
public class InvoiceBlo {
    private final InvoiceEso invoiceEso;

    @Autowired
    public InvoiceBlo(InvoiceEso invoiceEso) {
        this.invoiceEso = invoiceEso;
    }

    @Transactional
    public ServiceResult applyInvoice(Invoice invoice, String userId, String orderId) {
        int num = invoiceEso.insertInvoice(invoice,userId,orderId);
        if (num>0){
            return ServiceResult.success();
        }else {
            return ServiceResult.error(1001,"提交失败");
        }
    }

    public ServiceResult queryInvoice(String userId) {
        List<Invoice> invoiceList = invoiceEso.selectByUserId(userId);
        if (invoiceList.size()>0){
            return ServiceResult.success(invoiceList);
        }else {
            return ServiceResult.error(1002,"暂无完成订单");
        }
    }

    public ServiceResult queryAllInvoice(String pn, String psz, String cond) {
        InvoicePage page = new InvoicePage(Integer.parseInt(pn), Integer.parseInt(psz));
        long total = 0L;
        total = invoiceEso.count(cond);
        if (total == 0L) {
            page.setPageSize(Integer.parseInt(psz));
            page.setPageNo(1);
            page.setAllEntitiesCount(0);
            page.setAllPagesCount(0);
            page.setPageIndex(0);
        } else {
            page.setPageSize(Integer.parseInt(psz));
            if (cond == null || cond.equals("")) {
                cond = "";
                page.setPageNo(Integer.parseInt(pn));
                page.setAllEntitiesCount(total);
                long n = total / Integer.parseInt(psz);
                long m = total % Integer.parseInt(psz);
                if (m > 0) {
                    n = n + 1;
                }
                page.setAllPagesCount(n);
                int pageindex = (Integer.parseInt(pn) - 1) * Integer.parseInt(psz); // 跳过的数据条数
                page.setPageIndex(pageindex);
                List<Invoice> invoiceList = invoiceEso.queryAll(pageindex, Integer.parseInt(psz));
                page.setPageEntities(invoiceList.toArray(new Invoice[invoiceList.size()]));
            } else {
                page.setPageNo(Integer.parseInt(pn));
                page.setAllEntitiesCount(total);
                long n = total / Integer.parseInt(psz);
                long m = total % Integer.parseInt(psz);
                if (m > 0) {
                    n = n + 1;
                }
                    page.setAllPagesCount(n);
                int pageindex = (Integer.parseInt(pn) - 1) * Integer.parseInt(psz); // 跳过的数据条数
                List<Invoice> invoiceList = invoiceEso.queryByCondition(cond, pageindex, Integer.parseInt(psz));
                page.setPageEntities(invoiceList.toArray(new Invoice[invoiceList.size()]));
                }

            }
        return ServiceResult.success(page);
        }

    @Transactional
    public ServiceResult auditInvoice(String id) {
        int num = invoiceEso.updateById(id);
        if (num>0){
            return  ServiceResult.success();
        }else {
            return ServiceResult.error(1003,"发票开具失败");
        }
    }

    public ServiceResult queryByInvoiceId(String invoiceId) {
        Invoice invoice = invoiceEso.queryByInvoiceId(invoiceId);
        if (invoice!=null){
            return ServiceResult.success(invoice);
        }else {
            return ServiceResult.error(1004,"没有查询到改发票");
        }
    }
}
