import {defineSanityFetch} from 'next-sanity/live-subscription'

import {client} from '@/sanity/lib/client'

export const sanityFetch = defineSanityFetch({
  client,
  searchParamKey: 'lastLiveEventId',
  draftMode: {stega: true, perspective: 'previewDrafts'},
})
