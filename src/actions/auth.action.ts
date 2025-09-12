"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, generateToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const institution = formData.get('institution') as string;
  const role = formData.get('role') as 'STUDENT' | 'ALUMNI';

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'User already exists' };
    }

    const hashedPassword = await hashPassword(password);
    const username = email.split('@')[0];

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username,
        institution,
        role,
      },
    });

    const token = generateToken(user.id, user.role);
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true };
  } catch (error) {
    return { error: 'Failed to create account' };
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !await verifyPassword(password, user.password)) {
      return { error: 'Invalid credentials' };
    }

    const token = generateToken(user.id, user.role);
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true };
  } catch (error) {
    return { error: 'Failed to sign in' };
  }
}

export async function signOut() {
  const cookieStore = cookies();
  cookieStore.delete('auth-token');
  redirect('/');
}