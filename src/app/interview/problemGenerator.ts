export type TestCaseTier = 'standard' | 'scale' | 'zero_empty' | 'edge_case' | 'complexity';

export interface TestCaseItem {
  input: string;
  expectedOutput: string;
  output?: string;
  name: string;
  tier: TestCaseTier;
  tierLabel: string;
}

export interface CodingProblemDefinition {
  title: string;
  description: string;
  starterCode: string;
  functionName?: string;
  testSuite?: string;
  testCases?: TestCaseItem[];
}

export const SQL_INTERVIEW_TEST_SUITE = `CREATE TABLE employees (id INT, name TEXT, department_id INT, department TEXT, salary INT);
INSERT INTO employees VALUES (1, 'Alice', 101, 'Engineering', 95000);
INSERT INTO employees VALUES (2, 'Bob', 102, 'Marketing', 65000);
INSERT INTO employees VALUES (3, 'Charlie', 101, 'Engineering', 105000);
INSERT INTO employees VALUES (4, 'David', 103, 'Sales', 72000);
INSERT INTO employees VALUES (5, 'Emma', 101, 'Engineering', 98000);
-- CHECKS --
SELECT count(*) = 3 AS ok, '[T1: Standard] returns all 3 departments exceeding salary threshold' AS msg FROM answer;
SELECT (SELECT headcount FROM answer WHERE department_id = 101) = 3 AS ok, '[T2: Scale] aggregates correct high-headcount Engineering department (3)' AS msg;
SELECT (SELECT round(avg_salary) FROM answer WHERE department_id = 101) = 99333 AS ok, '[T3: Zero/Empty] computes accurate average salary calculation' AS msg;
SELECT (SELECT count(*) FROM answer WHERE department_id NOT IN (101, 102, 103)) = 0 AS ok, '[T4: Edge/Negative] filters out non-qualifying departments and null IDs' AS msg;
SELECT (SELECT min(avg_salary) FROM answer) > 50000 AS ok, '[T5: Complexity Bounds] strictly enforces HAVING avg_salary > 50000 bound' AS msg;`;

export const SQL_INTERVIEW_STARTER = `SELECT department_id, COUNT(*) AS headcount, AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 50000
ORDER BY department_id;`;

export function createSemanticFallbackProblem(topicName: string, difficulty: 'easy' | 'normal' | 'hard' = 'normal') {
  const safeFn = topicName.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 24) || 'evaluate_metric';
  const testCases: TestCaseItem[] = [
    {
      input: '([10, 20, 30, 40], 25)',
      expectedOutput: '2',
      output: '2',
      name: '[T1: Standard] Nominal throughput check (>25: 30, 40)',
      tier: 'standard',
      tierLabel: 'T1: Standard'
    },
    {
      input: '([100, 200, 300, 400, 500, 600, 700, 800, 900, 1000], 500)',
      expectedOutput: '5',
      output: '5',
      name: '[T2: Scale] Throughput burst sequence (>500: 600..1000)',
      tier: 'scale',
      tierLabel: 'T2: Scale'
    },
    {
      input: '([], 0)',
      expectedOutput: '0',
      output: '0',
      name: '[T3: Zero/Empty] Empty sequence zero-check',
      tier: 'zero_empty',
      tierLabel: 'T3: Zero/Empty'
    },
    {
      input: '([-50, -20, 0, 10], -10)',
      expectedOutput: '2',
      output: '2',
      name: '[T4: Edge/Negative] Negative values boundary (0, 10 > -10)',
      tier: 'edge_case',
      tierLabel: 'T4: Edge/Negative'
    },
    {
      input: '([15, 15, 15, 15], 15)',
      expectedOutput: '0',
      output: '0',
      name: '[T5: Complexity Bounds] Exact threshold match boundary (strict inequality)',
      tier: 'complexity',
      tierLabel: 'T5: Complexity'
    }
  ];

  return {
    title: `${topicName} Assessment & Logic Evaluator`,
    description: `Implement function '${safeFn}' to evaluate constraints, metrics, and throughput for ${topicName}.`,
    functionName: safeFn,
    starterCode: {
      python: `def ${safeFn}(input_data, threshold):\n    # TODO: Count items in input_data strictly greater than threshold\n    # Example: [10, 20, 30], 15 -> 2\n    pass`,
      javascript: `function ${safeFn}(inputData, threshold) {\n    // TODO: Count items in inputData strictly greater than threshold\n    // Example: [10, 20, 30], 15 -> 2\n}`,
      java: `public class Solution {\n    public int ${safeFn}(int[] data, int threshold) {\n        // TODO: Count items strictly greater than threshold\n        return 0;\n    }\n}`,
      sql: SQL_INTERVIEW_STARTER
    },
    testCases,
    suggestedWhiteboardNodes: [
      { id: 'gateway', label: 'Client / Gateway', type: 'api' },
      { id: 'engine', label: `${topicName} Service`, type: 'compute' },
      { id: 'cache', label: 'Redis Cache', type: 'cache' },
      { id: 'storage', label: 'Primary DB', type: 'database' }
    ],
    testSuite: SQL_INTERVIEW_TEST_SUITE
  };
}

