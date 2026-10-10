import React, { useState } from 'react';
import { ChevronDown, Plus, Star } from 'lucide-react';
import type { Offer, OfferCategory } from '../content/types';
import {
  Button,
  Card,
  Field,
  ListControls,
  LoadingBlock,
  PanelHeader,
  SaveBar,
  Select,
  TextArea,
  moveItem,
  newId,
  useContentEditor,
} from './ui';

const CATEGORIES: { value: OfferCategory; label: string }[] = [
  { value: 'الشبكات', label: 'الشبكات' },
  { value: 'كاميرات المراقبة', label: 'كاميرات المراقبة' },
  { value: 'الإنتركوم', label: 'الإنتركوم' },
  { value: 'باقات متكاملة', label: 'مشروع متكامل' },
];

export const OffersPanel: React.FC = () => {
  const editor = useContentEditor('offers');
  const [openItem, setOpenItem] = useState<string | null>(null);

  if (editor.loading) return <LoadingBlock />;

  const offers = editor.value;
  const updateOffer = (next: Offer) => editor.update(offers.map((x) => (x.id === next.id ? next : x)));

  const addOffer = () => {
    const offer: Offer = {
      id: newId('o'),
      title: 'عرض جديد',
      category: 'كاميرات المراقبة',
      badge: '',
      price: '',
      oldPrice: '',
      description: '',
      includes: [],
      note: '',
      featured: false,
    };
    editor.update([...offers, offer]);
    setOpenItem(offer.id);
  };

  return (
    <div>
      <PanelHeader
        title="عروض أسعار المشاريع"
        description="العروض التي تظهر في قسم «عروض أسعار المشاريع». زر «اطلب هذا العرض» يفتح نموذج الحجز مع اسم العرض."
        actions={
          <Button onClick={addOffer}>
            <Plus className="w-4 h-4" /> إضافة عرض
          </Button>
        }
      />

      {offers.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-12 px-4 text-center mb-4">
          <p className="text-sm font-bold text-slate-700 mb-1">لا توجد عروض بعد</p>
          <p className="text-xs text-slate-500">
            حتى تضيف عروضًا، يعرض الموقع في هذا القسم بطاقة «اطلب عرض سعر لمشروعك» فقط.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {offers.map((offer, index) => {
          const open = openItem === offer.id;
          const set = <F extends keyof Offer>(field: F) => (v: Offer[F]) => updateOffer({ ...offer, [field]: v });
          return (
            <Card key={offer.id} className="!rounded-xl">
              <div className="flex items-center justify-between gap-2 -m-1">
                <button
                  type="button"
                  onClick={() => setOpenItem(open ? null : offer.id)}
                  className="flex-1 flex items-center gap-2 text-right cursor-pointer min-w-0"
                >
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate flex items-center gap-1.5">
                      {offer.featured && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />}
                      {offer.title || 'بدون عنوان'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {offer.category} {offer.price && `· ${offer.price}`}
                    </p>
                  </div>
                </button>
                <ListControls
                  index={index}
                  count={offers.length}
                  onMove={(from, to) => editor.update(moveItem(offers, from, to))}
                  onDelete={() => {
                    if (window.confirm(`حذف عرض «${offer.title}»؟`)) editor.update(offers.filter((x) => x.id !== offer.id));
                  }}
                />
              </div>
              {open && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                  <div className="md:col-span-2">
                    <Field label="اسم العرض" value={offer.title} onChange={set('title')} placeholder="عرض 4 كاميرات مراقبة 4K مع جهاز تسجيل" />
                  </div>
                  <Select
                    label="القسم"
                    value={offer.category}
                    onChange={(v) => set('category')(v as OfferCategory)}
                    options={CATEGORIES}
                  />
                  <Field label="شارة مميزة (اختياري)" value={offer.badge} onChange={set('badge')} placeholder="الأكثر طلبًا" />
                  <Field label="السعر" value={offer.price} onChange={set('price')} placeholder="1,800 ريال" />
                  <Field label="السعر قبل الخصم (اختياري)" value={offer.oldPrice} onChange={set('oldPrice')} placeholder="2,200 ريال" />
                  <div className="md:col-span-2">
                    <TextArea label="الوصف" value={offer.description} onChange={set('description')} />
                  </div>
                  <div className="md:col-span-2">
                    <TextArea
                      label="ماذا يشمل العرض"
                      hint="كل سطر يظهر كنقطة مع علامة ✓"
                      rows={5}
                      value={offer.includes.join('\n')}
                      onChange={(v) => set('includes')(v.split('\n'))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Field label="ملاحظة صغيرة (اختياري)" value={offer.note} onChange={set('note')} placeholder="السعر لا يشمل الإكسسوارات الإضافية" />
                  </div>
                  <label className="md:col-span-2 flex items-center gap-2.5 text-sm font-bold text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={offer.featured}
                      onChange={(e) => set('featured')(e.target.checked)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    عرض مميز (إطار أزرق وزر بارز)
                  </label>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <SaveBar dirty={editor.dirty} saving={editor.saving} status={editor.status} onSave={editor.save} onReset={editor.resetToDefault} />
    </div>
  );
};
