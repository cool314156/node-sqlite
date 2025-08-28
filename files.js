// import {
//     S3Client,
//     ListObjectsCommand,
//     GetObjectCommand,
//     PutObjectCommand,
//     DeleteObjectsCommand,
//   } from "@aws-sdk/client-s3";
//   import { sdkStreamMixin } from '@smithy/util-stream';
const { S3Client,
        ListObjectsCommand,
        GetObjectCommand,
        PutObjectCommand,
        DeleteObjectsCommand,
     } = require('@aws-sdk/client-s3')
     const { sdkStreamMixin }= require ('@smithy/util-stream')
  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: "635b52f99c1e4b00bb9e097d1817c332",
      secretAccessKey: "4ff6ae39a77dcebd23e8e19605fa5629c1d4c23bcb24820ad9d4be61e900fb79",
    },
    endpoint: "https://objstorage.leapcell.io",
  });
  
  // List files
  const listObjects =  async function () {
    try {
      const data = await client.send(
        new ListObjectsCommand({ Bucket: "jianledan-ajbf-2xzz-crlpyuek" })
      );
      console.log("Success", data.Contents);
      return data.Contents
    } catch (err) {
      console.error("Error", err);
      return err
    }
  }
  
  // Upload a file
const  putObject = async function (key, body) {
    try {
      const params = {
        Bucket: "jianledan-ajbf-2xzz-crlpyuek",
        Key: key,
        Body: body,
      };
      await client.send(new PutObjectCommand(params));
      console.log("PutObject succeeded");
      return "PutObject succeeded"
    } catch (err) {
      console.error("PutObject error", err);
      return err
    }
  }
  
  // Download a file
const  getObject = async function (key) {
    try {
      const data = await client.send(
        new GetObjectCommand({
          Bucket: "jianledan-ajbf-2xzz-crlpyuek",
          Key: key,
        })
      );
  
      const body = await sdkStreamMixin(data.Body).transformToString();
      console.log("Downloaded content:", body);
      return body
    } catch (err) {
      console.error("GetObject error", err);
      return err
    }
  }
  
  // Delete files
  const deleteObjects =  async function (arr) {
    try {
      const params = {
        Bucket: "jianledan-ajbf-2xzz-crlpyuek",
        Delete: {
        //   Objects: [
        //     { Key: "example.txt" },
        //     { Key: "another_file.txt" },
        //   ],
          Objects:arr,
        },
      };
      await client.send(new DeleteObjectsCommand(params));
      console.log("DeleteObjects succeeded");
      return "DeleteObjects succeeded"
    } catch (err) {
      console.error("DeleteObjects error", err);
      return err
    }
  }


  module.exports = {
    listObjects,
    putObject,
    deleteObjects,
    getObject 
  
  };