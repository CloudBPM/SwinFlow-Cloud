import org.junit.Test;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;

public class FileCopyTest {
    public static void main(String[] args) throws IOException {
    //    File sourceFolder = new File("D:\\test1");
    //    File destinationFolder = new File("D:\\test2");
    //    FileUtil.copyFolder(sourceFolder, destinationFolder);
    }

    @Test
    public void test() throws IOException {
//        String str;
//        int count = 0;
//        FileReader fileReader = new FileReader("D:\\1.txt");
//        BufferedReader reader = new BufferedReader(fileReader);
//        while ((str = reader.readLine()) != null) {
//            count++;
//            String[] split = str.split(" ");
//            System.out.println(split[3].substring(1, split[3].length()));
//        }
//        System.out.println("共访问了" + count + "次");
//        reader.close();
    }

    @Test
    public void test1() throws ParseException ,IOException{
        //localhost_access_log.2018-12-13.txt
//        Date date = new Date();
//        System.out.println(date);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
//        String format = simpleDateFormat.format(date);
//        System.out.println(format);

//        Map<String, Integer> map = new HashMap<>();
//        int count = 0;
//        String path = "";
//        String str;
//        for (int i = 0; i < 7; i++) {
//            Date startDate = new Date();
//            Calendar instance = Calendar.getInstance();
//            instance.setTime(startDate);
//            instance.set(Calendar.DATE, instance.get(Calendar.DATE) - i);
//            Date endDate = simpleDateFormat.parse(simpleDateFormat.format(instance.getTime()));
//            String format = simpleDateFormat.format(endDate);
//            path = "localhost_access_log."+format+".txt";
//            FileReader fileReader = new FileReader("D:\\"+path);
//            BufferedReader reader = new BufferedReader(fileReader);
//            while ((str = reader.readLine()) != null) {
//                count++;
//            }
//            System.out.println(format+"共访问了" + count + "次");
//            reader.close();
//        }
    }
}
