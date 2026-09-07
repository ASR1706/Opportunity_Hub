package opportunityhub_backend.opportunity;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OpportunityService {

    private final OpportunityRepository repository;

    public OpportunityService(OpportunityRepository repository) {
        this.repository = repository;
    }

    public List<Opportunity> getAllOpportunities() {
        return repository.findAll();
    }

    public Opportunity getOpportunityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));
    }

    public Opportunity createOpportunity(Opportunity opportunity) {
        return repository.save(opportunity);
    }

    public Opportunity updateOpportunity(Long id, Opportunity opportunity) {

        Opportunity existing = getOpportunityById(id);

        existing.setTitle(opportunity.getTitle());
        existing.setOrganization(opportunity.getOrganization());
        existing.setDescription(opportunity.getDescription());
        existing.setLocation(opportunity.getLocation());
        existing.setType(opportunity.getType());
        existing.setSkills(opportunity.getSkills());
        existing.setDeadline(opportunity.getDeadline());
        existing.setEligibility(opportunity.getEligibility());
        existing.setApplicationLink(opportunity.getApplicationLink());
        existing.setRemote(opportunity.isRemote());

        return repository.save(existing);
    }

    public void deleteOpportunity(Long id) {
        repository.deleteById(id);
    }
    public List<Opportunity> searchByTitle(String title) {
        return repository.findByTitleContainingIgnoreCase(title);
    }

    public List<Opportunity> getByType(String type) {
        return repository.findByTypeIgnoreCase(type);
    }

    public List<Opportunity> getByLocation(String location) {
        return repository.findByLocationContainingIgnoreCase(location);
    }

    public List<Opportunity> getBySkill(String skill) {
        return repository.findBySkillsContainingIgnoreCase(skill);
    }
}
