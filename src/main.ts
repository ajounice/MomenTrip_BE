import { bootstrap } from '@/bootstrap';

bootstrap()
    .then((app) => app.listen(3000))
    .then(() => {
        console.log('server running on port 3000');
    })
    .catch((err) => {
        console.error('An error occurred', err);
        process.exit(1);
    });
