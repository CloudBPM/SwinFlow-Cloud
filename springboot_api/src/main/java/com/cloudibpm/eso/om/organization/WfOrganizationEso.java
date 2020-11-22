/**
 * 
 */
package com.cloudibpm.eso.om.organization;

import com.cloudibpm.core.organization.Organization;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.text.ParseException;
import java.util.List;

/**
 * @author CAO Dahai
 * 
 */
@Repository
public class WfOrganizationEso {
	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public WfOrganizationEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public void insert(final Organization org) throws SQLException {
		
		String sql = "insert into om_organization (Pk_Organization, NameLocal, AbbrLocal, NameInternational,"
				+ "AbbrInternational, RegistrationCode, RegistrationDate,"
				+ "Representative, SerialNumber, Address, City,Province, Country, Postcode, PhoneNumber,"
				+ "FaxNumber, Website, Email, Microblog, Wechat, CustomerService, IsHeadOffice, BusinessScope,"
				+ "Introduction, Status, MotherId, Lastupdate, BankAccountNumber, BankAccountName, BankAddress, BSB,"
				+ "APIAccessKey, APISecretKey, BusinessCategoryId, BusinessTypeId, StaffNumberId, UniCounting,County)"
				+ "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, org.getId());
				stmt.setString(2, StringEscapeUtils.escapeSql(org.getName()));
				stmt.setString(3, StringEscapeUtils.escapeSql(org.getAbbrLocal()));
				stmt.setString(4, StringEscapeUtils.escapeSql(org.getNameInternational()));
				stmt.setString(5, StringEscapeUtils.escapeSql(org.getAbbrInternational()));
				stmt.setString(6, StringEscapeUtils.escapeSql(org.getRegistrationCode()));
				stmt.setTimestamp(7, new Timestamp(org.getRegistrationDate()));
				stmt.setString(8, StringEscapeUtils.escapeSql(org.getRepresentative()));
				stmt.setString(9, org.getSerialNumber());
				stmt.setString(10, StringEscapeUtils.escapeSql(org.getAddress()));
				stmt.setString(11, org.getCity());
				stmt.setString(12, org.getProvince());
				stmt.setString(13, org.getCountry());
				stmt.setString(14, org.getPostCode());
				stmt.setString(15, org.getPhoneNumber());
				stmt.setString(16, org.getFaxNumber());
				stmt.setString(17, StringEscapeUtils.escapeSql(org.getWebsite()));
				stmt.setString(18, StringEscapeUtils.escapeSql(org.getEmail()));
				stmt.setString(19, StringEscapeUtils.escapeSql(org.getMicroblog()));
				stmt.setString(20, StringEscapeUtils.escapeSql(org.getWebchat()));
				stmt.setString(21, StringEscapeUtils.escapeSql(org.getCustomerService()));
				stmt.setString(22, org.isHeadOffice());
				stmt.setString(23, org.getBusinessScope());
				stmt.setString(24, StringEscapeUtils.escapeSql(org.getIntroduction()));
				stmt.setInt(25, org.getStatus());
				if (org.getOwner() != null)
					stmt.setString(26, org.getOwner());
				else
					stmt.setString(26, null);
				stmt.setTimestamp(27, new Timestamp(org.getLastupdate()));
				stmt.setString(28, StringEscapeUtils.escapeSql(org.getBankAccountNumber()));
				stmt.setString(29, StringEscapeUtils.escapeSql(org.getBankAccountName()));
				stmt.setString(30, StringEscapeUtils.escapeSql(org.getBankAddress()));
				stmt.setString(31, org.getBsb());
				stmt.setString(32, StringEscapeUtils.escapeSql(org.getApiAccessKey()));
				stmt.setString(33, StringEscapeUtils.escapeSql(org.getApiSecretKey()));
				stmt.setString(34, org.getBusinessCategory());
				stmt.setString(35, org.getBusinessType());
				stmt.setString(36, org.getStaffNumber());
				stmt.setInt(37, org.getUniCount());
				stmt.setString(38, org.getCounty());
			}
		});
		
	}
	//根据公司名查找公司信息
    public Organization queryByNameLocal(String nameLocal) throws Exception {
        
        String sql = "select * from om_organization where NameLocal = ?";
        List<Organization> lst = jdbcTemplate.query(sql, new String[]{nameLocal}, new RowMapper<Organization>() {
            public Organization mapRow(ResultSet rs, int rowNum) throws SQLException {
                return getResultSet(new Organization(), rs);

            }
        });
        
        if (!lst.isEmpty()) {
            return lst.get(0);
        } else {
            return null;
        }
    }

	public List<Organization> queryAll() throws Exception {
		
		String sql = "select * from om_organization";
		List<Organization> lst = jdbcTemplate.query(sql, new RowMapper<Organization>() {
			public Organization mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new Organization(), rs);
			}
		});
		
		return lst;
	}

	private Organization getResultSet(Organization orgRO, ResultSet rs) throws SQLException {
		orgRO.setId(rs.getString("Pk_Organization"));
		orgRO.setName(rs.getString("NameLocal"));
		orgRO.setAbbrLocal(rs.getString("AbbrLocal"));
		orgRO.setNameInternational(rs.getString("NameInternational"));
		orgRO.setAbbrInternational(rs.getString("AbbrInternational"));
		orgRO.setRegistrationCode(rs.getString("RegistrationCode"));
		orgRO.setRegistrationDate(rs.getTimestamp("RegistrationDate").getTime());
		orgRO.setRepresentative(rs.getString("Representative"));
		orgRO.setSerialNumber(rs.getString("SerialNumber"));
		orgRO.setAddress(rs.getString("Address"));
		orgRO.setCity(rs.getString("City"));
		orgRO.setProvince(rs.getString("Province"));
		orgRO.setCountry(rs.getString("Country"));
		orgRO.setPostCode(rs.getString("Postcode"));
		orgRO.setPhoneNumber(rs.getString("PhoneNumber"));
		orgRO.setFaxNumber(rs.getString("FaxNumber"));
		orgRO.setWebsite(rs.getString("Website"));
		orgRO.setEmail(rs.getString("Email"));
		orgRO.setMicroblog(rs.getString("Microblog"));
		orgRO.setWebchat(rs.getString("Wechat"));
		orgRO.setCustomerService(rs.getString("CustomerService"));
		orgRO.setHeadOffice(rs.getString("IsHeadOffice"));
		orgRO.setBusinessScope(rs.getString("BusinessScope"));
		orgRO.setIntroduction(rs.getString("Introduction"));
		orgRO.setStatus(rs.getInt("Status"));
		String mid = rs.getString("MotherId");
		if (mid != null) {
			orgRO.setOwner(mid);
		}
		orgRO.setLastupdate(rs.getTimestamp("Lastupdate").getTime());
		orgRO.setBankAccountNumber(rs.getString("BankAccountNumber"));
		orgRO.setBankAccountName(rs.getString("BankAccountName"));
		orgRO.setBankAddress(rs.getString("BankAddress"));
		orgRO.setBsb(rs.getString("BSB"));
		orgRO.setApiAccessKey(rs.getString("APIAccessKey"));
		orgRO.setApiSecretKey(rs.getString("APISecretKey"));
		orgRO.setBusinessCategory(rs.getString("BusinessCategoryId"));
		orgRO.setBusinessType(rs.getString("BusinessTypeId"));
		orgRO.setStaffNumber(rs.getString("StaffNumberId"));
		orgRO.setUniCount(rs.getInt("UniCounting"));
		orgRO.setCategoryId(rs.getString("Fk_Category"));
		return orgRO;
	}

	public List<Organization> queryByIds(String[] ids) throws Exception {
		
		StringBuffer sb = new StringBuffer();
		sb.append("(");
		for (int i = 0; i < ids.length; i++) {
			sb.append("'");
			sb.append(ids[i]);
			sb.append("'");
			if (i < ids.length - 1) {
				sb.append(", ");
			}
		}
		sb.append(")");
		String sql = "select * from om_organization where Pk_Organization in " + sb.toString();
		List<Organization> lst = jdbcTemplate.query(sql, new RowMapper<Organization>() {
			public Organization mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new Organization(), rs);
			}
		});
		
		return lst;
	}

	public Organization queryByPK(String primaryKey) throws Exception {
		
		String sql = "select * from om_organization where Pk_Organization = ?";
		List<Organization> lst = jdbcTemplate.query(sql, new String[] { primaryKey }, new RowMapper<Organization>() {
			public Organization mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new Organization(), rs);

			}
		});
		
		if (!lst.isEmpty()) {
			return lst.get(0);
		} else {
			return null;
		}
	}

	public List<Organization> queryOthersByPK(String primaryKey) throws Exception {
		
		String sql = "select * from om_organization where Pk_Organization != ?";
		List<Organization> lst = jdbcTemplate.query(sql, new String[] { primaryKey }, new RowMapper<Organization>() {
			public Organization mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new Organization(), rs);
			}
		});
		
		return lst;
	}

	public Organization queryNameByPK(String primaryKey) throws Exception {
		
		String sql = "select Pk_Organization, NameLocal from om_organization where Pk_Organization = ? limit 1";
		List<Organization> lst = jdbcTemplate.query(sql, new String[] { primaryKey }, new RowMapper<Organization>() {
			public Organization mapRow(ResultSet rs, int rowNum) throws SQLException {
				Organization orgRO = new Organization();
				orgRO.setId(rs.getString("Pk_Organization"));
				orgRO.setName(rs.getString("NameLocal"));
				return orgRO;
			}
		});
		
		if (!lst.isEmpty()) {
			return lst.get(0);
		} else {
			return null;
		}
	}

	public List<Organization> queryOrganizationName(String condition, String fk_owner) throws Exception {
		
		String sql = "select Pk_Organization, NameLocal from om_organization where Pk_Organization != ? and NameLocal like ? or AbbrLocal like ? or NameInternational like ? or AbbrInternational like ? order by NameLocal asc";
		String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
		List<Organization> lst = jdbcTemplate.query(sql, new String[] { fk_owner, c, c, c, c },
				new RowMapper<Organization>() {
					public Organization mapRow(ResultSet rs, int rowNum) throws SQLException {
						Organization orgRO = new Organization();
						orgRO.setId(rs.getString("Pk_Organization"));
						orgRO.setName(rs.getString("NameLocal"));
						return orgRO;
					}
				});
		
		return lst;
	}

	/**
	 * update organization
	 * 
	 * @author CAO Dahai
	 * @date 2008-10-10 下午09:53:54
	 * @param org
	 * @throws SQLException
	 * @throws ParseException
	 */
	public void update(final Organization org) throws SQLException {
		
		String sql = "update om_organization "
				+ "set NameLocal=?, AbbrLocal=?, NameInternational=?, AbbrInternational=?, "
				+ "RegistrationCode=?, RegistrationDate=?, Representative=?,"
				+ "Address=?, City=?, Province=?, Country=?,Postcode=?, PhoneNumber=?, FaxNumber=?, Website=?,"
				+ "Email=?, Microblog=?, Wechat=?, CustomerService=?, IsHeadOffice=?, BusinessScope=?, Introduction=?, Status=?, "
				+ "MotherId=?, Lastupdate=?, BankAccountNumber=?, BankAccountName=?, BankAddress=?, BSB=?, APIAccessKey=?,"
				+ "APISecretKey=?, BusinessCategoryId=?, BusinessTypeId=?, StaffNumberId=?, SerialNumber=?,Fk_Category=? where Pk_Organization=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, StringEscapeUtils.escapeSql(org.getName()));
				stmt.setString(2, StringEscapeUtils.escapeSql(org.getAbbrLocal()));
				stmt.setString(3, StringEscapeUtils.escapeSql(org.getNameInternational()));
				stmt.setString(4, StringEscapeUtils.escapeSql(org.getAbbrInternational()));
				stmt.setString(5, StringEscapeUtils.escapeSql(org.getRegistrationCode()));
				stmt.setTimestamp(6, new Timestamp(org.getRegistrationDate()));
				stmt.setString(7, StringEscapeUtils.escapeSql(org.getRepresentative()));
				stmt.setString(8, StringEscapeUtils.escapeSql(org.getAddress()));
				stmt.setString(9, org.getCity());
				stmt.setString(10, org.getProvince());
				stmt.setString(11, org.getCountry());
				stmt.setString(12, StringEscapeUtils.escapeSql(org.getPostCode()));
				stmt.setString(13, StringEscapeUtils.escapeSql(org.getPhoneNumber()));
				stmt.setString(14, StringEscapeUtils.escapeSql(org.getFaxNumber()));
				stmt.setString(15, StringEscapeUtils.escapeSql(org.getWebsite()));
				stmt.setString(16, StringEscapeUtils.escapeSql(org.getEmail()));
				stmt.setString(17, StringEscapeUtils.escapeSql(org.getMicroblog()));
				stmt.setString(18, StringEscapeUtils.escapeSql(org.getWebchat()));
				stmt.setString(19, StringEscapeUtils.escapeSql(org.getCustomerService()));
				stmt.setString(20, org.isHeadOffice());
				stmt.setString(21, org.getBusinessScope());
				stmt.setString(22, org.getIntroduction());
				stmt.setInt(23, org.getStatus());
				if (org.getOwner() != null)
					stmt.setString(24, org.getOwner());
				else
					stmt.setString(24, null);
				stmt.setTimestamp(25, new Timestamp(org.getLastupdate()));
				stmt.setString(26, org.getBankAccountNumber());
				stmt.setString(27, org.getBankAccountName());
				stmt.setString(28, org.getBankAddress());
				stmt.setString(29, org.getBsb());
				stmt.setString(30, org.getApiAccessKey());
				stmt.setString(31, org.getApiSecretKey());
				stmt.setString(32, org.getBusinessCategory());
				stmt.setString(33, org.getBusinessType());
				stmt.setString(34, org.getStaffNumber());
				stmt.setString(35, org.getSerialNumber());
				stmt.setString(36, org.getCategoryId());
				stmt.setString(37, org.getId());
			}
		});
		
	}

	/**
	 * update organization
	 * 
	 * @author CAO Dahai
	 * @date 2008-10-10 下午09:53:54
	 * @param ro
	 * @throws SQLException
	 * @throws ParseException
	 */
	public void updateStructure(final Organization ro) throws SQLException, ParseException {
		
		/*
		 * String sql = "update organization set majorSpacing=?,minorSpacing=?,"
		 * +
		 * "compressed=?,horizontal=?,expanded=?,style=?,alignment=? where Pk_Organization=?"
		 * ; jdbcTemplate.update(sql, new PreparedStatementSetter() {
		 * 
		 * @Override public void setValues(PreparedStatement stmt) throws
		 * SQLException { WfOrganizationRo orgRo = (WfOrganizationRo) ro;
		 * stmt.setInt(1, orgRo.getMajorSpacing()); stmt.setInt(2,
		 * orgRo.getMinorSpacing()); if (orgRo.isCompressed()) stmt.setString(3,
		 * "Y"); else stmt.setString(3, "N"); if (orgRo.isHorizontal())
		 * stmt.setString(4, "Y"); else stmt.setString(4, "N"); if
		 * (orgRo.isExpanded()) stmt.setString(5, "Y"); else stmt.setString(5,
		 * "N"); stmt.setInt(6, orgRo.getStyle()); stmt.setInt(7,
		 * orgRo.getAligment()); stmt.setString(8, orgRo.getPrimaryKey()); } });
		 */
		
	}

	/**
	 * 查询序列号的唯一性。
	 * 
	 * @author CAO Dahai
	 * @date 2008-10-11 下午08:53:01
	 * @param serialNumber
	 * @return
	 * @throws SQLException
	 */
	public boolean queryNum(String serialNumber) throws SQLException {
		
		String sql = "select count(*) from om_organization where serialNumber=?";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { serialNumber }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});
		
		return ((Integer) counts.get(0)).intValue() > 0 ? true : false;
	}

	/**
	 * 查询组织名称的唯一性。
	 * 
	 * @author CAO Dahai
	 * @date 2008-10-11 下午08:53:01
	 * @param fullName
	 * @return
	 * @throws SQLException
	 */
	public boolean queryName(String fullName) throws SQLException {
		
		String sql = "select count(*) from om_organization where NameLocal=?";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { fullName }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});
		
		return ((Integer) counts.get(0)).intValue() > 0 ? true : false;
	}

	public boolean queryEmail(String email) {
		
		String sql = "select count(*) from om_organization where Email=?";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { email }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});
		
		return ((Integer) counts.get(0)).intValue() > 0 ? true : false;
	}

	public String getOrganizationByName(String orgName) {
		
		String sql = "select PK_Organization from om_organization where NameLocal=?";
		List<String> orgIds = jdbcTemplate.query(sql, new String[] { orgName }, new RowMapper<String>() {
			public String mapRow(ResultSet rs, int rowNum) throws SQLException {
				String orgId = rs.getString(1);
				return new String(orgId);
			}
		});
		
		return orgIds.get(0);
	}

	public boolean queryOrgCode(String unescapeJava) {
		
		String sql = "select count(*) from om_organization where RegistrationCode=?";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { unescapeJava }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});
		
		return ((Integer) counts.get(0)).intValue() > 0 ? true : false;
	}

	/**
	 * 
	 * @author Dahai Cao created at 22:05 on 2018/07/03
	 * @return
	 * @throws SQLException
	 */
	public int queryApprovedOrgCounting(int status) throws SQLException {
		
		if (status == 99) {
			String sql = "select count(*) from om_organization where UniCounting != 0";
			List<Integer> counts = jdbcTemplate.query(sql, new RowMapper<Integer>() {
				public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
					int count = rs.getInt(1);
					return new Integer(count);
				}
			});
			
			return ((Integer) counts.get(0)).intValue();
		} else {
			String sql = "select count(*) from om_organization where UniCounting != 0 and status = ?";
			List<Integer> counts = jdbcTemplate.query(sql, new RowMapper<Integer>() {
				public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
					int count = rs.getInt(1);
					return new Integer(count);
				}
			}, status);
			
			return ((Integer) counts.get(0)).intValue();
		}

	}

	/**
	 * 
	 * @author Dahai Cao created at 22:05 on 2018/07/03
	 * @param condition
	 * @return
	 * @throws SQLException
	 */
	public int queryApprovedOrgCounting(String condition) throws SQLException {
		
		String sql = "select count(*) from om_organization where (NameLocal like ? or NameInternational like ? or "
				+ "AbbrLocal like ? or AbbrInternational like ? or RegistrationCode like ?) and UniCounting != 0";
		String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
		List<Integer> counts = jdbcTemplate.query(sql, new Object[] { c, c, c, c, c }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});
		
		return ((Integer) counts.get(0)).intValue();
	}

	/**
	 * Gets all organizations by the <code>condition</code> regarding the
	 * <code>firstrow</code> and <code>pagesize</code>.
	 * 
	 * @author Dahai Cao created at 22:05 on 2018/07/03
	 * @param condition
	 * @param firstrow
	 * @param pagesize
	 * @return
	 * @throws SQLException
	 */
	public List<Organization> queryApprovedOrgs(String condition, int firstrow, int pagesize) throws SQLException {
		
		String sql = "SELECT * from om_organization where (NameLocal like ? or NameInternational like ? or "
				+ "AbbrLocal like ? or AbbrInternational like ? or RegistrationCode like ?) and UniCounting != 0 LIMIT ?, ? ";
		String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
		List<Organization> lst = jdbcTemplate.query(sql, new Object[] { c, c, c, c, c, firstrow, pagesize },
				new RowMapper<Organization>() {
					public Organization mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getResultSet(new Organization(), rs);
					}
				});
		
		return lst;
	}

	/**
	 * Gets all organizations regarding the <code>firstrow</code> and
	 * <code>pagesize</code>.
	 * 
	 * @author Dahai Cao created at 22:05 on 2018/07/03
	 * @param firstrow
	 * @param pagesize
	 * @return
	 * @throws SQLException
	 */
	public List<Organization> queryApprovedOrgs(int status, int firstrow, int pagesize) throws SQLException {
		
		if (status == 99) {
			String sql = "SELECT * from om_organization where UniCounting != 0 LIMIT ?, ? ";
			List<Organization> lst = jdbcTemplate.query(sql, new Object[] { firstrow, pagesize },
					new RowMapper<Organization>() {
						public Organization mapRow(ResultSet rs, int rowNum) throws SQLException {
							return getResultSet(new Organization(), rs);
						}
					});
			
			return lst;
		} else {
			String sql = "SELECT * from om_organization where UniCounting != 0 and status = ? LIMIT ?, ? ";
			List<Organization> lst = jdbcTemplate.query(sql, new Object[] { status, firstrow, pagesize },
					new RowMapper<Organization>() {
						public Organization mapRow(ResultSet rs, int rowNum) throws SQLException {
							return getResultSet(new Organization(), rs);
						}
					});
			
			return lst;
		}

	}

	/**
	 * Update the organization status.
	 * 
	 * @author Dahai Cao created at 22:05 on 2018/07/03
	 * @param primaryKey
	 * @param status;
	 *            0:offline; 1:online -1: writeoff
	 * @param date
	 * @throws SQLException
	 */
	public void updateStatus(final String primaryKey, final int status, final long date) throws SQLException {
		
		String sql = "update om_organization set Status=?, Lastupdate=? where Pk_Organization=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setInt(1, status);
				stmt.setTimestamp(2, new Timestamp(date));
				stmt.setString(3, primaryKey);
			}
		});
		
	}

	public void deleteOrganization(String oid) {
		//String psql = "{call pr_remove_organization(?)}";
		//jdbcTemplate.update(psql, new Object[] { oid });
	}

	/**
	 * @author dahai cao last updated at 20:09 on 2018/07/19
	 * @param oid
	 * @return int
	 */
	public int queryOrgStatus(String oid) {
		
		String sql = "select status from om_organization where Pk_Organization=?";
		List<Integer> stuatuses = jdbcTemplate.query(sql, new String[] { oid }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int status = rs.getInt(1);
				return new Integer(status);
			}
		});
		
		if (!stuatuses.isEmpty()) {
			return stuatuses.get(0);
		} else {
			return 0;
		}
	}

}