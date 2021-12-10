package com.midiavox.desafio.service;

import com.midiavox.desafio.Destination;
import java.util.List;
import java.util.Optional;

public interface IDestinationService {

    List<Destination> findAll();
    void delete(String id);
    Optional<Destination> find(String id);
    boolean exists(String id);
    Destination save(Destination dest);
    List<Destination> findByDest(String destination);
}
