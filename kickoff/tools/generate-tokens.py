import json, collections
OD=collections.OrderedDict
prim = OD([
 ("neutral", OD([("0","#FFFFFF"),("25","#FAFBFA"),("50","#F5F7F6"),("100","#EEF1EF"),("200","#E4E8E6"),("300","#D5DBD8"),("400","#A7B0AC"),("500","#85908C"),("600","#55616A"),("700","#3E494F"),("800","#2A3338"),("900","#172024"),("950","#0D1416")])),
 ("night", OD([("50","#E4EAE7"),("100","#BAC5C0"),("300","#8E9A96"),("500","#5F6C70"),("700","#2A3539"),("750","#222D30"),("800","#1B2528"),("850","#141C1F"),("900","#0D1416")])),
 ("seal", OD([("50","#EAF4F0"),("100","#D3E8E0"),("200","#A9D1C2"),("300","#7FCBB0"),("400","#5FA88E"),("500","#2B7C65"),("600","#1D6B57"),("700","#175747"),("800","#134538"),("900","#10372D"),("950","#0A231D")])),
 ("rust", OD([("50","#FDF3EC"),("100","#FBE6D8"),("200","#F5C9AA"),("300","#F0A878"),("400","#D97B45"),("500","#C2601F"),("600","#A8480C"),("700","#8A3B08"),("800","#6E3008"),("900","#572709")])),
 ("red", OD([("50","#FCEBE9"),("100","#F6CFCB"),("200","#F4A39C"),("300","#E08F86"),("500","#D0453B"),("600","#B3261E"),("700","#8A1C12")])),
 ("ochre", OD([("50","#FBF5E6"),("100","#F6EDD4"),("200","#F2DDA4"),("300","#E8C877"),("400","#D9B95E"),("700","#6E5205")])),
 ("blue", OD([("50","#E8EFF7"),("200","#9DBCE3"),("700","#2A527E")])),
 ("tint-dark", OD([("seal","#12322A"),("rust","#3A2010"),("red","#3A1512"),("blue","#172A40"),("ochre","#33290A")])),
])
def r(p): return "{color."+p+"}"
def val(p):
    g,k=p.split(".",1); return prim[g][k]
