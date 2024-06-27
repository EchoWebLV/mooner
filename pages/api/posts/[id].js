import prisma from '../../../lib/prisma';
import checkAdmin from '../../../middlewares/checkAdmin';

export default async function handler(req, res) {
    // Use middleware to check admin status
    checkAdmin(req, res, async () => {
        if (req.method === 'DELETE') {
            const { id } = req.query;

            try {
                await prisma.post.delete({
                    where: { id },
                });
                res.status(200).json({ message: 'Post deleted successfully' });
            } catch (error) {
                console.error('Error deleting post:', error);
                res.status(500).json({ error: 'Error deleting post' });
            }
        } else {
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    });
}
