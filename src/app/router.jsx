import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import PublicLayout from '@/components/layout/PublicLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/features/auth/ProtectedRoute'

import Home from '@/pages/public/Home'
import Tours from '@/pages/public/Tours'
import TourDetails from '@/pages/public/TourDetails'
import Destinations from '@/pages/public/Destinations'
import DestinationDetails from '@/pages/public/DestinationDetails'
import About from '@/pages/public/About'
import Contact from '@/pages/public/Contact'
import Login from '@/pages/admin/Login'

const Dashboard = lazy(() => import('@/pages/admin/Dashboard'))
const ToursList = lazy(() => import('@/pages/admin/tours/ToursList'))
const CreateTour = lazy(() => import('@/pages/admin/tours/CreateTour'))
const EditTour = lazy(() => import('@/pages/admin/tours/EditTour'))
const TourPreview = lazy(() => import('@/pages/admin/tours/TourPreview'))
const DestinationsList = lazy(() => import('@/pages/admin/destinations/DestinationsList'))
const CreateDestination = lazy(() => import('@/pages/admin/destinations/CreateDestination'))
const EditDestination = lazy(() => import('@/pages/admin/destinations/EditDestination'))
const CategoriesList = lazy(() => import('@/pages/admin/categories/CategoriesList'))
const MediaLibrary = lazy(() => import('@/pages/admin/media/MediaLibrary'))
const PagesList = lazy(() => import('@/pages/admin/pages/PagesList'))
const HomeEditor = lazy(() => import('@/pages/admin/pages/HomeEditor'))
const PageEditor = lazy(() => import('@/pages/admin/pages/PageEditor'))
const GeneralSettings = lazy(() => import('@/pages/admin/settings/GeneralSettings'))
const ContactSettings = lazy(() => import('@/pages/admin/settings/ContactSettings'))
const SocialSettings = lazy(() => import('@/pages/admin/settings/SocialSettings'))
const ProfileSettings = lazy(() => import('@/pages/admin/settings/ProfileSettings'))

export default function AppRouter() {
  return (
    <Suspense fallback={<div className="route-loading">Loading…</div>}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="tours" element={<Tours />} />
          <Route path="tours/:slug" element={<TourDetails />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="destinations/:slug" element={<DestinationDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="tours" element={<ToursList />} />
            <Route path="tours/new" element={<CreateTour />} />
            <Route path="tours/:id/edit" element={<EditTour />} />
            <Route path="tours/:id/preview" element={<TourPreview />} />

            <Route path="destinations" element={<DestinationsList />} />
            <Route path="destinations/new" element={<CreateDestination />} />
            <Route path="destinations/:id/edit" element={<EditDestination />} />

            <Route path="categories" element={<CategoriesList />} />
            <Route path="media" element={<MediaLibrary />} />

            <Route path="pages" element={<PagesList />} />
            <Route path="pages/home" element={<HomeEditor />} />
            <Route path="pages/:slug" element={<PageEditor />} />

            <Route path="settings" element={<Navigate to="/admin/settings/general" replace />} />
            <Route path="settings/general" element={<GeneralSettings />} />
            <Route path="settings/contact" element={<ContactSettings />} />
            <Route path="settings/social" element={<SocialSettings />} />
            <Route path="settings/profile" element={<ProfileSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
