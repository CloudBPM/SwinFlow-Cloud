/**
 *
 */
package com.cloudibpm.core.data;

import com.cloudibpm.core.buildtime.wfprocess.WfProcess;

import java.util.regex.Pattern;

/**
 * @author Dahai Cao created on 2017-11-27
 *
 */
public class FileConstant extends Constant {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4388771534914543237L;
    private String suffix = ""; // suffix name or extension name .pdf, .txt
    private long size = -1; // long integer
    private String lastupdate = ""; // 2017-10-02 16:01:10
    private String filetype = "application/octet-stream";
    private int isDirctory = 0; // 0: file; 1: directory
    private long fileCount = 0; // if directory, this is file count

    /**
     *
     */
    public FileConstant() {
        setName("空文件对象");
        setDatatype(DataType.FILE);
    }

    @Override
    public Object clone(WfProcess owner) {
        FileConstant d = new FileConstant();
        d.setId(this.getId());
        d.setName(this.getName());
        d.suffix = this.suffix;
        d.size = this.size;
        d.lastupdate = this.lastupdate;
        d.filetype = this.filetype;
        d.setCurrOwner(this.getCurrOwner());
        d.setOwner(this.getOwner());
        d.setIsDirctory(this.isDirctory);
        d.setFileCount(this.fileCount);
        return d;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof FileConstant) {
            if ((this.getId() != null && this.getId().equals(((FileConstant) obj).getId()))
                    && (this.getName() != null && this.getName().equals(((FileConstant) obj).getName()))
                    && (this.getSuffix().equals(((FileConstant) obj).getSuffix()))
                    && (this.getSize() == ((FileConstant) obj).getSize())
                    && (this.getLastupdate() != null
                    && this.getLastupdate().equals(((FileConstant) obj).getLastupdate()))) {
                return true;
            }
        } else if (obj instanceof String) {// it is used to recognize Expression
            if (this.getName().equals(obj)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public String toExpressionString() {
        return "C@" + this.getDatatype() + "@" + this.getId() + "|" + this.getName() + "|" + this.suffix + "|"
                + this.size + "|" + this.lastupdate + "|" + this.filetype + "|" + this.getCurrOwner() + "|"
                + this.getOwner() + "|" + this.isDirctory + "|" + this.fileCount;
    }

    @Override
    public void parseString(String str) {
        if (str != null && str != "") {
            String[] ary = str.split("@");
            this.setDatatype(ary[1]);
            String[] ary1 = ary[2].split(Pattern.quote("|"));
            if (ary1.length > 0)
                this.setId(ary1[0]);
            if (ary1.length > 1)
                this.setName(ary1[1]);
            if (ary1.length > 2)
                this.suffix = ary1[2];
            if (ary1.length > 3)
                this.size = Long.parseLong(ary1[3]);
            if (ary1.length > 4)
                this.lastupdate = ary1[4];
            if (ary1.length > 5)
                this.filetype = ary1[5];
            if (ary1.length > 6)
                this.setCurrOwner(ary1[6]);
            if (ary1.length > 7)
                this.setOwner(ary1[7]);
            if (ary1.length > 8)
                this.setIsDirctory(Integer.parseInt(ary1[8]));
            if (ary1.length > 9)
                this.setFileCount(Integer.parseInt(ary1[9]));
        }
    }

    @Override
    public String toString() {
        return this.getName();
    }

    /**
     * @return the suffix
     */
    public String getSuffix() {
        return suffix;
    }

    /**
     * @param suffix
     *            the suffix to set
     */
    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }

    /**
     * @return the size
     */
    public long getSize() {
        return size;
    }

    /**
     * @param size
     *            the size to set
     */
    public void setSize(long size) {
        this.size = size;
    }

    /**
     * @return the lastupdate
     */
    public String getLastupdate() {
        return lastupdate;
    }

    /**
     * @param lastupdate
     *            the lastupdate to set
     */
    public void setLastupdate(String lastupdate) {
        this.lastupdate = lastupdate;
    }

    /**
     * @return the filetype
     */
    public String getFiletype() {
        return filetype;
    }

    /**
     * @param filetype
     *            the filetype to set
     */
    public void setFiletype(String filetype) {
        this.filetype = filetype;
    }

    public int getIsDirctory() {
        return isDirctory;
    }

    public void setIsDirctory(int isDirctory) {
        this.isDirctory = isDirctory;
    }

    public long getFileCount() {
        return fileCount;
    }

    public void setFileCount(long fileCount) {
        this.fileCount = fileCount;
    }
}