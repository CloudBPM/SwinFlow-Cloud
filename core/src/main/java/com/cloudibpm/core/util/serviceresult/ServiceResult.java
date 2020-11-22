package com.cloudibpm.core.util.serviceresult;

import java.io.Serializable;

public class ServiceResult<T> implements Serializable {

    private T data;
    private boolean success =false;
    private CodeMessage codeMessage=new CodeMessage();

    public static <T> ServiceResult<T> success(){
        ServiceResult<T> serviceResult=new ServiceResult<>();
        serviceResult.success =true;
        CodeMessage codeMessage=new CodeMessage();
        codeMessage.setCode(1);
        codeMessage.setMessage("success");
        serviceResult.setCodeMessage(codeMessage);
        return serviceResult;
    }

    public static <T> ServiceResult<T> success(T data){
        ServiceResult<T> serviceResult=new ServiceResult<>();
        serviceResult.success =true;
        serviceResult.data=data;
        CodeMessage codeMessage=new CodeMessage();
        codeMessage.setCode(1);
        codeMessage.setMessage("success");
        serviceResult.setCodeMessage(codeMessage);
        return serviceResult;
    }

    public static <T> ServiceResult<T> error(int code, String message){
        ServiceResult<T> serviceResult=new ServiceResult<>();
        CodeMessage codeMessage=new CodeMessage();
        codeMessage.setCode(code);
        codeMessage.setMessage(message);
        serviceResult.codeMessage=codeMessage;
        return serviceResult;
    }

    public static <T> ServiceResult<T> exception(){
        ServiceResult<T> serviceResult=new ServiceResult<>();
        CodeMessage codeMessage=new CodeMessage();
        codeMessage.setCode(-1);
        codeMessage.setMessage("服务异常");
        serviceResult.codeMessage=codeMessage;
        return serviceResult;
    }

    public static <T> ServiceResult<T> exception(T data){
        ServiceResult<T> serviceResult=new ServiceResult<>();
        CodeMessage codeMessage=new CodeMessage();
        codeMessage.setCode(-1);
        codeMessage.setMessage("服务异常");
        serviceResult.codeMessage=codeMessage;
        serviceResult.data=data;
        return serviceResult;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public CodeMessage getCodeMessage() {
        return codeMessage;
    }

    public void setCodeMessage(CodeMessage codeMessage) {
        this.codeMessage = codeMessage;
    }
}
