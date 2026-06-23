// ── Types ──────────────────────────────────────────────────────

export type Category = 'term' | 'exam' | 'holiday' | 'event';

export type CalendarEvent = {
  date: string; // e.g. "9 Sep"
  endDate?: string; // e.g. "20 Dec" for ranges
  label: string;
  category: Category;
  term: 1 | 2 | 3;
};

export type AcademicYear = {
  label: string;
  terms: {
    number: 1 | 2 | 3;
    name: string;
    start: string;
    end: string;
    midTermBreak: string;
    events: CalendarEvent[];
  }[];
};

export const years: AcademicYear[] = [
  {
    label: '2025 / 2026',
    terms: [
      {
        number: 1,
        name: 'First Term',
        start: '8 Sep 2025',
        end: '12 Dec 2025',
        midTermBreak: '27 Oct – 31 Oct 2025',
        events: [
          {
            date: '8 Sep',
            label: 'First Term resumes',
            category: 'term',
            term: 1,
          },
          {
            date: '27 Oct',
            endDate: '31 Oct',
            label: 'Mid-term break',
            category: 'holiday',
            term: 1,
          },
          {
            date: '3 Nov',
            label: 'Mid-term tests begin',
            category: 'exam',
            term: 1,
          },
          {
            date: '17 Nov',
            label: 'Inter-house Sports Day',
            category: 'event',
            term: 1,
          },
          {
            date: '1 Dec',
            label: 'End-of-term examinations begin',
            category: 'exam',
            term: 1,
          },
          {
            date: '12 Dec',
            label: 'First Term closes',
            category: 'term',
            term: 1,
          },
        ],
      },
      {
        number: 2,
        name: 'Second Term',
        start: '12 Jan 2026',
        end: '3 Apr 2026',
        midTermBreak: '16 – 20 Feb 2026',
        events: [
          {
            date: '12 Jan',
            label: 'Second Term resumes',
            category: 'term',
            term: 2,
          },
          {
            date: '16 Feb',
            endDate: '20 Feb',
            label: 'Mid-term break',
            category: 'holiday',
            term: 2,
          },
          {
            date: '23 Feb',
            label: 'Mid-term tests begin',
            category: 'exam',
            term: 2,
          },
          {
            date: '9 Mar',
            label: 'Open Day & Parent-Teacher meetings',
            category: 'event',
            term: 2,
          },
          {
            date: '23 Mar',
            label: 'End-of-term examinations begin',
            category: 'exam',
            term: 2,
          },
          {
            date: '3 Apr',
            label: 'Second Term closes',
            category: 'term',
            term: 2,
          },
        ],
      },
      {
        number: 3,
        name: 'Third Term',
        start: '27 Apr 2026',
        end: '24 Jul 2026',
        midTermBreak: '1 – 5 Jun 2026',
        events: [
          {
            date: '27 Apr',
            label: 'Third Term resumes',
            category: 'term',
            term: 3,
          },
          {
            date: '1 Jun',
            endDate: '5 Jun',
            label: 'Mid-term break',
            category: 'holiday',
            term: 3,
          },
          {
            date: '8 Jun',
            label: 'WAEC / NECO examinations begin (SSS 3)',
            category: 'exam',
            term: 3,
          },
          {
            date: '22 Jun',
            label: 'Prize Giving & Graduation Day',
            category: 'event',
            term: 3,
          },
          {
            date: '6 Jul',
            label: 'End-of-term examinations begin',
            category: 'exam',
            term: 3,
          },
          {
            date: '24 Jul',
            label: 'Third Term closes · Long Vacation begins',
            category: 'term',
            term: 3,
          },
        ],
      },
    ],
  },
  {
    label: '2026 / 2027',
    terms: [
      {
        number: 1,
        name: 'First Term',
        start: '7 Sep 2026',
        end: '11 Dec 2026',
        midTermBreak: '26 Oct – 30 Oct 2026',
        events: [
          {
            date: '7 Sep',
            label: 'First Term resumes',
            category: 'term',
            term: 1,
          },
          {
            date: '26 Oct',
            endDate: '30 Oct',
            label: 'Mid-term break',
            category: 'holiday',
            term: 1,
          },
          {
            date: '2 Nov',
            label: 'Mid-term tests begin',
            category: 'exam',
            term: 1,
          },
          {
            date: '16 Nov',
            label: 'Inter-house Sports Day',
            category: 'event',
            term: 1,
          },
          {
            date: '30 Nov',
            label: 'End-of-term examinations begin',
            category: 'exam',
            term: 1,
          },
          {
            date: '11 Dec',
            label: 'First Term closes',
            category: 'term',
            term: 1,
          },
        ],
      },
      {
        number: 2,
        name: 'Second Term',
        start: '11 Jan 2027',
        end: '2 Apr 2027',
        midTermBreak: '15 – 19 Feb 2027',
        events: [
          {
            date: '11 Jan',
            label: 'Second Term resumes',
            category: 'term',
            term: 2,
          },
          {
            date: '15 Feb',
            endDate: '19 Feb',
            label: 'Mid-term break',
            category: 'holiday',
            term: 2,
          },
          {
            date: '22 Feb',
            label: 'Mid-term tests begin',
            category: 'exam',
            term: 2,
          },
          {
            date: '8 Mar',
            label: 'Open Day & Parent-Teacher meetings',
            category: 'event',
            term: 2,
          },
          {
            date: '22 Mar',
            label: 'End-of-term examinations begin',
            category: 'exam',
            term: 2,
          },
          {
            date: '2 Apr',
            label: 'Second Term closes',
            category: 'term',
            term: 2,
          },
        ],
      },
      {
        number: 3,
        name: 'Third Term',
        start: '26 Apr 2027',
        end: '23 Jul 2027',
        midTermBreak: '31 May – 4 Jun 2027',
        events: [
          {
            date: '26 Apr',
            label: 'Third Term resumes',
            category: 'term',
            term: 3,
          },
          {
            date: '31 May',
            endDate: '4 Jun',
            label: 'Mid-term break',
            category: 'holiday',
            term: 3,
          },
          {
            date: '7 Jun',
            label: 'WAEC / NECO examinations begin (SSS 3)',
            category: 'exam',
            term: 3,
          },
          {
            date: '21 Jun',
            label: 'Prize Giving & Graduation Day',
            category: 'event',
            term: 3,
          },
          {
            date: '5 Jul',
            label: 'End-of-term examinations begin',
            category: 'exam',
            term: 3,
          },
          {
            date: '23 Jul',
            label: 'Third Term closes · Long Vacation begins',
            category: 'term',
            term: 3,
          },
        ],
      },
    ],
  },
];

// ── Config ─────────────────────────────────────────────────────

export const CATEGORIES: { key: Category | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'term', label: 'Term dates' },
  { key: 'exam', label: 'Examinations' },
  { key: 'holiday', label: 'Breaks' },
  { key: 'event', label: 'Events' },
];

export const CATEGORY_STYLES: Record<Category, { dot: string; text: string }> =
  {
    term: { dot: 'bg-terracotta', text: 'text-terracotta' },
    exam: { dot: 'bg-(--charcoal)', text: 'text-(--charcoal)' },
    holiday: { dot: 'bg-emerald-600', text: 'text-emerald-700' },
    event: { dot: 'bg-amber-500', text: 'text-amber-700' },
  };