W="neutral.0"
light = OD([
 ("bg-canvas","neutral.100"),("bg-surface",W),("bg-raised",W),("bg-sunken","neutral.50"),("bg-hover","neutral.50"),("bg-selected","seal.50"),("bg-inverse","neutral.900"),
 ("border-subtle","neutral.200"),("border-default","neutral.300"),("border-strong","neutral.500"),("border-focus","seal.500"),
 ("text-primary","neutral.900"),("text-secondary","neutral.700"),("text-muted","neutral.600"),("text-disabled","neutral.400"),("text-inverse",W),("text-link","seal.700"),("text-link-hover","seal.800"),
 ("action-primary-bg","seal.700"),("action-primary-bg-hover","seal.800"),("action-primary-bg-pressed","seal.900"),("action-primary-fg",W),
 ("action-secondary-bg",W),("action-secondary-bg-hover","neutral.50"),("action-secondary-border","neutral.500"),("action-secondary-fg","neutral.900"),
 ("action-danger-bg","red.600"),("action-danger-bg-hover","red.700"),("action-danger-fg",W),
 ("status-success-fg","seal.700"),("status-success-bg","seal.50"),("status-success-border","seal.200"),("status-success-solid","seal.600"),
 ("status-held-fg","rust.700"),("status-held-bg","rust.50"),("status-held-border","rust.200"),("status-held-solid","rust.600"),
 ("status-danger-fg","red.700"),("status-danger-bg","red.50"),("status-danger-border","red.200"),("status-danger-solid","red.600"),
 ("status-info-fg","blue.700"),("status-info-bg","blue.50"),("status-info-border","blue.200"),("status-info-solid","blue.700"),
 ("status-neutral-fg","neutral.700"),("status-neutral-bg","neutral.100"),("status-neutral-border","neutral.300"),("status-neutral-solid","neutral.600"),
 ("risk-low-fg","seal.700"),("risk-low-bg","seal.50"),("risk-medium-fg","ochre.700"),("risk-medium-bg","ochre.100"),
 ("risk-high-fg","rust.700"),("risk-high-bg","rust.100"),("risk-critical-fg","red.700"),("risk-critical-bg","red.50"),
 ("seal-intact","seal.600"),("seal-broken","rust.600"),("seal-pending","neutral.500"),("seal-revoked","red.600"),("seal-core-intact","seal.50"),("seal-core-broken","rust.100"),
 ("strip-person-bg","ochre.200"),("strip-person-fg","neutral.900"),("strip-policy-bg","red.100"),("strip-policy-fg","neutral.900"),
 ("strip-approved-bg","seal.100"),("strip-approved-fg","neutral.900"),("strip-closed-bg","neutral.200"),("strip-closed-fg","neutral.900"),
])
dark = OD([
 ("bg-canvas","night.900"),("bg-surface","night.850"),("bg-raised","night.800"),("bg-sunken","night.800"),("bg-hover","night.800"),("bg-selected","tint-dark.seal"),("bg-inverse","night.50"),
 ("border-subtle","night.750"),("border-default","night.700"),("border-strong","night.500"),("border-focus","seal.400"),
 ("text-primary","night.50"),("text-secondary","night.100"),("text-muted","night.300"),("text-disabled","night.500"),("text-inverse","night.900"),("text-link","seal.300"),("text-link-hover","seal.200"),
 ("action-primary-bg","seal.400"),("action-primary-bg-hover","seal.300"),("action-primary-bg-pressed","seal.200"),("action-primary-fg","seal.950"),
 ("action-secondary-bg","night.850"),("action-secondary-bg-hover","night.800"),("action-secondary-border","night.500"),("action-secondary-fg","night.50"),
 ("action-danger-bg","red.300"),("action-danger-bg-hover","red.200"),("action-danger-fg","night.900"),
 ("status-success-fg","seal.300"),("status-success-bg","tint-dark.seal"),("status-success-border","seal.700"),("status-success-solid","seal.400"),
 ("status-held-fg","rust.300"),("status-held-bg","tint-dark.rust"),("status-held-border","rust.700"),("status-held-solid","rust.400"),
 ("status-danger-fg","red.200"),("status-danger-bg","tint-dark.red"),("status-danger-border","red.700"),("status-danger-solid","red.300"),
 ("status-info-fg","blue.200"),("status-info-bg","tint-dark.blue"),("status-info-border","blue.700"),("status-info-solid","blue.200"),
 ("status-neutral-fg","night.100"),("status-neutral-bg","night.800"),("status-neutral-border","night.700"),("status-neutral-solid","night.300"),
 ("risk-low-fg","seal.300"),("risk-low-bg","tint-dark.seal"),("risk-medium-fg","ochre.300"),("risk-medium-bg","tint-dark.ochre"),
 ("risk-high-fg","rust.300"),("risk-high-bg","tint-dark.rust"),("risk-critical-fg","red.200"),("risk-critical-bg","tint-dark.red"),
 ("seal-intact","seal.400"),("seal-broken","rust.400"),("seal-pending","night.300"),("seal-revoked","red.300"),("seal-core-intact","tint-dark.seal"),("seal-core-broken","tint-dark.rust"),
 ("strip-person-bg","ochre.400"),("strip-person-fg","night.900"),("strip-policy-bg","red.300"),("strip-policy-fg","night.900"),
 ("strip-approved-bg","seal.400"),("strip-approved-fg","night.900"),("strip-closed-bg","night.700"),("strip-closed-fg","night.50"),
])
viz = OD([("1","#1D6B57"),("2","#2A527E"),("3","#C2601F"),("4","#7B4FA0"),("5","#3E8FA8"),("6","#A23B6B"),("7","#6E5205"),("8","#85908C")])
viz_dark = OD([("1","#5FA88E"),("2","#9DBCE3"),("3","#F0A878"),("4","#C5A3E0"),("5","#7FC4D9"),("6","#E79BBE"),("7","#E8C877"),("8","#A7B0AC")])

