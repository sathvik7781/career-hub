import React, { useState, useEffect } from "react";
import API from "../../../../api/apiCheck";
import toast from "react-hot-toast";
import { Pencil, Trash2, User } from "lucide-react";
import AvatarUploadModal from "../modals/AvatarUploadModal"
import ConfirmModal from "../../../../components/common/ConfirmModal";
import SectionCard from "../../../../components/SectionCard";
import Input from "../../../../components/UI/InputField";
import InfoRow from "../../../../components/UI/InfoRow";

export default function BasicInfoForm({ profile, refreshProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarKey, setAvatarKey] = useState(0);

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
      setLoading(true);

      await API.post("/profile/basic-info", {
        basicInfo: formData,
      });

      await refreshProfile();
      setIsEditing(false);
      toast.success("Basic info updated successfully");
    } catch (err) {
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        const formattedErrors = {};

        backendErrors.forEach((error) => {
          const fieldName = error.path.replace("basicInfo.", "");
          formattedErrors[fieldName] = error.msg;
        });

        setErrors(formattedErrors);
      } else {
        toast.error("Failed to update basic info");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleRemoveAvatar = async () => {
    try {
      await API.delete("/profile/remove-avatar");
      toast.success("Photo removed");
      refreshProfile();
    } catch {
      toast.error("Failed to remove photo");
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
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Avatar Wrapper */}
            <div className="relative group w-24 h-24">
              <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-md">
                {profile?.basicInfo?.profileImageId ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/files/${profile.basicInfo.profileImageId}`}
                    alt="Avatar"
                    key={avatarKey}
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0060c4] to-[#fd8706] text-white text-xl font-semibold">
                    {(
                      (profile?.basicInfo?.firstName?.[0] || "") +
                      (profile?.basicInfo?.lastName?.[0] || "")
                    ).toUpperCase() || "U"}
                  </div>
                )}

                {avatarLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Desktop Hover Overlay */}
              <div className="hidden sm:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 items-center justify-center gap-3 rounded-full transition">
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="bg-white p-2 rounded-full hover:bg-[#0060c4] hover:text-white transition shadow"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                {profile?.basicInfo?.profileImageId && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-white p-2 rounded-full hover:bg-red-500 hover:text-white transition shadow"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Buttons */}
            <div className="flex sm:hidden gap-3">
              <button
                onClick={() => setShowAvatarModal(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#0060c4] text-[#0060c4] text-sm font-medium hover:bg-[#0060c4] hover:text-white transition"
              >
                <Pencil className="w-4 h-4" />
                Change
              </button>

              {profile?.basicInfo?.profileImageId && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-500 text-red-500 text-sm font-medium hover:bg-red-500 hover:text-white transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              )}
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
            open={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleRemoveAvatar}
            title="Remove Profile Photo?"
            description="This action cannot be undone."
            confirmText="Remove"
          />
          {/* Info Rows */}
          <div className="divide-y divide-gray-100 ">
            <InfoRow label="First Name" value={profile?.basicInfo?.firstName} />
            <InfoRow label="Last Name" value={profile?.basicInfo?.lastName} />
            <InfoRow label="Phone" value={profile?.basicInfo?.phone} />
            <InfoRow label="Age" value={profile?.basicInfo?.age} />
            <InfoRow label="City" value={profile?.basicInfo?.city} />
            <InfoRow label="State" value={profile?.basicInfo?.state} />
            <InfoRow label="Country" value={profile?.basicInfo?.country} />
            <InfoRow label="Gender" value={profile?.basicInfo?.gender} />
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-8 space-y-8 transition-all duration-300"
          >
            {/* Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0060c4] focus:border-[#0060c4] transition"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </form>
        </form>
      )}
    </SectionCard>
  );
}
