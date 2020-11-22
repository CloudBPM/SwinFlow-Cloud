/**
 * 
 */
package com.cloudibpm.core.util.file;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import com.cloudibpm.core.util.SystemConfig;

/**
 * This utility is used to upload file for file object definition.
 * 
 * @author Dahai Cao create on 2017-11-16
 *
 */
public class FileUploadUtils {

	/**
	 * 
	 * @param oid
	 * @param pid
	 * @param vid
	 * @param fid
	 * @param fname
	 * @param file
	 * @return
	 * @throws NumberFormatException
	 * @throws IOException
	 */
	public static String updateFile(String oid, String prj, String pid, String vid, String fid, String fname,
			byte[] file) throws NumberFormatException, IOException {
		String storagetype = SystemConfig.getProp("filestorage.type");
		String syspath = "";
		if (storagetype.trim().equals("win")) {
			syspath = SystemConfig.getProp("windows.filestorage.lib");
		} else if (storagetype.trim().equals("linux")) {
			syspath = SystemConfig.getProp("linux.filestorage.lib");
		} else { // other platform from system configurations

		}
		if (!syspath.equals("")) {
			String destination = syspath + "/" + oid + "/" + prj + "/" + pid;
			String filename = "";
			if (fid != null && !fid.trim().equals("") && !fid.trim().toLowerCase().equals("null")) {
				filename = fid + "_" + fname;
				FileUtil.deleteDirFilesLikeName(destination, fid);
			} else {
				UUID newfid = UUID.randomUUID();
				fid = newfid.toString();
				filename = fid + "_" + fname;
			}
			File f = new File(destination + "/" + filename);
			if (!f.exists()) {
				FileUtil.createDir(destination);
				FileUtil.writeFile(file, destination, filename);
			}
			return fid;
		}
		return null;
	}

	/**
	 * 
	 * @param oid
	 * @param pid
	 * @param vid
	 * @param fid
	 * @throws NumberFormatException
	 * @throws IOException
	 */
	public static void removeFile(String oid, String prj, String pid, String vid, String fid)
			throws NumberFormatException, IOException {
		String storagetype = SystemConfig.getProp("filestorage.type");
		String syspath = "";
		if (storagetype.equals("win")) {
			syspath = SystemConfig.getProp("windows.filestorage.lib");
		} else if (storagetype.equals("linux")) {
			syspath = SystemConfig.getProp("linux.filestorage.lib");
		}
		if (!syspath.equals("")) {
			String destination = syspath + "/" + oid + "/" + prj + "/" + pid;
			FileUtil.deleteDirFilesLikeName(destination, fid);
		}
	}

	public static void removeVariableFileObject(String oid, String prj, String pid, String fid)
			throws NumberFormatException, IOException {
		String storagetype = SystemConfig.getProp("filestorage.type");
		String syspath = "";
		if (storagetype.equals("win")) {
			syspath = SystemConfig.getProp("windows.filestorage.lib");
		} else if (storagetype.equals("linux")) {
			syspath = SystemConfig.getProp("linux.filestorage.lib");
		}
		if (!syspath.equals("")) {
			String destination = syspath + "/" + oid + "/" + prj + "/" + pid;
			FileUtil.deleteDirFilesLikeName(destination, fid);
		}
	}

	/**
	 * 
	 * @param pid
	 * @param oid
	 * @throws NumberFormatException
	 * @throws IOException
	 */
	public static void removeAllFiles(String oid, String prj, String pid) throws NumberFormatException, IOException {
		String storagetype = SystemConfig.getProp("filestorage.type");
		String syspath = "";
		if (storagetype.equals("win")) {
			syspath = SystemConfig.getProp("windows.filestorage.lib");
		} else if (storagetype.equals("linux")) {
			syspath = SystemConfig.getProp("linux.filestorage.lib");
		}
		if (!syspath.equals("")) {
			FileUtil.delDir(syspath + "/" + oid + "/" + prj + "/" + pid);
		}
	}
}
