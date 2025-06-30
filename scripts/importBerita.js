import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://vmobuofytcgdixigkopf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtb2J1b2Z5dGNnZGl4aWdrb3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MzQ3NDQsImV4cCI6MjA2NjQxMDc0NH0.o3XZ9EOCHXmneyNThzIVqDangL73jWYNeYeSBIU4Vh4'
)

const run = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts = await res.json()

  const inserts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    body: post.body,
    userId: post.userId
  }))

  const { error } = await supabase.from('berita').insert(inserts, { upsert: true })

  if (error) {
    console.error(' Insert failed:', error)
  } else {
    console.log(' Berita imported successfully.')
  }
}

run()
