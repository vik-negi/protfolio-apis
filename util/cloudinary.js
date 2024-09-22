import { config, uploader } from "cloudinary";
var dataurl;
const cloudinaryConfig = async (locaFilePath, type) => {
  config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    console.log("type", type);
    if (type === "image") {
      return uploader
        .upload(locaFilePath, {
          resource_type: "image",
          folder: "portfolio",
        })
        .then((result) => {
          const image = result;
          return image;
        });
    } else if (type === "video") {
      return new Promise((resolve) => {
        uploader.upload(
          locaFilePath,
          (result) => {
            resolve({ url: result.url, id: result.public_id });
          },
          { resource_type: "auto" }
        );
      });
      //   uploader
      //     .upload(locaFilePath, {
      //       resource_type: "auto",
      //       folder: "portfolio",
      //       // chunk_size: 6000000,
      //       eager: [
      //         { width: 300, height: 300, crop: "pad", audio_codec: "none" },
      //         {
      //           width: 160,
      //           height: 100,
      //           crop: "crop",
      //           gravity: "south",
      //           audio_codec: "none",
      //         },
      //       ],
      //       eager_async: true,
      //     })
      //     .then((result) => {
      //       const video = result;
      //       console.log("video", video);
      //       return video;
      //     });
    }
  } catch (err) {
    console.log(err);
    // res.status(400).json({
    // messge: 'someting went wrong while processing your request',
    // data: {
    // err
    // }
    // });
    return null;
  }
};
export { dataurl, cloudinaryConfig };

// import cloudinary from "cloudinary";
// export default cloudinary;
