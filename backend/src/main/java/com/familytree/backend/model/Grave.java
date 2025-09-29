package com.familytree.backend.model;

public class Grave {

    private Long id;
    private String name;
    private String years;
    private double latitude;
    private double longitude;
    private String status;
    private String description;

    // Constructors
    public Grave() {
    }

    public Grave(String name, String years, double latitude, double longitude, String status, String description) {
        this.name = name;
        this.years = years;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.description = description;
    }

    public Grave(Long id, String name, String years, double latitude, double longitude, String status, String description) {
        this.id = id;
        this.name = name;
        this.years = years;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getYears() {
        return years;
    }

    public void setYears(String years) {
        this.years = years;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Grave{" +
               "id=" + id +
               ", name='" + name + '\'' +
               ", years='" + years + '\'' +
               ", latitude=" + latitude +
               ", longitude=" + longitude +
               ", status='" + status + '\'' +
               ", description='" + description + '\'' +
               '}';
    }
}
