package com.xq.myxuanqi.model.video;

import com.cloudibpm.core.Page;

public class VideoInformationPage extends Page {
    private VideoInformation [] pageEntities = new VideoInformation[0];

    public VideoInformationPage() {
    }

    public VideoInformationPage(int pageNo, int pageSize) {
        super(pageNo, pageSize);
    }

    public VideoInformation[] getPageEntities() {
        return pageEntities;
    }

    public void setPageEntities(VideoInformation[] pageEntities) {
        this.pageEntities = pageEntities;
    }
}
