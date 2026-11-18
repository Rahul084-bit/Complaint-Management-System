package com.example.complaint;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:4200")
public class ComplaintController {

    private final ComplaintRepository repo;

    public ComplaintController(ComplaintRepository repo) {
        this.repo = repo;
    }

    record StatusUpdate(Status status) {}

    @GetMapping
    public List<Complaint> getAll(@RequestParam(required = false) Status status) {
        if (status == null) return repo.findAllByOrderByCreatedAtDesc();
        return repo.findByStatusOrderByCreatedAtDesc(status);
    }

    @GetMapping("/{id}")
    public Complaint getOne(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Complaint create(@Valid @RequestBody Complaint complaint) {
        complaint.setId(null);
        complaint.setStatus(Status.OPEN);
        return repo.save(complaint);
    }

    @PutMapping("/{id}/status")
    public Complaint updateStatus(@PathVariable Long id, @RequestBody StatusUpdate body) {
        Complaint c = getOne(id);
        c.setStatus(body.status());
        return repo.save(c);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found");
        }
        repo.deleteById(id);
    }
}
