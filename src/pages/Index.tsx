import React, { useRef } from 'react';
import Icon from '../components/Icon';
import { useParallax } from '../lib/motion';

const Index: React.FC = () => {
  const floatRef = useParallax<HTMLDivElement>({ speed: 0.18 });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-slate-50" />

        <div className="container py-28">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <h1 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                Engage your users with delightful motion
              </h1>
              <p className="mb-6 max-w-xl text-lg text-muted-foreground">
                A human-first UI refresh with Montserrat typography, realistic icons, and layered parallax
                interactions to bring depth and focus to your application.
              </p>
              <div className="flex gap-4">
                <button className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-5 py-3 font-semibold shadow">
                  Get Started
                </button>
                <button className="inline-flex items-center gap-2 rounded-md border px-5 py-3">
                  Learn More
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div ref={floatRef} className="w-full max-w-md animate-float-slow">
                <div className="rounded-2xl bg-card p-8 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 shrink-0 rounded-lg bg-primary flex items-center justify-center text-white">
                      <Icon width={20} height={20} viewBox="0 0 24 24">
                        <path d="M12 2L15 8l6 .5-4.5 3 1.5 6L12 15l-6 3 1.5-6L3 8.5 9 8l3-6z" fill="currentColor" />
                      </Icon>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Interactive Card</h3>
                      <p className="text-sm text-muted-foreground">Subtle depth and motion create a sense of quality.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
