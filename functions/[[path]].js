export async function onRequest(context) {
  // Get the original response
  const response = await context.next()
  
  // Get country and city from CF
  const country = context.request.cf.country
  const city = context.request.cf.city
  const continent = context.request.cf.continent
  const timezone = context.request.cf.timezone
  
  // More sophisticated language detection logic
  let detectedLang = 'en'
  
  if (country === 'ID' || 
      (country === 'MY' && ['Kuala Lumpur', 'Johor Bahru'].includes(city)) ||
      (country === 'SG' && timezone === 'Asia/Singapore')) {
    detectedLang = 'id'
  }
  
  // Clone and modify the response
  const newResponse = new Response(response.body, response)
  newResponse.headers.set('X-Detected-Language', detectedLang)
  
  return newResponse
} 