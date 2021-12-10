package com.midiavox.desafio;

import com.midiavox.desafio.service.IDestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/destination")
public class MyController {

    @Autowired
    private IDestinationService destinationService;

    @GetMapping()
    public List<Destination> getElements(@RequestParam(required=false) String id, @RequestParam(required=false) String destination, Model model) {
        List<Destination> destinations = new ArrayList<Destination>();
            if(id == ""){
                if(destination == ""){
                    destinations = (List<Destination>) destinationService.findAll();
                    model.addAttribute("destinations", destinations);
                }else if(destination != ""){
                    destinations = destinationService.findByDest(destination);
                }
            }else if(id != "" && destinationService.exists(id)){
                Optional<Destination> optDest = destinationService.find(id);
                Destination dest = optDest.get();
                if(destination == ""){
                    destinations.add(dest);
                }else if(destination != ""){
                    if(destination.equals(dest.getDtn_destination())){
                        destinations.add(dest);
                    }
                }
            }
            return destinations;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateElement(@PathVariable(value="id") String id, @RequestBody String destination){
        //JA EXISTE:
        if(destinationService.exists(id)){
            Optional<Destination> optDest = destinationService.find(id);
            Destination dest = optDest.get();
            dest.setDtn_destination(destination);
            destinationService.save(dest);
            return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
        }else{
            //NAO EXISTE:
            Destination dest = new Destination(id, destination);
            dest = destinationService.save(dest);
            return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteElement(@PathVariable(value="id") String id){
        //JA EXISTE:
        if(destinationService.exists(id)){
            Optional<Destination> optDest = destinationService.find(id);
            Destination dest = optDest.get();
            destinationService.delete(dest.getDtn_id());
        return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
        }else{
            //NAO EXISTE:
            return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
        }
    }
    
}
