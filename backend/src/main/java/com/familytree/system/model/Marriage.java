package com.familytree.system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "marriages")
public class Marriage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "person_id")
    private Person person;
    
    @ManyToOne
    @JoinColumn(name = "spouse_id")
    private Person spouse;
    
    private LocalDate marriageDate;
    private String marriagePlace;
    
    private LocalDate divorceDate;
    private String divorceReason;
    
    private Integer orderNumber; // Thứ tự cuộc hôn nhân
}