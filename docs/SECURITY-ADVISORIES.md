# Security advisories – prompto

Ultimo controllo: **2026-10-24** (analisi automatica dipendenze npm da lockfile).
Criteri: solo vulnerabilità con CVSS ≥ 7 o presenti nel catalogo CISA KEV, che colpiscono la versione esatta installata nel lockfile, con fix disponibile, verificate su almeno due fonti ufficiali (GitHub Advisory Database + NVD e/o advisory del progetto).

Legenda ambito: **prod** = dipendenza di runtime; **dev** = solo sviluppo/build.


## Riepilogo

| Pacchetto | Versione installata | Ambito | N. advisory | Gravità max | Versione corretta minima | Stato |
|---|---|---|---|---|---|---|
| `proxy-addr` | 2.0.7 | prod | 1 | CRITICA (9.1) | 2.0.8 | aperto |
| `axios` | 1.13.2 | prod | 14 | ALTA (8.7) | 1.20.0 | aperto |
| `form-data` | 4.0.5 | prod | 1 | ALTA (8.7) | 4.0.6 | aperto |
| `multer` | 2.0.2 | prod | 7 | ALTA (8.7) | 2.5.0 | aperto |
| `builder-util-runtime` | 9.3.1 | prod | 1 | ALTA (8.2) | 9.7.0 | aperto |
| `body-parser` | 1.20.4 | prod | 1 | ALTA (7.5) | 1.20.9 | aperto |
| `compression` | 1.8.1 | prod | 1 | ALTA (7.5) | 1.8.2 | aperto |
| `js-yaml` | 4.1.1 | prod | 3 | ALTA (7.5) | 4.3.2 | aperto |
| `path-to-regexp` | 0.1.12 | prod | 1 | ALTA (7.5) | 0.1.13 | aperto |
| `uuid` | 11.1.0 | prod | 1 | ALTA (7.5) | 11.1.1 | aperto |
| `shell-quote` | 1.8.3 | dev | 2 | CRITICA (9.2) | 1.9.0 | aperto |
| `tar` | 6.2.1 | dev | 9 | CRITICA (9.2) | 7.5.21 | aperto |
| `flatted` | 3.3.3 | dev | 2 | ALTA (8.9) | 3.4.2 | aperto |
| `rollup` | 4.53.3 | dev | 1 | ALTA (8.8) | 4.59.0 | aperto |
| `@isaacs/brace-expansion` | 5.0.0 | dev | 1 | ALTA (8.7) | 5.0.1 | aperto |
| `@xmldom/xmldom` | 0.8.11 | dev | 13 | ALTA (8.7) | 0.8.15 | aperto |
| `joi` | 18.0.2 | dev | 1 | ALTA (8.7) | 18.2.6 | aperto |
| `minimatch` | 10.1.1 | dev | 3 | ALTA (8.7) | 10.2.3 | aperto |
| `minimatch` | 3.1.2 | dev | 3 | ALTA (8.7) | 3.1.4 | aperto |
| `minimatch` | 5.1.6 | dev | 3 | ALTA (8.7) | 5.1.8 | aperto |
| `minimatch` | 9.0.5 | dev | 3 | ALTA (8.7) | 9.0.7 | aperto |
| `source-map-js` | 1.2.1 | dev | 1 | ALTA (8.7) | 1.2.2 | aperto |
| `electron` | 39.2.6 | dev | 13 | ALTA (8.3) | 42.11.16 | aperto |
| `nanoid` | 3.3.11 | dev | 3 | ALTA (8.2) | 3.3.18 | aperto |
| `vite` | 6.4.1 | dev | 3 | ALTA (8.2) | 6.4.4 | aperto |
| `lodash` | 4.17.21 | dev | 1 | ALTA (8.1) | 4.18.0 | aperto |
| `app-builder-lib` | 26.0.12 | dev | 1 | ALTA (7.8) | 26.15.0 | aperto |
| `brace-expansion` | 1.1.12 | dev | 5 | ALTA (7.7) | 1.1.20 | aperto |
| `brace-expansion` | 2.0.2 | dev | 5 | ALTA (7.7) | 2.1.6 | aperto |
| `ip-address` | 10.1.0 | dev | 1 | ALTA (7.7) | 10.3.1 | aperto |
| `tmp` | 0.2.5 | dev | 1 | ALTA (7.7) | 0.2.6 | aperto |
| `browserslist` | 4.28.1 | dev | 2 | ALTA (7.5) | 4.28.7 | aperto |
| `picomatch` | 2.3.1 | dev | 1 | ALTA (7.5) | 2.3.2 | aperto |
| `picomatch` | 4.0.3 | dev | 1 | ALTA (7.5) | 4.0.4 | aperto |
| `postcss` | 8.5.6 | dev | 2 | ALTA (7.5) | 8.5.18 | aperto |

## Dettaglio

### `proxy-addr` 2.0.7 (prod)

File: `package-lock.json`

