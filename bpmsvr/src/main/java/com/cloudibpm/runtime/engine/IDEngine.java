/**
 * 
 */
package com.cloudibpm.runtime.engine;

import com.cloudibpm.blo.runtime.id.RuntimeIDGenerator;
import com.cloudibpm.core.util.SystemConfig;
import com.cloudibpm.eso.runtime.idcache.IDGeneratorEso;
import org.apache.log4j.Logger;

import java.io.Serializable;

/**
 * @author Dahai Cao created on 2014-06-25, last updated on 2018-03-23
 *
 */
public class IDEngine implements Runnable, Serializable {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -3912897669272783418L;
	protected static Logger logger = Logger.getLogger(IDEngine.class.getName());
	// 0: shutdown; 1: startup
	volatile private int command = 0;

	/**
	 * 
	 */
	public IDEngine() {
	}

	/**
	 * @see java.lang.Runnable#run()
	 */
	@Override
	public void run() {
		try {
			if (command == 1) {
				while (!Thread.interrupted()) {
					if (RuntimeIDGenerator.getInstance().getIdCache().size() == 0) {
						//System.out.println("Id cache is empty.");
						String length = SystemConfig.getProp("server.cache.entityId.size");
						String[] rids = IDGeneratorEso.getInstance().generateRuntimeIds(Integer.valueOf(length));
						if (rids != null) {
							for (int i = 0; i < rids.length; i++)
								RuntimeIDGenerator.getInstance().getIdCache().putId(rids[i]);
						}
						//System.out.println("Id cache now is full.");
					} else {
						Thread.sleep(2000);
						//System.out.println(
						//		"We has still " + RuntimeIDGenerator.getInstance().getIdCache().size() + " IDs.");
					}
					// if
					// (RuntimeIDGenerator.getInstance().getCodeCache().size()
					// ==
					// 0) {
					// logger.info("CodeCache is empty.");
					// String length =
					// SystemConfig.getProp("server.cache.entityCode.size");
					// String[] codes =
					// IDGeneratorEso.getInstance().generateCodes(Integer.valueOf(length));
					// if (codes != null) {
					// for (int i = 0; i < codes.length; i++)
					// RuntimeIDGenerator.getInstance().getCodeCache().putId(codes[i]);
					// }
					// logger.info("CodeCache is full.");
					// }
				}
			} else if (command == 0) {
				// 将没有用掉的ID，保存好。
			}
		} catch (Exception e) {
			e.printStackTrace();
			//System.out.println("EntityId Manager errors." + e.getMessage());
		}
		// System.out.println("EntityId Manager shutdown.");
	}

	/**
	 * @return the command
	 */
	public int getCommand() {
		return command;
	}

	/**
	 * @param command
	 *            the command to set
	 */
	public void setCommand(int command) {
		this.command = command;
	}

}
