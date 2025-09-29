package com.familytree.backend.repository;

import com.familytree.backend.model.Grave;
import org.springframework.stereotype.Repository;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Repository
public class FileBasedGraveRepository implements GraveRepository {

    private final Path filePath = Paths.get("src/main/resources/graves.csv");
    private final AtomicLong nextId = new AtomicLong(0);

    public FileBasedGraveRepository() {
        // Ensure the file exists and initialize nextId
        if (!Files.exists(filePath)) {
            try {
                Files.createFile(filePath);
            } catch (IOException e) {
                System.err.println("Error creating graves.csv: " + e.getMessage());
            }
        }
        // Initialize nextId based on existing data
        findAll().stream()
                .mapToLong(Grave::getId)
                .max()
                .ifPresent(maxId -> nextId.set(maxId + 1));
    }

    private synchronized List<Grave> readAllGraves() {
        List<Grave> graves = new ArrayList<>();
        try (BufferedReader reader = Files.newBufferedReader(filePath)) {
            graves = reader.lines()
                    .skip(1) // Skip header line
                    .map(this::parseGrave)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toList());
        } catch (IOException e) {
            System.err.println("Error reading graves.csv: " + e.getMessage());
        }
        return graves;
    }

    private synchronized void writeAllGraves(List<Grave> graves) {
        try (BufferedWriter writer = Files.newBufferedWriter(filePath)) {
            writer.write("id,name,years,latitude,longitude,status,description\n"); // Header
            for (Grave grave : graves) {
                writer.write(formatGrave(grave) + "\n");
            }
        } catch (IOException e) {
            System.err.println("Error writing graves.csv: " + e.getMessage());
        }
    }

    private Optional<Grave> parseGrave(String line) {
        try {
            String[] parts = line.split(",");
            if (parts.length >= 7) {
                Long id = Long.parseLong(parts[0]);
                String name = parts[1];
                String years = parts[2];
                double latitude = Double.parseDouble(parts[3]);
                double longitude = Double.parseDouble(parts[4]);
                String status = parts[5];
                String description = parts[6];
                return Optional.of(new Grave(id, name, years, latitude, longitude, status, description));
            }
        } catch (NumberFormatException | ArrayIndexOutOfBoundsException e) {
            System.err.println("Error parsing grave line: " + line + " - " + e.getMessage());
        }
        return Optional.empty();
    }

    private String formatGrave(Grave grave) {
        return String.format("%d,%s,%s,%.4f,%.4f,%s,%s",
                grave.getId(),
                grave.getName(),
                grave.getYears(),
                grave.getLatitude(),
                grave.getLongitude(),
                grave.getStatus(),
                grave.getDescription());
    }

    @Override
    public List<Grave> findAll() {
        return readAllGraves();
    }

    @Override
    public Optional<Grave> findById(Long id) {
        return findAll().stream()
                .filter(grave -> grave.getId().equals(id))
                .findFirst();
    }

    @Override
    public Grave save(Grave grave) {
        List<Grave> graves = findAll();
        if (grave.getId() == null) {
            // New grave
            grave.setId(nextId.getAndIncrement());
            graves.add(grave);
        } else {
            // Update existing grave
            graves = graves.stream()
                    .map(g -> g.getId().equals(grave.getId()) ? grave : g)
                    .collect(Collectors.toList());
        }
        writeAllGraves(graves);
        return grave;
    }

    @Override
    public void deleteById(Long id) {
        List<Grave> graves = findAll().stream()
                .filter(grave -> !grave.getId().equals(id))
                .collect(Collectors.toList());
        writeAllGraves(graves);
    }
}
