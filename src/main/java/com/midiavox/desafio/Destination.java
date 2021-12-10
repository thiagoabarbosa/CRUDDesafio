package com.midiavox.desafio;

import java.util.Objects;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "tba_destination")
public class Destination {

    @Id
    private String dtn_id;
    
    private String dtn_destination;

    public Destination(){
    }

    public Destination(String dtn_id, String dtn_destination){
        this.dtn_id = dtn_id;
        this.dtn_destination = dtn_destination;
    }

    public String getDtn_id(){
        return dtn_id;
    }

    public String getDtn_destination(){
        return dtn_destination;
    }

    public void setDtn_id(String dtn_id){
        this.dtn_id = dtn_id;
    }

    public void setDtn_destination(String dtn_destination){
        this.dtn_destination = dtn_destination;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("tba_destination{");
        sb.append("dtn_id=").append(dtn_id);
        sb.append(", destination='").append(dtn_destination);
        sb.append('}');
        return sb.toString();
    }
}
