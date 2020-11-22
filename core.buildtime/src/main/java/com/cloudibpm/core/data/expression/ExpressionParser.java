package com.cloudibpm.core.data.expression;

import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.buildtime.wfprocess.Transition;
import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
import com.cloudibpm.core.buildtime.wfprocess.task.*;
import com.cloudibpm.core.data.FileConstant;
import com.cloudibpm.core.data.StringConstant;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.data.variable.Parameter;
import com.cloudibpm.core.data.variable.ParameterUtil;

public class ExpressionParser {

    /**
     * @param process
     * @return
     * @throws Exception
     */
    public static WfProcess parseExpressions(WfProcess process) throws Exception {
        for (int i = 0; i < process.getChildren().length; i++) {
            if (process.getChildren()[i] instanceof SystemTask) {
                if (((SystemTask) process.getChildren()[i]) != null) {
                    // parsing parameter string...
                    ((SystemTask) process.getChildren()[i]).setPathParameters(ParameterUtil
                            .parseParameters(((SystemTask) process.getChildren()[i]).getPathParameterString()));
                    ((SystemTask) process.getChildren()[i]).setFormParameters(ParameterUtil
                            .parseParameters(((SystemTask) process.getChildren()[i]).getFormParameterString()));
                    // parsing the value in the parameter...
                    if (((SystemTask) process.getChildren()[i]).getPathParameters() != null) {
                        for (int j = 0; j < ((SystemTask) process.getChildren()[i]).getPathParameters().length; j++) {
                            Parameter para = ((SystemTask) process.getChildren()[i]).getPathParameters()[j];
                            if (para != null && para.getValue() != null && para.getValue() instanceof Expression) {
                                ((Expression) para.getValue()).parseExpressionString(process);
                            }
                        }
                    }
                    if (((SystemTask) process.getChildren()[i]).getFormParameters() != null) {
                        for (int j = 0; j < ((SystemTask) process.getChildren()[i]).getFormParameters().length; j++) {
                            Parameter para = ((SystemTask) process.getChildren()[i]).getFormParameters()[j];
                            if (para != null && para.getValue() != null) {
                                ((Expression) para.getValue()).parseExpressionString(process);
                            }
                        }
                    }

                    if (((SystemTask) process.getChildren()[i]).getReturnString() != null
                            && !((SystemTask) process.getChildren()[i]).getReturnString().trim().equals("")) {
                        String r = ((SystemTask) process.getChildren()[i]).getReturnString();
                        String[] s = r.split("@");
                        if (s.length > 0) {
                            ((SystemTask) process.getChildren()[i])
                                    .setReturnObject((DataVariable) process.seekChildByID(s[0]));
                            if (((SystemTask) process.getChildren()[i]).getReturnObject() == null) {
                                DataVariable dv = new DataVariable();
                                dv.setDatatype(s[1]);
                                if (s[1] == "File" || s[1] == "file") {
                                    dv.setValue(new FileConstant());
                                } else {
                                    dv.setValue(new StringConstant());
                                }
                                ((SystemTask) process.getChildren()[i]).setReturnObject(dv);
                            }
                            if (s.length > 2) {
                                ((SystemTask) process.getChildren()[i]).setDescription(s[2]);
                            }
                        }
                    }

                }
            } else if (process.getChildren()[i] instanceof WaitTask) {
                if (((WaitTask) process.getChildren()[i]).getTimeRule() != null
                        && !((WaitTask) process.getChildren()[i]).getTimeRule().equals("")) {
                    Expression r = new Expression();
                    r.setExpressionString((String) ((WaitTask) process.getChildren()[i]).getTimeRule());
                    r.parseExpressionString(process);
                    ((WaitTask) process.getChildren()[i]).setTimeRule(r);
                }
            } else if (process.getChildren()[i] instanceof AssignTask) {
                // configure assignment variables
                if ((process.getChildren()[i]).getChildren() != null)
                    for (int j = 0; j < ((AssignTask) (process.getChildren()[i])).getAssignments().length; j++) {
                        Assignment a = (Assignment) ((AssignTask) (process.getChildren()[i])).getAssignments()[j];
                        String variable = a.getVariableString();
                        if (variable != null) {
                            String[] varary = variable.split("@");
                            if (varary.length > 0) {
                                String id = varary[0];
                                WorkflowEntity entity = process.seekByID(id);
                                a.setVariable((DataVariable) entity);
                            }
                        }
                        if (a != null && a.getValue() != null) {
                            Expression r = new Expression();
                            r.setExpressionString((String) a.getValue());
                            r.parseExpressionString(process);
                            a.setValue(r);
                        }
                    }
            } else if (process.getChildren()[i] instanceof SubprocessPoint) {
                for (int j = 0; j < ((SubprocessPoint) process.getChildren()[i]).getSubprocessInputs().length; j++) {
                    Assignment a = (Assignment) ((SubprocessPoint) process.getChildren()[i]).getSubprocessInputs()[j];
                    if (a.getValue() != null) {
                        Expression r = new Expression();
                        r.setExpressionString((String) a.getValue());
                        r.parseExpressionString(process);
                        a.setValue(r);
                    }
                }
                for (int j = 0; j < ((SubprocessPoint) process.getChildren()[i]).getSubprocessOutputs().length; j++) {
                    Assignment a = (Assignment) ((SubprocessPoint) process.getChildren()[i]).getSubprocessOutputs()[j];
                    String varID = a.getVariableString();
                    varID = varID.substring(0, varID.indexOf("@"));
                    a.setVariable((DataVariable) process.seekByID(varID));
                }
            } else if (process.getChildren()[i] instanceof EmailSendingTask) {
                if (((EmailSendingTask) process.getChildren()[i]).getVariables() != null) {
                    DataVariable[] dvariables = new DataVariable[((EmailSendingTask) (process.getChildren()[i]))
                            .getVariables().length];
                    for (int j = 0; j < ((EmailSendingTask) (process.getChildren()[i])).getVariables().length; j++) {
                        dvariables[j] = (DataVariable) process
                                .seekByID((String) ((EmailSendingTask) (process.getChildren()[i])).getVariables()[j]);
                    }
                    ((EmailSendingTask) process.getChildren()[i]).setVariables(dvariables);
                }

            }
        }
        for (int i = 0; i < process.getChildren().length; i++) {
            if (process.getChildren()[i] instanceof AbstractTask) {
                for (Transition t : ((AbstractTask) process.getChildren()[i]).getOutputs()) {
                    if (t != null && t.getNavigationRule() != null) {
                        Expression e = new Expression();
                        if (t.getNavigationRule() instanceof String) {
                            e.setExpressionString((String) t.getNavigationRule());
                            e.parseExpressionString(process);
                            t.setNavigationRule(e);
                        } else {
                            t.setNavigationRule(t.getNavigationRule());
                        }
                    }
                }
            }
        }
        return process;
    }

}
