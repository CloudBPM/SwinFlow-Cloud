package com.cloudibpm.eso.om.user;


import com.cloudibpm.core.user.User;
import com.cloudibpm.core.util.DateUtility;
import com.model.Contact;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.*;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class WfUserEso {
	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public WfUserEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * Gets cloud BPM users by <code>ID Number</code> in user profile table from
	 * content repository.
	 *
	 * @return List<RecordObject>
	 * @throws SQLException
	 */
	public User queryByIdNumber(final String idnumber) throws SQLException {

		String sql = "select * from om_userprofile where IdNumber=?";
		List<User> lst = jdbcTemplate.query(sql, new String[] { idnumber }, new RowMapper<User>() {
			public User mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new User(), rs);
			}
		});

		if (lst.size() > 0) {
			return lst.get(0);
		} else {
			return null;
		}
	}

	// 查询在条件范围内User
	public ArrayList<String> queryInIdNumber(ArrayList<String> list) throws Exception {
		String sql = "select * from om_userprofile where IdNumber in(:param)";
		HashMap<String, Object> paraMap = new HashMap<>();
		paraMap.put("param", list);
		NamedParameterJdbcTemplate jdbc = new NamedParameterJdbcTemplate(jdbcTemplate);
		List<User> lst = jdbc.query(sql, paraMap, new RowMapper<User>() {
			@Override
			public User mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new User(), rs);
			}
		});
		if (!lst.isEmpty()) {
			ArrayList<String> userlist = new ArrayList<String>();
			for (int i = 0; i < lst.size(); i++) {
				userlist.add(lst.get(i).getIdNumber());
				userlist.add(lst.get(i).getId());
			}
			return userlist;
		} else {
			return null;
		}
	}

	public User queryByUserName(final String username) throws SQLException {

		String sql = "select * from om_userprofile where UserName=?";
		List<User> lst = jdbcTemplate.query(sql, new String[] { username }, new RowMapper<User>() {
			public User mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new User(), rs);
			}
		});

		if (lst.size() > 0) {
			return lst.get(0);
		} else {
			return null;
		}
	}

	public User queryUserByMobile(String mobile){
		String sql = "select * from om_userprofile where Mobile=?";
		List<User> lst = jdbcTemplate.query(sql,this::getUser,mobile);
		if (lst.size() > 0) {
			return lst.get(0);
		} else {
			return null;
		}
	}


	/**
	 * Query one workflow user through <code>primaryKey</code> of the user from
	 * content repository.
	 *
	 * @return RecordObject
	 * @throws SQLException
	 */
	public User queryByPK(final String primaryKey) throws SQLException {

		String sql = "select * from om_userprofile where Pk_User=?";
		User ro = jdbcTemplate.queryForObject(sql, new String[] { primaryKey }, new RowMapper<User>() {
			public User mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new User(), rs);
			}
		});

		return (User) ro;
	}

	public User queryByPKnoPW(final String primaryKey) throws SQLException {

		String sql = "select * from om_userprofile where Pk_User=?";
		User ro=null;
		try{
			ro = jdbcTemplate.queryForObject(sql, new String[] { primaryKey }, new RowMapper<User>() {
				public User mapRow(ResultSet rs, int rowNum) throws SQLException {
					return getResultSet(new User(), rs);
				}
			});
		}catch (Exception e){
			e.printStackTrace();
		}


		ro.setPasswd("@_@");
		return (User) ro;
	}

	// 批量插入user
	@SuppressWarnings("all")
	public boolean updateBatchUser(ArrayList<String> userlist, Date date) throws Exception {
		String sql = "INSERT INTO om_userprofile(Pk_User, UserName, Passwd, PasswdExpirationDate, FirstName, LastName,"
				+ "Gender, Birthday, IdType, IdNumber, Country, Province, City, County, "
				+ "Address, PostCode, RegistrationDate, Email, Mobile, Lastupdate,Nation,HouseholdAddress,IsBanned)"
				+ " values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement preparedStatement, int i) throws SQLException {
				i = i * 13;
				preparedStatement.setString(1, userlist.get(i));
				preparedStatement.setString(2, userlist.get(i + 1));
				preparedStatement.setString(3, userlist.get(i + 2));
				preparedStatement.setString(4, null);
				preparedStatement.setString(5, userlist.get(i + 3));
				preparedStatement.setString(6, userlist.get(i + 4));
				preparedStatement.setString(7, userlist.get(i + 5));
				preparedStatement.setDate(8, null);
				preparedStatement.setString(9, userlist.get(i + 6));
				preparedStatement.setString(10, userlist.get(i + 1));
				preparedStatement.setString(11, null);
				preparedStatement.setString(12, null);
				preparedStatement.setString(13, null);
				preparedStatement.setString(14, null);
				preparedStatement.setString(15, userlist.get(i + 8));
				preparedStatement.setString(16, null);
				preparedStatement.setTimestamp(17, null);
				preparedStatement.setString(18, null);
				preparedStatement.setString(19, userlist.get(i+9));
				preparedStatement.setTimestamp(20, new Timestamp(date.getTime()));
				preparedStatement.setString(21, userlist.get(i + 10));
				preparedStatement.setString(22, userlist.get(i + 11));
				preparedStatement.setInt(23, 0);
			}

			@Override
			public int getBatchSize() {
				return userlist.size() / 13;
			}
		});
		String thisMethodName = new Exception().getStackTrace()[0].getMethodName();
		int line = new Exception().getStackTrace()[0].getLineNumber();
		return true;
	}

	private User getUser(ResultSet rs,int i) throws SQLException {
		User user =new User();
		return getResultSet(user, rs);
	}

	private User getResultSet(final User user, final ResultSet rs) throws SQLException {
		user.setId(rs.getString("Pk_User"));
		user.setName(rs.getString("UserName"));
		user.setPasswd(rs.getString("Passwd"));
		user.setPasswdExpirationDate(rs.getTimestamp("PasswdExpirationDate"));
		user.setGivenname(rs.getString("FirstName"));
		user.setSurname(rs.getString("LastName"));
		user.setGender(rs.getString("Gender"));
		user.setBirthday(rs.getDate("Birthday"));
		user.setIdType(rs.getString("IdType"));
		user.setIdNumber(rs.getString("IdNumber"));
		user.setCountry(rs.getString("Country"));
		user.setProvince(rs.getString("Province"));
		user.setCity(rs.getString("City"));
		user.setCounty(rs.getString("County"));
		user.setAddress(rs.getString("Address"));
		user.setPostcode(rs.getString("PostCode"));
		user.setRegistrationDate(rs.getTimestamp("RegistrationDate"));
		user.setEmail(rs.getString("Email"));
		user.setMobile(rs.getString("Mobile"));
		user.setLastupdate(rs.getTimestamp("Lastupdate"));
		user.setIsBanned(rs.getInt("IsBanned"));
		user.setBanningDescription(rs.getString("BanningDescription"));
		user.setUsedName(rs.getString("UsedName"));
		user.setBloodType(rs.getString("BloodType"));
		user.setAge(rs.getInt("Age"));
		user.setHeight(rs.getInt("Height"));
		user.setWeight(rs.getInt("Weight"));
		user.setNation(rs.getString("Nation"));
		user.setHouseholdAddress(rs.getString("HouseholdAddress"));
		user.setHouseholdPostcode(rs.getString("HouseholdPostcode"));
		return user;
	}

	public User queryByUsername(String username) throws SQLException {

		String sql = "select * from om_userprofile where UserName=?";
		User ro = jdbcTemplate.queryForObject(sql, new String[] { username }, new RowMapper<User>() {
			public User mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new User(), rs);
			}
		});

		return (User) ro;
	}

	/**
	 * Insert one workflow user record object into current repository.
	 *
	 * @date 02/11/2011 11:23:21 AM
	 * @param ro
	 * @throws Exception
	 */
	public int insert(final User user) throws Exception {

		String sql = "insert into om_userprofile(Pk_User, UserName, Passwd, PasswdExpirationDate, FirstName, LastName,"
				+ "Gender, Birthday, IdType, IdNumber, Country, Province, City, County, "
				+ "Address, PostCode, RegistrationDate, Email, Mobile, Lastupdate, "
				+ "UsedName, BloodType, Age, Height, Weight, Nation, HouseholdAddress, HouseholdPostcode)"
				+ " values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, user.getId());
				stmt.setString(2, StringEscapeUtils.escapeSql(user.getName()));
				stmt.setString(3, user.getPasswd());
				if (user.getPasswdExpirationDate() != null) {
					stmt.setTimestamp(4, new Timestamp(user.getPasswdExpirationDate().getTime()));
				} else {
					stmt.setTimestamp(4, null);
				}
				stmt.setString(5, StringEscapeUtils.escapeSql(user.getGivenname()));
				stmt.setString(6, StringEscapeUtils.escapeSql(user.getSurname()));
				stmt.setString(7, user.getGender());
				if (user.getBirthday() != null)
					stmt.setDate(8, new Date(user.getBirthday().getTime()));
				else
					stmt.setDate(8, null);
				stmt.setString(9, user.getIdType());
				stmt.setString(10, StringEscapeUtils.escapeSql(user.getIdNumber()));
				stmt.setString(11, user.getCountry());
				stmt.setString(12, user.getProvince());
				stmt.setString(13, user.getCity());
				stmt.setString(14, user.getCounty());
				stmt.setString(15, user.getAddress());
				stmt.setString(16, user.getPostcode());
				if (user.getRegistrationDate() != null)
					stmt.setTimestamp(17, new Timestamp(user.getRegistrationDate().getTime()));
				else
					stmt.setTimestamp(17, null);
				stmt.setString(18, user.getEmail());
				stmt.setString(19, user.getMobile());
				stmt.setTimestamp(20, new Timestamp(user.getLastupdate().getTime()));
				stmt.setString(21, StringEscapeUtils.escapeSql(user.getUsedName()));
				stmt.setString(22, user.getBloodType());
				stmt.setInt(23, user.getAge());
				stmt.setInt(24, user.getHeight());
				stmt.setInt(25, user.getWeight());
				stmt.setString(26, user.getNation());
				stmt.setString(27, StringEscapeUtils.escapeSql(user.getHouseholdAddress()));
				stmt.setString(28, StringEscapeUtils.escapeSql(user.getHouseholdPostcode()));
			}
		});

		return 1;
	}

	/**
	 * Update one Cloud BPM user in current repository.
	 *
	 * @date 02/11/2011 11:36:02 AM
	 * @param ro
	 * @return
	 * @throws SQLException
	 */
	public int update(final User userRo) throws SQLException {

		String sql = "update om_userprofile set Gender=?, Birthday=?, IdType=?, "
				+ "IdNumber=?, Country=?, Province=?, City=?, County=?, Address=?, "
				+ "PostCode=?, Email=?, Mobile=?, Lastupdate=?, LastName=?, FirstName=?, "
				+ "UsedName=?, BloodType=?, Age=?, Height=?, Weight=?, Nation=?, "
				+ "HouseholdAddress=?, HouseholdPostcode=? where Pk_User=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, userRo.getGender());
				if (userRo.getBirthday() != null)
					stmt.setDate(2, new Date(userRo.getBirthday().getTime()));
				else
					stmt.setDate(2, null);
				stmt.setString(3, userRo.getIdType());
				stmt.setString(4, userRo.getIdNumber());
				stmt.setString(5, userRo.getCountry());
				stmt.setString(6, userRo.getProvince());
				stmt.setString(7, userRo.getCity());
				stmt.setString(8, userRo.getCounty());
				stmt.setString(9, StringEscapeUtils.escapeSql(userRo.getAddress()));
				stmt.setString(10, userRo.getPostcode());
				stmt.setString(11, StringEscapeUtils.escapeSql(userRo.getEmail()));
				stmt.setString(12, StringEscapeUtils.escapeSql(userRo.getMobile()));
				stmt.setTimestamp(13, new Timestamp(userRo.getLastupdate().getTime()));
				stmt.setString(14, StringEscapeUtils.escapeSql(userRo.getSurname()));
				stmt.setString(15, StringEscapeUtils.escapeSql(userRo.getGivenname()));
				stmt.setString(16, StringEscapeUtils.escapeSql(userRo.getUsedName()));
				stmt.setString(17, userRo.getBloodType());
				stmt.setInt(18, userRo.getAge());
				stmt.setInt(19, userRo.getHeight());
				stmt.setInt(20, userRo.getWeight());
				stmt.setString(21, userRo.getNation());
				stmt.setString(22, StringEscapeUtils.escapeSql(userRo.getHouseholdAddress()));
				stmt.setString(23, StringEscapeUtils.escapeSql(userRo.getHouseholdPostcode()));
				stmt.setString(24, userRo.getId());
			}
		});

		return 1;
	}

	/**
	 * 用户修改昵称
	 * @param userId
	 * @param name
	 * @return
	 */
	public boolean updateUsedName(String userId,String name){
		return this.jdbcTemplate.update("update om_userprofile set UsedName=? where Pk_User=?", name,userId)>1;
	}

	/**
	 * 用户修改姓名
	 * @param userId
	 * @param name
	 * @return
	 */
	public boolean updateName(String userId,String name){
		String firstName=name.substring(0,1);
		String lastName=name.substring(1);
		return this.jdbcTemplate.update("update om_userprofile set LastName=?,FirstName=? where Pk_User=?", lastName,firstName,userId)>1;
	}


	public void updateLoginCounting(final String pk_user) throws SQLException {

		String sql = "update om_userprofile set LoginCounting=LoginCounting+1 where Pk_User=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, pk_user);
			}
		});

	}

	/**
	 * Gets whether the user record object with <code>username<code> exists in
	 * current repository.
	 *
	 * @date 02/11/2011 11:46:55 AM
	 * @param userName
	 * @return
	 * @throws SQLException
	 */
	public boolean existsUsername(final String userName) throws SQLException {

		String sql = "select count(*) from om_userprofile where UserName=?";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { userName }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});

		return counts.get(0).intValue() > 0 ? true : false;
	}

	public boolean existsEmail(final String Email) throws SQLException {

		String sql = "select count(*) from om_userprofile where Email=?";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { Email }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});

		return counts.get(0).intValue() > 0 ? true : false;
	}

	public boolean existsMobile(final String Mobile) throws SQLException {

		String sql = "select count(*) from om_userprofile where Mobile=?";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { Mobile }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});

		return counts.get(0).intValue() > 0 ? true : false;
	}

	public boolean existsidNumber(final String idNumber) throws SQLException {

		String sql = "select count(*) from om_userprofile where idNumber=?";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { idNumber }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});

		return counts.get(0).intValue() > 0 ? true : false;
	}

	/**
	 * Gets whether the user record object with
	 * <code>username<code> and <code>password</code> exists in current
	 * repository.
	 *
	 * @date 02/11/2011 11:46:55 AM
	 * @param userName
	 * @return
	 * @throws SQLException
	 */
	public User queryUsername(final String userName) throws SQLException {

		String sql = "select * from om_userprofile where UserName=? or IdNumber = ? or Email = ? or mobile = ?";
		List<User> users = jdbcTemplate.query(sql, new String[] { userName, userName, userName, userName },
				new RowMapper<User>() {
					public User mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getResultSet(new User(), rs);
					}
				});

		if (!users.isEmpty()) {
			return (User) users.get(0);
		}
		return null;
	}

	// login by mobile and verify code
	public User queryMobile(final String mobile) throws SQLException {

		String sql = "select * from om_userprofile where mobile = ?";
		List<User> users = jdbcTemplate.query(sql, new String[] { mobile }, new RowMapper<User>() {
			public User mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new User(), rs);
			}
		});

		if (users.isEmpty()) {
			return null;
		} else if (users.size() == 1) { // list contains exactly 1 element
			return (User) users.get(0);
		}
		return null;
	}

	/**
	 * Update user password policy.
	 *
	 * @param uRO
	 * @throws SQLException
	 */
	public void updatePassword(final String username, final String password) throws SQLException {

		String sql = "update om_userprofile set Passwd=?, PasswdExpirationDate=? where UserName=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, password);
				// one month expiration date
				java.util.Date dt = DateUtility.getDateAfter(new java.util.Date(), 30);
				stmt.setTimestamp(2, new Timestamp(dt.getTime()));
				stmt.setString(3, username);
			}
		});

	}

	/**
	 * Update user password policy.
	 *
	 * @param uRO
	 * @throws SQLException
	 */
	// 根据手机号修改密码
	public int updatePasswordByMobile(final String mobile, final String password) throws SQLException {

		String sql = "update om_userprofile set Passwd=?, PasswdExpirationDate=? where mobile=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, password);
				// one month expiration date
				java.util.Date dt = DateUtility.getDateAfter(new java.util.Date(), 30);
				stmt.setTimestamp(2, new Timestamp(dt.getTime()));
				stmt.setString(3, mobile);
			}
		});

		return 1;
	}

	/**
	 * 获取联系人列表
	 * @param orgId
	 * @param userId
	 * @return
	 * @throws Exception
	 */
	public List<Contact> getAllUserByOrgId(String orgId,String userId) throws Exception{
		String sql = "SELECT LastName,FirstName,Fk_User,companyname,position,department FROM (" +
				"SELECT u.*,j.Fk_PositionRole FROM (" +
				"SELECT LastName,FirstName,Pk_Staff,Fk_User,o.NameLocal companyname " +
				"FROM om_userprofile u,om_staff s,om_organization o " +
				"WHERE u.Pk_User=s.Fk_User AND s.Fk_Owner=o.Pk_Organization AND Fk_Owner=?) u " +
				"LEFT JOIN om_job_assignment j ON j.Fk_Staff=u.Pk_Staff) a LEFT JOIN (" +
				"SELECT p.NameLocal position,p.Pk_Position,d.NameLocal department " +
				"FROM om_position p,om_department d " +
				"WHERE p.Fk_CurrOwner=d.Pk_Department) b ON a.Fk_PositionRole=b.Pk_Position WHERE Fk_User <> ?";
		Map<String,Contact> resultMap= jdbcTemplate.query(sql, new String[]{orgId,userId}, rs -> {
			Map<String,Contact> contactMap=new HashMap<>();
			while (rs.next()){
				Contact contact = new Contact();
				contact.setFname(rs.getString("LastName") + rs.getString("FirstName"));
				contact.setUserId(rs.getString("Fk_User"));
				contact.setCompanyName(rs.getString("companyname"));
				contact.setPosition(rs.getString("position"));
				contact.setDepartment(rs.getString("department"));

				Contact repageContact = contactMap.putIfAbsent(contact.getUserId(), contact);
				if(repageContact != null){
					repageContact.setPosition(repageContact.getPosition() + "," + contact.getPosition());
				}
			}
			return contactMap;
		});
		return resultMap.values().stream().collect(Collectors.toList());
	}

	public List<Contact> getUsersWithoutOwner(String userId){
		return jdbcTemplate.query("select LastName,FirstName,Pk_User from om_userprofile where (Pk_User not in (select Fk_User from om_staff) and Pk_User!=?)", (rs,i)->{
			Contact contact=new Contact();
			contact.setFname(rs.getString("LastName") + rs.getString("FirstName"));
			contact.setUserId(rs.getString("Pk_User"));
			return contact;
		},userId);
	}
}
