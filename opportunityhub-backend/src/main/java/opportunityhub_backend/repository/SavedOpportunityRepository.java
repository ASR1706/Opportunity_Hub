package opportunityhub_backend.repository;

import opportunityhub_backend.entity.SavedOpportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface SavedOpportunityRepository
        extends JpaRepository<SavedOpportunity, Long> {

    List<SavedOpportunity> findByUserId(Long userId);

    boolean existsByUserIdAndOpportunityId(
            Long userId,
            Long opportunityId
    );

    @Modifying
    @Transactional
    @Query("""
            DELETE FROM SavedOpportunity s
            WHERE s.user.id = :userId
            AND s.opportunity.id = :opportunityId
            """)
    void deleteByUserIdAndOpportunityId(
            @Param("userId") Long userId,
            @Param("opportunityId") Long opportunityId
    );
}