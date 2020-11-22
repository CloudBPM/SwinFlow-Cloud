/**
 *
 */
package com.cloudibpm.core.runtime.util.json;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
import com.cloudibpm.core.data.*;
import com.cloudibpm.core.data.variable.ArrayDataVariable;
import com.cloudibpm.core.data.variable.DataVariable;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Dahai Cao created on 20180305
 *
 */
public class FormDataLoader {

    /**
     *
     */
    public static String parseJSONtoLoadData(String jsonForm, WfProcess pi) throws Exception {
        JSONObject obj = new JSONObject(jsonForm);
        if (!obj.isNull("children")) {
            parseChildrenFromJSON(obj.getJSONArray("children"), pi);
        }
        // parse all propagation rules.
        // this.parseRules(this);
        return obj.toString();
    }

    public static String parseJSON2LoadData(JSONObject jsonForm, WfProcess pi) throws Exception {
        if (!jsonForm.isNull("children")) {
            parseChildrenFromJSON(jsonForm.getJSONArray("children"), pi);
        }
        // parse all propagation rules.
        // this.parseRules(this);
        return jsonForm.toString();
    }

    /**
     * 为界面组件赋值，也就是说，是实现数据变量和界面组件之间的绑定。
     *
     * @param jsonarr form's UI component list
     * @param pi
     */
    private static void parseChildrenFromJSON(JSONArray jsonarr, WfProcess pi) {
        if (jsonarr != null && jsonarr.length() > 0) {
            for (int i = 0; i < jsonarr.length(); i++) {
                JSONObject uicomponent = jsonarr.getJSONObject(i);
                String ctype = uicomponent.getString("classtypename");
                if (ctype.equals("Row") || ctype.equals("Column")) {
                    if (!uicomponent.isNull("children")) {
                        parseChildrenFromJSON(uicomponent.getJSONArray("children"), pi);
                    }
                } else {
                    if (ctype.equals("SingleLineText") ||
                            ctype.equals("SingleSelect") ||
                            ctype.equals("MultipleLineText") ||
                            ctype.equals("RichTextInput")) {
                        // ac: accessControl, 0: read only; 1: writable
                        //if (!uicomponent.isNull("ac")) {
                        // String ac = content.getString("ac");
                        //}
                        putStringValue(uicomponent, pi);
                    } else if (ctype.equals("IntegerInput") ||
                            ctype.equals("NaturalNumberInput")) {
                        putIntegerValue(uicomponent, pi);
                    } else if (ctype.equals("CurrencyInput") ||
                            ctype.equals("DecimalsInput")) {
                        putDoubleValue(uicomponent, pi);
                    } else if (ctype.equals("CheckBoxes")) {
                        putArrayValues(uicomponent, pi);
                    } else if (ctype.equals("Radios")) {
                        putStringValue(uicomponent, pi);
                    } else if (ctype.equals("DateTimeInput")) {
                        putDateTimeStringValue(uicomponent, pi);
                    } else if (ctype.equals("DateTimeRangeInput")) {
                        putTimeDurationStringValue(uicomponent, pi);
                    } else if (ctype.equals("FileUpload")) {

                    } else if (ctype.equals("FileDisplayer")) {

                    } else if (ctype.equals("FilesDisplayer")) {

                    } else if (ctype.equals("Image")) {

                    }
                }
            }
        }
    }

