/**
 * @user Dahai CAO
 * @date 2011-8-8 下午08:47:51
 */
package com.cloudibpm.core.util;

public class ClassTypeUtil {
    /*
     * Utility routine to paper over array type names
     */
    public static String getTypeName(Class<?> type) {
        if (type.isArray()) {
            try {
                Class<?> cl = type;
                int dimensions = 0;
                while (cl.isArray()) {
                    dimensions++;
                    cl = cl.getComponentType();
                }
                StringBuffer sb = new StringBuffer();
                sb.append(cl.getName());
                for (int i = 0; i < dimensions; i++) {
                    sb.append("[]");
                }
                return sb.toString();
            } catch (Throwable e) { /* FALLTHRU */
            }
        }
        return type.getName();
    }
}
