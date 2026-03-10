export default async function handler(req, res) {
    const { input, placeId } = req.query;
    const key = process.env.GOOGLE_PLACES_KEY;
  
    // Geocode a selected place by ID
    if (placeId) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?` +
        new URLSearchParams({ place_id: placeId, key });
      const response = await fetch(url);
      const data = await response.json();
      if (!data.results?.[0]) return res.status(404).json({ error: 'Not found' });
      const loc = data.results[0].geometry.location;
      return res.status(200).json({ lat: loc.lat, lng: loc.lng });
    }
  
    // Autocomplete suggestions
    if (!input) return res.status(400).json({ error: 'No input' });
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
      new URLSearchParams({
        input,
        key,
        components: 'country:us',
        location: '40.7128,-74.0060',
        radius: '50000',
      });
  
    const response = await fetch(url);
    const data = await response.json();
    console.log('Google response status:', data.status, 'predictions:', data.predictions?.length);
    res.status(200).json(data);
  }