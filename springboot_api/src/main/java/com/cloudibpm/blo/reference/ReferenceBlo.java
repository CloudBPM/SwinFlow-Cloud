/**
 * 
 */
package com.cloudibpm.blo.reference;

import com.cloudibpm.core.reference.Reference;
import com.cloudibpm.core.reference.ReferenceDetail;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.reference.ReferenceDetailEso;
import com.cloudibpm.eso.reference.ReferenceEso;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Dahai Cao created on 2017-05-25, last updated at 22:08 on 2018-10-10
 *
 */
@Service
//@Transactional
public class ReferenceBlo extends BusinessLogicObject {
	private final ReferenceEso referenceEso;
	private final ReferenceDetailEso referenceDetailEso;

	@Autowired
	public ReferenceBlo(ReferenceEso referenceEso, ReferenceDetailEso referenceDetailEso) {
		this.referenceEso = referenceEso;
		this.referenceDetailEso = referenceDetailEso;
	}


	public Reference getReference(String id) throws Exception {
		
		return referenceEso.queryByPk(id);
	}

	// this method supports form designing
	public List<Reference> getAllReferences(String orgId) throws Exception {
		
		return referenceEso.queryAllReferences(orgId);
	}

	public List<Reference> getReferences(String parent, String orgId) throws Exception {
		
		return referenceEso.queryAllReferences(parent, orgId);
	}

	public void createNewReference(Reference ref) throws Exception {
		
		referenceEso.insert(ref);
	}

	public void updateReference(Reference ref) throws Exception {
		
		referenceEso.update(ref);
	}

	public void createNewReferenceDetail(ReferenceDetail ref) throws Exception {

		referenceDetailEso.insert(ref);
	}

	public List<ReferenceDetail> getReferenceDetails(String refId) throws Exception {
		
		return referenceDetailEso.queryAllReferenceDetails(refId);
	}

	public List<ReferenceDetail> getReferenceDetails(String parentCode, String refId) throws Exception {
		
		return referenceDetailEso.queryAllReferenceDetails(parentCode, refId);
	}

	public ReferenceDetail getReferenceDetail(String refId) throws Exception {
		
		return referenceDetailEso.queryByPk(refId);
	}

	public void addNewReferenceDetails(List<ReferenceDetail> list) throws Exception {
		
		if (!list.isEmpty()) {
			for (ReferenceDetail rd : list) {
				referenceDetailEso.insert(rd);
			}
		}
	}

	public void updateReferenceDetails(List<ReferenceDetail> list) throws Exception {
		
		if (!list.isEmpty()) {
			for (ReferenceDetail rd : list) {
				referenceDetailEso.update(rd);
			}
		}
	}

	public void deleteReferenceDetails(List<ReferenceDetail> list) throws Exception {
		
		if (!list.isEmpty()) {
			for (ReferenceDetail rd : list) {
				referenceDetailEso.delete(rd);
			}
		}
	}

	public void removeReference(String id) throws Exception {
		
		referenceEso.delete(id);

		referenceDetailEso.deleteAllDetails(id);
	}

	/**
	 * @author Dahai Cao last updated at 22:08 on 2018-10-10
	 * @param id
	 * @param newrefername
	 * @param lastupdate
	 * @throws Exception
	 */
	
	public void renameReferenceName(String id, String newrefername, long lastupdate) throws Exception {
		
		String name1 = StringEscapeUtils.escapeSql(newrefername);
		referenceEso.updateReferenceName(id, name1, lastupdate);
	}

}
