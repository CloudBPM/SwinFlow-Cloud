/**
 * 
 */
package com.cloudibpm.core.antlr.evaluation;

import java.util.List;

import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.tree.TerminalNode;

import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.antlr.evaluation.EvaluationExpressionParser.ExpressionContext;
import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
import com.cloudibpm.core.data.BooleanConstant;
import com.cloudibpm.core.data.Constant;
import com.cloudibpm.core.data.DateTimeConstant;
import com.cloudibpm.core.data.DoubleConstant;
import com.cloudibpm.core.data.FileConstant;
import com.cloudibpm.core.data.HandwritingConstant;
import com.cloudibpm.core.data.IntegerConstant;
import com.cloudibpm.core.data.JSONConstant;
import com.cloudibpm.core.data.NullValue;
import com.cloudibpm.core.data.StringConstant;
import com.cloudibpm.core.data.TimDurationConstant;
import com.cloudibpm.core.data.expression.Expression;
import com.cloudibpm.core.data.variable.ArrayDataVariable;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.data.variable.ExprFunction;

/**
 * @author Dahai cao created on 20171130
 *
 */
public class EvalExprUtil extends EvaluationExpressionBaseVisitor<WorkflowEntity> {

	// private WfProcess parent = null;
	private Expression currExpr = null;

