'use client';

import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  ArrowRight,
  Clock,
  MapPin,
  Users,
  Coffee,
  Loader2,
} from 'lucide-react';

import {
  visitSchema,
  VisitSchemaType,
  visitInterests,
  preferredTimes,
} from '@/lib/schemas/visitSchema';

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

import SectionHeading from '@/components/SectionHeading';
import { useConfetti } from '@/hooks/use-confetti';

const expectations = [
  {
    icon: Clock,
    title: '60-90 Minutes Visit Time Allowed',
    body: 'Visits include a campus tour, a chance to peek into active classrooms, and time to ask questions.',
  },
  {
    icon: Users,
    title: 'Meet Our Teachers',
    body: "You'll meet teachers from your child's intended level and get a real feel for our classroom culture.",
  },
  {
    icon: MapPin,
    title: 'Full Campus Tour',
    body: 'See our classrooms, library, science labs, and sports facilities; not just the front office.',
  },
  {
    icon: Coffee,
    title: 'Informal Q&A',
    body: 'Grab a coffee and ask us anything: admissions, fees, curriculum, or daily school life.',
  },
];

export default function ArrangeVisitSection() {
  const [isPending, startTransition] = useTransition();

  const { triggerConfetti } = useConfetti();

  const form = useForm<VisitSchemaType>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      parentFullName: '',
      parentEmail: '',
      parentPhone: '',
      childAgeOrLevel: 'Kindergarten',
      preferredDate: '',
      preferredTime: 'Morning (9am - 11am)',
      additionalNotes: '',
    },
  });

  function onSubmit(values: VisitSchemaType) {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      console.log(values);
      toast.success("Visit request sent! We'll confirm your slot shortly.");
      triggerConfetti();
      form.reset();
    });
  }

  return (
    <section className="section-pad bg-(--warm-white)">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-16 xl:gap-24">
          {/* ── Left: what to expect ── */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Arrange A Visit"
              heading={`See Crestview For Yourself`}
            />
            <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80 mb-10">
              There is no better way to understand who we are than to walk our
              halls, meet our teachers, and feel the energy of our classrooms in
              person. Book a visit and let us show you around.
            </p>

            <div className="flex flex-col gap-7">
              {expectations.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-full bg-terracotta-pale flex items-center justify-center">
                      <Icon className="size-5 text-terracotta" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base text-(--charcoal) mb-1">
                        {item.title}
                      </h3>
                      <p className="font-body text-sm text-(--charcoal-100) opacity-70 leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 pt-8 border-t border-(--border-sand)">
              <p className="font-body text-xs uppercase tracking-[0.18em] text-terracotta-light font-semibold mb-2">
                Visiting Hours
              </p>
              <p className="font-body text-sm text-(--charcoal-100) opacity-80 leading-relaxed">
                Monday – Friday, 9:00am – 3:00pm
                <br />
                14, Admiralty Way, Lekki Phase 1, Lagos
              </p>
            </div>
          </div>

          {/* ── Right: form ── */}
          <div className="rounded-xl border border-(--border-sand)/20 bg-(--warm-white) p-6 sm:p-8 lg:p-10 shadow-[0_10px_30px_rgba(31,41,55,0.08)]">
            <form
              className="flex flex-col gap-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Controller
                    name="parentFullName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm font-medium text-(--charcoal)"
                        >
                          Full Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="e.g. Mrs. Funke Okonkwo"
                          aria-invalid={fieldState.invalid}
                          className="font-body border-(--border-sand) focus-visible:ring-terracotta focus-visible:border-terracotta h-11"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="parentPhone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm font-medium text-(--charcoal)"
                        >
                          Phone Number
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          type="tel"
                          placeholder="+234 801 234 5678"
                          aria-invalid={fieldState.invalid}
                          className="font-body border-(--border-sand) focus-visible:ring-terracotta focus-visible:border-terracotta h-11"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="parentEmail"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="font-body text-sm font-medium text-(--charcoal)"
                      >
                        Email Address
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="email"
                        placeholder="you@example.com"
                        aria-invalid={fieldState.invalid}
                        className="font-body border-(--border-sand) focus-visible:ring-terracotta focus-visible:border-terracotta h-11"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="childAgeOrLevel"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="font-body text-sm font-medium text-(--charcoal)"
                      >
                        Level of Interest
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          id={field.name}
                          className="w-full font-body border-(--border-sand) focus-visible:ring-terracotta h-11"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select a level" />
                        </SelectTrigger>
                        <SelectContent className="bg-(--warm-white) border-(--border-sand) shadow-lg">
                          {visitInterests.map((level) => (
                            <SelectItem
                              key={level}
                              value={level}
                              className="font-body"
                            >
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Controller
                    name="preferredDate"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm font-medium text-(--charcoal)"
                        >
                          Preferred Date
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          type="date"
                          aria-invalid={fieldState.invalid}
                          className="font-body border-(--border-sand) focus-visible:ring-terracotta focus-visible:border-terracotta h-11"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="preferredTime"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm font-medium text-(--charcoal)"
                        >
                          Preferred Time
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            id={field.name}
                            className="w-full font-body border-(--border-sand) focus-visible:ring-terracotta h-11"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="Select a time" />
                          </SelectTrigger>
                          <SelectContent className="bg-(--warm-white) border-(--border-sand) shadow-lg">
                            {preferredTimes.map((time) => (
                              <SelectItem
                                key={time}
                                value={time}
                                className="font-body"
                              >
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="additionalNotes"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="font-body text-sm font-medium text-(--charcoal)"
                      >
                        Anything else we should know?
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        placeholder="Optional message"
                        className="font-body min-h-24 border-(--border-sand) focus-visible:ring-terracotta focus-visible:border-terracotta"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldDescription className="font-body text-xs opacity-60">
                        Optional
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button
                type="submit"
                disabled={isPending}
                className="group mt-2 bg-terracotta hover:bg-(--terracotta-mid) text-white font-body font-semibold tracking-wide py-6 text-base"
              >
                {isPending ? (
                  <>
                    Sending Request...
                    <Loader2 className="animate-spin ml-1" />
                  </>
                ) : (
                  'Request a Visit'
                )}
                {!isPending && (
                  <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                )}
              </Button>

              <p className="font-body text-xs text-(--charcoal-100) opacity-50 text-center">
                We typically confirm visit requests within one business day.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
