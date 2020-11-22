package com.cloudibpm.runtime.util.microservice;

import com.cloudibpm.core.data.FileConstant;
import com.cloudibpm.core.util.SystemConfig;
import com.cloudibpm.core.util.file.FileUtil;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.CharsetUtils;

import java.io.*;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Dahai Cao created at 10:00 on 2018-08-01
 *
 */
public class RTFileObjectAccessor implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 7642050938977869976L;

	/**
	 * 这个方法的功能是，BPM执行服务，从API接口获取文件，而由于文件服务器和API接口同在一个服务器上，
	 * 所以从API接口获取等于是从文件服务器获取，性能是一样的。该方法返回所获取的文件的byte数组。
	 * 
	 * 未来如果文件服务器迁移到云盘上，需要重写该方法。
	 * 
	 * @param httpClient
	 * @param fc
	 * @return
	 * @throws UnsupportedOperationException
	 * @throws IOException
	 */
	public static InputStream fetchFileObject(CloseableHttpClient httpClient, FileConstant fc)
			throws UnsupportedOperationException, IOException {
		// download ...
		String apiserver = SystemConfig.getProp("api.server.domainname");
		String source = "/" + fc.getOwner() + "/rt/" + fc.getCurrOwner() + "/" + fc.getId() + "_" + fc.getName();
		HttpPost httpPost = new HttpPost(apiserver + "/service19/api13");
		List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
		urlParameters.add(new BasicNameValuePair("path", source));
		HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
		httpPost.setEntity(postParams);
		CloseableHttpResponse response = httpClient.execute(httpPost);
		InputStream in = response.getEntity().getContent();
		//byte[] bytesArray = new byte[(int) response.getEntity().getContentLength()];
		//in.read(bytesArray);

		// 这段代码用于测试，是否从API接口把文件完整地下载到BPM执行服务中，如果完整地下载下来了，
		// 就可以传入到微服务中。（这段代码是有效的，为了用于测试，可以保留）
		// File file = new File("D:/Data/temp/" + fc.getName());
		// if (!file.exists())
		// file.createNewFile();
		// FileOutputStream out = new FileOutputStream(file);
		// int c;
		// byte buffer[] = new byte[1024];
		// while ((c = in.read(buffer)) != -1) {
		// for (int i = 0; i < c; i++)
		// out.write(buffer[i]);
		// }
		// out.close();
		//in.close();
		//if (!httpPost.isAborted())
		//	httpPost.abort();
		return in;
	}

	/**
	 * 这个方法是用于单机版的文件对象数据流的获取。
	 *
	 * @param fc
	 * @return
	 * @throws FileNotFoundException
	 */
	public static InputStream fetchLocalFileObject(FileConstant fc) throws FileNotFoundException {
		// download ...
		String source = fc.getOwner() + "/rt/" + fc.getCurrOwner() + "/" + fc.getId() + "_" + fc.getName();
		String srcpath = "";
		String storagetype = SystemConfig.getProp("filestorage.type");
		if (storagetype.trim().equals("win")) {
			String syspath = SystemConfig.getProp("windows.filestorage.lib");
			srcpath = syspath + "/" + source;
		} else if (storagetype.trim().equals("linux")) {
			String syspath = SystemConfig.getProp("linux.filestorage.lib");
			srcpath = syspath + "/" + source;
		}
		InputStream in = new FileInputStream(new File(srcpath));
		return in;
	}


	/**
	 * 这个方法是用于单机版的文件对象获取。
	 *
	 * @param fc
	 * @return
	 * @throws FileNotFoundException
	 */
	public static void copyLocalFileObject(FileConstant fc, String owner, String currowner) throws IOException {
		// download ...
		String filename = fc.getId() + "_" + fc.getName();
		String source = fc.getOwner() + "/rt/" + fc.getCurrOwner() + "/";
		String target = owner + "/rt/" +currowner + "/";
		String storagetype = SystemConfig.getProp("filestorage.type");
		String srcpath = "";
		String despath = "";
		if (storagetype.trim().equals("win")) {
			String syspath = SystemConfig.getProp("windows.filestorage.lib");
			srcpath = syspath + "/" + source;
			despath = syspath + "/" + target;
		} else if (storagetype.trim().equals("linux")) {
			String syspath = SystemConfig.getProp("linux.filestorage.lib");
			srcpath = syspath + "/" + source;
			despath = syspath + "/" + target;
		}
		FileUtil.copyFile(srcpath, filename, despath, filename);
	}
	
	public static InputStream fetchEmaillAttachmentFileObject(CloseableHttpClient httpClient, FileConstant fc, String emlTemplateId)
			throws UnsupportedOperationException, IOException {
		// download ...
		String apiserver = SystemConfig.getProp("api.server.domainname");
		String source = "/" + fc.getOwner() + "/am/emltp/" + emlTemplateId + "/" + fc.getId() + "_" + fc.getName();
		HttpPost httpPost = new HttpPost(apiserver + "/service19/api13");
		List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
		urlParameters.add(new BasicNameValuePair("path", source));
		HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
		httpPost.setEntity(postParams);
		CloseableHttpResponse response = httpClient.execute(httpPost);
		InputStream in = response.getEntity().getContent();
		//byte[] bytesArray = new byte[(int) response.getEntity().getContentLength()];
		//in.read(bytesArray);

		// 这段代码用于测试，是否从API接口把文件完整地下载到BPM执行服务中，如果完整地下载下来了，
		// 就可以传入到微服务中。（这段代码是有效的，为了用于测试，可以保留）
		// File file = new File("D:/Data/temp/" + fc.getName());
		// if (!file.exists())
		// file.createNewFile();
		// FileOutputStream out = new FileOutputStream(file);
		// int c;
		// byte buffer[] = new byte[1024];
		// while ((c = in.read(buffer)) != -1) {
		// for (int i = 0; i < c; i++)
		// out.write(buffer[i]);
		// }
		// out.close();
		//in.close();
		//if (!httpPost.isAborted())
		//	httpPost.abort();
		return in;
	}

	/**
	 * 这个方法是用于单机版的邮件附件文件对象获取。
	 *
	 * @param fc
	 * @param emlTemplateId
	 * @return
	 * @throws FileNotFoundException
	 */
	public static InputStream fetchLocalEmaillAttachmentFileObject(FileConstant fc,
																   String emlTemplateId) throws FileNotFoundException {
		// download ...
		String source = "/" + fc.getOwner() + "/am/emltp/" + emlTemplateId + "/" + fc.getId() + "_" + fc.getName();
		String storagetype = SystemConfig.getProp("filestorage.type");
		String destination = "";
		if (storagetype.trim().equals("win")) {
			String syspath = SystemConfig.getProp("windows.filestorage.lib");
			destination = syspath + "/" + source;
		} else if (storagetype.trim().equals("linux")) {
			String syspath = SystemConfig.getProp("linux.filestorage.lib");
			destination = syspath + "/" + source;
		}
		File file = new File(destination);
		InputStream in = new FileInputStream(file);
		return in;
	}

	/**
	 * 该方法的功能是将一个byte数组写到API接口，由于API接口和文件服务器同在一个服务器上， 因此，写到API接口，就等于写到文件服务器上。
	 * 
	 * 未来如果文件服务器迁移到云盘上，需要重写该方法。
	 * 
	 * @param fc
	 * @param in
	 * @param len
	 * @throws UnsupportedOperationException
	 * @throws IOException
	 */
	public static void putFileObject(FileConstant fc, InputStream in, long len)
			throws UnsupportedOperationException, IOException {
		String apiserver = SystemConfig.getProp("api.server.domainname");
		String fname2 = URLDecoder.decode(fc.getName(), "utf-8");
		MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create();
		multipartEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
		multipartEntityBuilder.addTextBody("oid", fc.getOwner(), ContentType.DEFAULT_BINARY);
		multipartEntityBuilder.addTextBody("pid", fc.getCurrOwner(), ContentType.DEFAULT_BINARY);
		multipartEntityBuilder.addTextBody("vid", "", ContentType.DEFAULT_BINARY); // no use anytime;
		multipartEntityBuilder.addTextBody("fid", fc.getId() == null ? "" : fc.getId(), ContentType.DEFAULT_BINARY);
		multipartEntityBuilder.addTextBody("fname", URLEncoder.encode(fname2, "utf-8"), ContentType.DEFAULT_BINARY);
		multipartEntityBuilder.addTextBody("flen", String.valueOf(fc.getSize()), ContentType.DEFAULT_BINARY);
		multipartEntityBuilder.setCharset(CharsetUtils.get("UTF-8"));
		multipartEntityBuilder.addBinaryBody("uploadFile", in, ContentType.DEFAULT_BINARY, fc.getName());
		HttpEntity httpEntity = multipartEntityBuilder.build();

		HttpPost httpPost2 = new HttpPost(apiserver + "/service19/api12");
		httpPost2.setEntity(httpEntity);
		CloseableHttpClient httpClient2 = HttpClientBuilder.create().build();
		httpClient2.execute(httpPost2);
		// CloseableHttpResponse response2 = httpClient2.execute(httpPost2);
		// HttpEntity entity2 = response2.getEntity();
		// String responseJson = EntityUtils.toString(entity2,
		// Charset.forName("UTF-8")).trim();
		httpClient2.close();
		httpPost2.abort();
	}


}