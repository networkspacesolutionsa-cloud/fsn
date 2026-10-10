import React from 'react';
import type { ContactInfo } from '../content/types';
import { Card, Field, LoadingBlock, PanelHeader, SaveBar, useContentEditor } from './ui';

export const ContactPanel: React.FC = () => {
  const editor = useContentEditor('contact');
  const contact = editor.value;
  const set = (field: keyof ContactInfo) => (v: string) => editor.update({ ...contact, [field]: v });

  if (editor.loading) return <LoadingBlock />;

  return (
    <div>
      <PanelHeader
        title="معلومات التواصل"
        description="تُستخدم في أزرار الاتصال وواتساب والبريد والخريطة في كل أجزاء الموقع."
      />
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="رقم الهاتف كما يظهر في الموقع"
            value={contact.phoneDisplay}
            onChange={set('phoneDisplay')}
            dir="ltr"
            placeholder="+962 77 894 7384"
          />
          <Field
            label="رقم الهاتف للاتصال (أرقام فقط مع رمز الدولة)"
            value={contact.phone}
            onChange={set('phone')}
            dir="ltr"
            placeholder="962778947384"
            hint="بدون + أو مسافات، مثال: 962778947384"
          />
          <Field
            label="رقم واتساب (أرقام فقط مع رمز الدولة)"
            value={contact.whatsapp}
            onChange={set('whatsapp')}
            dir="ltr"
            placeholder="962778947384"
            hint="الرقم الذي تصل إليه رسائل أزرار واتساب ونموذج الحجز"
          />
          <Field label="البريد الإلكتروني" value={contact.email} onChange={set('email')} dir="ltr" type="email" />
          <Field label="الموقع (نص)" value={contact.locationText} onChange={set('locationText')} placeholder="الرياض، المملكة العربية السعودية" />
          <Field
            label="رابط الخريطة"
            value={contact.mapUrl}
            onChange={set('mapUrl')}
            dir="ltr"
            hint="انسخ رابط موقعك من خرائط Google (مشاركة ← نسخ الرابط)"
          />
          <Field
            label="رقم السجل التجاري"
            value={contact.commercialRegistration}
            onChange={set('commercialRegistration')}
            dir="ltr"
            placeholder="1010809778"
            hint="يظهر في أسفل الموقع (الفوتر)"
          />
        </div>
      </Card>
      <SaveBar dirty={editor.dirty} saving={editor.saving} status={editor.status} onSave={editor.save} onReset={editor.resetToDefault} />
    </div>
  );
};
