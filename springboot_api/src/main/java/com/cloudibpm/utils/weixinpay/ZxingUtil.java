package com.cloudibpm.utils.weixinpay;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageConfig;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class ZxingUtil {

    public static boolean encode(String contents,String format,int width,int height,String saveImgFilePath){
        Boolean bool = false;
        BufferedImage image = createImage(contents,width,height);
        if(image ==null){
            bool = wirteToFile(image,format,saveImgFilePath);
        }
        return bool;
    }

    public static void encode(String conents,int width,int height){
        createImage(conents,width,height);
    }
    public static BufferedImage createImage(String contents, int width, int height) {
        BufferedImage bufferedImage = null;
        Map<EncodeHintType,Object> hints = new HashMap<EncodeHintType,Object>();
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
        hints.put(EncodeHintType.MARGIN,10);
        hints.put(EncodeHintType.CHARACTER_SET,"UTF-8");
        try {
            BitMatrix bitMatrix = new MultiFormatWriter().encode(contents, BarcodeFormat.QR_CODE,height,width,hints);
            MatrixToImageConfig config = new MatrixToImageConfig(0xff000000,0xffffffff);
            bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix,config);
        }catch (Exception e){
            e.printStackTrace();
        }
        return bufferedImage;
    }

    public static Boolean wirteToFile(BufferedImage bufferedImage,String format,String saveImgFilePath){
        Boolean bool = false;
        try {
            bool = ImageIO.write(bufferedImage,format,new File(saveImgFilePath));
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            return bool;
        }
    }
}
