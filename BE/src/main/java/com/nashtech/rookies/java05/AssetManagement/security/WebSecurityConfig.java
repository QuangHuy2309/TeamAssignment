package com.nashtech.rookies.java05.AssetManagement.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.nashtech.rookies.java05.AssetManagement.security.jwt.JwtAuthEntryPoint;
import com.nashtech.rookies.java05.AssetManagement.security.jwt.JwtAuthTokenFilter;
import com.nashtech.rookies.java05.AssetManagement.security.jwt.JwtUtils;
import com.nashtech.rookies.java05.AssetManagement.security.services.UserDetailsServiceImpl;


@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        //securedEnabled = true,
        //jsr250Enabled = true,
        prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserDetailsServiceImpl userDetailsService;

    final private JwtAuthEntryPoint unauthorizedHandler;

    private final JwtUtils jwtUtils;


    public WebSecurityConfig(UserDetailsServiceImpl userDetailsService, JwtAuthEntryPoint unauthorizedHandler, JwtUtils jwtUtils) {
        this.userDetailsService = userDetailsService;
        this.unauthorizedHandler = unauthorizedHandler;
        this.jwtUtils = jwtUtils;
    }

    @Bean
    public JwtAuthTokenFilter authenticationJwtTokenFilter() {
        return new JwtAuthTokenFilter(jwtUtils, userDetailsService);
    }

    @Override
    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        // TODO
        authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
                .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                //Authenticate API Security
                .authorizeRequests().antMatchers("/api/v1/auth/logout").authenticated().and()
                .authorizeRequests().antMatchers("/api/v1/auth/**").permitAll().and()
                //Employee API Security
                .authorizeRequests().antMatchers("/api/v1/employees").hasAuthority("Admin").and()
                .authorizeRequests().antMatchers("/api/v1/employees/updatePassword/**").authenticated().and()
                .authorizeRequests().antMatchers("/api/v1/employees/**").hasAuthority("Admin").and()
                //Category API Security
                .authorizeRequests().antMatchers("/api/v1/categories").hasAuthority("Admin").and()
                .authorizeRequests().antMatchers("/api/v1/categories/**").hasAuthority("Admin").and()
                //Asset API Security
                .authorizeRequests().antMatchers("/api/v1/assets").hasAuthority("Admin").and()
                .authorizeRequests().antMatchers("/api/v1/assets/**").hasAuthority("Admin").and()
                //Assignment API Security
                .authorizeRequests().antMatchers("/api/v1/assignments").hasAuthority("Admin").and()
                .authorizeRequests().antMatchers("/api/v1/assignments/details/**").authenticated().and()
                .authorizeRequests().antMatchers("/api/v1/assignments/status/**").authenticated().and()
                .authorizeRequests().antMatchers("/api/v1/assignments/assignedTo/**").authenticated().and()
                .authorizeRequests().antMatchers("/api/v1/assignments/**").hasAuthority("Admin").and()
                //Report API Security
                .authorizeRequests().antMatchers("/api/v1/reports/**").hasAuthority("Admin").and()
                //Request for Returning API Security
                .authorizeRequests().antMatchers("/api/v1/requests/**").authenticated().and()
                .authorizeRequests().antMatchers("/api/v1/requests/complete/**").hasAuthority("Admin")
                .anyRequest().authenticated();


        http.logout().logoutUrl("api/v1/auth/logout").invalidateHttpSession(true);
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
    }
}
