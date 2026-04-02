import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import toast from "react-hot-toast";
import { Pencil, Trash2, User } from "lucide-react";
import AvatarUploadModal from "../modals/AvatarUploadModal";
import ConfirmModal from "../../../../components/common/ConfirmModal";
import SectionCard from "../../../../components/layout/SectionCard";
import Input from "../../../../components/UI/InputField";
import InfoRow from "../../../../components/UI/InfoRow";
import { useUpdateBasicInfo, useRemoveAvatar } from "../../hooks/useUpdateProfile";

export default function BasicInfoForm({ profile, refreshProfile }) {
  const { updateProfileImage } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarKey, setAvatarKey] = useState(0);
  const { mutateAsync: updateBasicInfo, isPending: loading } = useUpdateBasicInfo();
  const { mutateAsync: removeAvatar } = useRemoveAvatar();

  useEffect(() => {
    if (!profile?.basicInfo) return;

    setFormData((prev) => {
      const isSame = JSON.stringify(prev) === JSON.stringify(profile.basicInfo);

      return isSame ? prev : profile.basicInfo;
    });

    setOriginalData((prev) => {
      const isSame = JSON.stringify(prev) === JSON.stringify(profile.basicInfo);

      return isSame ? prev : profile.basicInfo;
    });
  }, [profile?.basicInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setErrors({});
    toast("Changes discarded", { icon: "⚠️" });
  };

  const handleSubmit = async (e) => {
    try {
      await updateBasicInfo(formData);
      setIsEditing(false);
      toast.success("Basic info updated successfully");
    } catch (err) {
      if (err.response?.data?.errors) {
        const formattedErrors = {};
        err.response.data.errors.forEach((error) => {
          formattedErrors[error.path.replace("basicInfo.", "")] = error.msg;
        });
        setErrors(formattedErrors);
      }
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await removeAvatar();
      updateProfileImage(null);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const isComplete = profile?.completion?.completedSections?.includes("basic");

  const isChanged = Object.keys(formData).some(
    (key) => formData[key] !== originalData[key],
  );
  return (
    <SectionCard
      title="Basic Information"
      description="This information is visible to recruiters."
      icon={User}
      isComplete={isComplete}
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSubmit}
      loading={loading}
    >
      {!isEditing ? (
        <>
          {/* Profile Display Grid */}
          <div className="flex flex-col lg:flex-row gap-10 sm:gap-14">
            {/* Avatar Section */}
            <div className="flex-shrink-0 flex flex-col items-center lg:items-start gap-4">
              <div className="relative group">
                {/* Glow */}
                <div className="absolute -inset-1 bg-gradient-to-tr from-[#0060c4] to-[#fd8706] rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-300" />

                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                  {profile?.basicInfo?.profileImageUrl ? (
                    <img
                      src={profile.basicInfo.profileImageUrl}
                      alt="Avatar"
                      key={avatarKey}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0060c4] to-[#0050a8] text-white text-4xl font-black italic">
                      {((profile?.basicInfo?.firstName?.[0] || "") + (profile?.basicInfo?.lastName?.[0] || "")).toUpperCase() || "U"}
                    </div>
                  )}

                  {avatarLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
                      <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Edit + Delete overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => setShowAvatarModal(true)}
                      className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40 transition-all border border-white/20"
                      title="Update Photo"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {profile?.basicInfo?.profileImageUrl && (
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="p-2.5 bg-red-500/70 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-all border border-white/20"
                        title="Remove Photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start gap-2">
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  {profile?.basicInfo?.firstName} {profile?.basicInfo?.lastName}
                </h3>
              </div>
            </div>

            {/* Information Grid - Enhanced 2-column layout */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-5">
                <InfoRow
                  label="Phone Number"
                  value={profile?.basicInfo?.phone}
                />
                <InfoRow
                  label="Gender Identity"
                  value={profile?.basicInfo?.gender}
                />
                <InfoRow label="Current Age" value={profile?.basicInfo?.age} />
                <InfoRow label="Home City" value={profile?.basicInfo?.city} />
                <InfoRow
                  label="Region/State"
                  value={profile?.basicInfo?.state}
                />
                <InfoRow
                  label="Country Location"
                  value={profile?.basicInfo?.country}
                />
              </div>
            </div>
          </div>

          <AvatarUploadModal
            open={showAvatarModal}
            onClose={() => setShowAvatarModal(false)}
            refreshProfile={refreshProfile}
            setAvatarLoading={setAvatarLoading}
            setAvatarKey={setAvatarKey}
          />
          <ConfirmModal
            isOpen={showDeleteModal}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleRemoveAvatar}
            title="Remove Profile Photo?"
            message="This action cannot be undone."
            confirmLabel="Remove"
            variant="danger"
          />
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5 sm:p-8 transition-all duration-300">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
            />
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            <Input
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              error={errors.age}
            />
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
            />
            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              error={errors.state}
            />
            <Input
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              error={errors.country}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#0060c4] focus:border-[#0060c4] transition"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </form>
      )}
    </SectionCard>
  );
}
