import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  type ListObjectsCommandInput,
  type ListObjectsCommandOutput,
  HeadObjectCommand,
  type HeadBucketCommandOutput,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

//TODO: Introduce file size and file type limits through POST policy
export const S3Manager = (() => {
  let s3Client: S3Client;
  let defaultExpiresIn: number = 3600;
  let defaultBucketName: string;
  let diagnosisBucketName: string;
  let ancillaryBucketName: string;
  let reclaimBucketName: string;

  const loadS3Client = (): void => {
    if (!process.env.S3_ENDPOINT) {
      throw new Error('S3_ENDPOINT environment variable is not set');
    }
    if (!process.env.S3_REGION) {
      throw new Error('S3_REGION environment variable is not set');
    }
    if (!process.env.S3_KEY_ID) {
      throw new Error('S3_KEY_ID environment variable is not set');
    }
    if (!process.env.S3_ACCESS_KEY) {
      throw new Error('S3_ACCESS_KEY environment variable is not set');
    }
    if (!process.env.S3_DEFAULT_BUCKET) {
      throw new Error('S3_DEFAULT_BUCKET environment variable is not set');
    }
    if (!process.env.S3_DIAGNOSIS_BUCKET) {
      throw new Error('S3_DIAGNOSIS_BUCKET environment variable is not set');
    }
    if (!process.env.S3_ANCILLARY_BUCKET) {
      throw new Error('S3_ANCILLARY_BUCKET environment variable is not set');
    }
    if (!process.env.S3_RECLAIM_BUCKET) {
      throw new Error('S3_RECLAIM_BUCKET environment variable is not set');
    }
    defaultBucketName = process.env.S3_DEFAULT_BUCKET;
    diagnosisBucketName = process.env.S3_DIAGNOSIS_BUCKET;
    ancillaryBucketName = process.env.S3_ANCILLARY_BUCKET;
    reclaimBucketName = process.env.S3_RECLAIM_BUCKET;
    if (process.env.S3_PRESIGNED_URL_EXPIRES_IN) {
      try {
        defaultExpiresIn = parseInt(
          process.env.S3_PRESIGNED_URL_EXPIRES_IN,
          10,
        );
      } catch (_e) {
        throw new Error('S3_PRESIGNED_URL_EXPIRES_IN should be a number');
      }
    }
    s3Client = new S3Client({
      endpoint: process.env.S3_ENDPOINT, // DigitalOcean Spaces endpoint
      region: process.env.S3_REGION, // Region of your space
      credentials: {
        accessKeyId: process.env.S3_KEY_ID, // Your DigitalOcean Spaces access key
        secretAccessKey: process.env.S3_ACCESS_KEY, // Your DigitalOcean Spaces secret key
      },
      // signingRegion: process.env.S3_REGION, // Ensure the signing region is set
    });
  };
  const getS3Client = (): S3Client => {
    if (!s3Client) {
      loadS3Client();
    }

    return s3Client;
  };
  const generatePresignedUrl = async ({
    bucketName,
    key,
    operation,
    contentType,
    metaData,
    expiresIn = defaultExpiresIn,
  }: {
    bucketName: string;
    key: string;
    operation: 'getObject' | 'putObject';
    expiresIn?: number;
    contentType?: string;
    metaData?: {
      fileName: string;
      fileId: string;
    };
  }): Promise<{
    signedUrl: string;
    expirationDate: Date;
  }> => {
    const client = getS3Client();
    let command;

    if (operation === 'getObject') {
      command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    } else if (operation === 'putObject') {
      command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: contentType,
        Metadata: metaData,
      });
    } else {
      throw new Error('Invalid operation type');
    }
    const expirationDate = new Date(Date.now() + expiresIn * 1000);
    const signedUrl = await getSignedUrl(client, command, { expiresIn });

    return { signedUrl, expirationDate };
  };
  const listObjects = async ({
    bucketName,
    prefix,
    delimiter,
    marker,
    maxKeys,
  }: {
    bucketName: string;
    prefix?: string;
    delimiter?: string;
    marker?: string;
    maxKeys?: number;
  }): Promise<ListObjectsCommandOutput> => {
    const client = getS3Client();
    const input: ListObjectsCommandInput = {
      Bucket: bucketName,
      Prefix: prefix,
      Delimiter: delimiter,
      Marker: marker,
      MaxKeys: maxKeys,
    };
    const command = new ListObjectsCommand(input);

    return await client.send(command);
  };
  const getObjectMetadata = async ({
    bucketName,
    key,
  }: {
    bucketName: string;
    key: string;
  }): Promise<HeadBucketCommandOutput | null> => {
    const client = getS3Client();
    const command = new HeadObjectCommand({ Bucket: bucketName, Key: key });

    try {
      return await client.send(command);
    } catch (error) {
      if (error instanceof S3ServiceException) {
        console.log("Error is of type 'S3ServiceException'");
        console.log(error);
      }
      console.log(error);

      return null;
    }
  };
  const checkIfObjectExists = async ({
    bucketName,
    key,
  }: {
    bucketName: string;
    key: string;
  }): Promise<boolean> => {
    if (await getObjectMetadata({ bucketName, key })) {
      return true;
    }

    return false;
  };
  const getBucketName = (
    bucketType: 'diagnosis' | 'ancillary' | 'reclaim' | 'default',
  ): string => {
    if (!s3Client) {
      loadS3Client();
    }
    switch (bucketType) {
      case 'diagnosis':
        return diagnosisBucketName;
      case 'ancillary':
        return ancillaryBucketName;
      case 'reclaim':
        return reclaimBucketName;
      case 'default':
      default:
        return defaultBucketName;
    }
  };

  return {
    getS3Client,
    generatePresignedUrl,
    listObjects,
    checkIfObjectExists,
    getObjectMetadata,
    getBucketName,
  };
})();
