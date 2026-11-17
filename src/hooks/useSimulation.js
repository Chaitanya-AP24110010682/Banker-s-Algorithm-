import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { INITIAL_DATA } from '../data/initialData';
import { PRESETS } from '../data/presets';
import { calculateNeed, runSafetyAlgorithm } from '../algorithms/safetyAlgorithm';
import { validateSystemState } from '../algorithms/validation';
import { sound } from '../utils/audio';

export function useSimulation() {
  // Primary OS System State
  const [allocation, setAllocation] = useState(INITIAL_DATA.allocation);
  const [max, setMax] = useState(INITIAL_DATA.max);
  const [available, setAvailable] = useState(INITIAL_DATA.available);
  const [processNames, setProcessNames] = useState(INITIAL_DATA.processNames);
  const [resourceNames, setResourceNames] = useState(INITIAL_DATA.resourceNames);
  const [activePresetId, setActivePresetId] = useState('textbook-safe');

  // Simulation Stepper State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5x, 1x, 2x, 4x
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync sound utility
  useEffect(() => {
    sound.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Dynamically calculate Need matrix
  const need = useMemo(() => {
    return calculateNeed(max, allocation);
  }, [max, allocation]);

  // Validate state
  const validation = useMemo(() => {
    return validateSystemState({ allocation, max, available });
  }, [allocation, max, available]);

  // Run Safety Algorithm whenever matrices change
  const safetyState = useMemo(() => {
    if (!validation.isValid) {
      return {
        isSafe: false,
        safeSequence: [],
        safeSequenceNames: [],
        finalWork: [...available],
        finish: new Array(allocation.length).fill(false),
        unfinishedProcesses: allocation.map((_, i) => i),
        unfinishedProcessNames: processNames,
        steps: [],
        need,
      };
    }
    return runSafetyAlgorithm(allocation, max, available, processNames, resourceNames);
  }, [allocation, max, available, processNames, resourceNames, validation.isValid, need]);

  const steps = safetyState.steps || [];

  // Reset step index if matrices change or steps length changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [allocation, max, available]);

  // Stepper controls
  const nextStep = useCallback(() => {
    setCurrentStepIndex(curr => {
      if (curr < steps.length - 1) {
        sound.playStep();
        return curr + 1;
      }
      setIsPlaying(false);
      return curr;
    });
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex(curr => {
      if (curr > 0) {
        sound.playStep();
        return curr - 1;
      }
      return 0;
    });
  }, []);

  const goToStep = useCallback((index) => {
    if (index >= 0 && index < steps.length) {
      sound.playStep();
      setCurrentStepIndex(index);
    }
  }, [steps.length]);

  const resetSimulation = useCallback(() => {
    sound.playClick();
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const togglePlay = useCallback(() => {
    sound.playClick();
    setIsPlaying(p => {
      // If at end, restart
      if (!p && currentStepIndex >= steps.length - 1) {
        setCurrentStepIndex(0);
      }
      return !p;
    });
  }, [currentStepIndex, steps.length]);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.max(300, 1600 / playbackSpeed);
    const timer = setInterval(() => {
      setCurrentStepIndex(curr => {
        if (curr < steps.length - 1) {
          sound.playStep();
          return curr + 1;
        } else {
          setIsPlaying(false);
          if (safetyState.isSafe) {
            sound.playSuccess();
          } else {
            sound.playWarning();
          }
          return curr;
        }
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, steps.length, safetyState.isSafe]);

  // Matrix Editing Handlers
  const updateAllocationCell = useCallback((pIdx, rIdx, val) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 0) return;
    setAllocation(prev => {
      const next = prev.map(row => [...row]);
      next[pIdx][rIdx] = num;
      return next;
    });
  }, []);

  const updateMaxCell = useCallback((pIdx, rIdx, val) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 0) return;
    setMax(prev => {
      const next = prev.map(row => [...row]);
      next[pIdx][rIdx] = num;
      return next;
    });
  }, []);

  const updateAvailableCell = useCallback((rIdx, val) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 0) return;
    setAvailable(prev => {
      const next = [...prev];
      next[rIdx] = num;
      return next;
    });
  }, []);

  const addProcess = useCallback((customName) => {
    sound.playClick();
    const newIdx = allocation.length;
    const name = customName || `P${newIdx}`;
    const numRes = available.length;
    setProcessNames(prev => [...prev, name]);
    setAllocation(prev => [...prev, new Array(numRes).fill(0)]);
    setMax(prev => [...prev, new Array(numRes).fill(1)]);
  }, [allocation.length, available.length]);

  const removeProcess = useCallback((idxToRemove) => {
    if (allocation.length <= 1) return;
    sound.playClick();
    setProcessNames(prev => prev.filter((_, i) => i !== idxToRemove));
    setAllocation(prev => prev.filter((_, i) => i !== idxToRemove));
    setMax(prev => prev.filter((_, i) => i !== idxToRemove));
  }, [allocation.length]);

  const addResource = useCallback((customName, defaultAvail = 3) => {
    sound.playClick();
    const newIdx = available.length;
    const name = customName || String.fromCharCode(65 + newIdx);
    setResourceNames(prev => [...prev, name]);
    setAvailable(prev => [...prev, defaultAvail]);
    setAllocation(prev => prev.map(row => [...row, 0]));
    setMax(prev => prev.map(row => [...row, 2]));
  }, [available.length]);

  const removeResource = useCallback((idxToRemove) => {
    if (available.length <= 1) return;
    sound.playClick();
    setResourceNames(prev => prev.filter((_, j) => j !== idxToRemove));
    setAvailable(prev => prev.filter((_, j) => j !== idxToRemove));
    setAllocation(prev => prev.map(row => row.filter((_, j) => j !== idxToRemove)));
    setMax(prev => prev.map(row => row.filter((_, j) => j !== idxToRemove)));
  }, [available.length]);

  const renameProcess = useCallback((idx, newName) => {
    setProcessNames(prev => {
      const next = [...prev];
      next[idx] = newName.trim() || `P${idx}`;
      return next;
    });
  }, []);

  const renameResource = useCallback((idx, newName) => {
    setResourceNames(prev => {
      const next = [...prev];
      next[idx] = newName.trim() || String.fromCharCode(65 + idx);
      return next;
    });
  }, []);

  const loadPreset = useCallback((presetId) => {
    const found = PRESETS.find(p => p.id === presetId);
    if (!found) return;
    sound.playClick();
    setActivePresetId(presetId);
    setProcessNames([...found.data.processNames]);
    setResourceNames([...found.data.resourceNames]);
    setAllocation(found.data.allocation.map(r => [...r]));
    setMax(found.data.max.map(r => [...r]));
    setAvailable([...found.data.available]);
  }, []);

  const resetToDefault = useCallback(() => {
    loadPreset('textbook-safe');
  }, [loadPreset]);

  // Apply a granted resource request permanently to the system
  const applyGrantedRequest = useCallback((processIndex, requestVector) => {
    sound.playGranted();
    setAvailable(prev => {
      const next = [...prev];
      for (let j = 0; j < next.length; j++) {
        next[j] -= requestVector[j];
      }
      return next;
    });
    setAllocation(prev => {
      const next = prev.map(r => [...r]);
      for (let j = 0; j < available.length; j++) {
        next[processIndex][j] += requestVector[j];
      }
      return next;
    });
  }, [available.length]);

  return {
    // Matrices & Data
    allocation,
    max,
    need,
    available,
    processNames,
    resourceNames,
    validation,
    safetyState,
    activePresetId,

    // Step state
    steps,
    currentStepIndex,
    currentStep: steps[currentStepIndex] || null,
    isPlaying,
    playbackSpeed,
    soundEnabled,

    // Controls
    setPlaybackSpeed,
    setSoundEnabled,
    nextStep,
    prevStep,
    goToStep,
    resetSimulation,
    togglePlay,

    // Mutators
    updateAllocationCell,
    updateMaxCell,
    updateAvailableCell,
    addProcess,
    removeProcess,
    addResource,
    removeResource,
    renameProcess,
    renameResource,
    loadPreset,
    resetToDefault,
    applyGrantedRequest,
  };
}
