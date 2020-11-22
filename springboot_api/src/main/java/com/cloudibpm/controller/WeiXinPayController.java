package com.cloudibpm.controller;

import com.alibaba.fastjson.JSON;
import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.blo.weixinpay.WinXinPayService;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.util.serviceresult.ServiceResult;
import com.cloudibpm.utils.websocket.Websocekt;
import com.cloudibpm.utils.weixinpay.PayCommonUtil;
import com.cloudibpm.utils.weixinpay.PayConfigUtils;
import com.cloudibpm.utils.weixinpay.XMLUtil;
import com.model.ServiceOrder;
import org.jdom.JDOMException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.*;

/**
 * @author: yaofeng
 * @create:2019-05-13-17:06
 **/
@RestController
@RequestMapping("/wxPay")
public class WeiXinPayController {

    private final HttpServletRequest request;
    private final HttpServletResponse response;
    private final BuildtimeIDGenerator buildtimeIDGenerator;
    private final WinXinPayService weixinPayService;
    private static final Logger logger = LoggerFactory.getLogger(WeiXinPayController.class);

    @Autowired
    public WeiXinPayController(HttpServletRequest request, HttpServletResponse response,
                               BuildtimeIDGenerator buildtimeIDGenerator, WinXinPayService weixinPayService) {
        this.request = request;
        this.response = response;
        this.buildtimeIDGenerator = buildtimeIDGenerator;
        this.weixinPayService = weixinPayService;
    }

    /**
     * 购买商品
     *
     * @param id
     */
    @RequestMapping(value = "/api0", method = RequestMethod.POST)
    public Map<String, String> Buy(String productId, String loginString) throws Exception {
        Login login = JSON.parseObject(loginString, Login.class);
//根据ID查询出商品信息 比如 价格、名称...
        response.setCharacterEncoding("UTF-8");
//        String body  =request.getParameter("基础开发服务使用费用");
        String body = "基础开发服务使用费用";
        String price = "1"; //微信的价格单位是分
        String result = "";
        String order = "";
        Map<String, String> resutMap = new HashMap<>();
//创建商户订单号,
        //生成二维码
        //1、先得到二维码的原始字符串
        //按照微信的要求生成字符串
        //2、将字符串生成二维码
        //根据用户ID查询是否存在订单
        ServiceOrder serviceOrder = weixinPayService.queryByBuyersId(login.getUser().getId());
        if (serviceOrder != null) {
            order = buildtimeIDGenerator.getNewBuildTimeID();//商户订单号，实际开发参照自己的需求
            result = PayCommonUtil.weixin_pay(serviceOrder.getProdoctPrice(), serviceOrder.getProductName()
                    ,order);//获取到二维码的字符串
            weixinPayService.updateOrder(order,login,productId);
        }
//            BufferedImage image = ZxingUtil.createImage(result,300,300);
//            //跳转到支付页面，显示二维码
//            HttpSession session = request.getSession();
//            session.setAttribute("image",image);
//            session.setAttribute("oid",order);
//            response.sendRedirect("/payment.jsp");
        //创建订单
        //跳转到支付页面，显示二维码
        resutMap.put("result", result);
        resutMap.put("body", body);
        resutMap.put("order", order);
        return resutMap;
    }

    /**
     * 二维码
     *
     * @throws IOException
     */
    @RequestMapping(value = "api1", method = RequestMethod.POST)
    public void createimage() throws IOException {
        BufferedImage image = (BufferedImage) request.getSession().getAttribute("image");
        ImageIO.write(image, "JPEG", response.getOutputStream());
    }

    /**
     * 处理微信返回数据
     *
     * @throws IOException
     * @throws JDOMException
     */
    @RequestMapping(value = "api3", method = RequestMethod.POST)
    public void weiXinResult() throws IOException, JDOMException {
        String writeContent = "默认支付失败";
        //读取参数
        InputStream inputStream;
        StringBuffer sb = new StringBuffer();
        inputStream = request.getInputStream();
        String s;
        BufferedReader in = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
        while ((s = in.readLine()) != null) {
            sb.append(s);
        }
        in.close();
        inputStream.close();


        //解析xml成map
        Map<String, String> m = new HashMap<String, String>();
        m = XMLUtil.doXMLParse(sb.toString());
        //过滤空 设置TreeMap
        SortedMap<Object, Object> packgeParams = new TreeMap<Object, Object>();
        Iterator it = m.keySet().iterator();
        while (it.hasNext()) {
            String parameter = (String) it.next();
            String parameterValue = m.get(parameter);

            String v = "";
            if (null != parameterValue) {
                v = parameterValue.trim();
            }
            packgeParams.put(parameter, v);

        }

        //账号信息
        String key = PayConfigUtils.API_KEY;
        String out_trade_no = (String) packgeParams.get("out_trade_no");
        //判断签名是否正确
        if (PayCommonUtil.isTenpaySign("UTF-8", packgeParams, key)) {
            //处理业务
            String resXml = "";
            if ("SUCCESS".equals((String) packgeParams.get("result_code"))) {
                //支付成功
                String mch_id = (String) packgeParams.get("mch_id");
                String openid = (String) packgeParams.get("openid");
                String is_subscribe = (String) packgeParams.get("is_subscribe");
                String tatal_fee = (String) packgeParams.get("total_fee");

                //执行自己需要的业务逻辑
                logger.info("接收到微信返回的的数据");
                logger.info("mchId=" + mch_id);
                logger.info("openid=" + openid);
                logger.info("is_subscribe=" + is_subscribe);
                logger.info("tatal_fee=" + tatal_fee);
                weixinPayService.updateById(out_trade_no);
                logger.info("修改数据");

                writeContent = "订单" + out_trade_no + "支付成功";
                //通知微信，异步确认成功，必须写，不然会一直通知后台，八次后就任务交易失败，钱就退回到用户手中
                resXml = "<xml>" + "<return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg>" + "</xml>";
                //知道支付成功。通知页面，跳转到支付成功的页面  websocket
                //找到这个订单对应的websocket
//               Session session =  Websocekt.getAllClients().get(out_trade_no);//当前订单号所对应的websocekt链接
//                if(session!=null){
//                        session.getAsyncRemote().sendText("支付成功");
//                }
                Websocekt.sendMessage(out_trade_no, "支付成功");
            } else {
                writeContent = "订单" + out_trade_no + "支付失败:";
                resXml = "<xml>" + "<return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[报文为空]]></return_msg>" + "</xml>";
            }
            BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(response.getOutputStream());
            bufferedOutputStream.write(resXml.getBytes());
            bufferedOutputStream.flush();
            bufferedOutputStream.close();
        } else {
            writeContent = "订单" + out_trade_no + "通知签名验证失败，支付失败";

        }
    }

