package edu.eci.arsw.collabpaint;

import edu.eci.arsw.collabpaint.model.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class PaintController {

    @Autowired
    SimpMessagingTemplate msgt;

    private ConcurrentHashMap<String, ArrayList<Point>> draws = new ConcurrentHashMap<>();

    @MessageMapping("/newpoint.{id}")
    public void greeting(Point pt, @DestinationVariable String id){
        System.out.println("Nuevo punto recibido en el servidor!: "+pt);
        msgt.convertAndSend("/topic/newpoint."+id,pt);

        ArrayList<Point> points = draws.computeIfAbsent(id, k -> new ArrayList<>());
        points.add(pt);
        if(points.size()>=4){
            msgt.convertAndSend("/topic/newpolygon."+id,points);
        }
    }

}