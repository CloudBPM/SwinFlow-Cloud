/**
 * 
 */
package com.cloudibpm.core.data.expression;

import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
import com.cloudibpm.core.buildtime.wfprocess.task.AbstractTask;
import com.cloudibpm.core.data.BooleanConstant;
import com.cloudibpm.core.data.Constant;
import com.cloudibpm.core.data.DateTimeConstant;
import com.cloudibpm.core.data.DoubleConstant;
import com.cloudibpm.core.data.FileConstant;
import com.cloudibpm.core.data.HandwritingConstant;
import com.cloudibpm.core.data.IntegerConstant;
import com.cloudibpm.core.data.JSONConstant;
import com.cloudibpm.core.data.NullValue;
import com.cloudibpm.core.data.Operator;
import com.cloudibpm.core.data.StringConstant;
import com.cloudibpm.core.data.TimDurationConstant;
import com.cloudibpm.core.data.UnknownValue;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.data.variable.ExprFunction;
import com.cloudibpm.core.data.variable.Parameter;

/**
 * Expression class represents the computation formulas for navigation
 * conditions and evaluation in Cloud iBPM. That is, the expressions include
 * CONDITIONAL expressions and EVALUATION expressions. The former is used on
 * transition to navigate the process execution, it is a boolean expression, the
 * boolean result can be got from it, while the latter is used to evaluate a
 * data variable or a parameter, its computation results can be put into a data
 * variable or a parameter. Originally, this class name is called Rule and now
 * it has been changed to Expression. To be honest, 'Rule' and 'Expression' are
 * same in Cloud iBPM but the latter sounds like more accurate, so I changed to
 * 'Expression'.
 * 
 * @author Dahai Cao created on 2012-02-10 last updated on 2017-11-28
 * @date 2017-10-17
 */
public class Expression extends WorkflowEntity {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 2093170772095181440L;
	private List<WorkflowEntity> expression = new ArrayList<WorkflowEntity>();
	private String exception = ""; // 异常信息 exception information
	private String expressionString = ""; // the string for storage

	/**
	 * Constructor.
	 */
	public Expression() {
	}

	/**
	 * This constructor must be used to create constant value rule expression.
	 * 
	 * @param constant
	 */
	public Expression(WorkflowEntity constant) {
		if (constant != null)
			expression.add(constant);
	}

	public Expression(WorkflowEntity[] monomials) {
		append(monomials);
	}

	/**
	 * Construct rule using an <code>expression</code> string. This method will
	 * store the <code>expression</code> into the property
	 * <code>expressionString</code> and wait for parsing in future.
	 * 
	 * @param expression
	 * @throws Exception
	 */
	public Expression(String expression) throws Exception {
		setExpressionString(expression);
	}

	/**
	 * Clones rule.
	 */
	public Object clone(WfProcess owner) {
		try {
			Expression rule = (Expression) super.clone();
			WorkflowEntity[] factors = rule.fetchExpression();
			rule.clearExpresion();
			for (int i = 0; i < factors.length; i++) {
				if (factors[i] instanceof Constant) {
					rule.insert((WorkflowEntity) ((Constant) factors[i]).clone(owner));
				} else if (factors[i] instanceof NullValue || factors[i] instanceof Operator) {
					rule.insert((WorkflowEntity) factors[i].clone());
				} else {
					// if it is a data variable, it will be inserted directly
					rule.insert(factors[i]);
				}
			}
			return rule;
		} catch (CloneNotSupportedException e) {
			e.printStackTrace();
		}
		return null;
	}

	public void append(WorkflowEntity[] monomials) {
		for (WorkflowEntity factor : monomials)
			if (factor != null)
				expression.add(factor);
	}

	/**
	 * Insert a factor or expression into expression tail of current rule.
	 * 
	 * @param factor
	 */
	public void insert(WorkflowEntity factor) {
		if (factor != null)
			expression.add(factor);
	}

	/**
	 * Insert a factor or expression into special positon in expression of
	 * current rule.
	 * 
	 * @param index
	 *            special position
	 * @param factor
	 *            inserted factor
	 */
	public void insert(int index, WorkflowEntity factor) {
		if (factor != null)
			expression.add(index, factor);
	}

