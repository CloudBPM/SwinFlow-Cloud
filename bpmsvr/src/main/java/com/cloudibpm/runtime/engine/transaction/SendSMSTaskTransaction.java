/**
 * 
 */
package com.cloudibpm.runtime.engine.transaction;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsRequest;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsResponse;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.profile.IClientProfile;
import com.cloudibpm.blo.user.UserProfileBlo;
import com.cloudibpm.core.buildtime.wfprocess.task.MessageReceiver;
import com.cloudibpm.core.runtime.user.Contact;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.core.runtime.wfprocess.task.SMSSendingTaskInstance;
import com.cloudibpm.core.user.User;
import com.cloudibpm.core.util.PropertyUtil;
import com.cloudibpm.eso.runtime.organization.PositionEso;

import java.util.List;

/**
 * 这个类是发送短信事务，发送短信是根据任务的设置，获取短信收件人信息以及短信内容，连接远程短信服务器，发送短信出去。
 * 
 * @author Dahai Cao created at 14:54 on 2018-08-31
 */
public class SendSMSTaskTransaction extends AbstractTaskTransaction<SMSSendingTaskInstance> {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -2997592497429187374L;
	// 产品名称:云通信短信API产品,开发者无需替换
	static final String product = "Dysmsapi";
	// 产品域名,开发者无需替换
	static final String domain = "dysmsapi.aliyuncs.com";
	// TODO 此处需要替换成开发者自己的AK
	private String myAccessKeyId = PropertyUtil.getProperty("AccessKeyId");
	private String myAccessKeySecret = PropertyUtil.getProperty("AccessKeySecret");
	private String signName = PropertyUtil.getProperty("SignName");
	// private String templateCode = PropertyUtil.getProperty("TemplateCodeVerify");
	private String templateCode2 = PropertyUtil.getProperty("TemplateCodeServer");

	// private Object originalValue = null;

	public SendSMSTaskTransaction(SMSSendingTaskInstance task, WfProcessInstance process) {
		super(task, process);
	}

	@Override
	public void begin() throws Exception {
		taskInstance.setStartTime(System.currentTimeMillis());
	}

	/**
	 * 系统自动任务
	 */
	@Override
	public void commit() throws Exception {
		System.out.println(taskInstance.getName() + " is running.....");
		SMSSendingTaskInstance t = (SMSSendingTaskInstance) taskInstance;
		MessageReceiver[] receipts = t.getReceivers();
		// Receiver type: 0: workflow launcher;
		// 1: all staffs in current organization;
		// 2: all staffs in all associated organizations;
		// 3: specific position(s) or project roles;
		for (MessageReceiver receiver : receipts) {
			if (receiver.getReceiverType() == 0) {
				String id = this.getWfProcessInstance().getLaunchUserId();
				User user = UserProfileBlo.getInstance().getUserById(id);
				sendSMS(user.getGivenname(), user.getMobile(), t);
				break;
			} else if (receiver.getReceiverType() == 1) {
				List<Contact> contacts = UserProfileBlo.getInstance()
						.getAllStaff(this.getWfProcessInstance().getOwner());
				for (Contact c : contacts) {
					String mobile = null;
					if (c.getWorkMobile() == null) {
						mobile = c.getPrivateMobile();
					} else {
						mobile = c.getWorkMobile();
					}
					sendSMS(c.getGivenName(), mobile, t);
				}
				break;
			} else if (receiver.getReceiverType() == 2) {
				List<Contact> contacts = UserProfileBlo.getInstance()
						.getAllStaff(this.getWfProcessInstance().getOwner());
				for (Contact c : contacts) {
					String mobile = null;
					if (c.getWorkMobile() == null) {
						mobile = c.getPrivateMobile();
					} else {
						mobile = c.getWorkMobile();
					}
					sendSMS(c.getGivenName(), mobile, t);
				}
				break;
			} else if (receiver.getReceiverType() == 3) {
				PositionEso pEso = new PositionEso();
				Contact c = pEso.getStaff(receiver.getPositionId());
				String mobile = null;
				if (c.getWorkMobile() == null) {
					mobile = c.getPrivateMobile();
				} else {
					mobile = c.getWorkMobile();
				}
				sendSMS(c.getGivenName(), mobile, t);
			}
		}
		taskInstance.setEndTime(System.currentTimeMillis());
	}

	/**
	 * 发送短信验证码
	 * 
	 * @param mobile
	 * @return
	 * @throws ClientException
	 */
	private SendSmsResponse sendSMS(String name, String mobile, SMSSendingTaskInstance smsTask) throws Exception {
		// 可自助调整超时时间
		System.setProperty("sun.net.client.defaultConnectTimeout", "10000");
		System.setProperty("sun.net.client.defaultReadTimeout", "10000");
		// 初始化acsClient,暂不支持region化
		IClientProfile profile = DefaultProfile.getProfile("cn-hangzhou", myAccessKeyId, myAccessKeySecret);
		DefaultProfile.addEndpoint("cn-hangzhou", "cn-hangzhou", product, domain);
		IAcsClient acsClient = new DefaultAcsClient(profile);
		// 组装请求对象-具体描述见控制台-文档部分内容
		SendSmsRequest request = new SendSmsRequest();
		// 必填:待发送手机号
		request.setPhoneNumbers(mobile);
		// 必填:短信签名-可在短信控制台中找到
		request.setSignName(signName);
		// 必填:短信模板-可在短信控制台中找到
		request.setTemplateCode(templateCode2);
		request.setEncoding("UTF-8");
		// 可选:模板中的变量替换JSON串,如模板内容为"亲爱的${name},您的验证码为${code}"时,此处的值为
		request.setTemplateParam("{\"name\":\"" + name + "\", \"remark\":\"" + smsTask.getTemplate() + "\"}");
		// 选填-上行短信扩展码(无特殊需求用户请忽略此字段)
		// request.setSmsUpExtendCode("90997");
		// 可选:outId为提供给业务方扩展字段,最终在短信回执消息中将此值带回给调用者
		// request.setOutId("yourOutId");
		// hint 此处可能会抛出异常，注意catch
		SendSmsResponse sendSmsResponse = null;
		// 使用短信发送可解开以下注释
		sendSmsResponse = acsClient.getAcsResponse(request);
		if (sendSmsResponse.getCode() == null || !sendSmsResponse.getCode().equals("OK")) {
			// 请求成功
		}
		return sendSmsResponse;
	}

	@Override
	public void rollback() throws Exception {
		// SMSSendingTaskInstance t = (SMSSendingTaskInstance) taskInstance;

	}
}