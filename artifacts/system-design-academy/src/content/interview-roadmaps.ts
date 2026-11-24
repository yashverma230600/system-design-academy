export type InterviewQuestion = { id: string; title: string; points: [string, string, string, string] };
export type InterviewTopic = { title: string; questions: InterviewQuestion[] };
export type InterviewGuide = { title: string; description: string; note: string; topics: InterviewTopic[]; references: { title: string; href: string }[] };

export const kafkaGuide: InterviewGuide = {
  title: 'Kafka',
  description: 'Architecture, consumer coordination, durability, and processing guarantees.',
  note: 'These answers describe conventional consumer groups and the Kafka 4.x KRaft architecture. Features and defaults can vary by version and provider.',
  topics: [
    { title: 'Architecture and partitioning', questions: [
      { id: 'K01', title: 'What is Kafka and how do its components work together?', points: [
        'Kafka is a distributed, durable event log. Producers append records; consumers pull and replay them independently, making it useful for event pipelines, service integration, and change-data capture.',
        'Brokers store partition replicas and serve client requests. Topics organize records; partitions distribute storage and traffic. Clients discover partition leaders through metadata rather than sending everything through one gateway.',
        'A controller manages cluster metadata and partition leadership. KRaft controllers replicate metadata through a Raft quorum; this control plane is separate from the broker data plane.',
        'Kafka Connect integrates external systems; Kafka Streams processes streams in applications. Retention lets multiple downstream services reread data without removing records when another service consumes them.',
      ] },
      { id: 'K02', title: 'How do topics and partitions determine parallelism?', points: [
        'A topic is split into partitions, each with its own ordered log. Partitions distribute storage and traffic across brokers and provide the unit of parallel work for conventional consumer groups.',
        'Within one conventional consumer group, a partition is assigned to one consumer at a time. A consumer can own several partitions; members beyond the partition count are idle.',
        'More partitions can increase useful parallelism, but also increase metadata, replication, file, and rebalance overhead. Size them from peak throughput, processing time, and recovery headroom rather than consumer count alone.',
        'A hot key can overload one partition even when other consumers are idle. Increasing partitions can change key routing and ordering; measure skew and plan key or partition migrations carefully.',
      ] },
      { id: 'K03', title: 'How do you choose a partition key and preserve ordering?', points: [
        'Kafka orders records within one partition, not across a whole topic. Use a stable business key such as orderId when all events for that entity must share an ordered log.',
        'Key-based routing usually hashes the serialized key. Null-key routing is client-specific and may use sticky batching; it is not necessarily round-robin for every record.',
        'Changing partition counts, serialization, or the partitioner can move a key to a different partition. Plan migrations when ordering must span old and new records.',
        'Broker log order does not guarantee completion order in an asynchronous worker pool. Serialize processing per key or partition, and use producer idempotence to protect retry ordering.',
      ] },
      { id: 'K04', title: 'What are offsets, consumer positions, and committed offsets?', points: [
        'An offset identifies a position in a partition log. The consumer position tracks its next fetch/read position; a committed offset is the recovery checkpoint for a group.',
        'Commit the next record to process: after successfully handling offset 42, commit 43. With parallel workers, commit only past a contiguous range of completed records.',
        'Group checkpoints are stored in the internal __consumer_offsets topic. Committing does not delete records; retention and compaction determine storage lifecycle.',
        'auto.offset.reset applies when no valid checkpoint exists, not on every restart. A checkpoint outside retention may require earliest, latest, or an explicit failure policy.',
      ] },
    ] },
    { title: 'Consumer coordination', questions: [
      { id: 'K05', title: 'How do consumer groups provide load balancing and fan-out?', points: [
        'Consumers with the same group.id divide subscribed partitions. In the conventional group model, each partition is assigned to one group member at a time.',
        'Different groups maintain independent offsets and each receive the stream. Use separate groups for billing, analytics, and fraud detection rather than sharing one group.',
        'A group coordinator manages membership and checkpoints. Consumers fetch directly from partition-serving brokers; the coordinator is not a message-forwarding proxy.',
        'Extra members beyond available partitions are idle. This answer describes conventional consumer groups; newer share-group queue semantics are a distinct model with different acknowledgment and assignment rules.',
      ] },
      { id: 'K06', title: 'What causes rebalancing and how can you reduce disruption?', points: [
        'Membership changes, subscription changes, new partitions, and failure detection can trigger reassignment. Slow processing that exceeds max.poll.interval.ms can make a member lose ownership.',
        'Classic eager assignment revokes all assignments; cooperative assignment can move only affected partitions. The newer consumer protocol supports broker-driven incremental coordination when enabled and supported.',
        'On revocation, stop or drain affected work and checkpoint only completed records. A rebalance can replay uncommitted work, so external effects should tolerate duplicates.',
        'Static membership with group.instance.id can reduce restart churn. Bound work per poll, tune max.poll.records and poll intervals, and use pause/resume for backpressure while continuing required polling.',
      ] },
      { id: 'K07', title: 'When should a consumer commit offsets?', points: [
        'Committing before processing risks losing work after a crash; processing before committing risks replay. Most business workflows choose the latter and make effects idempotent.',
        'Automatic periodic commits do not know whether asynchronous business work finished. Use explicit commits when processing and fetch progress can diverge.',
        'commitSync waits for the outcome and can add latency; commitAsync avoids blocking but requires error handling. Never let a retry of an older checkpoint move progress backward.',
        'For Kafka-to-database work, store an event ID or topic-partition-offset with the business update in one database transaction. Duplicate delivery then becomes a no-op rather than a second charge.',
      ] },
      { id: 'K08', title: 'How do you diagnose consumer lag?', points: [
        'Lag is commonly the log end offset minus the committed offset, measured per partition. It reflects recovery progress; fetched position and completed business work may tell different stories.',
        'Compare arrival rate, processing rate, and oldest-event age. One lagging partition suggests skew or a hot key; uniform growth suggests insufficient processing or a slow downstream dependency.',
        'Inspect poll/processing latency, rebalance frequency, errors, GC, broker request latency, and network or disk pressure. read_committed consumers can also wait behind an open transaction.',
        'Use kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group orders to inspect checkpoints. Add workers only when partitions and downstream capacity allow useful parallelism.',
      ] },
    ] },
    { title: 'Replication and durability', questions: [
      { id: 'K09', title: 'How do leaders, followers, and replication work?', points: [
        'Each partition has one leader and zero or more followers. The leader accepts writes; followers fetch and copy its log. Replication factor counts all replicas, including the leader.',
        'Replication factor 3 means three copies on distinct brokers, not three partitions. Rack awareness can spread replicas across failure domains and reduce correlated outage risk.',
        'Normal reads use leaders; configured follower fetching can reduce locality costs. Followers still need to respect the partition replication and visibility rules.',
        'After leader failure, the controller selects an eligible replacement. Replication provides availability and durability, but is not a backup against accidental deletion or bad application writes.',
      ] },
      { id: 'K10', title: 'What is the ISR and why does it matter?', points: [
        'The in-sync replica set contains replicas that satisfy Kafka\'s catch-up criteria; it includes the leader. Lagging or failed replicas can leave it and rejoin after catching up.',
        'With acks=all, acknowledgments depend on the current ISR, not every assigned replica. min.insync.replicas rejects writes when too few in-sync replicas remain.',
        'A common starting point is replication factor 3, min.insync.replicas=2, and acks=all. One replica outage can preserve writes; a further ISR drop trades write availability for durability.',
        'Monitor ISR shrink events, under-replicated partitions, and unavailable partitions. Modern eligible-leader-replica behavior is version/configuration dependent; avoid equating all out-of-ISR elections with the legacy unclean path.',
      ] },
      { id: 'K11', title: 'What do acks=0, acks=1, and acks=all guarantee?', points: [
        'acks=0 does not wait for a broker response, so the producer cannot confirm acceptance. It favors low waiting time while making delivery failures difficult to detect.',
        'acks=1 waits for the leader\'s append. If the leader fails before replication, an acknowledged record can disappear after failover.',
        'acks=all waits for the required in-sync replication and works with min.insync.replicas. It does not mean every configured replica is healthy or that every acknowledgment includes a physical disk fsync.',
        'Durability also depends on replica placement, retries, timeouts, and failure scope. Explain the chosen failure model rather than claiming any configuration can survive arbitrary simultaneous disk loss.',
      ] },
      { id: 'K12', title: 'What happens during leader failure and how can data be lost?', points: [
        'Clients refresh metadata and retry when a leader becomes unavailable. Election and replica catch-up can cause a temporary interruption; timeouts do not prove a write never succeeded.',
        'A clean replacement preserves committed history under the supported failure assumptions. Legacy unclean election can promote a stale replica and truncate acknowledged history.',
        'Disabling unsafe recovery paths can leave a partition unavailable when no suitable replica remains. This is an explicit availability-versus-data-loss decision.',
        'Test broker and failure-domain outages. Alert on offline partitions and replica health, verify restoration procedures, and consider independent backups or replication to another cluster for disaster recovery.',
      ] },
    ] },
    { title: 'Processing guarantees', questions: [
      { id: 'K13', title: 'What are at-most-once, at-least-once, and exactly-once semantics?', points: [
        'At-most-once accepts loss to avoid reprocessing, often by checkpointing before work. At-least-once checkpoints after successful work, so failures can replay records.',
        'Producer retries can duplicate appends unless idempotence is active. Consumer replays can duplicate business effects even when each record was appended only once.',
        'Kafka exactly-once processing can atomically couple Kafka output records and input offsets. Consumers must use read_committed to avoid observing aborted transactional output.',
        'This guarantee does not automatically cover HTTP calls, emails, or database writes. Use idempotency keys, coordinated sink transactions, or an outbox/inbox pattern for external effects.',
      ] },
      { id: 'K14', title: 'How does an idempotent producer prevent duplicates?', points: [
        'Kafka assigns a producer identity and tracks sequence numbers per partition. Re-sending the same producer batch can be recognized rather than appended again.',
        'Enable idempotence and satisfy its constraints: acks=all, retries enabled, and max.in.flight.requests.per.connection within the supported limit, currently at most 5 for the standard producer.',
        'Idempotence preserves ordering with supported in-flight settings. Without it, multiple outstanding requests and retries can cause later batches to arrive before a failed earlier batch.',
        'It deduplicates protocol retries, not repeated business events sent as fresh records or arbitrary application restarts. A transaction identity enables additional fencing, but does not remove the need for business-level deduplication.',
      ] },
      { id: 'K15', title: 'How do Kafka transactions support exactly-once processing?', points: [
        'Configure a stable transactional.id for each logical producer instance and initialize transactions. A producer epoch fences obsolete instances that try to continue writing.',
        'Begin a transaction, produce output, include consumed offsets with sendOffsetsToTransaction using group metadata, and commit. Multiple Kafka partitions can participate atomically.',
        'On failure, abort when appropriate and restore consumer processing to the correct checkpoint; aborting the producer transaction does not automatically rewind the consumer position.',
        'Use read_committed downstream. It hides aborted transactional records and stops visibility at unresolved transactions; long transactions can increase latency and apparent lag.',
      ] },
      { id: 'K16', title: 'How would you build a reliable Kafka-to-database workflow?', points: [
        'Use at-least-once consumption with a durable event identity. Within one database transaction, record the identity and apply the business mutation, then commit the Kafka checkpoint.',
        'If the process crashes after the database commit but before the offset commit, replay encounters the identity and skips the duplicate mutation. A uniqueness constraint makes concurrent retries safe.',
        'For database-to-Kafka publication, write business state and an outbox row together, then publish through CDC or a relay. Consumers still need to handle relay duplicates.',
        'Bound retries and define poison-record handling, such as a dead-letter topic with failure metadata. Preserve per-key ordering when moving failed records aside; a retry topic can let later events overtake them.',
      ] },
    ] },
    { title: 'Storage and scaling', questions: [
      { id: 'K17', title: 'Why is Kafka fast and what does zero-copy mean?', points: [
        'Sequential append and batch reads avoid many random I/O operations. The operating system page cache can serve recently written records without repeated disk reads.',
        'On supported plaintext paths, sendfile-style transfers move file data toward sockets without copying it through a broker user-space buffer. "Zero-copy" describes reduced copies, not zero work.',
        'TLS encryption and format conversion can prevent this exact transfer path. CPU, network, cache misses, and storage still impose limits.',
        'Segmented logs and sparse indexes support offset lookup and cleanup. Benchmark with realistic record sizes, retention, compression, acknowledgment settings, and consumer fan-out rather than only message counts.',
      ] },
      { id: 'K18', title: 'How do batching and compression affect performance?', points: [
        'Producers batch records per partition. batch.size caps a batch\'s target size; linger.ms allows a short wait for more records, exchanging some latency for throughput.',
        'Compression applies to batches, so similar records usually compress better together. LZ4 often favors speed; Zstandard often offers stronger compression with a tunable CPU tradeoff.',
        'Large batches reduce request overhead but consume buffer space and can increase tail latency. Align producer, broker, and consumer record-size limits before increasing payload sizes.',
        'Tune delivery.timeout.ms, request timeouts, buffer.memory, and backpressure together. Measure p95/p99 latency, CPU, request size, and bandwidth; no batch or codec choice is universally best.',
      ] },
      { id: 'K19', title: 'How do retention and log compaction differ?', points: [
        'Delete retention removes old log segments based on time or size, independently of consumer progress. A slow consumer can lose access to data it has not processed.',
        'Compaction eventually keeps the latest retained value for each key. It is useful for state reconstruction, but is asynchronous and does not promise one immediately visible record per key.',
        'A keyed null value is a tombstone. Cleaner timing and delete.retention.ms affect how long consumers can observe deletion markers; full-state rebuilds must finish within the required window.',
        'Compaction preserves surviving records\' order and offsets, leaving gaps. cleanup.policy can combine compact and delete; size/time deletion can then remove history that compaction alone might retain.',
      ] },
      { id: 'K20', title: 'How do KRaft and cluster scaling change system design?', points: [
        'ZooKeeper historically coordinated Kafka metadata and controller election. KRaft uses Kafka\'s own Raft metadata quorum; Kafka 4.0 and later run without ZooKeeper.',
        'Controller quorum sizing targets metadata availability, not message throughput. Three controllers tolerate one controller failure; separate controller and broker roles are a common production design.',
        'Add brokers and explicitly redistribute partitions to spread disk, network, and leader load. Adding brokers alone does not automatically rebalance every existing partition.',
        'Size partitions and retention from peak rates, compression, replication factor, and recovery headroom. Measure skew and reassignment traffic; increasing consumers cannot solve a single hot partition.',
      ] },
    ] },
  ],
  references: [
    { title: 'Kafka architecture and log design', href: 'https://kafka.apache.org/40/documentation/#design' },
    { title: 'Kafka producer configuration', href: 'https://kafka.apache.org/40/configuration/producer-configs/' },
    { title: 'Kafka consumer configuration', href: 'https://kafka.apache.org/40/configuration/consumer-configs/' },
    { title: 'Kafka consumer rebalance protocol', href: 'https://kafka.apache.org/40/documentation/#consumerconfigs_group.protocol' },
    { title: 'Kafka KRaft and ZooKeeper comparison', href: 'https://kafka.apache.org/40/documentation/zk2kraft/' },
    { title: 'Kafka KRaft operations', href: 'https://kafka.apache.org/40/operations/kraft/' },
    { title: 'Kafka monitoring', href: 'https://kafka.apache.org/40/operations/monitoring/' },
  ],
};

