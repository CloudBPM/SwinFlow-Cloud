package com.cloudibpm.poi;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class ExcelGenerater {
	private final static ExcelGenerater instance = new ExcelGenerater();

	private ExcelGenerater() {
	}

	public static ExcelGenerater getInstance() {
		return instance;
	}

	public byte[] generate( List<ArrayList<String>> records, String sheetname) throws Exception {
		HSSFWorkbook wb = new HSSFWorkbook();
		HSSFSheet newsheet = wb.createSheet(sheetname);
		HSSFRow row = null;
		HSSFCell cell = null;
		for (int i = 0; i < records.size(); i++) {
			row = newsheet.createRow(i);
			for (int j = 0; j < records.get(i).size(); j++) {
				cell = row.createCell((short)j);
				String value = records.get(i).get(j);
				cell.setCellValue(value);
			}
		}
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		try {
			wb.write(bos);
		} finally {
			bos.close();
		}
		byte[] bytes = bos.toByteArray();
		return bytes;
	}

	// unused anywhere, just use it for testing
	public String getGenerateResult( List<ArrayList<String>> records) throws IOException {
		HSSFWorkbook wb = new HSSFWorkbook();
		HSSFSheet newsheet = wb.createSheet("GenerateResult");
		HSSFRow row = null;
		HSSFCell cell = null;
		for (int i = 0; i < records.size(); i++) {
			row = newsheet.createRow(i);
			for (int j = 0; j < records.get(i).size(); j++) {
				cell = row.createCell((short)j);
				String value = records.get(i).get(j);
				cell.setCellValue(value);
			}
		}
		String newexcelp = "E:///输出文件.xls";
		File file = new File(newexcelp);
		file.createNewFile();
		OutputStream outfile = new FileOutputStream(file);
		wb.write(outfile);
		outfile.close();
		return newexcelp;
	}

	// unused anywhere, just use it for testing
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
