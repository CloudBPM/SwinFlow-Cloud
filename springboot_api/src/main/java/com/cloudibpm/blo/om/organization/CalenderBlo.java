package com.cloudibpm.blo.om.organization;

import com.cloudibpm.core.officecalendar.Holiday;
import com.cloudibpm.core.officecalendar.OfficeCalendar;
import com.cloudibpm.core.officecalendar.OfficeDay;
import com.cloudibpm.core.officecalendar.OfficeHours;
import com.cloudibpm.eso.om.organization.CalenderEso;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * @Titel: 日历
 * @Description: 日历操作类
 * @Author: 作者
 * @CreateDate: 2019/4/15 10:14
 * @Version: 1.0
 */
@Service
//@Transactional
public class CalenderBlo {

    private final CalenderEso calenderEso;

    @Autowired
    public CalenderBlo(CalenderEso calenderEso){
        this.calenderEso =  calenderEso;
    }

    /**
     * 创建一个日历
     * @param calender
     */
    public int addCalender(OfficeCalendar calender){
        return calenderEso.addCalender(calender);
    }

    /**
     * 根据组织ID 查询所有日历
     * @param oid
     * @return
     */
    public List<OfficeCalendar> queryAllCalender(String oid){
        return calenderEso.queryAllCalender(oid);
    }

    /**
     * 设置某一天是否是假期  2019-09-10 是周几,今天是假期
     * @param holiday
     */
    public int setIsHoliday(Holiday holiday){
        Holiday hd = null;
        try {
            hd = calenderEso.queryIsHoliday(holiday.getHoliday(), holiday.getOwner());
        } catch (Exception e) {
            System.out.println("查询数据为空");
        }
        if(hd == null){
            return  calenderEso.setIsHoliday(holiday);
        }else {
            return 0;
        }
    }

    /**
     * 设置周几 是否是工作日   周一 是工作日
     * @param officeDay
     * @return
     */
    public int setYIsWorkDay(OfficeDay officeDay){
        return calenderEso.setYIsWorkDay(officeDay);
    }

    /**
     * 设置周一对应的工作时间段  8:00-12:00
     * @param officeHours
     * @return
     */
    public int setYPeriod(OfficeHours officeHours){
        return calenderEso.setYPeriod(officeHours);
    }

    /**
     * 查看某一天是否是假期
     * @param date
     * @param weekDay
     * @param oid
     * @return
     */
    public Boolean isHoliday(Date date,int weekDay,String calenderId,String oid){
        Holiday holiday = null;
        try {
            //如果假期表存在日期，即为假期
            holiday = calenderEso.queryIsHoliday(date,oid);
        } catch (Exception e) {
            System.out.println("查询数据为空");
        }
        if(holiday != null && holiday.getIsHoliday() == 1){
            return true;
        }else {
            //假期表不存在,查看是否工作日
            OfficeDay officeDay = calenderEso.queryIdByDayOfWeek(weekDay,calenderId,oid);
            if(officeDay != null && officeDay.getIsWorkDay() == 1){ //是工作日
                return false;
            }else {//不是工作日
                return true;
            }
        }
    }

    /**
     *根据周几查询对应ID
     * @param weekday
     * @param oid
     */
    public OfficeDay queryIdByDayOfWeek(int weekday,String parentId,String oid){
        return calenderEso.queryIdByDayOfWeek(weekday,parentId,oid);
    }

    /**
     * 列出某个日历下星期列表
     * @param parentId
     * @param oid
     * @return
     */
    public List<OfficeDay>  getWeekList(String parentId,String oid){
        return calenderEso.getWeekList(parentId,oid);
    }

    /**
     * 列出某个公司下假期表数据
     * @param oid
     * @return
     */
    public List<Holiday> getHolidayList(String oid){
        return calenderEso.getHolidayList(oid);
    }

    /**
     * 删除某公司假期表下的某个数据
     * @param ownerId  组织ID
     * @param id
     * @return
     */
    public void delHoliday(String ownerId, String id) {
        calenderEso.delHoliday(ownerId,id);
    }

    /**
     * 条件查询假期表数据
     * @param parentId
     * @param oid
     * @return
     */
    public List<Holiday>  searchHoliday(String startTime,String toTime,String oid) throws ParseException {
        Date st = null;
        Date tt = null;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        if(StringUtils.isNotBlank(startTime)){
            st = simpleDateFormat.parse(startTime);
        }
        if(StringUtils.isNotBlank(toTime)){
            tt = simpleDateFormat.parse(toTime);
        }
        if(st != null && tt != null){
            if(st.after(tt)){
                return null;
            }
        }
        return calenderEso.searchHoliday(st,tt,oid);

    }

    /**
     * 查询日历对应的周期
     * @param cid  日历id
     * @param oid
     * @return
     */
    public List<OfficeDay> getCalenderOfficeDay(String cid, String oid){
        return calenderEso.getCalenderOfficeDay(cid,oid);
    }

    /**
     * 根据日历周期id  周一id 查询周一对应时间段
     * @param officeDayId  周几id
     * @param oid
     * @return
     */
    public List<OfficeHours> getCalenderOfficeDayHours(String officeDayId, String oid){
        return calenderEso.getCalenderOfficeDayHours(officeDayId,oid);
    }

    /**
     * 查询日历下周一对应的时间段
     * @param cid  日历id
     * @param oid
     * @return
     */
    public List<OfficeHours> getOnMondayTime(String cid, String oid){
        return calenderEso.getOnMondayTime(cid,oid);
    }

    /**
     * 根据时间段id删除对应时间段
     * @param pid  日时间段id
     */
    public void delPeriod(String pid){
        calenderEso.delPeriod(pid);
    }

    /**
     * 重命名日历 根据日历id
     * @param cid  日历id
     * @param cname  日历名字
     * @param oid
     */
    public void renameCalender(String cid,String cname,String oid){
        calenderEso.renameCalender(cid,cname,oid);
    }

    /**
     * 根据日历id 删除日历 并删除对应周期和时间
     * @param cid  日历id
     * @param oid
     */
    public void delCalender(String cid,String oid){
        //1.根据日历id 删除日历
        calenderEso.delCalender(cid,oid);
        //2.根据日历Id 查询对应周期,并删除
        List<OfficeDay> officeDays = calenderEso.getCalenderOfficeDay(cid, oid);
        calenderEso.delOfficeDay(cid,oid);
        //3.根据周期id 删除对应时间段
        for (OfficeDay officeDay : officeDays) {
            calenderEso.delOfficeHours(officeDay.getId(),oid);
        }
    }

    /**
     * 查询公司下所有日历
     * @param oid   组织id
     */
    public List<OfficeCalendar> getAllCalender(String oid){
        return calenderEso.getAllCalender(oid);
    }
}
