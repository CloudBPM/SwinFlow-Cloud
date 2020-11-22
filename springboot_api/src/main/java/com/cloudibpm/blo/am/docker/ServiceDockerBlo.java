package com.cloudibpm.blo.am.docker;

import com.cloudibpm.core.docker.ServiceDocker;
import com.cloudibpm.core.folder.FileObject;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.util.SystemConfig;
import com.cloudibpm.eso.am.docker.DockerJavaClient;
import com.github.dockerjava.api.model.Container;
import com.github.dockerjava.api.model.Image;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

;

@Service
//@Transactional
public class ServiceDockerBlo extends BusinessLogicObject {

    private final DockerJavaClient dockerJavaClient;
    private static Logger logger = LoggerFactory.getLogger(ServiceDockerBlo.class);
    @Autowired
    public ServiceDockerBlo(DockerJavaClient dockerJavaClient) {
        this.dockerJavaClient = dockerJavaClient;
    }

    //获取docker中的images列表，根据服务类型
    public List<ServiceDocker> getImagesList(String type) {
        List<Image> imagesList = dockerJavaClient.getImagesList();
        //int imagePort = 0;
        int imagePort = dockerJavaClient.getImagesPort();//查询可用的暴露的端口号
        List<ServiceDocker> serviceDockerList = new ArrayList<ServiceDocker>();
        if (imagesList != null) {
            for (int i = 0; i < imagesList.size(); i++) {
                if (type.equals("1")) {
                    ServiceDocker serviceDocker = new ServiceDocker();
                    String[] str = imagesList.get(i).getRepoTags();
                    String repoTag = str[0];
                    if (repoTag.toLowerCase().contains("tomcat")) {
                        serviceDocker.setImagesTag(repoTag);
                        serviceDocker.setImagePort(imagePort);
                        serviceDockerList.add(serviceDocker);
                    }
                } else if (type.equals("2")) {
                    ServiceDocker serviceDocker = new ServiceDocker();
                    String[] str = imagesList.get(i).getRepoTags();
                    String repoTag = str[0];
                    if (repoTag.toLowerCase().contains("php")) {
                        serviceDocker.setImagesTag(repoTag);
                        serviceDocker.setImagePort(imagePort);
                        serviceDockerList.add(serviceDocker);
                    }
                } else if (type.equals("3")) {
                    ServiceDocker serviceDocker = new ServiceDocker();
                    String[] str = imagesList.get(i).getRepoTags();
                    String repoTag = str[0];
                    if (repoTag.toLowerCase().contains("python")) {
                        serviceDocker.setImagesTag(repoTag);
                        serviceDocker.setImagePort(imagePort);
                        serviceDockerList.add(serviceDocker);
                    }
                } else if (type.equals("4")) {
                    ServiceDocker serviceDocker = new ServiceDocker();
                    String[] str = imagesList.get(i).getRepoTags();
                    String repoTag = str[0];
                    if (repoTag.toLowerCase().contains("ruby")) {
                        serviceDocker.setImagesTag(repoTag);
                        serviceDocker.setImagePort(imagePort);
                        serviceDockerList.add(serviceDocker);
                    }
                }
            }
        }
        return serviceDockerList;
    }

    //创建一个docker实例
    public String createContainer(String orgFile, String serviceFile, String containerName, String imagename, String version, int containerPort,
                                  int exposedPort, String type) throws Exception{
        return dockerJavaClient.createContainer(orgFile, serviceFile, containerName, imagename, version, containerPort, exposedPort, type);
    }

    //根据containerID停止一个实例
    public void stopContainer(String containerID) {
        dockerJavaClient.stopContainer(containerID);
    }


    public int updateInUse(int exposedPort) {
        int updateInUse = dockerJavaClient.updateInUse(exposedPort);
        return updateInUse;
    }


    public int updateNotUse(int exposedPort) {
        int updateNotUse = dockerJavaClient.updateNotUse(exposedPort);
        return updateNotUse;
    }

    public String checkStatus(String containerId) {
        List<Container> checkStatus = dockerJavaClient.checkStatus();
        if (checkStatus != null) {
            for (int i = 0; i < checkStatus.size(); i++) {
                String id = checkStatus.get(i).getId();
                if (id.equals(containerId)) {
                    return "1";
                }
            }
        }
        return "0";
    }

    public void restartContainer(String containerId) {
        dockerJavaClient.restartContainer(containerId);
    }

    public void removeContainer(String containerId) {
        dockerJavaClient.removeContainer(containerId);
    }

    public int checkPort() {
        int imagesPort = dockerJavaClient.getImagesPort();
        return imagesPort;
    }

