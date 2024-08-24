const express = require('express');
const app = express();
const webpush = require('web-push');
const cors = require('cors');
const mongoose = require('mongoose');

// MongoDB connection and schema setup
mongoose.connect('mongodb://localhost:27017/notifications', { useNewUrlParser: true, useUnifiedTopology: true });

const subscriptionSchema = new mongoose.Schema({
    endpoint: String,
    expirationTime: Number,
    keys: {
        p256dh: String,
        auth: String
    }
});

const announcementSchema = new mongoose.Schema({
    title: String,
    type: String,
    description: String,
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
const Announcement = mongoose.model('Announcement', announcementSchema);

const port = 8000;

const apiKeys = {
    publicKey: "BG9-8C1zWZsckfSiajxjnxEizoiMiNP5H3sKfE4YnofMyo3keiJ1Jt4lKMr8udUrEoMv7J1YanVi93TZkOokSQM",
    privateKey: "H_KlZkM5sWdXj-yowHXyHU6MlLViOcPE3Lcp_13itVc"
};

webpush.setVapidDetails(
    'mailto:YOUR_MAILTO_STRING',
    apiKeys.publicKey,
    apiKeys.privateKey
);

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("helllllo");
})


// Save subscription endpoint
app.post('/save-subscription', async (req, res) => {
    try {
        const subscription = new Subscription(req.body);
        await subscription.save();
        res.json({ status: 'Success', message: 'Subscription saved!' });
    } catch (error) {
        console.error('Error saving subscription:', error);
        res.status(500).json({ status: 'Error', message: 'Error saving subscription' });
    }
});

// Add announcement and send notifications
app.post('/add-announcement', async (req, res) => {
    try {
        const { title, type, description } = req.body;
        const announcement = new Announcement({ title, type, description });
        await announcement.save();

        // Send push notifications
        const subscriptions = await Subscription.find();
        const payload = JSON.stringify({ title, body: description });

        subscriptions.forEach(subscription => {
            webpush.sendNotification(subscription, payload)
                .catch(error => console.error('Error sending notification:', error));
        });

        res.json({ status: 'Success', message: 'Announcement added and notifications sent!' });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}!`);
});
