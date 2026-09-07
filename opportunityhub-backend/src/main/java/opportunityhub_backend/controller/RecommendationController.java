package opportunityhub_backend.controller;

import opportunityhub_backend.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:5173")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(
            RecommendationService recommendationService) {

        this.recommendationService = recommendationService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getRecommendations(
            @PathVariable Long userId) {

        try {

            List<RecommendationService.RecommendationResponse>
                    recommendations =
                    recommendationService
                            .getRecommendations(userId);

            return ResponseEntity.ok(recommendations);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}