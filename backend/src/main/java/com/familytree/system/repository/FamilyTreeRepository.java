package com.familytree.system.repository;

import com.familytree.system.model.FamilyTree;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FamilyTreeRepository extends JpaRepository<FamilyTree, Long> {
}