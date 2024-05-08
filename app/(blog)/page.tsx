'use client'

import {type PortableTextBlock, type SyncTag} from 'next-sanity'

import Avatar from './avatar'
import CoverImage from './cover-image'
import DateComponent from './date'
import PortableText from './portable-text'

import type {PostQueryResult} from '@/sanity.types'
import {postQuery} from '@/sanity/lib/queries'
import {useEffect, useRef, useState} from 'react'
import {client} from '@/sanity/lib/client'

const slug = 'how-does-it-work'

export default function PostPage() {
  const [pending, setPending] = useState(true)
  const [post, setPost] = useState<PostQueryResult | null>(null)
  const [lastLiveEventId, setLastLiveEventId] = useState('')
  const syncTags = useRef<SyncTag[]>([])

  if (!pending && !post?._id) {
    throw new TypeError(`Could not find a post with the slug "${slug}"`)
  }

  useEffect(() => {
    client
      .fetch(postQuery, {slug}, {filterResponse: false, lastLiveEventId})
      .then((res) => {
        setPost(res.result)
        syncTags.current = res.syncTags || []
      })
      .finally(() => setPending(false))
  }, [lastLiveEventId])

  useEffect(() => {
    const subscription = client.live.events().subscribe((event) => {
      if (
        event.type === 'message' &&
        Array.isArray(syncTags.current) &&
        event.tags.some((tag) => syncTags.current.includes(tag))
      ) {
        setLastLiveEventId(event.id)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  if (pending || !post) {
    return (
      <section className="flex justify-center py-12 md:py-16 lg:py-20">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 dark:text-white text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </section>
    )
  }

  return (
    <div className="container mx-auto px-5">
      <article>
        <h1 className="text-balance mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl md:leading-none lg:text-8xl">
          {post.title}
        </h1>
        <div className="hidden md:mb-12 md:block">
          {post.author && <Avatar name={post.author.name} picture={post.author.picture} />}
        </div>
        <div className="mb-8 sm:mx-0 md:mb-16">
          <CoverImage image={post.coverImage} priority />
        </div>
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 block md:hidden">
            {post.author && <Avatar name={post.author.name} picture={post.author.picture} />}
          </div>
          <div className="mb-6 text-lg">
            <div className="mb-4 text-lg">
              <DateComponent dateString={post.date} />
            </div>
          </div>
        </div>
        {post.content?.length && (
          <PortableText className="mx-auto max-w-2xl" value={post.content as PortableTextBlock[]} />
        )}
      </article>
    </div>
  )
}
