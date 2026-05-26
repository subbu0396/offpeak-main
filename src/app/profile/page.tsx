'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Mail, Phone, Shield, BookHeart, Bell, Trash2, LogOut, ChevronRight, HelpCircle, FileText, MessageSquare } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useSpaceStore } from '@/store/space-store'

function RoleBadge({ role }: { role: string }) {
  const labels: Record<string, string> = {
    SEEKER: 'Space Seeker',
    OWNER: 'Space Owner',
    MANAGER: 'Portfolio Manager',
    ADMIN: 'Administrator',
    EVENT_ORGANIZER: 'Event Organizer',
  }
  return (
    <span className="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800">
      {labels[role] ?? role}
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })
}

export default function ProfilePage() {
  const { currentUser } = useAuthStore()
  const { shortlistedIds } = useSpaceStore()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  function handleSignOut() {
    showToast('Signed out (mock — no real session)')
  }

  function handleDeleteAccount() {
    setShowDeleteDialog(false)
    showToast('Account deletion requested (mock)')
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Profile</h1>

      {/* User info card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-bold text-xl shrink-0">
            {currentUser.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="size-16 rounded-full object-cover"
              />
            ) : (
              currentUser.name.charAt(0)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold text-foreground truncate">{currentUser.name}</p>
            <p className="text-sm text-muted-foreground truncate">{currentUser.email}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <RoleBadge role={currentUser.role} />
              {currentUser.verificationStatus === 'VERIFIED' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  <Shield className="size-3" />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
        {currentUser.createdAt && (
          <p className="mt-4 text-xs text-muted-foreground">
            Member since {formatDate(currentUser.createdAt)}
          </p>
        )}
      </div>

      {/* Personal Info */}
      <section className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
        <div className="px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Personal Info</h2>
        </div>
        <div className="px-4 py-3 flex items-center gap-3">
          <User className="size-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Display name</p>
            <p className="text-sm text-foreground truncate">{currentUser.name}</p>
          </div>
          <button
            disabled
            aria-label="Edit display name"
            title="Sign in with a full account to edit profile"
            className="text-xs text-teal-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Edit
          </button>
        </div>
        <div className="px-4 py-3 flex items-center gap-3">
          <Mail className="size-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm text-foreground truncate">{currentUser.email}</p>
          </div>
          <button
            disabled
            aria-label="Edit email"
            title="Sign in with a full account to edit profile"
            className="text-xs text-teal-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Edit
          </button>
        </div>
        {currentUser.phone && (
          <div className="px-4 py-3 flex items-center gap-3">
            <Phone className="size-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm text-foreground">{currentUser.phone}</p>
            </div>
            <button
              disabled
              aria-label="Edit phone"
              title="Sign in with a full account to edit profile"
              className="text-xs text-teal-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Edit
            </button>
          </div>
        )}
      </section>

      {/* Notification Settings */}
      <section className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
        <div className="px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Preferences</h2>
        </div>
        <Link
          href="/deals/preferences"
          className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors"
        >
          <Bell className="size-4 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-foreground">Notification Settings</p>
            <p className="text-xs text-muted-foreground">Manage deal alerts and preferences</p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
        <Link
          href="/explore"
          className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors"
        >
          <BookHeart className="size-4 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-foreground">Saved Spaces</p>
            <p className="text-xs text-muted-foreground">
              {shortlistedIds.length === 0
                ? 'No spaces shortlisted yet'
                : `${shortlistedIds.length} space${shortlistedIds.length === 1 ? '' : 's'} shortlisted`}
            </p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
      </section>

      {/* Account links */}
      <section className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
        <div className="px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Account</h2>
        </div>
        <Link
          href="/messages"
          className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors"
        >
          <MessageSquare className="size-4 text-muted-foreground shrink-0" />
          <span className="flex-1 text-sm text-foreground">Messages</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
        <Link
          href="/help"
          className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors"
        >
          <HelpCircle className="size-4 text-muted-foreground shrink-0" />
          <span className="flex-1 text-sm text-foreground">Help &amp; FAQ</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
        <Link
          href="/terms"
          className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors"
        >
          <FileText className="size-4 text-muted-foreground shrink-0" />
          <span className="flex-1 text-sm text-foreground">Terms of Service</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
        <Link
          href="/privacy"
          className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors"
        >
          <Shield className="size-4 text-muted-foreground shrink-0" />
          <span className="flex-1 text-sm text-foreground">Privacy Policy</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
      </section>

      {/* Account Actions */}
      <section className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
        <div className="px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">More</h2>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
        >
          <LogOut className="size-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-foreground">Sign Out</span>
        </button>
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-left"
        >
          <Trash2 className="size-4 text-red-500 shrink-0" />
          <span className="text-sm text-red-600">Delete Account</span>
        </button>
      </section>

      {/* Delete confirmation dialog */}
      {showDeleteDialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h2 id="delete-dialog-title" className="text-lg font-semibold text-foreground">
              Delete Account?
            </h2>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="h-9 px-4 rounded-lg border border-slate-200 text-sm font-medium text-foreground hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="h-9 px-4 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-slate-900 px-4 py-2.5 text-sm text-white shadow-lg"
        >
          {toastMessage}
        </div>
      )}
    </div>
  )
}
