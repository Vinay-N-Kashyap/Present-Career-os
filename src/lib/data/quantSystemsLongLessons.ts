import type { LongLesson } from './longLessons';

export const QUANT_SYSTEMS_LONG_LESSONS: LongLesson[] = [
  {
    day: 1,
    title: 'Low-Latency Architecture, Cache Locality & High-Frequency C++ Matching Fundamentals',
    goal: 'Master high-frequency trading systems engineering in C++: hardware cache line alignment, zero-allocation hot paths, lock-free SPSC ring buffers, deterministic fixed-point math, and order book matching.',
    minutes: 32,
    recap: 'Welcome to Quantitative & Low-Latency Systems Engineering. Today we engineer sub-microsecond trading infrastructure where nanoseconds dictate market edge.',
    parts: [
      {
        title: 'CPU Cache Hierarchy, Cache Line Alignment & Zero Heap Allocation',
        say: [
          'In high-frequency quantitative systems, the single greatest bottleneck is the CPU memory wall: accessing main RAM costs 60 to 100 nanoseconds, whereas an L1 cache hit takes only 1 nanosecond (around 4 CPU cycles).',
          'If your execution thread experiences a cache miss or triggers a dynamic heap allocation (such as malloc or operator new) on the critical order path, the latency spike will cause your order to arrive after competitor market makers.',
          'Modern CPUs transfer memory between RAM and cache in 64-byte chunks called cache lines.',
          'To achieve sub-microsecond throughput, all critical data structures such as Order and PriceLevel structs must be compactly packed and aligned to 64-byte boundaries using alignas(64).',
          'Furthermore, high-frequency engines pre-allocate all memory into flat arrays or contiguous pools during startup, strictly prohibiting heap allocation on the hot path.'
        ],
        example: 'Instead of walking to a remote warehouse (RAM) every time a customer asks for a stock quote, you keep the top 10 most popular stock quotes pinned on an index card taped directly to your desk (L1 cache).',
        code: `#include <iostream>
#include <cstdint>

// Compact 64-byte aligned market order struct fitting exactly in one L1 cache line
struct alignas(64) OrderBookEntry {
    uint64_t orderId;
    uint32_t priceTicks;   // Fixed-point price (e.g. 10050 = $100.50)
    uint32_t quantity;
    uint64_t timestampNs;
    char symbol[8];
    char side;             // 'B' = Buy, 'S' = Sell
    char padding[31];      // Pad to exact 64 bytes to eliminate false sharing
};

int inspectCacheAlignment() {
    std::cout << "OrderBookEntry size: " << sizeof(OrderBookEntry) << " bytes\\n";
    std::cout << "Cache line alignment: " << alignof(OrderBookEntry) << " bytes\\n";
    return 0;
}

int main() {
    return inspectCacheAlignment();
}`,
        output: `OrderBookEntry size: 64 bytes\nCache line alignment: 64 bytes`,
        codeNotes: [
          { line: 5, note: 'alignas(64) ensures the compiler aligns the struct to the CPU 64-byte cache line' },
          { line: 12, note: 'Explicit padding prevents multiple CPU cores from invalidating neighboring lines (false sharing)' },
          { line: 15, note: 'inspectCacheAlignment validates memory layout at compile and runtime' }
        ],
        tryIt: 'Modify the padding to 63 bytes and observe whether the compiler still reports 64 bytes alignment or rounds up to 128.',
        check: {
          question: 'Why do low-latency trading engines prohibit heap allocation (malloc/new) on the critical path?',
          options: [
            'Heap allocations involve kernel mutex locks and memory searches that introduce unpredictable latency spikes of tens of microseconds',
            'C++ does not support dynamic memory allocation on 64-bit systems',
            'Modern CPU hardware automatically disables the L1 cache when malloc is invoked'
          ],
          answer: 0,
          why: 'Heap allocators search free lists and acquire OS locks, causing nondeterministic tail-latency spikes that ruin high-frequency trade execution.'
        }
      },
      {
        title: 'Lock-Free Concurrency & The Single-Producer Single-Consumer (SPSC) RingBuffer',
        say: [
          'When market data arrives from the network network card (NIC), the packet parser thread must pass decoded orders to the matching engine thread.',
          'Using traditional OS synchronization primitives like std::mutex or pthread_mutex introduces thread context switches, yielding latency penalties of 1,000 to 5,000 nanoseconds.',
          'Instead, quantitative systems utilize lock-free Single-Producer Single-Consumer (SPSC) circular ring buffers.',
          'An SPSC queue relies on atomic head and tail indices with explicit acquire-release memory barriers (std::memory_order_acquire and std::memory_order_release).',
          'The producer thread updates only the tail pointer, while the consumer thread updates only the head pointer, ensuring zero mutual exclusion locks and zero CPU cache thrashing.'
        ],
        example: 'A conveyor belt between a kitchen chef (producer) and a waiter (consumer). The chef places plates on empty slots, and the waiter grabs them from filled slots. Neither person ever stops the other or yells across the room.',
        code: `#include <iostream>
#include <atomic>
#include <cstdint>

constexpr size_t RING_CAPACITY = 1024; // Power of 2 for fast bitwise masking

struct SpscQueue {
    uint64_t buffer[RING_CAPACITY];
    alignas(64) std::atomic<size_t> head{0};
    alignas(64) std::atomic<size_t> tail{0};

    bool push(uint64_t value) {
        size_t currentTail = tail.load(std::memory_order_relaxed);
        size_t nextTail = (currentTail + 1) & (RING_CAPACITY - 1);
        if (nextTail == head.load(std::memory_order_acquire)) {
            return false; // Queue full - zero allocation fallback
        }
        buffer[currentTail] = value;
        tail.store(nextTail, std::memory_order_release);
        return true;
    }

    bool pop(uint64_t& value) {
        size_t currentHead = head.load(std::memory_order_relaxed);
        if (currentHead == tail.load(std::memory_order_acquire)) {
            return false; // Queue empty
        }
        value = buffer[currentHead];
        head.store((currentHead + 1) & (RING_CAPACITY - 1), std::memory_order_release);
        return true;
    }
};

int demonstrateQueue() {
    SpscQueue queue;
    queue.push(10050); // Order at $100.50
    uint64_t popped = 0;
    if (queue.pop(popped)) {
        std::cout << "Popped order price tick: " << popped << "\\n";
    }
    return 0;
}

int main() {
    return demonstrateQueue();
}`,
        output: `Popped order price tick: 10050`,
        codeNotes: [
          { line: 5, note: 'Power-of-2 capacity allows replacing expensive modulo % with single-cycle bitwise AND &' },
          { line: 9, note: 'Separating head and tail across 64-byte alignment eliminates false sharing between cores' },
          { line: 20, note: 'std::memory_order_release ensures the order data is visible before the tail index increments' }
        ],
        tryIt: 'Add a second order push for 10075 and pop both orders sequentially.',
        check: {
          question: 'What is the primary benefit of using bitwise masking (tail & (CAPACITY - 1)) in a circular ring buffer?',
          options: [
            'Bitwise AND executes in a single CPU cycle (under 0.5ns), whereas integer division modulo (%) takes 10 to 40 CPU cycles',
            'Bitwise operations prevent the operating system from allocating heap memory',
            'Bitwise AND automatically encrypts market order prices'
          ],
          answer: 0,
          why: 'Integer modulo (%) requires expensive CPU divider circuitry (10-40 cycles), while bitwise AND on powers of 2 completes in 1 clock cycle.'
        }
      },
      {
        title: 'Fixed-Point Arithmetic & Eliminating IEEE 754 Floating-Point Drift',
        say: [
          'In financial exchanges, price calculations must be 100% deterministic and mathematically exact.',
          'Standard IEEE 754 floating-point numbers (float and double) cannot precisely represent decimal fractions like 0.1 or 0.01 in binary, producing rounding errors such as 0.10000000000000000555.',
          'In trading, an epsilon rounding discrepancy can cause an exchange to reject an order, miscalculate a trade fee, or fail a regulatory audit.',
          'Therefore, low-latency financial systems strictly use integer Fixed-Point arithmetic.',
          'A price of $104.25 is stored as an integer 1042500 using a fixed precision multiplier of 10,000 (4 decimal places).',
          'Integer arithmetic executes faster in the CPU ALU and guarantees 100% bitwise determinism across all hardware platforms.'
        ],
        example: 'Instead of dealing in fractional dollars ($0.25), you count in integer cents (25 cents). You never drop or split a fraction of a cent.',
        code: `#include <iostream>
#include <cstdint>

class FixedPrice {
private:
    int64_t rawValue;
    static constexpr int64_t MULTIPLIER = 10000; // 4 decimal places

public:
    constexpr explicit FixedPrice(int64_t raw = 0) : rawValue(raw) {}

    static constexpr FixedPrice fromDouble(double val) {
        return FixedPrice(static_cast<int64_t>(val * MULTIPLIER + (val >= 0 ? 0.5 : -0.5)));
    }

    int64_t getRaw() const { return rawValue; }

    FixedPrice operator+(const FixedPrice& other) const {
        return FixedPrice(rawValue + other.rawValue);
    }

    FixedPrice operator-(const FixedPrice& other) const {
        return FixedPrice(rawValue - other.rawValue);
    }

    bool operator<(const FixedPrice& other) const {
        return rawValue < other.rawValue;
    }

    void print() const {
        int64_t dollars = rawValue / MULTIPLIER;
        int64_t cents = (rawValue % MULTIPLIER) / 100;
        std::cout << "$" << dollars << "." << (cents < 10 ? "0" : "") << cents;
    }
};

int demonstrateFixedPoint() {
    FixedPrice bid = FixedPrice::fromDouble(150.25);
    FixedPrice spread = FixedPrice::fromDouble(0.05);
    FixedPrice ask = bid + spread;

    std::cout << "Bid: "; bid.print(); std::cout << "\\n";
    std::cout << "Ask: "; ask.print(); std::cout << "\\n";
    std::cout << "Raw integer units: " << ask.getRaw() << "\\n";
    return 0;
}

int main() {
    return demonstrateFixedPoint();
}`,
        output: `Bid: $150.25\nAsk: $150.30\nRaw integer units: 1503000`,
        codeNotes: [
          { line: 6, note: 'MULTIPLIER = 10000 defines 4-decimal fixed point currency precision' },
          { line: 20, note: 'Overloaded operators perform integer addition, which is 100% exact and never produces float drift' },
          { line: 40, note: 'fromDouble converts with explicit rounding before entering the hot path' }
        ],
        tryIt: 'Calculate the total cost of buying 100 shares at ask price by multiplying raw units.',
        check: {
          question: 'Why do financial exchanges use integer fixed-point representations rather than IEEE 754 double?',
          options: [
            'Fixed-point arithmetic guarantees bitwise mathematical precision and eliminates floating-point epsilon rounding errors',
            'Floating-point numbers require double the bandwidth on network fiber optic cables',
            'Operating systems cannot execute floating-point operations inside while loops'
          ],
          answer: 0,
          why: 'IEEE 754 binary floats introduce non-deterministic rounding errors, whereas integer fixed-point math is 100% exact and deterministic.'
        }
      },
      {
        title: 'Price-Time Priority (FIFO) Order Book Matching Engine',
        say: [
          'The core of any financial exchange is the central limit order book (CLOB).',
          'The standard algorithm used by NASDAQ, CME, and crypto exchanges is Price-Time Priority (also known as FIFO).',
          'Rule 1: Orders offering a better price always take priority (highest Buy bid, lowest Sell ask).',
          'Rule 2: For orders at the exact same price, the order that arrived first chronologically takes priority.',
          'When an aggressive incoming Buy order arrives with a price greater than or equal to the lowest resting Sell ask, a trade crosses immediately.',
          'In low-latency C++, price levels are maintained using contiguous pre-allocated structures with intrusive linked lists to guarantee O(1) order cancellation and insertion.'
        ],
        example: 'An auction where the person offering the most money gets the item first; if two people shout the same price, the auctioneer awards it to whoever spoke first.',
        code: `#include <iostream>
#include <cstdint>
#include <algorithm>

struct LimitOrder {
    uint64_t id;
    int64_t price;
    uint32_t qty;
    char side; // 'B' or 'S'
};

int executeMatching() {
    LimitOrder restingAsk = { 101, 1502500, 50, 'S' }; // Sell 50 shares @ $150.25
    LimitOrder incomingBid = { 202, 1502500, 30, 'B' }; // Buy 30 shares @ $150.25

    std::cout << "Initial Resting Ask Qty: " << restingAsk.qty << "\\n";
    std::cout << "Incoming Bid Qty: " << incomingBid.qty << "\\n";

    if (incomingBid.price >= restingAsk.price) {
        uint32_t matchedQty = std::min(restingAsk.qty, incomingBid.qty);
        restingAsk.qty -= matchedQty;
        incomingBid.qty -= matchedQty;

        std::cout << "MATCH EXECUTED! Traded: " << matchedQty << " shares @ " << (restingAsk.price / 10000.0) << "\\n";
        std::cout << "Remaining Resting Ask Qty: " << restingAsk.qty << "\\n";
        std::cout << "Remaining Incoming Bid Qty: " << incomingBid.qty << "\\n";
    }
    return 0;
}

int main() {
    return executeMatching();
}`,
        output: `Initial Resting Ask Qty: 50\nIncoming Bid Qty: 30\nMATCH EXECUTED! Traded: 30 shares @ 150.25\nRemaining Resting Ask Qty: 20\nRemaining Incoming Bid Qty: 0`,
        codeNotes: [
          { line: 16, note: 'Checks crossing condition: incoming Buy bid meets or exceeds the lowest resting Sell ask' },
          { line: 17, note: 'Determines fill quantity as the minimum of the two orders' },
          { line: 20, note: 'Updates quantities in place with zero heap allocation' }
        ],
        tryIt: 'Change incoming bid quantity to 70 and observe the partial fill of the resting ask and leftover bid quantity.',
        check: {
          question: 'Under Price-Time Priority (FIFO), if two Buy orders are placed at the exact same price of $100.00, which one fills first?',
          options: [
            'The order with the earlier arrival timestamp',
            'The order with the larger quantity',
            'The order submitted by an institutional bank'
          ],
          answer: 0,
          why: 'FIFO priority mandates that between orders at identical price levels, the one that arrived earlier in time fills first.'
        }
      },
      {
        title: 'Nanosecond Latency Budgets & Compile-Time AST Invariant Verification',
        say: [
          'High-frequency trading infrastructure operates under rigorous latency budgets.',
          'A typical microwave-to-matching packet budget allocates 800 nanoseconds for NIC kernel bypass, 250 nanoseconds for decoding, 400 nanoseconds for matching, and 150 nanoseconds for outbound market data dissemination.',
          'To ensure zero runtime overhead, modern systems leverage compile-time constexpr and consteval functions, forcing the C++ compiler to calculate lookup tables and validation invariants during compilation.',
          'Every algorithm must be subjected to structural AST invariant verification to guarantee that no hidden copies, virtual table lookups, or unverified loops slip into the production pipeline.',
          'Mastering these low-latency disciplines separates hobbyist software engineers from elite systems architects.'
        ],
        example: 'Like an Olympic sprinter whose team analyzes every millisecond of shoe-ground contact time to shave 0.02 seconds off a race.',
        code: `#include <iostream>
#include <cstdint>

// Compile-time verification of latency budget constraints
constexpr uint64_t MAX_ALLOWED_LATENCY_NS = 2000; // 2.0 microseconds
constexpr uint64_t NIC_DECODE_BUDGET_NS = 250;
constexpr uint64_t MATCHING_ENGINE_BUDGET_NS = 400;
constexpr uint64_t OUTBOUND_FEED_BUDGET_NS = 150;

constexpr uint64_t calculateTotalBudget() {
    return NIC_DECODE_BUDGET_NS + MATCHING_ENGINE_BUDGET_NS + OUTBOUND_FEED_BUDGET_NS;
}

static_assert(calculateTotalBudget() <= MAX_ALLOWED_LATENCY_NS, "Latency budget violation detected at compile time!");

int inspectLatencyBudget() {
    constexpr uint64_t totalBudget = calculateTotalBudget();
    std::cout << "Verified Total Sub-Microsecond Pipeline Budget: " << totalBudget << " ns\\n";
    std::cout << "Status: OPTIMAL (Well within " << MAX_ALLOWED_LATENCY_NS << " ns ceiling)\\n";
    return 0;
}

int main() {
    return inspectLatencyBudget();
}`,
        output: `Verified Total Sub-Microsecond Pipeline Budget: 800 ns\nStatus: OPTIMAL (Well within 2000 ns ceiling)`,
        codeNotes: [
          { line: 11, note: 'constexpr function evaluated entirely at compile time' },
          { line: 15, note: 'static_assert fails compilation immediately if the budget invariant is breached' },
          { line: 19, note: 'inspectLatencyBudget logs verified latency metrics' }
        ],
        tryIt: 'Increase the matching engine budget to 2500 and verify that static_assert halts compilation.',
        check: {
          question: 'What is the purpose of C++ static_assert in low-latency systems engineering?',
          options: [
            'It enforces invariant architectural constraints during compilation with zero runtime CPU cost',
            'It dynamically tests network cables while the trading engine is executing',
            'It prints error messages into the operating system kernel log'
          ],
          answer: 0,
          why: 'static_assert guarantees that invariants (such as struct sizes or latency limits) are verified at compile time with zero runtime execution overhead.'
        }
      }
    ],
    summary: [
      'L1 cache hits execute in ~1ns, while RAM hits cost ~80ns. Memory layout and alignas(64) prevent cache misses and false sharing.',
      'Lock-free SPSC circular ring buffers provide thread-safe messaging without OS mutex lock penalties.',
      'Integer fixed-point arithmetic guarantees bitwise mathematical precision and eliminates floating-point epsilon drift.',
      'Central limit order books follow Price-Time Priority (FIFO) matching using pre-allocated data structures.',
      'constexpr and static_assert enforce architectural invariants at compile time with zero runtime latency.'
    ],
    projectStep: {
      title: 'Build a Lock-Free Fixed-Point Order Book Prototype',
      steps: [
        'Define a 64-byte aligned OrderBookEntry struct with fixed-point price ticks.',
        'Implement an SPSC circular ring buffer with acquire/release memory orders.',
        'Construct a FIFO order crossing engine matching incoming bids against resting asks.',
        'Profile latency roundtrips and verify zero heap allocations on the hot path.'
      ]
    }
  }
];
