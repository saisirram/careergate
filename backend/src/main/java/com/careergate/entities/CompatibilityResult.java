package com.careergate.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "job_compatibility_result")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class CompatibilityResult {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToMany(mappedBy = "compatibility", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("compatibility")
    private List<SkillGap> gaps;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "job_id", nullable = false)
    private UUID jobId;

    @Column(name = "compatibility_score")
    private Integer compatibilityScore;

    @Column(name = "skill_match_score")
    private Integer skillMatchScore;

    @Column(name = "resume_match_score")
    private Integer resumeMatchScore;

    @Column(name = "experience_match_score")
    private Integer experienceMatchScore;

    @CreationTimestamp
    @Column(name = "evaluated_at", updatable = false)
    private LocalDateTime evaluatedAt;

    @Column(name = "ai_analysis_summary", columnDefinition = "TEXT")
    private String aiAnalysisSummary;
}
