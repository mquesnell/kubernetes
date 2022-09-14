package com.example.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.Toy;

public interface ToyRepository extends JpaRepository<Toy, Long> {

}
