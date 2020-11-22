package com.xq.myxuanqi.ui.activity.me.fingerprint;

import android.app.KeyguardManager;
import android.content.Context;
import android.os.Build;
import android.security.keystore.KeyProperties;
import android.support.annotation.RequiresApi;
import android.support.v4.hardware.fingerprint.FingerprintManagerCompat;
import android.support.v4.os.CancellationSignal;
import android.text.TextUtils;
import android.util.Base64;
import com.xq.myxuanqi.util.SpUtil;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;

import static android.content.Context.KEYGUARD_SERVICE;

/**
 * Created by wm on 2019/1/22.
 */

public class FingerprintHelper extends FingerprintManagerCompat.AuthenticationCallback {
    private FingerprintManagerCompat     manager;
    private KeyguardManager              mKeyguardManager;
    private CancellationSignal           mCancellationSignal;
    private SimpleAuthenticationCallback callback;
    private LocalAndroidKeyStore         mLocalAndroidKeyStore;
    //PURPOSE_ENCRYPT,则表示生成token，否则为取出token
    private int    purpose = KeyProperties.PURPOSE_ENCRYPT;

    public void setCallback(SimpleAuthenticationCallback callback) {
        this.callback = callback;
    }

    public interface SimpleAuthenticationCallback {
        void onAuthenticationSucceeded(String value);
        void onAuthenticationFail();
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public FingerprintHelper(Context context) {
        manager = FingerprintManagerCompat.from(context);
        mKeyguardManager = (KeyguardManager) context.getSystemService(KEYGUARD_SERVICE);
        mLocalAndroidKeyStore = new LocalAndroidKeyStore();
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void generateKey() {
        //在keystore中生成加密密钥
        mLocalAndroidKeyStore.generateKey(LocalAndroidKeyStore.keyName);
        setPurpose(KeyProperties.PURPOSE_ENCRYPT);
    }

    public void setPurpose(int purpose) {
        this.purpose = purpose;
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public boolean isKeyProtectedEnforcedBySecureHardware() {
        return mLocalAndroidKeyStore.isKeyProtectedEnforcedBySecureHardware();
    }

    /**
     * 获取当前设备的指纹状态
     * @return 是否支持指纹
     */
    @RequiresApi(api = Build.VERSION_CODES.M)
    public int checkFingerprintAvailable() {
        if (!isKeyProtectedEnforcedBySecureHardware()) {
            return -1;
        } else if (!manager.isHardwareDetected()) {
            //            Toast.makeText(ctx, "该设备尚未检测到指纹硬件", Toast.LENGTH_SHORT).show();
            return -1;
        } else if (!manager.hasEnrolledFingerprints()) {
            //            Toast.makeText(ctx, "该设备未录入指纹，请去系统->设置中添加指纹", Toast.LENGTH_SHORT).show();
            return -2;
        } else if (!mKeyguardManager.isKeyguardSecure()) {
            return -3;
        }
        return 0;
    }
    /*
    * 开始指纹验证
    * */
    @RequiresApi(api = Build.VERSION_CODES.M)
    public boolean authenticate() {
        try {
            FingerprintManagerCompat.CryptoObject object;
            if (purpose == KeyProperties.PURPOSE_DECRYPT) {
                String IV = SpUtil.getInstance().getStr(SpUtil.IVKeyName);
                object = mLocalAndroidKeyStore.getCryptoObject(Cipher.DECRYPT_MODE, Base64.decode(IV, Base64.URL_SAFE));
                if (object == null) {
                    return false;
                }
            } else {
                object = mLocalAndroidKeyStore.getCryptoObject(Cipher.ENCRYPT_MODE, null);
            }
            mCancellationSignal = new CancellationSignal();
            manager.authenticate(object, 0, mCancellationSignal, this, null);
            return true;
        } catch (SecurityException e) {
            e.printStackTrace();
            return false;
        }
    }
    /*
    * 取消指纹验证
    * */
    public void stopAuthenticate() {
        if (mCancellationSignal != null) {
            mCancellationSignal.cancel();
            mCancellationSignal = null;
        }
        callback = null;
    }

    // 当出现错误的时候回调此函数，比如多次尝试都失败了的时候，errString是错误信息
    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onAuthenticationError(int errMsgId, CharSequence errString) {
        //            KeyguardManager keyguardManager =
        //                    (KeyguardManager) getSystemService(Context.KEYGUARD_SERVICE);
        //            Intent intent =
        //                    keyguardManager.createConfirmDeviceCredentialIntent("finger", "测试指纹识别");
        ////                        fingerPrintUiHelper.stopsFingerPrintListen();
        //            startActivityForResult(intent, 0);
    }

    // 当指纹验证失败的时候会回调此函数，失败之后允许多次尝试，失败次数过多会停止响应一段时间然后再停止sensor的工作
    @Override
    public void onAuthenticationFailed() {
        if (callback != null) {
            callback.onAuthenticationFail();
        }
    }

    @Override
    public void onAuthenticationHelp(int helpMsgId, CharSequence helpString) {
    }

    // 当验证的指纹成功时会回调此函数，然后不再监听指纹sensor
    @Override
    public void onAuthenticationSucceeded(FingerprintManagerCompat.AuthenticationResult
                                                  result) {
        if (callback == null) {
            return;
        }
        if (result.getCryptoObject() == null) {
            callback.onAuthenticationFail();
            return;
        }
        //利用result中的CryptoObject的Cipher进行加密
        final Cipher cipher = result.getCryptoObject().getCipher();
        if (purpose == KeyProperties.PURPOSE_DECRYPT) { //解密
            //取出secret key并返回
            String data = SpUtil.getInstance().getStr(SpUtil.getInstance().getStr("userName"));
            if (TextUtils.isEmpty(data)) {
                callback.onAuthenticationFail();
                return;
            }
            try {
                // 需要用的时候，再根据SecretKey、iv初始化出cipher，进行解密cipher.doFinal(byte[] input)
                byte[] decode = Base64.decode(data, Base64.URL_SAFE);
                byte[] decrypted = cipher.doFinal(decode);
                String s = new String(decrypted);
                callback.onAuthenticationSucceeded(new String(decrypted));
            }
            catch (BadPaddingException | IllegalBlockSizeException e) {
                e.printStackTrace();
                callback.onAuthenticationFail();
            }
        } else {    //加密
            //将前面生成的data包装成secret key，存入沙盒
            try {
                byte[] encrypted = cipher.doFinal(SpUtil.getInstance().getStr("userPwd").getBytes());
                //IV 保存用于做AES-CBC加密变换的初始向量数组
                byte[] IV = cipher.getIV();
                //保存加密过后的字符串
                String se = Base64.encodeToString(encrypted, Base64.URL_SAFE);

                String siv = Base64.encodeToString(IV, Base64.URL_SAFE);
                //获得加密的数据和iv后，本地保存起来。
                if (SpUtil.getInstance().saveStr(SpUtil.getInstance().getStr("userName"), se) &&
                        SpUtil.getInstance().saveStr(SpUtil.IVKeyName, siv)) {
                    callback.onAuthenticationSucceeded(se);
                }else{
                    callback.onAuthenticationFail();
                }
            } catch (BadPaddingException | IllegalBlockSizeException e) {
                e.printStackTrace();
                callback.onAuthenticationFail();
            }
        }
    }
}
