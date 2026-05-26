'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'
import Map, { Marker } from 'react-map-gl/maplibre'
import { MapPin } from 'lucide-react'
import { useSpaceStore } from '@/store/space-store'
import { getPricingForSpace } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import type { Space } from '@/types'

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

const INITIAL_VIEW_STATE = {
  latitude: 54.5,
  longitude: -2,
  zoom: 5.5,
}

// ─── Error Boundary ──────────────────────────────────────────────────────────

interface ErrorBoundaryState {
  hasError: boolean
}

class MapErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[MapView] error boundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return <MapFallback />
    }
    return this.props.children
  }
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

function MapFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-lg">
      <div className="text-center text-slate-500">
        <MapPin className="h-12 w-12 mx-auto mb-2" aria-hidden="true" />
        <p>Map unavailable. Use list view instead.</p>
      </div>
    </div>
  )
}

// ─── Price Marker ─────────────────────────────────────────────────────────────

interface PriceMarkerProps {
  space: Space
  isSelected: boolean
  onSelect: (id: string) => void
}

function PriceMarker({ space, isSelected, onSelect }: PriceMarkerProps) {
  const pricing = getPricingForSpace(space.id)
  const price = pricing?.basePrice

  return (
    <Marker
      latitude={space.location.lat}
      longitude={space.location.lng}
      anchor="bottom"
    >
      <button
        onClick={() => onSelect(space.id)}
        aria-label={`${space.title}${price !== undefined ? ` – £${price}` : ''}`}
        className={cn(
          'px-2 py-1 rounded-full text-xs font-bold shadow-md border transition-colors',
          isSelected
            ? 'bg-teal-500 text-white border-teal-600'
            : 'bg-white text-slate-900 border-slate-200 hover:bg-teal-50',
        )}
      >
        {price !== undefined ? `£${price}` : space.title.slice(0, 6)}
      </button>
    </Marker>
  )
}

// ─── MapView ──────────────────────────────────────────────────────────────────

interface MapViewProps {
  spaces: Space[]
}

function MapViewInner({ spaces }: MapViewProps) {
  const selectSpace = useSpaceStore((state) => state.selectSpace)
  const selectedSpaceId = useSpaceStore((state) => state.selectedSpaceId)

  return (
    <Map
      initialViewState={INITIAL_VIEW_STATE}
      mapStyle={MAP_STYLE}
      style={{ width: '100%', height: '100%' }}
      reuseMaps
    >
      {spaces.map((space) => (
        <PriceMarker
          key={space.id}
          space={space}
          isSelected={selectedSpaceId === space.id}
          onSelect={selectSpace}
        />
      ))}
    </Map>
  )
}

export function MapView({ spaces }: MapViewProps) {
  return (
    <div className="w-full h-full">
      <MapErrorBoundary>
        <MapViewInner spaces={spaces} />
      </MapErrorBoundary>
    </div>
  )
}
