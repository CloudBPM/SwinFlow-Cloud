package com.xq.myxuanqi.bean;

import com.google.gson.annotations.SerializedName;

import java.util.List;

/**
 * Created by wm on 2019/1/21.
 */

public class TelephoneLoginMessage {

    /**
     * data : {"sessionId":"SESSION_158d8e36f5efcae0c040d2ac5653acbd","login":{"statusCode":1,"user":{"id":"00000000000021w","name":"client2","owner":null,"currOwner":null,"passwd":null,"passwdExpirationDate":"2019-02-20T07:25:37.000+0000","givenname":"轩","surname":"琦","usedName":null,"gender":"F","birthday":"1922-12-30","bloodType":"O","age":96,"idType":"0","idNumber":null,"weight":0,"height":0,"country":"","province":"","city":"","county":"","address":"北京市天通苑190号楼1门201A","postcode":"100012","registrationDate":"2016-08-09T00:44:16.000+0000","email":"cdh@xuanqiyun.com","mobile":"18437980757","ownerName":null,"lastupdate":"2019-01-21T07:56:18.000+0000","isBanned":0,"banningDescription":null,"dirty":false,"loginCounting":0,"nation":"null","householdAddress":null,"householdPostcode":null,"fullName":"琦轩"},"staffships":[{"id":"0000000000000Dm","name":null,"owner":"00000000000001R","currOwner":null,"user":{"id":"00000000000021w","name":null,"owner":null,"currOwner":null,"passwd":null,"passwdExpirationDate":null,"givenname":null,"surname":null,"usedName":null,"gender":"M","birthday":null,"bloodType":"O","age":0,"idType":"0","idNumber":null,"weight":0,"height":0,"country":"","province":"","city":"","county":"","address":null,"postcode":null,"registrationDate":null,"email":null,"mobile":null,"ownerName":null,"lastupdate":null,"isBanned":0,"banningDescription":null,"dirty":false,"loginCounting":0,"nation":null,"householdAddress":null,"householdPostcode":null,"fullName":""},"professionalTitle":"2","staffCode":"0019","workPhoneNumber":null,"workMobileNumber":null,"workFaxNumber":null,"workEmail":"dhcao@sohu.com","officeLocation":"北京市1099号","onBoardingDate":"2016-04-03","resignDate":null,"resignDescription":null,"jobStatus":1,"workType":2,"workStatus":0,"lastupdate":"2016-09-06T08:27:58.000+0000","authorizations":["0000000006"],"currDepartment":null,"currPostion":null,"currGroup":null,"dirty":false,"hidden":false,"organizationName":"杭州轩琦信息科技有限公司"},{"id":null,"name":null,"owner":"00000000000001Kl","currOwner":null,"user":{"id":"00000000000021w","name":null,"owner":null,"currOwner":null,"passwd":null,"passwdExpirationDate":null,"givenname":null,"surname":null,"usedName":null,"gender":"M","birthday":null,"bloodType":"O","age":0,"idType":"0","idNumber":null,"weight":0,"height":0,"country":"","province":"","city":"","county":"","address":null,"postcode":null,"registrationDate":null,"email":null,"mobile":null,"ownerName":null,"lastupdate":null,"isBanned":0,"banningDescription":null,"dirty":false,"loginCounting":0,"nation":null,"householdAddress":null,"householdPostcode":null,"fullName":""},"professionalTitle":null,"staffCode":null,"workPhoneNumber":null,"workMobileNumber":null,"workFaxNumber":null,"workEmail":null,"officeLocation":null,"onBoardingDate":null,"resignDate":null,"resignDescription":null,"jobStatus":1,"workType":1,"workStatus":0,"lastupdate":null,"authorizations":["0000000006"],"currDepartment":null,"currPostion":null,"currGroup":null,"dirty":false,"hidden":false,"organizationName":null}],"positions":[{"id":"00000000000001OO","name":"受理","owner":"00000000000001R","currOwner":"00000000000001BB","parent":"00000000000001ON","children":[],"serialNumber":"00000000OJ","status":4,"categoryId":"00000000000001dI","category":null,"createDate":1534867200000,"lastupdate":1547454103000,"abbrName":"position abbr","rank":0,"x0":30.5,"y0":184.5,"x1":130.5,"y1":259.5,"classtypename":"Position"}],"attributes":{},"lastupdate":0,"createDatetime":0,"id":null,"creationTime":0,"sessionContext":null,"maxInactiveInterval":0,"lastAccessedTime":0,"servletContext":null,"attributeNames":null,"valueNames":[],"new":false}}
     * success : true
     * codeMessage : {"code":"1","message":"success"}
     */

