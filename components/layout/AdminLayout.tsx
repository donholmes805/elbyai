

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';

const adminNavLinks = [
  { name: 'User Management', to: ROUTES.ADMIN_USERS, roles: [UserRole.SUB_ADMIN, UserRole.SUPER_ADMIN] },
  { name: 'Content Management', to: ROUTES.ADMIN_CONTENT, roles: [UserRole.SUB_ADMIN, UserRole.SUPER_ADMIN] },
  { name: 'System Health', to: ROUTES.ADMIN_HEALTH, roles: [UserRole.SUPER_ADMIN] },
  { name: 'Payments', to: ROUTES.ADMIN_PAYMENTS, roles: [UserRole.SUPER_ADMIN] },
];

const AdminLayout: React.FC = () => {
    const { user } = useAuth();

    const activeLinkClass = "bg-brand-primary text-white";
    const inactiveLinkClass = "text-gray-600 hover:bg-gray-200 hover:text-gray-900";

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <nav className="w-64 bg-brand-light border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold text-brand-dark mb-6">Admin Dashboard</h2>
        <ul className="space-y-2">
            {adminNavLinks.map(link => (
                user && link.roles.includes(user.role) && (
                    <li key={link.name}>
                        <NavLink
                            to={link.to}
                            className={({ isActive }) =>
                                `w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? activeLinkClass : inactiveLinkClass}`
                            }
                        >
                            {link.name}
                        </NavLink>
                    </li>
                )
            ))}
        </ul>
      </nav>
      <main className="flex-1 p-8 bg-white overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;