package com.cloudibpm.core.user;

import org.apache.commons.lang3.StringUtils;

import java.util.HashSet;
import java.util.Set;

public enum AuthorityEnum {
    PM("pm","应用坊", "0000000001"),
    OM("om","组织人事部", "0000000002"),
    AM("am","微服务库", "0000000003"),
    FM("fm","表单居", "0000000004"),
    ADMIN("admin","服务台", "0000000005"),
    CLIENT("client","我的轩琦", "0000000006"),
    SVM("svm","服务器", "0000000007"),
    BDM("bdm","大数据", "0000000008"),
    BLM("blm","账房", "0000000009"),
    LOGIN("login","认证服务","0000000010"),
    REGISTER("register","注册服务","0000000011"),
    ;
    private String systemFunction;

    private String description;

    private String pk;

    
    AuthorityEnum(String systemFunction, String description, String pk) {
        this.systemFunction = systemFunction;
        this.description = description;
        this.pk = pk;
    }

    public String getSystemFunction() {
        return systemFunction;
    }

    public String getDescription() {
        return description;
    }

    public String getPk() {
        return pk;
    }

    public static AuthorityEnum findByPk(String pk){
        for(AuthorityEnum authorityEnum:AuthorityEnum.values()){
            if(StringUtils.equals(pk,authorityEnum.getPk())){
                return authorityEnum;
            }
        }
        return null;
    }

    public static Set<AuthorityEnum> findByPks(Set<String> pks){
        Set<AuthorityEnum> set=new HashSet<>();
        pks.forEach(item->set.add(findByPk(item)));
        return set;
    }


    
}
