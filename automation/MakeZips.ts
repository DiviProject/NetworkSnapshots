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
export const snapshotZipFileName = `${Number(new Date())}-${network}-snapshot.zip`;
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

    console.log("creating snapshot folder", temporaryDiviSnapshotFolderPath);
    var { stdout, stderr } = await exec('mkdir', [temporaryDiviSnapshotFolderPath]);
    console.log(stdout, stderr);
    console.log("created snapshot folder");

    console.log("copying blocks into snapshot folder");
    var { stdout, stderr } = await exec('cp', ['-a', blocksFolder, temporaryDiviSnapshotFolderPath+"/blocks"]);
    console.log(stdout, stderr);
    console.log('Zipped blocks');

    console.log("copying chainstate into snapshot folder");
    var { stdout, stderr } = await exec('cp', ['-a', chainstateFolder, temporaryDiviSnapshotFolderPath+"/chainstate"]);
    console.log(stdout, stderr);
    console.log('Zipped chainstate');

    console.log("Zipping snapshot folder");
    var { stdout, stderr } = await exec('zip', ['-1r', snapshotZipFileName, temporaryDiviSnapshotFolderPath]);
    console.log(stdout, stderr);
    console.log('Zipped');

    console.log("Deleting temporary snapshot folder");
    var { stdout, stderr } = await exec('rm', ['-r', temporaryDiviSnapshotFolderPath]);
    console.log(stdout, stderr);
    console.log('Deleted');

    console.log('Zip process completed');

    console.log('Uploading');
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

        fs.unlinkSync(snapshotZipFilePath);

        console.log('Removed temporary zip files');
    });

    reader.pipe(uploader);
}
