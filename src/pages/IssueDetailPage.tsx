import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, MessageCircle, ThumbsUp, ThumbsDown, Send, MapPin, Building2, CheckCircle, XCircle } from 'lucide-react';
import { useIssues } from '../context/IssuesContext';
import { useLocation } from '../context/LocationContext';
import { CATEGORIES, STATUS_COLORS, STATUS_LABELS } from '../utils/constants';
import { calculateDistance, formatDistance } from '../utils/geolocation';
import { IssueStatus } from '../types';
import EmailMunicipalSubmission from '../components/EmailMunicipalSubmission';

const IssueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getIssueById, upvoteIssue, downvoteIssue, addComment, updateIssueStatus, submitToMunicipalities } = useIssues();
  const { userLocation } = useLocation();

  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [isSubmittingToMunicipalities, setIsSubmittingToMunicipalities] = useState(false);
  const [municipalSubmissionMessage, setMunicipalSubmissionMessage] = useState('');

  const issue = id ? getIssueById(id) : undefined;
  const category = issue ? CATEGORIES.find(cat => cat.value === issue.category) : undefined;

  const distance = issue ? calculateDistance(
    userLocation.lat,
    userLocation.lng,
    issue.location.lat,
    issue.location.lng
  ) : 0;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    if (!isAnonymous && !commentAuthor.trim()) {
      alert('Please provide your name or select anonymous commenting');
      return;
    }

    addComment(id!, {
      text: newComment.trim(),
      author: isAnonymous ? 'Anonymous' : commentAuthor.trim(),
      isAnonymous
    });

    setNewComment('');
    setCommentAuthor('');
  };

  const handleStatusChange = (status: IssueStatus) => {
    updateIssueStatus(id!, status);
  };

  const handleSubmitToMunicipalities = async () => {
    if (!issue) return;

    setIsSubmittingToMunicipalities(true);
    setMunicipalSubmissionMessage('');

    try {
      const result = await submitToMunicipalities(issue.id, userLocation);
      setMunicipalSubmissionMessage(result.message);
      
      if (result.success) {
        setTimeout(() => {
          setMunicipalSubmissionMessage('');
        }, 5000);
      }
    } catch (error) {
      setMunicipalSubmissionMessage('Failed to submit to municipalities. Please try again.');
    } finally {
      setIsSubmittingToMunicipalities(false);
    }
  };

  if (!issue) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Issue Not Found</h2>
        <p className="text-gray-600 mb-4">The issue you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Issues</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className={`status-badge ${STATUS_COLORS[issue.status]} text-white`}>
            {STATUS_LABELS[issue.status]}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Header */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{category?.icon}</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
                  <p className="text-gray-600">
                    {category?.label} • {issue.isAnonymous ? 'Anonymous' : issue.reportedBy}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">{issue.description}</p>

            {/* Location */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
              <MapPin className="w-4 h-4" />
              <span>{formatDistance(distance)} away</span>
              <span>•</span>
              <span>{issue.location.lat.toFixed(6)}, {issue.location.lng.toFixed(6)}</span>
            </div>

            {/* Photos */}
            {issue.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {issue.photos.map((photo, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={photo}
                      alt={`Issue photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Voting */}
            <div className="flex items-center space-x-6 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => upvoteIssue(issue.id)}
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{issue.upvotes}</span>
              </button>
              <button
                onClick={() => downvoteIssue(issue.id)}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <ThumbsDown className="w-4 h-4" />
                <span>{issue.downvotes}</span>
              </button>
              <div className="flex items-center space-x-2 text-gray-600">
                <MessageCircle className="w-4 h-4" />
                <span>{issue.comments.length} comments</span>
              </div>
            </div>
          </div>

          {/* Municipal Submissions */}
          {issue.municipalSubmissions && issue.municipalSubmissions.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Municipal Submissions</span>
              </h3>
              <div className="space-y-3">
                {issue.municipalSubmissions.map((submission, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{submission.municipalityName}</h4>
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

          {/* Email Municipal Submission */}
          <EmailMunicipalSubmission issue={issue} />

          {/* Submit to Municipalities Button */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Submit to Municipalities</span>
            </h3>
            <p className="text-gray-600 mb-4">
              Submit this issue to nearby municipal corporations for official action.
            </p>
            
            {municipalSubmissionMessage && (
              <div className={`p-3 rounded-md mb-4 ${
                municipalSubmissionMessage.includes('Successfully') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {municipalSubmissionMessage}
              </div>
            )}

            <button
              onClick={handleSubmitToMunicipalities}
              disabled={isSubmittingToMunicipalities}
              className="btn-primary flex items-center space-x-2"
            >
              {isSubmittingToMunicipalities ? (
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
          </div>

          {/* Comments */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
            
            {/* Add Comment */}
            <form onSubmit={handleSubmitComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="input-field mb-3"
              />
              
              <div className="flex items-center space-x-4 mb-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-gray-300 text-civic-600 focus:ring-civic-500"
                  />
                  <span className="text-sm text-gray-700">Comment anonymously</span>
                </label>
              </div>

              {!isAnonymous && (
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder="Your name"
                  className="input-field mb-3"
                  required={!isAnonymous}
                />
              )}

              <button type="submit" className="btn-primary flex items-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Add Comment</span>
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {issue.comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
              ) : (
                issue.comments.map(comment => (
                  <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {comment.isAnonymous ? 'Anonymous' : comment.author}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(comment.createdAt, 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
            <div className="space-y-2">
              {Object.entries(STATUS_LABELS).map(([status, label]) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status as IssueStatus)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    issue.status === status
                      ? 'bg-civic-100 text-civic-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Issue Details */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Reported:</span>
                <span className="ml-2 text-gray-900">
                  {format(issue.reportedAt, 'MMM d, yyyy')}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Category:</span>
                <span className="ml-2 text-gray-900">{category?.label}</span>
              </div>
              <div>
                <span className="text-gray-500">Reporter:</span>
                <span className="ml-2 text-gray-900">
                  {issue.isAnonymous ? 'Anonymous' : issue.reportedBy}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Distance:</span>
                <span className="ml-2 text-gray-900">{formatDistance(distance)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailPage; 