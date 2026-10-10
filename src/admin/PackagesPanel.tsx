import React, { useState } from 'react';
import { ChevronDown, Layers, Package, Plus, Star } from 'lucide-react';
import type { ServicePackage, SubPackage } from '../content/types';
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

const newSubPackage = (title: string): SubPackage => ({
  id: newId('sp'),
  title,
  badge: '',
  price: '',
  oldPrice: '',
  description: '',
  includes: [],
  featured: false,
});

/** Single package vs. a group that branches into options */
const KindSwitch: React.FC<{ isGroup: boolean; onChange: (group: boolean) => void }> = ({ isGroup, onChange }) => (
  <div className="md:col-span-2">
    <span className="block text-xs font-bold text-slate-700 mb-1.5">نوع الباقة</span>
    <div className="grid grid-cols-2 gap-2">
      {[
        { group: false, icon: Package, title: 'باقة فردية', hint: 'بطاقة واحدة بسعر واحد' },
        { group: true, icon: Layers, title: 'باقة تتفرع منها باقات', hint: 'عدة خيارات بأسعار مختلفة' },
      ].map((opt) => {
        const active = opt.group === isGroup;
        return (
          <button
            key={opt.title}
            type="button"
            onClick={() => onChange(opt.group)}
            className={`flex items-start gap-2.5 p-3 rounded-xl border-2 text-right transition cursor-pointer ${
              active ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <opt.icon className={`w-5 h-5 shrink-0 mt-0.5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>
              <span className={`block text-sm font-bold ${active ? 'text-blue-700' : 'text-slate-700'}`}>{opt.title}</span>
              <span className="block text-[11px] text-slate-500">{opt.hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

const SubPackagesEditor: React.FC<{ subs: SubPackage[]; onChange: (subs: SubPackage[]) => void }> = ({ subs, onChange }) => {
  const [openSub, setOpenSub] = useState<string | null>(null);
  const updateSub = (next: SubPackage) => onChange(subs.map((x) => (x.id === next.id ? next : x)));

  const addSub = () => {
    const sub = newSubPackage(`الخيار ${subs.length + 1}`);
    onChange([...subs, sub]);
    setOpenSub(sub.id);
  };

  return (
    <div className="md:col-span-2 rounded-xl bg-slate-50 border border-slate-200 p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <p className="text-sm font-black text-slate-900">الباقات الفرعية ({subs.length})</p>
          <p className="text-[11px] text-slate-500">تظهر جنبًا إلى جنب تحت الباقة الرئيسية، بالترتيب من الأبسط إلى الأشمل.</p>
        </div>
        <Button variant="secondary" onClick={addSub} className="!py-2">
          <Plus className="w-4 h-4" /> إضافة باقة فرعية
        </Button>
      </div>

      {subs.length === 0 && (
        <p className="text-xs text-slate-500 text-center py-4 border border-dashed border-slate-300 rounded-lg bg-white">
          أضف باقة فرعية واحدة على الأقل. حتى ذلك الحين تظهر هذه الباقة على الموقع كبطاقة فردية.
        </p>
      )}

      <div className="space-y-2">
        {subs.map((sub, index) => {
          const open = openSub === sub.id;
          const set = <F extends keyof SubPackage>(field: F) => (v: SubPackage[F]) => updateSub({ ...sub, [field]: v });
          return (
            <div key={sub.id} className="bg-white rounded-lg border border-slate-200 p-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setOpenSub(open ? null : sub.id)}
                  className="flex-1 flex items-center gap-2 text-right cursor-pointer min-w-0"
                >
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                  <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-700 text-xs font-black flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  {sub.image && <img src={sub.image} alt="" className="w-10 h-7 rounded-md object-cover shrink-0" />}
                  <span className="min-w-0">
                    <span className="font-bold text-sm text-slate-900 truncate flex items-center gap-1.5">
                      {sub.featured && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />}
                      {sub.title || 'بدون عنوان'}
                    </span>
                    <span className="block text-[11px] text-slate-500 truncate">{sub.price || 'بدون سعر'}</span>
                  </span>
                </button>
                <ListControls
                  index={index}
                  count={subs.length}
                  onMove={(from, to) => onChange(moveItem(subs, from, to))}
                  onDelete={() => {
                    if (window.confirm(`حذف الباقة الفرعية «${sub.title}»؟`)) onChange(subs.filter((x) => x.id !== sub.id));
                  }}
                />
              </div>
              {open && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-100">
                  <div className="md:col-span-2">
                    <ImageInput label="صورة الباقة الفرعية (اختياري)" value={sub.image} onChange={(url) => set('image')(url)} folder="packages" />
                  </div>
                  <Field label="اسم الباقة الفرعية" value={sub.title} onChange={set('title')} placeholder="الأساسية" />
                  <Field label="شارة مميزة (اختياري)" value={sub.badge} onChange={set('badge')} placeholder="الأكثر طلبًا" />
                  <Field label="السعر" value={sub.price} onChange={set('price')} placeholder="2,500 ريال" />
                  <Field label="السعر قبل الخصم (اختياري)" value={sub.oldPrice} onChange={set('oldPrice')} placeholder="2,900 ريال" />
                  <div className="md:col-span-2">
                    <TextArea label="الوصف (اختياري)" value={sub.description} onChange={set('description')} rows={2} />
                  </div>
                  <div className="md:col-span-2">
                    <TextArea
                      label="ماذا تشمل هذه الباقة"
                      hint="كل سطر يظهر كنقطة مع علامة ✓ — اكتب ما يميزها فقط، المزايا المشتركة تُكتب في الباقة الرئيسية"
                      rows={5}
                      value={sub.includes.join('\n')}
                      onChange={(v) => set('includes')(v.split('\n'))}
                    />
                  </div>
                  <label className="md:col-span-2 flex items-center gap-2.5 text-sm font-bold text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sub.featured}
                      onChange={(e) => set('featured')(e.target.checked)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    الخيار المُوصى به (إطار أزرق وزر بارز)
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PackagesPanel: React.FC = () => {
  const editor = useContentEditor('packages');
  const [openItem, setOpenItem] = useState<string | null>(null);

  if (editor.loading) return <LoadingBlock />;

  const packages = editor.value;
  const updatePackage = (next: ServicePackage) => editor.update(packages.map((x) => (x.id === next.id ? next : x)));

  const addPackage = (group: boolean) => {
    const pkg: ServicePackage = {
      id: newId('p'),
      title: group ? 'مجموعة باقات جديدة' : 'باقة جديدة',
      target: '',
      badge: '',
      price: '',
      oldPrice: '',
      description: '',
      includes: [],
      note: '',
      featured: false,
      ...(group && { subPackages: [newSubPackage('الأساسية'), newSubPackage('المتقدمة')] }),
    };
    editor.update([...packages, pkg]);
    setOpenItem(pkg.id);
  };

  const setKind = (pkg: ServicePackage, group: boolean) => {
    if (group === !!pkg.subPackages) return;
    if (group) {
      updatePackage({ ...pkg, subPackages: [newSubPackage('الأساسية'), newSubPackage('المتقدمة')] });
      return;
    }
    if (pkg.subPackages!.length > 0 && !window.confirm('سيتم حذف الباقات الفرعية لهذه الباقة. متابعة؟')) return;
    const { subPackages: _removed, ...single } = pkg;
    updatePackage(single);
  };

  return (
    <div>
      <PanelHeader
        title="الباقات"
        description="باقات فردية، أو باقات رئيسية تتفرع منها عدة خيارات. زر «اطلب» يفتح نموذج الحجز مع اسم الباقة."
        actions={
          <>
            <Button variant="secondary" onClick={() => addPackage(true)}>
              <Layers className="w-4 h-4" /> باقة تتفرع منها باقات
            </Button>
            <Button onClick={() => addPackage(false)}>
              <Plus className="w-4 h-4" /> باقة فردية
            </Button>
          </>
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
          const isGroup = !!pkg.subPackages;
          const set = <F extends keyof ServicePackage>(field: F) => (v: ServicePackage[F]) => updatePackage({ ...pkg, [field]: v });
          const summary = isGroup
            ? [pkg.target, `${pkg.subPackages!.length} باقات فرعية`, pkg.price && `تبدأ من ${pkg.price}`]
            : [pkg.target, pkg.price || 'بدون سعر'];
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
                    ) : isGroup ? (
                      <Layers className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Package className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate flex items-center gap-1.5">
                      {pkg.featured && !isGroup && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />}
                      {pkg.title || 'بدون عنوان'}
                      {isGroup && (
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold shrink-0">مجموعة</span>
                      )}
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
                  <KindSwitch isGroup={isGroup} onChange={(group) => setKind(pkg, group)} />
                  <div className="md:col-span-2">
                    <ImageInput label="صورة الباقة (اختياري)" value={pkg.image} onChange={(url) => set('image')(url)} folder="packages" />
                  </div>
                  <div className="md:col-span-2">
                    <Field
                      label={isGroup ? 'اسم الباقة الرئيسية' : 'اسم الباقة'}
                      value={pkg.title}
                      onChange={set('title')}
                      placeholder={isGroup ? 'باقات كاميرات المراقبة' : 'باقة الفيلا الذكية'}
                    />
                  </div>
                  <Field label="مناسبة لـ (اختياري)" value={pkg.target} onChange={set('target')} placeholder="الفلل السكنية" />
                  <Field label="شارة مميزة (اختياري)" value={pkg.badge} onChange={set('badge')} placeholder="الأكثر طلبًا" />
                  <Field
                    label={isGroup ? 'تبدأ من (اختياري)' : 'السعر'}
                    value={pkg.price}
                    onChange={set('price')}
                    placeholder={isGroup ? '1,800 ريال' : '4,500 ريال'}
                  />
                  <Field label="السعر قبل الخصم (اختياري)" value={pkg.oldPrice} onChange={set('oldPrice')} placeholder="5,200 ريال" />
                  <div className="md:col-span-2">
                    <TextArea label="الوصف" value={pkg.description} onChange={set('description')} />
                  </div>
                  <div className="md:col-span-2">
                    <TextArea
                      label={isGroup ? 'المزايا المشتركة في جميع الباقات الفرعية' : 'ماذا تشمل الباقة'}
                      hint="كل سطر يظهر كنقطة مع علامة ✓"
                      rows={isGroup ? 4 : 6}
                      value={pkg.includes.join('\n')}
                      onChange={(v) => set('includes')(v.split('\n'))}
                    />
                  </div>
                  {isGroup && <SubPackagesEditor subs={pkg.subPackages!} onChange={set('subPackages')} />}
                  <div className="md:col-span-2">
                    <Field label="ملاحظة صغيرة (اختياري)" value={pkg.note} onChange={set('note')} placeholder="ضمان سنتين على الأجهزة والتركيب" />
                  </div>
                  {!isGroup && (
                    <label className="md:col-span-2 flex items-center gap-2.5 text-sm font-bold text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={pkg.featured}
                        onChange={(e) => set('featured')(e.target.checked)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      باقة مميزة (إطار أزرق وزر بارز)
                    </label>
                  )}
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
