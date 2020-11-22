/**
 *
 */
package com.cloudibpm.blo.am.docker;

import com.github.dockerjava.api.model.Bind;
import com.github.dockerjava.api.model.Volume;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @author xq0001
 */
@Service
public class BindDirectories {

    public static List<Bind> bindTomcateDir(String orgFile, String serviceFile) {
        Volume containerPath1 = new Volume(BINDConstants.TOMCAT_WEBAPPS_DIR);
        Volume containerPath2 = new Volume(BINDConstants.TOMCAT_LOG_DIR);
        Volume containerPath3 = new Volume(BINDConstants.TOMCAT_CONF_DIR);
        String hostPath1 = BINDConstants.HOST_TOMCAT + orgFile + "/am/" + serviceFile + "/webapps";
        String hostPath2 = BINDConstants.HOST_TOMCAT + orgFile + "/am/" + serviceFile + "/logs";
        String hostPath3 = BINDConstants.HOST_TOMCAT + orgFile + "/am/" + serviceFile + "/conf";
        Bind bind1 = new Bind(hostPath1, containerPath1);
        Bind bind2 = new Bind(hostPath2, containerPath2);
        Bind bind3 = new Bind(hostPath3, containerPath3);
        List<Bind> bindList = new ArrayList<>();
        bindList.add(bind1);
        bindList.add(bind2);
        bindList.add(bind3);
        return bindList;
    }

    public static List<Bind> bindPythonDir(String orgFile, String serviceFile) {
        List<Bind> b = new ArrayList<>();
        return b;
    }

    public static List<Bind> bindPhpDir(String orgFile, String serviceFile) {
        List<Bind> b = new ArrayList<>();
        return b;
    }

    public static List<Bind> bindRubyDir(String orgFile, String serviceFile) {
        List<Bind> b = new ArrayList<>();
        return b;
    }
}
