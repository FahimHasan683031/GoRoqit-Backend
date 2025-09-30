import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, USER_ROLES, USER_STATUS, UserModel } from "./user.interface";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import config from "../../../config";



const UserSchema = new Schema<IUser, UserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, 
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
    },
    name: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    profile: {
      type: Schema.Types.ObjectId,
      refPath: "roleProfile",
      default: null,
    },
    roleProfile: {
      type: String,
      enum: ["ApplicantProfile", "RecruiterProfile", null],
      default: null,
    },
    companyName: {
      type: String,
      required: false,
    },
    authentication: {
      _id: false,
      select: false,
      type: {
        restrictionLeftAt: {
          type: Date,
          default: null,
        },
        resetPassword: {
          type: Boolean,
          default: false,
        },
        wrongLoginAttempts: {
          type: Number,
          default: 0,
        },
       
        passwordChangedAt: {
          type: Date,
          default: null,
        },
        oneTimeCode: {
          type: String,
          default: null,
        },
        latestRequestAt: {
          type: Date,
          default: null,
        },
        expiresAt: {
          type: Date,
          default: null,
        },
        requestCount: {
          type: Number,
          default: 0,
        },
        authType: {
          type: String,
          default: null,
        },
      },
    },
    subscribe: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true
  }
);


// UserSchema.index({ email: 1, status: 1 });

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
) {
  return bcrypt.compare(givenPassword, savedPassword);
};


UserSchema.pre<IUser>("save", async function (next) {
  const email = this.email;
  if (email) {
    const isExist = await User.findOne({
      email: this.email,
      status: { $in: [USER_STATUS.ACTIVE, USER_STATUS.RESTRICTED] },
    });
console.log(isExist)
    if (isExist) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "An account with this email already exists"
      );
    }
  }

  if (this.password) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  next();
});

export const User = mongoose.model<IUser, UserModel>("User", UserSchema);


















