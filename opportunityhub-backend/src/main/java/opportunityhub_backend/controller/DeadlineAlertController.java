package opportunityhub_backend.controller;

import opportunityhub_backend.service.DeadlineAlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/deadlines")
@CrossOrigin(origins = "http://localhost:5173")
public class DeadlineAlertController {

    private final DeadlineAlertService deadlineAlertService;

    public DeadlineAlertController(
            DeadlineAlertService deadlineAlertService) {

        this.deadlineAlertService = deadlineAlertService;
    }

    @GetMapping
    public ResponseEntity<?> getUpcomingDeadlines() {

        return ResponseEntity.ok(
                deadlineAlertService.getUpcomingDeadlines()
        );
    }
}