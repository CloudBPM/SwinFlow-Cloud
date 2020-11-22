package com.config;

//import java.io.File;
//import java.util.List;

//import javax.servlet.MultipartConfigElement;
import com.cloudibpm.runtime.server.SaaSServer;
import org.apache.log4j.BasicConfigurator;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

//import workflow.blo.appservice.JavaAppJarFileBlo;
//import workflow.core.data.FileObject;
//import workflow.core.util.SystemConfig;

/**
 * For further understanding the no web.xml to build WebApplicationInitializer.
 * you can refer to the following articles:
 * https://blog.csdn.net/palmtale/article/details/8283521
 * https://www.cnblogs.com/panxuejun/p/7090919.html
 */

/**
 * For more information, please refer to:
 * http://www.concretepage.com/spring-4/spring-4-mvc-example-using-maven-eclipse
 * 
 * @author Caodahai
 * 
 */
public class WebInitializer implements WebApplicationInitializer {
	public static final long MAX_FILE_SIZE = 1024 * 1024 * 5;
	public static final long MAX_REQUEST_SIZE = 1024 * 1024 * 5 * 5;
	public static final int FILE_SIZE_THRESHOLD = 1024 * 1024;

	/**
	 * servletContext is a servlet container
	 */
	@Override
	public void onStartup(ServletContext servletContext) throws ServletException {
		System.out.println("=======================================================================");
		System.out.println("             \\   \\    /    /     |````````````|                      ");
		System.out.println("              \\   \\  /    /      |            |                      ");
		System.out.println("               \\   \\/    /       |            |                      ");
		System.out.println("                \\       /        |            |                       ");
		System.out.println("                /       \\        |        \\   |                      ");
		System.out.println("               /   /\\    \\       |         \\  |                     ");
		System.out.println("              /   /  \\    \\      |          \\\\                     ");
		System.out.println("             /   /    \\    \\     |____________\\\\                   ");
		System.out.println("=======================================================================");
		System.out.println("       A Server for SaaS Development Delivery Trading Platform         ");
		System.out.println("                    http://www.xuanqiyun.com (c) 2018                  ");
		System.out.println("=======================================================================");

		AnnotationConfigWebApplicationContext rootContext = new AnnotationConfigWebApplicationContext();
		// here you can add your spring configuration file
		//rootContext.setConfigLocation("/WEB-INF/spring/dispatcher-config.xml");
		rootContext.register(AppConfig.class);
		rootContext.setServletContext(servletContext);
		servletContext.addListener(new ContextLoaderListener(rootContext));
		servletContext.addListener(ContextFinalizer.class);
		ServletRegistration.Dynamic dynamic = servletContext.addServlet("SpringDispatcher",
				new DispatcherServlet(rootContext));
		dynamic.addMapping("/");
		dynamic.setLoadOnStartup(1);
		// file upload: http://blog.csdn.net/w605283073/article/details/51340880
		// dynamic.setMultipartConfig(new
		// MultipartConfigElement(SystemConfig.getProp("appserver.libfolder"),
		// MAX_FILE_SIZE, MAX_REQUEST_SIZE, FILE_SIZE_THRESHOLD));
		BasicConfigurator.configure();
		try {
			SaaSServer.getInstance().powerOn();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}