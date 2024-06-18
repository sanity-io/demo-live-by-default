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
  // apiVersion: '2024-06-18',
  apiVersion: 'X',
  useCdn: true,
})

export default function PostPage() {
  const [pending, setPending] = useState(true)
  const [post, setPost] = useState<PostQueryResult | null>(null)

  if (!pending && !post?._id) {
    throw new TypeError(`Could not find a post with the slug "${slug}"`)
  }

  useEffect(() => {
    client
      .fetch<PostQueryResult>(postQuery, {slug})
      .then((res) => {
        console.log('Fetched post', res)
        setPost(res)
      })
      .finally(() => setPending(false))
  }, [])

  return <Post post={post} pending={pending} />
}
