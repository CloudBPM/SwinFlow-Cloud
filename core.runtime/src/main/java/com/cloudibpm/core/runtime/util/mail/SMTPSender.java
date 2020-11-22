/**
 * 
 */
package com.cloudibpm.core.runtime.util.mail;

import java.io.File;
import java.util.Date;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Address;
import javax.mail.Authenticator;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.MimeUtility;

import com.cloudibpm.core.util.*;

/**
 * 
 * For more information: https://www.cnblogs.com/ysocean/p/7666061.html
 * https://blog.csdn.net/xiamizy/article/details/2452857
 * http://computerdragon.blog.51cto.com/6235984/1197390
 * http://my.oschina.net/u/1172409/blog/150073
 * http://blog.51cto.com/computerdragon/1197390
 * http://www.codejava.net/java-ee/javamail/send-e-mail-with-attachment-in-java
 * 
 * @author Caodahai last updated at 2018-06-23 22:30, 2018-06-23 11:14
 *
 */
public class SMTPSender {
	static String server = SystemConfig.getProp("email.smtp"); // smtp服务器地址
	static String from = SystemConfig.getProp("email.from"); // 发送者
	static String fromName = PropertyUtil.getProperty("email.fromName"); // 发送者姓名
	static String user = SystemConfig.getProp("email.account"); // 发送者账号（邮件地址）
	static String password = SystemConfig.getProp("email.password"); // 密码
	static String port = SystemConfig.getProp("email.smtp.port"); // smtp端口

	// static String server = "smtp.xuanqiyun.com"; // smtp服务器地址
	// static String fromName = "轩琦科技"; // 发送者姓名
	// static String from = "webmaster@xuanqiyun.com"; // 发送者
	// static String user = "webmaster@xuanqiyun.com"; // 发送者账号（邮件地址）
	// static String password = "WebMaster2018"; // 密码
	// static String port = "25"; // smtp端口

	/**
	 * 
	 * @param recipients
	 * @param cc
	 * @param bcc
	 * @param subject
	 * @param content
	 * @param bgimages
	 * @param attachments
	 * @param exattachments
	 * @return
	 * @throws Exception
	 */
	public static boolean sendEmail(String[] recipients, String[] cc, String[] bcc, String subject, String content,
			String[] bgimages, String[] attachments, String[] exattachments) throws Exception {
		Properties props = new Properties();
		props.put("mail.smtp.host", server);
		props.put("mail.smtp.port", port);
		props.put("mail.smtp.auth", true);
		Session mailConnection = Session.getDefaultInstance(props, new MyAuthenricator(user, password));
		MimeMessage msg = new MimeMessage(mailConnection);

		// 群发邮件
		msg.setFrom(new InternetAddress(from, fromName));

		msg.setRecipients(Message.RecipientType.TO, parseAddress(recipients));
		Address[] cc1 = parseAddress(cc);
		if (cc1 != null) {
			msg.setRecipients(Message.RecipientType.CC, cc1);
		}
		msg.setRecipients(Message.RecipientType.BCC, parseAddress(bcc));

		// InternetAddress toAddress = new InternetAddress(recipients);
		// msg.setRecipient(Message.RecipientType.TO, toAddress);
		// InternetAddress ccAddress = new InternetAddress(cc);
		// msg.setRecipient(Message.RecipientType.TO, ccAddress);
		// InternetAddress bccAddress = new InternetAddress(bcc);
		// msg.setRecipient(Message.RecipientType.TO, bccAddress);

		msg.setSentDate(new Date());
		msg.setSubject(subject, "UTF-8");

		// 创建文本"节点"
		MimeBodyPart text = new MimeBodyPart();
		// 这里添加图片的方式是将整个图片包含到邮件内容中, 实际上也可以以 http 链接的形式添加网络图片
		text.setContent(content, "text/html;charset=UTF-8");

		// （文本+图片）设置 文本 和 图片"节点"的关系（将 文本 和 图片"节点"合成一个混合"节点"）
		MimeMultipart mm_text_image = new MimeMultipart("related");
		mm_text_image.addBodyPart(text);

		// 创建图片"节点"
		if (bgimages != null && bgimages.length > 0) {
			for (int i = 0; i < bgimages.length; i++) {
				MimeBodyPart image = new MimeBodyPart();
				// 读取本地文件
				DataHandler dh = new DataHandler(new FileDataSource(bgimages[i]));
				// 将图片数据添加到"节点"
				image.setDataHandler(dh);
				image.setHeader("Content-Type", "image/png");
				// 为"节点"设置一个唯一编号（在文本"节点"将引用该ID）
				image.setContentID(dh.getName());
				image.setDisposition(MimeBodyPart.INLINE);
				System.out.println(image.getContentID());
				mm_text_image.addBodyPart(image);
				mm_text_image.setSubType("related"); // 关联关系
			}
		}

		// 下面是模拟发送带附件的邮件
		// 新建一个MimeMultipart对象用来存放多个BodyPart对象
		Multipart mtp = new MimeMultipart();
		// ------设置信件文本内容------
		// 新建一个存放信件内容的BodyPart对象
		BodyPart mdp0 = new MimeBodyPart();
		// 给BodyPart对象设置内容和格式/编码方式
		mdp0.setContent(content, "text/html; charset=utf-8");
		// 将含有信件内容的BodyPart加入到MimeMultipart对象中
		mtp.addBodyPart(mdp0);

		// 设置信件的附件(用本地机上的文件作为附件)
		if (attachments != null && attachments.length > 0) {
			for (int i = 0; i < attachments.length; i++) {
				BodyPart mdp = new MimeBodyPart();
				// attachments[i] is file path + / + file name
				DataHandler dh = new DataHandler(new FileDataSource(attachments[i]));
				mdp.setFileName(MimeUtility.encodeWord(dh.getName())); // 可以和原文件名不一致
				mdp.setDataHandler(dh);
				mtp.addBodyPart(mdp);
			}
		}

		// 设置信件的附件(用本地机上的文件作为附件)
		if (exattachments != null && exattachments.length > 0) {
			for (int i = 0; i < exattachments.length; i++) {
				BodyPart mdp = new MimeBodyPart();
				// attachments[i] is file path + / + file name
				DataHandler dh = new DataHandler(new FileDataSource(exattachments[i]));
				mdp.setFileName(MimeUtility.encodeWord(dh.getName())); // 可以和原文件名不一致
				mdp.setDataHandler(dh);
				mtp.addBodyPart(mdp);
			}
		}

		// 把mtp作为消息对象的内容
		msg.setContent(mtp);

		// 以上为发送带附件的方式
		// 先进行存储邮件
		msg.saveChanges();

		Transport trans = mailConnection.getTransport("smtp");
		// 邮件服务器名,用户名，密码
		trans.connect(server, user, password);
		trans.sendMessage(msg, msg.getAllRecipients());
		trans.close();
		return true;
	}

