const API_BASE = "http://localhost:8000";

export async function testBackend() {
  console.log("testBackend function called!");
  try {
    const response = await fetch(`${API_BASE}/api/test`);
    console.log("Response received:", response);
    const data = await response.json();
    console.log("Data parsed:", data);
    return data;
  } catch (error) {
    console.error("Backend connection failed:", error);
    return null;
  }
}

export async function analyzeResume(file: File, targetRole: string, targetYear: number) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target_role", targetRole);
  formData.append("target_year", targetYear.toString());

  try {
    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Analysis failed:", error);
    return null;
  }
}
