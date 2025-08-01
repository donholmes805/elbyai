
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { SiteContent } from '../types';
import { DEFAULT_SITE_CONTENT } from '../constants';

export interface ContentContextType {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
  loading: boolean;
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);

interface ContentProviderProps {
  children: ReactNode;
}

const contentDb = {
  getContent: (): SiteContent => {
    try {
      const contentJson = localStorage.getItem('elby_content_db');
      if (contentJson) {
        // Make sure the loaded content has all keys from the default
        const parsed = JSON.parse(contentJson);
        return { ...DEFAULT_SITE_CONTENT, ...parsed };
      }
      return DEFAULT_SITE_CONTENT;
    } catch (e) {
      return DEFAULT_SITE_CONTENT;
    }
  },
  saveContent: (content: SiteContent) => {
    localStorage.setItem('elby_content_db', JSON.stringify(content));
  },
};

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedContent = contentDb.getContent();
    setContent(loadedContent);
    setLoading(false);
  }, []);

  const updateContent = (updates: Partial<SiteContent>) => {
    const newContent = { ...content, ...updates };
    setContent(newContent);
    contentDb.saveContent(newContent);
  };

  const value = {
    content,
    updateContent,
    loading,
  };

  return (
    <ContentContext.Provider value={value}>
      {!loading && children}
    </ContentContext.Provider>
  );
};
