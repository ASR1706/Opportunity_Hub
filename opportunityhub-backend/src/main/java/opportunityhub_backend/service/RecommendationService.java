package opportunityhub_backend.service;

import opportunityhub_backend.entity.UserProfile;
import opportunityhub_backend.opportunity.Opportunity;
import opportunityhub_backend.opportunity.OpportunityRepository;
import opportunityhub_backend.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final UserProfileRepository userProfileRepository;
    private final OpportunityRepository opportunityRepository;

    public RecommendationService(
            UserProfileRepository userProfileRepository,
            OpportunityRepository opportunityRepository) {

        this.userProfileRepository = userProfileRepository;
        this.opportunityRepository = opportunityRepository;
    }

    public List<RecommendationResponse> getRecommendations(Long userId) {

        UserProfile profile = userProfileRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Profile not found"));

        List<Opportunity> opportunities =
                opportunityRepository.findAll();

        List<RecommendationResponse> recommendations =
                new ArrayList<>();

        for (Opportunity opportunity : opportunities) {

            int score = calculateMatchScore(
                    profile,
                    opportunity
            );

            List<String> matchedSkills =
                    findMatchedSkills(
                            profile.getSkills(),
                            opportunity.getSkills()
                    );

            recommendations.add(
                    new RecommendationResponse(
                            opportunity,
                            score,
                            matchedSkills
                    )
            );
        }

        recommendations.sort(
                Comparator.comparingInt(
                        RecommendationResponse::matchScore
                ).reversed()
        );

        return recommendations;
    }

    private int calculateMatchScore(
            UserProfile profile,
            Opportunity opportunity) {

        int score = 0;

        // ==========================================
        // SKILLS MATCH - 70%
        // ==========================================

        List<String> profileSkills =
                convertToList(profile.getSkills());

        List<String> opportunitySkills =
                convertToList(opportunity.getSkills());

        if (!profileSkills.isEmpty() &&
                !opportunitySkills.isEmpty()) {

            long matchedSkills =
                    opportunitySkills.stream()
                            .filter(opportunitySkill ->
                                    profileSkills.stream()
                                            .anyMatch(
                                                    profileSkill ->
                                                            profileSkill.equalsIgnoreCase(
                                                                    opportunitySkill
                                                            )
                                            )
                            )
                            .count();

            double skillPercentage =
                    (double) matchedSkills
                            / opportunitySkills.size();

            score += (int) Math.round(
                    skillPercentage * 70
            );
        }

        // ==========================================
        // LOCATION MATCH - 20%
        // ==========================================

        String profileLocation =
                getPreferredLocation(profile);

        String opportunityLocation =
                opportunity.getLocation();

        if (profileLocation != null &&
                !profileLocation.isBlank() &&
                opportunityLocation != null &&
                !opportunityLocation.isBlank()) {

            if (profileLocation.trim()
                    .equalsIgnoreCase(
                            opportunityLocation.trim()
                    )) {

                score += 20;
            }
        }

        // ==========================================
        // INTEREST MATCH - 10%
        // ==========================================

        String interests =
                profile.getInterests();

        if (interests != null &&
                !interests.isBlank() &&
                opportunity.getTitle() != null) {

            String lowerInterests =
                    interests.toLowerCase();

            String lowerTitle =
                    opportunity.getTitle().toLowerCase();

            // Check whether any interest appears
            // in the opportunity title.

            boolean interestMatched =
                    Arrays.stream(
                                    lowerInterests.split(",")
                            )
                            .map(String::trim)
                            .filter(interest -> !interest.isBlank())
                            .anyMatch(
                                    interest ->
                                            lowerTitle.contains(interest)
                            );

            if (interestMatched) {
                score += 10;
            }
        }

        return Math.min(score, 100);
    }

    // ==========================================
    // FIND MATCHED SKILLS
    // ==========================================

    private List<String> findMatchedSkills(
            String profileSkills,
            String opportunitySkills) {

        List<String> studentSkills =
                convertToList(profileSkills);

        List<String> requiredSkills =
                convertToList(opportunitySkills);

        return requiredSkills.stream()
                .filter(required ->
                        studentSkills.stream()
                                .anyMatch(
                                        student ->
                                                student.equalsIgnoreCase(
                                                        required
                                                )
                                )
                )
                .collect(Collectors.toList());
    }

    // ==========================================
    // CONVERT COMMA-SEPARATED STRING TO LIST
    // ==========================================

    private List<String> convertToList(String value) {

        if (value == null || value.isBlank()) {
            return Collections.emptyList();
        }

        return Arrays.stream(
                        value.split(",")
                )
                .map(String::trim)
                .filter(skill -> !skill.isBlank())
                .collect(Collectors.toList());
    }

    // ==========================================
    // GET PREFERRED LOCATION
    // ==========================================

    private String getPreferredLocation(
            UserProfile profile) {

        try {

            String location =
                    profile.getPreferredLocation();

            if (location == null) {
                return "";
            }

            return location.trim();

        } catch (Exception e) {

            return "";
        }
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    public record RecommendationResponse(
            Opportunity opportunity,
            int matchScore,
            List<String> matchedSkills
    ) {}
}