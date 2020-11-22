package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@SpringBootApplication
@Controller
@EnableScheduling
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}


//	@Bean
//	public RestTemplate customRestTemplate(){
//		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
//		requestFactory.setConnectionRequestTimeout(3000);
//		requestFactory.setConnectTimeout(3000);
//		requestFactory.setReadTimeout(3000);
//		return new RestTemplate(requestFactory);
//	}

	@RequestMapping("/socket")
	public String socket(){
		return "socket";
	}

}
