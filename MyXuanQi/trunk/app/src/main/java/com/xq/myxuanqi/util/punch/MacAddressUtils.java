package com.xq.myxuanqi.util.punch;

import android.content.Context;
import android.net.DhcpInfo;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.text.format.Formatter;
import android.util.Log;

import java.util.List;

import static android.content.Context.WIFI_SERVICE;

/**
 * Created by cpxiao on 15/9/21.
 * https://blog.csdn.net/fanshouyizhi/article/details/48637643?tdsourcetag=s_pcqq_aiomsg
 */
public class MacAddressUtils {

    private static final String TAG = "MacAddressUtils";



    /**
     * 获取手机的Ip地址
     */
    public static String getIpAddress(Context context) {
        String IpAddress = null;
        WifiInfo wifiInfo = getWifiInfo(context);
        if (wifiInfo != null) {
            IpAddress = intToIpAddress(wifiInfo.getIpAddress());
        }
        return IpAddress;
    }

    /**
     * 获取WifiInfo
     */
    public static WifiInfo getWifiInfo(Context context) {
        WifiManager wifiManager = (WifiManager) context.getSystemService(WIFI_SERVICE);
        WifiInfo info = null;
        if (null != wifiManager) {
            info = wifiManager.getConnectionInfo();
        }
        return info;
    }


    public static long ipAddressToint(String ip) {
        String[] items = ip.split("\\.");
        return Long.valueOf(items[0]) << 24
                | Long.valueOf(items[1]) << 16
                | Long.valueOf(items[2]) << 8
                | Long.valueOf(items[3]);
    }

    public static String intToIpAddress(long ipInt) {
        StringBuffer sb = new StringBuffer();
        sb.append(ipInt & 0xFF).append(".");
        sb.append((ipInt >> 8) & 0xFF).append(".");
        sb.append((ipInt >> 16) & 0xFF).append(".");
        sb.append((ipInt >> 24) & 0xFF);
        return sb.toString();
    }

    /**
     * 获取当前可连接Wifi列表
     */
    public static List<?> getAvailableNetworks(Context context) {
        WifiManager wifiManager = (WifiManager) context.getSystemService(WIFI_SERVICE);
        List<ScanResult> wifiList = null;
        if (wifiManager != null) {
            wifiList = wifiManager.getScanResults();
        }
        return wifiList;
    }

    /**
     * 获取已连接的Wifi路由器的Mac地址
     */
    public static String getConnectedWifiMacAddress(Context context) {
        String connectedWifiMacAddress = "";
        WifiManager wifiManager = (WifiManager) context.getSystemService(WIFI_SERVICE);
        List<ScanResult> wifiList;

        if (wifiManager != null) {
            wifiList = wifiManager.getScanResults();
            WifiInfo info = wifiManager.getConnectionInfo();
            if (wifiList != null && info != null && info.getBSSID() != null) {
                for (int i = 0; i < wifiList.size(); i++) {
                    ScanResult result = wifiList.get(i);
                    if (info.getBSSID().equals(result.BSSID)) {
                        connectedWifiMacAddress = result.BSSID;
                    }
                }
            }
        }
        Log.d(TAG, "getConnectedWifiMacAddress: " + connectedWifiMacAddress);
        return connectedWifiMacAddress;
    }

    /**
     * 获取当前连接WIFI的SSID
     */
    public static String getSSID(Context context) {
        WifiManager wm = (WifiManager) context.getSystemService(WIFI_SERVICE);
        if (wm != null) {
            WifiInfo winfo = wm.getConnectionInfo();
            if (winfo != null) {
                String s = winfo.getSSID();
                if (s.length() > 2 && s.charAt(0) == '"' && s.charAt(s.length() - 1) == '"') {
                    return s.substring(1, s.length() - 1);
                }
            }
        }
        //没有连接wifi的时候返回“”
        return "";
    }

    /**
     * wifi获取 路由ip地址
     *
     * @param context
     * @return
     */
    public static String getWifiRouteIPAddress(Context context) {
        WifiManager wifi_service = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        DhcpInfo dhcpInfo = wifi_service.getDhcpInfo();
        String routeIp = Formatter.formatIpAddress(dhcpInfo.gateway);
        Log.d(TAG, "wifi route ip：" + routeIp);
        return routeIp;
    }

}