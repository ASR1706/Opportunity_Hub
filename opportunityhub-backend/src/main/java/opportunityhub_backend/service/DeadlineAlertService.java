package opportunityhub_backend.service;

import opportunityhub_backend.opportunity.Opportunity;
import opportunityhub_backend.opportunity.OpportunityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class DeadlineAlertService {

    private final OpportunityRepository opportunityRepository;

    public DeadlineAlertService(
            OpportunityRepository opportunityRepository) {

        this.opportunityRepository = opportunityRepository;
    }

    public List<DeadlineAlertResponse> getUpcomingDeadlines() {

        List<Opportunity> opportunities =
                opportunityRepository.findAll();

        LocalDate today = LocalDate.now();

        List<DeadlineAlertResponse> alerts =
                new ArrayList<>();

        for (Opportunity opportunity : opportunities) {

            Object deadlineValue = opportunity.getDeadline();

            if (deadlineValue == null) {
                continue;
            }

            LocalDate deadline = null;

            try {

                // If deadline is already a LocalDate
                if (deadlineValue instanceof LocalDate) {

                    deadline = (LocalDate) deadlineValue;

                }
                // If deadline is stored as String
                else {

                    String deadlineText =
                            deadlineValue.toString().trim();

                    if (deadlineText.isBlank()) {
                        continue;
                    }

                    deadline = LocalDate.parse(deadlineText);
                }

            } catch (Exception e) {

                // Ignore invalid deadline values
                continue;
            }

            long daysLeft =
                    ChronoUnit.DAYS.between(
                            today,
                            deadline
                    );

            /*
             * Only show:
             * - deadlines from today
             * - up to 60 days in the future
             *
             * Expired opportunities are ignored.
             */
            if (daysLeft >= 0 && daysLeft <= 60) {

                String urgency;

                if (daysLeft <= 3) {

                    urgency = "URGENT";

                } else if (daysLeft <= 7) {

                    urgency = "SOON";

                } else {

                    urgency = "UPCOMING";
                }

                alerts.add(
                        new DeadlineAlertResponse(
                                opportunity,
                                daysLeft,
                                urgency
                        )
                );
            }
        }

        alerts.sort(
                Comparator.comparingLong(
                        DeadlineAlertResponse::daysLeft
                )
        );

        return alerts;
    }

    public record DeadlineAlertResponse(
            Opportunity opportunity,
            long daysLeft,
            String urgency
    ) {
    }
}