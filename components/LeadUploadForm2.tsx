import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import type { Lead } from './types';

const MAX_LEADS = 1000;
const MAX_FILE_SIZE_MB = 5;

interface LeadUploadFormProps {
  onLeadsParsed?: (leads: Lead[]) => void;
}

const LeadUploadForm: React.FC<LeadUploadFormProps> = ({ onLeadsParsed = () => {} }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const validateLead = (lead: any): lead is Lead => {
    return (
      typeof lead.firstName === 'string' &&
      typeof lead.lastName === 'string' &&
      typeof lead.email === 'string' &&
      typeof lead.company === 'string' &&
      typeof lead.title === 'string'
    );
  };

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setErrors([]);
    setLeads([]);
    setFileName(null);
    setUploadResult(null);
    setProgress(0);
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrors([`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`]);
      onLeadsParsed([]);
      return;
    }
    setFileName(file.name);
    Papa.parse<Lead>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<Lead>) => {
        const parsed: Lead[] = [];
        const errs: string[] = [];
        results.data.forEach((row: Lead, idx: number) => {
          if (validateLead(row)) {
            parsed.push(row);
          } else {
            errs.push(`Row ${idx + 2} is invalid or missing required fields.`);
          }
        });
        if (parsed.length > MAX_LEADS) {
          errs.push(`You can upload a maximum of ${MAX_LEADS} leads at a time. Your file contains ${parsed.length}.`);
          setLeads(parsed.slice(0, MAX_LEADS));
          onLeadsParsed(parsed.slice(0, MAX_LEADS));
        } else {
          setLeads(parsed);
          onLeadsParsed(parsed);
        }
        setErrors(errs);
      },
      error: (err: Error) => {
        setErrors([err.message]);
        onLeadsParsed([]);
      },
    });
  }, [onLeadsParsed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    setUploading(true);
    setUploadResult(null);
    setProgress(0);
    try {
      const res = await fetch('/api/leads/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads }),
      });
      // Simulate progress for UX
      let prog = 0;
      const interval = setInterval(() => {
        prog += 20;
        setProgress(Math.min(prog, 100));
        if (prog >= 100) clearInterval(interval);
      }, 100);
      const data = await res.json();
      setUploadResult(data.message || 'Upload complete');
      setProgress(100);
    } catch (e) {
      setUploadResult('Upload failed');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-card rounded-card shadow-card p-6 md:p-8 space-y-6">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center cursor-pointer bg-background hover:border-primary transition-colors duration-200"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-primary font-semibold">Drop the CSV file here ...</p>
        ) : (
          <p className="text-gray-700">Drag & drop a CSV file here, or <span className="text-primary underline">click to select</span></p>
        )}
        {fileName && <p className="mt-2 text-sm text-gray-500">Selected file: {fileName}</p>}
      </div>
      {errors.length > 0 && (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          <ul className="text-left text-sm space-y-1">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      {leads.length > 0 && (
        <div className="bg-background rounded-xl shadow-card p-4">
          <h3 className="font-semibold mb-2 text-lg text-primary">CSV Preview ({leads.length} leads)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border rounded-xl">
              <thead>
                <tr className="bg-primary/10 text-primary">
                  <th className="border px-2 py-1">First Name</th>
                  <th className="border px-2 py-1">Last Name</th>
                  <th className="border px-2 py-1">Email</th>
                  <th className="border px-2 py-1">Company</th>
                  <th className="border px-2 py-1">Title</th>
                  <th className="border px-2 py-1">Phone</th>
                  <th className="border px-2 py-1">Website</th>
                  <th className="border px-2 py-1">Industry</th>
                  <th className="border px-2 py-1">Company Size</th>
                  <th className="border px-2 py-1">Location</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 10).map((lead, i) => (
                  <tr key={i} className="even:bg-gray-50">
                    <td className="border px-2 py-1">{lead.firstName}</td>
                    <td className="border px-2 py-1">{lead.lastName}</td>
                    <td className="border px-2 py-1">{lead.email}</td>
                    <td className="border px-2 py-1">{lead.company}</td>
                    <td className="border px-2 py-1">{lead.title}</td>
                    <td className="border px-2 py-1">{lead.phone || '-'}</td>
                    <td className="border px-2 py-1">{lead.website || '-'}</td>
                    <td className="border px-2 py-1">{lead.industry || '-'}</td>
                    <td className="border px-2 py-1">{lead.companySize || '-'}</td>
                    <td className="border px-2 py-1">{lead.location || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leads.length > 10 && <p className="text-xs mt-1">Showing first 10 leads...</p>}
          </div>
          <button
            className="mt-4 px-6 py-2 bg-gradient-primary text-white font-semibold rounded-button shadow-button transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            onClick={handleUpload}
            disabled={uploading || leads.length === 0}
          >
            {uploading ? 'Uploading...' : 'Upload Leads'}
          </button>
          {uploading && (
            <div className="w-full bg-gray-200 rounded mt-2 h-2">
              <div
                className="bg-primary h-2 rounded"
                style={{ width: `${progress}%`, transition: 'width 0.2s' }}
              ></div>
            </div>
          )}
        </div>
      )}
      {uploadResult && <div className={`mt-2 ${uploadResult.includes('failed') ? 'text-red-600' : 'text-green-600'} font-medium`}>{uploadResult}</div>}
    </div>
  );
};

export default LeadUploadForm; 