	/**
	 * 该方法是不包含内联图片的发邮件方法。注：互联网上得出的结论，我验证也是这样的，每款邮箱对邮件内容中待的html支持是不一样的
	 * 网易，搜狐不直接支持网易搜狐不写成标准的html格式，基本都是按文本显示的。但是qq是直接支持的。
	 * 发这种邮件，我一般都不把图片放到邮件里面，而是把图片先上传到互联网上，在邮件里面加入外部图片链接。
	 * <br>
	 * 注：这个方法目前只在微服务子系统中的测试邮件模板的功能中使用。
	 * <br>
	 * @param recipients
	 * @param cc
	 * @param bcc
	 * @param subject
	 * @param content
	 * @param bgimages
	 * @param attachments
	 * @param exattachments
	 * @return
	 * @throws Exception
	 */
	public static boolean sendEmail(String[] recipients, String[] cc, String[] bcc, String subject, String content,
			String[] attachments, String[] exattachments) throws Exception {
		Properties props = new Properties();
		props.put("mail.smtp.host", server);
		props.put("mail.smtp.port", port);
		props.put("mail.smtp.auth", true);
		Session mailConnection = Session.getDefaultInstance(props, new MyAuthenricator(user, password));
		MimeMessage msg = new MimeMessage(mailConnection);

		// 群发邮件
		msg.setFrom(new InternetAddress(from, fromName));

		msg.setRecipients(Message.RecipientType.TO, parseAddress(recipients));
		Address[] cc1 = parseAddress(cc);
		if (cc1 != null) {
			msg.setRecipients(Message.RecipientType.CC, cc1);
		}
		msg.setRecipients(Message.RecipientType.BCC, parseAddress(bcc));

		msg.setSentDate(new Date());
		msg.setSubject(subject, "UTF-8");

		// 创建文本"节点"
		MimeBodyPart text = new MimeBodyPart();
		// 这里添加图片的方式是将整个图片包含到邮件内容中, 实际上也可以以 http 链接的形式添加网络图片
		text.setContent(content, "text/html;charset=UTF-8");

		// 下面是模拟发送带附件的邮件
		// 新建一个MimeMultipart对象用来存放多个BodyPart对象
		Multipart mtp = new MimeMultipart();
		// ------设置信件文本内容------
		// 新建一个存放信件内容的BodyPart对象
		BodyPart mdp0 = new MimeBodyPart();
		// 给BodyPart对象设置内容和格式/编码方式
		mdp0.setContent(content, "text/html; charset=utf-8");
		// 将含有信件内容的BodyPart加入到MimeMultipart对象中
		mtp.addBodyPart(mdp0);

		// 设置信件的附件(用本地机上的文件作为附件)
		if (attachments != null && attachments.length > 0) {
			for (int i = 0; i < attachments.length; i++) {
				BodyPart mdp = new MimeBodyPart();
				// attachments[i] is file path + / + file name
				DataHandler dh = new DataHandler(new FileDataSource(attachments[i]));
				String fileName = dh.getName();
//				if ((fileName != null) && ( (fileName.toLowerCase().indexOf("gb2312") != -1) ||  (fileName.toLowerCase().indexOf("gbk") != -1) )){
//					fileName  = MimeUtility.decodeText(fileName);
//				}
//				fileName = MimeUtility.encodeText(fileName,"UTF-8","B");
				
				mdp.setFileName(fileName); // 可以和原文件名不一致

				mdp.setDataHandler(dh);
				mtp.addBodyPart(mdp);
			}
		}

		// 设置信件的附件(用本地机上的文件作为附件)
		if (exattachments != null && exattachments.length > 0) {
			for (int i = 0; i < exattachments.length; i++) {
				BodyPart mdp = new MimeBodyPart();
				// attachments[i] is file path + / + file name
				DataHandler dh = new DataHandler(new FileDataSource(exattachments[i]));
				mdp.setFileName(MimeUtility.encodeWord(dh.getName())); // 可以和原文件名不一致
				mdp.setDataHandler(dh);
				mtp.addBodyPart(mdp);
			}
		}

		// 把mtp作为消息对象的内容
		msg.setContent(mtp);

		// 以上为发送带附件的方式
		// 先进行存储邮件
		msg.saveChanges();

		Transport trans = mailConnection.getTransport("smtp");
		// 邮件服务器名,用户名，密码
		trans.connect(server, user, password);
		trans.sendMessage(msg, msg.getAllRecipients());
		trans.close();
		return true;
	}
	
