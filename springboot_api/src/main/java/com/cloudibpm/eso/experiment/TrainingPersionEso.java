/**
 * 
 */
package com.cloudibpm.eso.experiment;

import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.experiment.TrainingPerson;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;

/**
 * This class is for training new staff to improve their development skills.
 * 
 * @author Dahai Cao
 * @date 2018-05-20
 *
 */
@Repository
public class TrainingPersionEso {

	private final JdbcTemplate jdbcTemplate;

	private final BuildtimeIDGenerator buildtimeIDGenerator;

	@Autowired
	public TrainingPersionEso(JdbcTemplate jdbcTemplate, BuildtimeIDGenerator buildtimeIDGenerator) {
		this.jdbcTemplate = jdbcTemplate;
		this.buildtimeIDGenerator = buildtimeIDGenerator;
	}



	/**
	 * Insert a training person into current repository.
	 * 
	 * @date 2018-05-20 17:02
	 * @param p
	 *            TrainingPerson
	 * @throws Exception
	 */
	public void insert(final TrainingPerson p) {
		//System.out.println("个人信息idESO:" + p.getId());
		System.out.println("最后更新时间eso：" + p.getLastUpdate());
		
//		String sql = "insert into training_person (Pk_Person,FirstName,LastName,Gender,Birthday)"
//				+ " values (?,?,?,?,?)";
		String sql = "INSERT INTO training_person "
				+ "(Pk_Person, FirstName, LastName, Gender, Birthday, Address, Postcode, Degree, Mobile, Introduction, Lastupdate) "
				+ "VALUES (?,?,?,?,?,?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				try {
					String id=buildtimeIDGenerator.getNewBuildTimeID();
					stmt.setString(1, id);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				stmt.setString(2, p.getFirstName());
				stmt.setString(3, p.getLastName());
				stmt.setInt(4, p.getGender());
				stmt.setString(5, p.getBirthday());
				stmt.setString(6, p.getAddress());
				stmt.setString(7, p.getPostcode());
				stmt.setInt(8, p.getDegree());
				stmt.setString(9, p.getMobile());
				stmt.setString(10, p.getIntroduction());
				stmt.setString(11, p.getLastUpdate());//最后修改时间没有更新
				System.out.println("id:" + p.getFirstName());
				System.out.println("最后更新时间:" + p.getLastUpdate());
			}
		});
		
	}
	
	public void update(final TrainingPerson p) {
		
		String sql = "update training_person set FirstName=?,LastName=?,Gender=?"
				+ ",Birthday=?,Address=?, Postcode=?, Degree=?, Mobile=?, Introduction=?"
				+ ", Lastupdate=? WHERE Pk_Person=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, p.getFirstName());
				stmt.setString(2, p.getLastName());
				stmt.setInt(3, p.getGender());
				stmt.setString(4, p.getBirthday());
				stmt.setString(5, p.getAddress());
				stmt.setString(6, p.getPostcode());
				stmt.setInt(7, p.getDegree());
				stmt.setString(8, p.getMobile());
				stmt.setString(9, p.getIntroduction());
				stmt.setString(10, p.getLastUpdate());
				stmt.setString(11, p.getId());
			}
		});
		
	}

	/**
	 * Gets all training person from repository.
	 * 
	 * @param firstrow
	 *            int
	 * @param pagesize
	 *            int
	 * @return List<TrainingPerson>
	 * @throws SQLException
	 */
	public List<TrainingPerson> queryAll(int firstrow, int pagesize) throws Exception {
		
		//String sql = "SELECT Pk_Person,FirstName,LastName,Gender,Birthday FROM training_person LIMIT ?, ?";
		String sql = "SELECT * FROM training_person LIMIT ?, ?";
		List<TrainingPerson> lst = jdbcTemplate.query(sql, new Object[] { firstrow, pagesize },
				new RowMapper<TrainingPerson>() {
					public TrainingPerson mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getResultSet(new TrainingPerson(), rs);
					}
				});
		
		System.out.println("id：" + lst.get(0).getId());
		System.out.println("生日：" + lst.get(0).getBirthday());
		System.out.println("学位：" + lst.get(0).getDegree());
		return lst;
	}
	
	public int  getAllTrainingPersonCounting(String condition/*,String ownerid*/) throws SQLException {
		
		String sql = "SELECT count(*) FROM training_person where (Pk_Person like '%" + condition
				+ "%' or FirstName like '%" + condition + "%' or LastName like '%"
				+ condition + "%' or Gender like '%" + condition + "%' or Birthday like '%"
				+ condition 
				+ "%' or Address like '%" + condition
				+ "%' or Postcode like '%" + condition + "%' or Degree like '%"
				+ condition + "%' or Mobile like '%" + condition
				+ "%' or Introduction like '%" + condition+ "%')";
		String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
		System.out.println(sql);
		List<Integer> counts = jdbcTemplate.query(sql, /*new String[] {ownerid},*/ new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});
		
		return ((Integer) counts.get(0)).intValue();
	}
	
	//搜索任何符合condition条件的数据
	public List<TrainingPerson> queryAll(String condition, int firstrow, int pagesize) throws SQLException {
		
		String sql = "SELECT * FROM training_person where (Pk_Person like '%" + condition
				+ "%' or FirstName like '%" + condition + "%' or LastName like '%"
				+ condition + "%' or Gender like '%" + condition + "%' or Birthday like '%"
				+ condition 
				+ "%' or Address like '%" + condition
				+ "%' or Postcode like '%" + condition + "%' or Degree like '%"
				+ condition + "%' or Mobile like '%" + condition
				+ "%' or Introduction like '%" + condition
				+ "%')LIMIT ?, ?";
		String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
		System.out.println(sql);
		List<TrainingPerson> lst = jdbcTemplate.query(sql, new Object[] {firstrow, pagesize},
				new RowMapper<TrainingPerson>() {
					public TrainingPerson mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getResultSet(new TrainingPerson(), rs);
					}
				});
		
		return lst;
	}


	/**
	 * Gets result set for training person object.
	 * 
	 * @param p
	 *            TrainingPerson
	 * @param rs
	 *            ResultSet
	 * @return TrainingPerson
	 * @throws SQLException
	 */
	private TrainingPerson getResultSet(TrainingPerson p, ResultSet rs) throws SQLException {
		p.setId(rs.getString("Pk_Person"));
		p.setFirstName(rs.getString("FirstName"));
		p.setLastName(rs.getString("LastName"));
		p.setGender(rs.getInt("Gender"));
		Date date = rs.getDate("Birthday");
		p.setBirthday(DateUtility.formatDate(date));
		p.setAddress(rs.getString("Address"));
		p.setPostcode(rs.getString("Postcode"));
		p.setDegree(rs.getInt("Degree"));
		p.setMobile(rs.getString("Mobile"));
		p.setIntroduction(rs.getString("Introduction"));
		p.setLastUpdate(rs.getString("Lastupdate"));
		return p;
	}

	/**
	 * Get all training person count in repository.
	 * 
	 * @return int
	 * @throws SQLException
	 */
//	public int getAllTrainingPersonCounting() throws SQLException {
//		
//		String sql = "select count(*) from training_person";
//		List<Integer> counts = jdbcTemplate.query(sql, new RowMapper<Integer>() {
//			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
//				int count = rs.getInt(1);
//				return new Integer(count);
//			}
//		});
//		
//		return ((Integer) counts.get(0)).intValue();
//	}
	
	public void delete(final String id) {
		String sql = "DELETE FROM training_person WHERE Pk_Person=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, id);
			}
		});
		
	}

}
