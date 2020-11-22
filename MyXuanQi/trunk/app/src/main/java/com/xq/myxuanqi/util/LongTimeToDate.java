package com.xq.myxuanqi.util;

import android.util.Log;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import java.lang.reflect.Type;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by xq00005 on 2018/9/3.
 */

public class LongTimeToDate implements JsonSerializer<Date>, JsonDeserializer<Date> {
    private static final String TAG = "LongTimeToTimestamp";

    private final DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    @Override
    public Date deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        if (!(json instanceof JsonPrimitive)) {
            throw new JsonParseException("The date should be a string value");
        }
        Log.d(TAG, "deserialize: " + json.getAsString());
        String date = json.getAsString();
        return new Date(Long.valueOf(date));
//        Log.d(TAG, "deserialize: " + json);
//        return new Date(json.getAsJsonPrimitive().getAsLong());
    }

    @Override
    public JsonElement serialize(Date src, Type typeOfSrc, JsonSerializationContext context) {
        String dfString = format.format(new Date(src.getTime()));
        return new JsonPrimitive(dfString);
    }
}
