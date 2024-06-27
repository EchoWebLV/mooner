import { Connection, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { sender } = req.body;

        if (!sender) {
            return res.status(400).json({ error: 'Sender public key is required' });
        }

        try {
            const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(sender),
                    toPubkey: new PublicKey(process.env.RECIPIENT_PUBLIC_KEY),
                    lamports: 10000000, // 1 SOL
                })
            );

            const { blockhash } = await connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = new PublicKey(sender);

            const serializedTransaction = transaction.serialize({
                requireAllSignatures: false,
            });

            res.status(200).json({ transaction: serializedTransaction.toString('base64') });
        } catch (error) {
            console.error('Error creating transaction:', error);
            res.status(500).json({ error: 'Error creating transaction' });
        }
    } else {
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
