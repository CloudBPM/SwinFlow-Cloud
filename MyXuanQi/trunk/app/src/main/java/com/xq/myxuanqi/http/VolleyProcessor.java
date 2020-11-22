package com.xq.myxuanqi.http;

import android.content.Context;


import com.xq.myxuanqi.MyApplication;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

/**
 * Created by xq0002 on 2018/11/28.
 * 代理类
 */

public class VolleyProcessor {
    /*private static RequestQueue mRequestQueue = null;
    public VolleyProcessor(Context context) {
        mRequestQueue = Volley.newRequestQueue(context);
    }*/

    /*@Override
    public void get(String url, Map<String, String> params, final ICallBack callback) {
        StringRequest request = new StringRequest(Request.Method.GET,url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                callback.onSuccess(response);
            }
        },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        byte[] htmlBodyBytes = error.networkResponse.data;
                        callback.onFailed(new String(htmlBodyBytes));
                    }
                }){
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                return callback.onParams();
            }

            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                return callback.onHeaderParams();
            }
            protected Response<String>  parseNetworkResponse(NetworkResponse response)
            {
                try {
                    String s = new String(response.data,"UTF-8");
                    return Response.success(s, HttpHeaderParser.parseCacheHeaders(response));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                    return Response.error(new ParseError(e));
                }
            }

        };
        mRequestQueue.add(request);
    }

    @Override
    public void post(String url, Map<String, String> params, final ICallBack callback) {
        StringRequest request = new StringRequest(Request.Method.POST,url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                callback.onSuccess(response);
            }
        },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
//                        String s = new String(error.networkResponse.data);
                        callback.onFailed(error.toString());
                    }
                }){
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                return callback.onParams();
            }

            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                return callback.onHeaderParams();
            }
           *//* //从服务器端获取cookie
            @Override
            protected Response parseNetworkResponse(NetworkResponse response) {
                try {

                    Map<String, String> responseHeaders = response.headers;
                    String rawCookies = responseHeaders.get("Set-Cookie");
                    String dataString = new String(response.data, "UTF-8");
//                    return callback.onCookie(Response.success(dataString, HttpHeaderParser.parseCacheHeaders(response)));
                    return Response.success(response, HttpHeaderParser.parseCacheHeaders(response));
                } catch (UnsupportedEncodingException e) {
                    String s = e.toString();
                    return Response.error(new ParseError(e));
                }
            }*//*
        };
        mRequestQueue.add(request);
    }*/

}
