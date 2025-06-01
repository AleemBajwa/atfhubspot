import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { FiUpload, FiFile, FiX, FiTrash2, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
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
    <div className="relative bg-gradient-to-br from-white to-[#f5f7fa] rounded-2xl shadow-soft border-t-4 border-[#00b8ff] p-8 transition-all duration-300">
      <div {...getRootProps()} className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 mb-6 transition-all duration-200 cursor-pointer w-full bg-[#f8fafc] hover:shadow-lg hover:border-[#00b8ff] ${isDragActive ? 'border-[#00b8ff] bg-[#e6f7ff] shadow-lg' : 'border-gray-200'}`}
        style={{ minHeight: 180 }}>
        <input {...getInputProps()} />
        <FiUpload className="w-16 h-16 text-[#e6f7ff] absolute opacity-20 pointer-events-none" style={{ top: 20, left: '50%', transform: 'translateX(-50%)' }} />
        <FiUpload className="w-10 h-10 text-[#00b8ff] mb-2 z-10" />
        <p className="text-[#1a2b49] text-xl mb-1 font-extrabold z-10">Drag & drop your CSV file here, or <span className="text-[#00b8ff] underline">browse</span></p>
        <p className="text-sm text-gray-400 z-10">Maximum file size: {MAX_FILE_SIZE_MB}MB • Maximum leads: {MAX_LEADS}</p>
      </div>
      {fileName && (
        <div className="flex items-center gap-2 mb-4 bg-[#e6f7ff] text-[#1a2b49] px-4 py-2 rounded-full w-fit mx-auto shadow-sm text-sm font-semibold">
          <FiFile className="w-4 h-4 text-[#00b8ff]" />
          <span>{fileName}</span>
          <button onClick={() => { setFileName(null); setLeads([]); setErrors([]); setUploadResult(null); }} className="ml-2 hover:text-[#00b8ff]" title="Remove file">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}
      {errors.length > 0 && (
        <ul className="mb-4 flex flex-col gap-1 items-center">
          {errors.map((err, i) => (
            <li key={i} className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-medium border border-red-100"><FiAlertCircle className="w-4 h-4" />{err}</li>
          ))}
        </ul>
      )}
      {leads.length > 0 && (
        <div className="mt-4 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-extrabold text-[#1a2b49]">CSV Preview</h3>
            <button onClick={() => { setLeads([]); setFileName(null); setErrors([]); setUploadResult(null); }} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#e6f7ff] hover:bg-[#00b8ff] hover:text-white text-[#1a2b49] rounded-full transition" title="Clear">
              <FiTrash2 className="w-4 h-4" />Clear
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-soft">
            <table className="min-w-full divide-y divide-gray-200 text-sm rounded-xl overflow-hidden">
              <thead className="bg-[#e6f7ff]">
                <tr>
                  {['First Name', 'Last Name', 'Email', 'Company', 'Title', 'Phone', 'Website', 'Industry', 'Company Size', 'Location'].map((header) => (
                    <th key={header} className="px-4 py-2 text-left font-bold text-[#1a2b49] uppercase tracking-wider whitespace-nowrap">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.slice(0, 10).map((lead, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-[#f8fafc]' : ''}>
                    <td className="px-4 py-2 whitespace-nowrap">{lead.firstName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lead.lastName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lead.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lead.company}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lead.title}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lead.phone || '-'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lead.website || '-'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lead.industry || '-'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lead.companySize || '-'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lead.location || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {leads.length > 10 && <p className="text-xs text-gray-400 mt-1">Showing first 10 of {leads.length} leads</p>}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleUpload}
              disabled={uploading || leads.length === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00b8ff] text-white font-bold rounded-lg shadow hover:bg-[#0099cc] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload className="w-4 h-4" />
                  Upload {leads.length} Leads
                </>
              )}
            </button>
          </div>
          {uploading && (
            <div className="w-full bg-gray-100 rounded mt-2 h-2">
              <div className="bg-[#00b8ff] h-2 rounded" style={{ width: `${progress}%`, transition: 'width 0.2s' }}></div>
            </div>
          )}
          {uploadResult && (
            <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${uploadResult.includes('failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {uploadResult.includes('failed') ? <FiAlertCircle className="w-5 h-5" /> : <FiCheckCircle className="w-5 h-5" />}
              <span className="font-medium">{uploadResult}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeadUploadForm; 