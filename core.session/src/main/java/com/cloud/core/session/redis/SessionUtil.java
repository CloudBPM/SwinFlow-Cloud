package com.cloud.core.session.redis;

import org.apache.commons.lang3.StringUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public class SessionUtil {
    public static String findSessionId(HttpServletRequest request){
        Cookie[] cookies = request.getCookies();
        Cookie cookie = null;
        String sessionId = null;
        if(cookies!=null){
            for (Cookie item : cookies) {
                if (StringUtils.equals("sessionId", item.getName())) cookie = item;
            }
        }
        if (cookie != null) {
            sessionId = cookie.getValue();
        } else {
            sessionId = request.getParameter("sessionId");
        }
        return sessionId;
    }

}
