package opportunityhub_backend.controller;

import opportunityhub_backend.entity.SavedOpportunity;
import opportunityhub_backend.entity.User;
import opportunityhub_backend.opportunity.Opportunity;
import opportunityhub_backend.repository.SavedOpportunityRepository;
import opportunityhub_backend.repository.UserRepository;
import opportunityhub_backend.opportunity.OpportunityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved")
@CrossOrigin(origins = "http://localhost:5173")
public class SavedOpportunityController {

    private final SavedOpportunityRepository savedRepository;
    private final UserRepository userRepository;
    private final OpportunityRepository opportunityRepository;

    public SavedOpportunityController(
            SavedOpportunityRepository savedRepository,
            UserRepository userRepository,
            OpportunityRepository opportunityRepository) {

        this.savedRepository = savedRepository;
        this.userRepository = userRepository;
        this.opportunityRepository = opportunityRepository;
    }

    // Save opportunity
    @PostMapping("/{userId}/{opportunityId}")
    public ResponseEntity<?> saveOpportunity(
            @PathVariable Long userId,
            @PathVariable Long opportunityId) {

        if (savedRepository.existsByUserIdAndOpportunityId(
                userId, opportunityId)) {

            return ResponseEntity.badRequest()
                    .body("Opportunity already saved");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() ->
                        new RuntimeException("Opportunity not found"));

        SavedOpportunity saved = new SavedOpportunity();
        saved.setUser(user);
        saved.setOpportunity(opportunity);

        return ResponseEntity.ok(savedRepository.save(saved));
    }

    // Get saved opportunities
    @GetMapping("/{userId}")
    public ResponseEntity<List<SavedOpportunity>> getSavedOpportunities(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                savedRepository.findByUserId(userId)
        );
    }

    // Remove saved opportunity
    @DeleteMapping("/{userId}/{opportunityId}")
    public ResponseEntity<?> removeSavedOpportunity(
            @PathVariable Long userId,
            @PathVariable Long opportunityId) {

        if (!savedRepository.existsByUserIdAndOpportunityId(
                userId, opportunityId)) {

            return ResponseEntity.badRequest()
                    .body("Opportunity is not saved");
        }

        savedRepository.deleteByUserIdAndOpportunityId(
                userId, opportunityId);

        return ResponseEntity.ok(
                "Opportunity removed from saved list"
        );
    }
}
