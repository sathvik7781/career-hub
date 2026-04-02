import React, { useState, useCallback, useContext } from "react";
import Cropper from "react-easy-crop";
import { AuthContext } from "../../../../context/AuthContext";
import API from "../../../../api/api";
import toast from "react-hot-toast";

export default function AvatarUploadModal({
  open,
  onClose,
  refreshProfile,
  setAvatarLoading,
  setAvatarKey,
}) {
  const { updateProfileImage } = useContext(AuthContext);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", reject);
      img.src = url;
    });

  const getCroppedImg = async () => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const size = 512;
    canvas.width = size;
    canvas.height = size;

    const { x, y, width, height } = croppedAreaPixels;

    ctx.drawImage(image, x, y, width, height, 0, 0, size, size);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.8);
    });
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      setAvatarLoading(true);
      const croppedBlob = await getCroppedImg();

      const formData = new FormData();
      formData.append("avatar", croppedBlob, "avatar.jpg");

      const res = await API.post("/profile/upload-avatar", formData);

      toast.success("Avatar updated successfully");
      updateProfileImage(res.data.data.profileImageUrl);
      refreshProfile();
      setAvatarKey((prev) => prev + 1);
      onClose();
      setImageSrc(null);
    } catch (err) {
      toast.error("Failed to upload avatar");
    } finally {
      setLoading(false);
      setAvatarLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl animate-modalEnter flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {imageSrc ? "Crop Photo" : "Upload Photo"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {!imageSrc ? (
            <div className="flex flex-col items-center justify-center space-y-6 py-12">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#0060c4] to-[#fd8706] flex items-center justify-center text-white text-2xl font-semibold shadow-lg">
                +
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="avatarUploadInput"
              />

              <label
                htmlFor="avatarUploadInput"
                className="cursor-pointer px-6 py-3 bg-[#0060c4] text-white rounded-lg text-sm font-medium hover:bg-[#0050a8] transition"
              >
                Choose Photo
              </label>

              <p className="text-xs text-gray-500">JPG, PNG, WEBP — Max 1MB</p>
            </div>
          ) : (
            <>
              {/* Cropper */}
              <div className="relative w-full h-64 bg-gray-100 dark:bg-slate-800 rounded-xl overflow-hidden">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              {/* Zoom Control */}
              <div className="mt-6 space-y-2">
                <label className="text-xs text-gray-500">Zoom</label>

                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full accent-[#0060c4]"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {imageSrc && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleUpload}
              disabled={loading}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                loading
                  ? "bg-gray-300 text-white cursor-not-allowed"
                  : "bg-[#0060c4] text-white hover:bg-[#0050a8]"
              }`}
            >
              {loading ? "Uploading..." : "Save Photo"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
