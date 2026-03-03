package com.taskmanager.controller;

import com.taskmanager.service.WebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final WebSocketService webSocketService;

    @MessageMapping("/tasks/ping")
    public void ping(Map<String, Object> payload) {
        webSocketService.sendTaskUpdate("PING", payload);
    }
}
