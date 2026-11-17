/**
 * Banker's Safety Algorithm Implementation
 * Mathematically rigorous and verifiable algorithm for Deadlock Avoidance.
 */

/**
 * Calculates Need matrix: Need[i][j] = Max[i][j] - Allocation[i][j]
 * @param {number[][]} maxMatrix
 * @param {number[][]} allocMatrix
 * @returns {number[][]}
 */
export function calculateNeed(maxMatrix, allocMatrix) {
  if (!maxMatrix || !allocMatrix) return [];
  return maxMatrix.map((row, i) =>
    row.map((val, j) => {
      const allocVal = (allocMatrix[i] && allocMatrix[i][j] !== undefined) ? allocMatrix[i][j] : 0;
      return Math.max(0, val - allocVal);
    })
  );
}

/**
 * Compares two vectors: checks if vectorA <= vectorB component-wise
 * @param {number[]} vectorA
 * @param {number[]} vectorB
 * @returns {{ satisfies: boolean, failedIndex: number, diff: number[] }}
 */
export function isVectorLessOrEqual(vectorA, vectorB) {
  const diff = [];
  for (let j = 0; j < vectorA.length; j++) {
    const a = vectorA[j] || 0;
    const b = vectorB[j] || 0;
    diff.push(b - a);
    if (a > b) {
      return { satisfies: false, failedIndex: j, diff };
    }
  }
  return { satisfies: true, failedIndex: -1, diff };
}

/**
 * Executes the Safety Algorithm to determine if system is in a safe state.
 * @param {number[][]} allocation 
 * @param {number[][]} max 
 * @param {number[]} available 
 * @param {string[]} [processNames]
 * @param {string[]} [resourceNames]
 * @returns {{
 *   isSafe: boolean,
 *   safeSequence: number[],
 *   safeSequenceNames: string[],
 *   finalWork: number[],
 *   finish: boolean[],
 *   unfinishedProcesses: number[],
 *   steps: Array<any>,
 *   need: number[][]
 * }}
 */
export function runSafetyAlgorithm(allocation, max, available, processNames = [], resourceNames = []) {
  const numProcesses = allocation.length;
  const numResources = available.length;
  
  const pNames = processNames.length === numProcesses 
    ? processNames 
    : Array.from({ length: numProcesses }, (_, i) => `P${i}`);

  const rNames = resourceNames.length === numResources 
    ? resourceNames 
    : Array.from({ length: numResources }, (_, j) => String.fromCharCode(65 + j));

  const need = calculateNeed(max, allocation);
  const work = [...available];
  const finish = new Array(numProcesses).fill(false);
  const safeSequence = [];
  const steps = [];

  // Step 0: Initialization
  steps.push({
    stepIndex: 0,
    type: 'INIT',
    title: 'Initialization of Vectors',
    description: `Initialized Work vector to Available [${work.join(', ')}]. All Finish flags set to false.`,
    work: [...work],
    finish: [...finish],
    safeSequence: [...safeSequence],
    currentProcess: null,
    status: 'INITIALIZING',
  });

  let progress = true;
  let iteration = 1;

  while (progress) {
    progress = false;

    for (let i = 0; i < numProcesses; i++) {
      if (!finish[i]) {
        const pName = pNames[i];
        const needI = need[i];
        const comparison = isVectorLessOrEqual(needI, work);

        if (comparison.satisfies) {
          // Process can complete!
          const prevWork = [...work];
          const allocI = allocation[i];
          
          for (let j = 0; j < numResources; j++) {
            work[j] += allocI[j];
          }
          finish[i] = true;
          safeSequence.push(i);
          progress = true;

          steps.push({
            stepIndex: steps.length,
            type: 'PROCESS_SATISFIED',
            title: `${pName} Satisfied & Released Resources`,
            description: `Need of ${pName} [${needI.join(', ')}] ≤ Work [${prevWork.join(', ')}]. Condition met! ${pName} finishes execution and returns allocated [${allocI.join(', ')}] to Work. New Work = [${work.join(', ')}].`,
            processIndex: i,
            processName: pName,
            need: [...needI],
            workBefore: prevWork,
            workAfter: [...work],
            allocated: [...allocI],
            finish: [...finish],
            safeSequence: [...safeSequence],
            safeSequenceNames: safeSequence.map(idx => pNames[idx]),
            satisfied: true,
            status: 'COMPLETED',
          });
        } else {
          // Process cannot complete with current Work
          const failedResName = rNames[comparison.failedIndex] || `R${comparison.failedIndex}`;
          steps.push({
            stepIndex: steps.length,
            type: 'PROCESS_BLOCKED',
            title: `${pName} Must Wait`,
            description: `Need of ${pName} [${needI.join(', ')}] exceeds Work [${work.join(', ')}] on resource '${failedResName}' (Need: ${needI[comparison.failedIndex]} > Work: ${work[comparison.failedIndex]}). ${pName} cannot finish yet.`,
            processIndex: i,
            processName: pName,
            need: [...needI],
            workBefore: [...work],
            workAfter: [...work],
            finish: [...finish],
            safeSequence: [...safeSequence],
            safeSequenceNames: safeSequence.map(idx => pNames[idx]),
            satisfied: false,
            failedResourceIndex: comparison.failedIndex,
            failedResourceName: failedResName,
            status: 'WAITING',
          });
        }
      }
    }

    iteration++;
    if (safeSequence.length === numProcesses) {
      break;
    }
  }

  const isSafe = finish.every(Boolean);
  const unfinishedProcesses = finish
    .map((f, idx) => (f ? null : idx))
    .filter(idx => idx !== null);

  const safeSequenceNames = safeSequence.map(i => pNames[i]);

  // Final conclusion step
  steps.push({
    stepIndex: steps.length,
    type: isSafe ? 'CONCLUSION_SAFE' : 'CONCLUSION_UNSAFE',
    title: isSafe ? 'System is in a SAFE State' : 'System is in an UNSAFE State',
    description: isSafe
      ? `All processes finished successfully. Safe execution sequence found: < ${safeSequenceNames.join(' → ')} >.`
      : `Cannot satisfy requirements for remaining processes: [${unfinishedProcesses.map(i => pNames[i]).join(', ')}]. Potential deadlock detected.`,
    isSafe,
    safeSequence,
    safeSequenceNames,
    finalWork: [...work],
    finish: [...finish],
    unfinishedProcesses,
    unfinishedProcessNames: unfinishedProcesses.map(i => pNames[i]),
  });

  return {
    isSafe,
    safeSequence,
    safeSequenceNames,
    finalWork: work,
    finish,
    unfinishedProcesses,
    unfinishedProcessNames: unfinishedProcesses.map(i => pNames[i]),
    steps,
    need,
  };
}
