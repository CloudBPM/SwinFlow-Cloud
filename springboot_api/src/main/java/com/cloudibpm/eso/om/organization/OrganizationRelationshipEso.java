/**
 * 
 */
package com.cloudibpm.eso.om.organization;

import com.cloudibpm.core.organization.OrganizationRelationship;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * @author Dahai Cao created on 2016-10-21
 * @since Cloud BPM 2016
 *
 */
@Repository
public class OrganizationRelationshipEso {
	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public OrganizationRelationshipEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public List<OrganizationRelationship> queryAll(String fk_organization, int relationship) throws Exception {
		
		String sql = "select Fk_OrganizationA,Fk_OrganizationB,Relationship,Valid,CreateDate,InvalidateDate "
				+ "from om_organization_relationship where (Fk_OrganizationA=? or Fk_OrganizationB=?) and Valid=1 and Relationship=?";
		List<OrganizationRelationship> lst = jdbcTemplate.query(sql, new Object[] { fk_organization, relationship },
				new RowMapper<OrganizationRelationship>() {
					public OrganizationRelationship mapRow(ResultSet rs, int rowNum) throws SQLException {
						OrganizationRelationship r = new OrganizationRelationship();
						r.setOrgAId(rs.getString("Fk_OrganizationA"));
						r.setOrgBId(rs.getString("Fk_OrganizationB"));
						r.setRelationship(rs.getInt("Relationship"));
						r.setCreateDate(rs.getTimestamp("CreateDate"));
						r.setCreateDate(rs.getTimestamp("InvalidateDate"));
						return r;
					}
				});
		
		return lst;
	}
	
	public List<OrganizationRelationship> queryAllforSelect(String fk_organization, int relationship) throws Exception {
		
		String sql = "select Fk_OrganizationA,Fk_OrganizationB "
				+ "from om_organization_relationship where (Fk_OrganizationA=? or Fk_OrganizationB=?) and Valid=1 and Relationship=?";
		List<OrganizationRelationship> lst = jdbcTemplate.query(sql, new Object[] { fk_organization, fk_organization, relationship },
				new RowMapper<OrganizationRelationship>() {
					public OrganizationRelationship mapRow(ResultSet rs, int rowNum) throws SQLException {
						OrganizationRelationship r = new OrganizationRelationship();
						r.setOrgAId(rs.getString("Fk_OrganizationA"));
						r.setOrgBId(rs.getString("Fk_OrganizationB"));
						return r;
					}
				});
		
		return lst;
	}


}
