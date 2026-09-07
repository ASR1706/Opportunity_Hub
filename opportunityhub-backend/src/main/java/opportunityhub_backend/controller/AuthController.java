package opportunityhub_backend.controller;

import opportunityhub_backend.LoginRequest;
import opportunityhub_backend.entity.User;
import opportunityhub_backend.security.JwtService;
import opportunityhub_backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService,
                          JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            authService.register(request.name(), request.email(), request.password());
            return ResponseEntity.ok("Student registered successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public record RegisterRequest(
            String name,
            String email,
            String password
    ) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = authService.login(request.getEmail(), request.getPassword());

            String token = jwtService.generateToken(
                    user.getEmail(),
                    user.getRole().name()
            );

            return ResponseEntity.ok(
                    new LoginResponse(
                            "Login successful",
                            token,
                            user.getRole().name(),
                            user.getId()
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public record LoginResponse(
            String message,
            String token,
            String role,
            Long id
    ) {}
}