    private static void putArrayValues(JSONObject uicomponent, WfProcess pi) {
        if (!uicomponent.isNull("varId")) {
            String vid = uicomponent.getString("varId");
            TreeNode v = pi.seekByID(vid);
            if (v instanceof ArrayDataVariable) {
                ArrayDataVariable dv = (ArrayDataVariable) v;
                if (dv.getValues() != null) {
                    Constant[] vals = (Constant[])dv.getValues();
                    List<String> values = new ArrayList<>();
                    if (vals.length > 0) {
                        if (dv.getDatatype().equals("Integer") ||
                                dv.getDatatype().equals("int")) {
                            for (int i = 0; i < vals.length; i++) {
                                values.add(vals[i].getValue());
                            }
                        } else if (dv.getDatatype().equals("Double") ||
                                dv.getDatatype().equals("double") ||
                                dv.getDatatype().equals("Float") ||
                                dv.getDatatype().equals("float")) {
                            for (int i = 0; i < vals.length; i++) {
                                values.add(vals[i].getValue());
                            }
                        } else if (dv.getDatatype().equals("Boolean")) {
                            for (int i = 0; i < vals.length; i++) {
                                values.add(vals[i].getValue());
                            }
                        } else if (dv.getDatatype().equals("String")) {
                            for (int i = 0; i < vals.length; i++) {
                                values.add(vals[i].getValue());
                            }
                        } else if (dv.getDatatype().equals("DateTime") ||
                                dv.getDatatype().equals("Date") ||
                                dv.getDatatype().equals("Time")) {
                            for (int i = 0; i < vals.length; i++) {
                                values.add(vals[i].getValue());
                            }
                        } else if (dv.getDatatype().equals("TimeDuration")) {
                            for (int i = 0; i < vals.length; i++) {
                                values.add(vals[i].getValue());
                            }
                        } else if (dv.getDatatype().equals("Currency")) {
                            for (int i = 0; i < vals.length; i++) {
                                values.add(vals[i].getValue());
                            }
                        } else if (dv.getDatatype().equals("JSONData")) {
                            for (int i = 0; i < vals.length; i++) {
                                values.add(vals[i].getValue());
                            }
                        } else if (dv.getDatatype().equals("File")) {
                            for (int i = 0; i < vals.length; i++) {
                                values.add(vals[i].getValue());
                            }
                        } else if (dv.getDatatype().equals("Handwriting")) {
                            for (int i = 0; i < vals.length; i++) {
                                values.add(vals[i].getValue());
                            }
                        }
                    }
                    uicomponent.put("initValue", values.toArray(new String[values.size()]));
                }
            }
        }
    }

    private static void putStringValue(JSONObject uicomponent, WfProcess pi) {
        if (!uicomponent.isNull("varId")) {
            String vid = uicomponent.getString("varId");
            TreeNode v = pi.seekByID(vid);
            if (v instanceof DataVariable) {
                Object o = ((DataVariable) v).getValue();
                if (o instanceof StringConstant) {
                    uicomponent.put("initValue", ((StringConstant) o).getValue());
                }
            }
        }
    }

    private static void putIntegerValue(JSONObject uicomponent, WfProcess pi) {
        if (!uicomponent.isNull("varId")) {
            String vid = uicomponent.getString("varId");
            TreeNode v = pi.seekByID(vid);
            if (v instanceof DataVariable) {
                Object o = ((DataVariable) v).getValue();
                if (o instanceof IntegerConstant) {
                    uicomponent.put("initValue", ((IntegerConstant) o).getValue());
                }
            }
        }
    }

    private static void putDoubleValue(JSONObject uicomponent, WfProcess pi) {
        if (!uicomponent.isNull("varId")) {
            String vid = uicomponent.getString("varId");
            TreeNode v = pi.seekByID(vid);
            if (v instanceof DataVariable) {
                Object o = ((DataVariable) v).getValue();
                if (o instanceof DoubleConstant) {
                    uicomponent.put("initValue", ((DoubleConstant) o).getValue());
                }
            }
        }
    }

    private static void putDateTimeStringValue(JSONObject uicomponent, WfProcess pi) {
        if (!uicomponent.isNull("varId")) {
            String vid = uicomponent.getString("varId");
            TreeNode v = pi.seekByID(vid);
            if (v instanceof DataVariable) {
                Object o = ((DataVariable) v).getValue();
                if (o instanceof DateTimeConstant) {
                    uicomponent.put("initValue", ((DateTimeConstant) o).getValue());
                }
            }
        }
    }

    private static void putTimeDurationStringValue(JSONObject uicomponent, WfProcess pi) {
        if (!uicomponent.isNull("varId")) {
            String vid = uicomponent.getString("varId");
            TreeNode v = pi.seekByID(vid);
            if (v instanceof DataVariable) {
                Object o = ((DataVariable) v).getValue();
                if (o instanceof TimDurationConstant) {
                    uicomponent.put("largeDuration", ((TimDurationConstant) o).getLargeDuration());
                    uicomponent.put("largeDurationUnit", ((TimDurationConstant) o).getLargeDurationUnit());
                    uicomponent.put("hours", ((TimDurationConstant) o).getHours());
                    uicomponent.put("minutes", ((TimDurationConstant) o).getMinutes());
                    uicomponent.put("seconds", ((TimDurationConstant) o).getSeconds());
                }
            }
        }
    }


}
