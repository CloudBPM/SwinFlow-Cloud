package com.cloudibpm.core.docker;


public class ServiceDocker{

	private String imagesTag;
	private int imagePort;
	
	public String getImagesTag() {
		return imagesTag;
	}
	public void setImagesTag(String imagesTag) {
		this.imagesTag = imagesTag;
	}
	public int getImagePort() {
		return imagePort;
	}
	public void setImagePort(int imagePort) {
		this.imagePort = imagePort;
	}
	
}
