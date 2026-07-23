export function CallRecordingPlayer({ callRecordId }: { callRecordId: string }) {
  return (
    <audio
      controls
      preload="none"
      className="h-9 w-48 max-w-full"
      src={`/api/crm/call-records/${callRecordId}/recording`}
    />
  );
}
