import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://cvgclnqwsyhyitssykpt.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Z2NsbnF3c3loeWl0c3N5a3B0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMjcwNTQsImV4cCI6MjA5NjgwMzA1NH0.tjcdADS628gLSHwZWa33fKk4Rwk4v4EdIK24eRNVpnM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
