package opportunityhub_backend.opportunity;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
@CrossOrigin(origins = "http://localhost:5173")
public class OpportunityController {

    private final OpportunityService service;

    public OpportunityController(OpportunityService service) {
        this.service = service;
    }

    // Get all opportunities
    @GetMapping
    public List<Opportunity> getAllOpportunities() {
        return service.getAllOpportunities();
    }

    // Get opportunity by ID
    @GetMapping("/{id}")
    public ResponseEntity<Opportunity> getOpportunityById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getOpportunityById(id));
    }

    // Create opportunity
    @PostMapping
    public ResponseEntity<Opportunity> createOpportunity(
            @RequestBody Opportunity opportunity) {

        return ResponseEntity.ok(service.createOpportunity(opportunity));
    }

    // Update opportunity
    @PutMapping("/{id}")
    public ResponseEntity<Opportunity> updateOpportunity(
            @PathVariable Long id,
            @RequestBody Opportunity opportunity) {

        return ResponseEntity.ok(
                service.updateOpportunity(id, opportunity)
        );
    }

    // Delete opportunity
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOpportunity(@PathVariable Long id) {

        service.deleteOpportunity(id);

        return ResponseEntity.ok("Opportunity deleted successfully");
    }

    // Search by title
    // Search by title
    @GetMapping("/search/title")
    public List<Opportunity> searchByTitle(@RequestParam String title) {
        return service.searchByTitle(title);
    }

    // Filter by type
    @GetMapping("/type/{type}")
    public List<Opportunity> getByType(
            @PathVariable String type) {

        return service.getByType(type);
    }

    // Filter by location
    @GetMapping("/location/{location}")
    public List<Opportunity> getByLocation(
            @PathVariable String location) {

        return service.getByLocation(location);
    }

    // Filter by skill
    @GetMapping("/skill/{skill}")
    public List<Opportunity> getBySkill(
            @PathVariable String skill) {

        return service.getBySkill(skill);
    }
}
