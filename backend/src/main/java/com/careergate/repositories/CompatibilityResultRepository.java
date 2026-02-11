package com.careergate.repositories;

import com.careergate.entities.CompatibilityResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompatibilityResultRepository extends JpaRepository<CompatibilityResult, UUID> {
    java.util.List<CompatibilityResult> findByUserIdAndJobId(UUID userId, UUID jobId);

    Optional<CompatibilityResult> findFirstByUserIdAndJobIdOrderByEvaluatedAtDesc(UUID userId, UUID jobId);

    @org.springframework.data.jpa.repository.Query("SELECT AVG(c.compatibilityScore) FROM CompatibilityResult c WHERE c.userId = :userId")
    Double findAverageCompatibilityScoreByUserId(UUID userId);

    @org.springframework.data.jpa.repository.Query("SELECT AVG(c.skillMatchScore) FROM CompatibilityResult c WHERE c.userId = :userId")
    Double findAverageSkillMatchScoreByUserId(UUID userId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT c.jobId) FROM CompatibilityResult c WHERE c.userId = :userId")
    Long countDistinctJobIdByUserId(UUID userId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT c.userId) FROM CompatibilityResult c WHERE c.jobId IN :jobIds")
    Long countDistinctUserIdByJobIdIn(java.util.List<UUID> jobIds);

    @org.springframework.data.jpa.repository.Query("SELECT AVG(c.skillMatchScore) FROM CompatibilityResult c WHERE c.jobId IN :jobIds")
    Double findAverageSkillMatchScoreByJobIdIn(java.util.List<UUID> jobIds);

    Long countByJobIdInAndCompatibilityScoreGreaterThanEqual(java.util.List<UUID> jobIds, Integer score);
}
