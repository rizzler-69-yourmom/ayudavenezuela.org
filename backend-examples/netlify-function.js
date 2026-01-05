// ============================================
// Netlify Function - Form Submission Handler
// Place in: netlify/functions/submit-report.js
// ============================================

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    // Parse submission data
    const data = JSON.parse(event.body)

    // Validate required fields
    const required = ['type', 'state', 'location', 'description']
    for (const field of required) {
      if (!data[field]) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Missing required field: ${field}` })
        }
      }
    }

    // Add metadata
    const submission = {
      ...data,
      timestamp: new Date().toISOString(),
      ip: event.headers['client-ip'] || event.headers['x-forwarded-for'],
      status: 'pending'
    }

    // Option 1: Send to email (using SendGrid)
    await sendToEmail(submission)

    // Option 2: Save to Airtable (free tier: 1,200 records)
    // await saveToAirtable(submission)

    // Option 3: Save to Google Sheets
    // await saveToGoogleSheets(submission)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Gracias por tu reporte. Será revisado dentro de 24 horas.'
      })
    }

  } catch (error) {
    console.error('Error processing submission:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error al procesar el reporte',
        details: error.message
      })
    }
  }
}

async function sendToEmail(submission) {
  // Using SendGrid (free tier: 100 emails/day)
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

  const msg = {
    to: 'moderacion@ayudavenezuela.org',
    from: 'reportes@ayudavenezuela.org',
    subject: `Nuevo Reporte: ${submission.type} en ${submission.state}`,
    text: formatEmailText(submission),
    html: formatEmailHTML(submission)
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(msg)
  })

  if (!response.ok) {
    throw new Error('Failed to send email')
  }
}

async function saveToAirtable(submission) {
  // Using Airtable API
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Submissions`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          Type: submission.type,
          State: submission.state,
          Location: submission.location,
          Description: submission.description,
          Contact: submission.contact || '',
          Status: 'pending',
          Timestamp: submission.timestamp,
          IP: submission.ip
        }
      })
    }
  )

  if (!response.ok) {
    throw new Error('Failed to save to Airtable')
  }
}

function formatEmailText(submission) {
  const typeNames = {
    food: 'Comida',
    health: 'Salud',
    water: 'Agua',
    shelter: 'Refugio'
  }

  return `
NUEVO REPORTE RECIBIDO

Tipo: ${typeNames[submission.type] || submission.type}
Estado: ${submission.state}
Ubicación: ${submission.location}
Descripción: ${submission.description}
Contacto: ${submission.contact || 'No proporcionado'}

Recibido: ${submission.timestamp}
IP: ${submission.ip}

---
Revisa y aprueba/rechaza este reporte en el panel de moderación.
  `.trim()
}

function formatEmailHTML(submission) {
  const typeNames = {
    food: 'Comida 🍽️',
    health: 'Salud 🏥',
    water: 'Agua 💧',
    shelter: 'Refugio 🏠'
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #FECB00; color: #00247D; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; }
    .field { margin: 10px 0; }
    .label { font-weight: bold; color: #00247D; }
    .footer { background: #00247D; color: white; padding: 15px; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🇻🇪 Nuevo Reporte - AyudaVenezuela.org</h2>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Tipo:</span> ${typeNames[submission.type] || submission.type}
      </div>
      <div class="field">
        <span class="label">Estado:</span> ${submission.state}
      </div>
      <div class="field">
        <span class="label">Ubicación:</span> ${submission.location}
      </div>
      <div class="field">
        <span class="label">Descripción:</span><br>
        ${submission.description}
      </div>
      <div class="field">
        <span class="label">Contacto:</span> ${submission.contact || 'No proporcionado'}
      </div>
      <hr>
      <div class="field" style="font-size: 12px; color: #666;">
        <div>Recibido: ${submission.timestamp}</div>
        <div>IP: ${submission.ip}</div>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0;">Revisa y aprueba/rechaza este reporte en el panel de moderación.</p>
    </div>
  </div>
</body>
</html>
  `
}

// To deploy:
// 1. Create folder: netlify/functions/
// 2. Place this file there as: submit-report.js
// 3. Set environment variables in Netlify dashboard:
//    - SENDGRID_API_KEY (or AIRTABLE_API_KEY)
// 4. Update js/app.js to call: /.netlify/functions/submit-report
