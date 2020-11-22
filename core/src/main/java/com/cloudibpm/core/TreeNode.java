/**
 *
 */
package com.cloudibpm.core;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * @author Cao Dahai
 * @version 1.0.0.0
 */
public class TreeNode extends WorkflowEntity implements Comparable<TreeNode> {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 782520908549967986L;
    private String parent; // parent ID
    private TreeNode[] children = new TreeNode[0];

    public TreeNode() {
    }

    public TreeNode(String id) {
        this();
        setId(id);
    }

    public TreeNode seek(String nodename) {
        if (nodename == null)
            return null;
        if (nodename.equals(getName())) {
            return this;
        } else {
            TreeNode node = null;
            if (this.hasChildren()) {
                TreeNode[] nodes = this.getChildren();
                for (int i = 0; i < nodes.length; i++) {
                    node = nodes[i].seek(nodename);
                    if (node != null)
                        break;
                }
            }
            return node;
        }
    }

    public TreeNode seekByID(String nodeID) {
        if (nodeID == null)
            return null;
        if (nodeID.equals(getId())) {
            return this;
        } else {
            TreeNode node = null;
            if (this.hasChildren()) {
                TreeNode[] nodes = this.getChildren();
                for (int i = 0; i < nodes.length; i++) {
                    node = nodes[i].seekByID(nodeID);
                    if (node != null)
                        break;
                }
            }
            return node;
        }
    }

    public TreeNode seek(TreeNode node) {
        if (node == null)
            return null;
        if (node.equals(this)) {
            return this;
        } else {
            TreeNode child = null;
            if (this.hasChildren()) {
                TreeNode[] nodes = this.getChildren();
                for (int i = 0; i < nodes.length; i++) {
                    child = nodes[i].seek(node);
                    if (child != null)
                        break;
                }
            }
            return child;
        }
    }

    public TreeNode seekChild(String nodename) {
        if (nodename == null)
            return null;
        if (this.hasChildren()) {
            TreeNode[] nodes = this.getChildren();
            for (int i = 0; i < nodes.length; i++)
                if (nodes[i].getName().equals(nodename))
                    return nodes[i];
        }
        return null;
    }

    public TreeNode seekChildByID(String id) {
        if (id == null)
            return null;
        if (this.hasChildren()) {
            TreeNode[] nodes = this.getChildren();
            for (int i = 0; i < nodes.length; i++)
                if (nodes[i].getId().equals(id))
                    return nodes[i];
        }
        return null;
    }

    public List<TreeNode> getAllChildren() {
        if (this.hasChildren()) {
            List<TreeNode> l = new ArrayList<TreeNode>();
            TreeNode[] nodes = this.getChildren();
            for (int i = 0; i < nodes.length; i++) {
                l.add(nodes[i]);
                if (nodes[i].hasChildren()) {
                    l.addAll(nodes[i].getAllChildren());
                }
            }
            return l;
        }
        return new ArrayList<TreeNode>();
    }

    public TreeNode seekGrandchild(String nodename) {
        if (nodename == null)
            return null;
        if (this.hasChildren()) {
            TreeNode[] nodes = this.getChildren();
            for (int i = 0; i < nodes.length; i++)
                if (nodes[i].hasChildren()) {
                    TreeNode[] children = nodes[i].getChildren();
                    for (int j = 0; j < children.length; j++) {
                        if (children[j].getName().equals(nodename))
                            return children[j];
                    }
                }
        }
        return null;
    }

    public void addChild(TreeNode child) {
        if (child == null)
            return;
        int oldCapacity = this.children.length;
        this.children = Arrays.copyOf(this.children, oldCapacity + 1);
        this.children[oldCapacity++] = child;
        child.setParent(this.getId());
//        Collections.sort(Arrays.asList(this.children));
    }

    public void addOneChild(TreeNode child) {
        if (child == null)
            return;
        int oldCapacity = this.children.length;
        this.children = Arrays.copyOf(this.children, oldCapacity + 1);
        this.children[oldCapacity++] = child;
        child.setParent(this.getId());
    }

    public void append(TreeNode[] nodes) {
        if (nodes == null || nodes.length == 0) {
            return;
        }
        for (int i = 0; i < nodes.length; i++) {
            if (nodes[i] != null) {
                addChild(nodes[i]);
                nodes[i].setParent(this.getId());
                nodes[i].setOwner(this.getOwner());
            }
        }
    }

    public void cloneChildren(TreeNode parent) {
        try {
            if (this.hasChildren()) {
                TreeNode[] nodes = this.getChildren();
                TreeNode[] newNodes = new TreeNode[nodes.length];
                for (int i = 0; i < nodes.length; i++) {
                    newNodes[i] = (TreeNode) nodes[i].clone();
                    newNodes[i].setParent(parent.getId());
                    newNodes[i].setOwner(parent.getOwner());
                }
                parent.setChildren(newNodes);
            }
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
    }

    public void removeChild(TreeNode child) {
        if (child == null) {
            for (int index = 0; index < this.children.length; index++)
                if (this.children[index] == null) {
                    fastRemove(index);
                }
        } else {
            for (int index = 0; index < this.children.length; index++)
                if (child.equals(this.children[index])) {
                    fastRemove(index);
                }
        }
        Collections.sort(Arrays.asList(this.children));
    }

    /**
     * Private remove method that skips bounds checking and does not return the
     * value removed.
     */
    private void fastRemove(int index) {
        int numMoved = this.children.length - index - 1;
        if (numMoved > 0)
            System.arraycopy(this.children, index + 1, this.children, index, numMoved);
        this.children[this.children.length - 1] = null; // Let gc do its work
        this.children = Arrays.copyOf(this.children, this.children.length - 1);
    }

    /**
     * Remove a group of children nodes <code>children</code> from current tree
     * node object. <code>children</code> is object array.
     *
     * @date 2008-10-2 下午08:27:39
     * @param child
     */
    public void removeChild(TreeNode[] children) {
        for (TreeNode child : children) {
            removeChild(child);
            child.setParent(null);
        }
        Collections.sort(Arrays.asList(this.children));
    }

    /**
     * @see com.cloudibpm.core.TreeNode#setParent(com.cloudibpm.core.TreeNode)
     */
    public void setParent(String parent) {
        this.parent = parent;
    }

    /**
     * Removes all children tree nodes.
     *
     */
    public void removeAllChildren() {
        // Let gc do its work
        this.children = new TreeNode[0];
    }

    public TreeNode[] getChildren() {
        return this.children;
    }

    public String getParent() {
        return this.parent;
    }

    public boolean hasChildren() {
        return this.children.length > 0;
    }

    public void setChildren(TreeNode[] children) {
        // this.children = Arrays.asList(children);
        // 不用上边的语句是因为不产生新的this.children地址。
        if (children == null)
            return;
        for (int i = 0; i < children.length; i++) {
            addChild(children[i]);
        }
    }

    @Override
    public int compareTo(TreeNode o) {
        return this.getName().compareTo(o.getName());
    }
}