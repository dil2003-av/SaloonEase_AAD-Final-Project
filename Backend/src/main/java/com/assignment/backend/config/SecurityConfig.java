package com.assignment.backend.config;

//import com.assignment.spring_security_with_jwt.util.JwtAuthFilter;
import com.assignment.backend.util.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final UserDetailsService userDetailsService;
    private final JwtAuthFilter jwtAuthFilter;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationCors()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/api/chatbot/**").permitAll()
                        .requestMatchers("/api/chat").permitAll() // allow chatbot endpoint
                        .requestMatchers("/api/v1/payments/**").permitAll()
                        .requestMatchers("/api/v1/reports/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder);
        return daoAuthenticationProvider;
    }

    // @Bean
    // public CorsConfigurationSource corsConfigurationCors() {
    // CorsConfiguration config = new CorsConfiguration();
    // config.addAllowedOriginPattern("*");
    // config.addAllowedMethod("*");
    // config.addAllowedHeader("*");
    // config.setAllowCredentials(false);
    //
    // UrlBasedCorsConfigurationSource source = new
    // UrlBasedCorsConfigurationSource();
    // source.registerCorsConfiguration("/**",config);
    // return source;
    // }

    @Bean
    public CorsConfigurationSource corsConfigurationCors() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOriginPattern("*"); // allow any origin
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // @Bean
    // public PasswordEncoder myPasswordEncoder() {
    // return new BCryptPasswordEncoder();
    // }

}
// package com.assignment.backend.config;
//
// import com.assignment.backend.util.JwtAuthFilter;
// import lombok.RequiredArgsConstructor;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationProvider;
// import
// org.springframework.security.authentication.dao.DaoAuthenticationProvider;
// import
// org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
// import
// org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import
// org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import
// org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//
// @Configuration
// @EnableMethodSecurity
// @RequiredArgsConstructor
// public class SecurityConfig {
//
// private final UserDetailsService userDetailsService;
// private final JwtAuthFilter jwtAuthFilter;
// private final PasswordEncoder passwordEncoder; // injected from
// ApplicationConfig
//
// @Bean
// public SecurityFilterChain securityFilterChain(HttpSecurity http) throws
// Exception {
// http.csrf(AbstractHttpConfigurer::disable)
// .cors(cors -> cors.configurationSource(corsConfigurationCors()))
// .authorizeHttpRequests(auth -> auth
// .requestMatchers("/api/v1/auth/**", "/api/v1/password/**").permitAll()
// .anyRequest().authenticated())
// .sessionManagement(session ->
// session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
// .authenticationProvider(authenticationProvider())
// .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
//
// return http.build();
// }
//
// @Bean
// public AuthenticationProvider authenticationProvider() {
// DaoAuthenticationProvider daoProvider = new DaoAuthenticationProvider();
// daoProvider.setUserDetailsService(userDetailsService);
// daoProvider.setPasswordEncoder(passwordEncoder); // use injected bean
// return daoProvider;
// }
//
// @Bean
// public CorsConfigurationSource corsConfigurationCors() {
// CorsConfiguration config = new CorsConfiguration();
// config.addAllowedOriginPattern("*");
// config.addAllowedMethod("*");
// config.addAllowedHeader("*");
// config.setAllowCredentials(false);
//
// UrlBasedCorsConfigurationSource source = new
// UrlBasedCorsConfigurationSource();
// source.registerCorsConfiguration("/**", config);
// return source;
// }
// }
