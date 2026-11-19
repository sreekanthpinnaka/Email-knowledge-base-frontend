import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { WorkspacePage } from '@/pages/WorkspacePage';
import { UnderTheHoodPage } from '@/pages/UnderTheHoodPage';
import { AboutPage } from '@/pages/AboutPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<WorkspacePage />} />
        <Route path="/under-the-hood" element={<UnderTheHoodPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
