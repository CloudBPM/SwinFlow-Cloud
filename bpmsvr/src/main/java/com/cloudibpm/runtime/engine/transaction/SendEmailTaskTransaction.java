/**
 * 
 */
package com.cloudibpm.runtime.engine.transaction;

import com.cloudibpm.blo.user.UserProfileBlo;
import com.cloudibpm.core.buildtime.wfprocess.task.MessageReceiver;
import com.cloudibpm.core.data.FileConstant;
import com.cloudibpm.core.data.variable.ArrayDataVariable;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.runtime.user.Contact;
import com.cloudibpm.core.runtime.util.mail.SMTPSender;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.core.runtime.wfprocess.task.EmailSendingTaskInstance;
import com.cloudibpm.core.user.User;
import com.cloudibpm.core.util.SystemConfig;
import com.cloudibpm.eso.runtime.organization.PositionEso;
import com.cloudibpm.runtime.util.microservice.RTFileObjectAccessor;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.BodyPart;
import javax.mail.internet.MimeBodyPart;
import javax.mail.util.ByteArrayDataSource;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

/**
 * 这个类是发送邮件事务，发送邮件是根据任务的设置，获取邮件收件人信息以及邮件内容和附件信息，连接远程邮件服务器，发送邮件出去。
 * 
 * @author Dahai Cao created at 19:02 on 2018-08-13
 */
public class SendEmailTaskTransaction extends AbstractTaskTransaction<EmailSendingTaskInstance> {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -2997592497429187374L;
	// private Object originalValue = null;

	public SendEmailTaskTransaction(EmailSendingTaskInstance task, WfProcessInstance process) {
		super(task, process);
	}

	@Override
	public void begin() throws Exception {
		taskInstance.setStartTime(System.currentTimeMillis());
		// EmailSendingTaskInstance t = (EmailSendingTaskInstance)
		// taskInstance;
	}

	/**
	 * 系统自动任务
	 */
	@Override
	public void commit() throws Exception {
		System.out.println(taskInstance.getName() + " is running.....");
		EmailSendingTaskInstance t = (EmailSendingTaskInstance) taskInstance;
		MessageReceiver[] receipts = t.getReceivers();
		for (MessageReceiver receiver : receipts) {
			// Receiver type: 0: workflow launcher;
			// 1: all staffs in current organization;
			// 2: all staffs in all associated organizations;
			// 3: specific position(s) or project roles;
			if (receiver.getReceiverType() == 0) {
				String id = this.getWfProcessInstance().getLaunchUserId();
				User user = UserProfileBlo.getInstance().getUserById(id);
				sendEmail(user.getEmail(), t);
				break;
			} else if (receiver.getReceiverType() == 1) {
				List<Contact> contacts = UserProfileBlo.getInstance()
						.getAllStaff(this.getWfProcessInstance().getOwner());
				for (Contact c : contacts) {
					String email = null;
					if (c.getWorkEmail() == null) {
						email = c.getPrivateEmail();
					} else {
						email = c.getWorkEmail();
					}
					sendEmail(email, t);
				}
				break;
			} else if (receiver.getReceiverType() == 2) {
				List<Contact> contacts = UserProfileBlo.getInstance()
						.getAllStaff(this.getWfProcessInstance().getOwner());
				for (Contact c : contacts) {
					String email = null;
					if (c.getWorkEmail() == null) {
						email = c.getPrivateEmail();
					} else {
						email = c.getWorkEmail();
					}
					sendEmail(email, t);
				}
				break;
			} else if (receiver.getReceiverType() == 3) {
				PositionEso pEso = new PositionEso();
				Contact c = pEso.getStaff(receiver.getPositionId());
				String email = null;
				if (c.getWorkEmail() == null) {
					email = c.getPrivateEmail();
				} else {
					email = c.getWorkEmail();
				}
				sendEmail(email, t);
			}
		}
		taskInstance.setEndTime(System.currentTimeMillis());
	}

