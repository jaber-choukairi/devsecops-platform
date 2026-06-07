package com.pfe.devsecops.controller;

import com.pfe.devsecops.entity.Ticket;
import com.pfe.devsecops.entity.TicketPriority;
import com.pfe.devsecops.entity.TicketStatus;
import com.pfe.devsecops.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tickets")

public class TicketController {

    private final TicketService ticketService;

    @Autowired
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // 10.1 Créer un ticket
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody Ticket ticket) {
        return ResponseEntity.ok(ticketService.createTicket(ticket));
    }

    // 10.2 Lister tous les tickets
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // 10.3 Afficher un ticket par ID
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable UUID id) {
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 10.4 Modifier un ticket
    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable UUID id, @Valid @RequestBody Ticket ticketDetails) {
        return ticketService.updateTicket(id, ticketDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 10.5 Changer le statut
    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateTicketStatus(@PathVariable UUID id, @RequestParam TicketStatus status) {
        return ticketService.updateTicketStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 10.6 Changer la priorité
    @PatchMapping("/{id}/priority")
    public ResponseEntity<Ticket> updateTicketPriority(@PathVariable UUID id, @RequestParam TicketPriority priority) {
        return ticketService.updateTicketPriority(id, priority)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 10.7 Filtrer par statut
    @GetMapping("/filter/status")
    public ResponseEntity<List<Ticket>> getTicketsByStatus(@RequestParam TicketStatus status) {
        return ResponseEntity.ok(ticketService.getTicketsByStatus(status));
    }

    // 10.8 Filtrer par priorité
    @GetMapping("/filter/priority")
    public ResponseEntity<List<Ticket>> getTicketsByPriority(@RequestParam TicketPriority priority) {
        return ResponseEntity.ok(ticketService.getTicketsByPriority(priority));
    }

    // 10.9 Rechercher par titre
    @GetMapping("/search")
    public ResponseEntity<List<Ticket>> searchTickets(@RequestParam String keyword) {
        return ResponseEntity.ok(ticketService.searchTickets(keyword));
    }

    // 10.10 Supprimer un ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable UUID id) {
        if (ticketService.deleteTicket(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}