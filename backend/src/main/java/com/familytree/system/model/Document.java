package com.familytree.system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "documents")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String fileUrl;
    private String fileType;
    
    @Enumerated(EnumType.STRING)
    private DocumentType documentType;
    
    @ManyToOne
    @JoinColumn(name = "person_id")
    private Person person;
    
    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;
    
    @CreationTimestamp
    private LocalDateTime uploadedAt;
}