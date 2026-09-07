package opportunityhub_backend.controller;

import opportunityhub_backend.entity.User;
import opportunityhub_backend.entity.UserProfile;
import opportunityhub_backend.repository.UserProfileRepository;
import opportunityhub_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class UserProfileController {

    private final UserProfileRepository repository;
    private final UserRepository userRepository;

    public UserProfileController(
            UserProfileRepository repository,
            UserRepository userRepository) {

        this.repository = repository;
        this.userRepository = userRepository;
    }

    // ==========================================
    // CREATE PROFILE
    // ==========================================

    @PostMapping("/{userId}")
    public ResponseEntity<?> createProfile(
            @PathVariable Long userId,
            @RequestBody UserProfile profile) {

        try {

            User user = userRepository.findById(userId)
                    .orElseThrow(() ->
                            new RuntimeException("User not found"));

            // Store full name in User table
            if (profile.getFullName() != null
                    && !profile.getFullName().trim().isEmpty()) {

                user.setName(profile.getFullName().trim());
                userRepository.save(user);
            }

            profile.setUser(user);

            UserProfile savedProfile =
                    repository.save(profile);

            // Put full name back into response
            savedProfile.setFullName(user.getName());

            return ResponseEntity.ok(savedProfile);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest()
                    .body("Unable to create profile: "
                            + e.getMessage());
        }
    }

    // ==========================================
    // GET PROFILE
    // ==========================================

    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(
            @PathVariable Long userId) {

        return repository.findByUserId(userId)
                .map(profile -> {

                    // Get full name from User table
                    if (profile.getUser() != null) {
                        profile.setFullName(
                                profile.getUser().getName()
                        );
                    }

                    return ResponseEntity.ok(profile);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long userId,
            @RequestBody UserProfile profile) {

        try {

            UserProfile existing =
                    repository.findByUserId(userId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Profile not found"));

            User user = userRepository.findById(userId)
                    .orElseThrow(() ->
                            new RuntimeException("User not found"));

            // ==========================================
            // UPDATE USER NAME
            // ==========================================

            if (profile.getFullName() != null
                    && !profile.getFullName().trim().isEmpty()) {

                user.setName(profile.getFullName().trim());
                userRepository.save(user);
            }

            // ==========================================
            // UPDATE PROFILE FIELDS
            // ==========================================

            existing.setPhone(
                    profile.getPhone()
            );

            existing.setCollege(
                    profile.getCollege()
            );

            existing.setDegree(
                    profile.getDegree()
            );

            existing.setBranch(
                    profile.getBranch()
            );

            existing.setGraduationYear(
                    profile.getGraduationYear()
            );

            existing.setSkills(
                    profile.getSkills()
            );

            existing.setInterests(
                    profile.getInterests()
            );

            // IMPORTANT:
            // This was missing in your previous controller.
            existing.setPreferredLocation(
                    profile.getPreferredLocation()
            );

            existing.setResumeUrl(
                    profile.getResumeUrl()
            );

            UserProfile updatedProfile =
                    repository.save(existing);

            // Return full name to frontend
            updatedProfile.setFullName(
                    user.getName()
            );

            return ResponseEntity.ok(updatedProfile);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest()
                    .body("Unable to update profile: "
                            + e.getMessage());
        }
    }
}