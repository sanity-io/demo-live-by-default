'use client'

import {createClient} from '@sanity/client'
import {useEffect, useState} from 'react'

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
      .fetch(postQuery, {slug}, {filterResponse: false})
      .then((res) => {
        console.log('Fetched post', res?.result)
        setPost(res.result)
      })
      .finally(() => setPending(false))
  }, [])

  return <Post post={post} pending={pending} />
}
