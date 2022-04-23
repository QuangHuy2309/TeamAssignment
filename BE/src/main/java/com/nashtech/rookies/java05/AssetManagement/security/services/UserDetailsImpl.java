package com.nashtech.rookies.java05.AssetManagement.security.services;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Employee;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private String id;

    private String username;

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    private int status;

    private String location;


    public UserDetailsImpl(String id, String username, String password,
            Collection<? extends GrantedAuthority> authorities, int status, String location) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
        this.status = status;
        this.location = location;
    }

    public static UserDetailsImpl build(Employee user){
        List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
        authorities.add(new SimpleGrantedAuthority(user.getType()));
        
        return new UserDetailsImpl(user.getId(), 
                                user.getUsername(),  
                                user.getPassword(), 
                                authorities,
                                user.getStatus(),
                                user.getLocation());
        
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // TODO Auto-generated method stub
        return authorities;
    }

    public int getStatus(){
        return status;
    }

    public String getId() {
        return id;
    }

    public String getLocation() {return location;}

    @Override
    public String getPassword() {
        // TODO Auto-generated method stub
        return password;
    }

    @Override
    public String getUsername() {
        // TODO Auto-generated method stub
        return username;
    }



    @Override
    public boolean isAccountNonExpired() {
        // TODO Auto-generated method stub
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // TODO Auto-generated method stub
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // TODO Auto-generated method stub
        return true;
    }

    @Override
    public boolean isEnabled() {
        // TODO Auto-generated method stub
        return true;
    }
    
    @Override
    public boolean equals(Object o){
        if (this == o)
            return true;
        if (o == null || getClass()!=o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}