	public WorkflowEntity fetchItem(int index) {
		return expression.get(index);
	}

	/**
	 * <code>idcontext</code> can be a data variable name (), function name,
	 * also can be a constant value
	 * 
	 * @param idcontext
	 * @return
	 */
	public WorkflowEntity fetchItembyName(String idcontext) {
		for (WorkflowEntity e : expression) {
			if (e instanceof BooleanConstant || e instanceof DoubleConstant || e instanceof IntegerConstant
					|| e instanceof StringConstant || e instanceof HandwritingConstant || e instanceof JSONConstant) {
				if (((Constant) e).equals(idcontext)) {
					return e;
				}
			} else if (e instanceof DateTimeConstant) {
				if (((DateTimeConstant) e).equals(idcontext)) {
					return e;
				}
			} else if (e instanceof TimDurationConstant) {
				if (((TimDurationConstant) e).equals(idcontext)) {
					return e;
				}
			} else if (e instanceof FileConstant) {
				if (((FileConstant) e).equals(idcontext)) {
					return e;
				}
			} else if (e instanceof NullValue) {
				if (idcontext.toLowerCase().equals("null") || idcontext.toLowerCase().equals("空值")
						|| idcontext.toLowerCase().equals("空")) {
					return e;
				}
			} else if (e instanceof Operator) {
				if (((Operator) e).getSymbol().equals(idcontext)) {
					return e;
				}
			} else { // data variable (keep all variable name unique)
				if (e.getName().equals(idcontext)) {
					return e;
				}
			}

		}
		return null;
	}

	public int count() {
		return expression.size();
	}

	public boolean isNullRule() {
		if (count() == 0)
			return true;
		else if (count() == 1)
			return expression.get(0) instanceof NullValue;
		return false;
	}

	public boolean isConstant() {
		if (count() == 1) {
			return expression.get(0) instanceof Constant;
		} else
			return false;
	}

	public Object getConstantValue() {
		if (isConstant()) {
			Constant c = (Constant) expression.get(0);
			return c.getValue();
		}
		return null;
	}

	public WorkflowEntity evaluteConstant() {
		if (isConstant())
			return expression.get(0);
		return new NullValue();
	}

	/**
	 * Verify current expression.
	 * 
	 * @return
	 */
	public boolean verify() {
		return true;
	}

	/**
	 * Return expression list that consists of workflow entity factor.
	 * 
	 * @return List<WorkflowEntity>
	 */
	public WorkflowEntity[] fetchExpression() {
		return expression.toArray(new WorkflowEntity[expression.size()]);
	}

	/**
	 * Remove all factors from expression, i.e., clear expression in rule.
	 */
	public void clearExpresion() {
		expression.clear();
	}

