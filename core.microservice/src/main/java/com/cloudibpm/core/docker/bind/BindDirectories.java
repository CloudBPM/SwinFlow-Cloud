/**
 * 
 */
package com.cloudibpm.core.docker.bind;

import java.util.ArrayList;
import java.util.List;

import com.github.dockerjava.api.model.Bind;
import com.github.dockerjava.api.model.Volume;

/**
 * @author xq0001
 *
 */
public class BindDirectories {
	
public static List<Bind> bindTomcateDir(String orgFile,String serviceFile) {
	Volume containerPath1= new Volume(BINDConstants.TOMCAT_WEBAPPS_DIR);
	Volume containerPath2 = new Volume(BINDConstants.TOMCAT_LOG_DIR);
	String hostPath1 = BINDConstants.HOST_TOMCAT_WEBAPPS_DIR+orgFile+"/"+serviceFile+"/webapps";
	String hostPath2 = BINDConstants.HOST_TOMCAT_LOG_DIR+orgFile+"/"+serviceFile+"/logs";
	Bind bind1= new Bind(hostPath1, containerPath1);
	Bind bind2 = new Bind(hostPath2, containerPath2);
	List<Bind> bindList = new ArrayList<>();
	bindList.add(bind1);
	bindList.add(bind2);
	return bindList;
}

public static List<Bind> bindPythonDir(String orgFile,String serviceFile) {
	List<Bind> b = new ArrayList<>();
	return b;
}

public static List<Bind> bindPhpDir(String orgFile,String serviceFile) {
	List<Bind> b = new ArrayList<>();
	return b;
}
public static List<Bind> bindRubyDir(String orgFile,String serviceFile) {
	List<Bind> b = new ArrayList<>();
	return b;
}
}