**Azione consigliata:** aggiornare `proxy-addr` almeno a **2.0.8** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-jqcg-44mw-7w3h** / CVE-2026-90711 — gravità CRITICA (CVSS 9.1)
  - Problema: proxy-addr vulnerable to IP spoofing via IPv4-mapped IPv6 trust subnet
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 2.0.8
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-jqcg-44mw-7w3h) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-90711) · [Progetto](https://github.com/jshttp/proxy-addr/security/advisories/GHSA-jqcg-44mw-7w3h)
  - Stato: aperto

### `axios` 1.13.2 (prod)

File: `client/package-lock.json`, `package-lock.json`

**Azione consigliata:** aggiornare `axios` almeno a **1.20.0** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-35jp-ww65-95wh** / CVE-2026-44494 — gravità ALTA (CVSS 8.7)
  - Problema: axios Vulnerable to Full Man-in-the-Middle via Prototype Pollution Gadget in `config.proxy`
  - Impatto: Prototype pollution: input malevolo può alterare oggetti JavaScript e il comportamento dell’applicazione.
  - Versione corretta: 1.16.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-35jp-ww65-95wh) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-44494) · [Progetto](https://github.com/axios/axios/security/advisories/GHSA-35jp-ww65-95wh)
  - Stato: aperto
- **GHSA-542g-h47m-68v8** / CVE-2026-101901 — gravità ALTA (CVSS 8.2)
  - Problema: Axios: Denial of Service via Unhandled 'error' Event in HTTP/2 ClientHttp2Session Initialization
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 1.20.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-542g-h47m-68v8) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-101901) · [Progetto](https://github.com/axios/axios/security/advisories/GHSA-542g-h47m-68v8)
  - Stato: aperto
- **GHSA-p92q-9vqr-4j8v** / CVE-2026-44487 — gravità ALTA (CVSS 8.2)
  - Problema: Axios: Proxy-Authorization Credential Leak to Origin Server Across HTTP-to-HTTPS Redirect in Axios Node.js HTTP Adapter
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 1.16.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-p92q-9vqr-4j8v) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-44487) · [Progetto](https://github.com/axios/axios/security/advisories/GHSA-p92q-9vqr-4j8v)
  - Stato: aperto
- **GHSA-43fc-jf86-j433** / CVE-2026-25639 — gravità ALTA (CVSS 7.5)
  - Problema: Axios is Vulnerable to Denial of Service via __proto__ Key in mergeConfig
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 1.13.5
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-43fc-jf86-j433) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-25639) · [Progetto](https://github.com/axios/axios/security/advisories/GHSA-43fc-jf86-j433)
  - Stato: aperto
- **GHSA-62hf-57xw-28j9** / CVE-2026-42039 — gravità ALTA (CVSS 7.5)
  - Problema: Axios: unbounded recursion in toFormData causes DoS via deeply nested request data
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 1.15.1
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-62hf-57xw-28j9) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-42039) · [Progetto](https://github.com/axios/axios/security/advisories/GHSA-62hf-57xw-28j9)
  - Stato: aperto
- **GHSA-777c-7fjr-54vf** / CVE-2026-44488 — gravità ALTA (CVSS 7.5)
  - Problema: Allocation of Resources Without Limits or Throttling in Axios
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 1.16.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-777c-7fjr-54vf) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-44488) · [Progetto](https://github.com/axios/axios/security/advisories/GHSA-777c-7fjr-54vf)
  - Stato: aperto
- **GHSA-hfxv-24rg-xrqf** / CVE-2026-44496 — gravità ALTA (CVSS 7.5)
  - Problema: Axios: Regular Expression Denial of Service (ReDoS) via Cookie Name Injection
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 1.16.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-hfxv-24rg-xrqf) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-44496) · [Progetto](https://github.com/axios/axios/security/advisories/GHSA-hfxv-24rg-xrqf)
  - Stato: aperto
- **GHSA-j5f8-grm9-p9fc** / CVE-2026-44486 — gravità ALTA (CVSS 7.5)
  - Problema: Axios: Proxy-Authorization header leaks to redirect target when proxy is re-evaluated to direct connection
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 1.16.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-j5f8-grm9-p9fc) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-44486) · [Progetto](https://github.com/axios/axios/security/advisories/GHSA-j5f8-grm9-p9fc)
  - Stato: aperto
- **GHSA-6chq-wfr3-2hj9** / CVE-2026-42035 — gravità ALTA (CVSS 7.4)
  - Problema: Axios: Header Injection via Prototype Pollution
  - Impatto: Prototype pollution: input malevolo può alterare oggetti JavaScript e il comportamento dell’applicazione.
  - Versione corretta: 1.15.1
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-6chq-wfr3-2hj9) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-42035) · [Progetto](https://github.com/axios/axios/security/advisories/GHSA-6chq-wfr3-2hj9)
  - Stato: aperto
- **GHSA-pf86-5x62-jrwf** / CVE-2026-42033 — gravità ALTA (CVSS 7.4)
  - Problema: Axios: Prototype Pollution Gadgets - Response Tampering, Data Exfiltration, and Request Hijacking
  - Impatto: Prototype pollution: input malevolo può alterare oggetti JavaScript e il comportamento dell’applicazione.
  - Versione corretta: 1.15.1
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-pf86-5x62-jrwf) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-42033) · [Progetto](https://github.com/axios/axios/security/advisories/GHSA-pf86-5x62-jrwf)
  - Stato: aperto
- **GHSA-q8qp-cvcw-x6jj** / CVE-2026-42264 — gravità ALTA (CVSS 7.4)
  - Problema: Axios has prototype pollution read-side gadgets in HTTP adapter that allow credential injection and request hijacking
  - Impatto: Prototype pollution: input malevolo può alterare oggetti JavaScript e il comportamento dell’applicazione.
  - Versione corretta: 1.15.2
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-q8qp-cvcw-x6jj) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-42264) · [Progetto](https://github.com/axios/axios/security/advisories/GHSA-q8qp-cvcw-x6jj)
  - Stato: aperto
- **GHSA-pmwg-cvhr-8vh7** / CVE-2026-42043 — gravità ALTA (CVSS 7.2)
  - Problema: Axios: Incomplete Fix for CVE-2025-62718 — NO_PROXY Protection Bypassed via RFC 1122 Loopback Subnet (127.0.0.0/8) in Axios 1.15.0
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 1.15.1
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-pmwg-cvhr-8vh7) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-42043) · [Progetto](https://github.com/axios/axios/security/advisories/GHSA-pmwg-cvhr-8vh7)
  - Stato: aperto
- **GHSA-3g43-6gmg-66jw** / CVE-2026-44495 — gravità ALTA (CVSS 7.0)
  - Problema: axios Vulnerable to Credential Theft and Response Hijacking via Prototype Pollution Gadget in Config Merge
  - Impatto: Prototype pollution: input malevolo può alterare oggetti JavaScript e il comportamento dell’applicazione.
  - Versione corretta: 1.15.2
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-3g43-6gmg-66jw) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-44495) · [Progetto](https://github.com/axios/axios/security/advisories/GHSA-3g43-6gmg-66jw)
  - Stato: aperto
- **GHSA-3pq3-5fj3-cg6v** / CVE-2026-101898 — gravità ALTA (CVSS 7.0)
  - Problema: Axios: HTTP/2 adapter bypasses configured DNS lookup and proxy controls
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 1.20.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-3pq3-5fj3-cg6v) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-101898) · [Progetto](https://github.com/axios/axios/security/advisories/GHSA-3pq3-5fj3-cg6v)
  - Stato: aperto

### `form-data` 4.0.5 (prod)

File: `client/package-lock.json`, `package-lock.json`

**Azione consigliata:** aggiornare `form-data` almeno a **4.0.6** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-hmw2-7cc7-3qxx** / CVE-2026-12143 — gravità ALTA (CVSS 8.7)
  - Problema: form-data: CRLF injection in form-data via unescaped multipart field names and filenames
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 4.0.6
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-hmw2-7cc7-3qxx) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-12143) · [Progetto](https://github.com/form-data/form-data/security/advisories/GHSA-hmw2-7cc7-3qxx)
  - Stato: aperto

### `multer` 2.0.2 (prod)

File: `package-lock.json`

**Azione consigliata:** aggiornare `multer` almeno a **2.5.0** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-5528-5vmv-3xc2** / CVE-2026-3520 — gravità ALTA (CVSS 8.7)
  - Problema: Multer Vulnerable to Denial of Service via Uncontrolled Recursion
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 2.1.1
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-5528-5vmv-3xc2) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-3520) · [Progetto](https://github.com/expressjs/multer/security/advisories/GHSA-5528-5vmv-3xc2)
  - Stato: aperto
- **GHSA-v52c-386h-88mc** / CVE-2026-2359 — gravità ALTA (CVSS 8.7)
  - Problema: Multer vulnerable to Denial of Service via resource exhaustion
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 2.1.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-v52c-386h-88mc) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-2359) · [Progetto](https://github.com/expressjs/multer/security/advisories/GHSA-v52c-386h-88mc)
  - Stato: aperto
- **GHSA-xf7r-hgr6-v32p** / CVE-2026-3304 — gravità ALTA (CVSS 8.7)
  - Problema: Multer vulnerable to Denial of Service via incomplete cleanup
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 2.1.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-xf7r-hgr6-v32p) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-3304) · [Progetto](https://github.com/expressjs/multer/security/advisories/GHSA-xf7r-hgr6-v32p)
  - Stato: aperto
- **GHSA-535w-7cp7-47q4** / CVE-2026-82333 — gravità ALTA (CVSS 7.5)
  - Problema: multer vulnerable to Denial of Service via oversized array index in field names
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 2.3.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-535w-7cp7-47q4) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-82333) · [Progetto](https://github.com/expressjs/multer/security/advisories/GHSA-535w-7cp7-47q4)
  - Stato: aperto
- **GHSA-72gw-mp4g-v24j** / CVE-2026-5079 — gravità ALTA (CVSS 7.5)
  - Problema: Multer vulnerable to Denial of Service via deeply nested field names
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 2.2.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-72gw-mp4g-v24j) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-5079) · [Progetto](https://github.com/expressjs/multer/security/advisories/GHSA-72gw-mp4g-v24j)
  - Stato: aperto
- **GHSA-q7qp-rjg7-q26m** / CVE-2026-113872 — gravità ALTA (CVSS 7.5)
  - Problema: multer vulnerable to Denial of Service via a pending asynchronous fileFilter after request teardown
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 2.5.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-q7qp-rjg7-q26m) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-113872) · [Progetto](https://github.com/expressjs/multer/security/advisories/GHSA-q7qp-rjg7-q26m)
  - Stato: aperto
- **GHSA-wc9g-mqfw-jrwm** / CVE-2026-77078 — gravità ALTA (CVSS 7.5)
  - Problema: multer vulnerable to Denial of Service via crafted multipart field names
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 2.3.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-wc9g-mqfw-jrwm) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-77078) · [Progetto](https://github.com/expressjs/multer/security/advisories/GHSA-wc9g-mqfw-jrwm)
  - Stato: aperto

### `builder-util-runtime` 9.3.1 (prod)

File: `package-lock.json`

**Azione consigliata:** aggiornare `builder-util-runtime` almeno a **9.7.0** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-p2f4-r6v6-j797** / CVE-2026-54673 — gravità ALTA (CVSS 8.2)
  - Problema: electron-updater: Cross-origin redirect leaks `PRIVATE-TOKEN` and mixed-case `Authorization` credentials in `builder-util-runtime`
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 9.7.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-p2f4-r6v6-j797) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-54673) · [Progetto](https://github.com/electron-userland/electron-builder/security/advisories/GHSA-p2f4-r6v6-j797)
  - Stato: aperto

### `body-parser` 1.20.4 (prod)

File: `package-lock.json`

**Azione consigliata:** aggiornare `body-parser` almeno a **1.20.9** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-27r3-jxmh-p828** / CVE-2026-111181 — gravità ALTA (CVSS 7.5)
  - Problema: body-parser vulnerable to Denial of Service via trailing bytes after a compressed request body
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 1.20.9
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-27r3-jxmh-p828) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-111181) · [Progetto](https://github.com/expressjs/body-parser/security/advisories/GHSA-27r3-jxmh-p828)
  - Stato: aperto

### `compression` 1.8.1 (prod)

File: `package-lock.json`

**Azione consigliata:** aggiornare `compression` almeno a **1.8.2** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-vc2v-76pw-4v95** / CVE-2026-87776 — gravità ALTA (CVSS 7.5)
  - Problema: compression vulnerable to Denial of Service via memory leak on premature response close
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 1.8.2
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-vc2v-76pw-4v95) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-87776) · [Progetto](https://github.com/expressjs/compression/security/advisories/GHSA-vc2v-76pw-4v95)
  - Stato: aperto

### `js-yaml` 4.1.1 (prod)

File: `client/package-lock.json`, `package-lock.json`

**Azione consigliata:** aggiornare `js-yaml` almeno a **4.3.2** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-2883-xcg3-v3hh** / CVE-2026-84375 — gravità ALTA (CVSS 7.5)
  - Problema: js-yaml: maxTotalMergeKeys does not limit CPU use for empty merge sources
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 4.3.2
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-2883-xcg3-v3hh) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-84375) · [Progetto](https://github.com/nodeca/js-yaml/security/advisories/GHSA-2883-xcg3-v3hh)
  - Stato: aperto
- **GHSA-52cp-r559-cp3m** / CVE-2026-59869 — gravità ALTA (CVSS 7.5)
  - Problema: js-yaml: YAML merge-key chains can force quadratic CPU consumption
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 4.3.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-52cp-r559-cp3m) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-59869) · [Progetto](https://github.com/nodeca/js-yaml/security/advisories/GHSA-52cp-r559-cp3m)
  - Stato: aperto
- **GHSA-5p4m-2wfm-xmqj** — gravità ALTA (CVSS 7.5)
  - Problema: JS-YAML: Quadratic CPU consumption in !!omap resolution (3.x and 4.x) — CVE-2026-59870 fix not backported
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 4.3.1
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj) · [Progetto](https://github.com/nodeca/js-yaml/security/advisories/GHSA-5p4m-2wfm-xmqj)
  - Stato: aperto

### `path-to-regexp` 0.1.12 (prod)

File: `package-lock.json`

**Azione consigliata:** aggiornare `path-to-regexp` almeno a **0.1.13** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-37ch-88jc-xwx2** / CVE-2024-45296, CVE-2026-4867 — gravità ALTA (CVSS 7.5)
  - Problema: path-to-regexp vulnerable to Regular Expression Denial of Service via multiple route parameters
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 0.1.13
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-37ch-88jc-xwx2) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2024-45296) · [Progetto](https://github.com/pillarjs/path-to-regexp/security/advisories/GHSA-37ch-88jc-xwx2)
  - Stato: aperto

### `uuid` 11.1.0 (prod)

File: `package-lock.json`

**Azione consigliata:** aggiornare `uuid` almeno a **11.1.1** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-w5hq-g745-h8pq** / CVE-2026-41907, CVE-2026-41988 — gravità ALTA (CVSS 7.5)
  - Problema: uuid: Missing buffer bounds check in v3/v5/v6 when buf is provided
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 11.1.1
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-w5hq-g745-h8pq) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-41907) · [Progetto](https://github.com/uuidjs/uuid/security/advisories/GHSA-w5hq-g745-h8pq)
  - Stato: aperto

### `shell-quote` 1.8.3 (dev)

File: `package-lock.json`

**Azione consigliata:** aggiornare `shell-quote` almeno a **1.9.0** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-w7jw-789q-3m8p** / CVE-2026-9277 — gravità CRITICA (CVSS 9.2)
  - Problema: shell-quote quote() does not escape newlines in object .op values
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 1.8.4
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-w7jw-789q-3m8p) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-9277) · [Progetto](https://github.com/ljharb/shell-quote/security/advisories/GHSA-w7jw-789q-3m8p)
  - Stato: aperto
- **GHSA-395f-4hp3-45gv** / CVE-2026-13311 — gravità ALTA (CVSS 8.7)
  - Problema: shell-quote: Quadratic-complexity Denial of Service in `parse()` (CWE-407)
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 1.9.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-395f-4hp3-45gv) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-13311) · [Progetto](https://github.com/ljharb/shell-quote/security/advisories/GHSA-395f-4hp3-45gv)
  - Stato: aperto

### `tar` 6.2.1 (dev)

File: `package-lock.json`

**Azione consigliata:** aggiornare `tar` almeno a **7.5.21** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-23hp-3jrh-7fpw** / CVE-2026-59873 — gravità CRITICA (CVSS 9.2)
  - Problema: node-tar: Decompression/parse DoS via unlimited input
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 7.5.19
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-23hp-3jrh-7fpw) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-59873) · [Progetto](https://github.com/isaacs/node-tar/security/advisories/GHSA-23hp-3jrh-7fpw)
  - Stato: aperto
- **GHSA-r6q2-hw4h-h46w** / CVE-2026-23950 — gravità ALTA (CVSS 8.8)
  - Problema: Race Condition in node-tar Path Reservations via Unicode Ligature Collisions on macOS APFS
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 7.5.4
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-r6q2-hw4h-h46w) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-23950) · [Progetto](https://github.com/isaacs/node-tar/security/advisories/GHSA-r6q2-hw4h-h46w)
  - Stato: aperto
- **GHSA-8x88-c5mf-7j5w** / CVE-2026-59874 — gravità ALTA (CVSS 8.7)
  - Problema: node-tar: Negative tar entry size causes infinite loop in archive replace
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 7.5.18
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-8x88-c5mf-7j5w) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-59874) · [Progetto](https://github.com/isaacs/node-tar/security/advisories/GHSA-8x88-c5mf-7j5w)
  - Stato: aperto
- **GHSA-34x7-hfp2-rc4v** / CVE-2026-24842 — gravità ALTA (CVSS 8.2)
  - Problema: node-tar Vulnerable to Arbitrary File Creation/Overwrite via Hardlink Path Traversal
  - Impatto: Possibile lettura/scrittura di file fuori dalle cartelle previste.
  - Versione corretta: 7.5.7
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-34x7-hfp2-rc4v) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-24842) · [Progetto](https://github.com/isaacs/node-tar/security/advisories/GHSA-34x7-hfp2-rc4v)
  - Stato: aperto
- **GHSA-8qq5-rm4j-mr97** / CVE-2026-23745 — gravità ALTA (CVSS 8.2)
  - Problema: node-tar is Vulnerable to Arbitrary File Overwrite and Symlink Poisoning via Insufficient Path Sanitization
  - Impatto: Possibile lettura/scrittura di file fuori dalle cartelle previste.
  - Versione corretta: 7.5.3
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-8qq5-rm4j-mr97) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-23745) · [Progetto](https://github.com/isaacs/node-tar/security/advisories/GHSA-8qq5-rm4j-mr97)
  - Stato: aperto
- **GHSA-9ppj-qmqm-q256** / CVE-2026-31802 — gravità ALTA (CVSS 8.2)
  - Problema: node-tar Symlink Path Traversal via Drive-Relative Linkpath
  - Impatto: Possibile lettura/scrittura di file fuori dalle cartelle previste.
  - Versione corretta: 7.5.11
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-9ppj-qmqm-q256) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-31802) · [Progetto](https://github.com/isaacs/node-tar/security/advisories/GHSA-9ppj-qmqm-q256)
  - Stato: aperto
- **GHSA-qffp-2rhf-9h96** / CVE-2026-29786 — gravità ALTA (CVSS 8.2)
  - Problema: tar has Hardlink Path Traversal via Drive-Relative Linkpath
  - Impatto: Possibile lettura/scrittura di file fuori dalle cartelle previste.
  - Versione corretta: 7.5.10
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-qffp-2rhf-9h96) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-29786) · [Progetto](https://github.com/isaacs/node-tar/security/advisories/GHSA-qffp-2rhf-9h96)
  - Stato: aperto
- **GHSA-r292-9mhp-454m** / CVE-2026-73566 — gravità ALTA (CVSS 7.5)
  - Problema: node-tar: Uncontrolled recursion in mapHas/filesFilter allows uncatchable stack-overflow DoS via crafted long-path tar with member selection
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 7.5.21
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-r292-9mhp-454m) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-73566) · [Progetto](https://github.com/isaacs/node-tar/security/advisories/GHSA-r292-9mhp-454m)
  - Stato: aperto
- **GHSA-83g3-92jg-28cx** / CVE-2026-26960 — gravità ALTA (CVSS 7.1)
  - Problema: Arbitrary File Read/Write via Hardlink Target Escape Through Symlink Chain in node-tar Extraction
  - Impatto: Possibile lettura/scrittura di file fuori dalle cartelle previste.
  - Versione corretta: 7.5.8
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-83g3-92jg-28cx) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-26960) · [Progetto](https://github.com/isaacs/node-tar/security/advisories/GHSA-83g3-92jg-28cx)
  - Stato: aperto

### `flatted` 3.3.3 (dev)

File: `client/package-lock.json`

**Azione consigliata:** aggiornare `flatted` almeno a **3.4.2** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-rf6f-7fwh-wjgh** / CVE-2026-33228 — gravità ALTA (CVSS 8.9)
  - Problema: Prototype Pollution via parse() in NodeJS flatted
  - Impatto: Prototype pollution: input malevolo può alterare oggetti JavaScript e il comportamento dell’applicazione.
  - Versione corretta: 3.4.2
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-rf6f-7fwh-wjgh) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-33228) · [Progetto](https://github.com/WebReflection/flatted/security/advisories/GHSA-rf6f-7fwh-wjgh)
  - Stato: aperto
- **GHSA-25h7-pfq9-p65f** / CVE-2026-32141 — gravità ALTA (CVSS 7.5)
  - Problema: flatted vulnerable to unbounded recursion DoS in parse() revive phase
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 3.4.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-25h7-pfq9-p65f) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-32141) · [Progetto](https://github.com/WebReflection/flatted/security/advisories/GHSA-25h7-pfq9-p65f)
  - Stato: aperto

### `rollup` 4.53.3 (dev)

File: `client/package-lock.json`

**Azione consigliata:** aggiornare `rollup` almeno a **4.59.0** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-mw96-cpmx-2vgc** / CVE-2026-27606 — gravità ALTA (CVSS 8.8)
  - Problema: Rollup 4 has Arbitrary File Write via Path Traversal
  - Impatto: Possibile lettura/scrittura di file fuori dalle cartelle previste.
  - Versione corretta: 4.59.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-mw96-cpmx-2vgc) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-27606) · [Progetto](https://github.com/rollup/rollup/security/advisories/GHSA-mw96-cpmx-2vgc)
  - Stato: aperto

### `@isaacs/brace-expansion` 5.0.0 (dev)

File: `package-lock.json`

**Azione consigliata:** aggiornare `@isaacs/brace-expansion` almeno a **5.0.1** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-7h2j-956f-4vf2** / CVE-2026-25547 — gravità ALTA (CVSS 8.7)
  - Problema: @isaacs/brace-expansion has Uncontrolled Resource Consumption
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 5.0.1
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-7h2j-956f-4vf2) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-25547) · [Progetto](https://github.com/isaacs/brace-expansion/security/advisories/GHSA-7h2j-956f-4vf2)
  - Stato: aperto

### `@xmldom/xmldom` 0.8.11 (dev)

File: `package-lock.json`

**Azione consigliata:** aggiornare `@xmldom/xmldom` almeno a **0.8.15** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-27p8-2357-5qqv** / CVE-2026-83608 — gravità ALTA (CVSS 8.7)
  - Problema: xmldom: DocType `name` Injection Bypasses requireWellFormed
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 0.8.15
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-27p8-2357-5qqv) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-83608) · [Progetto](https://github.com/xmldom/xmldom/security/advisories/GHSA-27p8-2357-5qqv)
  - Stato: aperto
- **GHSA-2v35-w6hq-6mfw** / CVE-2026-41673 — gravità ALTA (CVSS 8.7)
  - Problema: xmldom: Uncontrolled recursion in XML serialization leads to DoS
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 0.8.13
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-2v35-w6hq-6mfw) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-41673) · [Progetto](https://github.com/xmldom/xmldom/security/advisories/GHSA-2v35-w6hq-6mfw)
  - Stato: aperto
- **GHSA-4w3w-2rp5-g8jm** / CVE-2026-83605 — gravità ALTA (CVSS 8.7)
  - Problema: xmldom: Attribute name injection via setAttribute() bypasses requireWellFormed
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 0.8.14
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-4w3w-2rp5-g8jm) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-83605) · [Progetto](https://github.com/xmldom/xmldom/security/advisories/GHSA-4w3w-2rp5-g8jm)
  - Stato: aperto
- **GHSA-8344-3jmq-59r6** / CVE-2026-83613 — gravità ALTA (CVSS 8.7)
  - Problema: xmldom: Quadratic-time attribute deduplication
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 0.8.15
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-8344-3jmq-59r6) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-83613) · [Progetto](https://github.com/xmldom/xmldom/security/advisories/GHSA-8344-3jmq-59r6)
  - Stato: aperto
- **GHSA-93r5-fhx6-vmg9** / CVE-2026-83614 — gravità ALTA (CVSS 8.7)
  - Problema: xmldom: Quadratic-time parsing via the malformed-input recovery path — `parseElementStartPart` re-scan and `normalize()` adjacent-text merge
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 0.8.15
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-93r5-fhx6-vmg9) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-83614) · [Progetto](https://github.com/xmldom/xmldom/security/advisories/GHSA-93r5-fhx6-vmg9)
  - Stato: aperto
- **GHSA-965w-775f-mr7g** / CVE-2026-83615 — gravità ALTA (CVSS 8.7)
  - Problema: xmldom: Quadratic-memory consumption
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 0.8.15
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-965w-775f-mr7g) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-83615) · [Progetto](https://github.com/xmldom/xmldom/security/advisories/GHSA-965w-775f-mr7g)
  - Stato: aperto
- **GHSA-c7q8-3ch8-vqpv** / CVE-2026-83616 — gravità ALTA (CVSS 8.7)
  - Problema: xmldom: Processing Instruction Target Injection Bypasses requireWellFormed
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 0.8.15
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-c7q8-3ch8-vqpv) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-83616) · [Progetto](https://github.com/xmldom/xmldom/security/advisories/GHSA-c7q8-3ch8-vqpv)
  - Stato: aperto
- **GHSA-f6ww-3ggp-fr8h** / CVE-2026-41674 — gravità ALTA (CVSS 8.7)
  - Problema: xmldom has XML injection through unvalidated DocumentType serialization
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 0.8.13
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-f6ww-3ggp-fr8h) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-41674) · [Progetto](https://github.com/xmldom/xmldom/security/advisories/GHSA-f6ww-3ggp-fr8h)
  - Stato: aperto
- **GHSA-j759-j44w-7fr8** / CVE-2026-41672 — gravità ALTA (CVSS 8.7)
  - Problema: xmldom has XML node injection through unvalidated comment serialization
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 0.8.13
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-j759-j44w-7fr8) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-41672) · [Progetto](https://github.com/xmldom/xmldom/security/advisories/GHSA-j759-j44w-7fr8)
  - Stato: aperto
- **GHSA-w2rr-34g9-rvrj** / CVE-2026-83607 — gravità ALTA (CVSS 8.7)
  - Problema: xmldom: Element name injection via createElement() bypasses requireWellFormed
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 0.8.14
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-w2rr-34g9-rvrj) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-83607) · [Progetto](https://github.com/xmldom/xmldom/security/advisories/GHSA-w2rr-34g9-rvrj)
  - Stato: aperto
- **GHSA-x4fp-j954-r2f4** / CVE-2026-83619 — gravità ALTA (CVSS 8.7)
  - Problema: xmldom: End-tag Whitespace-Trim Regex ReDoS — quadratic backtracking in the 0.8.x end-tag parser
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 0.8.15
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-x4fp-j954-r2f4) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-83619) · [Progetto](https://github.com/xmldom/xmldom/security/advisories/GHSA-x4fp-j954-r2f4)
  - Stato: aperto
- **GHSA-x6wf-f3px-wcqx** / CVE-2026-41675 — gravità ALTA (CVSS 8.7)
  - Problema: xmldom has XML node injection through unvalidated processing instruction serialization
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 0.8.13
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-x6wf-f3px-wcqx) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-41675) · [Progetto](https://github.com/xmldom/xmldom/security/advisories/GHSA-x6wf-f3px-wcqx)
  - Stato: aperto
- **GHSA-wh4c-j3r5-mjhp** / CVE-2026-34601 — gravità ALTA (CVSS 7.5)
  - Problema: xmldom: XML injection via unsafe CDATA serialization allows attacker-controlled markup insertion
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 0.8.12
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-wh4c-j3r5-mjhp) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-34601) · [Progetto](https://github.com/xmldom/xmldom/security/advisories/GHSA-wh4c-j3r5-mjhp)
  - Stato: aperto

### `joi` 18.0.2 (dev)

File: `package-lock.json`

**Azione consigliata:** aggiornare `joi` almeno a **18.2.6** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-6h2x-m376-mqjq** / CVE-2026-92599 — gravità ALTA (CVSS 8.7)
  - Problema: joi: Quadratic regular-expression backtracking in `Joi.string().isoDate()`
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 18.2.6
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-6h2x-m376-mqjq) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-92599) · [Progetto](https://github.com/hapijs/joi/security/advisories/GHSA-6h2x-m376-mqjq)
  - Stato: aperto

### `minimatch` 10.1.1 (dev)

File: `package-lock.json`

**Azione consigliata:** aggiornare `minimatch` almeno a **10.2.3** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-3ppc-4f35-3m26** / CVE-2026-26996 — gravità ALTA (CVSS 8.7)
  - Problema: minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 10.2.1
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-3ppc-4f35-3m26) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-26996) · [Progetto](https://github.com/isaacs/minimatch/security/advisories/GHSA-3ppc-4f35-3m26)
  - Stato: aperto
- **GHSA-23c5-xmqv-rm74** / CVE-2026-27904 — gravità ALTA (CVSS 7.5)
  - Problema: minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 10.2.3
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-23c5-xmqv-rm74) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-27904) · [Progetto](https://github.com/isaacs/minimatch/security/advisories/GHSA-23c5-xmqv-rm74)
  - Stato: aperto
- **GHSA-7r86-cg39-jmmj** / CVE-2026-27903 — gravità ALTA (CVSS 7.5)
  - Problema: minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 10.2.3
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-7r86-cg39-jmmj) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-27903) · [Progetto](https://github.com/isaacs/minimatch/security/advisories/GHSA-7r86-cg39-jmmj)
  - Stato: aperto

### `minimatch` 3.1.2 (dev)

File: `client/package-lock.json`, `package-lock.json`

**Azione consigliata:** aggiornare `minimatch` almeno a **3.1.4** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-3ppc-4f35-3m26** / CVE-2026-26996 — gravità ALTA (CVSS 8.7)
  - Problema: minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 3.1.3
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-3ppc-4f35-3m26) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-26996) · [Progetto](https://github.com/isaacs/minimatch/security/advisories/GHSA-3ppc-4f35-3m26)
  - Stato: aperto
- **GHSA-23c5-xmqv-rm74** / CVE-2026-27904 — gravità ALTA (CVSS 7.5)
  - Problema: minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 3.1.4
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-23c5-xmqv-rm74) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-27904) · [Progetto](https://github.com/isaacs/minimatch/security/advisories/GHSA-23c5-xmqv-rm74)
  - Stato: aperto
- **GHSA-7r86-cg39-jmmj** / CVE-2026-27903 — gravità ALTA (CVSS 7.5)
  - Problema: minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 3.1.3
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-7r86-cg39-jmmj) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-27903) · [Progetto](https://github.com/isaacs/minimatch/security/advisories/GHSA-7r86-cg39-jmmj)
  - Stato: aperto

### `minimatch` 5.1.6 (dev)

File: `package-lock.json`

**Azione consigliata:** aggiornare `minimatch` almeno a **5.1.8** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-3ppc-4f35-3m26** / CVE-2026-26996 — gravità ALTA (CVSS 8.7)
  - Problema: minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 5.1.7
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-3ppc-4f35-3m26) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-26996) · [Progetto](https://github.com/isaacs/minimatch/security/advisories/GHSA-3ppc-4f35-3m26)
  - Stato: aperto
- **GHSA-23c5-xmqv-rm74** / CVE-2026-27904 — gravità ALTA (CVSS 7.5)
  - Problema: minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 5.1.8
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-23c5-xmqv-rm74) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-27904) · [Progetto](https://github.com/isaacs/minimatch/security/advisories/GHSA-23c5-xmqv-rm74)
  - Stato: aperto
- **GHSA-7r86-cg39-jmmj** / CVE-2026-27903 — gravità ALTA (CVSS 7.5)
  - Problema: minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 5.1.8
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-7r86-cg39-jmmj) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-27903) · [Progetto](https://github.com/isaacs/minimatch/security/advisories/GHSA-7r86-cg39-jmmj)
  - Stato: aperto

### `minimatch` 9.0.5 (dev)

File: `client/package-lock.json`, `package-lock.json`

**Azione consigliata:** aggiornare `minimatch` almeno a **9.0.7** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-3ppc-4f35-3m26** / CVE-2026-26996 — gravità ALTA (CVSS 8.7)
  - Problema: minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 9.0.6
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-3ppc-4f35-3m26) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-26996) · [Progetto](https://github.com/isaacs/minimatch/security/advisories/GHSA-3ppc-4f35-3m26)
  - Stato: aperto
- **GHSA-23c5-xmqv-rm74** / CVE-2026-27904 — gravità ALTA (CVSS 7.5)
  - Problema: minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 9.0.7
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-23c5-xmqv-rm74) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-27904) · [Progetto](https://github.com/isaacs/minimatch/security/advisories/GHSA-23c5-xmqv-rm74)
  - Stato: aperto
- **GHSA-7r86-cg39-jmmj** / CVE-2026-27903 — gravità ALTA (CVSS 7.5)
  - Problema: minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 9.0.7
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-7r86-cg39-jmmj) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-27903) · [Progetto](https://github.com/isaacs/minimatch/security/advisories/GHSA-7r86-cg39-jmmj)
  - Stato: aperto

### `source-map-js` 1.2.1 (dev)

File: `client/package-lock.json`

**Azione consigliata:** aggiornare `source-map-js` almeno a **1.2.2** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-68fv-2mgg-jv7q** / CVE-2026-93749 — gravità ALTA (CVSS 8.7)
  - Problema: source-map-js allows event-loop denial of service through indexed source-map section offsets
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 1.2.2
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-93749)
  - Stato: aperto

