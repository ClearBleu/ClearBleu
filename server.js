import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";


//configure .env file so email username and password can be used to access email account
dotenv.config();
const emailUsername = process.env.EMAIL_USERNAME;
const emailPassword = process.env.EMAIL_PASSWORD;

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) =>{
    res.render("index.ejs")
})

app.get("/services", (req, res) =>{
    res.render("services.ejs")
})

app.get("/contact", (req, res) =>{
    res.render("contact.ejs")
})

app.post('/submit-form', (req, res) => {
    const { name, email, phone, message } = req.body;
    
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUsername,
            pass: emailPassword
        }
    });

    // Setup email data
    const mailOptions = {
        from: email,
        to: `${emailUsername}`, 
        subject: 'New Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
            res.json({ success: false, error: 'Error occurred while sending email' });
            
        } else {
            console.log('Email sent:', info.response);
            //Return to contact screen. If successful, will show success message.
            res.render("contact.ejs", {sent : mailOptions})
        }
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port};`)
})