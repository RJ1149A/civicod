import React, { useState } from 'react';
import { format } from 'date-fns';
import { Building2, CheckCircle, XCircle } from 'lucide-react';
import { CivicIssue, MunicipalSubmission } from '../types';
import { useIssues } from '../context/IssuesContext';
import { useLocation } from '../context/LocationContext';

interface MunicipalSubmissionCardProps {
  issue: CivicIssue;
}

const MunicipalSubmissionCard: React.FC<MunicipalSubmissionCardProps> = ({ issue }) => {
  const { submitToMunicipalities } = useIssues();
  const { userLocation } = useLocation();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmitToMunicipalities = async () => {
    setIsSubmitting(true);
    setMessage('');

    try {
      const result = await submitToMunicipalities(issue.id, userLocation);
      setMessage(result.message);
      
      if (result.success) {
        setTimeout(() => {
          setMessage('');
        }, 5000);
      }
    } catch (error) {
      setMessage('Failed to submit to municipalities. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <Building2 className="w-5 h-5" />
        <span>Submit to Municipalities</span>
      </h3>
      <p className="text-gray-600 mb-4">
        Submit this issue to nearby municipal corporations for official action.
      </p>
      
      {message && (
        <div className={`p-3 rounded-md mb-4 ${
          message.includes('Successfully') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <button
        onClick={handleSubmitToMunicipalities}
        disabled={isSubmitting}
        className="btn-primary flex items-center space-x-2"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <Building2 className="w-4 h-4" />
            <span>Submit to Nearby Municipalities</span>
          </>
        )}
      </button>

      {/* Show existing submissions */}
      {issue.municipalSubmissions && issue.municipalSubmissions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Previous Submissions</h4>
          <div className="space-y-3">
            {issue.municipalSubmissions.map((submission: MunicipalSubmission, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{submission.municipalityName}</h5>
                  <div className="flex items-center space-x-2">
                    {submission.success ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${
                      submission.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {submission.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{submission.message}</p>
                {submission.referenceId && (
                  <p className="text-xs text-gray-500">Reference: {submission.referenceId}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Submitted: {format(submission.submittedAt, 'MMM d, yyyy HH:mm')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MunicipalSubmissionCard; 