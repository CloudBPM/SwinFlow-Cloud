package com.cloudibpm.core.folder;

import org.apache.commons.lang3.StringEscapeUtils;

public class JSTreeNode {
	public String id;
	public String text;
	public JSTreeNode[] children = null;
	public String parentId;
	public String data;
	public String icon;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public JSTreeNode[] getChildren() {
		return children;
	}

	public void setChildren(JSTreeNode[] children) {
		this.children = children;
	}

	public String toString() {
		return this.text;
	}

	public static String parseUTF8(String name) {
		return StringEscapeUtils.unescapeJava(name);
	}

	public static String toUTF8(String name) {
		return StringEscapeUtils.escapeJava(name);
	}

}