### `electron` 39.2.6 (dev)

File: `package-lock.json`

**Azione consigliata:** aggiornare `electron` almeno a **42.11.16** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-9qh4-3jw8-366w** / CVE-2026-102676 — gravità ALTA (CVSS 8.3)
  - Problema: Electron: <webview> can enable Node.js integration in Web Workers despite embedder restrictions
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 41.10.6
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-9qh4-3jw8-366w) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-102676) · [Progetto](https://github.com/electron/electron/security/advisories/GHSA-9qh4-3jw8-366w)
  - Stato: aperto
- **GHSA-jfqg-hf23-qpw2** / CVE-2026-34780 — gravità ALTA (CVSS 8.3)
  - Problema: Electron: Context Isolation bypass via contextBridge VideoFrame transfer
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 39.8.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-jfqg-hf23-qpw2) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-34780) · [Progetto](https://github.com/electron/electron/security/advisories/GHSA-jfqg-hf23-qpw2)
  - Stato: aperto
- **GHSA-gr2m-v5gq-v685** / CVE-2026-102674 — gravità ALTA (CVSS 8.2)
  - Problema: Electron: Windows opened from a sandboxed top-level document do not inherit its sandbox restrictions
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 41.10.6
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-gr2m-v5gq-v685) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-102674) · [Progetto](https://github.com/electron/electron/security/advisories/GHSA-gr2m-v5gq-v685)
  - Stato: aperto
- **GHSA-hq2x-r82h-9wj4** / CVE-2026-102673 — gravità ALTA (CVSS 8.2)
  - Problema: Electron drops inherited HTML sandbox restrictions for popups opened through OpenURLFromTab
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 41.10.4
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-hq2x-r82h-9wj4) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-102673) · [Progetto](https://github.com/electron/electron/security/advisories/GHSA-hq2x-r82h-9wj4)
  - Stato: aperto
- **GHSA-532v-xpq5-8h95** / CVE-2026-34774 — gravità ALTA (CVSS 8.1)
  - Problema: Electron: Use-after-free in offscreen child window paint callback
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 39.8.1
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-532v-xpq5-8h95) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-34774) · [Progetto](https://github.com/electron/electron/security/advisories/GHSA-532v-xpq5-8h95)
  - Stato: aperto
- **GHSA-9wfr-w7mm-pc7f** / CVE-2026-34769 — gravità ALTA (CVSS 7.7)
  - Problema: Electron: Renderer command-line switch injection via undocumented commandLineSwitches webPreference
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 39.8.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-9wfr-w7mm-pc7f) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-34769) · [Progetto](https://github.com/electron/electron/security/advisories/GHSA-9wfr-w7mm-pc7f)
  - Stato: aperto
- **GHSA-8337-3p73-46f4** / CVE-2026-34771 — gravità ALTA (CVSS 7.5)
  - Problema: Electron: Use-after-free in WebContents fullscreen, pointer-lock, and keyboard-lock permission callbacks
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 39.8.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-8337-3p73-46f4) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-34771) · [Progetto](https://github.com/electron/electron/security/advisories/GHSA-8337-3p73-46f4)
  - Stato: aperto
- **GHSA-h7rp-cf8h-j98x** / CVE-2026-70601 — gravità ALTA (CVSS 7.5)
  - Problema: Electron: Context isolation bypass via Function.prototype.bind hijack
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 39.8.9
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-h7rp-cf8h-j98x) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-70601) · [Progetto](https://github.com/electron/electron/security/advisories/GHSA-h7rp-cf8h-j98x)
  - Stato: aperto
- **GHSA-j84w-jfhq-vhvj** / CVE-2026-102675 — gravità ALTA (CVSS 7.4)
  - Problema: Electron: File and HTTP protocol handlers allow cross-origin reads without corsEnabled
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 41.10.6
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-j84w-jfhq-vhvj) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-102675) · [Progetto](https://github.com/electron/electron/security/advisories/GHSA-j84w-jfhq-vhvj)
  - Stato: aperto
- **GHSA-jr5w-w6x2-84p9** / CVE-2026-115570 — gravità ALTA (CVSS 7.4)
  - Problema: Electron: Mitigation for compromised eMudhra intermediate certificates
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 42.11.16
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-jr5w-w6x2-84p9) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-115570) · [Progetto](https://github.com/electron/electron/security/advisories/GHSA-jr5w-w6x2-84p9)
  - Stato: aperto
- **GHSA-v3j7-r9gq-3gjw** / CVE-2026-70604 — gravità ALTA (CVSS 7.4)
  - Problema: Electron: Custom protocol with supportFetchAPI but not corsEnabled allows cross-origin reads
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 39.8.10
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-v3j7-r9gq-3gjw) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-70604) · [Progetto](https://github.com/electron/electron/security/advisories/GHSA-v3j7-r9gq-3gjw)
  - Stato: aperto
- **GHSA-9f4c-93c8-jc8g** / CVE-2026-70608 — gravità ALTA (CVSS 7.2)
  - Problema: Electron: Sandboxed iframe can bypass the allow-popups restriction via the OpenURL navigation path
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 39.8.10
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-9f4c-93c8-jc8g) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-70608) · [Progetto](https://github.com/electron/electron/security/advisories/GHSA-9f4c-93c8-jc8g)
  - Stato: aperto
- **GHSA-jjp3-mq3x-295m** / CVE-2026-34770 — gravità ALTA (CVSS 7.0)
  - Problema: Electron: Use-after-free in PowerMonitor on Windows and macOS
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 39.8.1
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-jjp3-mq3x-295m) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-34770) · [Progetto](https://github.com/electron/electron/security/advisories/GHSA-jjp3-mq3x-295m)
  - Stato: aperto

### `nanoid` 3.3.11 (dev)

File: `client/package-lock.json`

**Azione consigliata:** aggiornare `nanoid` almeno a **3.3.18** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-28wg-ghj8-5hjv** / CVE-2026-67214 — gravità ALTA (CVSS 8.2)
  - Problema: nanoid: non-secure generators can loop indefinitely with negative size
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 3.3.16
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-28wg-ghj8-5hjv) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-67214)
  - Stato: aperto
