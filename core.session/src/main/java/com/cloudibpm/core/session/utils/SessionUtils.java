package com.cloudibpm.core.session.utils;

import com.alibaba.fastjson.JSON;
import com.cloud.core.session.redis.JedisUtil;
import com.cloudibpm.core.user.Login;
import org.apache.commons.lang3.StringUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public class SessionUtils {
    private final static SessionUtils instance = new SessionUtils();

    public static SessionUtils getInstance() {
        return instance;
    }

    public String getSessionId(HttpServletRequest request) {
        String sessionId = request.getParameter("sessionId");
        if (StringUtils.isBlank(sessionId)) {
            Cookie[] cookies = request.getCookies();
            Cookie cookie = null;
            if (cookies != null) {
                for (Cookie item : cookies) {
                    if (StringUtils.equals("sessionId", item.getName())) cookie = item;
                }
            }
            if (cookie != null) {
                sessionId = cookie.getValue();
            }
        }
        return sessionId;
    }

    public Login getLogin(HttpServletRequest request) {
        String sessionId = this.getSessionId(request);
        if (StringUtils.isBlank(sessionId)) {
            return null;
        }
        return JSON.parseObject(JedisUtil.getInstance().get(sessionId), Login.class);
        //return null;
    }
}
