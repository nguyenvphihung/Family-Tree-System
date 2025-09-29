package com.familytree.backend.repository;

import com.familytree.backend.model.Grave;
import java.util.List;
import java.util.Optional;

public interface GraveRepository {
    List<Grave> findAll();
    Optional<Grave> findById(Long id);
    Grave save(Grave grave);
    void deleteById(Long id);
}
