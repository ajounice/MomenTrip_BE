import { bootstrap } from '@/bootstrap';

bootstrap()
    .then(() => {
        console.log('server started');
    })
    .catch((err) => {
        console.error('error occurred', err);
        process.exit(1);
    });
