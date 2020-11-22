package com.cloudibpm.eso.om.organization;

import com.cloudibpm.core.officecalendar.Holiday;
import com.cloudibpm.core.officecalendar.OfficeCalendar;
import com.cloudibpm.core.officecalendar.OfficeDay;
import com.cloudibpm.core.officecalendar.OfficeHours;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @Titel: 标题
 * @Description: 日历操作类
 * @Author: 作者
 * @CreateDate: 2019/4/15 11:22
 * @Version: 1.0
 */
@Repository
public class CalenderEso {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public CalenderEso(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * 创建一个日历
     *
     * @param calender
     */
    public int addCalender(OfficeCalendar calender) {
        String sql = "insert into om_office_calendar (Pk_Calendar,CalendarName,DefaultCalendar,Fk_Parent,Fk_Owner ) " +
                "values(?,?,?,?,?)";
        return jdbcTemplate.update(sql,calender.getId(),calender.getName(),calender.isDefault(),
                calender.getParent(),calender.getOwner());
    }

    /**
     * 根据组织ID 查询所有日历
     * @param oid
     * @return
     */
    public List<OfficeCalendar> queryAllCalender(String oid){
        String sql = "select * from om_office_calendar where Fk_Owner = ?";
        return jdbcTemplate.query(sql, new Object[]{ oid},
                (resultSet, i) -> getOfficeCalender(resultSet, new OfficeCalendar()));
    }

    /**
     * 设置某一天是否是假期  2019-09-10 是周几,今天是假期
     *
     * @param holiday
     */
    public int setIsHoliday(Holiday holiday) {
        String sql = "insert into om_holiday_arrangement (Pk_Holiday_Arrangement,Holiday,Fk_Parent,Fk_Owner)" +
                "values(?,?,?,?)";
        return jdbcTemplate.update(sql,holiday.getId(),holiday.getHoliday(),
                holiday.getParent(),holiday.getOwner());
    }

    /**
     * 修改某一天是否是假期  2019-09-10 是周几,今天是假期
     *
     * @param holiday
     */
    public int updateIsHoliday(Holiday holiday) {
        String sql = "UPDATE om_holiday_arrangement set IsHoliday = ? where Pk_Holiday_Arrangement = ? and Fk_Parent = ? and Fk_Owner = ?";
        return jdbcTemplate.update(sql,holiday.getIsHoliday(),holiday.getId(),holiday.getParent(),holiday.getOwner());
    }

    /**
     * 设置周一 是否是工作日   周一 是工作日
     *
     * @param officeDay
     */
    public int setYIsWorkDay(OfficeDay officeDay) {
        String sql = "insert into om_office_day (Pk_OfficeDay,Weekday,Working,Fk_Parent,Fk_Owner)" +
                "values(?,?,?,?,?)";
        return jdbcTemplate.update(sql,officeDay.getId(),officeDay.getWeekkDay(),officeDay.getIsWorkDay(),
                officeDay.getParent(),officeDay.getOwner());
    }

    /**
     * 设置周一对应的工作时间段  8:00-12:00
     *
     * @param officeHours
     */
    public int setYPeriod(OfficeHours officeHours) {
        String sql = "insert into om_office_hours (Pk_Tradinghours,FormTime,ToTime,Fk_Parent,Fk_Owner) values (?,?,?,?,?)";
        return jdbcTemplate.update(sql,officeHours.getId(),officeHours.getFromTime(),officeHours.getToTime()
                ,officeHours.getParent(),officeHours.getOwner());
    }

    /**
     * 通过一个日期查询日期表是否存在数据
     * @param date
     * @param oid
     * @return
     */
    public Holiday queryIsHoliday(Date date, String oid){
        String sql = "select * from om_holiday_arrangement where Holiday = ? and Fk_Owner = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{date, oid},
                (rs, i) -> CalenderEso.this.getHolidad(rs, new Holiday()));
    }


    /**
     *根据周几查询对应OfficeDay
     * @param weekday
     */
    public OfficeDay queryIdByDayOfWeek(int weekday,String parentId,String oid){
        String sql = "select * from om_office_day where Weekday = ? and Fk_Parent = ? and Fk_Owner = ? ";
        return jdbcTemplate.queryForObject(sql, new Object[]{weekday,parentId,oid},
                (rs, i) -> CalenderEso.this.getOfficeDay(rs, new OfficeDay()));
    }

