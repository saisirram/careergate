package com.careergate.repositories;

import com.careergate.entities.JobRequiredSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobRequiredSkillRepository extends JpaRepository<JobRequiredSkill, UUID> {
    List<JobRequiredSkill> findByJobId(UUID jobId);

    @Modifying
    @Query("DELETE FROM JobRequiredSkill j WHERE j.job.id = :jobId")
    void deleteByJobId(UUID jobId);
}
