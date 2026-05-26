export interface MockMessage {
  id: string
  senderId: string
  text: string
  createdAt: string
}

export interface MockConversation {
  id: string
  participantId: string
  participantName: string
  participantRole: string
  spaceTitle: string
  messages: MockMessage[]
  unread: number
}

const now = Date.now()
const hr = 3600_000
const day = 86400_000

export const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    id: 'conv-001',
    participantId: 'owner-001',
    participantName: 'Sarah Okafor',
    participantRole: 'Owner',
    spaceTitle: 'Shoreditch Parking',
    unread: 2,
    messages: [
      {
        id: 'msg-001',
        senderId: 'owner-001',
        text: 'Hi! Just letting you know the parking bay will be available from 8am tomorrow.',
        createdAt: new Date(now - 2 * day).toISOString(),
      },
      {
        id: 'msg-002',
        senderId: 'seeker-001',
        text: 'Great, thanks for the heads up. Is EV charging still available?',
        createdAt: new Date(now - 2 * day + hr).toISOString(),
      },
      {
        id: 'msg-003',
        senderId: 'owner-001',
        text: 'Yes, both EV chargers are working fine. Spot 4 is closest to the entrance.',
        createdAt: new Date(now - day).toISOString(),
      },
      {
        id: 'msg-004',
        senderId: 'owner-001',
        text: 'Let me know if you need anything else before your booking!',
        createdAt: new Date(now - 2 * hr).toISOString(),
      },
    ],
  },
  {
    id: 'conv-002',
    participantId: 'manager-001',
    participantName: 'Rachel Torres',
    participantRole: 'Manager',
    spaceTitle: 'Grand Ballroom',
    unread: 0,
    messages: [
      {
        id: 'msg-005',
        senderId: 'manager-001',
        text: 'Your event booking for the Grand Ballroom has been reviewed and approved.',
        createdAt: new Date(now - 3 * day).toISOString(),
      },
      {
        id: 'msg-006',
        senderId: 'seeker-001',
        text: 'Wonderful! Could we arrange a site visit before the event date?',
        createdAt: new Date(now - 3 * day + hr).toISOString(),
      },
    ],
  },
  {
    id: 'conv-003',
    participantId: 'admin-001',
    participantName: 'System Admin',
    participantRole: 'Admin',
    spaceTitle: 'Account Verification',
    unread: 1,
    messages: [
      {
        id: 'msg-007',
        senderId: 'admin-001',
        text: 'Your account has been successfully verified. You now have full access to all OffPeak features.',
        createdAt: new Date(now - 5 * day).toISOString(),
      },
    ],
  },
]

export function getUnreadMessageCount(): number {
  return MOCK_CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0)
}
