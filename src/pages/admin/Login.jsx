import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { validate, required, email as emailRule } from '@/utils/validation'

const RULES = { email: [required(), emailRule()], password: [required()] }

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/admin'} replace />
  }

  const change = (event) =>
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setFormError('')
    const found = validate(values, RULES)
    setErrors(found)
    if (Object.keys(found).length) return

    setSubmitting(true)
    try {
      await login(values)
      navigate(location.state?.from?.pathname || '/admin', { replace: true })
    } catch (error) {
      setFormError(error.status === 401 ? 'Incorrect email or password.' : 'Could not sign in. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login">
      <form className="login__card form" onSubmit={submit} noValidate>
        <h1>Ddinovs Admin</h1>
        <p className="muted">Sign in to manage tours and content.</p>

        {formError && <p className="form__error">{formError}</p>}

        <Input label="Email" name="email" type="email" autoComplete="username" value={values.email} onChange={change} error={errors.email} required />
        <Input label="Password" name="password" type="password" autoComplete="current-password" value={values.password} onChange={change} error={errors.password} required />

        <Button type="submit" loading={submitting} size="lg">Sign in</Button>
      </form>
    </div>
  )
}