export const redisGuide: InterviewGuide = {
  title: 'Redis',
  description: 'Persistence, memory, caching, distribution, and production tradeoffs.',
  note: 'These answers focus on standard primary/replica and Cluster deployments. Features and defaults can vary by version and provider.',
  topics: [
    { title: 'Fundamentals and persistence', questions: [
      { id: 'R01', title: 'What is Redis and why is it fast?', points: [
        'Redis serves an in-memory dataset through a network protocol and supports atomic commands on rich data types. Common uses include caching, counters, sessions, coordination, and stream processing.',
        'Core command execution is largely serialized, while networking and background persistence can use additional threads or processes. "Single-threaded" is an incomplete description of the whole server.',
        'Fast operations avoid disk reads on the normal request path, but complex commands, large replies, and long scripts can block other clients and increase tail latency.',
        'Choose Redis when latency and access patterns justify memory cost. Persistence and replicas improve resilience, but durability and consistency depend on configuration and failure behavior.',
      ] },
      { id: 'R02', title: 'Which Redis data structures fit common backend problems?', points: [
        'Strings hold cached values or counters with GET, SET, and INCR. Hashes model field-based objects and avoid replacing an entire serialized document for every field update.',
        'Lists support ordered push/pop workloads; sets provide uniqueness and membership. Sorted sets associate scores with members for leaderboards, scheduling, or rolling-time queries.',
        'Streams retain events and support consumer groups. Bitmaps efficiently represent boolean flags; HyperLogLog estimates distinct counts with bounded storage rather than exact membership.',
        'Match commands to complexity: a sorted-set insert is generally O(log N), while a full collection read scales with its contents. Use bounded range reads instead of returning an entire large object.',
      ] },
      { id: 'R03', title: 'How do RDB snapshots and AOF persistence compare?', points: [
        'RDB stores point-in-time snapshots. It supports compact backups and relatively fast loading, but a crash can lose writes since the most recent completed snapshot.',
        'AOF logs write operations. With appendfsync everysec, crash loss is commonly around a second; always requests stronger durability at a performance cost, while no delegates flushing to the OS.',
        'Background snapshotting and AOF rewriting can fork and incur copy-on-write memory pressure. Budget RAM and disk headroom and test latency during these operations.',
        'RDB and AOF can be enabled together; when both are available, recovery normally favors AOF as the more complete history. Persistence is not a backup strategy: test restore and keep independent copies.',
      ] },
      { id: 'R04', title: 'How do TTL and expiration work?', points: [
        'EXPIRE sets seconds; PEXPIRE sets milliseconds. SET session:123 payload EX 900 writes a value and expiry atomically, avoiding a gap between SET and EXPIRE.',
        'Expiration combines checks on access with active background sampling. It is not a precise scheduler or a guarantee that an expiration event arrives exactly at the deadline.',
        'TTL returns remaining seconds, -1 for a key without expiry, and -2 for a missing key. Ordinary SET replaces the old TTL unless options such as KEEPTTL preserve it.',
        'Use jitter to avoid many cache entries expiring together. TTL limits stale-data lifetime and memory use; it does not solve invalidation races or make cache data transactionally consistent.',
      ] },
    ] },
    { title: 'Memory and caching', questions: [
      { id: 'R05', title: 'What happens at maxmemory and how do eviction policies differ?', points: [
        'maxmemory controls Redis\'s configured memory limit; eviction removes keys under pressure. Leave process headroom for fragmentation, client buffers, replication, and persistence overhead.',
        'allkeys-lru and allkeys-lfu choose candidates across all keys using approximate recency or frequency. allkeys-random is simpler; volatile policies restrict candidates to expiring keys.',
        'volatile-ttl favors keys nearer expiry. With noeviction, commands that need additional memory can fail; it does not mean Redis silently drops every incoming request.',
        'Use an allkeys policy for a disposable cache and deliberate noeviction/capacity controls for important state. Monitor evicted_keys, rejected writes, hit rate, and actual process memory.',
      ] },
      { id: 'R06', title: 'How do cache-aside, write-through, and write-behind compare?', points: [
        'Cache-aside reads Redis first, loads misses from the database, then populates the cache. It is simple, but misses add latency and concurrent misses can cause a stampede.',
        'Write-through synchronously updates a cache layer and its backing store. Success ordering and failure handling still need design; two independent writes are not automatically atomic.',
        'Write-behind updates the cache and persists later. It can absorb bursts but risks lost or reordered writes; use a durable queue, idempotent writes, and a defined recovery strategy.',
        'For cache-aside updates, commit the database change then invalidate the cache. Concurrent stale fills remain possible; versioned entries, coordinated invalidation, or CDC can tighten freshness guarantees.',
      ] },
      { id: 'R07', title: 'How do you prevent cache stampedes, penetration, and stale data?', points: [
        'For stampedes, combine randomized TTLs with request coalescing or single-flight loading per key. A bounded lease can select one refresher while others wait or serve allowed stale data.',
        'For penetration from repeated absent keys, cache negative results briefly or use a probabilistic membership filter. Validate input and account for false positives and newly created records.',
        'For large cache outages, protect the database with concurrency limits, backpressure, and graceful degradation. A miss is not permission to send unlimited requests downstream.',
        'For freshness, define an acceptable staleness window and use invalidation or version checks. Avoid treating delayed double-deletion as a universal guarantee against read/write races.',
      ] },
      { id: 'R08', title: 'How do you optimize Redis memory usage?', points: [
        'Measure used_memory, RSS, fragmentation, and MEMORY USAGE key. Compact encodings for small hashes, sets, or sorted sets can reduce overhead; thresholds depend on Redis version.',
        'Choose compact representations and avoid excessive per-key overhead. Packing related fields into hashes can help, but creating huge objects increases operational risk.',
        'Serialize efficiently and compress larger values only when CPU and latency costs are acceptable. Redis does not automatically compress all cached payloads.',
        'Set lifetimes and capacity budgets, inspect samples rather than dumping the whole dataset, and account for copy-on-write peaks during persistence. Memory reclaimed logically may not immediately return to the OS.',
      ] },
    ] },
    { title: 'Availability and distribution', questions: [
      { id: 'R09', title: 'How does Redis replication work?', points: [
        'A primary sends its mutation stream to replicas, normally asynchronously. Replication IDs and offsets allow partial resynchronization when the required backlog is still available.',
        'When partial resynchronization is impossible, a full synchronization transfers a snapshot and subsequent changes. Snapshot generation, transfer, and catch-up can consume significant resources.',
        'Replicas can serve reads to increase read capacity, but those reads may be stale. Read-after-write behavior requires routing and consistency decisions in the application.',
        'WAIT can request acknowledgments from replicas after preceding writes. It reduces some loss windows but does not turn Redis failover into a strongly consistent consensus protocol.',
      ] },
      { id: 'R10', title: 'What does Redis Sentinel provide?', points: [
        'Sentinel monitors a primary/replica deployment, detects failures, elects a failover coordinator, promotes a replica, and helps clients discover the current primary.',
        'A configured quorum supports objective-down detection; failover authorization also needs a majority of Sentinels. These are related but distinct requirements.',
        'Use at least three Sentinels across independent failure domains and Sentinel-aware clients. Clients must rediscover topology and recover connections during promotion.',
        'Sentinel provides high availability, not sharding or zero-data-loss replication. A network partition can leave an old primary reachable; replication constraints and client behavior reduce, but do not eliminate, split-brain risks.',
      ] },
      { id: 'R11', title: 'How does Redis Cluster shard data?', points: [
        'Redis Cluster maps keys into 16,384 hash slots using CRC16(key) modulo 16384. Primary nodes own slot ranges, and replicas support failover for those primaries.',
        'Cluster-aware clients route requests using slot metadata. MOVED redirects update ownership knowledge; ASK handles a temporary migration redirect and requires the ASKING protocol step.',
        'Resharding moves slots and their keys between nodes. Adding a node does not make every hot key faster; one key remains assigned to one slot and primary.',
        'Cluster uses distributed topology and failure detection rather than Sentinel for its own failover. Asynchronous replication still permits acknowledged-write loss under some failure scenarios.',
      ] },
      { id: 'R12', title: 'What are hash tags and multi-key restrictions in Cluster?', points: [
        'Most multi-key commands, transactions, and scripts require involved keys to share a slot. Two keys on the same physical node can still fail if their slots differ.',
        'A nonempty brace-delimited hash tag controls slot hashing. cart:{u42}:items and cart:{u42}:total colocate by hashing u42 rather than the complete key.',
        'Colocation enables atomic per-entity workflows but can concentrate load. Do not place an entire tenant or service into one hash tag without evaluating its traffic.',
        'Cross-slot operations need application coordination or a redesigned data model; pipelines can be split by a cluster client, but that does not create cross-shard atomicity.',
      ] },
    ] },
    { title: 'Atomicity and messaging', questions: [
      { id: 'R13', title: 'What guarantees do MULTI, EXEC, and WATCH provide?', points: [
        'MULTI queues commands; EXEC runs the queued sequence without interleaving commands from other clients. DISCARD abandons it before execution.',
        'WATCH enables optimistic concurrency: if a watched key changes before EXEC, execution is aborted and the client can retry. Keep retries bounded and use a dedicated connection.',
        'Queue-time errors can invalidate a transaction; runtime command errors do not roll back earlier successful commands, and later queued commands can still execute.',
        'This is not SQL-style rollback or arbitrary cross-shard atomicity. In Cluster, all transaction keys must share a slot; use WATCH for a read-modify-write loop when a single native command is insufficient.',
      ] },
      { id: 'R14', title: 'When should you use Lua scripting?', points: [
        'A script executes on the server atomically with respect to other commands. It can combine dependent reads, validation, and writes without multiple client round trips.',
        'Use EVAL or cached EVALSHA execution; handle NOSCRIPT when a cached script is unavailable. Redis Functions offer another server-side code option with different deployment behavior.',
        'Pass accessed key names explicitly and validate before writes. Atomic execution is not rollback: writes performed before a runtime error can remain applied.',
        'Keep scripts bounded because long execution blocks other command work. In Cluster, script keys must be in the same slot; scripts cannot safely act as unrestricted cross-shard coordinators.',
      ] },
      { id: 'R15', title: 'How do Redis locks work and what are Redlock\'s caveats?', points: [
        'Acquire a lease with SET lock:job unique-token NX PX 30000. Release only if the stored token matches, using an atomic compare-and-delete script rather than unconditional DEL.',
        'A lease can expire while its holder is paused; that holder may resume after another client acquired the lock. Use fencing tokens checked by the protected resource for correctness-critical mutations.',
        'Primary/replica failover can lose an unreplicated lock and permit two holders. Redlock instead attempts a timely majority across independent Redis instances and accounts for remaining lease validity.',
        'Redlock safety depends on timing, bounded drift, and failure assumptions; it is not unconditional mutual exclusion under arbitrary pauses and partitions. Prefer a suitable consensus-based coordinator when correctness requires stronger guarantees.',
      ] },
      { id: 'R16', title: 'When should you use Pub/Sub versus Streams?', points: [
        'Pub/Sub delivers transient broadcasts to connected subscribers with at-most-once delivery. There is no retained history or acknowledgment/replay path for a disconnected subscriber.',
        'Streams retain entries with IDs. XADD appends, XREAD reads history, and consumer groups use XREADGROUP to distribute delivery and track pending entries.',
        'XACK removes an entry from the group\'s pending list; it does not delete the stream record. Use pending inspection and claiming, such as XAUTOCLAIM, to recover abandoned work.',
        'Stream consumers can process duplicates, so make effects idempotent. Configure persistence, replication, trimming, and retention; a retained stream is not automatically lossless or an unlimited queue.',
      ] },
    ] },
    { title: 'Performance and production design', questions: [
      { id: 'R17', title: 'How do pipelining and batching improve performance?', points: [
        'Pipelining sends multiple commands without waiting for each response, reducing round-trip and socket overhead. It helps most when network latency dominates simple operations.',
        'It preserves command/reply sequencing on a connection, but does not prevent other clients from interleaving work. Use transactions or scripts when atomicity is required.',
        'Bound pipeline size because queued requests and replies consume memory and large batches can hurt fairness. Use MGET or suitable collection commands when they better express the operation.',
        'Dependent operations cannot generally use a reply that has not arrived. In Cluster, clients may group requests by node; failures can leave partial outcomes that must be reconciled before retrying non-idempotent commands.',
      ] },
      { id: 'R18', title: 'How do you detect and mitigate hot keys and big keys?', points: [
        'A hot key receives disproportionate traffic; a big key holds a large value or collection. One can exist without the other, and they require different remedies.',
        'For hot reads, consider local caching, request coalescing, or replicated cache entries. For hot writes, shard counters or redesign access while explaining how aggregation affects consistency.',
        'For big keys, bound object size, split collections, paginate reads, and consider UNLINK for asynchronous memory reclamation. Avoid giant replies such as HGETALL on an unbounded hash.',
        'Use latency metrics, sampled key-size analysis, and supported redis-cli scanning tools. Prefer SCAN to KEYS in production, while remembering SCAN is incremental, may return duplicates, and is not a snapshot.',
      ] },
      { id: 'R19', title: 'How would you implement a rate limiter with Redis?', points: [
        'A fixed-window limiter counts requests per subject and window. INCR plus expiry must be coordinated atomically, for example in a short script that sets TTL when creating the counter.',
        'Fixed windows can admit bursts at boundaries. A sliding-window log uses a sorted set of uniquely identified requests, prunes old entries, counts survivors, and conditionally inserts.',
        'A token bucket stores tokens and last-refill time, computes refill and admission atomically, and supports controlled bursts. Keep related keys in one Cluster slot and expire idle state.',
        'Choose server/client time behavior, quota scope, and fail-open versus fail-closed policy explicitly. A timeout may mean a request was already counted; retries and failover can affect strict enforcement.',
      ] },
      { id: 'R20', title: 'What production pitfalls affect consistency, failover, and latency?', points: [
        'An acknowledged write can be lost if a primary fails before replication. Replica reads can be stale; WAIT and write-admission constraints reduce risk without guaranteeing linearizability.',
        'Monitor latency percentiles, SLOWLOG, memory/RSS, evictions, connections, replication lag, and persistence health. SLOWLOG measures command execution and does not capture all client or network waiting.',
        'Avoid blocking commands, unbounded scripts/replies, mass synchronized expiry, and excessive connections. Bound retries with backoff and jitter to prevent a failover from becoming a retry storm.',
        'Test restore and failover, protect access with ACLs and appropriate network/TLS controls, and keep durable business truth in a store whose guarantees meet the requirement. Redis availability is not proof of data correctness.',
      ] },
    ] },
  ],
  references: [
    { title: 'Redis key eviction', href: 'https://redis.io/docs/latest/develop/reference/eviction/' },
    { title: 'Redis Streams', href: 'https://redis.io/docs/latest/develop/data-types/streams/' },
    { title: 'Redis data types', href: 'https://redis.io/docs/latest/develop/data-types/' },
    { title: 'Redis persistence', href: 'https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/' },
    { title: 'Redis expiration', href: 'https://redis.io/docs/latest/commands/expire/' },
    { title: 'Redis memory optimization', href: 'https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/memory-optimization/' },
    { title: 'Redis replication', href: 'https://redis.io/docs/latest/operate/oss_and_stack/management/replication/' },
    { title: 'Redis Sentinel', href: 'https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/' },
    { title: 'Redis Cluster specification', href: 'https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/' },
    { title: 'Redis transactions', href: 'https://redis.io/docs/latest/develop/interact/transactions/' },
    { title: 'Redis Lua scripting', href: 'https://redis.io/docs/latest/develop/programmability/eval-intro/' },
    { title: 'Redis distributed locks', href: 'https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/' },
    { title: 'Redis Pub/Sub', href: 'https://redis.io/docs/latest/develop/pubsub/' },
    { title: 'Redis pipelining', href: 'https://redis.io/docs/latest/develop/using-commands/pipelining/' },
    { title: 'Redis latency troubleshooting', href: 'https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/' },
    { title: 'Redis INCR and rate limiter patterns', href: 'https://redis.io/docs/latest/commands/incr/' },
  ],
};