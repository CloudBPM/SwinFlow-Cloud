package com.cloudibpm.controller;

import com.cloudibpm.blo.update.AppUpdateBlo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;



@Controller
@RequestMapping("/appUpload")
public class AppUploadController {
    private final AppUpdateBlo appUpdateBlo;

    @Autowired
    public AppUploadController(AppUpdateBlo appUpdateBlo) {
        this.appUpdateBlo = appUpdateBlo;
    }


    @GetMapping("/index")
    public String index(){
        return "upload";
    }

    @PostMapping("/upload")
    public String upload(String versionName, String updateContent, MultipartFile file, String passWord,String appName, Model model){
        String message=appUpdateBlo.uploadApp(versionName, updateContent, file, passWord, appName);
        model.addAttribute("message",message);
        return "alert";
    }


}

