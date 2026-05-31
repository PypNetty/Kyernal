export { default as RessourcesPanel } from './components/RessourcesPanel';
export { default as TicketResourcesList } from './components/TicketResourcesList';
export {
  ALL_CCPS,
  APPRENANT_CCPS,
  CATEGORY_LABELS,
  MOCK_RESOURCES,
} from './data/resourcesData';
export type {
  Resource,
  ResourceCategory,
  ResourceType,
} from './data/resourcesData';
export {
  getLearnerActiveCcps,
  getLearnerActiveTickets,
} from './lib/getLearnerActiveCcps';
export {
  getResourcesForActiveTickets,
  getResourcesForTicket,
} from './lib/getTicketResources';
export {
  openResourceUrl,
  readResourceViews,
  trackResourceView,
} from './lib/trackResourceView';
