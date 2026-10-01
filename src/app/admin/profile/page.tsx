import { ProfileForm } from "@/components/admin/profile-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findFirst({ orderBy: { id: "asc" } });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Public content</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Manage the details visitors see on your homepage.</p>
      </header>

      <ProfileForm
        profile={profile ? {
          name: profile.name,
          headline: profile.headline,
          bio: profile.bio,
          location: profile.location,
          email: profile.email,
          phone: profile.phone,
          profileImage: profile.profileImage,
          resumeUrl: profile.resumeUrl,
        } : null}
      />
    </div>
  );
}