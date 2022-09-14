package com.example.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    // final String frontend = "http://127.0.0.1:3000";

    registry.addMapping("/**")
        .allowedOrigins("*")
        .allowedMethods("*");
  }
}
