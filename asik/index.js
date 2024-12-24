const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse URL-encoded bodies (needed for the HTML form POST)
app.use(express.urlencoded({ extended: true }));

// Serve static CSS file
app.use(express.static(path.join(__dirname, 'public')));

// GET endpoint to render the BMI form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// POST endpoint to calculate the BMI
app.post('/calculate-bmi', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);

    // Check for invalid input
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        return res.send(`
            <html>
                <body>
                    <div class="container">
                        <h1>BMI Calculator</h1>
                        <p class="error">Invalid input. Please ensure weight and height are positive numbers.</p>
                        <a href="/">Back to calculator</a>
                    </div>
                </body>
            </html>
        `);
    }

    // Calculate BMI
    const bmi = weight / (height * height);

    // Determine BMI category
    let bmiCategory = '';
    let categoryClass = '';

    if (bmi < 18.5) {
        bmiCategory = 'Underweight';
        categoryClass = 'underweight';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        bmiCategory = 'Normal weight';
        categoryClass = 'normal';
    } else if (bmi >= 25 && bmi < 29.9) {
        bmiCategory = 'Overweight';
        categoryClass = 'overweight';
    } else {
        bmiCategory = 'Obese';
        categoryClass = 'obese';
    }

    // Display the result
    res.send(`
        <html>
            <head>
                <link rel="stylesheet" type="text/css" href="/index.css">
            </head>
            <body>
                <div class="container">
                    <h1>Your BMI is: ${bmi.toFixed(2)}</h1>
                    <p class="${categoryClass}">${bmiCategory}</p>
                    <a href="/">Back to calculator</a>
                </div>
            </body>
        </html>
    `);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
