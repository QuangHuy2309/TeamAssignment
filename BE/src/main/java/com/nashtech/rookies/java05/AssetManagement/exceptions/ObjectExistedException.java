package com.nashtech.rookies.java05.AssetManagement.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class ObjectExistedException extends RuntimeException {
    private String message;

    public ObjectExistedException(String message) {
        super(message);
        this.message = message;
        System.err.println(message);
    }
}
