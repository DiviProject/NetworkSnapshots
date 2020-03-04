import { schedule } from 'node-cron';
import { MakeZips } from './MakeZips';

(
    async () => {
        await MakeZips();
        schedule('0 0 * * * *', () => {
            MakeZips();
        });
    }
)();
