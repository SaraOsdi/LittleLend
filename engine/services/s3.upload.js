require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

exports.uplaodS3 = async (file) => {
  if (file.mimetype.startsWith("image/")) {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: Date.now().toString(),
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    const uploadResult = await s3.upload(params).promise();
    return uploadResult.Location;
  } else {
    throw new Error();
  }
};
