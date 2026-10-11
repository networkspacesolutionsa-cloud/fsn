import React, { useState } from 'react';
import { ChevronDown, Package, Plus, Star } from 'lucide-react';
import type { ServicePackage } from '../content/types';
import {
  Button,
  Card,
  Field,
  ImageInput,
  ListControls,
  LoadingBlock,
  PanelHeader,
  SaveBar,
  TextArea,
  moveItem,
  newId,
  useContentEditor,
} from './ui';

export const PackagesPanel: React.FC = () => {
  const editor = useContentEditor('packages');
  const [openItem, setOpenItem] = useState<string | null>(null);

  if (editor.loading) return <LoadingBlock />;

  const packages = editor.value;
  const updatePackage = (next: ServicePackage) => editor.update(packages.map((x) => (x.id === next.id ? next : x)));

  const addPackage = () => {
    const pkg: ServicePackage = {
      id: newId('p'),
      title: 'باقة جديدة',
      target: '',
      badge: '',
      price: '',
      oldPrice: '',
      description: '',
      includes: [],
      note: '',
      featured: false,
    };
    editor.update([...packages, pkg]);
    setOpenItem(pkg.id);
  };

  return (
    <div>
      <PanelHeader
        title="الباقات"
        description="كل باقة تظهر كبطاقة فردية بسعرها. زر «اطلب هذه الباقة» يفتح نموذج الحجز مع اسم الباقة."
        actions={
          <Button onClick={addPackage}>
            <Plus className="w-4 h-4" /> باقة فردية
          </Button>
        }
      />

      {packages.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-12 px-4 text-center mb-4">
          <p className="text-sm font-bold text-slate-700 mb-1">لا توجد باقات بعد</p>
          <p className="text-xs text-slate-500">حتى تضيف باقات، يعرض الموقع في هذا القسم بطاقة «الباقات قريبًا».</p>
        </div>
      )}

      <div className="space-y-3">
        {packages.map((pkg, index) => {
          const open = openItem === pkg.id;
          const set = <F extends keyof ServicePackage>(field: F) => (v: ServicePackage[F]) => updatePackage({ ...pkg, [field]: v });
          const summary = [pkg.target, pkg.price || 'بدون سعر'];
          return (
            <Card key={pkg.id} className="!rounded-xl">
              <div className="flex items-center justify-between gap-2 -m-1">
                <button
                  type="button"
                  onClick={() => setOpenItem(open ? null : pkg.id)}
                  className="flex-1 flex items-center gap-2 text-right cursor-pointer min-w-0"
                >
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                  <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                    {pkg.image ? (
                      <img src={pkg.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate flex items-center gap-1.5">
                      {pkg.featured && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />}
                      {pkg.title || 'بدون عنوان'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{summary.filter(Boolean).join(' · ')}</p>
                  </div>
                </button>
                <ListControls
                  index={index}
                  count={packages.length}
                  onMove={(from, to) => editor.update(moveItem(packages, from, to))}
                  onDelete={() => {
                    if (window.confirm(`حذف باقة «${pkg.title}»؟`)) editor.update(packages.filter((x) => x.id !== pkg.id));
                  }}
                />
              </div>
              {open && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                  <div className="md:col-span-2">
                    <ImageInput label="صورة الباقة (اختياري)" value={pkg.image} onChange={(url) => set('image')(url)} folder="packages" />
                  </div>
                  <div className="md:col-span-2">
                    <Field label="اسم الباقة" value={pkg.title} onChange={set('title')} placeholder="باقة الفيلا الذكية" />
                  </div>
                  <Field label="مناسبة لـ (اختياري)" value={pkg.target} onChange={set('target')} placeholder="الفلل السكنية" />
                  <Field label="شارة مميزة (اختياري)" value={pkg.badge} onChange={set('badge')} placeholder="الأكثر طلبًا" />
                  <Field label="السعر" value={pkg.price} onChange={set('price')} placeholder="4,500 ريال" />
                  <Field label="السعر قبل الخصم (اختياري)" value={pkg.oldPrice} onChange={set('oldPrice')} placeholder="5,200 ريال" />
                  <div className="md:col-span-2">
                    <TextArea label="الوصف" value={pkg.description} onChange={set('description')} />
                  </div>
                  <div className="md:col-span-2">
                    <TextArea
                      label="ماذا تشمل الباقة"
                      hint="كل سطر يظهر كنقطة مع علامة ✓"
                      rows={6}
                      value={pkg.includes.join('\n')}
                      onChange={(v) => set('includes')(v.split('\n'))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Field label="ملاحظة صغيرة (اختياري)" value={pkg.note} onChange={set('note')} placeholder="ضمان سنتين على الأجهزة والتركيب" />
                  </div>
                  <label className="md:col-span-2 flex items-center gap-2.5 text-sm font-bold text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={pkg.featured}
                      onChange={(e) => set('featured')(e.target.checked)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    باقة مميزة (إطار أزرق وزر بارز)
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
