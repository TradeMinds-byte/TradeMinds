import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { messages, tradeId } = await req.json()
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    const prompt = messages[messages.length - 1].content

    // Use Gemini 1.5 Flash (This is the stable, fast version)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are a pro trading tutor. Give a 1-sentence tip for: ${prompt}` }] }]
      })
    })

    const data = await response.json()
    if (data.error) throw new Error(data.error.message)
    
    const aiText = data.candidates[0].content.parts[0].text
    const supabase = createClient(supabaseUrl!, serviceKey!)

    // ONLY using the columns you confirmed: id, trade_id, sender_id, content
    const { error: dbError } = await supabase
      .from('messages')
      .insert([{
        trade_id: tradeId,
        sender_id: '00000000-0000-0000-0000-000000000000',
        content: aiText
      }])

    if (dbError) throw dbError

    return new Response(JSON.stringify({ success: true }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})