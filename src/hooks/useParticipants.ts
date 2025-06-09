import { useState, useEffect } from 'react';
import supabase from '@/lib/db/supabaseClient';

const useParticipants = (postId: string) => {
  const [participants, setParticipants] = useState<{ station: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('station')
        .eq('post_id', postId);

      if (error) {
        setError(error.message);
      } else {
        setParticipants(data || []);
      }
    };

    fetchParticipants();
  }, [postId]);

  return { participants, error };
};

export default useParticipants;
