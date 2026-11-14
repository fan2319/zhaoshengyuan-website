/* ============================================================
   九江昭盛元科技有限公司 · 界面文字字典（中 / 英 / 俄）
   产品数据与站点正文来自 data/*.json，由后台管理
   ============================================================ */
const LANGS = ['zh', 'en', 'ru'];
const LANG_META = {
  zh: { label: '中文',     short: '中文', htmlLang: 'zh-CN', dir: 'ltr' },
  en: { label: 'English',  short: 'EN',   htmlLang: 'en',    dir: 'ltr' },
  ru: { label: 'Русский',  short: 'RU',   htmlLang: 'ru',    dir: 'ltr' }
};

const I18N = {
  zh: {
    meta: {
      title: '九江昭盛元科技有限公司 | 茶叶 · 景德镇瓷器 · 流体设备出口',
      desc: '供应链管理服务；货物与技术进出口、进出口代理。修水茶叶产地直采、景德镇瓷器选品，以及泵与消防供水设备的出口与选型支持。'
    },
    nav: { about:'关于我们', center:'产品中心', products:'茶叶产品', industrial:'流体设备', porcelain:'景德镇瓷器', stories:'产品故事', capability:'服务能力', why:'为什么选择我们', terms:'合作条款', faq:'常见问题', contact:'联系合作' },

    drop: {
      teaLabel:'茶叶 · TEA', teaTitle:'茶叶与茶制品', teaDesc:'工夫红茶 · 高山绿茶 · 果茶花草茶',
      black:'红茶', green:'绿茶', fruit:'果茶 · 花草茶', teabag:'袋泡茶 · 代用茶',
      machLabel:'流体设备 · FLUID', machTitle:'泵 · 消防泵组 · 供水设备', machDesc:'按工况选型，参数与资质可核验',
      machSeries:'六大产品系列', machCerts:'资质与合规', machRfq:'按工况发送询价',
      moreLabel:'继续了解', stories:'产品故事', capability:'服务能力', faq:'常见问题',
      porcLabel:'景德镇瓷器 · PORCELAIN', porcTitle:'景德镇瓷器', porcDesc:'咖啡器 · 茶器 · 成套餐具 · 艺术瓷',
      pCoffee:'咖啡杯与杯碟', pTeaset:'旅行茶具套组', pDinner:'成套餐具', pCrafts:'五大工艺谱系', pHistory:'千年制瓷史',
      all:'查看全部产品 →', markText:'一个窗口，对接三条业务线'
    },

    hero: { eyebrow:'江西 · 九江 · 修水',
      cta1:'查看产品', cta2:'发送询盘',
      f1:'供应链管理经验', f2:'独立业务线', f3:'运输方式', f4:'中俄直连' },

    about: { label:'关于我们', qualTitle:'经营范围（可在国家企业信用信息公示系统核验）' },

    prod: { label:'茶叶产品', title:'茶叶产品',
      lead:'茶叶品类已可供货。景德镇瓷器与流体设备各自独立成板块，均可从顶部「产品中心」下拉进入。',
      note:'图示为实物拍摄。各品类规格、起订量与打样周期，请在询盘中说明采购规模与销售渠道。',
      subAll:'全部', readStory:'读它的故事' },

    story: { label:'产品故事', title:'每一样东西，都有一段来历',
      lead:'我们不只想告诉您这是什么，还想告诉您它从哪儿来、经过了谁的手。' +
            '下面每一段，都是真实的地理与历史，不是包装出来的说法。',
      empty:'故事整理中，即将上线。',
      era:'年代', readMore:'展开全文', readLess:'收起' },

    porc: {
      histLabel:'千年窑火 / A THOUSAND YEARS OF KILN FIRE',
      histTitle:'一座城，一条路，一千年',
      histLead:'以下年份与工艺说明均据公开权威资料整理。供货方产品图册只用于品类与规格，不作为史料来源。',
      cityTitle:'从昌江，到圣彼得堡',
      cityText:'昌江把瓷土、松柴与窑火送进这座城；万里茶道又把茶叶与瓷器一同送出，经恰克图抵达圣彼得堡。我们做茶，也做盛茶的器 —— 两条线在同一条商路上相遇。',
      srcLabel:'史料来源',
      craftLabel:'工艺谱系', craftTitle:'五大技艺，各有来处',
      craftLead:'先认工艺，再认器型。青白瓷是宋代立镇之瓷，青花、玲珑、粉彩、颜色釉合称景德镇四大名瓷。下方色块为釉色示意，不是产品照片。',
      catLabel:'产品目录', catTitle:'先按用途找，再按工艺筛',
      catLead:'一级按器型用途归类（咖啡器、茶器、餐具……），二级按工艺筛选（青花、青白瓷、粉彩……）。卡片正面是容量、口径与成套配置，规格均取自图册。',
      allGroup:'全部品类', allCraft:'全部工艺',
      specLabel:'代表规格', detailLabel:'展开查看选品说明', detailHide:'收起',
      quoteBtn:'按此品类询价',
      compLabel:'出口与合规', compTitle:'可以核验的，才写上来',
      compHeading:'出口与合规说明',
      docsLabel:'询价请提供', rfqBtn:'发送选品询价',
      lane1:'看工艺谱系', lane1d:'先看全不全。青白瓷、青花、玲珑、粉彩、颜色釉按窑口技艺归类，适合按目录选品。',
      lane2:'看器型与规格', lane2d:'先看容量 ml、口径 mm、成套头数与适用场景。规格就在卡片正面，适合按采购清单逐项核对。',
      lane3:'看归属与文件', lane3d:'先看图册来源、品牌归属声明与可索取的检测文件，适合尽调、清关与贴牌流程。',
      laneTag:'同一份目录，三种读法',
      empty:'该组合暂无上架品项，请选择其他分类。',
      figureTag:'图册资料图 · 以确认样品为准',
      ownerLabel:'归属声明'
    },

    mach: {
      seriesLabel:'产品系列', seriesTitle:'六大系列，按工况归类',
      seriesLead:'不按中文型号堆砌，而是按用途分组。每张卡片正面是工程参数，展开可看完整型号谱系。',
      appsLabel:'应用领域', appsTitle:'这些设备用在什么地方',
      certLabel:'资质与合规', certTitle:'可以核验的，才写上来',
      certLead:'以下为合作生产企业持有的资质。证书编号、检测报告全文与逐型号参数表不在公开展示，客户索取时提供。',
      holderLabel:'持有方', issuerLabel:'颁发 / 出具机构',
      complianceTitle:'出口合规说明',
      modelsLabel:'型号谱系', modelsHint:'展开查看该系列完整型号', modelsHide:'收起',
      appsCardLabel:'典型应用',
      allTab:'全部系列', quoteBtn:'按此系列询价',
      rfqBtn:'按工况发送询价', docsLabel:'可索取文件',
      lane1:'看型号谱系', lane1d:'先看全不全。完整系列与型号一览在每张卡片的展开区，适合按目录采购。',
      lane2:'看工况参数', lane2d:'先看 Q / H / P / DN、材质与结构。参数就在卡片正面，适合工程师按工况选型。',
      lane3:'看资质与文件', lane3d:'先看体系认证、归属声明与可索取的数据表，适合合规与尽调流程。',
      laneTag:'同一份内容，三种读法', figureTag:'示意图 · 非实物照片'
    },

    cap: { label:'服务能力' },

    faq: { label:'常见问题', title:'常见问题' },

    contact: { label:'联系合作', title:'联系合作',
      lead:'告诉我们品类、规格、数量与目的港，我们给出实时方案。',
      addr:'地址', phone:'电话', wx:'微信', mail:'邮箱', cn:'中国', ru:'俄罗斯',
      formTitle:'发送询盘',
      fName:'您的称呼 *', fCompany:'公司 / 机构', fContact:'联系方式（电话 / 邮箱 / Telegram）*',
      fCountry:'国家 / 地区', fMsg:'需求说明（品类、数量、包装、目的港等）',
      q1:'预计采购量：未确定 / 仅咨询', q2:'样品（< 5 kg 或少量）', q3:'小批量（5–50 kg）',
      q4:'常规订单（50–500 kg）', q5:'大批量（> 500 kg / 长期供货）',
      t1:'购买产品', t2:'经销代理 / 渠道合作', t3:'企业团购 / 礼盒定制', t4:'OEM / ODM 贴牌', t5:'其他',
      consent:'我同意为处理本次询盘而处理我的个人数据（姓名、联系方式等）',
      consentOpen:'查看数据处理说明',
      consentText:'您提交的信息仅用于回复本次询盘与后续商务沟通，保存于俄罗斯境内服务器，不用于其他目的。您可随时要求删除。',
      btn:'提交询盘' },

    footer: { links:'快速导航', contact:'联系方式' },

    msg: { send:'提交中…',
      ok:'✓ 已收到，我们会尽快与您联系',
      errNetwork:'提交失败 — 别担心，直接联系我们更快：',
      fbTitle:'一键联系我们',
      fbTip:'点击任一按钮即可直接对话，我们通常在数小时内回复。',
      errFill:'请填写姓名与联系方式',
      errConsent:'请先勾选个人数据处理同意',
      copied:'✓ 已复制' }
  },

  en: {
    meta: {
      title: 'Zhaoshengyuan | Tea · Jingdezhen Porcelain · Fluid Equipment',
      desc: 'Supply-chain management, import/export and agency. Origin-sourced Xiushui tea, Jingdezhen porcelain sourcing, plus pumps, fire sets and booster systems with selection support.'
    },
    nav: { about:'About', center:'Products', products:'Tea', industrial:'Fluid Equipment', porcelain:'Porcelain', stories:'Stories', capability:'Services', why:'Why Us', terms:'Terms', faq:'FAQ', contact:'Contact' },

    drop: {
      teaLabel:'TEA', teaTitle:'Tea & Tea Products', teaDesc:'Black tea · Green tea · Fruit & herbal',
      black:'Black tea', green:'Green tea', fruit:'Fruit & herbal', teabag:'Tea bags & substitutes',
      machLabel:'FLUID EQUIPMENT', machTitle:'Pumps · Fire sets · Booster systems', machDesc:'Selected by duty point, with verifiable data',
      machSeries:'Six series', machCerts:'Approvals & compliance', machRfq:'Send a duty-point enquiry',
      moreLabel:'Explore further', stories:'Product stories', capability:'Services', faq:'FAQ',
      porcLabel:'JINGDEZHEN PORCELAIN', porcTitle:'Jingdezhen Porcelain', porcDesc:'Coffee ware · Tea ware · Dinner services · Art porcelain',
      pCoffee:'Coffee cups & saucers', pTeaset:'Travel tea sets', pDinner:'Dinner services', pCrafts:'Five craft families', pHistory:'A thousand years of making',
      all:'View all products →', markText:'One window, three business lines'
    },

    hero: { eyebrow:'Jiangxi · Jiujiang · Xiushui',
      cta1:'View Products', cta2:'Send Enquiry',
      f1:'Supply-chain experience', f2:'Business lines', f3:'Transport modes', f4:'RU & CN direct' },

    about: { label:'About Us', qualTitle:'Registered business scope (verifiable on the National Enterprise Credit Information Publicity System)' },

    prod: { label:'Tea', title:'Tea Products',
      lead:'Tea categories are available now. Jingdezhen Porcelain and Fluid Equipment are separate sections — both reachable from Products in the top menu.',
      note:'All photos are real. For exact specifications, MOQ and sampling lead times, please state your volume and sales channel.',
      subAll:'All', readStory:'Read its story' },

    story: { label:'Product Stories', title:'Every item has a history',
      lead:'We want to tell you not only what this is, but where it comes from and whose hands it passed through. ' +
            'Each passage below is real geography and real history — not a packaging claim.',
      empty:'Stories are being prepared.',
      era:'Period', readMore:'Read full story', readLess:'Show less' },

    porc: {
      histLabel:'A THOUSAND YEARS OF KILN FIRE',
      histTitle:'One city, one road, a thousand years',
      histLead:'All dates and craft notes below are drawn from public authoritative sources. Supplier catalogues are used for categories and dimensions only, never as historical sources.',
      cityTitle:'From the Chang River to St Petersburg',
      cityText:'The Chang River carried clay, pine fuel and kiln fire into the town; the Great Tea Road carried tea and porcelain back out through Kyakhta to St Petersburg. We source tea, and the vessels that hold it — two ranges meeting on the same road.',
      srcLabel:'Sources',
      craftLabel:'Craft families', craftTitle:'Five techniques, each with a provenance',
      craftLead:'Know the technique before the shape. Yingqing is the Song ware that named the town; blue-and-white, linglong, famille rose and coloured glazes are the Four Great Porcelains. Swatches below indicate glaze colour, not product photos.',
      catLabel:'Catalogue', catTitle:'Find by use, filter by craft',
      catLead:'The first level groups by use (coffee ware, tea ware, tableware…); the second filters by craft (blue-and-white, yingqing, famille rose…). Card fronts show capacity, rim diameter and set composition, all quoted from the catalogues.',
      allGroup:'All categories', allCraft:'All crafts',
      specLabel:'Representative dimensions', detailLabel:'Read selection notes', detailHide:'Collapse',
      quoteBtn:'Enquire about this item',
      compLabel:'Export & compliance', compTitle:'Only what can be verified',
      compHeading:'Export & compliance notes',
      docsLabel:'What to include', rfqBtn:'Send a sourcing enquiry',
      lane1:'Start with the craft families', lane1d:'Check completeness first. Yingqing, blue-and-white, linglong, famille rose and coloured glazes grouped by kiln technique — the catalogue-buying path.',
      lane2:'Start with shape and dimensions', lane2d:'Check capacity in ml, rim Ø in mm, piece count and intended use first. Dimensions sit on the card front — the procurement-checklist path.',
      lane3:'Start with ownership and documents', lane3d:'Check catalogue provenance, brand ownership statement and available test reports first — the due-diligence, customs and private-label path.',
      laneTag:'One catalogue, three ways to read it',
      empty:'No published items in this combination — please choose another filter.',
      figureTag:'CATALOGUE IMAGE / SAMPLE TO BE CONFIRMED',
      ownerLabel:'Ownership statement'
    },

    mach: {
      seriesLabel:'Product series', seriesTitle:'Six series, grouped by duty',
      seriesLead:'Grouped by application, not by Chinese model codes. Engineering data sits on the front of each card; the full model range is in the expanded panel.',
      appsLabel:'Applications', appsTitle:'Where this equipment is used',
      certLabel:'Approvals & compliance', certTitle:'Only what can be verified',
      certLead:'The qualifications below are held by our manufacturing partner. Certificate numbers, full test reports and per-model performance tables are supplied on request rather than published.',
      holderLabel:'Holder', issuerLabel:'Issued by',
      complianceTitle:'Export compliance',
      modelsLabel:'Model range', modelsHint:'Expand for the full model list', modelsHide:'Collapse',
      appsCardLabel:'Typical use',
      allTab:'All series', quoteBtn:'Enquire about this series',
      rfqBtn:'Send a duty-point enquiry', docsLabel:'Documents on request',
      lane1:'Start with the model range', lane1d:'Check completeness first. Every card expands to its full series and model list — the catalogue-buying path.',
      lane2:'Start with duty data', lane2d:'Check Q / H / P / DN, materials and configuration first. Parameters are on the card front — the engineering path.',
      lane3:'Start with approvals', lane3d:'Check system certificates, ownership statement and available datasheets first — the compliance and due-diligence path.',
      laneTag:'One catalogue, three ways to read it', figureTag:'SCHEMATIC / NOT A PRODUCT PHOTO'
    },

    cap: { label:'Services' },

    faq: { label:'FAQ', title:'FAQ' },

    contact: { label:'Contact', title:'Get in Touch',
      lead:'Tell us the category, spec, quantity and destination port — we will quote in real time.',
      addr:'Address', phone:'Phone', wx:'WeChat', mail:'Email', cn:'China', ru:'Russia',
      formTitle:'Send an Enquiry',
      fName:'Your name *', fCompany:'Company / organisation', fContact:'Contact (phone / email / Telegram) *',
      fCountry:'Country / region', fMsg:'Requirements (category, quantity, packaging, destination…)',
      q1:'Volume: not decided / enquiry only', q2:'Samples (< 5 kg or small qty)', q3:'Small batch (5–50 kg)',
      q4:'Standard order (50–500 kg)', q5:'Bulk (> 500 kg / long-term)',
      t1:'Buying products', t2:'Distribution / channel', t3:'Corporate gifting', t4:'OEM / ODM', t5:'Other',
      consent:'I consent to the processing of my personal data (name, contact details) for handling this enquiry',
      consentOpen:'Data processing notice',
      consentText:'The data you submit is used only to answer this enquiry and for related business communication. It is stored on servers located in the Russian Federation and is not used for other purposes. You may request deletion at any time.',
      btn:'Submit Enquiry' },

    footer: { links:'Quick Links', contact:'Contact' },

    msg: { send:'Sending…',
      ok:'✓ Received — we will be in touch shortly',
      errNetwork:'Submission failed — no worries, contact us directly instead:',
      fbTitle:'Contact us in one tap',
      fbTip:'Tap any button below to reach us — we usually reply within hours.',
      errFill:'Please provide your name and contact details',
      errConsent:'Please tick the consent box first',
      copied:'✓ Copied' }
  },

  ru: {
    meta: {
      title: 'Чжаошэнъюань | Чай · Фарфор Цзиндэчжэнь · Оборудование',
      desc: 'Управление цепями поставок, импорт и экспорт, агентская ВЭД. Чай из Сюшуя, подбор фарфора Цзиндэчжэня, а также насосы и пожарные станции с подбором по параметрам.'
    },
    nav: { about:'О компании', center:'Продукция', products:'Чай', industrial:'Оборудование', porcelain:'Фарфор', stories:'Истории', capability:'Услуги', why:'Почему мы', terms:'Условия', faq:'Вопросы', contact:'Контакты' },

    drop: {
      teaLabel:'ЧАЙ', teaTitle:'Чай и чайная продукция', teaDesc:'Красный · зелёный · фруктовые чаи',
      black:'Красный чай', green:'Зелёный чай', fruit:'Фруктовый и травяной', teabag:'Пакетированный чай',
      machLabel:'ОБОРУДОВАНИЕ', machTitle:'Насосы · Пожарные агрегаты · Станции', machDesc:'Подбор по параметрам, проверяемые данные',
      machSeries:'Шесть серий', machCerts:'Документы и соответствие', machRfq:'Запрос по параметрам',
      moreLabel:'Далее', stories:'Истории продуктов', capability:'Услуги', faq:'Вопросы',
      porcLabel:'ФАРФОР ЦЗИНДЭЧЖЭНЯ', porcTitle:'Цзиндэчжэньский фарфор', porcDesc:'Кофе · чай · сервизы · художественный фарфор',
      pCoffee:'Кофейные чашки и блюдца', pTeaset:'Дорожные чайные наборы', pDinner:'Столовые сервизы', pCrafts:'Пять техник', pHistory:'Тысяча лет ремесла',
      all:'Вся продукция →', markText:'Одно окно — три направления'
    },

    hero: { eyebrow:'Цзянси · Цзюцзян · Сюшуй',
      cta1:'Продукция', cta2:'Отправить запрос',
      f1:'Опыт в поставках', f2:'Направления бизнеса', f3:'Способов перевозки', f4:'RU и CN напрямую' },

    about: { label:'О компании', qualTitle:'Зарегистрированный вид деятельности (проверяется в Национальной системе раскрытия информации)' },

    prod: { label:'Чай', title:'Чайная продукция',
      lead:'Чайные категории доступны. Фарфор Цзиндэчжэня и оборудование вынесены в отдельные разделы — оба открываются из меню «Продукция» сверху.',
      note:'Все фото реальные. Точные характеристики, минимальный объём и сроки образцов уточняйте в запросе.',
      subAll:'Все', readStory:'Читать историю' },

    story: { label:'Истории продуктов', title:'У каждой вещи есть история',
      lead:'Мы хотим рассказать не только о том, что это такое, но и о том, откуда оно пришло ' +
            'и через чьи руки прошло. Каждый текст ниже — реальная география и реальная история, ' +
            'а не маркетинговая формулировка.',
      empty:'Истории готовятся к публикации.',
      era:'Эпоха', readMore:'Читать полностью', readLess:'Свернуть' },

    porc: {
      histLabel:'ТЫСЯЧА ЛЕТ ОГНЯ ПЕЧЕЙ',
      histTitle:'Один город, одна дорога, тысяча лет',
      histLead:'Все даты и описания техник приведены по открытым официальным источникам. Каталоги поставщиков используются только для категорий и размеров, но не как исторический источник.',
      cityTitle:'От реки Чанцзян до Санкт-Петербурга',
      cityText:'Река Чан несла в город глину, сосновые дрова и огонь печей; Великий чайный путь выносил чай и фарфор обратно — через Кяхту в Санкт-Петербург. Мы поставляем чай и посуду для него: две линии встречаются на одной дороге.',
      srcLabel:'Источники',
      craftLabel:'Техники', craftTitle:'Пять техник, у каждой — своя история',
      craftLead:'Сначала техника, потом форма. «Инцин» — фарфор, давший городу имя; сине-белый, линлун, фэньцай и цветные глазури — четыре знаменитых фарфора Цзиндэчжэня. Цветовые плашки ниже обозначают оттенок глазури, а не фото изделия.',
      catLabel:'Каталог', catTitle:'Ищем по назначению, фильтруем по технике',
      catLead:'Первый уровень — по назначению (кофейная, чайная, столовая посуда…), второй — по технике (сине-белый, «инцин», фэньцай…). На лицевой стороне карточки — объём, диаметр и состав набора; все размеры взяты из каталогов.',
      allGroup:'Все категории', allCraft:'Все техники',
      specLabel:'Типовые размеры', detailLabel:'Подробнее о подборе', detailHide:'Свернуть',
      quoteBtn:'Запросить эту позицию',
      compLabel:'Экспорт и соответствие', compTitle:'Только то, что можно проверить',
      compHeading:'Экспорт и соответствие',
      docsLabel:'Что указать в запросе', rfqBtn:'Отправить запрос на подбор',
      lane1:'Начать с техник', lane1d:'Сначала — полнота ассортимента. «Инцин», сине-белый, линлун, фэньцай и цветные глазури сгруппированы по печной технике: путь закупки по каталогу.',
      lane2:'Начать с формы и размеров', lane2d:'Сначала — объём в мл, диаметр в мм, число предметов в сервизе и сценарий использования. Размеры на лицевой стороне карточки: путь по закупочной спецификации.',
      lane3:'Начать с принадлежности и документов', lane3d:'Сначала — происхождение каталога, заявление о правах на бренд и доступные протоколы испытаний: путь due diligence, таможни и private label.',
      laneTag:'Один каталог — три способа чтения',
      empty:'В этом сочетании нет опубликованных позиций — выберите другой фильтр.',
      figureTag:'ФОТО ИЗ КАТАЛОГА / ОБРАЗЕЦ СОГЛАСУЕТСЯ',
      ownerLabel:'Заявление о принадлежности прав'
    },

    mach: {
      seriesLabel:'Серии оборудования', seriesTitle:'Шесть серий по назначению',
      seriesLead:'Группировка по применению, а не по китайским обозначениям. Технические данные — на лицевой стороне карточки, полный ряд типоразмеров — в раскрывающемся блоке.',
      appsLabel:'Области применения', appsTitle:'Где работает это оборудование',
      certLabel:'Документы и соответствие', certTitle:'Только то, что можно проверить',
      certLead:'Указанные документы принадлежат производственному партнёру. Номера сертификатов, полные протоколы испытаний и таблицы по каждому типоразмеру предоставляются по запросу, а не публикуются.',
      holderLabel:'Владелец', issuerLabel:'Выдавший орган',
      complianceTitle:'Экспортное соответствие',
      modelsLabel:'Ряд типоразмеров', modelsHint:'Развернуть полный перечень моделей', modelsHide:'Свернуть',
      appsCardLabel:'Типовое применение',
      allTab:'Все серии', quoteBtn:'Запросить по этой серии',
      rfqBtn:'Отправить запрос по параметрам', docsLabel:'Документы по запросу',
      lane1:'Начать с ряда моделей', lane1d:'Сначала — полнота ассортимента. Полный перечень серий и моделей в раскрытом блоке каждой карточки: путь закупки по каталогу.',
      lane2:'Начать с параметров', lane2d:'Сначала — Q / H / P / DN, материалы и исполнение. Данные на лицевой стороне карточки: путь инженера-проектировщика.',
      lane3:'Начать с документов', lane3d:'Сначала — сертификаты системы менеджмента, заявление о принадлежности и доступные даташиты: путь комплаенса и due diligence.',
      laneTag:'Один каталог — три способа чтения', figureTag:'СХЕМА / НЕ ФОТО ИЗДЕЛИЯ'
    },

    cap: { label:'Услуги' },

    faq: { label:'Вопросы', title:'Частые вопросы' },

    contact: { label:'Контакты', title:'Свяжитесь с нами',
      lead:'Укажите категорию, характеристики, объём и порт назначения — рассчитаем актуальное предложение.',
      addr:'Адрес', phone:'Телефон', wx:'WeChat', mail:'E-mail', cn:'Китай', ru:'Россия',
      formTitle:'Отправить запрос',
      fName:'Ваше имя *', fCompany:'Компания / организация', fContact:'Контакт (телефон / e-mail / Telegram) *',
      fCountry:'Страна / регион', fMsg:'Требования (категория, объём, упаковка, назначение…)',
      q1:'Объём: не определён / только запрос', q2:'Образцы (< 5 кг или немного)', q3:'Мелкая партия (5–50 кг)',
      q4:'Стандартный заказ (50–500 кг)', q5:'Крупный объём (> 500 кг / долгосрочно)',
      t1:'Покупка продукции', t2:'Дистрибуция', t3:'Корпоративные подарки', t4:'OEM / ODM', t5:'Другое',
      consent:'Я даю согласие на обработку моих персональных данных (имя, контактные данные) для рассмотрения данного запроса',
      consentOpen:'Уведомление об обработке данных',
      consentText:'Переданные данные используются только для ответа на запрос и последующей деловой переписки, хранятся на серверах, расположенных на территории Российской Федерации, и не используются в иных целях. Вы можете потребовать удаления в любое время.',
      btn:'Отправить запрос' },

    footer: { links:'Навигация', contact:'Контакты' },

    msg: { send:'Отправка…',
      ok:'✓ Запрос получен — мы свяжемся с вами',
      errNetwork:'Не удалось отправить — ничего страшного, свяжитесь с нами напрямую:',
      fbTitle:'Связаться в один клик',
      fbTip:'Нажмите любую кнопку ниже — обычно отвечаем в течение нескольких часов.',
      errFill:'Укажите имя и контактные данные',
      errConsent:'Пожалуйста, поставьте отметку о согласии на обработку данных',
      copied:'✓ Скопировано' }
  }
};

