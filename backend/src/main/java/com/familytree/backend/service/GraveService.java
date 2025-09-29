package com.familytree.backend.service;

import com.familytree.backend.model.Grave;
import com.familytree.backend.repository.FileBasedGraveRepository; // Changed to FileBasedGraveRepository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GraveService {

    @Autowired
    private FileBasedGraveRepository graveRepository; // Injected FileBasedGraveRepository directly

    public List<Grave> getAllGraves() {
        return graveRepository.findAll();
    }

    public Optional<Grave> getGraveById(Long id) {
        return graveRepository.findById(id);
    }

    public Grave createGrave(Grave grave) {
        return graveRepository.save(grave);
    }

    public Grave updateGrave(Long id, Grave graveDetails) {
        Optional<Grave> graveOptional = graveRepository.findById(id);
        if (graveOptional.isPresent()) {
            Grave existingGrave = graveOptional.get();
            existingGrave.setName(graveDetails.getName());
            existingGrave.setYears(graveDetails.getYears());
            existingGrave.setLatitude(graveDetails.getLatitude());
            existingGrave.setLongitude(graveDetails.getLongitude());
            existingGrave.setStatus(graveDetails.getStatus());
            existingGrave.setDescription(graveDetails.getDescription());
            return graveRepository.save(existingGrave);
        } else {
            throw new RuntimeException("Grave not found with id " + id);
        }
    }

    public void deleteGrave(Long id) {
        graveRepository.deleteById(id);
    }
}
