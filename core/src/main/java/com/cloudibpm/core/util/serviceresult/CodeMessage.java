package com.cloudibpm.core.util.serviceresult;

import java.io.Serializable;

public class CodeMessage implements Serializable {
    private int code=-1;
    private String message;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
