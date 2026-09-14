# Arabic Website Version

## Goal
Add a complete Arabic, right-to-left edition of all six Wijhan pages while preserving the existing English site and official logo treatment.

## What will be built
- Add Arabic routes for Home, About, Services, Work, Process, and Contact under `/ar`.
- Translate every visible page element into polished business Arabic, including navigation, headings, supporting copy, service details, process steps, form fields, validation states, footer, and accessibility labels.
- Add a clear English/العربية language switcher that keeps visitors on the equivalent page when switching languages.
- Use the official Wijhan logo on both language versions, with the Arabic version presented as وِجهان through the supplied brand asset.
- Add unique Arabic page titles, descriptions, social metadata, and canonical links.
- Apply Arabic typography and full right-to-left behavior across layouts, lists, forms, icons, and mobile navigation.
- Preserve truthful placeholders for unavailable work examples and contact delivery.

## Technical details
- Keep the existing English URLs unchanged; create parallel `/ar`, `/ar/about`, `/ar/services`, `/ar/work`, `/ar/process`, and `/ar/contact` route files.
- Centralize Arabic structured content and reuse the existing page primitives with locale-aware links and calls to action.
- Set page-level `lang="ar"` and `dir="rtl"` behavior for Arabic content, with logical CSS properties and mirrored directional icons where appropriate.
- Validate every English and Arabic route, language switching, mobile menu, Arabic form state, and desktop/mobile layouts.
