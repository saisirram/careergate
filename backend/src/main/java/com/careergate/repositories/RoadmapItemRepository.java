package com.careergate.repositories;

import com.careergate.entities.RoadmapItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoadmapItemRepository extends JpaRepository<RoadmapItem, UUID> {
    List<RoadmapItem> findByRoadmapIdOrderByWeekNoAscDayNoAsc(UUID roadmapId);

    void deleteByRoadmapId(UUID roadmapId);
}
