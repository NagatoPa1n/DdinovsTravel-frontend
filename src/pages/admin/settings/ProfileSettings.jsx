import { useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/hooks/useAuth'
import { authApi } from '@/features/auth/authApi'
import { validate, required, email as emailRule, minLength } from '@/utils/validation'

const PROFILE_RULES = { name: [required()], email: [required(), emailRule()] }
const PASSWORD_RULES = {
  currentPassword: [required()],
  newPassword: [required(), minLength(8)],
}

export default function ProfileSettings() {
  const { user, setUser } = useAuth()
  const toast = useToast()
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [profileErrors, setProfileErrors] = useState({})
  const [savingProfile, setSavingProfile] = useState(false)

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    if (user) setProfile({ name: user.name || '', email: user.email || '' })
  }, [user])

  const saveProfile = async (event) => {
    event.preventDefault()
    const found = validate(profile, PROFILE_RULES)
    setProfileErrors(found)
    if (Object.keys(found).length) return

    setSavingProfile(true)
    try {
      const updated = await authApi.updateProfile(profile)
      setUser(updated?.user ?? { ...user, ...profile })
      toast.success('Profile updated')
    } catch (error) {
      toast.error(error.data?.message || 'Could not update your profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const savePassword = async (event) => {
    event.preventDefault()
    const found = validate(passwords, PASSWORD_RULES)
    if (passwords.newPassword !== passwords.confirmPassword) {
      found.confirmPassword = 'Passwords do not match'
    }
    setPasswordErrors(found)
    if (Object.keys(found).length) return

    setSavingPassword(true)
    try {
      await authApi.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      })
      toast.success('Password changed')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      // A wrong current password is a 400, not a 401 — a 401 would clear the token
      // and sign the user out mid-edit.
      toast.error(error.data?.message || 'Could not change your password')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <>
      <header className="admin-head">
        <h1>Your profile</h1>
      </header>

      <form className="form" onSubmit={saveProfile} noValidate>
        <section className="panel">
          <h2>Account</h2>
          <Input
            label="Name"
            name="name"
            value={profile.name}
            onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))}
            error={profileErrors.name}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={profile.email}
            onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
            error={profileErrors.email}
            required
          />
          <div className="form__actions">
            <Button type="submit" loading={savingProfile}>Save profile</Button>
          </div>
        </section>
      </form>

      <form className="form" onSubmit={savePassword} noValidate>
        <section className="panel">
          <h2>Password</h2>
          <Input
            label="Current password"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            value={passwords.currentPassword}
            onChange={(event) => setPasswords((prev) => ({ ...prev, currentPassword: event.target.value }))}
            error={passwordErrors.currentPassword}
            required
          />
          <Input
            label="New password"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            value={passwords.newPassword}
            onChange={(event) => setPasswords((prev) => ({ ...prev, newPassword: event.target.value }))}
            error={passwordErrors.newPassword}
            required
          />
          <Input
            label="Confirm new password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={passwords.confirmPassword}
            onChange={(event) => setPasswords((prev) => ({ ...prev, confirmPassword: event.target.value }))}
            error={passwordErrors.confirmPassword}
            required
          />
          <div className="form__actions">
            <Button type="submit" loading={savingPassword}>Change password</Button>
          </div>
        </section>
      </form>
    </>
  )
}
