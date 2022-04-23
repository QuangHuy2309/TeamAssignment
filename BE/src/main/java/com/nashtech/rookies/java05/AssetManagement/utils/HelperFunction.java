package com.nashtech.rookies.java05.AssetManagement.utils;

import java.util.NoSuchElementException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nashtech.rookies.java05.AssetManagement.exceptions.ObjectNotFoundException;
import com.nashtech.rookies.java05.AssetManagement.security.jwt.JwtAuthTokenFilter;
import com.nashtech.rookies.java05.AssetManagement.security.jwt.JwtUtils;
import com.nashtech.rookies.java05.AssetManagement.services.EmployeeService;

@Service
public class HelperFunction {
	
	@Autowired 
	private JwtUtils jwtUtils;
	
	@Autowired
	private EmployeeService employeeService;
	
	public boolean checkIfStringContainSpecialChar(String s) {
		Pattern special = Pattern.compile ("[!@#$%&*()_+=|<>?{}\\[\\]~-]");
		Matcher hasSpecial = special.matcher(s);
		return hasSpecial.find();
	}
	
	public boolean checkIfStringContainDigit(String s) {
	    boolean containsDigit = false;

	    if (s != null && !s.isEmpty()) {
	        for (char c : s.toCharArray()) {
	            if (containsDigit = Character.isDigit(c)) {
	                break;
	            }
	        }
	    }
	    return containsDigit;
	}
	
	public String getAdminLocationByJwt(HttpServletRequest request) {
		String jwt = JwtAuthTokenFilter.parseJwt(request);
		String username = jwtUtils.getUserNameFromJwtToken(jwt);
		String location = "";
		try {
			location = employeeService.getEmployeeByUsername(username).get().getLocation();
		} catch (NoSuchElementException ex) {
			throw new ObjectNotFoundException("No found employee with username: " + username);
		}
		return location;
	}
}
