import { S3 } from 'aws-sdk';
import * as S3Stream from 's3-upload-stream';
import { join } from 'path';

const fs = require('fs');
const exec = require('execa');

export const cwd = process.cwd();
export const folder = join(cwd, '..', '.divi');
export const blocksFolder = join(folder, 'blocks');
export const chainstateFolder = join(folder, 'chainstate');
export const blockZipFileName = `blocks-snapshot.zip`;
export const blockZipPath = join(cwd, blockZipFileName);

export const chainstateZipFileName = `chainstate-snapshot.zip`;
export const chainstateZipPath = join(cwd, chainstateZipFileName);

export const network = process.env.NETWORK || 'testnet';
export const networkZipFileName = Number(new Date()) + `-${network}-snapshot.zip`;
export const networkZipPath = join(cwd, networkZipFileName);

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

    console.log("Starting Block zip process");
    const { stdout1, stderr1 } = await exec('zip', ['-1jr', blockZipPath, blocksFolder]);
    console.log(stdout1, stderr1);
    console.log('Zipped blocks');

    console.log("Starting Chainstate zip process");
    const { stdout2, stderr2 } = await exec('zip', ['-1jr', chainstateZipPath, chainstateFolder]);
    console.log(stdout2, stderr2);
    console.log('Zipped chainstate');

    console.log("Starting zip for all files");
    const { stdout3, stderr3 } = await exec('zip', ['-1jr', networkZipPath, blockZipPath, chainstateZipPath]);
    console.log(stdout3, stderr3);
    console.log('Zipped all files');

    const reader = fs.createReadStream(networkZipPath);
    const uploader = s3Stream.upload(
        {
            ACL: 'public-read',
            ContentType: 'application/zip',
            Bucket: 'divi-snapshots',
            Key: networkZipFileName,
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

        fs.unlinkSync(blockZipPath);
        fs.unlinkSync(chainstateZipPath);
        fs.unlinkSync(networkZipPath);

        console.log('Removed temporary zip files');
    });

    reader.pipe(uploader);
}
