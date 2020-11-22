package com.cloudibpm.eso.form;

import com.cloudibpm.core.form.Form;
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

@Repository
public class FormEso  {

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public FormEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public List<Form> queryAllOfOwner(String fk_owner) throws Exception {
		
		String sql = "Select Pk_Form,FormCode,FormName,Description,Keywords,Author,CreateDatetime,Lastupdate,Status,"
				+ "PurchasePrice,UsagePrice,Fk_Parent,Fk_Owner,FormContent,ServiceType,AuthorId" +
				" from fm_form where Fk_Owner=?";
		List<Form> procList = jdbcTemplate.query(sql, new Object[] { fk_owner }, new RowMapper<Form>() {
			public Form mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getFormFromResultSet(new Form(), rs);
			}
		});
		
		return procList;
	}

	public Form queryByPk(String pk_form) throws Exception {
		
		String sql = "Select Pk_Form,FormCode,FormName,Description,Keywords,Author,CreateDatetime,Lastupdate,Status,"
				+ "PurchasePrice,UsagePrice,Fk_Parent,Fk_Owner,FormContent,ServiceType,AuthorId" +
				" from fm_form where Pk_Form=?";
		List<Form> procList = jdbcTemplate.query(sql, new Object[] { pk_form }, new RowMapper<Form>() {
			public Form mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getFormFromResultSet(new Form(), rs);
			}
		});
		
		if (!procList.isEmpty()) {
			return procList.get(0);
		} else {
			return null;
		}
	}

	public Form getFormFromResultSet(Form form, ResultSet rs) throws SQLException {
		form.setId(rs.getString("Pk_Form"));
		form.setCode(rs.getString("FormCode"));
		form.setName(rs.getString("FormName"));
		form.setDescription(rs.getString("Description"));
		form.setKeywords(rs.getString("Keywords"));
		form.setAuthorId(rs.getString("AuthorId"));
		form.setAuthor(rs.getString("Author"));
		form.setCreateDatetime(rs.getTimestamp("CreateDatetime").getTime());
		form.setLastupdate(rs.getTimestamp("Lastupdate").getTime());
		form.setStatus(rs.getInt("Status"));
		form.setPurchasePrice(rs.getDouble("PurchasePrice"));
		form.setUsagePrice(rs.getDouble("UsagePrice"));
		form.setParent(rs.getString("Fk_Parent"));
		form.setOwner(rs.getString("Fk_Owner"));
		form.setFormContent(rs.getString("FormContent"));
		form.setServiceType(rs.getInt("ServiceType"));
		return form;
	}

	/**
	 * Insert a new form definition into repository. This method will insert or
	 * update values into all fields of fm_form.
	 * 
	 * @param f
	 *            Form
	 * @throws SQLException
	 */
	public void insert(final Form f) throws SQLException {
		
		String sql = "insert into fm_form "
				+ "(Pk_Form,FormCode,FormName,Description,Keywords,Author,CreateDatetime,Lastupdate,Status,"
				+ "PurchasePrice,UsagePrice,Fk_Parent,Fk_Owner, ServiceType,AuthorId) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, f.getId());
				stmt.setString(2, f.getCode());
				stmt.setString(3, f.getName());
				stmt.setString(4, f.getDescription());
				stmt.setString(5, f.getKeywords());
				stmt.setString(6, f.getAuthor());
				stmt.setTimestamp(7, new Timestamp(f.getCreateDatetime()));
				stmt.setTimestamp(8, new Timestamp(f.getLastupdate()));
				stmt.setInt(9, f.getStatus());
				stmt.setDouble(10, f.getPurchasePrice());
				stmt.setDouble(11, f.getUsagePrice());
				stmt.setString(12, f.getParent());
				stmt.setString(13, f.getOwner());
				stmt.setInt(14, f.getServiceType());
				stmt.setString(15,f.getAuthorId());
			}
		});
		
	}

	/**
	 * Update a new form definition into repository. This method will insert or
	 * update values into all fields of fm_form.
	 * 
	 * @param f
	 *            Form
	 * @throws SQLException
	 */
	public void update(final Form f) throws SQLException {
		
		String sql = "update fm_form set " + "FormCode=?,FormName=?,Description=?,Keywords=?,Author=?,Status=?,"
				+ "PurchasePrice=?,UsagePrice=?,Fk_Parent=?,FormContent=?,Lastupdate=?, ServiceType=?,AuthorId=? where Pk_Form=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, f.getCode());
				stmt.setString(2, f.getName());
				stmt.setString(3, f.getDescription());
				stmt.setString(4, f.getKeywords());
				stmt.setString(5, f.getAuthor());
				stmt.setInt(6, f.getStatus());
				stmt.setDouble(7, f.getPurchasePrice());
				stmt.setDouble(8, f.getUsagePrice());
				stmt.setString(9, f.getParent());
				stmt.setString(10, f.getFormContent());
				stmt.setTimestamp(11, new Timestamp(f.getLastupdate()));
                stmt.setInt(12, f.getServiceType());
				stmt.setString(13, f.getAuthorId());
				stmt.setString(14, f.getId());
			}
		});
		
	}

	public List<Form> queryAll(String fk_parent, String fk_owner) throws Exception {
		
		String sql = "Select Pk_Form,FormCode,FormName,Description,Keywords,Author,CreateDatetime,Lastupdate,Status,"
				+ "PurchasePrice,UsagePrice,Fk_Parent,Fk_Owner,FormContent, ServiceType, AuthorId " +
				"from fm_form where Fk_Parent=? and Fk_Owner=?";
		List<Form> procList = jdbcTemplate.query(sql, new Object[] { fk_parent, fk_owner }, new RowMapper<Form>() {
			public Form mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getFormFromResultSet(new Form(), rs);
			}
		});
		
		return procList;
	}

	public void delete(String primaryKey) throws SQLException {
		
		String sql = "delete from fm_form where Pk_Form=?";
		jdbcTemplate.update(sql, new Object[] { primaryKey });
		
	}
}
