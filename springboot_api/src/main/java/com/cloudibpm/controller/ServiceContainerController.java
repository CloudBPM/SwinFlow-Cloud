/**
 *
 */
package com.cloudibpm.controller;

import com.cloudibpm.blo.am.container.ServiceContainerBlo;
import com.cloudibpm.blo.am.docker.ServiceDockerBlo;
import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.container.ServiceContainer;
import com.cloudibpm.core.docker.ServiceDocker;
import com.cloudibpm.core.folder.FileObject;
import com.cloudibpm.core.folder.JSTreeNode;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.core.util.SystemConfig;
import com.cloudibpm.core.util.file.FileUtil;
import com.cloudibpm.eso.am.docker.RmdirUtils;
import com.cloudibpm.eso.sftp.SFTPUtils;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.ChannelSftp.LsEntry;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.SftpException;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URLDecoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * This controller is used to control docker container.
 *
 * @author Dahai Cao created on 2018-06-20 17:34
 */
@RestController
@RequestMapping("/service18")
public class ServiceContainerController {
    private final ServiceDockerBlo serviceDockerBlo;
    private final ServiceContainerBlo serviceContainerBlo;
    private final BuildtimeIDGenerator buildtimeIDGenerator;
    private static Logger logger = LoggerFactory.getLogger(ServiceContainerController.class);

    @Autowired
    public ServiceContainerController(ServiceDockerBlo serviceDockerBlo, ServiceContainerBlo serviceContainerBlo, BuildtimeIDGenerator buildtimeIDGenerator) {
        this.serviceDockerBlo = serviceDockerBlo;
        this.serviceContainerBlo = serviceContainerBlo;
        this.buildtimeIDGenerator = buildtimeIDGenerator;
    }

