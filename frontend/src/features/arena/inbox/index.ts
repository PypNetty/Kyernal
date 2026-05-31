export { default as InboxPanel } from './components/InboxPanel';
export { buildInboxMessages } from './lib/buildInboxMessages';
export {
  INBOX_FILTERS,
  STATIC_INBOX_MESSAGES,
  tagColor,
} from './data/inboxData';
export type {
  InboxMessage,
  MessageStatus,
  MessageType,
} from './data/inboxData';
