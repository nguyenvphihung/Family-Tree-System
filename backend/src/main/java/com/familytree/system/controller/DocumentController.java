package com.familytree.system.controller;

import com.familytree.system.model.Document;
import com.familytree.system.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    @Autowired
    private DocumentService documentService;

    // Lấy tất cả tài liệu
    @GetMapping("")
    public List<Document> getAllDocuments() {
        return documentService.getAllDocuments();
    }

    // Lấy tài liệu theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        Optional<Document> document = documentService.getDocumentById(id);
        return document.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Tạo hoặc cập nhật tài liệu
    @PostMapping("")
    public Document saveDocument(@RequestBody Document document) {
        return documentService.saveDocument(document);
    }

    // Xóa tài liệu theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}