/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SpreadsheetDocumentView } from './components/SpreadsheetDocumentView';
import { GeneratorForm } from './components/GeneratorForm';
import { HistoryManager } from './components/HistoryManager';
import { ProfileManager } from './components/ProfileManager';
import { BankMasalahView } from './components/BankMasalahView';
import { 
  RingkasanMateriDoc, 
  PengawasProfile, 
  DEFAULT_PROFILE 
} from './types';
import { 
  getProfile, 
  saveProfile, 
  getHistory, 
  saveDocToHistory, 
  deleteDocFromHistory,
  createSampleDoc 
} from './utils/storage';

export default function App() {
  const [profile, setProfileState] = useState<PengawasProfile>(DEFAULT_PROFILE);
  const [history, setHistoryState] = useState<RingkasanMateriDoc[]>([]);
  const [currentDoc, setCurrentDoc] = useState<RingkasanMateriDoc>(createSampleDoc());
  const [activeView, setActiveView] = useState<'document' | 'form' | 'history' | 'profile' | 'guidelines'>('document');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const loadedProfile = getProfile();
    const loadedHistory = getHistory();
    setProfileState(loadedProfile);
    setHistoryState(loadedHistory);

    if (loadedHistory.length > 0) {
      setCurrentDoc(loadedHistory[0]);
    } else {
      const initial = createSampleDoc();
      setCurrentDoc(initial);
      const saved = saveDocToHistory(initial);
      setHistoryState(saved);
    }
  }, []);

  const handleDocGenerated = (newDoc: RingkasanMateriDoc) => {
    setCurrentDoc(newDoc);
    const updated = saveDocToHistory(newDoc);
    setHistoryState(updated);
    setActiveView('document');
  };

  const handleUpdateCurrentDoc = (updated: RingkasanMateriDoc) => {
    setCurrentDoc(updated);
    const updatedHistory = saveDocToHistory(updated);
    setHistoryState(updatedHistory);
  };

  const handleSelectHistoryDoc = (doc: RingkasanMateriDoc) => {
    setCurrentDoc(doc);
    setActiveView('document');
  };

  const handleDeleteHistoryDoc = (id: string) => {
    const updated = deleteDocFromHistory(id);
    setHistoryState(updated);
    if (currentDoc.id === id) {
      if (updated.length > 0) {
        setCurrentDoc(updated[0]);
      } else {
        const fallback = createSampleDoc();
        setCurrentDoc(fallback);
      }
    }
  };

  const handleSaveProfile = (newProfile: PengawasProfile) => {
    setProfileState(newProfile);
    saveProfile(newProfile);
  };

  const handleSelectMasalahFromBank = (aspek: string) => {
    // Update current doc's identitas or prep for generator
    setCurrentDoc((prev) => ({
      ...prev,
      identitas: {
        ...prev.identitas,
        aspekMasalah: aspek,
        aspekMasalahCustom: '',
      },
    }));
    setActiveView('form');
  };

  const handlePrint = () => {
    // If not in document view, switch to document view first, then print
    if (activeView !== 'document') {
      setActiveView('document');
      setTimeout(() => {
        window.print();
      }, 300);
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        currentDoc={currentDoc}
        onOpenNewModal={() => setActiveView('form')}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onPrint={handlePrint}
        activeView={activeView}
        setActiveView={setActiveView}
        isGenerating={isGenerating}
      />

      {/* Main Body with Sidebar & Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentDoc={currentDoc}
          historyCount={history.length}
        />

        {/* Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeView === 'document' && (
            <SpreadsheetDocumentView
              doc={currentDoc}
              onUpdateDoc={handleUpdateCurrentDoc}
              onPrint={handlePrint}
              onNavigateToForm={() => setActiveView('form')}
            />
          )}

          {activeView === 'form' && (
            <GeneratorForm
              currentDoc={currentDoc}
              profile={profile}
              onDocGenerated={handleDocGenerated}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              onViewDocument={() => setActiveView('document')}
            />
          )}

          {activeView === 'history' && (
            <HistoryManager
              history={history}
              currentDocId={currentDoc.id}
              onSelectDoc={handleSelectHistoryDoc}
              onDeleteDoc={handleDeleteHistoryDoc}
              onCreateNew={() => setActiveView('form')}
            />
          )}

          {activeView === 'profile' && (
            <ProfileManager
              profile={profile}
              onSaveProfile={handleSaveProfile}
            />
          )}

          {activeView === 'guidelines' && (
            <BankMasalahView
              onSelectMasalahAndGenerate={handleSelectMasalahFromBank}
            />
          )}
        </main>

      </div>

    </div>
  );
}
