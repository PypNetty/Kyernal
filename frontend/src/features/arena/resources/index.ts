export { default as ResourceDetail } from './components/ResourceDetail';
export { default as RessourcesPanel } from './components/RessourcesPanel';
export { default as RessourcesShell } from './components/RessourcesShell';
export {
  validateResourcesSearch,
  type ResourcesNavigate,
  type ResourcesSearch,
  type ResourcesTab,
} from './lib/resourcesSearch';
export { catalogSearch, docPageTitle, docsSearch } from './lib/resourcesLinks';
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
  getResourcesTheme,
  resourcesCssVars,
  RESOURCE_TYPE_CONFIG,
} from './resourcesUi';
export type { ResourcesTheme } from './resourcesUi';
export {
  openResourceUrl,
  readResourceViews,
  trackResourceView,
} from './lib/trackResourceView';
