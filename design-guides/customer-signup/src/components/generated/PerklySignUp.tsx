import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
export const PerklySignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };
  return <main className="min-h-screen w-full bg-[#F7F8FB] px-4 py-7 text-[#322D45] sm:grid sm:place-items-center sm:py-10">
      <section className="mx-auto w-full max-w-[402px]" aria-labelledby="signup-title">
        <header className="mb-6 text-center">
          <a href="#" className="inline-flex items-center gap-2 rounded-full px-3 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9FE0C7] focus-visible:ring-offset-2" aria-label="PerklyPh home">
            <span className="font-['Sora'] text-[29px] font-bold tracking-[-0.055em] text-[#322D45]">PerklyPh</span>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#FFC9A3]" aria-hidden="true">
              <Sparkles size={13} strokeWidth={2.5} />
            </span>
          </a>
          <p className="mt-1 text-[13px] font-medium tracking-[0.01em] text-[#7F798F]">
            <span>Your everyday rewards, made delightful.</span>
          </p>
        </header>

        <article className="rounded-[20px] border border-white/70 bg-[#E4DFF5] p-5 shadow-[0_22px_55px_-32px_rgba(50,45,69,0.5)] sm:p-6">
          <div className="mb-5">
            <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#716B82]">
              <span className="h-2 w-2 rounded-full bg-[#FFC9A3]" aria-hidden="true" />
              <span>New member</span>
            </p>
            <h1 id="signup-title" className="font-['Sora'] text-[24px] font-semibold leading-tight tracking-[-0.035em]">
              <span>Create your account</span>
            </h1>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="full-name" className="sr-only">Full name</label>
              <input id="full-name" name="fullName" type="text" autoComplete="name" required placeholder="Full name" className="perkly-input" />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email" required placeholder="Email address" className="perkly-input" />
            </div>

            <div className="flex min-h-12 overflow-hidden rounded-2xl border border-[#C8C2D9] bg-[#E4DFF5] transition focus-within:border-[#74CFAE] focus-within:ring-3 focus-within:ring-[#9FE0C7]/40">
              <span className="flex shrink-0 items-center gap-2 border-r border-[#C8C2D9] px-3 text-sm font-medium" aria-label="Philippines country code">
                <span role="img" aria-label="Philippines flag">🇵🇭</span>
                <span>+63</span>
              </span>
              <label htmlFor="mobile" className="sr-only">Mobile number</label>
              <input id="mobile" name="mobile" type="tel" inputMode="tel" autoComplete="tel-national" required placeholder="Mobile number" className="min-w-0 flex-1 bg-transparent px-3.5 text-[15px] outline-none placeholder:text-[#8D879C]" />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required minLength={8} placeholder="Password" className="perkly-input pr-12" />
              <button type="button" onClick={() => setShowPassword(value => !value)} className="absolute inset-y-0 right-1.5 my-auto grid h-9 w-9 place-items-center rounded-full text-[#716B82] transition hover:bg-white/50 hover:text-[#322D45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#74CFAE]" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>
                {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>

            <div className="relative">
              <label htmlFor="confirm-password" className="sr-only">Confirm password</label>
              <input id="confirm-password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" required minLength={8} placeholder="Confirm password" className="perkly-input pr-12" />
              <button type="button" onClick={() => setShowConfirmPassword(value => !value)} className="absolute inset-y-0 right-1.5 my-auto grid h-9 w-9 place-items-center rounded-full text-[#716B82] transition hover:bg-white/50 hover:text-[#322D45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#74CFAE]" aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'} aria-pressed={showConfirmPassword}>
                {showConfirmPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 py-1 text-[12px] leading-5 text-[#716B82]">
              <input name="terms" type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-[#A9A2BB] accent-[#78CDB0] focus:ring-[#9FE0C7]" />
              <span>
                I agree to the{' '}
                <a href="#terms" className="font-medium text-[#3F9478] underline decoration-[#9FE0C7] decoration-2 underline-offset-2 hover:text-[#322D45]">
                  <span>Terms &amp; Privacy Policy</span>
                </a>
              </span>
            </label>

            <button type="submit" className="mt-1 flex min-h-12 w-full items-center justify-center rounded-full bg-[#9FE0C7] px-5 text-[15px] font-semibold text-[#322D45] shadow-[0_8px_20px_-12px_rgba(50,45,69,0.7)] transition hover:-translate-y-0.5 hover:bg-[#8BD8BA] hover:shadow-[0_12px_24px_-14px_rgba(50,45,69,0.75)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#74CFAE]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#E4DFF5] active:translate-y-0">
              <span>{submitted ? 'Account details saved' : 'Create Account'}</span>
            </button>

            <p className={`text-center text-xs font-medium text-[#3F7F69] ${submitted ? 'block' : 'sr-only'}`} role="status" aria-live="polite">
              <span>Looks good — welcome to PerklyPh!</span>
            </p>
          </form>
        </article>

        <p className="mt-5 text-center text-[13px] text-[#716B82]">
          <span>Already have an account? </span>
          <a href="#login" className="font-semibold text-[#3F9478] underline decoration-transparent underline-offset-4 transition hover:decoration-[#9FE0C7] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9FE0C7]">
            <span>Log in</span>
          </a>
        </p>
      </section>
    </main>;
};