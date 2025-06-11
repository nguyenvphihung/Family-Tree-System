package com.familytree.system.controller;

import com.familytree.system.model.Token;
import com.familytree.system.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tokens")
public class TokenController {
    @Autowired
    private TokenService tokenService;

    // Lấy tất cả token
    @GetMapping("")
    public List<Token> getAllTokens() {
        return tokenService.getAllTokens();
    }

    // Lấy token theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Token> getTokenById(@PathVariable Long id) {
        Optional<Token> token = tokenService.getTokenById(id);
        return token.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Tạo hoặc cập nhật token
    @PostMapping("")
    public Token saveToken(@RequestBody Token token) {
        return tokenService.saveToken(token);
    }

    // Xóa token theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteToken(@PathVariable Long id) {
        tokenService.deleteToken(id);
        return ResponseEntity.noContent().build();
    }
}