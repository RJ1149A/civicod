import React, { useState } from 'react';
import { Mail, Copy, ExternalLink, Building2, CheckCircle } from 'lucide-react';
import { CivicIssue } from '../types';
import { useLocation } from '../context/LocationContext';
import { findNearbyMunicipalities, generateEmailContent, openEmailClient, copyEmailContent } from '../services/emailService';

interface EmailMunicipalSubmissionProps {
  issue: CivicIssue;
}

const EmailMunicipalSubmission: React.FC<EmailMunicipalSubmissionProps> = ({ issue }) => {
  const { userLocation } = useLocation();
  const [userEmail, setUserEmail] = useState('');
  const [copiedMunicipality, setCopiedMunicipality] = useState<string | null>(null);
  const [showEmailInput, setShowEmailInput] = useState(false);

  const nearbyMunicipalities = findNearbyMunicipalities(userLocation, 100);

  const handleSendEmail = (municipality: any) => {
    const emailContent = generateEmailContent(issue, municipality);
    openEmailClient(emailContent.mailtoUrl);
  };

  const handleCopyEmail = async (municipality: any) => {
    const emailContent = generateEmailContent(issue, municipality);
    const success = await copyEmailContent(emailContent.body);
    
    if (success) {
      setCopiedMunicipality(municipality.id);
      setTimeout(() => setCopiedMunicipality(null), 2000);
    }
  };

  const handleShowEmailInput = () => {
    setShowEmailInput(true);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <Mail className="w-5 h-5" />
        <span>Email Municipal Corporations</span>
      </h3>
      
      <p className="text-gray-600 mb-4">
        Send emails directly to nearby municipal corporations with pre-filled templates.
      </p>

      {/* User Email Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Email Address (Optional)
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="input-field flex-1"
          />
          <button
            onClick={handleShowEmailInput}
            className="btn-secondary"
          >
            {showEmailInput ? 'Hide' : 'Add Email'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Adding your email will include it in the email template for better tracking.
        </p>
      </div>

      {/* Municipalities List */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Nearby Municipal Corporations</h4>
        
        {nearbyMunicipalities.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No municipal corporations found within 100km radius.</p>
          </div>
        ) : (
          nearbyMunicipalities.map((municipality) => {
            const emailContent = generateEmailContent(issue, municipality);
            
            return (
              <div key={municipality.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-gray-900">{municipality.name}</h5>
                    <p className="text-sm text-gray-600">{municipality.jurisdiction}</p>
                    <p className="text-xs text-gray-500">
                      {municipality.distance?.toFixed(1) || 'Unknown'}km away • {municipality.email}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={municipality.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-civic-600 hover:text-civic-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Email Preview */}
                <div className="bg-gray-50 rounded-md p-3 mb-3">
                  <div className="text-xs text-gray-600 mb-2">
                    <strong>To:</strong> {emailContent.to}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    <strong>Subject:</strong> {emailContent.subject}
                  </div>
                  <div className="text-xs text-gray-700">
                    <strong>Body:</strong>
                    <div className="mt-1 whitespace-pre-line text-xs">
                      {emailContent.body.substring(0, 200)}...
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleSendEmail(municipality)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Email</span>
                  </button>
                  
                  <button
                    onClick={() => handleCopyEmail(municipality)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    {copiedMunicipality === municipality.id ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Contact Information */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <strong>Phone:</strong> {municipality.phone}
                    </div>
                    <div>
                      <strong>Website:</strong> 
                      <a 
                        href={municipality.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-civic-600 hover:text-civic-700 ml-1"
                      >
                        Visit
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-2">How it works:</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Send Email:</strong> Opens your default email client with pre-filled content</li>
          <li>• <strong>Copy:</strong> Copies the email content to your clipboard</li>
          <li>• <strong>Your Email:</strong> Adding your email helps municipalities contact you back</li>
          <li>• <strong>Template:</strong> Emails are automatically formatted with issue details</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailMunicipalSubmission; 