- **GHSA-2v37-7h3g-55p8** / CVE-2026-67213 — gravità ALTA (CVSS 8.2)
  - Problema: nanoid: custom generators can loop indefinitely when size is zero
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 3.3.18
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-2v37-7h3g-55p8) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-67213)
  - Stato: aperto
- **GHSA-xwg4-73v4-xw9w** / CVE-2026-73086 — gravità ALTA (CVSS 7.4)
  - Problema: nanoid: Integer Overflow or Wraparound
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 3.3.12
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-xwg4-73v4-xw9w) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-73086) · [Progetto](https://github.com/ai/nanoid/security/advisories/GHSA-xwg4-73v4-xw9w)
  - Stato: aperto

### `vite` 6.4.1 (dev)

File: `client/package-lock.json`

**Azione consigliata:** aggiornare `vite` almeno a **6.4.4** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-fx2h-pf6j-xcff** / CVE-2026-53571 — gravità ALTA (CVSS 8.2)
  - Problema: vite: `server.fs.deny` bypass on Windows alternate paths
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 6.4.3
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-fx2h-pf6j-xcff) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-53571) · [Progetto](https://github.com/vitejs/vite/security/advisories/GHSA-fx2h-pf6j-xcff)
  - Stato: aperto
- **GHSA-p9ff-h696-f583** / CVE-2026-39363 — gravità ALTA (CVSS 8.2)
  - Problema: Vite Vulnerable to Arbitrary File Read via Vite Dev Server WebSocket
  - Impatto: Possibile lettura/scrittura di file fuori dalle cartelle previste.
  - Versione corretta: 6.4.2
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-p9ff-h696-f583) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-39363) · [Progetto](https://github.com/vitejs/vite/security/advisories/GHSA-p9ff-h696-f583)
  - Stato: aperto
- **GHSA-587h-7wmj-h5pm** / CVE-2026-112942 — gravità ALTA (CVSS 7.5)
  - Problema: launch-editor: `fs.existsSync()` existence check can be bypassed on Windows
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 6.4.4
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-587h-7wmj-h5pm) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-112942) · [Progetto](https://github.com/vitejs/launch-editor/security/advisories/GHSA-587h-7wmj-h5pm)
  - Stato: aperto

### `lodash` 4.17.21 (dev)

File: `package-lock.json`

**Azione consigliata:** aggiornare `lodash` almeno a **4.18.0** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-r5fr-rjxr-66jc** / CVE-2026-4800 — gravità ALTA (CVSS 8.1)
  - Problema: lodash vulnerable to Code Injection via `_.template` imports key names
  - Impatto: Un attaccante potrebbe eseguire codice arbitrario sul server o sulla macchina che usa la libreria.
  - Versione corretta: 4.18.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-r5fr-rjxr-66jc) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-4800) · [Progetto](https://github.com/lodash/lodash/security/advisories/GHSA-r5fr-rjxr-66jc)
  - Stato: aperto

### `app-builder-lib` 26.0.12 (dev)

File: `package-lock.json`

**Azione consigliata:** aggiornare `app-builder-lib` almeno a **26.15.0** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-7g7r-gx96-252g** / CVE-2026-54672 — gravità ALTA (CVSS 7.8)
  - Problema: electron-updater: Uncontrolled search path elements within `AppImage` built by `app-builder-lib`
  - Impatto: Vulnerabilità ad alto impatto; vedere le fonti per i dettagli.
  - Versione corretta: 26.15.0
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-7g7r-gx96-252g) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-54672) · [Progetto](https://github.com/electron-userland/electron-builder/security/advisories/GHSA-7g7r-gx96-252g)
  - Stato: aperto

### `brace-expansion` 1.1.12 (dev)

File: `client/package-lock.json`, `package-lock.json`

**Azione consigliata:** aggiornare `brace-expansion` almeno a **1.1.20** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-3jxr-9vmj-r5cp** / CVE-2026-13149 — gravità ALTA (CVSS 7.7)
  - Problema: brace-expansion: DoS via exponential-time expansion of consecutive non-expanding {} groups
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 1.1.16
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-13149) · [Progetto](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-3jxr-9vmj-r5cp)
  - Stato: aperto
