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
    const expirationTimeInSeconds = 3600

    const appID = process.env.APP_ID;
    const appCertificate = process.env.APP_CERTIFICATE;
    const channelName = req.query.channel_name;
    const uid = parseInt(req.query.uid) || 0;

    const token = RtcTokenBuilder.buildTokenWithUid(
        appID, appCertificate, channelName, uid,
        RtcRole.PUBLISHER, expirationTimeInSeconds
    );

    res.json({
        error: false,
        data: {
            token,
            channel_name: channelName,
            uid,
        },
    });
});


app.listen(port, () => {
    console.log(`✅ running on http://localhost:${port}`);
});
