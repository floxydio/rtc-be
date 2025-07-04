const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const app = express();
const dotenv = require("dotenv")
const port = 3200;

dotenv.config()

function generateRandomChannelName() {
    const sections = [];
    const charset = 'abcdefghijklmnopqrstuvwxyz';
    const sectionLength = [4, 4, 5];
    for (const len of sectionLength) {
        let part = '';
        for (let i = 0; i < len; i++) {
            part += charset[Math.floor(Math.random() * charset.length)];
        }
        sections.push(part);
    }

    return sections.join('-');
}

app.get('/rtc-token', (req, res) => {
    const appID = process.env.APP_ID;
    const appCertificate = process.env.APP_CERT;

    let channelName = req.query.channel_name;
    if (!channelName) {
        channelName = generateRandomChannelName();
    }

    const uid = parseInt(req.query.uid) || 0;
    const role = RtcRole.PUBLISHER;

    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
        appID,
        appCertificate,
        channelName,
        uid,
        role,
        privilegeExpiredTs
    );

    res.status(200).json({
        status: 200,
        error: false,
        data: {
            token,
            channel_name: channelName
        },
        message: "Token call generated!"
    });
});



app.listen(port, () => {
    console.log(`✅ running on http://localhost:${port}`);
});
