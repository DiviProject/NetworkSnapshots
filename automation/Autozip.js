const AWS = require('aws-sdk');
const S3Stream = require('s3-upload-stream');
const fs = require('fs');
const path = require('path');
const exec = require('execa');
const cron = require('node-cron');

const cwd = process.cwd();
const folder = path.join(cwd, '..', '.divi');
const fin1 = path.join(folder, 'blocks');
const fin2 = path.join(folder, 'chainstate');
const fname1 = `blocks-snapshot.zip`;
const fout1 = path.join(cwd, fname1);

const fname2 = `chainstate-snapshot.zip`;
const fout2 = path.join(cwd, fname2);

const network = process.env.NETWORK || 'testnet';
const fname3 = Number(new Date()) + `-${network}-snapshot.zip`;
const fout3 = path.join(cwd, fname3);

const endpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
const accessKeyId = process.env.KEY || '';
const secretAccessKey = process.env.SECRET || '';

if (!accessKeyId && !secretAccessKey) {
    console.log('You need DigitalOcean Keys to run this');
    process.exit(1);
}

const s3 = new AWS.S3({ endpoint, accessKeyId, secretAccessKey });
const s3Stream = S3Stream(s3);

async function MakeZips() {
    console.log('Starting Zip process');

    const { stdout1, stderr1 } = await exec('zip', ['-1jr', fout1, fin1]);
    console.log(stdout1, stderr1);

    console.log('Zipped blocks');

    const { stdout2, stderr2 } = await exec('zip', ['-1jr', fout2, fin2]);
    console.log(stdout2, stderr2);

    console.log('Zipped chainstate');

    const { stdout3, stderr3 } = await exec('zip', ['-1jr', fout3, fout1, fout2]);
    console.log(stdout3, stderr3);

    console.log('Zipped all files');

    const reader = fs.createReadStream(fout3);
    const uploader = s3Stream.upload(
        {
            ACL: 'public-read',
            ContentType: 'application/zip',
            Bucket: 'divi-snapshots',
            Key: fname3,
        },
    );

    uploader.on('error', err => {
        console.log(err);
    });

    uploader.on('part', details => {
        console.log(details);
    });

    uploader.on('uploaded', data => {
        console.log(data);
        console.log('Snapshot taken successfully');

        fs.unlinkSync(fout1);
        fs.unlinkSync(fout2);
        fs.unlinkSync(fout3);

        console.log('Removed temporary zip files');
    });

    reader.pipe(uploader);
}

(
    async () => {
        await MakeZips();
        cron.schedule('0 0 0 * * *', () => {
            MakeZips();
        });
    }
)();
