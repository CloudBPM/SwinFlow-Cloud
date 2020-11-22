package com.xq.myxuanqi.util;

import android.util.Log;
import android.webkit.WebView;

import com.xq.myxuanqi.MyApplication;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.FileNameMap;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Cookie;
import okhttp3.CookieJar;
import okhttp3.FormBody;
import okhttp3.HttpUrl;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

import static java.lang.String.valueOf;

/**
 * 来源：https://blog.csdn.net/qq_30379689/article/details/52998057
 * Created by xq00005 on 2018/8/10.
 */

public class HttpUtils {

    private static final String TAG = "HttpUtils";

    private static OkHttpClient client = null;
//    private static String userAgentString = new WebView(MyApplication.getContext()).getSettings().getUserAgentString();

    private HttpUtils() {
    }

    public static OkHttpClient getInstance() {
        if (client == null) {
            synchronized (HttpUtils.class) {
                if (client == null)
                    client = new OkHttpClient()
                            .newBuilder()
                            .cookieJar(new CookieJar() {

                                private HashMap<HttpUrl, List<Cookie>> cookieStore = new HashMap<>();

                                @Override
                                public void saveFromResponse(HttpUrl url, List<Cookie> cookies) {
                                    cookieStore.put(url, cookies);
                                    //cookieStore.put(HttpUrl.parse("http://10.0.2.2:8080/login/requestVerifyCodeService"), cookies);
//                            Log.d(TAG, "saveFromResponse: " + url);
                                    //Log.d(TAG, "saveFromResponse: " + cookies.get(0));
                                }

                                @Override
                                public List<Cookie> loadForRequest(HttpUrl url) {
                                    List<Cookie> cookies = cookieStore.get(url);
                                    if (cookies == null) {
//                                Log.d(TAG, "loadForRequest: ");
                                        cookies = new ArrayList<>();
                                    }
//                            for (Cookie cookie : cookies) {
//                                Log.d(TAG, "loadForRequest: " + cookie.toString());
//                            }
                                    return cookies;
                                }
                            })
                            .connectTimeout(5, TimeUnit.SECONDS)  //连接时间
                            .readTimeout(10, TimeUnit.SECONDS)    //获取数据时间
                            .build();
            }
        }
        return client;
    }


    //下面的请求全部为异步请求

    /**
     * Get异步请求
     *
     * @param url
     * @param callback
     */
    public static void doGet(String url, Callback callback) {
        Request request = new Request.Builder()
                .url(url)
                .build();
        Call call = getInstance().newCall(request);
        call.enqueue(callback);
    }

    //异步get请求并携带参数
    public static void doGet(String url, Map<String, String> mapParams, Callback callback) {
        StringBuilder sb = new StringBuilder();
        String result = "";
        //当用户传入null或者传了一个空的map
        if (mapParams != null && !mapParams.isEmpty()) {
            if (url.contains("?")) {
                sb.append("&");
            } else {
                sb.append("?");
            }
            for (String key : mapParams.keySet()) {
                sb.append(key)
                        .append("=")
                        .append(mapParams.get(key))
                        .append("&");
            }
            sb.deleteCharAt(sb.length() - 1);
        }
        result = url + sb.toString();
        Request request = new Request.Builder()
                .get() //声明我是get请求,如果不写默认就是get
                .url(result)//声明网站访问的网址
                .build();//创建Request
        Call call = getInstance().newCall(request);
        //同步execute,异步enqueue
        //这里的同步是耗时的
        //而且OK 也没有为我们开启子线程‘
        // 如果你用同步方法的话，需要开启子线程
        call.enqueue(callback);
    }

    /**
     * Post请求发送键值对数据
     *
     * @param url
     * @param mapParams
     * @param callback
     */
    public static void doPostWithUserAgent(String url, Map<String, String> mapParams, Callback callback) {
        FormBody.Builder builder = new FormBody.Builder();
        if (mapParams != null && !mapParams.isEmpty()) {
            for (String key : mapParams.keySet()) {
                builder.add(key, mapParams.get(key));
//            Log.d(TAG, "doPost: " + mapParams.get(key));
            }
        }

        String userAgentString = new WebView(MyApplication.getContext()).getSettings().getUserAgentString();
//        Log.d(TAG, "doPost: " + userAgentString);
        Request request = new Request.Builder()
                .removeHeader("User-Agent")      //为添加新的"User-Agent"
                .addHeader("User-Agent", userAgentString)
                .header("Content-Type", "application/json; charset=utf-8")
                .url(url)
                .post(builder.build())
                .build();
        Call call = getInstance().newCall(request);
        call.enqueue(callback);
    }

