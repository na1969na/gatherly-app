import useParticipants from "@/hooks/useParticipants";
import calculateMeetingPoint from "@/app/post/[id]/calculateMeetingPoint";
import Map from "@/app/post/[id]/map";
import { useState, useEffect } from "react";

const PostDetailMap = ({ postId }: { postId: string }) => {
  const { participants } = useParticipants(postId);
  const [meetingPoint, setMeetingPoint] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setMeetingPoint(null);
    
    const calculatePoint = async () => {
      const stations = participants.map((p) => p.station);
      const midpoint = await calculateMeetingPoint(stations);
      setMeetingPoint(midpoint);
      setLoading(false);
    };

    if (participants.length > 0) {
      calculatePoint();
    }
  }, [participants]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!meetingPoint) {
    return <div>No meeting point found</div>;
  }

  return <Map center={meetingPoint} />;
};

export default PostDetailMap;
