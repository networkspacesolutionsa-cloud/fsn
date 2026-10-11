-- Gallery text cleanup: run once in Supabase → SQL Editor.
-- Removes the «ماهر» test item, clears the invented locations/dates and rewrites titles and
-- descriptions. Uploaded photos (before/after), badges, categories and order are kept.
update public.site_content
set data = (
  select coalesce(jsonb_agg(e.item || '{"location": "", "date": ""}'::jsonb || coalesce(t.patch, '{}'::jsonb) order by e.ord), '[]'::jsonb)
  from jsonb_array_elements(site_content.data) with ordinality as e(item, ord)
  left join (values
    ('g1', '{"title": "تنظيم كابينة سيرفر وباتش بانل", "description": "تركيب كابينة جدارية وترتيب كابلات الشبكة وتوصيلها بالباتش بانل والسويتش، مع ترقيم المنافذ وتثبيت الكابلات بأربطة فيلكرو لتسهيل الصيانة لاحقاً."}'::jsonb),
    ('g2', '{"title": "تركيب كاميرا مراقبة خارجية 4K", "description": "تركيب كاميرا مراقبة خارجية بدقة 4K مع رؤية ليلية، وتمديد الكابل داخل مواسير حماية مقاومة للشمس والحرارة."}'::jsonb),
    ('g3', '{"title": "شاشة إنتركوم داخلية تعمل باللمس", "description": "تركيب شاشة إنتركوم داخلية وربطها بشبكة الواي فاي لاستقبال الزوار بالصوت والصورة وفتح الباب من الجوال."}'::jsonb),
    ('g5', '{"title": "لوحة جرس خارجية مقاومة للماء", "description": "تركيب لوحة جرس خارجية بكاميرا وميكروفون، مقاومة للأمطار والغبار، وتدعم فتح الباب بالبطاقة أو الرمز السري."}'::jsonb),
    ('g6', '{"title": "نظام كاميرات مراقبة لمنشأة تجارية", "description": "تركيب كاميرات مراقبة شبكية وجهاز تسجيل NVR مع شاشة متابعة، وضبط التسجيل والمشاهدة عن بُعد من الجوال."}'::jsonb),
    ('g4', '{"title": "نقطة وصول Wi-Fi 6 سقفية", "description": "تركيب نقطة وصول Wi-Fi 6 في السقف لتقوية تغطية الإنترنت في المنزل أو المكتب وتقليل ضعف الإشارة بين الغرف والطوابق."}'::jsonb),
    ('g7', '{"title": "أفياش شبكة جدارية Cat6", "description": "تركيب أفياش شبكة جدارية Cat6 وتوصيلها بالكابلات، مع فحص كل نقطة بجهاز الفحص قبل التسليم."}'::jsonb),
    ('g8', '{"title": "تمديد كابلات الشبكة داخل مجاري مخصصة", "description": "تمديد كابلات الشبكة والألياف الضوئية داخل مجاري ومسارات مخصصة لحمايتها وتنظيمها وتسهيل إضافة كابلات مستقبلاً."}'::jsonb)
  ) as t(id, patch) on t.id = e.item->>'id'
  where e.item->>'id' <> 'g-murdhx375plc'
),
updated_at = now()
where key = 'gallery';
