package com.cloudibpm.core.runtime.util.json;

import com.cloudibpm.core.buildtime.util.json.WfProcess2JSON;
import com.cloudibpm.core.runtime.util.WfProcessInstanceCloner;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.json.JSONObject;

/**
 * This class is used to generate JSON object for business process java object.
 * 基本思想是：为了能序列化成JSON对象，需要清理所有的循环引用，为了简化操作，
 * 也为了容易理解，我干脆新建一个对象（类似克隆），把原对象所有属性拷贝到新对象中，
 * 然后对原对象中的循环引用清空，或者转化为字符串。这样保证了序列化顺利成功。
 * 而且原对象一般是在引擎中正在执行的对象，其属性时刻在变化，因此不能对原对象做任何修改。
 * 
 * @author Dahai created on 2017-11-28, last updated at 16:21 on 2018-09-02 (My
 *         46th birthday)
 *
 */
public class WfProcessInstance2JSON extends WfProcess2JSON {

	/**
	 * 将WfProcessInstance对象序列化成字符串String。
	 * 
	 * @date Dahai Cao last updated at 16:29 on Sunday 2018-09-02
	 * @param process
	 *            WfProcessInstance
	 * @return String
	 * @throws JsonProcessingException
	 */
	public static String toJSON(WfProcessInstance process) throws JsonProcessingException {
		WfProcessInstance process1 = WfProcessInstanceCloner.clone(process);
		//ObjectMapper mapper = new ObjectMapper();
		//String json = mapper.writeValueAsString(process1);
		//return json;
		JSONObject obj1 = new JSONObject(process1);
		return obj1.toString();
	}

	public static String toJSONString(WfProcessInstance process) throws JsonProcessingException {
		JSONObject obj1 = new JSONObject(process);
		return obj1.toString();
	}



}
