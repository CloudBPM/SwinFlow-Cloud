package com.cloudibpm.eso.weixinpay;

import com.model.ServiceOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * @author: yaofeng
 * @create:2019-05-14-11:03
 **/
@Repository
public class WeiXinPayEso {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public WeiXinPayEso(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int updateOrder(String orderId,String userId,String productId){
        String sql = " update service_order set orderId=? where buyersId=? and productId=?";
        int update = jdbcTemplate.update(sql,new Object[]{orderId,userId,productId});
        return update;
    }

    public List<ServiceOrder> queryByBuy(String Id){
        String sql = "select * from service_order where buyersId=?";
        List<ServiceOrder> query = jdbcTemplate.query(sql,this::getRuset,Id);
        return query;
    }

    public int updateById(String id, Date date){
        String sql="update service_order set status=1,createTime=? where orderId=?";
        int update = jdbcTemplate.update(sql, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement preparedStatement) throws SQLException {
                preparedStatement.setTimestamp(1,new Timestamp(date.getTime()));
                preparedStatement.setString(2,id);
            }
        });
        return update;
    }

    public ServiceOrder queryForResult(String id) {
        String sql = "select * from service_order where orderId=?";
        ServiceOrder serviceOrder = jdbcTemplate.queryForObject(sql,this::getRuset,id);
        return serviceOrder;
    }

    public List<ServiceOrder> queryForCompleteOrder(String id) {
        String sql = "select * from service_order where buyersId=? and status=1";
        List<ServiceOrder> query = jdbcTemplate.query(sql,this::getRuset,id);
        return query;
    }

    public List<ServiceOrder> queryShoppingCar(String id) {
        String sql = "select * from service_order where buyersId=? and status=0";
        List<ServiceOrder> query = jdbcTemplate.query(sql,this::getRuset,id);
        return query;
    }

    public int addOrderToCar(ServiceOrder serviceOrder) {
        String sql = " insert into service_order (orderId,productName,productPrice,buyersId,status,productId)" +
                "values(?,?,?,?,?,?)";
        int update = jdbcTemplate.update(sql, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement preparedStatement) throws SQLException {
                preparedStatement.setString(1, serviceOrder.getOrderId());
                preparedStatement.setString(2, serviceOrder.getProductName());
                preparedStatement.setString(3, serviceOrder.getProdoctPrice());
                preparedStatement.setString(4, serviceOrder.getBuyersId());
                preparedStatement.setInt(5, 0);
                preparedStatement.setString(6,serviceOrder.getProductId());
            }
        });
        return update;

    }

    public List<ServiceOrder> queryForBuyed(String userId, String productId) {
        String sql = "select * from service_order where buyersId=? and productId=? and status =1";
        List<ServiceOrder> query = jdbcTemplate.query(sql,this::getRuset,userId, productId);
        return query;
    }

    public ServiceOrder queryByOrderId(String orderId) {
        String sql = "select * from service_order where orderId=?";
        ServiceOrder serviceOrder = jdbcTemplate.queryForObject(sql, this::getRuset, orderId);
        return serviceOrder;
    }


    public int updateByIdForBack(String id, Date date){
        String sql="update service_order set status=2,backTime=? where orderId=?";
        int update = jdbcTemplate.update(sql, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement preparedStatement) throws SQLException {
                preparedStatement.setTimestamp(1,new Timestamp(date.getTime()));
                preparedStatement.setString(2,id);
            }
        });
        return update;
    }

    public ServiceOrder getRuset(ResultSet resultSet, int i) throws SQLException {
        ServiceOrder serviceOrder = new ServiceOrder();
        serviceOrder.setOrderId(resultSet.getString("orderId"));
        serviceOrder.setProductName(resultSet.getString("productName"));
        serviceOrder.setProdoctPrice(resultSet.getString("productPrice"));
        serviceOrder.setBuyersId(resultSet.getString("buyersId"));
        serviceOrder.setStatus(resultSet.getInt("status"));
        Timestamp createTime = resultSet.getTimestamp("createTime");
        if (createTime!=null){
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String format = dateFormat.format(createTime);
            serviceOrder.setCreateTime(format);
        }
        Timestamp backTime = resultSet.getTimestamp("backTime");
        if (backTime!=null){
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String format = dateFormat.format(backTime);
            serviceOrder.setBackTime(format);
        }
        return serviceOrder;
    }
}
