/**
 * 
 */
package com.cloudibpm.blo.am.template;

import com.cloudibpm.blo.message.AliyunMessageBlo;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.template.SMSTemplate;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.eso.am.template.SMSTemplateEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author dev
 *
 */
//@Transactional
@Service
public class SMSTemplateBlo extends BusinessLogicObject {
	
	private final SMSTemplateEso tempEso;
	private final AliyunMessageBlo aliyunMessageBlo;

	@Autowired
	public SMSTemplateBlo(SMSTemplateEso tempEso, AliyunMessageBlo aliyunMessageBlo) {
		this.tempEso = tempEso;
		this.aliyunMessageBlo = aliyunMessageBlo;
	}


	public void createTemplate(SMSTemplate template) {
		
		tempEso.insert(template);
	}

	public boolean existsTemplateName(String name, String ownerId) throws Exception {
		
		return tempEso.existsTemplateName(name, ownerId);
	}

	public List<SMSTemplate> getTemplates(String ownerId) throws Exception {
		
		return tempEso.queryAll(ownerId);
	}
	
	public List<SMSTemplate> getActiveTemplates(String ownerId) throws Exception {
		
		return tempEso.queryTemplatesByStatus(ownerId, 1);
	}

	public SMSTemplate getTemplate(String id) throws Exception {
		
		return tempEso.queryByPK(id);
	}

	
	public void updateTemplate(SMSTemplate template) throws Exception {
		
		tempEso.update(template);
	}

	
	public void updateTemplateStatus(String tid, int status, String lastupdate) throws Exception {
		
		tempEso.updateStatus(tid, status, DateUtility.parseDatetime(lastupdate).getTime());
	}

	
	public void deleteTemplate(String tid) throws Exception {
		
		tempEso.delete(tid);
	}

	
	public void rename(String tid, String newname, String lastupdate) throws Exception {
		
		tempEso.updateName(tid, newname, DateUtility.parseDatetime(lastupdate).getTime());
	}

	public void sendTestSMS(String id, String to, String content) throws Exception {
		aliyunMessageBlo.testSendSms(to, content);
	}

}
