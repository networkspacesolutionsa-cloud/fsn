import React, { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import type { CategoryKey, ServiceCategory, ServiceItem } from '../content/types';
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

const FORMAT_HINT = 'للتنسيق: **نص** = عريض، !!نص!! = عريض أخضر، وكل سطر يبدأ بـ • يظهر كنقطة منفصلة.';

const ItemEditor: React.FC<{ item: ServiceItem; onChange: (item: ServiceItem) => void }> = ({ item, onChange }) => {
  const set = <F extends keyof ServiceItem>(field: F) => (v: ServiceItem[F]) => onChange({ ...item, [field]: v });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <Field label="اسم الخدمة" value={item.title} onChange={set('title')} />
      </div>
      <Field label="الشارة (السعر أو وصف قصير)" value={item.badge} onChange={set('badge')} placeholder="150 ريال" />
      <Select
        label="لون الشارة"
        value={item.badgeTone}
        onChange={(v) => set('badgeTone')(v as ServiceItem['badgeTone'])}
        options={[
          { value: 'price', label: 'أخضر (سعر)' },
          { value: 'info', label: 'أزرق (معلومة)' },
        ]}
      />
      <Field label="ملاحظة بجانب الشارة" value={item.sideNote} onChange={set('sideNote')} placeholder="ضمان 3 أشهر" />
      <Field label="نص الزر" value={item.buttonLabel} onChange={set('buttonLabel')} placeholder="احجز الخدمة" />
      <div className="md:col-span-2">
        <TextArea label="وصف الخدمة" value={item.description} onChange={set('description')} rows={3} />
      </div>
      <div className="md:col-span-2">
        <TextArea label="تفاصيل السعر / ما تشمله الخدمة" value={item.details} onChange={set('details')} rows={4} hint={FORMAT_HINT} />
      </div>
      <Field label="ملاحظة صغيرة أسفل التفاصيل (اختياري)" value={item.detailsNote} onChange={set('detailsNote')} />
      <Select
        label="لون صندوق التفاصيل"
        value={item.detailsTone}
        onChange={(v) => set('detailsTone')(v as ServiceItem['detailsTone'])}
        options={[
          { value: 'plain', label: 'أبيض' },
          { value: 'info', label: 'أزرق فاتح' },
        ]}
      />
    </div>
  );
};

export const ServicesPanel: React.FC = () => {
  const editor = useContentEditor('services');
  const [activeKey, setActiveKey] = useState<CategoryKey>('networks');
  const [openItem, setOpenItem] = useState<string | null>(null);

  if (editor.loading) return <LoadingBlock />;

  const categories = editor.value;
  const category = categories.find((c) => c.key === activeKey) ?? categories[0];
  const updateCategory = (next: ServiceCategory) =>
    editor.update(categories.map((c) => (c.key === next.key ? next : c)));
  const set = <F extends keyof ServiceCategory>(field: F) => (v: ServiceCategory[F]) => updateCategory({ ...category, [field]: v });
  const setItems = (items: ServiceItem[]) => updateCategory({ ...category, items });

  const addItem = () => {
    const item: ServiceItem = {
      id: newId(category.key),
      title: 'خدمة جديدة',
      badge: '',
      badgeTone: 'price',
      sideNote: '',
      description: '',
      details: '',
      detailsNote: '',
      detailsTone: 'plain',
      buttonLabel: 'احجز الخدمة',
    };
    setItems([...category.items, item]);
    setOpenItem(item.id);
  };

  return (
    <div>
      <PanelHeader title="الخدمات والأسعار" description="عدّل بطاقات الأقسام والخدمات والأسعار. تظهر الخدمات أيضًا في قائمة نموذج الحجز." />

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => {
              setActiveKey(c.key);
              setOpenItem(null);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer ${
              c.key === category.key ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {c.cardTitle}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <Card title="بطاقة القسم (أعلى صفحة الخدمات)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="عنوان البطاقة" value={category.cardTitle} onChange={set('cardTitle')} />
            <Field label="نص رابط البطاقة" value={category.cardLinkLabel} onChange={set('cardLinkLabel')} />
            <div className="md:col-span-2">
              <TextArea label="وصف البطاقة" value={category.cardDescription} onChange={set('cardDescription')} />
            </div>
            <ImageInput
              label="صورة البطاقة"
              value={category.cardImage}
              onChange={(url) => set('cardImage')(url ?? category.cardImage)}
              folder="services"
              allowRemove={false}
            />
            <Field label="اسم زر التصفية" value={category.filterLabel} onChange={set('filterLabel')} />
          </div>
        </Card>

        <Card title="مقدمة قسم التفاصيل">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="العنوان الصغير" value={category.sectionLabel} onChange={set('sectionLabel')} />
            <Field label="العنوان الرئيسي" value={category.sectionTitle} onChange={set('sectionTitle')} />
            <div className="md:col-span-2">
              <TextArea label="الوصف" value={category.sectionDescription} onChange={set('sectionDescription')} />
            </div>
          </div>
        </Card>

        <Card
          title={`الخدمات (${category.items.length})`}
          actions={
            <Button onClick={addItem} className="!py-2 text-xs">
              <Plus className="w-4 h-4" /> إضافة خدمة
            </Button>
          }
        >
          <div className="space-y-3">
            {category.items.map((item, index) => {
              const open = openItem === item.id;
              return (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => setOpenItem(open ? null : item.id)}
                      className="flex-1 flex items-center gap-2 text-right cursor-pointer min-w-0"
                    >
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                      <span className="font-bold text-sm text-slate-900 truncate">{item.title || 'بدون اسم'}</span>
                      {item.badge && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold shrink-0">{item.badge}</span>
                      )}
                    </button>
                    <ListControls
                      index={index}
                      count={category.items.length}
                      onMove={(from, to) => setItems(moveItem(category.items, from, to))}
                      onDelete={() => {
                        if (window.confirm(`حذف «${item.title}»؟`)) setItems(category.items.filter((x) => x.id !== item.id));
                      }}
                    />
                  </div>
                  {open && (
                    <div className="px-3 pb-4 pt-1 border-t border-slate-200 bg-white rounded-b-xl">
                      <ItemEditor
                        item={item}
                        onChange={(next) => setItems(category.items.map((x) => (x.id === item.id ? next : x)))}
                      />
                    </div>
                  )}
                </div>
              );
            })}
            {category.items.length === 0 && <p className="text-sm text-slate-500 text-center py-6">لا توجد خدمات في هذا القسم.</p>}
          </div>
        </Card>
      </div>

      <SaveBar dirty={editor.dirty} saving={editor.saving} status={editor.status} onSave={editor.save} onReset={editor.resetToDefault} />
    </div>
  );
};
