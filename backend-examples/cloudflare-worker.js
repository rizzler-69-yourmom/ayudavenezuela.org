// ============================================
// Cloudflare Worker - Form Submission Handler
// Free tier: 100,000 requests/day
// Deploy at: dash.cloudflare.com
// ============================================

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // CORS headers for cross-origin requests
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://ayudavenezuela.org',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Handle OPTIONS request (CORS preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Only accept POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders
    })
  }

  try {
    // Parse form data
    const data = await request.json()

    // Validate required fields
    if (!data.type || !data.state || !data.location || !data.description) {
      return new Response(JSON.stringify({
        error: 'Missing required fields'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Add metadata
    const submission = {
      ...data,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('CF-Connecting-IP'),
      country: request.headers.get('CF-IPCountry'),
      status: 'pending'
    }

    // Option 1: Send email notification
    await sendEmailNotification(submission)

    // Option 2: Save to KV storage (Cloudflare Workers KV)
    // await SUBMISSIONS.put(
    //   `submission-${Date.now()}`,
    //   JSON.stringify(submission)
    // )

    // Option 3: Send to external API/database
    // await fetch('https://your-database.com/api/submissions', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(submission)
    // })

    return new Response(JSON.stringify({
      success: true,
      message: 'Submission received. Thank you!'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function sendEmailNotification(submission) {
  // Use Mailgun, SendGrid, or Cloudflare Email Workers
  // Example with Mailgun:

  const MAILGUN_API_KEY = 'YOUR_MAILGUN_API_KEY'
  const MAILGUN_DOMAIN = 'mg.ayudavenezuela.org'

  const formData = new FormData()
  formData.append('from', 'Reportes <noreply@ayudavenezuela.org>')
  formData.append('to', 'moderacion@ayudavenezuela.org')
  formData.append('subject', `Nuevo Reporte: ${submission.type} en ${submission.state}`)
  formData.append('text', formatEmailBody(submission))

  await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`api:${MAILGUN_API_KEY}`)
    },
    body: formData
  })
}

function formatEmailBody(submission) {
  return `
Nuevo reporte recibido:

Tipo: ${submission.type}
Estado: ${submission.state}
Ubicación: ${submission.location}
Descripción: ${submission.description}
Contacto: ${submission.contact || 'No proporcionado'}

Timestamp: ${submission.timestamp}
IP: ${submission.ip}
País: ${submission.country}

---
Para aprobar o rechazar, visita el panel de moderación.
  `.trim()
}

// To deploy:
// 1. Install Wrangler: npm install -g wrangler
// 2. Login: wrangler login
// 3. Create project: wrangler init ayudavenezuela-api
// 4. Deploy: wrangler publish
