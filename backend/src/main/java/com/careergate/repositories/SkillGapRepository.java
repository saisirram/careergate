package com.careergate.repositories;

import com.careergate.entities.SkillGap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SkillGapRepository extends JpaRepository<SkillGap, UUID> {
    List<SkillGap> findByCompatibilityId(UUID compatibilityId);
}
