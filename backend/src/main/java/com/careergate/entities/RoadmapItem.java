package com.careergate.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "roadmap_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roadmap_id", nullable = false)
    private LearningRoadmap roadmap;

    @Column(name = "week_no", nullable = false)
    private Integer weekNo;

    @Column(name = "day_no", nullable = false)
    private Integer dayNo;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "youtube_video_id")
    private String youtubeVideoId;

    @Column(name = "youtube_search_query")
    private String youtubeSearchQuery;

    @Column(name = "article_links", columnDefinition = "TEXT")
    private String articleLinks; // Stored as JSON string

    @Builder.Default
    @Column(name = "completed")
    private Boolean completed = false;

    @Column(name = "course_link")
    private String courseLink; // Kept for backward compatibility
}
