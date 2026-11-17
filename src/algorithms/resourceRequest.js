/**
 * Banker's Resource Request Algorithm
 * Simulates a dynamic resource request by process P_i, performing all validation checks
 * and rolling back trial allocations if the system enters an unsafe state.
 */

import { calculateNeed, runSafetyAlgorithm } from './safetyAlgorithm.js';

/**
 * Validates and executes a resource request.
 * 
 * Check 1: Request[i] <= Need[i]
 * (Error if process requested more than its declared maximum claim)
 * 
 * Check 2: Request[i] <= Available
 * (Process must wait because insufficient resources are currently available)
 * 
 * Trial Allocation:
 *   Available = Available - Request
 *   Allocation[i] = Allocation[i] + Request
 *   Need[i] = Need[i] - Request
 * 
 * Safety Check:
 *   Run Safety Algorithm on the trial state.
 *   If safe: Request is GRANTED. State changes are committed.
 *   If unsafe: Request is DENIED. State changes are ROLLED BACK.
 * 
 * @param {object} params
 * @param {number} params.processIndex
 * @param {number[]} params.requestVector
 * @param {number[][]} params.allocation
 * @param {number[][]} params.max
 * @param {number[]} params.available
 * @param {string[]} [params.processNames]
 * @param {string[]} [params.resourceNames]
 * @returns {object} Detailed outcome of the request
 */
export function requestResources({
  processIndex,
  requestVector,
  allocation,
  max,
  available,
  processNames = [],
  resourceNames = [],
}) {
  const numProcesses = allocation.length;
  const numResources = available.length;

  const pNames = processNames.length === numProcesses
    ? processNames
    : Array.from({ length: numProcesses }, (_, i) => `P${i}`);

  const rNames = resourceNames.length === numResources
    ? resourceNames
    : Array.from({ length: numResources }, (_, j) => String.fromCharCode(65 + j));

  const pName = pNames[processIndex] || `P${processIndex}`;
  const currentNeed = calculateNeed(max, allocation);
  const processNeed = currentNeed[processIndex] || [];
  const currentAlloc = allocation[processIndex] || [];

  // Result object to track each phase
  const result = {
    processIndex,
    processName: pName,
    requestVector: [...requestVector],
    currentAvailable: [...available],
    currentAllocation: allocation.map(r => [...r]),
    currentNeed: currentNeed.map(r => [...r]),
    check1: {
      passed: true,
      message: '',
      failedResource: null,
      failedResourceName: null,
      requestVal: 0,
      needVal: 0,
    },
    check2: {
      passed: true,
      message: '',
      failedResource: null,
      failedResourceName: null,
      requestVal: 0,
      availVal: 0,
    },
    trialAvailable: null,
    trialAllocation: null,
    trialNeed: null,
    safetyResult: null,
    decision: 'PENDING', // 'GRANTED' | 'WAIT' | 'DENIED'
    decisionReason: '',
    rolledBack: false,
  };

  // CHECK 1: Request <= Need
  for (let j = 0; j < numResources; j++) {
    const req = requestVector[j] || 0;
    const nd = processNeed[j] || 0;
    if (req > nd) {
      result.check1.passed = false;
      result.check1.failedResource = j;
      result.check1.failedResourceName = rNames[j];
      result.check1.requestVal = req;
      result.check1.needVal = nd;
      result.check1.message = `Process ${pName} requested ${req} units of resource '${rNames[j]}', which exceeds its declared remaining Need of ${nd}.`;
      result.decision = 'DENIED';
      result.decisionReason = `Rejected: Process exceeded its maximum claim (Request > Need for resource ${rNames[j]}).`;
      return result;
    }
  }
  result.check1.message = `Check 1 Passed: Request [${requestVector.join(', ')}] ≤ Need [${processNeed.join(', ')}].`;

  // CHECK 2: Request <= Available
  for (let j = 0; j < numResources; j++) {
    const req = requestVector[j] || 0;
    const av = available[j] || 0;
    if (req > av) {
      result.check2.passed = false;
      result.check2.failedResource = j;
      result.check2.failedResourceName = rNames[j];
      result.check2.requestVal = req;
      result.check2.availVal = av;
      result.check2.message = `Resource '${rNames[j]}' has only ${av} available, but ${pName} requested ${req}.`;
      result.decision = 'WAIT';
      result.decisionReason = `Process must WAIT: Insufficient available resources (Available < Request for resource ${rNames[j]}).`;
      return result;
    }
  }
  result.check2.message = `Check 2 Passed: Request [${requestVector.join(', ')}] ≤ Available [${available.join(', ')}].`;

  // Perform Trial Allocation
  const trialAvailable = [...available];
  const trialAllocation = allocation.map(r => [...r]);

  for (let j = 0; j < numResources; j++) {
    trialAvailable[j] -= requestVector[j];
    trialAllocation[processIndex][j] += requestVector[j];
  }

  const trialNeed = calculateNeed(max, trialAllocation);

  result.trialAvailable = [...trialAvailable];
  result.trialAllocation = trialAllocation.map(r => [...r]);
  result.trialNeed = trialNeed.map(r => [...r]);

  // Run Safety Algorithm on trial state
  const safetyResult = runSafetyAlgorithm(
    trialAllocation,
    max,
    trialAvailable,
    pNames,
    rNames
  );

  result.safetyResult = safetyResult;

  if (safetyResult.isSafe) {
    // State is safe: Grant request
    result.decision = 'GRANTED';
    result.decisionReason = `Request GRANTED: System remains in a SAFE state with safe sequence: < ${safetyResult.safeSequenceNames.join(' → ')} >.`;
    result.rolledBack = false;
  } else {
    // State is unsafe: Deny and Roll Back
    result.decision = 'DENIED';
    result.decisionReason = `Request DENIED: Granting request leads to an UNSAFE state (potential deadlock). Allocations rolled back to original state.`;
    result.rolledBack = true;
  }

  return result;
}
