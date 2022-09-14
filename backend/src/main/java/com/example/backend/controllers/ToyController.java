package com.example.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.models.Toy;
import com.example.backend.services.ToyService;

@RestController
@RequestMapping("/api")
public class ToyController {
  private ToyService toyService;

  public ToyController(ToyService toyService) {
    this.toyService = toyService;
  }

  @GetMapping(value = "/toys")
  @ResponseStatus(HttpStatus.OK)
  public List<Toy> getAllToys() {
    System.out.println("somebody is getting all the toys");
    return toyService.getAllToys();
  }
}
