package com.cloudibpm.eso.folder;

import com.cloudibpm.core.folder.Folder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * @author CAO DAHAI
 * @version 1.0
 */
@Repository
public class WfFolderEso {

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public WfFolderEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public List<Folder> queryChildrenFolders(String fk_Parent) throws Exception {
		
		String sql = "select * from folder where Fk_Parent=?";
		List<Folder> lst = jdbcTemplate.query(sql, new Object[] { fk_Parent }, new RowMapper<Folder>() {
			public Folder mapRow(ResultSet rs, int rowNum) throws SQLException {
				Folder folder = new Folder();
				folder.setId(rs.getString("Pk_Folder"));
				folder.setName(rs.getString("FolderName"));
				folder.setType(rs.getInt("Type"));
				folder.setRank(rs.getInt("Rank"));
				folder.setParent(rs.getString("Fk_Parent"));
				folder.setOwner(rs.getString("Fk_Owner"));
				return folder;
			}
		});
		
		return lst;
	}

	public List<Folder> queryFoldersByOwnerId(String oid) throws Exception {
		
		String sql = "select * from folder where Fk_Owner=?";
		List<Folder> lst = jdbcTemplate.query(sql, new Object[] { oid }, new RowMapper<Folder>() {
			public Folder mapRow(ResultSet rs, int rowNum) throws SQLException {
				Folder folder = new Folder();
				folder.setId(rs.getString("Pk_Folder"));
				folder.setName(rs.getString("FolderName"));
				folder.setType(rs.getInt("Type"));
				folder.setRank(rs.getInt("Rank"));
				folder.setParent(rs.getString("Fk_Parent"));
				folder.setOwner(rs.getString("Fk_Owner"));
				return folder;
			}
		});
		
		return lst;
	}

	public List<Folder> queryChildrenFoldersByType(String fk_Parent, int type) throws Exception {
		
		String sql = "select * from folder where Fk_Parent=? and Type=?";
		List<Folder> lst = jdbcTemplate.query(sql, new Object[] { fk_Parent, type }, new RowMapper<Folder>() {
			public Folder mapRow(ResultSet rs, int rowNum) throws SQLException {
				Folder folder = new Folder();
				folder.setId(rs.getString("Pk_Folder"));
				folder.setName(rs.getString("FolderName"));
				folder.setType(rs.getInt("Type"));
				folder.setRank(rs.getInt("Rank"));
				folder.setParent(rs.getString("Fk_Parent"));
				folder.setOwner(rs.getString("Fk_Owner"));
				return folder;
			}
		});
		
		return lst;
	}

	public List<Folder> queryChildrenFoldersByType(String fk_Parent, int[] types) throws Exception {
		
		String sql = "select * from folder where Fk_Parent=:fk_Parent and Type IN (:types)";
		List<Integer> l = new ArrayList<Integer>();
		for (int i = 0; i < types.length; i++) {
			l.add(types[i]);
		}
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("fk_Parent", fk_Parent);
		paramMap.put("types", l);
		NamedParameterJdbcTemplate jdbc = new NamedParameterJdbcTemplate(jdbcTemplate);
		List<Folder> lst = jdbc.query(sql, paramMap, new RowMapper<Folder>() {
			public Folder mapRow(ResultSet rs, int rowNum) throws SQLException {
				Folder folder = new Folder();
				folder.setId(rs.getString("Pk_Folder"));
				folder.setName(rs.getString("FolderName"));
				folder.setType(rs.getInt("Type"));
				folder.setRank(rs.getInt("Rank"));
				folder.setParent(rs.getString("Fk_Parent"));
				folder.setOwner(rs.getString("Fk_Owner"));
				return folder;
			}
		});
		
		return lst;
	}

	public List<Folder> queryChildrenFoldersByType(int type) throws Exception {
		
		String sql = "select * from folder where type=?";
		List<Folder> lst = jdbcTemplate.query(sql, new Object[] { type }, new RowMapper<Folder>() {
			public Folder mapRow(ResultSet rs, int rowNum) throws SQLException {
				Folder folder = new Folder();
				folder.setId(rs.getString("Pk_Folder"));
				folder.setName(rs.getString("FolderName"));
				folder.setType(rs.getInt("Type"));
				folder.setRank(rs.getInt("Rank"));
				folder.setParent(rs.getString("Fk_Parent"));
				folder.setOwner(rs.getString("Fk_Owner"));
				return folder;
			}
		});
		
		return lst;
	}

	/**
	 * 
	 * @param folderRo
	 *            WfFolderRO
	 * @throws SQLException
	 */
	public void insert(final Folder folderRo) throws SQLException {
		
		String sql = "insert into folder (Pk_Folder,FolderName,Type,`Rank`,Fk_Parent,Fk_Owner) values (?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, folderRo.getId());
				stmt.setString(2, folderRo.getName());
				stmt.setInt(3, folderRo.getType());
				stmt.setInt(4, folderRo.getRank());
				if (folderRo.getParent() != null) {
					stmt.setString(5, folderRo.getParent());
				} else {
					stmt.setString(5, null);
				}
				stmt.setString(6, folderRo.getOwner());
			}
		});
		
	}

	public void update(final Folder folder) throws SQLException {
		
		String sql = "update folder set FolderName=?,Fk_Parent=?,Fk_Owner=?,Type=?,Rank=? where Pk_Folder=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, folder.getName());
				if (folder.getParent() != null) {
					stmt.setString(2, folder.getParent());
				} else {
					stmt.setString(2, null);
				}
				stmt.setString(3, folder.getOwner());
				stmt.setInt(4, folder.getType());
				stmt.setInt(5, folder.getRank());
				stmt.setString(6, folder.getId());
			}
		});
		
	}

	public void updateName(final Folder folderRo) throws SQLException {
		
		String sql = "update folder set FolderName=? where Pk_Folder=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, folderRo.getName());
				stmt.setString(2, folderRo.getId());
			}
		});
		
	}

	public void updateParent(final String fid, final String parent) throws SQLException {
		
		String sql = "update folder set Fk_Parent=? where Pk_Folder=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, parent);
				stmt.setString(2, fid);
			}
		});
		
	}

	public void delete(String Pk_WfFolder) throws SQLException {
		
		String sql = "delete from folder where Pk_Folder=?";
		jdbcTemplate.update(sql, new Object[] { Pk_WfFolder });
		
	}

}
