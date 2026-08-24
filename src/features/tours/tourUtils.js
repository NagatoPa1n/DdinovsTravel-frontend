import { slugify } from '@/utils/validation'

export const TOUR_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

export const emptyTour = () => ({
  title: '',
  slug: '',
  excerpt: '',
  description: '',
  price: '',
  currency: 'UZS',
  discountPrice: '',
  days: '',
  nights: '',
  groupSize: '',
  destinationId: '',
  categoryIds: [],
  coverImage: null,
  gallery: [],
  itinerary: [],
  included: [],
  excluded: [],
  status: 'draft',
  featured: false,
  seoTitle: '',
  seoDescription: '',
})

export const slugFromTitle = (title) => slugify(title)

export const effectivePrice = (tour) =>
  tour?.discountPrice ? Number(tour.discountPrice) : Number(tour?.price ?? 0)

export const discountPercent = (tour) => {
  const price = Number(tour?.price ?? 0)
  const discount = Number(tour?.discountPrice ?? 0)
  if (!price || !discount || discount >= price) return 0
  return Math.round(((price - discount) / price) * 100)
}

/** What the traveller keeps by booking at the sale price; 0 when the tour is not discounted. */
export const savedAmount = (tour) => {
  const price = Number(tour?.price ?? 0)
  const discount = Number(tour?.discountPrice ?? 0)
  if (!price || !discount || discount >= price) return 0
  return price - discount
}

export const emptyItineraryDay = (index) => ({
  day: index + 1,
  title: '',
  description: '',
})

/** Renumbers itinerary days after add/remove/reorder. */
export const normalizeItinerary = (itinerary = []) =>
  itinerary.map((day, index) => ({ ...day, day: index + 1 }))

/**
 * Serialises form state into the payload the API expects.
 * Blank selects and unset numbers are sent as null rather than "" or 0, so the API
 * reports "Destination is required" instead of failing to parse the value.
 */
export const toTourPayload = (form) => ({
  ...form,
  slug: form.slug || slugFromTitle(form.title),
  price: Number(form.price) || 0,
  discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
  days: Number(form.days) || 0,
  nights: Number(form.nights) || 0,
  groupSize: Number(form.groupSize) || null,
  destinationId: form.destinationId || null,
  categoryIds: (form.categoryIds || []).map(Number).filter(Boolean),
  itinerary: normalizeItinerary(form.itinerary),
})

/**
 * Picture to show for a tour: its cover, else the first gallery shot.
 *
 * A tour saved without a cover usually still has gallery images, and a card with an
 * empty media slot reads as broken rather than as "no cover set". Returns null only
 * when the tour genuinely has no picture at all.
 */
export const tourImage = (tour) => {
  if (tour?.coverImage?.url) return tour.coverImage
  return (tour?.gallery || []).find((media) => media?.url) || null
}
