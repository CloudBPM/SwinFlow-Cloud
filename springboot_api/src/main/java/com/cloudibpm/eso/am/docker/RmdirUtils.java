package com.cloudibpm.eso.am.docker;

import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.ChannelSftp.LsEntry;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.SftpException;

import java.util.Vector;

public class RmdirUtils {

	public static int  removeDir(ChannelSftp connectSFTP,String path) throws JSchException, SftpException{
		Vector<LsEntry> ls = connectSFTP.ls(path);
		//遍历该文件夹，获取文件或者文件夹
		for (int i = 0; i < ls.size(); i++) {
			try {
				//判断是否是文件夹，排除 . .. 两个文件夹
				if (ls.get(i).getAttrs().isDir() && !(ls.get(i).getFilename().equals("..") || ls.get(i).getFilename().equals("."))) {
					//获取每个文件夹的名称
					String dirName = ls.get(i).getFilename();
					//拼接路径
					String newPath = path+"/"+dirName;
					//获取该文件夹下面的子文件或者文件夹
					Vector<LsEntry> ls2 = connectSFTP.ls(newPath);
					//判断是不是空文件夹
					if(ls2.size()==2){
						connectSFTP.rmdir(newPath); //删除文件夹
					}else{
						removeDir(connectSFTP,newPath);  //递归，调用
					}
					//获取文件夹里面的文件并删除
				} else if (!(ls.get(i).getFilename().equals("..") || ls.get(i).getFilename().equals("."))) {
					String filename = ls.get(i).getFilename();
					String newPath3 = path + "/" + filename;
					 connectSFTP.rm(newPath3);
				}
			} catch (SftpException e) {
				e.printStackTrace();
				return 0;
			}
		}
		return 1;
	}
}
