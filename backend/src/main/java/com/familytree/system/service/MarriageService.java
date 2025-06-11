package com.familytree.system.service;

import com.familytree.system.model.Marriage;
import com.familytree.system.repository.MarriageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MarriageService {
    @Autowired
    private MarriageRepository marriageRepository;

    public List<Marriage> getAllMarriages() {
        return marriageRepository.findAll();
    }

    public Optional<Marriage> getMarriageById(Long id) {
        return marriageRepository.findById(id);
    }

    public Marriage saveMarriage(Marriage marriage) {
        return marriageRepository.save(marriage);
    }

    public void deleteMarriage(Long id) {
        marriageRepository.deleteById(id);
    }
}