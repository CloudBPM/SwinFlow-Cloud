package poi;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

public class Dataimport {
	private final static Dataimport instance = new Dataimport();

	public Dataimport() {
	}

	public static Dataimport getInstance() {
		return instance;
	}

	// 02 单位所有技防设施登记表
	public ArrayList<String> getExcel1(String filePath, String filename) throws IOException {
		Row row = null;
		Cell cell = null;
		InputStream is = null;
		is = new FileInputStream(filePath);
		ArrayList<String> list = new ArrayList<String>();
		String extString = filename.substring(filename.lastIndexOf("."));
		if (".xls".equals(extString)) {
			HSSFWorkbook ww = new HSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			int lastRowNum = sheet.getLastRowNum();
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				for (int j = 0; j < 8; j++) {
					cell = row.getCell(j);
					if (cell == null || cell.equals("")) {
						list.add("");
					} else {
						String cellValue = ExcelUtil.getHValue(cell).trim();
						list.add(cellValue);
					}
				}
			}
		} else if (".xlsx".equals(extString)) {
			XSSFWorkbook ww = new XSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			int lastRowNum = sheet.getLastRowNum();
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				for (int j = 0; j < 8; j++) {
					cell = row.getCell(j);
					if (cell == null || cell.equals("")) {
						list.add("");
					} else {
						String cellValue = ExcelUtil.getXValue(cell).trim();
						list.add(cellValue);
					}
				}
			}
		}
		return list;

	}
	// 02 单位所有技防设施登记表返回信息
	public ArrayList<String> getCount1(String filePath, String filename) throws IOException {
		Row row = null;
		Cell cell = null;
		InputStream is = null;
		is = new FileInputStream(filePath);
		ArrayList<String> list = new ArrayList<String>();
		String extString = filename.substring(filename.lastIndexOf("."));
		if (".xls".equals(extString)) {
			HSSFWorkbook ww = new HSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			int lastRowNum = sheet.getLastRowNum();
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				// 公司列
				Cell cell_company = row.getCell(0);
				String companyValue="";
				if (cell_company == null || cell_company.equals("")) {
					companyValue="";
				}else{
					companyValue = ExcelUtil.getHValue(cell_company).trim();
				}				
				if (companyValue.equals("")) {
					list.add(i+1 + "");
				}

			}
		} else if (".xlsx".equals(extString)) {
			XSSFWorkbook ww = new XSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			int lastRowNum = sheet.getLastRowNum();
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				// 公司列
				Cell cell_company = row.getCell(0);
				String companyValue="";
				if (cell_company == null || cell_company.equals("")) {
					companyValue="";
				}else{
					companyValue = ExcelUtil.getXValue(cell_company).trim();
				}				
				if (companyValue.equals("")) {
					list.add(i+1 + "");
				}
			}
		}
		return list;

	}


	// 03 员工信息表
	public ArrayList<String> getExcel2(String filePath, String filename) throws IOException {
		Row row = null;
		Cell cell = null;
		InputStream is = null;
		is = new FileInputStream(filePath);
		ArrayList<String> list = new ArrayList<String>();
		String extString = filename.substring(filename.lastIndexOf("."));
		if (".xls".equals(extString)) {
			HSSFWorkbook ww = new HSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			// int lastRowNum = sheet.getLastRowNum();
			int lastRowNum = sheet.getPhysicalNumberOfRows() - 1;
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				if (row != null) {
					// 筛选正确信息
					// 公司列
					Cell cell_company = row.getCell(0);
					String companyValue = "";
					if (cell_company == null || cell_company.equals("")) {
						companyValue = "";
					} else {
						companyValue = ExcelUtil.getHValue(cell_company).trim();
					}
					// 姓名列
					Cell cell_name = row.getCell(1);
					String nameValue = "";
					if (cell_name == null || cell_name.equals("")) {
						nameValue = "";
					} else {
						nameValue = ExcelUtil.getHValue(cell_name).trim();
					}
					// 性别列
					Cell cell_gender = row.getCell(2);
					String genderValue = "";
					if (cell_gender == null || cell_gender.equals("")) {
						genderValue = "";
					} else {
						genderValue = ExcelUtil.getHValue(cell_gender).trim();
					}
					// 身份证列
					Cell cell_idNumber = row.getCell(4);
					String idNumberValue = "";
					if (cell_idNumber == null || cell_idNumber.equals("")) {
						idNumberValue = "";
					} else {
						idNumberValue = ExcelUtil.getHValue(cell_idNumber).trim();
					}
					if (!companyValue.equals("") && !nameValue.equals("") && nameValue.length() > 1
							&& !genderValue.equals("") && !idNumberValue.equals("")) {
						for (int j = 0; j < 14; j++) {
							cell = row.getCell(j);
							if (cell == null || cell.equals("")) {
								list.add("");
							} else {
								String cellValue = ExcelUtil.getHValue(cell).trim();
								list.add(cellValue);
							}
						}
					}
				}
			}
		} else if (".xlsx".equals(extString)) {
			XSSFWorkbook ww = new XSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			// int lastRowNum = sheet.getLastRowNum();
			int lastRowNum = sheet.getPhysicalNumberOfRows() - 1;
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				if (row != null) {
					// 筛选正确信息
					// 公司列
					Cell cell_company = row.getCell(0);
					String companyValue = "";
					if (cell_company == null || cell_company.equals("")) {
						companyValue = "";
					} else {
						companyValue = ExcelUtil.getXValue(cell_company).trim();
					}
					// 姓名列
					Cell cell_name = row.getCell(1);
					String nameValue = "";
					if (cell_name == null || cell_name.equals("")) {
						nameValue = "";
					} else {
						nameValue = ExcelUtil.getXValue(cell_name).trim();
					}
					// 性别列
					Cell cell_gender = row.getCell(2);
					String genderValue = "";
					if (cell_gender == null || cell_gender.equals("")) {
						genderValue = "";
					} else {
						genderValue = ExcelUtil.getXValue(cell_gender).trim();
					}
					// 身份证列
					Cell cell_idNumber = row.getCell(4);
					String idNumberValue = "";
					if (cell_idNumber == null || cell_idNumber.equals("")) {
						idNumberValue = "";
					} else {
						idNumberValue = ExcelUtil.getXValue(cell_idNumber).trim();
					}
					if (!companyValue.equals("") && !nameValue.equals("") && nameValue.length() > 1
							&& !genderValue.equals("") && !idNumberValue.equals("")) {
						for (int j = 0; j < 14; j++) {
							cell = row.getCell(j);
							if (cell == null || cell.equals("")) {
								list.add("");
							} else {
								String cellValue = ExcelUtil.getXValue(cell).trim();
								list.add(cellValue);
							}
						}
					}
				}
			}
		}
		return list;

	}

	// 03 员工信息表计数
	public ArrayList<String> getCount2(String filePath, String filename) throws IOException {
		Row row = null;
		Cell cell = null;
		InputStream is = null;
		is = new FileInputStream(filePath);
		ArrayList<String> list = new ArrayList<String>();
		String extString = filename.substring(filename.lastIndexOf("."));
		if (".xls".equals(extString)) {
			HSSFWorkbook ww = new HSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			// int lastRowNum = sheet.getLastRowNum();
			int lastRowNum = sheet.getPhysicalNumberOfRows() - 1;
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				if (row != null) {
					// 公司列
					Cell cell_company = row.getCell(0);
					String companyValue = "";
					if (cell_company == null || cell_company.equals("")) {
						companyValue = "";
					} else {
						companyValue = ExcelUtil.getHValue(cell_company).trim();
					}
					// 姓名列
					Cell cell_name = row.getCell(1);
					String nameValue = "";
					if (cell_name == null || cell_name.equals("")) {
						nameValue = "";
					} else {
						nameValue = ExcelUtil.getHValue(cell_name).trim();
					}
					// 性别列
					Cell cell_gender = row.getCell(2);
					String genderValue = "";
					if (cell_gender == null || cell_gender.equals("")) {
						genderValue = "";
					} else {
						genderValue = ExcelUtil.getHValue(cell_gender).trim();
					}
					// 身份证列
					Cell cell_idNumber = row.getCell(4);
					String idNumberValue = "";
					if (cell_idNumber == null || cell_idNumber.equals("")) {
						idNumberValue = "";
					} else {
						idNumberValue = ExcelUtil.getHValue(cell_idNumber).trim();
					}
					if (companyValue.equals("")) {
						list.add("第" + (i + 1) + "行工作单位为空");
					} else if (nameValue.equals("") || nameValue.length() <= 1) {
						list.add("第" + (i + 1) + "行姓名有误");
					} else if (genderValue.equals("")) {
						list.add("第" + (i + 1) + "行性别为空");
					} else if (idNumberValue.equals("")) {
						list.add("第" + (i + 1) + "行身份证号为空");
					}
				}

			}
		} else if (".xlsx".equals(extString)) {
			XSSFWorkbook ww = new XSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			// int lastRowNum = sheet.getLastRowNum();
			int lastRowNum = sheet.getPhysicalNumberOfRows() - 1;
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				if (row != null) {
					// 公司列
					Cell cell_company = row.getCell(0);
					String companyValue = "";
					if (cell_company == null || cell_company.equals("")) {
						companyValue = "";
					} else {
						companyValue = ExcelUtil.getXValue(cell_company).trim();
					}
					// 姓名列
					Cell cell_name = row.getCell(1);
					String nameValue = "";
					if (cell_name == null || cell_name.equals("")) {
						nameValue = "";
					} else {
						nameValue = ExcelUtil.getXValue(cell_name).trim();
					}
					// 性别列
					Cell cell_gender = row.getCell(2);
					String genderValue = "";
					if (cell_gender == null || cell_gender.equals("")) {
						genderValue = "";
					} else {
						genderValue = ExcelUtil.getXValue(cell_gender).trim();
					}
					// 身份证列
					Cell cell_idNumber = row.getCell(4);
					String idNumberValue = "";
					if (cell_idNumber == null || cell_idNumber.equals("")) {
						idNumberValue = "";
					} else {
						idNumberValue = ExcelUtil.getXValue(cell_idNumber).trim();
					}
					if (companyValue.equals("")) {
						list.add("第" + (i + 1) + "行工作单位为空");
					} else if (nameValue.equals("") || nameValue.length() <= 1) {
						list.add("第" + (i + 1) + "行姓名有误");
					} else if (genderValue.equals("")) {
						list.add("第" + (i + 1) + "行性别为空");
					} else if (idNumberValue.equals("")) {
						list.add("第" + (i + 1) + "行身份证号为空");
					}
				}
			}
		}
		return list;

	}

	// 04 要害部位登记表
	public ArrayList<String> getExcel3(String filePath, String filename) throws IOException {
		Row row = null;
		Cell cell = null;
		InputStream is = null;
		is = new FileInputStream(filePath);
		ArrayList<String> list = new ArrayList<String>();
		String extString = filename.substring(filename.lastIndexOf("."));
		if (".xls".equals(extString)) {
			HSSFWorkbook ww = new HSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			int lastRowNum = sheet.getLastRowNum();
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				for (int j = 0; j < 5; j++) {
					cell = row.getCell(j);
					if (cell == null || cell.equals("")) {
						list.add("");
					} else {
						String cellValue = ExcelUtil.getHValue(cell).trim();
						list.add(cellValue);
					}
				}
			}
		} else if (".xlsx".equals(extString)) {
			XSSFWorkbook ww = new XSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			int lastRowNum = sheet.getLastRowNum();
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				for (int j = 0; j < 5; j++) {
					cell = row.getCell(j);
					if (cell == null || cell.equals("")) {
						list.add("");
					} else {
						String cellValue = ExcelUtil.getXValue(cell).trim();
						list.add(cellValue);
					}
				}
			}
		}
		return list;

	}
	//04 要害部位返回信息
	public ArrayList<String> getCount3(String filePath, String filename) throws IOException {
		Row row = null;
		Cell cell = null;
		InputStream is = null;
		is = new FileInputStream(filePath);
		ArrayList<String> list = new ArrayList<String>();
		String extString = filename.substring(filename.lastIndexOf("."));
		if (".xls".equals(extString)) {
			HSSFWorkbook ww = new HSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			int lastRowNum = sheet.getLastRowNum();
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				// 公司列
				Cell cell_company = row.getCell(0);
				String companyValue="";
				if (cell_company == null || cell_company.equals("")) {
					companyValue="";
				}else{
					companyValue = ExcelUtil.getHValue(cell_company).trim();
				}
				// 要害部位名称列
				Cell cell_name = row.getCell(1);
				String nameValue="";
				if (cell_name == null || cell_name.equals("")) {
					nameValue="";
				}else{
					nameValue = ExcelUtil.getHValue(cell_name).trim();
				}
				// 所在位置列
				Cell cell_address = row.getCell(2);
				String addressValue="";
				if (cell_address == null || cell_address.equals("")) {
					addressValue="";
				}else{
					addressValue = ExcelUtil.getHValue(cell_address).trim();
				}			
				// 防范设施列
				Cell cell_preventive = row.getCell(3);
				String preventiveValue="";
				if (cell_preventive == null || cell_preventive.equals("")) {
					preventiveValue="";
				}else{
					preventiveValue = ExcelUtil.getHValue(cell_preventive).trim();
				}
				if (companyValue.equals("")) {
					list.add(i+1 + "");
				} else if (nameValue.equals("") && nameValue.length() <= 1) {
					list.add(i+1 + "");
				} else if (addressValue.equals("")) {
					list.add(i+1 + "");
				} else if (preventiveValue.equals("")) {
					list.add(i+1 + "");
				}

			}
		} else if (".xlsx".equals(extString)) {
			XSSFWorkbook ww = new XSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			int lastRowNum = sheet.getLastRowNum();
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				// 公司列
				Cell cell_company = row.getCell(0);
				String companyValue="";
				if (cell_company == null || cell_company.equals("")) {
					companyValue="";
				}else{
					companyValue = ExcelUtil.getXValue(cell_company).trim();
				}
				// 要害部位名称列
				Cell cell_name = row.getCell(1);
				String nameValue="";
				if (cell_name == null || cell_name.equals("")) {
					nameValue="";
				}else{
					nameValue = ExcelUtil.getXValue(cell_name).trim();
				}
				// 所在位置列
				Cell cell_address = row.getCell(2);
				String addressValue="";
				if (cell_address == null || cell_address.equals("")) {
					addressValue="";
				}else{
					addressValue = ExcelUtil.getXValue(cell_address).trim();
				}			
				// 防范设施列
				Cell cell_preventive = row.getCell(3);
				String preventiveValue="";
				if (cell_preventive == null || cell_preventive.equals("")) {
					preventiveValue="";
				}else{
					preventiveValue = ExcelUtil.getXValue(cell_preventive).trim();
				}
				if (companyValue.equals("")) {
					list.add(i+1 + "");
				} else if (nameValue.equals("") && nameValue.length() <= 1) {
					list.add(i+1 + "");
				} else if (addressValue.equals("")) {
					list.add(i+1 + "");
				} else if (preventiveValue.equals("")) {
					list.add(i+1 + "");
				}
			}
		}
		return list;

	}

	// 06 单位保卫人员报备表
	public ArrayList<String> getExcel4(String filePath, String filename) throws IOException {
		Row row = null;
		Cell cell = null;
		InputStream is = null;
		is = new FileInputStream(filePath);
		ArrayList<String> list = new ArrayList<String>();
		String extString = filename.substring(filename.lastIndexOf("."));
		if (".xls".equals(extString)) {
			HSSFWorkbook ww = new HSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			int lastRowNum = sheet.getLastRowNum();
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				for (int j = 0; j < 16; j++) {
					cell = row.getCell(j);
					if (cell == null || cell.equals("")) {
						list.add("");
					} else {
						String cellValue = ExcelUtil.getHValue(cell).trim();
						list.add(cellValue);
					}
				}
			}
		} else if (".xlsx".equals(extString)) {
			XSSFWorkbook ww = new XSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			int lastRowNum = sheet.getLastRowNum();
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				for (int j = 0; j < 16; j++) {
					cell = row.getCell(j);
					if (cell == null || cell.equals("")) {
						list.add("");
					} else {
						String cellValue = ExcelUtil.getXValue(cell).trim();
						list.add(cellValue);
					}
				}
			}
		}
		return list;

	}
	//06 保卫人员返回信息
	public ArrayList<String> getCount4(String filePath, String filename) throws IOException {
		Row row = null;
		Cell cell = null;
		InputStream is = null;
		is = new FileInputStream(filePath);
		ArrayList<String> list = new ArrayList<String>();
		String extString = filename.substring(filename.lastIndexOf("."));
		if (".xls".equals(extString)) {
			HSSFWorkbook ww = new HSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			int lastRowNum = sheet.getLastRowNum();
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				// 公司列
				Cell cell_company = row.getCell(0);
				String companyValue="";
				if (cell_company == null || cell_company.equals("")) {
					companyValue="";
				}else{
					companyValue = ExcelUtil.getHValue(cell_company).trim();
				}
				// 姓名列
				Cell cell_name = row.getCell(1);
				String nameValue="";
				if (cell_name == null || cell_name.equals("")) {
					nameValue="";
				}else{
					nameValue = ExcelUtil.getHValue(cell_name).trim();
				}
				// 性别列
				Cell cell_gender = row.getCell(2);
				String genderValue="";
				if (cell_gender == null || cell_gender.equals("")) {
					genderValue="";
				}else{
					genderValue = ExcelUtil.getHValue(cell_gender).trim();
				}			
				// 身份证列
				Cell cell_idNumber = row.getCell(4);
				String idNumberValue="";
				if (cell_idNumber == null || cell_idNumber.equals("")) {
					idNumberValue="";
				}else{
					idNumberValue = ExcelUtil.getHValue(cell_idNumber).trim();
				}
				// 手机号码列
				Cell cell_mobile = row.getCell(14);
				String mobileValue="";
				if (cell_mobile == null || cell_mobile.equals("")) {
					mobileValue="";
				}else{
					mobileValue = ExcelUtil.getHValue(cell_mobile).trim();
				}
				if (companyValue.equals("")) {
					list.add(i+1 + "");
				} else if (nameValue.equals("") && nameValue.length() <= 1) {
					list.add(i+1 + "");
				} else if (genderValue.equals("")) {
					list.add(i+1 + "");
				} else if (idNumberValue.equals("")) {
					list.add(i+1 + "");
				}else if (mobileValue.equals("")) {
					list.add(i+1 + "");
				}

			}
		} else if (".xlsx".equals(extString)) {
			XSSFWorkbook ww = new XSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			int lastRowNum = sheet.getLastRowNum();
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				// 公司列
				Cell cell_company = row.getCell(0);
				String companyValue="";
				if (cell_company == null || cell_company.equals("")) {
					companyValue="";
				}else{
					companyValue = ExcelUtil.getXValue(cell_company).trim();
				}
				// 姓名列
				Cell cell_name = row.getCell(1);
				String nameValue="";
				if (cell_name == null || cell_name.equals("")) {
					nameValue="";
				}else{
					nameValue = ExcelUtil.getXValue(cell_name).trim();
				}
				// 性别列
				Cell cell_gender = row.getCell(2);
				String genderValue="";
				if (cell_gender == null || cell_gender.equals("")) {
					genderValue="";
				}else{
					genderValue = ExcelUtil.getXValue(cell_gender).trim();
				}			
				// 身份证列
				Cell cell_idNumber = row.getCell(4);
				String idNumberValue="";
				if (cell_idNumber == null || cell_idNumber.equals("")) {
					idNumberValue="";
				}else{
					idNumberValue = ExcelUtil.getXValue(cell_idNumber).trim();
				}
				// 手机号码列
				Cell cell_mobile = row.getCell(14);
				String mobileValue="";
				if (cell_mobile == null || cell_mobile.equals("")) {
					mobileValue="";
				}else{
					mobileValue = ExcelUtil.getXValue(cell_mobile).trim();
				}
				if (companyValue.equals("")) {
					list.add(i+1 + "");
				} else if (nameValue.equals("") && nameValue.length() <= 1) {
					list.add(i+1 + "");
				} else if (genderValue.equals("")) {
					list.add(i+1 + "");
				} else if (idNumberValue.equals("")) {
					list.add(i+1 + "");
				}else if (mobileValue.equals("")) {
					list.add(i+1 + "");
				}
			}
		}
		return list;

	}

	// 07 单位概况表
	public ArrayList<String> getExcel5(String filePath, String filename) throws IOException {
		Row row = null;
		Cell cell = null;
		InputStream is = null;
		is = new FileInputStream(filePath);
		ArrayList<String> list = new ArrayList<String>();
		String extString = filename.substring(filename.lastIndexOf("."));
		if (".xls".equals(extString)) {
			HSSFWorkbook ww = new HSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			int lastRowNum = sheet.getLastRowNum();
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				for (int j = 0; j < 34; j++) {
					cell = row.getCell(j);
					if (cell == null || cell.equals("")) {
						list.add("");
					} else {
						String cellValue = ExcelUtil.getHValue(cell).trim();
						list.add(cellValue);
					}
				}
			}
		} else if (".xlsx".equals(extString)) {
			XSSFWorkbook ww = new XSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			int lastRowNum = sheet.getLastRowNum();
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				for (int j = 0; j < 34; j++) {
					cell = row.getCell(j);
					if (cell == null || cell.equals("")) {
						list.add("");
					} else {
						String cellValue = ExcelUtil.getXValue(cell).trim();
						list.add(cellValue);
					}
				}
			}
		}
		return list;

	}

	// 07 单位概况表计数
	public ArrayList<String> getCount5(String filePath, String filename) throws IOException {
		Row row = null;
		Cell cell = null;
		InputStream is = null;
		is = new FileInputStream(filePath);
		ArrayList<String> list = new ArrayList<String>();
		String extString = filename.substring(filename.lastIndexOf("."));
		if (".xls".equals(extString)) {
			HSSFWorkbook ww = new HSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			int lastRowNum = sheet.getLastRowNum();
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				// 所属派出所列
				Cell cell_policeStation = row.getCell(0);
				String policeStationValue="";
				if (cell_policeStation == null || cell_policeStation.equals("")) {
					policeStationValue="";
				}else{
					policeStationValue = ExcelUtil.getHValue(cell_policeStation).trim();
				}
				// 单位全称列
				Cell cell_companyName = row.getCell(1);
				String companyNameValue="";
				if (cell_companyName == null || cell_companyName.equals("")) {
					companyNameValue="";
				}else{
					companyNameValue = ExcelUtil.getHValue(cell_companyName).trim();
				}
				// 单位地址列
				Cell cell_address = row.getCell(2);
				String addressValue="";
				if (cell_address == null || cell_address.equals("")) {
					addressValue="";
				}else{
					addressValue = ExcelUtil.getHValue(cell_address).trim();
				}			
				// 单位性质列
				Cell cell_unitProperties = row.getCell(3);
				String unitPropertiesValue="";
				if (cell_unitProperties == null || cell_unitProperties.equals("")) {
					unitPropertiesValue="";
				}else{
					unitPropertiesValue = ExcelUtil.getHValue(cell_unitProperties).trim();
				}
				// 保卫负责人列
				Cell cell_headOfSecurity = row.getCell(4);
				String headOfSecurityValue="";
				if (cell_headOfSecurity == null || cell_headOfSecurity.equals("")) {
					headOfSecurityValue="";
				}else{
					headOfSecurityValue = ExcelUtil.getHValue(cell_headOfSecurity).trim();
				}
				// 保卫负责人身份证号码列
				Cell cell_headOfSecurityIdNumber = row.getCell(5);
				String headOfSecurityIdNumberValue="";
				if (cell_headOfSecurityIdNumber == null || cell_headOfSecurityIdNumber.equals("")) {
					headOfSecurityIdNumberValue="";
				}else{
					headOfSecurityIdNumberValue = ExcelUtil.getHValue(cell_headOfSecurityIdNumber).trim();
				}
				// 保卫负责人手机号码列
				Cell cell_headOfSecurityMobile = row.getCell(6);
				String headOfSecurityMobileValue="";
				if (cell_headOfSecurityMobile == null || cell_headOfSecurityMobile.equals("")) {
					headOfSecurityMobileValue="";
				}else{
					headOfSecurityMobileValue = ExcelUtil.getHValue(cell_headOfSecurityMobile).trim();
				}
				// 法定代表人列
				Cell cell_representative = row.getCell(7);
				String representativeValue="";
				if (cell_representative == null || cell_representative.equals("")) {
					representativeValue="";
				}else{
					representativeValue = ExcelUtil.getHValue(cell_representative).trim();
				}
				// 法定代表人身份证号码列
				Cell cell_representativeIdNumber = row.getCell(8);
				String representativeIdNumberValue="";
				if (cell_representativeIdNumber == null || cell_representativeIdNumber.equals("")) {
					representativeIdNumberValue="";
				}else{
					representativeIdNumberValue = ExcelUtil.getHValue(cell_representativeIdNumber).trim();
				}
				// 法定代表人手机号码列
				Cell cell_representaivMobile = row.getCell(9);
				String representaivMobileValue="";
				if (cell_representaivMobile == null || cell_representaivMobile.equals("")) {
					representaivMobileValue="";
				}else{
					representaivMobileValue = ExcelUtil.getHValue(cell_representaivMobile).trim();
				}
				// 实际负责人列
				Cell cell_realChargement = row.getCell(10);
				String realChargementValue="";
				if (cell_realChargement == null || cell_realChargement.equals("")) {
					realChargementValue="";
				}else{
					realChargementValue = ExcelUtil.getHValue(cell_realChargement).trim();
				}
				// 实际负责人身份证号码列
				Cell cell_realChargementIdNumber = row.getCell(11);
				String realChargementIdNumberValue="";
				if (cell_realChargementIdNumber == null || cell_realChargementIdNumber.equals("")) {
					realChargementIdNumberValue="";
				}else{
					realChargementIdNumberValue = ExcelUtil.getHValue(cell_realChargementIdNumber).trim();
				}
				// 实际负责人手机号码列
				Cell cell_realChargementMobile = row.getCell(12);
				String realChargementMobileValue="";
				if (cell_realChargementMobile == null || cell_realChargementMobile.equals("")) {
					realChargementMobileValue="";
				}else{
					realChargementMobileValue = ExcelUtil.getHValue(cell_realChargementMobile).trim();
				}
				// 单位联络员列
				Cell cell_liaisonMan = row.getCell(17);
				String liaisonManValue="";
				if (cell_liaisonMan == null || cell_liaisonMan.equals("")) {
					liaisonManValue="";
				}else{
					liaisonManValue = ExcelUtil.getHValue(cell_liaisonMan).trim();
				}
				// 单位联络员身份证号码列
				Cell cell_liaisonManIdNumber = row.getCell(18);
				String liaisonManIdNumberValue="";
				if (cell_liaisonManIdNumber == null || cell_liaisonManIdNumber.equals("")) {
					liaisonManIdNumberValue="";
				}else{
					liaisonManIdNumberValue = ExcelUtil.getHValue(cell_liaisonManIdNumber).trim();
				}
				// 单位联络员手机号码列
				Cell cell_liaisonManMobile = row.getCell(19);
				String liaisonManMobileValue="";
				if (cell_liaisonManMobile == null || cell_liaisonManMobile.equals("")) {
					liaisonManMobileValue="";
				}else{
					liaisonManMobileValue = ExcelUtil.getHValue(cell_liaisonManMobile).trim();
				}
				// 责任民警列
				Cell cell_police = row.getCell(28);
				String policeValue="";
				if (cell_police == null || cell_police.equals("")) {
					policeValue="";
				}else{
					policeValue = ExcelUtil.getHValue(cell_police).trim();
				}
				// 责任民警身份证号码列
				Cell cell_policeIdNumber = row.getCell(29);
				String policeIdNumberValue="";
				if (cell_policeIdNumber == null || cell_policeIdNumber.equals("")) {
					policeIdNumberValue="";
				}else{
					policeIdNumberValue = ExcelUtil.getHValue(cell_policeIdNumber).trim();
				}
				// 责任民警手机号码列
				Cell cell_policeMobile = row.getCell(30);
				String policeMobileValue="";
				if (cell_policeMobile == null || cell_policeMobile.equals("")) {
					policeMobileValue="";
				}else{
					policeMobileValue = ExcelUtil.getHValue(cell_policeMobile).trim();
				}
				if (policeStationValue.equals("")) {
					list.add(i+1 + "");
				} else if (companyNameValue.equals("")) {
					list.add(i+1 + "");
				} else if (addressValue.equals("")) {
					list.add(i+1 + "");
				} else if (unitPropertiesValue.equals("")) {
					list.add(i+1 + "");
				}else if (headOfSecurityValue.equals("")&& companyNameValue.length() <= 1) {
					list.add(i+1 + "");
				}else if (headOfSecurityIdNumberValue.equals("")) {
					list.add(i+1 + "");
				}else if (headOfSecurityMobileValue.equals("")) {
					list.add(i+1 + "");
				}else if (representativeValue.equals("")&& companyNameValue.length() <= 1) {
					list.add(i+1 + "");
				}else if (representativeIdNumberValue.equals("")) {
					list.add(i+1 + "");
				}else if (representaivMobileValue.equals("")) {
					list.add(i+1 + "");
				}else if (realChargementValue.equals("")&& companyNameValue.length() <= 1) {
					list.add(i+1 + "");
				}else if (realChargementIdNumberValue.equals("")) {
					list.add(i+1 + "");
				}else if (realChargementMobileValue.equals("")) {
					list.add(i+1 + "");
				}else if (liaisonManValue.equals("")&& companyNameValue.length() <= 1) {
					list.add(i+1 + "");
				}else if (liaisonManIdNumberValue.equals("")) {
					list.add(i+1 + "");
				}else if (liaisonManMobileValue.equals("")) {
					list.add(i+1 + "");
				}else if (policeValue.equals("")) {
					list.add(i+1 + "");
				}else if (policeIdNumberValue.equals("")) {
					list.add(i+1 + "");
				}else if (policeMobileValue.equals("")) {
					list.add(i+1 + "");
				}

			}
		} else if (".xlsx".equals(extString)) {
			XSSFWorkbook ww = new XSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			int lastRowNum = sheet.getLastRowNum();
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				// 所属派出所列
				Cell cell_policeStation = row.getCell(0);
				String policeStationValue="";
				if (cell_policeStation == null || cell_policeStation.equals("")) {
					policeStationValue="";
				}else{
					policeStationValue = ExcelUtil.getXValue(cell_policeStation).trim();
				}
				// 单位全称列
				Cell cell_companyName = row.getCell(1);
				String companyNameValue="";
				if (cell_companyName == null || cell_companyName.equals("")) {
					companyNameValue="";
				}else{
					companyNameValue = ExcelUtil.getXValue(cell_companyName).trim();
				}
				// 单位地址列
				Cell cell_address = row.getCell(2);
				String addressValue="";
				if (cell_address == null || cell_address.equals("")) {
					addressValue="";
				}else{
					addressValue = ExcelUtil.getXValue(cell_address).trim();
				}			
				// 单位性质列
				Cell cell_unitProperties = row.getCell(3);
				String unitPropertiesValue="";
				if (cell_unitProperties == null || cell_unitProperties.equals("")) {
					unitPropertiesValue="";
				}else{
					unitPropertiesValue = ExcelUtil.getXValue(cell_unitProperties).trim();
				}
				// 保卫负责人列
				Cell cell_headOfSecurity = row.getCell(4);
				String headOfSecurityValue="";
				if (cell_headOfSecurity == null || cell_headOfSecurity.equals("")) {
					headOfSecurityValue="";
				}else{
					headOfSecurityValue = ExcelUtil.getXValue(cell_headOfSecurity).trim();
				}
				// 保卫负责人身份证号码列
				Cell cell_headOfSecurityIdNumber = row.getCell(5);
				String headOfSecurityIdNumberValue="";
				if (cell_headOfSecurityIdNumber == null || cell_headOfSecurityIdNumber.equals("")) {
					headOfSecurityIdNumberValue="";
				}else{
					headOfSecurityIdNumberValue = ExcelUtil.getXValue(cell_headOfSecurityIdNumber).trim();
				}
				// 保卫负责人手机号码列
				Cell cell_headOfSecurityMobile = row.getCell(6);
				String headOfSecurityMobileValue="";
				if (cell_headOfSecurityMobile == null || cell_headOfSecurityMobile.equals("")) {
					headOfSecurityMobileValue="";
				}else{
					headOfSecurityMobileValue = ExcelUtil.getXValue(cell_headOfSecurityMobile).trim();
				}
				// 法定代表人列
				Cell cell_representative = row.getCell(7);
				String representativeValue="";
				if (cell_representative == null || cell_representative.equals("")) {
					representativeValue="";
				}else{
					representativeValue = ExcelUtil.getXValue(cell_representative).trim();
				}
				// 法定代表人身份证号码列
				Cell cell_representativeIdNumber = row.getCell(8);
				String representativeIdNumberValue="";
				if (cell_representativeIdNumber == null || cell_representativeIdNumber.equals("")) {
					representativeIdNumberValue="";
				}else{
					representativeIdNumberValue = ExcelUtil.getXValue(cell_representativeIdNumber).trim();
				}
				// 法定代表人手机号码列
				Cell cell_representaivMobile = row.getCell(9);
				String representaivMobileValue="";
				if (cell_representaivMobile == null || cell_representaivMobile.equals("")) {
					representaivMobileValue="";
				}else{
					representaivMobileValue = ExcelUtil.getXValue(cell_representaivMobile).trim();
				}
				// 实际负责人列
				Cell cell_realChargement = row.getCell(10);
				String realChargementValue="";
				if (cell_realChargement == null || cell_realChargement.equals("")) {
					realChargementValue="";
				}else{
					realChargementValue = ExcelUtil.getXValue(cell_realChargement).trim();
				}
				// 实际负责人身份证号码列
				Cell cell_realChargementIdNumber = row.getCell(11);
				String realChargementIdNumberValue="";
				if (cell_realChargementIdNumber == null || cell_realChargementIdNumber.equals("")) {
					realChargementIdNumberValue="";
				}else{
					realChargementIdNumberValue = ExcelUtil.getXValue(cell_realChargementIdNumber).trim();
				}
				// 实际负责人手机号码列
				Cell cell_realChargementMobile = row.getCell(12);
				String realChargementMobileValue="";
				if (cell_realChargementMobile == null || cell_realChargementMobile.equals("")) {
					realChargementMobileValue="";
				}else{
					realChargementMobileValue = ExcelUtil.getXValue(cell_realChargementMobile).trim();
				}
				// 单位联络员列
				Cell cell_liaisonMan = row.getCell(17);
				String liaisonManValue="";
				if (cell_liaisonMan == null || cell_liaisonMan.equals("")) {
					liaisonManValue="";
				}else{
					liaisonManValue = ExcelUtil.getXValue(cell_liaisonMan).trim();
				}
				// 单位联络员身份证号码列
				Cell cell_liaisonManIdNumber = row.getCell(18);
				String liaisonManIdNumberValue="";
				if (cell_liaisonManIdNumber == null || cell_liaisonManIdNumber.equals("")) {
					liaisonManIdNumberValue="";
				}else{
					liaisonManIdNumberValue = ExcelUtil.getXValue(cell_liaisonManIdNumber).trim();
				}
				// 单位联络员手机号码列
				Cell cell_liaisonManMobile = row.getCell(19);
				String liaisonManMobileValue="";
				if (cell_liaisonManMobile == null || cell_liaisonManMobile.equals("")) {
					liaisonManMobileValue="";
				}else{
					liaisonManMobileValue = ExcelUtil.getXValue(cell_liaisonManMobile).trim();
				}
				// 责任民警列
				Cell cell_police = row.getCell(28);
				String policeValue="";
				if (cell_police == null || cell_police.equals("")) {
					policeValue="";
				}else{
					policeValue = ExcelUtil.getXValue(cell_police).trim();
				}
				// 责任民警身份证号码列
				Cell cell_policeIdNumber = row.getCell(29);
				String policeIdNumberValue="";
				if (cell_policeIdNumber == null || cell_policeIdNumber.equals("")) {
					policeIdNumberValue="";
				}else{
					policeIdNumberValue = ExcelUtil.getXValue(cell_policeIdNumber).trim();
				}
				// 责任民警手机号码列
				Cell cell_policeMobile = row.getCell(30);
				String policeMobileValue="";
				if (cell_policeMobile == null || cell_policeMobile.equals("")) {
					policeMobileValue="";
				}else{
					policeMobileValue = ExcelUtil.getXValue(cell_policeMobile).trim();
				}
				if (policeStationValue.equals("")) {
					list.add(i+1 + "");
				} else if (companyNameValue.equals("")) {
					list.add(i+1 + "");
				} else if (addressValue.equals("")) {
					list.add(i+1 + "");
				} else if (unitPropertiesValue.equals("")) {
					list.add(i+1 + "");
				}else if (headOfSecurityValue.equals("")&& companyNameValue.length() <= 1) {
					list.add(i+1 + "");
				}else if (headOfSecurityIdNumberValue.equals("")) {
					list.add(i+1 + "");
				}else if (headOfSecurityMobileValue.equals("")) {
					list.add(i+1 + "");
				}else if (representativeValue.equals("")&& companyNameValue.length() <= 1) {
					list.add(i+1 + "");
				}else if (representativeIdNumberValue.equals("")) {
					list.add(i+1 + "");
				}else if (representaivMobileValue.equals("")) {
					list.add(i+1 + "");
				}else if (realChargementValue.equals("")&& companyNameValue.length() <= 1) {
					list.add(i+1 + "");
				}else if (realChargementIdNumberValue.equals("")) {
					list.add(i+1 + "");
				}else if (realChargementMobileValue.equals("")) {
					list.add(i+1 + "");
				}else if (liaisonManValue.equals("")&& companyNameValue.length() <= 1) {
					list.add(i+1 + "");
				}else if (liaisonManIdNumberValue.equals("")) {
					list.add(i+1 + "");
				}else if (liaisonManMobileValue.equals("")) {
					list.add(i+1 + "");
				}else if (policeValue.equals("")) {
					list.add(i+1 + "");
				}else if (policeIdNumberValue.equals("")) {
					list.add(i+1 + "");
				}else if (policeMobileValue.equals("")) {
					list.add(i+1 + "");
				}

			}
		}
		return list;

	}

	// 08 警务人员信息采集表
	public ArrayList<String> getExcel6(String filePath, String filename) throws IOException {
		Row row = null;
		Cell cell = null;
		InputStream is = null;
		is = new FileInputStream(filePath);
		ArrayList<String> list = new ArrayList<String>();
		String extString = filename.substring(filename.lastIndexOf("."));
		if (".xls".equals(extString)) {
			HSSFWorkbook ww = new HSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			int lastRowNum = sheet.getLastRowNum();
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				for (int j = 0; j < 11; j++) {
					cell = row.getCell(j);
					if (cell == null || cell.equals("")) {
						list.add("");
					} else {
						String cellValue = ExcelUtil.getHValue(cell).trim();
						list.add(cellValue);
					}
				}
			}
		} else if (".xlsx".equals(extString)) {
			XSSFWorkbook ww = new XSSFWorkbook(is);
			Sheet sheet = ww.getSheetAt(0);
			int lastRowNum = sheet.getLastRowNum();
			for (int i = 2; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				for (int j = 0; j < 11; j++) {
					cell = row.getCell(j);
					if (cell == null || cell.equals("")) {
						list.add("");
					} else {
						String cellValue = ExcelUtil.getXValue(cell).trim();
						list.add(cellValue);
					}
				}
			}
		}
		return list;

	}
	// 09 仓库管理员报备表
		public ArrayList<String> getExcel7(String filePath, String filename) throws IOException {
			Row row = null;
			Cell cell = null;
			InputStream is = null;
			is = new FileInputStream(filePath);
			ArrayList<String> list = new ArrayList<String>();
			String extString = filename.substring(filename.lastIndexOf("."));
			if (".xls".equals(extString)) {
				HSSFWorkbook ww = new HSSFWorkbook(is);
				Sheet sheet = ww.getSheetAt(0);
				int lastRowNum = sheet.getLastRowNum();
				for (int i = 2; i <= lastRowNum; i++) {
					row = sheet.getRow(i);
					for (int j = 0; j < 15; j++) {
						cell = row.getCell(j);
						if (cell == null || cell.equals("")) {
							list.add("");
						} else {
							String cellValue = ExcelUtil.getHValue(cell).trim();
							list.add(cellValue);
						}
					}
				}
			} else if (".xlsx".equals(extString)) {
				XSSFWorkbook ww = new XSSFWorkbook(is);
				Sheet sheet = ww.getSheetAt(0);
				int lastRowNum = sheet.getLastRowNum();
				for (int i = 2; i <= lastRowNum; i++) {
					row = sheet.getRow(i);
					for (int j = 0; j < 15; j++) {
						cell = row.getCell(j);
						if (cell == null || cell.equals("")) {
							list.add("");
						} else {
							String cellValue = ExcelUtil.getXValue(cell).trim();
							list.add(cellValue);
						}
					}
				}
			}
			return list;

		}
		//09 仓库管理员返回信息
		public ArrayList<String> getCount7(String filePath, String filename) throws IOException {
			Row row = null;
			Cell cell = null;
			InputStream is = null;
			is = new FileInputStream(filePath);
			ArrayList<String> list = new ArrayList<String>();
			String extString = filename.substring(filename.lastIndexOf("."));
			if (".xls".equals(extString)) {
				HSSFWorkbook ww = new HSSFWorkbook(is);
				Sheet sheet = ww.getSheetAt(0);
				int lastRowNum = sheet.getLastRowNum();
				for (int i = 2; i <= lastRowNum; i++) {
					row = sheet.getRow(i);
					// 公司列
					Cell cell_company = row.getCell(0);
					String companyValue="";
					if (cell_company == null || cell_company.equals("")) {
						companyValue="";
					}else{
						companyValue = ExcelUtil.getHValue(cell_company).trim();
					}
					// 姓名列
					Cell cell_name = row.getCell(1);
					String nameValue="";
					if (cell_name == null || cell_name.equals("")) {
						nameValue="";
					}else{
						nameValue = ExcelUtil.getHValue(cell_name).trim();
					}
					// 性别列
					Cell cell_gender = row.getCell(2);
					String genderValue="";
					if (cell_gender == null || cell_gender.equals("")) {
						genderValue="";
					}else{
						genderValue = ExcelUtil.getHValue(cell_gender).trim();
					}			
					// 身份证列
					Cell cell_idNumber = row.getCell(4);
					String idNumberValue="";
					if (cell_idNumber == null || cell_idNumber.equals("")) {
						idNumberValue="";
					}else{
						idNumberValue = ExcelUtil.getHValue(cell_idNumber).trim();
					}
					// 手机号码列
					Cell cell_mobile = row.getCell(14);
					String mobileValue="";
					if (cell_mobile == null || cell_mobile.equals("")) {
						mobileValue="";
					}else{
						mobileValue = ExcelUtil.getHValue(cell_mobile).trim();
					}
					if (companyValue.equals("")) {
						list.add(i+1 + "");
					} else if (nameValue.equals("") && nameValue.length() <= 1) {
						list.add(i+1 + "");
					} else if (genderValue.equals("")) {
						list.add(i+1 + "");
					} else if (idNumberValue.equals("")) {
						list.add(i+1 + "");
					}else if (mobileValue.equals("")) {
						list.add(i+1 + "");
					}

				}
			} else if (".xlsx".equals(extString)) {
				XSSFWorkbook ww = new XSSFWorkbook(is);
				Sheet sheet = ww.getSheetAt(0);
				int lastRowNum = sheet.getLastRowNum();
				for (int i = 2; i <= lastRowNum; i++) {
					row = sheet.getRow(i);
					// 公司列
					Cell cell_company = row.getCell(0);
					String companyValue="";
					if (cell_company == null || cell_company.equals("")) {
						companyValue="";
					}else{
						companyValue = ExcelUtil.getXValue(cell_company).trim();
					}
					// 姓名列
					Cell cell_name = row.getCell(1);
					String nameValue="";
					if (cell_name == null || cell_name.equals("")) {
						nameValue="";
					}else{
						nameValue = ExcelUtil.getXValue(cell_name).trim();
					}
					// 性别列
					Cell cell_gender = row.getCell(2);
					String genderValue="";
					if (cell_gender == null || cell_gender.equals("")) {
						genderValue="";
					}else{
						genderValue = ExcelUtil.getXValue(cell_gender).trim();
					}			
					// 身份证列
					Cell cell_idNumber = row.getCell(4);
					String idNumberValue="";
					if (cell_idNumber == null || cell_idNumber.equals("")) {
						idNumberValue="";
					}else{
						idNumberValue = ExcelUtil.getXValue(cell_idNumber).trim();
					}
					// 手机号码列
					Cell cell_mobile = row.getCell(14);
					String mobileValue="";
					if (cell_mobile == null || cell_mobile.equals("")) {
						mobileValue="";
					}else{
						mobileValue = ExcelUtil.getXValue(cell_mobile).trim();
					}
					if (companyValue.equals("")) {
						list.add(i+1 + "");
					} else if (nameValue.equals("") && nameValue.length() <= 1) {
						list.add(i+1 + "");
					} else if (genderValue.equals("")) {
						list.add(i+1 + "");
					} else if (idNumberValue.equals("")) {
						list.add(i+1 + "");
					}else if (mobileValue.equals("")) {
						list.add(i+1 + "");
					}
				}
			}
			return list;

		}

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

}
