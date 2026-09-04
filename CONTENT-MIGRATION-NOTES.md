# Content Migration Notes

The redesign was built from the four supplied source pages and preserves their substantive records:

- Home: professional appointment, affiliation, contact information, biography, research-interest categories, and 27 honor/talk/presentation/leadership entries.
- Research/publications: 1 dissertation, 1 book chapter, 7 journal entries, 20 conference entries, and 3 technical reports (32 total records).
- People/teaching: 2 Ph.D. students, 4 course records, and 3 outreach records.
- Service: 6 leadership/organizing roles, 6 technical-program records, 11 journal-review records, and 11 conference-review records.

## Editorial normalization

The migration normalizes presentation without changing the underlying scholarly claims:

- corrupt RTF smart-quote sequences were converted to standard typographic quotation marks;
- date ranges use en dashes consistently;
- obvious ordinal typography such as `26rd` and `42th` was rendered as `26th` and `42nd`;
- student asterisks were converted to underlined student-author styling;
- entries marked `submitted` remain explicitly marked as submitted;
- long lists were reorganized, filtered, or collapsed but not intentionally removed.

## Structural change

The former `research.html` was a publication list. In the redesign:

- `research.html` explains the coherent research program;
- `publications.html` contains the complete searchable publication record.

## Items deliberately not bundled

- The current portrait file is not duplicated; the deployed site can retain `ming_shi_69.jpg` and preferably add an optimized `assets/images/ming-shi.webp`.
- The current `papers/` PDF directory is not duplicated; it should remain in place during deployment.
- No CV was invented or linked because no CV file was supplied.
- Analytics identifiers are blank by default and must be added by the site owner.

## Messaging and heading revision

Major headings now state the page subject or research content directly. Generic or design-oriented phrases were replaced with concrete descriptions of safe reinforcement learning, online optimization and bandits, partial observability and preference learning, application domains, mentoring, teaching, outreach, and professional service. The public domain remains `https://mingshihomepage.com/`.
