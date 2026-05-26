import { djModel } from "../models/djProfile.model.js";
import userModel from "../models/user.model.js";
import cloudinary from "../services/image.js";
export const createDjProfile = async (req, res) => {
  try {
    const user = req.user;
    const {
      stageName,
      bio,
      city,
      experience,
      pricePerHour,
      genres,
      equipment,
    } = req.body;

    const { profileImage, galleryImage } = req.files;

    if (!stageName || !bio || !city || !experience || !pricePerHour) {
      return res.json({
        success: false,
        message: "all feilds required",
      });
    }

    // check allready create a profile

    const profile = await djModel.findOne({ user: user._id });

    if (profile) {
      return res.json({
        suucess: false,
        messaage: "allready profilr creat",
      });
    }
    const result = [];
    let profileUrl;

    if (profileImage && galleryImage) {
      profileUrl = await cloudinary.uploader.upload(
        `data:${profileImage[0].mimetype};base64,${profileImage[0].buffer.toString("base64")}`,
        {
          folder: "dj-marketPlace",
        },
      );

      if (galleryImage.length > 0) {
        for (const image of galleryImage) {
          const uploadGallery = await cloudinary.uploader.upload(
            `data:${image.mimetype};base64,${image.buffer.toString("base64")}`,
            {
              folder: "dj-marketPlace",
            },
          );

          result.push(uploadGallery.secure_url);
        }
      }
    }

  

    const djProfile = await djModel.create({
      user: user._id,
      stageName,
      bio,
      city,
      experience,
      genres,
      pricePerHour,
      galleryImage: result,
      profileImage: profileUrl.secure_url,
      equipment,
    });

    await userModel.findOneAndUpdate({ _id: user._id }, { dj: djProfile._id });

    return res.json({
      success: true,
      message: "profil createted sucessfully",
    });
  } catch (e) {
    console.log(e.messaage);
    res.json({
      success: false,
      message: e.message,
    });
  }
};

export const updateDjProfile = async (req, res) => {
  try {
    const { stageName, bio, city, exprience, priceperHour, genres, equipment } =
      req.body;

    console.log(stageName);
    const user = req.user;

    const userData = {};
    // check user have create profile or not

    const findProfile = await djModel.findOne({ user: user._id });

    if (!findProfile) {
      return res.json({
        success: false,
        message: "you have not created frofile",
      });
    }

    if (stageName) {
      userData.stageName = stageName;
    }
    if (bio) {
      userData.bio = bio;
    }
    if (city) {
      userData.city = city;
    }
    if (exprience) {
      userData.exprience = exprience;
    }
    if (priceperHour) {
      userData.priceperHour = priceperHour;
    }
    if (genres) {
      userData.genres = genres;
    }

    if (equipment) {
      {
        userData.equipment = equipment;
      }
    }

    let updated_imagegallery = [];
    let updtaed_profileImage;

    const { profileImage, galleryImage } = req.files;

    if (profileImage) {
      updtaed_profileImage = await cloudinary.uploader.upload(
        `data:${profileImage[0].mimetype};base64,${profileImage[0].buffer.toString("base64")}`,
        {
          folder: "dj-marketPlace",
        },
      );

      userData.profileImage = updtaed_profileImage.secure_url;
    }

    if (galleryImage.length > 0) {
      for (const image of galleryImage) {
        const urls = await cloudinary.uploader.upload(
          `data:${image.mimetype};base64,${image.buffer.toString("base64")}`,
          {
            folder: "dj-marketPlace",
          },
        );

        updated_imagegallery.push(urls.secure_url);
      }

      userData.galleryImage = updated_imagegallery;
    }

    if (Object.keys(userData).length === 0) {
      return res.json({
        success: false,
        message: "all feilds are empty",
      });
    }
    

    const updateProfile = await djModel.findOneAndUpdate(
      { user: user._id },

      userData,

      { new: true },
    );

    return res.json({
      success: true,
      message: "profile updated",
      profile: updateProfile,
    });
  } catch (e) {
    console.log(e.message);
    return res.json({
      // success: false,
      // message: e.message,
    });
  }
};

// get dj by user search and dj names
export const getDjProfiles = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search?.trim();

    const skip = (page - 1) * limit;

    const filter = {
      availability: true,
    };

    // ---------------- SEARCH FILTER ----------------
    if (search) {
      filter.$or = [
        {
          city: {
            $regex: search,
            $options: "i",
          },
        },
        {
          stageName: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const profiles = await djModel
      .find(filter)
      .skip(skip)
      .limit(limit);

    // ---------------- EMPTY RESULT ----------------
    if (!profiles.length) {
      return res.json({
        success: true,
        profiles: [],
        message: "No DJs found",
      });
    }

    return res.json({
      success: true,
      profiles,
      page,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

// ? gesingle dj- profile for normal user
export const getSingleProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const profile = await djModel.findById(id).populate("user");
    if (!profile) {
      return res.json({
        success: false,
        message: "profile not found or deleted",
      });
    }

    return res.json({
      success: true,
      profile: profile,
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

// ? getsingle-dj- profile for vendor
export const vendorProfile = async (req, res) => {
  try {
    const user = req.user;

    const profile = await djModel.findOne({ user: user._id });

    if (!profile) {
      return res.json({ success: false, message: "profile not found" });
    }
    return res.json({
      success: true,
      profile: profile,
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

export const deleteDjProfile = async (req, res) => {
  const user = req.user;

  await djModel.findOneAndDelete({ user: user._id }, { new: true });

  // also remove dj id from user profilr
  await userModel.findByIdAndUpdate(
    user._id,
    {
      dj: null,
    },
    { new: true },
  );
  return res.json({
    success: true,
    message: "profilr delete succesfully",
  });
};

export const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    const user = req.user;

    const profile = await djModel.findOneAndUpdate(
      { user: user._id },
      {
        availability,
      },
      { new: true },
    );

    return res.json({
      success: true,
      message: "availability updated",
      profile,
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};


