import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { amount } = req.body;
        const SECRET_API_KEY = process.env.SECRET_API_KEY;
        const PUBLIC_API_KEY = process.env.PUBLIC_API_KEY;

        if (!amount) {
            res.status(400).json({ error: 'Missing amount' });
            return;
        }

        try {
            const result = await axios.post(
                'https://api.hel.io/v1/paylink/create/api-key',
                {
                    template: "OTHER",
                    name: "api created paylink",
                    price: (amount * 1000000).toString(), // Convert SOL to the smallest unit
                    pricingCurrency: "6340313846e4f91b8abc519b", // SOL currency ID
                    features: {},
                    recipients: [
                        {
                            walletId: "63403168afbfe0b061c18703", // Your recipient wallet ID
                            currencyId: "6340313846e4f91b8abc519b", // SOL currency ID
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${SECRET_API_KEY}`,
                    },
                    params: {
                        apiKey: PUBLIC_API_KEY,
                    },
                }
            );

            console.log(`https://hel.io/pay/${result.data.id}`);
            res.status(200).json({ paymentLink: `https://hel.io/pay/${result.data.id}` });
        } catch (error) {
            console.error(`${error.response?.data?.code} ${error.response?.data?.message}`);
            res.status(500).json({ error: error.response?.data?.message || 'Error' });
        }
    } else {
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
