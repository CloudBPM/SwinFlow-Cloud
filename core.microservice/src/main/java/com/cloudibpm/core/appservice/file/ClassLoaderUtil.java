/**
 * @user Dahai CAO
 * @date 2011-7-25 下午09:39:46
 */
package com.cloudibpm.core.appservice.file;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.net.JarURLConnection;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.List;

import com.cloudibpm.core.folder.FileObject;
import com.cloudibpm.core.util.file.FileUtil;

// Helpful reference:
// https://cvamshi.wordpress.com/2011/01/12/loading-jars-and-java-classes-dynamically/
// https://dzone.com/articles/add-jar-file-java-load-path
/**
 * Class loader for Jar file on Jar protocol
 * 
 * @author Dahai Cao
 * @date 2016-11-25
 */
public class ClassLoaderUtil extends URLClassLoader {

	/**
	 * Constructor
	 */
	public ClassLoaderUtil() {
		super(new URL[0], ClassLoader.getSystemClassLoader());
	}

	public void loadAllJarFiles(final String filepath, final String ext) throws IOException {
		List<File> pathList = FileUtil.getFileList(filepath, ext);
		for (File obj : pathList) {
			addJarFile(obj);
		}
	}

	/**
	 * I need a Uniform Resource Locater(URL) to point my Jar. We can create it
	 * like below: URL myJarFile = new
	 * URL("jar","","file:"+myfile.getAbsolutePath()+"!/"); e.g.,
	 * "jar:file:/c:/myfolder/myjarfile.jar!/" (Windows) or
	 * "jar:file:/var/myjarfile.jar!/" (Linux).
	 * 
	 * The first argument is the protocol that is being used to source the data.
	 * There are multiple protocols that are supported like http, https, file,
	 * ftp and jar. The second argument is the host where the source is. And the
	 * third argument is the absolute location of the source. This statement
	 * defines the URL that points us to the jar.
	 * 
	 * @param file
	 * @throws IOException
	 */
	public void addJarFile(File file) throws IOException {
		URL u = new URL("jar", "", file.getCanonicalFile().toURI().toURL() + "!/");
		// System.out.println(fileAbsolutePath.getCanonicalFile().toURI().toURL());
		JarURLConnection uc = (JarURLConnection) u.openConnection();
		addURL(uc.getJarFileURL());
	}

	public List<FileObject> getJarFilesObjects(String serverPath, String id, String extnames) throws Exception {
		String url = serverPath + "/" + id;
		List<File> files = FileUtil.getFileList(url, extnames);
		List<FileObject> fileObjects = new ArrayList<FileObject>();
		for (int i = 0; i < files.size(); i++) {
			fileObjects.add(new FileObject(files.get(i).getName(), url));
		}
		return fileObjects;
	}

	public static void main(String[] args) {
		try {
			ClassLoaderUtil loader = new ClassLoaderUtil();
			loader.loadAllJarFiles("C:/AM-JavaApp-Lib" + "/" + "00000000000000Rc", "jar;");
			Class<?> clsB64 = Class.forName("api.test.TestClassForAM", true, loader);
			// just loading, no linkage and initialization
			// loader.loadClass("api.test.my.TestClassForPM");
			Method m = clsB64.getMethod("sayHelloWorld", new Class[] { String.class });
		    m.getClass().getCanonicalName();
		    //examine the package object 
		    //String name = objPackage.getSpecificationTitle();
		    //String version = objPackage.getSpecificationVersion();
			Parameter[] parameters = m.getParameters();
			List<String> parameterNames = new ArrayList<>();

			for (Parameter parameter : parameters) {
				// if(!parameter.isNamePresent()) {
				// throw new IllegalArgumentException("Parameter names are not
				// present!");
				// }
				String parameterName = parameter.getName();
				System.out.println(parameterName);
				parameterNames.add(parameterName);
			}
			Object obj = m.invoke(clsB64, new Object[] { "a" });
			loader.close();
			System.out.println(obj);
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}