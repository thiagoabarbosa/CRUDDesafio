package com.midiavox.desafio.service;

import com.midiavox.desafio.Destination;
import com.midiavox.desafio.repository.DestinationRepository;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DestinationService implements IDestinationService{

    @Autowired
    private DestinationRepository repository;

    @Override
    public List<Destination> findByDest(String destination){
        return repository.findByDestination(destination);
    }

    @Override
    public List<Destination> findAll(){
        var destinations = (List<Destination> ) repository.findAll();
        return destinations;
    }

    @Override
    public void delete(String id){
        repository.deleteById(id);
    }

    @Override
    public Optional<Destination> find(String id){
        Optional<Destination> dest = repository.findById(id);
        return dest;
    }

    @Override
    public boolean exists(String id){
        return repository.existsById(id);
    }

    @Override
    public Destination save(Destination dest){
        return repository.save(dest);
    }
    
}
