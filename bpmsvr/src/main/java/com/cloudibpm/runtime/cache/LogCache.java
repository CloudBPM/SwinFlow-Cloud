/**
 * 
 */
package com.cloudibpm.runtime.cache;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import com.cloudibpm.core.runtime.event.Event;
import com.cloudibpm.core.util.SystemConfig;

/**
 * @author Dahai Cao created on 2011-9-12 下午08:59:01, last updated on 2018-03-23
 * 
 */
public class LogCache implements java.io.Serializable {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -4961895331179772875L;
	public LinkedList<Event> eventLog = new LinkedList<Event>();
	public static final int BATCH_SAVE_COUNTING = SystemConfig.getNumberProp("server.cache.log.batchSave.size");

	public LogCache() {
	}

	public synchronized boolean hasLog() {
		return !eventLog.isEmpty();
	}

	public int count() {
		return eventLog.size();
	}

	/**
	 * 
	 * @date 2011-9-12 下午08:59:19
	 * @return
	 */
	public synchronized Event fetchLog() throws InterruptedException {
		while (eventLog.peek() == null) {
			wait();
		}
		return eventLog.poll();
	}

	/**
	 * 
	 * @date 2011-9-12 下午08:59:19
	 * @return
	 */
	public synchronized Event[] fetchLogs() throws InterruptedException {
		while (eventLog.peek() == null || eventLog.size() < BATCH_SAVE_COUNTING) {
			wait();
		}
		List<Event> events = new ArrayList<Event>();
		int i = 0;
		while (eventLog.peek() != null && i < BATCH_SAVE_COUNTING) {
			events.add(eventLog.poll());
			i = i + 1;
		}
		return events.toArray(new Event[events.size()]);
	}

	/**
	 * 
	 * @date 2011-9-12 下午08:59:27
	 * @param event
	 */
	public synchronized void writeLogs(Event event) {
		eventLog.offer(event);
		if (eventLog.size() >= BATCH_SAVE_COUNTING) {
			notifyAll();
		}
	}

	public synchronized void writeLog(Event event) {
		eventLog.offer(event);
		notifyAll();
	}

}
