package com.cloudibpm.core.appservice;

import com.cloudibpm.core.Page;

public class AndroidAppPluginPage extends Page {

    private AndroidAppPlugin [] pageEntities = new AndroidAppPlugin[0];

    public AndroidAppPluginPage() {
    }

    public AndroidAppPluginPage(int pageNo, int pageSize) {
        super(pageNo, pageSize);
    }

    public AndroidAppPlugin[] getPageEntities() {
        return pageEntities;
    }

    public void setPageEntities(AndroidAppPlugin[] pageEntities) {
        this.pageEntities = pageEntities;
    }
}
