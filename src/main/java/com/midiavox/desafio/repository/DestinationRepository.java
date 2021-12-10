package com.midiavox.desafio.repository;

import java.util.List;

import com.midiavox.desafio.Destination;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DestinationRepository extends CrudRepository<Destination, String> {

    @Query(
        value = "SELECT new com.midiavox.desafio.Destination(dtn_id,dtn_destination) FROM Destination WHERE dtn_destination = ?1"
    )
    List<Destination> findByDestination(String destination);
}