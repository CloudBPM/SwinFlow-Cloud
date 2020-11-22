package com.xq.myxuanqi.http;

import java.util.Map;

import okhttp3.MultipartBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.FieldMap;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.QueryMap;
import retrofit2.http.Streaming;
import retrofit2.http.Url;

/**
 * Created by xq0002 on 2019/1/7.
 */

public interface RetrofitApi {
    @FormUrlEncoded
    @POST
    Call<String> post(@Url String url, @FieldMap Map<String,Object> map);

    @GET
    Call<String> get(@Url String url, @QueryMap Map<String,Object> map);

    //下载文件
    @Streaming
    @GET
    Call<ResponseBody> downloadFile(@Url String url);

    //图片上传
    @Multipart
    @POST(".")
    Call<String> uploadFile(@Part MultipartBody.Part file,@QueryMap Map<String,Object> map);
}
