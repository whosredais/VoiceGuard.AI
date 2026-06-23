package com.pfa.deepfake_backend.repository;

import com.pfa.deepfake_backend.entity.AudioHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AudioHistoryRepository extends JpaRepository<AudioHistory, Long> {
}