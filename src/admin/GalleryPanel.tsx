import React, { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import type { GalleryCategory, GalleryItem } from '../content/types';
import {
  Button,
  Card,
  Field,
  ImageInput,
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

const CATEGORIES: { value: GalleryCategory; label: string }[] = [
  { value: 'networks', label: 'الشبكات وكبائن السيرفرات' },
  { value: 'cameras', label: 'كاميرات المراقبة 4K' },
  { value: 'intercom', label: 'أنظمة الإنتركوم' },
  { value: 'wifi', label: 'أفياش ونقاط الواي فاي' },
];

export const GalleryPanel: React.FC = () => {
  const editor = useContentEditor('gallery');
  const [openItem, setOpenItem] = useState<string | null>(null);

  if (editor.loading) return <LoadingBlock />;

  const items = editor.value;
  const updateItem = (next: GalleryItem) => editor.update(items.map((x) => (x.id === next.id ? next : x)));

  const addItem = () => {
    const item: GalleryItem = {
      id: newId('g'),
      title: 'عمل جديد',
      category: 'networks',
      categoryLabel: CATEGORIES[0].label,
      location: 'الرياض',
      date: '',
      description: '',
      gradient: 'from-slate-900 via-slate-800 to-blue-950',
      iconSymbol: '📷',
      badge: '',
    };
    editor.update([item, ...items]);
    setOpenItem(item.id);
  };

  return (
    <div>
      <PanelHeader
        title="أعمال سابقة"
        description="الأعمال التي تظهر في قسم «أعمال سابقة». الترتيب هنا هو ترتيب الظهور في الموقع."
        actions={
          <Button onClick={addItem}>
            <Plus className="w-4 h-4" /> إضافة عمل
          </Button>
        }
      />

      <div className="space-y-3">
        {items.map((item, index) => {
          const open = openItem === item.id;
          const set = <F extends keyof GalleryItem>(field: F) => (v: GalleryItem[F]) => updateItem({ ...item, [field]: v });
          return (
            <Card key={item.id} className="!rounded-xl">
              <div className="flex items-center justify-between gap-2 -m-1">
                <button
                  type="button"
                  onClick={() => setOpenItem(open ? null : item.id)}
                  className="flex-1 flex items-center gap-3 text-right cursor-pointer min-w-0"
                >
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0 flex items-center justify-center text-xl">
                    {item.image && item.beforeImage ? (
                      <>
                        <img src={item.beforeImage} alt="" className="absolute inset-y-0 right-0 w-1/2 h-full object-cover" />
                        <img src={item.image} alt="" className="absolute inset-y-0 left-0 w-1/2 h-full object-cover" />
                        <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white" />
                      </>
                    ) : item.image ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      item.iconSymbol
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate">{item.title || 'بدون عنوان'}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {item.categoryLabel} · {item.location} {!item.image && '· بدون صورة'}
                      {item.image && item.beforeImage && '· قبل وبعد'}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                <ListControls
                  index={index}
                  count={items.length}
                  onMove={(from, to) => editor.update(moveItem(items, from, to))}
                  onDelete={() => {
                    if (window.confirm(`حذف «${item.title}» من المعرض؟`)) editor.update(items.filter((x) => x.id !== item.id));
                  }}
                />
              </div>
              {open && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                  <ImageInput
                    label="صورة العمل (بعد التنفيذ)"
                    value={item.image}
                    onChange={(url) => set('image')(url)}
                    folder="gallery"
                  />
                  <ImageInput
                    label="صورة قبل التنفيذ (اختياري)"
                    value={item.beforeImage}
                    onChange={(url) => set('beforeImage')(url)}
                    folder="gallery"
                  />
                  {item.beforeImage && (
                    <Field
                      label="عنوان الصورة الأولى"
                      value={item.beforeLabel ?? ''}
                      onChange={set('beforeLabel')}
                      placeholder="قبل"
                      hint="يظهر على الصورة الأولى في المقارنة، مثل «أثناء التركيب». اتركه فارغاً ليظهر «قبل»."
                    />
                  )}
                  <p className="md:col-span-2 -mt-2 text-[11px] text-slate-500 leading-relaxed">
                    عند رفع الصورتين تظهر في الموقع كمقارنة «قبل وبعد» بشريط سحب. للحصول على أفضل نتيجة صوّر المكان من نفس الزاوية
                    والمسافة وبنفس اتجاه الجوال (عرضي أو طولي) في المرتين.
                  </p>
                  <div className="md:col-span-2">
                    <Field label="العنوان" value={item.title} onChange={set('title')} />
                  </div>
                  <Select
                    label="التصنيف (لأزرار التصفية)"
                    value={item.category}
                    onChange={(v) => {
                      const cat = CATEGORIES.find((c) => c.value === v)!;
                      updateItem({ ...item, category: cat.value, categoryLabel: cat.label });
                    }}
                    options={CATEGORIES}
                  />
                  <Field label="اسم التصنيف الظاهر" value={item.categoryLabel} onChange={set('categoryLabel')} />
                  <Field label="الشارة على الصورة" value={item.badge} onChange={set('badge')} />
                  <Field label="الموقع" value={item.location} onChange={set('location')} placeholder="الرياض - حي الملقا" />
                  <Field label="التاريخ" value={item.date} onChange={set('date')} placeholder="سبتمبر 2026" />
                  <Field label="رمز بديل عند عدم وجود صورة" value={item.iconSymbol} onChange={set('iconSymbol')} />
                  <div className="md:col-span-2">
                    <TextArea label="الوصف" value={item.description} onChange={set('description')} />
                  </div>
                </div>
              )}
            </Card>
          );
        })}
        {items.length === 0 && <p className="text-sm text-slate-500 text-center py-10">المعرض فارغ.</p>}
      </div>

      <SaveBar dirty={editor.dirty} saving={editor.saving} status={editor.status} onSave={editor.save} onReset={editor.resetToDefault} />
    </div>
  );
};
