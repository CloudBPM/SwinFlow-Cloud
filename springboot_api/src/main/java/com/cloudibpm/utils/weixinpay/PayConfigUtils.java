package com.cloudibpm.utils.weixinpay;

public interface PayConfigUtils {
     String APP_ID = "wxaaf28fa5f8de8553";//微信公众号的ID
     String MCH_ID = "1526599471";//商户ID
     String API_KEY = "jinlsbsvzjpevesoaxbfckandvyldgqj";//API密钥
     String UFDOOER_URL = "https://api.mch.weixin.qq.com/pay/unifiedorder";//微信的统一下单地址
     String REFUND_URL="https://api.mch.weixin.qq.com/secapi/pay/refund";//微信的统一退款地址;
     String NOTIFY_URL = "http://47.94.216.44:8088/api/wxPay/api3";//回调地址
     String CREATE_IP = "47.94.216.44";//发起IP
}