/* ============================================================
   V3 · 视觉交互与转化路径 —— 界面文字补充字典
   规则：所有 CTA / 表单标签 / 浮窗菜单项 / 抽屉标题 100% 本地化。
   例外（保持原样，不翻译）：Q / H / P / DN、SI、ISO 9001、EAC、
   380V、50Hz、ml、mm、m³/h、型号代号，以及 WhatsApp / Telegram /
   Telegram Bot / WeChat 等品牌专有名词。
   ============================================================ */
;(function () {
  var X = {
    zh: {
      nav: {
        home: '首页', heritage: '品牌源流', sourcing: '服务能力',
        products: '茶叶产品', center: '产品中心'
      },
      drop: {
        teaLabel: '茶叶', porcLabel: '景德镇瓷器', machLabel: '流体设备',
        teaSpecs: '分级与规格', porcCoffee: '咖啡器 · 杯碟', porcTea: '茶器 · 套组',
        porcDinner: '成套餐具', porcSpecs: '工艺与规格', porcHistory: '千年制瓷史',
        machSeries: '六大产品系列', machSpecs: '参数与数据表', machCerts: '资质与合规',
        machRfq: '按工况询价', viewAll: '查看全部 →', story: '品牌源流',
        services: '服务能力', why: '为什么选择我们', terms: '合作条款', faq: '常见问题'
      },
      search: {
        placeholder: '搜索品名或型号', open: '打开搜索', close: '关闭搜索',
        hint: '可按品名、型号、规格或应用场景搜索',
        gTea: '茶叶', gPorc: '景德镇瓷器', gMach: '流体设备',
        noResult: '未找到「{q}」', noResultText: '这一项我们可以按您的描述单独报价。',
        noResultCta: '按此关键词询价', view: '查看', quote: '询价',
        count: '条结果', focusHint: '按 / 聚焦搜索'
      },
      app: {
        tag: '按采购场景进入', title: '三种采购意图，三条入口',
        lead: '不用先想清楚品类名称，从您熟悉的采购场景进来即可。',
        hTitle: '酒店与餐饮', hDesc: '成套餐具、咖啡杯碟、茶器与袋泡 / 果茶 OEM；按房间数与餐位数配置。',
        hCta: '查看酒店选品',
        rTitle: '商超与零售', rDesc: '宁红茶为主的小规格、分级价目、包装与补货口径；适合商超与茶叶专门店。',
        rCta: '查看零售选品',
        iTitle: '工业与工程', iDesc: '按 Q / H / P / DN 与介质选型，参数与可索取数据表就在卡片正面。',
        iCta: '进入工况选型'
      },
      heritage: {
        eyebrow: '江西 · 九江 · 修水', title: '百年前，它就沿这条路去了俄国',
        lead: '这里只放可以查证的年代、引文与出处。故事负责说明我们从哪里来，' +
              '规格与报价交给产品页，资质与主体信息交给「关于我们」。',
        srcLabel: '史料来源', viewTea: '查看茶叶产品 →', viewPorc: '查看景德镇瓷器 →',
        note: '引文与出处逐条标注；无法核实的说法不写。',
        item1Era: '清 · 光绪十七年（1891）',
        item1Text: '商人以宁红茶进献俄国皇太子，获赠匾额「茶盖中华、价高天下」。',
        item1Src: '人民网江西频道',
        item2Era: '19 世纪末',
        item2Text: '销俄宁红茶约占江西茶叶出口八成；宁红沿万里茶道经汉口北上，过恰克图入俄国。',
        item2Src: '中央纪委国家监委网站、《江西经济史》',
        item3Era: '北宋',
        item3Text: '黄庭坚「山谷家乡双井茶，一啜犹须三日夸」；欧阳修《归田录》推双井为草茶第一；' +
                   '《宋史·食货志》列「隆兴之黄龙、双井，皆号绝品也」。',
        item3Src: '《山谷集》、《归田录》、《宋史·食货志》',
        item4Era: '1915',
        item4Text: '宁红茶获巴拿马万国博览会甲级大奖章。',
        item4Src: '人民网江西频道',
        readMore: '展开全文', readLess: '收起'
      },
      specs: {
        machTitle: '参数与数据表', porcTitle: '工艺与规格',
        machNote: 'Q / H / P / DN 采用 SI 单位；逐型号性能曲线与数据表按系列索取，不在公网发布。',
        porcNote: '容量以 ml、口径以 mm、成套以头数标注；规格取自供货图册，以确认样品为准。',
        cta: '按此规格询价'
      },
      rfq: {
        title: '获取报价', close: '关闭询价', contextLabel: '当前咨询',
        change: '更改', fromLabel: '来源', thumbAlt: '产品缩略图',
        noThumb: '未找到的商品 · 可按此询价',
        quoteBtn: '获取报价', specCta: '索取数据表',
        commonSection: '联系信息', phTeaChannel: '商超 / 酒店餐饮',
        fName: '您的称呼 *', fCompany: '公司 / 机构', fContact: '联系方式（电话 / 邮箱 / Telegram）*',
        fCountry: '国家 / 地区', fQty: '数量', fNote: '需求说明',
        fLead: '期望交期', fDocs: '需要的合规文件',
        teaGrade: '等级', teaSpec: '规格', teaPack: '定制包装', teaSample: '样品数量',
        teaChannel: '目标渠道', packYes: '需要', packNo: '不需要',
        porcShape: '器型', porcSet: '头数 / 容量', porcPack: '定制包装 / 贴牌',
        porcSample: '样品数量', porcGift: '礼盒需求',
        machFlow: '流量 Q (m³/h)', machHead: '扬程 H (m)', machVolt: '电压 / 频率',
        machDN: '口径 DN', machMedium: '介质', machDatasheet: '索取数据表',
        optEac: 'EAC 说明（由俄方进口商持证）', optTest: '检测报告', optOther: '其他',
        consent: '我同意为处理本次询盘而处理我的个人数据（姓名、联系方式等）',
        consentOpen: '查看数据处理说明',
        consentText: '您提交的信息仅用于回复本次询盘与后续商务沟通，不用于其他目的。您可随时要求删除。',
        submit: '提交询盘', sending: '提交中…',
        ok: '已收到，我们会尽快与您联系', okRef: '参考编号', continue: '继续浏览',
        fail: '提交失败，您填写的内容已保留', failTip: '可直接用邮件或即时通讯把填好的内容发给我们。',
        mailFallback: '带上我填的内容发邮件',
        waAssist: 'WhatsApp 沟通', tgAssist: 'Telegram 沟通',
        errFill: '请填写姓名与联系方式', errConsent: '请先勾选个人数据处理同意',
        chTea: '茶叶', chPorc: '景德镇瓷器', chMach: '流体设备', chOther: '其他 / 未指定',
        chTitle: '选择询价品类'
      },
      cta: {
        tg: 'Telegram 联系', wa: 'WhatsApp 沟通', mail: '发送邮件', phone: '拨打电话',
        mailFallback: '📧 带上我填的内容发邮件', top: '回到顶部'
      },
      dock: {
        title: '直接联系', wa: 'WhatsApp 沟通', tg: 'Telegram 联系',
        bot: 'Telegram Bot', botTag: '规格与起订量即时答复',
        wechat: 'WeChat', wechatTag: '中国客户咨询',
        open: '展开联系方式', close: '收起联系方式',
        copied: '✓ 已复制', copyHint: '点击复制微信号'
      }
    },

    en: {
      nav: {
        home: 'Home', heritage: 'Heritage', sourcing: 'Sourcing Service',
        products: 'Tea', center: 'Products'
      },
      drop: {
        teaSpecs: 'Grades & specs', porcCoffee: 'Coffee ware & saucers', porcTea: 'Tea ware & sets',
        porcDinner: 'Dinner services', porcSpecs: 'Craft & specs', porcHistory: 'A thousand years of making',
        machSeries: 'Six series', machSpecs: 'Parameters & datasheets', machCerts: 'Approvals & compliance',
        machRfq: 'Enquire by duty point', viewAll: 'View all →', story: 'Heritage',
        services: 'Sourcing Service', why: 'Why us', terms: 'Terms', faq: 'FAQ'
      },
      search: {
        placeholder: 'Search by name or model', open: 'Open search', close: 'Close search',
        hint: 'Search by product name, model, specification or application',
        gTea: 'Tea', gPorc: 'Jingdezhen porcelain', gMach: 'Fluid equipment',
        noResult: 'No match for “{q}”', noResultText: 'We can still quote against your description.',
        noResultCta: 'Enquire with this keyword', view: 'View', quote: 'Get Quote',
        count: 'results', focusHint: 'Press / to search'
      },
      app: {
        tag: 'Browse by application', title: 'Three buying intents, three entry points',
        lead: 'Start from the procurement scenario you know — no need to pick a category first.',
        hTitle: 'Hospitality', hDesc: 'Dinner services, coffee cups and saucers, tea ware, plus tea bags / fruit tea OEM — configured per room or per cover.',
        hCta: 'View hospitality range',
        rTitle: 'Retail', rDesc: 'Ninghong black tea in small packs, grade lists, packaging and replenishment terms — for supermarkets and tea shops.',
        rCta: 'View retail range',
        iTitle: 'Industrial', iDesc: 'Selected by Q / H / P / DN and medium. Engineering data and datasheets sit on the card front.',
        iCta: 'Open duty-point selection'
      },
      heritage: {
        eyebrow: 'Jiangxi · Jiujiang · Xiushui', title: 'A century ago it travelled this road to Russia',
        lead: 'Only verifiable dates, quotations and sources live here. Stories explain where we come from; ' +
              'specifications and pricing belong to the product pages, and company credentials to About.',
        srcLabel: 'Sources', viewTea: 'View tea products →', viewPorc: 'View porcelain →',
        note: 'Each quotation carries its source. Unverifiable claims are not published.',
        item1Era: 'Qing · Guangxu 17 (1891)',
        item1Text: 'Merchants presented Ninghong black tea to the Russian Crown Prince, receiving a plaque reading “Tea surpassing all under heaven, prized above all”.',
        item1Src: 'People’s Daily Online, Jiangxi',
        item2Era: 'Late 19th century',
        item2Text: 'Ninghong shipped to Russia accounted for roughly 80% of Jiangxi tea exports; it travelled the Great Tea Road via Hankou and Kyakhta into Russia.',
        item2Src: 'CCDI website; Economic History of Jiangxi',
        item3Era: 'Northern Song',
        item3Text: 'Huang Tingjian wrote of Shuangjing tea; Ouyang Xiu ranked it first among grass teas in Gui Tian Lu; ' +
                   'the Song Shi lists “Huanglong and Shuangjing of Longxing, all called supreme”.',
        item3Src: 'Shan Gu Ji; Gui Tian Lu; Song Shi, Treatise on Food and Money',
        item4Era: '1915',
        item4Text: 'Ninghong black tea received a Class A Grand Prize at the Panama–Pacific International Exposition.',
        item4Src: 'People’s Daily Online, Jiangxi',
        readMore: 'Read full story', readLess: 'Show less'
      },
      specs: {
        machTitle: 'Parameters & datasheets', porcTitle: 'Craft & specs',
        machNote: 'Q / H / P / DN use SI units. Per-model curves and datasheets are supplied on request, not published.',
        porcNote: 'Capacity in ml, rim diameter in mm, sets by piece count. Dimensions from supplier catalogues; confirmed samples govern.',
        cta: 'Enquire about these specs'
      },
      rfq: {
        title: 'Get Quote', close: 'Close enquiry', contextLabel: 'Your enquiry',
        change: 'Change', fromLabel: 'From', thumbAlt: 'Product thumbnail',
        noThumb: 'Item not listed · enquire anyway',
        quoteBtn: 'Get Quote', specCta: 'Request datasheet',
        commonSection: 'Your details', phTeaChannel: 'Retail / Hospitality',
        fName: 'Your name *', fCompany: 'Company / organisation', fContact: 'Contact (phone / email / Telegram) *',
        fCountry: 'Country / region', fQty: 'Quantity', fNote: 'Requirements',
        fLead: 'Desired lead time', fDocs: 'Documents required',
        teaGrade: 'Grade', teaSpec: 'Pack size', teaPack: 'Custom packaging', teaSample: 'Sample quantity',
        teaChannel: 'Target channel', packYes: 'Yes', packNo: 'No',
        porcShape: 'Shape', porcSet: 'Pieces / capacity', porcPack: 'Custom packaging / private label',
        porcSample: 'Sample quantity', porcGift: 'Gift box required',
        machFlow: 'Flow Q (m³/h)', machHead: 'Head H (m)', machVolt: 'Voltage / frequency',
        machDN: 'Nominal diameter DN', machMedium: 'Medium', machDatasheet: 'Request datasheet',
        optEac: 'EAC note (held by the Russian importer)', optTest: 'Test report', optOther: 'Other',
        consent: 'I consent to the processing of my personal data (name, contact details) for handling this enquiry',
        consentOpen: 'Data processing notice',
        consentText: 'The data you submit is used only to answer this enquiry and for related business communication. You may request deletion at any time.',
        submit: 'Submit Enquiry', sending: 'Sending…',
        ok: 'Received — we will be in touch shortly', okRef: 'Reference', continue: 'Continue browsing',
        fail: 'Submission failed — your details are kept', failTip: 'Send the filled details by email or messenger instead.',
        mailFallback: 'Email with my details',
        waAssist: 'Chat on WhatsApp', tgAssist: 'Chat on Telegram',
        errFill: 'Please provide your name and contact details', errConsent: 'Please tick the consent box first',
        chTea: 'Tea', chPorc: 'Jingdezhen porcelain', chMach: 'Fluid equipment', chOther: 'Other / not specified',
        chTitle: 'Choose a category'
      },
      cta: {
        tg: 'Message on Telegram', wa: 'Chat on WhatsApp', mail: 'Email us', phone: 'Call us',
        mailFallback: '📧 Email with my details', top: 'Back to top'
      },
      dock: {
        title: 'Direct contact', wa: 'Chat on WhatsApp', tg: 'Message on Telegram',
        bot: 'Telegram Bot', botTag: 'Instant specs & MOQ',
        wechat: 'WeChat', wechatTag: 'For China inquiries',
        open: 'Open contact options', close: 'Close contact options',
        copied: '✓ Copied', copyHint: 'Tap to copy WeChat ID'
      }
    },

    ru: {
      nav: {
        home: 'Главная', heritage: 'Наследие', sourcing: 'Услуги по поставкам',
        products: 'Чай', center: 'Продукция'
      },
      drop: {
        teaSpecs: 'Сорта и фасовка', porcCoffee: 'Кофейные чашки и блюдца', porcTea: 'Чайная посуда и наборы',
        porcDinner: 'Столовые сервизы', porcSpecs: 'Техники и размеры', porcHistory: 'Тысяча лет ремесла',
        machSeries: 'Шесть серий', machSpecs: 'Параметры и даташиты', machCerts: 'Документы и соответствие',
        machRfq: 'Запрос по параметрам', viewAll: 'Вся продукция →', story: 'Наследие',
        services: 'Услуги по поставкам', why: 'Почему мы', terms: 'Условия', faq: 'Вопросы'
      },
      search: {
        placeholder: 'Поиск по названию или модели', open: 'Открыть поиск', close: 'Закрыть поиск',
        hint: 'Поиск по названию, модели, характеристике или сценарию закупки',
        gTea: 'Чай', gPorc: 'Фарфор Цзиндэчжэня', gMach: 'Оборудование',
        noResult: 'По запросу «{q}» ничего не найдено', noResultText: 'Мы всё равно можем подготовить предложение по вашему описанию.',
        noResultCta: 'Запросить по этому запросу', view: 'Открыть', quote: 'Запросить цену',
        count: 'результатов', focusHint: 'Нажмите / для поиска'
      },
      app: {
        tag: 'По сценарию закупки', title: 'Три задачи закупки — три входа',
        lead: 'Начните с привычного сценария закупки — не нужно сначала выбирать категорию.',
        hTitle: 'Отели и рестораны', hDesc: 'Сервизы, кофейные пары, чайная посуда, пакетированный и фруктовый чай OEM — расчёт по номерам и посадочным местам.',
        hCta: 'Подбор для отелей',
        rTitle: 'Розница и супермаркеты', rDesc: 'Красный чай Нинхун в малой фасовке, сортность, упаковка и условия пополнения — для ритейла и чайных магазинов.',
        rCta: 'Подбор для розницы',
        iTitle: 'Промышленность и инженерия', iDesc: 'Подбор по Q / H / P / DN и среде. Параметры и даташиты — на лицевой стороне карточки.',
        iCta: 'Подбор по параметрам'
      },
      heritage: {
        eyebrow: 'Цзянси · Цзюцзян · Сюшуй', title: 'Сто лет назад он уже шёл этой дорогой в Россию',
        lead: 'Здесь только проверяемые даты, цитаты и источники. История объясняет, откуда мы пришли; ' +
              'характеристики и цены — на страницах продукции, сведения о компании — в разделе «О компании».',
        srcLabel: 'Источники', viewTea: 'Смотреть чай →', viewPorc: 'Смотреть фарфор →',
        note: 'У каждой цитаты указан источник. Непроверяемые утверждения не публикуются.',
        item1Era: 'Цин · 17-й год Гуансюй (1891)',
        item1Text: 'Купцы преподнесли красный чай Нинхун российскому наследнику престола и получили дощечку с надписью «Чай превыше всех в Поднебесной, цена выше всех».',
        item1Src: 'Жэньминь жибао, Цзянси',
        item2Era: 'Конец XIX века',
        item2Text: 'На Нинхун приходилось около 80% экспорта чая из Цзянси в Россию; чай шёл Великим чайным путём через Ханькоу и Кяхту.',
        item2Src: 'Сайт ЦКПД; «Экономическая история Цзянси»',
        item3Era: 'Северная Сун',
        item3Text: 'Хуан Тинцзянь писал о чае Шуанцзин; Оуян Сю в «Гуй тянь лу» поставил его первым среди травяных чаёв; ' +
                   'в «Сун ши» сказано: «Хуанлун и Шуанцзин из Лунсина — все именуются высшим сортом».',
        item3Src: '«Шань гу цзи»; «Гуй тянь лу»; «Сун ши», раздел о продуктах и деньгах',
        item4Era: '1915',
        item4Text: 'Красный чай Нинхун получил большую золотую медаль класса А на Панамской всемирной выставке.',
        item4Src: 'Жэньминь жибао, Цзянси',
        readMore: 'Читать полностью', readLess: 'Свернуть'
      },
      specs: {
        machTitle: 'Параметры и даташиты', porcTitle: 'Техники и размеры',
        machNote: 'Q / H / P / DN приведены в единицах SI. Кривые по каждому типоразмеру и даташиты предоставляются по запросу, а не публикуются.',
        porcNote: 'Объём в мл, диаметр в мм, состав набора — в предметах. Размеры по каталогам поставщика; определяющим является согласованный образец.',
        cta: 'Запросить по этим характеристикам'
      },
      rfq: {
        title: 'Получить предложение', close: 'Закрыть запрос', contextLabel: 'Ваш запрос',
        change: 'Изменить', fromLabel: 'Источник', thumbAlt: 'Изображение товара',
        noThumb: 'Позиция не найдена · можно запросить',
        quoteBtn: 'Получить предложение', specCta: 'Запросить даташит',
        commonSection: 'Контактные данные', phTeaChannel: 'Ритейл / HoReCa',
        fName: 'Ваше имя *', fCompany: 'Компания / организация', fContact: 'Контакт (телефон / e-mail / Telegram) *',
        fCountry: 'Страна / регион', fQty: 'Количество', fNote: 'Требования',
        fLead: 'Желаемый срок поставки', fDocs: 'Необходимые документы',
        teaGrade: 'Сорт', teaSpec: 'Фасовка', teaPack: 'Индивидуальная упаковка', teaSample: 'Количество образцов',
        teaChannel: 'Канал сбыта', packYes: 'Да', packNo: 'Нет',
        porcShape: 'Форма', porcSet: 'Число предметов / объём', porcPack: 'Индивидуальная упаковка / private label',
        porcSample: 'Количество образцов', porcGift: 'Подарочная коробка',
        machFlow: 'Расход Q (м³/ч)', machHead: 'Напор H (м)', machVolt: 'Напряжение / частота',
        machDN: 'Условный проход DN', machMedium: 'Среда', machDatasheet: 'Запросить даташит',
        optEac: 'Разъяснение по EAC (оформляет импортёр в РФ)', optTest: 'Протокол испытаний', optOther: 'Другое',
        consent: 'Я даю согласие на обработку моих персональных данных (имя, контактные данные) для рассмотрения данного запроса',
        consentOpen: 'Уведомление об обработке данных',
        consentText: 'Переданные данные используются только для ответа на запрос и последующей деловой переписки. Вы можете потребовать удаления в любое время.',
        submit: 'Отправить запрос', sending: 'Отправка…',
        ok: 'Запрос получен — мы свяжемся с вами', okRef: 'Номер запроса', continue: 'Продолжить просмотр',
        fail: 'Не удалось отправить — заполненные данные сохранены', failTip: 'Отправьте заполненное письмо по e-mail или через мессенджер.',
        mailFallback: 'Отправить заполненное письмом',
        waAssist: 'Связаться в WhatsApp', tgAssist: 'Связаться в Telegram',
        errFill: 'Укажите имя и контактные данные',
        errConsent: 'Пожалуйста, поставьте отметку о согласии на обработку данных',
        chTea: 'Чай', chPorc: 'Фарфор Цзиндэчжэня', chMach: 'Оборудование', chOther: 'Другое / не указано',
        chTitle: 'Выберите категорию'
      },
      cta: {
        tg: 'Написать в Telegram', wa: 'Связаться в WhatsApp', mail: 'Написать письмо', phone: 'Позвонить',
        mailFallback: '📧 Отправить заполненное письмом', top: 'Наверх'
      },
      dock: {
        title: 'Прямая связь', wa: 'Связаться в WhatsApp', tg: 'Написать в Telegram',
        bot: 'Telegram Bot', botTag: 'Параметры и MOQ мгновенно',
        wechat: 'WeChat', wechatTag: 'Для запросов из Китая',
        open: 'Открыть контакты', close: 'Свернуть контакты',
        copied: '✓ Скопировано', copyHint: 'Нажмите, чтобы скопировать WeChat'
      }
    }
  };

  /* 深合并：只覆盖给出的键，保留原有字典的所有条目 */
  function merge(dst, src) {
    for (var k in src) {
      if (!Object.prototype.hasOwnProperty.call(src, k)) continue;
      var v = src[k];
      if (v && typeof v === 'object' && !(v instanceof Array) && dst[k] && typeof dst[k] === 'object') {
        merge(dst[k], v);
      } else { dst[k] = v; }
    }
  }
  for (var i = 0; i < LANGS.length; i++) merge(I18N[LANGS[i]], X[LANGS[i]]);
})();
