export {
  ensureLearnerProgress,
  getLearnerProgress,
  setLearnerProgress,
} from './lib/learnerProgressStorage';
export {
  countCompletedIncidentNodes,
  countTotalIncidentNodes,
  getInProgressNode,
  getLearnerPhase,
  getLearnerTickets,
  getNextIncident,
  isNewLearner,
} from './lib/progressionView';
export type { LearnerPhase, NextIncident } from './lib/progressionView';
