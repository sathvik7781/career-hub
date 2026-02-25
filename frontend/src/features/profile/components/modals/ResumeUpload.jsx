import React, { useState } from "react";
import { FileText, Upload, Trash2, Download, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../../../api/apiCheck";
import SectionCard from "../../../../components/SectionCard" 
import { Button } from "../../../../components/UI/FormElements"

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
        <div className="border-2 border-dashed border-app rounded-2xl p-10 text-center bg-gray-50 dark:bg-slate-800/50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Upload className="text-blue-600 dark:text-blue-400" size={24} />
            </div>

            <div>
              <p className="text-sm font-medium text-primary">Upload Resume</p>
              <p className="text-xs text-secondary mt-1">
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
              className="cursor-pointer px-5 py-2.5 text-sm bg-surface border border-app rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition text-primary"
            >
              Choose File
            </label>

            {file && (
              <div className="text-xs text-secondary mt-2">
                Selected:{" "}
                <span className="font-medium text-primary">{file.name}</span> (
                {(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}

            <Button
              onClick={handleUpload}
              isLoading={loading}
              variant="primary"
              disabled={!file}
              className="mt-4"
            >
              Upload Resume
            </Button>
          </div>
        </div>
      ) : (
        <div className="border border-app rounded-2xl p-6 bg-gray-50 dark:bg-slate-800/50">
          <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle
                  className="text-green-600 dark:text-green-400"
                  size={20}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-primary">
                  Resume Uploaded
                </p>
                <p className="text-xs text-secondary mt-1">
                  Your resume is ready for recruiters to download.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-app rounded-lg hover:bg-surface transition text-primary"
              >
                <Download size={16} />
                Download
              </button>

              <label className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 cursor-pointer transition shadow-md hover:shadow-lg">
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
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
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
