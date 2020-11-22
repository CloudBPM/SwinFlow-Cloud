package com.xq.myxuanqi.model;

/**
 * Created by wm on 2019/3/15.
 */

public class UploadImageModel extends BaseModel {

    /**
     * status : 1
     * path : D:/data/org/00000000000001R/client/feedback/6710cb98-7852-49cd-a3fc-e4166590e7c8.jpg
     */

    private String status;
    private String path;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
