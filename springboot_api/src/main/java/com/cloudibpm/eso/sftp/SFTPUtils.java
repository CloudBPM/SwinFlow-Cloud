package com.cloudibpm.eso.sftp;

import com.cloudibpm.core.util.SystemConfig;
import com.jcraft.jsch.*;

import java.io.FileNotFoundException;
import java.util.Properties;

public class SFTPUtils {

	protected static String host = SystemConfig.getProp("hostIp");//sftp服务器IF
	protected static String username = SystemConfig.getProp("username");//用户名
	protected static String password = SystemConfig.getProp("password");//密码
	protected static String str = SystemConfig.getProp("port");//默认的sftp端口号  22
	protected static String privateKey = SystemConfig.getProp("privateKey");//密钥文件路径
	protected static String passphrase = SystemConfig.getProp("passphrase");//密钥口令

	
	static Session session = null;
    static Channel channel = null;
    
	 public static ChannelSftp connectSFTP() throws JSchException ,FileNotFoundException{
		 int port = Integer.parseInt(str);
		 JSch jsch = new JSch();
//		 String certs = ResourceUtils.getURL("classpath:").getPath()+"certs";
//		 if (certs != null && !"".equals(certs)) {
//              //使用密钥验证方式，密钥可以使有口令的密钥，也可以是没有口令的密钥
//              if (certs != null && "".equals(certs)) {
//                  jsch.addIdentity(certs, certs);
//              } else {
//                  jsch.addIdentity(certs);
//              }
//          }


		  if (privateKey != null && !"".equals(privateKey)) {
              //使用密钥验证方式，密钥可以使有口令的密钥，也可以是没有口令的密钥
              if (passphrase != null && "".equals(passphrase)) {
                  jsch.addIdentity(privateKey, passphrase);
              } else {
                  jsch.addIdentity(privateKey);
              }
          }
		 Session session = jsch.getSession(username, host, port);
		 if(password!=null){
			 session.setPassword(password);//设置密码
		 }
		 Properties conf = new Properties();
		 conf.put("StrictHostKeyChecking","no");
		 session.setConfig(conf);//为session对象设置properties
		 session.setTimeout(1000);
		 session.connect();
		 
		 channel = session.openChannel("sftp");
		 channel.connect();
		 return (ChannelSftp) channel;
	 }

}
