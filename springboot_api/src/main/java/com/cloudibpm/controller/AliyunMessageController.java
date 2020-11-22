package com.cloudibpm.controller;

import com.aliyuncs.exceptions.ClientException;
import com.cloudibpm.blo.message.AliyunMessageBlo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/service17")
public class AliyunMessageController {
	private final AliyunMessageBlo aliyunMessageBlo;

	@Autowired
	public AliyunMessageController(AliyunMessageBlo aliyunMessageBlo) {
		this.aliyunMessageBlo = aliyunMessageBlo;
	}

	/**
     * 短信发送
     * @return
     * @throws ClientException
     */
	@RequestMapping(value = "/api0", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
    public String sendSms(String mobile,String code) throws ClientException{
		try {
			aliyunMessageBlo.sendSms(mobile,code);
			return "{\"status\": \"1\"}"; // success
		} catch (Exception e) {
			e.printStackTrace();
			return "{\"status\": \"0\"}"; // failed
		}
	}
}
