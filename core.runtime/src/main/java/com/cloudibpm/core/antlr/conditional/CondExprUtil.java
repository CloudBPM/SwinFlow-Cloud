/**
 * 
 */
package com.cloudibpm.core.antlr.conditional;

import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.antlr.conditional.ConditionalExpressionParser.ExpressionContext;
import com.cloudibpm.core.antlr.evaluation.EvaluationExpressionParser;
import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
import com.cloudibpm.core.data.*;
import com.cloudibpm.core.data.expression.Expression;
import com.cloudibpm.core.data.variable.ArrayDataVariable;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.data.variable.ExprFunction;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.tree.TerminalNode;

import java.util.List;

/**
 * @author Dahai cao created on 20171130
 *
 */
public class CondExprUtil extends ConditionalExpressionBaseVisitor<WorkflowEntity> {

	// private WfProcess parent = null;
	private Expression currExpr = null;

	public CondExprUtil(Expression rule, WfProcess parent) {
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
	public WorkflowEntity visitProg(ConditionalExpressionParser.ProgContext ctx) {
		return visitChildren(ctx);
	}

	@Override
	public WorkflowEntity visitComparative(ConditionalExpressionParser.ComparativeContext ctx) {
		if (ctx.op.getType() == ConditionalExpressionParser.EQUAL) {
			return visitEq(ctx);
		} else if (ctx.op.getType() == ConditionalExpressionParser.NOTEQUAL) {
			return visitNq(ctx);
		} else if (ctx.op.getType() == ConditionalExpressionParser.LT) {
			return visitLt(ctx);
		} else if (ctx.op.getType() == ConditionalExpressionParser.LE) {
			return visitLe(ctx);
		} else if (ctx.op.getType() == ConditionalExpressionParser.GT) {
			return visitGt(ctx);
		} else if (ctx.op.getType() == ConditionalExpressionParser.GE) {
			return visitGe(ctx);
		}
		return visitChildren(ctx);
	}

	@Override
	public WorkflowEntity visitLogical(ConditionalExpressionParser.LogicalContext ctx) {
		if (ctx.op.getType() == ConditionalExpressionParser.AND) {
			return visitAnd(ctx);
		} else if (ctx.op.getType() == ConditionalExpressionParser.OR) {
			return visitOr(ctx);
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
	public WorkflowEntity visitEq(ConditionalExpressionParser.ComparativeContext ctx) {
		ExpressionContext le = ctx.expression(0);
		WorkflowEntity left = (WorkflowEntity) visit(le);
		// get value of right subexpression
		ExpressionContext re = ctx.expression(1);
		WorkflowEntity right = (WorkflowEntity) visit(re);
		Token start = ctx.getStart();
		Token stop = ctx.getStop();
		boolean checked = false;
		String err = null;

		// ==
		if (left instanceof IntegerConstant) {
			if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
				checked = true;
			} else if (right instanceof NullValue) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG101.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						checked = true;
					} else if (((DataVariable) right).getDatatype().equals("Double")) {
						checked = true;
					} else if (((DataVariable) right).getDatatype().equals("Currency")) {
						checked = true;
					} else {
						err = "MSG102: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG103: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DoubleConstant) {
			if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
				checked = true;
			} else if (right instanceof NullValue) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG103.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						checked = true;
					} else if (((DataVariable) right).getDatatype().equals("Double")) {
						checked = true;
					} else if (((DataVariable) right).getDatatype().equals("Currency")) {
						checked = true;
					} else {
						err = "MSG104: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG105: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof StringConstant) {
			if (right instanceof NullValue) {
				checked = true;
			} else if (right instanceof StringConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG105.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals("String")) {
						checked = true;
					} else {
						err = "MSG106: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG107: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof BooleanConstant) {
			if (right instanceof NullValue) {
				checked = true;
			} else if (right instanceof BooleanConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG107.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals("Boolean")) {
						checked = true;
					} else {
						err = "MSG108: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG109: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DateTimeConstant) {
			if (right instanceof NullValue) {
				checked = true;
			} else if (right instanceof DateTimeConstant) {
				if (((DateTimeConstant) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
					checked = true;
				} else {
					err = "MSG110: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG110.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals(((DateTimeConstant) left).getDatatype())) {
						checked = true;
					} else {
						err = "MSG111: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG112: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof FileConstant) {
			if (right instanceof NullValue) {
				checked = true;
			} else if (right instanceof FileConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG112.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals("File")) {
						checked = true;
					} else {
						err = "MSG113: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG114: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof HandwritingConstant) {
			if (right instanceof NullValue) {
				checked = true;
			} else if (right instanceof HandwritingConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG114.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals("Handwriting")) {
						checked = true;
					} else {
						err = "MSG115: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG116: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof JSONConstant) {
			if (right instanceof NullValue) {
				checked = true;
			} else if (right instanceof JSONConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG116.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals("JSONData")) {
						checked = true;
					} else {
						err = "MSG115: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG116: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof NullValue) {
			if (right instanceof NullValue || right instanceof BooleanConstant || right instanceof DoubleConstant
					|| right instanceof DateTimeConstant || right instanceof FileConstant
					|| right instanceof HandwritingConstant || right instanceof IntegerConstant
					|| right instanceof JSONConstant || right instanceof StringConstant
					|| right instanceof TimDurationConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				checked = true;
			} else {
				err = "MSG117: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof TimDurationConstant) {
			if (right instanceof NullValue) {
				checked = true;
			} else if (right instanceof TimDurationConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG117.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
						checked = true;
					} else {
						err = "MSG118: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG119: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DataVariable) {
			if (left instanceof ArrayDataVariable) {
				err = "MSG119.1: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
						+ start.getText() + "' has something wrong";
			} else {
				if (((DataVariable) left).getDatatype().equals("Integer")) {
					if (right instanceof NullValue) {
						checked = true;
					} else if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
						checked = true;
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG119.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " variable '" + stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("Integer")) {
								checked = true;
							} else if (((DataVariable) right).getDatatype().equals("Double")) {
								checked = true;
							} else if (((DataVariable) right).getDatatype().equals("Currency")) {
								checked = true;
							} else {
								err = "MSG120: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant/variable '" + stop.getText() + "' has something wrong";
							}
						}
					}
				} else if (((DataVariable) left).getDatatype().equals("Double")) {
					if (right instanceof NullValue) {
						checked = true;
					} else if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
						checked = true;
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG120.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " variable '" + stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("Integer")) {
								checked = true;
							} else if (((DataVariable) right).getDatatype().equals("Double")) {
								checked = true;
							} else if (((DataVariable) right).getDatatype().equals("Currency")) {
								checked = true;
							} else {
								err = "MSG120: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant/variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG121: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				} else if (((DataVariable) left).getDatatype().equals("String")) {
					if (right instanceof NullValue) {
						checked = true;
					} else if (right instanceof StringConstant) {
						checked = true;
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG121.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " variable '" + stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("String")) {
								checked = true;
							} else {
								err = "MSG122: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant/variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG123: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				} else if (((DataVariable) left).getDatatype().equals("Boolean")) {
					if (right instanceof NullValue) {
						checked = true;
					} else if (right instanceof BooleanConstant) {
						checked = true;
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG123.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " variable '" + stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("Boolean")) {
								checked = true;
							} else {
								err = "MSG124: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant/variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG125: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				} else if (((DataVariable) left).getDatatype().equals("DateTime")
						|| ((DataVariable) left).getDatatype().equals("Date")
						|| ((DataVariable) left).getDatatype().equals("Time")) {
					if (right instanceof NullValue) {
						checked = true;
					} else if (right instanceof DateTimeConstant) {
						if (((DataVariable) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
							checked = true;
						} else {
							err = "MSG126: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant '"
									+ stop.getText() + "' has something wrong";
						}
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG126.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " variable '" + stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals(((DataVariable) left).getDatatype())) {
								checked = true;
							} else {
								err = "MSG127: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant/variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG128: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				} else if (((DataVariable) left).getDatatype().equals("File")) {
					if (right instanceof NullValue) {
						checked = true;
					} else if (right instanceof FileConstant) {
						checked = true;
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG128.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " variable '" + stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("File")) {
								checked = true;
							} else {
								err = "MSG129: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant/variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG130: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				} else if (((DataVariable) left).getDatatype().equals("Handwriting")) {
					if (right instanceof NullValue) {
						checked = true;
					} else if (right instanceof HandwritingConstant) {
						checked = true;
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG130.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " variable '" + stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("Handwriting")) {
								checked = true;
							} else {
								err = "MSG131: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant/variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG132: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				} else if (((DataVariable) left).getDatatype().equals("JSONData")) {
					if (right instanceof NullValue) {
						checked = true;
					} else if (right instanceof JSONConstant) {
						checked = true;
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG132.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " variable '" + stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("JSONData")) {
								checked = true;
							} else {
								err = "MSG133: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant/variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG134: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				} else if (((DataVariable) left).getDatatype().equals("TimeDuration")) {
					if (right instanceof NullValue) {
						checked = true;
					} else if (right instanceof TimDurationConstant) {
						checked = true;
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG134.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " variable '" + stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
								checked = true;
							} else {
								err = "MSG135: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant/variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG136: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				} else {
					err = "MSG137: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				}
			}
		} else {
			err = "MSG138: line " + start.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
					+ stop.getText() + "' has something wrong";
		} // ==

		if (!checked) {
			throw new RuntimeException(err);
		}

		// ==
		if (left instanceof IntegerConstant) {
			int a = Integer.parseInt(((IntegerConstant) left).getValue());
			BooleanConstant c = new BooleanConstant();
			if (right instanceof IntegerConstant) {
				int b = Integer.parseInt(((IntegerConstant) right).getValue());
				c.setValue(String.valueOf(a == b));
				return c;
			} else if (right instanceof DoubleConstant) {
				double b = Double.parseDouble(((DoubleConstant) right).getValue());
				c.setValue(String.valueOf(a == b));
				return c;
			} else if (right instanceof NullValue) {
				c.setValue("false");
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Integer")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (d instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) d).getValue());
						c.setValue(String.valueOf(a == b));
						return c;
					}
				} else if (((DataVariable) right).getDatatype().equals("Double")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (d instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(a == b));
						return c;
					}
				} else if (((DataVariable) right).getDatatype().equals("Currency")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (d instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(a == b));
						return c;
					}
				}
			}
		} else if (left instanceof DoubleConstant) {
			Double a = new Double(Double.parseDouble(((IntegerConstant) left).getValue()));
			BooleanConstant c = new BooleanConstant();
			if (right instanceof IntegerConstant) {
				int b = Integer.parseInt(((IntegerConstant) right).getValue());
				c.setValue(String.valueOf(a == b));
				return c;
			} else if (right instanceof DoubleConstant) {
				double b = Double.parseDouble(((DoubleConstant) right).getValue());
				c.setValue(String.valueOf(a == b));
				return c;
			} else if (right instanceof NullValue) {
				c.setValue("false");
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Integer")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (d instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) d).getValue());
						c.setValue(String.valueOf(a == b));
						return c;
					}
				} else if (((DataVariable) right).getDatatype().equals("Double")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (d instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(a == b));
						return c;
					}
				} else if (((DataVariable) right).getDatatype().equals("Currency")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (d instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(a == b));
						return c;
					}
				}
			}
		} else if (left instanceof StringConstant) {
			String s = ((StringConstant) left).getValue();
			BooleanConstant c = new BooleanConstant();
			if (right instanceof NullValue) {
				c.setValue("false");
				return c;
			} else if (right instanceof StringConstant) {
				String s1 = ((StringConstant) right).getValue();
				c.setValue(String.valueOf(s.equals(s1)));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("String")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (d instanceof StringConstant) {
						String s1 = ((StringConstant) d).getValue();
						c.setValue(String.valueOf(s.equals(s1)));
						return c;
					}
				}
			}
		} else if (left instanceof BooleanConstant) {
			boolean a = Boolean.parseBoolean(((BooleanConstant) left).getValue());
			BooleanConstant c = new BooleanConstant();
			if (right instanceof NullValue) {
				c.setValue("false");
				return c;
			} else if (right instanceof BooleanConstant) {
				Boolean b = new Boolean(Boolean.parseBoolean(((BooleanConstant) right).getValue()));
				c.setValue(String.valueOf(a == b));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Boolean")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (d instanceof BooleanConstant) {
						boolean b = Boolean.parseBoolean(((BooleanConstant) d).getValue());
						c.setValue(String.valueOf(a == b));
						return c;
					}
				}
			}
		} else if (left instanceof DateTimeConstant) {
			long a = ((DateTimeConstant) left).getRealTime();
			BooleanConstant c = new BooleanConstant();
			if (right instanceof NullValue) {
				c.setValue("false");
				return c;
			} else if (right instanceof DateTimeConstant) {
				if (((DateTimeConstant) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
					long b = ((DateTimeConstant) right).getRealTime();
					c.setValue(String.valueOf(a == b));
					return c;
				}
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals(((DateTimeConstant) left).getDatatype())) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (d instanceof DateTimeConstant) {
						long b = ((DateTimeConstant) d).getRealTime();
						c.setValue(String.valueOf(a == b));
						return c;
					}
				}
			}
		} else if (left instanceof FileConstant) {
			FileConstant a = (FileConstant) left;
			BooleanConstant c = new BooleanConstant();
			if (right instanceof NullValue) {
				c.setValue("false");
				return c;
			} else if (right instanceof FileConstant) {
				FileConstant b = (FileConstant) right;
				c.setValue(String.valueOf(a.equals(b)));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("File")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (d instanceof FileConstant) {
						c.setValue(String.valueOf(a.equals(d)));
						return c;
					}
				}
			}
		} else if (left instanceof HandwritingConstant) {
			HandwritingConstant a = (HandwritingConstant) left;
			BooleanConstant c = new BooleanConstant();
			if (right instanceof NullValue) {
				c.setValue("false");
				return c;
			} else if (right instanceof HandwritingConstant) {
				HandwritingConstant b = (HandwritingConstant) right;
				c.setValue(String.valueOf(a.equals(b)));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Handwriting")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (d instanceof HandwritingConstant) {
						c.setValue(String.valueOf(a.equals(d)));
						return c;
					}
				}
			}
		} else if (left instanceof JSONConstant) {
			JSONConstant a = (JSONConstant) left;
			BooleanConstant c = new BooleanConstant();
			if (right instanceof NullValue) {
				c.setValue("false");
				return c;
			} else if (right instanceof JSONConstant) {
				JSONConstant b = (JSONConstant) right;
				c.setValue(String.valueOf(a.equals(b)));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("JSONData")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (d instanceof JSONConstant) {
						c.setValue(String.valueOf(a.equals(d)));
						return c;
					}
				}
			}
		} else if (left instanceof NullValue) {
			BooleanConstant c = new BooleanConstant();
			if (right instanceof NullValue) {
				c.setValue("true");
				return c;
			} else if (right instanceof BooleanConstant || right instanceof DoubleConstant
					|| right instanceof DateTimeConstant || right instanceof FileConstant
					|| right instanceof HandwritingConstant || right instanceof IntegerConstant
					|| right instanceof JSONConstant || right instanceof StringConstant
					|| right instanceof TimDurationConstant) {
				c.setValue("false");
				return c;
			}
		} else if (left instanceof TimDurationConstant) {
			TimDurationConstant a = (TimDurationConstant) left;
			BooleanConstant c = new BooleanConstant();
			if (right instanceof NullValue) {
				c.setValue("false");
				return c;
			} else if (right instanceof TimDurationConstant) {
				TimDurationConstant b = (TimDurationConstant) right;
				c.setValue(String.valueOf(a.equals(b)));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (d instanceof TimDurationConstant) {
						c.setValue(String.valueOf(a.equals(d)));
						return c;
					}
				}
			}
		} else if (left instanceof DataVariable) {
			BooleanConstant c = new BooleanConstant();
			if (((DataVariable) left).getDatatype().equals("Integer")) {
				Object d = ((DataVariable) left).getValue(); // left value
				if (d instanceof NullValue) {
					if (right instanceof NullValue) {
						c.setValue("true");
						return c;
					} else {
						c.setValue("false");
						return c;
					}
				} else if (d instanceof IntegerConstant) {
					if (right instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (right instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) right).getValue());
						int e = Integer.parseInt(((IntegerConstant) d).getValue());
						c.setValue(String.valueOf(e == b));
						return c;
					} else if (right instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) right).getValue());
						int e = Integer.parseInt(((IntegerConstant) d).getValue());
						c.setValue(String.valueOf(e == b));
						return c;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							Object f = ((DataVariable) right).getValue(); // right
																			// value
							if (f instanceof NullValue) {
								c.setValue("false");
								return c;
							} else if (f instanceof IntegerConstant) {
								int b = Integer.parseInt(((IntegerConstant) d).getValue());
								int e = Integer.parseInt(((IntegerConstant) f).getValue());
								c.setValue(String.valueOf(e == b));
								return c;
							}
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							Object f = ((DataVariable) right).getValue(); // right
																			// value
							if (f instanceof NullValue) {
								c.setValue("false");
								return c;
							} else if (f instanceof DoubleConstant) {
								int b = Integer.parseInt(((IntegerConstant) d).getValue());
								double e = Double.parseDouble(((DoubleConstant) f).getValue());
								c.setValue(String.valueOf(e == b));
								return c;
							}
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							Object f = ((DataVariable) right).getValue(); // right
																			// value
							if (f instanceof NullValue) {
								c.setValue("false");
								return c;
							} else if (f instanceof DoubleConstant) {
								int b = Integer.parseInt(((IntegerConstant) d).getValue());
								double e = Double.parseDouble(((DoubleConstant) f).getValue());
								c.setValue(String.valueOf(e == b));
								return c;
							}
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("Double")) {
				Object d = ((DataVariable) left).getValue(); // left value
				if (d instanceof NullValue) {
					if (right instanceof NullValue) {
						c.setValue("true");
						return c;
					} else {
						c.setValue("false");
						return c;
					}
				} else if (d instanceof DoubleConstant) {
					if (right instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (right instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) right).getValue());
						double e = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(e == b));
						return c;
					} else if (right instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) right).getValue());
						double e = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(e == b));
						return c;

					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							Object f = ((DataVariable) right).getValue(); // right
																			// value
							if (f instanceof NullValue) {
								c.setValue("false");
								return c;
							} else if (f instanceof IntegerConstant) {
								int e = Integer.parseInt(((IntegerConstant) f).getValue());
								double b = Double.parseDouble(((DoubleConstant) d).getValue());
								c.setValue(String.valueOf(e == b));
								return c;
							}
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							Object f = ((DataVariable) right).getValue(); // right
																			// value
							if (f instanceof NullValue) {
								c.setValue("false");
								return c;
							} else if (f instanceof DoubleConstant) {
								double e = Double.parseDouble(((DoubleConstant) f).getValue());
								double b = Double.parseDouble(((DoubleConstant) d).getValue());
								c.setValue(String.valueOf(e == b));
								return c;
							}
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							Object f = ((DataVariable) right).getValue(); // right
																			// value
							if (f instanceof NullValue) {
								c.setValue("false");
								return c;
							} else if (f instanceof DoubleConstant) {
								double e = Double.parseDouble(((DoubleConstant) f).getValue());
								double b = Double.parseDouble(((DoubleConstant) d).getValue());
								c.setValue(String.valueOf(e == b));
								return c;
							}
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("String")) {
				Object d = ((DataVariable) left).getValue(); // left value
				if (d instanceof NullValue) {
					if (right instanceof NullValue) {
						c.setValue("true");
						return c;
					} else {
						c.setValue("false");
						return c;
					}
				} else if (d instanceof StringConstant) {
					if (right instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (right instanceof StringConstant) {
						String a = ((StringConstant) d).getValue();
						String b = ((StringConstant) right).getValue();
						c.setValue(String.valueOf(a.equals(b)));
						return c;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("String")) {
							Object f = ((DataVariable) right).getValue(); // right
																			// value
							if (f instanceof NullValue) {
								c.setValue("false");
								return c;
							} else if (f instanceof StringConstant) {
								String a = ((StringConstant) d).getValue();
								String e = ((StringConstant) f).getValue();
								c.setValue(String.valueOf(a.equals(e)));
								return c;
							}
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("Boolean")) {
				Object d = ((DataVariable) left).getValue(); // left value
				if (d instanceof NullValue) {
					if (right instanceof NullValue) {
						c.setValue("true");
						return c;
					} else {
						c.setValue("false");
						return c;
					}
				} else if (d instanceof BooleanConstant) {
					if (right instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (right instanceof BooleanConstant) {
						String a = ((BooleanConstant) d).getValue();
						String e = ((BooleanConstant) right).getValue();
						c.setValue(String.valueOf(a.equals(e)));
						return c;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Boolean")) {
							Object f = ((DataVariable) right).getValue();
							if (f instanceof NullValue) {
								c.setValue("false");
								return c;
							} else if (f instanceof StringConstant) {
								String a = ((BooleanConstant) d).getValue();
								String e = ((BooleanConstant) f).getValue();
								c.setValue(String.valueOf(a.equals(e)));
								return c;
							}
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("DateTime")
					|| ((DataVariable) left).getDatatype().equals("Date")
					|| ((DataVariable) left).getDatatype().equals("Time")) {
				Object d = ((DataVariable) left).getValue(); // left value
				if (d instanceof NullValue) {
					if (right instanceof NullValue) {
						c.setValue("true");
						return c;
					} else {
						c.setValue("false");
						return c;
					}
				} else if (d instanceof DateTimeConstant) {
					if (right instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (right instanceof DateTimeConstant) {
						if (((DataVariable) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
							DateTimeConstant a = (DateTimeConstant) d;
							DateTimeConstant e = (DateTimeConstant) right;
							c.setValue(String.valueOf(a.equals(e)));
							return c;
						}
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals(((DataVariable) left).getDatatype())) {
							Object f = ((DataVariable) right).getValue();
							if (f instanceof NullValue) {
								c.setValue("false");
								return c;
							} else if (f instanceof DateTimeConstant) {
								DateTimeConstant a = (DateTimeConstant) d;
								DateTimeConstant e = (DateTimeConstant) f;
								c.setValue(String.valueOf(a.equals(e)));
								return c;
							}
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("File")) {
				Object d = ((DataVariable) left).getValue(); // left value
				if (d instanceof NullValue) {
					if (right instanceof NullValue) {
						c.setValue("true");
						return c;
					} else {
						c.setValue("false");
						return c;
					}
				} else if (d instanceof DateTimeConstant) {
					if (right instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (right instanceof FileConstant) {
						FileConstant a = (FileConstant) d;
						FileConstant e = (FileConstant) right;
						c.setValue(String.valueOf(a.equals(e)));
						return c;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("File")) {
							Object f = ((DataVariable) right).getValue();
							if (f instanceof NullValue) {
								c.setValue("false");
								return c;
							} else if (f instanceof FileConstant) {
								FileConstant a = (FileConstant) d;
								FileConstant e = (FileConstant) f;
								c.setValue(String.valueOf(a.equals(e)));
								return c;
							}
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("Handwriting")) {
				Object d = ((DataVariable) left).getValue(); // left value
				if (d instanceof NullValue) {
					if (right instanceof NullValue) {
						c.setValue("true");
						return c;
					} else {
						c.setValue("false");
						return c;
					}
				} else if (d instanceof HandwritingConstant) {
					if (right instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (right instanceof HandwritingConstant) {
						HandwritingConstant a = (HandwritingConstant) d;
						HandwritingConstant e = (HandwritingConstant) right;
						c.setValue(String.valueOf(a.equals(e)));
						return c;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Handwriting")) {
							Object f = ((DataVariable) right).getValue();
							if (f instanceof NullValue) {
								c.setValue("false");
								return c;
							} else if (f instanceof HandwritingConstant) {
								HandwritingConstant a = (HandwritingConstant) d;
								HandwritingConstant e = (HandwritingConstant) f;
								c.setValue(String.valueOf(a.equals(e)));
								return c;
							}
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("JSONData")) {
				Object d = ((DataVariable) left).getValue(); // left value
				if (d instanceof NullValue) {
					if (right instanceof NullValue) {
						c.setValue("true");
						return c;
					} else {
						c.setValue("false");
						return c;
					}
				} else if (d instanceof JSONConstant) {
					if (right instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (right instanceof JSONConstant) {
						JSONConstant a = (JSONConstant) d;
						JSONConstant e = (JSONConstant) right;
						c.setValue(String.valueOf(a.equals(e)));
						return c;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("JSONData")) {
							Object f = ((DataVariable) right).getValue();
							if (f instanceof NullValue) {
								c.setValue("false");
								return c;
							} else if (f instanceof JSONConstant) {
								JSONConstant a = (JSONConstant) d;
								JSONConstant e = (JSONConstant) f;
								c.setValue(String.valueOf(a.equals(e)));
								return c;
							}
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("TimeDuration")) {
				Object d = ((DataVariable) left).getValue(); // left value
				if (d instanceof NullValue) {
					if (right instanceof NullValue) {
						c.setValue("true");
						return c;
					} else {
						c.setValue("false");
						return c;
					}
				} else if (d instanceof TimDurationConstant) {
					if (right instanceof NullValue) {
						c.setValue("false");
						return c;
					} else if (right instanceof TimDurationConstant) {
						TimDurationConstant a = (TimDurationConstant) d;
						TimDurationConstant e = (TimDurationConstant) right;
						c.setValue(String.valueOf(a.equals(e)));
						return c;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
							Object f = ((DataVariable) right).getValue();
							if (f instanceof NullValue) {
								c.setValue("false");
								return c;
							} else if (f instanceof TimDurationConstant) {
								TimDurationConstant a = (TimDurationConstant) d;
								TimDurationConstant e = (TimDurationConstant) f;
								c.setValue(String.valueOf(a.equals(e)));
								return c;
							}
						}
					}
				}
			}
		} // ==

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
	public WorkflowEntity visitLt(ConditionalExpressionParser.ComparativeContext ctx) {
		ExpressionContext le = ctx.expression(0);
		WorkflowEntity left = (WorkflowEntity) visit(le);
		// get value of right subexpression
		ExpressionContext re = ctx.expression(1);
		WorkflowEntity right = (WorkflowEntity) visit(re);
		Token start = ctx.getStart();
		Token stop = ctx.getStop();
		boolean checked = false;
		String err = null;

		// <=, or <, or >, or >=
		if (left instanceof IntegerConstant) {
			if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				Object f = ((DataVariable) right).getValue();
				if (f instanceof NullValue) {
					err = "MSG179: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (right instanceof ArrayDataVariable) {
						err = "MSG179.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
						} else {
							err = "MSG180: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				}
			} else {
				err = "MSG181: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DoubleConstant) {
			if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				Object f = ((DataVariable) right).getValue();
				if (f instanceof NullValue) {
					err = "MSG182: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (right instanceof ArrayDataVariable) {
						err = "MSG182.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
						} else {
							err = "MSG183: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				}
			} else {
				err = "MSG184: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DateTimeConstant) {
			if (right instanceof DateTimeConstant) {
				if (((DateTimeConstant) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
					checked = true;
				} else {
					err = "MSG185: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG185.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					Object f = ((DataVariable) right).getValue();
					if (f instanceof NullValue) {
						err = "MSG186: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals(((DateTimeConstant) left).getDatatype())) {
							checked = true;
						} else {
							err = "MSG187: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				}
			} else {
				err = "MSG188: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof TimDurationConstant) {
			if (right instanceof TimDurationConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG188.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					Object f = ((DataVariable) right).getValue();
					if (f instanceof NullValue) {
						err = "MSG189: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
							checked = true;
						} else {
							err = "MSG190: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				}
			} else {
				err = "MSG191: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DataVariable) {
			if (left instanceof ArrayDataVariable) {
				err = "MSG191.1: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
						+ start.getText() + "' has something wrong";
			} else {
				Object d = ((DataVariable) left).getValue();
				if (d instanceof NullValue) {
					err = "MSG192: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) left).getDatatype().equals("Integer")) {
						if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
							checked = true;
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG192.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
								} else {
									err = "MSG193: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " constant/variable '" + stop.getText() + "' has something wrong";
								}
							}
						}
					} else if (((DataVariable) left).getDatatype().equals("Double") ||
							((DataVariable) left).getDatatype().equals("Currency")) {
						if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
							checked = true;
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG193.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
								} else {
									err = "MSG194: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " constant/variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG195: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else if (((DataVariable) left).getDatatype().equals("DateTime")
							|| ((DataVariable) left).getDatatype().equals("Date")
							|| ((DataVariable) left).getDatatype().equals("Time")) {
						if (right instanceof DateTimeConstant) {
							if (((DataVariable) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
								checked = true;
							} else {
								err = "MSG196: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant '" + stop.getText() + "' has something wrong";
							}
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG196.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals(((DataVariable) left).getDatatype())) {
									checked = true;
								} else {
									err = "MSG197: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " constant/variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG198: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else if (((DataVariable) left).getDatatype().equals("TimeDuration")) {
						if (right instanceof TimDurationConstant) {
							checked = true;
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG198.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
									checked = true;
								} else {
									err = "MSG199: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " constant/variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG200: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else {
						err = "MSG201: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				}
			}
		} else {
			err = "MSG202: line " + start.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
					+ stop.getText() + "' has something wrong";
		} // <=, or <, or >, or >=

		if (!checked) {
			throw new RuntimeException(err);
		}

		// <=, or <, or >, or >=
		BooleanConstant c = new BooleanConstant();
		if (left instanceof IntegerConstant) {
			int a = Integer.parseInt(((IntegerConstant) left).getValue());
			if (right instanceof IntegerConstant) {
				int b = Integer.parseInt(((IntegerConstant) right).getValue());
				c.setValue(String.valueOf(a < b));
				return c;
			} else if (right instanceof DoubleConstant) {
				double b = Double.parseDouble(((DoubleConstant) right).getValue());
				c.setValue(String.valueOf(a < b));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Integer")) {
					Object f = ((DataVariable) right).getValue();
					if (f instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) f).getValue());
						c.setValue(String.valueOf(a < b));
						return c;
					}
				} else if (((DataVariable) right).getDatatype().equals("Double")
						|| ((DataVariable) right).getDatatype().equals("Currency")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(a < b));
						return c;
					}
				}
			}
		} else if (left instanceof DoubleConstant) {
			double a = Double.parseDouble(((DoubleConstant) left).getValue());
			if (right instanceof IntegerConstant) {
				int b = Integer.parseInt(((IntegerConstant) right).getValue());
				c.setValue(String.valueOf(a < b));
				return c;
			} else if (right instanceof DoubleConstant) {
				double b = Double.parseDouble(((DoubleConstant) right).getValue());
				c.setValue(String.valueOf(a < b));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Integer")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) d).getValue());
						c.setValue(String.valueOf(a < b));
						return c;
					}
				} else if (((DataVariable) right).getDatatype().equals("Double")
						|| ((DataVariable) right).getDatatype().equals("Currency")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(a < b));
						return c;
					}
				}
			}
		} else if (left instanceof DateTimeConstant) {
			DateTimeConstant a = (DateTimeConstant) left;
			if (right instanceof DateTimeConstant) {
				if (((DateTimeConstant) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
					DateTimeConstant b = (DateTimeConstant) right;
					c.setValue(String.valueOf(a.getRealTime() < b.getRealTime()));
					return c;
				}
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals(((DateTimeConstant) left).getDatatype())) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof DateTimeConstant) {
						DateTimeConstant b = (DateTimeConstant) d;
						c.setValue(String.valueOf(a.getRealTime() < b.getRealTime()));
						return c;
					}
				}
			}
		} else if (left instanceof TimDurationConstant) {
			DateTimeConstant a = (DateTimeConstant) left;
			if (right instanceof TimDurationConstant) {
				TimDurationConstant b = (TimDurationConstant) right;
				c.setValue(String.valueOf(a.getRealTime() < b.getRealTime()));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof TimDurationConstant) {
						TimDurationConstant b = (TimDurationConstant) d;
						c.setValue(String.valueOf(a.getRealTime() < b.getRealTime()));
						return c;
					}
				}
			}
		} else if (left instanceof DataVariable) {
			Object d = ((DataVariable) left).getValue();
			if (((DataVariable) left).getDatatype().equals("Integer")) {
				int a = Integer.parseInt(((IntegerConstant) d).getValue());
				if (right instanceof IntegerConstant) {
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					c.setValue(String.valueOf(a < b));
					return c;
				} else if (right instanceof DoubleConstant) {
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					c.setValue(String.valueOf(a < b));
					return c;
				} else if (right instanceof DataVariable) {
					Object f = ((DataVariable) right).getValue();
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						if (f instanceof IntegerConstant) {
							int b = Integer.parseInt(((IntegerConstant) f).getValue());
							c.setValue(String.valueOf(a < b));
							return c;
						}
					} else if (((DataVariable) right).getDatatype().equals("Double")
							|| ((DataVariable) right).getDatatype().equals("Currency")) {
						if (f instanceof DoubleConstant) {
							double b = Double.parseDouble(((DoubleConstant) f).getValue());
							c.setValue(String.valueOf(a < b));
							return c;
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("Double")) {
				double a = Double.parseDouble(((DoubleConstant) d).getValue());
				if (right instanceof IntegerConstant) {
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					c.setValue(String.valueOf(a < b));
					return c;
				} else if (right instanceof DoubleConstant) {
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					c.setValue(String.valueOf(a < b));
					return c;
				} else if (right instanceof DataVariable) {
					Object f = ((DataVariable) right).getValue();
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						int b = Integer.parseInt(((IntegerConstant) f).getValue());
						c.setValue(String.valueOf(a < b));
						return c;
					} else if (((DataVariable) right).getDatatype().equals("Double")
							|| ((DataVariable) right).getDatatype().equals("Currency")) {
						double b = Double.parseDouble(((DoubleConstant) f).getValue());
						c.setValue(String.valueOf(a < b));
						return c;
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("DateTime")
					|| ((DataVariable) left).getDatatype().equals("Date")
					|| ((DataVariable) left).getDatatype().equals("Time")) {
				if (right instanceof DateTimeConstant) {
					if (((DataVariable) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
						DateTimeConstant a = (DateTimeConstant) d;
						DateTimeConstant b = (DateTimeConstant) right;
						c.setValue(String.valueOf(a.getRealTime() < b.getRealTime()));
						return c;
					}
				} else if (right instanceof DataVariable) {
					Object f = ((DataVariable) right).getValue();
					if (((DataVariable) right).getDatatype().equals(((DataVariable) left).getDatatype())) {
						DateTimeConstant a = (DateTimeConstant) d;
						DateTimeConstant b = (DateTimeConstant) f;
						c.setValue(String.valueOf(a.getRealTime() < b.getRealTime()));
						return c;
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("TimeDuration")) {
				if (right instanceof TimDurationConstant) {
					TimDurationConstant a = (TimDurationConstant) d;
					TimDurationConstant b = (TimDurationConstant) right;
					c.setValue(String.valueOf(a.getRealTime() < b.getRealTime()));
					return c;
				} else if (right instanceof DataVariable) {
					Object f = ((DataVariable) right).getValue();
					if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
						TimDurationConstant a = (TimDurationConstant) d;
						TimDurationConstant b = (TimDurationConstant) f;
						c.setValue(String.valueOf(a.getRealTime() < b.getRealTime()));
						return c;
					}
				}
			}
		} // <=, or <, or >, or >=

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
	public WorkflowEntity visitLe(ConditionalExpressionParser.ComparativeContext ctx) {
		ExpressionContext le = ctx.expression(0);
		WorkflowEntity left = (WorkflowEntity) visit(le);
		// get value of right subexpression
		ExpressionContext re = ctx.expression(1);
		WorkflowEntity right = (WorkflowEntity) visit(re);
		Token start = ctx.getStart();
		Token stop = ctx.getStop();
		boolean checked = false;
		String err = null;

		// <=, or <, or >, or >=
		if (left instanceof IntegerConstant) {
			if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				Object f = ((DataVariable) right).getValue();
				if (f instanceof NullValue) {
					err = "MSG179: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (right instanceof ArrayDataVariable) {
						err = "MSG179.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
						} else {
							err = "MSG180: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				}
			} else {
				err = "MSG181: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DoubleConstant) {
			if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				Object f = ((DataVariable) right).getValue();
				if (f instanceof NullValue) {
					err = "MSG182: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (right instanceof ArrayDataVariable) {
						err = "MSG182.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
						} else {
							err = "MSG183: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				}
			} else {
				err = "MSG184: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DateTimeConstant) {
			if (right instanceof DateTimeConstant) {
				if (((DateTimeConstant) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
					checked = true;
				} else {
					err = "MSG185: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG185.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					Object f = ((DataVariable) right).getValue();
					if (f instanceof NullValue) {
						err = "MSG186: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals(((DateTimeConstant) left).getDatatype())) {
							checked = true;
						} else {
							err = "MSG187: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				}
			} else {
				err = "MSG188: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof TimDurationConstant) {
			if (right instanceof TimDurationConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG188.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					Object f = ((DataVariable) right).getValue();
					if (f instanceof NullValue) {
						err = "MSG189: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
							checked = true;
						} else {
							err = "MSG190: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				}
			} else {
				err = "MSG191: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DataVariable) {
			if (left instanceof ArrayDataVariable) {
				err = "MSG191.1: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
						+ start.getText() + "' has something wrong";
			} else {
				Object d = ((DataVariable) left).getValue();
				if (d instanceof NullValue) {
					err = "MSG192: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) left).getDatatype().equals("Integer")) {
						if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
							checked = true;
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG192.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
								} else {
									err = "MSG193: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " constant/variable '" + stop.getText() + "' has something wrong";
								}
							}
						}
					} else if (((DataVariable) left).getDatatype().equals("Double") ||
							((DataVariable) left).getDatatype().equals("Currency")) {
						if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
							checked = true;
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG193.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
								} else {
									err = "MSG194: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " constant/variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG195: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else if (((DataVariable) left).getDatatype().equals("DateTime")
							|| ((DataVariable) left).getDatatype().equals("Date")
							|| ((DataVariable) left).getDatatype().equals("Time")) {
						if (right instanceof DateTimeConstant) {
							if (((DataVariable) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
								checked = true;
							} else {
								err = "MSG196: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant '" + stop.getText() + "' has something wrong";
							}
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG196.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals(((DataVariable) left).getDatatype())) {
									checked = true;
								} else {
									err = "MSG197: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " constant/variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG198: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else if (((DataVariable) left).getDatatype().equals("TimeDuration")) {
						if (right instanceof TimDurationConstant) {
							checked = true;
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG198.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
									checked = true;
								} else {
									err = "MSG199: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " constant/variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG200: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else {
						err = "MSG201: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				}
			}
		} else {
			err = "MSG202: line " + start.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
					+ stop.getText() + "' has something wrong";
		} // <=, or <, or >, or >=

		if (!checked) {
			throw new RuntimeException(err);
		}

		// <=, or <, or >, or >=
		BooleanConstant c = new BooleanConstant();
		if (left instanceof IntegerConstant) {
			int a = Integer.parseInt(((IntegerConstant) left).getValue());
			if (right instanceof IntegerConstant) {
				int b = Integer.parseInt(((IntegerConstant) right).getValue());
				c.setValue(String.valueOf(a <= b));
				return c;
			} else if (right instanceof DoubleConstant) {
				double b = Double.parseDouble(((DoubleConstant) right).getValue());
				c.setValue(String.valueOf(a <= b));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Integer")) {
					Object f = ((DataVariable) right).getValue();
					if (f instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) f).getValue());
						c.setValue(String.valueOf(a <= b));
						return c;
					}
				} else if (((DataVariable) right).getDatatype().equals("Double")
						|| ((DataVariable) right).getDatatype().equals("Currency")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(a <= b));
						return c;
					}
				}
			}
		} else if (left instanceof DoubleConstant) {
			double a = Double.parseDouble(((DoubleConstant) left).getValue());
			if (right instanceof IntegerConstant) {
				int b = Integer.parseInt(((IntegerConstant) right).getValue());
				c.setValue(String.valueOf(a <= b));
				return c;
			} else if (right instanceof DoubleConstant) {
				double b = Double.parseDouble(((DoubleConstant) right).getValue());
				c.setValue(String.valueOf(a <= b));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Integer")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) d).getValue());
						c.setValue(String.valueOf(a <= b));
						return c;
					}
				} else if (((DataVariable) right).getDatatype().equals("Double")
						|| ((DataVariable) right).getDatatype().equals("Currency")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(a <= b));
						return c;
					}
				}
			}
		} else if (left instanceof DateTimeConstant) {
			DateTimeConstant a = (DateTimeConstant) left;
			if (right instanceof DateTimeConstant) {
				if (((DateTimeConstant) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
					DateTimeConstant b = (DateTimeConstant) right;
					c.setValue(String.valueOf(a.getRealTime() <= b.getRealTime()));
					return c;
				}
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals(((DateTimeConstant) left).getDatatype())) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof DateTimeConstant) {
						DateTimeConstant b = (DateTimeConstant) d;
						c.setValue(String.valueOf(a.getRealTime() <= b.getRealTime()));
						return c;
					}
				}
			}
		} else if (left instanceof TimDurationConstant) {
			DateTimeConstant a = (DateTimeConstant) left;
			if (right instanceof TimDurationConstant) {
				TimDurationConstant b = (TimDurationConstant) right;
				c.setValue(String.valueOf(a.getRealTime() <= b.getRealTime()));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof TimDurationConstant) {
						TimDurationConstant b = (TimDurationConstant) d;
						c.setValue(String.valueOf(a.getRealTime() <= b.getRealTime()));
						return c;
					}
				}
			}
		} else if (left instanceof DataVariable) {
			Object d = ((DataVariable) left).getValue();
			if (((DataVariable) left).getDatatype().equals("Integer")) {
				int a = Integer.parseInt(((IntegerConstant) d).getValue());
				if (right instanceof IntegerConstant) {
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					c.setValue(String.valueOf(a <= b));
					return c;
				} else if (right instanceof DoubleConstant) {
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					c.setValue(String.valueOf(a <= b));
					return c;
				} else if (right instanceof DataVariable) {
					Object f = ((DataVariable) right).getValue();
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						if (f instanceof IntegerConstant) {
							int b = Integer.parseInt(((IntegerConstant) f).getValue());
							c.setValue(String.valueOf(a <= b));
							return c;
						}
					} else if (((DataVariable) right).getDatatype().equals("Double")
							|| ((DataVariable) right).getDatatype().equals("Currency")) {
						if (f instanceof DoubleConstant) {
							double b = Double.parseDouble(((DoubleConstant) f).getValue());
							c.setValue(String.valueOf(a <= b));
							return c;
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("Double")) {
				double a = Double.parseDouble(((DoubleConstant) d).getValue());
				if (right instanceof IntegerConstant) {
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					c.setValue(String.valueOf(a <= b));
					return c;
				} else if (right instanceof DoubleConstant) {
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					c.setValue(String.valueOf(a <= b));
					return c;
				} else if (right instanceof DataVariable) {
					Object f = ((DataVariable) right).getValue();
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						int b = Integer.parseInt(((IntegerConstant) f).getValue());
						c.setValue(String.valueOf(a <= b));
						return c;
					} else if (((DataVariable) right).getDatatype().equals("Double")
							|| ((DataVariable) right).getDatatype().equals("Currency")) {
						double b = Double.parseDouble(((DoubleConstant) f).getValue());
						c.setValue(String.valueOf(a <= b));
						return c;
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("DateTime")
					|| ((DataVariable) left).getDatatype().equals("Date")
					|| ((DataVariable) left).getDatatype().equals("Time")) {
				if (right instanceof DateTimeConstant) {
					if (((DataVariable) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
						DateTimeConstant a = (DateTimeConstant) d;
						DateTimeConstant b = (DateTimeConstant) right;
						c.setValue(String.valueOf(a.getRealTime() <= b.getRealTime()));
						return c;
					}
				} else if (right instanceof DataVariable) {
					Object f = ((DataVariable) right).getValue();
					if (((DataVariable) right).getDatatype().equals(((DataVariable) left).getDatatype())) {
						DateTimeConstant a = (DateTimeConstant) d;
						DateTimeConstant b = (DateTimeConstant) f;
						c.setValue(String.valueOf(a.getRealTime() <= b.getRealTime()));
						return c;
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("TimeDuration")) {
				if (right instanceof TimDurationConstant) {
					TimDurationConstant a = (TimDurationConstant) d;
					TimDurationConstant b = (TimDurationConstant) right;
					c.setValue(String.valueOf(a.getRealTime() <= b.getRealTime()));
					return c;
				} else if (right instanceof DataVariable) {
					Object f = ((DataVariable) right).getValue();
					if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
						TimDurationConstant a = (TimDurationConstant) d;
						TimDurationConstant b = (TimDurationConstant) f;
						c.setValue(String.valueOf(a.getRealTime() <= b.getRealTime()));
						return c;
					}
				}
			}
		} // <=, or <, or >, or >=

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
	public WorkflowEntity visitGt(ConditionalExpressionParser.ComparativeContext ctx) {
		ExpressionContext le = ctx.expression(0);
		WorkflowEntity left = (WorkflowEntity) visit(le);
		// get value of right subexpression
		ExpressionContext re = ctx.expression(1);
		WorkflowEntity right = (WorkflowEntity) visit(re);
		Token start = ctx.getStart();
		Token stop = ctx.getStop();
		boolean checked = false;
		String err = null;

		// <=, or <, or >, or >=
		if (left instanceof IntegerConstant) {
			if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				Object f = ((DataVariable) right).getValue();
				if (f instanceof NullValue) {
					err = "MSG179: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (right instanceof ArrayDataVariable) {
						err = "MSG179.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
						} else {
							err = "MSG180: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				}
			} else {
				err = "MSG181: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DoubleConstant) {
			if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				Object f = ((DataVariable) right).getValue();
				if (f instanceof NullValue) {
					err = "MSG182: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (right instanceof ArrayDataVariable) {
						err = "MSG182.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
						} else {
							err = "MSG183: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				}
			} else {
				err = "MSG184: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DateTimeConstant) {
			if (right instanceof DateTimeConstant) {
				if (((DateTimeConstant) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
					checked = true;
				} else {
					err = "MSG185: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG185.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					Object f = ((DataVariable) right).getValue();
					if (f instanceof NullValue) {
						err = "MSG186: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals(((DateTimeConstant) left).getDatatype())) {
							checked = true;
						} else {
							err = "MSG187: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				}
			} else {
				err = "MSG188: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof TimDurationConstant) {
			if (right instanceof TimDurationConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG188.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					Object f = ((DataVariable) right).getValue();
					if (f instanceof NullValue) {
						err = "MSG189: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
							checked = true;
						} else {
							err = "MSG190: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				}
			} else {
				err = "MSG191: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DataVariable) {
			if (left instanceof ArrayDataVariable) {
				err = "MSG191.1: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
						+ start.getText() + "' has something wrong";
			} else {
				Object d = ((DataVariable) left).getValue();
				if (d instanceof NullValue) {
					err = "MSG192: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) left).getDatatype().equals("Integer")) {
						if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
							checked = true;
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG192.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
								} else {
									err = "MSG193: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " constant/variable '" + stop.getText() + "' has something wrong";
								}
							}
						}
					} else if (((DataVariable) left).getDatatype().equals("Double") ||
							((DataVariable) left).getDatatype().equals("Currency")) {
						if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
							checked = true;
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG193.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
								} else {
									err = "MSG194: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " constant/variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG195: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else if (((DataVariable) left).getDatatype().equals("DateTime")
							|| ((DataVariable) left).getDatatype().equals("Date")
							|| ((DataVariable) left).getDatatype().equals("Time")) {
						if (right instanceof DateTimeConstant) {
							if (((DataVariable) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
								checked = true;
							} else {
								err = "MSG196: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant '" + stop.getText() + "' has something wrong";
							}
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG196.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals(((DataVariable) left).getDatatype())) {
									checked = true;
								} else {
									err = "MSG197: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " constant/variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG198: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else if (((DataVariable) left).getDatatype().equals("TimeDuration")) {
						if (right instanceof TimDurationConstant) {
							checked = true;
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG198.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
									checked = true;
								} else {
									err = "MSG199: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " constant/variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG200: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else {
						err = "MSG201: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				}
			}
		} else {
			err = "MSG202: line " + start.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
					+ stop.getText() + "' has something wrong";
		} // <=, or <, or >, or >=

		if (!checked) {
			throw new RuntimeException(err);
		}

		// <=, or <, or >, or >=
		BooleanConstant c = new BooleanConstant();
		if (left instanceof IntegerConstant) {
			int a = Integer.parseInt(((IntegerConstant) left).getValue());
			if (right instanceof IntegerConstant) {
				int b = Integer.parseInt(((IntegerConstant) right).getValue());
				c.setValue(String.valueOf(a > b));
				return c;
			} else if (right instanceof DoubleConstant) {
				double b = Double.parseDouble(((DoubleConstant) right).getValue());
				c.setValue(String.valueOf(a > b));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Integer")) {
					Object f = ((DataVariable) right).getValue();
					if (f instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) f).getValue());
						c.setValue(String.valueOf(a > b));
						return c;
					}
				} else if (((DataVariable) right).getDatatype().equals("Double")
						|| ((DataVariable) right).getDatatype().equals("Currency")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(a > b));
						return c;
					}
				}
			}
		} else if (left instanceof DoubleConstant) {
			double a = Double.parseDouble(((DoubleConstant) left).getValue());
			if (right instanceof IntegerConstant) {
				int b = Integer.parseInt(((IntegerConstant) right).getValue());
				c.setValue(String.valueOf(a > b));
				return c;
			} else if (right instanceof DoubleConstant) {
				double b = Double.parseDouble(((DoubleConstant) right).getValue());
				c.setValue(String.valueOf(a > b));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Integer")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) d).getValue());
						c.setValue(String.valueOf(a > b));
						return c;
					}
				} else if (((DataVariable) right).getDatatype().equals("Double")
						|| ((DataVariable) right).getDatatype().equals("Currency")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(a > b));
						return c;
					}
				}
			}
		} else if (left instanceof DateTimeConstant) {
			DateTimeConstant a = (DateTimeConstant) left;
			if (right instanceof DateTimeConstant) {
				if (((DateTimeConstant) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
					DateTimeConstant b = (DateTimeConstant) right;
					c.setValue(String.valueOf(a.getRealTime() > b.getRealTime()));
					return c;
				}
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals(((DateTimeConstant) left).getDatatype())) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof DateTimeConstant) {
						DateTimeConstant b = (DateTimeConstant) d;
						c.setValue(String.valueOf(a.getRealTime() > b.getRealTime()));
						return c;
					}
				}
			}
		} else if (left instanceof TimDurationConstant) {
			DateTimeConstant a = (DateTimeConstant) left;
			if (right instanceof TimDurationConstant) {
				TimDurationConstant b = (TimDurationConstant) right;
				c.setValue(String.valueOf(a.getRealTime() > b.getRealTime()));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof TimDurationConstant) {
						TimDurationConstant b = (TimDurationConstant) d;
						c.setValue(String.valueOf(a.getRealTime() > b.getRealTime()));
						return c;
					}
				}
			}
		} else if (left instanceof DataVariable) {
			Object d = ((DataVariable) left).getValue();
			if (((DataVariable) left).getDatatype().equals("Integer")) {
				int a = Integer.parseInt(((IntegerConstant) d).getValue());
				if (right instanceof IntegerConstant) {
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					c.setValue(String.valueOf(a > b));
					return c;
				} else if (right instanceof DoubleConstant) {
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					c.setValue(String.valueOf(a > b));
					return c;
				} else if (right instanceof DataVariable) {
					Object f = ((DataVariable) right).getValue();
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						if (f instanceof IntegerConstant) {
							int b = Integer.parseInt(((IntegerConstant) f).getValue());
							c.setValue(String.valueOf(a > b));
							return c;
						}
					} else if (((DataVariable) right).getDatatype().equals("Double")
							|| ((DataVariable) right).getDatatype().equals("Currency")) {
						if (f instanceof DoubleConstant) {
							double b = Double.parseDouble(((DoubleConstant) f).getValue());
							c.setValue(String.valueOf(a > b));
							return c;
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("Double") ||
					((DataVariable) left).getDatatype().equals("Currency")) {
				double a = Double.parseDouble(((DoubleConstant) d).getValue());
				if (right instanceof IntegerConstant) {
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					c.setValue(String.valueOf(a > b));
					return c;
				} else if (right instanceof DoubleConstant) {
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					c.setValue(String.valueOf(a > b));
					return c;
				} else if (right instanceof DataVariable) {
					Object f = ((DataVariable) right).getValue();
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						int b = Integer.parseInt(((IntegerConstant) f).getValue());
						c.setValue(String.valueOf(a > b));
						return c;
					} else if (((DataVariable) right).getDatatype().equals("Double")
							|| ((DataVariable) right).getDatatype().equals("Currency")) {
						double b = Double.parseDouble(((DoubleConstant) f).getValue());
						c.setValue(String.valueOf(a > b));
						return c;
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("DateTime")
					|| ((DataVariable) left).getDatatype().equals("Date")
					|| ((DataVariable) left).getDatatype().equals("Time")) {
				if (right instanceof DateTimeConstant) {
					if (((DataVariable) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
						DateTimeConstant a = (DateTimeConstant) d;
						DateTimeConstant b = (DateTimeConstant) right;
						c.setValue(String.valueOf(a.getRealTime() > b.getRealTime()));
						return c;
					}
				} else if (right instanceof DataVariable) {
					Object f = ((DataVariable) right).getValue();
					if (((DataVariable) right).getDatatype().equals(((DataVariable) left).getDatatype())) {
						DateTimeConstant a = (DateTimeConstant) d;
						DateTimeConstant b = (DateTimeConstant) f;
						c.setValue(String.valueOf(a.getRealTime() > b.getRealTime()));
						return c;
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("TimeDuration")) {
				if (right instanceof TimDurationConstant) {
					TimDurationConstant a = (TimDurationConstant) d;
					TimDurationConstant b = (TimDurationConstant) right;
					c.setValue(String.valueOf(a.getRealTime() > b.getRealTime()));
					return c;
				} else if (right instanceof DataVariable) {
					Object f = ((DataVariable) right).getValue();
					if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
						TimDurationConstant a = (TimDurationConstant) d;
						TimDurationConstant b = (TimDurationConstant) f;
						c.setValue(String.valueOf(a.getRealTime() > b.getRealTime()));
						return c;
					}
				}
			}
		} // <=, or <, or >, or >=

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
	public WorkflowEntity visitGe(ConditionalExpressionParser.ComparativeContext ctx) {
		ExpressionContext le = ctx.expression(0);
		WorkflowEntity left = (WorkflowEntity) visit(le);
		// get value of right subexpression
		ExpressionContext re = ctx.expression(1);
		WorkflowEntity right = (WorkflowEntity) visit(re);
		Token start = ctx.getStart();
		Token stop = ctx.getStop();
		boolean checked = false;
		String err = null;

		// <=, or <, or >, or >=
		if (left instanceof IntegerConstant) {
			if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				Object f = ((DataVariable) right).getValue();
				if (f instanceof NullValue) {
					err = "MSG179: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (right instanceof ArrayDataVariable) {
						err = "MSG179.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
						} else {
							err = "MSG180: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				}
			} else {
				err = "MSG181: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DoubleConstant) {
			if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				Object f = ((DataVariable) right).getValue();
				if (f instanceof NullValue) {
					err = "MSG182: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (right instanceof ArrayDataVariable) {
						err = "MSG182.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							checked = true;
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							checked = true;
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							checked = true;
						} else {
							err = "MSG183: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				}
			} else {
				err = "MSG184: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DateTimeConstant) {
			if (right instanceof DateTimeConstant) {
				if (((DateTimeConstant) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
					checked = true;
				} else {
					err = "MSG185: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG185.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					Object f = ((DataVariable) right).getValue();
					if (f instanceof NullValue) {
						err = "MSG186: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals(((DateTimeConstant) left).getDatatype())) {
							checked = true;
						} else {
							err = "MSG187: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				}
			} else {
				err = "MSG188: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof TimDurationConstant) {
			if (right instanceof TimDurationConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG188.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					Object f = ((DataVariable) right).getValue();
					if (f instanceof NullValue) {
						err = "MSG189: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
							checked = true;
						} else {
							err = "MSG190: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				}
			} else {
				err = "MSG191: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DataVariable) {
			if (left instanceof ArrayDataVariable) {
				err = "MSG191.1: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
						+ start.getText() + "' has something wrong";
			} else {
				Object d = ((DataVariable) left).getValue();
				if (d instanceof NullValue) {
					err = "MSG192: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) left).getDatatype().equals("Integer")) {
						if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
							checked = true;
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG192.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
								} else {
									err = "MSG193: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " constant/variable '" + stop.getText() + "' has something wrong";
								}
							}
						}
					} else if (((DataVariable) left).getDatatype().equals("Double") ||
							((DataVariable) left).getDatatype().equals("Currency")) {
						if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
							checked = true;
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG193.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("Integer")) {
									checked = true;
								} else if (((DataVariable) right).getDatatype().equals("Double")) {
									checked = true;
								} else if (((DataVariable) right).getDatatype().equals("Currency")) {
									checked = true;
								} else {
									err = "MSG194: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " constant/variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG195: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else if (((DataVariable) left).getDatatype().equals("DateTime")
							|| ((DataVariable) left).getDatatype().equals("Date")
							|| ((DataVariable) left).getDatatype().equals("Time")) {
						if (right instanceof DateTimeConstant) {
							if (((DataVariable) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
								checked = true;
							} else {
								err = "MSG196: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant '" + stop.getText() + "' has something wrong";
							}
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG196.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals(((DataVariable) left).getDatatype())) {
									checked = true;
								} else {
									err = "MSG197: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " constant/variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG198: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else if (((DataVariable) left).getDatatype().equals("TimeDuration")) {
						if (right instanceof TimDurationConstant) {
							checked = true;
						} else if (right instanceof DataVariable) {
							if (right instanceof ArrayDataVariable) {
								err = "MSG198.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							} else {
								if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
									checked = true;
								} else {
									err = "MSG199: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
											+ " constant/variable '" + stop.getText() + "' has something wrong";
								}
							}
						} else {
							err = "MSG200: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
						}
					} else {
						err = "MSG201: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				}
			}
		} else {
			err = "MSG202: line " + start.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
					+ stop.getText() + "' has something wrong";
		} // <=, or <, or >, or >=

		if (!checked) {
			throw new RuntimeException(err);
		}

		// <=, or <, or >, or >=
		BooleanConstant c = new BooleanConstant();
		if (left instanceof IntegerConstant) {
			int a = Integer.parseInt(((IntegerConstant) left).getValue());
			if (right instanceof IntegerConstant) {
				int b = Integer.parseInt(((IntegerConstant) right).getValue());
				c.setValue(String.valueOf(a >= b));
				return c;
			} else if (right instanceof DoubleConstant) {
				double b = Double.parseDouble(((DoubleConstant) right).getValue());
				c.setValue(String.valueOf(a >= b));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Integer")) {
					Object f = ((DataVariable) right).getValue();
					if (f instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) f).getValue());
						c.setValue(String.valueOf(a >= b));
						return c;
					}
				} else if (((DataVariable) right).getDatatype().equals("Double")
						|| ((DataVariable) right).getDatatype().equals("Currency")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(a >= b));
						return c;
					}
				}
			}
		} else if (left instanceof DoubleConstant) {
			double a = Double.parseDouble(((DoubleConstant) left).getValue());
			if (right instanceof IntegerConstant) {
				int b = Integer.parseInt(((IntegerConstant) right).getValue());
				c.setValue(String.valueOf(a >= b));
				return c;
			} else if (right instanceof DoubleConstant) {
				double b = Double.parseDouble(((DoubleConstant) right).getValue());
				c.setValue(String.valueOf(a >= b));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Integer")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) d).getValue());
						c.setValue(String.valueOf(a >= b));
						return c;
					}
				} else if (((DataVariable) right).getDatatype().equals("Double")
						|| ((DataVariable) right).getDatatype().equals("Currency")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(a >= b));
						return c;
					}
				}
			}
		} else if (left instanceof DateTimeConstant) {
			DateTimeConstant a = (DateTimeConstant) left;
			if (right instanceof DateTimeConstant) {
				if (((DateTimeConstant) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
					DateTimeConstant b = (DateTimeConstant) right;
					c.setValue(String.valueOf(a.getRealTime() >= b.getRealTime()));
					return c;
				}
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals(((DateTimeConstant) left).getDatatype())) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof DateTimeConstant) {
						DateTimeConstant b = (DateTimeConstant) d;
						c.setValue(String.valueOf(a.getRealTime() >= b.getRealTime()));
						return c;
					}
				}
			}
		} else if (left instanceof TimDurationConstant) {
			DateTimeConstant a = (DateTimeConstant) left;
			if (right instanceof TimDurationConstant) {
				TimDurationConstant b = (TimDurationConstant) right;
				c.setValue(String.valueOf(a.getRealTime() >= b.getRealTime()));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof TimDurationConstant) {
						TimDurationConstant b = (TimDurationConstant) d;
						c.setValue(String.valueOf(a.getRealTime() >= b.getRealTime()));
						return c;
					}
				}
			}
		} else if (left instanceof DataVariable) {
			Object d = ((DataVariable) left).getValue();
			if (((DataVariable) left).getDatatype().equals("Integer")) {
				int a = Integer.parseInt(((IntegerConstant) d).getValue());
				if (right instanceof IntegerConstant) {
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					c.setValue(String.valueOf(a >= b));
					return c;
				} else if (right instanceof DoubleConstant) {
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					c.setValue(String.valueOf(a >= b));
					return c;
				} else if (right instanceof DataVariable) {
					Object f = ((DataVariable) right).getValue();
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						if (f instanceof IntegerConstant) {
							int b = Integer.parseInt(((IntegerConstant) f).getValue());
							c.setValue(String.valueOf(a >= b));
							return c;
						}
					} else if (((DataVariable) right).getDatatype().equals("Double")
							|| ((DataVariable) right).getDatatype().equals("Currency")) {
						if (f instanceof DoubleConstant) {
							double b = Double.parseDouble(((DoubleConstant) f).getValue());
							c.setValue(String.valueOf(a >= b));
							return c;
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("Double") ||
					((DataVariable) left).getDatatype().equals("Currency")) {
				double a = Double.parseDouble(((DoubleConstant) d).getValue());
				if (right instanceof IntegerConstant) {
					int b = Integer.parseInt(((IntegerConstant) right).getValue());
					c.setValue(String.valueOf(a >= b));
					return c;
				} else if (right instanceof DoubleConstant) {
					double b = Double.parseDouble(((DoubleConstant) right).getValue());
					c.setValue(String.valueOf(a >= b));
					return c;
				} else if (right instanceof DataVariable) {
					Object f = ((DataVariable) right).getValue();
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						int b = Integer.parseInt(((IntegerConstant) f).getValue());
						c.setValue(String.valueOf(a >= b));
						return c;
					} else if (((DataVariable) right).getDatatype().equals("Double")
							|| ((DataVariable) right).getDatatype().equals("Currency")) {
						double b = Double.parseDouble(((DoubleConstant) f).getValue());
						c.setValue(String.valueOf(a >= b));
						return c;
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("DateTime")
					|| ((DataVariable) left).getDatatype().equals("Date")
					|| ((DataVariable) left).getDatatype().equals("Time")) {
				if (right instanceof DateTimeConstant) {
					if (((DataVariable) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
						DateTimeConstant a = (DateTimeConstant) d;
						DateTimeConstant b = (DateTimeConstant) right;
						c.setValue(String.valueOf(a.getRealTime() >= b.getRealTime()));
						return c;
					}
				} else if (right instanceof DataVariable) {
					Object f = ((DataVariable) right).getValue();
					if (((DataVariable) right).getDatatype().equals(((DataVariable) left).getDatatype())) {
						DateTimeConstant a = (DateTimeConstant) d;
						DateTimeConstant b = (DateTimeConstant) f;
						c.setValue(String.valueOf(a.getRealTime() >= b.getRealTime()));
						return c;
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("TimeDuration")) {
				if (right instanceof TimDurationConstant) {
					TimDurationConstant a = (TimDurationConstant) d;
					TimDurationConstant b = (TimDurationConstant) right;
					c.setValue(String.valueOf(a.getRealTime() >= b.getRealTime()));
					return c;
				} else if (right instanceof DataVariable) {
					Object f = ((DataVariable) right).getValue();
					if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
						TimDurationConstant a = (TimDurationConstant) d;
						TimDurationConstant b = (TimDurationConstant) f;
						c.setValue(String.valueOf(a.getRealTime() >= b.getRealTime()));
						return c;
					}
				}
			}
		} // <=, or <, or >, or >=

		return visitChildren(ctx);
	}

	public WorkflowEntity visitNq(ConditionalExpressionParser.ComparativeContext ctx) {
		ExpressionContext le = ctx.expression(0);
		WorkflowEntity left = (WorkflowEntity) visit(le);
		// get value of right subexpression
		ExpressionContext re = ctx.expression(1);
		WorkflowEntity right = (WorkflowEntity) visit(re);
		Token start = ctx.getStart();
		Token stop = ctx.getStop();
		boolean checked = false;
		String err = null;

		// !=
		if (left instanceof IntegerConstant) {
			if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
				checked = true;
			} else if (right instanceof NullValue) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG138.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						checked = true;
					} else if (((DataVariable) right).getDatatype().equals("Double")) {
						checked = true;
					} else if (((DataVariable) right).getDatatype().equals("Currency")) {
						checked = true;
					} else {
						err = "MSG139: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG140: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DoubleConstant) {
			if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
				checked = true;
			} else if (right instanceof NullValue) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG140.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals("Integer")) {
						checked = true;
					} else if (((DataVariable) right).getDatatype().equals("Double")) {
						checked = true;
					} else if (((DataVariable) right).getDatatype().equals("Currency")) {
						checked = true;
					} else {
						err = "MSG141: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG142: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof StringConstant) {
			if (right instanceof NullValue) {
				checked = true;
			} else if (right instanceof StringConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG142.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals("String")) {
						checked = true;
					} else {
						err = "MSG143: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG144: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof BooleanConstant) {
			if (right instanceof NullValue) {
				checked = true;
			} else if (right instanceof BooleanConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG144.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals("Boolean")) {
						checked = true;
					} else {
						err = "MSG145: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG146: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DateTimeConstant) {
			if (right instanceof NullValue) {
				checked = true;
			} else if (right instanceof DateTimeConstant) {
				if (((DateTimeConstant) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
					checked = true;
				} else {
					err = "MSG147: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				}
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG147.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals(((DateTimeConstant) left).getDatatype())) {
						checked = true;
					} else {
						err = "MSG148: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG149: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof FileConstant) {
			if (right instanceof NullValue) {
				checked = true;
			} else if (right instanceof FileConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG149.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals("File")) {
						checked = true;
					} else {
						err = "MSG150: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG151: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof HandwritingConstant) {
			if (right instanceof NullValue) {
				checked = true;
			} else if (right instanceof HandwritingConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG151.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals("Handwriting")) {
						checked = true;
					} else {
						err = "MSG152: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG153: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof JSONConstant) {
			if (right instanceof NullValue) {
				checked = true;
			} else if (right instanceof JSONConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG153.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals("JSONData")) {
						checked = true;
					} else {
						err = "MSG154: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG155: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof NullValue) {
			if (right instanceof NullValue || right instanceof BooleanConstant || right instanceof DoubleConstant
					|| right instanceof DateTimeConstant || right instanceof FileConstant
					|| right instanceof HandwritingConstant || right instanceof IntegerConstant
					|| right instanceof JSONConstant || right instanceof StringConstant
					|| right instanceof TimDurationConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				checked = true;
			} else {
				err = "MSG156: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof TimDurationConstant) {
			if (right instanceof NullValue) {
				checked = true;
			} else if (right instanceof TimDurationConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG156.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
						checked = true;
					} else {
						err = "MSG157: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					}
				}
			} else {
				err = "MSG158: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DataVariable) {
			if (left instanceof ArrayDataVariable) {
				err = "MSG158.1: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
						+ start.getText() + "' has something wrong";
			} else {
				if (((DataVariable) left).getDatatype().equals("Integer")) {
					if (right instanceof NullValue) {
						checked = true;
					} else if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
						checked = true;
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG158.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " variable '" + stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("Integer")) {
								checked = true;
							} else if (((DataVariable) right).getDatatype().equals("Double")) {
								checked = true;
							} else if (((DataVariable) right).getDatatype().equals("Currency")) {
								checked = true;
							} else {
								err = "MSG159: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant/variable '" + stop.getText() + "' has something wrong";
							}
						}
					}
				} else if (((DataVariable) left).getDatatype().equals("Double") ||
						((DataVariable) left).getDatatype().equals("Currency")) {
					if (right instanceof NullValue) {
						checked = true;
					} else if (right instanceof IntegerConstant || right instanceof DoubleConstant) {
						checked = true;
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG159.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " variable '" + stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("Integer")) {
								checked = true;
							} else if (((DataVariable) right).getDatatype().equals("Double")) {
								checked = true;
							} else if (((DataVariable) right).getDatatype().equals("Currency")) {
								checked = true;
							} else {
								err = "MSG160: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant/variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG161: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				} else if (((DataVariable) left).getDatatype().equals("String")) {
					if (right instanceof NullValue) {
						checked = true;
					} else if (right instanceof StringConstant) {
						checked = true;
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG161.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " variable '" + stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("String")) {
								checked = true;
							} else {
								err = "MSG162: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant/variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG163: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				} else if (((DataVariable) left).getDatatype().equals("Boolean")) {
					if (right instanceof NullValue) {
						checked = true;
					} else if (right instanceof BooleanConstant) {
						checked = true;
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG163.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " variable '" + stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("Boolean")) {
								checked = true;
							} else {
								err = "MSG164: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant/variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG165: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				} else if (((DataVariable) left).getDatatype().equals("DateTime")
						|| ((DataVariable) left).getDatatype().equals("Date")
						|| ((DataVariable) left).getDatatype().equals("Time")) {
					if (right instanceof NullValue) {
						checked = true;
					} else if (right instanceof DateTimeConstant) {
						if (((DataVariable) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
							checked = true;
						} else {
							err = "MSG166: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant '"
									+ stop.getText() + "' has something wrong";
						}
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG166.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " variable '" + stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals(((DataVariable) left).getDatatype())) {
								checked = true;
							} else {
								err = "MSG167: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant/variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG168: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				} else if (((DataVariable) left).getDatatype().equals("File")) {
					if (right instanceof NullValue) {
						checked = true;
					} else if (right instanceof FileConstant) {
						checked = true;
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG168.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " variable '" + stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("File")) {
								checked = true;
							} else {
								err = "MSG169: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant/variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG170: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				} else if (((DataVariable) left).getDatatype().equals("Handwriting")) {
					if (right instanceof NullValue) {
						checked = true;
					} else if (right instanceof HandwritingConstant) {
						checked = true;
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG170.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " variable '" + stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("Handwriting")) {
								checked = true;
							} else {
								err = "MSG171: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant/variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG172: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				} else if (((DataVariable) left).getDatatype().equals("JSONData")) {
					if (right instanceof NullValue) {
						checked = true;
					} else if (right instanceof JSONConstant) {
						checked = true;
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG172.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " variable '" + stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("JSONData")) {
								checked = true;
							} else {
								err = "MSG173: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant/variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG174: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				} else if (((DataVariable) left).getDatatype().equals("TimeDuration")) {
					if (right instanceof NullValue) {
						checked = true;
					} else if (right instanceof TimDurationConstant) {
						checked = true;
					} else if (right instanceof DataVariable) {
						if (right instanceof ArrayDataVariable) {
							err = "MSG174.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " variable '" + stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
								checked = true;
							} else {
								err = "MSG175: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " constant/variable '" + stop.getText() + "' has something wrong";
							}
						}
					} else {
						err = "MSG176: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
					}
				} else {
					err = "MSG177: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				}
			}
		} else {
			err = "MSG178: line " + start.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
					+ stop.getText() + "' has something wrong";
		} // !=

		if (!checked) {
			throw new RuntimeException(err);
		}

		// !=
		if (left instanceof IntegerConstant) {
			int a = Integer.parseInt(((IntegerConstant) left).getValue());
			BooleanConstant c = new BooleanConstant();
			if (right instanceof IntegerConstant) {
				int b = Integer.parseInt(((IntegerConstant) right).getValue());
				c.setValue(String.valueOf(a != b));
				return c;
			} else if (right instanceof DoubleConstant) {
				double b = Double.parseDouble(((DoubleConstant) right).getValue());
				c.setValue(String.valueOf(a != b));
				return c;
			} else if (right instanceof NullValue) {
				c.setValue("true");
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Integer")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (d instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) d).getValue());
						c.setValue(String.valueOf(a != b));
						return c;
					}
				} else if (((DataVariable) right).getDatatype().equals("Double")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (d instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(a != b));
						return c;
					}
				} else if (((DataVariable) right).getDatatype().equals("Currency")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (d instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(a != b));
						return c;
					}
				}
			}
		} else if (left instanceof DoubleConstant) {
			Double a = new Double(Double.parseDouble(((IntegerConstant) left).getValue()));
			BooleanConstant c = new BooleanConstant();
			if (right instanceof IntegerConstant) {
				int b = Integer.parseInt(((IntegerConstant) right).getValue());
				c.setValue(String.valueOf(a != b));
				return c;
			} else if (right instanceof DoubleConstant) {
				double b = Double.parseDouble(((DoubleConstant) right).getValue());
				c.setValue(String.valueOf(a != b));
				return c;
			} else if (right instanceof NullValue) {
				c.setValue("true");
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Integer")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (d instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) d).getValue());
						c.setValue(String.valueOf(a != b));
						return c;
					}
				} else if (((DataVariable) right).getDatatype().equals("Double")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (d instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(a != b));
						return c;
					}
				} else if (((DataVariable) right).getDatatype().equals("Currency")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (d instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(a != b));
						return c;
					}
				}
			}
		} else if (left instanceof StringConstant) {
			String s = ((StringConstant) left).getValue();
			BooleanConstant c = new BooleanConstant();
			if (right instanceof NullValue) {
				c.setValue("true");
				return c;
			} else if (right instanceof StringConstant) {
				String s1 = ((StringConstant) right).getValue();
				c.setValue(String.valueOf(!s.equals(s1)));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("String")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (d instanceof StringConstant) {
						String s1 = ((StringConstant) d).getValue();
						c.setValue(String.valueOf(!s.equals(s1)));
						return c;
					}
				}
			}
		} else if (left instanceof BooleanConstant) {
			boolean a = Boolean.parseBoolean(((BooleanConstant) left).getValue());
			BooleanConstant c = new BooleanConstant();
			if (right instanceof NullValue) {
				c.setValue("true");
				return c;
			} else if (right instanceof BooleanConstant) {
				Boolean b = new Boolean(Boolean.parseBoolean(((BooleanConstant) right).getValue()));
				c.setValue(String.valueOf(a != b));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Boolean")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (d instanceof BooleanConstant) {
						boolean b = Boolean.parseBoolean(((BooleanConstant) d).getValue());
						c.setValue(String.valueOf(a != b));
						return c;
					}
				}
			}
		} else if (left instanceof DateTimeConstant) {
			long a = ((DateTimeConstant) left).getRealTime();
			BooleanConstant c = new BooleanConstant();
			if (right instanceof NullValue) {
				c.setValue("true");
				return c;
			} else if (right instanceof DateTimeConstant) {
				if (((DateTimeConstant) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
					long b = ((DateTimeConstant) right).getRealTime();
					c.setValue(String.valueOf(a != b));
					return c;
				}
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals(((DateTimeConstant) left).getDatatype())) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (d instanceof DateTimeConstant) {
						long b = ((DateTimeConstant) d).getRealTime();
						c.setValue(String.valueOf(a != b));
						return c;
					}
				}
			}
		} else if (left instanceof FileConstant) {
			FileConstant a = (FileConstant) left;
			BooleanConstant c = new BooleanConstant();
			if (right instanceof NullValue) {
				c.setValue("true");
				return c;
			} else if (right instanceof FileConstant) {
				FileConstant b = (FileConstant) right;
				c.setValue(String.valueOf(!a.equals(b)));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("File")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (d instanceof FileConstant) {
						c.setValue(String.valueOf(!a.equals(d)));
						return c;
					}
				}
			}
		} else if (left instanceof HandwritingConstant) {
			HandwritingConstant a = (HandwritingConstant) left;
			BooleanConstant c = new BooleanConstant();
			if (right instanceof NullValue) {
				c.setValue("true");
				return c;
			} else if (right instanceof HandwritingConstant) {
				HandwritingConstant b = (HandwritingConstant) right;
				c.setValue(String.valueOf(!a.equals(b)));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Handwriting")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (d instanceof HandwritingConstant) {
						c.setValue(String.valueOf(!a.equals(d)));
						return c;
					}
				}
			}
		} else if (left instanceof JSONConstant) {
			JSONConstant a = (JSONConstant) left;
			BooleanConstant c = new BooleanConstant();
			if (right instanceof NullValue) {
				c.setValue("true");
				return c;
			} else if (right instanceof JSONConstant) {
				JSONConstant b = (JSONConstant) right;
				c.setValue(String.valueOf(!a.equals(b)));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("JSONData")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (d instanceof JSONConstant) {
						c.setValue(String.valueOf(!a.equals(d)));
						return c;
					}
				}
			}
		} else if (left instanceof NullValue) {
			BooleanConstant c = new BooleanConstant();
			if (right instanceof NullValue) {
				c.setValue("false");
				return c;
			} else if (right instanceof BooleanConstant || right instanceof DoubleConstant
					|| right instanceof DateTimeConstant || right instanceof FileConstant
					|| right instanceof HandwritingConstant || right instanceof IntegerConstant
					|| right instanceof JSONConstant || right instanceof StringConstant
					|| right instanceof TimDurationConstant) {
				c.setValue("true");
				return c;
			}
		} else if (left instanceof TimDurationConstant) {
			TimDurationConstant a = (TimDurationConstant) left;
			BooleanConstant c = new BooleanConstant();
			if (right instanceof NullValue) {
				c.setValue("true");
				return c;
			} else if (right instanceof TimDurationConstant) {
				TimDurationConstant b = (TimDurationConstant) right;
				c.setValue(String.valueOf(!a.equals(b)));
				return c;
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (d instanceof TimDurationConstant) {
						c.setValue(String.valueOf(!a.equals(d)));
						return c;
					}
				}
			}
		} else if (left instanceof DataVariable) {
			BooleanConstant c = new BooleanConstant();
			if (((DataVariable) left).getDatatype().equals("Integer")) {
				Object d = ((DataVariable) left).getValue(); // left value
				if (d instanceof NullValue) {
					if (right instanceof NullValue) {
						c.setValue("false");
						return c;
					} else {
						c.setValue("true");
						return c;
					}
				} else if (d instanceof IntegerConstant) {
					if (right instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (right instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) right).getValue());
						int e = Integer.parseInt(((IntegerConstant) d).getValue());
						c.setValue(String.valueOf(e != b));
						return c;
					} else if (right instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) right).getValue());
						int e = Integer.parseInt(((IntegerConstant) d).getValue());
						c.setValue(String.valueOf(e != b));
						return c;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							Object f = ((DataVariable) right).getValue(); // right
																			// value
							if (f instanceof NullValue) {
								c.setValue("true");
								return c;
							} else if (f instanceof IntegerConstant) {
								int b = Integer.parseInt(((IntegerConstant) d).getValue());
								int e = Integer.parseInt(((IntegerConstant) f).getValue());
								c.setValue(String.valueOf(e != b));
								return c;
							}
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							Object f = ((DataVariable) right).getValue(); // right
																			// value
							if (f instanceof NullValue) {
								c.setValue("true");
								return c;
							} else if (f instanceof DoubleConstant) {
								int b = Integer.parseInt(((IntegerConstant) d).getValue());
								double e = Double.parseDouble(((DoubleConstant) f).getValue());
								c.setValue(String.valueOf(e != b));
								return c;
							}
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							Object f = ((DataVariable) right).getValue(); // right
																			// value
							if (f instanceof NullValue) {
								c.setValue("true");
								return c;
							} else if (f instanceof DoubleConstant) {
								int b = Integer.parseInt(((IntegerConstant) d).getValue());
								double e = Double.parseDouble(((DoubleConstant) f).getValue());
								c.setValue(String.valueOf(e != b));
								return c;
							}
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("Double") ||
					((DataVariable) left).getDatatype().equals("Currency")) {
				Object d = ((DataVariable) left).getValue(); // left value
				if (d instanceof NullValue) {
					if (right instanceof NullValue) {
						c.setValue("false");
						return c;
					} else {
						c.setValue("true");
						return c;
					}
				} else if (d instanceof DoubleConstant) {
					if (right instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (right instanceof IntegerConstant) {
						int b = Integer.parseInt(((IntegerConstant) right).getValue());
						double e = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(e != b));
						return c;
					} else if (right instanceof DoubleConstant) {
						double b = Double.parseDouble(((DoubleConstant) right).getValue());
						double e = Double.parseDouble(((DoubleConstant) d).getValue());
						c.setValue(String.valueOf(e != b));
						return c;

					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Integer")) {
							Object f = ((DataVariable) right).getValue(); // right
																			// value
							if (f instanceof NullValue) {
								c.setValue("true");
								return c;
							} else if (f instanceof IntegerConstant) {
								int e = Integer.parseInt(((IntegerConstant) f).getValue());
								double b = Double.parseDouble(((DoubleConstant) d).getValue());
								c.setValue(String.valueOf(e != b));
								return c;
							}
						} else if (((DataVariable) right).getDatatype().equals("Double")) {
							Object f = ((DataVariable) right).getValue(); // right
																			// value
							if (f instanceof NullValue) {
								c.setValue("true");
								return c;
							} else if (f instanceof DoubleConstant) {
								double e = Double.parseDouble(((DoubleConstant) f).getValue());
								double b = Double.parseDouble(((DoubleConstant) d).getValue());
								c.setValue(String.valueOf(e != b));
								return c;
							}
						} else if (((DataVariable) right).getDatatype().equals("Currency")) {
							Object f = ((DataVariable) right).getValue(); // right
																			// value
							if (f instanceof NullValue) {
								c.setValue("true");
								return c;
							} else if (f instanceof DoubleConstant) {
								double e = Double.parseDouble(((DoubleConstant) f).getValue());
								double b = Double.parseDouble(((DoubleConstant) d).getValue());
								c.setValue(String.valueOf(e != b));
								return c;
							}
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("String")) {
				Object d = ((DataVariable) left).getValue(); // left value
				if (d instanceof NullValue) {
					if (right instanceof NullValue) {
						c.setValue("false");
						return c;
					} else {
						c.setValue("true");
						return c;
					}
				} else if (d instanceof StringConstant) {
					if (right instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (right instanceof StringConstant) {
						String a = ((StringConstant) d).getValue();
						String b = ((StringConstant) right).getValue();
						c.setValue(String.valueOf(!a.equals(b)));
						return c;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("String")) {
							Object f = ((DataVariable) right).getValue(); // right
																			// value
							if (f instanceof NullValue) {
								c.setValue("true");
								return c;
							} else if (f instanceof StringConstant) {
								String a = ((StringConstant) d).getValue();
								String e = ((StringConstant) f).getValue();
								c.setValue(String.valueOf(!a.equals(e)));
								return c;
							}
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("Boolean")) {
				Object d = ((DataVariable) left).getValue(); // left value
				if (d instanceof NullValue) {
					if (right instanceof NullValue) {
						c.setValue("false");
						return c;
					} else {
						c.setValue("true");
						return c;
					}
				} else if (d instanceof BooleanConstant) {
					if (right instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (right instanceof BooleanConstant) {
						String a = ((BooleanConstant) d).getValue();
						String e = ((BooleanConstant) right).getValue();
						c.setValue(String.valueOf(!a.equals(e)));
						return c;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Boolean")) {
							Object f = ((DataVariable) right).getValue();
							if (f instanceof NullValue) {
								c.setValue("true");
								return c;
							} else if (f instanceof StringConstant) {
								String a = ((BooleanConstant) d).getValue();
								String e = ((BooleanConstant) f).getValue();
								c.setValue(String.valueOf(!a.equals(e)));
								return c;
							}
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("DateTime")
					|| ((DataVariable) left).getDatatype().equals("Date")
					|| ((DataVariable) left).getDatatype().equals("Time")) {
				Object d = ((DataVariable) left).getValue(); // left value
				if (d instanceof NullValue) {
					if (right instanceof NullValue) {
						c.setValue("false");
						return c;
					} else {
						c.setValue("true");
						return c;
					}
				} else if (d instanceof DateTimeConstant) {
					if (right instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (right instanceof DateTimeConstant) {
						if (((DataVariable) left).getDatatype().equals(((DateTimeConstant) right).getDatatype())) {
							DateTimeConstant a = (DateTimeConstant) d;
							DateTimeConstant e = (DateTimeConstant) right;
							c.setValue(String.valueOf(!a.equals(e)));
							return c;
						}
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals(((DataVariable) left).getDatatype())) {
							Object f = ((DataVariable) right).getValue();
							if (f instanceof NullValue) {
								c.setValue("true");
								return c;
							} else if (f instanceof DateTimeConstant) {
								DateTimeConstant a = (DateTimeConstant) d;
								DateTimeConstant e = (DateTimeConstant) f;
								c.setValue(String.valueOf(!a.equals(e)));
								return c;
							}
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("File")) {
				Object d = ((DataVariable) left).getValue(); // left value
				if (d instanceof NullValue) {
					if (right instanceof NullValue) {
						c.setValue("false");
						return c;
					} else {
						c.setValue("true");
						return c;
					}
				} else if (d instanceof DateTimeConstant) {
					if (right instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (right instanceof FileConstant) {
						FileConstant a = (FileConstant) d;
						FileConstant e = (FileConstant) right;
						c.setValue(String.valueOf(!a.equals(e)));
						return c;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("File")) {
							Object f = ((DataVariable) right).getValue();
							if (f instanceof NullValue) {
								c.setValue("true");
								return c;
							} else if (f instanceof FileConstant) {
								FileConstant a = (FileConstant) d;
								FileConstant e = (FileConstant) f;
								c.setValue(String.valueOf(!a.equals(e)));
								return c;
							}
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("Handwriting")) {
				Object d = ((DataVariable) left).getValue(); // left value
				if (d instanceof NullValue) {
					if (right instanceof NullValue) {
						c.setValue("false");
						return c;
					} else {
						c.setValue("true");
						return c;
					}
				} else if (d instanceof HandwritingConstant) {
					if (right instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (right instanceof HandwritingConstant) {
						HandwritingConstant a = (HandwritingConstant) d;
						HandwritingConstant e = (HandwritingConstant) right;
						c.setValue(String.valueOf(!a.equals(e)));
						return c;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("Handwriting")) {
							Object f = ((DataVariable) right).getValue();
							if (f instanceof NullValue) {
								c.setValue("true");
								return c;
							} else if (f instanceof HandwritingConstant) {
								HandwritingConstant a = (HandwritingConstant) d;
								HandwritingConstant e = (HandwritingConstant) f;
								c.setValue(String.valueOf(!a.equals(e)));
								return c;
							}
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("JSONData")) {
				Object d = ((DataVariable) left).getValue(); // left value
				if (d instanceof NullValue) {
					if (right instanceof NullValue) {
						c.setValue("false");
						return c;
					} else {
						c.setValue("true");
						return c;
					}
				} else if (d instanceof JSONConstant) {
					if (right instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (right instanceof JSONConstant) {
						JSONConstant a = (JSONConstant) d;
						JSONConstant e = (JSONConstant) right;
						c.setValue(String.valueOf(!a.equals(e)));
						return c;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("JSONData")) {
							Object f = ((DataVariable) right).getValue();
							if (f instanceof NullValue) {
								c.setValue("true");
								return c;
							} else if (f instanceof JSONConstant) {
								JSONConstant a = (JSONConstant) d;
								JSONConstant e = (JSONConstant) f;
								c.setValue(String.valueOf(!a.equals(e)));
								return c;
							}
						}
					}
				}
			} else if (((DataVariable) left).getDatatype().equals("TimeDuration")) {
				Object d = ((DataVariable) left).getValue(); // left value
				if (d instanceof NullValue) {
					if (right instanceof NullValue) {
						c.setValue("false");
						return c;
					} else {
						c.setValue("true");
						return c;
					}
				} else if (d instanceof TimDurationConstant) {
					if (right instanceof NullValue) {
						c.setValue("true");
						return c;
					} else if (right instanceof TimDurationConstant) {
						TimDurationConstant a = (TimDurationConstant) d;
						TimDurationConstant e = (TimDurationConstant) right;
						c.setValue(String.valueOf(!a.equals(e)));
						return c;
					} else if (right instanceof DataVariable) {
						if (((DataVariable) right).getDatatype().equals("TimeDuration")) {
							Object f = ((DataVariable) right).getValue();
							if (f instanceof NullValue) {
								c.setValue("true");
								return c;
							} else if (f instanceof TimDurationConstant) {
								TimDurationConstant a = (TimDurationConstant) d;
								TimDurationConstant e = (TimDurationConstant) f;
								c.setValue(String.valueOf(!a.equals(e)));
								return c;
							}
						}
					}
				}
			}
		} // !=

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
	public WorkflowEntity visitAnd(ConditionalExpressionParser.LogicalContext ctx) {
		// get value of left subexpression
		ExpressionContext le = ctx.expression(0);
		WorkflowEntity left = (WorkflowEntity) visit(le);
		// get value of right subexpression
		ExpressionContext re = ctx.expression(1);
		WorkflowEntity right = (WorkflowEntity) visit(re);
		Token start = ctx.getStart();
		Token stop = ctx.getStop();
		boolean checked = false;

		String err = null;
		if (left instanceof BooleanConstant) {
			if (right instanceof BooleanConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG202.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						err = "MSG203: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Boolean")) {
							checked = true;
						} else {
							err = "MSG204: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				}
			} else {
				err = "MSG205: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DataVariable) {
			if (left instanceof ArrayDataVariable) {
				err = "MSG205.1: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
						+ start.getText() + "' has something wrong";
			} else {
				if (right instanceof BooleanConstant) {
					checked = true;
				} else if (right instanceof DataVariable) {
					if (right instanceof ArrayDataVariable) {
						err = "MSG205.2: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						Object d = ((DataVariable) right).getValue();
						if (d instanceof NullValue) {
							err = "MSG206: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("Boolean")) {
								checked = true;
							} else {
								err = "MSG207: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							}
						}
					}
				} else {
					err = "MSG208: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				}
			}
		} else {
			err = "MSG209: line " + start.getLine() + ":" + start.getCharPositionInLine() + " constant/variable '"
					+ start.getText() + "' has something wrong";
		}

		if (!checked) {
			throw new RuntimeException(err);
		}

		BooleanConstant r = new BooleanConstant();
		if (left instanceof BooleanConstant) {
			String v = ((BooleanConstant) left).getValue();
			if (v != null) {
				v = v.toLowerCase();
				if (v.equals("真")) {
					v = "true";
				} else if (v.equals("假")) {
					v = "false";
				}
			} else {
				err = "MSG210: line " + start.getLine() + ":" + start.getCharPositionInLine() + " constant/variable '"
						+ start.getText() + "' has something wrong";
				throw new RuntimeException(err);
			}
			boolean b = Boolean.parseBoolean(v);
			if (right instanceof BooleanConstant) {
				String v1 = ((BooleanConstant) right).getValue();
				if (v1 != null) {
					v1 = v1.toLowerCase();
					if (v1.equals("真")) {
						v1 = "true";
					} else if (v1.equals("假")) {
						v1 = "false";
					}
					boolean b1 = Boolean.parseBoolean(v1);
					r.setValue(String.valueOf(b && b1));
					return r;
				} else {
					err = "MSG211: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
					throw new RuntimeException(err);
				}
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Boolean")) {
					Object c = ((DataVariable) right).getValue();
					if (c instanceof NullValue) {
						err = "MSG222: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
						throw new RuntimeException(err);
					} else if (c instanceof BooleanConstant) {
						String v1 = ((BooleanConstant) c).getValue().toLowerCase();
						if (v1.equals("真")) {
							v1 = "true";
						} else if (v1.equals("假")) {
							v1 = "false";
						}
						boolean b1 = Boolean.parseBoolean(v1);
						r.setValue(String.valueOf(b && b1));
						return r;
					} else {
						err = "MSG223: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
						throw new RuntimeException(err);
					}
				}
			}
		} else if (left instanceof DataVariable) {
			Object c = ((DataVariable) left).getValue();
			if (c instanceof NullValue) {
				err = "MSG224: line " + start.getLine() + ":" + start.getCharPositionInLine() + " constant/variable '"
						+ start.getText() + "' has something wrong";
				throw new RuntimeException(err);
			} else if (c instanceof BooleanConstant) {
				String v1 = ((BooleanConstant) c).getValue().toLowerCase();
				if (v1.equals("真")) {
					v1 = "true";
				} else if (v1.equals("假")) {
					v1 = "false";
				}
				boolean b1 = Boolean.parseBoolean(v1);
				if (right instanceof BooleanConstant) {
					String v2 = ((BooleanConstant) right).getValue();
					if (v2 != null) {
						v2 = v2.toLowerCase();
						if (v2.equals("真")) {
							v2 = "true";
						} else if (v2.equals("假")) {
							v2 = "false";
						}
						boolean b2 = Boolean.parseBoolean(v2);
						r.setValue(String.valueOf(b1 && b2));
						return r;
					} else {
						err = "MSG225: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
						throw new RuntimeException(err);
					}

				} else if (right instanceof DataVariable) {
					if (((DataVariable) right).getDatatype().equals("Boolean")) {
						Object c2 = ((DataVariable) right).getValue();
						if (c2 instanceof NullValue) {
							err = "MSG226: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
							throw new RuntimeException(err);
						} else if (c2 instanceof BooleanConstant) {
							String v2 = ((BooleanConstant) c2).getValue().toLowerCase();
							if (v2.equals("真")) {
								v2 = "true";
							} else if (v2.equals("假")) {
								v2 = "false";
							}
							boolean b2 = Boolean.parseBoolean(v2);
							r.setValue(String.valueOf(b1 && b2));
							return r;
						} else {
							err = "MSG227: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
							throw new RuntimeException(err);
						}
					}
				}
			} else {
				err = "MSG228: line " + start.getLine() + ":" + start.getCharPositionInLine() + " constant/variable '"
						+ start.getText() + "' has something wrong";
				throw new RuntimeException(err);
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
	public WorkflowEntity visitOr(ConditionalExpressionParser.LogicalContext ctx) {
		// get value of left subexpression
		ExpressionContext le = ctx.expression(0);
		WorkflowEntity left = (WorkflowEntity) visit(le);
		// get value of right subexpression
		ExpressionContext re = ctx.expression(1);
		WorkflowEntity right = (WorkflowEntity) visit(re);
		Token start = ctx.getStart();
		Token stop = ctx.getStop();
		boolean checked = false;

		String err = null;
		if (left instanceof BooleanConstant) {
			if (right instanceof BooleanConstant) {
				checked = true;
			} else if (right instanceof DataVariable) {
				if (right instanceof ArrayDataVariable) {
					err = "MSG202.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				} else {
					Object d = ((DataVariable) right).getValue();
					if (d instanceof NullValue) {
						err = "MSG203: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						if (((DataVariable) right).getDatatype().equals("Boolean")) {
							checked = true;
						} else {
							err = "MSG204: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						}
					}
				}
			} else {
				err = "MSG205: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
			}
		} else if (left instanceof DataVariable) {
			if (left instanceof ArrayDataVariable) {
				err = "MSG205.1: line " + start.getLine() + ":" + start.getCharPositionInLine() + " variable '"
						+ start.getText() + "' has something wrong";
			} else {
				if (right instanceof BooleanConstant) {
					checked = true;
				} else if (right instanceof DataVariable) {
					if (right instanceof ArrayDataVariable) {
						err = "MSG205.2: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
								+ stop.getText() + "' has something wrong";
					} else {
						Object d = ((DataVariable) right).getValue();
						if (d instanceof NullValue) {
							err = "MSG206: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
									+ stop.getText() + "' has something wrong";
						} else {
							if (((DataVariable) right).getDatatype().equals("Boolean")) {
								checked = true;
							} else {
								err = "MSG207: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
										+ " variable '" + stop.getText() + "' has something wrong";
							}
						}
					}
				} else {
					err = "MSG208: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
				}
			}
		} else {
			err = "MSG209: line " + start.getLine() + ":" + start.getCharPositionInLine() + " constant/variable '"
					+ start.getText() + "' has something wrong";
		}

		if (!checked) {
			throw new RuntimeException(err);
		}

		BooleanConstant r = new BooleanConstant();
		if (left instanceof BooleanConstant) {
			String v = ((BooleanConstant) left).getValue();
			if (v != null) {
				v = v.toLowerCase();
				if (v.equals("真")) {
					v = "true";
				} else if (v.equals("假")) {
					v = "false";
				}
			} else {
				err = "MSG210: line " + start.getLine() + ":" + start.getCharPositionInLine() + " constant/variable '"
						+ start.getText() + "' has something wrong";
				throw new RuntimeException(err);
			}
			boolean b = Boolean.parseBoolean(v);
			if (right instanceof BooleanConstant) {
				String v1 = ((BooleanConstant) right).getValue();
				if (v1 != null) {
					v1 = v1.toLowerCase();
					if (v1.equals("真")) {
						v1 = "true";
					} else if (v1.equals("假")) {
						v1 = "false";
					}
					boolean b1 = Boolean.parseBoolean(v1);
					r.setValue(String.valueOf(b || b1));
					return r;
				} else {
					err = "MSG211: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
					throw new RuntimeException(err);
				}
			} else if (right instanceof DataVariable) {
				if (((DataVariable) right).getDatatype().equals("Boolean")) {
					Object c = ((DataVariable) right).getValue();
					if (c instanceof NullValue) {
						err = "MSG222: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
						throw new RuntimeException(err);
					} else if (c instanceof BooleanConstant) {
						String v1 = ((BooleanConstant) c).getValue().toLowerCase();
						if (v1.equals("真")) {
							v1 = "true";
						} else if (v1.equals("假")) {
							v1 = "false";
						}
						boolean b1 = Boolean.parseBoolean(v1);
						r.setValue(String.valueOf(b || b1));
						return r;
					} else {
						err = "MSG223: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
						throw new RuntimeException(err);
					}
				}
			}
		} else if (left instanceof DataVariable) {
			Object c = ((DataVariable) left).getValue();
			if (c instanceof NullValue) {
				err = "MSG224: line " + start.getLine() + ":" + start.getCharPositionInLine() + " constant/variable '"
						+ start.getText() + "' has something wrong";
				throw new RuntimeException(err);
			} else if (c instanceof BooleanConstant) {
				String v1 = ((BooleanConstant) c).getValue().toLowerCase();
				if (v1.equals("真")) {
					v1 = "true";
				} else if (v1.equals("假")) {
					v1 = "false";
				}
				boolean b1 = Boolean.parseBoolean(v1);
				if (right instanceof BooleanConstant) {
					String v2 = ((BooleanConstant) right).getValue();
					if (v2 != null) {
						v2 = v2.toLowerCase();
						if (v2.equals("真")) {
							v2 = "true";
						} else if (v2.equals("假")) {
							v2 = "false";
						}
						boolean b2 = Boolean.parseBoolean(v2);
						r.setValue(String.valueOf(b1 || b2));
						return r;
					} else {
						err = "MSG225: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
								+ " constant/variable '" + stop.getText() + "' has something wrong";
						throw new RuntimeException(err);
					}

				} else if (right instanceof DataVariable) {
					if (((DataVariable) right).getDatatype().equals("Boolean")) {
						Object c2 = ((DataVariable) right).getValue();
						if (c2 instanceof NullValue) {
							err = "MSG226: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
							throw new RuntimeException(err);
						} else if (c2 instanceof BooleanConstant) {
							String v2 = ((BooleanConstant) c2).getValue().toLowerCase();
							if (v2.equals("真")) {
								v2 = "true";
							} else if (v2.equals("假")) {
								v2 = "false";
							}
							boolean b2 = Boolean.parseBoolean(v2);
							r.setValue(String.valueOf(b1 || b2));
							return r;
						} else {
							err = "MSG227: line " + stop.getLine() + ":" + stop.getCharPositionInLine()
									+ " constant/variable '" + stop.getText() + "' has something wrong";
							throw new RuntimeException(err);
						}
					}
				}
			} else {
				err = "MSG228: line " + start.getLine() + ":" + start.getCharPositionInLine() + " constant/variable '"
						+ start.getText() + "' has something wrong";
				throw new RuntimeException(err);
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
	public WorkflowEntity visitNot(ConditionalExpressionParser.NotContext ctx) {
		ExpressionContext re = ctx.expression();
		WorkflowEntity right = (WorkflowEntity) visit(re);
		// get value of right subexpression
		Token stop = ctx.getStop();
		boolean checked = false;
		String err = null;
		if (right instanceof BooleanConstant) {
			checked = true;
		} else if (right instanceof DataVariable) {
			if (right instanceof ArrayDataVariable) {
				err = "MSG228.1: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
						+ stop.getText() + "' has something wrong";
			} else {
				if (((DataVariable) right).getDatatype().equals("Boolean")) {
					checked = true;
				} else {
					err = "MSG229: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " variable '"
							+ stop.getText() + "' has something wrong";
				}
			}
		} else {
			err = "MSG230: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
					+ stop.getText() + "' has something wrong";
		}

		if (!checked) {
			throw new RuntimeException(err);
		}

		if (right instanceof BooleanConstant) {
			if (((BooleanConstant) right).getValue() != null) {
				String v = ((BooleanConstant) right).getValue().toLowerCase();
				if (v.equals("真")) {
					v = "true";
				} else if (v.equals("假")) {
					v = "false";
				}
				boolean b = Boolean.parseBoolean(v);
				BooleanConstant c = new BooleanConstant();
				c.setValue(String.valueOf(!b));
				return c;
			} else {
				err = "MSG231: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
				throw new RuntimeException(err);
			}
		} else if (right instanceof DataVariable) {
			if (((DataVariable) right).getDatatype().equals("Boolean")) {
				Object c = ((DataVariable) right).getValue();
				if (c instanceof NullValue) {
					err = "MSG232: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
					throw new RuntimeException(err);
				} else if (c instanceof BooleanConstant) {
					String v = ((BooleanConstant) c).getValue();
					if (v.equals("真")) {
						v = "true";
					} else if (v.equals("假")) {
						v = "false";
					}
					boolean b = Boolean.parseBoolean(v);
					BooleanConstant cc = new BooleanConstant();
					cc.setValue(String.valueOf(!b));
					return cc;
				} else {
					err = "MSG233: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
							+ stop.getText() + "' has something wrong";
					throw new RuntimeException(err);
				}
			} else {
				err = "MSG232: line " + stop.getLine() + ":" + stop.getCharPositionInLine() + " constant/variable '"
						+ stop.getText() + "' has something wrong";
				throw new RuntimeException(err);
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
	public WorkflowEntity visitStr(ConditionalExpressionParser.StrContext ctx) {
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
	public WorkflowEntity visitNil(ConditionalExpressionParser.NilContext ctx) {
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
	public WorkflowEntity visitArray(ConditionalExpressionParser.ArrayContext ctx) {
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
	public WorkflowEntity visitPositiveNegative(ConditionalExpressionParser.PositiveNegativeContext ctx) {
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
		if (ctx.op.getType() == ConditionalExpressionParser.PLUS
				|| ctx.op.getType() == ConditionalExpressionParser.SUB) { // +/-
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

		if (ctx.op.getType() == ConditionalExpressionParser.PLUS) { // +
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
		} else if (ctx.op.getType() == ConditionalExpressionParser.SUB) { // -
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
	public WorkflowEntity visitFunction(ConditionalExpressionParser.FunctionContext ctx) {
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
	public WorkflowEntity visitMulDivMod(ConditionalExpressionParser.MulDivModContext ctx) {
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
	public WorkflowEntity visitBool(ConditionalExpressionParser.BoolContext ctx) {
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
	public WorkflowEntity visitAddSub(ConditionalExpressionParser.AddSubContext ctx) {
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
	public WorkflowEntity visitParens(ConditionalExpressionParser.ParensContext ctx) {
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
	public WorkflowEntity visitReal(ConditionalExpressionParser.RealContext ctx) {
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
	public WorkflowEntity visitID(ConditionalExpressionParser.IDContext ctx) {
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
	public WorkflowEntity visitInt(ConditionalExpressionParser.IntContext ctx) {
		return this.currExpr.fetchItembyName(ctx.getText());
		// return visitChildren(ctx);
	}
}
