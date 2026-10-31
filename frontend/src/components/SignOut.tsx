'use client';
import React from 'react';
import { Button } from './ui/button';
import { useSafeAuth } from '@/lib/auth-context';

function SignOut() {
  const { signOut } = useSafeAuth();
  return (
    <Button variant={'outline'} onClick={() => signOut()}>
      Sign Out
    </Button>
  );
}

export default SignOut;
