addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Get the original response
  const response = await fetch(request)
  
  // Only process HTML responses
  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('text/html')) {
    return response
  }

  // Get country code from Cloudflare's CF-IPCountry header
  const country = request.headers.get('CF-IPCountry')
  
  // Create language mapping (expand as needed)
  const countryToLang = {
    'ID': 'id',
    'MY': 'id', // Malaysia might understand Indonesian
    'SG': 'en',
    'US': 'en',
    'GB': 'en',
    // Add more mappings as needed
  }
  
  // Get the default language for the country, fallback to 'en'
  const detectedLang = countryToLang[country] || 'en'
  
  // Get the HTML content
  const text = await response.text()

  // Insert the meta tag right after the first <head> tag
  const modifiedHtml = text.replace(
    '<head>',
    `<head>\n    <meta name="cf-detected-lang" content="${detectedLang}">`
  )

  // Create new response with modified HTML
  return new Response(modifiedHtml, {
    headers: response.headers
  })

  // Add this inside handleRequest
  console.log('Country:', country)
  console.log('Detected Language:', detectedLang)
} 