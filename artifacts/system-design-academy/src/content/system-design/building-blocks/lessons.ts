export type CoreLesson = {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  overview: string;
  learn: string[];
  why: string;
  diagram?: string;
  curriculum?: {
    specTitle: string;
    level: string;
    readTime: string;
    prerequisites: string[];
    objectives: string[];
    plainLanguage: string;
    howItWorks: string[];
    keyTerms: string[];
    diagrams: {
      caption: string;
      animate: string;
      steps: { from: string; to: string; label: string; detail: string }[];
    }[];
    workedExample: string;
    tradeOffs: string[];
    commonMistakes: string[];
    interviewQuestions: { question: string; answers: string[] }[];
    quickChecks: { question: string; answer: string }[];
    relatedTopics: string[];
  };
};

export const coreBuildingBlocksLessons: CoreLesson[] = [
  { id: '09', title: 'How Does the Internet Actually Work?', difficulty: 'Beginner', duration: '20 min', overview: 'Opening Instagram triggers a request-response cycle: your phone sends a request through the Internet, Instagram servers prepare a response, and your feed comes back.', learn: ['The request-response cycle', 'Why requests travel through many computers', 'How systems make the journey faster and more reliable'], why: 'Every System Design decision improves this journey for more users.', diagram: 'You\n  |\n  v\nInternet\n  |\n  v\nInstagram Servers\n  |\n  v\nFeed back to you', curriculum: {
    specTitle: 'Networking Fundamentals (DNS, TCP/IP, HTTP, HTTPS)',
    level: 'Beginner to intermediate',
    readTime: '15 min',
    prerequisites: ['Foundations 01'],
    objectives: [
      'Place DNS, TCP, UDP, IP, HTTP and TLS on the layered model.',
      'Explain what makes TCP reliable and why UDP exists.',
      'Compare HTTP/1.1, HTTP/2 and HTTP/3.',
      'Explain how a certificate lets a browser trust a server.',
    ],
    plainLanguage: 'Networking is a stack of simple promises. The bottom layer moves bits between neighbours. IP moves packets across many networks. TCP turns lossy packets into a reliable stream. HTTP uses that stream to ask for and send web resources, and TLS keeps the conversation private.',
    howItWorks: [
      'Layers: application (HTTP, DNS), transport (TCP, UDP), internet (IP), link (Ethernet, Wi-Fi).',
      'IP and ports: an IP address finds the machine; a port finds the program (443 HTTPS, 80 HTTP, 53 DNS). IPv4 is 32-bit, IPv6 is 128-bit.',
      'TCP: ordered, reliable stream using sequence numbers, acknowledgements, retransmission, receiver flow control and congestion control.',
      'UDP: no handshake, no delivery guarantee, low overhead. Used by DNS queries, real-time media and QUIC.',
      'DNS records: A (IPv4), AAAA (IPv6), CNAME (alias), NS (name servers), MX (mail), TXT (verification and policy).',
      'HTTP versions: 1.1 handles one request at a time per connection. HTTP/2 multiplexes many streams on one TCP connection. HTTP/3 uses QUIC over UDP, so one lost packet no longer stalls every stream.',
      'TLS: the server presents a certificate signed by a trusted authority; client and server agree on keys; data is then encrypted symmetrically. SNI lets one IP serve many hostnames.',
    ],
    keyTerms: ['Packet', 'Port', 'Socket', 'Handshake', 'Window', 'Congestion control', 'Record type', 'Certificate', 'SNI'],
    diagrams: [
      {
        caption: 'Each layer relies only on the one beneath it.',
        animate: 'Wrap a message in a header at each layer going down, unwrap going up.',
        steps: [
          { from: 'Application', to: 'Transport', label: 'HTTP, DNS, TLS', detail: 'Application protocols create the message to send.' },
          { from: 'Transport', to: 'Internet', label: 'TCP or UDP', detail: 'Transport provides a stream or datagrams between ports.' },
          { from: 'Internet', to: 'Link', label: 'IP routing', detail: 'IP routes packets across networks toward the destination.' },
          { from: 'Link', to: 'Neighbour', label: 'Ethernet, Wi-Fi', detail: 'The link layer moves bits to the next network neighbour.' },
        ],
      },
      {
        caption: 'TCP opens, recovers from a loss, and closes.',
        animate: 'Drop the segment-2 arrow midway and replay it as a retransmission.',
        steps: [
          { from: 'Client', to: 'Server', label: 'SYN', detail: 'Starts the connection and proposes a sequence number.' },
          { from: 'Server', to: 'Client', label: 'SYN-ACK', detail: 'Accepts and proposes its own number.' },
          { from: 'Client', to: 'Server', label: 'ACK', detail: 'The connection is open.' },
          { from: 'Client', to: 'Server', label: 'Data', detail: 'Segments carry sequence numbers.' },
          { from: 'Client', to: 'Server', label: 'Retransmit', detail: 'A missing ACK triggers a resend.' },
          { from: 'Client', to: 'Server', label: 'FIN', detail: 'Orderly close.' },
        ],
      },
    ],
    workedExample: 'TCP throughput is bounded by window ÷ RTT. With a 64 KB window and 50 ms RTT: 65,536 B ÷ 0.05 s ≈ 1.31 MB/s ≈ 10.5 Mbps, however fast the link is. Window scaling raises the window so long, fast paths can be filled.',
    tradeOffs: [
      'TCP for correctness; UDP when late data is useless or you build your own reliability.',
      'HTTP/2 and HTTP/3 cut connection overhead for pages with many assets.',
      'Always use TLS for anything user-facing.',
    ],
    commonMistakes: [
      'Assuming a fast link means a fast transfer. Latency and window size matter.',
      'Putting a CNAME at a zone apex where it is not allowed.',
      'Letting certificates expire.',
    ],
    interviewQuestions: [
      { question: 'TCP vs UDP?', answers: ['TCP: connection, ordering, retransmission, congestion control. UDP: none of these, lower latency.'] },
      { question: 'What does HTTP/2 improve over HTTP/1.1?', answers: ['Multiplexing on one connection, header compression; HTTP/3 also removes TCP head-of-line blocking.'] },
      { question: 'How does TLS establish trust?', answers: ['Certificate chain to a trusted authority, then key agreement, then symmetric encryption.'] },
    ],
    quickChecks: [
      { question: 'Which layer picks the program on a machine?', answer: 'Transport, via the port.' },
      { question: 'Why is a CNAME handy?', answer: 'It aliases one name to another so the target can change IPs.' },
    ],
    relatedTopics: ['Foundations 01', '10', '11', '21'],
  } },
  { id: '10', title: 'Client & Server', difficulty: 'Beginner', duration: '15 min', overview: 'The client asks for something, like a browser, mobile app, TV, or watch. The server receives that request, runs business logic, reads data, and sends a response back.', learn: ['What clients do', 'What servers do', 'Why clients request rather than hold all data'], why: 'Client-server communication is the basic pattern behind every web application.', curriculum: {
    specTitle: 'Client & Server',
    level: 'Beginner',
    readTime: '12 min',
    prerequisites: ['Foundations 01', 'Foundations 03'],
    objectives: [
      'Explain client and server as roles in a conversation, not types of machine.',
      'Describe how a server handles many requests at once and what limits it.',
      'Distinguish stateless from stateful servers and say why it matters for scaling.',
      'Choose between request-response, polling, server-sent events and WebSockets.',
    ],
    plainLanguage: 'A client is whoever asks; a server is whoever answers. Your phone is a client when it asks for a page. The program that serves that page becomes a client itself when it asks a database for data. The words describe the role in one conversation, not the machine.',
    howItWorks: [
      'Roles: the client starts the conversation; the server listens on a port and accepts connections. One program can be a server to its callers and a client of other services.',
      'Kinds of client: browsers, mobile apps, command-line tools, devices, and other servers calling services.',
      'Server loop: accept a connection, parse the request, route it, run the handler, write the response.',
      'Handling many requests: process per request, thread per request or thread pool, or an event loop with asynchronous I/O. The model decides how many simultaneous requests one machine can hold.',
      'Stateless server: remembers nothing about a user between requests, so any server can answer any request. State lives in the client (a signed token) or a shared store.',
      'Stateful server: keeps per-user data in its own memory, so a user must keep returning to the same server (sticky routing), which complicates scaling and failure.',
      'Identity across requests: a session cookie points to server-side data in a shared store, or the client carries a signed token on every request.',
      'Beyond request-response: polling and long polling (client keeps asking), server-sent events (server streams to the client), WebSockets (persistent two-way channel).',
      'Trust: the client is outside your control. Validate and authorise everything on the server.',
    ],
    keyTerms: ['Client', 'Server', 'Role', 'Port', 'Stateless', 'Stateful', 'Session', 'Cookie', 'Token', 'WebSocket', 'Server-sent events', 'Long polling'],
    diagrams: [
      {
        caption: 'The session lives in a shared store, so any server can answer the second request.',
        animate: 'Send the second request to a different server instance and show it still works.',
        steps: [
          { from: 'Browser', to: 'App server', label: 'Login request', detail: 'Credentials sent over TLS.' },
          { from: 'App server', to: 'Session store', label: 'Create session', detail: 'State stored outside the server.' },
          { from: 'App server', to: 'Browser', label: 'Set-Cookie', detail: 'Browser stores the session ID.' },
          { from: 'App server', to: 'Session store', label: 'Look up session', detail: 'Any server instance can do this.' },
          { from: 'App server', to: 'Browser', label: 'Response', detail: 'Personalised for user 42.' },
        ],
      },
      {
        caption: 'Picking a connection style.',
        animate: 'Let the learner click a scenario (chat, stock ticker, order status page, nightly report) and follow the path.',
        steps: [
          { from: 'Client', to: 'Decision', label: 'Needs updates', detail: 'Choose a connection style based on interaction needs.' },
          { from: 'Decision', to: 'WebSocket', label: 'Instant two-way messages', detail: 'Choose WebSocket when both client and server need persistent two-way messaging.' },
          { from: 'Decision', to: 'Decision', label: 'Not two-way', detail: 'If not, check whether the server pushes updates and the client only listens.' },
          { from: 'Decision', to: 'Server-sent events', label: 'Server pushes; client listens', detail: 'Choose server-sent events for one-way server-to-client updates.' },
          { from: 'Decision', to: 'Decision', label: 'No one-way push', detail: 'If one-way server push does not fit, check how quickly updates are needed.' },
          { from: 'Decision', to: 'Polling or long polling', label: 'Rare or delayed updates', detail: 'Choose polling or long polling when updates are rare or a few seconds late is acceptable.' },
          { from: 'Decision', to: 'Server-sent events', label: 'Otherwise', detail: 'For the remaining one-way update case, use server-sent events.' },
        ],
      },
    ],
    workedExample: 'A server has a pool of 200 worker threads and each request holds a thread for 100 ms while it waits on the database. Maximum throughput = threads ÷ time held (Little\'s Law rearranged): 200 ÷ 0.1 = 2,000 requests/s. If the database slows and each request now holds a thread for 500 ms: 200 ÷ 0.5 = 400 requests/s. The same machine handles five times less. Session memory: 1 M logged-in users × 2 KB = 2 GB. Kept in each server\'s memory it forces sticky routing; kept in a shared store any server can serve any user.',
    tradeOffs: [
      'Prefer stateless servers; they scale out and recover simply.',
      'Use polling for rare updates, server-sent events for one-way streams, WebSockets for true two-way messaging.',
      'Persistent connections cost memory per connection; plan capacity for them.',
    ],
    commonMistakes: [
      'Session data in server memory behind a load balancer with no sticky routing.',
      'Trusting client-side validation.',
      'Polling every second when a push connection would do.',
    ],
    interviewQuestions: [
      { question: 'What makes a server stateless and why does it matter?', answers: ['No per-user memory between requests; any instance can answer; easy to scale and replace.'] },
      { question: 'How does one server handle thousands of connections?', answers: ['Event-loop or asynchronous I/O, or a sized thread pool; capacity follows from concurrency and time per request.'] },
      { question: 'Polling vs WebSockets vs server-sent events?', answers: ['Polling is simple but wasteful; SSE is one-way push over HTTP; WebSockets are two-way and persistent.'] },
    ],
    quickChecks: [
      { question: 'Can a web server also be a client?', answer: 'Yes, when it calls another service or a database.' },
      { question: 'Where should session data live so any server can answer?', answer: 'In a shared store or in a signed token the client carries.' },
    ],
    relatedTopics: ['Foundations 03', '09', '13 (Load Balancer)', '14 (API)'],
  } },
  { id: '11', title: "DNS (The Internet's Phone Book)", difficulty: 'Beginner', duration: '15 min', overview: 'People remember names such as google.com, but computers use IP addresses. DNS translates a human-friendly domain name into the numeric address of the server.', learn: ['Domain names', 'IP addresses', 'DNS lookup'], why: 'Without DNS, users would need to memorize an IP address for every website.', diagram: 'google.com\n  |\n  v\n142.xxx.xxx.xxx', curriculum: {
    specTitle: "DNS (The Internet's Phone Book)",
    level: 'Beginner to intermediate',
    readTime: '15 min',
    prerequisites: ['09'],
    objectives: ['Trace a lookup through resolver, root, TLD and authoritative servers.', 'Read the common record types.', 'Reason about TTL and caching when changing records.', 'Use DNS for failover and traffic steering, and name its limits.'],
    plainLanguage: 'Computers find each other by number, people remember names. DNS is the phone book that turns `www.example.com` into an address. Nobody keeps the whole book: a chain of helpers each knows one part, and answers are remembered for a while so the next person does not have to repeat the search.',
    howItWorks: [
      'Hierarchy: a name is read right to left. The root knows the top-level domains (`.com`), the TLD servers know who handles `example.com`, and that domain’s authoritative servers hold the real records.',
      'Resolution: the browser or operating system asks a recursive resolver (from the ISP or a public service). The resolver asks root, then TLD, then authoritative, and caches each answer.',
      'Record types: A (name to IPv4), AAAA (IPv6), CNAME (alias to another name; not allowed at the zone apex by the standard), NS (which servers are authoritative), MX (mail), TXT (verification and email policy), SRV (service location).',
      'TTL: how many seconds an answer may be cached. Failed lookups (NXDOMAIN) are cached too.',
      'Traffic steering: several A records (round robin), weighted, latency-based or geo-based answers, and health-checked failover, all provider features.',
      'Limits of DNS steering: clients and resolvers cache answers, so changes only take effect as old TTLs expire. DNS does not know the real load of a server.',
      'Security: classic DNS is plaintext on UDP port 53 and can be spoofed. DNSSEC signs records; DNS over HTTPS or TLS encrypts queries.',
      'Failure modes: resolver outage, expired domain, wrong NS records, a very long TTL on a bad record.',
    ],
    keyTerms: ['Resolver', 'Root server', 'TLD', 'Authoritative server', 'Record', 'TTL', 'NXDOMAIN', 'CNAME', 'Zone apex', 'DNSSEC'],
    diagrams: [{ caption: 'An uncached lookup walks the hierarchy; the result is cached for its TTL.', animate: 'Run the lookup twice; the second time the resolver answers from cache and skips steps 2-7.', steps: [
      { from: 'Browser', to: 'Resolver', label: 'Ask for the name', detail: 'Browser and OS caches are checked first.' },
      { from: 'Resolver', to: 'Root server', label: 'Ask about .com', detail: 'Root points to the TLD servers.' },
      { from: 'Resolver', to: 'TLD server', label: 'Ask about example.com', detail: 'TLD points to the name servers.' },
      { from: 'Resolver', to: 'Authoritative server', label: 'Ask for the record', detail: 'This server holds the real answer.' },
      { from: 'Authoritative server', to: 'Resolver', label: 'Answer with TTL', detail: 'Resolver caches it.' },
      { from: 'Resolver', to: 'Browser', label: 'Return the IP', detail: 'Browser connects to that address.' },
    ] }],
    workedExample: 'Lookup time, assuming 5 ms from the device to its resolver and 30 ms from the resolver to each server: Uncached: 5 + 3 × 30 = 95 ms. Cached at the resolver: about 5 ms. Migration plan for moving a site to a new IP when the record has TTL 86,400 s (24 h): At least 24 h before the move, lower the TTL to 300 s. Change the record. Stale answers now last at most 5 minutes. Raise the TTL again once the move is stable.',
    tradeOffs: ['Long TTL: fewer lookups, slower changes. Short TTL: faster changes and failover, more lookups.', 'Use DNS steering for coarse regional routing; use a load balancer for real load distribution.', 'Keep at least two authoritative name servers on separate networks.'],
    commonMistakes: ['Changing a record without lowering the TTL first.', 'Putting a CNAME at the zone apex.', 'Letting the domain registration expire.'],
    interviewQuestions: [
      { question: 'How does DNS resolution work?', answers: ['Stub to recursive resolver, then root, TLD, authoritative; caching at every level by TTL.'] },
      { question: 'A record vs CNAME?', answers: ['A maps a name to an address; CNAME makes one name an alias of another.'] },
      { question: 'Can DNS be used for failover and what is the catch?', answers: ['Yes, with health checks and short TTLs, but caching means the switch is never instant.'] },
    ],
    quickChecks: [{ question: 'What controls how long an answer is cached?', answer: "The record's TTL." }, { question: 'Which server holds the real records for a domain?', answer: 'Its authoritative name server.' }],
    relatedTopics: ['09', '12', '13 (Load Balancer)', '21 (CDN)'],
  } },
  { id: '12', title: 'What Happens When You Press Enter?', difficulty: 'Beginner', duration: '15 min', overview: 'When you type amazon.com, the browser asks DNS for the destination, contacts Amazon servers, receives a response, and displays the page.', learn: ['Browser request', 'DNS resolution', 'Server response', 'Page rendering'], why: 'Every later building block makes this same path smarter, faster, and more resilient.', diagram: 'Browser\n  |\n  v\nDNS\n  |\n  v\nAmazon Server\n  |\n  v\nBrowser displays page', curriculum: {
    specTitle: 'What Happens When You Press Enter?',
    level: 'Beginner to intermediate',
    readTime: '15 min',
    prerequisites: ['09', '11'],
    objectives: ['Narrate the whole journey from keypress to pixels in order.', 'Name the browser’s rendering steps: DOM, CSSOM, render tree, layout, paint, composite.', 'Identify what blocks rendering and how to avoid it.', 'Connect the journey to metrics such as time to first byte and largest contentful paint.'],
    plainLanguage: 'Pressing Enter starts a relay race. The browser works out where to go, asks for directions (DNS), opens a secure line, asks for the page, and then, once the page arrives, builds it on screen piece by piece while fetching everything else it needs.',
    howItWorks: ['Before any request: decide whether the text is a URL or a search; upgrade to HTTPS if the site is on the browser’s HSTS list; check the HTTP cache and any service worker.', 'Network (see cards 11 and 09): DNS lookup, TCP handshake, TLS handshake, HTTP request. Each redirect (301 or 302) adds a round trip.', 'Streaming parse: the browser starts parsing HTML while it is still arriving, and a preload scanner spots CSS, scripts and images early so downloads start sooner.', 'Build structures: HTML becomes the DOM; CSS becomes the CSSOM; together they form the render tree.', 'Layout and paint: layout computes sizes and positions, paint draws the pixels, and compositing assembles layers (often on the GPU).', 'Blocking rules: CSS blocks rendering until it loads; a plain script blocks parsing until it downloads and runs, unless it uses `async` or `defer`.', 'JavaScript and data: scripts run, may call APIs (`fetch`), and update the page. Client-side rendering builds the page in the browser; server-side rendering sends finished HTML first.', 'Metrics: time to first byte (TTFB), first contentful paint (FCP), largest contentful paint (LCP; about 2.5 s or less is the commonly cited “good” target).'],
    keyTerms: ['HSTS', 'Redirect', 'DOM', 'CSSOM', 'Render tree', 'Layout', 'Paint', 'Render-blocking', '`defer`', 'TTFB', 'LCP'],
    diagrams: [{ caption: 'How HTML and CSS become pixels.', animate: 'Highlight each stage in order; show a blocking script pausing the HTML to DOM step.', steps: [{ from: 'HTML', to: 'DOM tree', label: 'Parse HTML', detail: 'The browser turns HTML into the DOM tree.' }, { from: 'CSS', to: 'CSSOM', label: 'Parse CSS', detail: 'The browser turns CSS into the CSSOM.' }, { from: 'DOM tree', to: 'Render tree', label: 'Combine DOM', detail: 'DOM and CSSOM together form the render tree.' }, { from: 'CSSOM', to: 'Render tree', label: 'Apply styles', detail: 'CSS rules contribute to the render tree.' }, { from: 'Render tree', to: 'Layout', label: 'Layout', detail: 'Compute sizes and positions.' }, { from: 'Layout', to: 'Paint', label: 'Paint', detail: 'Draw the pixels.' }, { from: 'Paint', to: 'Composite on screen', label: 'Composite', detail: 'Assemble layers, often on the GPU.' }, { from: 'JavaScript', to: 'DOM', label: 'May change DOM', detail: 'JavaScript may modify the DOM.' }] }],
    workedExample: 'Illustrative numbers: the HTML first byte arrives at 200 ms on a cold visit (the Foundations 01 example). CSS and JS are requested over the same connection: +50 ms round trip +20 ms server = about 270 ms; first paint lands at about 300 ms. Add a synchronous 300 KB script in the head that takes 120 ms to download and run: parsing stalls and first paint moves to about 420 ms. Marking it `defer` brings first paint back to about 300 ms.',
    tradeOffs: ['Inline or preload the CSS needed for the first screen; defer everything else.', 'Server-side rendering improves first paint but costs server work; client-side rendering shifts work to the device.', 'Avoid redirect chains; each is a full round trip.'],
    commonMistakes: ['Synchronous scripts in the `<head>`.', 'Huge CSS bundles that block rendering.', 'Measuring only server time and ignoring rendering time.'],
    interviewQuestions: [{ question: 'What happens when you type a URL and press Enter?', answers: ['Interpret input, DNS, TCP, TLS, HTTP, response, parse, render, subresources, JavaScript.'] }, { question: 'What is render-blocking?', answers: ['Resources the browser must finish before painting, mainly CSS and synchronous scripts.'] }, { question: 'Client-side vs server-side rendering?', answers: ['CSR sends a shell and builds in the browser; SSR sends ready HTML. Trade first paint against server cost.'] }],
    quickChecks: [{ question: 'Which attribute stops a script from blocking HTML parsing?', answer: '`defer` (or `async`).' }, { question: 'What does HSTS do?', answer: 'Forces HTTPS for a site before any request is sent.' }],
    relatedTopics: ['Foundations 01', '09', '11', '21 (CDN)'],
  } },
  { id: '13', title: 'Load Balancer (The Traffic Police)', difficulty: 'Beginner', duration: '20 min', overview: 'A load balancer is like someone directing shoppers to different checkout counters. It spreads requests across servers so no single machine receives all the traffic.', learn: ['Traffic distribution', 'Multiple application servers', 'Horizontal scaling', 'Health-aware routing'], why: 'It improves response times, prevents overload, and makes adding servers easier.', diagram: 'Users\n  |\n  v\nLoad Balancer\n /  |  \\\nS1  S2  S3', curriculum: {
    specTitle: 'Load Balancers',
    level: 'Beginner to intermediate',
    readTime: '15 min',
    prerequisites: ['Foundations 06', 'Foundations 09'],
    objectives: [
      'Distinguish Layer 4 and Layer 7 balancing.',
      'Choose a balancing algorithm for a workload.',
      'Explain health checks and how long a failure stays visible.',
      'Avoid making the load balancer itself a single point of failure.',
    ],
    plainLanguage: 'A load balancer is a receptionist who sends each visitor to a free, healthy desk. It spreads work so no server is overloaded, and it quietly stops sending people to a desk that has closed.',
    howItWorks: [
      'L4 balances on IP and port without reading the request; fast and protocol-agnostic. L7 reads HTTP, so it can route by host, path, header or cookie.',
      'Algorithms: round robin, weighted round robin, least connections, IP hash, consistent hashing.',
      'Health checks: active (probe every N seconds) and passive (watch real failures). An instance is removed after several failed probes and returned after several successes.',
      'Stickiness: pin a user to one server with a cookie or IP hash. Prefer stateless servers instead.',
      'TLS termination at the balancer offloads crypto from servers.',
      'Redundancy: run at least two balancers (active-passive or active-active) or use a managed service.',
      'Connection draining: let in-flight requests finish before removing an instance during deploys.',
    ],
    keyTerms: ['L4', 'L7', 'Backend pool', 'Health check', 'Sticky session', 'Connection draining', 'TLS termination'],
    diagrams: [{
      caption: 'Traffic is spread across healthy servers; probes decide who is healthy.',
      animate: 'Turn Server 3 red after its probes fail and reroute its share.',
      steps: [
        { from: 'Client', to: 'Load balancer', label: 'Request', detail: 'Arrives at a virtual IP or DNS name.' },
        { from: 'Load balancer', to: 'Load balancer', label: 'Pick backend', detail: 'Algorithm plus health state.' },
        { from: 'Load balancer', to: 'Server', label: 'Forward', detail: 'L7 may rewrite headers.' },
        { from: 'Server', to: 'Client', label: 'Response', detail: 'Often via the balancer.' },
        { from: 'Health checker', to: 'Server', label: 'Probe', detail: 'Failed probes remove it from the pool.' },
      ],
    }],
    workedExample: 'Three equal servers, 900 QPS, probe every 5 s, unhealthy after 3 failures (15 s to detect). One server dies: it was taking 300 QPS, so up to 300 × 15 = 4,500 requests fail before it is removed, unless the balancer retries on another server. Weighted example: capacities 200, 200, 100 QPS give weights 2:2:1, so 500 QPS splits 200, 200, 100.',
    tradeOffs: [
      'L4 for raw speed or non-HTTP; L7 for path and header routing.',
      'Least connections beats round robin when request cost varies a lot.',
      'Shorter probe intervals detect faster but add load and can flap.',
    ],
    commonMistakes: [
      'A single balancer with no standby.',
      'Sticky sessions hiding state that should live in a shared store.',
      'Health checks that only test "port open", not "can serve".',
    ],
    interviewQuestions: [
      { question: 'L4 vs L7?', answers: ['L4 is connection-level and fast; L7 understands HTTP and routes by content.'] },
      { question: 'How do you avoid a balancer SPOF?', answers: ['Redundant pair or managed multi-zone service, plus DNS or anycast in front.'] },
      { question: 'When use least connections?', answers: ['When request durations vary widely or connections are long-lived.'] },
    ],
    quickChecks: [
      { question: 'Which layer can route by URL path?', answer: 'L7.' },
      { question: 'What detection time does a 5 s interval with 3 failures give?', answer: 'About 15 s.' },
    ],
    relatedTopics: ['Foundations 06', '23 (Reverse Proxy)', '15 (API Gateway)', '22 (Service Discovery)'],
  } },
  { id: '14', title: 'API (The Waiter)', difficulty: 'Beginner', duration: '20 min', overview: 'An API is the controlled layer between clients and backend systems. Like a waiter, it takes the request to the right place and returns the result without giving direct database access.', learn: ['Client-to-server communication', 'Request handling', 'Controlled data access'], why: 'APIs protect backend systems and provide a stable contract for clients.', diagram: 'Client\n  |\n  v\nAPI\n  |\n  v\nServer\n  |\n  v\nDatabase', curriculum: {
    specTitle: 'API (The Waiter)',
    level: 'Beginner to intermediate',
    readTime: '15 min',
    prerequisites: ['Foundations 05', 'Foundations 09', '10 (Client & Server)'],
    objectives: [
      'Model resources and choose the right HTTP method and status code.',
      'Use conditional requests to save bandwidth.',
      'Design filtering, sorting and pagination that scale.',
      'Secure and version an API sensibly.',
    ],
    plainLanguage: 'Like a waiter, an API takes a request to the right place and returns the result without giving direct access to the kitchen. REST treats everything as a noun (a resource) with a URL, and uses a small, fixed set of verbs (HTTP methods) to act on it. Because the verbs mean the same thing everywhere, clients, caches and proxies can behave sensibly without knowing your application.',
    howItWorks: [
      'Resources: plural nouns, nested only when ownership is real: `/users/42/orders`.',
      'Methods: GET reads (safe and idempotent), POST creates or runs an action, PUT replaces (idempotent), PATCH changes part (not guaranteed idempotent), DELETE removes (idempotent).',
      'Status codes: 200 OK, 201 Created, 204 No Content, 304 Not Modified, 400 Bad Request, 401 Unauthenticated, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable, 429 Too Many Requests, 500, 503.',
      'Query design: filter and sort with parameters; paginate with a cursor for large lists.',
      'Conditional requests: server sends `ETag`; client sends `If-None-Match`; unchanged data returns 304 with no body.',
      'Auth: bearer tokens in `Authorization`; authorise per resource; never put secrets in URLs.',
      'Versioning and limits: version the contract, return `429` with `Retry-After`, accept `Idempotency-Key` on POST.',
    ],
    keyTerms: ['Resource', 'Representation', 'Safe', 'Idempotent', 'ETag', 'Cursor', 'Bearer token', 'Rate limit'],
    diagrams: [{
      caption: 'A conditional GET returns a body only when something changed.',
      animate: 'Make the response arrow thick for a body and thin for a 304.',
      steps: [
        { from: 'Client', to: 'Server', label: 'GET', detail: 'First fetch, no validator.' },
        { from: 'Server', to: 'Client', label: '200 + ETag', detail: 'Client stores body and tag.' },
        { from: 'Client', to: 'Server', label: 'GET + If-None-Match', detail: 'Asks "has it changed?"' },
        { from: 'Server', to: 'Client', label: '304', detail: 'No body, saves bandwidth.' },
        { from: 'Server', to: 'Client', label: '200 + new ETag', detail: 'Sent only after a real change.' },
      ],
    }],
    workedExample: 'A 200 KB resource fetched 10,000 times a minute, unchanged 90% of the time, 304 headers about 0.5 KB: Without ETag: 10,000 × 200 KB = 2,000 MB per minute. With ETag: 9,000 × 0.5 KB + 1,000 × 200 KB = 4.5 MB + 200 MB ≈ 205 MB per minute, about 90% less.',
    tradeOffs: [
      'REST suits public, cacheable resources. Use gRPC internally if you need streaming or tight typing.',
      'Prefer a stable cursor over offset on big lists.',
      'Return enough in errors for a client to act: code, message, request ID.',
    ],
    commonMistakes: [
      'Verbs in URLs (`/getUser`), or 200 with an error body.',
      'Using POST for everything, which defeats caching.',
      'Leaking internal IDs or fields through responses.',
    ],
    interviewQuestions: [
      { question: 'PUT vs PATCH vs POST?', answers: ['PUT replaces and is idempotent, PATCH modifies part, POST creates or triggers an action.'] },
      { question: '401 vs 403?', answers: ['401: not authenticated. 403: authenticated but not allowed.'] },
      { question: 'How would you make a list endpoint scale?', answers: ['Cursor pagination, indexed filters, page size cap, optional ETag.'] },
    ],
    quickChecks: [
      { question: 'Is DELETE idempotent?', answer: 'Yes, repeating it leaves the same end state.' },
      { question: 'What does a 304 contain?', answer: 'Headers only, no body.' },
    ],
    relatedTopics: ['Foundations 05', '09', '13 (API Gateway)', '17 (Cache)'],
  } },
  { id: '15', title: 'API Gateway', difficulty: 'Beginner', duration: '20 min', overview: 'An API Gateway is the main front door for many backend services. It handles authentication, routing, rate limiting, and request forwarding before traffic reaches a service.', learn: ['Authentication', 'Routing', 'Rate limiting', 'Single entry point'], why: 'It gives clients one predictable entry point while backend systems can remain modular.', curriculum: {
    specTitle: 'API Gateway',
    level: 'Intermediate',
    readTime: '15 min',
    prerequisites: ['14 (API)', '13 (Load Balancer)', '23 (Reverse Proxy)'],
    objectives: [
      'Describe the cross-cutting work an API gateway centralises.',
      'Explain request aggregation and the backend-for-frontend pattern.',
      'Spot when a gateway becomes a bottleneck or holds too much logic.',
    ],
    plainLanguage: 'Think of the Traffic Police directing every API request through one controlled entrance. An API gateway is the single front door for your APIs. Instead of every service re-implementing login checks, limits and logging, the gateway does them once, then hands the request to the right service.',
    howItWorks: [
      'Routing by path, host, method or version to the right service.',
      'AuthN and AuthZ: validate tokens, pass identity downstream.',
      'Rate limiting and quotas per key, user or plan.',
      'Transformation: header changes, protocol translation (REST to gRPC), response shaping.',
      'Aggregation: one client call fans out to several services and merges the results.',
      'Observability: access logs, metrics, trace ID injection.',
      'Resilience: timeouts, retries and circuit breaking at the edge.',
      'BFF: a separate gateway per client type (web, mobile) tailored to its screens.',
    ],
    keyTerms: ['Gateway', 'Route', 'Token validation', 'Quota', 'Aggregation', 'BFF', 'Edge'],
    diagrams: [{
      caption: 'Many clients, one door, many services.',
      animate: 'A request lights up the gateway checks (auth, limit, route) before reaching a service.',
      steps: [
        { from: 'Web app', to: 'API gateway', label: 'Web request', detail: 'The web client uses the shared API entry point.' },
        { from: 'Mobile app', to: 'API gateway', label: 'Mobile request', detail: 'The mobile client also enters through the gateway.' },
        { from: 'Partner API', to: 'API gateway', label: 'Partner request', detail: 'Partner traffic shares the controlled entry.' },
        { from: 'API gateway', to: 'User service', label: 'Route user call', detail: 'The gateway routes to the user service.' },
        { from: 'API gateway', to: 'Order service', label: 'Route order call', detail: 'The gateway routes to the order service.' },
        { from: 'API gateway', to: 'Catalog service', label: 'Route catalog call', detail: 'The gateway routes to the catalog service.' },
      ],
    }],
    workedExample: 'A mobile screen needs three backend calls of 40 ms each; client to server RTT is 100 ms. Client calls each service directly, in sequence: 3 × (100 + 40) = 420 ms. Client calls the gateway once; it calls the three services in parallel: 100 + 40 + about 5 = about 145 ms.',
    tradeOffs: [
      'Use a gateway when many clients and many services share auth, limits and logging.',
      'Keep business logic out of it; it should route and enforce policy.',
      'Run it redundantly across zones and watch its latency as a first-class metric.',
    ],
    commonMistakes: [
      'Turning the gateway into a monolith of business rules.',
      'Making it a single point of failure.',
      'Duplicating auth checks in every service without a gateway or a shared library.',
    ],
    interviewQuestions: [
      { question: 'Gateway vs load balancer?', answers: ['Balancer spreads traffic; gateway applies API policy (auth, limits, transformation) and routes by content.'] },
      { question: 'What is BFF?', answers: ['A gateway tailored per client type so each gets the response shape it needs.'] },
      { question: 'Risks of a gateway?', answers: ['SPOF, latency, logic creep, coupling of teams to one deploy.'] },
    ],
    quickChecks: [
      { question: 'Which status does an over-quota client get?', answer: '429.' },
      { question: 'Why aggregate at the gateway?', answer: 'Fewer client round trips; parallel backend calls.' },
    ],
    relatedTopics: ['14 (API)', '13 (Load Balancer)', '23 (Reverse Proxy)', '22 (Service Discovery)'],
  } },
  { id: '16', title: 'Database (The Library)', difficulty: 'Beginner', duration: '20 min', overview: 'A database is permanent storage for users, orders, messages, products, and transactions. Unlike memory, data remains after power is turned off. Relational SQL databases provide tables, joins and ACID transactions; NoSQL is a family of document, key-value, wide-column, graph and time-series stores chosen for particular access patterns and scale needs.', learn: ['Persistent storage', 'Reading and writing data', 'Why databases are durable', 'ACID transactions', 'SQL and NoSQL database types', 'Choosing a store from access patterns', 'Polyglot persistence'], why: 'Applications need a reliable source of truth for important data.', curriculum: {
    specTitle: 'Database (The Library)',
    level: 'Intermediate',
    readTime: '18 min',
    prerequisites: ['Foundations 04'],
    objectives: [
      'Explain ACID and what each letter protects.',
      'Compare relational, document, key-value, wide-column, graph and time-series databases.',
      'Choose a database from access patterns, consistency needs and scale.',
      'Describe polyglot persistence.',
    ],
    plainLanguage: 'Think of this database as the Library: SQL databases are strict librarians, where everything has a place, rules are enforced, and you can ask complex questions across shelves. NoSQL databases trade some of that strictness for flexibility or scale in a particular shape of problem. “NoSQL” is a family, not one thing.',
    howItWorks: [
      'ACID: Atomicity (all or nothing), Consistency (rules hold), Isolation (concurrent transactions do not corrupt each other), Durability (committed data survives crashes).',
      'Relational: tables, joins, SQL, strong consistency on a single node. Scales up easily; scaling out needs replication and sharding.',
      'Document: nested records, flexible schema, good for read-as-a-unit data.',
      'Key-value: fastest simple lookups; no rich queries.',
      'Wide-column: huge write throughput and partitioned by key, query by key range.',
      'Graph: relationships as first-class data; good for traversals.',
      'Time-series: append-heavy timestamped data with rollups and retention.',
      'Consistency: many distributed stores offer tunable or eventual consistency, trading immediacy for availability and scale.',
      'Polyglot persistence: use more than one store, each for what it does best.',
    ],
    keyTerms: ['ACID', 'Transaction', 'Join', 'Schema', 'Eventual consistency', 'Partition key', 'Polyglot persistence'],
    diagrams: [
      {
        caption: 'A starting point, not a rule.',
        animate: 'Step through the tree for sample workloads (bank, chat history, social graph, sensor data).',
        steps: [
          { from: 'Need to store data', to: 'Decision', label: 'Choose by workload', detail: 'Start with the questions and guarantees the application needs.' },
          { from: 'Decision', to: 'Relational', label: 'Complex joins and strict transactions?', detail: 'If yes, relational storage is a strong starting choice.' },
          { from: 'Decision', to: 'Decision', label: 'Otherwise', detail: 'If no, consider the dominant access pattern next.' },
          { from: 'Decision', to: 'Key-value or wide-column', label: 'Mostly lookups by key at huge scale?', detail: 'If yes, consider key-value or wide-column stores.' },
          { from: 'Decision', to: 'Decision', label: 'Otherwise', detail: 'If not, ask whether relationships drive the query.' },
          { from: 'Decision', to: 'Graph', label: 'Relationships are the main query?', detail: 'If yes, graph databases make relationships first-class.' },
          { from: 'Decision', to: 'Time-series', label: 'Timestamped append-only metrics?', detail: 'If yes, consider a time-series database.' },
          { from: 'Decision', to: 'Document', label: 'Otherwise', detail: 'A document store can fit nested records read as a unit.' },
        ],
      },
      {
        caption: 'Atomicity: either both balances change or neither does.',
        animate: 'Show the two updates committing together; on a simulated crash after the first update, show rollback restoring the original balance.',
        steps: [
          { from: 'App', to: 'Relational DB', label: 'BEGIN', detail: 'Start a transaction.' },
          { from: 'App', to: 'Relational DB', label: 'Update A: 500 to 400', detail: 'Apply the first balance change inside the transaction.' },
          { from: 'App', to: 'Relational DB', label: 'Update B: 200 to 300', detail: 'Apply the second balance change inside the transaction.' },
          { from: 'App', to: 'Relational DB', label: 'COMMIT', detail: 'If both succeed, commit both updates.' },
          { from: 'Relational DB', to: 'Relational DB', label: 'ROLLBACK on crash', detail: 'If failure occurs after the first update, restore A to 500 so neither change is committed.' },
        ],
      },
    ],
    workedExample: 'Transfer 100 from A (500) to B (200). Inside a transaction the totals stay 700 at every committed point. Without a transaction, a crash after the first update leaves A at 400 and B at 200: 100 has vanished.',
    tradeOffs: [
      'Default to relational unless a clear access pattern or scale need says otherwise.',
      'Pick a document or key-value store when the query is “get this one thing by key” at high volume.',
      'Every extra database adds operations, backups and consistency questions.',
    ],
    commonMistakes: [
      'Choosing NoSQL “to scale” before measuring.',
      'Normalising everything in a read-heavy document workload, or denormalising without a plan to update copies.',
      'Ignoring the consistency level the database actually gives you.',
    ],
    interviewQuestions: [
      { question: 'SQL vs NoSQL?', answers: ['Structure and joins and strong consistency vs flexible shape and scale in a specific pattern; depends on access patterns.'] },
      { question: 'What does ACID guarantee?', answers: ['Atomicity, consistency, isolation, durability of transactions.'] },
      { question: 'What is polyglot persistence?', answers: ['Using several stores, each matched to a workload, and managing the copies.'] },
    ],
    quickChecks: [
      { question: 'Which letter of ACID means “all or nothing”?', answer: 'Atomicity.' },
      { question: 'Good fit for a social graph?', answer: 'A graph database, or a relational one with careful modelling.' },
    ],
    relatedTopics: ['Foundations 04', 'and the Indexing, Replication and Sharding specs (no cards yet)'],
  } },
  { id: '17', title: 'Cache (Sticky Notes)', difficulty: 'Beginner', duration: '20 min', overview: 'A cache remembers recently or frequently requested data. The server checks the cache first and asks the database only when the answer is not already available.', learn: ['Cache hit', 'Cache miss', 'Reducing database work', 'Lower latency'], why: 'Caching makes common requests faster and lowers database load.', diagram: 'Request\n  |\n  v\nCache\n  |\n  v\nDatabase (only if needed)' },
  { id: '18', title: 'Redis', difficulty: 'Beginner', duration: '20 min', overview: 'Redis is an extremely fast in-memory data store. Think of it as a desk for frequently used books while the database is the cupboard for durable storage.', learn: ['Sessions', 'User profiles', 'Counters', 'Shopping carts', 'Leaderboards'], why: 'Keeping frequently used data in memory dramatically improves response times.' },
  { id: '19', title: 'Message Queue (The Waiting Line)', difficulty: 'Beginner', duration: '20 min', overview: 'A message queue lets the system acknowledge work immediately while a worker completes it later. This is useful for emails, notifications, and image processing.', learn: ['Asynchronous work', 'Producers and workers', 'Smoother traffic spikes'], why: 'Not every task needs to block the user request.', diagram: 'User\n  |\n  v\nQueue\n  |\n  v\nWorker\n  |\n  v\nEmail Sent' },
  { id: '20', title: 'Kafka', difficulty: 'Beginner', duration: '25 min', overview: 'Kafka works like a newspaper office: producers publish events and many consumers independently read the events they care about.', learn: ['Producers', 'Consumers', 'Events', 'Independent subscribers'], why: 'It supports event-driven systems without tightly coupling services.' },
  { id: '21', title: 'CDN (Delivery Warehouse)', difficulty: 'Beginner', duration: '20 min', overview: 'A CDN keeps copies of static content near users around the world. Instead of every Netflix video coming from one country, the closest copy can serve the viewer.', learn: ['Global edge locations', 'Nearest-copy delivery', 'Faster media delivery'], why: 'CDNs reduce latency for images, videos, scripts, and other static content.' },
  { id: '22', title: 'Service Discovery', difficulty: 'Beginner', duration: '20 min', overview: 'Service Discovery lets services find each other without hardcoding IP addresses. A registry knows where a service currently runs, even as instances start and stop.', learn: ['Service registry', 'Dynamic addresses', 'Healthy instances'], why: 'It makes autoscaling and changing infrastructure manageable.' },
  { id: '23', title: 'Reverse Proxy', difficulty: 'Beginner', duration: '20 min', overview: 'A reverse proxy is like a receptionist in front of an office. It receives visitors, applies rules, and forwards them to the right backend server.', learn: ['Traffic forwarding', 'Backend protection', 'Request management'], why: 'It keeps internal servers protected and simplifies how incoming traffic is managed.' },
  { id: '24', title: 'Putting Everything Together', difficulty: 'Beginner', duration: '30 min', overview: 'An Instagram request combines the pieces from this part: DNS finds the destination, a CDN serves images, traffic reaches a load balancer and gateway, application servers use Redis and databases, and Kafka drives background work.', learn: ['End-to-end request path', 'How building blocks collaborate', 'Why architecture is composable'], why: 'You now know the alphabet of backend architecture used by systems such as WhatsApp, Netflix, Uber, Amazon, and Instagram.', diagram: 'You\n  |\n  v\nDNS -> CDN -> Load Balancer -> API Gateway\n  |\n  v\nApplication Server -> Redis Cache -> Database\n  |\n  v\nKafka -> Notification Service -> Response' },
];
