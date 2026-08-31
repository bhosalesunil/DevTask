import React, { useState, useEffect } from 'react';
import * as notificationService from '../services/notificationService';
import { Mail, Shield, CheckCircle2, FolderKanban } from 'lucide-react';

export const Developers = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const res = await notificationService.getDevelopers();
        if (res.success) {
          setDevelopers(res.data);
        }
      } catch (err) {
        console.error('Failed to load developers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Team Members & Developers</h1>
        <p className="text-xs text-gray-500">Workspace roster and team assignments</p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-semibold text-gray-500">Loading Team Roster...</p>
        </div>
      ) : (
        <div className="grid-3">
          {developers.map((dev) => (
            <div key={dev._id} className="card text-center flex flex-col items-center p-6 space-y-3">
              <div className="relative">
                <img
                  src={dev.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dev.name}`}
                  alt={dev.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100 dark:border-indigo-950 shadow-md"
                />
                <span
                  className={`absolute bottom-0 right-0 p-1 rounded-full text-white text-[10px] ${
                    dev.role === 'admin' ? 'bg-indigo-600' : 'bg-emerald-500'
                  }`}
                  title={dev.role === 'admin' ? 'Project Admin' : 'Developer'}
                >
                  <Shield size={12} />
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white">{dev.name}</h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{dev.title || 'Software Developer'}</p>
                <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mt-1">
                  <Mail size={12} /> {dev.email}
                </div>
              </div>

              <div className="w-full pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-around text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Role</span>
                  <span className="font-bold uppercase text-gray-800 dark:text-gray-200">{dev.role}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
