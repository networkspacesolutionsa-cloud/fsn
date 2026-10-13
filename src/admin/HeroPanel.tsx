import React from 'react';
import { Plus } from 'lucide-react';
import type { HeroContent, HeroHighlight } from '../content/types';
import { Button, Card, Field, ImageInput, ListControls, LoadingBlock, PanelHeader, SaveBar, TextArea, moveItem, newId, useContentEditor } from './ui';

export const HeroPanel: React.FC = () => {
  const editor = useContentEditor('hero');
  const hero = editor.value;

  if (editor.loading) return <LoadingBlock />;

  const set = <F extends keyof HeroContent>(field: F) => (v: HeroContent[F]) => editor.update({ ...hero, [field]: v });
  const setHighlights = (highlights: HeroHighlight[]) => set('highlights')(highlights);

  return (
    <div>
      <PanelHeader title="الصفحة الرئيسية" description="الصورة الرئيسية والعنوان والنص التعريفي والعبارات التسويقية أعلى الموقع." />

      <div className="space-y-4">
        <Card title="الصورة الرئيسية">
          <ImageInput
            label="الصورة بجانب العنوان في أعلى الموقع"
            value={hero.image}
            onChange={(url) => set('image')(url)}
            folder="hero"
          />
          <p className="text-[11px] text-slate-500 mt-2">
            يفضّل صورة عرضية (أفقية) بجودة عالية. تُعرض بنسبة 16:11 تقريبًا. عند إزالة الصورة يظهر الرسم الافتراضي للأجهزة.
          </p>
        </Card>

        <Card title="العنوان والنص">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="السطر الأول من العنوان" value={hero.titleLine1} onChange={set('titleLine1')} />
            <Field label="السطر الثاني (باللون الأزرق)" value={hero.titleLine2} onChange={set('titleLine2')} />
            <div className="md:col-span-2">
              <TextArea label="النص التعريفي" value={hero.subtitle} onChange={set('subtitle')} rows={4} />
            </div>
          </div>
        </Card>

        <Card
          title="العبارات التسويقية"
          actions={
            <Button
              onClick={() => setHighlights([...hero.highlights, { id: newId('h'), text: '' }])}
              className="!py-2 text-xs"
            >
              <Plus className="w-4 h-4" /> إضافة عبارة
            </Button>
          }
        >
          <p className="text-xs text-slate-500 mb-3">
            تظهر كشارات كبيرة تحت أزرار «احجز موعد» و«استكشف خدمات التركيب»، مثل «معاينة مجانية للموقع». يفضّل ٣–٤ عبارات قصيرة.
          </p>
          <div className="space-y-2">
            {hero.highlights.map((h, index) => (
              <div key={h.id} className="flex items-center gap-2">
                <input
                  value={h.text}
                  onChange={(e) => setHighlights(hero.highlights.map((x) => (x.id === h.id ? { ...x, text: e.target.value } : x)))}
                  placeholder="عبارة تسويقية قصيرة"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm text-right focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                />
                <ListControls
                  index={index}
                  count={hero.highlights.length}
                  onMove={(from, to) => setHighlights(moveItem(hero.highlights, from, to))}
                  onDelete={() => setHighlights(hero.highlights.filter((x) => x.id !== h.id))}
                />
              </div>
            ))}
            {hero.highlights.length === 0 && <p className="text-sm text-slate-500 text-center py-4">لا توجد عبارات.</p>}
          </div>
        </Card>
      </div>

      <SaveBar dirty={editor.dirty} saving={editor.saving} status={editor.status} onSave={editor.save} onReset={editor.resetToDefault} />
    </div>
  );
};
