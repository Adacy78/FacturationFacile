const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { accountId } = await req.json()
    
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') || Deno.env.get('EXPO_PUBLIC_STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured. Please set STRIPE_SECRET_KEY in Supabase Edge Function secrets.')
    }

    // Récupérer le statut du compte
    const accountResponse = await fetch(`https://api.stripe.com/v1/accounts/${accountId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
      },
    })

    if (!accountResponse.ok) {
      const error = await accountResponse.text()
      throw new Error(`Failed to fetch account status: ${error}`)
    }

    const account = await accountResponse.json()

    return new Response(
      JSON.stringify({ 
        success: true, 
        account: {
          id: account.id,
          charges_enabled: account.charges_enabled,
          payouts_enabled: account.payouts_enabled,
          details_submitted: account.details_submitted,
          requirements: account.requirements,
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error fetching account status:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})