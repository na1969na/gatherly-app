import { NextResponse } from 'next/server';
import supabase from '@/lib/db/supabaseClient';

export async function GET(request: Request) {
  const url = new URL(request.url);

  const { data: session, error } = await supabase.auth.getSessionFromUrl({
    url: request.url,
  });

  if (error) {
    console.error('Auth callback error:', error.message);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/signin`);
  }

  // ユーザー情報を取得
  const user = session.user;

  // Supabaseにユーザー情報を保存
  const { error: insertError } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email,
      name: user.user_metadata.full_name,
      avatar_url: user.user_metadata.avatar_url,
    });

  if (insertError) {
    console.error('Error saving user:', insertError.message);
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/`);
}
