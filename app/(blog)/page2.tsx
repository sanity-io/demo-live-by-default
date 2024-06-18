'use client'

import {createClient, type SyncTag} from '@sanity/client'
import {useEffect, useRef, useState} from 'react'

import type {PostQueryResult} from '@/sanity.types'
import {postQuery} from '@/sanity/lib/queries'

import Post from './Post'

const slug = 'how-does-it-work'

const client = createClient({
  projectId: 'pv8y60vp',
  dataset: 'live-by-default-under-the-hood',
  // apiVersion: '2021-03-26',
  apiVersion: 'X',
  useCdn: true,
})

export default function PostPage() {
  const [pending, setPending] = useState(true)
  const [post, setPost] = useState<PostQueryResult | null>(null)
  const syncTags = useRef<SyncTag[]>([])

  if (!pending && !post?._id) {
    throw new TypeError(`Could not find a post with the slug "${slug}"`)
  }

  useEffect(() => {
    client
      .fetch(postQuery, {slug}, {filterResponse: false})
      .then((res) => {
        console.log('Fetched post', res?.result)
        setPost(res.result)
        console.log('Setting sync tags', res.syncTags || [])
        syncTags.current = res.syncTags || []
      })
      .finally(() => setPending(false))
  }, [])

  useEffect(() => {
    const subscription = client.live.events().subscribe((event) => {
      if (event.type === 'message' && event.tags.some((tag) => syncTags.current.includes(tag))) {
        console.log('Sync tags changed', event, syncTags.current)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return <Post post={post} pending={pending} />
}
