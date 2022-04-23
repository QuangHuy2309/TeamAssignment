package com.nashtech.rookies.java05.AssetManagement.controllers;

import com.nashtech.rookies.java05.AssetManagement.Repository.EmployeeRepository;
import com.nashtech.rookies.java05.AssetManagement.payload.LoginRequest;
import com.nashtech.rookies.java05.AssetManagement.payload.LoginResponse;
import com.nashtech.rookies.java05.AssetManagement.payload.MessageResponse;
import com.nashtech.rookies.java05.AssetManagement.security.jwt.JwtAuthTokenFilter;
import com.nashtech.rookies.java05.AssetManagement.security.jwt.JwtUtils;
import com.nashtech.rookies.java05.AssetManagement.security.services.UserDetailsImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/v1")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final EmployeeRepository employeeRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtils jwtUtils;


    public AuthController(AuthenticationManager authenticationManager, EmployeeRepository employeeRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> authenticateEmp(@Valid @RequestBody LoginRequest request){
        //initialize UsernamePasswordAuthenticationToken obj
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());
        //let authenticationManager authenticate this token
        Authentication authentication = authenticationManager.authenticate(authToken);

        //if there is no exception, so username and password is correct! => set them to security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        //generate jwt token to return the client
        String jwt = jwtUtils.generateJwtToken(authentication);

        //get user principle from authentication
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        //get list of roles
        List<String> roles = userDetails.getAuthorities().stream().map( role -> role.getAuthority()).collect(Collectors.toList());

        //initialize LoginResponse
        LoginResponse response = new LoginResponse(jwt, userDetails.getUsername(), userDetails.getId(), roles, userDetails.getStatus(), userDetails.getLocation());

        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @GetMapping("/auth/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String jwt = JwtAuthTokenFilter.parseJwt(request);
        if (jwt != null && jwtUtils.addToBlackList(jwt)){
            return ResponseEntity.ok(new MessageResponse("User logged out successfully!"));
        }
        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Error: Cannot add jwt token to blacklist!"));
    }
}
