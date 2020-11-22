package com.xq.myxuanqi.http;

import android.content.Context;
import android.os.Build;
import android.support.annotation.NonNull;
import android.util.Log;
import android.webkit.WebSettings;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.xq.myxuanqi.bean.LoginMessage;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.util.UrlUtils;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import javax.crypto.SecretKeyFactory;

import okhttp3.Interceptor;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.converter.scalars.ScalarsConverterFactory;

/**
 * Created by xq0002 on 2018/11/28.
 * 代理类
 */

public class RetrofitProcessor implements HttpProcessor {

    public void post(String url, String userAgent, Map<String, Object> params, final ICallBack callback){
        String baseUrl = UrlUtils.getInstance().getUrl();
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(baseUrl)
                .addConverterFactory(ScalarsConverterFactory.create())
                .client(genericClient(userAgent))
                .build();
        RetrofitApi retrofitApi = retrofit.create(RetrofitApi.class);
        Call<String> call = retrofitApi.post(url,params);
        call.enqueue(new Callback<String>() {
            @Override
            public void onResponse(Call<String> call, retrofit2.Response<String> response) {
                if (response.code()==200){
                    //请求成功
                    callback.onSuccess(response.body());
                }else {
                    Log.e("返回值错误信息", response.code()+response.errorBody().toString() );
                    callback.onFailed(response.errorBody().toString());
                }
            }

            @Override
            public void onFailure(Call<String> call, Throwable t) {
                Log.e("网络错误信息", t.toString() );
                //请求失败
                callback.onFailed(t.toString());
            }
        });
    }

    @Override
    public void get(String url, String userAgent, Map<String, Object> params, final ICallBack callback) {
        String baseUrl = UrlUtils.getInstance().getUrl();
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(baseUrl)
                .addConverterFactory(ScalarsConverterFactory.create())
                .client(genericClient(userAgent))
                .build();
        RetrofitApi retrofitApi = retrofit.create(RetrofitApi.class);
        Call<String> call = retrofitApi.get(url,params);
        call.enqueue(new Callback<String>() {
            @Override
            public void onResponse(Call<String> call, retrofit2.Response<String> response) {
                if (response.code()==200){
                    //请求成功
                    callback.onSuccess(response.body());
                }else {
                    callback.onFailed(response.errorBody().toString());
                }

            }

            @Override
            public void onFailure(Call<String> call, Throwable t) {
                //请求失败
                callback.onFailed(t.toString());
            }
        });
    }
    /*
    *   下载文件
    * */
    @Override
    public void downloadFile(String url, final String path, final DownloadListener downloadListener){
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://www.xxx.com")
                //通过线程池获取一个线程，指定callback在子线程中运行。
                .callbackExecutor(Executors.newSingleThreadExecutor())
                .build();
        RetrofitApi retrofitApi = retrofit.create(RetrofitApi.class);
        Call<ResponseBody> call = retrofitApi.downloadFile(url);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, retrofit2.Response<ResponseBody> response) {
                //将Response写入到从磁盘中，详见下面分析
                //注意，这个方法是运行在子线程中的
                if (response.code()==200){
                    writeResponseToDisk(path, response, downloadListener);
                }else {
                    downloadListener.onFail("文件未找到！");
                }
            }

