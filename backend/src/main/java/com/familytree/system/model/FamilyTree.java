package com.familytree.system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "family_trees")
public class FamilyTree {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ManyToMany(mappedBy = "familyTrees")
    private List<User> users;
    
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
    
    @ManyToMany
    @JoinTable(
        name = "tree_people",
        joinColumns = @JoinColumn(name = "tree_id"),
        inverseJoinColumns = @JoinColumn(name = "person_id")
    )
    private List<Person> people;
    
    private boolean isPublic = false;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}