	/**
	 * 该方法是不包含内联图片的发邮件方法。注：互联网上得出的结论，我验证也是这样的，每款邮箱对邮件内容中待的html支持是不一样的
	 * 网易，搜狐不直接支持网易搜狐不写成标准的html格式，基本都是按文本显示的。但是qq是直接支持的。
	 * 发这种邮件，我一般都不把图片放到邮件里面，而是把图片先上传到互联网上，在邮件里面加入外部图片链接。
	 * <br>
	 * 注：这个方法目前只在BPM服务器的邮件发送功能中使用。
	 * <br>
	 * @param recipients
	 * @param cc
	 * @param bcc
	 * @param subject
	 * @param content
	 * @param bgimages
	 * @param attachments
	 * @return
	 * @throws Exception
	 */
	public static boolean sendEmail(String[] recipients, String[] cc, String[] bcc, String subject, String content,
			MimeBodyPart[] attachments) throws Exception {
		Properties props = new Properties();
		props.put("mail.smtp.host", server);
		props.put("mail.smtp.port", port);
		props.put("mail.smtp.auth", true);
		Session mailConnection = Session.getDefaultInstance(props, new MyAuthenricator(user, password));
		MimeMessage msg = new MimeMessage(mailConnection);

		// 群发邮件
		// msg.setFrom(new InternetAddress(from,
		// MimeUtility.encodeText(fromName,"gb2312","utf-8")));
		msg.setFrom(new InternetAddress(from, fromName));

		msg.setRecipients(Message.RecipientType.TO, parseAddress(recipients));
		Address[] cc1 = parseAddress(cc);
		if (cc1 != null) {
			msg.setRecipients(Message.RecipientType.CC, cc1);
		}
		msg.setRecipients(Message.RecipientType.BCC, parseAddress(bcc));

		msg.setSentDate(new Date());
		msg.setSubject(subject, "UTF-8");

		// 创建文本"节点"
		MimeBodyPart text = new MimeBodyPart();
		// 这里添加图片的方式是将整个图片包含到邮件内容中, 实际上也可以以 http 链接的形式添加网络图片
		text.setContent(content, "text/html;charset=UTF-8");

		// 下面是模拟发送带附件的邮件
		// 新建一个MimeMultipart对象用来存放多个BodyPart对象
		Multipart mtp = new MimeMultipart();
		// ------设置信件文本内容------
		// 新建一个存放信件内容的BodyPart对象
		BodyPart mdp0 = new MimeBodyPart();
		// 给BodyPart对象设置内容和格式/编码方式
		mdp0.setContent(content, "text/html; charset=utf-8");
		// 将含有信件内容的BodyPart加入到MimeMultipart对象中
		mtp.addBodyPart(mdp0);

		// 设置信件的附件(用本地机上的文件作为附件)
		if (attachments != null && attachments.length > 0) {
			for (int i = 0; i < attachments.length; i++) {
				mtp.addBodyPart(attachments[i]);
			}
		}

		// 把mtp作为消息对象的内容
		msg.setContent(mtp);

		// 以上为发送带附件的方式
		// 先进行存储邮件
		msg.saveChanges();

		Transport trans = mailConnection.getTransport("smtp");
		// 邮件服务器名,用户名，密码
		trans.connect(server, user, password);
		trans.sendMessage(msg, msg.getAllRecipients());
		trans.close();
		return true;
	}