export function resolveDynamicCodingProblem(
  topic: string,
  domainStream: 'tech' | 'non_tech',
  lang: string,
  cached?: any
): CodingProblemDefinition {
  if (cached && cached.starterCode) {
    return {
      title: cached.title,
      description: cached.description,
      functionName: cached.functionName,
      starterCode: cached.starterCode[lang] || cached.starterCode.python || '',
      testSuite: typeof cached.testSuite === 'string' ? cached.testSuite : (lang === 'sql' ? SQL_INTERVIEW_TEST_SUITE : undefined),
      testCases: Array.isArray(cached.testCases) ? cached.testCases : undefined
    };
  }

  const lower = (topic + ' ' + domainStream).toLowerCase();
  let problemTitle = `${topic} Technical Assessment`;
  let problemDesc = `Implement algorithmic logic to solve real-world constraints for ${topic}.`;
  let starterCodeMap: Record<string, string> = {};
  let selectedFnName = 'evaluate_metric';
  let domainTestCases: TestCaseItem[] = [];

  if (lower.includes('frontend') || lower.includes('react') || lower.includes('web') || lower.includes('ui')) {
    problemTitle = `${topic}: State Batcher & Reducer`;
    problemDesc = `Implement function 'batch_state_updates' to merge queued state actions without race conditions or memory leaks.`;
    selectedFnName = lang === 'javascript' ? 'batchStateUpdates' : 'batch_state_updates';
    starterCodeMap = {
      python: `def batch_state_updates(initial_state, actions):\n    # TODO: Merge actions list into initial_state copy and return the updated state dict.\n    # Example: batch_state_updates({"count": 0}, [{"count": 1}, {"ready": True}])\n    #          -> {"count": 1, "ready": True}\n    pass`,
      javascript: `function batchStateUpdates(initialState, actions) {\n    // TODO: Merge actions array into initialState copy and return the updated state object.\n    // Example: batchStateUpdates({ count: 0 }, [{ count: 1 }, { ready: true }])\n    //          -> { count: 1, ready: true }\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public Map<String, Object> batchStateUpdates(Map<String, Object> state, List<Map<String, Object>> actions) {\n        // TODO: Merge actions\n        return new HashMap<>(state);\n    }\n}`,
      sql: SQL_INTERVIEW_STARTER
    };
    domainTestCases = [
      {
        input: '({"theme": "dark", "count": 1}, [{"count": 2}, {"ready": true}])',
        expectedOutput: '{"theme":"dark","count":2,"ready":true}',
        output: '{"theme":"dark","count":2,"ready":true}',
        name: '[T1: Standard] Nominal state batching with overwrites',
        tier: 'standard',
        tierLabel: 'T1: Standard'
      },
      {
        input: '({"a": 1}, [{"b": 2}, {"c": 3}, {"d": 4}, {"e": 5}, {"f": 6}])',
        expectedOutput: '{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6}',
        output: '{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6}',
        name: '[T2: Scale] High-throughput multi-action batch sequence',
        tier: 'scale',
        tierLabel: 'T2: Scale'
      },
      {
        input: '({"active": true}, [])',
        expectedOutput: '{"active":true}',
        output: '{"active":true}',
        name: '[T3: Zero/Empty] Empty actions batch preserves state',
        tier: 'zero_empty',
        tierLabel: 'T3: Zero/Empty'
      },
      {
        input: '({}, [{"token": "xyz", "ttl": 0}])',
        expectedOutput: '{"token":"xyz","ttl":0}',
        output: '{"token":"xyz","ttl":0}',
        name: '[T4: Edge/Negative] Empty initial state with zero/falsy updates',
        tier: 'edge_case',
        tierLabel: 'T4: Edge/Negative'
      },
      {
        input: '({"val": 0}, [{"val": 1}, {"val": 2}, {"val": 3}])',
        expectedOutput: '{"val":3}',
        output: '{"val":3}',
        name: '[T5: Complexity Bounds] Monotonic overwrite sequence terminates at final state',
        tier: 'complexity',
        tierLabel: 'T5: Complexity'
      }
    ];
  } else if (lower.includes('sql') || lower.includes('database') || lower.includes('db')) {
    problemTitle = `${topic}: High-Throughput Aggregations`;
    problemDesc = `Write an optimized query or function calculating monthly department expenditure and identifying salary outliers.`;
    selectedFnName = lang === 'javascript' ? 'analyzeDepartmentSalaries' : 'analyze_department_salaries';
    starterCodeMap = {
      sql: SQL_INTERVIEW_STARTER,
      python: `def analyze_department_salaries(records, min_avg):\n    # TODO: Group records by 'dept' and calculate average salary for each department.\n    # Return integer count of departments whose average salary strictly exceeds min_avg.\n    # Example: [{"dept": "eng", "salary": 90000}], 80000 -> 1\n    pass`,
      javascript: `function analyzeDepartmentSalaries(records, minAvg) {\n    // TODO: Group records by 'dept' and calculate average salary for each department.\n    // Return integer count of departments whose average salary strictly exceeds minAvg.\n    // Example: [{ dept: "eng", salary: 90000 }], 80000 -> 1\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public int analyzeDepartmentSalaries(List<Map<String, Object>> records, int minAvg) {\n        // TODO: Count qualifying departments\n        return 0;\n    }\n}`
    };
    domainTestCases = [
      {
        input: '([{"dept": "eng", "salary": 100000}, {"dept": "eng", "salary": 80000}, {"dept": "sales", "salary": 50000}], 70000)',
        expectedOutput: '1',
        output: '1',
        name: '[T1: Standard] Average salary calculation across departments',
        tier: 'standard',
        tierLabel: 'T1: Standard'
      },
      {
        input: '([{"dept": "d1", "salary": 120000}, {"dept": "d2", "salary": 110000}, {"dept": "d3", "salary": 100000}], 90000)',
        expectedOutput: '3',
        output: '3',
        name: '[T2: Scale] Multi-department throughput count evaluation',
        tier: 'scale',
        tierLabel: 'T2: Scale'
      },
      {
        input: '([], 50000)',
        expectedOutput: '0',
        output: '0',
        name: '[T3: Zero/Empty] Empty employee records returns 0 qualified departments',
        tier: 'zero_empty',
        tierLabel: 'T3: Zero/Empty'
      },
      {
        input: '([{"dept": "hr", "salary": 45000}, {"dept": "ops", "salary": 30000}], 60000)',
        expectedOutput: '0',
        output: '0',
        name: '[T4: Edge/Negative] No departments exceed minimum average threshold',
        tier: 'edge_case',
        tierLabel: 'T4: Edge/Negative'
      },
      {
        input: '([{"dept": "eng", "salary": 80000}, {"dept": "eng", "salary": 80000}], 80000)',
        expectedOutput: '0',
        output: '0',
        name: '[T5: Complexity Bounds] Strict inequality boundary (average equals threshold)',
        tier: 'complexity',
        tierLabel: 'T5: Complexity'
      }
    ];
  } else if (lower.includes('cloud') || lower.includes('devops') || lower.includes('microservice') || lower.includes('distributed')) {
    problemTitle = `${topic}: Token Bucket Rate Limiter`;
    problemDesc = `Implement function 'is_request_allowed' enforcing a sliding window request rate limit.`;
    selectedFnName = lang === 'javascript' ? 'isRequestAllowed' : 'is_request_allowed';
    starterCodeMap = {
      python: `def is_request_allowed(timestamps, current_ts, limit, window_ms=1000):\n    # TODO: Enforce sliding window rate limit.\n    # Count past timestamps in [current_ts - window_ms, current_ts].\n    # Return True if count < limit (allowing the new request), False otherwise.\n    pass`,
      javascript: `function isRequestAllowed(timestamps, currentTs, limit, windowMs = 1000) {\n    // TODO: Enforce sliding window rate limit.\n    // Count past timestamps in [currentTs - windowMs, currentTs].\n    // Return true if count < limit (allowing the new request), false otherwise.\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public boolean isRequestAllowed(List<Long> timestamps, long currentTs, int limit, long windowMs) {\n        // TODO: Enforce rate limit\n        return true;\n    }\n}`,
      sql: SQL_INTERVIEW_STARTER
    };
    domainTestCases = [
      {
        input: '([100, 200, 300], 400, 5, 1000)',
        expectedOutput: 'true',
        output: 'true',
        name: '[T1: Standard] Request rate within nominal window limits',
        tier: 'standard',
        tierLabel: 'T1: Standard'
      },
      {
        input: '([100, 200, 300, 400, 500, 600], 700, 5, 1000)',
        expectedOutput: 'false',
        output: 'false',
        name: '[T2: Scale] Burst traffic exceeds maximum allowed capacity',
        tier: 'scale',
        tierLabel: 'T2: Scale'
      },
      {
        input: '([], 500, 10, 1000)',
        expectedOutput: 'true',
        output: 'true',
        name: '[T3: Zero/Empty] Initial request with empty history is allowed',
        tier: 'zero_empty',
        tierLabel: 'T3: Zero/Empty'
      },
      {
        input: '([50, 100], 2000, 2, 1000)',
        expectedOutput: 'true',
        output: 'true',
        name: '[T4: Edge/Negative] Window expiry flushes expired timestamps',
        tier: 'edge_case',
        tierLabel: 'T4: Edge/Negative'
      },
      {
        input: '([1000, 1000, 1000], 1000, 3, 1000)',
        expectedOutput: 'false',
        output: 'false',
        name: '[T5: Complexity Bounds] Concurrent identical timestamp burst boundary',
        tier: 'complexity',
        tierLabel: 'T5: Complexity'
      }
    ];
  } else if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('data')) {
    problemTitle = `${topic}: Cosine Similarity & Vector Matching`;
    problemDesc = `Calculate cosine similarity between query embedding vector A and candidate vector B to score relevance.`;
    selectedFnName = lang === 'javascript' ? 'cosineSimilarity' : 'cosine_similarity';
    starterCodeMap = {
      python: `import math\n\ndef cosine_similarity(vec_a, vec_b):\n    # TODO: Compute dot product divided by (norm_a * norm_b).\n    # Return float rounded to 4 decimals, or 0.0 if either norm is zero.\n    # Example: [1.0, 0.0], [1.0, 0.0] -> 1.0\n    pass`,
      javascript: `function cosineSimilarity(vecA, vecB) {\n    // TODO: Compute dot product divided by (normA * normB).\n    // Return number rounded to 4 decimals, or 0.0 if either norm is zero.\n    // Example: [1.0, 0.0], [1.0, 0.0] -> 1.0\n}`,
      java: `public class Solution {\n    public double cosineSimilarity(double[] a, double[] b) {\n        // TODO: Compute cosine similarity\n        return 0.0;\n    }\n}`,
      sql: SQL_INTERVIEW_STARTER
    };
    domainTestCases = [
      {
        input: '([1.0, 0.0], [1.0, 0.0])',
        expectedOutput: '1.0',
        output: '1.0',
        name: '[T1: Standard] Identical unit vectors (similarity = 1.0)',
        tier: 'standard',
        tierLabel: 'T1: Standard'
      },
      {
        input: '([1.0, 2.0, 3.0, 4.0, 5.0], [5.0, 4.0, 3.0, 2.0, 1.0])',
        expectedOutput: '0.6364',
        output: '0.6364',
        name: '[T2: Scale] Multi-dimensional embedding vector match',
        tier: 'scale',
        tierLabel: 'T2: Scale'
      },
      {
        input: '([0.0, 0.0], [1.0, 1.0])',
        expectedOutput: '0.0',
        output: '0.0',
        name: '[T3: Zero/Empty] Zero-magnitude vector handles zero-division cleanly (0.0)',
        tier: 'zero_empty',
        tierLabel: 'T3: Zero/Empty'
      },
      {
        input: '([1.0, 0.0], [-1.0, 0.0])',
        expectedOutput: '-1.0',
        output: '-1.0',
        name: '[T4: Edge/Negative] Diametrically opposite orthogonal vectors (-1.0)',
        tier: 'edge_case',
        tierLabel: 'T4: Edge/Negative'
      },
      {
        input: '([1.0, 0.0], [0.0, 1.0])',
        expectedOutput: '0.0',
        output: '0.0',
        name: '[T5: Complexity Bounds] Perfectly orthogonal vector boundary (similarity = 0.0)',
        tier: 'complexity',
        tierLabel: 'T5: Complexity'
      }
    ];
  } else {
    problemTitle = `${topic}: Longest Valid Throughput Window`;
    problemDesc = `Given an array of throughput metric integers, find the length of the longest contiguous subsegment meeting SLA bounds.`;
    selectedFnName = lang === 'javascript' ? 'maxThroughputWindow' : 'max_throughput_window';
    starterCodeMap = {
      python: `def max_throughput_window(metrics, min_sla):\n    # TODO: Find length of longest contiguous sequence where all values >= min_sla.\n    # Example: [10, 50, 60, 70, 20, 80], 50 -> 3\n    pass`,
      javascript: `function maxThroughputWindow(metrics, minSla) {\n    // TODO: Find length of longest contiguous sequence where all values >= minSla.\n    // Example: [10, 50, 60, 70, 20, 80], 50 -> 3\n}`,
      java: `public class Solution {\n    public int maxThroughputWindow(int[] metrics, int minSla) {\n        // TODO: Find length of longest contiguous sequence where all values >= minSla\n        return 0;\n    }\n}`,
      sql: SQL_INTERVIEW_STARTER
    };
    domainTestCases = [
      {
        input: '([10, 50, 60, 70, 20, 80], 50)',
        expectedOutput: '3',
        output: '3',
        name: '[T1: Standard] Longest contiguous window meeting SLA (50, 60, 70: len 3)',
        tier: 'standard',
        tierLabel: 'T1: Standard'
      },
      {
        input: '([100, 200, 300, 400, 500, 600, 700], 50)',
        expectedOutput: '7',
        output: '7',
        name: '[T2: Scale] Sustained high-throughput stream across entire window',
        tier: 'scale',
        tierLabel: 'T2: Scale'
      },
      {
        input: '([], 50)',
        expectedOutput: '0',
        output: '0',
        name: '[T3: Zero/Empty] Empty metric stream returns 0',
        tier: 'zero_empty',
        tierLabel: 'T3: Zero/Empty'
      },
      {
        input: '([10, 20, 30], 40)',
        expectedOutput: '0',
        output: '0',
        name: '[T4: Edge/Negative] No data points satisfy minimum SLA',
        tier: 'edge_case',
        tierLabel: 'T4: Edge/Negative'
      },
      {
        input: '([50, 20, 50, 50, 10, 50, 50, 50], 50)',
        expectedOutput: '3',
        output: '3',
        name: '[T5: Complexity Bounds] Multiple non-adjacent burst segments selects maximum',
        tier: 'complexity',
        tierLabel: 'T5: Complexity'
      }
    ];
  }

  return {
    title: problemTitle,
    description: problemDesc,
    functionName: selectedFnName,
    starterCode: lang === 'sql' ? SQL_INTERVIEW_STARTER : starterCodeMap[lang] || starterCodeMap.python || '',
    testSuite: lang === 'sql' ? SQL_INTERVIEW_TEST_SUITE : undefined,
    testCases: lang === 'sql' ? undefined : domainTestCases
  };
}
