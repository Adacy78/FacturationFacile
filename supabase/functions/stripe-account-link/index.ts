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
    const { accountId, returnUrl, refreshUrl } = await req.json()
    
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') || Deno.env.get('EXPO_PUBLIC_STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured. Please set STRIPE_SECRET_KEY in Supabase Edge Function secrets.')
    }

    // Créer un lien d'onboarding
    const linkResponse = await fetch('https://api.stripe.com/v1/account_links', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        account: accountId,
        return_url: returnUrl || `${req.headers.get('origin')}/stripe/success`,
        refresh_url: refreshUrl || `${req.headers.get('origin')}/stripe/refresh`,
        type: 'account_onboarding',
      }),
    })

    if (!linkResponse.ok) {
      const error = await linkResponse.text()
      throw new Error(`Stripe account link creation failed: ${error}`)
    }

    const link = await linkResponse.json()

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: link.url 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error creating account link:', error)
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