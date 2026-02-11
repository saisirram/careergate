package com.careergate.repositories;

import com.careergate.entities.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {
    List<JobApplication> findByCandidateIdOrderByAppliedAtDesc(UUID candidateId);

    List<JobApplication> findByJobIdOrderByAppliedAtDesc(UUID jobId);

    Optional<JobApplication> findByCandidateIdAndJobId(UUID candidateId, UUID jobId);
}
