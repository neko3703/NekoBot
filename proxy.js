// Neko Code Guild Count Proxy Server
// This server forwards requests to the protected Discord API and adds necessary CORS headers.
import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

// --- CONFIGURATION ---
// The user confirmed the API is public and requires no key.
const NEKO_CODE_API_URL = "https://guild-api.nekocode.in/servers";

// Middleware to handle CORS requests from your website
app.use((req, res, next) => {
    // Allows requests from any origin (required for your public website to access localhost/proxy)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET");
    next();
});

// Route to fetch and proxy the guild count
app.get('/servers', async (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] Request received for /servers`);

    try {
        // 1. Fetch data from the external Discord API
        // NOTE: No Authorization header is included, as the API is confirmed to be public.
        const apiResponse = await fetch(NEKO_CODE_API_URL, {
            method: 'GET'
        });

        // 2. Handle non-successful HTTP status codes (e.g., 404, 500)
        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error(`ERROR: External API request failed with status ${apiResponse.status}. Response: ${errorText.substring(0, 100)}...`);
            // Proxy the failure status back to the client
            return res.status(apiResponse.status).json({ error: `External API error: ${apiResponse.statusText}` });
        }

        // 3. Parse the JSON response
        const data = await apiResponse.json();
        
        // 4. Validate the required 'guildCount' property
        if (typeof data.guildCount !== 'number') {
            console.error("ERROR: External API returned invalid data format. Expected 'guildCount' number.");
            return res.status(500).json({ error: "Invalid data format from source API." });
        }

        // 5. Success: Send the validated data back to the client
        console.log(`[${new Date().toLocaleTimeString()}] Successfully fetched and returned guild count: ${data.guildCount}`);
        res.json(data);

    } catch (error) {
        // Handle general fetch errors (network down, DNS issue, timeout)
        console.error("FATAL ERROR during proxy fetch:", error.message);
        res.status(500).json({ error: "Proxy connection error." });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`\n✅ Neko Code Guild Proxy running successfully on http://localhost:${port}`);
    console.log(`   Client should fetch from: http://localhost:${port}/servers`);
});
