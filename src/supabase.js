// src/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ymwpsjlwwvsbockcyvbt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inltd3Bzamx3d3ZzYm9ja2N5dmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNjM2NDAsImV4cCI6MjA2ODkzOTY0MH0.Oz024W60h5THQhz0uWyjabNFr5I8fzk40EirB1IxE-Y'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Funciones para la app
export const getVentas = async () => {
  const { data, error } = await supabase
    .from('ventas')
    .select('*')
    .order('fecha_venta', { ascending: false })
  
  if (error) console.error('Error:', error)
  return data || []
}

export const getProductos = async () => {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
  
  if (error) console.error('Error:', error)
  return data || []
}

export const getSensorData = async () => {
  const { data, error } = await supabase
    .from('sensor_lecturas')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(10)
  
  if (error) console.error('Error:', error)
  return data || []
}