/**
 *
 */
package com.cloudibpm.eso.am.docker;

import com.cloudibpm.blo.am.docker.BindDirectories;
import com.cloudibpm.core.docker.ServiceDocker;
import com.cloudibpm.core.util.SystemConfig;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.command.DockerCmdExecFactory;
import com.github.dockerjava.api.model.*;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientBuilder;
import com.github.dockerjava.core.DockerClientConfig;
import com.github.dockerjava.jaxrs.JerseyDockerCmdExecFactory;
import org.apache.commons.lang.SystemUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;


/**
 * @author great
 *
 */
@Repository
@Component
public class DockerJavaClient {

    private final JdbcTemplate jdbcTemplate;

    protected DockerClient dockerClient = null;

    private static Logger logger = LoggerFactory.getLogger(DockerJavaClient.class);

    /**
     *
     */
    @Autowired
    public DockerJavaClient(JdbcTemplate jdbcTemplate) throws FileNotFoundException {
        if (dockerClient == null) {
            final String localDockerHost = SystemUtils.IS_OS_WINDOWS ? SystemConfig.getProp("docker.engine.win.host")
                    : SystemConfig.getProp("docker.engine.lnx.host");
            DockerClientConfig config = DefaultDockerClientConfig.createDefaultConfigBuilder().withDockerTlsVerify(true)
//					.withDockerCertPath("D:\\xqpaas\\springboot_api\\src\\main\\resources\\certs").withDockerHost(localDockerHost)
//					.withDockerConfig("D:\\xqpaas\\springboot_api\\src\\main\\resources\\certs")
                    .withDockerCertPath(SystemConfig.getProp("docker.cert.path")).withDockerHost(localDockerHost)
                    .withDockerConfig(SystemConfig.getProp("docker.config"))
                    .withApiVersion(SystemConfig.getProp("docker.api.version"))
                    .withRegistryUrl(SystemConfig.getProp("docker.registry.url"))
                    .withRegistryUsername(SystemConfig.getProp("docker.registry.username"))
                    .withRegistryPassword(SystemConfig.getProp("docker.registry.pass"))
                    .withRegistryEmail(SystemConfig.getProp("docker.registry.email"))
                    .withDockerTlsVerify(true)
                    .build();

//			DockerClientConfig config = DefaultDockerClientConfig.createDefaultConfigBuilder().withDockerTlsVerify(true)
//					.withDockerCertPath(properties.getCertPath()).withDockerHost(localDockerHost)
//					.withDockerConfig(properties.getConfig())
//					.withApiVersion(properties.getVersion())
//					.withRegistryUrl(properties.getUrl())
//					.withRegistryUsername(properties.getUsername())
//					.withRegistryPassword(properties.getPass())
//					.withRegistryEmail(properties.getEmail()).build();

            DockerCmdExecFactory dockerCmdExecFactory = new JerseyDockerCmdExecFactory().withReadTimeout(1000)
                    .withConnectTimeout(1000).withMaxTotalConnections(100).withMaxPerRouteConnections(10);
            dockerClient = DockerClientBuilder.getInstance(config).withDockerCmdExecFactory(dockerCmdExecFactory)
                    .build();
        }
        this.jdbcTemplate = jdbcTemplate;
    }

    public String createContainer(String orgFile, String serviceFile, String containerName, String imagename, String version, int containerPort, int exposedPort
            , String type) throws Exception {
        ExposedPort exposedPort1 = ExposedPort.tcp(containerPort);
        Ports portBindings = new Ports(exposedPort1, Ports.Binding.bindPort(exposedPort));
//			portBindings.bind(exposedPort1, Ports.Binding.bindPort(exposedPort));
        List<Bind> bind = null;
        if (type.equals("1")) {
            logger.info("if is start");
            bind = BindDirectories.bindTomcateDir(orgFile, serviceFile);
            logger.info("if is stop");
        }
        logger.info(exposedPort + "");
        logger.info(containerPort + "");
        logger.info(containerName);
        CreateContainerResponse container1 = dockerClient.createContainerCmd(imagename + ":" + version)
                .withName(containerName)
                .withPortBindings(portBindings)
                .withBinds(bind)
//					.withCmd("true")
                .exec();
        String id = container1.getId();
        dockerClient.startContainerCmd(id).exec();
//			dockerClient.renameContainerCmd(id).withName(containerName).exec();
        logger.info("==========>CreateDocker");
        return id;
    }

    public Info getInfor() {
        return dockerClient.infoCmd().exec();
    }

    public void closeClient() {
        try {
            dockerClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<Image> getImagesList() {
        List<Image> imageList = null;
        try {

            imageList = dockerClient.listImagesCmd().exec();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        return imageList;
    }

    public int getImagesPort() {

        String sql = "SELECT `Port` FROM `am_service_container_port` WHERE InUse = 0 limit 0,1";
        List<ServiceDocker> portList = jdbcTemplate.query(sql, new RowMapper<ServiceDocker>() {
            public ServiceDocker mapRow(ResultSet rs, int rowNum) throws SQLException {
                ServiceDocker serviceDocker = new ServiceDocker();
                serviceDocker.setImagePort(rs.getInt("Port"));
                return serviceDocker;
            }
        });

        if (!portList.isEmpty())
            return portList.get(0).getImagePort();
        else
            return 0;
    }

    public void stopContainer(String containerID) {
        try {
            dockerClient.stopContainerCmd(containerID).exec();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public int updateInUse(int exposedPort) {

        String sql = "UPDATE `am_service_container_port` SET`InUse`=1"
                + " WHERE Port = ? ";
        int update = jdbcTemplate.update(sql, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement stmt) throws SQLException {
                stmt.setInt(1, exposedPort);
            }
        });

        return update;
    }

    public int updateNotUse(int exposedPort) {

        String sql = "UPDATE `am_service_container_port` SET`InUse`= 0"
                + " WHERE Port = ? ";
        int update = jdbcTemplate.update(sql, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement stmt) throws SQLException {
                stmt.setInt(1, exposedPort);
            }
        });

        return update;
    }

    public List<Container> checkStatus() {
        try {
            List<Container> containerList = dockerClient.listContainersCmd().exec();
            return containerList;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public void restartContainer(String containerId) {
        try {
            dockerClient.restartContainerCmd(containerId).exec();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public void removeContainer(String containerId) {
        try {
            dockerClient.removeContainerCmd(containerId).exec();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

//	@Test
//	public void test(){
//		ExposedPort exposedPort1 = ExposedPort.tcp(8080);
//		Ports portBindings = new Ports();
//		portBindings.bind(exposedPort1, Ports.Binding.bindPort(8080));
//
//		CreateContainerResponse container1 = dockerClient.createContainerCmd("tomcat:latest")
//				.withPortBindings(portBindings).exec();
//		String id = container1.getId();
//		dockerClient.startContainerCmd(id).exec();
//	}


}