	private void sendEmail(String to, EmailSendingTaskInstance invokeTask) throws Exception {
		HttpClientBuilder builder = HttpClientBuilder.create();
		CloseableHttpClient httpClient = builder.build();
		String subject = invokeTask.getSubject();
		String templ = invokeTask.getTemplate();
		FileConstant[] fcs = (FileConstant[]) invokeTask.getAttachments();
		List<BodyPart> attachments = new ArrayList<>();
		if (fcs != null && fcs.length > 0) {
			for (int i = 0; i < fcs.length; i++) {
				if (fcs[i] != null && fcs[i].getId() != null && !fcs[i].getId().trim().equals("")
						&& !fcs[i].getId().trim().toLowerCase().equals("null")) {
					String ver = SystemConfig.getProp("xq.product.pversion");
					InputStream in = null;
					if (ver.equals("1")) { // 单机版
						in = RTFileObjectAccessor.fetchLocalEmaillAttachmentFileObject(fcs[i],
								invokeTask.getTemplateId());
					} else if (ver.equals("2") || ver.equals("3")) { // 私有云版/公有云版
						in = RTFileObjectAccessor.fetchEmaillAttachmentFileObject(httpClient, fcs[i],
								invokeTask.getTemplateId());
					}
					if (in != null) {
						String f = fcs[i].getFiletype() == null ? "application/octet-stream" : fcs[i].getFiletype();
						DataSource aAttachment = new ByteArrayDataSource(in, f);
						MimeBodyPart attachmentPart = new MimeBodyPart();
						attachmentPart.setFileName(getFileName(fcs[i].getName()));
						attachmentPart.setDataHandler(new DataHandler(aAttachment));
						attachments.add(attachmentPart);
					}
				}
			}
		}
		DataVariable[] dvs = (DataVariable[]) invokeTask.getVariables();
		if (dvs != null && dvs.length > 0) {
			for (int i = 0; i < dvs.length; i++) {
				if (dvs[i] instanceof ArrayDataVariable) {
					ArrayDataVariable a = (ArrayDataVariable) dvs[i];
					if (a.getValues() != null && ((FileConstant[]) a.getValues()).length > 0) {
						for (int j = 0; j < ((FileConstant[]) a.getValues()).length; j++) {
							FileConstant fc = ((FileConstant[]) a.getValues())[i];
							if (fc != null && fc.getId() != null && !fc.getId().trim().equals("")
									&& !fc.getId().trim().toLowerCase().equals("null")) {
								String ver = SystemConfig.getProp("xq.product.pversion");
								InputStream in = null;
								if (ver.equals("1")) { // 单机版
									in = RTFileObjectAccessor.fetchLocalFileObject(fc);
								} else if (ver.equals("2") || ver.equals("3")) { // 私有云版/公有云版
									in = RTFileObjectAccessor.fetchFileObject(httpClient, fc);
								}
								if (in != null) {
									String f = fc.getFiletype() == null ? "application/octet-stream" : fc.getFiletype();
									DataSource aAttachment = new ByteArrayDataSource(in, f);
									MimeBodyPart attachmentPart = new MimeBodyPart();
									attachmentPart.setFileName(getFileName(fc.getName()));
									attachmentPart.setDataHandler(new DataHandler(aAttachment));
									attachments.add(attachmentPart);
								}
							}
						}
					}
				} else if (dvs[i] instanceof DataVariable) {
					DataVariable a = (DataVariable) dvs[i];
					if (a.getValue() != null && a.getValue() instanceof FileConstant) {
						FileConstant fc = (FileConstant) a.getValue();
						if (fc != null && fc.getId() != null && !fc.getId().trim().equals("")
								&& !fc.getId().trim().toLowerCase().equals("null")) {
							String ver = SystemConfig.getProp("xq.product.pversion");
							InputStream in = null;
							if (ver.equals("1")) { // 单机版
								in = RTFileObjectAccessor.fetchLocalFileObject(fc);
							} else if (ver.equals("2") || ver.equals("3")) { // 私有云版/公有云版
								in = RTFileObjectAccessor.fetchFileObject(httpClient, fc);
							}
							if (in != null) {
								String f = fc.getFiletype() == null ? "application/octet-stream" : fc.getFiletype();
								DataSource aAttachment = new ByteArrayDataSource(in, f);
								MimeBodyPart attachmentPart = new MimeBodyPart();
								attachmentPart.setFileName(getFileName(fc.getName()));
								attachmentPart.setDataHandler(new DataHandler(aAttachment));
								attachments.add(attachmentPart);
							}
						}
					}
				}
			}
		}
		SMTPSender.sendEmail(new String[] { to }, null, null, subject, templ,
				attachments.toArray(new MimeBodyPart[attachments.size()]));
	}

	/**
	 * 这段程序的实际作用是让任何邮件服务器都能够正确地显示附件文件名。 但是现在还需要完善，我们只做了163的测试。
	 * 
	 * @param fname
	 *            String
	 * @return String
	 * @throws UnsupportedEncodingException
	 */
	private String getFileName(String fname) throws UnsupportedEncodingException {
		String fileName = fname;
		//if ((fileName != null) && ((fileName.toLowerCase().indexOf("gb2312") != -1)
		//		|| (fileName.toLowerCase().indexOf("gbk") != -1))) {
		//	fileName = MimeUtility.decodeText(fileName);
		//}
		//fileName = MimeUtility.encodeText(fileName, "UTF-8", "B");
		return fileName;
	}

	@Override
	public void rollback() throws Exception {
		// EmailSendingTaskInstance t = (EmailSendingTaskInstance)
		// taskInstance;

	}
}