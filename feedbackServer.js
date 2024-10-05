const express = require("express"); // Import Express framework
const fs = require("fs"); // File system module for writing to files
const path = require("path"); // For file paths
const app = express(); // Initialize Express app
console.log('Feedback route is registered');

// Middleware to serve static files (optional if you have static HTML/CSS)
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Feedback Server!</h1><p>Use /feedback?response=yes or /feedback?response=no to provide feedback.</p>');
});

// Route to handle the feedback from the URL parameters
app.get("/feedback", (req, res) => {
  // Extract 'response' parameter from the URL
  const feedback = req.query.response;

  // File where the feedback will be stored
  const feedbackFile = path.join(__dirname, "feedback.txt");

  // Validate the response (only accept 'yes' or 'no')
  if (feedback === "yes" || feedback === "no") {
    // Append the feedback to the file
    fs.appendFile(feedbackFile, `Feedback: ${feedback}\n`, (err) => {
      if (err) {
        console.error("Error saving feedback:", err);
        res.send("<h1>Something went wrong. Please try again later.</h1>");
        return;
      }

      // Respond to the user based on their feedback
      if (feedback === "yes") {
        res.send("<h1>Thank you for your positive feedback!</h1>");
      } else if (feedback === "no") {
        res.send(
          "<h1>Thank you for your feedback. We will work on improving!</h1>"
        );
      }
    });
  } else {
    // If an invalid response is provided
    res.send("<h1>Invalid feedback response.</h1>");
  }
});

// Set up the app to listen on port 3000 (or your preferred port)
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Feedback app running at http://localhost:${PORT}`);
});