- **GHSA-6j4f-fj2g-mc7p** / CVE-2026-102276 — gravità ALTA (CVSS 7.5)
  - Problema: brace-expansion: DoS via uncontrolled recursion in parseCommaParts causing stack exhaustion
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 1.1.19
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-102276) · [Progetto](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-6j4f-fj2g-mc7p)
  - Stato: aperto
- **GHSA-mh99-v99m-4gvg** / CVE-2026-14257 — gravità ALTA (CVSS 7.5)
  - Problema: brace-expansion: DoS via unbounded expansion length causing an out-of-memory process crash
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 1.1.17
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-mh99-v99m-4gvg) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-14257) · [Progetto](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-mh99-v99m-4gvg)
  - Stato: aperto
- **GHSA-qhr7-859c-m2p7** / CVE-2026-102278 — gravità ALTA (CVSS 7.5)
  - Problema: brace-expansion: DoS via uncontrolled recursion on nested brace groups causing stack exhaustion
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 1.1.20
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-qhr7-859c-m2p7) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-102278) · [Progetto](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-qhr7-859c-m2p7)
  - Stato: aperto
- **GHSA-rgw5-rvv9-x895** / CVE-2026-69152 — gravità ALTA (CVSS 7.5)
  - Problema: brace-expansion: DoS via unbounded intermediate arrays, bypassing the CVE-2026-14257 mitigation
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 1.1.18
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-rgw5-rvv9-x895) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-69152) · [Progetto](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-rgw5-rvv9-x895)
  - Stato: aperto

