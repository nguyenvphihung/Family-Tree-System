package com.familytree.system.controller;

import com.familytree.system.model.Event;
import com.familytree.system.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class EventController {
    @Autowired
    private EventService eventService;

    // Lấy tất cả sự kiện
    @GetMapping("")
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    // Lấy sự kiện theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Optional<Event> event = eventService.getEventById(id);
        return event.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Tạo hoặc cập nhật sự kiện
    @PostMapping("")
    public Event saveEvent(@RequestBody Event event) {
        return eventService.saveEvent(event);
    }

    // Xóa sự kiện theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}