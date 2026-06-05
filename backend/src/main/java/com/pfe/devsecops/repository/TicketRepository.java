package com.pfe.devsecops.repository;

import com.pfe.devsecops.entity.Ticket;
import com.pfe.devsecops.entity.TicketPriority;
import com.pfe.devsecops.entity.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, UUID> {

    List<Ticket> findByStatus(TicketStatus status);
    List<Ticket> findByPriority(TicketPriority priority);
    List<Ticket> findByTitleContainingIgnoreCase(String keyword);
}