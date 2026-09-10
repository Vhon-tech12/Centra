"use client";

import { useState, useEffect } from "react";
import { FieldBlock } from "./UIHelpers";

export type Prescription = {
  drug: string;
  dose: string;
  frequency: string;
  duration: string;
  instructions: string;
};

type DrugData = {
  name: string;
  category: "ENT" | "Aesthetics";
  dose: string;
  frequency: string;
  duration: string;
};

const DRUG_LIST: DrugData[] = [
  { name: "Amoxicillin", category: "ENT", dose: "500mg", frequency: "3 times daily", duration: "7 days" },
  { name: "Azithromycin", category: "ENT", dose: "250mg", frequency: "Once daily", duration: "5 days" },
  { name: "Cefuroxime", category: "ENT", dose: "500mg", frequency: "2 times daily", duration: "7 days" },
  { name: "Dexamethasone", category: "ENT", dose: "4mg", frequency: "Once daily", duration: "3 days" },
  { name: "Hyaluronic Acid", category: "Aesthetics", dose: "1 vial", frequency: "Once", duration: "Single session" },
  { name: "Botulinum Toxin", category: "Aesthetics", dose: "20 units", frequency: "Once", duration: "Single session" },
  { name: "Vitamin C Serum", category: "Aesthetics", dose: "Apply 2 drops", frequency: "Daily", duration: "2 weeks" },
  { name: "Retinol Cream", category: "Aesthetics", dose: "Pea-sized amount", frequency: "Daily", duration: "4 weeks" },
];

const PrescriptionModal = ({
  open,
  onClose,
  onSave,
  defaultValues,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (rx: Prescription) => void;
  defaultValues?: Prescription;
}) => {
  const [drug, setDrug] = useState("");
  const [dose, setDose] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
  const [filtered, setFiltered] = useState<DrugData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (defaultValues) {
      setDrug(defaultValues.drug);
      setDose(defaultValues.dose);
      setFrequency(defaultValues.frequency);
      setDuration(defaultValues.duration);
      setInstructions(defaultValues.instructions);
    } else {
      setDrug("");
      setDose("");
      setFrequency("");
      setDuration("");
      setInstructions("");
    }
  }, [defaultValues, open]);

  // Fuzzy search
  useEffect(() => {
    if (!drug.trim()) {
      setFiltered([]);
      setShowSuggestions(false);
      return;
    }
    const matches = DRUG_LIST.filter((d) =>
      d.name.toLowerCase().includes(drug.toLowerCase())
    );
    setFiltered(matches);
    setShowSuggestions(matches.length > 0);
  }, [drug]);

  const handleSelect = (drugName: string) => {
    const selected = DRUG_LIST.find((d) => d.name === drugName);
    if (!selected) return;
    setDrug(selected.name);
    setDose(selected.dose);
    setFrequency(selected.frequency);
    setDuration(selected.duration);
    setShowSuggestions(false);
  };

  const handleSave = () => {
    if (!drug.trim()) return;
    onSave({ drug, dose, frequency, duration, instructions });
    if (!defaultValues) {
      setDrug(""); setDose(""); setFrequency(""); setDuration(""); setInstructions("");
    }
    setShowSuggestions(false);
  };

  if (!open) return null;

  // Group suggestions by category
  const groupedSuggestions: Record<string, DrugData[]> = {};
  filtered.forEach((d) => {
    if (!groupedSuggestions[d.category]) groupedSuggestions[d.category] = [];
    groupedSuggestions[d.category].push(d);
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-[600] max-h-[90vh] bg-[#111318] text-gray-200 rounded-2xl border border-gray-700 shadow-2xl overflow-y-auto relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {defaultValues ? "Edit Prescription" : "Add Prescription"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#1b1f27] text-gray-400 hover:text-gray-200">✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6 relative">
          <div className="relative">
            <FieldBlock
              label="Drug Name"
              placeholder="Search medication..."
              value={drug}
              onChange={(e) => setDrug(e.target.value)}
            />
            {showSuggestions && (
              <div className="absolute top-20 left-0 right-0 bg-[#1b1f27] border border-gray-600 rounded-md shadow-md max-h-60 overflow-y-auto z-50">
                {Object.entries(groupedSuggestions).map(([cat, drugs]) => (
                  <div key={cat} className="py-1">
                    <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase">{cat}</div>
                    {drugs.map((d, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelect(d.name)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-700"
                      >
                        {d.name}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <FieldBlock label="Dose" placeholder="e.g., 500mg, 10ml" value={dose} onChange={(e) => setDose(e.target.value)} />
          <FieldBlock label="Frequency" placeholder="e.g., twice daily, every 8 hours" value={frequency} onChange={(e) => setFrequency(e.target.value)} />
          <FieldBlock label="Duration" placeholder="e.g., 7 days, 2 weeks" value={duration} onChange={(e) => setDuration(e.target.value)} />
          <FieldBlock label="Instructions" placeholder="Special instructions (optional)" value={instructions} onChange={(e) => setInstructions(e.target.value)} type="textarea" />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 bg-[#0f1115] flex justify-end gap-2 sticky bottom-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-[#1b1f27]">Cancel</button>
          <button onClick={handleSave} disabled={!drug.trim()} className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50">
            {defaultValues ? "Save Changes" : "Add Prescription"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;