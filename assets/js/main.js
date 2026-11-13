/* ============================================================
   九江昭盛元科技有限公司 · 前端逻辑
   数据来自 data/site.json 与 data/products.json（后台管理）
   ============================================================ */
(function () {
  'use strict';

  function $(s, root) { return (root || document).querySelector(s); }
  function $$(s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  /* 取三语值：优先当前语言，回退中文，再回退英文 */
  function t(v, lang) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    if (typeof v === 'object') {
      return v[lang] || v.zh || v.en || v.ru || '';
    }
    return String(v);
  }

  var cur = 'zh';
  var SITE = null;   // data/site.json
  var PROD = null;   // data/products.json
  var MACH = null;   // data/machinery.json —— 独立业务线，不与茶叶数据混用
  var mFilter = 'all'; var machOpen = {};
  var filterCat = 'all';
  var filterSub = 'all';

  /* 内联占位图：不依赖任何外部服务，中俄都能显示 */
  var PH = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450">' +
    '<rect width="600" height="450" fill="#eef1f5"/>' +
    '<circle cx="300" cy="200" r="52" fill="#cfd8e2"/>' +
    '<text x="300" y="300" font-size="20" fill="#8a96a4" text-anchor="middle" font-family="sans-serif">Photo</text></svg>');

  /* ============================================================
     语言
     ============================================================ */
  function detect() {
    try {
      var s = localStorage.getItem('zsy_lang');
      if (s && LANGS.indexOf(s) > -1) return s;
    } catch (e) {}
    var n = (navigator.language || 'zh').toLowerCase();
    if (n.indexOf('ru') === 0) return 'ru';
    if (n.indexOf('zh') === 0 || n.indexOf('cn') > -1) return 'zh';
    return 'en';
  }

  function setLang(lang, noPersist) {
    cur = LANGS.indexOf(lang) > -1 ? lang : 'zh';
    if (!noPersist) { try { localStorage.setItem('zsy_lang', cur); } catch (e) {} }
    document.documentElement.lang = LANG_META[cur].htmlLang;
    document.documentElement.dir = LANG_META[cur].dir;
    var d = I18N[cur];
    if (d && d.meta) {
      document.title = d.meta.title;
      var md = $('meta[name="description"]');
      if (md) md.setAttribute('content', d.meta.desc);
    }
    $$('[data-i18n]').forEach(function (el) {
      var v = getKey(d, el.getAttribute('data-i18n'));
      if (v != null) el.textContent = v;
    });
    $$('[data-i18n-ph]').forEach(function (el) {
      var v = getKey(d, el.getAttribute('data-i18n-ph'));
      if (v != null) el.setAttribute('placeholder', v);
    });
    $$('#langswitch button').forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-lang') === cur);
    });
    renderData();
  }

  function getKey(obj, path) {
    if (!obj) return null;
    return path.split('.').reduce(function (o, k) { return (o == null) ? null : o[k]; }, obj);
  }

  /* ============================================================
     渲染 CMS 数据
     ============================================================ */
  function renderData() {
    if (!SITE) return;
    var L = cur;

    // 首屏
    $('#heroTitle').textContent = t(SITE.hero_titles, L) || '九江昭盛元科技有限公司';
    $('#heroSub').textContent = t(SITE.hero_subs, L) || '';
    if (SITE.hero_img) $('#heroBg').style.backgroundImage = 'url("' + SITE.hero_img + '")';

    // 关于
    $('#aboutTitle').textContent = t(SITE.about_titles, L) || t(I18N[L].about, 'label');
    $('#aboutDesc').textContent = t(SITE.about_descs, L) || '';
    var ai = $('#aboutImg');
    if (SITE.about_img) { ai.src = SITE.about_img; ai.style.display = 'block'; }
    else { ai.style.display = 'none'; }

    $('#qualList').innerHTML = (SITE.qual_items || [])
      .map(function (q) { return '<li>' + esc(t(q, L)) + '</li>'; }).join('');
    $('#qualNote').textContent = t(SITE.qual_note, L) || '';

    // 能力
    $('#capTitle').textContent = t(SITE.cap_title, L) || '';
    $('#capLead').textContent = t(SITE.cap_lead, L) || '';
    $('#capList').innerHTML = (SITE.cap_items || [])
      .map(function (c, i) { return '<li><b>' + (i + 1) + '</b><span>' + esc(t(c, L)) + '</span></li>'; }).join('');
    $('#capNote').textContent = t(SITE.cap_note, L) || '';

    // 为什么选择我们
    $('#whyTitle').textContent = t(SITE.why_title, L) || '';
    $('#whyGrid').innerHTML = (SITE.why_items || [])
      .map(function (w) {
        return '<div class="mini-card"><h4>' + esc(t(w.title, L)) + '</h4><p>' + esc(t(w.text, L)) + '</p></div>';
      }).join('');

    // 合作条款
    $('#termTitle').textContent = t(SITE.term_title, L) || '';
    $('#termGrid').innerHTML = (SITE.term_items || [])
      .map(function (x) {
        return '<div class="mini-card"><h4>' + esc(t(x.title, L)) + '</h4><p>' + esc(t(x.text, L)) + '</p></div>';
      }).join('');
    $('#termNote').textContent = t(SITE.term_note, L) || '';

    // FAQ
    $('#faqList').innerHTML = (SITE.faq_list || [])
      .map(function (f) {
        return '<details class="fq"><summary>' + esc(t(f.q, L)) + '</summary><div class="fa">' + esc(t(f.a, L)) + '</div></details>';
      }).join('');

    // 联系信息
    $('#cAddr').textContent = t(SITE.contact_addr, L) || '';
    $('#cTelCn').textContent = SITE.contact_phone_cn || '';
    $('#cTelRu').textContent = SITE.contact_phone_ru || '';
    $('#cMail1').textContent = SITE.contact_email_1 || '';
    $('#cMail2').textContent = SITE.contact_email_2 || '';
    $('#wxCopy').textContent = SITE.contact_wechat || '';
    $('#footerNote').textContent = t(SITE.footer_note, L) || '';
    $('#footerCopy').textContent = '© ' + new Date().getFullYear() + ' ' +
      (L === 'ru' ? 'ООО «Цзюцзян Чжаошэнъюань Технологии»' :
       L === 'en' ? 'Jiujiang Zhaoshengyuan Technology Co., Ltd.' :
       '九江昭盛元科技有限公司');

    var navKeys = ['about','products','stories','industrial','capability','why','terms','faq','contact'];
    $('#footerLinks').innerHTML = navKeys.map(function (k) {
      return '<li><a href="#' + k + '">' + esc(I18N[L].nav[k]) + '</a></li>';
    }).join('');
    $('#footContact').innerHTML =
      '<li><a href="tel:' + (SITE.contact_phone_cn || '').replace(/\s/g, '') + '">' + esc(SITE.contact_phone_cn) + '</a></li>' +
      '<li><a href="tel:' + (SITE.contact_phone_ru || '').replace(/\s/g, '') + '">' + esc(SITE.contact_phone_ru) + '</a></li>' +
      '<li><a href="mailto:' + esc(SITE.contact_email_1) + '">' + esc(SITE.contact_email_1) + '</a></li>';

    renderProducts();
    renderStories();
    renderMachinery();
  }

  /* ============================================================
     产品（后台增删改查）+ 一二级分类
     ============================================================ */
  function subCats(parent) {
    return (PROD.subcategories || []).filter(function (x) { return x.parent === parent; });
  }
  function subLabel(key, L) {
    var c = (PROD.subcategories || []).filter(function (x) { return x.key === key; })[0];
    return c ? t(c.label, L) : key;
  }

  function renderProducts() {
    if (!PROD) return;
    var L = cur;
    var cats = PROD.categories || [];
    var items = (PROD.products || []).filter(function (p) { return p.published !== false; });

    /* 下拉里的茶叶子项，与页面二级目录用同一套可见性规则：
       该子类暂无上架商品就自动隐藏，后台加商品后自己出现。 */
    $$('.navdrop .nd-tea .nd-subs a[data-sub]').forEach(function (a) {
      var k = a.getAttribute('data-sub');
      var n = items.filter(function (p) {
        return p.category === 'tea' && p.subcategory === k;
      }).length;
      a.style.display = n ? '' : 'none';
    });

    // 一级：品类
    var used = {};
    items.forEach(function (p) { used[p.category] = (used[p.category] || 0) + 1; });
    var html = '<button type="button" class="catbtn' + (filterCat === 'all' ? ' on' : '') +
               '" data-cat="all">' + (L === 'ru' ? 'Все' : L === 'en' ? 'All' : '全部') + '</button>';
    cats.forEach(function (c) {
      var n = used[c.key] || 0;
      html += '<button type="button" class="catbtn' + (filterCat === c.key ? ' on' : '') +
              '" data-cat="' + esc(c.key) + '">' + esc(t(c.label, L)) +
              (n ? ' <span class="cnt">' + n + '</span>' : '') + '</button>';
    });
    $('#catFilter').innerHTML = html;
    $$('#catFilter .catbtn').forEach(function (b) {
      b.onclick = function () {
        filterCat = b.getAttribute('data-cat');
        filterSub = 'all';          // 换一级分类时，二级重置
        renderProducts();
      };
    });

    // 二级：子目录。只在选中具体品类时出现（"全部"时不显示，避免和一级重复）
    var subEl = $('#subFilter');
    if (!subEl) return;
    if (filterCat === 'all') { subEl.innerHTML = ''; subEl.style.display = 'none'; }
    else {
      var subs = subCats(filterCat);
      var pool = items.filter(function (p) { return p.category === filterCat; });
      if (subs.length && pool.length) {
        var cnt = {};
        pool.forEach(function (p) { cnt[p.subcategory || '_'] = (cnt[p.subcategory || '_'] || 0) + 1; });
        var sh = '<button type="button" class="subbtn' + (filterSub === 'all' ? ' on' : '') +
                 '" data-sub="all">' + esc(I18N[L].prod.subAll) +
                 ' <span class="cnt">' + pool.length + '</span></button>';
        subs.forEach(function (sc) {
          var n = cnt[sc.key] || 0;
          if (!n) return;          // 该子类暂无商品则隐藏，加商品后自动出现
          sh += '<button type="button" class="subbtn' + (filterSub === sc.key ? ' on' : '') +
                '" data-sub="' + esc(sc.key) + '">' + esc(t(sc.label, L)) +
                ' <span class="cnt">' + n + '</span></button>';
        });
        subEl.innerHTML = sh;
        subEl.style.display = 'flex';
        $$('#subFilter .subbtn').forEach(function (b) {
          b.onclick = function () { filterSub = b.getAttribute('data-sub'); renderProducts(); };
        });
      } else { subEl.innerHTML = ''; subEl.style.display = 'none'; }
    }

    var list = items.filter(function (p) {
      if (filterCat !== 'all' && p.category !== filterCat) return false;
      if (filterCat !== 'all' && filterSub !== 'all' && p.subcategory !== filterSub) return false;
      return true;
    });
    list.sort(function (a, b) { return (a.order || 99) - (b.order || 99); });

    $('#prodGrid').innerHTML = list.map(function (p) {
      var specs = (p.specs || []).map(function (s) {
        return '<li><b>' + esc(t(s.k, L)) + '</b><span>' + esc(t(s.v, L)) + '</span></li>';
      }).join('');
      return '' +
        '<article class="pcard">' +
          '<div class="pcard-img"><img src="' + esc(p.image || PH) + '" alt="' + esc(t(p.name, L)) + '" loading="lazy" onerror="this.src=\'' + PH + '\'"></div>' +
          '<div class="pcard-body">' +
            '<span class="pcard-cat">' + esc(catLabel(p.category, L)) + '</span>' +
            '<h3>' + esc(t(p.name, L)) + '</h3>' +
            '<span class="pcard-sub">' + esc(t(p.subtitle, L)) + '</span>' +
            '<p>' + esc(t(p.desc, L)) + '</p>' +
            (specs ? '<ul class="spec-list">' + specs + '</ul>' : '') +
            '<a class="btn outline sm" href="#contact" data-enq="' + esc(t(p.name, L)) + '">' +
              (L === 'ru' ? 'Запросить цену' : L === 'en' ? 'Get a quote' : '获取报价') + '</a>' +
          '</div>' +
        '</article>';
    }).join('');

    var empty = $('#prodEmpty');
    if (!list.length) { empty.style.display = 'block'; empty.textContent = t(PROD.emptyText, L) || ''; }
    else { empty.style.display = 'none'; }

    // 点“获取报价”把产品名带进留言框
    $$('#prodGrid [data-enq]').forEach(function (a) {
      a.onclick = function () {
        var ta = document.querySelector('#contactForm [name=msg]');
        var nm = a.getAttribute('data-enq');
        var pre = (L === 'ru' ? 'Интересуют: ' : L === 'en' ? 'Interested in: ' : '我想了解：') + nm;
        if (ta && ta.value.indexOf(pre) === -1) ta.value = pre + (ta.value ? '\n' + ta.value : '');
      };
    });
  }

  /* ============================================================
     产品故事：每张卡片一段来历，可展开全文
     参考做法：TWG / Fortnum & Mason / Tao of Tea 都用「编辑式长文 + 年代标签」
     而不是参数罗列——故事负责建立信任，参数负责成交，两者分开。
     ============================================================ */
  var storyOpen = {};

  function renderStories() {
    var el = $('#storyList');
    if (!el || !PROD) return;
    var L = cur, D = I18N[L].story;
    var items = (PROD.products || []).filter(function (p) {
      return p.published !== false && p.story && t(p.story.title, L);
    });
    items.sort(function (a, b) { return (a.order || 99) - (b.order || 99); });

    var emp = $('#storyEmpty');
    if (!items.length) {
      el.innerHTML = '';
      if (emp) { emp.style.display = 'block'; emp.textContent = D.empty || ''; }
      return;
    }
    if (emp) emp.style.display = 'none';

    el.innerHTML = items.map(function (p) {
      var st = p.story;
      var open = !!storyOpen[p.id];
      var tags = (st.tags && st.tags[L] || []).map(function (x) {
        return '<span class="stag">' + esc(x) + '</span>';
      }).join('');
      // 正文按空行分段
      var paras = (t(st.body, L) || '').split(/\n\s*\n/).map(function (x) {
        return '<p>' + esc(x.trim()) + '</p>';
      }).join('');

      return '' +
        '<article class="scard' + (open ? ' open' : '') + '" data-sid="' + esc(p.id) + '">' +
          '<div class="scard-top">' +
            '<div class="scard-img"><img src="' + esc(p.image || PH) + '" alt="' + esc(t(p.name, L)) + '" loading="lazy" onerror="this.src=\'' + PH + '\'"></div>' +
            '<div class="scard-head">' +
              '<span class="sera">' + esc(t(st.era, L)) + '</span>' +
              '<h3>' + esc(t(p.name, L)) + '</h3>' +
              '<div class="stitle">' + esc(t(st.title, L)) + '</div>' +
              (tags ? '<div class="stags">' + tags + '</div>' : '') +
            '</div>' +
          '</div>' +
          '<div class="sbody">' + paras + '</div>' +
          '<button type="button" class="stoggle" data-toggle="' + esc(p.id) + '">' +
            (open ? D.readLess : D.readMore) + '</button>' +
        '</article>';
    }).join('');

    $$('#storyList .stoggle').forEach(function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-toggle');
        storyOpen[id] = !storyOpen[id];
        renderStories();
      };
    });
  }

  /* ============================================================
     流体设备 · 独立业务线
     独立数据、独立筛选、独立视觉；与茶叶产品中心互不相干。
     信息按三种阅读习惯分层：
       ① 卡片正面工程参数 → 俄 / 国际工程采购
       ② 折叠区型号谱系   → 中国采购
       ③ 资质归属与文件   → 合规 / 尽调
     ============================================================ */
  function renderMachinery() {
    if (!MACH) return;
    var L = cur, D = I18N[L].mach, M = MACH;

    function put(id, txt) { var e = $(id); if (e) e.textContent = txt || ''; }

    /* Hero + 供货方归属声明 */
    put('#mEyebrow', t(M.hero && M.hero.eyebrow, L));
    put('#mTitle',   t(M.hero && M.hero.title, L));
    put('#mLead',    t(M.hero && M.hero.lead, L));
    put('#mCta',     t(M.hero && M.hero.cta, L));
    put('#mSupplierName', t(M.supplier && M.supplier.name, L));
    put('#mSupplierRole', t(M.supplier && M.supplier.role, L));
    put('#mNote', t(M.supplier && M.supplier.note, L));

    /* 三种阅读路径 */
    var lanes = $('#mLanes');
    if (lanes) {
      lanes.innerHTML =
        '<div class="m-lane-tag">' + esc(D.laneTag) + '</div>' +
        '<div class="m-lane-grid">' +
          '<div class="m-lane"><div class="m-lane-in"><b>01</b><h4>' + esc(D.lane1) + '</h4><p>' + esc(D.lane1d) + '</p></div></div>' +
          '<div class="m-lane"><div class="m-lane-in"><b>02</b><h4>' + esc(D.lane2) + '</h4><p>' + esc(D.lane2d) + '</p></div></div>' +
          '<div class="m-lane"><div class="m-lane-in"><b>03</b><h4>' + esc(D.lane3) + '</h4><p>' + esc(D.lane3d) + '</p></div></div>' +
        '</div>';
    }

    /* 分组 tabs */
    var groups = M.groups || [];
    var series = (M.series || []).filter(function (x) { return x.published !== false; });
    var cnt = {};
    series.forEach(function (x) { cnt[x.group] = (cnt[x.group] || 0) + 1; });
    var th = '<button type="button" class="m-tab' + (mFilter === 'all' ? ' on' : '') +
             '" data-mg="all">' + esc(D.allTab) + ' <span class="cnt">' + series.length + '</span></button>';
    groups.forEach(function (g) {
      var n = cnt[g.key] || 0;
      if (!n) return;
      th += '<button type="button" class="m-tab' + (mFilter === g.key ? ' on' : '') +
            '" data-mg="' + esc(g.key) + '">' + esc(t(g.label, L)) +
            ' <span class="cnt">' + n + '</span></button>';
    });
    var tabs = $('#mTabs');
    if (tabs) {
      tabs.innerHTML = th;
      $$('#mTabs .m-tab').forEach(function (b) {
        b.onclick = function () { mFilter = b.getAttribute('data-mg'); renderMachinery(); };
      });
    }

    /* 产品系列卡片 */
    var list = series.filter(function (x) { return mFilter === 'all' || x.group === mFilter; });
    list.sort(function (a, b) { return (a.order || 99) - (b.order || 99); });
    var grid = $('#mGrid');
    if (grid) {
      grid.innerHTML = list.map(function (x) {
        var open = !!machOpen[x.id];
        var specs = (x.specs || []).map(function (r) {
          return '<tr><th>' + esc(t(r.k, L)) + '</th><td>' + esc(t(r.v, L)) + '</td></tr>';
        }).join('');
        return '' +
          '<article class="m-card' + (open ? ' open' : '') + '" data-mid="' + esc(x.id) + '">' +
            '<div class="m-card-in">' +
            (x.image ? '<div class="m-card-img"><img src="' + esc(x.image) + '" alt="' + esc(t(x.name, L)) + '" loading="lazy"></div>' : '') +
            '<div class="m-card-top">' +
              '<span class="m-code">' + esc(x.code || '') + '</span>' +
              '<h4>' + esc(t(x.name, L)) + '</h4>' +
              '<p class="m-card-sub">' + esc(t(x.subtitle, L)) + '</p>' +
            '</div>' +
            '<div class="m-card-body">' +
              '<p class="m-desc">' + esc(t(x.desc, L)) + '</p>' +
              (specs ? '<table class="m-spec"><tbody>' + specs + '</tbody></table>' : '') +
              '<div class="m-apps-line"><b>' + esc(D.appsCardLabel) + '</b><span>' + esc(t(x.apps, L)) + '</span></div>' +
              '<div class="m-models' + (open ? ' open' : '') + '" data-models="' + esc(x.id) + '">' +
                '<div class="m-models-h">' + esc(D.modelsLabel) + '</div>' +
                '<p>' + esc(t(x.models, L)) + '</p>' +
              '</div>' +
              '<div class="m-card-foot">' +
                '<button type="button" class="m-expand" data-mexp="' + esc(x.id) + '">' +
                  esc(open ? D.modelsHide : D.modelsHint) + '</button>' +
                '<a class="m-quote" href="#contact" data-menq="' + esc(t(x.name, L)) + '">' +
                  esc(D.quoteBtn) + ' →</a>' +
              '</div>' +
            '</div>' +
            '</div>' +
          '</article>';
      }).join('');

      $$('#mGrid .m-expand').forEach(function (b) {
        b.onclick = function () {
          var id = b.getAttribute('data-mexp');
          machOpen[id] = !machOpen[id];
          renderMachinery();
        };
      });
      $$('#mGrid [data-menq]').forEach(function (a) {
        a.onclick = function () {
          var ta = document.querySelector('#contactForm [name=msg]');
          var nm = a.getAttribute('data-menq');
          var pre = (L === 'ru' ? 'Оборудование / Интересуют: '
                     : L === 'en' ? 'Fluid equipment — interested in: '
                     : '流体设备咨询：') + nm;
          if (ta && ta.value.indexOf(pre) === -1) ta.value = pre + (ta.value ? '\n' + ta.value : '');
        };
      });
    }

    /* 应用领域 */
    var apps = $('#mApps');
    if (apps) {
      apps.innerHTML = (M.applications || []).map(function (a, i) {
        return '<div class="m-app"><div class="m-app-in"><span class="m-app-n">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span>' +
               '<h5>' + esc(t(a.title, L)) + '</h5><p>' + esc(t(a.text, L)) + '</p></div></div>';
      }).join('');
    }

    /* 资质 */
    var certs = $('#mCerts');
    if (certs) {
      var TYPE = {
        system: { zh:'体系认证', en:'Management system', ru:'Система менеджмента' },
        product:{ zh:'产品许可', en:'Product approval', ru:'Разрешение на продукцию' },
        test:   { zh:'型式试验', en:'Type test',        ru:'Типовые испытания' }
      };
      certs.innerHTML = (M.certs || []).map(function (c) {
        var ty = TYPE[c.type] ? t(TYPE[c.type], L) : c.type;
        return '<div class="m-cert"><div class="m-cert-in"><span class="m-cert-type">' + esc(ty) + '</span>' +
               '<h5>' + esc(t(c.name, L)) + '</h5>' +
               '<dl><dt>' + esc(D.holderLabel) + '</dt><dd>' + esc(t(c.holder, L)) + '</dd>' +
               '<dt>' + esc(D.issuerLabel) + '</dt><dd>' + esc(t(c.issuer, L)) + '</dd></dl></div></div>';
      }).join('');
    }

    /* 出口合规 */
    var comp = $('#mCompliance');
    if (comp && M.compliance) {
      comp.innerHTML = '<h4>' + esc(D.complianceTitle) + '</h4><ul>' +
        (M.compliance.items || []).map(function (x) { return '<li>' + esc(t(x, L)) + '</li>'; }).join('') +
        '</ul>';
    }

    /* RFQ 工况清单 */
    var rfq = $('#mRfq'), R = M.rfq;
    if (rfq && R) {
      rfq.innerHTML =
        '<div class="m-rfq-head"><div><p class="m-kicker">' + esc(D.docsLabel) + '</p>' +
        '<h3>' + esc(t(R.title, L)) + '</h3><p>' + esc(t(R.lead, L)) + '</p></div>' +
        '<a class="m-btn sm" href="#contact">' + esc(D.rfqBtn) + '</a></div>' +
        '<div class="m-rfq-grid">' +
        (R.items || []).map(function (r) {
          return '<div class="m-rfq-row"><div class="m-rfq-row-in"><b>' + esc(t(r.k, L)) + '</b><span>' + esc(t(r.v, L)) + '</span></div></div>';
        }).join('') +
        '</div><p class="m-rfq-note">' + esc(t(R.note, L)) + '</p>';
    }
  }

  function catLabel(key, L) {
    var c = (PROD && PROD.categories || []).filter(function (x) { return x.key === key; })[0];
    return c ? t(c.label, L) : key;
  }

  /* ============================================================
     导航 / 交互
     ============================================================ */
  /* 产品中心下拉直达：设置筛选状态后刷新产品网格。
     filterCat / filterSub 与 renderProducts 共用，所以点子项和点页面上的
     筛选按钮效果完全一致，不会出现两套状态。 */
  function applyNavFilter(cat, sub) {
    filterCat = cat || 'all';
    filterSub = sub || 'all';
    renderProducts();
  }

  function initNav() {
    var bar = $('#topbar'), links = $('#navlinks'), tg = $('#navtoggle');
    var item = $('#navProducts');
    var root = item ? $('.nav-root', item) : null;
    var tgl = item ? $('.navdrop-toggle', item) : null;
    var prog = $('#scrollProgress');

    tg.onclick = function () { links.classList.toggle('open'); };

    /* 用向上遍历代替 closest()，兼容旧内核；点击 .nd-lead 里的 <b>/<small> 也能命中 */
    links.addEventListener('click', function (e) {
      var node = e.target;
      while (node && node !== links && node.tagName !== 'A') node = node.parentNode;
      if (node && node.tagName === 'A') {
        links.classList.remove('open');
        if (item) item.classList.remove('drop-open');
        if (tgl) tgl.setAttribute('aria-expanded', 'false');
        if (root) root.setAttribute('aria-expanded', 'false');
      }
    });

    /* 移动端：点箭头展开。桌面由 CSS :hover / :focus-within 负责 */
    if (tgl) {
      tgl.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var open = !item.classList.contains('drop-open');
        item.classList.toggle('drop-open', open);
        tgl.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (root) root.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    if (item) {
      item.addEventListener('mouseenter', function () { if (root) root.setAttribute('aria-expanded', 'true'); });
      item.addEventListener('mouseleave', function () { if (root) root.setAttribute('aria-expanded', 'false'); });
      item.addEventListener('focusin',  function () { if (root) root.setAttribute('aria-expanded', 'true'); });
      item.addEventListener('focusout', function (e) {
        if (!item.contains(e.relatedTarget) && root) root.setAttribute('aria-expanded', 'false');
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
          item.classList.remove('drop-open');
          if (tgl) tgl.setAttribute('aria-expanded', 'false');
          if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        }
      });
      document.addEventListener('click', function (e) {
        if (!item.contains(e.target)) {
          item.classList.remove('drop-open');
          if (tgl) tgl.setAttribute('aria-expanded', 'false');
        }
      });
    }

    /* 茶叶子项 → 直接切到对应一级 / 二级分类 */
    $$('.navdrop a[data-cat]').forEach(function (a) {
      a.addEventListener('click', function () {
        applyNavFilter(a.getAttribute('data-cat'), a.getAttribute('data-sub') || 'all');
      });
    });

    var onScroll = function () {
      bar.classList.toggle('scrolled', window.scrollY > 30);
      if (prog) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var pct = h > 0 ? Math.min(100, Math.max(0, window.scrollY / h * 100)) : 0;
        prog.style.width = pct.toFixed(2) + '%';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  function initReveal() {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    $$('section').forEach(function (s, i) {
      s.classList.add('reveal');
      s.style.transitionDelay = ((i % 3) * 60) + 'ms';
      io.observe(s);
    });
  }

  function initWechat() {
    var el = $('#wxCopy');
    if (!el) return;
    el.onclick = function () {
      var txt = el.textContent.trim();
      var done = function () {
        var old = el.textContent;
        el.textContent = I18N[cur].msg.copied;
        el.classList.add('copied');
        setTimeout(function () { el.textContent = old; el.classList.remove('copied'); }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done, fb);
      } else { fb(); }
      function fb() {
        var ta = document.createElement('textarea');
        ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    };
  }

  /* ============================================================
     表单 → Cloudflare Worker → Telegram + 邮件
     ============================================================ */
  /* 接口地址常量。
     俄区（Beget / Timeweb，数据落在俄境内）优先，失败自动回退 Cloudflare。 */
  var ENDPOINTS = [
    'https://здесь-ваш-домен.ru/form.php',   // ← 换成你的俄区接口地址
    'https://gonghehou-form.tunnir243.workers.dev'
  ];

  function initForm() {
    var form = $('#contactForm'), msgEl = $('#formmsg');
    if (!form) return;
    var box = $('#consentBox'), boxWrap = form.querySelector('.consent');
    /* 勾选后去掉警示态（实时反馈，但不同步触发提交） */
    if (box) box.addEventListener('change', function () {
      if (box.checked && boxWrap) boxWrap.classList.remove('warn');
    });

    var fbk = $('#fbk');
    /* 兜底卡显示时，把访客已填的内容塞进 mailto，
       即使后端完全不可用，点一下也能把完整询盘发出来。 */
    function fillMailFallback(p) {
      var a = document.getElementById('mailFallback');
      if (!a) return;
      var lines = [];
      if (p.name)    lines.push('姓名 / Name: ' + p.name);
      if (p.contact) lines.push('联系方式 / Contact: ' + p.contact);
      if (p.company) lines.push('公司 / Company: ' + p.company);
      if (p.country) lines.push('国家 / Country: ' + p.country);
      if (p.qty)     lines.push('数量 / Qty: ' + p.qty);
      if (p.type)    lines.push('类型 / Type: ' + p.type);
      if (p.msg)     lines.push('需求 / Message: ' + p.msg);
      lines.push('来源 / Source: ' + (p.page || location.href));
      var subj = '询盘 / Enquiry' + (p.name ? ' - ' + p.name : '');
      a.href = 'mailto:fanwh188@gmail.com?subject=' + encodeURIComponent(subj)
             + '&body=' + encodeURIComponent(lines.join('\n'));
      a.style.display = '';
    }
    function showFbk(p) {
      if (!fbk) return;
      if (p) fillMailFallback(p);
      fbk.hidden = false;
      fbk.scrollIntoView({ behavior:'smooth', block:'center' });
    }
    function hideFbk() { if (fbk) fbk.hidden = true; }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideFbk();
      var ma0 = document.getElementById('mailFallback'); if (ma0) ma0.style.display = 'none';
      var M = I18N[cur].msg;
      var name = (form.name.value || '').trim();
      var contact = (form.contact.value || '').trim();
      if (!name || !contact) {
        msgEl.className = 'formmsg bad'; msgEl.textContent = M.errFill; return;
      }
      /* 152-ФЗ：同意是独立动作，未勾选则拒绝提交 */
      if (box && !box.checked) {
        if (boxWrap) boxWrap.classList.add('warn');
        msgEl.className = 'formmsg bad'; msgEl.textContent = M.errConsent;
        box.focus();
        return;
      }
      var payload = {
        name: name, contact: contact,
        company: (form.company.value || '').trim(),
        country: (form.country.value || '').trim(),
        qty: form.qty.value, type: form.type.value,
        msg: (form.msg.value || '').trim(),
        lang: cur,
        consent: 1, consent_at: new Date().toISOString(),
        page: location.href
      };
      msgEl.className = 'formmsg'; msgEl.textContent = M.send;
      var list = ENDPOINTS.filter(function (u) { return u && u.indexOf('здесь') === -1; });
      /* 极老浏览器没有 fetch，直接引导到兜底联系卡，不让它白等 */
      if (typeof fetch !== 'function') {
        msgEl.className = 'formmsg bad'; msgEl.textContent = M.errNetwork;
        showFbk(payload); return;
      }
      if (!list.length) {
        setTimeout(function () { msgEl.className = 'formmsg ok'; msgEl.textContent = M.ok; form.reset(); }, 600);
        return;
      }
      /* 依次尝试：俄区优先，失败自动回退，客户永远能提交成功 */
      (function attempt(i) {
        if (i >= list.length) {
          msgEl.className = 'formmsg bad'; msgEl.textContent = M.errNetwork;
          showFbk(payload); return;
        }
        fetch(list[i], {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(function (r) { return r.json(); })
          .then(function (j) {
            if (j && j.ok) { msgEl.className = 'formmsg ok'; msgEl.textContent = M.ok; form.reset(); if (boxWrap) boxWrap.classList.remove('warn'); hideFbk(); var ma=document.getElementById('mailFallback'); if(ma) ma.style.display='none'; }
            else attempt(i + 1);
          })
          .catch(function () { attempt(i + 1); });
      })(0);
    });
  }

  /* ============================================================
     启动
     ============================================================ */
  function loadJSON(url) {
    /* 单文件版：数据已内联，直接用，避免 file:// 下 fetch 被浏览器拦截 */
    if (url.indexOf('site.json') > -1 && window.__ZSY_SITE__) return Promise.resolve(window.__ZSY_SITE__);
    if (url.indexOf('products.json') > -1 && window.__ZSY_PROD__) return Promise.resolve(window.__ZSY_PROD__);
    if (url.indexOf('machinery.json') > -1 && window.__ZSY_MACH__) return Promise.resolve(window.__ZSY_MACH__);
    return fetch(url, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error(url + ' ' + r.status);
      return r.json();
    });
  }

  /* ============================================================
     对外钩子：供管理后台在 iframe 里实时刷新预览
     用法：iframe.contentWindow.ZSY.setData(siteObj, prodObj, 'zh')
     ============================================================ */
  window.ZSY = {
    setData: function (site, prod, lang, mach) {
      if (site) SITE = site;
      if (prod) PROD = prod;
      if (mach) MACH = mach;
      if (lang && LANGS.indexOf(lang) > -1) cur = lang;
      setLang(cur, true);
    },
    setMach: function (m) { if (m) { MACH = m; renderMachinery(); } },
    getLang: function () { return cur; }
  };

  function boot() {
    setLang(detect(), true);
    initNav(); initWechat(); initForm();

    Promise.all([
      loadJSON('data/site.json').catch(function (e) { console.warn(e); return null; }),
      loadJSON('data/products.json').catch(function (e) { console.warn(e); return null; }),
      loadJSON('data/machinery.json').catch(function (e) { console.warn(e); return null; })
    ]).then(function (res) {
      SITE = res[0] || {};
      PROD = res[1] || { categories: [], products: [] };
      MACH = res[2] || null;
      setLang(cur, true);
      initReveal();
    });

    $$('#langswitch button').forEach(function (b) {
      b.onclick = function () { setLang(b.getAttribute('data-lang')); };
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
