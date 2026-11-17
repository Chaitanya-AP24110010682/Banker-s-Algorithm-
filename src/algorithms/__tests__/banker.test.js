import { describe, it, expect } from 'vitest';
import { calculateNeed, runSafetyAlgorithm, isVectorLessOrEqual } from '../safetyAlgorithm.js';
import { requestResources } from '../resourceRequest.js';
import { validateSystemState, validateRequestInput } from '../validation.js';
import { INITIAL_DATA } from '../../data/initialData.js';

describe("Banker's Algorithm Core Suite", () => {
  const { allocation, max, available, processNames, resourceNames } = INITIAL_DATA;

  it('correctly calculates the Need matrix as Max - Allocation', () => {
    const need = calculateNeed(max, allocation);
    const expectedNeed = [
      [7, 4, 3], // P0
      [1, 2, 2], // P1
      [6, 0, 0], // P2
      [0, 1, 1], // P3
      [4, 3, 1], // P4
    ];
    expect(need).toEqual(expectedNeed);
  });

  it('correctly runs Safety Algorithm on standard data and produces a safe sequence', () => {
    const result = runSafetyAlgorithm(allocation, max, available, processNames, resourceNames);
    
    expect(result.isSafe).toBe(true);
    expect(result.finish.every(Boolean)).toBe(true);
    expect(result.unfinishedProcesses.length).toBe(0);

    // Verify expected safe sequence: P1 -> P3 -> P4 -> P0 -> P2
    expect(result.safeSequenceNames).toEqual(['P1', 'P3', 'P4', 'P0', 'P2']);

    // Verify final Work vector equals total system resources: Available + sum(Allocation)
    // sum(Allocation) = [0+2+3+2+0, 1+0+0+1+0, 0+0+2+1+2] = [7, 2, 5]
    // Available = [3, 3, 2]
    // Final work = [10, 5, 7]
    expect(result.finalWork).toEqual([10, 5, 7]);
  });

  it('correctly identifies an unsafe state with deadlock', () => {
    // Unsafe state: available is [0, 0, 0]
    const result = runSafetyAlgorithm(allocation, max, [0, 0, 0], processNames, resourceNames);
    expect(result.isSafe).toBe(false);
    expect(result.safeSequence.length).toBe(0);
    expect(result.unfinishedProcesses.length).toBe(5);
  });

  describe('Resource Request Algorithm', () => {
    it('Check 1: Rejects requests exceeding declared Need', () => {
      // P1 Need is [1, 2, 2]. Request [2, 0, 0] exceeds resource A need (2 > 1)
      const res = requestResources({
        processIndex: 1,
        requestVector: [2, 0, 0],
        allocation,
        max,
        available,
        processNames,
        resourceNames,
      });

      expect(res.decision).toBe('DENIED');
      expect(res.check1.passed).toBe(false);
      expect(res.decisionReason).toContain('exceeded its maximum claim');
    });

    it('Check 2: Makes process wait if request exceeds current Available', () => {
      // Available is [3, 3, 2]. Request [4, 0, 0] exceeds available A (4 > 3)
      // Even if within Max Need, say P0 Need is [7, 4, 3]
      const res = requestResources({
        processIndex: 0,
        requestVector: [4, 0, 0],
        allocation,
        max,
        available,
        processNames,
        resourceNames,
      });

      expect(res.decision).toBe('WAIT');
      expect(res.check1.passed).toBe(true);
      expect(res.check2.passed).toBe(false);
      expect(res.decisionReason).toContain('WAIT');
    });

    it('Grants safe request and rolls back unsafe request', () => {
      // P1 requests [1, 0, 2] (Standard textbook request for P1)
      // Need[1] is [1, 2, 2] -> [1, 0, 2] <= Need[1] -> Check 1 passes
      // Available is [3, 3, 2] -> [1, 0, 2] <= Available -> Check 2 passes
      // Trial state:
      // Available becomes [2, 3, 0]
      // Alloc[1] becomes [3, 0, 2]
      // Need[1] becomes [0, 2, 0]
      // System remains safe (e.g. sequence P1 -> P3 -> P4 -> P0 -> P2 or similar)
      const safeReq = requestResources({
        processIndex: 1,
        requestVector: [1, 0, 2],
        allocation,
        max,
        available,
        processNames,
        resourceNames,
      });

      expect(safeReq.decision).toBe('GRANTED');
      expect(safeReq.safetyResult.isSafe).toBe(true);
      expect(safeReq.rolledBack).toBe(false);

      // Now test an unsafe request: P4 requests [3, 3, 0]
      // P4 Need is [4, 3, 1]. Request <= Need.
      // Available is [3, 3, 2]. Request <= Available.
      // But granting leaves Available at [0, 0, 2].
      // No process can satisfy need, so unsafe!
      const unsafeReq = requestResources({
        processIndex: 4,
        requestVector: [3, 3, 0],
        allocation,
        max,
        available,
        processNames,
        resourceNames,
      });

      expect(unsafeReq.decision).toBe('DENIED');
      expect(unsafeReq.safetyResult.isSafe).toBe(false);
      expect(unsafeReq.rolledBack).toBe(true);
    });
  });

  describe('Validation Suite', () => {
    it('catches allocation exceeding max', () => {
      const invalidAlloc = allocation.map(r => [...r]);
      invalidAlloc[0][0] = 99; // Exceeds Max[0][0] which is 7
      const validation = validateSystemState({
        allocation: invalidAlloc,
        max,
        available,
      });
      expect(validation.isValid).toBe(false);
      expect(validation.errors[0]).toContain('cannot exceed Maximum Demand');
    });

    it('validates request dimensions and non-negativity', () => {
      expect(validateRequestInput({
        processIndex: 0,
        requestVector: [-1, 0, 0],
        numProcesses: 5,
        numResources: 3,
      }).isValid).toBe(false);

      expect(validateRequestInput({
        processIndex: 99,
        requestVector: [1, 0, 0],
        numProcesses: 5,
        numResources: 3,
      }).isValid).toBe(false);
    });
  });
});
