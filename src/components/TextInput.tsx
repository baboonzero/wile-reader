import { useState, useRef } from 'react';
import { getWordCount } from '../utils/textParser';
import { parsePDF, parseMarkdown, validateFile, formatFileSize } from '../utils/fileParser';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
}

type InputTab = 'text' | 'files';

// Maximum file size: 1MB for PDFs to prevent parsing issues
const MAX_PDF_SIZE_BYTES = 1 * 1024 * 1024;

const SAMPLE_TEXT = `Speed reading is a collection of techniques which aim to increase reading speed without an unacceptable reduction in comprehension or retention. Speed reading methods include chunking and minimizing subvocalization.

The many available speed reading training programs may utilize books, videos, software, and seminars. Cognitive neuroscientist Stanislas Dehaene says that claims of reading up to 1,000 words per minute "must be viewed with skepticism".`;

export function TextInput({ onTextSubmit }: TextInputProps) {
  const [activeTab, setActiveTab] = useState<InputTab>('text');
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = getWordCount(text);

  const handleSubmit = () => {
    if (text.trim()) {
      onTextSubmit(text.trim());
    }
  };

  const handleUseSample = () => {
    setText(SAMPLE_TEXT);
    setActiveTab('text');
  };

  const handleFileSelect = async (file: File, type: 'markdown' | 'pdf') => {
    setError(null);
    setSelectedFile(file);
    setIsLoading(true);

    try {
      let extractedText = '';

      if (type === 'markdown') {
        if (!validateFile(file, ['.md', '.markdown'])) {
          throw new Error('Please select a valid Markdown file (.md)');
        }
        extractedText = await parseMarkdown(file);
      } else if (type === 'pdf') {
        if (!validateFile(file, ['.pdf'])) {
          throw new Error('Please select a valid PDF file (.pdf)');
        }
        extractedText = await parsePDF(file);
      }

      setText(extractedText);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
      setIsLoading(false);
      setSelectedFile(null);
      setText('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.toLowerCase();
      if (ext.endsWith('.md') || ext.endsWith('.markdown')) {
        handleFileSelect(file, 'markdown');
      } else if (ext.endsWith('.pdf')) {
        // Check PDF file size
        if (file.size > MAX_PDF_SIZE_BYTES) {
          setError(`PDF files must be under 1MB. Your file is ${formatFileSize(file.size)}.`);
          return;
        }
        handleFileSelect(file, 'pdf');
      } else {
        setError('Please select a Markdown (.md) or PDF (.pdf) file');
      }
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setText('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-bg-gradient-start to-bg-gradient-end flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <img 
            src="/icon-192.png" 
            alt="Wile Reader" 
            className="w-24 h-24 mx-auto rounded-2xl shadow-lg"
          />
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              Wile Reader
            </h1>
            <p className="text-text-secondary">
              Catch every word — speed reading with RSVP
            </p>
          </div>
        </div>

        {/* Input method tabs */}
        <div className="glass rounded-xl p-1 inline-flex">
          <button
            onClick={() => setActiveTab('text')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'text'
                ? 'bg-gradient-accent text-white shadow-glow-purple'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Text
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'files'
                ? 'bg-gradient-accent text-white shadow-glow-purple'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Files
          </button>
        </div>

        {/* Input area */}
        <div className="space-y-4">
          {/* Text Input Tab */}
          {activeTab === 'text' && (
            <div className="glass rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-secondary">
                  Enter or paste your text
                </label>
                <button
                  onClick={handleUseSample}
                  className="text-xs text-accent-primary hover:text-accent-secondary transition-colors"
                >
                  Use sample text
                </button>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here to begin speed reading..."
                className="w-full h-64 bg-bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 text-text-primary placeholder-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-all"
                autoFocus
              />
            </div>
          )}

          {/* Files Upload Tab */}
          {activeTab === 'files' && (
            <div className="glass rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-secondary">
                  Upload a file
                </label>
                {selectedFile && (
                  <button
                    onClick={clearFile}
                    className="text-xs text-accent-primary hover:text-accent-secondary transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />

              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-accent-primary/50 transition-all"
              >
                {isLoading ? (
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-text-secondary">Processing file...</p>
                  </div>
                ) : selectedFile ? (
                  <div className="text-center">
                    <svg className="w-16 h-16 text-accent-primary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-text-primary font-medium">{selectedFile.name}</p>
                    <p className="text-text-muted text-sm mt-1">{formatFileSize(selectedFile.size)}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg className="w-16 h-16 text-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-text-primary font-medium mb-1">Click to upload a file</p>
                    <p className="text-text-muted text-sm">Supports Markdown (.md) and PDF (.pdf) files only</p>
                  </div>
                )}
              </label>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Word count - shown for all tabs when text is available */}
          {text && (
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">
                  {wordCount === 0 ? 'No text extracted' : `${wordCount} words extracted`}
                </span>
                {wordCount > 0 && (
                  <span className="text-text-muted font-mono">
                    ~{Math.ceil(wordCount / 250)} min at 250 WPM
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Start button */}
          <button
            onClick={handleSubmit}
            disabled={wordCount === 0 || isLoading}
            className="w-full bg-gradient-accent text-white font-semibold py-4 rounded-xl shadow-glow-purple transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading
              ? 'Extracting text from file...'
              : wordCount === 0
              ? 'Enter text or upload file to start'
              : `Start Reading ${wordCount} words`}
          </button>
        </div>

        {/* Info */}
        <div className="text-center space-y-2 text-sm text-text-muted">
          <p>
            Powered by RSVP (Rapid Serial Visual Presentation)
          </p>
          <p className="text-xs">
            Upload PDFs, Markdown files, or paste text directly
          </p>
        </div>
      </div>
    </div>
  );
}
