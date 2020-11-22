package com.cloudibpm.core.runtime.util;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.buildtime.wfprocess.task.AbstractTask;
import com.cloudibpm.core.buildtime.wfprocess.task.EmailSendingTask;
import com.cloudibpm.core.data.*;
import com.cloudibpm.core.data.expression.ExpressionParser;
import com.cloudibpm.core.data.variable.ArrayDataVariable;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;

/**
 * @author Dahai Cao created at 15:35
 */
public class WfProcessInstanceUncloner {


    /**
     * 将从MongoDB数据库中获取的WfProcessInstance对象克隆成新的WfProcessInstance。
     * 注意，这个不是真正意义上的克隆，而只是为了从一个可序列化的对象转换（更准确地说是还原）成一个不可序列化的对象，
     * 这个不可序列化的对象是可以执行在系统（BPM引擎）中的真实的WfProcessInstance对象。
     * 因为真实的可执行的WfProcessInstance对象是具有对象之间循环引用的，不能用于序列化存储。
     *
     * @return WfProcessInstance
     */
    public static WfProcessInstance unclone(WfProcessInstance pi) throws Exception {
        if (pi.hasChildren()) {
            for (int i = 0; i < pi.getChildren().length; i++) {
                if (pi.getChildren()[i] instanceof AbstractTask) {
                    uncloneTaskInstance(pi.getChildren()[i]);
                } else if (pi.getChildren()[i] instanceof ArrayDataVariable) {
                    uncloneArrayDataVariableProp((ArrayDataVariable) pi.getChildren()[i]);
                } else if (pi.getChildren()[i] instanceof DataVariable) {
                    uncloneDataVariableProp((DataVariable) pi.getChildren()[i]);
                }
            }
        }
        uncloneTransitionInstance(pi);
        ExpressionParser.parseExpressions(pi);
        return pi;
    }

    private static void uncloneTaskInstance(TreeNode task) {
        if (task instanceof EmailSendingTask) {
            uncloneEmailSendingTaskProp((EmailSendingTask) task);
        }
    }

    private static void uncloneTransitionInstance(WfProcessInstance newprocess) {
        // parsing input/output transitions
        for (int i = 0; i < newprocess.getChildren().length; i++) {
            TreeNode child = newprocess.getChildren()[i];
            if (child instanceof AbstractTask) {
                AbstractTask t = (AbstractTask) child;
                if (t.hasOutputs()) {
                    for (int j = 0; j < t.getOutputs().length; j++) {
                        Object s = t.getOutputs()[j].getSource();
                        if (s instanceof String) {
                            TreeNode st = newprocess.seekChildByID((String) s);
                            if (st instanceof AbstractTask) {
                                AbstractTask source = (AbstractTask) st;
                                t.getOutputs()[j].setSource(source);
                                source.addOutput(t.getOutputs()[j]);
                            } else {
                                //System.out.println(">>>>>>>>>>>>>>>>>"+st.getName());
                            }
                        }
                        Object tt = t.getOutputs()[j].getTarget();
                        if (tt instanceof String) {
                            TreeNode tar = newprocess.seekChildByID((String) tt);
                            if (tar instanceof AbstractTask) {
                                AbstractTask target = (AbstractTask) tar;
                                t.getOutputs()[j].setTarget(target);
                                target.addInput(t.getOutputs()[j]);
                            } else {
                                //System.out.println("<<<<<<<<<<<<<<<<<"+tar.getName());
                            }
                        }
                    }
                }
            }
        }
    }

