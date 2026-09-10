"use client";

import { Td, Th } from "./UIHelpers";

type Patient = {
  id: number;
  name: string;
  email: string;
  age: string;
  gender: string;
  phone: string;
  address: string;
};

type Props = {
  patients: Patient[];
  onView: (p: Patient) => void;
  onSoap: (p: Patient) => void;
  onDelete: (p: Patient) => void;
};

export default function PatientTable({ patients, onView, onSoap, onDelete }: Props) {
  return (
    <table className="w-full border border-gray-700 rounded-xl overflow-hidden">
      <thead className="bg-[#13161d]">
        <tr>
          <Th>Name</Th>
          <Th>Email</Th>
          <Th className="text-right pr-6">Action</Th>
        </tr>
      </thead>

      <tbody>
        {patients.map((p) => (
          <tr key={p.id} className="border-t border-gray-700">
            <Td>{p.name}</Td>
            <Td>{p.email}</Td>
            <Td>
              <div className="flex justify-end gap-3 pr-4">
                {/* VIEW */}
                <button
                  onClick={() => onView(p)}
                  className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                >
                  👁
                </button>

                {/* SOAP */}
                <button
                  onClick={() => onSoap(p)}
                  className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                >
                  🖊
                </button>

                {/* DELETE */}
                <button
                  onClick={() => onDelete(p)}
                  className="px-3 py-2 rounded-lg bg-red-700/70 hover:bg-red-700"
                >
                  🗑
                </button>
              </div>
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
