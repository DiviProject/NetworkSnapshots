import { S3 } from 'aws-sdk';
import * as S3Stream from 's3-upload-stream';
import { join } from 'path';

const fs = require('fs');
const exec = require('execa');

export const cwd = process.cwd();
export const folder = join(cwd, '..', '.divi');

export const blocksFolder = join(folder, 'blocks');
export const blockZipFileName = `blocks-snapshot.zip`;
export const blockZipPath = join(cwd, blockZipFileName);

export const chainstateFolder = join(folder, 'chainstate');
export const chainstateZipFileName = `chainstate-snapshot.zip`;
export const chainstateZipPath = join(cwd, chainstateZipFileName);

export const network = process.env.NETWORK || 'testnet';
export const snapshotZipFileName = Number(new Date()) + `-${network}-snapshot.zip`;
export const snapshotZipFilePath = join(cwd, snapshotZipFileName);

export const temporaryDiviSnapshotFolderPath = "/divi-snapshot";

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
    var { stdout, stderr } = await exec('zip', ['-1jr', blockZipPath, blocksFolder]);
    console.log(stdout, stderr);
    console.log('Zipped blocks');

    console.log("Starting Chainstate zip process");
    var { stdout, stderr } = await exec('zip', ['-1jr', chainstateZipPath, chainstateFolder]);
    console.log(stdout, stderr);
    console.log('Zipped chainstate');

    console.log("Starting zip for all files");
    var { stdout, stderr } = await exec('zip', ['-1jr', snapshotZipFilePath, blockZipPath, chainstateZipPath]);
    console.log(stdout, stderr);
    console.log('Zipped all files');

    const reader = fs.createReadStream(snapshotZipFilePath);
    const uploader = s3Stream.upload(
        {
            ACL: 'public-read',
            ContentType: 'application/zip',
            Bucket: 'divi-snapshots',
            Key: snapshotZipFileName,
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
        fs.unlinkSync(snapshotZipFilePath);

        console.log('Removed temporary zip files');
    });

    reader.pipe(uploader);
}