    //这个post只是取消了获取userAgent的方法
    public static void doPost(String url, Map<String, String> mapParams, Callback callback) {
        FormBody.Builder builder = new FormBody.Builder();
        for (String key : mapParams.keySet()) {
            if (mapParams.get(key) == null) {
                builder.add(key, "");
            } else {
                builder.add(key, mapParams.get(key));
            }
//            Log.d(TAG, "doPost: " + mapParams.get(key));
        }
        Request request = new Request.Builder()
                .removeHeader("User-Agent")      //为添加新的"User-Agent"
//                .addHeader("User-Agent", userAgentString)
                .header("Content-Type", "application/json; charset=utf-8")
                .url(url)
                .post(builder.build())
                .build();
        Call call = getInstance().newCall(request);
        call.enqueue(callback);
    }


    /**
     * Post请求发送JSON数据
     * httpPost.setHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
     *
     * @param url
     * @param jsonParams
     * @param callback
     */
    public static void doPost(String url, String jsonParams, Callback callback) {
        RequestBody body = RequestBody.create(MediaType.parse("x-www-form-urlencoded; charset=utf-8")
                , jsonParams);
        Request request = new Request.Builder()
                .header("Content-Type", "application/x-www-form-urlencoded; charset=utf-8")
                .url(url)
                .post(body)
                .build();
        Call call = getInstance().newCall(request);
        call.enqueue(callback);
    }

    /**
     * 上传文件
     *
     * @param url
     * @param pathName
     * @param fileName
     * @param callback
     */
    public static void doFile(String url, String pathName, String fileName, Callback callback) {
        //判断文件类型
        MediaType MEDIA_TYPE = MediaType.parse(judgeType(pathName));
        //创建文件参数
        MultipartBody.Builder builder = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart(MEDIA_TYPE.type(), fileName,
        RequestBody.create(MEDIA_TYPE, new File(pathName)));
        //发出请求参数
        Request request = new Request.Builder()
//                 .header("Authorization", "Client-ID " + "9199fdef135c122")
                .url(url)
                .post(builder.build())
                .build();
        Call call = getInstance().newCall(request);
        call.enqueue(callback);
    }

    /**
     * 根据文件路径判断MediaType
     *
     * @param path
     * @return
     */
    private static String judgeType(String path) {
        FileNameMap fileNameMap = URLConnection.getFileNameMap();
        String contentTypeFor = fileNameMap.getContentTypeFor(path);
        if (contentTypeFor == null) {
            contentTypeFor = "application/octet-stream";
        }
        return contentTypeFor;
    }

    public static void doPostFile(final String url, final Map<String, String> map, String filePath, Callback callback) {
        //判断文件类型
        MediaType MEDIA_TYPE = MediaType.parse(judgeType(filePath));
        //路径转文件
        File file = new File(filePath);
        // form 表单形式上传
        MultipartBody.Builder requestBody = new MultipartBody.Builder().setType(MultipartBody.FORM);
        if (file != null) {
            // MediaType.parse() 里面是上传的文件类型。
            RequestBody body = RequestBody.create(MEDIA_TYPE, file);
            String filename = file.getName();
            // 参数分别为， 请求key ，文件名称 ，RequestBody
            requestBody.addFormDataPart("file", filename, body);
        }
        if (map != null) {
            // map 里面是请求中所需要的 key 和 value
            Set<Map.Entry<String, String>> entries = map.entrySet();
            for (Map.Entry entry : entries) {
                String key = valueOf(entry.getKey());
                String value = valueOf(entry.getValue());
                Log.d("HttpUtils", "key==" + key + "value==" + value);
                requestBody.addFormDataPart(key, value);
            }
        }
        Request request = new Request.Builder().url(url).post(requestBody.build()).build();
        // readTimeout("请求超时时间" , 时间单位);
//        client.newBuilder().readTimeout(5000, TimeUnit.MILLISECONDS).build().newCall(request).enqueue(callback);
        Call call = getInstance().newCall(request);
        call.enqueue(callback);
    }

    /**
     * 下载文件
     * @param url  文件地址
     * @param fileDir   本地存储的路径
     * @param fileName  本地文件名
     */
    public static void downFile(String url, final String fileDir, final String fileName) {
        Request request = new Request.Builder().url(url).build();
        Call call = getInstance().newCall(request);
        call.enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "onFailure: 文件下载失败！");
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                InputStream is = null;
                byte[] buf = new byte[2048];
                int len = 0;
                FileOutputStream fos = null;
                try {
                    is = response.body().byteStream();
                    File file = new File(fileDir, fileName);
                    fos = new FileOutputStream(file);
                    while ((len = is.read(buf)) != -1) {
                        fos.write(buf, 0, len);
                    }
                    fos.flush();
                } catch (IOException e) {
                    e.printStackTrace();
                } finally {
                    if (is != null) is.close();
                    if (fos != null) fos.close();
                }
            }
        });
    }
}
