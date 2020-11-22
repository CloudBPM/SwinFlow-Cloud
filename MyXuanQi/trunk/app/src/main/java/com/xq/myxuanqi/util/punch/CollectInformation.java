package com.xq.myxuanqi.util.punch;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Handler;
import android.os.Message;
import android.support.v4.app.ActivityCompat;
import android.support.v4.util.ArrayMap;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationListener;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.Staff;
import com.google.gson.Gson;
import com.tbruyelle.rxpermissions2.RxPermissions;
import com.xq.myxuanqi.model.punch.Punch;
import com.xq.myxuanqi.util.HttpUtils;
import com.xq.myxuanqi.util.SerializableUtil;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;

import java.io.IOException;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

public class CollectInformation implements Handler.Callback{
    private static final String TAG = "InformationBuild";

    private static String imei = "";
    private static String imsi = "";

    private Login login;
    private RxPermissions rxPermissions;

    private long positioningInterval = 1000 * 60 * 10L;   //定位的时间间隔， 2分钟一次
    private long sendInfoInterval = 1000 * 60 * 10L;   //发送信息的时间间隔， 2分钟一次
    private Timer timer;

//    final RxPermissions rxPermissions = new RxPermissions(this); // where this is an Activity or Fragment instance

    private Punch punch = new Punch();
    private String speed = "";
    private NetSpeedTimer mNetSpeedTimer;
    private double longitude = 0.0;  //经度
    private double latitude = 0.0;  //纬度
    //声明AMapLocationClient类对象
    private AMapLocationClient mLocationClient = null;
    //声明定位回调监听器
    private AMapLocationListener mLocationListener = amapLocation -> {
        if (amapLocation != null) {
            if (amapLocation.getErrorCode() == 0) {
                //可在其中解析amapLocation获取相应内容。
                double locationType = amapLocation.getLocationType();//获取当前定位结果来源，如网络定位结果，详见定位类型表
                longitude = amapLocation.getLongitude();//获取经度
                latitude = amapLocation.getLatitude();//获取纬度
                Log.e("Amap==经度：纬度", "locationType:" + locationType + ",latitude:" + latitude + ",longitude:" + longitude);
            } else {
                //定位失败时，可通过ErrCode（错误码）信息来确定失败的原因，errInfo是错误信息，详见错误码表。
                Log.e("AmapError", "location Error, ErrCode:"
                        + amapLocation.getErrorCode() + ", errInfo:"
                        + amapLocation.getErrorInfo());
            }
        }
    };

    //声明AMapLocationClientOption对象
    private AMapLocationClientOption mLocationOption = null;

    public CollectInformation(RxPermissions rxPermissions) {
        this.rxPermissions = rxPermissions;
        login = SpUtil.getInstance().getLogin();
    }

