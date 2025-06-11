package com.familytree.system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "people")
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String firstName;
    private String middleName;
    private String lastName;
    private String maidenName;
    private String nickname;
    
    private String gender;
    
    private LocalDate birthDate;
    private String birthPlace;
    
    private LocalDate deathDate;
    private String deathPlace;
    private String deathCause;
    
    private String occupation;
    private String education;
    
    @Column(columnDefinition = "TEXT")
    private String biography;
    
    private String profileImageUrl;
    
    // Relationships
    @ManyToOne
    @JoinColumn(name = "father_id")
    private Person father;
    
    @ManyToOne
    @JoinColumn(name = "mother_id")
    private Person mother;
    
    @OneToMany(mappedBy = "person")
    private List<Marriage> marriages;
    
    @OneToMany(mappedBy = "person")
    private List<Document> documents;
    
    @ManyToMany
    @JoinTable(
        name = "person_events",
        joinColumns = @JoinColumn(name = "person_id"),
        inverseJoinColumns = @JoinColumn(name = "event_id")
    )
    private List<Event> events;
    
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}