/**
 * 
 */
package com.cloudibpm.core.antlr.conditional;

import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.tree.ParseTree;

import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
import com.cloudibpm.core.data.NullValue;
import com.cloudibpm.core.data.expression.Expression;

/**
 * @author Dahai Cao created on 20171218
 *
 */
public class CondExprCalculatorUtil {

	/**
	 * Get CommonTokenStream from source code
	 */
	public static WorkflowEntity computeValue(Expression rule, WfProcess parent) {
		try {
			if (rule == null)
				return new NullValue();
			if (rule.isConstant()) {
				return rule.evaluteConstant();
			} else if (rule.isNullRule()) {
				return new NullValue();
			}
			CharStream stream = CharStreams.fromString(rule.toString());
			ConditionalExpressionLexer l = new ConditionalExpressionLexer(stream);
			CommonTokenStream tokens = new CommonTokenStream(l);
			ConditionalExpressionParser parser = new ConditionalExpressionParser(tokens);
			rule.setExceptionString(null);
			ParseTree tree = parser.prog(); // parse
			ConditionalExpressionVisitor<WorkflowEntity> eval = new CondExprUtil(rule, parent);
			WorkflowEntity result = eval.visit(tree);
			return result;
		} catch (Exception e) {
			rule.setExceptionString(e.getMessage());
			return null;
		}
	}

}
