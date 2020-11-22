package com.cloudibpm.eso.am.docker;

import com.cloudibpm.eso.sftp.SFTPUtils;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.ChannelSftp.LsEntry;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.SftpException;

import java.io.IOException;
import java.text.ParseException;
import java.util.Vector;

public class Test {

	public static void main(String[] args) throws JSchException, IOException, SftpException, ParseException {
		ChannelSftp connectSFTP = SFTPUtils.connectSFTP();
		String path = "/home/user/tomcat";
//		System.out.println(ls.size());
		boolean flag = true;
		while(flag){
			Vector<LsEntry> ls = connectSFTP.ls(path);
			if(ls.size()!=2){
				rmDir(connectSFTP, path);
				flag = true;
			}else if(ls.size()==2){
				flag = false;
			}
		}
		// Vector<LsEntry> ls = connectSFTP.ls(path);
		// for (LsEntry lsf : ls) {
		// boolean blk = lsf.getAttrs().isBlk();
		// System.out.println(blk+lsf.getFilename());
		// boolean chr = lsf.getAttrs().isChr();
		// System.out.println(chr+lsf.getFilename());
		// boolean dir = lsf.getAttrs().isDir();
		// System.out.println(dir+lsf.getFilename());
		// boolean fifo = lsf.getAttrs().isFifo();
		// System.out.println(fifo+lsf.getFilename());
		// boolean link = lsf.getAttrs().isLink();
		// System.out.println(link+lsf.getFilename());
		// boolean reg = lsf.getAttrs().isReg();
		// System.out.println(reg+lsf.getFilename());
		// boolean sock = lsf.getAttrs().isSock();
		// System.out.println(sock+lsf.getFilename());
		// long size = lsf.getAttrs().getSize();
		// System.out.println(size+lsf.getFilename());
		// }

		// String dst = "D:\\xq-paas-bpmsvr-0.0.1-SNAPSHOT.war";
		// FileOutputStream out = new FileOutputStream(dst);
		//
		// InputStream in= connectSFTP.get(path);
		// BufferedInputStream bis = new BufferedInputStream(in);
		// BufferedOutputStream bos = new BufferedOutputStream(out);
		//
		// byte[] buff = new byte [1024*2];
		// int b;
		// while ((b = bis.read(buff,0,buff.length)) != -1) {
		// if(b>0){
		// bos.write(buff,0,b);
		// }
		// }

		// Vector<LsEntry> file = connectSFTP.ls(path);
		// for (LsEntry lsEntry : file) {
		// String filename = lsEntry.getFilename();
		// String mtimeString = lsEntry.getAttrs().getMtimeString();
		// System.out.println(filename+"==="+mtimeString);
		// }
		// System.out.println("ls "+ls);
		// int aTime = ls.getAttrs().getATime();
		// Date date = new Date(aTime);
		// SimpleDateFormat fm = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		// String format = fm.format(date);
		// System.out.println("format "+format);
		// System.out.println("data "+date);
		// String mtimeString = ls.getAttrs().getMtimeString();
		// System.out.println("mtimeString "+mtimeString);
		// SimpleDateFormat sdf1= new SimpleDateFormat("EEE MMM dd HH:mm:ss z
		// yyyy", Locale.ENGLISH);
		// String format2 = fm.format(sdf1.parse(mtimeString));
		// System.out.println("format2 "+format2);
		// Date parse = fm.parse(format2);
		// System.out.println(parse);

	}

	public static void rmDir(ChannelSftp connectSFTP, String path) throws SftpException {
		Vector<LsEntry> ls = connectSFTP.ls(path);
		for (int i = 0; i < ls.size(); i++) {
			if (ls.get(i).getAttrs().isDir() && !(ls.get(i).getFilename().equals("..") || ls.get(i).getFilename().equals("."))) {
				String dirName = ls.get(i).getFilename();
				String newPath = path+"/"+dirName;
				Vector<LsEntry> ls2 = connectSFTP.ls(newPath);
				if(ls2.size()==2){
					connectSFTP.rmdir(newPath);
				}else{
					 rmDir(connectSFTP,newPath);
				}
			} else if (!(ls.get(i).getFilename().equals("..") || ls.get(i).getFilename().equals("."))) {
				String filename = ls.get(i).getFilename();
				String newPath3 = path + "/" + filename;
				 connectSFTP.rm(newPath3);
			}
		}
	}
}


//if (filename.isEmpty() == false) {
//String newPath1 = path + "/" + filename;
//System.out.println(newPath1);
//// rmDir(connectSFTP,newPath1);
//} else if (!(filename.equals("..") || filename.equals("."))) {
//String filename1 = ls.get(i).getFilename();
//String newPath2 = path + "/" + filename1;
//// connectSFTP.rmdir(newPath2);
//}
