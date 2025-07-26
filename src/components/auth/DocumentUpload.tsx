import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  X,
  Eye,
  Download
} from 'lucide-react';

interface DocumentUploadProps {
  documentType: 'primary_id' | 'secondary_id' | 'address_proof' | 'income_proof';
  title: string;
  description: string;
  acceptedFormats: string[];
  maxSize: number; // in MB
  onUpload: (file: File) => void;
  onRemove: () => void;
  uploadedFile?: File | null;
  required?: boolean;
}

export function DocumentUpload({
  documentType,
  title,
  description,
  acceptedFormats,
  maxSize,
  onUpload,
  onRemove,
  uploadedFile,
  required = false
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !acceptedFormats.includes(fileExtension)) {
      toast({
        title: 'Invalid File Type',
        description: `Please upload a file in one of these formats: ${acceptedFormats.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      toast({
        title: 'File Too Large',
        description: `File size must be less than ${maxSize}MB`,
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onUpload(file);
      
      toast({
        title: 'Document Uploaded',
        description: `${title} has been uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'There was an error uploading your document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: 'Document Removed',
      description: `${title} has been removed.`,
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentRequirements = () => {
    const requirements = {
      primary_id: [
        'Government-issued photo ID',
        'Must be current and not expired',
        'Clear, readable image',
        'All four corners visible'
      ],
      secondary_id: [
        'Secondary form of identification',
        'Can be passport, military ID, or state ID',
        'Must match name on primary ID',
        'Clear, readable image'
      ],
      address_proof: [
        'Recent utility bill or bank statement',
        'Must be dated within last 90 days',
        'Address must match application',
        'Full document visible'
      ],
      income_proof: [
        'Recent pay stub or tax return',
        'Must be dated within last 60 days',
        'Shows employer and income information',
        'All pages if multi-page document'
      ]
    };

    return requirements[documentType] || [];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>{title}</span>
          {required && <span className="text-red-500">*</span>}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Requirements */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Requirements:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            {getDocumentRequirements().map((req, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Upload Area */}
        {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFormats.map(format => `.${format}`).join(',')}
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                Drop your document here, or{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 underline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500">
                Accepted formats: {acceptedFormats.join(', ')} • Max size: {maxSize}MB
              </p>
            </div>

            {isUploading && (
              <div className="mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-blue-600 mt-2">Uploading...</p>
              </div>
            )}
          </div>
        ) : (
          /* Uploaded File Display */
          <div className="border rounded-lg p-4 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">{uploadedFile.name}</p>
                  <p className="text-xs text-green-700">{formatFileSize(uploadedFile.size)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-700 hover:text-green-900"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-700 hover:text-green-900"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                  onClick={handleRemoveFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
          <div className="text-xs text-gray-700">
            <p className="font-medium">Security Notice:</p>
            <p>Your documents are encrypted and stored securely. They will only be used for account verification purposes and will be deleted after verification is complete.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
