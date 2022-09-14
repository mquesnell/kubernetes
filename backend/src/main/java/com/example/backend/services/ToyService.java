package com.example.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.models.Toy;
import com.example.backend.repositories.ToyRepository;

@Service
public class ToyService {
  private ToyRepository toyRepository;

  @Autowired
  public ToyService(ToyRepository toyRepository) {
    this.toyRepository = toyRepository;
  }

  public List<Toy> getAllToys() {
    return toyRepository.findAll();
  }
}
