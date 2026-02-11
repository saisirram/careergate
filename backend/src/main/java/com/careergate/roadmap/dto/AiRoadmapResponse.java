package com.careergate.roadmap.dto;

import lombok.Data;
import java.util.List;

@Data
public class AiRoadmapResponse {
    private List<Week> weeks;

    @Data
    public static class Week {
        private int weekNo;
        private List<Day> days;
    }

    @Data
    public static class Day {
        private int dayNo;
        private String title;
        private String description;
        private String youtubeVideoId;
        private String youtubeSearchQuery;
        private List<String> articleLinks;
    }
}
