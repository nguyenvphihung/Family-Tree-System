package com.familytree.system.repository;

import com.familytree.system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Có thể bổ sung các phương thức truy vấn tuỳ chỉnh ở đây
}