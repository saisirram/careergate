package com.careergate.repositories;

import com.careergate.entities.LearningRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LearningRoadmapRepository extends JpaRepository<LearningRoadmap, UUID> {
    java.util.List<LearningRoadmap> findByUserIdAndJobId(UUID userId, UUID jobId);

    java.util.List<LearningRoadmap> findByUserId(UUID userId);

    Optional<LearningRoadmap> findFirstByUserIdAndJobIdOrderByCreatedAtDesc(UUID userId, UUID jobId);
}
