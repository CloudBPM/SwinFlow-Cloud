package com.cloudibpm.blo.weixinpay;

import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.util.serviceresult.ServiceResult;
import com.cloudibpm.eso.weixinpay.WeiXinPayEso;
import com.model.ServiceOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;


/**
 * @author: yaofeng
 * @create:2019-05-14-10:30
 **/
@Service
public class WinXinPayService {

    private final WeiXinPayEso weiXinPayEso;

    @Autowired
    public WinXinPayService(WeiXinPayEso weiXinPayEso){
       this.weiXinPayEso = weiXinPayEso;
    }

    @Transactional
    public String updateOrder(String orderId,Login login,String productId){
        int i = weiXinPayEso.updateOrder(orderId, login.getUser().getId(),productId);
        if (i>0){
            return "success";
        }
        return "fail";
    }

    public ServiceOrder queryByBuyersId(String id){
        List<ServiceOrder> serviceOrders = weiXinPayEso.queryByBuy(id);
        if (serviceOrders.size()>0){
            return serviceOrders.get(0);
        }
        return null;
    }

    @Transactional
    public int updateById(String id){
        Date date = new Date();
        return weiXinPayEso.updateById(id,date);
    }

    public ServiceResult queryForResult(String id){
        ServiceOrder serviceOrder = weiXinPayEso.queryForResult(id);
        if (serviceOrder!=null&&serviceOrder.getStatus()==1){
                return ServiceResult.success();
        }
        return ServiceResult.error(1001,"支付失败");
    }

    public ServiceResult queryForCompleteOrder(Login login){
        String id = login.getUser().getId();
        List<ServiceOrder> serviceOrderList = weiXinPayEso.queryForCompleteOrder(id);
        Map<Object,Object> map = new HashMap<>();
        if (serviceOrderList.size()>0){
            map.put("name",login.getUser().getFullName());
            map.put("data",serviceOrderList);
            return ServiceResult.success(map);
        }
        return ServiceResult.error(1003,"该用户没有完成的订单");
    }

    public ServiceResult queryShoppingCar(Login login) {
        String id = login.getUser().getId();
        List<ServiceOrder> list = weiXinPayEso.queryShoppingCar(id);
        Map<Object,Object> map = new HashMap<>();
        if (list.size()>0){
            map.put("name",login.getUser().getFullName());
            map.put("data",list);
            return ServiceResult.success(map);
        }
        return ServiceResult.error(1005,"购物车为空");
    }

    @Transactional
    public ServiceResult addOrderToCar(Login login) {
        String id = login.getUser().getId();
        ServiceOrder serviceOrder = new ServiceOrder();
        serviceOrder.setOrderId(UUID.randomUUID().toString());
        serviceOrder.setBuyersId(id);
        serviceOrder.setProductName("基础开发服务使用费用");
        serviceOrder.setProdoctPrice("59900");
        serviceOrder.setProductId("0000000001");
        int i = weiXinPayEso.addOrderToCar(serviceOrder);
        if (i>0){
            return ServiceResult.success();
        }
        return ServiceResult.error(1006,"添加购物车失败");
    }

    public ServiceResult queryForBuyed(Login login, String productId) {
        String id = login.getUser().getId();
        List<ServiceOrder> serviceOrderList = weiXinPayEso.queryForBuyed(id,productId);
        if (serviceOrderList.size()>0){
            return ServiceResult.success(serviceOrderList);
        }
        return ServiceResult.error(1007,"没有购买该商品");
    }

    public ServiceOrder queryByOrderId(String orderId) {
        ServiceOrder serviceOrder = weiXinPayEso.queryByOrderId(orderId);
        if (serviceOrder!=null){
            return serviceOrder;
        }
        return null;
    }

    @Transactional
    public int updateByIdForBack(String id){
        Date date = new Date();
        return weiXinPayEso.updateByIdForBack(id,date);
    }
}
