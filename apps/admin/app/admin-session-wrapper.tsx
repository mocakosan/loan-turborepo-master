"use client";

import React from "react";

import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

export default function AdminSessionWrapper({ children }: Props) {
  return (
    <SessionProvider basePath="/admin/api/auth/admin">
      {children}
    </SessionProvider>
  );
}
