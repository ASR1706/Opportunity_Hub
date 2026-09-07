package opportunityhub_backend.opportunity;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {

    List<Opportunity> findByTypeIgnoreCase(String type);

    List<Opportunity> findByLocationContainingIgnoreCase(String location);

    List<Opportunity> findBySkillsContainingIgnoreCase(String skill);

    List<Opportunity> findByTitleContainingIgnoreCase(String title);
}