	/**
	 * 发送一个简单的文本邮件，比如通知等。
	 * 
	 * @param recipients
	 * @param subject
	 * @param content
	 * @return
	 * @throws Exception
	 */
	public static boolean sendEmail(String recipients, String subject, String content) throws Exception {
		Properties props = new Properties();
		props.put("mail.smtp.host", server);
		props.put("mail.smtp.port", port);
		props.put("mail.smtp.auth", true);
		Session mailConnection = Session.getDefaultInstance(props, new MyAuthenricator(user, password));
		MimeMessage msg = new MimeMessage(mailConnection);
		msg.setFrom(new InternetAddress(from, fromName));
		InternetAddress toAddress = new InternetAddress(recipients);
		msg.setRecipient(Message.RecipientType.TO, toAddress);
		msg.setSentDate(new Date());
		msg.setSubject(subject, "UTF-8");
		MimeBodyPart text = new MimeBodyPart();
		text.setContent(content, "text/html;charset=UTF-8");
		Multipart mtp = new MimeMultipart();
		BodyPart mdp0 = new MimeBodyPart();
		mdp0.setContent(content, "text/html; charset=utf-8");
		mtp.addBodyPart(mdp0);
		msg.setContent(mtp);
		msg.saveChanges();
		Transport trans = mailConnection.getTransport("smtp");
		trans.connect(server, user, password);
		trans.sendMessage(msg, msg.getAllRecipients());
		trans.close();
		return true;
	}

	private static Address[] parseAddress(String[] emails) throws AddressException {
		if (emails != null && emails.length > 0) {
			StringBuffer rBuffer = new StringBuffer();
			if (emails != null && emails.length > 0) {
				for (String s : emails) {
					if (s != null && s.trim() != "" && s.indexOf("@") > 0)
						rBuffer.append(s);
				}
				if (rBuffer.length() > 0) {
					return InternetAddress.parse(rBuffer.toString());
				}
			}
		}
		return null;
	}

	static class MyAuthenricator extends Authenticator {
		String user = null;
		String pass = "";

		public MyAuthenricator(String user, String pass) {
			this.user = user;
			this.pass = pass;
		}

		@Override
		protected PasswordAuthentication getPasswordAuthentication() {
			return new PasswordAuthentication(user, pass);
		}
	}

	public static void main(String[] args) {
		try {
			SMTPSender.sendEmail(new String[] { "892440941@qq.com" }, null, null, "主界面",
					"<html><head><title>测试邮件</title></head><body>这是我的第一个测试邮件。this is my first testing email."
							+ "<a href=\"http://www.sina.com.cn\"><img src=\"cid:主界面.png\"><br>主界面样式</a>"
							+ "<p><a href=\"http://www.sohu.com\"><img src=\"cid:无标题4.png\"><br>背景图</a></body></html>",
					new String[] { "D:/Data/发邮件测试/images/无标题4.png", "D:/Data/发邮件测试/images/主界面.png" },
					new String[] { "D:/Data/发邮件测试/项目申请的清单（1）.doc", "D:/Data/发邮件测试/项目计划书模版22.ppt" },
					new String[] { "D:/Data/发邮件测试/软件服务合作意向书.docx","D:/Data/发邮件测试/RECEIPT-20180607-20180607-494996210001.pdf" });

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}