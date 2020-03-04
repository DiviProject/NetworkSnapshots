import { S3 } from 'aws-sdk';
import * as S3Stream from 's3-upload-stream';
import { join } from 'path';

const fs = require('fs');
const exec = require('execa');

export const cwd = process.cwd();
export const folder = join(cwd, '..', '.divi');
export const fin1 = join(folder, 'blocks');
export const fin2 = join(folder, 'chainstate');
export const fname1 = `blocks-snapshot.zip`;
export const fout1 = join(cwd, fname1);

export const fname2 = `chainstate-snapshot.zip`;
export const fout2 = join(cwd, fname2);

export const network = process.env.NETWORK || 'testnet';
export const fname3 = Number(new Date()) + `-${network}-snapshot.zip`;
export const fout3 = join(cwd, fname3);

export const endpoint = 'https://nyc3.digitaloceanspaces.com';
export const accessKeyId = process.env.KEY || '';
export const secretAccessKey = process.env.SECRET || '';

if (!accessKeyId && !secretAccessKey) {
    console.log('You need DigitalOcean Keys to run this');
    process.exit(1);
}

const s3 = new S3({ endpoint, accessKeyId, secretAccessKey });
const s3Stream = S3Stream(s3);

export async function MakeZips() {
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
