package com.familytree.backend.controller;

import com.familytree.backend.model.Grave;
import com.familytree.backend.service.GraveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/graves")
@CrossOrigin(origins = "http://localhost:3000") // Allow your React app to access
public class GraveController {

    @Autowired
    private GraveService graveService;

    @GetMapping
    public List<Grave> getAllGraves() {
        return graveService.getAllGraves();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Grave> getGraveById(@PathVariable Long id) {
        return graveService.getGraveById(id)
                .map(grave -> new ResponseEntity<>(grave, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Grave> createGrave(@RequestBody Grave grave) {
        Grave createdGrave = graveService.createGrave(grave);
        return new ResponseEntity<>(createdGrave, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Grave> updateGrave(@PathVariable Long id, @RequestBody Grave graveDetails) {
        try {
            Grave updatedGrave = graveService.updateGrave(id, graveDetails);
            return new ResponseEntity<>(updatedGrave, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGrave(@PathVariable Long id) {
        try {
            graveService.deleteGrave(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            // Handle case where grave might not exist (though JpaRepository deleteById is usually resilient)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
