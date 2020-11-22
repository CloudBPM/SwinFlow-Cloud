/**
 * @user Dahai CAO
 * @date 07/07/2011 3:26:34 PM
 */
package com.cloudibpm.core.util.file;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

public class FileUtil {
    /**
     * Copy file from the source directory <tt>src</tt> to the destined
     * directory <tt>dest</tt>. The source folder format is represented below:
     * String src = "d:/data/xx.txt"; String dest = "d:/backup/xy.txt";
     *
     * @param src          String, the format is like D:/ata/ or /home/data/
     * @param srcfilename  String, the format is like fffff.txt, fff.xls
     * @param dest         String, the format is like D:/ata/ or /home/data/
     * @param destfilename String, the format is like fffff.txt, fff.xls
     * @throws IOException
     */
    public static void copyFile(String src, String srcfilename, String dest, String destfilename) throws IOException {
        FileInputStream in = new FileInputStream(src + srcfilename);
        createDir(dest);
        if (destfilename != null && !destfilename.equals("")) {
            File file = new File(dest + destfilename);
            if (!file.exists())
                file.createNewFile();
            FileOutputStream out = new FileOutputStream(file);
            int c;
            byte buffer[] = new byte[1024];
            while ((c = in.read(buffer)) != -1) {
                for (int i = 0; i < c; i++)
                    out.write(buffer[i]);
            }
            out.close();
        } else {
            File file = new File(dest + srcfilename);
            if (!file.exists())
                file.createNewFile();
            FileOutputStream out = new FileOutputStream(file);
            int c;
            byte buffer[] = new byte[1024];
            while ((c = in.read(buffer)) != -1) {
                for (int i = 0; i < c; i++)
                    out.write(buffer[i]);
            }
            out.close();
        }
        in.close();
    }

    /**
     * Write a specified file to a specified directory. This method is used in
     * upload a file to a server.
     *
     * @param bytes
     * @param dest
     * @param filename
     * @throws IOException
     */
    public static void writeFile(byte[] bytes, String dest, String filename) throws IOException {

        // Path path = Paths.get("C:/temp/test.txt");
        // byte[] data = Files.readAllBytes(path);

        // Using FileUtils.readFileToByteArray()
        // byte[] org.apache.commons.io.FileUtils.readFileToByteArray(File file)

        // Using IOUtils.toByteArray
        // byte[] org.apache.commons.io.IOUtils.toByteArray(InputStream input)

        BufferedOutputStream buffStream = new BufferedOutputStream(new FileOutputStream(dest + "/" + filename));
        buffStream.write(bytes);
        buffStream.close();
    }

    /**
     * Create file directory using specified <tt>path</tt>. You can also use the
     * following way to create directory.
     * <p>
     * For JDK 7, try Java NIO package – java.nio.file.Paths and
     * java.nio.file.Files
     *
     * <pre>
     * Path path = Paths.get("C:\\Directory2\\Sub2\\Sub-Sub2");
     * // if directory exists?
     * if (!Files.exists(path)) {
     * 	try {
     * 		Files.createDirectories(path);
     *    } catch (IOException e) {
     * 		// fail to create directory
     * 		e.printStackTrace();
     *    }
     * }
     * </pre>
     *
     * @param path directory.
     */
    public static File createDir(String path) {
        // Create a directory named “Directory2 and all its sub-directories
        // “Sub2” and “Sub-Sub2” together.
        File dir = new File(path);
        if (!dir.exists())
            dir.mkdirs();
        return dir;

    }

    /**
     * Delete file by the specified <tt>file name</tt> in the specified
     * directory <tt>path</tt>.
     *
     * @param path     directory
     * @param filename file name.
     * @date 07/07/2011 3:41:11 PM
     */
    public static void delFile(String path, String filename) {
        File file = new File(path + "/" + filename);
        if (file.exists() && file.isFile()) {
            file.delete();
        }
    }

    public static void delFile(String path) {
        File file = new File(path);
        if (file.exists() && file.isFile()) {
            file.delete();
        }
    }

    public static void remove(String path, String fname) {
        File file = new File(path + "/" + fname);
        if (file.exists()) {
            file.delete();
        }
    }

    public static void remove(String path) {
        File file = new File(path);
        if (file.exists()) {
            file.delete();
        }
    }

    // 删除文件名包含指定字符的文件
    public static void deleteFilesLikeName(File file, String likeName) {
        if (file.isFile()) {
            // 是文件
            String temp = file.getName().substring(0, file.getName().lastIndexOf("."));
            if (temp.indexOf(likeName) != -1) {
                file.delete();
            }
        } else {
            // 是目录
            File[] files = file.listFiles();
            for (int i = 0; i < files.length; i++) {
                deleteFilesLikeName(files[i], likeName);
            }
        }
    }

