'use client';

import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  ArrowRight,
  Loader2,
  Clock,
  ShieldCheck,
  MonitorSmartphone,
  Wifi,
} from 'lucide-react';

import {
  itSupportSchema,
  ITSupportSchemaType,
  issueTypes,
  userTypes,
} from '@/lib/schemas/itSupportSchema';

import {
  Field,
  FieldLabel,
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

const supportInfo = [
  {
    icon: Clock,
    title: 'Response Time',
    body: 'We aim to respond to all IT support requests within 4 working hours. Critical issues (portal outages, exam access) are prioritised.',
  },
  {
    icon: ShieldCheck,
    title: 'Data & Privacy',
    body: 'All support requests are handled securely. We will never ask for your full password, only a username or account email for verification.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Supported Platforms',
    body: 'We support our parent portal, student email accounts, and fee payment systems on all major browsers and devices.',
  },
  {
    icon: Wifi,
    title: 'On-Campus Issues',
    body: 'For hardware or connectivity problems on campus, please visit the IT office (Block C, Room 2) between 8am and 3pm on school days.',
  },
];

export default function ITSupportSection() {
  const [isPending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();

  const form = useForm<ITSupportSchemaType>({
    resolver: zodResolver(itSupportSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      userType: 'Parent',
      issueType: 'Login Issues',
      description: '',
    },
  });

  function onSubmit(values: ITSupportSchemaType) {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      console.log(values);
      toast.success(
        'Support request submitted! Our IT team will be in touch shortly.',
      );
      triggerConfetti();
      form.reset();
    });
  }

  return (
    <section className="section-pad bg-(--warm-white)">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 xl:gap-24">
          {/* ── Left: support info ── */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="IT Support"
              heading={`Having a\nTechnical Issue?`}
            />
            <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80 mb-10">
              Use the form to report any technical problem with our school
              systems, portal access, email, fee payments, or any other
              technical issues. Our IT team will get back to you as quickly as
              possible.
            </p>

            <div className="flex flex-col gap-8">
              {supportInfo.map((item) => {
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

            {/* Direct contact fallback */}
            <div className="mt-10 pt-8 border-t border-(--border-sand)">
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta-light mb-2">
                Urgent? Call Us Directly
              </p>
              <p className="font-body text-sm text-(--charcoal-100) opacity-80">
                +234 703 699 9659
              </p>
              <p className="font-body text-xs text-(--charcoal-100) opacity-50 mt-1">
                Available Monday – Friday, 8am – 4pm
              </p>
            </div>
          </div>

          {/* ── Right: form ── */}
          <div>
            <form
              className="flex flex-col gap-16"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* 01 — Your Details */}
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 shrink-0 sm:w-32">
                  <span className="font-heading text-4xl text-terracotta leading-none">
                    01
                  </span>
                  <div className="flex flex-col">
                    <h3 className="font-heading text-lg text-(--charcoal) leading-tight">
                      Your Details
                    </h3>
                    <p className="font-body text-xs text-(--charcoal-100) opacity-60 hidden sm:block">
                      Who are we helping?
                    </p>
                  </div>
                </div>

                <div className="flex-1 border-t sm:border-t-0 sm:border-l border-(--border-sand) pt-8 sm:pt-0 sm:pl-10">
                  <FieldGroup>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Controller
                        name="fullName"
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
                              placeholder="e.g. Mr. Chidi Eze"
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
                        name="userType"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                              htmlFor={field.name}
                              className="font-body text-sm font-medium text-(--charcoal)"
                            >
                              I am a...
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
                                <SelectValue placeholder="Select one" />
                              </SelectTrigger>
                              <SelectContent className="bg-(--warm-white) border-(--border-sand) shadow-lg">
                                {userTypes.map((u) => (
                                  <SelectItem
                                    key={u}
                                    value={u}
                                    className="font-body"
                                  >
                                    {u}
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Controller
                        name="email"
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
                        name="phone"
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
                  </FieldGroup>
                </div>
              </div>

              {/* 02 — The Issue */}
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 shrink-0 sm:w-32">
                  <span className="font-heading text-4xl text-terracotta leading-none">
                    02
                  </span>
                  <div className="flex flex-col">
                    <h3 className="font-heading text-lg text-(--charcoal) leading-tight">
                      The Issue
                    </h3>
                    <p className="font-body text-xs text-(--charcoal-100) opacity-60 hidden sm:block">
                      What&apos;s going wrong?
                    </p>
                  </div>
                </div>

                <div className="flex-1 border-t sm:border-t-0 sm:border-l border-(--border-sand) pt-8 sm:pt-0 sm:pl-10">
                  <FieldGroup>
                    <Controller
                      name="issueType"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor={field.name}
                            className="font-body text-sm font-medium text-(--charcoal)"
                          >
                            Issue Type
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
                              <SelectValue placeholder="Select an issue type" />
                            </SelectTrigger>
                            <SelectContent className="bg-(--warm-white) border-(--border-sand) shadow-lg">
                              {issueTypes.map((issue) => (
                                <SelectItem
                                  key={issue}
                                  value={issue}
                                  className="font-body"
                                >
                                  {issue}
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

                    <Controller
                      name="description"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor={field.name}
                            className="font-body text-sm font-medium text-(--charcoal)"
                          >
                            Describe the Issue
                          </FieldLabel>
                          <Textarea
                            {...field}
                            id={field.name}
                            placeholder="Please describe what is happening, what you have already tried, and any error messages you are seeing..."
                            className="font-body min-h-40 border-(--border-sand) focus-visible:ring-terracotta focus-visible:border-terracotta"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </div>
              </div>

              {/* Submit */}
              <div className="border-t border-(--border-sand) pt-10 flex flex-col items-center gap-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="group w-full sm:w-auto sm:px-12 bg-terracotta hover:bg-(--terracotta-mid) text-white font-body font-semibold tracking-wide py-6 text-base"
                >
                  {isPending ? (
                    <>
                      Submitting...
                      <Loader2 className="animate-spin ml-2 size-4" />
                    </>
                  ) : (
                    <>
                      Submit Support Request
                      <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </Button>
                <p className="font-body text-xs text-(--charcoal-100) opacity-50 text-center">
                  We aim to respond within 4 working hours. Urgent issues are
                  prioritised.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
