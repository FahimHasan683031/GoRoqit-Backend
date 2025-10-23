import { ApplicantProfile } from "./applicantProfile.model";

const createApplicantProfile = async (userId: Types.ObjectId, profileData: IApplicantProfile) => {
  const profile = new ApplicantProfile({ userId, ...profileData });
  return await profile.save();
};

const updateApplicantProfile = async (userId: Types.ObjectId, profileData: IApplicantProfile) => {
  return await ApplicantProfileModel.findOneAndUpdate({ userId }, profileData, { new: true });
};

const deleteApplicantProfile = async (userId: Types.ObjectId) => {
  return await ApplicantProfileModel.findOneAndDelete({ userId });
};
