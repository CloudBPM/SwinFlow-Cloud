package com.cloud.core.session.redis;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
/**
 * Spring application context for XuanQi system applications.
 */
public class ApplicationContextFactory {
    
    private static ApplicationContext ctx = new ClassPathXmlApplicationContext(
            "/applicationContext.xml");

    /**
     * Return the spring application context for TkBpm app.
     * 
     * @return The spring applcation context
     */
    public static ApplicationContext getApplicationContext() {
        return ctx;
    }
}
