/**
 * 
 */
package com.cloudibpm.eso.am.container;

import com.cloudibpm.core.container.ServiceContainer;
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
 * 
 * @author Dahai Cao created on 2018-06-20
 */
@Repository
public class ServiceContainerEso  {

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public ServiceContainerEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}


	public ServiceContainer queryServiceContainer(String primaryKey) {
		
		String sql = "SELECT `Pk_Container`, `ContainerName`, `ContainerInstanceName`,`ContainerId`, "
				+ "`ContainerType`, `ImageName`, `ImageVersion`, `ContainerPort`,"
				+ " `ExposedPort`,`OtherOptions`,`Type`, `Rank`, `CreateDatetime`, "
				+ "`Lastupdate`, `Fk_Parent`, `Fk_Owner` " + "FROM `am_service_container` WHERE Pk_Container=?";
		List<ServiceContainer> containerList = jdbcTemplate.query(sql, new RowMapper<ServiceContainer>() {
			public ServiceContainer mapRow(ResultSet rs, int rowNum) throws SQLException {
				ServiceContainer container = new ServiceContainer();
				container.setId(rs.getString("Pk_Container"));
				container.setName(rs.getString("ContainerName"));
				container.setContainerName(rs.getString("ContainerInstanceName"));
				container.setContainerId(rs.getString("ContainerId"));
				container.setContainerType(rs.getInt("ContainerType"));
				container.setImageName(rs.getString("ImageName"));
				container.setImageVersion(rs.getString("ImageVersion"));
				container.setContainerPort(rs.getInt("ContainerPort"));
				container.setExposedPort(rs.getInt("ExposedPort"));
				container.setOtherOptions(rs.getString("OtherOptions"));
				container.setType(rs.getInt("Type"));
				container.setRank(rs.getInt("Rank"));
				container.setCreateDateTime(rs.getTimestamp("CreateDateTime").getTime());
				container.setLastupdate(rs.getTimestamp("Lastupdate").getTime());
				container.setParent(rs.getString("Fk_Parent"));
				container.setOwner(rs.getString("Fk_Owner"));
				return container;
			}
		}, primaryKey);
		
		if (!containerList.isEmpty())
			return containerList.get(0);
		else
			return null;

	}

	/**
	 * Insert one service container object into data storage.
	 * 
	 * @date Dahai Cao created on 2018-06-20
	 * @param container
	 * @throws Exception
	 */
	public void insert(final ServiceContainer container) throws Exception {
		
		String sql = "insert into am_service_container (Pk_Container,ContainerName,ContainerInstanceName,ContainerId,"
				+ "ContainerType,ImageName, ImageVersion, ContainerPort,"
				+ " ExposedPort,OtherOptions,Type,Rank,CreateDateTime,Lastupdate,Fk_Parent,Fk_Owner) values (?,?,?,?,?,?,?,?,?"
				+ ",?,?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, container.getId());
				stmt.setString(2, StringEscapeUtils.escapeSql(container.getName()));
				stmt.setString(3, StringEscapeUtils.escapeSql(container.getContainerName()));
				stmt.setString(4, container.getContainerId());
				stmt.setInt(5, container.getContainerType());
				stmt.setString(6, StringEscapeUtils.escapeSql(container.getImageName()));
				stmt.setString(7, container.getImageVersion());
				stmt.setInt(8, container.getContainerPort());
				stmt.setInt(9, container.getExposedPort());
				stmt.setString(10, container.getOtherOptions());
				stmt.setInt(11, container.getType());
				stmt.setInt(12, container.getRank());
				stmt.setTimestamp(13, new Timestamp(container.getCreateDateTime()));
				stmt.setTimestamp(14, new Timestamp(container.getLastupdate()));
				stmt.setString(15, container.getParent());
				stmt.setString(16, container.getOwner());
			}
		});
		
	}

	/**
	 * Query a service container via primary key <vode>primaryKey</code>
	 * 
	 * @date Dahai Cao created on 2018-06-20
	 * @param primaryKey
	 *            String
	 * @return ServiceContainer object
	 * @throws Exception
	 */
	public ServiceContainer queryByPk(String primaryKey) throws Exception {
		
		String sql = "select * from am_service_container where Pk_Container=?";
		List<ServiceContainer> lst = jdbcTemplate.query(sql, new RowMapper<ServiceContainer>() {
			public ServiceContainer mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getServiceContainerFromResultSet(rs);
			}
		}, primaryKey);
		
		if (!lst.isEmpty())
			return lst.get(0);
		else
			return null;
	}

	/**
	 * Query all service containers in one organization via
	 * <vode>fk_owner</code>(It is organization ID).
	 * 
	 * @date Dahai Cao created on 2018-06-20
	 * @param fk_owner
	 * @return
	 * @throws Exception
	 */
	public List<ServiceContainer> queryAll(String fk_owner) throws Exception {
		
		String sql = "select * from am_service_container where Fk_Owner=?";
		List<ServiceContainer> lst = jdbcTemplate.query(sql, new Object[] { fk_owner },
				new RowMapper<ServiceContainer>() {
					public ServiceContainer mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getServiceContainerFromResultSet(rs);
					}
				});
		
		return lst;
	}

	/**
	 * Rename the service container.
	 * 
	 * @param primaryKey
	 * @param name
	 * @param lastupdate
	 * @throws SQLException
	 */
	public void updateNameByPk(String primaryKey, String name, long lastupdate) throws SQLException {
		
		String sql = "update am_service_container set ContainerName=?,Lastupdate=? where Pk_Container=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, StringEscapeUtils.escapeSql(name));
				stmt.setTimestamp(2, new Timestamp(lastupdate));
				stmt.setString(3, primaryKey);
			}
		});
		
	}

	public void update(ServiceContainer sc) {
		
		String sql = "update `am_service_container` set `ContainerName`=?, Lastupdate=? where Pk_Container=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, StringEscapeUtils.escapeSql(sc.getName()));
				stmt.setTimestamp(2, new Timestamp(sc.getLastupdate()));
				stmt.setString(3, sc.getId());
			}
		});
		
	}

	public void updateContaierByPk(String primaryKey, String containerName, String containerId, String imageName,
			String imageVersion, int containerPort, int exposedPort) {
		
		String sql = "UPDATE `am_service_container` SET `ContainerInstanceName`=?,`ContainerId`=?,`ImageName`=?,"
				+ "`ImageVersion`=?,`ContainerPort`=?,`ExposedPort`=? WHERE Pk_Container=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, StringEscapeUtils.escapeSql(containerName));
				stmt.setString(2, containerId);
				stmt.setString(3, StringEscapeUtils.escapeSql(imageName));
				stmt.setString(4, imageVersion);
				stmt.setInt(5, containerPort);
				stmt.setInt(6, exposedPort);
				stmt.setString(7, primaryKey);
			}
		});
		
	}

	/**
	 * @param serviceContainer
	 * @date Dahai Cao created on 2018-06-20
	 * @param rs
	 * @return
	 * @throws SQLException
	 */
	private ServiceContainer getServiceContainerFromResultSet(ResultSet rs) throws SQLException {
		ServiceContainer container = new ServiceContainer();
		container.setId(rs.getString("Pk_Container"));
		container.setName(rs.getString("ContainerName"));
		container.setContainerId(rs.getString("ContainerId"));
		container.setContainerType(rs.getInt("ContainerType"));
		container.setImageName(rs.getString("ImageName"));
		container.setImageVersion(rs.getString("ImageVersion"));
		container.setContainerPort(rs.getInt("ContainerPort"));
		container.setExposedPort(rs.getInt("ExposedPort"));
		container.setOtherOptions(rs.getString("OtherOptions"));
		container.setType(rs.getInt("Type"));
		container.setRank(rs.getInt("Rank"));
		container.setCreateDateTime(rs.getTimestamp("CreateDateTime").getTime());
		container.setLastupdate(rs.getTimestamp("Lastupdate").getTime());
		container.setParent(rs.getString("Fk_Parent"));
		container.setOwner(rs.getString("Fk_Owner"));
		return container;
	}

	public boolean existsServiceContainerName(String name, String fk_Owner) throws SQLException {
		
		String sql = "select count(*) from am_service_container where ContainerName=? and Fk_Owner=?";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { name, fk_Owner }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});
		
		return counts.get(0).intValue() > 0 ? true : false;
	}

	/**
	 * Delete one service container.
	 * 
	 * @date Dahai Cao created on 2018-06-20
	 * @param primaryKey
	 * @throws SQLException
	 */
	public void delete(String primaryKey) throws SQLException {
		
		String sql = "delete from am_service_container where Pk_Container=?";
		jdbcTemplate.update(sql, new Object[] { primaryKey });
		
	}
}