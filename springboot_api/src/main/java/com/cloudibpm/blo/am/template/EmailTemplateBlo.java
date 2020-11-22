/**
 * 
 */
package com.cloudibpm.blo.am.template;

import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.runtime.util.mail.SMTPSender;
import com.cloudibpm.core.template.EmailTemplate;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.core.util.SystemConfig;
import com.cloudibpm.core.util.file.FileUtil;
import com.cloudibpm.eso.am.template.EmailTemplateEso;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.text.ParseException;
import java.util.List;

/**
 * @author dev
 *
 */
@Service
//@Transactional
public class EmailTemplateBlo extends BusinessLogicObject {
	private final EmailTemplateEso tempEso;

	@Autowired
	public EmailTemplateBlo(EmailTemplateEso tempEso) {
		this.tempEso = tempEso;
	}

	public void createTemplate(EmailTemplate template) {
		 
		tempEso.insert(template);
	}

	public boolean existsTemplateName(String name, String ownerId) throws Exception {
		
		return tempEso.existsTemplateName(name, ownerId);
	}

	public List<EmailTemplate> getTemplates(String ownerId) throws Exception {
		
		return tempEso.queryAll(ownerId);
	}

	public List<EmailTemplate> getActiveTemplates(String ownerId) throws Exception {
		
		return tempEso.queryTemplatesByStatus(ownerId, 1);
	}

	public EmailTemplate getTemplate(String id) throws Exception {
		
		return tempEso.queryByPK(id);
	}


	public void updateTemplate(EmailTemplate template) throws Exception {
		
		tempEso.update(template);
	}


	public void updateTemplateStatus(String tid, int status, String lastupdate) throws Exception {
		
		tempEso.updateStatus(tid, status, DateUtility.parseDatetime(lastupdate).getTime());
	}


	public void deleteTemplate(String tid, String owner) throws Exception {
		
		tempEso.delete(tid);
		String storagetype = SystemConfig.getProp("filestorage.type");
		if (storagetype.trim().equals("win")) {
			String syspath = SystemConfig.getProp("windows.filestorage.lib");
			String destination = syspath + "/" + owner + "/am/emltp/" + tid;
			if (tid != null && !tid.equals("")) {
				FileUtil.delDir(destination);
			}
		} else if (storagetype.trim().equals("linux")) {
			String syspath = SystemConfig.getProp("linux.filestorage.lib");
			String destination = syspath + "/" + owner + "/am/emltp/" + tid;
			if (tid != null && !tid.equals("")) {
				FileUtil.delDir(destination);
			}
		} else { // other type
		}

	}


	public void rename(String tid, String newname, String lastupdate) throws Exception {
		
		tempEso.updateName(tid, newname, DateUtility.parseDatetime(lastupdate).getTime());
	}

	public void sendEmail(String id, String to, String subject, String content, String[] attachments)
			throws Exception {
		SMTPSender.sendEmail(new String[] { to }, null, null, subject, content, attachments, null);
	}

	public void sendEmailNoAnnex(String recipients, String subject, String content)
			throws Exception {
		SMTPSender.sendEmail(recipients, subject, content);
	}

	/**
	 * 
	 * @param tid
	 *            String, template ID
	 * @param fc,
	 *            Stirng, attachement file object description string
	 * @param lastupdate
	 *            String, time stamp
	 * @throws Exception
	 */

	public void updateEmailAttachment(String tid, String fname, JSONObject fc, String lastupdate) throws Exception {
		
		EmailTemplate emailTemplate = tempEso.queryByPK(tid);
		String attachments = emailTemplate.getAttachments();
		if (StringUtils.isEmpty(attachments)) {
			JSONArray attach = new JSONArray();
			attach.put(fc);
			attachments = attach.toString();
		} else if (attachments.contains(fname)) {
			return;
		} else {
			JSONArray attach = new JSONArray(attachments);
			attach.put(fc);
			attachments = attach.toString();
		}
		tempEso.updateEmailAttachment(tid, attachments, DateUtility.parseDatetime(lastupdate).getTime());
	}

	/**
	 * 
	 * @param tid
	 *            String, template ID
	 * @param fid,
	 *            FileConstant ID, attachement file object ID
	 * @param lastupdate
	 *            String, time stamp
	 * @throws SQLException
	 * @throws ParseException
	 */
	public void deleteEmailAttachment(String tid, String fid, String filename, String lastupdate)
			throws SQLException, ParseException {
		
		EmailTemplate emailTemplate = tempEso.queryByPK(tid);
		String attachments = emailTemplate.getAttachments();
		if (!StringUtils.isEmpty(attachments) && attachments.contains(filename)) {
			JSONArray attach = new JSONArray(attachments);
			if (attach.length() > 0) {
				for (int i = 0; i < attach.length(); i++) {
					JSONObject o = attach.getJSONObject(i);
					if (o.getString("id").equals(fid)) {
						attach.remove(i);
						break;
					}
				}
				if (attach.length() > 0) {
					tempEso.updateEmailAttachment(tid, attach.toString(),
							DateUtility.parseDatetime(lastupdate).getTime());
				} else {
					tempEso.updateEmailAttachment(tid, null, DateUtility.parseDatetime(lastupdate).getTime());
				}
			}
		}
	}
}