            @Override
            public void onFailure(@NonNull Call<ResponseBody> call, @NonNull Throwable throwable) {
                downloadListener.onFail("网络错误！");
            }
        });
    }
    /*
    *   上传文件
    *   fileType:文件在后台的参数名称
    * */
    @Override
    public void uploadFile(String url,String userAgent,File file,Map<String,Object> map,String fileType,ICallBack iCallBack){
        //创建RequestBody
        RequestBody requestBody = RequestBody.create(MediaType.parse("multipart/form-data"), file);
        MultipartBody.Part part = MultipartBody.Part.createFormData(fileType, file.getName(), requestBody);
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(url+"/")
                .addConverterFactory(ScalarsConverterFactory.create())
                .client(genericClient(userAgent))
                .build();
        RetrofitApi retrofitApi = retrofit.create(RetrofitApi.class);
        Call<String> responseBodyCall = retrofitApi.uploadFile(part, map);
        responseBodyCall.enqueue(new Callback<String>() {
            @Override
            public void onResponse(Call<String> call, retrofit2.Response<String> response) {
                if (response.code()==200){
                    //请求成功
                    iCallBack.onSuccess(response.body().toString());
                }else {
                    iCallBack.onFailed(response.errorBody().toString());
                }
            }

            @Override
            public void onFailure(Call<String> call, Throwable t) {
                //请求失败
                iCallBack.onFailed(t.toString());
            }
        });
    }
    @Override
    public void get(String url, Map<String, Object> params, final ICallBack callback) {
        String baseUrl = UrlUtils.getInstance().getUrl();
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(baseUrl)
                .addConverterFactory(ScalarsConverterFactory.create())
                .build();
        RetrofitApi retrofitApi = retrofit.create(RetrofitApi.class);
        Call<String> call = retrofitApi.get(url,params);
        call.enqueue(new Callback<String>() {
            @Override
            public void onResponse(Call<String> call, retrofit2.Response<String> response) {
                if (response.code()==200){
                    //请求成功
                    callback.onSuccess(response.body());
                }else {
                    callback.onFailed(response.errorBody().toString());
                }

            }

            @Override
            public void onFailure(Call<String> call, Throwable t) {
                //请求失败
                callback.onFailed(t.toString());
            }
        });
    }
    @Override
    public retrofit2.Response<String> getSync(String url, Map<String, Object> params) throws IOException {
        String baseUrl = UrlUtils.getInstance().getUrl();
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(baseUrl)
                .addConverterFactory(ScalarsConverterFactory.create())
                .build();
        RetrofitApi retrofitApi = retrofit.create(RetrofitApi.class);
        Call<String> call = retrofitApi.get(url,params);
        retrofit2.Response<String> response = call.execute();
        return response;
    }

    public static OkHttpClient genericClient(final String userAgent) {
        OkHttpClient httpClient = new OkHttpClient.Builder()
                .addInterceptor(new Interceptor() {
                    @Override
                    public okhttp3.Response intercept(Chain chain) throws IOException {
                        //.addHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
//                                .addHeader("Accept-Encoding", "gzip, deflate")
//                                .addHeader("Connection", "keep-alive")
//                                .addHeader("Accept", "*/*")
//                                .addHeader("Cookie", "add cookies here")
                        okhttp3.Request request = chain.request()
                                .newBuilder()
                                .addHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
                                .addHeader("User-Agent",userAgent)
                                .build();
                        return chain.proceed(request);
                    }
                })
                .connectTimeout(1, TimeUnit.MINUTES)
                .addInterceptor(new AddCookiesInterceptor())
                .addInterceptor(new ReceivedCookiesInterceptor())
                .build();
        return httpClient;
    }
    private static void writeResponseToDisk(String path, retrofit2.Response<ResponseBody> response, DownloadListener downloadListener) {
        //从response获取输入流以及总大小
        writeFileFromIS(new File(path), response.body().byteStream(), response.body().contentLength(), downloadListener);
    }

    private static int sBufferSize = 8192;

    //将输入流写入文件
    private static void writeFileFromIS(File file, InputStream is, long totalLength, DownloadListener downloadListener) {
        //开始下载
        downloadListener.onStart();

        //创建文件
        if (!file.exists()) {
            if (!file.getParentFile().exists())
                file.getParentFile().mkdir();
            try {
                file.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
                downloadListener.onFail("createNewFile IOException");
            }
        }

        OutputStream os = null;
        long currentLength = 0;
        try {
            os = new BufferedOutputStream(new FileOutputStream(file));
            byte data[] = new byte[sBufferSize];
            int len;
            while ((len = is.read(data, 0, sBufferSize)) != -1) {
                os.write(data, 0, len);
                currentLength += len;
                //计算当前下载进度
                downloadListener.onProgress((int) (100 * currentLength / totalLength));
            }
            //下载完成，并返回保存的文件路径
            downloadListener.onFinish(file.getAbsolutePath());
        } catch (IOException e) {
            e.printStackTrace();
            downloadListener.onFail("IOException");
        } finally {
            try {
                is.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            try {
                if (os != null) {
                    os.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

}
