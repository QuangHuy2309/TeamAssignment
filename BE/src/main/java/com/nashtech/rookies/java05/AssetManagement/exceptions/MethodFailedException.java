package com.nashtech.rookies.java05.AssetManagement.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class MethodFailedException extends RuntimeException{
	private String message;

    public MethodFailedException(String message) {
        super(message);
        this.message = message;
        System.err.println(message);
    }
}