    public void initInformation(Activity activity) {

        Log.d(TAG, "initInformation: start");

        Handler handler = new Handler(this);
        //创建NetSpeedTimer实例
        mNetSpeedTimer = new NetSpeedTimer(activity, new NetSpeed(), handler).setDelayTime(1000).setPeriodTime(2000);
        //在想要开始执行的地方调用该段代码
        mNetSpeedTimer.startSpeedTimer();


        punch.setUserId(login.getUser().getId());  //用户的id
        punch.setIdNumber(login.getUser().getIdNumber());
        punch.setUserFullName(login.getUser().getFullName());   //用户姓名
        punch.setUserMobile(login.getUser().getMobile());  //手机号
        punch.setSessionId(SpUtil.getInstance().getStr("sessionId"));
        punch.setDeviceName(Build.BRAND);  //honor
        punch.setDeviceType("Android");
        //获取系统名称
//        https://blog.csdn.net/yu75567218/article/details/78109686
        punch.setDeviceOS(Build.PRODUCT);  //FRD-AL00
        punch.setDeviceVersion(Build.VERSION.RELEASE);   // Android 系统版本
        punch.setDeviceIMEI(getIMEI(activity));  //IMEI
        punch.setDeviceMac(getLocalMacAddressFromIp());  //本机mac地址

        //开启了定位
        rxPermissions
                .request(Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION)
                .subscribe(granted -> {
                    if (granted) {
                        location(activity);
                    } else {
                        Log.e(TAG, "onCreate: 未授权定位信息");
                    }
                });

        String orgId = "";
        String orgName = "";
        try {
            Staff staff = (Staff) SerializableUtil.str2Obj(SpUtil.getInstance().getStr("staff"));
            orgId = staff.getOwner();
            orgName = staff.getOrganizationName();
        } catch (IOException e) {
            e.printStackTrace();
        }
        punch.setOrgID(orgId);
        punch.setOrgName(orgName);

        setInformation(activity);

        timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                setInformation(activity);
                //发送信息
                Gson gson = new Gson();
                String mobileInformation = gson.toJson(punch);
                Log.d(TAG, "initInformation: " + mobileInformation);
                sendInfo(mobileInformation);
            }
//        }, 10000, sendInfoInterval);//10秒之后，每隔10分钟做一次run()操作
        }, 10000, sendInfoInterval);//10秒之后，每隔10分钟做一次run()操作


    }

    //这是设置一些变化着的信息
    private void setInformation(Activity activity) {
        punch.setDeviceIP(MacAddressUtils.getIpAddress(activity));  //本机ip
        punch.setCurrentTimestamp(System.currentTimeMillis()); //当前时间，这个需要一直变化，分开写
        punch.setDeviceLatitude(latitude);  //第一次启动时定位信息会有延迟
        punch.setDeviceLongitude(longitude);
        punch.setSignalStrength(MacAddressUtils.getWifiInfo(activity).getRssi() + "");  //信号强度
        punch.setWifiName(MacAddressUtils.getSSID(activity));  //wifi名称
        punch.setWifiMac(MacAddressUtils.getConnectedWifiMacAddress(activity));  //路由器的mac地址
        punch.setWifiNetworkFlow(speed);  //网速会有延迟
        punch.setRouterIP(MacAddressUtils.getWifiRouteIPAddress(activity));  //获取路由器的ip
    }

    //启动定位
    private void location(Activity activity) {
        mLocationClient = new AMapLocationClient(activity);
        //设置定位回调监听
        mLocationClient.setLocationListener(mLocationListener);

        //初始化AMapLocationClientOption对象
        mLocationOption = new AMapLocationClientOption();
        //设置定位模式为AMapLocationMode.Battery_Saving，低功耗模式。
        mLocationOption.setLocationMode(AMapLocationClientOption.AMapLocationMode.Hight_Accuracy);

        mLocationOption.setInterval(positioningInterval);  //2分钟一次

        //给定位客户端对象设置定位参数
        mLocationClient.setLocationOption(mLocationOption);
        //启动定位
        mLocationClient.startLocation();

        /* *
         * 获取一次定位*/

        //该方法默认为false，true表示只定位一次
        mLocationOption.setOnceLocation(true);
    }

    public void stopSendMessage() {
        Log.d(TAG, "stopLocation: 停止定位");
        if (mLocationClient != null) {
            mLocationClient.stopLocation();  //停止定位
        }
        if (timer != null) {
            timer.cancel(); //停止计时器
            timer = null;
        }
    }

    @Override
    public boolean handleMessage(Message msg) {
        switch (msg.what) {
            case NetSpeedTimer.NET_SPEED_TIMER_DEFAULT:
                speed = (String) msg.obj;
                //打印你所需要的网速值，单位默认为kb/s
                Log.i(TAG, "current net speed  = " + speed);
                break;
            default:
                break;
        }
        return false;
    }

    private void sendInfo(String info) {
        String url = UrlUtils.getUrl() + "om/OmServices";
        Map<String, String> mapParams = new ArrayMap<>();
        mapParams.put("sessionId", SpUtil.getInstance().getStr("sessionId"));
        mapParams.put("api", "44");
        mapParams.put("info", info);
        Log.d(TAG, "sendInfo: " + url);
        Log.d(TAG, "sendInfo: " + info);
        //数据库里中文乱码了

        HttpUtils.doPost(url, mapParams, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                e.printStackTrace();

            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                String s = response.body().string().trim();
                Log.d(TAG, "onResponse: " + s);

            }
        });
    }



    /**
     * 手机的软硬件信息
     * ------------------------------start
     * https://blog.csdn.net/su749520/article/details/79083879
     */


    //-----------------------------------end

    /**
     * 获取手机IMEI
     *
     * @param context
     * @return
     */
    @SuppressLint({"CheckResult", "MissingPermission"})
    private String getIMEI(Context context) {
        try {
            //实例化TelephonyManager对象
            TelephonyManager telephonyManager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
            //获取IMEI号

            rxPermissions
                    .request(Manifest.permission.READ_PHONE_STATE)
                    .subscribe(granted -> {
                        if (granted) { // Always true pre-M
                            // I can control the camera now
                            imei = telephonyManager.getDeviceId();
                        } else {
                            // Oups permission denied
                            Log.e(TAG, "onCreate: 未授权定位信息");
                        }
                    });

            //在次做个验证，也不是什么时候都能获取到的啊
            if (imei == null) {
                imei = "";
            }
            return imei;
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    /**
     * 获取手机IMSI
     */
    @SuppressLint({"CheckResult", "MissingPermission"})
    public static String getIMSI(Context context, RxPermissions rxPermissions) {
        try {
            TelephonyManager telephonyManager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
            //获取IMSI号
            rxPermissions
                    .request(Manifest.permission.READ_PHONE_STATE)
                    .subscribe(granted -> {
                        if (granted) { // Always true pre-M
                            // I can control the camera now
                            imsi = telephonyManager.getSubscriberId();
                        } else {
                            // Oups permission denied
                            Log.e(TAG, "onCreate: 未授权定位信息");
                        }
                    });
            if (null == imsi) {
                imsi = "";
            }
            return imsi;
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    /**
     * 根据IP地址获取MAC地址
     *
     * @return
     */
    private String getLocalMacAddressFromIp() {
        String strMacAddr = null;
        try {
            //获得IpD地址
            InetAddress ip = getLocalInetAddress();
            byte[] b = NetworkInterface.getByInetAddress(ip).getHardwareAddress();
            StringBuffer buffer = new StringBuffer();
            for (int i = 0; i < b.length; i++) {
                if (i != 0) {
                    buffer.append(':');
                }
                String str = Integer.toHexString(b[i] & 0xFF);
                buffer.append(str.length() == 1 ? 0 + str : str);
            }
            strMacAddr = buffer.toString().toUpperCase();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return strMacAddr;
    }

    /**
     * 获取移动设备本地IP
     *
     * @return
     */ private static InetAddress getLocalInetAddress() {
        InetAddress ip = null;
        try {
            //列举
            Enumeration<NetworkInterface> en_netInterface = NetworkInterface.getNetworkInterfaces();
            while (en_netInterface.hasMoreElements()) {
                //是否还有元素
                NetworkInterface ni = (NetworkInterface) en_netInterface.nextElement();
                //得到下一个元素
                Enumeration<InetAddress> en_ip = ni.getInetAddresses();
                //得到一个ip地址的列举
                while (en_ip.hasMoreElements()) {
                    ip = en_ip.nextElement();
                    if (!ip.isLoopbackAddress() && ip.getHostAddress().indexOf(":") == -1) break;
                    else ip = null;
                }
                if (ip != null) {
                    break;
                }
            }
        } catch (SocketException e) {
            e.printStackTrace();
        }
        return ip;
    }
}
