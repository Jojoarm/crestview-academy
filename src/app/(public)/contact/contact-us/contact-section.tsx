'use client';

import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowRight, Loader2, Mail, MapPin, Phone, Clock } from 'lucide-react';

import {
  contactSchema,
  ContactSchemaType,
  contactSubjects,
} from '@/lib/schemas/contactSchema';

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

const contactDetails = [
  {
    icon: MapPin,
    label: 'Address',
    lines: ['14, Admiralty Way,', 'Lekki Phase 1, Lagos State', 'Nigeria'],
  },
  {
    icon: Phone,
    label: 'Phone',
    lines: ['+234 801 234 5678'],
  },
  {
    icon: Mail,
    label: 'Email',
    lines: ['info@crestviewacademy.edu.ng'],
  },
  {
    icon: Clock,
    label: 'Office Hours',
    lines: ['Monday – Friday', '8:00am – 4:00pm'],
  },
];

export default function ContactSection() {
  const [isPending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();

  const form = useForm<ContactSchemaType>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      subject: 'Admissions',
      message: '',
    },
  });

  function onSubmit(values: ContactSchemaType) {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      console.log(values);
      toast.success("Message sent! We'll be in touch within one business day.");
      triggerConfetti();
      form.reset();
    });
  }

  return (
    <section className="section-pad bg-(--warm-white)">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 xl:gap-24">
          {/* ── Left: contact details ── */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Get In Touch"
              heading={`We'd Love to\nHear From You`}
            />
            <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80 mb-10">
              Whether you have a question about admissions, fees, school life,
              or just want to find out more about Crestview Academy, our team is
              happy to help.
            </p>

            <div className="flex flex-col gap-8">
              {contactDetails.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-full bg-terracotta-pale flex items-center justify-center">
                      <Icon className="size-5 text-terracotta" />
                    </div>
                    <div>
                      <p className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-terracotta-light mb-1">
                        {item.label}
                      </p>
                      {item.lines.map((line) => (
                        <p
                          key={line}
                          className="font-body text-sm text-(--charcoal-100) opacity-80 leading-relaxed"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
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
                      Who are we speaking with?
                    </p>
                  </div>
                </div>

                <div className="flex-1 border-t sm:border-t-0 sm:border-l border-(--border-sand) pt-8 sm:pt-0 sm:pl-10">
                  <FieldGroup>
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
                            <FieldDescription className="font-body text-xs opacity-60">
                              Optional
                            </FieldDescription>
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

              {/* 02 — Your Message */}
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 shrink-0 sm:w-32">
                  <span className="font-heading text-4xl text-terracotta leading-none">
                    02
                  </span>
                  <div className="flex flex-col">
                    <h3 className="font-heading text-lg text-(--charcoal) leading-tight">
                      Your Message
                    </h3>
                    <p className="font-body text-xs text-(--charcoal-100) opacity-60 hidden sm:block">
                      How can we help?
                    </p>
                  </div>
                </div>

                <div className="flex-1 border-t sm:border-t-0 sm:border-l border-(--border-sand) pt-8 sm:pt-0 sm:pl-10">
                  <FieldGroup>
                    <Controller
                      name="subject"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor={field.name}
                            className="font-body text-sm font-medium text-(--charcoal)"
                          >
                            Subject
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
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent className="bg-(--warm-white) border-(--border-sand) shadow-lg">
                              {contactSubjects.map((s) => (
                                <SelectItem
                                  key={s}
                                  value={s}
                                  className="font-body"
                                >
                                  {s}
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
                      name="message"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor={field.name}
                            className="font-body text-sm font-medium text-(--charcoal)"
                          >
                            Message
                          </FieldLabel>
                          <Textarea
                            {...field}
                            id={field.name}
                            placeholder="Tell us what's on your mind..."
                            className="font-body min-h-36 border-(--border-sand) focus-visible:ring-terracotta focus-visible:border-terracotta"
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
                      Sending...
                      <Loader2 className="animate-spin ml-2 size-4" />
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </Button>
                <p className="font-body text-xs text-(--charcoal-100) opacity-50 text-center">
                  We typically respond within one business day.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
