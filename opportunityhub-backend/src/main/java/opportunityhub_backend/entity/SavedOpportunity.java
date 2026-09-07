package opportunityhub_backend.entity;
import opportunityhub_backend.opportunity.Opportunity;
import jakarta.persistence.*;

@Entity
@Table(
        name = "saved_opportunities",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "opportunity_id"})
        }
)
public class SavedOpportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "opportunity_id", nullable = false)
    private Opportunity opportunity;

    public SavedOpportunity() {
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

    public Opportunity getOpportunity() {
        return opportunity;
    }

    public void setOpportunity(Opportunity opportunity) {
        this.opportunity = opportunity;
    }
}