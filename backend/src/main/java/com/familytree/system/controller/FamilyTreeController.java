package com.familytree.system.controller;

import com.familytree.system.model.FamilyTree;
import com.familytree.system.service.FamilyTreeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/family-trees")
public class FamilyTreeController {
    @Autowired
    private FamilyTreeService familyTreeService;

    // Lấy tất cả cây gia đình
    @GetMapping("")
    public List<FamilyTree> getAllFamilyTrees() {
        return familyTreeService.getAllFamilyTrees();
    }

    // Lấy cây gia đình theo ID
    @GetMapping("/{id}")
    public ResponseEntity<FamilyTree> getFamilyTreeById(@PathVariable Long id) {
        Optional<FamilyTree> familyTree = familyTreeService.getFamilyTreeById(id);
        return familyTree.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Tạo hoặc cập nhật cây gia đình
    @PostMapping("")
    public FamilyTree saveFamilyTree(@RequestBody FamilyTree familyTree) {
        return familyTreeService.saveFamilyTree(familyTree);
    }

    // Xóa cây gia đình theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFamilyTree(@PathVariable Long id) {
        familyTreeService.deleteFamilyTree(id);
        return ResponseEntity.noContent().build();
    }
}