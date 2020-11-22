package com.cloudibpm.core.user.model;

import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.Staff;

import java.util.*;

public class OtherComponents {

    public static List<Map<String,String>> getComponents(Login login){
        List<Map<String,String>> list=new ArrayList<>();
        Map<String,Map<String,String>> components=setComponents();
        Staff[] staffs = login.getStaffships();
        Set<String> auths=new HashSet<>();
        for (Staff staff : staffs) {
            auths.addAll(Arrays.asList(staff.getAuthorizations()));
        }
        list.add(setItem("首页","/client"));
        for(String item:auths){
            list.add(components.get(item));
        }
        return list;
    }


    private static Map<String,Map<String,String>> setComponents(){
        Map<String,Map<String,String>> map=new HashMap<>();
        map.put("0000000001",setItem("应用坊","/pm"));
        map.put("0000000002",setItem("组织人事部","/om"));
        map.put("0000000003",setItem("微服务库","/am"));
        map.put("0000000004",setItem("表单居","/fm"));
        map.put("0000000005",setItem("服务台","/admin"));
        map.put("0000000006",setItem("我的轩琦","/client"));
        map.put("0000000007",setItem("服务器","/svm"));
        map.put("0000000008",setItem("大数据","/bdm"));
        map.put("0000000009",setItem("账房","/blm"));
        return map;
    }

    private static Map<String,String> setItem(String name,String url){
        Map<String,String> map=new HashMap<>();
        map.put("name",name);
        map.put("url",url);
        return map;
    }
}
