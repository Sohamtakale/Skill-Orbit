import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate, Link } from "react-router-dom";
import { Upload, FileText, ChevronDown, Loader2, ArrowLeft } from "lucide-react";
import { analyzeResume } from "@/api";

const jobRoles = [
  "Data Scientist",
  "AI Engineer",
  "Full Stack Developer",
  "Cloud Architect",
  "Product Manager",
];

const AnalyzePage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [targetYear, setTargetYear] = useState(2028);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Update dropdown position when opening
  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isDropdownOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid PDF file");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setError("");
    } else {
      setError("Please drop a valid PDF file");
    }
  };

  const handleAnalyze = async () => {
    if (!file || !selectedRole) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await analyzeResume(file, selectedRole, targetYear);
      if (result) {
        navigate("/results", {
          state: {
            analysisData: result,
            fileName: file.name,
          },
        });
      } else {
        setError("Analysis failed. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError("An error occurred during analysis. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse-glow animation-delay-400" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </Link>
      </nav>

      <main className="relative z-10 max-w-2xl mx-auto px-8 py-12">
        <div className="text-center mb-12 opacity-0 animate-fade-up">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Analyze Your Skills
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload your resume and let AI map your career trajectory
          </p>
        </div>

        <div className="space-y-8">
          {/* Error Message */}
          {error && (
            <div className="glass-card rounded-xl p-4 border border-red-500/50 bg-red-500/10">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* File Upload */}
          <div className="opacity-0 animate-fade-up animation-delay-200">
            <label className="block text-sm font-medium text-foreground mb-3">
              Upload Your Resume
            </label>
            <div
              className={`glass-card rounded-2xl p-8 border-2 border-dashed transition-all duration-300 cursor-pointer
                ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }
                ${file ? "border-primary/50 bg-primary/5" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-4">
                {file ? (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-foreground font-medium">
                        {file.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Click or drag to replace
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-foreground font-medium">
                        Drop your PDF here
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        or click to browse
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Role Dropdown - PORTAL VERSION */}
          <div className="opacity-0 animate-fade-up animation-delay-400">
            <label className="block text-sm font-medium text-foreground mb-3">
              Target Role
            </label>
            <div className="relative">
              <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="w-full px-5 py-4 rounded-xl border border-border hover:border-primary/50 flex items-center justify-between text-left transition-all duration-300"
                style={{ backgroundColor: '#0a0f1e' }}
              >
                <span
                  className={
                    selectedRole ? "text-foreground" : "text-muted-foreground"
                  }
                >
                  {selectedRole || "Select a role"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Portal Dropdown */}
              {isDropdownOpen && createPortal(
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-[9998]"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  {/* Dropdown menu */}
                  <div 
                    ref={dropdownRef}
                    className="fixed z-[9999] rounded-xl border border-border shadow-2xl overflow-hidden"
                    style={{ 
                      backgroundColor: '#0a0f1e',
                      top: `${dropdownPosition.top}px`,
                      left: `${dropdownPosition.left}px`,
                      width: `${dropdownPosition.width}px`
                    }}
                  >
                    {jobRoles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-5 py-3 text-left transition-colors duration-200 ${
                          selectedRole === role
                            ? "bg-primary/20 text-primary"
                            : "text-foreground hover:bg-primary/10"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </>,
                document.body
              )}
            </div>
          </div>

          {/* Year Slider */}
          <div className="opacity-0 animate-fade-up animation-delay-600">
            <label className="block text-sm font-medium text-foreground mb-3">
              Target Year:{" "}
              <span className="text-primary font-semibold">{targetYear}</span>
            </label>
            <div className="glass-card rounded-xl px-6 py-5">
              <input
                type="range"
                min={2024}
                max={2030}
                value={targetYear}
                onChange={(e) => setTargetYear(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-6
                  [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-gradient-to-r
                  [&::-webkit-slider-thumb]:from-primary
                  [&::-webkit-slider-thumb]:to-accent
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:duration-200
                  [&::-webkit-slider-thumb]:hover:scale-110
                  [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:shadow-primary/30"
              />
              <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                <span>2024</span>
                <span>2027</span>
                <span>2030</span>
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <div className="pt-4 opacity-0 animate-fade-up animation-delay-600">
            <button
              onClick={handleAnalyze}
              disabled={!file || !selectedRole || isLoading}
              className="w-full btn-gradient text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Skills...
                </>
              ) : (
                "Analyze Skills"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyzePage;
