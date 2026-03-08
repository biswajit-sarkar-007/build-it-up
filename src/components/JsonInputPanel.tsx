import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileJson, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EXAMPLES } from '@/lib/exampleData';

interface JsonInputPanelProps {
  onJsonSubmit: (json: unknown) => void;
}

const JsonInputPanel: React.FC<JsonInputPanelProps> = ({ onJsonSubmit }) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const validateAndSubmit = useCallback((text: string) => {
    setError(null);
    try {
      const parsed = JSON.parse(text);
      onJsonSubmit(parsed);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [onJsonSubmit]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (!file.name.endsWith('.json')) {
      setError('Only .json files are accepted');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('File too large. Max 2MB');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJsonText(text);
      validateAndSubmit(text);
    };
    reader.readAsText(file);
  }, [validateAndSubmit]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    maxFiles: 1,
    noClick: false,
  });

  const loadExample = (data: unknown) => {
    const text = JSON.stringify(data, null, 2);
    setJsonText(text);
    setFileName(null);
    setError(null);
    validateAndSubmit(text);
  };

  const handleGenerate = () => {
    if (!jsonText.trim()) {
      setError('Please paste or upload JSON data');
      return;
    }
    validateAndSubmit(jsonText);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="paste" className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="paste" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Paste JSON
          </TabsTrigger>
          <TabsTrigger value="upload" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Upload File
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paste" className="mt-4">
          <div className="relative">
            <textarea
              value={jsonText}
              onChange={(e) => { setJsonText(e.target.value); setError(null); setFileName(null); }}
              placeholder='Paste your JSON here... e.g. [{"id": 1, "name": "Alice"}]'
              className="w-full h-72 rounded-lg border border-border bg-card p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              spellCheck={false}
            />
            {error && (
              <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <div
            {...getRootProps()}
            className={`h-72 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
            }`}
          >
            <input {...getInputProps()} />
            <motion.div
              animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {fileName ? (
                <FileJson className="h-12 w-12 text-primary" />
              ) : (
                <Upload className="h-12 w-12 text-muted-foreground" />
              )}
            </motion.div>
            {fileName ? (
              <p className="text-foreground font-medium">{fileName}</p>
            ) : (
              <>
                <p className="text-foreground font-medium">Drop your .json file here</p>
                <p className="text-sm text-muted-foreground">or click to browse (max 2MB)</p>
              </>
            )}
          </div>
          {error && (
            <div className="mt-2 flex items-center gap-2 rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Example loaders */}
      <div>
        <p className="text-sm text-muted-foreground mb-3">Or try an example:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.name}
              onClick={() => loadExample(ex.data)}
              className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-secondary-foreground hover:bg-muted transition-colors"
            >
              <span>{ex.icon}</span>
              <span>{ex.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGenerate}
        className="w-full rounded-lg bg-primary py-3.5 text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
      >
        Generate Schemas →
      </motion.button>
    </div>
  );
};

export default JsonInputPanel;
