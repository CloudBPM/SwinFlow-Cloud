package com.cloudibpm.core.runtime.wfprocess.task;

/**
 * work assignment priority:
 * <UL>
 * <li>-1: by default;</li>
 * <li>0: normal; (low priority or general priority)</li>
 * <li>1: important; (higher priority)</li>
 * <li>2: urgent; (high priority)</li>
 * </UL>
 * 
 * @author Dahai Cao created on 2018-03-15
 */
public interface ManualTaskInstancePriority {

	public static final int DEFAULT = -1;
	
	public static final int NORMAL = 0;
	
	public static final int IMPORTANT = 1;
	
	public static final int URGENT = 2;
}