    //	public void setFileParent(LsEntry file, String path, ChannelSftp connectSFTP, List<FileObject> children, List<FileObject> parents) throws SftpException{
//		for (FileObject parent : parents) {// 拿到父节点
//			if (file.getFilename().equals(parent.getName()) && path.equals(parent.getPath())&&!(file.getFilename().equals(".") || file.getFilename().equals(".."))) {
//				if (file.getAttrs().isDir()&&!(file.getFilename().equals(".") || file.getFilename().equals(".."))) {
//					parent.setMimeType("Directory");
//					Vector<LsEntry> fs=connectSFTP.ls(path);// 获取该文件夹下所有子文件夹
//					for (int i = 0;i<fs.size();i++){
//						System.out.println(fs.get(i).getFilename());
//					}
////					File[] fs = file.getAttrs().;
//					for (int j = 0; j < fs.size(); j++) {
//						LsEntry tmp = fs.get(j);
//						String fileName = tmp.getFilename();
//						if(!(tmp.getFilename().equals(".") || tmp.getFilename().equals(".."))){
//							path = path+"/"+tmp.getFilename();
//						for (int i = 0; i < children.size(); i++) {
//							FileObject child = children.get(i);
//							if (tmp.getFilename().equals(child.getName())&& path.equals(child.getPath())&&!(file.getFilename().equals(".") || file.getFilename().equals(".."))) {// && tmp.getPath().equals(child.getPath())
//								if (parent.getOwner() != null) {
//									child.setOwner(parent.getOwner());
//								} else {
//									child.setOwner(parent.getId());
//								}
//								if (parent.seekChild(tmp.getFilename()) == null) {
//									parent.addChild(child);// 添加子节点
//									if (tmp.getAttrs().isDir()) {
//										setFileParent(tmp, path, connectSFTP, children, parents);
//									}
//								}
//							}
//						}
//					}
//					}
//				}
//			}
//		}
//	}
    public void setFileParent(File file, List<FileObject> children, List<FileObject> parents) {
        for (FileObject parent : parents) {// 拿到父节点
            if (file.getName().equals(parent.getName()) && file.getPath().equals(parent.getPath())) {
                if (file.isDirectory()) {
                    parent.setMimeType("Directory");
                    File[] fs = file.listFiles();// 获取该文件夹下所有子文件夹
                    for (int j = 0; j < fs.length; j++) {
                        File tmp = fs[j];
                        for (int i = 0; i < children.size(); i++) {
                            FileObject child = children.get(i);
                            if (tmp.getName().equals(child.getName()) && tmp.getPath().equals(child.getPath())) {
                                if (parent.getOwner() != null) {
                                    child.setOwner(parent.getOwner());
                                } else {
                                    child.setOwner(parent.getId());
                                }
                                if (parent.seekChild(tmp.getName()) == null) {
                                    parent.addChild(child);// 添加子节点
                                    if (tmp.isDirectory()) {
                                        setFileParent(tmp, children, parents);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    private static final String storagetype = SystemConfig.getProp("filestorage.type");
    public Map<String, Integer> dataStatistics(String oid, String cid, String type) throws IOException, ParseException {
        String  path = null;
        String syspath = null;
        if (storagetype.trim().equals("win")) {
            syspath = SystemConfig.getProp("windows.filestorage.lib");
        } else if (storagetype.trim().equals("linux")) {
            syspath = SystemConfig.getProp("linux.filestorage.lib");
        }
        Map<String, Integer> map = new HashMap<>();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String str;
        for (int i = 6; i >= 0; i--) {
            int count = 0;
            Date startDate = new Date();
            Calendar instance = Calendar.getInstance();
            instance.setTime(startDate);
            instance.set(Calendar.DATE, instance.get(Calendar.DATE) - i);
            Date endDate = simpleDateFormat.parse(simpleDateFormat.format(instance.getTime()));
            String format = simpleDateFormat.format(endDate);
            if (type.equals("1")) {   //tomcat logs
                path = syspath +"/org/"+oid + "/am/" + cid;
                path = path+"/logs/localhost_access_log." + format + ".txt";
                logger.info(path);
                if (Files.exists(Paths.get(path))) {//"D:\\" +
                    FileReader fileReader = new FileReader(path);//"D:\\" +
                    BufferedReader reader = new BufferedReader(fileReader);
                    while ((str = reader.readLine()) != null) {
                        count++;
                    }
                    map.put(format, count);
                    reader.close();

                } else {
                    map.put(format, 0);
                    continue;
                }
            } else if (type.equals("2")) {

            } else if (type.equals("3")) {

            } else if (type.equals("4")) {

            }
            logger.info(count+"");
        }
        return map;
    }
}
