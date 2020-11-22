package com.cloudibpm.core;

public class PageObject extends Page {

    private static final long serialVersionUID = -1047357675888370673L;
    private Object[] pageEntities = new Object[0];

    public PageObject(){

    }

    public PageObject(int pageNo, int pageSize){
        super(pageNo,pageSize);
    }

    public Object[] getPageEntities() {
        return pageEntities;
    }

    public void setPageEntities(Object[] pageEntities) {
        this.pageEntities = pageEntities;
    }

}