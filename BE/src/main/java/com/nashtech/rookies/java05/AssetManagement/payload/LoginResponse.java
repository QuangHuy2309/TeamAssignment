package com.nashtech.rookies.java05.AssetManagement.payload;

import java.util.Collection;

public class LoginResponse {
    private String token;

    private String id;

    private String username;

    private Collection<String> types;

    private int status;

    private String location;

    public LoginResponse(String token, String username, String id, Collection<String> types, int status, String location) {
        this.token = token;
        this.username = username;
        this.id = id;
        this.types = types;
        this.status = status;
        this.location = location;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getId() {
        return id;
    }

    public Collection<String> getTypes() {
        return types;
    }

    public void setTypes(Collection<String> types) {
        this.types = types;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