	public EvalExprUtil(Expression rule, WfProcess parent) {
		this.currExpr = rule;
		// this.parent = parent;
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public WorkflowEntity visitProg(EvaluationExpressionParser.ProgContext ctx) {
		return visitChildren(ctx);
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public WorkflowEntity visitStmt(EvaluationExpressionParser.StmtContext ctx) {
		return visitChildren(ctx);
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public WorkflowEntity visitStr(EvaluationExpressionParser.StrContext ctx) {
		return this.currExpr.fetchItembyName(ctx.getText());
		// return visitChildren(ctx);
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public WorkflowEntity visitNil(EvaluationExpressionParser.NilContext ctx) {
		return this.currExpr.fetchItembyName(ctx.getText());
		// return visitChildren(ctx);
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public WorkflowEntity visitArray(EvaluationExpressionParser.ArrayContext ctx) {
		TerminalNode le = ctx.IDENTIFIER();
		WorkflowEntity left = this.currExpr.fetchItembyName(le.getText());
		// get value of right subexpression
		ExpressionContext re = ctx.expression();
		WorkflowEntity right = (WorkflowEntity) visit(re);
		Token start = ctx.getStart();
		Token stop = ctx.getStop();
		boolean checked1 = false;
		boolean checked2 = false;
		boolean checked3 = false;
		// String returntype = "";
		String err = null;
		if (left instanceof ArrayDataVariable) {
			checked1 = true;
			// returntype = ((ArrayDataVariable) left).getDatatype();
		} else {
			checked1 = false;
			err = "MSG75: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
					+ start.getText() + "' has something wrong";
		}
		if (right instanceof IntegerConstant) {
			checked2 = true;
			// returntype = ((ArrayDataVariable) left).getDatatype();
		} else {
			checked2 = false;
			err = "MSG76: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '" + stop.getText()
					+ "' has something wrong";
		}
		Object values = ((ArrayDataVariable) left).getValues();
		if (values != null && ((Constant[]) values).length > 0) {
			int v = Integer.parseInt(((IntegerConstant) right).getValue());
			if (v < 0 || v >= ((Constant[]) values).length) {
				checked3 = false;
				err = "MSG77: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			} else {
				checked3 = true;
			}
		} else {
			checked3 = false;
			err = "MSG77: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
					+ start.getText() + "' has something wrong";
		}

		if (!checked1 || !checked2 || !checked3) {
			throw new RuntimeException(err);
		} else {
			Constant[] values1 = (Constant[]) values;
			int v = Integer.parseInt(((IntegerConstant) right).getValue());
			return values1[v];
		}
		// return visitChildren(ctx);
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public WorkflowEntity visitPositiveNegative(EvaluationExpressionParser.PositiveNegativeContext ctx) {
		// return this.currExpr.fetchItembyName(ctx.getText());
		// return visitChildren(ctx);
		// get value of left subexpression
		ExpressionContext re = ctx.expression();
		WorkflowEntity right = (WorkflowEntity) visit(re);
		// get value of right subexpression
		Token stop = ctx.getStop();
		boolean checked = false;
		String returntype = "";
		String err = null;
		if (ctx.op.getType() == EvaluationExpressionParser.PLUS || ctx.op.getType() == EvaluationExpressionParser.SUB) { // +/-
			if (right instanceof IntegerConstant) {
				checked = true;
				returntype = "Integer";
			} else if (right instanceof DoubleConstant) {
				checked = true;
				returntype = "Double";
				if (((DoubleConstant) right).getDatatype().equals("Currency")) {
					returntype = "Currency";
				}
			} else if (right instanceof NullValue) {
				checked = true;
				returntype = "Null";
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG72.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						checked = true;
						returntype = "Integer";
					} else if (((DataVariable) right).getDatatype().equals("Double")) {
						checked = true;
						returntype = "Double";
					} else if (((DataVariable) right).getDatatype().equals("Currency")) {
						checked = true;
						returntype = "Currency";
					} else {
						err = "MSG73: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG74: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		}

		if (!checked) {
			throw new RuntimeException(err);
		}

		if (ctx.op.getType() == EvaluationExpressionParser.PLUS) { // +
			if (right instanceof IntegerConstant) {
				int b = Integer.parseInt(((IntegerConstant) right).getValue());
				IntegerConstant c = new IntegerConstant();
				c.setValue(String.valueOf(b));
				return c;
			} else if (right instanceof DoubleConstant) {
				returntype = "Double";
				if (((DoubleConstant) right).getDatatype().equals("Currency")) {
					returntype = "Currency";
				}
				double b = Double.parseDouble(((DoubleConstant) right).getValue());
				DoubleConstant c = new DoubleConstant();
				c.setDatatype(returntype);
				c.setValue(String.valueOf(b));
				return c;
			} else if (right instanceof NullValue) {
				return right;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Integer")) {
					IntegerConstant c = (IntegerConstant) ((DataVariable) right).getValue();
					int b = Integer.parseInt(c.getValue());
					IntegerConstant cc = new IntegerConstant();
					cc.setValue(String.valueOf(b));
					return cc;
				} else if (((DataVariable) right).getDatatype().equals("Double")) {
					DoubleConstant c = (DoubleConstant) ((DataVariable) right).getValue();
					double b = Double.parseDouble(c.getValue());
					DoubleConstant cc = new DoubleConstant();
					cc.setValue(String.valueOf(b));
					return cc;
				} else if (((DataVariable) right).getDatatype().equals("Currency")) {
					DoubleConstant c = (DoubleConstant) ((DataVariable) right).getValue();
					double b = Double.parseDouble(c.getValue());
					DoubleConstant cc = new DoubleConstant();
					cc.setDatatype("Currency");
					cc.setValue(String.valueOf(b));
					return cc;
				}
			}
		} else if (ctx.op.getType() == EvaluationExpressionParser.SUB) { // -
			if (right instanceof IntegerConstant) {
				int b = Integer.parseInt(((IntegerConstant) right).getValue());
				IntegerConstant c = new IntegerConstant();
				c.setValue(String.valueOf(-b));
				return c;
			} else if (right instanceof DoubleConstant) {
				returntype = "Double";
				if (((DoubleConstant) right).getDatatype().equals("Currency")) {
					returntype = "Currency";
				}
				double b = Double.parseDouble(((DoubleConstant) right).getValue());
				DoubleConstant c = new DoubleConstant();
				c.setDatatype(returntype);
				c.setValue(String.valueOf(-b));
				return c;
			} else if (right instanceof NullValue) {
				return right;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Integer")) {
					IntegerConstant c = (IntegerConstant) ((DataVariable) right).getValue();
					int b = Integer.parseInt(c.getValue());
					IntegerConstant cc = new IntegerConstant();
					cc.setValue(String.valueOf(-b));
					return cc;
				} else if (((DataVariable) right).getDatatype().equals("Double")) {
					DoubleConstant c = (DoubleConstant) ((DataVariable) right).getValue();
					double b = Double.parseDouble(c.getValue());
					DoubleConstant cc = new DoubleConstant();
					cc.setValue(String.valueOf(-b));
					return cc;
				} else if (((DataVariable) right).getDatatype().equals("Currency")) {
					DoubleConstant c = (DoubleConstant) ((DataVariable) right).getValue();
					double b = Double.parseDouble(c.getValue());
					DoubleConstant cc = new DoubleConstant();
					cc.setDatatype("Currency");
					cc.setValue(String.valueOf(-b));
					return cc;
				}
			}
		}
		return visitChildren(ctx);
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public WorkflowEntity visitFunction(EvaluationExpressionParser.FunctionContext ctx) {
		TerminalNode le = ctx.IDENTIFIER();
		WorkflowEntity left = this.currExpr.fetchItembyName(le.getText());
		if (left instanceof ExprFunction) {
			ExprFunction f = (ExprFunction) left;
			List<ExpressionContext> listCtx = ctx.expression();
			if (!listCtx.isEmpty()) {
				WorkflowEntity[] paras = new WorkflowEntity[listCtx.size()];
				for (int i = 0; i < listCtx.size(); i++) {
					paras[i] = visit(listCtx.get(i));
				}
				f.setParameters(paras);
			}
			f.calculate();
			return (WorkflowEntity) f.getReturned();
		}
		return visitChildren(ctx);
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public WorkflowEntity visitMulDivMod(EvaluationExpressionParser.MulDivModContext ctx) {
		// get value of left subexpression
		ExpressionContext le = ctx.expression(0);
		WorkflowEntity left = (WorkflowEntity) visit(le);
		// get value of right subexpression
		ExpressionContext re = ctx.expression(1);
		WorkflowEntity right = (WorkflowEntity) visit(re);
		Token start = ctx.getStart();
		Token stop = ctx.getStop();
		boolean checked = false;
		String returntype = "";
		String err = null;

		// checking...
		if (ctx.op.getType() == EvaluationExpressionParser.MUL) { // *
			if (left instanceof IntegerConstant) {
				if (right instanceof IntegerConstant) {
					checked = true;
					returntype = "Integer";
				} else if (right instanceof DoubleConstant) {
					checked = true;
					returntype = "Double";
					if (((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
				} else if (right instanceof DataVariable) {
					if (right instanceof ArrayDataVariable) {
						err = "MSG32.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
							returntype = "Integer";
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
							returntype = "Double";
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
							returntype = "Currency";
						} else {
							err = "MSG33: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				} else {
					err = "MSG34: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (left instanceof DoubleConstant) {
				if (right instanceof IntegerConstant) {
					checked = true;
					returntype = "Double";
				} else if (right instanceof DoubleConstant) {
					checked = true;
					returntype = "Double";
					if (((DoubleConstant) left).getDatatype().equals("Currency")
							|| ((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
				} else if (right instanceof DataVariable) {
					if (right instanceof ArrayDataVariable) {
						err = "MSG34.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
							returntype = "Double";
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
							returntype = "Double";
							if (((DoubleConstant) left).getDatatype().equals("Currency")) {
								returntype = "Currency";
							}
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
							returntype = "Currency";
						} else {
							err = "MSG35: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				} else {
					err = "MSG36: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (left instanceof DataVariable) {
				if (left instanceof ArrayDataVariable) {
					err = "MSG36.1: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
							+ start.getText() + "' has something wrong";
				} else {
					if (((DataVariable) left).getDatatype().equals("Integer")) {
						if (right instanceof IntegerConstant) {
							checked = true;
							returntype = "Integer";
						} else if (right instanceof DoubleConstant) {
							checked = true;
							returntype = "Double";
							if (((DoubleConstant) right).getDatatype().equals("Currency")) {
								returntype = "Currency";
							}
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG36.2: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
									returntype = "Integer";
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
									returntype = "Double";
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
									returntype = "Currency";
								} else {
									err = "MSG37: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG38: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					} else if (((DataVariable) left).getDatatype().equals("Double")) {
						if (right instanceof IntegerConstant) {
							checked = true;
							returntype = "Double";
						} else if (right instanceof DoubleConstant) {
							checked = true;
							returntype = "Double";
							if (((DoubleConstant) right).getDatatype().equals("Currency")) {
								returntype = "Currency";
							}
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG38.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
									returntype = "Double";
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
									returntype = "Double";
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
									returntype = "Currency";
								} else {
									err = "MSG39: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG40: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else if (((DataVariable) left).getDatatype().equals("Currency")) {
						if (right instanceof IntegerConstant) {
							checked = true;
							returntype = "Currency";
						} else if (right instanceof DoubleConstant) {
							checked = true;
							returntype = "Currency";
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG40.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
									returntype = "Currency";
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
									returntype = "Currency";
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
									returntype = "Currency";
								} else {
									err = "MSG41: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG42: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else {
						err = "MSG43: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
								+ start.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG44: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
						+ start.getText() + "' has something wrong";
			}
		} else if (ctx.op.getType() == EvaluationExpressionParser.DIV) { // /
			if (left instanceof IntegerConstant) {
				if (right instanceof IntegerConstant) {
					checked = true;
					returntype = "Integer";
				} else if (right instanceof DoubleConstant) {
					checked = true;
					returntype = "Double";
					if (((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
				} else if (right instanceof DataVariable) {
					if (right instanceof ArrayDataVariable) {
						err = "MSG44.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
							returntype = "Integer";
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
							returntype = "Double";
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
							returntype = "Currency";
						} else {
							err = "MSG45: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				} else {
					err = "MSG46: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (left instanceof DoubleConstant) {
				if (right instanceof IntegerConstant) {
					checked = true;
					returntype = "Double";
				} else if (right instanceof DoubleConstant) {
					checked = true;
					returntype = "Double";
					if (((DoubleConstant) left).getDatatype().equals("Currency")
							|| ((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
				} else if (right instanceof DataVariable) {
					if (right instanceof ArrayDataVariable) {
						err = "MSG46.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
							returntype = "Double";
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
							returntype = "Double";
							if (((DoubleConstant) left).getDatatype().equals("Currency")) {
								returntype = "Currency";
							}
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
							returntype = "Currency";
						} else {
							err = "MSG47: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				} else {
					err = "MSG48: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (left instanceof DataVariable) {
				if (((DataVariable) left).getDatatype().equals("Integer")) {
					if (right instanceof IntegerConstant) {
						checked = true;
						returntype = "Integer";
					} else if (right instanceof DoubleConstant) {
						checked = true;
						returntype = "Double";
						if (((DoubleConstant) right).getDatatype().equals("Currency")) {
							returntype = "Currency";
						}
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG48.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("Integer")) {
								checked = true;
								returntype = "Integer";
							} else if (((DataVariable) right).getDatatype().equals("Double")) {
								checked = true;
								returntype = "Double";
							} else if (((DataVariable) right).getDatatype().equals("Currency")) {
								checked = true;
								returntype = "Currency";
							} else {
								err = "MSG49: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG50: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				} else if (((DataVariable) left).getDatatype().equals("Double")) {
					if (right instanceof IntegerConstant) {
						checked = true;
						returntype = "Double";
					} else if (right instanceof DoubleConstant) {
						checked = true;
						returntype = "Double";
						if (((DoubleConstant) right).getDatatype().equals("Currency")) {
							returntype = "Currency";
						}
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG50.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("Integer")) {
								checked = true;
								returntype = "Double";
							} else if (((DataVariable) right).getDatatype().equals("Double")) {
								checked = true;
								returntype = "Double";
							} else if (((DataVariable) right).getDatatype().equals("Currency")) {
								checked = true;
								returntype = "Currency";
							} else {
								err = "MSG51: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG52: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				} else if (((DataVariable) left).getDatatype().equals("Currency")) {
					if (right instanceof IntegerConstant) {
						checked = true;
						returntype = "Currency";
					} else if (right instanceof DoubleConstant) {
						checked = true;
						returntype = "Currency";
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG52.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("Integer")) {
								checked = true;
								returntype = "Currency";
							} else if (((DataVariable) right).getDatatype().equals("Double")) {
								checked = true;
								returntype = "Currency";
							} else if (((DataVariable) right).getDatatype().equals("Currency")) {
								checked = true;
								returntype = "Currency";
							} else {
								err = "MSG53: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG54: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				} else {
					err = "MSG55: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
							+ start.getText() + "' has something wrong";
				}
			} else {
				err = "MSG56: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
						+ start.getText() + "' has something wrong";
			}
		} else if (ctx.op.getType() == EvaluationExpressionParser.MOD) { // %
			if (left instanceof IntegerConstant) {
				if (right instanceof IntegerConstant) {
					checked = true;
					returntype = "Integer";
				} else if (right instanceof DoubleConstant) {
					checked = true;
					returntype = "Double";
					if (((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
				} else if (right instanceof DataVariable) {
					if (right instanceof ArrayDataVariable) {
						err = "MSG56.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
							returntype = "Integer";
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
							returntype = "Double";
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
							returntype = "Currency";
						} else {
							err = "MSG57: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				} else {
					err = "MSG58: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (left instanceof DoubleConstant) {
				if (right instanceof IntegerConstant) {
					checked = true;
					returntype = "Double";
				} else if (right instanceof DoubleConstant) {
					checked = true;
					returntype = "Double";
					if (((DoubleConstant) left).getDatatype().equals("Currency")
							|| ((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
				} else if (right instanceof DataVariable) {
					if (right instanceof ArrayDataVariable) {
						err = "MSG58.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
							returntype = "Double";
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
							returntype = "Double";
							if (((DoubleConstant) left).getDatatype().equals("Currency")) {
								returntype = "Currency";
							}
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
							returntype = "Currency";
						} else {
							err = "MSG59: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				} else {
					err = "MSG60: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (left instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG60.1: line " + start.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ start.getText() + "' has something wrong";
				} else {
					if (((DataVariable) left).getDatatype().equals("Integer")) {
						if (right instanceof IntegerConstant) {
							checked = true;
							returntype = "Integer";
						} else if (right instanceof DoubleConstant) {
							checked = true;
							returntype = "Double";
							if (((DoubleConstant) right).getDatatype().equals("Currency")) {
								returntype = "Currency";
							}
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG60.2: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
									returntype = "Integer";
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
									returntype = "Double";
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
									returntype = "Currency";
								} else {
									err = "MSG61: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG62: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					} else if (((DataVariable) left).getDatatype().equals("Double")) {
						if (right instanceof IntegerConstant) {
							checked = true;
							returntype = "Double";
						} else if (right instanceof DoubleConstant) {
							checked = true;
							returntype = "Double";
							if (((DoubleConstant) right).getDatatype().equals("Currency")) {
								returntype = "Currency";
							}
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG62.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
									returntype = "Double";
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
									returntype = "Double";
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
									returntype = "Currency";
								} else {
									err = "MSG63: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG64: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else if (((DataVariable) left).getDatatype().equals("Currency")) {
						if (right instanceof IntegerConstant) {
							checked = true;
							returntype = "Currency";
						} else if (right instanceof DoubleConstant) {
							checked = true;
							returntype = "Currency";
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG64.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
									returntype = "Currency";
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
									returntype = "Currency";
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
									returntype = "Currency";
								} else {
									err = "MSG65: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG66: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else {
						err = "MSG67: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
								+ start.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG68: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
						+ start.getText() + "' has something wrong";
			}
		}

		if (!checked) {
			throw new RuntimeException(err);
		}

		// calculating ...
		if (ctx.op.getType() == EvaluationExpressionParser.MUL) { // *
			if (left instanceof IntegerConstant) {
				int a = 0;
				if (((IntegerConstant) left).getValue() != null) {
					a = Integer.parseInt(((IntegerConstant) left).getValue());
				}
				if (right instanceof IntegerConstant) {
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					IntegerConstant c = new IntegerConstant();
					c.setValue(String.valueOf(a * b));
					return c;
				} else if (right instanceof DoubleConstant) {
					returntype = "Double";
					if (((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					DoubleConstant c = new DoubleConstant();
					c.setDatatype(returntype);
					c.setValue(String.valueOf(a * b));
					return c;
				} else if (right instanceof DataVariable) {
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						IntegerConstant bb = (IntegerConstant) ((DataVariable) right).getValue();
						int b = Integer.parseInt(bb.getValue());
						IntegerConstant r = new IntegerConstant();
						r.setValue(String.valueOf(a * b));
						return r;
					} else if (((DataVariable) right).getDatatype().equals("Double")) {
						DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(bb.getValue());
						DoubleConstant r = new DoubleConstant();
						r.setValue(String.valueOf(a * b));
						return r;
					} else if (((DataVariable) right).getDatatype().equals("Currency")) {
						DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(bb.getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype("Currency");
						r.setValue(String.valueOf(a * b));
						return r;
					}
				}
			} else if (left instanceof DoubleConstant) {
				double a = 0;
				if (((DoubleConstant) left).getValue() != null) {
					a = Double.parseDouble(((DoubleConstant) left).getValue());
				}
				if (right instanceof IntegerConstant) {
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					DoubleConstant r = new DoubleConstant();
					r.setValue(String.valueOf(a * b));
					return r;
				} else if (right instanceof DoubleConstant) {
					returntype = "Double";
					if (((DoubleConstant) left).getDatatype().equals("Currency")
							|| ((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					DoubleConstant r = new DoubleConstant();
					r.setDatatype(returntype);
					r.setValue(String.valueOf(a * b));
					return r;
				} else if (right instanceof DataVariable) {
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						IntegerConstant bb = (IntegerConstant) ((DataVariable) right).getValue();
						int b = Integer.parseInt(bb.getValue());
						DoubleConstant r = new DoubleConstant();
						r.setValue(String.valueOf(a * b));
						return r;
					} else if (((DataVariable) right).getDatatype().equals("Double")) {
						returntype = "Double";
						if (((DoubleConstant) left).getDatatype().equals("Currency")) {
							returntype = "Currency";
						}
						DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(bb.getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype(returntype);
						r.setValue(String.valueOf(a * b));
						return r;
					} else if (((DataVariable) right).getDatatype().equals("Currency")) {
						DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(bb.getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype("Currency");
						r.setValue(String.valueOf(a * b));
						return r;
					}
				}
			} else if (left instanceof DataVariable) {
				if (((DataVariable) left).getDatatype().equals("Integer")) {
					int a = 0;
					if (((DataVariable) left).getValue() != null) {
						IntegerConstant c = (IntegerConstant) ((DataVariable) left).getValue();
						a = Integer.parseInt(c.getValue());
					}
					if (right instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) right).getValue());
						IntegerConstant r = new IntegerConstant();
						r.setValue(String.valueOf(a * b));
						return r;
					} else if (right instanceof DoubleConstant) {
						returntype = "Double";
						if (((DoubleConstant) right).getDatatype().equals("Currency")) {
							returntype = "Currency";
						}
						double b = Double.parseDouble(((DoubleConstant) right).getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype(returntype);
						r.setValue(String.valueOf(a * b));
						return r;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							IntegerConstant bb = (IntegerConstant) ((DataVariable) right).getValue();
							int b = Integer.parseInt(bb.getValue());
							IntegerConstant r = new IntegerConstant();
							r.setValue(String.valueOf(a * b));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
							double b = Double.parseDouble(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setValue(String.valueOf(a * b));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
							double b = Double.parseDouble(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(a * b));
							return r;
						}
					}
				} else if (((DataVariable) left).getDatatype().equals("Double")) {
					double a = 0;
					if (((DataVariable) left).getValue() != null) {
						DoubleConstant c = (DoubleConstant) ((DataVariable) left).getValue();
						a = Double.parseDouble(c.getValue());
					}
					if (right instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) right).getValue());
						DoubleConstant r = new DoubleConstant();
						r.setValue(String.valueOf(a * b));
						return r;
					} else if (right instanceof DoubleConstant) {
						returntype = "Double";
						if (((DoubleConstant) right).getDatatype().equals("Currency")) {
							returntype = "Currency";
						}
						double b = Double.parseDouble(((DoubleConstant) right).getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype(returntype);
						r.setValue(String.valueOf(a * b));
						return r;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							returntype = "Double";
							IntegerConstant bb = (IntegerConstant) ((DataVariable) right).getValue();
							int b = Integer.parseInt(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setValue(String.valueOf(a * b));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
							double b = Double.parseDouble(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setValue(String.valueOf(a * b));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
							double b = Double.parseDouble(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(a * b));
							return r;
						}
					}
				} else if (((DataVariable) left).getDatatype().equals("Currency")) {
					double a = 0;
					if (((DataVariable) left).getValue() != null) {
						DoubleConstant c = (DoubleConstant) ((DataVariable) left).getValue();
						a = Double.parseDouble(c.getValue());
					}
					if (right instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) right).getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype("Currency");
						r.setValue(String.valueOf(a * b));
						return r;
					} else if (right instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) right).getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype("Currency");
						r.setValue(String.valueOf(a * b));
						return r;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							IntegerConstant bb = (IntegerConstant) ((DataVariable) right).getValue();
							int b = Integer.parseInt(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(a * b));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Double")
								|| ((DataVariable) right).getDatatype().equals("Currency")) {
							DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
							double b = Double.parseDouble(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(a * b));
							return r;
						}
					}
				}
			}
		} else if (ctx.op.getType() == EvaluationExpressionParser.DIV) { // /
			if (left instanceof IntegerConstant) {
				int a = 0;
				if (((IntegerConstant) left).getValue() != null) {
					a = Integer.parseInt(((IntegerConstant) left).getValue());
				}
				if (right instanceof IntegerConstant) {
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					IntegerConstant c = new IntegerConstant();
					c.setValue(String.valueOf(a / b));
					return c;
				} else if (right instanceof DoubleConstant) {
					returntype = "Double";
					if (((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					DoubleConstant c = new DoubleConstant();
					c.setDatatype(returntype);
					c.setValue(String.valueOf(a / b));
					return c;
				} else if (right instanceof DataVariable) {
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						IntegerConstant bb = (IntegerConstant) ((DataVariable) right).getValue();
						int b = Integer.parseInt(bb.getValue());
						IntegerConstant r = new IntegerConstant();
						r.setValue(String.valueOf(a / b));
						return r;
					} else if (((DataVariable) right).getDatatype().equals("Double")) {
						DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(bb.getValue());
						DoubleConstant r = new DoubleConstant();
						r.setValue(String.valueOf(a / b));
						return r;
					} else if (((DataVariable) right).getDatatype().equals("Currency")) {
						DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(bb.getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype("Currency");
						r.setValue(String.valueOf(a / b));
						return r;
					}
				}
			} else if (left instanceof DoubleConstant) {
				double a = 0;
				if (((DoubleConstant) left).getValue() != null) {
					a = Double.parseDouble(((DoubleConstant) left).getValue());
				}
				if (right instanceof IntegerConstant) {
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					DoubleConstant r = new DoubleConstant();
					r.setValue(String.valueOf(a / b));
					return r;
				} else if (right instanceof DoubleConstant) {
					returntype = "Double";
					if (((DoubleConstant) left).getDatatype().equals("Currency")
							|| ((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					DoubleConstant r = new DoubleConstant();
					r.setDatatype(returntype);
					r.setValue(String.valueOf(a / b));
					return r;
				} else if (right instanceof DataVariable) {
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						IntegerConstant bb = (IntegerConstant) ((DataVariable) right).getValue();
						int b = Integer.parseInt(bb.getValue());
						DoubleConstant r = new DoubleConstant();
						r.setValue(String.valueOf(a / b));
						return r;
					} else if (((DataVariable) right).getDatatype().equals("Double")) {
						returntype = "Double";
						if (((DoubleConstant) left).getDatatype().equals("Currency")) {
							returntype = "Currency";
						}
						DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(bb.getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype(returntype);
						r.setValue(String.valueOf(a / b));
						return r;
					} else if (((DataVariable) right).getDatatype().equals("Currency")) {
						DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(bb.getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype("Currency");
						r.setValue(String.valueOf(a / b));
						return r;
					}
				}
			} else if (left instanceof DataVariable) {
				if (((DataVariable) left).getDatatype().equals("Integer")) {
					int a = 0;
					if (((DataVariable) left).getValue() != null) {
						IntegerConstant c = (IntegerConstant) ((DataVariable) left).getValue();
						a = Integer.parseInt(c.getValue());
					}
					if (right instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) right).getValue());
						IntegerConstant r = new IntegerConstant();
						r.setValue(String.valueOf(a / b));
						return r;
					} else if (right instanceof DoubleConstant) {
						returntype = "Double";
						if (((DoubleConstant) right).getDatatype().equals("Currency")) {
							returntype = "Currency";
						}
						double b = Double.parseDouble(((DoubleConstant) right).getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype(returntype);
						r.setValue(String.valueOf(a / b));
						return r;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							IntegerConstant bb = (IntegerConstant) ((DataVariable) right).getValue();
							int b = Integer.parseInt(bb.getValue());
							IntegerConstant r = new IntegerConstant();
							r.setValue(String.valueOf(a / b));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
							double b = Double.parseDouble(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setValue(String.valueOf(a / b));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
							double b = Double.parseDouble(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(a / b));
							return r;
						}
					}
				} else if (((DataVariable) left).getDatatype().equals("Double")) {
					double a = 0;
					if (((DataVariable) left).getValue() != null) {
						DoubleConstant c = (DoubleConstant) ((DataVariable) left).getValue();
						a = Double.parseDouble(c.getValue());
					}
					if (right instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) right).getValue());
						DoubleConstant r = new DoubleConstant();
						r.setValue(String.valueOf(a / b));
						return r;
					} else if (right instanceof DoubleConstant) {
						returntype = "Double";
						if (((DoubleConstant) right).getDatatype().equals("Currency")) {
							returntype = "Currency";
						}
						double b = Double.parseDouble(((DoubleConstant) right).getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype(returntype);
						r.setValue(String.valueOf(a / b));
						return r;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							returntype = "Double";
							IntegerConstant bb = (IntegerConstant) ((DataVariable) right).getValue();
							int b = Integer.parseInt(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setValue(String.valueOf(a / b));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
							double b = Double.parseDouble(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setValue(String.valueOf(a / b));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
							double b = Double.parseDouble(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(a / b));
							return r;
						}
					}
				} else if (((DataVariable) left).getDatatype().equals("Currency")) {
					double a = 0;
					if (((DataVariable) left).getValue() != null) {
						DoubleConstant c = (DoubleConstant) ((DataVariable) left).getValue();
						a = Double.parseDouble(c.getValue());
					}
					if (right instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) right).getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype("Currency");
						r.setValue(String.valueOf(a / b));
						return r;
					} else if (right instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) right).getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype("Currency");
						r.setValue(String.valueOf(a / b));
						return r;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							IntegerConstant bb = (IntegerConstant) ((DataVariable) right).getValue();
							int b = Integer.parseInt(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(a / b));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Double")
								|| ((DataVariable) right).getDatatype().equals("Currency")) {
							DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
							double b = Double.parseDouble(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(a / b));
							return r;
						}
					}
				}
			}
		} else if (ctx.op.getType() == EvaluationExpressionParser.MOD) { // %
			if (left instanceof IntegerConstant) {
				int a = 0;
				if (((IntegerConstant) left).getValue() != null) {
					a = Integer.parseInt(((IntegerConstant) left).getValue());
				}
				if (right instanceof IntegerConstant) {
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					IntegerConstant c = new IntegerConstant();
					c.setValue(String.valueOf(a % b));
					return c;
				} else if (right instanceof DoubleConstant) {
					returntype = "Double";
					if (((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					DoubleConstant c = new DoubleConstant();
					c.setDatatype(returntype);
					c.setValue(String.valueOf(a % b));
					return c;
				} else if (right instanceof DataVariable) {
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						IntegerConstant bb = (IntegerConstant) ((DataVariable) right).getValue();
						int b = Integer.parseInt(bb.getValue());
						IntegerConstant r = new IntegerConstant();
						r.setValue(String.valueOf(a % b));
						return r;
					} else if (((DataVariable) right).getDatatype().equals("Double")) {
						DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(bb.getValue());
						DoubleConstant r = new DoubleConstant();
						r.setValue(String.valueOf(a % b));
						return r;
					} else if (((DataVariable) right).getDatatype().equals("Currency")) {
						DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(bb.getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype("Currency");
						r.setValue(String.valueOf(a % b));
						return r;
					}
				}
			} else if (left instanceof DoubleConstant) {
				double a = 0;
				if (((DoubleConstant) left).getValue() != null) {
					a = Double.parseDouble(((DoubleConstant) left).getValue());
				}
				if (right instanceof IntegerConstant) {
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					DoubleConstant r = new DoubleConstant();
					r.setValue(String.valueOf(a % b));
					return r;
				} else if (right instanceof DoubleConstant) {
					returntype = "Double";
					if (((DoubleConstant) left).getDatatype().equals("Currency")
							|| ((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					DoubleConstant r = new DoubleConstant();
					r.setDatatype(returntype);
					r.setValue(String.valueOf(a % b));
					return r;
				} else if (right instanceof DataVariable) {
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						IntegerConstant bb = (IntegerConstant) ((DataVariable) right).getValue();
						int b = Integer.parseInt(bb.getValue());
						DoubleConstant r = new DoubleConstant();
						r.setValue(String.valueOf(a % b));
						return r;
					} else if (((DataVariable) right).getDatatype().equals("Double")) {
						returntype = "Double";
						if (((DoubleConstant) left).getDatatype().equals("Currency")) {
							returntype = "Currency";
						}
						DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(bb.getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype(returntype);
						r.setValue(String.valueOf(a % b));
						return r;
					} else if (((DataVariable) right).getDatatype().equals("Currency")) {
						DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(bb.getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype("Currency");
						r.setValue(String.valueOf(a % b));
						return r;
					}
				}
			} else if (left instanceof DataVariable) {
				if (((DataVariable) left).getDatatype().equals("Integer")) {
					int a = 0;
					if (((DataVariable) left).getValue() != null) {
						IntegerConstant c = (IntegerConstant) ((DataVariable) left).getValue();
						a = Integer.parseInt(c.getValue());
					}
					if (right instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) right).getValue());
						IntegerConstant r = new IntegerConstant();
						r.setValue(String.valueOf(a % b));
						return r;
					} else if (right instanceof DoubleConstant) {
						returntype = "Double";
						if (((DoubleConstant) right).getDatatype().equals("Currency")) {
							returntype = "Currency";
						}
						double b = Double.parseDouble(((DoubleConstant) right).getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype(returntype);
						r.setValue(String.valueOf(a % b));
						return r;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							IntegerConstant bb = (IntegerConstant) ((DataVariable) right).getValue();
							int b = Integer.parseInt(bb.getValue());
							IntegerConstant r = new IntegerConstant();
							r.setValue(String.valueOf(a % b));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
							double b = Double.parseDouble(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setValue(String.valueOf(a % b));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
							double b = Double.parseDouble(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(a % b));
							return r;
						}
					}
				} else if (((DataVariable) left).getDatatype().equals("Double")) {
					double a = 0;
					if (((DataVariable) left).getValue() != null) {
						DoubleConstant c = (DoubleConstant) ((DataVariable) left).getValue();
						a = Double.parseDouble(c.getValue());
					}
					if (right instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) right).getValue());
						DoubleConstant r = new DoubleConstant();
						r.setValue(String.valueOf(a % b));
						return r;
					} else if (right instanceof DoubleConstant) {
						returntype = "Double";
						if (((DoubleConstant) right).getDatatype().equals("Currency")) {
							returntype = "Currency";
						}
						double b = Double.parseDouble(((DoubleConstant) right).getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype(returntype);
						r.setValue(String.valueOf(a % b));
						return r;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							returntype = "Double";
							IntegerConstant bb = (IntegerConstant) ((DataVariable) right).getValue();
							int b = Integer.parseInt(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setValue(String.valueOf(a % b));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
							double b = Double.parseDouble(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setValue(String.valueOf(a % b));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
							double b = Double.parseDouble(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(a % b));
							return r;
						}
					}
				} else if (((DataVariable) left).getDatatype().equals("Currency")) {
					double a = 0;
					if (((DataVariable) left).getValue() != null) {
						DoubleConstant c = (DoubleConstant) ((DataVariable) left).getValue();
						a = Double.parseDouble(c.getValue());
					}
					if (right instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) right).getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype("Currency");
						r.setValue(String.valueOf(a % b));
						return r;
					} else if (right instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) right).getValue());
						DoubleConstant r = new DoubleConstant();
						r.setDatatype("Currency");
						r.setValue(String.valueOf(a % b));
						return r;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							IntegerConstant bb = (IntegerConstant) ((DataVariable) right).getValue();
							int b = Integer.parseInt(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(a % b));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Double")
								|| ((DataVariable) right).getDatatype().equals("Currency")) {
							DoubleConstant bb = (DoubleConstant) ((DataVariable) right).getValue();
							double b = Double.parseDouble(bb.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(a % b));
							return r;
						}
					}
				}
			}
		}
		// *, /, %
		return visitChildren(ctx);
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public WorkflowEntity visitBool(EvaluationExpressionParser.BoolContext ctx) {
		return this.currExpr.fetchItembyName(ctx.getText());
		// return visitChildren(ctx);
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public WorkflowEntity visitAddSub(EvaluationExpressionParser.AddSubContext ctx) {
		// get value of left subexpression
		ExpressionContext le = ctx.expression(0);
		WorkflowEntity left = (WorkflowEntity) visit(le);
		// get value of right subexpression
		ExpressionContext re = ctx.expression(1);
		WorkflowEntity right = (WorkflowEntity) visit(re);
		Token start = ctx.getStart();
		Token stop = ctx.getStop();
		boolean checked = false;
		String returntype = "";
		String err = null;
		// checking...
		if (ctx.op.getType() == EvaluationExpressionParser.PLUS) { // +
			if (left instanceof NullValue) {
				if (right instanceof IntegerConstant) {
					checked = true;
					returntype = "Integer";
				} else if (right instanceof DoubleConstant) {
					checked = true;
					returntype = "Double";
					if (((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
				} else if (right instanceof NullValue) {
					checked = true;
					returntype = "Null";
				} else if (right instanceof DataVariable) {
					if (right instanceof ArrayDataVariable) {
						err = "MSG0.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
							returntype = "Integer";
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
							returntype = "Double";
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
							returntype = "Currency";
						} else {
							err = "MSG0.2: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				} else {
					err = "MSG0.3: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (left instanceof IntegerConstant) {
				if (right instanceof IntegerConstant) {
					checked = true;
					returntype = "Integer";
				} else if (right instanceof DoubleConstant) {
					checked = true;
					returntype = "Double";
					if (((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
				} else if (right instanceof StringConstant) {
					checked = true;
					returntype = "String";
				} else if (right instanceof NullValue) {
					checked = true;
					returntype = "Integer";
				} else if (right instanceof DataVariable) {
					if (right instanceof ArrayDataVariable) {
						err = "MSG0.4: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
							returntype = "Integer";
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
							returntype = "Double";
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
							returntype = "Currency";
						} else if (((DataVariable) right).getDatatype().equals("String")) {
							checked = true;
							returntype = "String";
						} else {
							err = "MSG1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				} else {
					err = "MSG2: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (left instanceof DoubleConstant) {
				if (right instanceof IntegerConstant) {
					checked = true;
					returntype = "Double";
					if (((DoubleConstant) left).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
				} else if (right instanceof DoubleConstant) {
					checked = true;
					returntype = "Double";
					if (((DoubleConstant) left).getDatatype().equals("Currency")
							|| ((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
				} else if (right instanceof StringConstant) {
					checked = true;
					returntype = "String";
				} else if (right instanceof NullValue) {
					checked = true;
					returntype = "Double";
				} else if (right instanceof DataVariable) {
					if (right instanceof ArrayDataVariable) {
						err = "MSG2.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
							returntype = "Double";
							if (((DoubleConstant) left).getDatatype().equals("Currency")) {
								returntype = "Currency";
							}
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
							returntype = "Double";
							if (((DoubleConstant) left).getDatatype().equals("Currency")) {
								returntype = "Currency";
							}
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
							returntype = "Currency";
						} else if (((DataVariable) right).getDatatype().equals("String")) {
							checked = true;
							returntype = "String";
						} else {
							err = "MSG3: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				} else {
					err = "MSG4: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (left instanceof StringConstant) {
				if (right instanceof IntegerConstant) {
					checked = true;
					returntype = "String";
				} else if (right instanceof DoubleConstant) {
					checked = true;
					returntype = "String";
				} else if (right instanceof StringConstant) {
					checked = true;
					returntype = "String";
				} else if (right instanceof NullValue) {
					checked = true;
					returntype = "String";
				} else if (right instanceof DataVariable) {
					if (right instanceof ArrayDataVariable) {
						err = "MSG4.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
							returntype = "String";
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
							returntype = "String";
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
							returntype = "String";
						} else if (((DataVariable) right).getDatatype().equals("String")) {
							checked = true;
							returntype = "String";
						} else {
							err = "MSG5: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					}
				} else {
					err = "MSG6: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (left instanceof BooleanConstant || left instanceof DateTimeConstant
					|| left instanceof FileConstant || left instanceof FileConstant
					|| left instanceof HandwritingConstant || left instanceof JSONConstant) {
				err = "MSG7: line " + start.getLine() + ":" + start.getCharPositionInLine() + " constant '"
						+ start.getText() + "' has something wrong";
			} else if (left instanceof TimDurationConstant) {
				if (right instanceof TimDurationConstant) {
					checked = true;
				} else {
					err = "MSG8: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (left instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG8.1: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
							+ start.getText() + "' has something wrong";
				} else {
					if (((DataVariable) left).getDatatype().equals("Integer")) {
						if (right instanceof IntegerConstant) {
							checked = true;
							returntype = "Integer";
						} else if (right instanceof DoubleConstant) {
							checked = true;
							returntype = "Double";
							if (((DoubleConstant) right).getDatatype().equals("Currency")) {
								returntype = "Currency";
							}
						} else if (right instanceof StringConstant) {
							checked = true;
							returntype = "String";
						} else if (right instanceof NullValue) {
							checked = true;
							returntype = "Integer";
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG8.2: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
									returntype = "Integer";
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
									returntype = "Double";
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
									returntype = "Currency";
								} else if (((DataVariable) right).getDatatype().equals("String")) {
									checked = true;
									returntype = "String";
								} else {
									err = "MSG9: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG10: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else if (((DataVariable) left).getDatatype().equals("Double")) {
						if (right instanceof IntegerConstant) {
							checked = true;
							returntype = "Double";
							if (((DataVariable) left).getDatatype().equals("Currency")) {
								returntype = "Currency";
							}
						} else if (right instanceof DoubleConstant) {
							checked = true;
							returntype = "Double";
							if (((DataVariable) left).getDatatype().equals("Currency")
									|| ((DoubleConstant) right).getDatatype().equals("Currency")) {
								returntype = "Currency";
							}
						} else if (right instanceof StringConstant) {
							checked = true;
							returntype = "String";
						} else if (right instanceof NullValue) {
							checked = true;
							returntype = "Double";
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG10.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
									returntype = "Double";
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
									returntype = "Double";
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
									returntype = "Currency";
								} else if (((DataVariable) right).getDatatype().equals("String")) {
									checked = true;
									returntype = "String";
								} else {
									err = "MSG11: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG12: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else if (((DataVariable) left).getDatatype().equals("Currency")) {
						if (right instanceof IntegerConstant) {
							checked = true;
							returntype = "Currency";
						} else if (right instanceof DoubleConstant) {
							checked = true;
							returntype = "Currency";
						} else if (right instanceof StringConstant) {
							checked = true;
							returntype = "String";
						} else if (right instanceof NullValue) {
							checked = true;
							returntype = "Currency";
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG12.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
									returntype = "Currency";
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
									returntype = "Currency";
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
									returntype = "Currency";
								} else if (((DataVariable) right).getDatatype().equals("String")) {
									checked = true;
									returntype = "String";
								} else {
									err = "MSG13: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG14: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else if (((DataVariable) left).getDatatype().equals("String")) {
						if (right instanceof IntegerConstant) {
							checked = true;
							returntype = "String";
						} else if (right instanceof DoubleConstant) {
							checked = true;
							returntype = "String";
						} else if (right instanceof StringConstant) {
							checked = true;
							returntype = "String";
						} else if (right instanceof NullValue) {
							checked = true;
							returntype = "String";
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG14.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
									returntype = "String";
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
									returntype = "String";
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
									returntype = "String";
								} else if (((DataVariable) right).getDatatype().equals("String")) {
									checked = true;
									returntype = "String";
								} else {
									err = "MSG15: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG16: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else {
						err = "MSG17: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
								+ start.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG18: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
						+ start.getText() + "' has something wrong";
			}
		} else if (ctx.op.getType() == EvaluationExpressionParser.SUB) { // -
			if (left instanceof NullValue) {
				if (right instanceof IntegerConstant) {
					checked = true;
					returntype = "Integer";
				} else if (right instanceof DoubleConstant) {
					checked = true;
					returntype = "Double";
					if (((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
				} else if (right instanceof NullValue) {
					checked = true;
					returntype = "Null";
				} else if (right instanceof DataVariable) {
					if (right instanceof ArrayDataVariable) {
						err = "MSG18.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
							returntype = "Integer";
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
							returntype = "Double";
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
							returntype = "Currency";
						} else {
							err = "MSG18.2: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				} else {
					err = "MSG18.3: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
							+ " constant/variable '" + stop.getText() + "' has something wrong";
				}
			} else if (left instanceof IntegerConstant) {
				if (right instanceof IntegerConstant) {
					checked = true;
					returntype = "Integer";
				} else if (right instanceof DoubleConstant) {
					checked = true;
					returntype = "Double";
					if (((DoubleConstant) left).getDatatype().equals("Currency")
							|| ((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
				} else if (right instanceof NullValue) {
					checked = true;
					returntype = "Integer";
				} else if (right instanceof DataVariable) {
					if (right instanceof ArrayDataVariable) {
						err = "MSG18.4: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
							returntype = "Integer";
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
							returntype = "Double";
							if (((DoubleConstant) left).getDatatype().equals("Currency")) {
								returntype = "Currency";
							}
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
							returntype = "Currency";
						} else {
							err = "MSG19: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					}
				} else {
					err = "MSG20: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (left instanceof DoubleConstant) {
				if (right instanceof IntegerConstant) {
					checked = true;
					returntype = "Double";
					if (((DoubleConstant) left).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
				} else if (right instanceof DoubleConstant) {
					checked = true;
					returntype = "Double";
					if (((DoubleConstant) left).getDatatype().equals("Currency")
							|| ((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
				} else if (right instanceof NullValue) {
					checked = true;
					returntype = "Double";
				} else if (right instanceof DataVariable) {
					if (right instanceof ArrayDataVariable) {
						err = "MSG20.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
							returntype = "Double";
							if (((DoubleConstant) left).getDatatype().equals("Currency")) {
								returntype = "Currency";
							}
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
							returntype = "Double";
							if (((DoubleConstant) left).getDatatype().equals("Currency")) {
								returntype = "Currency";
							}
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
							returntype = "Currency";
						} else {
							err = "MSG21: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				} else {
					err = "MSG22: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (left instanceof BooleanConstant || left instanceof DateTimeConstant
					|| left instanceof FileConstant || left instanceof HandwritingConstant
					|| left instanceof JSONConstant) {
				err = "MSG23:line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
						+ start.getText() + "' has something wrong";
			} else if (left instanceof TimDurationConstant) {
				if (right instanceof TimDurationConstant) {
					checked = true;
					returntype = "TimeDuration";
				} else {
					err = "MSG24: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (left instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG24.1: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
							+ start.getText() + "' has something wrong";
				} else {
					if (((DataVariable) left).getDatatype().equals("Integer")) {
						if (right instanceof IntegerConstant) {
							checked = true;
							returntype = "Integer";
						} else if (right instanceof DoubleConstant) {
							checked = true;
							returntype = "Double";
							if (((DoubleConstant) right).getDatatype().equals("Currency")) {
								returntype = "Currency";
							}
						} else if (right instanceof NullValue) {
							checked = true;
							returntype = "Integer";
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG24.2: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
									returntype = "Integer";
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
									returntype = "Double";
									if (((DataVariable) right).getDatatype().equals("Currency")) {
										returntype = "Currency";
									}
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
									returntype = "Currency";
								} else if (((DataVariable) right).getDatatype().equals("String")) {
									checked = true;
									returntype = "String";
								} else {
									err = "MSG25: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG26: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else if (((DataVariable) left).getDatatype().equals("Double")) {
						if (right instanceof IntegerConstant) {
							checked = true;
							returntype = "Double";
						} else if (right instanceof DoubleConstant) {
							checked = true;
							returntype = "Double";
							if (((DoubleConstant) right).getDatatype().equals("Currency")) {
								returntype = "Currency";
							}
						} else if (right instanceof NullValue) {
							checked = true;
							returntype = "Double";
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG26.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
									returntype = "Double";
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
									returntype = "Double";
									if (((DataVariable) right).getDatatype().equals("Currency")) {
										returntype = "Currency";
									}
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
									returntype = "Currency";
								} else if (((DataVariable) right).getDatatype().equals("String")) {
									checked = true;
									returntype = "String";
								} else {
									err = "MSG27: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG28: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else if (((DataVariable) left).getDatatype().equals("Currency")) {
						if (right instanceof IntegerConstant) {
							checked = true;
							returntype = "Currency";
						} else if (right instanceof DoubleConstant) {
							checked = true;
							returntype = "Currency";
						} else if (right instanceof NullValue) {
							checked = true;
							returntype = "Currency";
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG28.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
									returntype = "Currency";
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
									returntype = "Currency";
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
									returntype = "Currency";
								} else {
									err = "MSG29: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG30: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else {
						err = "MSG31: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG32: line " + start.getLine() + ":" + start.getCharPositionInLine() + " consta/variable '"
						+ start.getText() + "' has something wrong";
			}
		}

		if (!checked) {
			throw new RuntimeException(err);
		}

		// calculating ...
		if (ctx.op.getType() == EvaluationExpressionParser.PLUS) { // +
			if (left instanceof NullValue) {
				if (right instanceof IntegerConstant) {
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					IntegerConstant c = new IntegerConstant();
					c.setValue(String.valueOf(b));
					return c;
				} else if (right instanceof DoubleConstant) {
					returntype = "Double";
					if (((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					DoubleConstant c = new DoubleConstant();
					c.setDatatype(returntype);
					c.setValue(String.valueOf(b));
					return c;
				} else if (right instanceof NullValue) {
					return left;
				} else if (right instanceof DataVariable) {
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						IntegerConstant c = (IntegerConstant) ((DataVariable) right).getValue();
						int b = Integer.parseInt(c.getValue());
						IntegerConstant cc = new IntegerConstant();
						cc.setValue(String.valueOf(b));
						return cc;
					} else if (((DataVariable) right).getDatatype().equals("Double")) {
						DoubleConstant c = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(c.getValue());
						DoubleConstant cc = new DoubleConstant();
						cc.setValue(String.valueOf(b));
						return cc;
					} else if (((DataVariable) right).getDatatype().equals("Currency")) {
						DoubleConstant c = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(c.getValue());
						DoubleConstant cc = new DoubleConstant();
						cc.setDatatype(((DataVariable) right).getDatatype());
						cc.setValue(String.valueOf(b));
						return cc;
					}
				}
			} else if (left instanceof IntegerConstant) {
				if (right instanceof IntegerConstant) {
					int a = Integer.parseInt(((IntegerConstant) left).getValue());
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					IntegerConstant c = new IntegerConstant();
					c.setValue(String.valueOf(a + b));
					return c;
				} else if (right instanceof DoubleConstant) {
					returntype = "Double";
					if (((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
					int a = Integer.parseInt(((IntegerConstant) left).getValue());
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					DoubleConstant c = new DoubleConstant();
					c.setDatatype(returntype);
					c.setValue(String.valueOf(a + b));
					return c;
				} else if (right instanceof StringConstant) {
					int a = Integer.parseInt(((IntegerConstant) left).getValue());
					String b = ((StringConstant) right).getValue();
					StringConstant c = new StringConstant();
					c.setValue(String.valueOf(a + b));
					return c;
				} else if (right instanceof NullValue) {
					return left;
				} else if (right instanceof DataVariable) {
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						int a = Integer.parseInt(((IntegerConstant) left).getValue());
						IntegerConstant c = (IntegerConstant) ((DataVariable) right).getValue();
						int b = Integer.parseInt(c.getValue());
						IntegerConstant cc = new IntegerConstant();
						cc.setValue(String.valueOf(a + b));
						return cc;
					} else if (((DataVariable) right).getDatatype().equals("Double")) {
						int a = Integer.parseInt(((IntegerConstant) left).getValue());
						DoubleConstant c = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(c.getValue());
						DoubleConstant cc = new DoubleConstant();
						cc.setValue(String.valueOf(a + b));
						return cc;
					} else if (((DataVariable) right).getDatatype().equals("Currency")) {
						int a = Integer.parseInt(((IntegerConstant) left).getValue());
						DoubleConstant c = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(c.getValue());
						DoubleConstant cc = new DoubleConstant();
						cc.setDatatype(((DataVariable) right).getDatatype());
						cc.setValue(String.valueOf(a + b));
						return cc;
					} else if (((DataVariable) right).getDatatype().equals("String")) {
						int a = Integer.parseInt(((IntegerConstant) left).getValue());
						StringConstant c = (StringConstant) ((DataVariable) right).getValue();
						String b = c.getValue();
						StringConstant cc = new StringConstant();
						cc.setValue(String.valueOf(a + b));
						return cc;
					}
				}
			} else if (left instanceof DoubleConstant) {
				if (right instanceof IntegerConstant) {
					double a = Double.parseDouble(((DoubleConstant) left).getValue());
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					DoubleConstant c = new DoubleConstant();
					c.setValue(String.valueOf(a + b));
					if (((DoubleConstant) left).getDatatype().equals("Currency")) {
						c.setDatatype(returntype);
					}
					return c;
				} else if (right instanceof DoubleConstant) {
					returntype = "Double";
					if (((DoubleConstant) left).getDatatype().equals("Currency")
							|| ((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
					double a = Double.parseDouble(((DoubleConstant) left).getValue());
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					DoubleConstant c = new DoubleConstant();
					c.setDatatype(returntype);
					c.setValue(String.valueOf(a + b));
					return c;
				} else if (right instanceof StringConstant) {
					double a = Double.parseDouble(((DoubleConstant) left).getValue());
					String b = ((StringConstant) right).getValue();
					StringConstant c = new StringConstant();
					c.setValue(String.valueOf(a + b));
					return c;
				} else if (right instanceof NullValue) {
					return left;
				} else if (right instanceof DataVariable) {
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						double a = Double.parseDouble(((DoubleConstant) left).getValue());
						IntegerConstant c = (IntegerConstant) ((DataVariable) right).getValue();
						int b = Integer.parseInt(c.getValue());
						DoubleConstant cc = new DoubleConstant();
						cc.setValue(String.valueOf(a + b));
						return cc;
					} else if (((DataVariable) right).getDatatype().equals("Double")) {
						returntype = "Double";
						if (((DoubleConstant) left).getDatatype().equals("Currency")) {
							returntype = "Currency";
						}
						double a = Double.parseDouble(((DoubleConstant) left).getValue());
						DoubleConstant c = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(c.getValue());
						DoubleConstant cc = new DoubleConstant();
						cc.setDatatype(returntype);
						cc.setValue(String.valueOf(a + b));
						return cc;
					} else if (((DataVariable) right).getDatatype().equals("Currency")) {
						double a = Double.parseDouble(((DoubleConstant) left).getValue());
						DoubleConstant c = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(c.getValue());
						DoubleConstant cc = new DoubleConstant();
						cc.setDatatype("Currency");
						cc.setValue(String.valueOf(a + b));
						return cc;
					} else if (((DataVariable) right).getDatatype().equals("String")) {
						double a = Double.parseDouble(((DoubleConstant) left).getValue());
						StringConstant b = (StringConstant) ((DataVariable) right).getValue();
						StringConstant c = new StringConstant();
						c.setValue(String.valueOf(a + b.getValue()));
						return c;
					}
				}
			} else if (left instanceof StringConstant) {
				if (right instanceof IntegerConstant) {
					String a = ((StringConstant) left).getValue();
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					StringConstant c = new StringConstant();
					c.setValue(String.valueOf(a + b));
					return c;
				} else if (right instanceof DoubleConstant) {
					String a = ((StringConstant) left).getValue();
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					StringConstant c = new StringConstant();
					c.setValue(String.valueOf(a + b));
					return c;
				} else if (right instanceof StringConstant) {
					String a = ((StringConstant) left).getValue();
					String b = ((StringConstant) right).getValue();
					StringConstant c = new StringConstant();
					c.setValue(a + b);
					return c;
				} else if (right instanceof NullValue) {
					return left;
				} else if (right instanceof DataVariable) {
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						String a = ((StringConstant) left).getValue();
						IntegerConstant c = (IntegerConstant) ((DataVariable) right).getValue();
						int b = Integer.parseInt(c.getValue());
						StringConstant cc = new StringConstant();
						cc.setValue(String.valueOf(a + b));
						return cc;
					} else if (((DataVariable) right).getDatatype().equals("Double")) {
						String a = ((StringConstant) left).getValue();
						DoubleConstant c = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(c.getValue());
						StringConstant cc = new StringConstant();
						cc.setValue(String.valueOf(a + b));
						return cc;
					} else if (((DataVariable) right).getDatatype().equals("Currency")) {
						String a = ((StringConstant) left).getValue();
						DoubleConstant c = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(c.getValue());
						StringConstant cc = new StringConstant();
						cc.setValue(String.valueOf(a + b));
						return cc;
					} else if (((DataVariable) right).getDatatype().equals("String")) {
						String a = ((StringConstant) left).getValue();
						StringConstant c = (StringConstant) ((DataVariable) right).getValue();
						StringConstant cc = new StringConstant();
						cc.setValue(a + c.getValue());
						return cc;
					}
				}
			} else if (left instanceof TimDurationConstant) {
				if (right instanceof TimDurationConstant) {// ????
					TimDurationConstant a = (TimDurationConstant) left;
					TimDurationConstant b = (TimDurationConstant) right;
					TimDurationConstant c = new TimDurationConstant();
					c.setHours(a.getHours() + b.getHours());
					c.setMinutes(a.getMinutes() + b.getMinutes());
					c.setSeconds(a.getSeconds() + b.getSeconds());
					c.setMilliseconds(a.getMilliseconds() + b.getMilliseconds());
					return c;
				}
			} else if (left instanceof DataVariable) {
				if (((DataVariable) left).getDatatype().equals("Integer")) {
					IntegerConstant a = (IntegerConstant) ((DataVariable) left).getValue();
					int c = 0;
					if (a.getValue() != null) {
						c = Integer.parseInt(a.getValue());
					}
					if (right instanceof IntegerConstant) {
						String b = ((IntegerConstant) right).getValue();
						int bb = Integer.parseInt(b);
						IntegerConstant r = new IntegerConstant();
						r.setValue(String.valueOf(bb + c));
						return r;
					} else if (right instanceof DoubleConstant) {
						String b = ((DoubleConstant) right).getValue();
						Double aa = Double.parseDouble(b);
						DoubleConstant r = new DoubleConstant();
						r.setValue(String.valueOf(aa + c));
						return r;
					} else if (right instanceof StringConstant) {
						String b = ((StringConstant) right).getValue();
						StringConstant r = new StringConstant();
						r.setValue(String.valueOf(a.getValue() + b));
						return r;
					} else if (right instanceof NullValue) {
						return left;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							IntegerConstant b = (IntegerConstant) ((DataVariable) right).getValue();
							int bb = Integer.parseInt(b.getValue());
							IntegerConstant r = new IntegerConstant();
							r.setValue(String.valueOf(c + bb));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							DoubleConstant b = (DoubleConstant) ((DataVariable) right).getValue();
							double bb = Double.parseDouble(b.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setValue(String.valueOf(c + bb));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							DoubleConstant b = (DoubleConstant) ((DataVariable) right).getValue();
							double bb = Double.parseDouble(b.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(c + bb));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("String")) {
							StringConstant b = (StringConstant) ((DataVariable) right).getValue();
							StringConstant r = new StringConstant();
							r.setValue(String.valueOf(a.getValue() + b.getValue()));
							return r;
						}
					}
				} else if (((DataVariable) left).getDatatype().equals("Double")) {
					DoubleConstant a = (DoubleConstant) ((DataVariable) left).getValue();
					double c = 0;
					if (a.getValue() != null) {
						c = Double.parseDouble(a.getValue());
					}
					if (right instanceof IntegerConstant) {
						String b = ((IntegerConstant) right).getValue();
						int bb = Integer.parseInt(b);
						DoubleConstant r = new DoubleConstant();
						r.setValue(String.valueOf(bb + c));
						return r;
					} else if (right instanceof DoubleConstant) {
						String b = ((DoubleConstant) right).getValue();
						double aa = Double.parseDouble(b);
						DoubleConstant r = new DoubleConstant();
						r.setDatatype(((DoubleConstant) right).getDatatype());
						r.setValue(String.valueOf(c + aa));
						return r;
					} else if (right instanceof StringConstant) {
						String b = ((StringConstant) right).getValue();
						StringConstant r = new StringConstant();
						r.setValue(String.valueOf(a.getValue() + b));
						return r;
					} else if (right instanceof NullValue) {
						return left;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							IntegerConstant b = (IntegerConstant) ((DataVariable) right).getValue();
							int bb = Integer.parseInt(b.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setValue(String.valueOf(c + bb));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							DoubleConstant b = (DoubleConstant) ((DataVariable) right).getValue();
							double bb = Double.parseDouble(b.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setValue(String.valueOf(c + bb));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							DoubleConstant b = (DoubleConstant) ((DataVariable) right).getValue();
							double bb = Double.parseDouble(b.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(c + bb));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("String")) {
							StringConstant b = (StringConstant) ((DataVariable) right).getValue();
							StringConstant r = new StringConstant();
							r.setValue(String.valueOf(a.getValue() + b.getValue()));
							return r;
						}
					}
				} else if (((DataVariable) left).getDatatype().equals("Currency")) {
					DoubleConstant a = (DoubleConstant) ((DataVariable) left).getValue();
					double c = 0;
					if (a.getValue() != null) {
						c = Double.parseDouble(a.getValue());
					}
					if (right instanceof IntegerConstant) {
						String b = ((IntegerConstant) right).getValue();
						int bb = Integer.parseInt(b);
						DoubleConstant r = new DoubleConstant();
						r.setDatatype("Currency");
						r.setValue(String.valueOf(c + bb));
						return r;
					} else if (right instanceof DoubleConstant) {
						String b = ((DoubleConstant) right).getValue();
						double aa = Double.parseDouble(b);
						DoubleConstant r = new DoubleConstant();
						r.setDatatype("Currency");
						r.setValue(String.valueOf(c + aa));
						return r;
					} else if (right instanceof StringConstant) {
						String b = ((StringConstant) right).getValue();
						StringConstant r = new StringConstant();
						r.setValue(String.valueOf(a.getValue() + b));
						return r;
					} else if (right instanceof NullValue) {
						return left;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							IntegerConstant b = (IntegerConstant) ((DataVariable) right).getValue();
							int bb = Integer.parseInt(b.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(c + bb));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							DoubleConstant b = (DoubleConstant) ((DataVariable) right).getValue();
							double bb = Double.parseDouble(b.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(c + bb));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							DoubleConstant b = (DoubleConstant) ((DataVariable) right).getValue();
							double bb = Double.parseDouble(b.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(c + bb));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("String")) {
							StringConstant b = (StringConstant) ((DataVariable) right).getValue();
							StringConstant r = new StringConstant();
							r.setValue(String.valueOf(a.getValue() + b.getValue()));
							return r;
						}
					}
				} else if (((DataVariable) left).getDatatype().equals("String")) {
					StringConstant a = (StringConstant) ((DataVariable) left).getValue();
					if (right instanceof IntegerConstant) {
						String b = ((IntegerConstant) right).getValue();
						StringConstant r = new StringConstant();
						r.setValue(String.valueOf(a.getValue() + b));
						return r;
					} else if (right instanceof DoubleConstant) {
						String b = ((DoubleConstant) right).getValue();
						StringConstant r = new StringConstant();
						r.setValue(String.valueOf(a.getValue() + b));
						return r;
					} else if (right instanceof StringConstant) {
						String b = ((StringConstant) right).getValue();
						StringConstant r = new StringConstant();
						r.setValue(String.valueOf(a.getValue() + b));
						return r;
					} else if (right instanceof NullValue) {
						return left;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")
								|| ((DataVariable) right).getDatatype().equals("Double")
								|| ((DataVariable) right).getDatatype().equals("Currency")
								|| ((DataVariable) right).getDatatype().equals("String")) {
							StringConstant b = (StringConstant) ((DataVariable) right).getValue();
							StringConstant r = new StringConstant();
							r.setValue(String.valueOf(a.getValue() + b.getValue()));
							return r;
						}
					}
				}
			}
		} else if (ctx.op.getType() == EvaluationExpressionParser.SUB) { // -
			if (left instanceof NullValue) {
				if (right instanceof IntegerConstant) {
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					IntegerConstant c = new IntegerConstant();
					c.setValue(String.valueOf(-b));
					return c;
				} else if (right instanceof DoubleConstant) {
					returntype = "Double";
					if (((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					DoubleConstant c = new DoubleConstant();
					c.setDatatype(returntype);
					c.setValue(String.valueOf(-b));
					return c;
				} else if (right instanceof NullValue) {
					return left;
				} else if (right instanceof DataVariable) {
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						IntegerConstant c = (IntegerConstant) ((DataVariable) right).getValue();
						int b = Integer.parseInt(c.getValue());
						IntegerConstant cc = new IntegerConstant();
						cc.setValue(String.valueOf(-b));
						return cc;
					} else if (((DataVariable) right).getDatatype().equals("Double")) {
						DoubleConstant c = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(c.getValue());
						DoubleConstant cc = new DoubleConstant();
						cc.setValue(String.valueOf(-b));
						return cc;
					} else if (((DataVariable) right).getDatatype().equals("Currency")) {
						DoubleConstant c = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(c.getValue());
						DoubleConstant cc = new DoubleConstant();
						cc.setDatatype(((DataVariable) right).getDatatype());
						cc.setValue(String.valueOf(-b));
						return cc;
					}
				}
			} else if (left instanceof IntegerConstant) {
				if (right instanceof IntegerConstant) {
					int a = Integer.parseInt(((IntegerConstant) left).getValue());
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					IntegerConstant c = new IntegerConstant();
					c.setValue(String.valueOf(a - b));
					return c;
				} else if (right instanceof DoubleConstant) {
					returntype = "Double";
					if (((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
					int a = Integer.parseInt(((IntegerConstant) left).getValue());
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					DoubleConstant c = new DoubleConstant();
					c.setDatatype(returntype);
					c.setValue(String.valueOf(a - b));
					return c;
				} else if (right instanceof NullValue) {
					return left;
				} else if (right instanceof DataVariable) {
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						int a = Integer.parseInt(((IntegerConstant) left).getValue());
						IntegerConstant c = (IntegerConstant) ((DataVariable) right).getValue();
						int b = Integer.parseInt(c.getValue());
						IntegerConstant cc = new IntegerConstant();
						cc.setValue(String.valueOf(a - b));
						return cc;
					} else if (((DataVariable) right).getDatatype().equals("Double")) {
						int a = Integer.parseInt(((IntegerConstant) left).getValue());
						DoubleConstant c = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(c.getValue());
						DoubleConstant cc = new DoubleConstant();
						cc.setValue(String.valueOf(a - b));
						return cc;
					} else if (((DataVariable) right).getDatatype().equals("Currency")) {
						int a = Integer.parseInt(((IntegerConstant) left).getValue());
						DoubleConstant c = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(c.getValue());
						DoubleConstant cc = new DoubleConstant();
						cc.setDatatype(((DataVariable) right).getDatatype());
						cc.setValue(String.valueOf(a - b));
						return cc;
					}
				}
			} else if (left instanceof DoubleConstant) {
				if (right instanceof IntegerConstant) {
					double a = Double.parseDouble(((DoubleConstant) left).getValue());
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					DoubleConstant c = new DoubleConstant();
					c.setValue(String.valueOf(a - b));
					if (((DoubleConstant) left).getDatatype().equals("Currency")) {
						c.setDatatype("Currency");
					}
					return c;
				} else if (right instanceof DoubleConstant) {
					returntype = "Double";
					if (((DoubleConstant) left).getDatatype().equals("Currency")
							|| ((DoubleConstant) right).getDatatype().equals("Currency")) {
						returntype = "Currency";
					}
					double a = Double.parseDouble(((DoubleConstant) left).getValue());
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					DoubleConstant c = new DoubleConstant();
					c.setDatatype(returntype);
					c.setValue(String.valueOf(a - b));
					return c;
				} else if (right instanceof NullValue) {
					return left;
				} else if (right instanceof DataVariable) {
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						double a = Double.parseDouble(((DoubleConstant) left).getValue());
						IntegerConstant c = (IntegerConstant) ((DataVariable) right).getValue();
						int b = Integer.parseInt(c.getValue());
						DoubleConstant cc = new DoubleConstant();
						cc.setValue(String.valueOf(a - b));
						return cc;
					} else if (((DataVariable) right).getDatatype().equals("Double")) {
						returntype = "Double";
						if (((DoubleConstant) left).getDatatype().equals("Currency")) {
							returntype = "Currency";
						}
						double a = Double.parseDouble(((DoubleConstant) left).getValue());
						DoubleConstant c = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(c.getValue());
						DoubleConstant cc = new DoubleConstant();
						cc.setDatatype(returntype);
						cc.setValue(String.valueOf(a - b));
						return cc;
					} else if (((DataVariable) right).getDatatype().equals("Currency")) {
						double a = Double.parseDouble(((DoubleConstant) left).getValue());
						DoubleConstant c = (DoubleConstant) ((DataVariable) right).getValue();
						double b = Double.parseDouble(c.getValue());
						DoubleConstant cc = new DoubleConstant();
						cc.setDatatype("Currency");
						cc.setValue(String.valueOf(a - b));
						return cc;
					}
				}
			} else if (left instanceof TimDurationConstant) {
				if (right instanceof TimDurationConstant) {// ????
					TimDurationConstant a = (TimDurationConstant) left;
					TimDurationConstant b = (TimDurationConstant) right;
					TimDurationConstant c = new TimDurationConstant();
					c.setHours(a.getHours() + b.getHours());
					c.setMinutes(a.getMinutes() + b.getMinutes());
					c.setSeconds(a.getSeconds() + b.getSeconds());
					c.setMilliseconds(a.getMilliseconds() + b.getMilliseconds());
					return c;
				}
			} else if (left instanceof DataVariable) {
				if (((DataVariable) left).getDatatype().equals("Integer")) {
					IntegerConstant a = (IntegerConstant) ((DataVariable) left).getValue();
					int c = 0;
					if (a.getValue() != null) {
						c = Integer.parseInt(a.getValue());
					}
					if (right instanceof IntegerConstant) {
						String b = ((IntegerConstant) right).getValue();
						int bb = Integer.parseInt(b);
						IntegerConstant r = new IntegerConstant();
						r.setValue(String.valueOf(c - bb));
						return r;
					} else if (right instanceof DoubleConstant) {
						String b = ((DoubleConstant) right).getValue();
						Double aa = Double.parseDouble(b);
						DoubleConstant r = new DoubleConstant();
						r.setValue(String.valueOf(c - aa));
						return r;
					} else if (right instanceof NullValue) {
						return left;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							IntegerConstant b = (IntegerConstant) ((DataVariable) right).getValue();
							int bb = Integer.parseInt(b.getValue());
							IntegerConstant r = new IntegerConstant();
							r.setValue(String.valueOf(c - bb));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							DoubleConstant b = (DoubleConstant) ((DataVariable) right).getValue();
							double bb = Double.parseDouble(b.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setValue(String.valueOf(c - bb));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							DoubleConstant b = (DoubleConstant) ((DataVariable) right).getValue();
							double bb = Double.parseDouble(b.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(c - bb));
							return r;
						}
					}
				} else if (((DataVariable) left).getDatatype().equals("Double")) {
					DoubleConstant a = (DoubleConstant) ((DataVariable) left).getValue();
					double c = 0;
					if (a.getValue() != null) {
						c = Double.parseDouble(a.getValue());
					}
					if (right instanceof IntegerConstant) {
						String b = ((IntegerConstant) right).getValue();
						int bb = Integer.parseInt(b);
						DoubleConstant r = new DoubleConstant();
						r.setValue(String.valueOf(c - bb));
						return r;
					} else if (right instanceof DoubleConstant) {
						String b = ((DoubleConstant) right).getValue();
						double aa = Double.parseDouble(b);
						DoubleConstant r = new DoubleConstant();
						r.setValue(String.valueOf(c - aa));
						return r;
					} else if (right instanceof NullValue) {
						return left;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							IntegerConstant b = (IntegerConstant) ((DataVariable) right).getValue();
							int bb = Integer.parseInt(b.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setValue(String.valueOf(c - bb));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							DoubleConstant b = (DoubleConstant) ((DataVariable) right).getValue();
							double bb = Double.parseDouble(b.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setValue(String.valueOf(c - bb));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							DoubleConstant b = (DoubleConstant) ((DataVariable) right).getValue();
							double bb = Double.parseDouble(b.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(c - bb));
							return r;
						}
					}
				} else if (((DataVariable) left).getDatatype().equals("Currency")) {
					DoubleConstant a = (DoubleConstant) ((DataVariable) left).getValue();
					double c = 0;
					if (a.getValue() != null) {
						c = Double.parseDouble(a.getValue());
					}
					if (right instanceof IntegerConstant) {
						String b = ((IntegerConstant) right).getValue();
						int bb = Integer.parseInt(b);
						DoubleConstant r = new DoubleConstant();
						r.setDatatype("Currency");
						r.setValue(String.valueOf(c - bb));
						return r;
					} else if (right instanceof DoubleConstant) {
						String b = ((DoubleConstant) right).getValue();
						double aa = Double.parseDouble(b);
						DoubleConstant r = new DoubleConstant();
						r.setDatatype("Currency");
						r.setValue(String.valueOf(c - aa));
						return r;
					} else if (right instanceof NullValue) {
						return left;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							IntegerConstant b = (IntegerConstant) ((DataVariable) right).getValue();
							int bb = Integer.parseInt(b.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(c - bb));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							DoubleConstant b = (DoubleConstant) ((DataVariable) right).getValue();
							double bb = Double.parseDouble(b.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(c - bb));
							return r;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							DoubleConstant b = (DoubleConstant) ((DataVariable) right).getValue();
							double bb = Double.parseDouble(b.getValue());
							DoubleConstant r = new DoubleConstant();
							r.setDatatype("Currency");
							r.setValue(String.valueOf(c - bb));
							return r;
						}
					}
				}
			}
		} // sub -
		return null;
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public WorkflowEntity visitParens(EvaluationExpressionParser.ParensContext ctx) {
		ExpressionContext e = ctx.expression();
		return (WorkflowEntity) visit(e);
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public WorkflowEntity visitReal(EvaluationExpressionParser.RealContext ctx) {
		// return visitChildren(ctx);
		return this.currExpr.fetchItembyName(ctx.getText());
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public WorkflowEntity visitID(EvaluationExpressionParser.IDContext ctx) {
		return this.currExpr.fetchItembyName(ctx.getText());
		// return visitChildren(ctx);
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public WorkflowEntity visitInt(EvaluationExpressionParser.IntContext ctx) {
		return this.currExpr.fetchItembyName(ctx.getText());
	}

}