found = OD([
 ("font", OD([
   ("family", OD([("sans",'"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", sans-serif'),("mono",'"IBM Plex Mono", ui-monospace, "Cascadia Mono", monospace'),("arabic",'"IBM Plex Sans Arabic", "IBM Plex Sans", sans-serif')])),
   ("weight", OD([("regular",400),("medium",500),("semibold",600)])),
 ])),
 ("text", OD([
   ("display", OD([("size","32px"),("line","40px"),("weight",600),("tracking","-0.01em")])),
   ("title-1", OD([("size","28px"),("line","36px"),("weight",600),("tracking","-0.005em")])),
   ("title-2", OD([("size","20px"),("line","28px"),("weight",600),("tracking","0")])),
   ("title-3", OD([("size","16px"),("line","24px"),("weight",600),("tracking","0")])),
   ("body", OD([("size","14px"),("line","20px"),("weight",400),("tracking","0")])),
   ("body-sm", OD([("size","13px"),("line","18px"),("weight",400),("tracking","0")])),
   ("label", OD([("size","13px"),("line","18px"),("weight",500),("tracking","0")])),
   ("caption", OD([("size","12px"),("line","16px"),("weight",400),("tracking","0.005em")])),
   ("mono", OD([("size","13px"),("line","20px"),("weight",400),("tracking","0")])),
   ("mono-sm", OD([("size","12px"),("line","16px"),("weight",400),("tracking","0")])),
 ])),
 ("space", OD([("0","0px"),("0-5","2px"),("1","4px"),("2","8px"),("3","12px"),("4","16px"),("5","20px"),("6","24px"),("8","32px"),("10","40px"),("12","48px"),("16","64px")])),
 ("radius", OD([("none","0px"),("control","4px"),("panel","6px"),("overlay","8px"),("pill","9999px")])),
 ("border-width", OD([("default","1px"),("focus","2px")])),
 ("shadow", OD([("overlay","0 1px 2px rgba(23, 32, 36, 0.06), 0 4px 12px rgba(23, 32, 36, 0.10)"),("dialog","0 16px 40px rgba(23, 32, 36, 0.18)"),
               ("overlay-dark","0 1px 2px rgba(0, 0, 0, 0.40), 0 4px 12px rgba(0, 0, 0, 0.50)"),("dialog-dark","0 16px 40px rgba(0, 0, 0, 0.60)")])),
 ("motion", OD([("fast","120ms"),("base","200ms"),("slow","280ms"),("ease-standard","cubic-bezier(0.2, 0, 0, 1)"),("ease-exit","cubic-bezier(0.4, 0, 1, 1)")])),
 ("size", OD([("control-sm","32px"),("control-md","36px"),("control-lg","44px"),("row-compact","36px"),("row-comfortable","44px"),
   ("topbar","56px"),("nav","216px"),("nav-collapsed","64px"),("drawer","480px"),("drawer-wide","720px"),("dialog","480px"),("dialog-form","640px"),
   ("content-max","1440px"),("form-max","720px"),("portal-max","1120px"),("decision-panel","400px"),("icon-sm","16px"),("icon-md","20px"),
   ("strip-bay","112px"),("seal-xs","16px"),("seal-sm","24px"),("seal-md","40px"),("seal-lg","72px"),("seal-xl","96px")])),
 ("z", OD([("base",0),("sticky",10),("nav",20),("dropdown",30),("drawer",40),("dialog",50),("toast",60),("tooltip",70)])),
 ("breakpoint", OD([("sm","640px"),("md","768px"),("lg","1024px"),("xl","1280px"),("2xl","1536px")])),
])

# ---- DTCG json ----
def dt_color(v): return OD([("$type","color"),("$value",v)])
p_json = OD([("$description","AgentVault primitive colours (Seal direction). Never referenced by components directly."),("color", OD())])
for g,sc in prim.items():
    p_json["color"][g]=OD((k,dt_color(v)) for k,v in sc.items())
p_json["color"]["viz"]=OD((k,dt_color(v)) for k,v in viz.items())
p_json["color"]["viz-dark"]=OD((k,dt_color(v)) for k,v in viz_dark.items())
def sem_json(m,name):
    return OD([("$description",f"AgentVault semantic colours, {name} theme. Components use only these."),("color", OD((k,dt_color(r(v))) for k,v in m.items()))])
json.dump(p_json,open("tokens/primitives.json","w"),indent=2)
json.dump(sem_json(light,"light"),open("tokens/semantic.light.json","w"),indent=2)
json.dump(sem_json(dark,"dark"),open("tokens/semantic.dark.json","w"),indent=2)
def typ(v):
    if isinstance(v,int): return "number"
    return "dimension" if str(v).endswith(("px","em","ms")) else "string"
