
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { daveopsDb } from '@/lib/daveops-db';

export const useDaveOpsProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await daveopsDb.profiles.getProfile(user.id);
        setProfile(profileData);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Record<string, any>) => {
    if (!user) return;

    try {
      await daveopsDb.profiles.updateProfile(user.id, updates);
      // Refresh profile data
      const updatedProfile = await daveopsDb.profiles.getProfile(user.id);
      setProfile(updatedProfile);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile
  };
};
