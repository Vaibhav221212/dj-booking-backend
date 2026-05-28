import { bookModel } from "../models/booking.model.js";
import { djModel } from "../models/djProfile.model.js";

export const crateBooking = async (req, res) => {
  try {
    console.log("creating..,")
    const { id } = await req.params;

    const user = req.user;
    const { eventDate, eventLocation, totalHours, message, status } = req.body;
    if (!eventDate || !eventLocation || !totalHours) {
      return res.json({
        success: false,
        message: "please fill required feilds",
      });
    }

    //    check allready booked
    const allreadyBook = await bookModel.findOne({
      user: user._id,
      dj: id,
      eventDate,
    });

    if (allreadyBook) {
      return res.json({
        success: false,
        message: "you have allready booked a Dj",
      });
    }

    // create a new book

    const booked_dj = await bookModel.create({
      user: user._id,
      dj: id,
      eventDate,
      eventLocation,
      totalHours,
      message,
      status,
    });

    return res.json({
      success: true,
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

export const cancelBooking = async (req, res) => {
  const { id } = req.params;
  try {
    await bookModel.findByIdAndDelete(id);
    return res.json({
      success: true,
      message: "booking canceled",
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

// this api for bother normal user and vendor ,
// when they click a single booking  and send bboking id witg parmsa
export const getsingleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const singleBooking = await bookModel.findById(id);

    return res.json({
      success: true,
      singleBooking: singleBooking,
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

// show normal user there all bookings
export const userBookings = async (req, res) => {
  try {
    // const status=req.query.status
    const { role } = req.params;
    console.log(role);
    const user = req.user;
    console.log("ruunig");

    let bookings=""
    if (role === "admin") {
      bookings = await bookModel.find().populate("dj");
    } else {
      bookings = await bookModel.find({ user: user._id }).populate("dj");
    }

    if (bookings.length === 0) {
      return res.json({
        success: false,
        message: "you have not book A Dj",
      });
    }

    return res.json({
      success: true,
      bookings: bookings,
    });
  } catch (e) {
    console.log(e.message)
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

//  show vendor booking , vendor la all booking show hotil

export const vendorBooking = async (req, res) => {
  try {
    const user = req.user;
    const status = req.query.status;
    const djProfile = await djModel.findOne({ user: user._id });
    const allBooking = await bookModel.find({ dj: djProfile._id });

    if (allBooking.length === 0) {
      return res.json({
        success: false,
        message: "not booking available",
      });
    }
    return res.json({
      success: true,
      bookings: allBooking,
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

export const acceptBooking = async (req, res) => {
  try {
    const { id } = req.params;

    //   check allrady accept or nor
    const isAccept = await bookModel.findById(id);
    if (isAccept.status === "accepted") {
      return res.json({
        success: false,
        message: "allready accepted",
      });
    }

    const acceptBook = await bookModel.findByIdAndUpdate(
      id,
      {
        status: "accepted",
      },
      { new: true },
    );

    return res.json({
      success: true,
      message: "accepted",
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

export const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
 
    //   check allrady rejected or not
    const isBooking = await bookModel.findById(id);
    if (isBooking.status === "rejected") {
      return res.json({
        success: false,
        message: "allready rejected",
      });
    }

    const rejectedBook = await bookModel.findByIdAndUpdate(
      id,
      {
        status: "rejected",
      },
      { new: true },
    );

    return res.json({
      success: true,
      message: " rejected",
      data: rejectedBook,
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};
