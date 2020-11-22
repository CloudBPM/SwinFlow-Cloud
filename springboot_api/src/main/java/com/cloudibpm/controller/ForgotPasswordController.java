/**
 *
 */
package com.cloudibpm.controller;

import com.cloudibpm.blo.message.AliyunMessageBlo;
import com.cloudibpm.blo.om.user.WfUserBlo;
import com.cloudibpm.core.runtime.util.mail.SMTPSender;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.core.util.PassGenerator;
import com.cloudibpm.core.util.encode.MD5Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * @author Dahai Cao
 */
@RestController
@RequestMapping("/service4")
public class ForgotPasswordController {

    private final WfUserBlo wfUserBlo;
    private final AliyunMessageBlo aliyunMessageBlo;

    @Autowired
    public ForgotPasswordController(WfUserBlo wfUserBlo, AliyunMessageBlo aliyunMessageBlo) {
        this.wfUserBlo = wfUserBlo;
        this.aliyunMessageBlo = aliyunMessageBlo;
    }

    @RequestMapping(value = "/api0", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String forgorPassword(String username, String mobile, String sessiondata, String email, String token) {
        try {
            if (check(username, mobile, sessiondata, email, token)) {
                int result = 0;
                //int result = WfUserBlo.getInstance().checkUserNameandEmail(username.trim(), email.trim());
                //if (result == 1) {
                String newpass = PassGenerator.getInstance().getPassword(8);
                String newpass1 = MD5Util.getMD5(newpass);
                wfUserBlo.updatePasswordUserName(username, newpass1);
                //发送包含密码的手机短信
                aliyunMessageBlo.sendSmsForPassword(mobile, newpass);
                // send email to notify...
                if (SMTPSender.sendEmail(email, "来自云BPM的邮件", "您的新密码已经生成：" + newpass + "(它将在30天以后过期，需要在主登录页上重新设置)")) {
                    result = 2;
                } else {
                    result = -7;
                }
                //}
                return "{\"status\": \"" + result + "\"}"; // successful
            } else {
                return "{\"status\": \"-8\"}"; // security checking failed
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{\"status\": \"-5\"}"; // failed
    }

    private boolean check(String username, String mobile, String sessiondata, String email, String token) {
        String sessiondata1 = MD5Util.getMD5(username + token + mobile + "cloudbpm" + email + DateUtility.getCurrentDate());
        if (sessiondata1.equals(sessiondata)) {
            return true;
        }
        return false;

    }

}