	/**
	 * Parses a string into a expression which consists of workflow entity
	 * factors through the given content string. The format must be as below,
	 * monomial_string#operator_string#monomial_string#.
	 * <p>
	 * The string format is: <br>
	 * <li>Variable: <br>
	 * variable V@id@variable data type. e.g., V@00000024U0@WfDataSet,
	 * V@00000024WG@WfTextInput, etc.
	 * <li>Null value: <br>
	 * N@null@null.
	 * <li>Unknown variable: <br>
	 * U@variable name@unknown, e.g., U@abc@unknown, here, abc is variable name.
	 * On the other hand, the default variable name is 'null' string. That is,
	 * default string of NULL value is U@unknown@unknown.
	 * <li>Constant: <br>
	 * C@constant value@constant value data type, e.g., C@abc@java.lang.String,
	 * C@102@java.lang.Integer, C@10.3@java.lang.Float,
	 * C@10.33@java.lang.Double, etc.
	 * <p>
	 * 
	 * @param expr
	 *            Expression String
	 * @return
	 * @throws Exception
	 */
	public void parseExpressionString(TreeNode owner) throws Exception {
		if (expressionString == null || expressionString.equals(""))
			return;
		expression.clear();
		StringTokenizer st = new StringTokenizer(expressionString, "#");// $NON-NLS-1$
		while (st.hasMoreTokens()) {
			String token = st.nextToken();
			if (isOperator(token)) {
				expression.add(new Operator(token));
			} else if (token.indexOf("@") > 0) {// $NON-NLS-1$
				String[] mstr = token.split("@");// $NON-NLS-1$
				if (mstr[0].equals("V")) { // V: Variable
					expression.add(owner.seekByID(mstr[1]));
				} else if (mstr[0].equals("P")) {// P: Returned data
					// P means that it is a return value from system task.
					// That is, this monomial's format is A.Return,
					// A is a system task and the P is the
					// result of the system invocation.
					// The Return is stored in an parameter object.
					Parameter p = new Parameter();
					p.setName("Return");
					p.setDatatype(mstr[1]);
					expression.add(p);
				} else if (mstr[0].equals("N")) {// N: null
					expression.add(new NullValue());
				} else if (mstr[0].equals("U")) {// U: unknown value
					expression.add(new UnknownValue());
				} else if (mstr[0].equals("F")) {// F: expression function
					expression.add(new ExprFunction(mstr[1]));
				} else if (mstr[0].equals("C")) {// C: constant
					if (mstr[1].equals("Integer") || mstr[1].equals("int")) {
						IntegerConstant ic = new IntegerConstant();
						ic.parseString(token);
						expression.add(ic);
					} else if (mstr[1].toLowerCase().equals("double") || mstr[1].toLowerCase().equals("float")) {
						DoubleConstant dc = new DoubleConstant();
						dc.parseString(token);
						expression.add(dc);
					} else if (mstr[1].equals("Boolean")) {
						BooleanConstant bc = new BooleanConstant();
						bc.parseString(token);
						expression.add(bc);
					} else if (mstr[1].equals("String")) {
						StringConstant sc = new StringConstant();
						sc.parseString(token);
						expression.add(sc);
					} else if (mstr[1].equals("DateTime") || mstr[1].equals("Date") || mstr[1].equals("Time")) {
						DateTimeConstant dtc = new DateTimeConstant();
						dtc.parseString(token);
						expression.add(dtc);
					} else if (mstr[1].equals("TimeDuration")) {
						TimDurationConstant tdc = new TimDurationConstant();
						tdc.parseString(token);
						expression.add(tdc);
					} else if (mstr[1].equals("Currency")) {
						DoubleConstant dc = new DoubleConstant();
						dc.setDatatype(mstr[1]);
						dc.parseString(token);
						expression.add(dc);
					} else if (mstr[1].equals("JSONData")) {
						JSONConstant jsc = new JSONConstant();
						jsc.parseString(token);
						expression.add(jsc);
					} else if (mstr[1].equals("File")) {
						FileConstant fc = new FileConstant();
						fc.parseString(token);
						expression.add(fc);
					} else if (mstr[1].equals("Handwriting")) {
						HandwritingConstant hc = new HandwritingConstant();
						hc.parseString(token);
						expression.add(hc);
					}
				}
			}
		}
	}

	private boolean isOperator(String token) {
		if (token.equals("+") || token.equals("-") || token.equals("*") || token.equals("/") || token.equals("%")
				|| token.equals(">") || token.equals(">=") || token.equals("<=") || token.equals("<")
				|| token.equals("==") || token.equals("<>") || token.equals("!") || token.equals("!=")
				|| token.equals("&&") || token.equals("||") || token.equals("(") || token.equals(")")
				|| token.equals(".") || token.equals("[") || token.equals("]") || token.equals(",")) {
			return true;
		}
		return false;
	}

