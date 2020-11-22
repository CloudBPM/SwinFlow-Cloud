package com.cloudibpm.utils.weixinpay;

import org.jdom.JDOMException;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

public class PayCommonUtil {

    /**
     * 是否签名正确 规则是按照参数名称a-z排序，遇到空值的参数不参加签名
     * @param characterEncoding
     * @param packgetParams
     * @param API_KEY
     * @return
     */
    public static boolean isTenpaySign(String characterEncoding, SortedMap<Object,Object> packgetParams,String API_KEY){
        StringBuffer sb = new StringBuffer();
        Set es = packgetParams.entrySet();
        Iterator it = es.iterator();
        while (it.hasNext()){
            Map.Entry entry = (Map.Entry)it.next();
            String key = (String)entry.getKey();
            String value = (String)entry.getValue();
            if(!"sign".equals(key) && null!= value && !"".equals(value)){
                sb.append(key+"="+value+"&");
            }
        }
        sb.append("key="+API_KEY);
        //算出摘要
        String mysign = MD5Util.MD5Encode(sb.toString(),characterEncoding).toLowerCase();
        String tenpaySign = ((String)packgetParams.get("sign")).toLowerCase();

        return tenpaySign.equals(mysign);
    }

    /**
     * 创建签名
     * @param characterEncoding
     * @param packageParam
     * @param API_KEY
     * @return
     */
    public static String createSign(String characterEncoding,SortedMap<Object,Object> packageParam,String API_KEY){
        StringBuffer sb = new StringBuffer();
        Set set = packageParam.entrySet();
        Iterator it = set.iterator();
        while (it.hasNext()){
            Map.Entry entry = (Map.Entry) it.next();
            String key = (String) entry.getKey();
            String value = (String)entry.getValue();
            if(null != value && !"".equals(value)&&!"sign".equals(key)&&!"key".equals(key)){
                sb.append(key+"="+value+"&");
            }
        }
        sb.append("key="+API_KEY);
        String sign = MD5Util.MD5Encode(sb.toString(),characterEncoding).toLowerCase();
        return sign;
    }

    public static String getRequestXml(SortedMap<Object,Object> parameters){
        StringBuffer sb = new StringBuffer();
        sb.append("<xml>");
        Set set = parameters.entrySet();
        Iterator it = set.iterator();
        while (it.hasNext()){
            Map.Entry entry = (Map.Entry) it.next();
            String key = (String)entry.getKey();
            String value = (String)entry.getValue();
            if("attach".equalsIgnoreCase(key)||"body".equalsIgnoreCase(key)||"sign".equalsIgnoreCase(key)){
                sb.append("<"+key+">"+"<![CDATA["+value+"]]></"+key+">");
            }else {
                sb.append("<"+key+">"+value+"</"+key+">");
            }
        }
        sb.append("</xml>");
        System.out.println(sb.toString());
        return sb.toString();
    }

    public static String getCurrTime(){
        Date now = new Date();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        String s = simpleDateFormat.format(now);
        return s;
    }

    public static String buildRandom(int length) {
        String chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random=new Random();
        StringBuffer sb=new StringBuffer();
        for(int i=0; i<length; ++i){
            //从62个的数字或字母中选择
            int number=random.nextInt(62);
            //将产生的数字通过length次承载到sb中
            sb.append(chars.charAt(number));
        }
        return sb.toString();
    }

    public static String buildRandomNumber(int length) {
        String chars = "0123456789";
        Random random=new Random();
        StringBuffer sb=new StringBuffer();
        for (int i = 0; i < length; i++) {
            int number=random.nextInt(10);
            sb.append(chars.charAt(number));
        }
        return sb.toString();
    }

    public static String weixin_pay(String order_price,String body,String out_trade_no)throws JDOMException,IOException{
        //账号信息
        String appid = PayConfigUtils.APP_ID;//appid;
        String mch_id = PayConfigUtils.MCH_ID;//商业号
        String key = PayConfigUtils.API_KEY;//key

       String currTime =  PayCommonUtil.getCurrTime();
       String strTime = currTime.substring(8,currTime.length());
       String strRandom = PayCommonUtil.buildRandom(4);
       String nonce_str = strTime+strRandom;

       String splill_create_ip = PayConfigUtils.CREATE_IP;
       String notify_url = PayConfigUtils.NOTIFY_URL;
       String trade_type = "NATIVE";
       String receipt ="Y";
       SortedMap<Object,Object> packageParams = new TreeMap<Object,Object>();
       packageParams.put("appid",appid);
       packageParams.put("mch_id",mch_id);
       packageParams.put("nonce_str",nonce_str);
       packageParams.put("body",body);
       packageParams.put("out_trade_no",out_trade_no);
       packageParams.put("total_fee",order_price);
       packageParams.put("spbill_create_ip",splill_create_ip);
       packageParams.put("notify_url",notify_url);
       packageParams.put("trade_type",trade_type);
       packageParams.put("receipt",receipt);


       String sign = PayCommonUtil.createSign("UTF-8",packageParams,key);
       packageParams.put("sign",sign);

       String requestXML = PayCommonUtil.getRequestXml(packageParams);
       String resXML = HttpUtil.postData(PayConfigUtils.UFDOOER_URL,requestXML);
       System.out.println(requestXML);
       Map map = XMLUtil.doXMLParse(resXML);
        String urlCode = (String) map.get("code_url");
        return urlCode;
    }

    public static String weixin_refund(String total_fee,String refund_fee,String out_trade_no,String refund_desc)throws Exception{
        //账号信息
        String appid = PayConfigUtils.APP_ID;//appid;
        String mch_id = PayConfigUtils.MCH_ID;//商业号
        String key = PayConfigUtils.API_KEY;//key

        String currTime =  PayCommonUtil.getCurrTime();
        String strTime = currTime.substring(8,currTime.length());
        String strRandom = PayCommonUtil.buildRandom(4);
        String nonce_str = strTime+strRandom;

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        Date date = new Date();
        String format = dateFormat.format(date);
        String string = buildRandomNumber(50);
        String out_refund_no = format+string;

        SortedMap<Object,Object> packageParams = new TreeMap<Object,Object>();
        packageParams.put("appid",appid);
        packageParams.put("mch_id",mch_id);
        packageParams.put("nonce_str",nonce_str);
        packageParams.put("out_trade_no",out_trade_no);
        packageParams.put("out_refund_no",out_refund_no);
        packageParams.put("total_fee",total_fee);
        packageParams.put("refund_fee",refund_fee);
//        packageParams.put("refund_desc",refund_desc);

        String sign = PayCommonUtil.createSign("UTF-8",packageParams,key);

        packageParams.put("sign",sign);

        String requestXML = PayCommonUtil.getRequestXml(packageParams);
        String resXML = ClientCustomSSL.doRefund(PayConfigUtils.REFUND_URL,requestXML);

        return resXML;
    }
}
