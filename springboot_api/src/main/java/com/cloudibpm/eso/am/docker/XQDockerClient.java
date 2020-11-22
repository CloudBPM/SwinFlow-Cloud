package com.cloudibpm.eso.am.docker;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.model.ExposedPort;
import com.github.dockerjava.api.model.Info;
import com.github.dockerjava.api.model.Ports;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientBuilder;
import com.github.dockerjava.core.DockerClientConfig;

import java.io.Serializable;

public class XQDockerClient implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public static void main(String[] args) {
		DockerClientConfig config = DefaultDockerClientConfig.createDefaultConfigBuilder().withDockerTlsVerify(true)

				.withDockerCertPath("D:/Data/cert/").withDockerHost("tcp://192.168.1.62:2375")

				.withDockerConfig("D:/Data/cert/").withApiVersion("1.23").withRegistryUrl("https://index.docker.io/v1/")

				.withRegistryUsername("dockeruser").withRegistryPassword("ilovedocker")
				
				.withRegistryEmail("dockeruser@github.com").build();

				DockerClient dockerClient = DockerClientBuilder.getInstance(config).build();
				
				ExposedPort exposedPort1 = ExposedPort.tcp(8080);
				Ports portBindings = new Ports();
				portBindings.bind(exposedPort1, Ports.Binding.bindPort(9090));
				
//				Volume volume2 = new Volume("/home/user/tomcat/webapps");
//				Volume volume3 = new Volume("/usr/local/tomcat/log");
//				List<Volume> v = new ArrayList<>();
//				v.add(volume2);
//				v.add(volume3);
//				CreateContainerResponse exec1 = dockerClient.createContainerCmd("tomcat:latest")
//				.withVolumes(v)
//				.withPortBindings(portBindings).exec();
//				
				
				
//				Volume volume = new Volume("/usr/local/tomcat/webapps");
//				Volume volume1 = new Volume("/usr/local/tomcat/log");
//				Bind bind = new Bind("/home/user/tomcat/webapps", volume);
//				Bind bind1 = new Bind("/home/user/tomcat/log", volume1);
//				List<Bind> b = new ArrayList<>();
//				b.add(bind);
//				b.add(bind1);
//				CreateContainerResponse exec = dockerClient.createContainerCmd("tomcat:latest")
//				.withBinds(b)
//				.withPortBindings(portBindings).exec();
				//String id = exec1.getId();
				//dockerClient.startContainerCmd(id);
				Info exec = dockerClient.infoCmd().exec();
				//docker版本
				System.out.println(exec.getServerVersion());
				//64位机
				System.out.println(exec.getArchitecture());
				System.out.println(exec.getClusterAdvertise());
				System.out.println(exec.getClusterStore());
				System.out.println(exec.getDiscoveryBackend());
				//docker根目录路径
				System.out.println(exec.getDockerRootDir());
				//docker的存储驱动
				System.out.println(exec.getDriver());
				//是否支持某种驱动
				System.out.println(exec.getExecutionDriver());
				//http代理
				System.out.println(exec.getHttpProxy());
//				https代理
				System.out.println(exec.getHttpsProxy());
//				NOWJ:7QIP:BYT3:OYJF:TSL5:PQZ5:XEBX:HWS4:7K6W:XY4V:KT57:FXTJ 应该是docker的id
				System.out.println(exec.getId());
//				docker的index主页
				System.out.println(exec.getIndexServerAddress());
				System.out.println(exec.getNCPU());
				//操作系统
				System.out.println(exec.getOsType());
				//内存大小
				System.out.println(exec.getMemTotal());
				//操作系统版本
				System.out.println(exec.getOperatingSystem());
	}
	}

