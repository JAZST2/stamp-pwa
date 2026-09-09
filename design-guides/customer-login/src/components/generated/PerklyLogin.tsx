import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Gift, Sparkles } from 'lucide-react';
export const PerklyLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#F7F8FB] px-5 py-8 text-[#322D45] sm:flex sm:items-center sm:justify-center sm:py-10">
      <section
        className="mx-auto flex min-h-[810px] w-full max-w-[402px] flex-col items-center sm:min-h-0"
        aria-labelledby="login-title"
      >
        <header className="text-center">
          <p className="font-heading text-[28px] font-bold tracking-[-0.04em] text-[#322D45]">
            <span>PerklyPh</span>
          </p>
          <p className="mt-1.5 text-[14px] font-normal leading-5 text-[#8B859D]">
            <span>Your loyalty, rewarded.</span>
          </p>
        </header>

        <figure
          className="mt-8 flex h-[134px] w-full items-center justify-center"
          aria-label="Pastel loyalty stamp card illustration"
        >
          <div className="flex h-[88px] w-[148px] rotate-[-5deg] flex-col justify-between rounded-[20px] border border-[#E6AD87]/50 bg-[#FFC9A3] p-4 shadow-[0_14px_30px_rgba(80,65,105,0.09)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#6E5161]">
                Perk card
              </span>
              <Sparkles className="h-4 w-4 text-[#6E5161]" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F8FB] text-[#322D45] shadow-sm">
                <Gift className="h-4 w-4" aria-hidden="true" />
              </span>
              <span
                className="h-8 w-8 rounded-full border-2 border-dashed border-[#A87878]/55 bg-[#FFD9BD]"
                aria-hidden="true"
              />
              <span
                className="h-8 w-8 rounded-full border-2 border-dashed border-[#A87878]/55 bg-[#FFD9BD]"
                aria-hidden="true"
              />
            </div>
          </div>
          <span
            className="-ml-5 mt-20 flex h-12 w-12 rotate-[8deg] items-center justify-center rounded-[15px] border-[5px] border-[#F7F8FB] bg-[#9FE0C7] shadow-[0_8px_18px_rgba(80,65,105,0.12)]"
            aria-hidden="true"
          >
            <Sparkles className="h-5 w-5 text-[#322D45]" />
          </span>
        </figure>

        <section
          className="mt-5 w-full rounded-[20px] border border-white/70 bg-[#E4DFF5] px-6 py-7 shadow-[0_18px_45px_rgba(71,58,98,0.10)]"
          aria-labelledby="login-title"
        >
          <div>
            <h1
              id="login-title"
              className="font-heading text-[26px] font-semibold leading-tight tracking-[-0.03em] text-[#322D45]"
            >
              <span>Welcome back</span>
            </h1>
            <p className="mt-2 text-[14px] leading-5 text-[#746E86]">
              <span>Log in to keep collecting your rewards.</span>
            </p>
          </div>

          <form className="mt-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="ml-1 block text-[13px] font-medium text-[#5F596F]">
                <span>Email address</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="mt-2 h-14 w-full rounded-2xl border border-[#CBC5DB] bg-[#F7F8FB] px-4 text-[15px] text-[#322D45] shadow-[0_2px_0_rgba(50,45,69,0.02)] outline-none transition placeholder:text-[#9A94AA] focus:border-[#68C9A3] focus:ring-4 focus:ring-[#9FE0C7]/30"
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="password"
                className="ml-1 block text-[13px] font-medium text-[#5F596F]"
              >
                <span>Password</span>
              </label>
              <div className="mt-2 flex h-14 w-full items-center rounded-2xl border border-[#CBC5DB] bg-[#F7F8FB] px-4 shadow-[0_2px_0_rgba(50,45,69,0.02)] transition focus-within:border-[#68C9A3] focus-within:ring-4 focus-within:ring-[#9FE0C7]/30">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className="min-w-0 flex-1 bg-transparent text-[15px] text-[#322D45] outline-none placeholder:text-[#9A94AA]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(visible => !visible)}
                  className="ml-3 flex h-9 w-9 items-center justify-center rounded-full text-[#746E86] transition hover:bg-[#E4DFF5] hover:text-[#322D45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#68C9A3]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-[19px] w-[19px]" aria-hidden="true" />
                  ) : (
                    <Eye className="h-[19px] w-[19px]" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <a
                href="#forgot-password"
                className="rounded-md px-1 py-1 text-[13px] font-medium text-[#3F9F7B] transition hover:text-[#2F7D61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#68C9A3]"
              >
                <span>Forgot password?</span>
              </a>
            </div>

            <button
              type="submit"
              className="mt-5 flex h-14 w-full items-center justify-center rounded-full bg-[#9FE0C7] px-6 text-[15px] font-semibold text-[#322D45] shadow-[0_8px_18px_rgba(78,164,131,0.18)] transition hover:-translate-y-0.5 hover:bg-[#8FD8BC] hover:shadow-[0_12px_24px_rgba(78,164,131,0.22)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#68C9A3]/35 active:translate-y-0"
            >
              <span>{submitted ? 'Welcome back!' : 'Log In'}</span>
            </button>
          </form>
        </section>

        <p className="mt-6 text-center text-[14px] leading-6 text-[#746E86]">
          <span>Don&apos;t have an account? </span>
          <a
            href="#sign-up"
            className="rounded font-medium text-[#3F9F7B] transition hover:text-[#2F7D61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#68C9A3]"
          >
            <span>Sign up</span>
          </a>
        </p>
      </section>
    </main>
  );
};
