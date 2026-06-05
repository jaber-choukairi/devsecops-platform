package com.pfe.devsecops.service;

import com.pfe.devsecops.entity.Ticket;
import com.pfe.devsecops.entity.TicketPriority;
import com.pfe.devsecops.entity.TicketStatus;
import com.pfe.devsecops.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    @Autowired
    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<Ticket> getTicketById(UUID id) {
        return ticketRepository.findById(id);
    }

    public Optional<Ticket> updateTicket(UUID id, Ticket ticketDetails) {
        return ticketRepository.findById(id).map(ticket -> {
            ticket.setTitle(ticketDetails.getTitle());
            ticket.setDescription(ticketDetails.getDescription());
            if (ticketDetails.getStatus() != null) ticket.setStatus(ticketDetails.getStatus());
            if (ticketDetails.getPriority() != null) ticket.setPriority(ticketDetails.getPriority());
            if (ticketDetails.getCategory() != null) ticket.setCategory(ticketDetails.getCategory());
            return ticketRepository.save(ticket);
        });
    }

    public Optional<Ticket> updateTicketStatus(UUID id, TicketStatus status) {
        return ticketRepository.findById(id).map(ticket -> {
            ticket.setStatus(status);
            return ticketRepository.save(ticket);
        });
    }

    public Optional<Ticket> updateTicketPriority(UUID id, TicketPriority priority) {
        return ticketRepository.findById(id).map(ticket -> {
            ticket.setPriority(priority);
            return ticketRepository.save(ticket);
        });
    }

    public List<Ticket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status);
    }

    // 10.8
public List<Ticket> getTicketsByPriority(TicketPriority priority) {
    return ticketRepository.findByPriority(priority);
}

// 10.9
public List<Ticket> searchTickets(String keyword) {
    return ticketRepository.findByTitleContainingIgnoreCase(keyword);
}

    public boolean deleteTicket(UUID id) {
        return ticketRepository.findById(id).map(ticket -> {
            ticketRepository.delete(ticket);
            return true;
        }).orElse(false);
    }
}