import { Head, router, useForm } from '@inertiajs/react';
import { usePermissions } from 'inertia-permissions';
import { Archive, RotateCcw, SquarePen, Trash2, Users } from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import Modal from '@/components/helper/Model';
import { normalizeBDPhone } from '@/components/helper/NormalizePhone';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Role = { id: number; name: string };
type TabType = 'users' | 'trash';
type StatusFilter = '' | 'active' | 'inactive';

type UserRow = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  is_active: boolean;
  created_at: string;
  deleted_at: string | null;
  role: string | null;
};

type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

type PaginatedUsers = {
  data: UserRow[];
  links: PaginationLink[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

type Props = {
  users: PaginatedUsers;
  roles: Role[];
  stats: {
    users_count: number;
    trash_count: number;
    active_count: number;
    inactive_count: number;
  };
  filters?: {
    q?: string;
    role?: string;
    status?: string;
    tab?: TabType;
  };
  auth: { permissions: string[] };
};

type UserFormData = {
  name: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  is_active: '1' | '0';
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: dashboard().url },
  { title: 'Users', href: '#' },
];

const INDEX_ROUTE = 'admin.users';

const showFirstError = (errors: Record<string, string>) => {
  const firstKey = Object.keys(errors)[0];
  const firstMsg = firstKey ? errors[firstKey] : 'Something went wrong';
  Swal.fire({ icon: 'error', title: 'Action failed', text: firstMsg });
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function RoleSelect({
  roles,
  value,
  onChange,
  error,
}: {
  roles: Role[];
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Role</label>
      <select
        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select role</option>
        {roles.map((r) => (
          <option key={r.id} value={r.name}>
            {r.name}
          </option>
        ))}
      </select>
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
    </div>
  );
}

function StatusSelect({
  value,
  onChange,
  error,
}: {
  value: '1' | '0';
  onChange: (val: '1' | '0') => void;
  error?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Status</label>
      <select
        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900"
        value={value}
        onChange={(e) => onChange(e.target.value as '1' | '0')}
      >
        <option value="1">Active</option>
        <option value="0">Inactive</option>
      </select>
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
    </div>
  );
}

function Pagination({ links }: { links: PaginationLink[] }) {
  if (!links?.length) return null;

  return (
    <div className="mt-5 flex flex-wrap justify-end gap-2">
      {links.map((link, idx) => (
        <button
          key={idx}
          disabled={!link.url}
          onClick={() => link.url && router.visit(link.url, { preserveScroll: true, preserveState: true })}
          className={cx(
            'rounded-lg border px-3 py-1.5 text-sm transition',
            link.active
              ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
            !link.url && 'cursor-not-allowed opacity-50',
          )}
          dangerouslySetInnerHTML={{ __html: link.label }}
        />
      ))}
    </div>
  );
}

function StatCard({ title, value, tone = 'default' }: { title: string; value: number; tone?: 'default' | 'green' | 'red' | 'amber' }) {
  const toneClass = {
    default: 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
    green: 'border-green-200 bg-green-50/70 dark:border-green-900/40 dark:bg-green-950/20',
    red: 'border-red-200 bg-red-50/70 dark:border-red-900/40 dark:bg-red-950/20',
    amber: 'border-amber-200 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/20',
  }[tone];

  return (
    <div className={cx('rounded-2xl border p-4', toneClass)}>
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</div>
      <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
    </div>
  );
}

export default function AdminUsersPage({ users, roles, stats, auth, filters }: Props) {
  const { canAny } = usePermissions();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  const activeTab = (filters?.tab ?? 'users') as TabType;
  const [search, setSearch] = useState(filters?.q ?? '');
  const [roleFilter, setRoleFilter] = useState(filters?.role ?? '');
  const [statusFilter, setStatusFilter] = useState((filters?.status ?? '') as StatusFilter);
  const debounceRef = useRef<number | null>(null);

  const canShowActions = canAny([
    'admin.user.update',
    'admin.user.destroy',
    'admin.user.restore',
    'admin.user.forcedelete',
  ]);

  const buildParams = (overrides?: Partial<{ q: string; role: string; status: StatusFilter; tab: TabType }>) => ({
    q: (overrides?.q ?? search)?.trim() || undefined,
    role: (overrides?.role ?? roleFilter)?.trim() || undefined,
    status: (overrides?.status ?? statusFilter) || undefined,
    tab: overrides?.tab ?? activeTab,
  });

  const visitIndex = (overrides?: Partial<{ q: string; role: string; status: StatusFilter; tab: TabType }>) => {
    router.get(route(INDEX_ROUTE), buildParams(overrides), {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      only: ['users', 'roles', 'stats', 'filters'],
    });
  };

  const onSearchChange = (value: string) => {
    setSearch(value);

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      visitIndex({ q: value });
    }, 350);
  };

  const onRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    visitIndex({ role: value });
  };

  const onStatusFilterChange = (value: StatusFilter) => {
    setStatusFilter(value);
    visitIndex({ status: value });
  };

  const onTabChange = (tab: TabType) => {
    const nextStatus = tab === 'trash' ? '' : statusFilter;
    if (tab === 'trash') {
      setStatusFilter('');
    }

    visitIndex({ tab, status: nextStatus });
  };

  const createForm = useForm<UserFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: '',
    is_active: '1',
  });

  const editForm = useForm<UserFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: '',
    is_active: '1',
  });

  const openCreate = () => {
    createForm.reset();
    createForm.clearErrors();
    setCreateOpen(true);
  };

  const openEdit = (user: UserRow) => {
    setSelectedUser(user);
    editForm.setData({
      name: user.name,
      email: user.email ?? '',
      phone: user.phone,
      password: '',
      password_confirmation: '',
      role: user.role ?? '',
      is_active: user.is_active ? '1' : '0',
    });
    editForm.clearErrors();
    setEditOpen(true);
  };

  const closeCreate = () => {
    setCreateOpen(false);
    createForm.clearErrors();
  };

  const closeEdit = () => {
    setEditOpen(false);
    setSelectedUser(null);
    editForm.clearErrors();
  };

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();

    createForm.post(route('admin.user.store'), {
      preserveScroll: true,
      onStart: () => {
        Swal.fire({
          title: 'Creating user...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });
      },
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'User created successfully',
          showConfirmButton: false,
          timer: 1200,
        });
        closeCreate();
        createForm.reset();
      },
      onError: (errors) => {
        Swal.close();
        showFirstError(errors);
      },
    });
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    editForm.put(route('admin.user.update', { user: selectedUser.id }), {
      preserveScroll: true,
      onStart: () => {
        Swal.fire({
          title: 'Updating user...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });
      },
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'User updated successfully',
          showConfirmButton: false,
          timer: 1200,
        });
        closeEdit();
      },
      onError: (errors) => {
        Swal.close();
        showFirstError(errors);
      },
    });
  };

  const confirmTrash = async (user: UserRow) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Move user to trash?',
      text: `"${user.name}" will be moved to trash.`,
      showCancelButton: true,
      confirmButtonText: 'Yes, move to trash',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
    });

    if (!result.isConfirmed) return;

    router.delete(route('admin.user.destroy', { user: user.id }), {
      preserveScroll: true,
      onStart: () => {
        Swal.fire({ title: 'Moving to trash...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      },
      onSuccess: () => {
        Swal.fire({ icon: 'success', title: 'User moved to trash', showConfirmButton: false, timer: 1200 });
      },
      onError: (errors) => {
        Swal.close();
        showFirstError(errors);
      },
    });
  };

  const confirmRestore = async (user: UserRow) => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Restore user?',
      text: `Do you want to restore "${user.name}"?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, restore',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#16a34a',
    });

    if (!result.isConfirmed) return;

    router.patch(route('admin.user.restore', { id: user.id }), {}, {
      preserveScroll: true,
      onStart: () => {
        Swal.fire({ title: 'Restoring user...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      },
      onSuccess: () => {
        Swal.fire({ icon: 'success', title: 'User restored successfully', showConfirmButton: false, timer: 1200 });
      },
      onError: (errors) => {
        Swal.close();
        showFirstError(errors);
      },
    });
  };

  const confirmForceDelete = async (user: UserRow) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete permanently?',
      text: `"${user.name}" will be permanently deleted and cannot be recovered.`,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete permanently',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#b91c1c',
    });

    if (!result.isConfirmed) return;

    router.delete(route('admin.user.forcedelete', { id: user.id }), {
      preserveScroll: true,
      onStart: () => {
        Swal.fire({ title: 'Deleting permanently...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      },
      onSuccess: () => {
        Swal.fire({ icon: 'success', title: 'User permanently deleted', showConfirmButton: false, timer: 1200 });
      },
      onError: (errors) => {
        Swal.close();
        showFirstError(errors);
      },
    });
  };

  const statusSummary = useMemo(() => {
    if (activeTab === 'trash') {
      return `${stats.trash_count} trashed users`;
    }

    return `${stats.active_count} active / ${stats.inactive_count} inactive`;
  }, [activeTab, stats.active_count, stats.inactive_count, stats.trash_count]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />

      <div className="flex h-full flex-1 flex-col gap-5 rounded-2xl p-4 md:p-6">
        <div className="overflow-hidden rounded-2xl skShadow p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Users</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage users, roles, activation status, and trash from one place.
              </p>

              <div className="mt-4 inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => onTabChange('users')}
                  className={cx(
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition',
                    activeTab === 'users'
                      ? 'bg-orange-500 text-white shadow'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                  )}
                >
                  <Users size={16} />
                  Users
                  <span className={cx(
                    'rounded-full px-2 py-0.5 text-xs',
                    activeTab === 'users' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
                  )}>
                    {stats.users_count}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onTabChange('trash')}
                  className={cx(
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition',
                    activeTab === 'trash'
                      ? 'bg-red-500 text-white shadow'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                  )}
                >
                  <Archive size={16} />
                  Trash
                  <span className={cx(
                    'rounded-full px-2 py-0.5 text-xs',
                    activeTab === 'trash' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
                  )}>
                    {stats.trash_count}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {auth.permissions.includes('admin.user.store') && activeTab === 'users' && (
                <Button
                  onClick={openCreate}
                  className='text-orange-500 font-bold'
                >
                  + Add User
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Users" value={stats.users_count} />
          <StatCard title="Active Users" value={stats.active_count} tone="green" />
          <StatCard title="Inactive Users" value={stats.inactive_count} tone="amber" />
          <StatCard title="Trash" value={stats.trash_count} tone="red" />
        </div>

        <div className=" p-4 skShadow rounded-2xl">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {activeTab === 'users' ? 'Users List' : 'Trash List'}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{statusSummary}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap xl:items-center">
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={activeTab === 'trash' ? 'Search trashed users...' : 'Search by name, phone or email...'}
                className="min-w-[240px] px-4 py-2.5 text-sm outline-none transition border border-gray-500 rounded-md dark:bg-gray-800"
              />

              <select
                value={roleFilter}
                onChange={(e) => onRoleFilterChange(e.target.value)}
                className="min-w-[180px]  px-4 py-2.5 text-sm outline-none transition border border-gray-500 rounded-md dark:bg-gray-800"
              >
                <option value="">All roles</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>

              {activeTab === 'users' && (
                <select
                  value={statusFilter}
                  onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
                  className="min-w-[180px] px-4 py-2.5 text-sm outline-none transition border border-gray-500 rounded-md dark:bg-gray-800"
                >
                  <option value="">All status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              )}
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              {users.data.length === 0 ? (
                <div className="px-6 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
                  {activeTab === 'trash' ? 'No trashed users found.' : 'No users found.'}
                </div>
              ) : (
                <table className="w-full min-w-[860px] border-collapse">
                  <thead className="bg-slate-50 dark:bg-neutral-900/80">
                    <tr className="text-left">
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Name</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Phone</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Role</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Created</th>
                      {canShowActions && (
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Actions</th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {users.data.map((user) => {
                      const statusBadge = activeTab === 'trash'
                        ? <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-300">Trashed</span>
                        : user.is_active
                          ? <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-300">Active</span>
                          : <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">Inactive</span>;

                      return (
                        <tr key={user.id} className="border-t border-slate-200 bg-white transition hover:bg-slate-50 dark:border-slate-800 dark:bg-neutral-800 dark:hover:bg-neutral-800/70">
                          <td className="px-4 py-4">
                            <div className="font-medium text-slate-900 dark:text-slate-100">{user.name}</div>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{user.phone}</td>
                          <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{user.email ?? '—'}</td>
                          <td className="px-4 py-4 text-sm font-medium text-orange-500">{user.role ?? '—'}</td>
                          <td className="px-4 py-4">{statusBadge}</td>
                          <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          {canShowActions && (
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-end gap-2">
                                {activeTab === 'users' && auth.permissions.includes('admin.user.update') && (
                                  <button
                                    onClick={() => openEdit(user)}
                                    className="inline-flex items-center rounded-xl border border-slate-200 p-2 text-orange-500 transition hover:bg-orange-50 dark:border-slate-700 dark:hover:bg-slate-900"
                                    title="Edit user"
                                  >
                                    <SquarePen size={18} />
                                  </button>
                                )}

                                {activeTab === 'users' && auth.permissions.includes('admin.user.destroy') && (
                                  <button
                                    onClick={() => confirmTrash(user)}
                                    className="inline-flex items-center rounded-xl border border-slate-200 p-2 text-red-500 transition hover:bg-red-50 dark:border-slate-700 dark:hover:bg-slate-900"
                                    title="Move to trash"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                )}

                                {activeTab === 'trash' && auth.permissions.includes('admin.user.restore') && (
                                  <button
                                    onClick={() => confirmRestore(user)}
                                    className="inline-flex items-center rounded-xl border border-slate-200 p-2 text-green-600 transition hover:bg-green-50 dark:border-slate-700 dark:hover:bg-slate-900"
                                    title="Restore user"
                                  >
                                    <RotateCcw size={18} />
                                  </button>
                                )}

                                {activeTab === 'trash' && auth.permissions.includes('admin.user.forcedelete') && (
                                  <button
                                    onClick={() => confirmForceDelete(user)}
                                    className="inline-flex items-center rounded-xl border border-slate-200 p-2 text-red-700 transition hover:bg-red-50 dark:border-slate-700 dark:hover:bg-slate-900"
                                    title="Delete permanently"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <Pagination links={users.links} />
        </div>
      </div>

      <Modal isOpen={createOpen} onClose={closeCreate} title="Create User" width="w-full max-w-2xl">
        <form onSubmit={submitCreate} className="space-y-4" autoComplete="off">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Name</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900"
                value={createForm.data.name}
                onChange={(e) => createForm.setData('name', e.target.value)}
              />
              {createForm.errors.name && <div className="mt-1 text-sm text-red-600">{createForm.errors.name}</div>}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Phone</label>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+8801XXXXXXXXX"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900"
                value={createForm.data.phone}
                onChange={(e) => createForm.setData('phone', normalizeBDPhone(e.target.value))}
              />
              {createForm.errors.phone && <div className="mt-1 text-sm text-red-600">{createForm.errors.phone}</div>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</label>
              <input
                type="email"
                autoComplete="off"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900"
                value={createForm.data.email}
                onChange={(e) => createForm.setData('email', e.target.value)}
              />
              {createForm.errors.email && <div className="mt-1 text-sm text-red-600">{createForm.errors.email}</div>}
            </div>

            <StatusSelect
              value={createForm.data.is_active}
              onChange={(val) => createForm.setData('is_active', val)}
              error={createForm.errors.is_active}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</label>
              <input
                type="password"
                autoComplete="new-password"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900"
                value={createForm.data.password}
                onChange={(e) => createForm.setData('password', e.target.value)}
              />
              {createForm.errors.password && <div className="mt-1 text-sm text-red-600">{createForm.errors.password}</div>}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Confirm Password</label>
              <input
                type="password"
                autoComplete="new-password"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900"
                value={createForm.data.password_confirmation}
                onChange={(e) => createForm.setData('password_confirmation', e.target.value)}
              />
            </div>
          </div>

          <RoleSelect
            roles={roles}
            value={createForm.data.role}
            onChange={(value) => createForm.setData('role', value)}
            error={createForm.errors.role}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeCreate} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">
              Cancel
            </button>
            <button
              disabled={createForm.processing}
              className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {createForm.processing ? 'Saving...' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={editOpen}
        onClose={closeEdit}
        title={`Edit User${selectedUser ? `: ${selectedUser.name}` : ''}`}
        width="w-full max-w-2xl"
      >
        <form onSubmit={submitEdit} className="space-y-4" autoComplete="off">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Name</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900"
                value={editForm.data.name}
                onChange={(e) => editForm.setData('name', e.target.value)}
              />
              {editForm.errors.name && <div className="mt-1 text-sm text-red-600">{editForm.errors.name}</div>}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Phone</label>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900"
                value={editForm.data.phone}
                onChange={(e) => editForm.setData('phone', normalizeBDPhone(e.target.value))}
              />
              {editForm.errors.phone && <div className="mt-1 text-sm text-red-600">{editForm.errors.phone}</div>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</label>
              <input
                type="email"
                autoComplete="off"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900"
                value={editForm.data.email}
                onChange={(e) => editForm.setData('email', e.target.value)}
              />
              {editForm.errors.email && <div className="mt-1 text-sm text-red-600">{editForm.errors.email}</div>}
            </div>

            <StatusSelect
              value={editForm.data.is_active}
              onChange={(val) => editForm.setData('is_active', val)}
              error={editForm.errors.is_active}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">New Password (optional)</label>
              <input
                type="password"
                autoComplete="new-password"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900"
                value={editForm.data.password}
                onChange={(e) => editForm.setData('password', e.target.value)}
              />
              {editForm.errors.password && <div className="mt-1 text-sm text-red-600">{editForm.errors.password}</div>}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Confirm Password</label>
              <input
                type="password"
                autoComplete="new-password"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900"
                value={editForm.data.password_confirmation}
                onChange={(e) => editForm.setData('password_confirmation', e.target.value)}
              />
            </div>
          </div>

          <RoleSelect
            roles={roles}
            value={editForm.data.role}
            onChange={(value) => editForm.setData('role', value)}
            error={editForm.errors.role}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeEdit} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">
              Cancel
            </button>
            <button
              disabled={editForm.processing}
              className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
            >
              {editForm.processing ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
