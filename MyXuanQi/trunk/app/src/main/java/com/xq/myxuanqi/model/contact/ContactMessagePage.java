package com.xq.myxuanqi.model.contact;

import com.cloudibpm.core.Page;

public class ContactMessagePage extends Page {
    private ContactMessage [] pageEntities = new ContactMessage[0];

    public ContactMessagePage() {
    }

    public ContactMessagePage(int pageNo, int pageSize) {
        super(pageNo, pageSize);
    }

    public ContactMessage[] getPageEntities() {
        return pageEntities;
    }

    public void setPageEntities(ContactMessage[] pageEntities) {
        this.pageEntities = pageEntities;
    }
}
