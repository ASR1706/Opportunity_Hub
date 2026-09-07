package opportunityhub_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "opportunity_id", nullable = false)
    private opportunityhub_backend.opportunity.Opportunity opportunity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    public Application() {
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public opportunityhub_backend.opportunity.Opportunity getOpportunity() {
        return opportunity;
    }

    public void setOpportunity(
            opportunityhub_backend.opportunity.Opportunity opportunity) {
        this.opportunity = opportunity;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}