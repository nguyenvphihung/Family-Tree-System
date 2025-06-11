package com.familytree.system.service;

import com.familytree.system.model.FamilyTree;
import com.familytree.system.repository.FamilyTreeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FamilyTreeService {
    @Autowired
    private FamilyTreeRepository familyTreeRepository;

    public List<FamilyTree> getAllFamilyTrees() {
        return familyTreeRepository.findAll();
    }

    public Optional<FamilyTree> getFamilyTreeById(Long id) {
        return familyTreeRepository.findById(id);
    }

    public FamilyTree saveFamilyTree(FamilyTree familyTree) {
        return familyTreeRepository.save(familyTree);
    }

    public void deleteFamilyTree(Long id) {
        familyTreeRepository.deleteById(id);
    }
}