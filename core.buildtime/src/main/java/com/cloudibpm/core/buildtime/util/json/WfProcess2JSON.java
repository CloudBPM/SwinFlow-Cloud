package com.cloudibpm.core.buildtime.util.json;

import com.cloudibpm.core.buildtime.release.wfprocess.ReleasedWfProcess;
import com.cloudibpm.core.buildtime.util.WfProcessCloner;
import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.json.JSONObject;

/**
 * This class is used to generate JSON object for business process java object.
 * 基本思想是：为了能序列化成JSON对象，需要清理所有的循环引用，为了简化操作，
 * 也为了容易理解，我干脆新建一个对象（类似克隆），把原对象所有属性拷贝到新对象中，
 * 然后对原对象中的循环引用清空，或者转化为字符串。这样保证了序列化顺利成功。
 * 
 * @author Dahai created on 2017-11-28, last update on 2018-06-17, last updated
 *         at 16:21 on 2018-09-02 (My 46th birthday)
 *
 */
public class WfProcess2JSON {

	/**
	 * 将WfProcess对象序列化成字符串
	 * 
	 * @date Dahai Cao last updated at 16:29 on Sunday 2018-09-02
	 * @param process
	 *            WfProcess
	 * @return String
	 * @throws JsonProcessingException
	 */
	public static String toPJSON(WfProcess process) throws JsonProcessingException {
		WfProcess process1 = WfProcessCloner.clone(process);
		//ObjectMapper mapper = new ObjectMapper();
		//String json = mapper.writeValueAsString(process1);
		//return json;
		JSONObject obj1 = new JSONObject(process1);
		return obj1.toString();
	}

	/**
	 * 将ReleasedWfProcess对象序列化成字符串
	 * 
	 * @date Dahai Cao last updated at 16:29 on Sunday 2018-09-02
	 * @param process
	 *            ReleasedWfProcess
	 * @return String
	 * @throws JsonProcessingException
	 */
	public static String toRPJSON(ReleasedWfProcess process) throws JsonProcessingException {
		ReleasedWfProcess process1 = WfProcessCloner.clone(process);
		//ObjectMapper mapper = new ObjectMapper();
		//String json = mapper.writeValueAsString(process1);
		//return json;
		JSONObject obj1 = new JSONObject(process1);
		return obj1.toString();
	}


}
