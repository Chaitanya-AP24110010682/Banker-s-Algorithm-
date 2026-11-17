import assert from 'node:assert';
import { calculateNeed, runSafetyAlgorithm } from '../safetyAlgorithm.js';
import { requestResources } from '../resourceRequest.js';
import { validateSystemState, validateRequestInput } from '../validation.js';
import { INITIAL_DATA } from '../../data/initialData.js';

console.log('--- STARTING BANKEROS AUTOMATED ALGORITHM VERIFICATION ---');

const { allocation, max, available, processNames, resourceNames } = INITIAL_DATA;

// 1. Verify Need Matrix Calculation
console.log('[Test 1] Verifying calculateNeed()...');
const need = calculateNeed(max, allocation);
const expectedNeed = [
  [7, 4, 3], // P0
  [1, 2, 2], // P1
  [6, 0, 0], // P2
  [0, 1, 1], // P3
  [4, 3, 1], // P4
];
assert.deepStrictEqual(need, expectedNeed, 'Need matrix does not match expected Silberschatz textbook values');
console.log('✓ Need Matrix verified:');
console.table(need);

// 2. Verify Banker Safety Algorithm on Standard Data
console.log('\n[Test 2] Verifying runSafetyAlgorithm() on Standard Data...');
const safetyResult = runSafetyAlgorithm(allocation, max, available, processNames, resourceNames);
assert.strictEqual(safetyResult.isSafe, true, 'Standard system state should be SAFE');
assert.strictEqual(safetyResult.finish.every(Boolean), true, 'All processes must finish');
assert.strictEqual(safetyResult.unfinishedProcesses.length, 0, 'No processes should be unfinished');
console.log('✓ System is confirmed SAFE');
console.log(`✓ Safe Execution Sequence: < ${safetyResult.safeSequenceNames.join(' → ')} >`);
assert.deepStrictEqual(
  safetyResult.safeSequenceNames,
  ['P1', 'P3', 'P4', 'P0', 'P2'],
  'Safe sequence does not match expected P1 → P3 → P4 → P0 → P2'
);
assert.deepStrictEqual(safetyResult.finalWork, [10, 5, 7], 'Final Work vector should equal total system resources [10, 5, 7]');
console.log('✓ Final Work vector verified:', safetyResult.finalWork);

// 3. Verify Deadlock / Unsafe Detection
console.log('\n[Test 3] Verifying Unsafe State Detection (Available = [0, 0, 0])...');
const unsafeResult = runSafetyAlgorithm(allocation, max, [0, 0, 0], processNames, resourceNames);
assert.strictEqual(unsafeResult.isSafe, false, 'Available [0,0,0] must result in UNSAFE state');
assert.strictEqual(unsafeResult.safeSequence.length, 0, 'No safe sequence should exist');
console.log('✓ Correctly identified Unsafe state with unfinished processes:', unsafeResult.unfinishedProcessNames);

// 4. Verify Resource Request Algorithm: Check 1 (Exceeds Need)
console.log('\n[Test 4] Verifying Resource Request Check 1: Request <= Need...');
const check1Fail = requestResources({
  processIndex: 1, // P1 Need is [1, 2, 2]
  requestVector: [2, 0, 0], // requests 2 of A > Need of 1
  allocation,
  max,
  available,
  processNames,
  resourceNames,
});
assert.strictEqual(check1Fail.check1.passed, false, 'Check 1 should fail when Request > Need');
assert.strictEqual(check1Fail.decision, 'DENIED', 'Request exceeding need must be DENIED');
console.log('✓ Check 1 correctly rejected request with message:', check1Fail.check1.message);

// 5. Verify Resource Request Algorithm: Check 2 (Exceeds Available)
console.log('\n[Test 5] Verifying Resource Request Check 2: Request <= Available...');
const check2Fail = requestResources({
  processIndex: 0, // P0 Need is [7, 4, 3]
  requestVector: [4, 0, 0], // requests 4 of A > Available of 3
  allocation,
  max,
  available,
  processNames,
  resourceNames,
});
assert.strictEqual(check2Fail.check1.passed, true, 'Check 1 should pass');
assert.strictEqual(check2Fail.check2.passed, false, 'Check 2 should fail when Request > Available');
assert.strictEqual(check2Fail.decision, 'WAIT', 'Request exceeding available must WAIT');
console.log('✓ Check 2 correctly put process in WAIT state:', check2Fail.check2.message);

// 6. Verify Resource Request Algorithm: Safe Grant (P1 requests [1, 0, 2])
console.log('\n[Test 6] Verifying Safe Request Grant: P1 requests [1, 0, 2]...');
const grantedReq = requestResources({
  processIndex: 1,
  requestVector: [1, 0, 2],
  allocation,
  max,
  available,
  processNames,
  resourceNames,
});
assert.strictEqual(grantedReq.check1.passed, true);
assert.strictEqual(grantedReq.check2.passed, true);
assert.strictEqual(grantedReq.safetyResult.isSafe, true, 'Trial state must be SAFE');
assert.strictEqual(grantedReq.decision, 'GRANTED', 'Safe request must be GRANTED');
assert.strictEqual(grantedReq.rolledBack, false);
console.log('✓ Request GRANTED successfully:', grantedReq.decisionReason);

// 7. Verify Resource Request Algorithm: Unsafe Rollback (P4 requests [3, 3, 0])
console.log('\n[Test 7] Verifying Unsafe Request Rollback: P4 requests [3, 3, 0]...');
const deniedReq = requestResources({
  processIndex: 4,
  requestVector: [3, 3, 0],
  allocation,
  max,
  available,
  processNames,
  resourceNames,
});
assert.strictEqual(deniedReq.check1.passed, true);
assert.strictEqual(deniedReq.check2.passed, true);
assert.strictEqual(deniedReq.safetyResult.isSafe, false, 'Trial state is UNSAFE');
assert.strictEqual(deniedReq.decision, 'DENIED', 'Unsafe request must be DENIED');
assert.strictEqual(deniedReq.rolledBack, true, 'Trial allocations must be ROLLED BACK');
console.log('✓ Request correctly DENIED and rolled back:', deniedReq.decisionReason);

// 8. Verify Validation Engine
console.log('\n[Test 8] Verifying Validation Engine...');
const invalidAlloc = allocation.map(r => [...r]);
invalidAlloc[0][0] = 99; // Exceeds Max
const valRes = validateSystemState({ allocation: invalidAlloc, max, available });
assert.strictEqual(valRes.isValid, false, 'Validation should fail when Allocation > Max');
console.log('✓ Validation caught invalid allocation:', valRes.errors[0]);

console.log('\n======================================================');
console.log(' ALL BANKEROS CORE ALGORITHM VERIFICATION TESTS PASSED!');
console.log('======================================================\n');
