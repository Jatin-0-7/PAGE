export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    res.status(400).send("Error: 'id' parameter is missing.");
    return;
  }

  const streamURL = `https://sflex07.fun:443/JsoByStreamFlex/app/ts_live_${id}.m3u8`;

  try {
    const response = await fetch(streamURL, {
      method: 'GET',
      headers: {
        'Icy-MetaData': '1',
        'Accept-Encoding': 'identity',
        'Host': 'xott.live',
        'Connection': 'Keep-Alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      redirect: 'manual'
    });

    // Handle 302 Redirect
    const location = response.headers.get('location');
    if (response.status === 302 && location) {
      return res.redirect(302, location);
    }

    // Handle Direct Stream (200 OK)
    if (response.status === 200) {
      res.setHeader('Content-Type', 'video/MP2T');
      response.body.pipe(res);
      return;
    }

    // Handle errors
    res.status(response.status).send(`Error: Unexpected status code ${response.status}`);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
}
