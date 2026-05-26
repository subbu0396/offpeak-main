import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OffPeak Spaces',
    short_name: 'OffPeak',
    description: 'Find and book spaces at off-peak prices',
    start_url: '/explore',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#14B8A6',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['business', 'lifestyle'],
    shortcuts: [
      {
        name: 'Explore Spaces',
        url: '/explore',
        description: 'Search for spaces',
      },
      {
        name: 'My Bookings',
        url: '/bookings',
        description: 'View your bookings',
      },
      {
        name: 'Deals',
        url: '/deals',
        description: 'Find deals and offers',
      },
    ],
  }
}