### `brace-expansion` 2.0.2 (dev)

File: `client/package-lock.json`, `package-lock.json`

**Azione consigliata:** aggiornare `brace-expansion` almeno a **2.1.6** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-3jxr-9vmj-r5cp** / CVE-2026-13149 — gravità ALTA (CVSS 7.7)
  - Problema: brace-expansion: DoS via exponential-time expansion of consecutive non-expanding {} groups
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 2.1.2
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-13149) · [Progetto](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-3jxr-9vmj-r5cp)
  - Stato: aperto
- **GHSA-6j4f-fj2g-mc7p** / CVE-2026-102276 — gravità ALTA (CVSS 7.5)
  - Problema: brace-expansion: DoS via uncontrolled recursion in parseCommaParts causing stack exhaustion
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 2.1.5
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-102276) · [Progetto](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-6j4f-fj2g-mc7p)
  - Stato: aperto
- **GHSA-mh99-v99m-4gvg** / CVE-2026-14257 — gravità ALTA (CVSS 7.5)
  - Problema: brace-expansion: DoS via unbounded expansion length causing an out-of-memory process crash
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 2.1.3
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-mh99-v99m-4gvg) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-14257) · [Progetto](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-mh99-v99m-4gvg)
  - Stato: aperto
- **GHSA-qhr7-859c-m2p7** / CVE-2026-102278 — gravità ALTA (CVSS 7.5)
  - Problema: brace-expansion: DoS via uncontrolled recursion on nested brace groups causing stack exhaustion
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 2.1.6
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-qhr7-859c-m2p7) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-102278) · [Progetto](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-qhr7-859c-m2p7)
  - Stato: aperto
