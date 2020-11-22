/**
 * 
 */
package com.cloudibpm.blo.am.container;

import com.cloudibpm.blo.am.docker.ServiceDockerBlo;
import com.cloudibpm.core.container.ServiceContainer;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.eso.am.container.ServiceContainerEso;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Dahai Cao created on 2018-06-20, last updated on 2018-06-21 21:36
 *
 */
@Service
//@Transactional
public class ServiceContainerBlo extends BusinessLogicObject {
	private final ServiceContainerEso scEso;
	private final ServiceDockerBlo serviceDockerBlo;
	private static Logger logger = LoggerFactory.getLogger(ServiceContainerBlo.class);


	@Autowired
	public ServiceContainerBlo(ServiceContainerEso scEso, ServiceDockerBlo serviceDockerBlo) {
		this.scEso = scEso;
		this.serviceDockerBlo = serviceDockerBlo;
	}

	public ServiceContainer getServiceContainer(String id){
		return scEso.queryServiceContainer(id);
		
	}
	
	public void create(ServiceContainer sc) throws Exception {
//		scEso.insert(sc);
//		String serviceId = sc.getId();
//		String ownerId = sc.getOwner();
//		logger.info("serviceId= "+sc.getId());
//		logger.info("ownerId= "+sc.getOwner());
//		String systempath = SystemConfig.getProp("linux.filestorage.lib");
//		ChannelSftp connectSFTP = SFTPUtils.connectSFTP();
//		String path = systempath+"/org/"+ownerId+"/";
//		logger.info("path= "+path);
//		logger.info("type= "+sc.getContainerType());
//		connectSFTP.cd(path);
//        connectSFTP.mkdir("am");
//        String newPath = systempath+"/org/"+ownerId+"/am/";
//		if(sc.getContainerType()==1){
//            connectSFTP.cd(newPath);
//			connectSFTP.mkdir(serviceId);
//            String newPath1 = systempath+"/org/"+ownerId+"/am/"+serviceId;
//			logger.info("newPath= "+newPath1);
//			connectSFTP.cd(newPath1);
//			connectSFTP.mkdir("webapps");
//			connectSFTP.mkdir("logs");
//			connectSFTP.mkdir("conf");
//			File sourceFolder = new File("/conf");
//			logger.info("读取conf文件 开始执行复制操作");
//			File destinationFolder = new File(newPath1);
//			FileUtil.copyFolder(sourceFolder,destinationFolder);
//			logger.info("复制操作完成");
//		}else if(sc.getContainerType()==2){
//
//		}else if(sc.getContainerType()==3){
//
//		}else if(sc.getContainerType()==4){
//
//		}
//
	}
	
	public void modify(ServiceContainer sc) throws Exception {

		scEso.update(sc);
	}

	/**
	 * @author Dahai Cao created on on 2018-06-21 21:36
	 * @param id
	 * @param name
	 * @param date
	 * @throws Exception
	 */
	public void rename(String id, String name, String date) throws Exception {

		scEso.updateNameByPk(id, name, DateUtility.parseDatetime(date).getTime());
	}

	/**
	 * @author Dahai Cao created on on 2018-06-21 21:36
	 * @param id
	 * @throws Exception
	 */
	public void remove(String id) throws Exception {

	}

	public List<ServiceContainer> findAll(String fk_owner) throws Exception {

		return scEso.queryAll(fk_owner);
	}

	public void deleteServiceContainer(String id) throws Exception {//		ServiceContainer serviceContainer = scEso.queryByPk(id);
//		String containerId = serviceContainer.getContainerId();
//		int exposedPort = serviceContainer.getExposedPort();
//		String checkStatus = serviceDockerBlo.checkStatus(containerId);
//			if(checkStatus.equals("1")){
//				serviceDockerBlo.stopContainer(containerId);
//				serviceDockerBlo.removeContainer(containerId);
//			}else{
//				serviceDockerBlo.removeContainer(containerId);
//			}
//			boolean flag = true;
//			ChannelSftp connectSFTP = SFTPUtils.connectSFTP();
//			String orgFile = serviceContainer.getOwner();
//			String systempath = SystemConfig.getProp("linux.filestorage.lib"); //xq/xqpass/file
//			String path = systempath+"/org/"+orgFile+"/am/"+id;
//			System.out.println(path);
//			while(flag){
//				Vector<LsEntry> ls = connectSFTP.ls(path);
//				//判断要删除的文件夹是不是为空
//				if(ls.size()!=2){
//					RmdirUtils.removeDir(connectSFTP, path);
//					flag = true;
//				}else{
//					connectSFTP.rmdir(path);//删除根目录，比如删除a文件夹下的所有文件后，此命令就是删除a文件夹
//					flag = false;
//				}
//			}
//		serviceDockerBlo.updateNotUse(exposedPort);
//		scEso.delete(id);


		scEso.delete(id);
	}

	public boolean existsContainerName(String name, String owner) throws Exception {

		return scEso.existsServiceContainerName(name, owner);
	}

//	public String startContainer(ServiceContainer container) {
//		DockerJavaClient client = new DockerJavaClient();
//		return client.createContainer(container.getContainerName(),container.getImageName(), container.getImageVersion(),
//				container.getContainerPort(), container.getExposedPort());
//
//	}
//	

	public void updateContainerByPk(String primaryKey,String containerName,String containerId,String imageName,String imageVersion,
			int containerPort,int exposedPort){
			logger.info(primaryKey);
			logger.info(containerName);
			logger.info(containerId);
			logger.info(imageVersion);
			logger.info(imageName);
			logger.info(containerPort+"");
			logger.info(exposedPort+"");
		scEso.updateContaierByPk(primaryKey,containerName, containerId, imageName, imageVersion, containerPort, exposedPort);
	}
}
