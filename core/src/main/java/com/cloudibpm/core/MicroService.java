package com.cloudibpm.core;

public class MicroService extends TreeNode {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 9199019168326192369L;
    private String keywords = null;
    /**
     * this property means this Java application can only be accessible
     * internally.
     */
    public static final int INTERNAL = 1;
    /**
     * this property means this Java application can be accessed publicly.
     */
    public static final int PUBLIC = 2;
    /**
     * 1: internal access; 2: public access.
     */
    private int accessType = INTERNAL;
    // 5：sms template；6：email template；
    // 7：web micro-service；8：Android APP micro-service plugin (APK)
    // 9：iOS APP micro-service plugin
    private int serviceType = -1;
    private String comments = null;
    private long createDateTime;
    private long lastupdate;
    private String securityAccessKey = null;
    // purchase price
    private double price = 0.0d;
    // usage price (rent price)
    private double usagePrice = 0.0d;
    // 0: developing(draft); 1: offline; 2: online
    private int status = 0;
    private long onlineDateTime = -1;
    private long offlineDateTime = -1;

    public MicroService() {
    }

    public MicroService(String id) {
        super(id);
    }

    /**
     * @return the keywords
     */
    public String getKeywords() {
        return keywords;
    }

    /**
     * @param keywords the keywords to set
     */
    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    /**
     * @return the accessType
     */
    public int getAccessType() {
        return accessType;
    }

    /**
     * @param accessType the accessType to set
     */
    public void setAccessType(int accessType) {
        this.accessType = accessType;
    }

    /**
     * @return the comments
     */
    public String getComments() {
        return comments;
    }

    /**
     * @param comments the comments to set
     */
    public void setComments(String comments) {
        this.comments = comments;
    }

    /**
     * @return the createDateTime
     */
    public long getCreateDateTime() {
        return createDateTime;
    }

    /**
     * @param createDateTime the createDateTime to set
     */
    public void setCreateDateTime(long createDateTime) {
        this.createDateTime = createDateTime;
    }

    /**
     * @return the lastupdate
     */
    public long getLastupdate() {
        return lastupdate;
    }

    /**
     * @param lastupdate the lastupdate to set
     */
    public void setLastupdate(long lastupdate) {
        this.lastupdate = lastupdate;
    }

    /**
     * @return the securityAccessKey
     */
    public String getSecurityAccessKey() {
        return securityAccessKey;
    }

    /**
     * @param securityAccessKey the securityAccessKey to set
     */
    public void setSecurityAccessKey(String securityAccessKey) {
        this.securityAccessKey = securityAccessKey;
    }

    /**
     * @return the price
     */
    public double getPrice() {
        return price;
    }

    /**
     * @param price the price to set
     */
    public void setPrice(double price) {
        this.price = price;
    }

    /**
     * @return the status
     */
    public int getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(int status) {
        this.status = status;
    }

    /**
     * @return the onlineDateTime
     */
    public long getOnlineDateTime() {
        return onlineDateTime;
    }

    /**
     * @param onlineDateTime the onlineDateTime to set
     */
    public void setOnlineDateTime(long onlineDateTime) {
        this.onlineDateTime = onlineDateTime;
    }

    /**
     * @return the offlineDateTime
     */
    public long getOfflineDateTime() {
        return offlineDateTime;
    }

    /**
     * @param offlineDateTime the offlineDateTime to set
     */
    public void setOfflineDateTime(long offlineDateTime) {
        this.offlineDateTime = offlineDateTime;
    }

    /**
     * @return
     */
    public double getUsagePrice() {
        return usagePrice;
    }

    /**
     * @param usagePrice
     */
    public void setUsagePrice(double usagePrice) {
        this.usagePrice = usagePrice;
    }

    public int getServiceType() {
        return serviceType;
    }

    public void setServiceType(int serviceType) {
        this.serviceType = serviceType;
    }
}
