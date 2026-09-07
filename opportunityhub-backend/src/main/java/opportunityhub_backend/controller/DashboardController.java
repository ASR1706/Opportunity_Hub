package opportunityhub_backend.controller;

import opportunityhub_backend.entity.ApplicationStatus;
import opportunityhub_backend.repository.ApplicationRepository;
import opportunityhub_backend.repository.SavedOpportunityRepository;
import opportunityhub_backend.opportunity.OpportunityRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final OpportunityRepository opportunityRepository;
    private final SavedOpportunityRepository savedOpportunityRepository;
    private final ApplicationRepository applicationRepository;

    public DashboardController(
            OpportunityRepository opportunityRepository,
            SavedOpportunityRepository savedOpportunityRepository,
            ApplicationRepository applicationRepository) {

        this.opportunityRepository = opportunityRepository;
        this.savedOpportunityRepository = savedOpportunityRepository;
        this.applicationRepository = applicationRepository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Long>> getDashboard(
            @PathVariable Long userId) {

        Map<String, Long> dashboard = new LinkedHashMap<>();

        dashboard.put(
                "totalOpportunities",
                opportunityRepository.count()
        );

        dashboard.put(
                "savedOpportunities",
                (long) savedOpportunityRepository
                        .findByUserId(userId)
                        .size()
        );

        dashboard.put(
                "totalApplications",
                (long) applicationRepository
                        .findByUserId(userId)
                        .size()
        );

        dashboard.put(
                "applied",
                (long) applicationRepository
                        .findByUserIdAndStatus(
                                userId,
                                ApplicationStatus.APPLIED
                        )
                        .size()
        );

        dashboard.put(
                "shortlisted",
                (long) applicationRepository
                        .findByUserIdAndStatus(
                                userId,
                                ApplicationStatus.SHORTLISTED
                        )
                        .size()
        );

        dashboard.put(
                "selected",
                (long) applicationRepository
                        .findByUserIdAndStatus(
                                userId,
                                ApplicationStatus.SELECTED
                        )
                        .size()
        );

        dashboard.put(
                "rejected",
                (long) applicationRepository
                        .findByUserIdAndStatus(
                                userId,
                                ApplicationStatus.REJECTED
                        )
                        .size()
        );

        return ResponseEntity.ok(dashboard);
    }
}
