"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, generateToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const email = formData.get('email')?.toString()?.trim();
  const password = formData.get('password')?.toString();
  const name = formData.get('name')?.toString()?.trim();
  const institution = formData.get('institution')?.toString()?.trim();
  const role = formData.get('role')?.toString() as 'STUDENT' | 'ALUMNI';

  if (!email || !password || !name || !institution || !role) {
    return { error: 'All fields are required' };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'User already exists' };
    }

    const hashedPassword = await hashPassword(password);
    let username = email.split('@')[0];
    
    // Ensure username uniqueness
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      username = `${username}_${Date.now()}`;
    }

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
  const email = formData.get('email')?.toString()?.trim();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

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
    // Log error without sensitive data
    return { error: 'Failed to sign in' };
  }
}

export async function signOut() {
  const cookieStore = cookies();
  cookieStore.delete('auth-token');
  redirect('/');
}