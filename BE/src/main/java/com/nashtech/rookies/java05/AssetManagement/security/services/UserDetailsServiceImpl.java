package com.nashtech.rookies.java05.AssetManagement.security.services;

import com.nashtech.rookies.java05.AssetManagement.Model.Entity.Employee;
import com.nashtech.rookies.java05.AssetManagement.Repository.EmployeeRepository;

import com.nashtech.rookies.java05.AssetManagement.utils.USER_STATUS;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final EmployeeRepository employeeRepository;

    public UserDetailsServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // TODO Auto-generated method stub
        Employee user = employeeRepository.findByUsernameAndStatusNot(username, USER_STATUS.INACTIVE).orElseThrow(() ->
                new UsernameNotFoundException("User Not Found with -> username : " + username)
        );


        return UserDetailsImpl.build(user);
    }


}
