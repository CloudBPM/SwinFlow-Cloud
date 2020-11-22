package com.cloudibpm.eso.invoice;

import com.model.Invoice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

/**
 * @author: yaofeng
 * @create:2019-06-17-11:19
 **/
@Repository
public class InvoiceEso {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public InvoiceEso(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int insertInvoice(Invoice invoice, String userId, String orderId) {
        String sql="insert into Invoice values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        int update = jdbcTemplate.update(sql, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement preparedStatement) throws SQLException {
                preparedStatement.setString(1, invoice.getInvoiceId());
                preparedStatement.setString(2, invoice.getInvoiceType());
                preparedStatement.setString(3, invoice.getReceivePersonType());
                preparedStatement.setString(4, invoice.getInvoiceHead());
                preparedStatement.setString(5, invoice.getInvoiceContent());
                preparedStatement.setString(6, invoice.getReceiveType());
                preparedStatement.setString(7, invoice.getEmail());
                preparedStatement.setString(8, invoice.getTaxpayersNumber());
                preparedStatement.setString(9, invoice.getCompanyAddress());
                preparedStatement.setString(10, invoice.getFinancialTel());
                preparedStatement.setString(11, invoice.getDepositaryBank());
                preparedStatement.setString(12, invoice.getBankNumber());
                preparedStatement.setString(13, invoice.getReceiveName());
                preparedStatement.setString(14, invoice.getReceiveTel());
                preparedStatement.setString(15, invoice.getReciveAddress());
                preparedStatement.setString(16, invoice.getNote());
                preparedStatement.setString(17, orderId);
                preparedStatement.setString(18,userId);
                preparedStatement.setTimestamp(19,new Timestamp(new Date().getTime()));
                preparedStatement.setInt(20,1);
            }
        });
        return update;
    }

    public List<Invoice> selectByUserId(String userId) {
        String sql="select * from Invoice where userId=?";
        List<Invoice> query = jdbcTemplate.query(sql, InvoiceEso::getRusult, userId);
        return query;
    }

    public static Invoice getRusult(ResultSet resultSet, int i)throws SQLException{
        Invoice invoice = new Invoice();
        invoice.setInvoiceId(resultSet.getString("InvoiceId"));
        invoice.setInvoiceType(resultSet.getString("InvoiceType"));
        invoice.setReceivePersonType(resultSet.getString("receivePersonType"));
        invoice.setInvoiceHead(resultSet.getString("InvoiceHead"));
        invoice.setInvoiceContent(resultSet.getString("InvoiceContent"));
        invoice.setReceiveType(resultSet.getString("receiveType"));
        invoice.setEmail(resultSet.getString("email"));
        invoice.setTaxpayersNumber(resultSet.getString("taxpayersNumber"));
        invoice.setCompanyAddress(resultSet.getString("companyAddress"));
        invoice.setFinancialTel(resultSet.getString("financialTel"));
        invoice.setDepositaryBank(resultSet.getString("depositaryBank"));
        invoice.setBankNumber(resultSet.getString("bankNumber"));
        invoice.setReceiveName(resultSet.getString("receiveName"));
        invoice.setReceiveTel(resultSet.getString("receiveTel"));
        invoice.setReciveAddress(resultSet.getString("receiveAddress"));
        invoice.setNote(resultSet.getString("note"));
        invoice.setOrderId(resultSet.getString("orderId"));
        invoice.setInvoiceStatus(resultSet.getInt("invoiceStatus"));
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Timestamp applyTime = resultSet.getTimestamp("applyTime");
        String format = dateFormat.format(applyTime);
        invoice.setApplyTime(format);
        String productPrice = resultSet.getString("productPrice");
        long l = Long.parseLong(productPrice);
        String string = BigDecimal.valueOf(Long.valueOf(l)).divide(new BigDecimal(100)).toString();
        invoice.setOrderPrice(string);
        return invoice;
    }

    public long count(String condition) {
        String sql = "";
        if (condition.equals("")||condition==null){
            sql="select count(*) from Invoice";
        }else {
            sql="select count(*) from Invoice where orderId like '%'"+condition+"'%'";
        }
        Integer integer = jdbcTemplate.queryForObject(sql, Integer.class);
        return (long)integer;
    }

    public List<Invoice> queryAll(int pageindex, int pageSize) {
        String sql="select * from Invoice as i,service_order as s where i.orderId=s.orderId limit ?,? ";
        List<Invoice> query = jdbcTemplate.query(sql, InvoiceEso::getRusult,pageindex,pageSize);
        return query;
    }

    public List<Invoice> queryByCondition(String cond, int pageindex, int pageSize) {
        String sql="select * from Invoice where orderId = (:param3) limit (:param),(:param2)";
        HashMap<String, Object> paraMap = new HashMap<>();
        paraMap.put("param", pageindex);
        paraMap.put("param2", pageSize);
        paraMap.put("param3", cond);
        List<Invoice> query = jdbcTemplate.query(sql, InvoiceEso::getRusult);
        return query;
    }

    public int updateById(String id) {
        String sql = "update Invoice set invoiceStatus=2 where InvoiceId=?";
        int update = jdbcTemplate.update(sql, id);
        return update;
    }

    public Invoice queryByInvoiceId(String invoiceId) {
        String sql = "select * from Invoice as i,service_order as s where i.orderId=s.orderId" +
                " and i.InvoiceId=?";
        Invoice invoice = jdbcTemplate.queryForObject(sql, InvoiceEso::getRusult, invoiceId);
        return invoice;
    }
}
