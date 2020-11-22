// Generated from ConditionalExpression.g4 by ANTLR 4.7

package com.cloudibpm.core.antlr.conditional;

import org.antlr.v4.runtime.tree.ParseTreeVisitor;

/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by {@link ConditionalExpressionParser}.
 *
 * @param <T> The return type of the visit operation. Use {@link Void} for
 * operations with no return type.
 */
public interface ConditionalExpressionVisitor<T> extends ParseTreeVisitor<T> {
	/**
	 * Visit a parse tree produced by {@link ConditionalExpressionParser#prog}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitProg(ConditionalExpressionParser.ProgContext ctx);
	/**
	 * Visit a parse tree produced by the {@code AddSub}
	 * labeled alternative in {@link ConditionalExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitAddSub(ConditionalExpressionParser.AddSubContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Parens}
	 * labeled alternative in {@link ConditionalExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitParens(ConditionalExpressionParser.ParensContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Logical}
	 * labeled alternative in {@link ConditionalExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitLogical(ConditionalExpressionParser.LogicalContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Int}
	 * labeled alternative in {@link ConditionalExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitInt(ConditionalExpressionParser.IntContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Comparative}
	 * labeled alternative in {@link ConditionalExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitComparative(ConditionalExpressionParser.ComparativeContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Array}
	 * labeled alternative in {@link ConditionalExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitArray(ConditionalExpressionParser.ArrayContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Str}
	 * labeled alternative in {@link ConditionalExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitStr(ConditionalExpressionParser.StrContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Nil}
	 * labeled alternative in {@link ConditionalExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNil(ConditionalExpressionParser.NilContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Function}
	 * labeled alternative in {@link ConditionalExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitFunction(ConditionalExpressionParser.FunctionContext ctx);
	/**
	 * Visit a parse tree produced by the {@code PositiveNegative}
	 * labeled alternative in {@link ConditionalExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitPositiveNegative(ConditionalExpressionParser.PositiveNegativeContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Not}
	 * labeled alternative in {@link ConditionalExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNot(ConditionalExpressionParser.NotContext ctx);
	/**
	 * Visit a parse tree produced by the {@code MulDivMod}
	 * labeled alternative in {@link ConditionalExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitMulDivMod(ConditionalExpressionParser.MulDivModContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Bool}
	 * labeled alternative in {@link ConditionalExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitBool(ConditionalExpressionParser.BoolContext ctx);
	/**
	 * Visit a parse tree produced by the {@code Real}
	 * labeled alternative in {@link ConditionalExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitReal(ConditionalExpressionParser.RealContext ctx);
	/**
	 * Visit a parse tree produced by the {@code ID}
	 * labeled alternative in {@link ConditionalExpressionParser#expression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitID(ConditionalExpressionParser.IDContext ctx);
}