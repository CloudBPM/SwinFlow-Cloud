public class DockerTest {

    public static void main(String[] args) {
//        DockerCmdExecFactory dockerCmdExecFactory = new JerseyDockerCmdExecFactory().withReadTimeout(1000)
//                .withConnectTimeout(1000).withMaxTotalConnections(100).withMaxPerRouteConnections(10);
//        ExposedPort exposedPort1 = ExposedPort.tcp(8080);
//        Ports portBindings = new Ports();
//        portBindings.bind(exposedPort1, Ports.Binding.bindPort(9999));
//
//        Volume containerPath1 = new Volume("/usr/local/tomcat/webapps");
//        String hostPath1 = "/home/user/tomcat/webapps";
//        Bind bind1 = new Bind(hostPath1, containerPath1);
//
//        DefaultDockerClientConfig config = DefaultDockerClientConfig.createDefaultConfigBuilder().withDockerTlsVerify(true)
//                .withDockerCertPath("D:/Data/cert/").withDockerHost("tcp://192.168.1.65:2375")
//                .withDockerConfig("D:/Data/cert/").withApiVersion("1.23").withRegistryUrl("https://index.docker.io/v1/")
//                .withRegistryUsername("dockeruser").withRegistryPassword("ilovedocker")
//                .withRegistryEmail("dockeruser@github.com").build();
//
//        DockerClient dockerClient = DockerClientBuilder.getInstance(config)
//                .withDockerCmdExecFactory(dockerCmdExecFactory).build();
//        CreateContainerResponse container = dockerClient.createContainerCmd("tomcat:latest")
//                .withPortBindings(portBindings)
//                .withName("tomcatTest")
//                .withBinds(bind1)
//                .exec();
//        dockerClient.startContainerCmd(container.getId()).exec();
//        System.out.println("id=========================="+container.getId());
//        //id==========================83e1b05be7b58339534a775e156e08f5976963031c509fd3721155615c3fb806


    }
}
