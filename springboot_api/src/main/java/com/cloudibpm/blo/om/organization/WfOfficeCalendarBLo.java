/**
 * 
 */
package com.cloudibpm.blo.om.organization;

import com.cloudibpm.core.repository.BusinessLogicObject;
import org.springframework.stereotype.Service;

/**
 * @author Dahai CAO
 * 
 */
@Service
public class WfOfficeCalendarBLo extends BusinessLogicObject {



//	public void getCalendar(TreeNode parent, WorkflowEntity owner)
//			throws Exception {
//		assemble(getCalendars(parent, owner), getDays(owner), getHours(owner));
//	}
//
//	private void assemble(List<OfficeCalendar> calendars, List<OfficeDay> days,
//			List<OfficeHours> hours) {
//		for (OfficeCalendar calendar : calendars) {
//			for (OfficeDay day : days) {
//				for (OfficeHours hour : hours) {
//					if (hour.getOwner().getId().equals(day.getId())) {
//						day.add(hour);
//					}
//				}
//				if (day.getOwner().equals(calendar.getId())) {
//					day.setOwner(calendar.getId());
//					calendar.addOfficeDay(day);
//				}
//			}
//		}
//	}
//
//	// public List<OfficeCalendar> getAllCalendars() {
//	// return calendars;
//	// }
//
//	// /**
//	// * 保存办公日历列表。
//	// *
//	// * @date 2008-11-16 下午02:12:52
//	// * @param calendars
//	// * @throws SQLException
//	// */
//	// public void saveCalendars(List<OfficeCalendar> calendars)
//	// throws SQLException {
//	// for (Iterator<OfficeCalendar> e = calendars.iterator(); e.hasNext();) {
//	// OfficeCalendar calendar = (WfOfficeCalendar) e.next();
//	// if (calendar.getState() == EditingState.DEFAULT) {
//	// saveOfficeDays(calendar.getOfficeDays());
//	// } else if (calendar.getState() == EditingState.ADDED) {
//	// calendar.setID(createNewCalendar(calendar));
//	// calendar.setState(EditingState.DEFAULT);
//	// saveOfficeDays(calendar.getOfficeDays());
//	// } else if (calendar.getState() == EditingState.MODIFIED) {
//	// modifyCalendar(calendar);
//	// calendar.setState(EditingState.DEFAULT);
//	// saveOfficeDays(calendar.getOfficeDays());
//	// } else if (calendar.getState() == EditingState.DELETED) {
//	// saveOfficeDays(calendar.getOfficeDays());
//	// deleteCalendar(calendar);
//	// e.remove();
//	// }
//	// }
//	// }
//
//	/**
//	 * 在资源库中创建一个新的日历对象。
//	 * 
//	 * @date 2008-11-16 下午02:13:22
//	 * @param calendar
//	 * @return
//	 * @throws Exception
//	 */
//	public void createNewCalendar(OfficeCalendar calendar) throws Exception {
//		WfOfficeCalendarEso calESO = new WfOfficeCalendarEso();
//		RecordObject calRO = new WfOfficeCalendarRo();
//		calRO.setRecordObject(calendar);
//		calESO.insert(calRO);
//		saveOfficeDays(calendar.getOfficeDays());
//	}
//
//	/**
//	 * 修改资源库中一个已存在的日历对象。
//	 * 
//	 * @date 2008-11-22 下午04:43:08
//	 * @param calendar
//	 * @throws Exception
//	 */
//	public void saveCalendar(OfficeCalendar calendar) throws Exception {
//		WfOfficeCalendarEso calESO = new WfOfficeCalendarEso();
//		WfOfficeCalendarRo calRO = new WfOfficeCalendarRo();
//		calRO.setRecordObject(calendar);
//		calESO.update(calRO);
//		saveOfficeDays(calendar.getOfficeDays());
//	}
//
//	/**
//	 * 删除一个特定的日历对象
//	 * 
//	 * @date 2008-11-26 下午11:28:20
//	 * @param calModel
//	 * @throws SQLException
//	 */
//	public void deleteCalendar(OfficeCalendar calModel) throws SQLException {
//		WfOfficeCalendarEso calESO = new WfOfficeCalendarEso();
//		calESO.delete(calModel.getId());
//	}
//
//	/**
//	 * 保存当前办公日历下面的所有的工作日。
//	 * 
//	 * @date 2008-11-17 上午12:22:21
//	 * @param days
//	 * @throws Exception
//	 */
//	public void saveOfficeDays(OfficeDayList dayList) throws Exception {
//		WorkflowEntity[] days = dayList.getAll();
//		if (days != null && days.length > 0) {
//			List<OfficeDay> list = new ArrayList<OfficeDay>();
//			for (int i = 0; i < days.length; i++) {
//				list.add((OfficeDay) days[i]);
//			}
//			for (Iterator<OfficeDay> e = list.iterator(); e.hasNext();) {
//				OfficeDay day = e.next();
//				if (day.getState() == EditingState.ADDED) {
//					createNewOfficeDay(day);
//					day.setState(EditingState.DEFAULT);
//					if (day.getAllHours() != null
//							&& day.getAllHours().length > 0) {
//						saveHours(day.getAllHours());
//					}
//				} else if (day.getState() == EditingState.MODIFIED) {
//					modifyOfficeDay(day);
//					day.setState(EditingState.DEFAULT);
//					deleteHours(day.getId());
//					if (day.getAllHours() != null
//							&& day.getAllHours().length > 0) {
//						saveHours(day.getAllHours());
//					}
//				} else if (day.getState() == EditingState.DELETED) {
//					deleteHours(day.getId());
//					deleteOfficeDays(day);
//					e.remove();
//				}
//			}
//		}
//	}
//
//	/**
//	 * 保存一个新的办公工作日
//	 * 
//	 * @date 2008-11-17 上午12:22:54
//	 * @param day
//	 * @return
//	 * @throws Exception
//	 */
//	public void createNewOfficeDay(OfficeDay day) throws Exception {
//		WfOfficeDayEso dayESO = new WfOfficeDayEso();
//		RecordObject dayRO = new WfOfficeDayRo();
//		dayRO.setRecordObject(day);
//		dayESO.insert(dayRO);
//	}
//
//	/**
//	 * 修改一个特定的工作日对象
//	 * 
//	 * @date 2008-11-26 下午11:28:45
//	 * @param day
//	 * @throws SQLException
//	 */
//	public void modifyOfficeDay(OfficeDay day) throws SQLException {
//		WfOfficeDayEso dayESO = new WfOfficeDayEso();
//		RecordObject ro = new WfOfficeDayRo();
//		ro.setRecordObject(day);
//		dayESO.update(ro);
//	}
//
//	/**
//	 * 删除日历对象中工作日对象
//	 * 
//	 * @date 2008-11-22 下午04:47:19
//	 * @param calModel
//	 * @throws SQLException
//	 */
//	public void deleteOfficeDays(OfficeDay day) throws SQLException {
//		WfOfficeDayEso dayESO = new WfOfficeDayEso();
//		dayESO.delete(day.getId());
//	}
//
//	/**
//	 * 保存当前工作日的办公时间段
//	 * 
//	 * @date 2008-11-18 下午09:34:39
//	 * @param hoursList
//	 * @throws Exception
//	 */
//	public void saveHours(OfficeHours[] hoursList) throws Exception {
//		WfOfficeHoursEso hoursESO = new WfOfficeHoursEso();
//		if (hoursList != null && hoursList.length > 0) {
//			for (int i = 0; i < hoursList.length; i++) {
//				OfficeHours hours = hoursList[i];
//				WfOfficeHoursRo ro = new WfOfficeHoursRo();
//				ro.setOfficeHours(hours);
//				hoursESO.insert(ro);
//			}
//		}
//	}
//
//	/**
//	 * 删除当前工作日的办公时间段
//	 * 
//	 * @date 2008-11-18 下午09:05:50
//	 * @param ownerid
//	 * @throws SQLException
//	 */
//	public void deleteHours(String ownerid) throws SQLException {
//		WfOfficeHoursEso hoursESO = new WfOfficeHoursEso();
//		hoursESO.delete(ownerid);
//	}
//
//	// /**
//	// * Returns all
//	// *
//	// * @date 2008-11-23 上午11:28:09
//	// * @param owner
//	// * @return
//	// * @throws SQLException
//	// */
//	// public List<OfficeDay> getDays(WorkflowEntity owner) throws SQLException
//	// {
//	// WfOfficeDayESO dayESO = new WfOfficeDayESO();
//	// List<OfficeDay> days = new ArrayList<OfficeDay>();
//	// List<WfOfficeDayRo> dayROs = dayESO.queryAll(owner.getID());
//	// for (int i = 0; i < dayROs.size(); i++) {
//	// WfOfficeDayRo dayRO = dayROs.get(i);
//	// OfficeDay day = (OfficeDay) dayRO.getEntity();
//	// day.setOwner(owner);
//	// List<OfficeHours> hours = getHours(day);
//	// if (hours.size() > 0) {
//	// for (int j = 0; j < hours.size(); j++) {
//	// day.add(hours.get(j));
//	// }
//	// }
//	// days.add(day);
//	// }
//	// return days;
//	// }
//	//
//	// /**
//	// * 获取办公时段列表
//	// *
//	// * @date 2008-11-23 上午11:27:56
//	// * @param owner
//	// * @return
//	// * @throws SQLException
//	// */
//	// public List<OfficeHours> getHours(WorkflowEntity owner) throws
//	// SQLException {
//	// WfOfficeHoursESO hourESO = new WfOfficeHoursESO();
//	// List<OfficeHours> hours = new ArrayList<OfficeHours>();
//	// List<WfOfficeHoursRo> hourROs = hourESO.queryAllOfficeHours(owner
//	// .getID());
//	// for (int i = 0; i < hourROs.size(); i++) {
//	// WfOfficeHoursRo hourRO = hourROs.get(i);
//	// OfficeHours hour = hourRO.getOfficeHours();
//	// hour.setOwner(owner);
//	// hours.add(hour);
//	// }
//	// return hours;
//	// }
//
//	/**
//	 * Returns all office calendars.
//	 */
//	public List<OfficeCalendar> getCalendars(TreeNode parent,
//			WorkflowEntity owner) throws Exception {
//		WfOfficeCalendarEso calendarEso = new WfOfficeCalendarEso();
//		List<OfficeCalendar> officeCalendars = new ArrayList<OfficeCalendar>();
//		List<RecordObject> calendars = calendarEso.queryAll(parent.getId(),
//				owner.getId());
//		for (RecordObject calRO : calendars) {
//			officeCalendars.add((OfficeCalendar) calRO.getEntity(owner));
//		}
//		return officeCalendars;
//	}
//
//	public List<OfficeDay> getDays(WorkflowEntity owner) throws Exception {
//		WfOfficeDayEso dayESO = new WfOfficeDayEso();
//		List<OfficeDay> days = new ArrayList<OfficeDay>();
//		List<RecordObject> dayROs = dayESO.queryAll(owner.getId());
//		for (RecordObject dayRO : dayROs) {
//			days.add((OfficeDay) dayRO.getEntity());
//		}
//		return days;
//	}
//
//	public List<OfficeHours> getHours(WorkflowEntity owner) throws Exception {
//		WfOfficeHoursEso hourESO = new WfOfficeHoursEso();
//		List<OfficeHours> hours = new ArrayList<OfficeHours>();
//		List<RecordObject> hourROs = hourESO.queryAll(owner.getId());
//		for (RecordObject hourRO : hourROs) {
//			hours.add(((WfOfficeHoursRo) hourRO).getOfficeHours());
//		}
//		return hours;
//	}
}