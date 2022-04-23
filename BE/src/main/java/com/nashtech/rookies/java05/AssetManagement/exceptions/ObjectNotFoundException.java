package com.nashtech.rookies.java05.AssetManagement.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ObjectNotFoundException extends RuntimeException {
    private String message;

    public ObjectNotFoundException(String message) {
        super(message);
        this.message = message;
        System.err.println(message);
    }
}
