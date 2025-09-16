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
    const { companyData } = await req.json()
    
    // Validate required company data
    if (!companyData || !companyData.name || !companyData.email || !companyData.siren) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required company data: name, email, and siren are required' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }
    
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') || Deno.env.get('EXPO_PUBLIC_STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Stripe secret key not configured. Please set STRIPE_SECRET_KEY in Supabase Edge Function secrets.' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    // Sanitize SIREN to contain only digits
    const sanitizedSiren = companyData.siren.replace(/\D/g, '')
    
    // Validate SIREN length (should be 9 digits)
    if (sanitizedSiren.length !== 9) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Invalid SIREN format. Expected 9 digits, got ${sanitizedSiren.length}` 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // Sanitize and validate postal code
    const sanitizedPostalCode = companyData.postal_code.replace(/\D/g, '')
    
    // Validate postal code length (should be 5 digits for France)
    if (sanitizedPostalCode.length !== 5) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Invalid postal code format. Expected 5 digits, got ${sanitizedPostalCode.length}` 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // Créer un compte Express Stripe
    const accountResponse = await fetch('https://api.stripe.com/v1/accounts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        type: 'express',
        country: 'FR',
        business_type: 'company',
        email: companyData.email,
        'business_profile[name]': companyData.name,
        'business_profile[url]': companyData.website || '',
        'company[name]': companyData.name,
        'company[tax_id]': sanitizedSiren,
        'company[address][line1]': companyData.address,
        'company[address][city]': companyData.city,
        'company[address][postal_code]': sanitizedPostalCode,
        'company[address][country]': 'FR',
      }),
    })

    if (!accountResponse.ok) {
      const errorText = await accountResponse.text()
      console.error('Stripe API Error:', errorText)
      
      let errorMessage = 'Failed to create Stripe account'
      try {
        const errorData = JSON.parse(errorText)
        if (errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message
        }
      } catch (parseError) {
        // If we can't parse the error, use the raw text
        errorMessage = errorText
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Stripe account creation failed: ${errorMessage}` 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: accountResponse.status,
        },
      )
    }

    const account = await accountResponse.json()

    return new Response(
      JSON.stringify({ 
        success: true, 
        accountId: account.id,
        account: account 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error creating Stripe account:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unexpected error occurred' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})