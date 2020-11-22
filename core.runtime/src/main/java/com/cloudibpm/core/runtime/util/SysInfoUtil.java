package com.cloudibpm.core.runtime.util;

import com.cloudibpm.core.runtime.server.ServerInfoDescriptor;

import java.net.UnknownHostException;

public class SysInfoUtil {

	// https://my.oschina.net/mkh/blog/312911
	public static ServerInfoDescriptor getProps() throws UnknownHostException {
		ServerInfoDescriptor desc = new ServerInfoDescriptor();
//		Runtime r = Runtime.getRuntime();
//		Properties props = System.getProperties();
//		InetAddress addr = InetAddress.getLocalHost();
//		Map<String, String> map = System.getenv();
//		desc.setName(map.get("COMPUTERNAME"));// 获取计算机名
//		desc.setServerDatetime(DateUtility.getCurDateTime()); // 获取当前服务器日期时间
//		// 操作系统及其版本
//		desc.setOs(props.getProperty("os.name") + " " + props.getProperty("os.version"));
//		// JVM可以使用的处理器个数
//		desc.setProcessors(String.valueOf(r.availableProcessors()));
//		desc.setIpv4(addr.getHostAddress());
//
//		desc.setJdkName(props.getProperty("java.vm.specification.name") + " "
//				+ props.getProperty("java.specification.version"));
//
//		desc.setTotalJVMMemory(r.totalMemory());// JVM可以使用的总内存
//		desc.setFreeJVMMemory(r.freeMemory());// JVM可以使用的剩余内存
//		desc.setMaxJVMMemory(r.maxMemory());// JVM最大可使用的内存
//
//		desc.setTotalThreads(0);
//		desc.setPeakThreads(0);
//
//		//Map<String, Object> m = getThreadsTotal();
//
//		desc.setActiveThreads(0);
//		desc.setDemonThreads(0);

		// String userName = map.get("USERNAME");// 获取用户名
		// String computerName = map.get("COMPUTERNAME");// 获取计算机名
		// String userDomain = map.get("USERDOMAIN");// 获取计算机域名
		// System.out.println("用户名: " + userName);
		// System.out.println("计算机名: " + computerName);
		// System.out.println("计算机域名: " + userDomain);
		// System.out.println("本地ip地址: " + ip);
		// System.out.println("本地主机名: " + addr.getHostName());
		// System.out.println("JVM可以使用的总内存: " + r.totalMemory());
		// System.out.println("JVM可以使用的剩余内存: " + r.freeMemory());
		// System.out.println("JVM可以使用的处理器个数: " + r.availableProcessors());
		// System.out.println("Java的运行环境版本： " +
		// props.getProperty("java.version"));
		// System.out.println("Java的运行环境供应商： " +
		// props.getProperty("java.vendor"));
		// System.out.println("Java供应商的URL： " +
		// props.getProperty("java.vendor.url"));
		// System.out.println("Java的安装路径： " + props.getProperty("java.home"));
		// System.out.println("Java的虚拟机规范版本： " +
		// props.getProperty("java.vm.specification.version"));
		// System.out.println("Java的虚拟机规范供应商： " +
		// props.getProperty("java.vm.specification.vendor"));
		// System.out.println("Java的虚拟机规范名称： " +
		// props.getProperty("java.vm.specification.name"));
		// System.out.println("Java的虚拟机实现版本： " +
		// props.getProperty("java.vm.version"));
		// System.out.println("Java的虚拟机实现供应商： " +
		// props.getProperty("java.vm.vendor"));
		// System.out.println("Java的虚拟机实现名称： " +
		// props.getProperty("java.vm.name"));
		// System.out.println("Java运行时环境规范版本： " +
		// props.getProperty("java.specification.version"));
		// System.out.println("Java运行时环境规范供应商： " +
		// props.getProperty("java.specification.vender"));
		// System.out.println("Java运行时环境规范名称： " +
		// props.getProperty("java.specification.name"));
		// System.out.println("Java的类格式版本号： " +
		// props.getProperty("java.class.version"));
		// System.out.println("Java的类路径： " +
		// props.getProperty("java.class.path"));
		// System.out.println("加载库时搜索的路径列表： " +
		// props.getProperty("java.library.path"));
		// System.out.println("默认的临时文件路径： " +
		// props.getProperty("java.io.tmpdir"));
		// System.out.println("一个或多个扩展目录的路径： " +
		// props.getProperty("java.ext.dirs"));
		// System.out.println("操作系统的名称： " + props.getProperty("os.name"));
		// System.out.println("操作系统的构架： " + props.getProperty("os.arch"));
		// System.out.println("操作系统的版本： " + props.getProperty("os.version"));
		// System.out.println("文件分隔符： " + props.getProperty("file.separator"));
		// System.out.println("路径分隔符： " + props.getProperty("path.separator"));
		// System.out.println("行分隔符： " + props.getProperty("line.separator"));
		// System.out.println("用户的账户名称： " + props.getProperty("user.name"));
		// System.out.println("用户的主目录： " + props.getProperty("user.home"));
		// System.out.println("用户的当前工作目录： " + props.getProperty("user.dir"));
		return desc;
	}

