package com.cloudibpm.blo.runtime.wfprocess;

import com.cloudibpm.blo.runtime.id.NewRuntimeEntityIdAssignerBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.buildtime.release.wfprocess.ReleasedWfProcess;
import com.cloudibpm.core.buildtime.wfprocess.task.Assignment;
import com.cloudibpm.core.data.DataType;
import com.cloudibpm.core.data.FileConstant;
import com.cloudibpm.core.data.expression.Expression;
import com.cloudibpm.core.data.expression.ExpressionParser;
import com.cloudibpm.core.data.variable.ArrayDataVariable;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.runtime.util.json.WfProcessInstanceJSONParser;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.core.runtime.wfprocess.task.SubprocessPointInstance;
import com.cloudibpm.core.util.SystemConfig;
import com.cloudibpm.eso.runtime.wfprocess.ReleasedWfProcessEso;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

/**
 * 
 * @author Cao Dahai updated 2017-02-02
 * @version 1.0
 */
@Transactional
public class ReleasedWfProcessBlo extends BusinessLogicObject {

	private final static ReleasedWfProcessBlo instance = new ReleasedWfProcessBlo();

	private ReleasedWfProcessBlo() {
	}

	public static ReleasedWfProcessBlo getInstance() {
		return instance;
	}

	/**
	 * Return a process in JSON format through specified <code>id</code>.
	 * 
	 * @param pid
	 * @return
	 * @throws Exception
	 */
	// public ReleasedWfProcess getReleasedProcess(String pid) throws Exception
	// {
	// ReleasedWfProcessEso processEso = new ReleasedWfProcessEso();
	// return processEso.queryReleasedProcess(pid);
	// }