    /**
     * 列出某个日历下星期列表
     * @param parentId
     * @param oid
     * @return
     */
    public List<OfficeDay> getWeekList(String parentId, String oid){
        String sql = "select * from om_office_day where Fk_Parent = ? and Fk_Owner = ?";
        return jdbcTemplate.query(sql, new Object[]{parentId, oid},
                (resultSet, i) -> getOfficeDay(resultSet,new OfficeDay()));
    }

    /**
     * 列出某个公司下假期表数据
     * @param oid
     * @return
     */
    public List<Holiday> getHolidayList(String oid){
        String sql = "select * from om_holiday_arrangement where Fk_Owner = ? order by Holiday DESC";
        return jdbcTemplate.query(sql, new Object[]{ oid},
                (resultSet, i) -> getHolidad(resultSet,new Holiday()));
    }

    /**
     * 删除某公司假期表下的某个数据
     * @param ownerId  组织ID
     * @param date  日期
     * @return
     */
    public void delHoliday(String ownerId, String id) {
        String sql = "Delete from om_holiday_arrangement where Fk_Owner = ? and Pk_Holiday_Arrangement = ?";
        jdbcTemplate.update(sql,ownerId,id);
    }

    /**
     * 条件查询假期表数据
     * @param startTime 开始时间
     * @param toTime    结束时间
     * @param oid
     * @return
     */
    public List<Holiday> searchHoliday(Date startTime, Date toTime, String oid){
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("select * from om_holiday_arrangement where 1=1 ");
        List list = new ArrayList<>();
        if(startTime != null){
            stringBuilder.append(" and Holiday >= ? ");
            list.add(startTime);
        }
        if(toTime != null){
            stringBuilder.append(" and Holiday <= ? ");
            list.add(toTime);
        }
        stringBuilder.append(" and Fk_Owner = ? order by Holiday asc");
        list.add(oid);
        return jdbcTemplate.query(stringBuilder.toString(), list.toArray(),
                (resultSet, i) -> getHolidad(resultSet,new Holiday()));
    }

    /**
     * 查询日历对应的周期   升序 1 - 7
     * @param cid  日历id
     * @param oid
     * @return
     */
    public List<OfficeDay> getCalenderOfficeDay(String cid, String oid){
       String sql = "select * from om_office_day where Fk_Parent = ? and Fk_Owner = ? order by Weekday asc";
       return jdbcTemplate.query(sql,new Object[]{cid, oid},
               ((resultSet, i) -> getOfficeDay(resultSet,new OfficeDay())));
    }

    /**
     * 根据日历周期id  周一id 查询周一对应时间段
     * @param officeDayId  周几id
     * @param oid
     * @return
     */
    public List<OfficeHours> getCalenderOfficeDayHours(String officeDayId, String oid){
        String sql = "select * from om_office_hours where Fk_Parent = ? and Fk_Owner = ? order by FormTime asc";
        return jdbcTemplate.query(sql,new Object[]{officeDayId, oid},
                ((resultSet, i) -> getOfficeHours(resultSet,new OfficeHours())));
    }

    /**
     * 查询日历下周一对应的时间段
     * @param cid  日历id
     * @param oid
     * @return
     */
    public List<OfficeHours> getOnMondayTime(String cid, String oid){
        //1.根据日历id 查询周一id
        String sql = "select * from om_office_day where Weekday = ? and Fk_Parent = ? and Fk_Owner = ?";
        List<OfficeDay> officeDays = jdbcTemplate.query(sql, new Object[]{1, cid, oid},
                ((resultSet, i) -> getOfficeDay(resultSet, new OfficeDay())));
        if(officeDays != null & officeDays.size() > 0){
            //2.根据周一id 查询对应时间段
            sql = "select * from om_office_hours where Fk_Parent = ? and Fk_Owner = ? order by FormTime asc";
            return jdbcTemplate.query(sql,new Object[]{officeDays.get(0).getId(), oid},
                    ((resultSet, i) -> getOfficeHours(resultSet,new OfficeHours())));
        }else {
            return null;
        }
    }

