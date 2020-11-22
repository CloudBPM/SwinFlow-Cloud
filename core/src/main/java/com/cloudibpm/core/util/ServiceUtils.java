package com.cloudibpm.core.util;


import com.alibaba.fastjson.JSON;
import com.cloudibpm.core.PageObject;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class ServiceUtils {
    /**
     * 用于条件查询时StringBuffer拼写sql
     *
     * @param sql      sql语句
     * @param hasWhere 该sql是否已经有where
     * @return
     */
    public static boolean appendWhereIfNeed(StringBuffer sql, boolean hasWhere) {
        if (!hasWhere) {
            sql.append(" WHERE ");
            return true;
        } else {
            sql.append(" AND ");
            return true;
        }
    }

    /**
     * 用于修改时StringBuffer拼写sql
     *
     * @param sql      sql语句
     * @param hasWhere 该sql是否已经有where
     * @return
     */
    public static boolean appendSetIfNeed(StringBuffer sql, boolean hasSet) {
        if (!hasSet) {
            sql.append(" SET ");
            return true;
        } else {
            sql.append(" AND ");
            return true;
        }
    }


    /**
     * 处理分页
     *
     * @param count    查询结果集数量
     * @param page     pageObject
     * @param pageNum  当前页数
     * @param pageSize 页容量
     * @param list     结果集
     * @return
     */
    public static PageObject dealPageObject(int count, PageObject page, int pageNum, int pageSize, List list) {
        if (count == 0) {
            page.setPageNo(0);
            page.setAllEntitiesCount(0);
            page.setAllPagesCount(0);
            page.setPageIndex(0);
            return page;
        } else {//判断total是否为0
            page.setPageNo(pageNum);
            page.setAllEntitiesCount(count);
            int n = count / pageSize;
            int m = count % pageSize;
            if (m > 0) {
                n = n + 1;
            }
            page.setAllPagesCount(n);
            page.setPageIndex((pageNum - 1) * pageNum);
            page.setPageEntities(list.toArray());
        }
        page.setPageSize(pageSize);
        return page;
    }

    public static Map<String, String> getNameValMap(Object obj, boolean isSort) {
        Map<String, String> map = null;
        if (isSort) {
            map = new TreeMap<String, String>();
        } else {
            map = new HashMap<String, String>();
        }

        Field[] fieldArr = obj.getClass().getDeclaredFields();
        try{
            for (Field field:fieldArr){
                field.setAccessible(true);
                if(field.get(obj) != null && !"".equals(field.get(obj).toString())){
                    map.put(field.getName(), JSON.toJSONString(field.get(obj)));
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return map;
    }

}
