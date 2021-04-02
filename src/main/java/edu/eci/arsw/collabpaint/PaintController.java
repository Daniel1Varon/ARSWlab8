package edu.eci.arsw.collabpaint;

import edu.eci.arsw.collabpaint.model.Point;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class PaintController {

    @MessageMapping("/newpoint.{id}")
    @SendTo("/topic/newpoint.{id}")
    public String greeting(Point pt, @DestinationVariable String id) throws Exception {
        System.out.println("Nuevo punto recibido.");
        Thread.sleep(1000); // simulated delay
        return ("Hello");
    }

}