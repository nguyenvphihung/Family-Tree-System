package com.familytree.system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private LocalDate eventDate;
    private String eventPlace;
    
    @Enumerated(EnumType.STRING)
    private EventType eventType;
    
    @ManyToMany(mappedBy = "events")
    private List<Person> people;
}