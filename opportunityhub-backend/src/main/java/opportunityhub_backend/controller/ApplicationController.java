package opportunityhub_backend.controller;

import opportunityhub_backend.entity.Application;
import opportunityhub_backend.entity.ApplicationStatus;
import opportunityhub_backend.entity.User;
import opportunityhub_backend.opportunity.Opportunity;
import opportunityhub_backend.opportunity.OpportunityRepository;
import opportunityhub_backend.repository.ApplicationRepository;
import opportunityhub_backend.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final OpportunityRepository opportunityRepository;

    public ApplicationController(
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            OpportunityRepository opportunityRepository) {

        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.opportunityRepository = opportunityRepository;
    }

    // Apply for an opportunity
    @PostMapping("/{userId}/{opportunityId}")
    public ResponseEntity<?> apply(
            @PathVariable Long userId,
            @PathVariable Long opportunityId) {

        if (applicationRepository.existsByUserIdAndOpportunityId(
                userId, opportunityId)) {

            return ResponseEntity.badRequest()
                    .body("Already applied for this opportunity");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() ->
                        new RuntimeException("Opportunity not found"));

        Application application = new Application();

        application.setUser(user);
        application.setOpportunity(opportunity);
        application.setStatus(ApplicationStatus.APPLIED);

        return ResponseEntity.ok(
                applicationRepository.save(application)
        );
    }

    // Get all applications of a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Application>> getUserApplications(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                applicationRepository.findByUserId(userId)
        );
    }

    // Update application status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status) {

        Application application =
                applicationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"));

        application.setStatus(status);

        return ResponseEntity.ok(
                applicationRepository.save(application)
        );
    }

    // Delete application
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(
            @PathVariable Long id) {

        if (!applicationRepository.existsById(id)) {
            return ResponseEntity.badRequest()
                    .body("Application not found");
        }

        applicationRepository.deleteById(id);

        return ResponseEntity.ok(
                "Application removed successfully"
        );
    }
}