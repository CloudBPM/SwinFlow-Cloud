package com.cloudibpm.core.user.preference;

import java.io.Serializable;

/**
 * @author Dahai Cao created at 16:33 on 2019-05-04
 */
public class MyPreference implements Serializable {
    // by default, it is the bootstrap css, otherwise, the boot watch css.
    private String theme = "default";
    // by default, Chinese language
    private String language = "zh";

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
