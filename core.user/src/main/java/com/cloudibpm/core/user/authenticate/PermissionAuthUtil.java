package com.cloudibpm.core.user.authenticate;

public class PermissionAuthUtil {

	private static final String API_DomainName = "http://localhost:8088/api";
	
//	public static Map checkPermission(String prsn,String oid,String userid) {
//		CloseableHttpClient httpClient = HttpClientBuilder.create().build();
//		Map map = new HashMap<>();
//		CloseableHttpResponse response1 = null;
//		String responseJson = null;
//		String result = "";
//		HttpPost httpPost = new HttpPost(API_DomainName+"/service0/api4");
//		if(!oid.equals("mainContent")){
//			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
//			urlParameters.add(new BasicNameValuePair("uid", userid));
//			urlParameters.add(new BasicNameValuePair("prsn", prsn));
//			urlParameters.add(new BasicNameValuePair("oid", oid));
//			try {
//				String str = EntityUtils.toString(new UrlEncodedFormEntity(urlParameters, "utf-8"));
//			} catch (ParseException | IOException e) {
//
//				e.printStackTrace();
//			}
//			HttpEntity postParams;
//			try {
//				postParams = new UrlEncodedFormEntity(urlParameters, "UTF-8");
//				httpPost.setEntity(postParams);
//			} catch (UnsupportedEncodingException e) {
//
//				e.printStackTrace();
//			}
//			try {
//				response1 = httpClient.execute(httpPost);
//			} catch (IOException e) {
//				e.printStackTrace();
//			}
//			if (response1.getStatusLine().getStatusCode() != 200) {
//				throw new RuntimeException("Failed : HTTP error code : " + response1.getStatusLine().getStatusCode());
//			}
//			HttpEntity entity = response1.getEntity();
//			try {
//				responseJson = EntityUtils.toString(entity, "UTF-8").trim();
//			} catch (ParseException | IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//			JSONObject resultJson = new JSONObject(responseJson);
//			result = (String) resultJson.get("status");
//			System.out.println(result);
//			map.put("result", result);
//			map.put("responseJson", responseJson);
//			try {
//				httpClient.close();
//			} catch (IOException e) {
//				e.printStackTrace();
//			}
//			httpPost.abort();
//		}
//		return map;
//	}
}
