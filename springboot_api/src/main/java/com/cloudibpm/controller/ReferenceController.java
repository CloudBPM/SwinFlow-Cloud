/**
 * 
 */
package com.cloudibpm.controller;

import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.blo.reference.ReferenceBlo;
import com.cloudibpm.core.folder.JSTreeNode;
import com.cloudibpm.core.reference.Reference;
import com.cloudibpm.core.reference.ReferenceDetail;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * 
 * @author Dahai Cao
 * @date 20170601
 */
@RestController
@RequestMapping("/service10")
public class ReferenceController {
	private final ReferenceBlo referenceBlo;
	private final BuildtimeIDGenerator buildtimeIDGenerator;

	@Autowired
	public ReferenceController(ReferenceBlo referenceBlo, BuildtimeIDGenerator buildtimeIDGenerator) {
		this.referenceBlo = referenceBlo;
		this.buildtimeIDGenerator = buildtimeIDGenerator;
	}

	@RequestMapping(value = "/api0", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public JSTreeNode[] getReferenceDetails(String id) {
		try {
			Reference ref = referenceBlo.getReference(id);
			JSTreeNode[] root = new JSTreeNode[1];
			root[0] = new JSTreeNode();
			root[0].id = ref.getId();
			root[0].text = JSTreeNode.parseUTF8(ref.getName());
			root[0].icon = "glyphicon glyphicon-file";
			root[0].parentId = ref.getParent();
			root[0].data = "x|";
			List<ReferenceDetail> refs = referenceBlo.getReferenceDetails(id);
			this.generateJSTreeNodes(root[0], refs);
			return root;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	private void generateJSTreeNodes(JSTreeNode root, List<ReferenceDetail> refs) {
		if (refs.isEmpty())
			return;
		List<ReferenceDetail> t = new ArrayList<ReferenceDetail>();
		Iterator<ReferenceDetail> iter = refs.iterator();
		while (iter.hasNext()) {
			ReferenceDetail o = iter.next();
			if (o.getParent().equals(root.id)) {
				t.add(o);
				iter.remove();
			}
		}
		if (!t.isEmpty()) {
			JSTreeNode[] jn = new JSTreeNode[t.size()];
			for (int i = 0; i < t.size(); i++) {
				JSTreeNode n = new JSTreeNode();
				n.id = t.get(i).getId();
				n.text = JSTreeNode.parseUTF8(t.get(i).getName());
				n.icon = "glyphicon glyphicon-file";
				n.data = t.get(i).getCode() + "|" + t.get(i).getParentCode();
				n.parentId = t.get(i).getParent();
				jn[i] = n;
				generateJSTreeNodes(n, refs);
			}
			root.children = jn;
		}
	}

	@RequestMapping(value = "/api1", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public String getNewID() {
		try {
			return buildtimeIDGenerator.getNewBuildTimeID();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "0";
	}

	@RequestMapping(value = "/api2", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public String getNewSerialNumber() {
		try {
			return buildtimeIDGenerator.getNewBuildTimeCode();// serialNumber
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "0";
	}

	@RequestMapping(value = "/api3", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public JSTreeNode createReference(String entityname, String parentid, String ownerid) {
		try {
			Reference ref = new Reference();
			String id = buildtimeIDGenerator.getNewBuildTimeID();
			ref.setId(id);
			ref.setName(entityname);
			ref.setParent(parentid);
			ref.setOwner(ownerid);
			long d = System.currentTimeMillis();
			ref.setCreateDatetime(d);
			ref.setLastupdate(d);
			referenceBlo.createNewReference(ref);
			JSTreeNode refNode = new JSTreeNode();
			refNode.id = id;
			refNode.text = entityname;
			refNode.parentId = parentid;
			refNode.data = "3|" + ownerid + "||R";
			return refNode;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@RequestMapping(value = "/api4", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public JSTreeNode createReferenceDetail(String id, String code, String text, String description, String parentCode,
			String parentid, String refId, String ownerid, String col1, String col2, String col3) {
		try {
			ReferenceDetail ref = new ReferenceDetail();
			ref.setId(id);
			ref.setCode(code);
			ref.setName(text);
			ref.setDescription(description);
			ref.setParentCode(parentCode);
			ref.setStatus(0); // 0: not in use; 1: in use;
			ref.setParent(parentid);
			ref.setCurrOwner(refId);
			ref.setOwner(ownerid);
			ref.setCustomColumn1(col1);
			ref.setCustomColumn2(col2);
			ref.setCustomColumn3(col3);
			referenceBlo.createNewReferenceDetail(ref);
			JSTreeNode refNode = new JSTreeNode();
			refNode.id = id;
			refNode.text = text;
			refNode.parentId = parentid;
			refNode.data = "0|" + code + "|" + parentCode;
			return refNode;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@RequestMapping(value = "/api5", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public Reference getReference(String id) {
		try {
			return referenceBlo.getReference(id);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@RequestMapping(value = "/api6", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public ReferenceDetail getReferenceDetail(String id) {
		try {
			return referenceBlo.getReferenceDetail(id);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@RequestMapping(value = "/api7", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public String saveReferenceDetail(String reference, String newlist, String updatedlist, String removedlist) {
		try {
			referenceBlo.updateReference(parseReference(new JSONObject(reference)));
			JSONObject obj1 = new JSONObject(newlist);
			if (obj1.length() > 0) {
				List<ReferenceDetail> lst = new ArrayList<ReferenceDetail>();
				for (Iterator<String> it = obj1.keys(); it.hasNext();) {
					lst.add(parseReferenceDetail((JSONObject) obj1.get(it.next())));
				}
				referenceBlo.addNewReferenceDetails(lst);
			}
			JSONObject obj2 = new JSONObject(updatedlist);
			if (obj2.length() > 0) {
				List<ReferenceDetail> lst1 = new ArrayList<ReferenceDetail>();
				for (Iterator<String> it = obj2.keys(); it.hasNext();) {
					lst1.add(parseReferenceDetail((JSONObject) obj2.get(it.next())));
				}
				referenceBlo.updateReferenceDetails(lst1);
			}
			JSONObject obj3 = new JSONObject(removedlist);
			if (obj3.length() > 0) {
				List<ReferenceDetail> lst2 = new ArrayList<ReferenceDetail>();
				for (Iterator<String> it = obj3.keys(); it.hasNext();) {
					lst2.add(parseReferenceDetail((JSONObject) obj3.get(it.next())));
				}
				referenceBlo.deleteReferenceDetails(lst2);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return "{\"status\": \"0\"}"; // failed
		}
		return "{\"status\": \"1\"}"; // success
	}

	public Reference parseReference(JSONObject o) throws JSONException, ParseException {
		Reference r = new Reference();
		r.setId(o.getString("id"));
		if (!o.isNull("name")) {
			r.setName(o.getString("name"));
		}
		if (!o.isNull("description")) {
			r.setDescription(o.getString("description"));
		}
		r.setLastupdate(o.getLong("lastupdate"));
		return r;
	}

	public ReferenceDetail parseReferenceDetail(JSONObject o) throws JSONException {
		ReferenceDetail detail = new ReferenceDetail();
		detail.setId(o.getString("id"));
		if (!o.isNull("code")) {
			detail.setCode(o.getString("code"));
		}
		if (!o.isNull("name")) {
			detail.setName(o.getString("name"));
		}
		if (!o.isNull("description")) {
			detail.setDescription(o.getString("description"));
		}
		if (!o.isNull("parentCode")) {
			detail.setParentCode(o.getString("parentCode"));
		}
		detail.setStatus(o.getInt("status"));
		if (!o.isNull("parent")) {
			detail.setParent(o.getString("parent"));
		}
		if (!o.isNull("currOwner")) {
			detail.setCurrOwner(o.getString("currOwner"));
		}
		if (!o.isNull("owner")) {
			detail.setOwner(o.getString("owner"));
		}
		if (!o.isNull("customColumn1")) {
			detail.setCustomColumn1(o.getString("customColumn1"));
		}
		if (!o.isNull("customColumn2")) {
			detail.setCustomColumn2(o.getString("customColumn2"));
		}
		if (!o.isNull("customColumn3")) {
			detail.setCustomColumn3(o.getString("customColumn3"));
		}
		return detail;
	}

	@RequestMapping(value = "/api8", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public Reference[] getAllReferences(@RequestParam("id") String id) {
		try {
			List<Reference> refs = referenceBlo.getAllReferences(id);
			if (!refs.isEmpty()) {
				return refs.toArray(new Reference[refs.size()]);
			} else {
				return new Reference[0];
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 
	 * @param id
	 *            reference ID
	 * @param code
	 *            reference detail's parent code
	 * @return
	 */
	@RequestMapping(value = "/api9", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public ReferenceDetail[] getAllReferenceDetails(@RequestParam("id") String id, @RequestParam("code") String code) {
		try {
			List<ReferenceDetail> refs = referenceBlo.getReferenceDetails(code, id);
			if (!refs.isEmpty()) {
				return refs.toArray(new ReferenceDetail[refs.size()]);
			} else {
				return new ReferenceDetail[0];
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

}
