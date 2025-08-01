
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole, SubscriptionPlan } from '../../types';
import Button from '../../components/ui/Button';

const UserManagementPage: React.FC = () => {
  const { allUsers, updateUser } = useAuth();
  const [filter, setFilter] = useState('');

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const userToUpdate = allUsers.find(u => u.id === userId);
    if (!userToUpdate) return;

    // Prevent demoting the last super-admin
    const superAdmins = allUsers.filter(u => u.role === UserRole.SUPER_ADMIN);
    if(userToUpdate.role === UserRole.SUPER_ADMIN && newRole !== UserRole.SUPER_ADMIN && superAdmins.length <= 1) {
      alert("Cannot demote the last super-admin.");
      return;
    }

    const updates: Partial<User> = { role: newRole };
    
    // Automatically update plan based on new role
    if (newRole === UserRole.SUPER_ADMIN || newRole === UserRole.SUB_ADMIN) {
        updates.plan = SubscriptionPlan.FULL_ACCESS;
    } else if (newRole === UserRole.USER) {
        updates.plan = SubscriptionPlan.FREE;
    }

    updateUser(userId, updates);
  };
  
  const handleStatusChange = (userId: string, newStatus: boolean) => {
    // Prevent deactivating the last super-admin
    const user = allUsers.find(u => u.id === userId);
    if(user?.role === UserRole.SUPER_ADMIN && !newStatus) {
        const superAdmins = allUsers.filter(u => u.role === UserRole.SUPER_ADMIN && u.isActive);
        if(superAdmins.length <= 1) {
            alert("Cannot deactivate the last active super-admin.");
            return;
        }
    }
    updateUser(userId, { isActive: newStatus });
  };

  const filteredUsers = allUsers.filter(user =>
    user.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark mb-6">User Management</h1>
      <input
        type="text"
        placeholder="Filter by email..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-6 block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
      />
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      className="rounded-md border-gray-300 focus:ring-brand-primary focus:border-brand-primary"
                    >
                      <option value={UserRole.USER}>User</option>
                      <option value={UserRole.SUB_ADMIN}>Sub-Admin</option>
                      <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.plan}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      size="sm"
                      variant={user.isActive ? 'danger' : 'secondary'}
                      onClick={() => handleStatusChange(user.id, !user.isActive)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;