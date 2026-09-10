"use client";

import { format } from "date-fns";

interface Props {
  selectedAppointment: any;
  setSelectedAppointment: (a: any) => void;
  setEditModalOpen: (open: boolean) => void;
  saveEdit: () => void;
}

export default function EditAppointmentModal({
  selectedAppointment,
  setSelectedAppointment,
  setEditModalOpen,
  saveEdit,
}: Props) {
  if (!selectedAppointment) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-[500] bg-[#111318] rounded-2xl shadow-2xl text-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Appointment</h2>
          <button
            onClick={() => setEditModalOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-400">Patient: {selectedAppointment.name}</p>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400">Start Time</label>
            <input
              type="datetime-local"
              value={format(selectedAppointment.start, "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) =>
                setSelectedAppointment({ ...selectedAppointment, start: new Date(e.target.value) })
              }
              className="w-full px-3 py-2 rounded-lg bg-[#1b1f29] border border-white/10 text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400">End Time</label>
            <input
              type="datetime-local"
              value={format(selectedAppointment.end, "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) =>
                setSelectedAppointment({ ...selectedAppointment, end: new Date(e.target.value) })
              }
              className="w-full px-3 py-2 rounded-lg bg-[#1b1f29] border border-white/10 text-white"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setEditModalOpen(false)}
            className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={saveEdit}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
