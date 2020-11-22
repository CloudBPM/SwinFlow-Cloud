package poi;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.xssf.usermodel.XSSFCell;

/**
 * Excel工具类
 * 
 * @author lp
 * 
 */
public class ExcelUtil {
	public static final String OFFICE_EXCEL_2003_POSTFIX = "xls";
	public static final String OFFICE_EXCEL_2010_POSTFIX = "xlsx";
	public static final String EMPTY = "";
	public static final String POINT = ".";
	public static SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");

	/**
	 * 获得path的后缀名
	 * 
	 * @param path
	 * @return
	 */
	public static String getPostfix(String path) {
		if (path == null || EMPTY.equals(path.trim())) {
			return EMPTY;
		}
		if (path.contains(POINT)) {
			return path.substring(path.lastIndexOf(POINT) + 1, path.length());
		}
		return EMPTY;
	}

	/**
	 * 单元格格式
	 * 
	 * @param cellx
	 * @return
	 */
	public static String getHValue(Cell cellx) {
		switch (cellx.getCellTypeEnum()) {
		case STRING:
			Pattern p = Pattern.compile("\t|\r|\n");
			Matcher m;
			String str = cellx.getStringCellValue().toString();
			m = p.matcher(str);
			String st = m.replaceAll("");
			st = st.replace(" ", "");
			return st;
		case BOOLEAN:
			return String.valueOf(cellx.getBooleanCellValue());
		case NUMERIC:
			String cellValue = "";
			if (XSSFDateUtil.isCellDateFormatted(cellx)) {
				Date date = XSSFDateUtil.getJavaDate(cellx.getNumericCellValue());
				cellValue = sdf.format(date);
			} else {
				DecimalFormat df = new DecimalFormat("#.##");
				cellValue = df.format(cellx.getNumericCellValue());
				String strArr = cellValue.substring(cellValue.lastIndexOf(POINT) + 1, cellValue.length());
				if (strArr.equals("00")) {
					cellValue = cellValue.substring(0, cellValue.lastIndexOf(POINT));
				}
			}
			return cellValue;
		case FORMULA :
			String strCell = new String();
			 try {
		            /*
		             * 此处判断使用公式生成的字符串有问题，因为HSSFDateUtil.isCellDateFormatted(cell)判断过程中cell
		             * .getNumericCellValue();方法会抛出java.lang.NumberFormatException异常
		             */
		             if (HSSFDateUtil.isCellDateFormatted(cellx)) {
		             	Date date = cellx.getDateCellValue();
		             	strCell = (date.getYear() + 1900) + "-" + (date.getMonth() + 1) +"-" + date.getDate();
		             	break;
		             } else {
		             	strCell = String.valueOf(cellx.getNumericCellValue());
		             }
		             } catch (IllegalStateException e) {
		             	strCell = String.valueOf(cellx.getRichStringCellValue());
		             }
			return strCell;
		case BLANK:
			return "";
		default:
			return "";
		}
		return null;
	}

	/**
	 * 单元格格式
	 * 
	 * @param cellx
	 * @return
	 */
	public static String getXValue(Cell cellx) {
		switch (cellx.getCellTypeEnum()) {
		case STRING:
			Pattern p = Pattern.compile("\t|\r|\n");
			Matcher m;
			String str = cellx.getStringCellValue().toString();
			m = p.matcher(str);
			String st = m.replaceAll("");
			st = st.replace(" ", "");
			return st;
		case BOOLEAN:
			return String.valueOf(cellx.getBooleanCellValue());
		case NUMERIC:
			String cellValue = "";
			if (XSSFDateUtil.isCellDateFormatted(cellx)) {
				Date date = XSSFDateUtil.getJavaDate(cellx.getNumericCellValue());
				cellValue = sdf.format(date);
			} else {
				DecimalFormat df = new DecimalFormat("#.##");
				cellValue = df.format(cellx.getNumericCellValue());
				String strArr = cellValue.substring(cellValue.lastIndexOf(POINT) + 1, cellValue.length());
				if (strArr.equals("00")) {
					cellValue = cellValue.substring(0, cellValue.lastIndexOf(POINT));
				}
			}
			return cellValue;
		case BLANK:
			return "";
		case FORMULA :
			return ((XSSFCell) cellx).getCTCell().getV();
		default:
			return "";
		}
	}
}

/**
 * 自定义xssf日期工具类
 * 
 * @author lp
 * 
 */
class XSSFDateUtil extends DateUtil {
	protected static int absoluteDay(Calendar cal, boolean use1904windowing) {
		return DateUtil.absoluteDay(cal, use1904windowing);
	}
}