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
  var PORC = null;   // data/porcelain.json —— 景德镇瓷器，第三条独立业务线
  var mFilter = 'all'; var machOpen = {};
  var pGroup = 'all'; var pCraft = 'all'; var pOpen = {};
  var filterCat = 'all';
  var filterSub = 'all';

  /* V34_PH 内联占位图：纯图形、无英文，中俄界面一致；仅作缺图兜底 */
  var PH = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450">' +
    '<rect width="600" height="450" fill="#eef1f5"/>' +
    '<circle cx="300" cy="176" r="42" fill="#cfd8e2"/>' +
    '<path d="M110 350 L235 228 L318 300 L398 212 L490 350 Z" fill="#c3cedb"/></svg>');

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
    if (typeof v3RefreshUI === 'function') v3RefreshUI();
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

    var navKeys = ['about','products','heritage','porcelain','industrial','capability','why','terms','faq','contact'];
    $('#footerLinks').innerHTML = navKeys.map(function (k) {
      return '<li><a href="#' + k + '">' + esc(I18N[L].nav[k]) + '</a></li>';
    }).join('');
    $('#footContact').innerHTML =
      '<li><a href="tel:' + (SITE.contact_phone_cn || '').replace(/\s/g, '') + '">' + esc(SITE.contact_phone_cn) + '</a></li>' +
      '<li><a href="tel:' + (SITE.contact_phone_ru || '').replace(/\s/g, '') + '">' + esc(SITE.contact_phone_ru) + '</a></li>' +
      '<li><a href="mailto:' + esc(SITE.contact_email_1) + '">' + esc(SITE.contact_email_1) + '</a></li>';

    renderProducts();
    renderPorcelain();
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
               '" data-cat="all">' + esc(I18N[L].prod.subAll) + '</button>';
    // 选中的一级若已无上架商品，自动回到「全部」，避免出现空白页
    if (filterCat !== 'all' && !used[filterCat]) filterCat = 'all';
    cats.forEach(function (c) {
      var n = used[c.key] || 0;
      // 跨板块入口：泵与给水设备有独立业务线与独立数据文件，不做成本板块的空筛选
      if (c.link) {
        html += '<a class="catbtn catbtn-jump" href="' + esc(c.link) + '">' +
                esc(t(c.label, L)) + ' <span class="jmp">\u2197</span></a>';
        return;
      }
      if (!n) return;   // 暂无上架商品的品类自动隐藏，后台加商品后自己出现
      html += '<button type="button" class="catbtn' + (filterCat === c.key ? ' on' : '') +
              '" data-cat="' + esc(c.key) + '">' + esc(t(c.label, L)) +
              ' <span class="cnt">' + n + '</span></button>';
    });
    $('#catFilter').innerHTML = html;
    $$('#catFilter button.catbtn').forEach(function (b) {
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
            '<button type="button" class="btn outline sm" data-rfq="tea" data-rfq-id="' + esc(p.id) + '">' +
              esc(I18N[L].rfq.quoteBtn) + '</button>' +
          '</div>' +
        '</article>';
    }).join('');

    var empty = $('#prodEmpty');
    if (!list.length) { empty.style.display = 'block'; empty.textContent = t(PROD.emptyText, L) || ''; }
    else { empty.style.display = 'none'; }

    /* 卡片询价统一由 V3 的 document 事件委托触发全局唯一抽屉，
       不在当前页下拉弹出简易表单，也不再往留言框塞预填文本。 */
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
     景德镇瓷器 · 第三条独立业务线
     独立数据 data/porcelain.json，与茶叶 products.json、机电 machinery.json
     互不相干。目录为两级：一级按用途（器型），二级按工艺（釉色 / 技法）。
     所有展示文字三语；历史与工艺说明来自公开权威资料，图册只作品类与规格来源。
     ============================================================ */
  function renderPorcelain() {
    if (!PORC) return;
    var L = cur, D = I18N[L].porc, P = PORC;
    function put(id, txt) { var e = $(id); if (e) e.textContent = txt || ''; }

    /* Hero + 归属声明 */
    put('#pEyebrow', t(P.hero && P.hero.eyebrow, L));
    put('#pTitle',   t(P.hero && P.hero.title, L));
    put('#pLead',    t(P.hero && P.hero.lead, L));
    put('#pCta',     t(P.hero && P.hero.cta, L));
    put('#pSupplierName', t(P.supplier && P.supplier.name, L));
    put('#pSupplierRole', t(P.supplier && P.supplier.role, L));
    var hero = $('#pHero');
    if (hero) {
      hero.style.backgroundImage =
        'linear-gradient(100deg, rgba(11,28,39,.94) 0%, rgba(11,28,39,.84) 46%, rgba(11,28,39,.36) 100%),' +
        'url("assets/img/porcelain-dinner-bluewhite.jpg")';
    }

    /* 三种阅读路径 */
    var lanes = $('#pLanes');
    if (lanes) {
      lanes.innerHTML =
        '<div class="p-lane-tag">' + esc(D.laneTag) + '</div>' +
        '<div class="p-lane-grid">' +
          '<div class="p-lane"><div class="p-lane-in"><b>01</b><h4>' + esc(D.lane1) + '</h4><p>' + esc(D.lane1d) + '</p></div></div>' +
          '<div class="p-lane"><div class="p-lane-in"><b>02</b><h4>' + esc(D.lane2) + '</h4><p>' + esc(D.lane2d) + '</p></div></div>' +
          '<div class="p-lane"><div class="p-lane-in"><b>03</b><h4>' + esc(D.lane3) + '</h4><p>' + esc(D.lane3d) + '</p></div></div>' +
        '</div>';
    }

    /* 产地图文 */
    var city = $('#pCityText');
    if (city) {
      city.innerHTML = '<h4>' + esc(D.cityTitle) + '</h4><p>' + esc(D.cityText) + '</p>';
    }

    /* 历史时间轴：每条都带年代、正文与资料来源 */
    var tl = $('#pTimeline');
    if (tl) {
      tl.innerHTML = (P.history || []).map(function (h, i) {
        return '<div class="p-tl-row">' +
          '<div class="p-tl-year">' + esc(h.year || '') + '</div>' +
          '<div class="p-tl-dot"></div>' +
          '<div class="p-tl-card">' +
            '<p class="p-tl-era">' + esc(t(h.era, L)) + '</p>' +
            '<h4>' + esc(t(h.title, L)) + '</h4>' +
            '<p class="p-tl-text">' + esc(t(h.text, L)) + '</p>' +
            '<p class="p-tl-src"><b>' + esc(D.srcLabel) + '</b> · ' + esc(t(h.src, L)) + '</p>' +
          '</div></div>';
      }).join('');
    }
    put('#pSourceNote', t(P.sourceNote, L));

    /* 工艺谱系：色块是釉色示意，不是产品照片 */
    var cg = $('#pCraftGrid');
    if (cg) {
      cg.innerHTML = (P.crafts || []).map(function (c) {
        return '<div class="p-craft">' +
          '<div class="p-craft-in">' +
            '<div class="p-swatch" style="background:' + esc(c.swatch || '#dfe9e4') + '"></div>' +
            '<div class="p-craft-body">' +
              '<span class="p-craft-tag">' + esc(t(c.tag, L)) + '</span>' +
              '<h4>' + esc(t(c.name, L)) + '</h4>' +
              '<p>' + esc(t(c.text, L)) + '</p>' +
            '</div></div></div>';
      }).join('');
    }

    /* 目录：一级用途 + 二级工艺 */
    var items = (P.items || []).filter(function (x) { return x.published !== false; });
    var groups = P.groups || [], crafts = P.crafts || [];
    var gc = {}, cc = {};
    items.forEach(function (x) { gc[x.group] = (gc[x.group] || 0) + 1; cc[x.craft] = (cc[x.craft] || 0) + 1; });

    var gt = $('#pGroupTabs');
    if (gt) {
      var gh = '<button type="button" class="p-tab' + (pGroup === 'all' ? ' on' : '') +
               '" data-pg2="all">' + esc(D.allGroup) + ' <span class="cnt">' + items.length + '</span></button>';
      groups.forEach(function (g) {
        var n = gc[g.key] || 0; if (!n) return;
        gh += '<button type="button" class="p-tab' + (pGroup === g.key ? ' on' : '') +
              '" data-pg2="' + esc(g.key) + '">' + esc(t(g.label, L)) +
              ' <span class="cnt">' + n + '</span></button>';
      });
      gt.innerHTML = gh;
      $$('#pGroupTabs .p-tab').forEach(function (b) {
        b.onclick = function () { pGroup = b.getAttribute('data-pg2'); pCraft = 'all'; renderPorcelain(); };
      });
    }

    var ct = $('#pCraftTabs');
    if (ct) {
      var pool = items.filter(function (x) { return pGroup === 'all' || x.group === pGroup; });
      var pc = {};
      pool.forEach(function (x) { pc[x.craft] = (pc[x.craft] || 0) + 1; });
      var ch = '<button type="button" class="p-subtab' + (pCraft === 'all' ? ' on' : '') +
               '" data-pc2="all">' + esc(D.allCraft) + ' <span class="cnt">' + pool.length + '</span></button>';
      crafts.forEach(function (c) {
        var n = pc[c.key] || 0; if (!n) return;
        ch += '<button type="button" class="p-subtab' + (pCraft === c.key ? ' on' : '') +
              '" data-pc2="' + esc(c.key) + '">' + esc(t(c.name, L)) +
              ' <span class="cnt">' + n + '</span></button>';
      });
      ct.innerHTML = ch;
      $$('#pCraftTabs .p-subtab').forEach(function (b) {
        b.onclick = function () { pCraft = b.getAttribute('data-pc2'); renderPorcelain(); };
      });
    }

    var list = items.filter(function (x) {
      return (pGroup === 'all' || x.group === pGroup) && (pCraft === 'all' || x.craft === pCraft);
    });
    list.sort(function (a, b) { return (a.order || 99) - (b.order || 99); });
    var grid = $('#pGrid'), emp = $('#pEmpty');
    if (emp) emp.style.display = list.length ? 'none' : 'block';
    if (emp && !list.length) emp.textContent = D.empty;
    if (grid) {
      grid.innerHTML = list.map(function (x) {
        var open = !!pOpen[x.id];
        var specs = (x.specs || []).map(function (r) {
          return '<tr><th>' + esc(t(r.k, L)) + '</th><td>' + esc(t(r.v, L)) + '</td></tr>';
        }).join('');
        var detail = t(x.detail, L) || '';
        return '' +
          '<article class="p-card" data-pid="' + esc(x.id) + '">' +
            '<div class="p-card-in">' +
              (x.image ? '<div class="p-card-img"><img src="' + esc(x.image) + '" alt="' +
                esc(t(x.name, L)) + '" loading="lazy" onerror="this.src=\'' + PH + '\'">' +
                '<span class="p-fig-tag">' + esc(D.figureTag) + '</span></div>' : '') +
              '<div class="p-card-top">' +
                '<span class="p-code">' + esc(x.code || '') + '</span>' +
                '<h4>' + esc(t(x.name, L)) + '</h4>' +
                '<p class="p-card-sub">' + esc(t(x.subtitle, L)) + '</p>' +
              '</div>' +
              '<div class="p-card-body">' +
                '<p class="p-desc">' + esc(t(x.desc, L)) + '</p>' +
                (specs ? '<table class="p-spec"><tbody>' + specs + '</tbody></table>' : '') +
                (detail ? '<div class="p-detail' + (open ? ' open' : '') + '"><p>' + esc(detail) + '</p></div>' : '') +
                '<div class="p-card-foot">' +
                  (detail ? '<button type="button" class="p-expand" data-pexp="' + esc(x.id) + '">' +
                    esc(open ? D.detailHide : D.detailLabel) + '</button>' : '<span></span>') +
                  '<button type="button" class="p-quote" data-rfq="porcelain" data-rfq-id="' + esc(x.id) + '">' +
                    esc(I18N[L].rfq.quoteBtn) + ' →</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</article>';
      }).join('');

      $$('#pGrid .p-expand').forEach(function (b) {
        b.onclick = function () {
          var id = b.getAttribute('data-pexp');
          pOpen[id] = !pOpen[id];
          renderPorcelain();
        };
      });
      /* 瓷器卡片询价 → V3 全局抽屉 */
    }
    put('#pFigureNote', t(P.figureNote, L));

    /* 出口与合规 */
    var comp = $('#pComplianceList');
    if (comp && P.compliance) {
      comp.innerHTML = '<h4>' + esc(D.compHeading) + '</h4><ul>' +
        (P.compliance.items || []).map(function (x) { return '<li>' + esc(t(x, L)) + '</li>'; }).join('') +
        '</ul>';
    }

    /* 询价清单 */
    var rfq = $('#pRfq'), R = P.rfq;
    if (rfq && R) {
      rfq.innerHTML =
        '<div class="p-rfq-head"><div><p class="p-kicker">' + esc(D.docsLabel) + '</p>' +
        '<h3>' + esc(t(R.title, L)) + '</h3><p>' + esc(t(R.lead, L)) + '</p></div>' +
        '<button type="button" class="p-btn sm" data-rfq="porcelain">' + esc(D.rfqBtn) + '</button></div>' +
        '<div class="p-rfq-grid">' +
        (R.items || []).map(function (r) {
          return '<div class="p-rfq-row"><div class="p-rfq-row-in"><b>' + esc(t(r.k, L)) + '</b><span>' + esc(t(r.v, L)) + '</span></div></div>';
        }).join('') +
        '</div><p class="p-rfq-note">' + esc(t(R.note, L)) + '</p>';
    }
    put('#pNote', t(P.note, L));
    var own = $('#pOwnerNote');
    if (own) own.innerHTML = '<b>' + esc(D.ownerLabel) + '</b><span>' + esc(t(P.supplier && P.supplier.note, L)) + '</span>';
  }

  function applyPorcGroup(g) {
    pGroup = g || 'all'; pCraft = 'all';
    renderPorcelain();
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
    var fnote = $('#mFigureNote');
    if (fnote && M.figureNote) { fnote.textContent = t(M.figureNote, L); fnote.style.display = 'block'; }
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
            (x.image ? '<div class="m-card-img"><img src="' + esc(x.image) + '" alt="' +
              esc(t(x.name, L)) + '" loading="lazy" onerror="this.style.display=\'none\'">' +
              '<span class="m-fig-tag">' + esc(D.figureTag || '') + '</span></div>' : '') +
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
                '<button type="button" class="m-quote" data-rfq="machinery" data-rfq-id="' + esc(x.id) + '">' +
                  esc(I18N[L].rfq.quoteBtn) + ' →</button>' +
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
      /* 泵业卡片询价 → V3 全局抽屉 */
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
        '<button type="button" class="m-btn sm" data-rfq="machinery">' + esc(D.rfqBtn) + '</button></div>' +
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

    /* 瓷器子项 → 直达瓷器板块并预选对应用途分组 */
    $$('.navdrop a[data-pg]').forEach(function (a) {
      a.addEventListener('click', function () {
        applyPorcGroup(a.getAttribute('data-pg'));
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
  /* 接口地址：优先读 data/site.json 的 form_endpoints。
     离线后台「表单诊断」里可直接改地址、增删端点，改完导出更新包再 push，
     不用再动代码。Worker 改名 / 换域名都走这一处配置。
     白名单（ALLOWED_ORIGINS）限制的是来源网站域名，与 Worker 叫什么无关。 */
  var DEFAULT_ENDPOINTS = [
    'https://gonghehou-form.tunnir243.workers.dev',
    'https://zhaoshengyuan-form.tunnir243.workers.dev'
  ];
  function getEndpoints() {
    try {
      if (SITE && Object.prototype.toString.call(SITE.form_endpoints) === '[object Array]') {
        var a = SITE.form_endpoints.filter(function (u) {
          return typeof u === 'string' && /^https:\/\//.test(u.trim());
        }).map(function (u) { return u.trim().replace(/\/+$/, ''); });
        if (a.length) return a;
      }
    } catch (e) {}
    return DEFAULT_ENDPOINTS.slice();
  }
  /* 提交失败原因前缀：UI 按钮 / 表单文案保持 100% 本地化 */
  var FAIL_LEAD = {
    zh: '未送达原因：',
    en: 'Not delivered: ',
    ru: 'Причина недоставки: '
  };
  function failLead() { return FAIL_LEAD[cur] || FAIL_LEAD.zh; }

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
      var list = getEndpoints();
      /* 极老浏览器没有 fetch，直接引导到兜底联系卡，不让它白等 */
      if (typeof fetch !== 'function') {
        msgEl.className = 'formmsg bad'; msgEl.textContent = M.errNetwork;
        showFbk(payload); return;
      }
      if (!list.length) {
        setTimeout(function () { msgEl.className = 'formmsg ok'; msgEl.textContent = M.ok; form.reset(); }, 600);
        return;
      }
      /* 与 Get Quote 抽屉共用同一个后端提交函数（双端点回退） */
      postEnquiry(payload, function (ok, detail) {
        if (ok) {
          msgEl.className = 'formmsg ok'; msgEl.textContent = M.ok; form.reset();
          if (boxWrap) boxWrap.classList.remove('warn'); hideFbk();
          var ma = document.getElementById('mailFallback'); if (ma) ma.style.display = 'none';
        } else {
          msgEl.className = 'formmsg bad';
          msgEl.textContent = M.errNetwork + (detail ? ' ' + detail : '');
          showFbk(payload);
        }
      });
    });
  }

/* ==================================================================================
   V3 · 视觉交互与转化路径 —— 前端逻辑（插在 main.js 的 IIFE 内，可访问内部变量）
   ----------------------------------------------------------------------------------
   ① 全局搜索（按品名 / 型号 / 规格 / 应用场景）
   ② 首页三张场景快捷卡（Hospitality / Retail / Industrial）
   ③ 右下商务浮动组件（默认收起，四项，预填当前产品名）
   ④ Get Quote 全局唯一抽屉：上下文确认条 + 品类动态字段 + 152-ФЗ + 失败兜底
   所有 UI 文案从 I18N[cur] 取；例外保留：Q/H/P/DN、SI、ISO 9001、EAC、
   380V、ml、mm、型号代号、WhatsApp / Telegram / Telegram Bot / WeChat。
   ================================================================================== */

  var V3_READY = false;
  var V3_CTX = null;              // currentContext：抽屉与 dock 共用同一份
  var V3_CAT = 'tea';             // 抽屉当前品类
  var V3_DYN = {};                // 动态字段值缓存（切换品类不清空通用字段）
  var V3_INDEX = [];              // 搜索索引
  var V3_LAST_FOCUS = null;
  var V3_OK = false;
  var TG_BOT_URL = 'https://t.me/Fan2399';   // 换成正式 Bot 用户名即可

  var PREFILL = {
    zh: '您好，我想了解：',
    en: 'Hello, I am enquiring about: ',
    ru: 'Здравствуйте, меня интересует: '
  };
  var FROM_TXT = {
    zh: '来源', en: 'From', ru: 'Источник'
  };
  var CAT_TXT_KEY = { tea: 'rfq.chTea', porcelain: 'rfq.chPorc', machinery: 'rfq.chMach', general: 'rfq.chOther' };
  var GOTO = { tea: '#products', porcelain: '#porcelain', machinery: '#industrial', general: '#contact' };

  function ti(key) { var v = getKey(I18N[cur], key); return v == null ? key : v; }
  function curLang() { return cur; }

  /* 静态属性本地化：aria-label / alt / title / placeholder 补充 */
  function v3StaticI18n() {
    $$('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', ti(el.getAttribute('data-i18n-aria')));
    });
    $$('[data-i18n-alt]').forEach(function (el) {
      el.setAttribute('alt', ti(el.getAttribute('data-i18n-alt')));
    });
    $$('[data-i18n-title]').forEach(function (el) {
      el.setAttribute('title', ti(el.getAttribute('data-i18n-title')));
    });
  }

  function v3Go(hash) {
    /* V3.3：场景卡 / 搜索结果统一先走视图路由，再由路由模块定位到目标锚点 */
    if (window.ZSY_VIEWS && typeof window.ZSY_VIEWS.go === 'function') {
      window.ZSY_VIEWS.go(hash);
      return;
    }
    var el = $(hash);
    if (!el) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try { el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
    catch (e) { el.scrollIntoView(); }
  }

  /* ---------------------------------------------------------------- 场景快捷卡 */
  function v3RenderApps() {
    var box = $('#appGrid'); if (!box) return;
    var D = I18N[cur].app;
    var defs = [
      { k: 'hospitality', n: '01', t: D.hTitle, d: D.hDesc, c: D.hCta, to: '#porcelain' },
      { k: 'retail',      n: '02', t: D.rTitle, d: D.rDesc, c: D.rCta, to: '#products' },
      { k: 'industrial',  n: '03', t: D.iTitle, d: D.iDesc, c: D.iCta, to: '#mSpecs' }
    ];
    box.innerHTML = defs.map(function (x) {
      return '<div class="app-card"><div class="app-card-in">' +
        '<span class="app-n">' + x.n + '</span>' +
        '<h3>' + esc(x.t) + '</h3><p>' + esc(x.d) + '</p>' +
        '<button type="button" class="app-cta" data-app="' + x.k + '">' + esc(x.c) + ' →</button>' +
        '</div></div>';
    }).join('');
    $$('#appGrid [data-app]').forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-app');
        if (k === 'hospitality') { applyPorcGroup('dinner'); v3Go('#porcelain'); }
        else if (k === 'retail') { applyNavFilter('tea', 'all'); v3Go('#products'); }
        else { mFilter = 'all'; renderMachinery(); v3Go('#mSpecs'); }
        v3SetContext({ cat: k === 'hospitality' ? 'porcelain' : k === 'retail' ? 'tea' : 'machinery',
                       name: k === 'hospitality' ? D.hTitle : k === 'retail' ? D.rTitle : D.iTitle,
                       model: '', image: '', source: 'application' });
      };
    });
  }

  /* ---------------------------------------------------------------- 全局搜索索引 */
  function v3Text(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    if (typeof v === 'object') {
      return LANGS.map(function (l) { return v[l] || ''; }).join(' ');
    }
    return String(v);
  }
  function v3AddIndex(cat, id, obj, nameKey, modelKey) {
    var hay = [];
    ['name', 'subtitle', 'desc', 'code', 'models', 'apps', 'detail', 'group', 'subcategory', 'craft']
      .forEach(function (k) { hay.push(v3Text(obj[k])); });
    (obj.specs || []).forEach(function (r) { hay.push(v3Text(r.k), v3Text(r.v)); });
    (obj.searchTerms || []).forEach(function (x) { hay.push(v3Text(x)); });
    hay.push(v3Text(obj.application), v3Text(obj.contextLabel), String(id || ''));
    V3_INDEX.push({
      cat: cat, id: id || '', obj: obj,
      name: t(obj[nameKey || 'name'], cur),
      model: t(obj[modelKey || 'code'], cur) || '',
      image: obj.image || '',
      hay: hay.join(' ').toLowerCase()
    });
  }
  function v3BuildIndex() {
    V3_INDEX = [];
    if (PROD && PROD.products) PROD.products.forEach(function (p) {
      if (p.published !== false) v3AddIndex('tea', p.id, p, 'name', 'subcategory');
    });
    if (PORC && PORC.items) PORC.items.forEach(function (p) {
      if (p.published !== false) v3AddIndex('porcelain', p.id, p, 'name', 'code');
    });
    if (MACH && MACH.series) MACH.series.forEach(function (p) {
      if (p.published !== false) v3AddIndex('machinery', p.id, p, 'name', 'code');
    });
    if (V3_READY && $('#gsearchPanel') && !$('#gsearchPanel').hidden) v3RenderSearch();
  }

  function v3Jump(item) {
    if (item.cat === 'tea') {
      applyNavFilter('tea', item.obj.subcategory || 'all'); v3Go('#products');
    } else if (item.cat === 'porcelain') {
      applyPorcGroup(item.obj.group || 'all'); v3Go('#porcelain');
    } else {
      mFilter = item.obj.group || 'all'; renderMachinery(); v3Go('#industrial');
    }
    v3SetContext({
      cat: item.cat, id: item.id, name: item.name, model: item.model,
      image: item.image, source: 'search'
    });
    v3CloseSearch();
  }

  function v3RenderSearch() {
    var panel = $('#gsearchPanel'), inp = $('#globalSearch');
    if (!panel || !inp) return;
    var q = (inp.value || '').trim().toLowerCase();
    if (!q) { panel.hidden = true; panel.innerHTML = ''; return; }
    var hits = V3_INDEX.filter(function (x) { return x.hay.indexOf(q) > -1; }).slice(0, 18);
    var G = I18N[cur].search;
    var html = '';
    if (!hits.length) {
      html = '<div class="gs-empty"><p>' + esc(G.noResult.replace('{q}', inp.value.trim())) + '</p>' +
             '<p>' + esc(G.noResultText) + '</p>' +
             '<button type="button" id="gsQuote">' + esc(G.noResultCta) + '</button></div>';
    } else {
      html = '<div class="gs-count">' + hits.length + ' ' + esc(G.count) + '</div>';
      ['tea', 'porcelain', 'machinery'].forEach(function (c) {
        var rows = hits.filter(function (x) { return x.cat === c; });
        if (!rows.length) return;
        html += '<div class="gs-group">' + esc(G['g' + c.charAt(0).toUpperCase() + c.slice(1)] ||
                 (c === 'tea' ? G.gTea : c === 'porcelain' ? G.gPorc : G.gMach)) + '</div>';
        rows.forEach(function (x, i) {
          html += '<a class="gs-row" href="' + GOTO[c] + '" data-gs="' + esc(x.cat) + '|' + esc(x.id) + '">' +
            (x.image ? '<img src="' + esc(x.image) + '" alt="">' : '<img src="' + PH + '" alt="">') +
            '<span class="gs-txt"><b>' + esc(x.name) + '</b><small>' + esc(x.model || x.cat) + '</small></span>' +
            '<span class="gs-go">' + esc(G.view) + ' →</span></a>';
        });
      });
    }
    panel.innerHTML = html;
    panel.hidden = false;
    var qb = $('#gsQuote', panel);
    if (qb) qb.onclick = function () {
      v3CloseSearch();
      v3OpenRFQ({ cat: 'general', name: inp.value.trim(), model: '', image: '', source: 'search-empty' });
    };
    $$('#gsearchPanel .gs-row').forEach(function (a) {
      a.onclick = function (e) {
        e.preventDefault();
        var key = a.getAttribute('data-gs').split('|');
        var it = V3_INDEX.filter(function (x) { return x.cat === key[0] && x.id === key[1]; })[0];
        if (it) v3Jump(it);
      };
    });
  }
  function v3CloseSearch() {
    var p = $('#gsearchPanel'); if (p) { p.hidden = true; p.innerHTML = ''; }
  }

  /* ---------------------------------------------------------------- currentContext */
  function v3SetContext(ctx) {
    V3_CTX = ctx || null;
    v3RenderDock();
  }
  function v3ContextName() {
    if (V3_CTX && V3_CTX.name) return V3_CTX.name;
    return ti('rfq.chOther');
  }
  function v3Prefill() {
    var n = v3ContextName();
    var m = (V3_CTX && V3_CTX.model) ? ' (' + V3_CTX.model + ')' : '';
    return PREFILL[cur] + n + m;
  }
  function v3DefaultCtx(cat) {
    var nameMap = { tea: 'rfq.chTea', porcelain: 'rfq.chPorc', machinery: 'rfq.chMach', general: 'rfq.chOther' };
    return { cat: cat || 'general', id: '', name: ti(nameMap[cat] || nameMap.general),
             model: '', image: '', source: 'nav' };
  }
  function v3CtxFromEl(el) {
    var cat = el.getAttribute('data-rfq') || 'general';
    var id = el.getAttribute('data-rfq-id') || '';
    if (!id) return v3DefaultCtx(cat === 'mach' ? 'machinery' : cat);
    var pool = cat === 'tea' ? (PROD && PROD.products || [])
             : cat === 'porcelain' ? (PORC && PORC.items || [])
             : (MACH && MACH.series || []);
    var o = pool.filter(function (x) { return String(x.id) === String(id); })[0];
    if (!o) return v3DefaultCtx(cat);
    var realCat = cat === 'mach' ? 'machinery' : cat;
    return { cat: realCat, id: id, name: t(o.name, cur),
             model: t(o.code, cur) || t(o.subtitle, cur) || '',
             image: o.image || '', source: 'card' };
  }

  /* ---------------------------------------------------------------- 右下浮动组件 */
  function v3RenderDock() {
    var p = $('#dockPanel'); if (!p) return;
    var D = I18N[cur].dock;
    var wa = 'https://wa.me/79117067084?text=' + encodeURIComponent(v3Prefill());
    var tg = 'https://t.me/Fan2399';
    p.innerHTML =
      '<div class="dock-h">' + esc(D.title) + '</div>' +
      '<a class="dock-row" data-ch="wa" href="' + esc(wa) + '" target="_blank" rel="noopener">' +
        '<span class="dock-ico">W</span><span><b>' + esc(D.wa) + '</b><small>' +
        ((V3_CTX && V3_CTX.name) ? 'wa.me · ' + esc(V3_CTX.name) : 'wa.me') + '</small></span></a>' +
      '<a class="dock-row" data-ch="tg" href="' + esc(tg) + '" target="_blank" rel="noopener">' +
        '<span class="dock-ico">T</span><span><b>' + esc(D.tg) + '</b><small>@Fan2399</small></span></a>' +
      '<a class="dock-row" data-ch="bot" href="' + esc(TG_BOT_URL) + '" target="_blank" rel="noopener">' +
        '<span class="dock-ico">B</span><span><b>' + esc(D.bot) + '</b><small>' + esc(D.botTag) + '</small></span></a>' +
      '<button type="button" class="dock-row" data-ch="wx" id="dockWx">' +
        '<span class="dock-ico">微</span><span><b>' + esc(D.wechat) + '</b><small>' + esc(D.wechatTag) + '</small></span></button>' +
      '<div class="dock-foot">' + esc(D.foot || '') + '</div>' +
      '<button type="button" class="dock-close" id="dockClose">' + esc(D.close) + '</button>';
    var wx = $('#dockWx', p);
    if (wx) wx.onclick = function () {
      var id = (SITE && SITE.contact_wechat) || '';
      var done = function () {
        var b = wx.querySelector('b'); var old = b.textContent;
        b.textContent = D.copied;
        setTimeout(function () { b.textContent = old; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(id).then(done, function () { v3FallbackCopy(id, done); });
      } else { v3FallbackCopy(id, done); }
    };
    var dc = $('#dockClose', p);
    if (dc) dc.onclick = function () { v3CloseDock(); };
    var t = $('#dockToggle');
    if (t) t.setAttribute('aria-label', $('#contactDock').classList.contains('open') ? D.close : D.open);
  }
  function v3FallbackCopy(txt, done) {
    var ta = document.createElement('textarea');
    ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(ta);
  }
  function v3CloseDock() {
    var d = $('#contactDock'); if (!d) return;
    d.classList.remove('open');
    var p = $('#dockPanel'); if (p) p.hidden = true;
    var t = $('#dockToggle'); if (t) t.setAttribute('aria-expanded', 'false');
    v3RenderDock();
  }
  function v3ToggleDock() {
    var d = $('#contactDock'), p = $('#dockPanel'), t = $('#dockToggle');
    if (!d || !p) return;
    var open = !d.classList.contains('open');
    d.classList.toggle('open', open);
    p.hidden = !open;
    if (t) t.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) v3RenderDock();
  }

  /* ---------------------------------------------------------------- Heritage 分品类叙事（V3.2）
     与产品中心同一套读法：先选品类，再看这一类的来历、出处与产品故事。
     茶叶用既有 4 条史料 + 原有产品故事；瓷器复用 PORC.history / PORC.crafts；
     流体设备不编历史，只列可核验的选型口径与合规归属。
     ---------------------------------------------------------------- */
  var HG_TAB = 'tea';
  function hgI18n() { return (I18N[cur] && I18N[cur].heritage) || {}; }
  function hgTabDefs() {
    var H = hgI18n(), T = H.tabs || {};
    return [
      { k: 'tea', label: T.tea || 'Tea' },
      { k: 'porcelain', label: T.porcelain || 'Porcelain' },
      { k: 'machinery', label: T.machinery || 'Fluid Equipment' }
    ];
  }
  function renderHeritage() {
    var H = hgI18n(), L = cur;
    var tabs = $('#hgTabs');
    if (tabs) {
      tabs.innerHTML = hgTabDefs().map(function (x) {
        return '<button type="button" class="hg-tab' + (HG_TAB === x.k ? ' on' : '') +
               '" data-hg="' + x.k + '" role="tab" aria-selected="' + (HG_TAB === x.k) + '">' +
               esc(x.label) + '</button>';
      }).join('');
      $$('#hgTabs .hg-tab').forEach(function (b) {
        b.onclick = function () { HG_TAB = b.getAttribute('data-hg'); renderHeritage(); };
      });
    }

    /* 眉标与主标题也随品类切换，避免整块看起来「只有茶叶的」 */
    var eb = $('#hgEyebrow'), tt = $('#hgTitle');
    if (eb) eb.textContent = (H.eyebrows && H.eyebrows[HG_TAB]) || H.eyebrow || '';
    if (tt) tt.textContent = (H.titles && H.titles[HG_TAB]) || H.title || '';

    var lead = $('#hgSectionLead');
    if (lead) lead.textContent = (H.secLead && H.secLead[HG_TAB]) || '';

    /* 时间轴：三类各自的数据源 */
    var items = [];
    if (HG_TAB === 'tea') {
      for (var i = 1; i <= 4; i++) {
        if (H['item' + i + 'Era']) items.push({
          era: H['item' + i + 'Era'], text: H['item' + i + 'Text'], src: H['item' + i + 'Src']
        });
      }
    } else if (HG_TAB === 'porcelain') {
      ((PORC && PORC.history) || []).forEach(function (h) {
        items.push({
          era: (h.year || '') + ' · ' + t(h.era, L),
          text: t(h.title, L) + ' —— ' + t(h.text, L),
          src: H.craftSrc || ''
        });
      });
    } else {
      (H.machItems || []).forEach(function (x) {
        items.push({ era: t(x.era, L), text: t(x.text, L), src: t(x.src, L) });
      });
    }
    var tl = $('#hgTimeline');
    if (tl) {
      tl.innerHTML = items.length ? items.map(function (x) {
        return '<div class="hg-item">' +
                 '<p class="hg-era">' + esc(x.era || '') + '</p>' +
                 '<p class="hg-text">' + esc(x.text || '') + '</p>' +
                 (x.src ? '<p class="hg-src"><b>' + esc(H.srcLabel || '') +
                          '</b> · <span>' + esc(x.src) + '</span></p>' : '') +
               '</div>';
      }).join('') : '<div class="hg-item"><p class="hg-text">' +
                    esc((H.secLead && H.secLead[HG_TAB]) || '') + '</p></div>';
    }

    /* 底部回流链接：三条都在，当前品类高亮 */
    var links = $('#hgLinks'), LK = H.links || {};
    if (links) {
      links.innerHTML =
        '<a href="#products"' + (HG_TAB === 'tea' ? ' class="on"' : '') + '>' + esc(LK.tea || '') + '</a>' +
        '<a href="#porcelain"' + (HG_TAB === 'porcelain' ? ' class="on"' : '') + '>' + esc(LK.porc || '') + '</a>' +
        '<a href="#industrial"' + (HG_TAB === 'machinery' ? ' class="on"' : '') + '>' + esc(LK.mach || '') + '</a>';
    }

    /* 故事区 */
    var stTitle = $('#hgStoriesTitle'), stLead = $('#hgStoryLead');
    if (stTitle) stTitle.textContent = (H.storyTitles && H.storyTitles[HG_TAB]) || '';
    if (stLead) stLead.textContent = HG_TAB === 'tea'
      ? ((I18N[cur].story && I18N[cur].story.lead) || '')
      : ((H.storyLeads && H.storyLeads[HG_TAB]) || '');

    var list = $('#storyList'), emp = $('#storyEmpty');
    if (!list) return;
    if (HG_TAB === 'tea') { renderStories(); return; }   // 沿用原有茶叶产品故事
    if (emp) emp.style.display = 'none';
    var cards = [];
    if (HG_TAB === 'porcelain') {
      ((PORC && PORC.crafts) || []).forEach(function (c) {
        cards.push({ era: H.craftSrc || '', title: t(c.name, L), body: t(c.text, L), href: '#pCrafts' });
      });
    } else {
      (H.machCards || []).forEach(function (c) {
        cards.push({ era: c.era, title: t(c.title, L), body: t(c.body, L), href: '#mSpecs' });
      });
    }
    list.innerHTML = cards.length ? cards.map(function (c) {
      return '<article class="hg-scard">' +
               (c.era ? '<p class="hg-scard-era">' + esc(c.era) + '</p>' : '') +
               '<h4>' + esc(c.title) + '</h4>' +
               '<p>' + esc(c.body) + '</p>' +
               '<a class="hg-scard-cta" href="' + esc(c.href) + '">' + esc(H.viewCat || '') + '</a>' +
             '</article>';
    }).join('') : '';
  }

  /* ---------------------------------------------------------------- RFQ 抽屉 */
  var DYN_FIELDS = {
    tea: [
      { n: 'grade', l: 'rfq.teaGrade', ph: '' }, { n: 'spec', l: 'rfq.teaSpec', ph: '100g / 250g / kg' },
      { n: 'pack', l: 'rfq.teaPack', type: 'select', opts: ['rfq.packYes', 'rfq.packNo'] },
      { n: 'sample', l: 'rfq.teaSample', ph: '' },
      { n: 'channel', l: 'rfq.teaChannel', ph: 'rfq.phTeaChannel' }
    ],
    porcelain: [
      { n: 'shape', l: 'rfq.porcShape', ph: '' }, { n: 'set', l: 'rfq.porcSet', ph: 'ml / mm' },
      { n: 'pack', l: 'rfq.porcPack', type: 'select', opts: ['rfq.packYes', 'rfq.packNo'] },
      { n: 'sample', l: 'rfq.porcSample', ph: '' },
      { n: 'gift', l: 'rfq.porcGift', type: 'select', opts: ['rfq.packYes', 'rfq.packNo'] }
    ],
    machinery: [
      { n: 'flow', l: 'rfq.machFlow', ph: 'Q (m³/h)' },
      { n: 'head', l: 'rfq.machHead', ph: 'H (m)' },
      { n: 'volt', l: 'rfq.machVolt', ph: '380V / 50Hz' },
      { n: 'dn', l: 'rfq.machDN', ph: 'DN' },
      { n: 'medium', l: 'rfq.machMedium', ph: '' },
      { n: 'datasheet', l: 'rfq.machDatasheet', type: 'select', opts: ['rfq.packYes', 'rfq.packNo'] }
    ],
    general: []
  };

  function v3SaveDyn() {
    $$('#rfqDynamic [name]').forEach(function (el) { V3_DYN[el.name] = el.value; });
  }
  function v3RenderDyn() {
    var box = $('#rfqDynamic'); if (!box) return;
    var title = $('#rfqDynamicTitle');
    var f = DYN_FIELDS[V3_CAT] || [];
    if (title) title.textContent = V3_CAT === 'machinery' ? ti('specs.machTitle')
                                 : V3_CAT === 'porcelain' ? ti('specs.porcTitle')
                                 : ti('rfq.chTea');
    if (!f.length) { box.innerHTML = ''; if (title) title.hidden = true; return; }
    if (title) title.hidden = false;
    box.innerHTML = f.map(function (x) {
      var v = V3_DYN[x.n] || '';
      if (x.type === 'select') {
        return '<div class="rfq-f"><label for="dyn_' + x.n + '">' + esc(ti(x.l)) + '</label>' +
          '<select id="dyn_' + x.n + '" name="' + x.n + '">' +
          '<option value="">—</option>' +
          x.opts.map(function (o) { return '<option value="' + esc(ti(o)) + '">' + esc(ti(o)) + '</option>'; }).join('') +
          '</select></div>';
      }
      return '<div class="rfq-f"><label for="dyn_' + x.n + '">' + esc(ti(x.l)) + '</label>' +
        '<input id="dyn_' + x.n + '" name="' + x.n + '" value="' + esc(v) + '" placeholder="' + esc(ti(x.ph)) + '"></div>';
    }).join('');
    // 恢复下拉值
    f.forEach(function (x) {
      if (x.type === 'select' && V3_DYN[x.n]) {
        var el = $('#dyn_' + x.n, box); if (el) el.value = V3_DYN[x.n];
      }
    });
  }

  function v3RenderCtx() {
    var c = V3_CTX || v3DefaultCtx(V3_CAT);
    var img = $('#rfqCtxImg'), nm = $('#rfqCtxName'), md = $('#rfqCtxModel'), fr = $('#rfqCtxFrom');
    if (img) {
      if (c.image) { img.src = c.image; img.style.display = ''; }
      else { img.src = PH; img.style.display = 'none'; }
    }
    if (nm) nm.textContent = c.name || ti('rfq.chOther');
    if (md) md.textContent = c.model || ti('rfq.noThumb');
    if (fr) fr.textContent = ti('rfq.fromLabel') + ' · ' + ti(CAT_TXT_KEY[c.cat] || 'rfq.chOther') +
                             ' · ' + (location.hash || '#home');
  }

  function v3RenderChooser() {
    var box = $('#rfqChooser'); if (!box) return;
    box.innerHTML = '<p class="rfq-sect">' + esc(ti('rfq.chTitle')) + '</p>' +
      '<div class="rfq-chlist">' +
      ['tea', 'porcelain', 'machinery', 'general'].map(function (k) {
        return '<button type="button" data-ch="' + k + '">' + esc(ti(CAT_TXT_KEY[k])) + '</button>';
      }).join('') + '</div>';
    $$('#rfqChooser [data-ch]').forEach(function (b) {
      b.onclick = function () {
        v3SaveDyn();
        V3_CAT = b.getAttribute('data-ch');
        v3RenderDyn();
        box.hidden = true;
        v3RenderCtx();
      };
    });
  }

  function v3AssistLinks() {
    var txt = encodeURIComponent(v3Prefill());
    var wa = $('#rfqWa'), tg = $('#rfqTg'), wa2 = $('#rfqWaAssist'), tg2 = $('#rfqTgAssist');
    if (wa) wa.href = 'https://wa.me/79117067084?text=' + txt;
    if (wa2) wa2.href = 'https://wa.me/79117067084?text=' + txt;
    if (tg) tg.href = 'https://t.me/Fan2399';
    if (tg2) tg2.href = 'https://t.me/Fan2399';
  }

  function v3OpenRFQ(ctx) {
    var d = $('#rfqDrawer'), ov = $('#rfqOverlay');
    if (!d || !ov) return;
    V3_LAST_FOCUS = document.activeElement;
    V3_CTX = ctx || v3DefaultCtx(V3_CAT);
    V3_CAT = V3_CTX.cat || 'general';
    V3_OK = false;
    v3CloseDock();
    v3RenderCtx(); v3RenderDyn(); v3RenderChooser(); v3AssistLinks();
    var chooser = $('#rfqChooser'); if (chooser) chooser.hidden = true;
    var ok = $('#rfqOkBox'); if (ok) ok.hidden = true;
    var fail = $('#rfqFail'); if (fail) fail.hidden = true;
    var msg = $('#rfqMsg'); if (msg) { msg.textContent = ''; msg.className = 'rfq-msg'; }
    $('#rfqBody').style.display = '';
    var foot = $('#rfqFoot'); if (foot) foot.style.display = '';
    ['#rfqDynamic', '#rfqCommon', '#rfqConsentWrap'].forEach(function (sel) {
      var e = $(sel); if (e) e.style.display = '';
    });
    var cw = $('#rfqConsentWrap'); if (cw) cw.classList.remove('warn');
    ov.hidden = false; d.hidden = false;
    document.body.classList.add('rfq-open');
    /* 强制一帧后再加 show，保证过渡生效；reduced-motion 下 CSS 已禁用过渡 */
    setTimeout(function () { ov.classList.add('show'); d.classList.add('show'); }, 10);
    setTimeout(function () { var x = $('#rfqClose'); if (x && x.focus) x.focus(); }, 60);
    v3SetContext(V3_CTX);
  }

  function v3CloseRFQ() {
    var d = $('#rfqDrawer'), ov = $('#rfqOverlay');
    if (!d || !ov) return;
    d.classList.remove('show'); ov.classList.remove('show');
    document.body.classList.remove('rfq-open');
    setTimeout(function () {
      d.hidden = true; ov.hidden = true;
      if (V3_LAST_FOCUS && V3_LAST_FOCUS.focus) V3_LAST_FOCUS.focus();
    }, 180);
  }

  function v3Collect() {
    var D = I18N[cur].rfq;
    var p = {
      name: ($('#rfqName').value || '').trim(),
      company: ($('#rfqCompany').value || '').trim(),
      contact: ($('#rfqContact').value || '').trim(),
      country: ($('#rfqCountry').value || '').trim(),
      qty: ($('#rfqQty').value || '').trim(),
      lead: ($('#rfqLead').value || '').trim(),
      docs: $('#rfqDocs').value,
      note: ($('#rfqNote').value || '').trim()
    };
    var lines = [];
    lines.push(ti('rfq.contextLabel') + ': ' + ti(CAT_TXT_KEY[V3_CAT] || 'rfq.chOther'));
    if (V3_CTX && V3_CTX.name) lines.push(ti('rfq.fNote') + ': ' + V3_CTX.name + (V3_CTX.model ? ' / ' + V3_CTX.model : ''));
    (DYN_FIELDS[V3_CAT] || []).forEach(function (f) {
      var el = $('#dyn_' + f.n); if (!el || !el.value) return;
      lines.push(ti(f.l) + ': ' + el.value);
    });
    if (p.qty) lines.push(D.fQty + ': ' + p.qty);
    if (p.lead) lines.push(D.fLead + ': ' + p.lead);
    if (p.docs) lines.push(D.fDocs + ': ' + p.docs);
    if (p.note) lines.push(D.fNote + ': ' + p.note);
    lines.push(ti('rfq.fromLabel') + ': ' + location.href + ' · ' + cur);
    return {
      name: p.name, contact: p.contact, company: p.company, country: p.country,
      qty: p.qty, type: ti(CAT_TXT_KEY[V3_CAT] || 'rfq.chOther'),
      msg: lines.join('\n'), lang: cur,
      consent: 1, consent_at: new Date().toISOString(), page: location.href,
      _lines: lines, _p: p
    };
  }

  function v3MailFallback(payload) {
    var a = $('#rfqMailFallback'); if (!a) return;
    var subj = ti('rfq.title') + (payload.name ? ' — ' + payload.name : '');
    a.href = 'mailto:fanwh188@gmail.com?subject=' + encodeURIComponent(subj) +
             '&body=' + encodeURIComponent(payload._lines.join('\n'));
  }

  function v3Submit() {
    if (V3_OK) return;
    var M = I18N[cur].rfq;
    var msg = $('#rfqMsg'), cw = $('#rfqConsentWrap'), box = $('#consentBox');
    var payload = v3Collect();
    if (!payload.name || !payload.contact) {
      msg.className = 'rfq-msg bad'; msg.textContent = M.errFill; return;
    }
    var consent = $('#rfqConsent');
    if (!consent || !consent.checked) {
      if (cw) cw.classList.add('warn');
      msg.className = 'rfq-msg bad'; msg.textContent = M.errConsent;
      if (consent && consent.focus) consent.focus();
      return;
    }
    if (cw) cw.classList.remove('warn');
    var btn = $('#rfqSubmit');
    if (btn) { btn.disabled = true; btn.textContent = M.sending; }
    msg.className = 'rfq-msg'; msg.textContent = M.sending;
    var fail = $('#rfqFail'); if (fail) fail.hidden = true;
    postEnquiry(payload, function (ok, detail) {
      if (btn) { btn.disabled = false; btn.textContent = M.submit; }
      if (ok) {
        V3_OK = true;
        msg.className = 'rfq-msg ok'; msg.textContent = M.ok; msg.style.whiteSpace = '';
        var ref = $('#rfqRef');
        if (ref) ref.textContent = M.okRef + ' · ' + String(Date.now()).slice(-8);
        var okb = $('#rfqOkBox'); if (okb) okb.hidden = false;
        var foot = $('#rfqFoot'); if (foot) foot.style.display = 'none';
        var dyn = $('#rfqDynamic'); if (dyn) dyn.style.display = 'none';
        var com = $('#rfqCommon'); if (com) com.style.display = 'none';
        if (cw) cw.style.display = 'none';
      } else {
        msg.className = 'rfq-msg bad';
        msg.textContent = M.fail + (detail ? '\n' + failLead() + detail : '');
        msg.style.whiteSpace = detail ? 'pre-line' : '';
        var f = $('#rfqFail');
        if (f) { f.hidden = false; $('#rfqFailText').textContent = M.failTip;
                 if (f.scrollIntoView) f.scrollIntoView({ block: 'nearest' }); }
        var fd = $('#rfqFailDetail');
        if (fd) { fd.textContent = detail ? failLead() + detail : ''; fd.style.display = detail ? '' : 'none'; }
        v3MailFallback(payload);
        v3AssistLinks();
      }
    });
  }

  /* ---------------------------------------------------------------- 共用的后端提交
     返回 cb(ok, detail)：失败时把每个端点的真实结果带回来，
     访客不用按 F12 也能看到是白名单 403、环境变量 500 还是网络被拦。 */
  function postEnquiry(payload, cb) {
    var list = getEndpoints();
    if (!list.length) { setTimeout(function () { cb(true, ''); }, 600); return; }
    if (typeof fetch !== 'function') { cb(false, failLead() + 'fetch unavailable'); return; }
    var notes = [];
    (function attempt(i) {
      if (i >= list.length) { cb(false, notes.join(' | ')); return; }
      var done = false, timer = null, url = list[i];
      var short = url.replace(/^https:\/\//, '').replace(/\/+$/, '');
      /* 9 秒无响应即转下一个端点，避免某个地址挂起时按钮一直转圈 */
      timer = setTimeout(function () {
        if (done) return;
        done = true; notes.push(short + ' → timeout 9s'); attempt(i + 1);
      }, 9000);
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) {
        return r.text().then(function (txt) {
          return { status: r.status, ok: r.ok, txt: String(txt || '') };
        });
      }).then(function (res) {
        if (done) return;
        clearTimeout(timer); done = true;
        var brief = res.txt.slice(0, 120).replace(/\s+/g, ' ');
        if (!res.ok) {
          notes.push(short + ' → HTTP ' + res.status + (brief ? ' · ' + brief : ''));
          attempt(i + 1); return;
        }
        var j = null; try { j = JSON.parse(res.txt); } catch (e) {}
        if (j && j.ok) { cb(true, ''); }
        else {
          notes.push(short + ' → ' + (j ? 'no ok flag' : 'non-JSON response') + (brief ? ' · ' + brief : ''));
          attempt(i + 1);
        }
      }).catch(function () {
        if (done) return;
        clearTimeout(timer); done = true;
        notes.push(short + ' → network / CORS / blocked');
        attempt(i + 1);
      });
    })(0);
  }

  /* ---------------------------------------------------------------- 三语切换时刷新 */
  function v3RefreshUI() {
    if (!V3_READY) return;
    v3StaticI18n();
    v3RenderApps();
    v3RenderDock();
    renderHeritage();
    v3BuildIndex();
    var sp = $('#gsearchPanel'); if (sp && !sp.hidden) v3RenderSearch();
    var d = $('#rfqDrawer');
    if (d && !d.hidden) {
      v3RenderCtx();
      v3SaveDyn(); v3RenderDyn();
      v3RenderChooser();
      var chooser = $('#rfqChooser'); if (chooser && !V3_OK) chooser.hidden = true;
      v3AssistLinks();
      var btn = $('#rfqSubmit'); if (btn) btn.textContent = ti('rfq.submit');
      var failT = $('#rfqFailText'); if (failT && !$('#rfqFail').hidden) failT.textContent = ti('rfq.failTip');
    }
  }

  /* ---------------------------------------------------------------- 事件绑定 */
  function v3Init() {
    if (V3_READY) return;
    V3_READY = true;
    v3StaticI18n();
    v3RenderApps();
    v3RenderDock();
    renderHeritage();
    v3BuildIndex();

    /* 所有卡片 / 锚点 / hero 上的主按钮统一走事件委托 → 全局唯一抽屉 */
    document.addEventListener('click', function (e) {
      var node = e.target;
      while (node && node !== document && node.nodeType === 1) {
        if (node.hasAttribute && node.hasAttribute('data-rfq')) break;
        node = node.parentNode;
      }
      if (node && node !== document && node.hasAttribute && node.hasAttribute('data-rfq')) {
        e.preventDefault(); e.stopPropagation();
        v3OpenRFQ(v3CtxFromEl(node));
        return;
      }
      var tgt = e.target && e.target.nodeType === 1 ? e.target : (e.target && e.target.parentNode);
      if (!tgt) return;
      /* 点击 dock / 搜索面板之外时收起 */
      var dock = $('#contactDock');
      if (dock && dock.classList.contains('open') && !dock.contains(tgt)) v3CloseDock();
      var gs = $('#gsearch');
      if (gs && !gs.contains(tgt)) v3CloseSearch();
    });

    var dt = $('#dockToggle');
    if (dt) dt.onclick = function (e) { e.stopPropagation(); v3ToggleDock(); };

    /* 全局搜索 */
    var inp = $('#globalSearch');
    if (inp) {
      var timer = null;
      inp.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(v3RenderSearch, 120);
      });
      inp.addEventListener('focus', function () { if (inp.value.trim()) v3RenderSearch(); });
    }
    document.addEventListener('keydown', function (e) {
      var k = e.key || e.keyCode;
      if (k === 'Escape' || k === 27) {
        var d = $('#rfqDrawer');
        if (d && !d.hidden) { v3CloseRFQ(); return; }
        v3CloseSearch(); v3CloseDock();
      }
      if ((k === '/' || k === 191) && document.activeElement !== $('#globalSearch')) {
        var i2 = $('#globalSearch');
        if (i2 && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
          e.preventDefault(); i2.focus();
        }
      }
    });

    /* 抽屉控件 */
    var x = $('#rfqClose'); if (x) x.onclick = v3CloseRFQ;
    var ov = $('#rfqOverlay'); if (ov) ov.onclick = v3CloseRFQ;
    var ch = $('#rfqChange'); if (ch) ch.onclick = function () {
      var b = $('#rfqChooser'); if (b) b.hidden = !b.hidden;
    };
    var sub = $('#rfqSubmit'); if (sub) sub.onclick = v3Submit;
    var cont = $('#rfqContinue'); if (cont) cont.onclick = v3CloseRFQ;
    var consent = $('#rfqConsent');
    if (consent) consent.addEventListener('change', function () {
      if (consent.checked) { var cw = $('#rfqConsentWrap'); if (cw) cw.classList.remove('warn'); }
    });
    /* 焦点锁在抽屉内 */
    var drawer = $('#rfqDrawer');
    if (drawer) drawer.addEventListener('keydown', function (e) {
      if ((e.key || e.keyCode) !== 'Tab' && (e.key || e.keyCode) !== 9) return;
      var f = $$('#rfqDrawer button, #rfqDrawer a[href], #rfqDrawer input, #rfqDrawer select, #rfqDrawer textarea')
        .filter(function (el) { return !el.disabled && el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* V3.1 MOBILE FIX BEGIN */

  /* ============================================================
     V3.1 MOBILE FIX · 移动端顶栏：搜索图标化 + 与汉堡菜单互斥
     只操作 DOM，不改动既有搜索/表单/RFQ 逻辑，可独立重跑。
     ============================================================ */
  (function () {
    'use strict';
    function $s(s, r) { return (r || document).querySelector(s); }
    function narrow() { return window.innerWidth <= 860; }

    var gs, trigger, closeBtn, inp, panel, links, tg, item, tgl, root;

    function closePanel() {
      if (panel) { panel.hidden = true; panel.innerHTML = ''; }
    }
    function syncPanelTop() {
      if (!gs || !panel || !gs.classList.contains('mobile-open')) return;
      panel.style.top = Math.round(gs.getBoundingClientRect().bottom) + 'px';
    }
    function closeMenu() {
      if (links) links.classList.remove('open');
      if (item) item.classList.remove('drop-open');
      if (tgl) tgl.setAttribute('aria-expanded', 'false');
      if (root) root.setAttribute('aria-expanded', 'false');
    }
    function closeMobileSearch(keepValue) {
      if (!gs) return;
      gs.classList.remove('mobile-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (panel) panel.style.top = '';
      closePanel();
      if (!keepValue && inp) inp.value = '';
    }
    function openMobileSearch() {
      if (!gs || !narrow()) return;
      closeMenu();                                  /* 互斥：菜单立刻让位 */
      gs.classList.add('mobile-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      closePanel();
      syncPanelTop();
      if (inp && inp.value.trim() && typeof v3RenderSearch === 'function') v3RenderSearch();
      setTimeout(function () { try { inp && inp.focus(); } catch (e) {} }, 20);
    }

    function init() {
      gs = $s('#gsearch'); trigger = $s('#gsTrigger'); closeBtn = $s('#gsClose');
      inp = $s('#globalSearch'); panel = $s('#gsearchPanel');
      links = $s('#navlinks'); tg = $s('#navtoggle'); item = $s('#navProducts');
      tgl = item ? $s('.navdrop-toggle', item) : null;
      root = item ? $s('.nav-root', item) : null;
      if (!gs || !trigger || !inp) return;

      /* 图标按钮：展开 / 再点收起 */
      trigger.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        if (gs.classList.contains('mobile-open')) closeMobileSearch(true);
        else openMobileSearch();
      });
      if (closeBtn) closeBtn.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation(); closeMobileSearch(true);
      });

      /* 任何菜单操作先收起搜索条（互斥双保险，不覆盖原有 onclick） */
      if (tg) tg.addEventListener('click', function () { closeMobileSearch(true); });
      if (links) links.addEventListener('click', function () { closeMobileSearch(true); });
      /* 点搜索结果 / 零结果询价后，整条搜索栏一并收起 */
      if (panel) panel.addEventListener('click', function () { closeMobileSearch(true); });

      /* 点击搜索条外部 → 整条收起 */
      document.addEventListener('click', function (e) {
        if (!gs.classList.contains('mobile-open')) return;
        var t = e.target;
        if (t && gs.contains(t)) return;
        closeMobileSearch(true);
      }, true);

      /* Esc：RFQ 抽屉优先；否则关搜索条 + 菜单 */
      document.addEventListener('keydown', function (e) {
        var k = e.key || e.keyCode;
        if (k !== 'Escape' && k !== 27) return;
        var d = $s('#rfqDrawer');
        if (d && !d.hidden) return;
        if (gs.classList.contains('mobile-open')) { closeMobileSearch(true); closeMenu(); }
      }, true);

      /* '/' 快捷键：窄屏先展开图标再聚焦，避免 focus 到隐藏 input */
      document.addEventListener('keydown', function (e) {
        var k = e.key || e.keyCode;
        if (k !== '/' && k !== 191) return;
        if (!narrow() || document.body.classList.contains('rfq-open')) return;
        var ae = document.activeElement;
        if (ae && /INPUT|TEXTAREA|SELECT/.test(ae.tagName)) return;
        e.preventDefault(); e.stopPropagation();
        openMobileSearch();
        setTimeout(function () { try { inp && inp.focus(); } catch (x) {} }, 30);
      }, true);

      /* 回到桌面宽度：清掉移动态，恢复常驻输入框 */
      window.addEventListener('resize', function () {
        if (!narrow() && gs.classList.contains('mobile-open')) closeMobileSearch(true);
        syncPanelTop();
      }, { passive: true });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  })();
  /* V3.1 MOBILE FIX END */

  /* ============================================================
     启动
     ============================================================ */
  function loadJSON(url) {
    /* 单文件版：数据已内联，直接用，避免 file:// 下 fetch 被浏览器拦截 */
    if (url.indexOf('site.json') > -1 && window.__ZSY_SITE__) return Promise.resolve(window.__ZSY_SITE__);
    if (url.indexOf('products.json') > -1 && window.__ZSY_PROD__) return Promise.resolve(window.__ZSY_PROD__);
    if (url.indexOf('machinery.json') > -1 && window.__ZSY_MACH__) return Promise.resolve(window.__ZSY_MACH__);
    if (url.indexOf('porcelain.json') > -1 && window.__ZSY_PORC__) return Promise.resolve(window.__ZSY_PORC__);
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
    setData: function (site, prod, lang, mach, porc) {
      if (site) SITE = site;
      if (prod) PROD = prod;
      if (mach) MACH = mach;
      if (porc) PORC = porc;
      if (lang && LANGS.indexOf(lang) > -1) cur = lang;
      setLang(cur, true);
    },
    setMach: function (m) { if (m) { MACH = m; renderMachinery(); } },
    setPorc: function (p) { if (p) { PORC = p; renderPorcelain(); } },
    getLang: function () { return cur; },
    getEndpoints: getEndpoints,
    postEnquiry: postEnquiry
  };

  function boot() {
    setLang(detect(), true);
    initNav(); initWechat(); initForm(); v3Init();

    Promise.all([
      loadJSON('data/site.json').catch(function (e) { console.warn(e); return null; }),
      loadJSON('data/products.json').catch(function (e) { console.warn(e); return null; }),
      loadJSON('data/machinery.json').catch(function (e) { console.warn(e); return null; }),
      loadJSON('data/porcelain.json').catch(function (e) { console.warn(e); return null; })
    ]).then(function (res) {
      SITE = res[0] || {};
      /* V3.5: 后台编辑的品牌源流文案覆盖 i18n.js 默认字典 */
      if (SITE.heritage) {
        for (var hi = 0; hi < LANGS.length; hi++) {
          var hl = LANGS[hi], hs = SITE.heritage[hl];
          if (!hs) continue;
          var hd = I18N[hl].heritage || (I18N[hl].heritage = {});
          for (var hk in hs) {
            if (Object.prototype.hasOwnProperty.call(hs, hk)) hd[hk] = hs[hk];
          }
        }
      }
      PROD = res[1] || { categories: [], products: [] };
      MACH = res[2] || null;
      PORC = res[3] || null;
      setLang(cur, true);
      v3BuildIndex();
      initReveal();
    });

    $$('#langswitch button').forEach(function (b) {
      b.onclick = function () { setLang(b.getAttribute('data-lang')); };
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();


/* ==================================================================================
   V3.3 · 视图分区路由（独立模块，不改任何既有组件）
   首页 = 公司介绍；产品中心 = 茶叶 / 景德镇瓷器 / 流体设备三个 pane；
   品牌源流 / 关于 / 服务能力 / 联系 各自独立。
   旧锚点（#porcelain、#industrial、#mSpecs、#faq …）全部自动映射，
   已发出去的链接不失效。
   ================================================================================== */
;(function () {
  'use strict';
  function $q(s, r) { return (r || document).querySelector(s); }
  function $qa(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  var VIEWS = ['home', 'products', 'heritage', 'about', 'capability', 'contact'];
  var PANES = ['tea', 'porcelain', 'machinery'];

  /* 旧锚点 → [视图, pane, 视图内定位锚点] */
  var LEGACY = {
    home:        ['home', '', ''],
    applications:['products', '', 'applications'],
    homeIntro:   ['home', '', 'homeIntro'],
    products:    ['products', 'tea', ''],
    porcelain:   ['products', 'porcelain', ''],
    pHero:       ['products', 'porcelain', 'pHero'],
    pHistory:    ['products', 'porcelain', 'pHistory'],
    pCrafts:     ['products', 'porcelain', 'pCrafts'],
    pSpecs:      ['products', 'porcelain', 'pSpecs'],
    pCatalogue:  ['products', 'porcelain', 'pCatalogue'],
    pCompliance: ['products', 'porcelain', 'pCompliance'],
    industrial:  ['products', 'machinery', ''],
    mSpecs:      ['products', 'machinery', 'mSpecs'],
    machSeries:  ['products', 'machinery', 'machSeries'],
    machCerts:   ['products', 'machinery', 'machCerts'],
    heritage:    ['heritage', '', ''],
    stories:     ['heritage', '', 'stories'],
    about:       ['about', '', ''],
    why:         ['about', '', 'why'],
    capability:  ['capability', '', ''],
    terms:       ['capability', '', 'terms'],
    faq:         ['contact', '', 'faq'],
    contact:     ['contact', '', '']
  };

  function parse(hash) {
    var h = String(hash || '').replace(/^#/, '');
    var to = '';
    var q = h.indexOf('?');
    if (q > -1) {
      var qs = h.slice(q + 1);
      h = h.slice(0, q);
      var mm = /(?:^|&)to=([^&]+)/.exec(qs);
      if (mm) { try { to = decodeURIComponent(mm[1]); } catch (e) { to = mm[1]; } }
    }
    if (h.charAt(0) === '/') {
      var parts = h.slice(1).split('/');
      var v = parts[0], pane = parts[1] || '';
      if (VIEWS.indexOf(v) === -1) v = 'home';
      if (v !== 'products') pane = '';
      if (v === 'products' && PANES.indexOf(pane) === -1) pane = 'tea';
      return { view: v, pane: pane, to: to };
    }
    var L = LEGACY[h];
    if (L) return { view: L[0], pane: L[1] || (L[0] === 'products' ? 'tea' : ''), to: to || L[2] };
    return { view: 'home', pane: 'tea', to: '' };
  }

  function canonical(p) {
    var s = p.view === 'products'
      ? '#/products/' + (p.pane || 'tea')
      : '#/' + p.view;
    if (p.to) s += '?to=' + encodeURIComponent(p.to);
    return s;
  }

  function closeFloaters() {
    var links = $q('#navlinks'); if (links) links.classList.remove('open');
    var item = $q('#navProducts'); if (item) item.classList.remove('drop-open');
    var tgl = $q('.navdrop-toggle', item); if (tgl) tgl.setAttribute('aria-expanded', 'false');
    var root = $q('.nav-root', item); if (root) root.setAttribute('aria-expanded', 'false');
    var gs = $q('#gsearch'); if (gs) gs.classList.remove('mobile-open');
    var gtr = $q('#gsTrigger'); if (gtr) gtr.setAttribute('aria-expanded', 'false');
    var panel = $q('#gsearchPanel'); if (panel) { panel.hidden = true; panel.innerHTML = ''; }
    var dock = $q('#contactDock'); if (dock) dock.classList.remove('open');
    var dp = $q('#dockPanel'); if (dp) dp.hidden = true;
    var dto = $q('#dockToggle'); if (dto) dto.setAttribute('aria-expanded', 'false');
  }

  function markActive(view) {
    var map = { home: '#/home', products: '#/products', heritage: '#/heritage',
                about: '#/about', capability: '#/capability', contact: '#/contact' };
    $qa('#navlinks > a, #navlinks .nav-root').forEach(function (a) {
      if (a.getAttribute('href') === map[view]) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    $qa('#paneBar [data-pane]').forEach(function (a) {
      a.classList.toggle('on', a.getAttribute('data-pane') === document.body.dataset.pane);
      a.setAttribute('aria-selected', a.classList.contains('on') ? 'true' : 'false');
    });
  }

  function apply(p, scrollTop) {
    document.body.dataset.view = p.view;
    document.body.dataset.pane = p.pane || 'tea';
    $qa('section[data-view]').forEach(function (s) {
      var v = s.getAttribute('data-view');
      var pn = s.getAttribute('data-pane');
      var show = (v === p.view) && (v !== 'products' || !pn || pn === p.pane);
      s.classList.toggle('view-hidden', !show);
      if (show) s.classList.add('in');   /* reveal 动效兜底：隐藏→显示不白屏 */
    });
    $qa('.panebar[data-view]').forEach(function (el) {
      el.classList.toggle('view-hidden', p.view !== 'products');
    });
    markActive(p.view);
    closeFloaters();
    if (scrollTop !== false) {
      try { window.scrollTo(0, 0); } catch (e) {}
      if (p.to) {
        setTimeout(function () {
          var el = document.getElementById(p.to);
          if (el && !el.closest('.view-hidden')) {
            var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            try { el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
            catch (e2) { el.scrollIntoView(); }
          }
        }, 90);
      }
    }
  }

  function go(hash) {
    var p = parse(hash);
    var c = canonical(p);
    if (location.hash !== c) {
      location.hash = c;      /* 触发 hashchange → apply */
    } else {
      apply(p);               /* 同址点击也要刷新视图（例如重复点同一 pane） */
    }
  }

  /* 捕获阶段统一接管所有 # 链接：旧锚点、新路由、搜索结果、footer 全都不失效。
     不 stopPropagation，data-cat / data-sub / data-pg 的既有筛选委托照常执行。 */
  document.addEventListener('click', function (e) {
    var a = e.target;
    while (a && a !== document && a.nodeType === 1 && a.tagName !== 'A') a = a.parentNode;
    if (!a || a === document || a.tagName !== 'A') return;
    var h = a.getAttribute('href') || '';
    if (h.charAt(0) !== '#' || h.charAt(1) === '!') return;
    if (a.hasAttribute('data-rfq')) return;
    e.preventDefault();
    go(h);
  }, true);

  window.addEventListener('hashchange', function () { apply(parse(location.hash)); });

  window.ZSY_VIEWS = { go: go, apply: apply, parse: parse };

  function init() {
    var p = parse(location.hash);
    apply(p, false);         /* 首屏不强制滚顶，保留浏览器自身位置 */
    if (location.hash && location.hash !== canonical(p)) {
      /* 旧链接进站：规范化地址栏，但不触发二次跳转。
         file:// 下 replaceState 可能抛 SecurityError，忽略即可，视图已生效。 */
      try { history.replaceState(null, '', canonical(p)); } catch (e) {}
      apply(p);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
/* V3.3 VIEWS END */


/* ==================================================================================
   V3.6 · 品牌源流导航下拉 / 实证块 / 主 CTA / 资料索取 / 窄屏询盘条
   自包含：不访问任何闭包内变量，通过触发既有按钮复用原逻辑。
   ================================================================================== */
(function(){
  var V36 = {"zh": {"hg.expand": "展开品牌故事", "hg.colTea": "茶叶 · 万里茶道", "hg.colPorc": "景德镇瓷器 · 千年窑史", "hg.colMach": "流体设备 · 选型与合规", "hg.tea": "宁红茶与双井绿茶", "hg.teaDesc": "道光年间的外销起点、1891 年俄国皇太子赠匾、宋史中的双井。", "hg.teaGo": "阅读茶叶故事 →", "hg.porc": "一座以皇帝年号命名的城市", "hg.porcDesc": "1004 年因青白瓷得名，1278 年浮梁瓷局，1369 年御器厂。", "hg.porcGo": "阅读窑史与工艺 →", "hg.mach": "按工况说话，不做无法核验的承诺", "hg.machDesc": "Q / H / P / DN 选型口径、体系要求、EAC 归属与可索取文件。", "hg.machGo": "查看选型与合规 →", "hg.all": "查看全部品牌源流 →", "res.nav": "资料索取", "res.summary": "查看可索取资料清单", "res.i1": "产品目录（按品类索取）", "res.i2": "技术参数表 / 数据表（按系列索取）", "res.i3": "资质与合规文件清单", "res.i4": "包装、装箱与运输说明", "res.note": "以上资料按询价提供，不设公开下载；我们不在网站放置未经核实的文件或编号。", "rich.title": "可查证的出处", "rich.lead": "以下每条都标明文献或来源；无法核实的说法不写。", "rich.teaTag": "茶叶", "rich.teaQ1": "「（宁）红茶起自道光季年」", "rich.teaS1": "清 · 叶湍延《纯蒲随笔》", "rich.teaQ2": "「茶盖中华、价高天下」", "rich.teaS2": "1891 年俄国皇太子赠匾 · 人民网江西频道", "rich.teaQ3": "「隆兴之黄龙、双井，皆号绝品也」", "rich.teaS3": "《宋史 · 食货志》", "rich.porcTag": "景德镇瓷器", "rich.porcQ1": "1004 年（景德年间）以青白瓷得名", "rich.porcS1": "《景德镇志略》· 景德镇市人民政府", "rich.porcQ2": "1278 年设浮梁瓷局；1369 年设御器厂", "rich.porcS2": "国家文物局 · 人民网", "rich.porcQ3": "万里茶道经恰克图抵圣彼得堡，茶与瓷器同路北上", "rich.porcS3": "国家民委 · 人民网", "rich.machTag": "流体设备", "rich.machQ1": "按 Q / H / P / DN 与 SI 单位选型", "rich.machS1": "逐型号性能曲线按系列索取", "rich.machQ2": "按 ISO 9001:2015 体系要求组织生产与检验", "rich.machS2": "描述做法，不声明持证状态", "rich.machQ3": "EAC 由俄方进口商作为申请人办理", "rich.machS3": "我方配合提供技术护照、数据表与图纸", "rich.note": "史料只在此处存一份；产品页只回流短链，About 只放可核验的资信。", "cta.kicker": "下一步", "cta.title": "把需求告诉我们，剩下的交给我们核对", "cta.sub": "选品、规格、数量、目的港与所需文件，一次说清即可。", "cta.btn": "获取报价与样品方案"}, "en": {"hg.expand": "Expand heritage", "hg.colTea": "Tea · The Great Tea Road", "hg.colPorc": "Jingdezhen · A Millennium of Kilns", "hg.colMach": "Fluid Equipment · Duty & Compliance", "hg.tea": "Ninghong Black Tea & Shuangjing Green Tea", "hg.teaDesc": "The Daoguang-era export origin, the 1891 gift plaque from the Russian Crown Prince, and Shuangjing in the Song History.", "hg.teaGo": "Read the tea story →", "hg.porc": "A city named after an emperor's reign", "hg.porcDesc": "Named for qingbai porcelain in 1004; Fuliang Porcelain Bureau in 1278; Imperial Kiln in 1369.", "hg.porcGo": "Read kiln history & crafts →", "hg.mach": "Specified by duty, with no unverifiable claims", "hg.machDesc": "Q / H / P / DN selection, system requirements, EAC responsibility and available documents.", "hg.machGo": "View selection & compliance →", "hg.all": "View all heritage →", "res.nav": "Resources", "res.summary": "Documents available on request", "res.i1": "Product catalogue (by category)", "res.i2": "Technical datasheets (by series)", "res.i3": "Qualification & compliance document list", "res.i4": "Packing, carton & shipping notes", "res.note": "All documents are supplied on request. We do not publish unverified files or certificate numbers.", "rich.title": "Verifiable sources", "rich.lead": "Every entry below cites its source; unverifiable claims are not used.", "rich.teaTag": "Tea", "rich.teaQ1": "“Ninghong tea began in the late Daoguang years”", "rich.teaS1": "Ye Tuanyan, Chunpu Suibi (Qing dynasty)", "rich.teaQ2": "“Tea surpassing all under heaven, prized above all”", "rich.teaS2": "Plaque from the Russian Crown Prince, 1891 · People's Daily Jiangxi", "rich.teaQ3": "“Huanglong and Shuangjing of Longxing are all rated supreme”", "rich.teaS3": "Song Shi · Treatise on Food and Money", "rich.porcTag": "Jingdezhen Porcelain", "rich.porcQ1": "Named for qingbai porcelain in 1004 (Jingde reign)", "rich.porcS1": "Jingdezhen Gazetteer · Jingdezhen Municipal Government", "rich.porcQ2": "Fuliang Porcelain Bureau, 1278; Imperial Kiln, 1369", "rich.porcS2": "National Cultural Heritage Administration · People's Daily", "rich.porcQ3": "The Great Tea Road reached St Petersburg via Kyakhta — tea and porcelain travelled together", "rich.porcS3": "National Ethnic Affairs Commission · People's Daily", "rich.machTag": "Fluid Equipment", "rich.machQ1": "Selection by Q / H / P / DN in SI units", "rich.machS1": "Per-model performance curves available by series", "rich.machQ2": "Production and inspection organised to ISO 9001:2015 requirements", "rich.machS2": "Describes practice; no claim of certification status", "rich.machQ3": "EAC certification is applied for by the Russian importer", "rich.machS3": "We supply technical passports, datasheets and drawings", "rich.note": "Sources are stored here once; product pages link back, and About carries verifiable corporate facts only.", "cta.kicker": "Next step", "cta.title": "Tell us the requirement; we will verify the rest", "cta.sub": "Selection, specification, quantity, destination port and documents needed — one message is enough.", "cta.btn": "Get a Quote & Sample Plan"}, "ru": {"hg.expand": "Развернуть историю", "hg.colTea": "Чай · Великий чайный путь", "hg.colPorc": "Цзиндэчжэнь · Тысячелетие печей", "hg.colMach": "Насосное оборудование · Параметры и соответствие", "hg.tea": "Чай Нинхун и зелёный чай Шуанцзин", "hg.teaDesc": "Начало экспорта в эпоху Даогуана, дарственная табличка наследника российского престола 1891 г., упоминание Шуанцзина в «Сун ши».", "hg.teaGo": "Читать историю чая →", "hg.porc": "Город, названный в честь правления императора", "hg.porcDesc": "Назван по фарфору цинбай в 1004 г.; Фулянская фарфоровая управа в 1278 г.; Императорская печь в 1369 г.", "hg.porcGo": "История печей и технологии →", "hg.mach": "Подбор по параметрам, без непроверяемых обещаний", "hg.machDesc": "Подбор по Q / H / P / DN, требования к системе, ответственность по EAC и доступные документы.", "hg.machGo": "Параметры и соответствие →", "hg.all": "Вся история бренда →", "res.nav": "Материалы", "res.summary": "Документы по запросу", "res.i1": "Каталог продукции (по категориям)", "res.i2": "Технические таблицы параметров (по сериям)", "res.i3": "Перечень квалификационных и разрешительных документов", "res.i4": "Описание упаковки, тары и перевозки", "res.note": "Все документы предоставляются по запросу. Мы не публикуем непроверенные файлы и номера сертификатов.", "rich.title": "Проверяемые источники", "rich.lead": "У каждого пункта указан источник; непроверяемые утверждения не используются.", "rich.teaTag": "Чай", "rich.teaQ1": "«Нинхунский чай берёт начало в конце эпохи Даогуан»", "rich.teaS1": "Е Туаньянь, «Чуньпу суйби» (дин. Цин)", "rich.teaQ2": "«Чай превыше всех в Поднебесной, цена выше всех»", "rich.teaS2": "Дарственная табличка наследника российского престола, 1891 · People's Daily, Цзянси", "rich.teaQ3": "«Хуанлун и Шуанцзин из Лунсина — всё высшего качества»", "rich.teaS3": "«Сун ши», раздел «Шихо чжи»", "rich.porcTag": "Фарфор Цзиндэчжэня", "rich.porcQ1": "Назван по фарфору цинбай в 1004 г. (правление Цзиндэ)", "rich.porcS1": "«Цзиндэчжэнь чжилюэ» · Народное правительство г. Цзиндэчжэнь", "rich.porcQ2": "Фулянская фарфоровая управа, 1278; Императорская печь, 1369", "rich.porcS2": "Госуправление по культурному наследию · People's Daily", "rich.porcQ3": "Великий чайный путь через Кяхту достиг Санкт-Петербурга — чай и фарфор шли одним путём", "rich.porcS3": "Госкомитет по делам национальностей · People's Daily", "rich.machTag": "Насосное оборудование", "rich.machQ1": "Подбор по Q / H / P / DN в единицах СИ", "rich.machS1": "Рабочие характеристики по сериям — по запросу", "rich.machQ2": "Производство и контроль организованы по требованиям ISO 9001:2015", "rich.machS2": "Описание практики, без заявления о действующем сертификате", "rich.machQ3": "Заявителем по EAC выступает российский импортёр", "rich.machS3": "Мы предоставляем технические паспорта, таблицы и чертежи", "rich.note": "Источники хранятся здесь в одном экземпляре; страницы товаров дают ссылку, раздел «О нас» — только проверяемые сведения.", "cta.kicker": "Следующий шаг", "cta.title": "Опишите задачу — остальное мы проверим", "cta.sub": "Подбор, спецификация, объём, порт назначения и нужные документы — достаточно одного сообщения.", "cta.btn": "Получить предложение и образцы"}};
  function lang(){
    var l = (document.documentElement.lang || 'zh').toLowerCase();
    if (l.indexOf('ru') === 0) return 'ru';
    if (l.indexOf('en') === 0) return 'en';
    return 'zh';
  }
  function apply(){
    var L = lang(), D = V36[L] || V36.zh;
    document.querySelectorAll('[data-v36]').forEach(function(el){
      var v = D[el.getAttribute('data-v36')];
      if (v == null) return;
      if (el.tagName === 'BUTTON' || el.tagName === 'SUMMARY') el.textContent = v;
      else if (el.getAttribute('aria-label') != null && el.classList.contains('navdrop-toggle')) el.setAttribute('aria-label', v);
      else el.textContent = v;
    });
    document.querySelectorAll('.navdrop-toggle[data-v36]').forEach(function(b){
      b.setAttribute('aria-label', D[b.getAttribute('data-v36')] || '');
    });
  }
  function syncPane(){
    var on = document.querySelector('#hgTabs .hg-tab.on');
    var k = on ? on.getAttribute('data-hg') : 'tea';
    document.body.setAttribute('data-hgpane', k);
  }
  /* 导航下拉：点某条故事线 → 进 Heritage 视图 → 触发页内同款 tab */
  document.addEventListener('click', function(e){
    var a = e.target.closest ? e.target.closest('[data-hgline]') : null;
    if (!a) return;
    var k = a.getAttribute('data-hgline');
    if ((location.hash || '').indexOf('#/heritage') !== 0) location.hash = '#/heritage';
    setTimeout(function(){
      var b = document.querySelector('#hgTabs [data-hg="' + k + '"]');
      if (b) b.click();
      syncPane();
    }, 80);
  });
  document.addEventListener('click', function(e){
    if (e.target.closest && e.target.closest('#hgTabs')) setTimeout(syncPane, 30);
  }, true);
  /* 资料索取：打开既有 RFQ 抽屉后，把资料类型写进需求说明 */
  document.addEventListener('click', function(e){
    var b = e.target.closest ? e.target.closest('[data-res]') : null;
    if (!b) return;
    setTimeout(function(){
      var ta = document.querySelector('.rfq-drawer textarea, #rfqNote, [data-rfq-note], textarea[name="note"]');
      var key = b.getAttribute('data-res');
      var names = {catalog:{zh:'索取产品目录',en:'Product catalogue requested',ru:'Запрос каталога продукции'},
                   datasheet:{zh:'索取技术参数表 / 数据表',en:'Technical datasheet requested',ru:'Запрос технических таблиц'},
                   certs:{zh:'索取资质与合规文件清单',en:'Compliance document list requested',ru:'Запрос перечня разрешительных документов'},
                   packing:{zh:'索取包装与运输说明',en:'Packing & shipping notes requested',ru:'Запрос описания упаковки и перевозки'}};
      if (ta && names[key]) { ta.value = (names[key][lang()] || '') + '\n' + (ta.value || ''); ta.dispatchEvent(new Event('input',{bubbles:true})); }
    }, 220);
  });
  /* 抽屉 z-index 高于窄屏固定条，天然覆盖；此处不再用 MutationObserver。
     回调内改写被观察的 style/class 会自激并冻结主线程，已移除。 */
  new MutationObserver(apply).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  window.addEventListener('hashchange', function(){ setTimeout(syncPane, 60); });
  apply(); setTimeout(syncPane, 200);
})();
