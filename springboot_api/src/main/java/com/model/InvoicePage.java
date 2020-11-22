package com.model;

import com.cloudibpm.core.Page;

/**
 * @author: yaofeng
 * @create:2019-06-18-16:32
 **/
public class InvoicePage extends Page {
    private static final long serialVersionUID =4377610937616750388L;
    private Invoice[] pageEntities = new Invoice[0];

    public InvoicePage() {

    }

    public InvoicePage(int pageNo, int pageSize) {
        super(pageNo, pageSize);
    }

    public Invoice[] getPageEntities() {
        return pageEntities;
    }

    public void setPageEntities(Invoice[] pageEntities) {
        this.pageEntities = pageEntities;
    }
}
