import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CivicIssue, IssueStatus, Comment, MunicipalSubmission } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { submitToNearbyMunicipalities } from '../services/municipalService';

interface IssuesContextType {
  issues: CivicIssue[];
  addIssue: (issue: Omit<CivicIssue, 'id' | 'reportedAt' | 'upvotes' | 'downvotes' | 'comments' | 'municipalSubmissions'>) => void;
  updateIssueStatus: (issueId: string, status: IssueStatus) => void;
  addComment: (issueId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  upvoteIssue: (issueId: string) => void;
  downvoteIssue: (issueId: string) => void;
  getIssueById: (id: string) => CivicIssue | undefined;
  submitToMunicipalities: (issueId: string, userLocation: { lat: number; lng: number }) => Promise<{ success: boolean; message: string }>;
}

const IssuesContext = createContext<IssuesContextType | undefined>(undefined);

export const useIssues = () => {
  const context = useContext(IssuesContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssuesProvider');
  }
  return context;
};

interface IssuesProviderProps {
  children: ReactNode;
}

export const IssuesProvider: React.FC<IssuesProviderProps> = ({ children }) => {
  const [issues, setIssues] = useState<CivicIssue[]>([]);

  // Load issues from localStorage on mount
  useEffect(() => {
    const savedIssues = localStorage.getItem('civic-issues');
    if (savedIssues) {
      try {
        const parsedIssues = JSON.parse(savedIssues);
        // Convert date strings back to Date objects
        const issuesWithDates = parsedIssues.map((issue: any) => ({
          ...issue,
          reportedAt: new Date(issue.reportedAt),
          comments: issue.comments.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt)
          })),
          municipalSubmissions: issue.municipalSubmissions?.map((submission: any) => ({
            ...submission,
            submittedAt: new Date(submission.submittedAt)
          })) || []
        }));
        setIssues(issuesWithDates);
      } catch (error) {
        console.error('Failed to load issues from localStorage:', error);
      }
    }
  }, []);

  // Save issues to localStorage whenever issues change
  useEffect(() => {
    localStorage.setItem('civic-issues', JSON.stringify(issues));
  }, [issues]);

  const addIssue = (issueData: Omit<CivicIssue, 'id' | 'reportedAt' | 'upvotes' | 'downvotes' | 'comments' | 'municipalSubmissions'>) => {
    const newIssue: CivicIssue = {
      ...issueData,
      id: uuidv4(),
      reportedAt: new Date(),
      upvotes: 0,
      downvotes: 0,
      comments: [],
      municipalSubmissions: []
    };
    setIssues(prev => [newIssue, ...prev]);
  };

  const updateIssueStatus = (issueId: string, status: IssueStatus) => {
    setIssues(prev => 
      prev.map(issue => 
        issue.id === issueId ? { ...issue, status } : issue
      )
    );
  };

  const addComment = (issueId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...commentData,
      id: uuidv4(),
      createdAt: new Date()
    };
    
    setIssues(prev => 
      prev.map(issue => 
        issue.id === issueId 
          ? { ...issue, comments: [...issue.comments, newComment] }
          : issue
      )
    );
  };

  const upvoteIssue = (issueId: string) => {
    setIssues(prev => 
      prev.map(issue => 
        issue.id === issueId ? { ...issue, upvotes: issue.upvotes + 1 } : issue
      )
    );
  };

  const downvoteIssue = (issueId: string) => {
    setIssues(prev => 
      prev.map(issue => 
        issue.id === issueId ? { ...issue, downvotes: issue.downvotes + 1 } : issue
      )
    );
  };

  const getIssueById = (id: string) => {
    return issues.find(issue => issue.id === id);
  };

  const submitToMunicipalities = async (issueId: string, userLocation: { lat: number; lng: number }) => {
    const issue = getIssueById(issueId);
    if (!issue) {
      return { success: false, message: 'Issue not found' };
    }

    try {
      const result = await submitToNearbyMunicipalities(issue, userLocation);
      
      if (result.success) {
        // Update the issue with municipal submission results
        const submissions: MunicipalSubmission[] = result.submissions.map(sub => ({
          municipalityId: sub.municipality.id,
          municipalityName: sub.municipality.name,
          submittedAt: new Date(),
          success: sub.result.success,
          message: sub.result.message,
          referenceId: sub.result.referenceId
        }));

        setIssues(prev => 
          prev.map(issue => 
            issue.id === issueId 
              ? { ...issue, municipalSubmissions: submissions }
              : issue
          )
        );

        const successfulCount = submissions.filter(s => s.success).length;
        return {
          success: true,
          message: `Successfully submitted to ${successfulCount} nearby municipality(ies)`
        };
      } else {
        return {
          success: false,
          message: 'No nearby municipalities found or all submissions failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to submit to municipalities: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };

  const value: IssuesContextType = {
    issues,
    addIssue,
    updateIssueStatus,
    addComment,
    upvoteIssue,
    downvoteIssue,
    getIssueById,
    submitToMunicipalities
  };

  return (
    <IssuesContext.Provider value={value}>
      {children}
    </IssuesContext.Provider>
  );
}; 