    // 删除某目录下文件名字包含指定字符的文件
    public static void deleteDirFilesLikeName(String dir, String likeName) {
        File file = new File(dir);
        if (file.exists()) {
            deleteFilesLikeName(file, likeName);
        } else {
            // System.out.println("路径不存在");
        }
    }

    // 删除文件名指定字的文件
    public static void deleteFile(File file) {
        if (file.isFile()) {
            file.delete();
        }
    }

    /**
     * Delete file directory by the specified directory <tt>path</tt>.
     *
     * @param path
     * @date 07/07/2011 3:44:09 PM
     */
    public static void delDir(String path) {
        File dir = new File(path);
        if (dir.exists()) {
            File[] tmp = dir.listFiles();
            for (int i = 0; i < tmp.length; i++) {
                if (tmp[i].isDirectory()) {
                    delDir(path + "/" + tmp[i].getName());
                } else {
                    tmp[i].delete();
                }
            }
            dir.delete();
        }
    }

    /**
     * @param path
     * @return
     * @throws IOException
     * @date 07/07/2011 4:07:53 PM
     */
    public static String FileInputStream(String path) throws IOException {
        File file = new File(path);
        if (!file.exists() || file.isDirectory())
            throw new FileNotFoundException();
        FileInputStream fis = new FileInputStream(file);
        byte[] buf = new byte[1024];
        StringBuffer sb = new StringBuffer();
        while ((fis.read(buf)) != -1) {
            sb.append(new String(buf));
            buf = new byte[1024];// 重新生成，避免和上次读取的数据重复
        }
        fis.close();
        return sb.toString();
    }

    public static byte[] BytesFromFile(File file) throws IOException {
        InputStream is = new FileInputStream(file);
        long length = file.length();

        if (length > Integer.MAX_VALUE) {
            System.out.println("Sorry! Your given file is too large.");
            System.exit(0);
        }

        byte[] bytes = new byte[(int) length];
        int offset = 0;
        int numRead = 0;
        while (offset < bytes.length && (numRead = is.read(bytes, offset, bytes.length - offset)) >= 0) {
            offset += numRead;
        }
        if (offset < bytes.length) {
            is.close();
            throw new IOException("Could not completely read file " + file.getName());
        }
        is.close();
        return bytes;
    }

    /**
     * List all file names with the specified <tt>extension</tt> in the
     * specified directory <tt>path</tt>. The format of extension is "." plus
     * file extension name, ";" as a separator. For example: ".jpg", or
     * ".jpg;.gif;.pdf", etc.
     *
     * @param path
     * @return
     * @throws IOException
     * @date 07/07/2011 4:15:23 PM
     */
    public static String[] readFileNames(String path, final String ext) throws IOException {
        File fileDir = new File(path);
        if (fileDir.isDirectory()) {
            FileFilter fileFilter = new FileFilter() {
                public boolean accept(File file) {
                    if (file.isFile()) {
                        StringTokenizer st = new StringTokenizer(ext, ";");
                        while (st.hasMoreTokens()) {
                            String ext = st.nextToken();
                            if (file.getName().endsWith(ext))
                                return true;
                        }
                    }
                    return false;
                }
            };
            File[] t = fileDir.listFiles(fileFilter);
            if (t.length > 0) {
                String[] filenames = new String[t.length];
                for (int i = 0; i < t.length; i++) {
                    filenames[i] = t[i].getName();
                }
                return filenames;
            }
        }
        return null;
    }

    /**
     * Returns size string format of <code>filesize<code>.
     *
     * @return String
     * @date 04/03/2012 12:27:03 PM
     */
    public static String computingSize(long filesize) {
        long size = filesize;
        if (size < 1024)
            return size + " byte";
        else {
            String r = " K";
            double d = (size * 1.0) / 1024;
            BigDecimal mData = new BigDecimal(String.valueOf(d)).setScale(2, BigDecimal.ROUND_HALF_UP);
            NumberFormat nf1 = NumberFormat.getInstance();
            return nf1.format(mData) + r;
        }
    }

    public static List<File> getFileList(final String filepath, final String ext) {
        List<File> files = new ArrayList<File>();
        files.clear();
        File file = new File(filepath);
        loopFiles(file, ext, files);
        return files;
    }

