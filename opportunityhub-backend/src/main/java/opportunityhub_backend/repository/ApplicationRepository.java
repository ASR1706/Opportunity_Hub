package opportunityhub_backend.repository;

import opportunityhub_backend.entity.Application;
import opportunityhub_backend.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    // Check whether user already applied
    boolean existsByUserIdAndOpportunityId(
            Long userId,
            Long opportunityId
    );

    // Get all applications of a user
    List<Application> findByUserId(Long userId);

    // Get applications of a user by status
    List<Application> findByUserIdAndStatus(
            Long userId,
            ApplicationStatus status
    );
}