- **GHSA-rgw5-rvv9-x895** / CVE-2026-69152 — gravità ALTA (CVSS 7.5)
  - Problema: brace-expansion: DoS via unbounded intermediate arrays, bypassing the CVE-2026-14257 mitigation
  - Impatto: Bypass di controlli di sicurezza o esposizione di dati/credenziali.
  - Versione corretta: 2.1.4
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-rgw5-rvv9-x895) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-69152) · [Progetto](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-rgw5-rvv9-x895)
  - Stato: aperto

### `ip-address` 10.1.0 (dev)

File: `package-lock.json`

**Azione consigliata:** aggiornare `ip-address` almeno a **10.3.1** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-mwp4-54f8-5fhr** / CVE-2026-69192 — gravità ALTA (CVSS 7.7)
  - Problema: ip-address: Address4 decodes leading-zero octets as decimal while resolvers decode them as octal, allowing SSRF and trust-boundary bypass
  - Impatto: Il server può essere indotto a fare richieste verso indirizzi interni o arbitrari (SSRF).
  - Versione corretta: 10.3.1
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-mwp4-54f8-5fhr) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-69192) · [Progetto](https://github.com/beaugunderson/ip-address/security/advisories/GHSA-mwp4-54f8-5fhr)
  - Stato: aperto

### `tmp` 0.2.5 (dev)

File: `package-lock.json`

**Azione consigliata:** aggiornare `tmp` almeno a **0.2.6** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-ph9p-34f9-6g65** / CVE-2026-44705 — gravità ALTA (CVSS 7.7)
  - Problema: tmp has Path Traversal via unsanitized prefix/postfix that enables directory escape
  - Impatto: Possibile lettura/scrittura di file fuori dalle cartelle previste.
  - Versione corretta: 0.2.6
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-ph9p-34f9-6g65) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-44705) · [Progetto](https://github.com/raszi/node-tmp/security/advisories/GHSA-ph9p-34f9-6g65)
  - Stato: aperto

### `browserslist` 4.28.1 (dev)

File: `client/package-lock.json`

**Azione consigliata:** aggiornare `browserslist` almeno a **4.28.7** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-73wf-gq98-2v4g** / CVE-2026-73088 — gravità ALTA (CVSS 7.5)
  - Problema: Browserslist: Uncaught crash / prototype write via untrusted browserslist-stats.json custom stats (normalizeStats)
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 4.28.7
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-73wf-gq98-2v4g) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-73088) · [Progetto](https://github.com/browserslist/browserslist/security/advisories/GHSA-73wf-gq98-2v4g)
  - Stato: aperto
- **GHSA-c83g-rgw3-j3cx** / CVE-2026-73089 — gravità ALTA (CVSS 7.5)
  - Problema: Browserslist: Unbounded memory growth (no cache eviction) via distinct query results, leading to eventual OOM
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 4.28.7
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-c83g-rgw3-j3cx) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-73089) · [Progetto](https://github.com/browserslist/browserslist/security/advisories/GHSA-c83g-rgw3-j3cx)
  - Stato: aperto

### `picomatch` 2.3.1 (dev)

File: `client/package-lock.json`, `package-lock.json`

**Azione consigliata:** aggiornare `picomatch` almeno a **2.3.2** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-c2c7-rcm5-vvqj** / CVE-2026-33671 — gravità ALTA (CVSS 7.5)
  - Problema: Picomatch has a ReDoS vulnerability via extglob quantifiers
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 2.3.2
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-c2c7-rcm5-vvqj) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-33671) · [Progetto](https://github.com/micromatch/picomatch/security/advisories/GHSA-c2c7-rcm5-vvqj)
  - Stato: aperto

### `picomatch` 4.0.3 (dev)

File: `client/package-lock.json`

**Azione consigliata:** aggiornare `picomatch` almeno a **4.0.4** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-c2c7-rcm5-vvqj** / CVE-2026-33671 — gravità ALTA (CVSS 7.5)
  - Problema: Picomatch has a ReDoS vulnerability via extglob quantifiers
  - Impatto: Denial of Service: input appositamente costruito può bloccare o rallentare fortemente il processo.
  - Versione corretta: 4.0.4
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-c2c7-rcm5-vvqj) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-33671) · [Progetto](https://github.com/micromatch/picomatch/security/advisories/GHSA-c2c7-rcm5-vvqj)
  - Stato: aperto

### `postcss` 8.5.6 (dev)

File: `client/package-lock.json`

**Azione consigliata:** aggiornare `postcss` almeno a **8.5.18** (se è una dipendenza transitiva, aggiornare il pacchetto che la richiede o usare `overrides` in package.json), rigenerare il lockfile e rieseguire build e test.

- **GHSA-6g55-p6wh-862q** / CVE-2026-45623 — gravità ALTA (CVSS 7.5)
  - Problema: PostCSS: Arbitrary file read and information disclosure via attacker-controlled sourceMappingURL in CSS comments
  - Impatto: Possibile lettura/scrittura di file fuori dalle cartelle previste.
  - Versione corretta: 8.5.12
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-6g55-p6wh-862q) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-45623) · [Progetto](https://github.com/postcss/postcss/security/advisories/GHSA-6g55-p6wh-862q)
  - Stato: aperto
- **GHSA-r28c-9q8g-f849** / CVE-2026-73646 — gravità ALTA (CVSS 7.5)
  - Problema: PostCSS: Path Traversal in Previous Source Map Auto-Loading (sourceMappingURL) leads to Arbitrary .map File Disclosure
  - Impatto: Possibile lettura/scrittura di file fuori dalle cartelle previste.
  - Versione corretta: 8.5.18
  - Fonti verificate: [GHSA](https://github.com/advisories/GHSA-r28c-9q8g-f849) · [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-73646) · [Progetto](https://github.com/postcss/postcss/security/advisories/GHSA-r28c-9q8g-f849)
  - Stato: aperto

