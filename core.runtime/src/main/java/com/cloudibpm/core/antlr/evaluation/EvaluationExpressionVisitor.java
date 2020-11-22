// Generated from EvaluationExpression.g4 by ANTLR 4.7

package com.cloudibpm.core.antlr.evaluation;

import org.antlr.v4.runtime.tree.ParseTreeVisitor;

/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by {@link EvaluationExpressionParser}.
 *
 * @param <T> The return type of the visit operation. Use {@link Void} for
 * operations with no return type.
 */
public interface EvaluationExpressionVisitor<T> extends ParseTreeVisitor<T> {
	/**
	 * Visit a parse tree produced by {@link EvaluationExpressionParser#prog}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitProg(EvaluationExpressionParser.ProgContext ctx);
	/**
	 * Visit a parse tree produced by {@link EvaluationExpressionParser#stmt}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitStmt(EvaluationExpressionParser.StmtContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Array}
	 * labeled alternative in {@link EvaluationExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitArray(EvaluationExpressionParser.ArrayContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Str}
	 * labeled alternative in {@link EvaluationExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitStr(EvaluationExpressionParser.StrContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Nil}
	 * labeled alternative in {@link EvaluationExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNil(EvaluationExpressionParser.NilContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Function}
	 * labeled alternative in {@link EvaluationExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitFunction(EvaluationExpressionParser.FunctionContext ctx);
	/**
	 * Visit a parse tree produced by the {@code PositiveNegative}
	 * labeled alternative in {@link EvaluationExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitPositiveNegative(EvaluationExpressionParser.PositiveNegativeContext ctx);
	/**
	 * Visit a parse tree produced by the {@code MulDivMod}
	 * labeled alternative in {@link EvaluationExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitMulDivMod(EvaluationExpressionParser.MulDivModContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Bool}
	 * labeled alternative in {@link EvaluationExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitBool(EvaluationExpressionParser.BoolContext ctx);
	/**
	 * Visit a parse tree produced by the {@code AddSub}
	 * labeled alternative in {@link EvaluationExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitAddSub(EvaluationExpressionParser.AddSubContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Parens}
	 * labeled alternative in {@link EvaluationExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitParens(EvaluationExpressionParser.ParensContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Real}
	 * labeled alternative in {@link EvaluationExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitReal(EvaluationExpressionParser.RealContext ctx);
	/**
	 * Visit a parse tree produced by the {@code ID}
	 * labeled alternative in {@link EvaluationExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitID(EvaluationExpressionParser.IDContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Int}
	 * labeled alternative in {@link EvaluationExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitInt(EvaluationExpressionParser.IntContext ctx);
}