def to_dt(o):
    if isinstance(o,dict): return OD((k,to_dt(v)) for k,v in o.items())
    return OD([("$value",o)])
json.dump(OD([("$description","AgentVault foundation tokens: type, space, radius, shadow, motion, size, z-index, breakpoints.")]+list(to_dt(found).items())),open("tokens/foundation.json","w"),indent=2)

# ---- CSS ----
L=[]
L.append("/* GENERATED by packages/tokens/build.mjs from packages/tokens/src/*.json. Do not edit by hand. */")
L.append("/* Reference output: the build must reproduce this file exactly (test: tokens.snapshot.test). */\n")
L.append(":root {")
L.append("  color-scheme: light;")
for g,sc in prim.items():
    for k,v in sc.items(): L.append(f"  --av-{g}-{k.replace('.','_')}: {v};")
for k,v in viz.items(): L.append(f"  --av-viz-{k}: {v};")
for k,v in light.items():
    g,s=v.split(".",1); L.append(f"  --av-{k}: var(--av-{g}-{s});")
for k,v in found["font"]["family"].items(): L.append(f"  --av-font-{k}: {v};")
for k,v in found["text"].items():
    L.append(f"  --av-text-{k}-size: {v['size']}; --av-text-{k}-line: {v['line']}; --av-text-{k}-weight: {v['weight']}; --av-text-{k}-tracking: {v['tracking']};")
for k,v in found["radius"].items(): L.append(f"  --av-radius-{k}: {v};")
L.append(f"  --av-shadow-overlay: {found['shadow']['overlay']};")
L.append(f"  --av-shadow-dialog: {found['shadow']['dialog']};")
for k,v in found["motion"].items(): L.append(f"  --av-motion-{k}: {v};")
for k,v in found["size"].items(): L.append(f"  --av-size-{k}: {v};")
for k,v in found["z"].items(): L.append(f"  --av-z-{k}: {v};")
L.append("}\n")
L.append('[data-theme="dark"] {')
L.append("  color-scheme: dark;")
for k,v in dark.items():
    g,s=v.split(".",1); L.append(f"  --av-{k}: var(--av-{g}-{s});")
for k,v in viz_dark.items(): L.append(f"  --av-viz-{k}: {v};")
L.append(f"  --av-shadow-overlay: {found['shadow']['overlay-dark']};")
L.append(f"  --av-shadow-dialog: {found['shadow']['dialog-dark']};")
L.append("}\n")
L.append("@media (prefers-reduced-motion: reduce) {\n  :root { --av-motion-fast: 0ms; --av-motion-base: 0ms; --av-motion-slow: 0ms; }\n}")
open("reference/tokens.css","w").write("\n".join(L)+"\n")

# ---- Tailwind v4 theme mapping ----
T=[]
T.append("/* packages/ui/src/styles/tailwind-theme.css: Tailwind v4 mapping. Hand-written once, then fixed. */")
T.append('@import "tailwindcss";')
T.append('@import "@agentvault/tokens/tokens.css";\n')
T.append('@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));\n')
T.append("@theme inline {")
T.append("  /* remove Tailwind defaults so only AgentVault values exist */")
T.append("  --color-*: initial;\n  --font-*: initial;\n  --text-*: initial;\n  --radius-*: initial;\n  --shadow-*: initial;\n  --breakpoint-*: initial;\n")
T.append("  --color-transparent: transparent;\n  --color-current: currentColor;")
def tw(k):
    if k.startswith("bg-"): return k[3:]
    if k=="border-default": return "edge"
    if k.startswith("border-"): return "edge-"+k[7:] if k!="border-focus" else "focus"
    if k=="text-primary": return "ink"
    if k in ("text-link","text-link-hover"): return k[5:]
    if k.startswith("text-"): return "ink-"+k[5:]
    return k
