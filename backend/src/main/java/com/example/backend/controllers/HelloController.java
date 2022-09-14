package com.example.backend.controllers;

import java.time.LocalDateTime;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

  @GetMapping("/")
  public String index() {
    return "Seasons greetings from Spring Boot!\n";
  }

  @GetMapping("/bye")
  public String bye() {
    return "Goodbye and good riddance!\n";
  }

  @GetMapping("/time")
  public String time() {
    String rightNow = LocalDateTime.now().toString();
    System.out.println("somebody keeps asking for the time, which is: " + rightNow);
    return rightNow;
  }
}
