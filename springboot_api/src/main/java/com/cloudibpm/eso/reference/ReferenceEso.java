/**
 * 
 */
package com.cloudibpm.eso.reference;

import com.cloudibpm.core.reference.Reference;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

/**
 * @author Dahai Cao created on 2017-05-31
 *
 */
@Repository
public class ReferenceEso {

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public ReferenceEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * Insert a new reference into repository. This method will insert or update
	 * values into all fields of fm_reference.
	 * 
	 * @param ref
	 *            Reference
	 * @throws SQLException
	 */
	public void insert(final Reference ref) throws SQLException {
		
		String sql = "insert into fm_reference "
				+ "(Pk_Reference,ReferenceName,Description,CreatedDateTime,Lastupdate,Fk_Parent,Fk_Owner) values (?,?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, ref.getId());
				stmt.setString(2, StringEscapeUtils.escapeSql(ref.getName()));
				stmt.setString(3, StringEscapeUtils.escapeSql(ref.getDescription()));
				stmt.setTimestamp(4, new Timestamp(ref.getCreateDatetime()));
				stmt.setTimestamp(5, new Timestamp(ref.getLastupdate()));
				stmt.setString(6, ref.getParent());
				stmt.setString(7, ref.getOwner());
			}
		});
		
	}

	public void update(final Reference ref) throws SQLException {
		
		String sql = "update fm_reference set " + "ReferenceName=?,Description=?,Lastupdate=? where Pk_Reference=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, StringEscapeUtils.escapeSql(ref.getName()));
				stmt.setString(2, StringEscapeUtils.escapeSql(ref.getDescription()));
				stmt.setTimestamp(3, new Timestamp(ref.getLastupdate()));
				stmt.setString(4, ref.getId());
			}
		});
		
	}

	public void updateReferenceName(final String pk_refer, final String refername, final long lastupdate)
			throws SQLException {
		
		String sql = "update fm_reference set ReferenceName=?,Lastupdate=? where Pk_Reference=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, refername);
				stmt.setTimestamp(2, new Timestamp(lastupdate));
				stmt.setString(3, pk_refer);
			}
		});
		
	}

	public List<Reference> queryAllReferences(String fk_parent, String fk_owner) throws Exception {
		
		String sql = "Select Pk_Reference,ReferenceName,Description,CreatedDateTime,Lastupdate,Fk_Parent,Fk_Owner "
				+ "from fm_reference where Fk_Parent=? and Fk_Owner=?";
		List<Reference> procList = jdbcTemplate.query(sql, new Object[] { fk_parent, fk_owner },
				new RowMapper<Reference>() {
					public Reference mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getReferenceFromResultSet(new Reference(), rs);
					}
				});
		
		return procList;
	}

	public List<Reference> queryAllReferences(String fk_owner) throws Exception {
		
		String sql = "Select Pk_Reference,ReferenceName,Description,CreatedDateTime,Lastupdate,Fk_Parent,Fk_Owner "
				+ "from fm_reference where Fk_Owner is null or Fk_Owner=?";
		List<Reference> procList = jdbcTemplate.query(sql, new Object[] { fk_owner }, new RowMapper<Reference>() {
			public Reference mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getReferenceFromResultSet(new Reference(), rs);
			}
		});
		
		return procList;
	}

	public Reference queryByPk(String pk) throws Exception {
		
		String sql = "Select Pk_Reference,ReferenceName,Description,CreatedDateTime,Lastupdate,Fk_Parent,Fk_Owner "
				+ "from fm_reference where Pk_Reference=?";
		List<Reference> list = jdbcTemplate.query(sql, new Object[] { pk }, new RowMapper<Reference>() {
			public Reference mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getReferenceFromResultSet(new Reference(), rs);
			}
		});
		
		if (list.isEmpty()) {
			return null;
		} else
			return list.get(0);
	}

	public Reference getReferenceFromResultSet(Reference ref, ResultSet rs) throws SQLException {
		ref.setId(rs.getString("Pk_Reference"));
		ref.setName(rs.getString("ReferenceName"));
		ref.setDescription(rs.getString("Description"));
		ref.setCreateDatetime(rs.getTimestamp("CreatedDateTime").getTime());
		ref.setLastupdate(rs.getTimestamp("Lastupdate").getTime());
		ref.setParent(rs.getString("Fk_Parent"));
		ref.setOwner(rs.getString("Fk_Owner"));
		return ref;
	}

	public void delete(final String pk_ref) throws SQLException {
		
		String sql = "delete from fm_reference where Pk_Reference=?";
		jdbcTemplate.update(sql, new Object[] { pk_ref });
		
	}

}