    protected static void uncloneArrayDataVariableProp(ArrayDataVariable dv) {
        if (dv.getValues() != null) {
            String val = (String) dv.getValues();
            String[] vals = val.split(",");
            if (vals.length > 0) {
                if (dv.getDatatype().equals("Integer") || dv.getDatatype().equals("int")) {
                    IntegerConstant[] ivals = new IntegerConstant[vals.length];
                    for (int i = 0; i < vals.length; i++) {
                        IntegerConstant ic = new IntegerConstant();
                        ic.parseString(vals[i]);
                        ivals[i] = ic;
                    }
                    dv.setValues(ivals);
                } else if (dv.getDatatype().equals("Double") || dv.getDatatype().equals("double")
                        || dv.getDatatype().equals("Float") || dv.getDatatype().equals("float")) {
                    DoubleConstant[] dcvals = new DoubleConstant[vals.length];
                    for (int i = 0; i < vals.length; i++) {
                        DoubleConstant dc = new DoubleConstant();
                        dc.parseString(vals[i]);
                        dcvals[i] = dc;
                    }
                    dv.setValues(dcvals);
                } else if (dv.getDatatype().equals("Boolean")) {
                    BooleanConstant[] bcvals = new BooleanConstant[vals.length];
                    for (int i = 0; i < vals.length; i++) {
                        BooleanConstant bc = new BooleanConstant();
                        bc.parseString(vals[i]);
                        bcvals[i] = bc;
                    }
                    dv.setValues(bcvals);
                } else if (dv.getDatatype().equals("String")) {
                    StringConstant[] scvals = new StringConstant[vals.length];
                    for (int i = 0; i < vals.length; i++) {
                        StringConstant sc = new StringConstant();
                        sc.parseString(vals[i]);
                        scvals[i] = sc;
                    }
                    dv.setValues(scvals);
                } else if (dv.getDatatype().equals("DateTime") || dv.getDatatype().equals("Date")
                        || dv.getDatatype().equals("Time")) {
                    DateTimeConstant[] dtcvals = new DateTimeConstant[vals.length];
                    for (int i = 0; i < vals.length; i++) {
                        DateTimeConstant dtc = new DateTimeConstant();
                        dtc.setDatatype(dv.getDatatype());
                        dtc.parseString(vals[i]);
                        dtcvals[i] = dtc;
                    }
                    dv.setValues(dtcvals);
                } else if (dv.getDatatype().equals("TimeDuration")) {
                    TimDurationConstant[] tdcvals = new TimDurationConstant[vals.length];
                    for (int i = 0; i < vals.length; i++) {
                        TimDurationConstant tdc = new TimDurationConstant();
                        tdc.setDatatype(dv.getDatatype());
                        tdc.parseString(vals[i]);
                        tdcvals[i] = tdc;
                    }
                    dv.setValues(tdcvals);
                } else if (dv.getDatatype().equals("Currency")) {
                    DoubleConstant[] dcvals = new DoubleConstant[vals.length];
                    for (int i = 0; i < vals.length; i++) {
                        DoubleConstant dc = new DoubleConstant();
                        dc.setDatatype(dv.getDatatype());
                        dc.parseString(vals[i]);
                        dcvals[i] = dc;
                    }
                    dv.setValues(dcvals);
                } else if (dv.getDatatype().equals("JSONData")) {
                    JSONConstant[] jscvals = new JSONConstant[vals.length];
                    for (int i = 0; i < vals.length; i++) {
                        JSONConstant jsc = new JSONConstant();
                        jsc.parseString(vals[i]);
                        jscvals[i] = jsc;
                    }
                    dv.setValues(jscvals);
                } else if (dv.getDatatype().equals("File")) {
                    FileConstant[] fcvals = new FileConstant[vals.length];
                    for (int i = 0; i < vals.length; i++) {
                        FileConstant fc = new FileConstant();
                        fc.parseString(vals[i]);
                        fcvals[i] = fc;
                    }
                    dv.setValues(fcvals);
                } else if (dv.getDatatype().equals("Handwriting")) {
                    HandwritingConstant[] hcvals = new HandwritingConstant[vals.length];
                    for (int i = 0; i < vals.length; i++) {
                        HandwritingConstant hc = new HandwritingConstant();
                        hc.parseString(vals[i]);
                        hcvals[i] = hc;
                    }
                    dv.setValues(hcvals);
                }
            }
        }
    }

    protected static void uncloneDataVariableProp(DataVariable dv) {
        if (dv.getValue() != null) {
            if (dv.getDatatype().equals("Integer") || dv.getDatatype().equals("int")) {
                IntegerConstant ic = new IntegerConstant();
                ic.parseString((String) dv.getValue());
                dv.setValue(ic);
            } else if (dv.getDatatype().equals("Double") || dv.getDatatype().equals("double")
                    || dv.getDatatype().equals("Float") || dv.getDatatype().equals("float")) {
                DoubleConstant dc = new DoubleConstant();
                dc.parseString((String) dv.getValue());
                dv.setValue(dc);
            } else if (dv.getDatatype().equals("Boolean")) {
                BooleanConstant bc = new BooleanConstant();
                bc.parseString((String) dv.getValue());
                dv.setValue(bc);
            } else if (dv.getDatatype().equals("String")) {
                StringConstant sc = new StringConstant();
                sc.parseString((String) dv.getValue());
                dv.setValue(sc);
            } else if (dv.getDatatype().equals("DateTime") || dv.getDatatype().equals("Date")
                    || dv.getDatatype().equals("Time")) {
                DateTimeConstant dtc = new DateTimeConstant();
                dtc.setDatatype(dv.getDatatype());
                dtc.parseString((String) dv.getValue());
                dv.setValue(dtc);
            } else if (dv.getDatatype().equals("TimeDuration")) {
                TimDurationConstant tdc = new TimDurationConstant();
                tdc.setDatatype(dv.getDatatype());
                tdc.parseString((String) dv.getValue());
                dv.setValue(tdc);
            } else if (dv.getDatatype().equals("Currency")) {
                DoubleConstant dc = new DoubleConstant();
                dc.setDatatype(dv.getDatatype());
                dc.parseString((String) dv.getValue());
                dv.setValue(dc);
            } else if (dv.getDatatype().equals("JSONData")) {
                JSONConstant jsc = new JSONConstant();
                jsc.parseString((String) dv.getValue());
                dv.setValue(jsc);
            } else if (dv.getDatatype().equals("File")) {
                FileConstant fc = new FileConstant();
                fc.parseString((String) dv.getValue());
                dv.setValue(fc);
            } else if (dv.getDatatype().equals("Handwriting")) {
                HandwritingConstant hc = new HandwritingConstant();
                hc.parseString((String) dv.getValue());
                dv.setValue(hc);
            }
        }
    }

    protected static void uncloneEmailSendingTaskProp(EmailSendingTask t) {
        if (t.getAttachments() != null && t.getAttachments().length > 0) {
            FileConstant[] attaching = new FileConstant[t.getAttachments().length];
            for (int i = 0; i < t.getAttachments().length; i++) {
                FileConstant fc = new FileConstant();
                fc.parseString((String) t.getAttachments()[i]);
                attaching[i] = fc;
            }
            t.setAttachments(attaching);
        }
    }

}
