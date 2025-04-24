import { PropsWithChildren } from 'react';
import Header from './header';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className='bg-gradient-to-br from-background to-muted'>
      <Header />
      <main className='min-h-screen container mx-auto px-4 py-8'>
        {children}
      </main>
      <footer className='border-t backdrop-blur py-12 supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto px-4 text-center '>
          <p className='text-sm text-muted-foreground'>
            &copy; {new Date().getFullYear()} JAMAL. All rights reserved.
            "joking"
          </p>
          <p className='text-sm text-muted-foreground'>
            Made with ❤️ by Razmik Danielyan
          </p>
        </div>
      </footer>
    </div>
  );
}
