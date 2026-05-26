import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllFlagReports } from '@/lib/mock-data-admin'
import { getReviewsForSpace } from '@/lib/mock-data'
import type { FlagReport, Space } from '@/types'

interface ModerationInvestigationPanelProps {
  report: FlagReport
  space: Space
}

export function ModerationInvestigationPanel({ report, space }: ModerationInvestigationPanelProps) {
  const allReports = getAllFlagReports()
  const previousComplaints = allReports.filter(
    r => r.spaceId === report.spaceId && r.id !== report.id
  )
  const reviews = getReviewsForSpace(space.id).slice(0, 3)

  return (
    <div className="space-y-4">
      {/* Complaint Details */}
      <Card>
        <CardHeader>
          <CardTitle>Complaint Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Reporter ID</p>
            <p className="text-sm text-slate-700 font-mono">{report.reporterId}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Reason</p>
            <p className="text-sm font-medium text-slate-900">{report.reason}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</p>
            <p className="text-sm text-slate-700 leading-relaxed">{report.description}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Submitted</p>
            <p className="text-sm text-slate-700">
              {new Date(report.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          {report.photos && report.photos.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Evidence Photos
              </p>
              <div className="flex flex-wrap gap-2">
                {report.photos.map((photo, i) => (
                  <div
                    key={i}
                    className="relative h-24 w-32 overflow-hidden rounded-lg bg-slate-100"
                  >
                    <Image
                      src={photo}
                      alt={`Evidence ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Owner Verification */}
      <Card>
        <CardHeader>
          <CardTitle>Owner Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                space.isVerified
                  ? 'bg-green-500/10 text-green-700'
                  : 'bg-amber-500/10 text-amber-700'
              }`}
            >
              {space.isVerified ? 'Verified' : 'Pending'}
            </span>
            <span className="text-sm text-slate-600">
              {space.isVerified
                ? 'Owner has completed identity and listing verification.'
                : 'Owner verification documents are pending review.'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Previous Complaints */}
      <Card>
        <CardHeader>
          <CardTitle>Previous Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          {previousComplaints.length === 0 ? (
            <p className="text-sm text-slate-500">No previous complaints for this listing.</p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">{previousComplaints.length}</span> other{' '}
                {previousComplaints.length === 1 ? 'complaint' : 'complaints'} for this listing.
              </p>
              <ul className="space-y-1">
                {previousComplaints.map(c => (
                  <li key={c.id} className="text-xs text-slate-600 flex items-center gap-2">
                    <span className="font-medium">{c.reason}</span>
                    <span className="text-slate-500">&mdash;</span>
                    <span
                      className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                        c.status === 'OPEN'
                          ? 'bg-red-500/10 text-red-700'
                          : c.status === 'INVESTIGATING'
                          ? 'bg-amber-500/10 text-amber-700'
                          : c.status === 'RESOLVED'
                          ? 'bg-green-500/10 text-green-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {c.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-sm text-slate-500">No reviews for this listing.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-slate-900">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(review.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