TWMAP=[(k,tw(k)) for k in light]
for k,n in TWMAP: T.append(f"  --color-{n}: var(--av-{k});")
for k in viz: T.append(f"  --color-viz-{k}: var(--av-viz-{k});")
T.append("\n  --font-sans: var(--av-font-sans);\n  --font-mono: var(--av-font-mono);\n")
for k in found["text"]:
    T.append(f"  --text-{k}: var(--av-text-{k}-size);\n  --text-{k}--line-height: var(--av-text-{k}-line);\n  --text-{k}--font-weight: var(--av-text-{k}-weight);\n  --text-{k}--letter-spacing: var(--av-text-{k}-tracking);")
T.append("\n  --spacing: 4px;\n")
for k in found["radius"]: T.append(f"  --radius-{k}: var(--av-radius-{k});")
T.append("  --shadow-overlay: var(--av-shadow-overlay);\n  --shadow-dialog: var(--av-shadow-dialog);\n")
for k,v in found["breakpoint"].items(): T.append(f"  --breakpoint-{k}: {v};")
T.append("\n  --ease-standard: var(--av-motion-ease-standard);\n  --ease-exit: var(--av-motion-ease-exit);")
T.append("}\n")
T.append("@layer base {\n  html { font-family: var(--av-font-sans); font-size: 14px; line-height: 20px; color: var(--av-text-primary); background: var(--av-bg-canvas); -webkit-font-smoothing: antialiased; }\n  :focus-visible { outline: 2px solid var(--av-border-focus); outline-offset: 2px; }\n  .tabular, td, th { font-variant-numeric: tabular-nums; }\n  :lang(ar) { font-family: var(--av-font-arabic); }\n}")
open("reference/tailwind-theme.css","w").write("\n".join(T)+"\n")
print(len(light),len(dark),"semantic tokens")
json.dump(dict(TWMAP),open("reference/tailwind-names.json","w"),indent=2)

# ---- human-readable TOKENS.md ----
M=["# AgentVault design tokens (Seal direction)","",
"Source of truth: `tokens/*.json` (W3C Design Tokens format). This page is a readable copy. All text pairs meet WCAG 2.2 AA (4.5:1), and input borders, focus rings and seal strokes meet 3:1, in both themes.","",
"## Semantic colours","","| Token (CSS `--av-…`) | Tailwind name | Light | Dark |","|---|---|---|---|"]
for k in light:
    M.append(f"| `{k}` | `{dict(TWMAP)[k]}` | {val(light[k])} ({light[k]}) | {val(dark[k])} ({dark[k]}) |")
M+=["","## Primitive scales","","| Scale | Steps |","|---|---|"]
for g,sc in prim.items(): M.append(f"| {g} | "+", ".join(f"{k} {v}" for k,v in sc.items())+" |")
M.append("| viz (light) | "+", ".join(f"{k} {v}" for k,v in viz.items())+" |")
M.append("| viz (dark) | "+", ".join(f"{k} {v}" for k,v in viz_dark.items())+" |")
M+=["","## Type","","Families: IBM Plex Sans (UI), IBM Plex Mono (hashes, IDs, URLs, code only), IBM Plex Sans Arabic (Arabic locale).","","| Style | Size / line | Weight | Tracking |","|---|---|---|---|"]
for k,v in found["text"].items(): M.append(f"| {k} | {v['size']} / {v['line']} | {v['weight']} | {v['tracking']} |")
M+=["","## Space, radius, shadow, motion, z-index","",
"- **Space** (Tailwind step = px): "+", ".join(f"{k.replace('-','.')} = {v}" for k,v in found["space"].items()),
"- **Radius:** "+", ".join(f"{k} {v}" for k,v in found["radius"].items()),
"- **Border width:** default 1px, focus 2px (offset 2px)",
"- **Shadow (overlays only):** overlay `"+found["shadow"]["overlay"]+"`; dialog `"+found["shadow"]["dialog"]+"`; dark theme uses the `-dark` variants",
"- **Motion:** "+", ".join(f"{k} {v}" for k,v in found["motion"].items())+"; reduced motion sets durations to 0",
"- **Z-index:** "+", ".join(f"{k} {v}" for k,v in found["z"].items()),
"- **Breakpoints:** "+", ".join(f"{k} {v}" for k,v in found["breakpoint"].items()),
"","## Sizes","","| Token | Value |","|---|---|"]
for k,v in found["size"].items(): M.append(f"| size-{k} | {v} |")
open("TOKENS.md","w").write("\n".join(M)+"\n")
