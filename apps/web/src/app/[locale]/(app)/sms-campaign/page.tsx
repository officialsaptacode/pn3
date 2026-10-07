'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SmsCampaignPage() {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateTemplate = async () => {
    setLoading(true);
    try {
      // Assuming a generic fetcher configured with auth headers
      const res = await fetch('/api/sms/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content }),
      });
      const data = await res.json();
      setTemplateId(data.id);
    } catch (e) {
      alert('Error creating template');
    }
    setLoading(false);
  };

  const handleEvaluateTemplate = async () => {
    if (!templateId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/sms/templates/${templateId}/evaluate`, {
        method: 'POST',
      });
      const data = await res.json();
      setIsApproved(data.isApproved);
      alert(`Score: ${data.layaScore} | Approved: ${data.isApproved}`);
    } catch (e) {
      alert('Error evaluating template');
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !templateId || !isApproved) {
      alert('Please complete all steps (template, evaluation, and CSV upload).');
      return;
    }

    setLoading(true);
    try {
      // 1. Get Presigned URL
      const presignedRes = await fetch('/api/sms/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      const { url, fullUrl } = await presignedRes.json();

      // 2. Upload directly to S3
      await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      // 3. Create Campaign
      const campRes = await fetch('/api/sms/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${name} Campaign`,
          templateId,
          csvUrl: fullUrl,
        }),
      });
      
      const campaign = await campRes.json();
      alert(`Campaign ${campaign.id} successfully queued!`);
      router.push('/sms-campaign/success');
      
    } catch (error) {
      console.error(error);
      alert('Failed to launch campaign');
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">New SMS Campaign</h1>
      
      <div className="space-y-4 border p-4 rounded-md">
        <h2 className="text-xl font-semibold">1. Draft Template</h2>
        <div>
          <label className="block mb-1">Template Name</label>
          <input 
            type="text" 
            className="w-full border p-2" 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
        </div>
        <div>
          <label className="block mb-1">Template Content</label>
          <textarea 
            className="w-full border p-2 h-32" 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            placeholder="Dear {name}, your due amount is {amount}."
          />
        </div>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleCreateTemplate}
          disabled={loading || !name || !content}
        >
          {loading ? 'Processing...' : 'Save Template'}
        </button>
      </div>

      {templateId && (
        <div className="space-y-4 border p-4 rounded-md">
          <h2 className="text-xl font-semibold">2. Compliance Check</h2>
          <p>Template is saved. Evaluate with Laya AI to ensure it's not spam.</p>
          <button 
            className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleEvaluateTemplate}
            disabled={loading || isApproved}
          >
            {isApproved ? 'Approved ✅' : (loading ? 'Evaluating...' : 'Evaluate Template')}
          </button>
        </div>
      )}

      {isApproved && (
        <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md">
          <h2 className="text-xl font-semibold">3. Upload Data & Send</h2>
          <div>
            <label className="block mb-1">Upload CSV (must contain 'phone' column)</label>
            <input 
              type="file" 
              accept=".csv"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <button 
            type="submit" 
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 w-full"
            disabled={loading || !file}
          >
            {loading ? 'Queuing Campaign...' : 'Send Campaign'}
          </button>
        </form>
      )}
    </div>
  );
}
