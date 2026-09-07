package opportunityhub_backend.opportunity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "opportunities")
public class Opportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String organization;

    @Column(length = 2000)
    private String description;

    private String location;

    private String type;

    private String skills;

    private LocalDate deadline;

    @Column(length = 2000)
    private String eligibility;

    private String applicationLink;

    private boolean remote;

    public Opportunity() {
    }

    public Opportunity(String title, String organization, String description,
                       String location, String type, String skills,
                       LocalDate deadline, String eligibility,
                       String applicationLink, boolean remote) {

        this.title = title;
        this.organization = organization;
        this.description = description;
        this.location = location;
        this.type = type;
        this.skills = skills;
        this.deadline = deadline;
        this.eligibility = eligibility;
        this.applicationLink = applicationLink;
        this.remote = remote;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public String getEligibility() {
        return eligibility;
    }

    public void setEligibility(String eligibility) {
        this.eligibility = eligibility;
    }

    public String getApplicationLink() {
        return applicationLink;
    }

    public void setApplicationLink(String applicationLink) {
        this.applicationLink = applicationLink;
    }

    public boolean isRemote() {
        return remote;
    }

    public void setRemote(boolean remote) {
        this.remote = remote;
    }
}
