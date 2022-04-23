package com.nashtech.rookies.java05.AssetManagement.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidDataException extends RuntimeException{
    String message;

    public InvalidDataException(String message) {
        super(message);
        this.message = message;
        System.err.println(message);
    }
}
