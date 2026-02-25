import React, { useState } from "react";
import { FileText, Upload, Trash2, Download, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/apiCheck";
import SectionCard from "./SectionCard";

export default function ResumeUpload({ profile, refreshProfile }) {
  const hasResume = !!profile?.resumeFileId;

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);

    try {
      await API.post("/profile/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Resume uploaded successfully");
      setFile(null);
      refreshProfile();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await API.get("/profile/resume", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error("Download failed");
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete("/profile/resume");
      toast.success("Resume deleted");
      refreshProfile();
    } catch {
      toast.error("Failed to delete resume");
    }
  };

  return (
    <SectionCard
      title="Resume"
      description="Upload your latest resume to share with recruiters."
      icon={FileText}
      isComplete={hasResume}
    >
      {!hasResume ? (
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#0060c4]/10 flex items-center justify-center">
              <Upload className="text-[#0060c4]" size={24} />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-800">Upload Resume</p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="resumeUpload"
            />

            <label
              htmlFor="resumeUpload"
              className="cursor-pointer px-5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Choose File
            </label>

            {file && (
              <div className="text-xs text-gray-600 mt-2">
                Selected: <span className="font-medium">{file.name}</span> (
                {(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}

            <button
              onClick={handleUpload}
              className="mt-4 px-6 py-2.5 bg-[#0060c4] text-white rounded-lg text-sm hover:bg-[#004e9f] transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Resume"}
            </button>
          </div>
        </div>
      ) : (
        <div className="border rounded-2xl p-6 bg-gray-50">
          <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Resume Uploaded
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Your resume is ready for recruiters to download.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 transition"
              >
                <Download size={16} />
                Download
              </button>

              <label className="flex items-center gap-2 px-4 py-2 text-sm bg-[#0060c4] text-white rounded-lg hover:bg-[#004e9f] cursor-pointer transition">
                Replace
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    setTimeout(handleUpload, 100);
                  }}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