    /**
     * This method can get all jar files in the sepecific folder including all
     * subfolders
     *
     * @param file
     * @param ext
     * @param fileList
     */
    private static void loopFiles(File file, final String ext, List<File> fileList) {
        if (file.exists()) {
            if (file.isDirectory()) {
                FileFilter fileFilter = new FileFilter() {
                    public boolean accept(File file) {
                        if (file.isFile()) {
                            if (ext == null || ext.equals("*.*")) {
                                return true;
                            } else {
                                StringTokenizer st = new StringTokenizer(ext, ";");
                                while (st.hasMoreTokens()) {
                                    String extendname = st.nextToken();
                                    if (file.getAbsolutePath().endsWith(extendname))
                                        return true;
                                }
                            }
                        }
                        return false;
                    }
                };
                File[] files = file.listFiles(fileFilter);
                for (File tmp : files)
                    loopFiles(tmp, ext, fileList);
            } else {
                fileList.add(file);
                // addURL(file);
            }
        }
    }

    /**
     * get all files by path
     *
     * @param path
     * @return
     */
    public static List<File> getFileList(String path) {
        List<File> f = new ArrayList<>();
        File f1 = new File(path);
        loopFiles(f1, f);
        return f;
    }


    /**
     * get all files by path
     *
     * @param path
     * @return
     */
    public static List<File> getAllFileList(String path) {
        List<File> f = new ArrayList<>();
        File f1 = new File(path);
        loopFileList(f1, f);
        return f;
    }


    private static void loopFileList(File file, List<File> fileList) {
        if (file.exists()) {
            if (file.isDirectory()) {
                File[] files = file.listFiles();
                for (int i = 0; i < files.length; i++) {
                    File tmp = files[i];
                    if (!tmp.isDirectory()) {
                        fileList.add(tmp);
                    } else {
                        loopFileList(tmp, fileList);
                    }
                }
            }
        }
    }


    /**
     * get all files by path
     *
     * @param path
     * @return
     */
    public static List<File> getCurrentFolderContent(String path) {
        List<File> fileList = new ArrayList<>();
        File file = new File(path);
        if (file.exists()) {
            if (file.isDirectory()) {
                File[] files = file.listFiles();
                for (int i = 0; i < files.length; i++) {
                    File tmp = files[i];
                    fileList.add(tmp);
                }
            }
        }
        return fileList;
    }

    public static List<File> getParentFolderContent(String path) {
        List<File> fileList = new ArrayList<>();
        File file = new File(path);
        String strParentDirectory = file.getParent();
        file = new File(strParentDirectory);
        if (file.exists()) {
            if (file.isDirectory()) {
                File[] files = file.listFiles();
                for (int i = 0; i < files.length; i++) {
                    File tmp = files[i];
                    fileList.add(tmp);
                }
            }
        }
        return fileList;
    }


    private static void loopFiles(File file, List<File> fileList) {
        if (file.exists()) {
            if (file.isDirectory()) {
                File[] files = file.listFiles();
                for (int i = 0; i < files.length; i++) {
                    File tmp = files[i];
                    fileList.add(tmp);
                    loopFiles(tmp, fileList);
                }
            }
        }
    }

    public static boolean rename(File sourceFile, File destinationFile) throws Exception {
        return sourceFile.renameTo(destinationFile);
    }

    /**
     * This function recursively copy all the sub folder and files from
     * sourceFolder to destinationFolder
     */
    public static void copyFolder(File sourceFolder, File destinationFolder) throws IOException {
        if (!sourceFolder.exists()) {
            return;
        }
        // Check if sourceFolder is a directory or file
        // If sourceFolder is file; then copy the file directly to new location
        if (sourceFolder.isDirectory()) {
            // Verify if destinationFolder is already present; If not then
            // create it
            if (!destinationFolder.exists()) {
                destinationFolder.mkdir();
            }
            // Get all files from source directory
            String files[] = sourceFolder.list();
            // Iterate over all files and copy them to destinationFolder one by
            // one
            for (String file : files) {
                File srcFile = new File(sourceFolder, file);
                File destFile = new File(destinationFolder, file);
                // Recursive function call
                copyFolder(srcFile, destFile);
            }
        } else {
            // Copy the file content from one place to another
            Files.copy(sourceFolder.toPath(), destinationFolder.toPath(), StandardCopyOption.REPLACE_EXISTING);
            System.out.println("File copied :: " + destinationFolder);
        }
    }

    // public static void main(String[] args) {
    // String src = "d:/data/";
    // String dest = "d:/ts/gg/jj/";
    // String srcfilename = "filter.txt";
    // String destfilename = "filter.txt";
    // try {
    // FileUtil.copyFile(src, srcfilename, dest, destfilename);
    // } catch (IOException e) {
    // // TODO Auto-generated catch block
    // e.printStackTrace();
    // }
    // }
}
