//package com.docker.test;
//
//import java.net.URI;
//import java.util.Arrays;
//
//import com.google.common.collect.ImmutableMap;
//import com.spotify.docker.client.DefaultDockerClient;
//import com.spotify.docker.client.DockerClient;
//import com.spotify.docker.client.LogStream;
//import com.spotify.docker.client.messages.ContainerConfig;
//import com.spotify.docker.client.messages.ContainerCreation;
//import com.spotify.docker.client.messages.ExecCreation;
//import com.spotify.docker.client.messages.HostConfig;
//import com.spotify.docker.client.messages.HostConfig.Bind;
//import com.spotify.docker.client.messages.PortBinding;
//
//public class MyDocker {
//
//	public static void main(String[] args) {
//		try {
//			DockerClient dockerClient = DefaultDockerClient.builder()
//				       // .uri(URI.create("http://192.168.5.31:2375"))
//				        .uri(URI.create("http://172.17.0.1:2375"))
//				        .build();
//			// Pull an image
//			//docker.pull("tomcat");
//
////			final Map<String, List<PortBinding>> portBindings = new HashMap<>();
////			// Bind container ports to host ports
////			final String[] ports = {"8080"};
//////			for (String port : ports) {
//////			    List<PortBinding> hostPorts = new ArrayList<>();
//////			    hostPorts.add(PortBinding.of("0.0.0.0", port));
//////			    portBindings.put(port, hostPorts);
//////			}
////
////			// Bind container port 443 to an automatically allocated available host port.
////			List<PortBinding> randomPort = new ArrayList<>();
////			randomPort.add(PortBinding.randomPort("0.0.0.0"));
////			portBindings.put("8080", randomPort);
//			
//			//List<PortBinding> hostPorts = new ArrayList<>();
//			//hostPorts.add(PortBinding.of("0.0.0.0", "50084"));
//			//portBindings.put("8080", hostPorts);
//			
//			
//			
//			//String p = PortBinding.randomPort("192.168.5.31").hostPort();
//			String p = PortBinding.randomPort("192.168.1.109").hostPort();
//			
//			final HostConfig hostConfig = HostConfig.builder()
//					//.appendBinds("$PWD/test:/usr/local/tomcat/webapps/test")
//				    .appendBinds(Bind.from("/home/cdh/test")
//				               .to("/usr/local/tomcat/webapps/test").readOnly(false)
//				               .build())
//					.portBindings(ImmutableMap.of("8080/tcp", Arrays.asList(PortBinding.of("0.0.0.0", p)))).build();	
//			
//		    final ContainerConfig containerConfig = ContainerConfig.builder()
//		            .hostConfig(hostConfig)
//		            .image("tomcat:latest").exposedPorts("8080/tcp")
//		            .build();
//
//		    final ContainerCreation creation = dockerClient.createContainer(containerConfig);
//		    final String id = creation.id();
//
//		    // Start container
//		    dockerClient.startContainer(id);
//			
//
//			
////		    runoob@runoob:~/tomcat$ docker run --name mytomcat111 -p 50084:8080 -v $PWD/test:/usr/local/tomcat/webapps/test -d tomcat 
////		    
//			// Exec command inside running container with attached STDOUT and STDERR
//			final String[] command = {"bash", "-c", "ls"};
//			final ExecCreation execCreation = dockerClient.execCreate(
//			    id, command, DockerClient.ExecCreateParam.attachStdout(),
//			    DockerClient.ExecCreateParam.attachStderr());
//			final LogStream output = dockerClient.execStart(execCreation.id());
//			final String execOutput = output.readFully();
//
//			// Kill container
//			dockerClient.killContainer(id);
//
//			// Remove container
//			dockerClient.removeContainer(id);
//
//			// Close the docker client
//			dockerClient.close();
//
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
//	
//	public void testNetworks() throws Exception {
//
//	}
//
//}
