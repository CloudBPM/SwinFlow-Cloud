package com.config;

import org.apache.log4j.Logger;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.boot.SpringBootConfiguration;

/**
 *
 * 日志切面
 */
@Aspect
@SpringBootConfiguration
public class Aspectj {

    //com.cloudibpm.blo.am.appservice
    @Pointcut("execution(* com.cloudibpm..eso..*.*(..))")
    public void esoLog(){}

    @Pointcut("execution(* com.cloudibpm..redis.*.*(..))")
    public void redisLog(){}

    @Pointcut("execution(* com.cloudibpm..blo..*.*(..))")
    public void bloLog(){}

    private Logger logger= Logger.getLogger(Aspectj.class);

//    @Before("esoLog()")
//    public void deBefore(JoinPoint joinPoint) throws Throwable {
//        // 接收到请求，记录请求内容
//        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
//        HttpServletRequest request = attributes.getRequest();
//        // 记录下请求内容
//        System.out.println("URL : " + request.getRequestURL().toString());
//        System.out.println("HTTP_METHOD : " + request.getMethod());
//        System.out.println("IP : " + request.getRemoteAddr());
//        System.out.println("CLASS_METHOD : " + joinPoint.getSignature().getDeclaringTypeName() + "." + joinPoint.getSignature().getName());
//        System.out.println("ARGS : " + Arrays.toString(joinPoint.getArgs()));
//
//    }

//    @AfterReturning(returning = "ret", pointcut = "esoLog()")
//    public void doAfterReturning(Object ret) throws Throwable {
//        // 处理完请求，返回内容
//        System.out.println("方法的返回值 : " + ret);
//    }

    //后置异常通知
//    @AfterThrowing("esoLog()")
//    public void throwss(JoinPoint jp){
//        System.out.println("方法异常时执行.....");
//    }

    //后置最终通知,final增强，不管是抛出异常或者正常退出都会执行
//    @After("bloLog()")
//    public void after(JoinPoint jp){
//        System.out.println("方法最后执行.....");
//    }

    //环绕通知,环绕增强，相当于MethodInterceptor
//    @Around("esoLog()")
//    public Object arround(ProceedingJoinPoint pjp) throws Throwable {
//        long spendtime = System.currentTimeMillis();
//        Object o =  pjp.proceed();
//        logger.debug(pjp.getSignature()+":"+(Long.toString(System.currentTimeMillis() - spendtime)) + "ms");
//        return o;
//    }

    @Around("redisLog()")
    public Object arroundRedis(ProceedingJoinPoint pjp) throws Throwable {
        long spendtime = System.currentTimeMillis();
        Object o =  pjp.proceed();
        logger.info(pjp.getSignature()+":"+(System.currentTimeMillis() - spendtime) + "ms");
        return o;
    }

//    @Around("bloLog()")
//    public Object arroundBlo(ProceedingJoinPoint pjp) throws Throwable {
//        long spendtime = System.currentTimeMillis();
//        Object o =  pjp.proceed();
//        logger.info(pjp.getSignature()+":"+(Long.toString(System.currentTimeMillis() - spendtime)) + "ms");
//        return o;
//    }
}
