/**
 * 
 */
package com.cloudibpm.controller;

import com.cloudibpm.blo.experiment.TrainingPersionBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.folder.Folder;
import com.cloudibpm.core.folder.JSTreeNode;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.experiment.TrainingPerson;
import com.cloudibpm.experiment.TrainingPersonPage;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;


/**
 * @author great
 *
 */
@RestController
@RequestMapping("/serviceX")
public class ExperimentController {
	private final TrainingPersionBlo trainingPersionBlo;

	@Autowired
	public ExperimentController(TrainingPersionBlo trainingPersionBlo) {
		this.trainingPersionBlo = trainingPersionBlo;
	}

	@RequestMapping(value = "/api0", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public JSTreeNode[] getProcessFolders(String ids) {
		try {
			Organization[] orgArray = new Organization[1];
			Organization org = new Organization();
			org.setId("00000000000001R");
			org.setName("轩琦科技");
			
			orgArray[0] = org;
			
			Folder item1 = new Folder();
			item1.setId("00000000000001C7");
			item1.setType(109);
			item1.setName("开发实践1：数据录入");
			org.addChild(item1);
			
			Folder item2 = new Folder();
			item2.setId("00000000000001CG");
			item2.setType(109);
			item2.setName("开发实践2：数据展示");
			org.addChild(item2);
			
			Folder item3 = new Folder();
			item3.setId("00000000000001CH");
			item3.setType(109);
			item3.setName("开发实践3：列表列表");
			org.addChild(item3);
			
			Folder item4 = new Folder();
			item4.setId("00000000000001CI");
			item4.setType(109);
			item4.setName("开发实践4：文件上传");
			org.addChild(item4);
			
			return generateJSTreeNodes(orgArray);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	private JSTreeNode[] generateJSTreeNodes(TreeNode[] roots) {
		if (roots.length > 0) {
			JSTreeNode[] jstnodes = new JSTreeNode[roots.length];
			for (int i = 0; i < roots.length; i++) {
				TreeNode node = roots[i];
				JSTreeNode jstnode = new JSTreeNode();
				jstnode.id = node.getId();
				jstnode.text = JSTreeNode.parseUTF8(node.getName());
				jstnode.icon = "";
				if (node instanceof Organization) {
					jstnode.icon = "glyphicon glyphicon-home";
					// add some spare information
					jstnode.data = "1|" + node.getId();
				} else if (node instanceof Folder && ((Folder) node).getType() == 109) {
					jstnode.icon = "glyphicon glyphicon-th-large";
					// add some spare information
					jstnode.data = "2|" + node.getOwner() + "|" + ((Folder) node).getType() + "|"
							+ ((Folder) node).getRank();
				}
				if (node.getParent() != null) {
					jstnode.parentId = node.getParent();
				}
				if (node.hasChildren()) {
					jstnode.children = generateJSTreeNodes(node.getChildren());
				}
				jstnodes[i] = jstnode;
			}
			return jstnodes;
		}
		return null;
	}

	/**
	 * Find all training persons from repository without any condition.
	 * 
	 * @param pageno
	 *            int
	 * @param pagesize
	 *            int
	 * @return TrainingPerson page with an array.
	 */
	@RequestMapping(value = "/api2", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public TrainingPersonPage getAllTrainingPersons(String condition,int pageno, int pagesize) {
													//搜索内容，当前页码，每一页显示的数据条数，
		try {
			return trainingPersionBlo.searchTrainingPersons(condition,pageno,pagesize);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	//保存、添加信息
	@RequestMapping(value = "/api3", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public String saveTrainingPerson(String p) {
		System.out.println(p);//打印传递的个人信息
		try {
			JSONObject obj = new JSONObject(p);
			TrainingPerson tp = new TrainingPerson();
			if (!obj.isNull("firstName")) {
				tp.setFirstName(obj.getString("firstName"));
				System.out.println("姓名controller：" + obj.getString("firstName"));
			}
			if (!obj.isNull("lastName")) {
				tp.setLastName(obj.getString("lastName"));
			}
			if (!obj.isNull("gender")) {
				tp.setGender(obj.getInt("gender"));
			}
			if (!obj.isNull("birthday")) {
				tp.setBirthday(obj.getString("birthday"));
			}
			if (!obj.isNull("address")) {
				tp.setAddress(obj.getString("address"));
			}
			if (!obj.isNull("postcode")) {
				tp.setPostcode(obj.getString("postcode"));
			}
			if (!obj.isNull("degree")) {
				tp.setDegree(obj.getInt("degree"));
			}
			if (!obj.isNull("mobile")) {
				tp.setMobile(obj.getString("mobile"));
			}
			if (!obj.isNull("introduction")) {
				tp.setIntroduction(obj.getString("introduction"));
			}
//			if (!obj.isNull("lastupdate")) {
//				tp.setLastUpdate(obj.getString("lastupdate"));
//				System.out.println("collrtoller最后更新时间");
//				System.out.println(obj.getString("lastupdate"));
//			}
		    Date dNow = new Date( );
		    SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd k:mm:ss ");
			tp.setLastUpdate(ft.format(dNow));
			System.out.println("collrtoller最后更新时间");
			System.out.println(ft.format(dNow));
			trainingPersionBlo.create(tp);
			System.out.println(p);
			return "{\"status\": \"1\"}";//返回data，
		} catch (Exception e) {
			e.printStackTrace();
			return "{\"status\": \"0\"}"; // failed
		}
	 
	}
	
	//更新员工信息
	@RequestMapping(value = "/api4", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public String updateTrainingPerson(String p) {
		System.out.println("更新：" + p);
		try {
			JSONObject obj = new JSONObject(p);
			TrainingPerson tp = new TrainingPerson();
			tp.setId(obj.getString("id"));
			if (!obj.isNull("firstName")) {
				tp.setFirstName(obj.getString("firstName"));
			}
			if (!obj.isNull("lastName")) {
				tp.setLastName(obj.getString("lastName"));
			}
			if (!obj.isNull("gender")) {
				tp.setGender(obj.getInt("gender"));
			}
			if (!obj.isNull("birthday")) {
				tp.setBirthday(obj.getString("birthday"));
			}
			if (!obj.isNull("address")) {
				tp.setAddress(obj.getString("address"));
			}
			if (!obj.isNull("postcode")) {
				tp.setPostcode(obj.getString("postcode"));
			}
			if (!obj.isNull("degree")) {
				tp.setDegree(obj.getInt("degree"));
			}
			if (!obj.isNull("mobile")) {
				tp.setMobile(obj.getString("mobile"));
			}
			if (!obj.isNull("introduction")) {
				tp.setIntroduction(obj.getString("introduction"));
			}
//			if (!obj.isNull("lastupdate")) {
//				tp.setLastUpdate(obj.getString("lastupdate"));
//			}
			
		    Date dNow = new Date( );
		    SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd k:mm:ss ");
			tp.setLastUpdate(ft.format(dNow));
			System.out.println("collrtoller最后更新时间");
			System.out.println(ft.format(dNow));
			
			trainingPersionBlo.updatePerson(tp);
			System.out.println("controller:" + p);
			return "{\"status\": \"1\"}";//success
		} catch (Exception e) {
			e.printStackTrace();
			return "{\"status\": \"0\"}"; // failed
		}
	 
	}
	
	//删除员工
	@RequestMapping(value = "/api5", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public String deleteTrainingPerson(String id) {
		System.out.println("更新的id：" + id);
		try {
			trainingPersionBlo.deletePerson(id);
			System.out.println("controller:" + id);
			return "{\"status\": \"1\"}";//success
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "{\"status\": \"0\"}"; // failed
		}
		
		
	 
	}
	
	//删除员工
	@RequestMapping(value = "/api6", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	public String putInfo(String usr) {
		System.out.println("获取的USR：" + usr);
		try {
			return "{\"status\": \"1\"}";//success
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "{\"status\": \"0\"}"; // failed
		}
		
		
	 
	}
}
