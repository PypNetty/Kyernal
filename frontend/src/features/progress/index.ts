export {
  ensureLearnerProgress,
  getLearnerProgress,
  getProgressRevision,
  setLearnerProgress,
  subscribeLearnerProgress,
} from './lib/learnerProgressStorage';
export {
  markTicketResolved,
  markTicketStarted,
} from './lib/learnerProgressMutations';
export type { ResolveTicketOptions } from './lib/learnerProgressMutations';
export {
  countCompletedIncidentNodes,
  countTotalIncidentNodes,
  getInProgressNode,
  getLearnerPhase,
  getLearnerTickets,
  getNextIncident,
  getTicketStatusByRouteId,
  isNewLearner,
} from './lib/progressionView';
export type { LearnerPhase, NextIncident } from './lib/progressionView';
