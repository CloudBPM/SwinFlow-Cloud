package com.cloudibpm.eso.reference;

import com.cloudibpm.core.reference.ReferenceDetail;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
@Repository
public class ReferenceDetailEso  {

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public ReferenceDetailEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * Insert a new reference detail into repository. This method will insert or
	 * update values into all fields of fm_reference_detail.
	 * 
	 * @param ref
	 *            ReferenceDetail
	 * @throws SQLException
	 */
	public void insert(final ReferenceDetail ref) throws SQLException {
		
		String sql = "insert into fm_reference_detail "
				+ "(Pk_ReferenceDetail,Code,Text,Description,ParentCode,Status,Fk_Parent,Fk_CurrOwner,Fk_Owner,CustomColumn1,CustomColumn2,CustomColumn3) "
				+ "values (?,?,?,?,?,?,?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, ref.getId());
				stmt.setString(2, ref.getCode());
				stmt.setString(3, StringEscapeUtils.escapeSql(ref.getName()));
				stmt.setString(4, StringEscapeUtils.escapeSql(ref.getDescription()));
				stmt.setString(5, ref.getParentCode());
				stmt.setInt(6, ref.getStatus());
				stmt.setString(7, ref.getParent());
				stmt.setString(8, ref.getCurrOwner());
				stmt.setString(9, ref.getOwner());
				stmt.setString(10, StringEscapeUtils.escapeSql(ref.getCustomColumn1()));
				stmt.setString(11, StringEscapeUtils.escapeSql(ref.getCustomColumn2()));
				stmt.setString(12, StringEscapeUtils.escapeSql(ref.getCustomColumn3()));
			}
		});
		
	}

	public void update(final ReferenceDetail ref) throws SQLException {
		
		String sql = "update fm_reference_detail set"
				+ " Code=?,Text=?,Description=?,ParentCode=?,Status=?,Fk_Parent=?,CustomColumn1=?,CustomColumn2=?,CustomColumn3=? "
				+ "where Pk_ReferenceDetail=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, ref.getCode());
				stmt.setString(2, StringEscapeUtils.escapeSql(ref.getName()));
				stmt.setString(3, StringEscapeUtils.escapeSql(ref.getDescription()));
				stmt.setString(4, ref.getParentCode());
				stmt.setInt(5, ref.getStatus());
				stmt.setString(6, ref.getParent());
				stmt.setString(7, StringEscapeUtils.escapeSql(ref.getCustomColumn1()));
				stmt.setString(8, StringEscapeUtils.escapeSql(ref.getCustomColumn2()));
				stmt.setString(9, StringEscapeUtils.escapeSql(ref.getCustomColumn3()));
				stmt.setString(10, ref.getId());
			}
		});
		
	}

	public void delete(final ReferenceDetail ref) throws SQLException {
		
		String sql = "delete from fm_reference_detail where Pk_ReferenceDetail=?";
		jdbcTemplate.update(sql, new Object[] { ref.getId() });
		
	}

	/**
	 * 
	 * @param pk
	 * @return ReferenceDetail
	 * @throws Exception
	 */
	public ReferenceDetail queryByPk(String pk) throws Exception {
		
		String sql = "Select Pk_ReferenceDetail,Code,Text,Description,ParentCode,Status,Fk_Parent,Fk_CurrOwner,Fk_Owner,CustomColumn1,CustomColumn2,CustomColumn3 "
				+ "from fm_reference_detail where Pk_ReferenceDetail=?";
		List<ReferenceDetail> list = jdbcTemplate.query(sql, new Object[] { pk }, new RowMapper<ReferenceDetail>() {
			public ReferenceDetail mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getReferenceDetailFromResultSet(new ReferenceDetail(), rs);
			}
		});
		
		if (!list.isEmpty())
			return list.get(0);
		else
			return null;
	}

	/**
	 * 
	 * @param fk_curOwner
	 * @return ReferenceDetail List
	 * @throws Exception
	 */
	public List<ReferenceDetail> queryAllReferenceDetails(String fk_curOwner) throws Exception {
		
		String sql = "Select Pk_ReferenceDetail,Code,Text,Description,ParentCode,Status,Fk_Parent,Fk_CurrOwner,Fk_Owner,CustomColumn1,CustomColumn2,CustomColumn3 "
				+ "from fm_reference_detail where Fk_CurrOwner=?";
		List<ReferenceDetail> procList = jdbcTemplate.query(sql, new Object[] { fk_curOwner },
				new RowMapper<ReferenceDetail>() {
					public ReferenceDetail mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getReferenceDetailFromResultSet(new ReferenceDetail(), rs);
					}
				});
		
		return procList;
	}

	/**
	 * 
	 * @param parentCode
	 * @param fk_curOwner
	 * @return
	 * @throws Exception
	 */
	public List<ReferenceDetail> queryAllReferenceDetails(String parentCode, String fk_curOwner) throws Exception {
		
		if (parentCode == null || parentCode.equals("")) {
			String sql = "Select Pk_ReferenceDetail,Code,Text,Description,ParentCode,Status,Fk_Parent,Fk_CurrOwner,Fk_Owner,CustomColumn1,CustomColumn2,CustomColumn3 "
					+ "from fm_reference_detail where ParentCode is null and Fk_CurrOwner=?";
			List<ReferenceDetail> procList = jdbcTemplate.query(sql, new Object[] { fk_curOwner },
					new RowMapper<ReferenceDetail>() {
						public ReferenceDetail mapRow(ResultSet rs, int rowNum) throws SQLException {
							return getReferenceDetailFromResultSet(new ReferenceDetail(), rs);
						}
					});
			
			return procList;
		} else {
			String sql = "Select Pk_ReferenceDetail,Code,Text,Description,ParentCode,Status,Fk_Parent,Fk_CurrOwner,Fk_Owner,CustomColumn1,CustomColumn2,CustomColumn3 "
					+ "from fm_reference_detail where ParentCode=? and Fk_CurrOwner=?";
			List<ReferenceDetail> procList = jdbcTemplate.query(sql, new Object[] { parentCode, fk_curOwner },
					new RowMapper<ReferenceDetail>() {
						public ReferenceDetail mapRow(ResultSet rs, int rowNum) throws SQLException {
							return getReferenceDetailFromResultSet(new ReferenceDetail(), rs);
						}
					});
			
			return procList;
		}

	}

	public ReferenceDetail getReferenceDetailFromResultSet(ReferenceDetail ref, ResultSet rs) throws SQLException {
		ref.setId(rs.getString("Pk_ReferenceDetail"));
		ref.setCode(rs.getString("Code"));
		ref.setName(rs.getString("Text"));
		ref.setDescription(rs.getString("Description"));
		ref.setParentCode(rs.getString("ParentCode"));
		ref.setStatus(rs.getInt("Status"));
		ref.setParent(rs.getString("Fk_Parent"));
		ref.setCurrOwner(rs.getString("Fk_CurrOwner"));
		ref.setOwner(rs.getString("Fk_Owner"));
		ref.setCustomColumn1(rs.getString("CustomColumn1"));
		ref.setCustomColumn2(rs.getString("CustomColumn2"));
		ref.setCustomColumn3(rs.getString("CustomColumn3"));
		return ref;
	}

	public void deleteAllDetails(final String fk_ref) throws SQLException {
		
		String sql = "delete from fm_reference_detail where Fk_CurrOwner=?";
		jdbcTemplate.update(sql, new Object[] { fk_ref });
		
	}

}