    /**
     * 根据时间段id删除对应时间段
     * @param pid  日时间段id
     */
    public void delPeriod(String pid){
        String sql = "Delete from om_office_hours where Pk_Tradinghours = ? ";
        jdbcTemplate.update(sql,pid);
    }

    /**
     * 重命名日历 根据日历id
     * @param cid  日历id
     * @param cname  日历名字
     * @param oid
     */
    public void renameCalender(String cid,String cname,String oid){
        String sql = "UPDATE om_office_calendar set CalendarName = ? where Pk_Calendar = ? and Fk_Owner = ?";
        jdbcTemplate.update(sql,cname,cid,oid);
    }

    /**
     * 根据日历id 删除日历
     * @param cid  日历id
     * @param oid
     */
    public void delCalender(String cid,String oid){
        String sql = "Delete from om_office_calendar where Pk_Calendar = ? and Fk_Owner = ?";
        jdbcTemplate.update(sql,cid,oid);
    }

    /**
     * 根据日历id 删除对应周期
     * @param cid  日历id
     * @param oid
     */
    public void delOfficeDay(String cid,String oid){
        String sql = "Delete from om_office_day where Fk_Parent = ? and Fk_Owner = ?";
        jdbcTemplate.update(sql,cid,oid);
    }

    /**
     * 根据日历id 删除对应周期
     * @param officeDayId  周期id
     * @param oid
     */
    public void delOfficeHours(String officeDayId,String oid){
        String sql = "Delete from om_office_hours where Fk_Parent = ? and Fk_Owner = ?";
        jdbcTemplate.update(sql,officeDayId,oid);
    }

    /**
     * 查询公司下所有日历
     * @param oid   组织id
     */
    public List<OfficeCalendar> getAllCalender(String oid){
        String sql = "Select * from om_office_calendar where Fk_Owner = ?";
        return jdbcTemplate.query(sql,new Object[]{oid},
                ((resultSet, i) -> getOfficeCalender(resultSet,new OfficeCalendar())));
    }

    //处理结果集  日历
    public OfficeCalendar getOfficeCalender(ResultSet rs,OfficeCalendar officeCalendar) throws SQLException {
        officeCalendar.setId(rs.getString("Pk_Calendar"));
        officeCalendar.setName(rs.getString("CalendarName"));
        officeCalendar.setDefault(rs.getInt("DefaultCalendar"));
        officeCalendar.setParent(rs.getString("Fk_Parent"));
        officeCalendar.setOwner(rs.getString("Fk_Owner"));
        return officeCalendar;
    }

    //处理结果集  周期
    public OfficeDay getOfficeDay(ResultSet rs,OfficeDay officeDay) throws SQLException {
        officeDay.setId(rs.getString("Pk_OfficeDay"));
        officeDay.setWeekkDay(rs.getInt("Weekday"));
        officeDay.setIsWorkDay(rs.getInt("Working"));
        officeDay.setParent(rs.getString("Fk_Parent"));
        officeDay.setOwner(rs.getString("Fk_Owner"));
        return officeDay;
    }

    //处理结果集  假期
    public Holiday getHolidad(ResultSet rs,Holiday holiday)throws SQLException{
        holiday.setId(rs.getString("Pk_Holiday_Arrangement"));
        holiday.setIsHoliday(rs.getInt("IsHoliday"));
        holiday.setHoliday(rs.getDate("Holiday"));
        holiday.setParent(rs.getString("Fk_Parent"));
        holiday.setOwner(rs.getString("Fk_Owner"));
        return holiday;
    }

    //处理结果集  时间段
    public OfficeHours getOfficeHours(ResultSet rs,OfficeHours officeHours)throws SQLException{
        officeHours.setId(rs.getString("Pk_Tradinghours"));
        officeHours.setFromTime(rs.getString("FormTime"));
        officeHours.setToTime(rs.getString("ToTime"));
        officeHours.setParent(rs.getString("Fk_Parent"));
        officeHours.setOwner(rs.getString("Fk_Owner"));
        return officeHours;
    }

}
