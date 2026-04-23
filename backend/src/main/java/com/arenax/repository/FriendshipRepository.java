package com.arenax.repository;

import com.arenax.entity.Friendship;
import com.arenax.enums.FriendshipStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("""
            select f from Friendship f
            join fetch f.requester
            join fetch f.addressee
            where f.requester.id = :playerId or f.addressee.id = :playerId
            order by f.createdAt desc
            """)
    List<Friendship> findAllForPlayer(@Param("playerId") Long playerId);

    @Query("""
            select count(f) from Friendship f
            where (f.requester.id = :playerId or f.addressee.id = :playerId)
            and f.status = :status
            """)
    long countByPlayerIdAndStatus(@Param("playerId") Long playerId, @Param("status") FriendshipStatus status);

    @Query("""
            select
                case when count(f) > 0 then true else false end
            from Friendship f
            where (f.requester.id = :playerA and f.addressee.id = :playerB)
               or (f.requester.id = :playerB and f.addressee.id = :playerA)
            """)
    boolean existsRelationship(@Param("playerA") Long playerA, @Param("playerB") Long playerB);

    Optional<Friendship> findByIdAndAddressee_Id(Long friendshipId, Long addresseeId);
}

