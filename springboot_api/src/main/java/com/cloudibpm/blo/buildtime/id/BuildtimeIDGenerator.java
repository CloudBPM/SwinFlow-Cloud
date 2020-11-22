package com.cloudibpm.blo.buildtime.id;

import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.idcache.IDGeneratorEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class BuildtimeIDGenerator extends BusinessLogicObject {
	private final IDGeneratorEso idGeneratorEso;

	@Autowired
	public BuildtimeIDGenerator(IDGeneratorEso idGeneratorEso) {
		this.idGeneratorEso = idGeneratorEso;
	}

	public String getNewRunTimeID() throws Exception {
		long l = IdWorker.getInstance().nextId();
		return "A" + l;
//		return idGeneratorEso.generateRuntimeId();
	}

	
	public String getNewBuildTimeID() throws Exception {
		long l = IdWorker.getInstance().nextId();
		return "B" + l;
//		return idGeneratorEso.generateBuildtimeId();
	}

	
	public String getNewBuildTimeCode() throws Exception {
		return idGeneratorEso.generateBuildtimeSerialCode();
	}

	
	public String getNewBuildTimeVersionNo() throws Exception {
		return idGeneratorEso.generateNewVersionNo();
	}

	
	public String getNewBuildTimeUniCounting() throws Exception {
		return idGeneratorEso.generateBuildtimeUniCounting();
	}

//	public static void main(String [] args) {
//		try {
//			// 获取一个ID
//			String id = getNewBuildTimeID();
//			System.out.println(id);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}

}
