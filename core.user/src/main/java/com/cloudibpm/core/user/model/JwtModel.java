package com.cloudibpm.core.user.model;

import java.io.Serializable;
import java.util.Date;

public class JwtModel implements Serializable {
    private String jwt;
    private Date expiresDate;

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public Date getExpiresDate() {
        return expiresDate;
    }

    public void setExpiresDate(Date expiresDate) {
        this.expiresDate = expiresDate;
    }

    public boolean isOnline(){
        return new Date().before(expiresDate);
    }
}
