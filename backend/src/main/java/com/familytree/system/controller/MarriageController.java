package com.familytree.system.controller;

import com.familytree.system.model.Marriage;
import com.familytree.system.service.MarriageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/marriages")
public class MarriageController {
    @Autowired
    private MarriageService marriageService;

    // Lấy tất cả hôn nhân
    @GetMapping("")
    public List<Marriage> getAllMarriages() {
        return marriageService.getAllMarriages();
    }

    // Lấy hôn nhân theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Marriage> getMarriageById(@PathVariable Long id) {
        Optional<Marriage> marriage = marriageService.getMarriageById(id);
        return marriage.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Tạo hoặc cập nhật hôn nhân
    @PostMapping("")
    public Marriage saveMarriage(@RequestBody Marriage marriage) {
        return marriageService.saveMarriage(marriage);
    }

    // Xóa hôn nhân theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMarriage(@PathVariable Long id) {
        marriageService.deleteMarriage(id);
        return ResponseEntity.noContent().build();
    }
}