    // 从docker中获得仓库中的镜像
    @RequestMapping(value = "/api1", method = RequestMethod.GET, headers = "Accept=application/json")
    @ResponseBody
    public List<ServiceDocker> getDocker(@RequestParam("type") String type) {
        try {
            if (type == null || type.equals("")) {
                return null;
            } else {

                List<ServiceDocker> imagesList = serviceDockerBlo.getImagesList(type);
                return imagesList;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 分类显示镜像
    @RequestMapping(value = "/api2", method = RequestMethod.GET, headers = "Accept=application/json")
    @ResponseBody
    public ServiceContainer getContainer(@RequestParam("cid") String id) {
        try {
            if (id == null || id.equals("")) {
                return null;
            } else {
                ServiceContainer serviceContainer = serviceContainerBlo.getServiceContainer(id);
                if (serviceContainer!=null){
                    return serviceContainer;
                }else {
                    return null;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 创建并运行一个container，讲数据写入到数据库中
    @RequestMapping(value = "/api3", method = RequestMethod.GET, headers = "Accept=application/json")
    @ResponseBody
    public ServiceContainer startContainer(@RequestParam("oid") String oid, @RequestParam("cid") String cid, @RequestParam("name") String name,
                                           @RequestParam("tag") String tag, @RequestParam("port") String port, @RequestParam("type") String type)throws Exception {
        if (cid != null || name != null || tag != null || port != null) {
                String containerName = name.trim();
                String[] split = tag.split(":");
                String imagename = split[0];
                String version = split[1];
                int exposedPort = Integer.parseInt(port);
                int containerPort = 0;
                if (type.equals("1")) {
                    containerPort = 8080; // tomcat
                } else if (type.equals("2")) {
                    containerPort = 80; // php
                } else if (type.equals("3")) {
                    containerPort = 80; // python
                } else if (type.equals("4")) {
                    containerPort = 4567; // ruby
                }
                // 创建并且运行一个container实例

                String containerId = serviceDockerBlo.createContainer(oid, cid, containerName, imagename, version, containerPort,
                        exposedPort, type);
                ServiceContainer container = new ServiceContainer();
                container.setImageName(imagename);
                container.setContainerType(Integer.parseInt(type));
                container.setImageVersion(version);
                container.setContainerPort(containerPort);
                container.setExposedPort(exposedPort);
                container.setContainerId(containerId);
                container.setContainerName(containerName);
                // 把container信息写入数据库

                serviceContainerBlo.updateContainerByPk(cid, containerName, containerId, imagename, version,
                        containerPort, exposedPort);
                serviceDockerBlo.updateInUse(exposedPort);
                return container;
        } else {
            return null;
        }
    }

    // 停止container
    @RequestMapping(value = "/api4", method = RequestMethod.GET, headers = "Accept=application/json")
    @ResponseBody
    public String stopContainer(@RequestParam("containerID") String containerID) {
        try {
            if (containerID == null || containerID.equals("")) {
                return "0";
            } else {

                serviceDockerBlo.stopContainer(containerID);
                return "1";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "0";
        }
    }

    // 检测实例状态
    @RequestMapping(value = "/api5", method = RequestMethod.GET, headers = "Accept=application/json")
    @ResponseBody
    public String checkStutas(@RequestParam("containerId") String containerId) {
        try {
            if (containerId == null || containerId.equals("")) {
                return "fila";
            } else {

                String checkStatus = serviceDockerBlo.checkStatus(containerId);
                if (checkStatus == "1") {
                    return "active";
                }
                return "unactive";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "unactive";
        }
    }

    // 重启实例
    @RequestMapping(value = "/api6", method = RequestMethod.GET, headers = "Accept=application/json")
    @ResponseBody
    public String restartContainer(@RequestParam("containerId") String containerId) {
        try {
            if (containerId == null || containerId.equals("")) {
                return "fail";
            } else {

                serviceDockerBlo.restartContainer(containerId);
                return "success";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "fail";
        }
    }

    //检查端口并且获取一个可用的新端口给一个container
    @RequestMapping(value = "/api7", method = RequestMethod.GET, headers = "Accept=application/json")
    @ResponseBody
    public ServiceDocker checkPort() {

        int port = serviceDockerBlo.checkPort();
        ServiceDocker serviceDocker = new ServiceDocker();
        serviceDocker.setImagePort(port);
        return serviceDocker;
    }

    @RequestMapping(value = "/api8", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8", produces = "application/json; charset=utf-8")
    @ResponseBody
    public String modifyContainer(@RequestParam("container") String container) {
        try {
            JSONObject obj = new JSONObject(container);
            ServiceContainer sc = new ServiceContainer();
            sc.setId(obj.getString("id"));
            sc.setName(obj.getString("name"));
            sc.setLastupdate(DateUtility.parseDatetime(obj.getString("lastupdate")).getTime());
            serviceContainerBlo.modify(sc);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    //获取左边树的目录结构以及右边内容
    private static final String storagetype = SystemConfig.getProp("filestorage.type");

    @RequestMapping(value = "/api9", method = RequestMethod.GET, headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode[] getServiceFiles(String oid, String cid, String childFile) {
        String destination = null;
        if (storagetype.trim().equals("win")) {
            String syspath = SystemConfig.getProp("windows.filestorage.lib");
            destination = syspath + "/org/" + oid + "/am/" + cid;
        } else if (storagetype.trim().equals("linux")) {
        String syspath = SystemConfig.getProp("linux.filestorage.lib");
        destination = syspath + "/org/" + oid + "/am/" + cid;
        }
        logger.info("destination              "+destination);
        List<File> files = FileUtil.getFileList(destination);
        List<FileObject> fileNodes = new ArrayList<>();// 存放所有节点
        getChildFile(files, fileNodes);

        JSTreeNode[] js = generateJSTreeNodes(fileNodes.toArray(new FileObject[fileNodes.size()]));
        List<JSTreeNode> js2 = new ArrayList<>();
        for (int i = 0; i < js.length; i++) {
            if (StringUtils.isEmpty(fileNodes.get(i).getParent())) {
                js2.add(js[i]);
            }
        }
        JSTreeNode[] js3 = js2.toArray(new JSTreeNode[js2.size()]);
        return js3;
    }
//    public JSTreeNode[] getServiceFiles(String oid, String cid, String childFile)
//            throws JSchException, SftpException {
//        String syspath = SystemConfig.getProp("linux.filestorage.lib");
//        String path = null;
//        if (childFile != null && childFile != "") {
//            path = syspath + oid + "/" + cid + "/" + childFile;
//        } else {
//            path = syspath + oid + "/" + cid;
//        }
//        ChannelSftp connectSFTP = SFTPUtils.connectSFTP();
//        /**，
//         *如果目标文件下没有文件，则这里会报null异常，但是又需要改文件的文件名返回给前台(listfilepane.js)
//         * 做上传时候需要获取到这个路径，但是有没有办法返回给前台，打算在JSTreeNode对象中加一条path属性
//         * 用于记录路径，将前台传过来的数据加上后台获取的数据拼接在一起
//         * 这样无论这个文件夹下有没有文件，都能获取到这个文件路径用于上传，
//         */
//        Vector<LsEntry> file = connectSFTP.ls(path);
//        if (file.size() ==2 || file == null) {
//            return null;
//        }
//        List<FileObject> fileNodes = new ArrayList<>();// 存放所有节点
//        getChildFile(path, connectSFTP, file, fileNodes);
//
//        JSTreeNode[] js = generateJSTreeNodes(fileNodes.toArray(new FileObject[fileNodes.size()]));
//        List<JSTreeNode> js2 = new ArrayList<>();
//        for (int i = 0; i < js.length; i++) {
//            if (StringUtils.isEmpty(fileNodes.get(i).getParent())) {
//                js2.add(js[i]);
//            }
//        }
//        JSTreeNode[] js3 = js2.toArray(new JSTreeNode[js2.size()]);
//        return js3;
//    }

    private JSTreeNode[] generateJSTreeNodes(TreeNode[] roots) {
        if (roots.length > 0) {
            JSTreeNode[] jstnodes = new JSTreeNode[roots.length];
            for (int i = 0; i < roots.length; i++) {
                TreeNode node = roots[i];
                JSTreeNode jstnode = new JSTreeNode();
                FileObject file = (FileObject) node;
                if (StringUtils.isEmpty(file.getParent())) {
                    file.setOperatation(0);
                } else if (file.getName().equals("emltp") || file.getName().equals("idcard")
                        || file.getName().equals("licence")) {
                    file.setOperatation(0);
                } else {
                    file.setOperatation(1);
                }
                jstnode.id = node.getId() + "|" + node.getName();
                jstnode.text = node.getName();
                jstnode.data = file.getMimeType() + "|" + file.fetchFileSize() + "|" + file.getLastUpdate() + "|"
                        + file.getPath() + "|" + file.getSufix() + "|" + file.getOperatation();
                jstnode.icon = "";
                // 1: Tree root; 2: Folder (Subtree); 3: Leaf nodes
                if (node instanceof FileObject) {
                    jstnode.icon = "glyphicon glyphicon-folder-open";
                }

                if (file.getMimeType().equals("File")) {
                    jstnode.icon = "glyphicon glyphicon-file";
                }

                if (node.getParent() != null) {
                    jstnode.parentId = node.getParent();
                }

                if (node.hasChildren()) {
                    jstnode.children = generateJSTreeNodes(node.getChildren());
                }
                jstnodes[i] = jstnode;

            }
            return jstnodes;
        }
        return null;
    }

//    private void getChildFile(String path, ChannelSftp connectSFTP, Vector<LsEntry> files, List<FileObject> fileNodes)throws SftpException {
//        List<FileObject> children = new ArrayList<>();// 存放子节点
//        for (LsEntry file : files) {
//            FileObject fileObject = new FileObject();
//            if (!(file.getFilename().equals(".") || file.getFilename().equals(".."))) {
//                fileObject.setName(file.getFilename());
//                fileObject.setSize(file.getAttrs().getSize());
//                fileObject.setPath(path);
//                fileObject.setLastUpdate(dateFormat(file.getAttrs().getMtimeString()));
//                fileObject.setSufix(file.getAttrs().isDir() ? ""
//                        : file.getFilename().substring(file.getFilename().lastIndexOf("."),
//                        file.getFilename().length()));
//                fileObject.setId(getNewIDandSerialNumber());
//                fileObject.setMimeType("Directory");
//                children.add(fileObject);
//                fileNodes.add(fileObject);
//            }
//        }
////         for (LsEntry file : files){// 给节点建立父子关系
////         serviceDockerBlo.setFileParent(file,path,connectSFTP,children, fileNodes);
////         }
//    }

    private void getChildFile(List<File> files, List<FileObject> fileNodes) {
        List<FileObject> children = new ArrayList<>();// 存放子节点
        for (File file : files) { // 遍历文件 给所有节点赋值
            FileObject fileObject = new FileObject();
            fileObject.setName(file.getName());
            fileObject.setPath(file.getPath());
            fileObject.setSize(file.length());
            fileObject.setLastUpdate(new Date(file.lastModified()));
            if (file.getName().equalsIgnoreCase("war-tracker")) {
                fileObject.setSufix("");
            } else {
                fileObject.setSufix(file.isFile() ? file.getName().substring(file.getName().lastIndexOf("."), file.getName().length()) : "");
            }
            //fileObject.setId(getNewIDandSerialNumber());
            UUID newfid = UUID.randomUUID();
            String fid = newfid.toString();
            fileObject.setId(fid);
            fileObject.setMimeType("File");
            fileNodes.add(fileObject);
            children.add(fileObject);
        }
        for (File file : files) {// 给节点建立父子关系
            serviceDockerBlo.setFileParent(file, children, fileNodes);
        }
    }

    public String getNewIDandSerialNumber() {
        try {
            String id = buildtimeIDGenerator.getNewBuildTimeID();
            return id;
//            String sn = buildtimeIDGenerator.getNewBuildTimeCode();// serialNumber
//            return id + "|" + sn;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "0";
    }

    public Date dateFormat(String date) {
        SimpleDateFormat fm = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        SimpleDateFormat sdf1 = new SimpleDateFormat("EEE MMM dd HH:mm:ss z yyyy", Locale.ENGLISH);
        Date parse = null;
        String format2;
        try {
            format2 = fm.format(sdf1.parse(date));
            parse = fm.parse(format2);
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return parse;

    }

    //删除文件操作
    @RequestMapping(value = "/api10", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String deleteFile(@RequestParam("path") String path) throws FileNotFoundException{
        System.out.println(path);
        try {
            ChannelSftp connectSFTP = SFTPUtils.connectSFTP();
            if (path != null && path != "") {
                try {
                    Vector<LsEntry> ls = connectSFTP.ls(path);
                    for (LsEntry lsy : ls) {
                        if (lsy.getAttrs().isDir()) {
                            boolean flag = true;
                            while (flag) {
                                Vector<LsEntry> ls1 = connectSFTP.ls(path);
                                //判断要删除的文件夹是不是为空
                                if (ls1.size() != 2) {
                                    RmdirUtils.removeDir(connectSFTP, path);
                                    flag = true;
                                } else {
                                    //connectSFTP.rmdir(path);//删除根目录，比如删除a文件夹下的所有文件后，此命令就是删除a文件夹
                                    flag = false;
                                }
                            }
                        } else {
                            connectSFTP.rm(path);
                        }
                    }
                    return "{\"status\": \"1\"}";
                } catch (SftpException e) {
                    e.printStackTrace();
                    return "{\"status\": \"0\"}";
                }
            }
        } catch (JSchException e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}";
        }
        return "{\"status\": \"0\"}";
    }

    //下载操作
    @RequestMapping(value = "/api11", method = RequestMethod.POST, headers = "Accept=application/json")
    public ResponseEntity<byte[]> downloadFile(@RequestParam("oid") String oid, @RequestParam("cid") String cid,
                                               @RequestParam("path") String path, @RequestParam("fname") String fname) throws IOException, JSchException {
        ChannelSftp connectSFTP = SFTPUtils.connectSFTP();
        ResponseEntity<byte[]> res = null;
        String path2 = URLDecoder.decode(path, "UTF-8");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("attachment", fname);
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        InputStream is = null;
        try {
            is = connectSFTP.get(path2);
        } catch (SftpException e) {
            e.printStackTrace();
        }
        byte[] byteArray = IOUtils.toByteArray(is);
        res = new ResponseEntity<byte[]>(byteArray, headers, HttpStatus.CREATED);
        return res;
    }

    //上传文件
    @RequestMapping(value = "/api12", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String uploadFileObject(@RequestParam("oid") String oid, @RequestParam("num") String size,
                                   @RequestParam("path") String path, @RequestParam("cid") String cid, @RequestParam("fname") String fname,
                                   @RequestParam("uploadFile") MultipartFile file) throws IOException, JSchException ,SftpException{
        InputStream is = null;
        String fileName = URLDecoder.decode(fname, "utf-8");
        System.out.println(fileName);
        logger.info("文件名"+fileName);
        logger.info("路径"+path);
        ChannelSftp connectSFTP = SFTPUtils.connectSFTP();
            String upPath = path+ "/" + fileName;
            is = file.getInputStream();
            connectSFTP.put(is, upPath);
            is.close();
            return "{\"status\": \"1\", \"fid\": \"success\"}"; // success
    }

    /**
     * 数据统计
     * @param ownerId 组织ID
     * @param Cid　服务器ID
     * @param type　服务器类型　1、tomcat　2、php 3、python 4、ruby
     * @return
     */
    @RequestMapping(value = "/api13", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public Map<String, Integer> dataStatistics(@RequestParam("ownerId") String ownerId,@RequestParam("serverId") String Cid
                                                ,@RequestParam("type") String type) {
        try {
            if (Cid == "" || Cid == null) {
                return null; // failed
            } else {
                Map<String, Integer> dataMap = serviceDockerBlo.dataStatistics(ownerId,Cid,type);
                return dataMap;
            }
        } catch (IOException io) {
            io.printStackTrace();
            return null;
        } catch (ParseException p) {
            p.printStackTrace();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}