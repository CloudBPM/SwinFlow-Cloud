/**
 * @user Dahai CAO
 * @date 2011-8-11 下午12:17:28
 */
package com.cloudibpm.core.data.variable;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.data.expression.Expression;

public class ParameterUtil {

	/**
	 * Parse a parameter string into a java parameter array object.
	 * <p>
	 * The format of the string is: <br>
	 * "name:type:ruleString;name:type:ruleString;name:type:ruleString;".<br>
	 * For example:<br>
	 * aaa:int:C@10@Integer;aaa:double:C@10.22@Double;
	 * 
	 * @date Dahai Cao created at 2011-8-11 下午12:20:25, last update at 11:42 on
	 *       2018-08-03
	 * @updated 2017-02-05
	 * @param strParameters
	 * @param owner
	 * @return
	 * @throws Exception
	 */
	public static Parameter[] parseParameters(String strParameters) throws Exception {
		if (strParameters != null && !strParameters.equals("")) {
			String[] st = strParameters.split(";");
			Parameter[] parameters = new Parameter[st.length];
			for (int i = 0; i < st.length; i++) {
				if (st[i] != null && !st[i].equals("")) {
					String[] strParameter = st[i].split(":");
					Parameter parameter = new Parameter();
					parameter.setName(strParameter[0]);
					parameter.setDatatype(strParameter[1]);
					if (strParameter[2] != null && !strParameter[2].equals("")) {
						Expression r = new Expression();
						r.setExpressionString(strParameter[2]);
						parameter.setValue(r);
					}
					parameter.setComments(strParameter[3]);
					parameters[i] = parameter;
				}
			}
			// cold codes.... before 2017-02-05
			// StringTokenizer st = new StringTokenizer(strParameters, ";");
			// Parameter[] parameters = new Parameter[st.countTokens()];
			// int i = 0;
			// while (st.hasMoreTokens()) {
			// String token = st.nextToken();
			// String[] strParameter = token.split(":");
			// Parameter parameter = new Parameter();
			// if (strParameter.length > 0) // name (parameter1, 2, ..., etc.)
			// parameter.setName(strParameter[0]);
			// if (strParameter.length > 1) // type (int, float, etc.)
			// parameter.setDataType(strParameter[1]);
			// if (strParameter.length > 2) // value (constant, forminput)
			// parameter.setValue(new Rule(strParameter[2]));
			// parameters[i] = parameter;
			// i++;
			// }
			return parameters;
		}
		return null;
	}

	/**
	 * Generate parameter string through the specified parameter array object.
	 * <p>
	 * The format of the string is: <br>
	 * "name:type:ruleString;name:type:ruleString;name:type:ruleString;".<br>
	 * For example:<br>
	 * "aaa:int:C@10@Integer;aaa:double:C@10.22@Double";
	 * 
	 * @date Dahai Cao created at 2011-8-11 下午12:34:48, last update at 11:42 on
	 *       2018-08-03
	 * @param parameters
	 * @return
	 */
	public static String toParameterString(TreeNode[] parameters) {
		if (parameters != null) {
			String strPara = null;
			for (TreeNode parameter : parameters)
				if (strPara == null) {
					strPara = ((Parameter) parameter).toParameterString();
				} else {
					strPara = strPara + ((Parameter) parameter).toParameterString();
				}
			return strPara;
		}
		return null;
	}

//	public static String toParameterString(TreeNode parameter) {
//		if (parameter != null) {
//			return ((Parameter) parameter).toParameterString();
//		}
//		return null;
//	}

	public static String toReturnParameterString(TreeNode parameter) {
		if (parameter != null && parameter instanceof DataVariable) {
			DataVariable dv = ((DataVariable) parameter);
			return "V@" + dv.getId() + "@" + dv.getClass().getSimpleName();
		}
		return null;
	}
}
