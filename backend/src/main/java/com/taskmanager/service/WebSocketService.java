package com.taskmanager.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendTaskUpdate(String type, Object payload) {
        messagingTemplate.convertAndSend("/topic/tasks", Map.of(
                "type", type,
                "payload", payload,
                "timestamp", Instant.now().toString()
        ));
    }
}
