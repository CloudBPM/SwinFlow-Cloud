/**
 * 
 */
package com.cloudibpm.core.runtime.wfprocess.task;

import com.cloudibpm.core.buildtime.wfprocess.Transition;

/**
 * @author Dahai Cao last updated on 20180221
 *
 */
public class TransitionInstance extends Transition {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -5532392736528031926L;
	private String definitionId = null;

	/**
	 * @param id
	 */
	public TransitionInstance(String id) {
		super(id);
	}


	/**
	 * 
	 */
	public TransitionInstance() {
	}

	/**
	 * @return the definitionId
	 */
	public String getDefinitionId() {
		return definitionId;
	}

	/**
	 * @param definitionId
	 *            the definitionId to set
	 */
	public void setDefinitionId(String definitionId) {
		this.definitionId = definitionId;
	}

}
