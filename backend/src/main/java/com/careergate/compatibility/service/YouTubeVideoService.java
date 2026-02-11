package com.careergate.compatibility.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

/**
 * Service to provide verified, publicly available YouTube video IDs for common
 * tech topics.
 * These are curated, high-quality educational videos from popular channels.
 */
@Service
public class YouTubeVideoService {

    private static final Map<String, String> VERIFIED_VIDEOS = new HashMap<>();

    static {
        // Programming Languages
        VERIFIED_VIDEOS.put("python", "rfscVS0vtbw"); // Python Tutorial - freeCodeCamp
        VERIFIED_VIDEOS.put("java", "UmnCZ7-9yDY"); // Java Tutorial - Caleb Curry
        VERIFIED_VIDEOS.put("javascript", "W6NZfCO5SIk"); // JS Crash Course - Traversy
        VERIFIED_VIDEOS.put("typescript", "30LWjhZzg50"); // TS Full Course - freeCodeCamp
        VERIFIED_VIDEOS.put("go", "un6ZyFkqFKo"); // Go Tutorial - freeCodeCamp
        VERIFIED_VIDEOS.put("rust", "zF34dRivLOw"); // Rust Crash Course
        VERIFIED_VIDEOS.put("c++", "vLnPwxZdW4Y"); // C++ Tutorial

        // Web Development
        VERIFIED_VIDEOS.put("react", "bMknfKXLgFA"); // React Course - freeCodeCamp
        VERIFIED_VIDEOS.put("node", "Oe421EPjeBE"); // Node.js Tutorial
        VERIFIED_VIDEOS.put("angular", "3qBXWUpoPHo"); // Angular Tutorial
        VERIFIED_VIDEOS.put("vue", "FXpIoQ_rT_c"); // Vue.js Course
        VERIFIED_VIDEOS.put("html", "pQN-pnXPaVg"); // HTML Full Course
        VERIFIED_VIDEOS.put("css", "1Rs2ND1ryYc"); // CSS Tutorial

        // Databases
        VERIFIED_VIDEOS.put("sql", "HXV3zeQKqGY"); // SQL Tutorial
        VERIFIED_VIDEOS.put("postgresql", "qw--VwXb71Q"); // PostgreSQL Tutorial - freeCodeCamp
        VERIFIED_VIDEOS.put("mongodb", "c2M-rlkkT5o"); // MongoDB Crash Course
        VERIFIED_VIDEOS.put("mysql", "7S_tz1z_5bA"); // MySQL Tutorial

        // Frameworks & Tools
        VERIFIED_VIDEOS.put("spring", "9ptm2c5Fk5U"); // Spring Boot - Mosh
        VERIFIED_VIDEOS.put("spring boot", "9z_fS1jT77k"); // Spring Boot Full Course - Amigoscode
        VERIFIED_VIDEOS.put("docker", "pTJxdL_pIWM"); // Docker Tutorial - Mosh
        VERIFIED_VIDEOS.put("kubernetes", "X48VuDVv0do"); // Kubernetes Tutorial - TechWorld with Nana
        VERIFIED_VIDEOS.put("git", "RGOj5yH7evk"); // Git and GitHub
        VERIFIED_VIDEOS.put("aws", "f1c24P3bO2E"); // AWS Tutorial - freeCodeCamp
        VERIFIED_VIDEOS.put("system design", "ZgdS0EUasK0"); // System Design Concepts

        // Default
        VERIFIED_VIDEOS.put("default", "rfscVS0vtbw"); // Python Tutorial as default
    }

    /**
     * Get a verified YouTube video ID for a given topic.
     * Uses fuzzy matching to find the best match.
     */
    public String getVideoIdForTopic(String topic) {
        if (topic == null || topic.trim().isEmpty()) {
            return VERIFIED_VIDEOS.get("default");
        }

        String normalizedTopic = topic.toLowerCase().trim();

        // 1. Exact match (highest priority)
        if (VERIFIED_VIDEOS.containsKey(normalizedTopic)) {
            return VERIFIED_VIDEOS.get(normalizedTopic);
        }

        // 2. JavaScript specific check (priority over Java)
        if (normalizedTopic.contains("javascript") || normalizedTopic.contains(" js ")) {
            return VERIFIED_VIDEOS.get("javascript");
        }

        // 3. Word match behavior
        String[] words = normalizedTopic.split("[\\s\\-_]+");
        for (String word : words) {
            if (VERIFIED_VIDEOS.containsKey(word)) {
                return VERIFIED_VIDEOS.get(word);
            }
        }

        // 4. Fallback substring match (longer keys first)
        return VERIFIED_VIDEOS.entrySet().stream()
                .filter(e -> !e.getKey().equals("default"))
                .sorted((e1, e2) -> Integer.compare(e2.getKey().length(), e1.getKey().length()))
                .filter(e -> normalizedTopic.contains(e.getKey()))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse(VERIFIED_VIDEOS.get("default"));
    }

    /**
     * Check if a video ID is in our verified list
     */
    public boolean isVerifiedVideo(String videoId) {
        return VERIFIED_VIDEOS.containsValue(videoId);
    }
}