    private DataBean data;
    private boolean         success;
    private CodeMessageBean codeMessage;

    public DataBean getData() {
        return data;
    }

    public void setData(DataBean data) {
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public CodeMessageBean getCodeMessage() {
        return codeMessage;
    }

    public void setCodeMessage(CodeMessageBean codeMessage) {
        this.codeMessage = codeMessage;
    }

    public static class DataBean {
        /**
         * sessionId : SESSION_158d8e36f5efcae0c040d2ac5653acbd
         * login : {"statusCode":1,"user":{"id":"00000000000021w","name":"client2","owner":null,"currOwner":null,"passwd":null,"passwdExpirationDate":"2019-02-20T07:25:37.000+0000","givenname":"轩","surname":"琦","usedName":null,"gender":"F","birthday":"1922-12-30","bloodType":"O","age":96,"idType":"0","idNumber":null,"weight":0,"height":0,"country":"","province":"","city":"","county":"","address":"北京市天通苑190号楼1门201A","postcode":"100012","registrationDate":"2016-08-09T00:44:16.000+0000","email":"cdh@xuanqiyun.com","mobile":"18437980757","ownerName":null,"lastupdate":"2019-01-21T07:56:18.000+0000","isBanned":0,"banningDescription":null,"dirty":false,"loginCounting":0,"nation":"null","householdAddress":null,"householdPostcode":null,"fullName":"琦轩"},"staffships":[{"id":"0000000000000Dm","name":null,"owner":"00000000000001R","currOwner":null,"user":{"id":"00000000000021w","name":null,"owner":null,"currOwner":null,"passwd":null,"passwdExpirationDate":null,"givenname":null,"surname":null,"usedName":null,"gender":"M","birthday":null,"bloodType":"O","age":0,"idType":"0","idNumber":null,"weight":0,"height":0,"country":"","province":"","city":"","county":"","address":null,"postcode":null,"registrationDate":null,"email":null,"mobile":null,"ownerName":null,"lastupdate":null,"isBanned":0,"banningDescription":null,"dirty":false,"loginCounting":0,"nation":null,"householdAddress":null,"householdPostcode":null,"fullName":""},"professionalTitle":"2","staffCode":"0019","workPhoneNumber":null,"workMobileNumber":null,"workFaxNumber":null,"workEmail":"dhcao@sohu.com","officeLocation":"北京市1099号","onBoardingDate":"2016-04-03","resignDate":null,"resignDescription":null,"jobStatus":1,"workType":2,"workStatus":0,"lastupdate":"2016-09-06T08:27:58.000+0000","authorizations":["0000000006"],"currDepartment":null,"currPostion":null,"currGroup":null,"dirty":false,"hidden":false,"organizationName":"杭州轩琦信息科技有限公司"},{"id":null,"name":null,"owner":"00000000000001Kl","currOwner":null,"user":{"id":"00000000000021w","name":null,"owner":null,"currOwner":null,"passwd":null,"passwdExpirationDate":null,"givenname":null,"surname":null,"usedName":null,"gender":"M","birthday":null,"bloodType":"O","age":0,"idType":"0","idNumber":null,"weight":0,"height":0,"country":"","province":"","city":"","county":"","address":null,"postcode":null,"registrationDate":null,"email":null,"mobile":null,"ownerName":null,"lastupdate":null,"isBanned":0,"banningDescription":null,"dirty":false,"loginCounting":0,"nation":null,"householdAddress":null,"householdPostcode":null,"fullName":""},"professionalTitle":null,"staffCode":null,"workPhoneNumber":null,"workMobileNumber":null,"workFaxNumber":null,"workEmail":null,"officeLocation":null,"onBoardingDate":null,"resignDate":null,"resignDescription":null,"jobStatus":1,"workType":1,"workStatus":0,"lastupdate":null,"authorizations":["0000000006"],"currDepartment":null,"currPostion":null,"currGroup":null,"dirty":false,"hidden":false,"organizationName":null}],"positions":[{"id":"00000000000001OO","name":"受理","owner":"00000000000001R","currOwner":"00000000000001BB","parent":"00000000000001ON","children":[],"serialNumber":"00000000OJ","status":4,"categoryId":"00000000000001dI","category":null,"createDate":1534867200000,"lastupdate":1547454103000,"abbrName":"position abbr","rank":0,"x0":30.5,"y0":184.5,"x1":130.5,"y1":259.5,"classtypename":"Position"}],"attributes":{},"lastupdate":0,"createDatetime":0,"id":null,"creationTime":0,"sessionContext":null,"maxInactiveInterval":0,"lastAccessedTime":0,"servletContext":null,"attributeNames":null,"valueNames":[],"new":false}
         */

        private String sessionId;
        private LoginBean login;

        public String getSessionId() {
            return sessionId;
        }

        public void setSessionId(String sessionId) {
            this.sessionId = sessionId;
        }

        public LoginBean getLogin() {
            return login;
        }

        public void setLogin(LoginBean login) {
            this.login = login;
        }

        public static class LoginBean {
            /**
             * statusCode : 1
             * user : {"id":"00000000000021w","name":"client2","owner":null,"currOwner":null,"passwd":null,"passwdExpirationDate":"2019-02-20T07:25:37.000+0000","givenname":"轩","surname":"琦","usedName":null,"gender":"F","birthday":"1922-12-30","bloodType":"O","age":96,"idType":"0","idNumber":null,"weight":0,"height":0,"country":"","province":"","city":"","county":"","address":"北京市天通苑190号楼1门201A","postcode":"100012","registrationDate":"2016-08-09T00:44:16.000+0000","email":"cdh@xuanqiyun.com","mobile":"18437980757","ownerName":null,"lastupdate":"2019-01-21T07:56:18.000+0000","isBanned":0,"banningDescription":null,"dirty":false,"loginCounting":0,"nation":"null","householdAddress":null,"householdPostcode":null,"fullName":"琦轩"}
             * staffships : [{"id":"0000000000000Dm","name":null,"owner":"00000000000001R","currOwner":null,"user":{"id":"00000000000021w","name":null,"owner":null,"currOwner":null,"passwd":null,"passwdExpirationDate":null,"givenname":null,"surname":null,"usedName":null,"gender":"M","birthday":null,"bloodType":"O","age":0,"idType":"0","idNumber":null,"weight":0,"height":0,"country":"","province":"","city":"","county":"","address":null,"postcode":null,"registrationDate":null,"email":null,"mobile":null,"ownerName":null,"lastupdate":null,"isBanned":0,"banningDescription":null,"dirty":false,"loginCounting":0,"nation":null,"householdAddress":null,"householdPostcode":null,"fullName":""},"professionalTitle":"2","staffCode":"0019","workPhoneNumber":null,"workMobileNumber":null,"workFaxNumber":null,"workEmail":"dhcao@sohu.com","officeLocation":"北京市1099号","onBoardingDate":"2016-04-03","resignDate":null,"resignDescription":null,"jobStatus":1,"workType":2,"workStatus":0,"lastupdate":"2016-09-06T08:27:58.000+0000","authorizations":["0000000006"],"currDepartment":null,"currPostion":null,"currGroup":null,"dirty":false,"hidden":false,"organizationName":"杭州轩琦信息科技有限公司"},{"id":null,"name":null,"owner":"00000000000001Kl","currOwner":null,"user":{"id":"00000000000021w","name":null,"owner":null,"currOwner":null,"passwd":null,"passwdExpirationDate":null,"givenname":null,"surname":null,"usedName":null,"gender":"M","birthday":null,"bloodType":"O","age":0,"idType":"0","idNumber":null,"weight":0,"height":0,"country":"","province":"","city":"","county":"","address":null,"postcode":null,"registrationDate":null,"email":null,"mobile":null,"ownerName":null,"lastupdate":null,"isBanned":0,"banningDescription":null,"dirty":false,"loginCounting":0,"nation":null,"householdAddress":null,"householdPostcode":null,"fullName":""},"professionalTitle":null,"staffCode":null,"workPhoneNumber":null,"workMobileNumber":null,"workFaxNumber":null,"workEmail":null,"officeLocation":null,"onBoardingDate":null,"resignDate":null,"resignDescription":null,"jobStatus":1,"workType":1,"workStatus":0,"lastupdate":null,"authorizations":["0000000006"],"currDepartment":null,"currPostion":null,"currGroup":null,"dirty":false,"hidden":false,"organizationName":null}]
             * positions : [{"id":"00000000000001OO","name":"受理","owner":"00000000000001R","currOwner":"00000000000001BB","parent":"00000000000001ON","children":[],"serialNumber":"00000000OJ","status":4,"categoryId":"00000000000001dI","category":null,"createDate":1534867200000,"lastupdate":1547454103000,"abbrName":"position abbr","rank":0,"x0":30.5,"y0":184.5,"x1":130.5,"y1":259.5,"classtypename":"Position"}]
             * attributes : {}
             * lastupdate : 0
             * createDatetime : 0
             * id : null
             * creationTime : 0
             * sessionContext : null
             * maxInactiveInterval : 0
             * lastAccessedTime : 0
             * servletContext : null
             * attributeNames : null
             * valueNames : []
             * new : false
             */

            private int statusCode;
            private UserBean             user;
            private AttributesBean       attributes;
            private int                  lastupdate;
            private int                  createDatetime;
            private Object               id;
            private int                  creationTime;
            private Object               sessionContext;
            private int                  maxInactiveInterval;
            private int                  lastAccessedTime;
            private Object               servletContext;
            private Object               attributeNames;
            @SerializedName("new")
            private boolean              newX;
            private List<StaffshipsBean> staffships;
            private List<PositionsBean>  positions;
            private List<?>              valueNames;

            public int getStatusCode() {
                return statusCode;
            }

            public void setStatusCode(int statusCode) {
                this.statusCode = statusCode;
            }

            public UserBean getUser() {
                return user;
            }

            public void setUser(UserBean user) {
                this.user = user;
            }

            public AttributesBean getAttributes() {
                return attributes;
            }

            public void setAttributes(AttributesBean attributes) {
                this.attributes = attributes;
            }

            public int getLastupdate() {
                return lastupdate;
            }

            public void setLastupdate(int lastupdate) {
                this.lastupdate = lastupdate;
            }

            public int getCreateDatetime() {
                return createDatetime;
            }

            public void setCreateDatetime(int createDatetime) {
                this.createDatetime = createDatetime;
            }

            public Object getId() {
                return id;
            }

            public void setId(Object id) {
                this.id = id;
            }

            public int getCreationTime() {
                return creationTime;
            }

            public void setCreationTime(int creationTime) {
                this.creationTime = creationTime;
            }

            public Object getSessionContext() {
                return sessionContext;
            }

            public void setSessionContext(Object sessionContext) {
                this.sessionContext = sessionContext;
            }

            public int getMaxInactiveInterval() {
                return maxInactiveInterval;
            }

            public void setMaxInactiveInterval(int maxInactiveInterval) {
                this.maxInactiveInterval = maxInactiveInterval;
            }

            public int getLastAccessedTime() {
                return lastAccessedTime;
            }

            public void setLastAccessedTime(int lastAccessedTime) {
                this.lastAccessedTime = lastAccessedTime;
            }

            public Object getServletContext() {
                return servletContext;
            }

            public void setServletContext(Object servletContext) {
                this.servletContext = servletContext;
            }

            public Object getAttributeNames() {
                return attributeNames;
            }

            public void setAttributeNames(Object attributeNames) {
                this.attributeNames = attributeNames;
            }

            public boolean isNewX() {
                return newX;
            }

            public void setNewX(boolean newX) {
                this.newX = newX;
            }

            public List<StaffshipsBean> getStaffships() {
                return staffships;
            }

            public void setStaffships(List<StaffshipsBean> staffships) {
                this.staffships = staffships;
            }

            public List<PositionsBean> getPositions() {
                return positions;
            }

            public void setPositions(List<PositionsBean> positions) {
                this.positions = positions;
            }

            public List<?> getValueNames() {
                return valueNames;
            }

            public void setValueNames(List<?> valueNames) {
                this.valueNames = valueNames;
            }

            public static class UserBean {
            }

            public static class AttributesBean {
            }

            public static class StaffshipsBean {
                /**
                 * id : 0000000000000Dm
                 * name : null
                 * owner : 00000000000001R
                 * currOwner : null
                 * user : {"id":"00000000000021w","name":null,"owner":null,"currOwner":null,"passwd":null,"passwdExpirationDate":null,"givenname":null,"surname":null,"usedName":null,"gender":"M","birthday":null,"bloodType":"O","age":0,"idType":"0","idNumber":null,"weight":0,"height":0,"country":"","province":"","city":"","county":"","address":null,"postcode":null,"registrationDate":null,"email":null,"mobile":null,"ownerName":null,"lastupdate":null,"isBanned":0,"banningDescription":null,"dirty":false,"loginCounting":0,"nation":null,"householdAddress":null,"householdPostcode":null,"fullName":""}
                 * professionalTitle : 2
                 * staffCode : 0019
                 * workPhoneNumber : null
                 * workMobileNumber : null
                 * workFaxNumber : null
                 * workEmail : dhcao@sohu.com
                 * officeLocation : 北京市1099号
                 * onBoardingDate : 2016-04-03
                 * resignDate : null
                 * resignDescription : null
                 * jobStatus : 1
                 * workType : 2
                 * workStatus : 0
                 * lastupdate : 2016-09-06T08:27:58.000+0000
                 * authorizations : ["0000000006"]
                 * currDepartment : null
                 * currPostion : null
                 * currGroup : null
                 * dirty : false
                 * hidden : false
                 * organizationName : 杭州轩琦信息科技有限公司
                 */

                private String id;
                private Object       name;
                private String       owner;
                private Object       currOwner;
                private UserBeanX    user;
                private String       professionalTitle;
                private String       staffCode;
                private Object       workPhoneNumber;
                private Object       workMobileNumber;
                private Object       workFaxNumber;
                private String       workEmail;
                private String       officeLocation;
                private String       onBoardingDate;
                private Object       resignDate;
                private Object       resignDescription;
                private int          jobStatus;
                private int          workType;
                private int          workStatus;
                private String       lastupdate;
                private Object       currDepartment;
                private Object       currPostion;
                private Object       currGroup;
                private boolean      dirty;
                private boolean      hidden;
                private String       organizationName;
                private List<String> authorizations;

                public String getId() {
                    return id;
                }

                public void setId(String id) {
                    this.id = id;
                }

                public Object getName() {
                    return name;
                }

                public void setName(Object name) {
                    this.name = name;
                }

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

                public UserBeanX getUser() {
                    return user;
                }

                public void setUser(UserBeanX user) {
                    this.user = user;
                }

                public String getProfessionalTitle() {
                    return professionalTitle;
                }

                public void setProfessionalTitle(String professionalTitle) {
                    this.professionalTitle = professionalTitle;
                }

                public String getStaffCode() {
                    return staffCode;
                }

                public void setStaffCode(String staffCode) {
                    this.staffCode = staffCode;
                }

                public Object getWorkPhoneNumber() {
                    return workPhoneNumber;
                }

                public void setWorkPhoneNumber(Object workPhoneNumber) {
                    this.workPhoneNumber = workPhoneNumber;
                }

                public Object getWorkMobileNumber() {
                    return workMobileNumber;
                }

                public void setWorkMobileNumber(Object workMobileNumber) {
                    this.workMobileNumber = workMobileNumber;
                }

                public Object getWorkFaxNumber() {
                    return workFaxNumber;
                }

                public void setWorkFaxNumber(Object workFaxNumber) {
                    this.workFaxNumber = workFaxNumber;
                }

                public String getWorkEmail() {
                    return workEmail;
                }

                public void setWorkEmail(String workEmail) {
                    this.workEmail = workEmail;
                }

                public String getOfficeLocation() {
                    return officeLocation;
                }

                public void setOfficeLocation(String officeLocation) {
                    this.officeLocation = officeLocation;
                }

                public String getOnBoardingDate() {
                    return onBoardingDate;
                }

                public void setOnBoardingDate(String onBoardingDate) {
                    this.onBoardingDate = onBoardingDate;
                }

                public Object getResignDate() {
                    return resignDate;
                }

                public void setResignDate(Object resignDate) {
                    this.resignDate = resignDate;
                }

                public Object getResignDescription() {
                    return resignDescription;
                }

                public void setResignDescription(Object resignDescription) {
                    this.resignDescription = resignDescription;
                }

                public int getJobStatus() {
                    return jobStatus;
                }

                public void setJobStatus(int jobStatus) {
                    this.jobStatus = jobStatus;
                }

                public int getWorkType() {
                    return workType;
                }

                public void setWorkType(int workType) {
                    this.workType = workType;
                }

                public int getWorkStatus() {
                    return workStatus;
                }

                public void setWorkStatus(int workStatus) {
                    this.workStatus = workStatus;
                }

                public String getLastupdate() {
                    return lastupdate;
                }

                public void setLastupdate(String lastupdate) {
                    this.lastupdate = lastupdate;
                }

                public Object getCurrDepartment() {
                    return currDepartment;
                }

                public void setCurrDepartment(Object currDepartment) {
                    this.currDepartment = currDepartment;
                }

                public Object getCurrPostion() {
                    return currPostion;
                }

                public void setCurrPostion(Object currPostion) {
                    this.currPostion = currPostion;
                }

                public Object getCurrGroup() {
                    return currGroup;
                }

                public void setCurrGroup(Object currGroup) {
                    this.currGroup = currGroup;
                }

                public boolean isDirty() {
                    return dirty;
                }

                public void setDirty(boolean dirty) {
                    this.dirty = dirty;
                }

                public boolean isHidden() {
                    return hidden;
                }

                public void setHidden(boolean hidden) {
                    this.hidden = hidden;
                }

                public String getOrganizationName() {
                    return organizationName;
                }

                public void setOrganizationName(String organizationName) {
                    this.organizationName = organizationName;
                }

                public List<String> getAuthorizations() {
                    return authorizations;
                }

                public void setAuthorizations(List<String> authorizations) {
                    this.authorizations = authorizations;
                }

                public static class UserBeanX {
                    /**
                     * id : 00000000000021w
                     * name : null
                     * owner : null
                     * currOwner : null
                     * passwd : null
                     * passwdExpirationDate : null
                     * givenname : null
                     * surname : null
                     * usedName : null
                     * gender : M
                     * birthday : null
                     * bloodType : O
                     * age : 0
                     * idType : 0
                     * idNumber : null
                     * weight : 0
                     * height : 0
                     * country :
                     * province :
                     * city :
                     * county :
                     * address : null
                     * postcode : null
                     * registrationDate : null
                     * email : null
                     * mobile : null
                     * ownerName : null
                     * lastupdate : null
                     * isBanned : 0
                     * banningDescription : null
                     * dirty : false
                     * loginCounting : 0
                     * nation : null
                     * householdAddress : null
                     * householdPostcode : null
                     * fullName :
                     */

                    private String id;
                    private Object  name;
                    private Object  owner;
                    private Object  currOwner;
                    private Object  passwd;
                    private Object  passwdExpirationDate;
                    private Object  givenname;
                    private Object  surname;
                    private Object  usedName;
                    private String  gender;
                    private Object  birthday;
                    private String  bloodType;
                    private int     age;
                    private String  idType;
                    private Object  idNumber;
                    private int     weight;
                    private int     height;
                    private String  country;
                    private String  province;
                    private String  city;
                    private String  county;
                    private Object  address;
                    private Object  postcode;
                    private Object  registrationDate;
                    private Object  email;
                    private Object  mobile;
                    private Object  ownerName;
                    private Object  lastupdate;
                    private int     isBanned;
                    private Object  banningDescription;
                    private boolean dirty;
                    private int     loginCounting;
                    private Object  nation;
                    private Object  householdAddress;
                    private Object  householdPostcode;
                    private String  fullName;

                    public String getId() {
                        return id;
                    }

                    public void setId(String id) {
                        this.id = id;
                    }

                    public Object getName() {
                        return name;
                    }

                    public void setName(Object name) {
                        this.name = name;
                    }

                    public Object getOwner() {
                        return owner;
                    }

                    public void setOwner(Object owner) {
                        this.owner = owner;
                    }

                    public Object getCurrOwner() {
                        return currOwner;
                    }

                    public void setCurrOwner(Object currOwner) {
                        this.currOwner = currOwner;
                    }

                    public Object getPasswd() {
                        return passwd;
                    }

                    public void setPasswd(Object passwd) {
                        this.passwd = passwd;
                    }

                    public Object getPasswdExpirationDate() {
                        return passwdExpirationDate;
                    }

                    public void setPasswdExpirationDate(Object passwdExpirationDate) {
                        this.passwdExpirationDate = passwdExpirationDate;
                    }

                    public Object getGivenname() {
                        return givenname;
                    }

                    public void setGivenname(Object givenname) {
                        this.givenname = givenname;
                    }

                    public Object getSurname() {
                        return surname;
                    }

                    public void setSurname(Object surname) {
                        this.surname = surname;
                    }

                    public Object getUsedName() {
                        return usedName;
                    }

                    public void setUsedName(Object usedName) {
                        this.usedName = usedName;
                    }

                    public String getGender() {
                        return gender;
                    }

                    public void setGender(String gender) {
                        this.gender = gender;
                    }

                    public Object getBirthday() {
                        return birthday;
                    }

                    public void setBirthday(Object birthday) {
                        this.birthday = birthday;
                    }

                    public String getBloodType() {
                        return bloodType;
                    }

                    public void setBloodType(String bloodType) {
                        this.bloodType = bloodType;
                    }

                    public int getAge() {
                        return age;
                    }

                    public void setAge(int age) {
                        this.age = age;
                    }

                    public String getIdType() {
                        return idType;
                    }

                    public void setIdType(String idType) {
                        this.idType = idType;
                    }

                    public Object getIdNumber() {
                        return idNumber;
                    }

                    public void setIdNumber(Object idNumber) {
                        this.idNumber = idNumber;
                    }

                    public int getWeight() {
                        return weight;
                    }

                    public void setWeight(int weight) {
                        this.weight = weight;
                    }

                    public int getHeight() {
                        return height;
                    }

                    public void setHeight(int height) {
                        this.height = height;
                    }

                    public String getCountry() {
                        return country;
                    }

                    public void setCountry(String country) {
                        this.country = country;
                    }

                    public String getProvince() {
                        return province;
                    }

                    public void setProvince(String province) {
                        this.province = province;
                    }

                    public String getCity() {
                        return city;
                    }

                    public void setCity(String city) {
                        this.city = city;
                    }

                    public String getCounty() {
                        return county;
                    }

                    public void setCounty(String county) {
                        this.county = county;
                    }

                    public Object getAddress() {
                        return address;
                    }

                    public void setAddress(Object address) {
                        this.address = address;
                    }

                    public Object getPostcode() {
                        return postcode;
                    }

                    public void setPostcode(Object postcode) {
                        this.postcode = postcode;
                    }

                    public Object getRegistrationDate() {
                        return registrationDate;
                    }

                    public void setRegistrationDate(Object registrationDate) {
                        this.registrationDate = registrationDate;
                    }

                    public Object getEmail() {
                        return email;
                    }

                    public void setEmail(Object email) {
                        this.email = email;
                    }

                    public Object getMobile() {
                        return mobile;
                    }

                    public void setMobile(Object mobile) {
                        this.mobile = mobile;
                    }

                    public Object getOwnerName() {
                        return ownerName;
                    }

                    public void setOwnerName(Object ownerName) {
                        this.ownerName = ownerName;
                    }

                    public Object getLastupdate() {
                        return lastupdate;
                    }

                    public void setLastupdate(Object lastupdate) {
                        this.lastupdate = lastupdate;
                    }

                    public int getIsBanned() {
                        return isBanned;
                    }

                    public void setIsBanned(int isBanned) {
                        this.isBanned = isBanned;
                    }

                    public Object getBanningDescription() {
                        return banningDescription;
                    }

                    public void setBanningDescription(Object banningDescription) {
                        this.banningDescription = banningDescription;
                    }

                    public boolean isDirty() {
                        return dirty;
                    }

                    public void setDirty(boolean dirty) {
                        this.dirty = dirty;
                    }

                    public int getLoginCounting() {
                        return loginCounting;
                    }

                    public void setLoginCounting(int loginCounting) {
                        this.loginCounting = loginCounting;
                    }

                    public Object getNation() {
                        return nation;
                    }

                    public void setNation(Object nation) {
                        this.nation = nation;
                    }

                    public Object getHouseholdAddress() {
                        return householdAddress;
                    }

                    public void setHouseholdAddress(Object householdAddress) {
                        this.householdAddress = householdAddress;
                    }

                    public Object getHouseholdPostcode() {
                        return householdPostcode;
                    }

                    public void setHouseholdPostcode(Object householdPostcode) {
                        this.householdPostcode = householdPostcode;
                    }

                    public String getFullName() {
                        return fullName;
                    }

                    public void setFullName(String fullName) {
                        this.fullName = fullName;
                    }
                }
            }

            public static class PositionsBean {
                /**
                 * id : 00000000000001OO
                 * name : 受理
                 * owner : 00000000000001R
                 * currOwner : 00000000000001BB
                 * parent : 00000000000001ON
                 * children : []
                 * serialNumber : 00000000OJ
                 * status : 4
                 * categoryId : 00000000000001dI
                 * category : null
                 * createDate : 1534867200000
                 * lastupdate : 1547454103000
                 * abbrName : position abbr
                 * rank : 0
                 * x0 : 30.5
                 * y0 : 184.5
                 * x1 : 130.5
                 * y1 : 259.5
                 * classtypename : Position
                 */

                private String id;
                private String  name;
                private String  owner;
                private String  currOwner;
                private String  parent;
                private String  serialNumber;
                private int     status;
                private String  categoryId;
                private Object  category;
                private long    createDate;
                private long    lastupdate;
                private String  abbrName;
                private int     rank;
                private double  x0;
                private double  y0;
                private double  x1;
                private double  y1;
                private String  classtypename;
                private List<?> children;

                public String getId() {
                    return id;
                }

                public void setId(String id) {
                    this.id = id;
                }

                public String getName() {
                    return name;
                }

                public void setName(String name) {
                    this.name = name;
                }

                public String getOwner() {
                    return owner;
                }

                public void setOwner(String owner) {
                    this.owner = owner;
                }

                public String getCurrOwner() {
                    return currOwner;
                }

                public void setCurrOwner(String currOwner) {
                    this.currOwner = currOwner;
                }

                public String getParent() {
                    return parent;
                }

                public void setParent(String parent) {
                    this.parent = parent;
                }

                public String getSerialNumber() {
                    return serialNumber;
                }

                public void setSerialNumber(String serialNumber) {
                    this.serialNumber = serialNumber;
                }

                public int getStatus() {
                    return status;
                }

                public void setStatus(int status) {
                    this.status = status;
                }

                public String getCategoryId() {
                    return categoryId;
                }

                public void setCategoryId(String categoryId) {
                    this.categoryId = categoryId;
                }

                public Object getCategory() {
                    return category;
                }

                public void setCategory(Object category) {
                    this.category = category;
                }

                public long getCreateDate() {
                    return createDate;
                }

                public void setCreateDate(long createDate) {
                    this.createDate = createDate;
                }

                public long getLastupdate() {
                    return lastupdate;
                }

                public void setLastupdate(long lastupdate) {
                    this.lastupdate = lastupdate;
                }

                public String getAbbrName() {
                    return abbrName;
                }

                public void setAbbrName(String abbrName) {
                    this.abbrName = abbrName;
                }

                public int getRank() {
                    return rank;
                }

                public void setRank(int rank) {
                    this.rank = rank;
                }

                public double getX0() {
                    return x0;
                }

                public void setX0(double x0) {
                    this.x0 = x0;
                }

                public double getY0() {
                    return y0;
                }

                public void setY0(double y0) {
                    this.y0 = y0;
                }

                public double getX1() {
                    return x1;
                }

                public void setX1(double x1) {
                    this.x1 = x1;
                }

                public double getY1() {
                    return y1;
                }

                public void setY1(double y1) {
                    this.y1 = y1;
                }

                public String getClasstypename() {
                    return classtypename;
                }

                public void setClasstypename(String classtypename) {
                    this.classtypename = classtypename;
                }

                public List<?> getChildren() {
                    return children;
                }

                public void setChildren(List<?> children) {
                    this.children = children;
                }
            }
        }
    }

    public static class CodeMessageBean {
        /**
         * code : 1
         * message : success
         */

        private String code;
        private String message;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