    /**
     * 查询订单状态
     *
     * @param orderId
     * @return
     */
    @RequestMapping(value = "api4", method = RequestMethod.POST)
    public ServiceResult payResult(String orderId) {
        if (orderId == "" || orderId == null) {
            return ServiceResult.error(1002, "继续轮询");
        }
        ServiceResult serviceResult = weixinPayService.queryForResult(orderId);
        return serviceResult;
    }

    /**
     * 查询完成的订单
     *
     * @param loginString
     * @return
     */
    @RequestMapping(value = "api5", method = RequestMethod.POST)
    public ServiceResult queryForCompletOrder(String loginString) {
        Login login = JSON.parseObject(loginString, Login.class);
        ServiceResult serviceResult = weixinPayService.queryForCompleteOrder(login);
        return serviceResult;
    }

    /**
     * 查询购物车
     *
     * @param loginString
     * @return
     */
    @RequestMapping(value = "api6", method = RequestMethod.POST)
    public ServiceResult queryShoppingCar(String loginString) {
        Login login = JSON.parseObject(loginString, Login.class);
        ServiceResult serviceResult = weixinPayService.queryShoppingCar(login);
        return serviceResult;
    }

    /**
     * 添加订单到购入车
     * 暂未完成 订单Id有问题 不知道如何插入
     *
     * @param loginString
     * @return
     */
    @RequestMapping(value = "api7", method = RequestMethod.POST)
    public ServiceResult addOrderToCar(String loginString) {
        Login login = JSON.parseObject(loginString, Login.class);
        ServiceResult serviceResult = weixinPayService.addOrderToCar(login);
        return serviceResult;
    }

    /**
     * 查询是否已经购买该商品
     * @param productId
     * @param loginString
     * @return
     */
    @RequestMapping(value = "api8", method = RequestMethod.POST)
    public ServiceResult addOrderToCar(String productId,String loginString) {
        Login login = JSON.parseObject(loginString, Login.class);
        ServiceResult serviceResult = weixinPayService.queryForBuyed(login,productId);
        return serviceResult;
    }

    /**
     * 微信退款
     * @param orderId
     * @return
     */
    @RequestMapping(value = "api9",method = RequestMethod.POST)
    public ServiceResult backWeiXin(String orderId,String desc) throws Exception {
        //根据订单ID 查询订单状态
        ServiceOrder serviceOrder = weixinPayService.queryByOrderId(orderId);
        String string;
        if (serviceOrder!=null){
            string = PayCommonUtil.weixin_refund(serviceOrder.getProdoctPrice(), serviceOrder.getProdoctPrice()
                    , serviceOrder.getOrderId(), desc);
        }
        InputStream inputStream;
        StringBuffer sb = new StringBuffer();
        inputStream = request.getInputStream();
        String s;
        BufferedReader in = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
        while ((s = in.readLine()) != null) {
            sb.append(s);
        }
        in.close();
        inputStream.close();


        //解析xml成map
        Map<String, String> m = new HashMap<String, String>();
        m = XMLUtil.doXMLParse(sb.toString());
        //过滤空 设置TreeMap
        SortedMap<Object, Object> packgeParams = new TreeMap<Object, Object>();
        Iterator it = m.keySet().iterator();
        while (it.hasNext()) {
            String parameter = (String) it.next();
            String parameterValue = m.get(parameter);

            String v = "";
            if (null != parameterValue) {
                v = parameterValue.trim();
            }
            packgeParams.put(parameter, v);

        }
        String key = PayConfigUtils.API_KEY;
        String out_trade_no = (String) packgeParams.get("out_trade_no");
        //判断签名是否正确
        if (PayCommonUtil.isTenpaySign("UTF-8", packgeParams, key)) {
            //处理业务
            String resXml = "";
            if ("SUCCESS".equals((String) packgeParams.get("result_code"))) {
                //支付成功
                String mch_id = (String) packgeParams.get("mch_id");
                String openid = (String) packgeParams.get("openid");
                String is_subscribe = (String) packgeParams.get("is_subscribe");
                String tatal_fee = (String) packgeParams.get("total_fee");
                int i = weixinPayService.updateByIdForBack(out_trade_no);
                if (i>0){
                    return ServiceResult.success();
                }
            }
            }
        return ServiceResult.error(1008,"失败");
   }
}
