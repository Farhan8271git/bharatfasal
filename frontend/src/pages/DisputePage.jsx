import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { disputes } from '../data/mockLogistics'
import { formatDate, getStatusColor } from '../utils/formatters'

export default function DisputePage() {
  const { t } = useTranslation()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📝 {t('disputes')}</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm py-2">
          ➕ {t('file_dispute')}
        </button>
      </div>

      {/* File Dispute Form */}
      {showForm && (
        <div className="card border-red-200 bg-red-50/30">
          <h3 className="font-bold mb-4">📝 {t('file_dispute')}</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold block mb-1">{t('dispute_type')}</label>
              <select className="input-field">
                <option>{t('payment_issue')}</option>
                <option>{t('quality_dispute')}</option>
                <option>{t('delivery_issue')}</option>
                <option>{t('other_issue')}</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">{t('description')}</label>
              <textarea className="input-field" rows={3} placeholder={t('description')}></textarea>
            </div>
            <button className="btn-secondary w-full">📷 {t('attach_photo')}</button>
            <div className="flex gap-2">
              <button className="btn-primary flex-1">📤 {t('submit')}</button>
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">{t('cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Disputes List */}
      <div className="space-y-3">
        {disputes.map(dispute => (
          <div key={dispute.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{dispute.id}</h3>
                  <span className={`badge ${getStatusColor(dispute.status)}`}>{t(dispute.status)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{dispute.buyerName} · {t(dispute.type)}</p>
                <p className="text-sm text-gray-500 mt-1">{dispute.description}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="border-t pt-3">
              <div className="space-y-2">
                {dispute.updates.map((update, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                      update.status === 'resolved' ? 'bg-green-500' : update.status === 'in_progress' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="text-sm">{update.message}</p>
                      <p className="text-xs text-gray-400">{formatDate(update.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Helpline */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-bold text-blue-800 mb-2">📞 {t('helpline')}</h3>
        <div className="space-y-2 text-sm">
          <p>📱 Toll Free: 1800-180-1551</p>
          <p>💬 WhatsApp: +91 98765 00000</p>
          <p>📧 Email: support@bharatfasal.in</p>
        </div>
      </div>
    </div>
  )
}
