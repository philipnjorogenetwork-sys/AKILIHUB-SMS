/**
 * File Upload/Download Utility
 * Handles file selection and download operations
 */

/**
 * Trigger file picker dialog and return selected file
 */
export async function pickFile(accept: string = "*"): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      resolve(file || null);
    };
    input.click();
  });
}

/**
 * Trigger file picker for multiple files
 */
export async function pickFiles(accept: string = "*"): Promise<File[]> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = accept;
    input.onchange = (e: any) => {
      const files = Array.from(e.target.files || []) as File[];
      resolve(files);
    };
    input.click();
  });
}

/**
 * Trigger image picker
 */
export async function pickImage(): Promise<File | null> {
  return pickFile("image/*");
}

/**
 * Download file from blob or URL
 */
export function downloadFile(data: Blob | string, filename: string) {
  const blob = typeof data === "string" ? new Blob([data], { type: "text/plain" }) : data;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download CSV data
 */
export function downloadCSV(data: any[], filename: string) {
  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => {
    const value = row[h];
    // Escape quotes in values
    if (typeof value === "string" && value.includes(",")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }).join(","));

  const csv = [headers.join(","), ...rows].join("\n");
  downloadFile(csv, filename || "export.csv");
}

/**
 * Download JSON data
 */
export function downloadJSON(data: any[], filename: string) {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename || "export.json");
}

/**
 * Convert file to base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

/**
 * Read file as text
 */
export async function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

/**
 * Read CSV file and parse it
 */
export async function parseCSV(file: File): Promise<any[]> {
  const text = await fileToText(file);
  const lines = text.split("\n").filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.trim());
  const data = lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
    const obj: any = {};
    headers.forEach((h, i) => {
      obj[h] = values[i];
    });
    return obj;
  });

  return data;
}