	/**
	 * Generate rule expression string. This string is used to store the
	 * expression in current rule into repository. The string format consists of
	 * strings of monomial and operator with sharp delimiters, i.e.,
	 * monomial_string#operator_string#monomial_string#.
	 * <p>
	 * The string format is: <br>
	 * <li>Variable: <br>
	 * variable V@id@variable data type. e.g., V@00000024U0@WfDataSet,
	 * V@00000024WG@WfTextInput, etc.
	 * <li>Null value: <br>
	 * N@null@null.
	 * <li>Unknown variable: <br>
	 * U@variable name@unknown, e.g., U@abc@unknown, here, abc is variable name.
	 * On the other hand, the default variable name is 'null' string. That is,
	 * default string of NULL value is U@unknown@unknown.
	 * <li>Constant: <br>
	 * C@constant value@constant value data type, e.g., C@abc@java.lang.String,
	 * C@102@java.lang.Integer, C@10.3@java.lang.Float,
	 * C@10.33@java.lang.Double, etc.
	 * <p>
	 * Note: This string is used to store rule data into repository.
	 * 
	 * @return expression string
	 */
	public String toExpressionString() {
		String content = ""; // $NON-NLS-1$
		for (WorkflowEntity e : this.expression) {
			if (e == null) {
				String factor = new NullValue().toExpressionString(); // $NON-NLS-1$
				if (content.equals("")) {
					content = factor;
				} else {
					content = content + "#" + factor;// $NON-NLS-1$
				}
			} else {
				if (e instanceof Operator) {
					if (content.equals("")) { // $NON-NLS-1$
						content = ((Operator) e).toExpressionString();
					} else {
						content = content + "#" + ((Operator) e).toExpressionString();// $NON-NLS-1$
					}
				} else if (e instanceof Constant) {
					if (content.equals("")) { // $NON-NLS-1$
						content = ((Constant) e).toExpressionString();
					} else {
						content = content + "#" + ((Constant) e).toExpressionString();// $NON-NLS-1$
					}
				} else if (e instanceof NullValue) {
					if (content.equals("")) { // $NON-NLS-1$
						content = new NullValue().toExpressionString();
					} else {
						content = content + "#" + new NullValue().toExpressionString();// $NON-NLS-1$
					}
				} else if (e instanceof ExprFunction) {
					if (content.equals("")) { // $NON-NLS-1$
						content = ((ExprFunction) e).toExpressionString();
					} else {
						content = content + "#" + ((ExprFunction) e).toExpressionString();// $NON-NLS-1$
					}
				} else if (e instanceof UnknownValue) {
					if (content.equals("")) { // $NON-NLS-1$
						content = ((UnknownValue) e).toExpressionString();
					} else {
						content = content + "#" + ((UnknownValue) e).toExpressionString();// $NON-NLS-1$
					}
				} else if (e instanceof DataVariable || e instanceof AbstractTask) {
					if (e instanceof Parameter) {
						if (content.equals("")) { // $NON-NLS-1$
							content = "P@" + ((Parameter) e).getDatatype() + "@" + e.getClass().getSimpleName(); // $NON-NLS-1$
						} else {
							content = content + "#P@" + ((Parameter) e).getDatatype() + "@"
									+ e.getClass().getSimpleName();// $NON-NLS-1$
						}
					} else {
						if (content.equals("")) { // $NON-NLS-1$
							content = "V@" + e.getId() + "@" + e.getClass().getSimpleName(); // $NON-NLS-1$$NON-NLS-2$
						} else {
							content = content + "#V@" + e.getId() + "@" + e.getClass().getSimpleName();// $NON-NLS-1$$NON-NLS-2$
						}
					}
				}
			}
		}
		expressionString = content;
		return expressionString;
	}

	/**
	 * 
	 * @author Dahai CAO
	 * @date 2011-9-29 下午07:25:21
	 * @return
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		String displayValue = "";
		for (Object factor : expression) {
			if (factor != null)
				displayValue += factor.toString();
		}
		return displayValue;
	}

	/**
	 * @author Dahai CAO
	 * @date 2011-10-2 下午10:40:23
	 * @return
	 */
	public String getExceptionString() {
		return exception;
	}

	/**
	 * @author Dahai CAO
	 * @date 2011-10-2 下午10:40:23
	 * @param strException
	 */
	public void setExceptionString(String strException) {
		this.exception = strException;
	}

	/**
	 * 
	 * @return
	 */
	public String getExpressionString() {
		return expressionString;
	}

	/**
	 * 
	 * @param expressionString
	 */
	public void setExpressionString(String expressionString) {
		this.expressionString = expressionString;
	}

}