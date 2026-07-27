'use client';

import React, { useState, useEffect, useRef } from 'react';
import { updateLegalAction } from '@/actions/legal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Check, FileText, Scale, AlertCircle } from 'lucide-react';

interface LegalFormProps {
  initialPrivacyPolicy: string;
  initialTermsOfService: string;
}

// Rich text editor wrapper using built-in contentEditable approach
// Uses a custom controlled editor to avoid react-quill SSR issues
function RichTextEditor({
  value,
  onChange,
  placeholder,
  id,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  id: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isComposingRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value && !isComposingRef.current) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const execCmd = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="border border-border dark:border-neutral-700 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-border dark:border-neutral-700 bg-soft-cream/50 dark:bg-neutral-800/50">
        {[
          { cmd: 'bold', label: 'B', title: 'Bold', cls: 'font-bold' },
          { cmd: 'italic', label: 'I', title: 'Italic', cls: 'italic' },
          { cmd: 'underline', label: 'U', title: 'Underline', cls: 'underline' },
        ].map(({ cmd, label, title, cls }) => (
          <button
            key={cmd}
            type="button"
            title={title}
            onMouseDown={(e) => { e.preventDefault(); execCmd(cmd); }}
            className={`px-2.5 py-1 rounded text-xs font-medium ${cls} bg-white dark:bg-neutral-700 hover:bg-velvet-red hover:text-white text-primary-black dark:text-soft-cream transition-colors border border-border dark:border-neutral-600`}
          >
            {label}
          </button>
        ))}
        <div className="w-px bg-warm-ivory dark:bg-neutral-600 mx-1" />
        {[
          { cmd: 'formatBlock', val: 'h2', label: 'H2' },
          { cmd: 'formatBlock', val: 'h3', label: 'H3' },
          { cmd: 'formatBlock', val: 'p', label: 'P' },
        ].map(({ cmd, val, label }) => (
          <button
            key={val}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCmd(cmd, val); }}
            className="px-2.5 py-1 rounded text-xs font-medium bg-white dark:bg-neutral-700 hover:bg-velvet-red hover:text-white text-primary-black dark:text-soft-cream transition-colors border border-border dark:border-neutral-600"
          >
            {label}
          </button>
        ))}
        <div className="w-px bg-warm-ivory dark:bg-neutral-600 mx-1" />
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCmd('insertUnorderedList'); }}
          className="px-2.5 py-1 rounded text-xs font-medium bg-white dark:bg-neutral-700 hover:bg-velvet-red hover:text-white text-primary-black dark:text-soft-cream transition-colors border border-border dark:border-neutral-600"
        >
          • List
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCmd('insertOrderedList'); }}
          className="px-2.5 py-1 rounded text-xs font-medium bg-white dark:bg-neutral-700 hover:bg-velvet-red hover:text-white text-primary-black dark:text-soft-cream transition-colors border border-border dark:border-neutral-600"
        >
          1. List
        </button>
      </div>
      
      {/* Editable area */}
      <div
        id={id}
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => {
          if (editorRef.current) onChange(editorRef.current.innerHTML);
        }}
        data-placeholder={placeholder}
        className="min-h-[300px] p-4 focus:outline-none text-sm leading-relaxed text-primary-black dark:text-soft-cream bg-white dark:bg-neutral-900 prose prose-sm dark:prose-invert max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-gray empty:before:pointer-events-none"
      />
    </div>
  );
}

export function LegalForm({ initialPrivacyPolicy, initialTermsOfService }: LegalFormProps) {
  const [privacyPolicy, setPrivacyPolicy] = useState(initialPrivacyPolicy);
  const [termsOfService, setTermsOfService] = useState(initialTermsOfService);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSaved(false);

    const result = await updateLegalAction({ privacyPolicy, termsOfService });

    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(result.error || 'Failed to save legal documents.');
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-velvet-red/20 bg-velvet-red/5">
        <AlertCircle className="w-5 h-5 text-velvet-red mt-0.5 shrink-0" />
        <p className="text-sm text-muted-gray">
          Your legal pages are <strong className="text-primary-black dark:text-soft-cream">pre-filled with Philippine-compliant default templates</strong> tailored for your photobooth business. You can edit them to match your exact business details, or leave them as-is. Changes update the live site immediately.
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2 border-b border-border dark:border-neutral-700">
        <button
          type="button"
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'privacy'
              ? 'border-velvet-red text-velvet-red'
              : 'border-transparent text-muted-gray hover:text-primary-black dark:hover:text-soft-cream'
          }`}
        >
          <FileText className="w-4 h-4" />
          Privacy Policy
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('terms')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'terms'
              ? 'border-velvet-red text-velvet-red'
              : 'border-transparent text-muted-gray hover:text-primary-black dark:hover:text-soft-cream'
          }`}
        >
          <Scale className="w-4 h-4" />
          Terms of Service
        </button>
      </div>

      {/* Editors */}
      <Card className="p-0 overflow-hidden">
        {activeTab === 'privacy' && (
          <div>
            <div className="p-4 border-b border-border dark:border-neutral-700">
              <h3 className="font-semibold text-sm text-primary-black dark:text-soft-cream">Privacy Policy Editor</h3>
              <p className="text-xs text-muted-gray mt-0.5">
                Visible at <a href="/privacy" target="_blank" className="text-velvet-red hover:underline">/privacy</a>
              </p>
            </div>
            <div className="p-4">
              <RichTextEditor
                id="privacy-editor"
                value={privacyPolicy}
                onChange={setPrivacyPolicy}
                placeholder="Write your Privacy Policy here..."
              />
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div>
            <div className="p-4 border-b border-border dark:border-neutral-700">
              <h3 className="font-semibold text-sm text-primary-black dark:text-soft-cream">Terms of Service Editor</h3>
              <p className="text-xs text-muted-gray mt-0.5">
                Visible at <a href="/terms" target="_blank" className="text-velvet-red hover:underline">/terms</a>
              </p>
            </div>
            <div className="p-4">
              <RichTextEditor
                id="terms-editor"
                value={termsOfService}
                onChange={setTermsOfService}
                placeholder="Write your Terms of Service here..."
              />
            </div>
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary-black hover:bg-primary-black/90 text-white"
        >
          {isSaving ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
          ) : saved ? (
            <><Check className="w-4 h-4 mr-2 text-cherry" /> Saved!</>
          ) : (
            'Save Legal Documents'
          )}
        </Button>
        <div className="flex gap-4 text-sm">
          <a href="/privacy" target="_blank" className="text-muted-gray hover:text-velvet-red transition-colors">
            Preview Privacy Policy ↗
          </a>
          <a href="/terms" target="_blank" className="text-muted-gray hover:text-velvet-red transition-colors">
            Preview Terms ↗
          </a>
        </div>
      </div>

      {error && (
        <p className="text-sm text-cherry flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </p>
      )}
    </div>
  );
}
