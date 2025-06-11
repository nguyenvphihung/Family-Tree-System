package com.familytree.system.service;

import com.familytree.system.model.Token;
import com.familytree.system.repository.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TokenService {
    @Autowired
    private TokenRepository tokenRepository;

    public List<Token> getAllTokens() {
        return tokenRepository.findAll();
    }

    public Optional<Token> getTokenById(Long id) {
        return tokenRepository.findById(id);
    }

    public Token saveToken(Token token) {
        return tokenRepository.save(token);
    }

    public void deleteToken(Long id) {
        tokenRepository.deleteById(id);
    }
}