	/**
	 * Gets a released business process through specified <code>id</code> for
	 * runtime.
	 * 
	 * @param pid
	 *            released process ID
	 * 
	 * @return WfProcessInstance object
	 * @throws Exception
	 * @date Dahai Cao created on 2017-02-15 for BPM server design
	 */
	public WfProcessInstance getReleasedProcessForRuntime(String pid) throws Exception {
		ReleasedWfProcessEso processESO = new ReleasedWfProcessEso();
		//long s = System.currentTimeMillis();
		ReleasedWfProcess rlprocess = processESO.queryReleasedProcess(pid);
		//System.out.println("Get released process instance>>>>>>>>>>>>>>>:" + (System.currentTimeMillis() - s) + "ms");
		if (rlprocess != null) {
			String process = rlprocess.getProcessContent();
			//long s1 = System.currentTimeMillis();
			WfProcessInstance procinstance = WfProcessInstanceJSONParser.parseWfProcessInstance(process);
			//System.out.println("Parse released process instance>>>>>>>>>>>>>>>:" + (System.currentTimeMillis() - s1) + "ms");
			procinstance.setAccessLevel(rlprocess.getAccessLevel());
			procinstance.setDescription(rlprocess.getDescription());
			procinstance.setKeywords(rlprocess.getKeywords());
			procinstance.setAuthorId(rlprocess.getAuthorId());
			procinstance.setAuthor(rlprocess.getAuthor());
			procinstance.setVersion(rlprocess.getVersion());
			procinstance.setReleaserId(rlprocess.getReleaserId());
			procinstance.setReleaser(rlprocess.getReleaser());
			procinstance.setReleaseDate(rlprocess.getReleaseDate());
			procinstance.setReleaseStatement(rlprocess.getReleaseStatement());
			procinstance.setWfProcessId(rlprocess.getId());
			procinstance.setDeprecated(rlprocess.getDeprecated());
			procinstance.setTrialPeriod(rlprocess.getTrialPeriod());
			procinstance.setLikeCounting(rlprocess.getLikeCounting());
			procinstance.setTotalUseCounting(rlprocess.getTotalUseCounting());
			procinstance.setTotalDownloading(rlprocess.getTotalDownloading());
			procinstance.setSuccessCounting(rlprocess.getSuccessCounting());
			procinstance.setTerminationCounting(rlprocess.getTerminationCounting());
			procinstance.setSuspensionCounting(rlprocess.getSuspensionCounting());
			//long s2 = System.currentTimeMillis();
			ExpressionParser.parseExpressions(procinstance);
			//System.out.println("Parse expressions of released process instance>>>>>>>>>>>>>>>:" + (System.currentTimeMillis() - s2) + "ms");
			// assign new ID and change process ID.
			//long s3 = System.currentTimeMillis();
			NewRuntimeEntityIdAssignerBlo.assignNewEntityId(procinstance);
			//System.out.println("Assign IDs of released process instance>>>>>>>>>>>>>>>:" + (System.currentTimeMillis() - s3) + "ms");
			// AssignOwnerIDUtil.changeCurrOwner(procinstance,
			// procinstance.getId());
			// 首先需要把所有的数据变量中的文件变量中的file附件常量都拷贝到新的流程中。
			//long s4 = System.currentTimeMillis();
			copyFileVariables(rlprocess, procinstance);
			//System.out.println("Copy variables of process instance>>>>>>>>>>>>>>>:" + (System.currentTimeMillis() - s4) + "ms");
			return procinstance;
		}
		return null;
	}
	
	
	/**
	 * Gets a released business process through specified <code>id</code> for
	 * runtime.
	 * 
	 * @param pid
	 *            released process ID
	 * 
	 * @return WfProcessInstance object
	 * @throws Exception
	 * @date Dahai Cao created on 2017-02-15 for BPM server design
	 */
	public WfProcessInstance getReleasedSubProcessForRuntime(String pid, SubprocessPointInstance subprocessPoint) throws Exception {
		ReleasedWfProcessEso processESO = new ReleasedWfProcessEso();
		ReleasedWfProcess rlprocess = processESO.queryReleasedProcess(pid);
		if (rlprocess != null) {
			String process = rlprocess.getProcessContent();
			WfProcessInstance procinstance = WfProcessInstanceJSONParser.parseWfProcessInstance(process);
			procinstance.setAccessLevel(rlprocess.getAccessLevel());
			procinstance.setDescription(rlprocess.getDescription());
			procinstance.setKeywords(rlprocess.getKeywords());
			procinstance.setAuthorId(rlprocess.getAuthorId());
			procinstance.setAuthor(rlprocess.getAuthor());
			procinstance.setVersion(rlprocess.getVersion());
			procinstance.setReleaserId(rlprocess.getReleaserId());
			procinstance.setReleaser(rlprocess.getReleaser());
			procinstance.setReleaseDate(rlprocess.getReleaseDate());
			procinstance.setWfProcessId(rlprocess.getId());
			procinstance.setDeprecated(rlprocess.getDeprecated());
			procinstance.setTrialPeriod(rlprocess.getTrialPeriod());
			procinstance.setLikeCounting(rlprocess.getLikeCounting());
			procinstance.setTotalUseCounting(rlprocess.getTotalUseCounting());
			procinstance.setTotalDownloading(rlprocess.getTotalDownloading());
			procinstance.setSuccessCounting(rlprocess.getSuccessCounting());
			procinstance.setTerminationCounting(rlprocess.getTerminationCounting());
			procinstance.setSuspensionCounting(rlprocess.getSuspensionCounting());
			ExpressionParser.parseExpressions(procinstance);
			for (Assignment child : subprocessPoint.getSubprocessInputs()) {
				String temp = ((Assignment) child).getVariableString();
				temp = temp.substring(0, temp.indexOf("@"));
				DataVariable var = (DataVariable) procinstance.seekChildByID(temp);
				((Assignment) child).setVariable(var);
			}
			for (Assignment child : subprocessPoint.getSubprocessOutputs()) {
				if (((Assignment) child).getValue() != null) {
					((Expression) ((Assignment) child).getValue()).parseExpressionString(procinstance);
				}
			}
			// assign new ID and change process ID.
			NewRuntimeEntityIdAssignerBlo.assignNewEntityId(procinstance);
			// AssignOwnerIDUtil.changeCurrOwner(procinstance,
			// procinstance.getId());
			// 首先需要把所有的数据变量中的文件变量中的file附件常量都拷贝到新的流程中。
			copyFileVariables(rlprocess, procinstance);
			return procinstance;
		}
		return null;
	}
	

