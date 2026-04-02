import { useState, useRef } from "react";
import { FileText, Upload, Trash2, Download, CheckCircle } from "lucide-react";
import SectionCard from "../../../../components/layout/SectionCard";
import { Button } from "../../../../components/UI/FormElements";
import { useUploadResume, useDeleteResume } from "../../hooks/useUpdateProfile";

export default function ResumeUpload({ profile }) {
  const hasResume = !!profile?.resumeUrl;
  const [file, setFile] = useState(null);
  const replaceInputRef = useRef(null);

  const { mutateAsync: uploadResume, isPending: uploading } = useUploadResume();
  const { mutateAsync: deleteResume, isPending: deleting } = useDeleteResume();
  const loading = uploading || deleting;

  const handleUpload = async (fileToUpload) => {
    const target = fileToUpload || file;
    if (!target) return;
    try {
      await uploadResume(target);
      setFile(null);
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    } catch {}
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your resume?")) return;
    try { await deleteResume(); } catch {}
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
              onChange={(e) => setFile(e.target.files[0] || null)}
              className="hidden"
              id="resumeUpload"
              disabled={loading}
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
              onClick={() => handleUpload()}
              isLoading={loading}
              variant="primary"
              disabled={!file || loading}
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
                <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">Resume Uploaded</p>
                <p className="text-xs text-secondary mt-1">
                  Your resume is ready for recruiters to download.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => window.open(profile.resumeUrl, "_blank")}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-app rounded-lg hover:bg-surface transition text-primary disabled:opacity-50"
              >
                <Download size={16} />
                Download
              </button>

              <label className={`flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition shadow-md ${loading ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}`}>
                Replace
                <input
                  ref={replaceInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const selected = e.target.files[0];
                    if (selected) handleUpload(selected);
                  }}
                  className="hidden"
                  disabled={loading}
                />
              </label>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
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
