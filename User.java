package com.eskill.lms.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // ADMIN or STUDENT

    // Implement UserDetails methods for Spring Security
    // @Override
    // public Collection<? extends GrantedAuthority> getAuthorities() {
    // return Collections.singletonList(() -> "ADMIN"); // Fix role handling
    // }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
    return Collections.singletonList(() -> "ROLE_" + this.role.name()); // ✅ Fix: Assign correct role
    }



    @Override
    public String getUsername() {
        return email; // Spring Security uses email as username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
