package com.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.stereotype.Controller;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.DefaultServletHttpRequestHandler;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

/**
 * AppConfig.java：等价于spring-mvc.xml
 * @author Cao Dahai updated on 2017-02-09
 * 
 */
@Configuration
@ComponentScan(basePackages = "com.cloudibpm.runtime.controller", 
               useDefaultFilters = false, 
               includeFilters = { @ComponentScan.Filter(type = FilterType.ANNOTATION, 
                                                        value = { Controller.class }) })
@EnableWebMvc
public class AppConfig implements WebMvcConfigurer {

	
	@Bean
	public InternalResourceViewResolver setupViewResolver() {
		InternalResourceViewResolver resolver = new InternalResourceViewResolver();
		resolver.setPrefix("/");
		resolver.setSuffix(".jsp");
		//resolver.setViewClass(JstlView.class);// spring 4.0 - 5.0
		return resolver;
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// registry.addResourceHandler("/assets/**")
		// .addResourceLocations("classpath:/META-INF/resources/webjars/")
		// .setCachePeriod(31556926);
		registry.addResourceHandler("/resources/**").addResourceLocations("classpath:/resources");
	}

	@Bean
	public DefaultServletHttpRequestHandler defaultServletHttpRequestHandler() {
		return new DefaultServletHttpRequestHandler();
	}

	@Override
	public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
		configurer.enable();
	}
	
//	// file upload: http://blog.csdn.net/w605283073/article/details/51340880
//    @Bean
//    public MultipartConfigElement multipartConfigElement() {
//    	String LOCATION = SystemConfig.getProp("appserver.libfolder");
//        MultipartConfigElement multipartConfigElement = new MultipartConfigElement( LOCATION);  
//        return multipartConfigElement; 
////        MultipartConfigFactory factory = new MultipartConfigFactory();
////        factory.setMaxFileSize(MAX_FILE_SIZE);
////        factory.setMaxRequestSize(MAX_REQUEST_SIZE);
////        factory.setFileSizeThreshold(FILE_SIZE_THRESHOLD);
////        return factory.createMultipartConfig();
//    }
    
//    @Bean
//    public StandardServletMultipartResolver multipartResolver(){
//        return new StandardServletMultipartResolver();
//    }
    
	@Bean
	public MultipartResolver multipartResolver(){
		return new CommonsMultipartResolver();
	}
	
//	@Autowired
//	@Bean(name = "sessionFactory")
//	public SessionFactory getSessionFactory(DataSource dataSource) {
//		LocalSessionFactoryBuilder sessionBuilder = new LocalSessionFactoryBuilder(dataSource);
//		//sessionBuilder.addAnnotatedClasses(User.class);
//		Properties properties = new Properties();
//		properties.put(Environment.DIALECT, MySQL5Dialect.class.getName());
//		sessionBuilder.addProperties(properties);
//		return sessionBuilder.buildSessionFactory();
//	}
//
//	@Bean(name = "dataSource")
//	public DataSource getDataSource() {
//		BasicDataSource dataSource = new BasicDataSource();
//		dataSource.setDriverClassName("com.mysql.jdbc.Driver");
//		dataSource.setUrl("jdbc:mysql://localhost:3306/bpmrepository?useUnicode=true&amp;characterEncoding=UTF8");// demo
//		dataSource.setUsername("root");
//		dataSource.setPassword("silws1231");// U$Z#l~R=jK
//		dataSource.setInitialSize(10);
//		dataSource.setMaxActive(10);
//		dataSource.setMaxIdle(10);
//		dataSource.setMaxWait(10000);
//		dataSource.setMinIdle(3);
//		dataSource.setLogAbandoned(true);
//		dataSource.setRemoveAbandoned(true);
//		dataSource.setRemoveAbandonedTimeout(10);
//		dataSource.setPoolPreparedStatements(true);
//		dataSource.setTestOnBorrow(true);
//		dataSource.setValidationQuery("SELECT 1 FROM DUAL");
//		return dataSource;
//	}
//
//	@Autowired
//	@Bean(name = "transactionManager")
//	public HibernateTransactionManager getTransactionManager(SessionFactory sessionFactory) {
//		return new HibernateTransactionManager(sessionFactory);
//	}

}
