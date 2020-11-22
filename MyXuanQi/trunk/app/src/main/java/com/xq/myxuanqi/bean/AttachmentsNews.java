package com.xq.myxuanqi.bean;

import java.io.Serializable;

/**
 * Created by wm on 2019/3/9.
 */

public class AttachmentsNews implements Serializable{

    /**
     * owner : 00000000000001R
     * currOwner : null
     * filetype : image/jpeg
     * size : 4647
     * datatype : File
     * name : 100.jpg
     * id : 703618d2-e53b-41f9-b80a-1e2877fb84c4
     * lastupdate : 2019-03-14 15:58:53
     * suffix : jpg
     * value :
     * fileCount : 0
     * isDirctory : 0
     */

    private String owner;
    private Object currOwner;
    private String filetype;
    private int    size;
    private String datatype;
    private String name;
    private String id;
    private String lastupdate;
    private String suffix;
    private String value;
    private int    fileCount;
    private int    isDirctory;

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public Object getCurrOwner() {
        return currOwner;
    }

    public void setCurrOwner(Object currOwner) {
        this.currOwner = currOwner;
    }

    public String getFiletype() {
        return filetype;
    }

    public void setFiletype(String filetype) {
        this.filetype = filetype;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getDatatype() {
        return datatype;
    }

    public void setDatatype(String datatype) {
        this.datatype = datatype;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLastupdate() {
        return lastupdate;
    }

    public void setLastupdate(String lastupdate) {
        this.lastupdate = lastupdate;
    }

    public String getSuffix() {
        return suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public int getFileCount() {
        return fileCount;
    }

    public void setFileCount(int fileCount) {
        this.fileCount = fileCount;
    }

    public int getIsDirctory() {
        return isDirctory;
    }

    public void setIsDirctory(int isDirctory) {
        this.isDirctory = isDirctory;
    }
}