	/**
	 * https://zaozaool.github.io/2016/09/12/%E8%8E%B7%E5%8F%96%E5%BD%93%E5%89%
	 * 8DJava%E8%BF%9B%E7%A8%8B%E7%9A%84%E6%B4%BB%E5%8A%A8%E7%BA%BF%E7%A8%8B%E6%
	 * 95%B0/ 获取当前Java进程的活动线程数 （拷贝来的代码，未验证）
	 * 
	 * @return
	 */
//	public static Map<String, Object> getThreadsTotal() {
//		Map<String, Object> threadDataMap = new HashMap<String, Object>();
//
//		Integer currentThreadCount = 0;
//		Integer currentThreadsBusy = 0;

//		MBeanServer mbeanServer = ManagementFactory.getPlatformMBeanServer();
//		List<ObjectName> threadPools = new ArrayList<ObjectName>();
//		try {
//			threadPools.addAll(mbeanServer.queryNames(new ObjectName("*:type=ThreadPool,*"), null));
//
//			for (final ObjectName threadPool : threadPools) {
//				// 获取所有线程池下的线程总数
//				currentThreadCount =0;//+= (Integer) mbeanServer.getAttribute(threadPool, "currentThreadCount");
//				currentThreadsBusy =0;//+= (Integer) mbeanServer.getAttribute(threadPool, "currentThreadsBusy");
//
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//		}

//		threadDataMap.put("currentThreadCount", currentThreadCount);
//		threadDataMap.put("currentThreadsBusy", currentThreadsBusy);
//
//		return threadDataMap;
//	}

	// http://www.cnblogs.com/wytings/p/4711650.html
	// (拷贝来的代码，未验证)
//	public static int getTotalThreads() {
//		ThreadGroup group = Thread.currentThread().getThreadGroup();
//		ThreadGroup topGroup = group;
//		// 遍历线程组树，获取根线程组
//		while (group != null) {
//			topGroup = group;
//			group = group.getParent();
//		}
//		// 激活的线程数再加一倍，防止枚举时有可能刚好有动态线程生成
//		int slackSize = topGroup.activeCount() * 2;
//		Thread[] slackThreads = new Thread[slackSize];
//		// 获取根线程组下的所有线程，返回的actualSize便是最终的线程数
//		int actualSize = topGroup.enumerate(slackThreads);
//		Thread[] atualThreads = new Thread[actualSize];
//		// 复制slackThreads中有效的值到atualThreads
//		System.arraycopy(slackThreads, 0, atualThreads, 0, actualSize);
//		// System.out.println("Threads size is " + atualThreads.length);
//		// for (Thread thread : atualThreads) {
//		// System.out.println("Thread name : " + thread.getName());
//		// }
//
//		return atualThreads.length;
//
//	}

//	public static void main(String[] args) {
//		try {
//			getProps();
//		} catch (UnknownHostException e) {
//			e.printStackTrace();
//		}
//	}

}
