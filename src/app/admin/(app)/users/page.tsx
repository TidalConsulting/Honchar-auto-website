import { deleteUser } from "@/app/actions/admin";
import { AccountForms } from "@/components/admin/AccountForms";
import { getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Team" };
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const current = await getCurrentUser();
  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const isOwner = current?.role === "OWNER";

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">Team</h1>
      <p className="mt-1 text-ink-600">Who can sign in and manage inventory.</p>

      <div className="mt-6 overflow-hidden rounded-card border border-ink-200 bg-white">
        <ul className="divide-y divide-ink-100">
          {users.map((user) => (
            <li key={user.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-white">
                {user.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink-900">
                  {user.name}
                  {user.id === current?.id && (
                    <span className="ml-2 text-xs font-semibold text-ink-500">(you)</span>
                  )}
                </p>
                <p className="truncate text-sm text-ink-600">{user.email}</p>
              </div>
              <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-bold text-ink-700">
                {user.role === "OWNER" ? "Owner" : "Staff"}
              </span>
              <span className="hidden text-xs text-ink-500 sm:block">
                Added {formatDate(user.createdAt)}
              </span>
              {isOwner && user.id !== current?.id && (
                <form action={deleteUser}>
                  <input type="hidden" name="id" value={user.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </div>

      <AccountForms canAddUsers={isOwner} />
    </div>
  );
}
