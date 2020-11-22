/**
 *
 */
package com.cloudibpm.core.util.json;

import com.cloudibpm.core.appservice.WebAppService;
import com.cloudibpm.core.data.BooleanConstant;
import com.cloudibpm.core.data.DoubleConstant;
import com.cloudibpm.core.data.IntegerConstant;
import com.cloudibpm.core.data.StringConstant;
import com.cloudibpm.core.data.variable.Parameter;
import com.cloudibpm.core.microservice.HTTPHeader;
import com.cloudibpm.core.util.DateUtility;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author Dahai Cao created at 11:37 on 2018-07-26
 *
 */
public class MicroServiceJSONParser {

    /**
     * @param webappservice
     * @return
     * @throws Exception
     */
    public static WebAppService parseWebAppServiceFromString(String webappservice) throws Exception {
        JSONObject obj = new JSONObject(webappservice);
        WebAppService t = new WebAppService();
        t.setId(obj.getString("id"));
        t.setName(obj.getString("name"));
        t.setAccessType(obj.getInt("accessType"));
        if (!obj.isNull("keywords"))
            t.setKeywords(obj.getString("keywords"));
        if (!obj.isNull("comments"))
            t.setComments(obj.getString("comments"));
        if (!obj.isNull("securityAccessKey"))
            t.setSecurityAccessKey(obj.getString("securityAccessKey"));
        if (!obj.isNull("price"))
            t.setPrice(obj.getDouble("price"));
        if (!obj.isNull("createDateTime")) {
            if (obj.get("createDateTime") instanceof Long)
                t.setCreateDateTime(obj.getLong("createDateTime"));
            else if (obj.get("createDateTime") instanceof String) {
                String dt = obj.getString("createDateTime");
                if (!dt.equals("-1") && !dt.equals("0")) {
                    Date d = DateUtility.parseDatetime(dt);
                    t.setCreateDateTime(d.getTime());
                } else {
                    t.setCreateDateTime(-1);
                }
            }
        }
        if (!obj.isNull("lastupdate")) {
            if (obj.get("lastupdate") instanceof Long)
                t.setLastupdate(obj.getLong("lastupdate"));
            else if (obj.get("lastupdate") instanceof String) {
                String dt = obj.getString("lastupdate");
                if (!dt.equals("-1") && !dt.equals("0")) {
                    Date d = DateUtility.parseDatetime(dt);
                    t.setLastupdate(d.getTime());
                } else {
                    t.setLastupdate(-1);
                }
            }
        }
        //t.setLastupdate(obj.getLong("lastupdate"));
        t.setOwner(obj.getString("owner"));
        if (!obj.isNull("restful"))
            t.setRestful(obj.getInt("restful"));
        if (!obj.isNull("methodName"))
            t.setMethodName(obj.getString("methodName"));
        t.setAuthenticationType(obj.getInt("authenticationType"));
        if (!obj.isNull("host"))
            t.setHost(obj.getString("host"));
        if (!obj.isNull("url"))
            t.setUrl(obj.getString("url"));
        JSONArray jsonarr1 = obj.getJSONArray("pathParams");
        if (jsonarr1.length() > 0) {
            List<Parameter> pathParams = new ArrayList<Parameter>();
            for (int i = 0; i < jsonarr1.length(); i++) {
                pathParams.add(parseParamenter(jsonarr1.getJSONObject(i)));
            }
            t.setPathParams(pathParams.toArray(new Parameter[pathParams.size()]));
        }
        JSONArray jsonarr2 = obj.getJSONArray("authentication");
        if (jsonarr2.length() > 0) {
            List<HTTPHeader> headers = new ArrayList<HTTPHeader>();
            for (int i = 0; i < jsonarr2.length(); i++) {
                headers.add(parseHeader(jsonarr2.getJSONObject(i)));
            }
            t.setAuthentication(headers.toArray(new HTTPHeader[headers.size()]));
        }
        t.setHeaderSolution(obj.getInt("headerSolution"));
        JSONArray jsonarr3 = obj.getJSONArray("headers");
        if (jsonarr3.length() > 0) {
            List<HTTPHeader> headers = new ArrayList<HTTPHeader>();
            for (int i = 0; i < jsonarr3.length(); i++) {
                headers.add(parseHeader(jsonarr3.getJSONObject(i)));
            }
            t.setHeaders(headers.toArray(new HTTPHeader[headers.size()]));
        }
        JSONArray jsonarr4 = obj.getJSONArray("formParams");
        if (jsonarr4.length() > 0) {
            List<Parameter> formParams = new ArrayList<Parameter>();
            for (int i = 0; i < jsonarr4.length(); i++) {
                formParams.add(parseParamenter(jsonarr4.getJSONObject(i)));
            }
            t.setFormParams(formParams.toArray(new Parameter[formParams.size()]));
        }
        if (!obj.isNull("returnType"))
            t.setReturnType(Integer.parseInt(obj.getString("returnType")));
        if (!obj.isNull("returnTypeDescription"))
            t.setReturnTypeDescription(obj.getString("returnTypeDescription"));
        return t;
    }

    private static HTTPHeader parseHeader(JSONObject obj) throws Exception {
        HTTPHeader header = new HTTPHeader();
        if (!obj.isNull("key"))
            header.setKey(obj.getString("key"));
        if (!obj.isNull("value"))
            header.setValue(obj.getString("value"));
        return header;
    }

    private static Parameter parseParamenter(JSONObject obj) throws Exception {
        Parameter param = new Parameter();
        if (!obj.isNull("name"))
            param.setName(obj.getString("name"));
        if (!obj.isNull("datatype")) {
            param.setDatatype(obj.getString("datatype"));
            if (!obj.isNull("value")) {
                if (param.getDatatype().equals("int")) {
                    param.setValue(new IntegerConstant(obj.getString("value")));
                } else if (param.getDatatype().equals("String")) {
                    param.setValue(new StringConstant(obj.getString("value")));
                } else if (param.getDatatype().equals("double")) {
                    param.setValue(new DoubleConstant(obj.getString("value")));
                } else if (param.getDatatype().equals("boolean")) {
                    param.setValue(new BooleanConstant(obj.getString("value")));
                }
            }
        }
        if (!obj.isNull("comments"))
            param.setComments(obj.getString("comments"));
        return param;
    }

}