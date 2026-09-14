import { FileCheck2 } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import DocumentCheck from "../../../components/ui/DocumentCheck";

export default function DocumentsModal({
  open,
  onClose,
  documents,
  setDocuments,
  onContinue,
}) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Manage Documents"
    >
      <div className="space-y-3">
        <DocumentCheck
          label="PAN Card"
          checked={Boolean(documents?.pan)}
          onChange={(checked) => setDocuments((prev) => ({ ...prev, pan: checked }))}
        />

        <DocumentCheck
          label="GST Certificate"
          checked={Boolean(documents?.gst)}
          onChange={(checked) => setDocuments((prev) => ({ ...prev, gst: checked }))}
        />

        <DocumentCheck
          label="Business Proof"
          checked={Boolean(documents?.businessProof)}
          onChange={(checked) => setDocuments((prev) => ({ ...prev, businessProof: checked }))}
        />

        <DocumentCheck
          label="Bank Proof"
          checked={Boolean(documents?.bankProof)}
          onChange={(checked) => setDocuments((prev) => ({ ...prev, bankProof: checked }))}
        />
      </div>

      <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4 flex items-start gap-3">
        <FileCheck2
          size={20}
          className="text-green-600 shrink-0 mt-0.5"
        />

        <div>
          <p className="text-sm font-semibold text-gray-800">
            Document status
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Select the documents that have been submitted for verification.
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-5">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onSave}
          className="flex-1 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
}