	private void copyFileVariables(ReleasedWfProcess rlprocess, WfProcessInstance inst) throws Exception {
		CloseableHttpClient httpClient = HttpClientBuilder.create().build();
		for (TreeNode child : inst.getChildren()) {
			if (child instanceof ArrayDataVariable && ((ArrayDataVariable) child).getDatatype().equals(DataType.FILE)) {
				if (((ArrayDataVariable) child).getValues() != null
						&& ((ArrayDataVariable) child).getValues() instanceof FileConstant[]) {
					FileConstant[] fc = (FileConstant[]) ((ArrayDataVariable) child).getValues();
					if (fc.length > 0) {
						for (int i = 0; i < fc.length; i++) {
							if (fc[i] != null && fc[i].getId() != null && !fc[i].getId().trim().equals("")
									&& !fc[i].getId().trim().toLowerCase().equals("null")) {
								initializeFileObject(httpClient, inst, fc[i], child.getId());
							}
						}
					}
				}
			} else if (child instanceof DataVariable && ((DataVariable) child).getDatatype().equals(DataType.FILE)) {
				if (((DataVariable) child).getValue() instanceof FileConstant) {
					FileConstant fc = (FileConstant) ((DataVariable) child).getValue();
					if (fc != null && fc.getId() != null && !fc.getId().trim().equals("")
							&& !fc.getId().trim().toLowerCase().equals("null")) {
						initializeFileObject(httpClient, inst, fc, child.getId());
					}
				}
			}
		}
		httpClient.close();
		// finished copy, change them currOwner.
		for (TreeNode node : inst.getChildren()) {
			if (node instanceof DataVariable && ((DataVariable) node).getDatatype().equals(DataType.FILE)) {
				if (node instanceof ArrayDataVariable) {
					if (((ArrayDataVariable) node).getValues() != null) {
						for (int j = 0; j < ((FileConstant[]) ((ArrayDataVariable) node).getValues()).length; j++) {
							((FileConstant[]) ((ArrayDataVariable) node).getValues())[j].setCurrOwner(inst.getId());
						}
					}
				} else if (node instanceof DataVariable) {
					if (((DataVariable) node).getValue() != null) {
						((FileConstant) ((DataVariable) node).getValue()).setCurrOwner(inst.getId());
					}
				}
			}
		}
	}

	/**
	 * this method is used to copy files from build time environment to runtime
	 * environment. The codes that are commented off is the download codes and
	 * upload codes. They are original codes. The new codes are on the top of
	 * the original codes.
	 * 
	 * @param inst
	 *            WfProcessInstance
	 * @param fc
	 *            FileConstant
	 * @param vid
	 *            String
	 * @return
	 * @throws Exception
	 */
	private String initializeFileObject(CloseableHttpClient httpClient, WfProcessInstance inst, FileConstant fc,
			String vid) throws Exception {

		String apiserver = SystemConfig.getProp("api.server.domainname");
		// source folder and file
		String src = "/" + fc.getOwner() + "/rlp/" + fc.getCurrOwner() + "/";
		// destination folder
		String des = "/" + inst.getOwner() + "/rt/" + inst.getId() + "/";
		HttpPost httpPost = new HttpPost(apiserver + "/service19/api11");

		List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
		urlParameters.add(new BasicNameValuePair("srcfolder", src));
		urlParameters.add(new BasicNameValuePair("desfolder", des));
		urlParameters.add(new BasicNameValuePair("filename", fc.getId() + "_" + fc.getName()));

		HttpEntity postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
		httpPost.setEntity(postParams);

		CloseableHttpResponse response = httpClient.execute(httpPost);
		HttpEntity entity = response.getEntity();
		String responseJson = EntityUtils.toString(entity, "UTF-8").trim();

		if (!httpPost.isAborted())
			httpPost.abort();
		return responseJson;
	}
}