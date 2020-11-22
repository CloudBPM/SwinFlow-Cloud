package com.cloudibpm.controller;

import com.alibaba.fastjson.JSON;
import com.cloudibpm.blo.admin.AdminBlo;
import com.cloudibpm.blo.am.template.EmailTemplateBlo;
import com.cloudibpm.blo.news.OrgNewsBlo;
import com.cloudibpm.core.data.FileConstant;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.core.util.SystemConfig;
import com.cloudibpm.core.util.file.FileUploadUtils;
import com.cloudibpm.core.util.file.FileUtil;
import com.model.course.Audio;
import com.model.course.Book;
import com.model.course.Live;
import com.model.course.Video;
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

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/service19")
public class FileUploadController {
    private final EmailTemplateBlo emailTemplateBlo;
    private final OrgNewsBlo orgNewsBlo;
    private final AdminBlo adminBlo;

    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);

    private static final String storagetype = SystemConfig.getProp("filestorage.type");

    @Autowired
    public FileUploadController(EmailTemplateBlo emailTemplateBlo,
                                OrgNewsBlo orgNewsBlo, AdminBlo adminBlo) {
        this.emailTemplateBlo = emailTemplateBlo;
        this.orgNewsBlo = orgNewsBlo;
        this.adminBlo = adminBlo;
    }

    /**
     * 通用 上传文件
     *
     * @param oid     //不可为空
     * @param pid     //可为空
     * @param vid     //可为空
     * @param fid     //文件ID
     * @param fname   //文件名
     * @param file    //文件字节数组
     * @param project //项目名称 例如 am pm om 不可为空
     * @param dirName //指定文件夹名称 可为空
     * @return
     * @throws IOException
     */
    private String updateFile(String oid,
                              String pid,
                              String vid,
                              String fid,
                              String fname,
                              byte[] file,
                              String project,
                              String dirName,
                              String path) throws IOException {
        String destination = "";
        if (!StringUtils.isEmpty(path)) {
            destination = path;
        } else if (storagetype.trim().equals("win")) {
            String syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
            destination = syspath + "/" + oid + "/" + project + "/";
            if (!StringUtils.isEmpty(dirName)) {// 指定组织下面文件夹
                destination = destination + dirName + "/";
            }
            if (!StringUtils.isEmpty(pid)) {
                destination = destination + pid + "/";
            }
            if (!StringUtils.isEmpty(vid) && !StringUtils.isEmpty(pid)) {
                destination = destination + vid + "/";
            }
            if (!StringUtils.isEmpty(fid)) {
                FileUtil.deleteDirFilesLikeName(destination, fid + "_");
            }
        } else if (storagetype.trim().equals("linux")) {
            String syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
            destination = syspath + "/" + oid + "/" + project + "/";
            if (!StringUtils.isEmpty(dirName)) {// 指定组织下面文件夹
                destination = destination + dirName + "/";
            }
            if (!StringUtils.isEmpty(pid)) {
                destination = destination + pid + "/";
            }
            if (!StringUtils.isEmpty(vid) && !StringUtils.isEmpty(pid)) {
                destination = destination + vid + "/";
            }
            if (!StringUtils.isEmpty(fid)) {
                FileUtil.deleteDirFilesLikeName(destination, fid + "_");
            }
        }
        File f = new File(destination + "/" + fname);
        if (!f.exists()) {
            FileUtil.createDir(destination);
            FileUtil.writeFile(file, destination, fname);
        }

        return "success";
    }

    /**
     * 上传企事业资料
     *
     * @param oid
     * @param fid
     * @param fname
     * @param file
     * @return
     * @throws IOException
     */
    @RequestMapping(value = "/api0", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String uploadFileObject(@RequestParam("oid") String oid,
                                   @RequestParam("type") String type,
                                   @RequestParam("fid") String fid,
                                   @RequestParam("fname") String fname,
                                   @RequestParam("uploadFile") MultipartFile file) {
        try {
            String fname2 = URLDecoder.decode(fname, "utf-8");
            String suffix = fname2.substring(fname2.lastIndexOf("."));
            String filename = fid + "_" + type + suffix;
            String status = updateFile(oid, null, null, fid, filename, file.getBytes(), "om", type, null);
            return "{\"status\": \"1\", \"fid\": \"" + status + "\"}"; // success
        } catch (IOException e) {
            e.printStackTrace();
            return "{\"status\": \"0\", \"fid\": \"\"}"; // failed
        }
    }

    /**
     * 加载企事业资料图片 loading org images
     *
     * @param oid
     * @param fid
     * @return
     */
    @RequestMapping(value = "/api1", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String loadOrgLicence(@RequestParam("oid") String oid,
                                 @RequestParam("fid") String fid) {
        try {
            String syspath = "";
            if (storagetype.trim().equals("win")) {
                syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
            } else if (storagetype.trim().equals("linux")) {
                syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
            }
            String destination1 = syspath + "/" + oid + "/om/licence";
            String destination2 = syspath + "/" + oid + "/om/idcard";
            String destination3 = syspath + "/" + oid + "/om/companyLOGO";
            String img1 = "0";
            String img2 = "0";
            String img3 = "0";
            String fname1 = "";
            String fname2 = "";
            String fname3 = "";
            File f1 = new File(destination1);
            File f2 = new File(destination2);
            File f3 = new File(destination3);
            if (f1.exists() && f1.listFiles().length > 0) {
                img1 = "1";
                for (File file : f1.listFiles()) {
                    if(file.getName().contains(fid)){
                        fname1 = file.getName();
                        break;
                    }
                }
            }
            if (f2.exists() && f2.listFiles().length > 0) {
                img2 = "1";
                for (File file : f2.listFiles()) {
                    if(file.getName().contains(fid)){
                        fname2 = file.getName();
                        break;
                    }
                }
            }
            if (f3.exists() && f3.listFiles().length > 0) {
                img3 = "1";
                for (File file : f3.listFiles()) {
                    if(file.getName().contains(fid)){
                        fname3 = file.getName();
                        break;
                    }
                }
            }
            return "{\"img1\": \"" + img1 + "\",\"fname1\" : \"" + fname1 +"\", \"img2\": \"" + img2 + "\",\"fname2\": \"" + fname2 + "\", \"img3\": \"" + img3 + "\",\"fname3\": \"" + fname3 + "\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"img1\": \"0\", \"img2\": \"0\", \"img3\": \"0\"}"; // faile
        }
    }

    /**
     * 删除企事业资料图片
     *
     * @param oid
     * @param fid
     * @param type
     * @return
     */
    @RequestMapping(value = "/api2", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String deleteOrgImage(@RequestParam("oid") String oid,
                                 @RequestParam("fid") String fid,
                                 @RequestParam("type") String type) {
        try {
            if (storagetype.trim().equals("win")) {
                String status = "0";
                String syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
                String destination = syspath + "/" + oid + "/om/" + type;
                if (fid != null && !fid.equals("")) {
                    FileUtil.deleteDirFilesLikeName(destination, fid + "_");
                    status = "1";
                }
                return "{\"status\": \"" + status + "\"" + "}"; // success
            } else if (storagetype.trim().equals("linux")) {
                String status = "0";
                String syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
                String destination = syspath + "/" + oid + "/om/" + type;
                if (fid != null && !fid.equals("")) {
                    FileUtil.deleteDirFilesLikeName(destination, fid + "_");
                    status = "1";
                }
                return "{\"status\": \"" + status + "\"" + "}"; // success
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"0\"}";
    }

    /**
     * 上传邮件模板附件
     *
     * @param oid        String, organization ID
     * @param fname
     * @param file
     * @param num
     * @param lastupdate
     * @param mimetype
     * @return
     */
    @RequestMapping(value = "/api3", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String uploadEmailAttachment(@RequestParam("oid") String oid,
                                        @RequestParam("tid") String tid,
                                        @RequestParam("fname") String fname,
                                        @RequestParam("uploadFile") MultipartFile file,
                                        @RequestParam("num") String num,
                                        @RequestParam("lastupdate") String lastupdate,
                                        @RequestParam("mimetype") String mimetype) {
        try {
            String fname2 = URLDecoder.decode(fname, "utf-8");
            String newfid = null;
            try {
                newfid = updateFile(oid, tid, fname2, file.getBytes(), num, lastupdate, mimetype, "am", "emltp");
            } catch (Exception e) {
                e.printStackTrace();
            }
            return "{\"status\": \"1\", \"fid\": \"" + newfid + "\"}"; // success
        } catch (IOException e) {
            e.printStackTrace();
            return "{\"status\": \"0\", \"fid\": \"\"}"; // failed
        }
    }

    /**
     * @param oid        String, organization ID
     * @param tid        String, template ID
     * @param fname      String, file name
     * @param file       byte[], file content
     * @param num        int, Upload number
     * @param lastupdate String, time stamp
     * @param mimeType,  String, multiple media type
     * @return
     * @throws Exception
     */
    private String updateFile(String oid,
                              String tid,
                              String fname,
                              byte[] file,
                              String num,
                              String lastupdate,
                              String mimeType,
                              String prj,
                              String service) throws Exception {
        String syspath = "";
        if (storagetype.trim().equals("win")) {
            syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
        } else if (storagetype.trim().equals("linux")) {
            syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
        }
        if (!syspath.equals("")) {
            String destination = syspath + "/" + oid + "/" + prj + "/" + service + "/" + tid;
            FileConstant fc = new FileConstant();
            UUID newfid = UUID.randomUUID();
            String fid = newfid.toString();
            fc.setId(fid);
            int des = fname.lastIndexOf(".");
            String suffix = fname.substring(des + 1);
            fc.setSuffix(suffix);
            String filename = fid + "_" + fname;
            fc.setName(fname);
            fc.setSize(file.length);
            fc.setLastupdate(DateUtility.getCurDateTime());
            fc.setFiletype(mimeType);
            fc.setCurrOwner(null);
            fc.setOwner(oid);
            JSONObject o = new JSONObject(fc);

            emailTemplateBlo.updateEmailAttachment(tid, fc.getName(), o, lastupdate);
            if (tid != null && !tid.equals("")) {
                FileUtil.deleteDirFilesLikeName(destination, filename);
            }
            File f = new File(destination + "/" + filename);
            if (!f.exists()) {
                FileUtil.createDir(destination);
                FileUtil.writeFile(file, destination, filename);
            }
            return fid;
        } else {
            return null;
        }
    }

    /**
     * 删除邮件模板附件
     *
     * @param oid        String, organization ID
     * @param tid        String, template ID
     * @param num        int, Upload number
     * @param fname      String, file name
     * @param lastupdate String, time stamp
     * @return
     */
    @RequestMapping(value = "/api4", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String deleteAmEmailFile(@RequestParam("oid") String oid,
                                    @RequestParam("tid") String tid,
                                    @RequestParam("fid") String fid,
                                    @RequestParam("num") String num,
                                    @RequestParam("filename") String fname,
                                    @RequestParam("lastupdate") String lastupdate) {
        try {
            String syspath = "";
            if (storagetype.trim().equals("win")) {
                syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
            } else if (storagetype.trim().equals("linux")) {
                syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
            }
            String status = "0";
            if (!syspath.equals("")) {
                String destination = syspath + "/" + oid + "/am/emltp/" + tid;
                String filename = fid + "_" + fname;
                emailTemplateBlo.deleteEmailAttachment(tid, fid, fname, lastupdate);
                if (tid != null && !tid.equals("")) {
                    FileUtil.delFile(destination, filename);
                    status = "1";
                }
            }
            return "{\"status\": \"" + status + "\"" + "}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
    }

    /**
     * 以下四个api是ProcessController内转移过来的
     */

    @RequestMapping(value = "/api5", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String updateFileObject(@RequestParam("oid") String oid,
                                   @RequestParam("pid") String pid,
                                   @RequestParam("vid") String vid,
                                   @RequestParam("fid") String fid,
                                   @RequestParam("fname") String fname,
                                   @RequestParam("uploadFile") MultipartFile file) {
        try {
            String fname2 = URLDecoder.decode(fname, "utf-8");
            // String oid, String pid, String vid, String fid, String fname,
            // byte[] file
            String newfid = FileUploadUtils.updateFile(oid, "pm", pid, vid, fid, fname2, file.getBytes());
            return "{\"status\": \"1\", \"fid\": \"" + newfid + "\"}"; // success
        } catch (IOException e) {
            e.printStackTrace();
            return "{\"status\": \"0\", \"fid\": \"\"}"; // failed
        }
    }

    @RequestMapping(value = "/api6", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String removeFileObject(@RequestParam("oid") String oid,
                                   @RequestParam("pid") String pid,
                                   @RequestParam("vid") String vid,
                                   @RequestParam("fid") String fid) {
        try {
            FileUploadUtils.removeFile(oid, "pm", pid, vid, fid);
            return "{\"status\": \"1\"}"; // success
        } catch (IOException e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
    }

    @RequestMapping(value = "/api7", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String removeVariableFileObject(@RequestParam("oid") String oid,
                                           @RequestParam("pid") String pid,
                                           @RequestParam("vid") String vid) {
        try {
            FileUploadUtils.removeVariableFileObject(oid, "pm", pid, vid);
            return "{\"status\": \"1\"}"; // success
        } catch (IOException e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
    }

    /**
     * @param oid
     * @param fid
     * @param fname
     * @param file
     * @return
     */
    @RequestMapping(value = "/api8", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String uploadFile(@RequestParam("oid") String oid,
                             @RequestParam("path") String path,
                             @RequestParam("fid") String fid,
                             @RequestParam("fname") String fname,
                             @RequestParam("uploadFile") MultipartFile file) {
        try {
            String fname2 = URLDecoder.decode(fname, "utf-8");
            String newfid = updateFile(oid, null, null, fid, fname2, file.getBytes(), null, null, path);
            return "{\"status\": \"1\", \"fid\": \"" + newfid + "\"}"; // success
        } catch (IOException e) {
            e.printStackTrace();
            return "{\"status\": \"0\", \"fid\": \"\"}"; // failed
        }
    }

    @RequestMapping(value = "/api9", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String deleteFileByPath(@RequestParam("oid") String oid,
                                   @RequestParam("path") String path)
            throws IOException {
        File file = new File(path);
        file.delete();
        return "{\"status\": \"1\"}"; // success
    }

    @RequestMapping(value = "/api10", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    public ResponseEntity<byte[]> downloadFile(@RequestParam("oid") String oid,
                                               @RequestParam("path") String path)
            throws IOException {
        ResponseEntity<byte[]> res = null;
        String path2 = URLDecoder.decode(path, "UTF-8");
        String storagetype = SystemConfig.getProp("filestorage.type");
        String syspath = "";
        if (storagetype.equals("win")) {
            syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
        } else if (storagetype.equals("linux")) {
            syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
        }
        if (!syspath.equals("")) {
            File file = new File(syspath + path2);
            if (file.exists() && file.isFile()) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentDispositionFormData("attachment", file.getName());
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                res = new ResponseEntity<byte[]>(FileUtil.BytesFromFile(file), headers, HttpStatus.CREATED);
            }
            return res; // success
        }
        return null;
    }

    @RequestMapping(value = "/api11", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String copyFileObject(@RequestParam("srcfolder") String srcfolder,
                                 @RequestParam("desfolder") String desfolder, @RequestParam("filename") String filename) {
        try {
            String srcfolder1 = URLDecoder.decode(srcfolder, "utf-8");
            String desfolder1 = URLDecoder.decode(desfolder, "utf-8");

            if (storagetype.trim().equals("win")) {
                String syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
                String src = syspath + srcfolder1;
                String des = syspath + desfolder1;
                FileUtil.copyFile(src, filename, des, null);
            } else if (storagetype.trim().equals("linux")) {
                String syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
                String src = syspath + srcfolder1;
                String des = syspath + desfolder1;
                FileUtil.copyFile(src, filename, des, null);
            }
            return "{\"status\": \"1\"}"; // success
        } catch (IOException e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
    }

    /**
     * 这个方法在BPM执行服务中被调用，用于将BPM执行服务处理完毕的文件对象，放回到文件服务器。
     *
     * @param oid
     * @param pid
     * @param vid
     * @param fid
     * @param fname
     * @param file
     * @return
     */
    @RequestMapping(value = "/api12", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String uploadFileObject(@RequestParam("oid") String oid,
                                   @RequestParam("pid") String pid,
                                   @RequestParam("vid") String vid,
                                   @RequestParam("fid") String fid,
                                   @RequestParam("fname") String fname,
                                   @RequestParam("uploadFile") MultipartFile file) {
        try {
            String fname2 = URLDecoder.decode(fname, "utf-8");
            String newfid = FileUploadUtils.updateFile(oid, "rt", pid, vid, fid, fname2, file.getBytes());
            return "{\"status\": \"1\", \"fid\": \"" + newfid + "\"}"; // success
        } catch (IOException e) {
            e.printStackTrace();
            return "{\"status\": \"0\", \"fid\": \"\"}"; // failed
        }
    }

    /**
     * 这个方法在BPM执行服务中被调用，用于将BPM执行服务所用到的文件数据，实时地传给BPM执行服务去处理。
     *
     * @param path
     * @return
     * @throws IOException
     */
    @RequestMapping(value = "/api13", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    public ResponseEntity<byte[]> downloadFileObject(@RequestParam("path") String path) throws IOException {
        ResponseEntity<byte[]> res = null;
        String path2 = URLDecoder.decode(path, "UTF-8");
        String storagetype = SystemConfig.getProp("filestorage.type");
        String syspath = "";
        if (storagetype.equals("win")) {
            syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
        } else if (storagetype.equals("linux")) {
            syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
        }
        if (!syspath.equals("")) {
            File file = new File(syspath + path2);
            if (file.exists() && file.isFile()) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentDispositionFormData("attachment", file.getName());
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                res = new ResponseEntity<byte[]>(FileUtil.BytesFromFile(file), headers, HttpStatus.CREATED);
            }
            return res; // success
        }
        return null;
    }

    @RequestMapping(value = "/api14", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public FileConstant uploadNewsAttachment(@RequestParam("oid") String oid,
                                             @RequestParam("tid") String tid,
                                             @RequestParam("fname") String fname,
                                             @RequestParam("uploadFile") MultipartFile file,
                                             @RequestParam("num") String num,
                                             @RequestParam("lastupdate") String lastupdate,
                                             @RequestParam("mimetype") String mimetype) {
        try {
            String fname2 = URLDecoder.decode(fname, "utf-8");
            try {
                return updateNewAttachments(oid, tid, fname2, file.getBytes(), num, lastupdate, mimetype, "adm",
                        "news");
            } catch (Exception e) {
                e.printStackTrace();
            }
            return null; // success
        } catch (IOException e) {
            e.printStackTrace();
            return null; // failed
        }
    }

    private FileConstant updateNewAttachments(String oid,
                                              String tid,
                                              String fname,
                                              byte[] file,
                                              String num,
                                              String lastupdate,
                                              String mimeType,
                                              String prj,
                                              String service) throws Exception {
        String syspath = "";
        if (storagetype.trim().equals("win")) {
            syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
        } else if (storagetype.trim().equals("linux")) {
            syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
        }
        if (!syspath.equals("")) {
            String destination = syspath + "/" + oid + "/" + prj + "/" + service + "/" + tid;
            FileConstant fc = new FileConstant();
            UUID newfid = UUID.randomUUID();
            String fid = newfid.toString();
            fc.setId(fid);
            int des = fname.lastIndexOf(".");
            String suffix = fname.substring(des + 1);
            fc.setSuffix(suffix);
            String filename = fid + "_" + fname;
            fc.setName(fname);
            fc.setSize(file.length);
            fc.setLastupdate(DateUtility.getCurDateTime());
            fc.setFiletype(mimeType);
            fc.setCurrOwner(null);
            fc.setOwner(oid);
            // JSONObject o = new JSONObject(fc);

            if (tid != null && !tid.equals("")) {
                FileUtil.deleteDirFilesLikeName(destination, filename);
            }
            File f = new File(destination + "/" + filename);
            if (!f.exists()) {
                FileUtil.createDir(destination);
                FileUtil.writeFile(file, destination, filename);
            }
            return fc;
        } else {
            return null;
        }
    }

    @RequestMapping(value = "/api15", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String deleteNewsAttachment(@RequestParam("oid") String oid,
                                       @RequestParam("tid") String tid,
                                       @RequestParam("fid") String fid,
                                       @RequestParam("num") String num,
                                       @RequestParam("filename") String fname,
                                       @RequestParam("lastupdate") String lastupdate) {
        try {
            String syspath = "";
            if (storagetype.trim().equals("win")) {
                syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
            } else if (storagetype.trim().equals("linux")) {
                syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
            }
            String status = "0";
            if (!syspath.equals("")) {
                String destination = syspath + "/" + oid + "/adm/news/" + tid;
                String filename = fid + "_" + fname;
                orgNewsBlo.removeOneAttachmentsById(tid, fid, fname, lastupdate);
                if (tid != null && !tid.equals("")) {
                    FileUtil.delFile(destination, filename);
                    status = "1";
                }
            }
            return "{\"status\": \"" + status + "\"" + "}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
    }

    @RequestMapping(value = "/api16", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String deleteAllNewsAttachments(@RequestParam("oid") String oid,
                                           @RequestParam("tid") String tid) {
        try {
            String syspath = "";
            if (storagetype.trim().equals("win")) {
                syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
            } else if (storagetype.trim().equals("linux")) {
                syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
            }
            String status = "0";
            if (!syspath.equals("")) {
                String destination = syspath + "/" + oid + "/adm/news/" + tid;
                if (tid != null && !tid.equals("")) {
                    FileUtil.delDir(destination);
                    status = "1";
                }
            }
            return "{\"status\": \"" + status + "\"" + "}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
    }

    @RequestMapping(value = "/api17", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String uploadFileObject(@RequestParam("oid") String oid,
                                   @RequestParam("dir") String dir,
                                   @RequestParam("fid") String fid,
                                   @RequestParam("fname") String fname,
                                   @RequestParam("uploadFile") MultipartFile file,
                                   @RequestParam("project") String project,
                                   @RequestParam("ftype") String ftype) {
        try {
            String fname2 = URLDecoder.decode(fname, "utf-8");
            String suffix = fname2.substring(fname2.lastIndexOf("."));

            String filename = ftype + "_" + fid + suffix;
            String status = updateMobileAppPluginFile(oid, fid, filename,
                    file.getBytes(), project, dir);
            return "{\"status\": \"1\", \"fid\": \"" + status + "\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\", \"fid\": \"\"}"; // failed
        }
    }

    private String updateMobileAppPluginFile(String oid,
                                             String fid,
                                             String fname,
                                             byte[] file,
                                             String project,
                                             String dirName) throws Exception {
        String destination = "";
        if (storagetype.trim().equals("win")) {
            String syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
            destination = syspath + "/" + oid + "/" + project + "/";
            if (!StringUtils.isEmpty(dirName)) {// 指定组织下面文件夹
                destination = destination + dirName + "/" + fid;
            }
        } else if (storagetype.trim().equals("linux")) {
            String syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
            destination = syspath + "/" + oid + "/" + project + "/";
            if (!StringUtils.isEmpty(dirName)) {// 指定组织下面文件夹
                destination = destination + dirName + "/" + fid;
            }
        }
        File f = new File(destination + "/" + fname);
        File f1 = new File(destination + "/" + fname +
                DateUtility.formatDatetime(new Date(), "yyyyMMddHHmmss"));
        if (f.exists()) {
            FileUtil.rename(f, f1);
        }
        FileUtil.createDir(destination);
        FileUtil.writeFile(file, destination, fname);


        return "success";
    }

    @RequestMapping(value = "/api18", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public FileConstant[] getDirectoryFileList(@RequestParam("oid") String oid,
                                               @RequestParam("dir") String dir,
                                               @RequestParam("fid") String fid,
                                               @RequestParam("project") String project) {

        String ver = SystemConfig.getProp("xq.product.pversion");
        List<FileConstant> fcs = new ArrayList<>();
        if (ver.equals("1")) { // 单机版，保存到硬盘上
            String destination = "";
            if (storagetype.trim().equals("win")) {
                String syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
                destination = syspath + "/" + oid + "/" + project + "/" + dir + "/" + fid;
            } else if (storagetype.trim().equals("linux")) {
                String syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
                destination = syspath + "/" + oid + "/" + project + "/" + dir + "/" + fid;
            }
            List<File> list = FileUtil.getFileList(destination);
            for (File f : list) {
                FileConstant fc = new FileConstant();
                fc.setId(f.getName());
                fc.setName(f.getName());
                fc.setLastupdate(String.valueOf(f.lastModified()));
                fc.setSize(f.length());
                fcs.add(fc);
            }
            return fcs.toArray(new FileConstant[list.size()]);
        } else if (ver.equals("2")) { // 私有云版
        } else if (ver.equals("3")) { // 公共云版
        }
        return new FileConstant[0];
    }

    @RequestMapping(value = "/api19", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String removeFile(@RequestParam("oid") String oid,
                             @RequestParam("dir") String dir,
                             @RequestParam("appid") String appid,
                             @RequestParam("fid") String fid,
                             @RequestParam("project") String project) {
        try {
            String destination = "";
            if (storagetype.trim().equals("win")) {
                String syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
                destination = syspath + "/" + oid + "/" + project + "/" + dir + "/" + appid;
            } else if (storagetype.trim().equals("linux")) {
                String syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
                destination = syspath + "/" + oid + "/" + project + "/" + dir + "/" + appid;
            }
            FileUtil.deleteFile(new File(destination + "/" + fid));
            return "{\"status\": \"1\"\", \"fid\": \"\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\", \"fid\": \"\"}"; // failed
        }
    }

    /**
     * Android上传错误报告
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/api20", headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String uploadErrorFile(@RequestParam MultipartFile file, String fileName) throws Exception {
        String destination = "";
        String syspath = "";
//					System.out.println(image);
//					System.out.println();
        //这里需要“\\”来转义
//					String[] imageName1 = imageName.split("\\|");
//					String[] image1 = image.split("\\|");
        if (storagetype.trim().equals("win")) {
            syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
            //syspath = D:/data/org
        } else if (storagetype.trim().equals("linux")) {
            syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
        }
        destination = syspath + "/xuanQi/log";
        File f = new File(destination + "/" + fileName);
        if (!f.exists()) {
            FileUtil.createDir(destination);
            FileUtil.writeFile(file.getBytes(), destination, fileName);
        }
        return "success";
    }


    /**
     * 文件管理，获取当前目录下的所有的文件和文件夹列表。
     *
     * @param oid
     * @param dir
     * @return
     */
    @RequestMapping(value = "/api21", method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public FileConstant[] getDirectoryContents(@RequestParam("oid") String oid,
                                               @RequestParam("dir") String dir) throws UnsupportedEncodingException {

            String ver = SystemConfig.getProp("xq.product.pversion");
            String targetpath1 = URLDecoder.decode(dir, "utf-8");
            if (ver.equals("1")) { // 单机版，保存到硬盘上
                String destination = "";
                if (storagetype.trim().equals("win")) {
                    String syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
                    if (targetpath1 != null && !targetpath1.trim().equals("/"))
                        destination = syspath + "/" + oid + targetpath1;
                    else
                        destination = syspath + "/" + oid + "/";
                } else if (storagetype.trim().equals("linux")) {
                    String syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
                    if (targetpath1 != null && !targetpath1.trim().equals("/"))
                        destination = syspath + "/" + oid + targetpath1;
                    else
                        destination = syspath + "/" + oid + "/";
                    logger.info("destination----------------------->" + destination);
                }
                List<File> list = FileUtil.getCurrentFolderContent(destination);
                return getFileConstants(list);
            } else if (ver.equals("2")) { // 私有云版
            } else if (ver.equals("3")) { // 公共云版
            }
        return new FileConstant[0];
    }

    /**
     * 文件管理，获取上一级文件夹的文件和文件夹列表。
     *
     * @param oid
     * @param dir
     * @return
     */
    @RequestMapping(value = "/api22", method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public FileConstant[] getParentDirectoryContents(@RequestParam("oid") String oid,
                                                     @RequestParam("dir") String dir) throws UnsupportedEncodingException {

            String ver = SystemConfig.getProp("xq.product.pversion");
            String targetpath1 = URLDecoder.decode(dir, "utf-8");
            if (ver.equals("1")) { // 单机版，保存到硬盘上
                String destination = "";
                if (storagetype.trim().equals("win")) {
                    String syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
                    if (targetpath1 != null && !targetpath1.trim().equals("/"))
                        destination = syspath + "/" + oid + targetpath1;
                    else
                        destination = syspath + "/" + oid + "/";
                } else if (storagetype.trim().equals("linux")) {
                    String syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
                    if (targetpath1 != null && !targetpath1.trim().equals("/"))
                        destination = syspath + "/" + oid + targetpath1;
                    else
                        destination = syspath + "/" + oid + "/";
                }
                List<File> list = FileUtil.getParentFolderContent(destination);
                return getFileConstants(list);
            } else if (ver.equals("2")) { // 私有云版
            } else if (ver.equals("3")) { // 公共云版
            }
        return new FileConstant[0];
    }

    /**
     * 把java文件file列表转换成file constant列表
     *
     * @param list
     * @return
     */
    private FileConstant[] getFileConstants(List<File> list) {
        List<FileConstant> fcs = new ArrayList<>();
        for (File f : list) {
            FileConstant fc = new FileConstant();
            fc.setId(f.getName());
            fc.setName(f.getName());
            fc.setLastupdate(String.valueOf(f.lastModified()));
            if (f.isDirectory()) {
                fc.setIsDirctory(1);
                List<File> l = FileUtil.getAllFileList(f.getPath());
                fc.setFileCount(l.size()); // 列出来其下面所有的子文件夹中的文件数
                fc.setSize(0);
            } else {
                fc.setIsDirctory(0);
                fc.setFileCount(0);
                fc.setSize(f.length()); // 文件大小
            }
            if (fc.getSize() > 0) {
                String suffix = f.getName().substring(f.getName().lastIndexOf(".") + 1, f.getName().length());
                fc.setFiletype(suffix);
            } else {
                fc.setFiletype("");
            }
            fcs.add(fc);
        }
        return fcs.toArray(new FileConstant[list.size()]);
    }

    /**
     * 文件管理：上传一个或多个文件到指定的文件目录。
     *
     * @param owner
     * @param targetpath
     * @param files
     * @return
     */
    @RequestMapping(value = "/api23", method = RequestMethod.POST,
            headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String uploadFiles(@RequestParam("owner") String owner,
                              @RequestParam("targetpath") String targetpath,
                              @RequestParam("fname") String fname,
                              @RequestParam("uploadFile") MultipartFile file,
                              @RequestParam("flen") String flen) {
        try {
            String ver = SystemConfig.getProp("xq.product.pversion");
            String targetpath1 = URLDecoder.decode(targetpath, "utf-8");
            String fname1 = URLDecoder.decode(fname, "utf-8");
            if (ver.equals("1")) { // 单机版，保存到硬盘上
                String destination = "";
                if (storagetype.trim().equals("win")) {
                    String syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
                    if (!targetpath.equals("/")) {
                        destination = syspath + "/" + owner + targetpath1 + "/";
                    } else {
                        destination = syspath + "/" + owner + "/";
                    }
                } else if (storagetype.trim().equals("linux")) {
                    String syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
                    if (!targetpath.equals("/")) {
                        destination = syspath + "/" + owner + targetpath1 + "/";
                    } else {
                        destination = syspath + "/" + owner + "/";
                    }
                }
                FileUtil.createDir(destination);
                FileUtil.writeFile(file.getBytes(), destination, fname1);
                return "{\"status\": \"1\"}"; // success
            } else if (ver.equals("2")) { // 私有云版

            } else if (ver.equals("3")) { // 公共云版

            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{\"status\": \"0\"}"; // failed
    }


    /**
     * 文件管理：删除一个文件
     *
     * @param oid
     * @param path
     * @param fname
     * @return
     */
    @RequestMapping(value = "/api24", method = RequestMethod.POST,
            headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String deleteFileOrFolder(@RequestParam("oid") String oid,
                                     @RequestParam("path") String path,
                                     @RequestParam("fname") String fname) {
        try {
            String path2 = URLDecoder.decode(path, "UTF-8");
            String foldername2 = URLDecoder.decode(fname, "UTF-8");
            String ver = SystemConfig.getProp("xq.product.pversion");
            if (ver.equals("1")) { // 单机版
                String syspath = "";
                if (storagetype.trim().equals("win")) {
                    syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
                } else if (storagetype.trim().equals("linux")) {
                    syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
                }
                String status = "0";
                if (!syspath.equals("")) {
                    String destination = syspath + "/" + oid + path2;
                    FileUtil.remove(destination, foldername2);
                }
                return "{\"status\": \"" + status + "\"" + "}"; // success

            } else if (ver.equals("2")) { // 私有云版
            } else if (ver.equals("3")) { // 公共云版
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{\"status\": \"0\"}"; // failed
    }


    /**
     * 文件管理：创建一个文件夹
     *
     * @param oid
     * @param path
     * @param fname
     * @return
     */
    @RequestMapping(value = "/api25", method = RequestMethod.POST,
            headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String createFolder(@RequestParam("oid") String oid,
                               @RequestParam("path") String path,
                               @RequestParam("foldername") String foldername) {
        try {
            String path2 = URLDecoder.decode(path, "UTF-8");
            String foldername2 = URLDecoder.decode(foldername, "UTF-8");
            String ver = SystemConfig.getProp("xq.product.pversion");
            if (ver.equals("1")) { // 单机版
                String syspath = "";
                if (storagetype.trim().equals("win")) {
                    syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
                } else if (storagetype.trim().equals("linux")) {
                    syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
                }
                String status = "0";
                if (!syspath.equals("")) {
                    String destination = syspath + "/" + oid + path2;
                    FileUtil.createDir(destination + "/" + foldername2);
                }
                return "{\"status\": \"" + status + "\"" + "}"; // success
            } else if (ver.equals("2")) { // 私有云版
            } else if (ver.equals("3")) { // 公共云版
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{\"status\": \"0\"}"; // failed
    }


    /**
     * 文件管理：重命名一个文件或文件夹
     *
     * @param oid
     * @param path
     * @param fname
     * @return
     */
    @RequestMapping(value = "/api26", method = RequestMethod.POST,
            headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String rename(@RequestParam("oid") String oid,
                         @RequestParam("path") String path,
                         @RequestParam("oldname") String oldname,
                         @RequestParam("newname") String newname) {
        try {
            String ver = SystemConfig.getProp("xq.product.pversion");
            String path2 = URLDecoder.decode(path, "UTF-8");
            String oldname2 = URLDecoder.decode(oldname, "UTF-8");
            String newname2 = URLDecoder.decode(newname, "UTF-8");
            if (ver.equals("1")) { // 单机版
                try {
                    String syspath = "";
                    if (storagetype.trim().equals("win")) {
                        syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
                    } else if (storagetype.trim().equals("linux")) {
                        syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
                    }
                    String status = "0";
                    if (!syspath.equals("")) {
                        String destination = syspath + "/" + oid + path2;
                        File of = new File(destination + "/" + oldname2);
                        File nf = new File(destination + "/" + newname2);
                        if (of.exists()) {
                            FileUtil.rename(of, nf);
                        }
                    }
                    return "{\"status\": \"" + status + "\"" + "}"; // success
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else if (ver.equals("2")) { // 私有云版
            } else if (ver.equals("3")) { // 公共云版
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{\"status\": \"0\"}"; // failed
    }

    /**
     * 文件管理：下载一个文件到客户端
     *
     * @param oid
     * @param path
     * @return
     * @throws IOException
     */
    @RequestMapping(value = "/api27", method = RequestMethod.POST,
            headers = "Accept=application/json; charset=utf-8")
    public ResponseEntity<byte[]> download(@RequestParam("oid") String oid,
                                           @RequestParam("path") String path,
                                           @RequestParam("filename") String filename) throws IOException {
        String ver = SystemConfig.getProp("xq.product.pversion");
        if (ver.equals("1")) { // 单机版
            ResponseEntity<byte[]> res = null;
            String path2 = URLDecoder.decode(path, "UTF-8");
            String storagetype = SystemConfig.getProp("filestorage.type");
            String syspath = "";
            if (storagetype.equals("win")) {
                syspath = SystemConfig.getProp("windows.filestorage.lib") + "/org";
            } else if (storagetype.equals("linux")) {
                syspath = SystemConfig.getProp("linux.filestorage.lib") + "/org";
            }
            if (!syspath.equals("")) {
                File file = new File(syspath + "/" + oid + path2 + "/" + filename);
                if (file.exists() && file.isFile()) {
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentDispositionFormData("attachment", file.getName());
                    headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                    res = new ResponseEntity<byte[]>(FileUtil.BytesFromFile(file), headers, HttpStatus.CREATED);
                }
                return res; // success
            }
        } else if (ver.equals("2")) { // 私有云版
        } else if (ver.equals("3")) { // 公共云版
        }
        return null; // failed
    }

    /**
     * 文件管理：上传一个或多个文件到指定的文件目录。
     * 用于课程管理的电子书、音频上传
     *
     * @param owner
     * @param targetpath
     * @param files
     * @return
     */
    @RequestMapping(value = "/api28", method = RequestMethod.POST, produces="application/json")
    @ResponseBody
    public String uploadFilesForCourse(@RequestParam("owner") String owner,
                                       @RequestParam("type") String type,
                                       @RequestParam("data") String data,
                                       @RequestParam("fname") String fname,
                                       @RequestParam("flen") String flen,
                                       @RequestParam("userId") String userId,
                                       @RequestParam("uploadFile") MultipartFile... file
    ) {
        try {
            String fileId = UUID.randomUUID().toString().replaceAll("-", "");
            String[] split = fname.split(",");//文件名存在乱码问题
            String ver = SystemConfig.getProp("xq.product.pversion");
            if (ver.equals("1")) { // 单机版，保存到硬盘上
                String destination = "";
                String relativePath = "";
                if (storagetype.trim().equals("win")) {
                    String syspath = SystemConfig.getProp("windows.filestorage.lib");
                    if (type.equals("1")){
                        destination = syspath + "/usr/" + userId + "/E-book/"+fileId+"/";
                        relativePath = "/usr/" + userId + "/E-book/"+fileId+"/";
                    }else if(type.equals("2")){
                        destination = syspath + "/usr/" + userId + "/audio/"+fileId+"/";
                        relativePath = "/usr/" + userId + "/audio/"+fileId+"/";
                    }else if (type.equals("3")){
                        destination = syspath + "/usr/" + userId + "/video/"+fileId+"/";
                        relativePath = "/usr/" + userId + "/video/"+fileId+"/";
                    }else if (type.equals("4")){
                        destination = syspath + "/usr/" + userId + "/live/"+fileId+"/";
                        relativePath = "/usr/" + userId + "/live/"+fileId+"/";
                    }
                } else if (storagetype.trim().equals("linux")) {
                    String syspath = SystemConfig.getProp("linux.filestorage.lib");
                    if (type.equals("1")){
                        destination = syspath + "/usr/" + userId + "/E-book/"+fileId+"/";
                        relativePath = "/usr/" + userId + "/E-book/"+fileId+"/";
                    }else if(type.equals("2")){
                        destination = syspath + "/usr/" + userId + "/audio/"+fileId+"/";
                        relativePath = "/usr/" + userId + "/audio/"+fileId+"/";
                    }else if (type.equals("3")){
                        destination = syspath + "/usr/" + userId + "/video/"+fileId+"/";
                        relativePath = "/usr/" + userId + "/video/"+fileId+"/";
                    }else if (type.equals("4")){
                        destination = syspath + "/usr/" + userId + "/live/"+fileId+"/";
                        relativePath = "/usr/" + userId + "/live/"+fileId+"/";
                    }
                }
                FileUtil.createDir(destination);
                for (int i = 0; i < file.length; i++) {
                    FileUtil.writeFile(file[i].getBytes(), destination, URLDecoder.decode(split[i], "UTF-8"));
                }
                if (type.equals("1")) {//上传电子书
                    Book book = jsonForBook(data);
                    book.setId(fileId);
                    book.setBookPath(relativePath + split[0]);
                    book.setImagePath(relativePath + split[1]);
                    adminBlo.saveBook(book);
                } else if (type.equals("2")) {//音频
                    Audio audio = jsonForAudio(data);
                    audio.setId(fileId);
                    audio.setAudioPath(relativePath + split[0]);
                    audio.setAudioImage(relativePath + split[1]);
                    adminBlo.saveAudio(audio);
                } else if(type.equals("3")){//视频
                    Video video = jsonForVideo(data);
                    video.setId(fileId);
                    video.setVideoPath(relativePath+split[0]);
                    video.setImagePath(relativePath+split[1]);
                    video.setPatchPath(relativePath+split[2]);
                    adminBlo.saveVideo(video);
                } else if(type.equals("4")){//直播
                    Live live = jsonForLive(data);
                    live.setId(fileId);
                    live.setLiveImage(relativePath + split[0]);
                    adminBlo.saveLive(live);
                }
                return "{\"status\": \"1\"}"; // success
            } else if (ver.equals("2")) { // 私有云版
            } else if (ver.equals("3")) { // 公共云版
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{\"status\": \"0\"}"; // failed
    }

    //上传新闻图片
    @RequestMapping(value = "/api30", method = RequestMethod.POST,
            headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String uploadVoiceFiles(@RequestParam("oid") String oid,
                                   @RequestParam("file") MultipartFile file) {
        String destination = "";
        String fname = UUID.randomUUID() + ".jpg";
        if (storagetype.trim().equals("win")) {
            destination = SystemConfig.getProp("windows.filestorage.lib") + "/org" + "/" + oid + "/nm";
        } else if (storagetype.trim().equals("linux")) {
            destination = SystemConfig.getProp("linux.filestorage.lib") + "/org" + "/" + oid + "/nm";
        }
        try {
            FileUtil.createDir(destination);
            FileUtil.writeFile(file.getBytes(), destination, fname);
            return destination + "/" + fname; // success
        } catch (IOException e) {
            e.printStackTrace();
            return ""; // failed
        }

    }

    /**
     * 上传聊天资料,指定文件路径
     *
     * @param owner
     * @param targetpath
     * @param files
     * @return
     */
    @RequestMapping(value = "/api31", method = RequestMethod.POST,
            headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String uploadVoiceFiles(@RequestParam("oid") String oid,
                                   @RequestParam("uid") String uid,
                                   @RequestParam("type") String type,
                                   @RequestParam("file") MultipartFile file) {
        try {
            if(file == null){//判断文件是否存在
                return ""; // failed
            }
            String destination = "";
            String suffix = "";
            if (storagetype.trim().equals("win")) {
                destination = SystemConfig.getProp("windows.filestorage.lib") + "/org" + "/" + oid + "/usr/" + uid + "/chatRecord";
            } else if (storagetype.trim().equals("linux")) {
                destination = SystemConfig.getProp("linux.filestorage.lib") + "/org" + "/" + oid + "/usr/" + uid + "/chatRecord";
            }
            if(StringUtils.isNotBlank(file.getOriginalFilename())){//判断文件名是否为空
                String[] split = URLDecoder.decode(file.getOriginalFilename(), "utf-8").split("\\.");
                suffix = split[1];
            }
            String fname = UUID.randomUUID() + "." + suffix;
            if ("1".equals(type)) { // 聊天图片
                destination = destination + "/chatImage";
            } else if ("2".equals(type)) { // 聊天语音文件
                destination = destination + "/chatVoice";
            } else if ("3".equals(type)) { // 聊天视频文件
                destination = destination + "/chatVideo";
            }else if ("4".equals(type)) { // 聊天传文件
                destination = destination + "/chatFile";
            }
            FileUtil.createDir(destination);
            FileUtil.writeFile(file.getBytes(), destination, fname);
            return destination + "/" + fname; // success
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ""; // failed
    }

    //上传反馈附件
    @RequestMapping(value = "/api33", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String uploadEmail(@RequestParam("uid") String uid,
                              @RequestParam("fname") String fname,
                              @RequestParam("uploadFile") MultipartFile file,
                              @RequestParam("mimetype") String mimetype) {

        String path = "/feedback";
        try {
            if (!mimetype.contains("image")) {
                return "{\"status\": \"0\", \"fid\": \"\"}"; // failed
            }
            String[] split = fname.split("\\.");
            fname = UUID.randomUUID() + "." + split[1];
            uploadPersonalFiles(uid,path,fname,file);
            return "{\"status\": \"1\", \"path\": \"" + getDestination(uid) + "/feedback/" + fname + "\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\", \"fid\": \"\"}"; // failed
        }
    }

    //删除该次反馈中全部附件
    @RequestMapping(value = "/api34", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String delEmailAllAnnex(@RequestParam("paths") String paths) {
        Object[] objects = JSON.parseArray(paths).toArray();
        String[] str = new String[objects.length];
        for (int i = 0; i < objects.length; i++) {
            FileUtil.remove((String) objects[i]);
        }
        return "{\"status\": \"1\"}";
    }

    //删除反馈附件
    @RequestMapping(value = "/api35", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String delEmailAnnex(@RequestParam("path") String path) {
        FileUtil.remove(path);
        return "{\"status\": \"1\"}";
    }

    /**
     * 上传一个或多个文件到个人文件目录。
     *
     * @param owner
     * @param targetpath
     * @param files
     * @return
     */
    @RequestMapping(value = "/api36", method = RequestMethod.POST,
            headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String uploadPersonalFiles(@RequestParam("uid") String uid,
                                      @RequestParam("targetpath") String targetpath,
                                      @RequestParam("fname") String fname,
                                      @RequestParam("uploadFile") MultipartFile file) {
        try {
            targetpath = URLDecoder.decode(targetpath, "utf-8");
            fname = URLDecoder.decode(fname, "utf-8");
            String destination = getDestination(uid);
            if (!targetpath.equals("/")) {
                destination = destination + targetpath;
            }
            FileUtil.createDir(destination);
            FileUtil.writeFile(file.getBytes(), destination, fname);
            return "{\"status\": \"1\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{\"status\": \"0\"}"; // failed
    }

    /**
     * 删除个人目录下一个文件
     *
     * @param oid
     * @param path
     * @param fname
     * @return
     */
    @RequestMapping(value = "/api37", method = RequestMethod.POST,
            headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String deletePersonalFileOrFolder(@RequestParam("uid") String uid,
                                             @RequestParam("path") String path,
                                             @RequestParam("fname") String fname) {
        try {
            path = URLDecoder.decode(path, "UTF-8");
            String foldername = URLDecoder.decode(fname, "UTF-8");
            String destination = getDestination(uid);
            String status = "0";
            if (!"/".equals(path)) {
                destination = destination + path;
            }
            FileUtil.remove(destination + "/" + foldername);
            return "{\"status\": \"" + status + "\"" + "}"; // success
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{\"status\": \"0\"}"; // failed
    }


    /**
     * 创建个人目录下文件夹
     *
     * @param oid
     * @param path
     * @param fname
     * @return
     */
    @RequestMapping(value = "/api38", method = RequestMethod.POST,
            headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String createPersonalFolder(@RequestParam("uid") String uid,
                                       @RequestParam("path") String path,
                                       @RequestParam("foldername") String foldername) {
        try {
            path = URLDecoder.decode(path, "UTF-8");
            foldername = URLDecoder.decode(foldername, "UTF-8");
            String destination = getDestination(uid);
            String status = "0";
            if (!"/".equals(path)) {
                destination = destination + path;
            }
            FileUtil.createDir(destination + "/" + foldername);
            return "{\"status\": \"" + status + "\"" + "}"; // success
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{\"status\": \"0\"}"; // failed
    }


    /**
     * 重命名个人目录下文件或文件夹
     *
     * @param oid
     * @param path
     * @param fname
     * @return
     */
    @RequestMapping(value = "/api39", method = RequestMethod.POST,
            headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String rnamePersonalFile(@RequestParam("uid") String uid,
                                    @RequestParam("path") String path,
                                    @RequestParam("oldname") String oldname,
                                    @RequestParam("newname") String newname) {
        try {
            path = URLDecoder.decode(path, "UTF-8");
            oldname = URLDecoder.decode(oldname, "UTF-8");
            newname = URLDecoder.decode(newname, "UTF-8");
            String destination = getDestination(uid);
            String status = "0";
            try {
                if (!"/".equals(path)) {
                    destination = destination + path;
                }
                File of = new File(destination + "/" + oldname);
                File nf = new File(destination + "/" + newname);
                if (of.exists()) {
                    FileUtil.rename(of, nf);
                }
                return "{\"status\": \"" + status + "\"" + "}"; // success
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{\"status\": \"0\"}"; // failed
    }

    /**
     * 文件管理：下载一个文件到客户端
     *
     * @param oid
     * @param path
     * @return
     * @throws IOException
     */
    @RequestMapping(value = "/api40", method = RequestMethod.POST,
            headers = "Accept=application/json; charset=utf-8")
    public ResponseEntity<byte[]> downloadPersonalFile(@RequestParam("uid") String uid,
                                                       @RequestParam("path") String path,
                                                       @RequestParam("filename") String filename) throws IOException {

        ResponseEntity<byte[]> res = null;
        path = URLDecoder.decode(path, "UTF-8");
        filename = URLDecoder.decode(filename, "UTF-8");
        String destination = getDestination(uid);
        if (!"/".equals(path)) {
            destination = destination + path + "/" + filename;
        } else {
            destination = destination + "/" + filename;
        }
        File file = new File(destination);
        if (file.exists() && file.isFile()) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.add("Content-Disposition", "attachment; fileName=" + filename);
            return new ResponseEntity<byte[]>(FileUtil.BytesFromFile(file), headers, HttpStatus.OK);
        }
        return null; // failed
    }

    /**
     * 获取个人目录下的所有的文件和文件夹列表。
     *
     * @param oid
     * @param dir
     * @return
     */
    @RequestMapping(value = "/api41", method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public FileConstant[] getPersonDirectoryContents(@RequestParam("uid") String uid,
                                                     @RequestParam("dir") String dir) {
        try {
            String targetpath = URLDecoder.decode(dir, "utf-8");
            String destination = getDestination(uid);
            if (targetpath != null && !targetpath.trim().equals("/")) {
                destination = destination + targetpath;
            }
            List<File> list = FileUtil.getCurrentFolderContent(destination);
            return getFileConstants(list);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return new FileConstant[0];
    }

    /**
     * 获取个人上一级文件夹的文件和文件夹列表。
     *
     * @param oid
     * @param dir
     * @return
     */
    @RequestMapping(value = "/api42", method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public FileConstant[] getPersonParentDirectoryContents(@RequestParam("uid") String uid,
                                                           @RequestParam("dir") String dir) {
        try {
            String targetpath = URLDecoder.decode(dir, "utf-8");
            String destination = getDestination(uid);
            if (targetpath != null && !targetpath.trim().equals("/")) {
                destination = destination + targetpath;
            }
            List<File> list = FileUtil.getParentFolderContent(destination);
            return getFileConstants(list);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new FileConstant[0];
    }

    //获取个人文件管理时，判断系统
    private String getDestination (String uid){
        String destination = "";
        if (storagetype.trim().equals("win")) {
            destination = SystemConfig.getProp("windows.filestorage.lib") +"/usr/" + uid;
        } else if (storagetype.trim().equals("linux")) {
            destination = SystemConfig.getProp("linux.filestorage.lib") + "/usr/" + uid;
        }
        return destination;
    }

    private Book jsonForBook(String data) {
        JSONObject jsonObject = new JSONObject(data);
        Book book = new Book();
        if (!jsonObject.getString("id").isEmpty()){
            book.setId(jsonObject.getString("id"));
        }
        if (!jsonObject.getString("bookName").isEmpty()) {
            book.setBookName(jsonObject.getString("bookName"));
        }
        if (!jsonObject.getString("ownerId").isEmpty()) {
            book.setOwnerId(jsonObject.getString("ownerId"));
        }
        if (!jsonObject.getString("userId").isEmpty()) {
            book.setUserId(jsonObject.getString("userId"));
        }
        if (!jsonObject.getString("bookAuthor").isEmpty()) {
            book.setBookAuthor(jsonObject.getString("bookAuthor"));
        }
        if (!jsonObject.getString("descript").isEmpty()) {
            book.setDescript(jsonObject.getString("descript"));
        }
        if (!jsonObject.getString("sellType").isEmpty()) {
            int sellType = Integer.parseInt(jsonObject.getString("sellType"));
            if (sellType == 0) {
                if (!jsonObject.getString("goodPrise").isEmpty()) {
                    double goodPrise = Double.parseDouble(jsonObject.getString("goodPrise"));
                    book.setGoodPrise(goodPrise);
                }
                if (!jsonObject.getString("discountPrise").isEmpty()) {
                    double discountPrise = Double.parseDouble(jsonObject.getString("discountPrise"));
                    book.setDiscountPrise(discountPrise);
                }
            } else if (sellType == 1) {
                book.setGoodPrise(0.00);
                book.setDiscountPrise(0.00);
            }
            book.setSellType(sellType);
        }
        book.setCreateTime(System.currentTimeMillis());
        return book;
    }

    private Audio jsonForAudio(String data) {
        JSONObject jsonObject = new JSONObject(data);
        Audio audio = new Audio();
        if (!jsonObject.getString("audioName").isEmpty()) {
            audio.setAudioName(jsonObject.getString("audioName"));
        }
        if (!jsonObject.getString("ownerId").isEmpty()) {
            audio.setOwnerId(jsonObject.getString("ownerId"));
        }
        if (!jsonObject.getString("userId").isEmpty()) {
            audio.setUserId(jsonObject.getString("userId"));
        }
        if (!jsonObject.getString("audioDesc").isEmpty()) {
            audio.setAudioDesc(jsonObject.getString("audioDesc"));
        }
        if (!jsonObject.getString("sellType").isEmpty()) {
            int sellType = Integer.parseInt(jsonObject.getString("sellType"));
            if (sellType == 0) {
                if (!jsonObject.getString("goodPrise").isEmpty()) {
                    double goodPrise = Double.parseDouble(jsonObject.getString("goodPrise"));
                    audio.setGoodPrise(goodPrise);
                }
                if (!jsonObject.getString("discountPrise").isEmpty()) {
                    double discountPrise = Double.parseDouble(jsonObject.getString("discountPrise"));
                    audio.setDiscountPrise(discountPrise);
                }
            } else if (sellType == 1) {
                audio.setGoodPrise(0.00);
                audio.setDiscountPrise(0.00);
            }
            audio.setSellType(sellType);
        }
        audio.setCreateTime(System.currentTimeMillis());
        return audio;
    }

    private Live jsonForLive(String data) throws Exception {
        JSONObject jsonObject = new JSONObject(data);
        Live live = new Live();
        if (!jsonObject.getString("userId").isEmpty()) {
            live.setUserId(jsonObject.getString("userId"));
        }
        if (!jsonObject.getString("ownerId").isEmpty()) {
            live.setOwnerId(jsonObject.getString("ownerId"));
        }
        if (!jsonObject.getString("liveName").isEmpty()) {
            live.setLiveName(jsonObject.getString("liveName"));
        }
        if (!jsonObject.getString("liveDesc").isEmpty()) {
            live.setLiveDesc(jsonObject.getString("liveDesc"));
        }
        if (!jsonObject.getString("liveType").isEmpty()) {
            live.setLiveType(jsonObject.getString("liveType"));
        }
        if (!jsonObject.getString("liveDate").isEmpty()) {
            String liveDate = jsonObject.getString("liveDate");
            String time_Format = "yyyy-MM-dd HH:mm:ss";
            if (!StringUtils.isEmpty(liveDate)) {
                if (!StringUtils.isEmpty(time_Format)) {
                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat(time_Format);
                    long time = simpleDateFormat.parse(liveDate).getTime();
                    live.setLiveDate(time);
                }
            }
        }
        if (!jsonObject.getString("liveTime").isEmpty()) {
            live.setLiveTime(jsonObject.getString("liveTime"));
        }
        if (!jsonObject.getString("liveInfo").isEmpty()) {
            live.setLiveInfo(jsonObject.getString("liveInfo"));
        }
        if (!jsonObject.getString("sellType").isEmpty()) {
            int sellType = Integer.parseInt(jsonObject.getString("sellType"));
            if (sellType == 0) {
                if (!jsonObject.getString("goodPrise").isEmpty()) {
                    double goodPrise = Double.parseDouble(jsonObject.getString("goodPrise"));
                    live.setGoodPrise(goodPrise);
                }
                if (!jsonObject.getString("discountPrise").isEmpty()) {
                    double discountPrise = Double.parseDouble(jsonObject.getString("discountPrise"));
                    live.setDiscountPrise(discountPrise);
                }
            } else if (sellType == 1) {
                live.setGoodPrise(0.00);
                live.setDiscountPrise(0.00);
            }
            live.setSellType(sellType);
        }
        live.setCreateTime(System.currentTimeMillis());
        return live;
    }

    private Video jsonForVideo(String data) throws Exception{
        JSONObject jsonObject = new JSONObject(data);
        Video video = new Video();
        if (!jsonObject.getString("userId").isEmpty()){
            video.setUserId(jsonObject.getString("userId"));
        }
        if (!jsonObject.getString("ownerId").isEmpty()){
            video.setOwnerId(jsonObject.getString("ownerId"));
        }
        if (!jsonObject.getString("videoName").isEmpty()){
            video.setVideoName(jsonObject.getString("videoName"));
        }
        if (!jsonObject.getString("videoDesc").isEmpty()){
            video.setVideoDesc(jsonObject.getString("videoDesc"));
        }
        if (!jsonObject.getString("sellType").isEmpty()){
            int sellType = Integer.parseInt(jsonObject.getString("sellType"));
            if (sellType==0){
                if (!jsonObject.getString("goodPrise").isEmpty()){
                    double goodPrise = Double.parseDouble(jsonObject.getString("goodPrise"));
                    video.setGoodPrise(goodPrise);
                }
                if (!jsonObject.getString("discountPrise").isEmpty()){
                    double discountPrise = Double.parseDouble(jsonObject.getString("discountPrise"));
                    video.setDiscountPrise(discountPrise);
                }
            }else if(sellType==1){
                video.setGoodPrise(0.00);
                video.setDiscountPrise(0.00);
            }
            video.setSellType(sellType);
        }
        video.setCreateTime(System.currentTimeMillis());
        return video;
    }
}
