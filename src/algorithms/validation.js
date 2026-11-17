/**
 * BankerOS Input Validation Utilities
 * Ensures all matrices, vectors, and requests conform to mathematical constraints.
 */

/**
 * Validates the core system state (Allocation, Max, Available)
 * @param {object} state
 * @param {number[][]} state.allocation
 * @param {number[][]} state.max
 * @param {number[]} state.available
 * @returns {{ isValid: boolean, errors: string[], warnings: string[] }}
 */
export function validateSystemState({ allocation, max, available }) {
  const errors = [];
  const warnings = [];

  if (!Array.isArray(allocation) || allocation.length === 0) {
    errors.push('Allocation matrix must have at least one process.');
    return { isValid: false, errors, warnings };
  }

  if (!Array.isArray(max) || max.length === 0) {
    errors.push('Maximum Demand matrix must have at least one process.');
    return { isValid: false, errors, warnings };
  }

  if (!Array.isArray(available) || available.length === 0) {
    errors.push('Available vector must have at least one resource type.');
    return { isValid: false, errors, warnings };
  }

  const numProcesses = allocation.length;
  const numResources = available.length;

  if (max.length !== numProcesses) {
    errors.push(`Process count mismatch: Allocation has ${numProcesses} rows, Max has ${max.length} rows.`);
  }

  // Validate Available vector
  available.forEach((val, j) => {
    if (typeof val !== 'number' || isNaN(val) || val < 0 || !Number.isInteger(val)) {
      errors.push(`Available resource at index ${j} must be a non-negative integer.`);
    }
  });

  // Validate Allocation and Max matrices
  for (let i = 0; i < numProcesses; i++) {
    const allocRow = allocation[i] || [];
    const maxRow = max[i] || [];

    if (allocRow.length !== numResources) {
      errors.push(`Process P${i} Allocation has ${allocRow.length} columns, expected ${numResources}.`);
    }

    if (maxRow.length !== numResources) {
      errors.push(`Process P${i} Max has ${maxRow.length} columns, expected ${numResources}.`);
    }

    for (let j = 0; j < numResources; j++) {
      const aVal = allocRow[j];
      const mVal = maxRow[j];

      if (typeof aVal !== 'number' || isNaN(aVal) || aVal < 0 || !Number.isInteger(aVal)) {
        errors.push(`Process P${i}, Resource ${j}: Allocation value must be a non-negative integer.`);
      }

      if (typeof mVal !== 'number' || isNaN(mVal) || mVal < 0 || !Number.isInteger(mVal)) {
        errors.push(`Process P${i}, Resource ${j}: Max value must be a non-negative integer.`);
      }

      if (aVal > mVal) {
        errors.push(`Process P${i}, Resource ${j}: Allocation (${aVal}) cannot exceed Maximum Demand (${mVal}).`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates a resource request vector
 * @param {object} params
 * @param {number} params.processIndex
 * @param {number[]} params.requestVector
 * @param {number} params.numProcesses
 * @param {number} params.numResources
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateRequestInput({ processIndex, requestVector, numProcesses, numResources }) {
  if (processIndex < 0 || processIndex >= numProcesses) {
    return { isValid: false, error: `Invalid process index: ${processIndex}. Must be between 0 and ${numProcesses - 1}.` };
  }

  if (!Array.isArray(requestVector) || requestVector.length !== numResources) {
    return { isValid: false, error: `Request vector must have exactly ${numResources} resource elements.` };
  }

  for (let j = 0; j < numResources; j++) {
    const val = requestVector[j];
    if (typeof val !== 'number' || isNaN(val) || val < 0 || !Number.isInteger(val)) {
      return { isValid: false, error: `Resource index ${j} request must be a non-negative integer.` };
    }
  }

  return { isValid: true };
}
