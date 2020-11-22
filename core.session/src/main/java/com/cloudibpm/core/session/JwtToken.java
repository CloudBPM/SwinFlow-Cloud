package com.cloudibpm.core.session;


import com.alibaba.fastjson.JSON;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.apache.commons.lang3.StringUtils;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * APP登录Token的生成和解析
 *
 */
//https://blog.csdn.net/achenyuan/article/details/80829401
//https://blog.csdn.net/weixin_37162010/article/details/80210993
public class JwtToken {

    /** token秘钥，请勿泄露，请勿随便修改 backups:JKKLJOoasdlfj */
    private static final String SECRET = "wsmh1234231328756";
    /** token 过期时间: 10天 */
    private static final int calendarField = Calendar.DATE;
    private static final int calendarInterval = 10;

    /**
     * JWT生成Token.<br/>
     *
     * JWT构成: header, payload, signature
     *
     * @param user_id
     *            登录成功后用户user_id, 参数user_id不可传空
     */
    public static String createToken(String user_id) throws Exception {
        Date iatDate = new Date();
        // expire time
        Calendar nowTime = Calendar.getInstance();
        nowTime.add(calendarField, calendarInterval);
        Date expiresDate = nowTime.getTime();

        // header Map
        Map<String, Object> map = new HashMap<>();
        map.put("alg", "HS256");
        map.put("typ", "JWT");

        // build token
        // param backups {iss:Service, aud:APP}
        String token = JWT.create().withHeader(map) // header
                .withClaim("iss", "Service") // payload
                .withClaim("aud", "APP").withClaim("user_id", null == user_id ? null : user_id)
                .withIssuedAt(iatDate) // sign time
                .withExpiresAt(expiresDate) // expire time
                .sign(Algorithm.HMAC256(SECRET)); // signature

        return token;
    }

    /**
     * 解密Token
     *
     * @param token
     * @return
     * @throws Exception
     */
    public static Map<String, Claim> verifyToken(String token) {
        DecodedJWT jwt = null;
        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(SECRET)).build();
            jwt = verifier.verify(token);
        } catch (Exception e) {
            // e.printStackTrace();
            // token 校验失败, 抛出Token验证非法异常
        }
        if(jwt!=null){
            return jwt.getClaims();
        }else{
            return null;
        }

    }

    /**
     * 根据Token获取user_id
     *
     * @param token
     * @return user_id
     */
    public static String getAppUID(String token) {
        Map<String, Claim> claims = verifyToken(token);
        Claim user_id_claim = claims.get("user_id");
        if (null == user_id_claim || StringUtils.isEmpty(user_id_claim.asString())) {
            // token 校验失败, 抛出Token验证非法异常
        }
        return user_id_claim.asString();
    }

    public static void main(String[] args) throws Exception {
        //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJBUFAiLCJ1c2VyX2lkIjoiMTEyMjMzIiwiaXNzIjoiU2VydmljZSIsImV4cCI6MTU0NDY5NDE5MCwiaWF0IjoxNTQzODMwMTkwfQ.GwQfq2oYqLAjsCWxfDg1B-MUJPSOlSPrgpG8LQmk61U
        System.out.println(createToken("123321"));
        //System.out.println(createToken("123").length());
        //System.out.println(getAppUID(createToken("15968uik234s")));
        //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJBUFAiLCJ1c2VyX2lkIjoiMTIzNDU2IiwiaXNzIjoiU2VydmljZSIsImV4cCI6MTU0NDcwMTI3NiwiaWF0IjoxNTQzODM3Mjc2fQ==.CpLjuh-EaiQiMt2FLF2E31Jw7E3hz5v-4v5pCgU-trc
        System.out.println(JSON.toJSONString(verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJBUFAiLCJ1c2VyX2lkIjoiMTIzMzIxIiwiaXNzIjoiU2VydmljZSIsImV4cCI6MTU0NDcwMTM5NSwiaWF0IjoxNTQzODM3Mzk1fQ.eiz1f7ATI8qonhm9NJ8sLeqtFpZYROaAQxX6nmZy3rg")));
        Map<String, Claim> map=verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJBUFAiLCJ1c2VyX2lkIjoiMTIzMzIxIiwiaXNzIjoiU2VydmljZSIsImV4cCI6MTU0NDcwMTM5NSwiaWF0IjoxNTQzODM3Mzk1fQ.eiz1f7ATI8qonhm9NJ8sLeqtFpZYROaAQxX6nmZy3rg");

        System.out.println(map.get("user_id"));
    }

}
