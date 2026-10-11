export interface CodingProblemDefinition {
  title: string;
  description: string;
  starterCode: string;
  testSuite?: string;
}

const SQL_INTERVIEW_TEST_SUITE = `CREATE TABLE employees (id INT, name TEXT, department_id INT, department TEXT, salary INT);
INSERT INTO employees VALUES (1, 'Alice', 101, 'Engineering', 95000);
INSERT INTO employees VALUES (2, 'Bob', 102, 'Marketing', 65000);
INSERT INTO employees VALUES (3, 'Charlie', 101, 'Engineering', 105000);
INSERT INTO employees VALUES (4, 'David', 103, 'Sales', 72000);
INSERT INTO employees VALUES (5, 'Emma', 101, 'Engineering', 98000);
-- CHECKS --
SELECT count(*) = 3 AS ok, 'returns all departments above the salary threshold' AS msg FROM answer;
SELECT (SELECT headcount FROM answer WHERE department_id = 101) = 3 AS ok, 'includes the correct Engineering headcount' AS msg;
SELECT (SELECT round(avg_salary) FROM answer WHERE department_id = 101) = 99333 AS ok, 'calculates the Engineering average salary' AS msg;`;

const SQL_INTERVIEW_STARTER = `SELECT department_id, COUNT(*) AS headcount, AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 50000
ORDER BY department_id;`;

export function createSemanticFallbackProblem(topicName: string, difficulty: 'easy' | 'normal' | 'hard' = 'normal') {
  const safeFn = topicName.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 24) || 'evaluate_metric';
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
    testCases: [
      { input: '[10, 20, 30], 15', expectedOutput: '2', name: 'Standard Case (>15: 20, 30)' },
      { input: '[], 0', expectedOutput: '0', name: 'Boundary Check (empty)' },
      { input: '[5, 10, 15], 20', expectedOutput: '0', name: 'Boundary Check (none match)' }
    ],
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
      starterCode: cached.starterCode[lang] || cached.starterCode.python || '',
      testSuite: typeof cached.testSuite === 'string' ? cached.testSuite : (lang === 'sql' ? SQL_INTERVIEW_TEST_SUITE : undefined)
    };
  }

  const lower = (topic + ' ' + domainStream).toLowerCase();
  let problemTitle = `${topic} Technical Assessment`;
  let problemDesc = `Implement algorithmic logic to solve real-world constraints for ${topic}.`;
  let starterCodeMap: Record<string, string> = {};

  if (lower.includes('frontend') || lower.includes('react') || lower.includes('web') || lower.includes('ui')) {
    problemTitle = `${topic}: State Batcher & Reducer`;
    problemDesc = `Implement function 'batch_state_updates' to merge queued state actions without race conditions or memory leaks.`;
    starterCodeMap = {
      python: `def batch_state_updates(initial_state, actions):\n    # TODO: Merge actions into initial_state copy and return updated state\n    pass`,
      javascript: `function batchStateUpdates(initialState, actions) {\n    // TODO: Merge actions into initialState copy and return updated state\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public Map<String, Object> batchState(Map<String, Object> state, List<Map<String, Object>> actions) {\n        // TODO: Merge actions\n        return new HashMap<>(state);\n    }\n}`,
      sql: SQL_INTERVIEW_STARTER
    };
  } else if (lower.includes('sql') || lower.includes('database') || lower.includes('db')) {
    problemTitle = `${topic}: High-Throughput Aggregations`;
    problemDesc = `Write an optimized query or function calculating monthly department expenditure and identifying salary outliers.`;
    starterCodeMap = {
      sql: SQL_INTERVIEW_STARTER,
      python: `def analyze_department_salaries(records, min_avg):\n    # TODO: Group records by department_id and filter where avg_salary > min_avg\n    pass`,
      javascript: `function analyzeDepartmentSalaries(records, minAvg) {\n    // TODO: Group records by department_id and filter where avg_salary > minAvg\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public List<Map<String, Object>> analyzeSalaries(List<Map<String, Object>> records) {\n        // TODO: Implement salary aggregation\n        return new ArrayList<>();\n    }\n}`
    };
  } else if (lower.includes('cloud') || lower.includes('devops') || lower.includes('microservice') || lower.includes('distributed')) {
    problemTitle = `${topic}: Token Bucket Rate Limiter`;
    problemDesc = `Implement function 'is_request_allowed' enforcing a maximum requests-per-second limit with burst tolerance.`;
    starterCodeMap = {
      python: `def is_request_allowed(client_id, timestamp_ms, capacity=10, refill_rate=1.0):\n    # TODO: Enforce token bucket rate limit. Return True if allowed, False otherwise\n    pass`,
      javascript: `function isRequestAllowed(clientId, timestampMs, capacity = 10, refillRate = 1.0) {\n    // TODO: Enforce token bucket rate limit. Return true if allowed, false otherwise\n}`,
      java: `public class Solution {\n    public boolean isRequestAllowed(String clientId, long timestampMs) {\n        // TODO: Enforce rate limit\n        return true;\n    }\n}`,
      sql: SQL_INTERVIEW_STARTER
    };
  } else if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('data')) {
    problemTitle = `${topic}: Cosine Similarity & Vector Matching`;
    problemDesc = `Calculate cosine similarity between query embedding vector A and candidate vector B to score relevance.`;
    starterCodeMap = {
      python: `import math\n\ndef cosine_similarity(vec_a, vec_b):\n    # TODO: Compute dot product divided by magnitude product (norm_a * norm_b)\n    # Return float rounded to 4 decimals, or 0.0 if norm is zero\n    pass`,
      javascript: `function cosineSimilarity(vecA, vecB) {\n    // TODO: Compute dot product divided by magnitude product\n    // Return number rounded to 4 decimals, or 0.0 if norm is zero\n}`,
      java: `public class Solution {\n    public double cosineSimilarity(double[] a, double[] b) {\n        // TODO: Compute cosine similarity\n        return 0.0;\n    }\n}`,
      sql: SQL_INTERVIEW_STARTER
    };
  } else {
    problemTitle = `${topic}: Longest Valid Throughput Window`;
    problemDesc = `Given an array of throughput metric integers, find the length of the longest contiguous subsegment meeting SLA bounds.`;
    starterCodeMap = {
      python: `def max_throughput_window(metrics, min_sla):\n    # TODO: Find length of longest contiguous sequence where all values >= min_sla\n    pass`,
      javascript: `function maxThroughputWindow(metrics, minSla) {\n    // TODO: Find length of longest contiguous sequence where all values >= minSla\n}`,
      java: `public class Solution {\n    public int maxThroughputWindow(int[] metrics, int minSla) {\n        // TODO: Find length of longest contiguous sequence where all values >= minSla\n        return 0;\n    }\n}`,
      sql: SQL_INTERVIEW_STARTER
    };
  }

  return {
    title: problemTitle,
    description: problemDesc,
    starterCode: lang === 'sql' ? SQL_INTERVIEW_STARTER : starterCodeMap[lang] || starterCodeMap.python || '',
    testSuite: lang === 'sql' ? SQL_INTERVIEW_TEST_SUITE : undefined
  };
}
