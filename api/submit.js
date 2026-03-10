export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { type, locationName, address, notes } = req.body;
  
    // Basic validation
    if (!type || !locationName) {
      return res.status(400).json({ error: 'Type and location name are required' });
    }
  
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Submissions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
              'Type': type,
              'Location Name': locationName,
              'Address': address || '',
              'Notes': notes || '',
              'Submitted At': new Date().toISOString().split('T')[0],
            }
          })
        }
      );
  
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Airtable error');
      }
  
      return res.status(200).json({ success: true });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Submission failed' });
    }
  }