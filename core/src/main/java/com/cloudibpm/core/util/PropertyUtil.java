package com.cloudibpm.core.util;



import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Properties;

/**
 * 读取properties文件获取工具类
 * 
 */
public class PropertyUtil {
	
    private static Properties props;
    static{
        loadProps();
    }

    synchronized static private void loadProps(){
        props = new Properties();
        InputStreamReader in = null;
        try {
        	in = new InputStreamReader(PropertyUtil.class.getClassLoader().getResourceAsStream("sysconfig.properties"), "UTF-8");
//            in = PropertyUtil.class.getClassLoader().getResourceAsStream("sysconfig.properties","UTF-8");
            //in = PropertyUtil.class.getResourceAsStream("/jdbc.properties");
            props.load(in);
        } catch (FileNotFoundException e) {
        	e.printStackTrace();
        } catch (IOException e) {
        	e.printStackTrace();
        } finally {
            try {
                if(null != in) {
                    in.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static String getProperty(String key){
        if(null == props) {
            loadProps();
        }
        return props.getProperty(key);
    }

    public static String getProperty(String key, String defaultValue) {
        if(null == props) {
            loadProps();
        }
        return props.getProperty(key, defaultValue);
    }
}
