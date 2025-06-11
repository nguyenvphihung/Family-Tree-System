package com.familytree.system.controller;

import com.familytree.system.model.Person;
import com.familytree.system.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/persons")
public class PersonController {
    @Autowired
    private PersonService personService;

    // Lấy tất cả cá nhân
    @GetMapping("")
    public List<Person> getAllPersons() {
        return personService.getAllPersons();
    }

    // Lấy cá nhân theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Person> getPersonById(@PathVariable Long id) {
        Optional<Person> person = personService.getPersonById(id);
        return person.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Tạo hoặc cập nhật cá nhân
    @PostMapping("")
    public Person savePerson(@RequestBody Person person) {
        return personService.savePerson(person);
    }

    // Xóa cá nhân theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePerson(@PathVariable Long id) {
        personService.deletePerson(id);
        return ResponseEntity.noContent().build();
    }
}