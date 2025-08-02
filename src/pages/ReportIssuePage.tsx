import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, Upload, MapPin, Mail } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useIssues } from '../context/IssuesContext';
import { CATEGORIES, MAX_PHOTOS, MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from '../utils/constants';
import { IssueCategory } from '../types';

const ReportIssuePage: React.FC = () => {
  const navigate = useNavigate();
  const { userLocation } = useLocation();
  const { addIssue } = useIssues();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('roads');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const maxFiles = Math.min(files.length, MAX_PHOTOS - photos.length);

    for (let i = 0; i < maxFiles; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotos(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (!isAnonymous && !reporterName.trim()) {
      alert('Please provide your name or select anonymous reporting');
      return;
    }

    setIsSubmitting(true);

    try {
      addIssue({
        title: title.trim(),
        description: description.trim(),
        category,
        location: {
          lat: userLocation.lat,
          lng: userLocation.lng
        },
        photos,
        status: 'reported',
        reportedBy: isAnonymous ? 'Anonymous' : reporterName.trim(),
        isAnonymous
      });

      navigate('/');
    } catch (error) {
      console.error('Failed to submit issue:', error);
      alert('Failed to submit issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report an Issue</h1>
        <p className="text-gray-600">
          Help improve your community by reporting local issues in your neighborhood.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issue Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={MAX_TITLE_LENGTH}
            className="input-field"
            placeholder="Brief description of the issue"
            required
          />
          <div className="text-xs text-gray-500 mt-1">
            {title.length}/{MAX_TITLE_LENGTH} characters
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={MAX_DESCRIPTION_LENGTH}
            rows={4}
            className="input-field"
            placeholder="Provide detailed information about the issue..."
            required
          />
          <div className="text-xs text-gray-500 mt-1">
            {description.length}/{MAX_DESCRIPTION_LENGTH} characters
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as IssueCategory)}
            className="input-field"
            required
          >
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label} - {cat.description}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Using your current location. You can adjust this later if needed.
          </p>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photos (Optional)
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={photos.length >= MAX_PHOTOS}
                />
                <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4" />
                  <span className="text-sm">
                    {photos.length >= MAX_PHOTOS ? 'Max photos reached' : 'Upload Photos'}
                  </span>
                </div>
              </label>
              <span className="text-xs text-gray-500">
                {photos.length}/{MAX_PHOTOS} photos
              </span>
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Email Address (Optional)
          </label>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="input-field"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Adding your email helps municipalities contact you back and enables email submissions.
          </p>
        </div>

        {/* Reporter Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reporter Information
          </label>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-gray-300 text-civic-600 focus:ring-civic-500"
              />
              <span className="text-sm text-gray-700">Report anonymously</span>
            </label>

            {!isAnonymous && (
              <div>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="input-field"
                  placeholder="Your name"
                  required={!isAnonymous}
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Submit Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportIssuePage; 